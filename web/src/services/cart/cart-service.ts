import PocketBase from 'pocketbase';
import { Cart, CartItem, KitTemplate, KitItem, ResolvedKit, ResolvedKitSlot } from '@/types/commerce';
import { Product } from '@/services/products/types';
import { PB_URL } from '@/lib/pocketbase/config';
import { createServiceLogger } from '@/lib/logger';
import { escapePBFilter } from '@/lib/security';

const log = createServiceLogger('CartService');

export class CartService {
  private pb: PocketBase;

  constructor(pbClient: PocketBase) {
    this.pb = pbClient;
  }

  // 1. THE TRIGGER: Check if product has a kit template
  async checkBundleRequirement(productId: string): Promise<{ hasBundle: boolean; template?: KitTemplate; slots?: any[] }> {
    try {
      log.debug('Checking bundle requirement', { productId });
      // Find a template where this product is the "Main Trigger"
      const template = await this.pb.collection('kit_templates').getFirstListItem(`main_product_id="${escapePBFilter(productId)}"`);
      log.debug('Template found', { templateId: template?.id, name: template?.name });

      if (!template) {
        log.debug('No template found');
        return { hasBundle: false };
      }

      // Fetch kit_slots for this template (NEW: category-based slots)
      const slots = await this.pb.collection('kit_slots').getFullList({
        filter: `template_id="${escapePBFilter(template.id)}"`
      });
      log.debug('Found kit slots', { count: slots.length });

      return {
        hasBundle: true,
        template: {
          id: template.id,
          name: template.name,
          main_product_id: template.main_product_id,
          base_price_modifier: template.base_price_modifier,
        },
        slots: slots.map(record => ({
          id: record.id,
          category_id: record.category_id,
          slot_name: record.slot_name,
          recommended_ids: record.recommended_ids || [], // JSON array of product IDs
          display_order: record.display_order
        }))
      };
    } catch (e: any) {
      // 404 means no bundle found, which is fine
      log.debug('Error/404 (expected)', { message: e?.message });
      return { hasBundle: false };
    }
  }

  // 1b. RESOLVE KIT: Convert DB structure to UI-friendly ResolvedKit (Category-Based)
  async resolveKit(productId: string, lang: string = 'en'): Promise<ResolvedKit | null> {
    log.debug('Resolving kit', { productId, lang });
    const bundleCheck = await this.checkBundleRequirement(productId);
    log.debug('Bundle check result', { hasBundle: bundleCheck.hasBundle, slotCount: bundleCheck.slots?.length });

    if (!bundleCheck.hasBundle || !bundleCheck.template || !bundleCheck.slots) {
      log.debug('No bundle found, returning null');
      return null;
    }

    // Get the main product (PUBLIC fields only - no pricing)
    let mainProduct: Product;
    try {
      const record = await this.pb.collection('equipment').getOne(productId);
      const name = lang === 'fr' ? (record.name_fr || record.name) : (record.name_en || record.name);
      mainProduct = {
        id: record.id,
        name,
        nameEn: record.name_en || record.name,
        nameFr: record.name_fr || record.name,
        slug: record.slug,
        categoryId: record.category,
        isAvailable: (record.stock_available || record.stock || 0) > 0,
        imageUrl: record.images?.[0]
          ? `${PB_URL}/api/files/equipment/${record.id}/${record.images[0]}`
          : record.image
            ? `${PB_URL}/api/files/equipment/${record.id}/${record.image}`
            : undefined,
      };
    } catch {
      return null;
    }

    // Build resolved slots from category-based kit_slots in PARALLEL
    const slotPromises = bundleCheck.slots.map(async (slot) => {
      // Get ALL products from this category
      // IMPORTANT: Use unique requestKey to prevent PocketBase auto-cancellation
      // Build filter for single or multiple categories
      let categoryFilter = '';
      if (Array.isArray(slot.category_id) && slot.category_id.length > 0) {
        // Handle multi-relation (array of IDs)
        categoryFilter = '(' + slot.category_id.map((id: string) => `category="${id}"`).join(' || ') + ')';
      } else if (typeof slot.category_id === 'string' && slot.category_id.includes(',')) {
        // Handle comma-separated string (legacy/manual)
        const ids = slot.category_id.split(',').map((s: string) => s.trim());
        categoryFilter = '(' + ids.map((id: string) => `category="${id}"`).join(' || ') + ')';
      } else if (slot.category_id) {
        // Handle single ID
        categoryFilter = `category="${slot.category_id}"`;
      } else {
        // Fallback: No category? (Shouldn't happen for valid slot)
        categoryFilter = 'category!=""';
      }

      // Get ALL products from these categories
      // IMPORTANT: Use unique requestKey to prevent PocketBase auto-cancellation
      const categoryProducts = await this.pb.collection('equipment').getFullList({
        filter: categoryFilter,
        expand: 'variants',
        requestKey: `kit-slot-${slot.id}` // Unique key prevents auto-cancellation
      });

      // Map to Product objects
      const availableOptions: Product[] = categoryProducts.map(record => this._mapRecordToProduct(record, lang));

      // Create KitItem objects for recommended products (for defaultItems/selectedItems)
      const recommendedIds = slot.recommended_ids || [];
      const defaultItems: KitItem[] = recommendedIds.map((pid: string) => ({
        id: `${slot.id}-${pid}`,
        product_id: pid,
        is_mandatory: false,
        is_recommended: true,
        default_quantity: 1,
        slot_name: slot.slot_name,
      }));

      const resolvedSlot: ResolvedKitSlot = {
        slotName: slot.slot_name,
        required: false,
        allowMultiple: true,
        defaultItems,
        selectedItems: defaultItems, // Pre-select recommended
        availableOptions
      };

      return resolvedSlot;
    });

    const resolvedSlots = await Promise.all(slotPromises);

    // Sort slots by display_order
    resolvedSlots.sort((a, b) => {
      const slotA = bundleCheck.slots!.find(s => s.slot_name === a.slotName);
      const slotB = bundleCheck.slots!.find(s => s.slot_name === b.slotName);
      return (slotA?.display_order || 0) - (slotB?.display_order || 0);
    });

    return {
      template: bundleCheck.template,
      mainProduct,
      slots: resolvedSlots,
    };
  }

  private _mapRecordToProduct(record: any, lang: string = 'en'): Product {
    const name = lang === 'fr' ? (record.name_fr || record.name) : (record.name_en || record.name);
    return {
      id: record.id,
      name,
      nameEn: record.name_en || record.name,
      nameFr: record.name_fr || record.name,
      slug: record.slug,
      categoryId: record.category,
      isAvailable: (record.stock_available || record.stock || 1) > 0,
      imageUrl: record.images?.[0]
        ? `${PB_URL}/api/files/equipment/${record.id}/${record.images[0]}`
        : record.image
          ? `${PB_URL}/api/files/equipment/${record.id}/${record.image}`
          : undefined,
      variantOptions: record.variant_options ? (
        typeof record.variant_options === 'string'
          ? JSON.parse(record.variant_options)
          : record.variant_options
      ) : undefined,
      variants: (record.expand?.variants && Array.isArray(record.expand.variants))
        ? record.expand.variants.map((v: any) => {
          const vName = lang === 'fr' ? (v.name_fr || v.name) : (v.name_en || v.name);
          return {
            id: v.id,
            name: vName,
            nameEn: v.name_en || v.name,
            nameFr: v.name_fr || v.name,
            slug: v.slug,
            categoryId: v.category,
            isAvailable: true,
            imageUrl: v.images?.[0]
              ? `${PB_URL}/api/files/equipment/${v.id}/${v.images[0]}`
              : undefined
          };
        })
        : undefined
    };
  }

  // 2. THE ACTION: Add a "Smart Group" to cart
  async addBundleToCart(userId: string, selections: { productId: string; quantity: number, kitSelections?: any }[], dates: { start: Date; end: Date }) {
    // A. Get or Create Cart
    const cartId = await this.getOrCreateCartId(userId);

    // B. Fetch existing items to check for duplicates (Optimization)
    const existingItems = await this.pb.collection('cart_items').getFullList({
      filter: `cart = "${escapePBFilter(cartId)}"`
    });

    // C. Process selections
    // We use a Promise.all to add them "simultaneously"
    const promises = selections.map(async (item) => {
      // Check for exact match: Product + Dates + KitSelections
      // Note: We are stricter with dates string comparison
      const startDateStr = dates.start.toISOString();
      const endDateStr = dates.end.toISOString();
      const itemKitSelectionsStr = item.kitSelections ? JSON.stringify(item.kitSelections) : null;

      const duplicate = existingItems.find(exist =>
        exist.product === item.productId &&
        exist.dates?.start === startDateStr &&
        exist.dates?.end === endDateStr &&
        exist.kit_selections === itemKitSelectionsStr // Compare JSON strings for equality
      );

      if (duplicate) {
        // UPDATE existing item
        const newQty = (duplicate.quantity || 0) + item.quantity;
        return this.pb.collection('cart_items').update(duplicate.id, {
          quantity: newQty
        });
      } else {
        // CREATE new item
        // Only generate group ID for new items if they are being added as a set? 
        // Actually, if we merge, we might lose the "Group" identity if we merge into an old group.
        // But for storage optimization, merging is preferred.
        // We will generate a new group ID for the *batch* of new items, effectively.
        // But if we merge, we don't use it.
        const groupId = crypto.randomUUID(); // This ID is shared by new items in this batch only

        return this.pb.collection('cart_items').create({
          cart: cartId,
          product: item.productId,
          quantity: item.quantity,
          group_id: groupId,
          dates: {
            start: startDateStr,
            end: endDateStr
          },
          kit_selections: itemKitSelectionsStr
        });
      }
    });

    await Promise.all(promises);
    return { success: true }; // Removed groupId return as it's ambiguous with merging
  }

  // Helper: Get active cart
  private async getOrCreateCartId(userId: string): Promise<string> {
    try {
      const cart = await this.pb.collection('carts').getFirstListItem(`user="${userId}" && status="active"`);
      return cart.id;
    } catch {
      const newCart = await this.pb.collection('carts').create({
        user: userId,
        status: 'active'
      });
      return newCart.id;
    }
  }

  // 3. FETCH: Get Cart with Hierarchy
  async getCart(userId: string): Promise<Cart | null> {
    try {
      const cartRecord = await this.pb.collection('carts').getFirstListItem(`user="${escapePBFilter(userId)}" && status="active"`);
      const items = await this.pb.collection('cart_items').getFullList({
        filter: `cart="${cartRecord.id}"`,
        expand: 'product',
        sort: 'group_id,created' // Group items together visually
      });

      return {
        id: cartRecord.id,
        user_id: cartRecord.user,
        status: cartRecord.status,
        items: items.map(item => ({
          id: item.id,
          product: item.expand?.product,
          quantity: item.quantity,
          group_id: item.group_id,
          dates: {
            start: new Date(item.dates.start),
            end: new Date(item.dates.end)
          }
        })) as CartItem[]
      };
    } catch {
      return null;
    }
  }
  // 4. ADD SINGLE ITEM (Wrapper for simplified usage)
  async addItem(productId: string, quantity: number, dates?: { start: string; end: string }, kitSelections?: any) {
    // If we have dates, use them, otherwise defaults
    const validDates = dates ?
      { start: new Date(dates.start), end: new Date(dates.end) } :
      { start: new Date(), end: new Date(Date.now() + 86400000) };

    // We can use addBundleToCart for a single item too
    // Ideally we get userId from authStore
    const userId = this.pb.authStore.model?.id;
    if (!userId) throw new Error("User not authenticated");

    return this.addBundleToCart(userId, [{ productId, quantity }], validDates);
  }
}