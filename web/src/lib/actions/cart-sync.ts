/**
 * Cart Synchronization Actions
 * 
 * Server actions for syncing cart between localStorage and database
 * for authenticated users. Provides seamless cross-device cart persistence.
 */
'use server'

import { createServerClient } from '@/lib/pocketbase/server'
import { CartItem } from '@/stores/useCartStore'
import { createActionLogger } from '@/lib/logger'

const log = createActionLogger('CartSync')

/**
 * Save cart to database (authenticated users only)
 * Called by client with debounce to reduce DB writes
 */
export async function saveCartToDatabase(items: CartItem[]): Promise<{
    success: boolean
    error?: string
}> {
    try {
        const pb = await createServerClient()

        if (!pb.authStore.isValid) {
            return { success: false, error: 'Not authenticated' }
        }

        const userId = pb.authStore.model?.id

        log.debug('Saving cart to database', { userId, itemCount: items.length })

        // 1. Get or Create Cart ID for the user
        let cartId: string;
        try {
            const cart = await pb.collection('carts').getFirstListItem(`user = "${userId}" && status = "active"`);
            cartId = cart.id;
        } catch {
            const newCart = await pb.collection('carts').create({
                user: userId,
                status: 'active'
            });
            cartId = newCart.id;
        }

        // 2. Delete existing items for this specific cart
        // OPTIMIZATION: In the future, we could diff update, but for now strict sync is safer
        const existing = await pb.collection('cart_items').getFullList({
            filter: `cart = "${cartId}"`
        });

        const deletePromises = existing.map(item => pb.collection('cart_items').delete(item.id));
        await Promise.all(deletePromises);

        // 3. Insert new items linked to the cart
        const createPromises = items.map(item => pb.collection('cart_items').create({
            cart: cartId, // Correctly link to cart
            product: item.product.id,
            quantity: item.quantity,
            group_id: item.groupId, // Persist grouping
            dates: item.dates,
            kit_selections: item.kitSelections ? JSON.stringify(item.kitSelections) : null,
        }));

        await Promise.all(createPromises);

        log.info('Cart saved successfully', { itemCount: items.length })
        return { success: true }
    } catch (error: any) {
        log.error('Cart save failed', error, { itemCount: items.length })
        return { success: false, error: 'Failed to save cart' }
    }
}

/**
 * Load cart from database for authenticated user
 * Returns empty array if not authenticated or on error
 */
export async function loadCartFromDatabase(): Promise<{
    success: boolean
    items: CartItem[]
    error?: string
}> {
    try {
        const pb = await createServerClient()

        if (!pb.authStore.isValid) {
            return { success: false, items: [], error: 'Not authenticated' }
        }

        const userId = pb.authStore.model?.id

        log.debug('Loading cart from database', { userId })

        // 1. Find the active cart
        let cartId: string;
        try {
            const cart = await pb.collection('carts').getFirstListItem(`user = "${userId}" && status = "active"`);
            cartId = cart.id;
        } catch {
            // No active cart, return empty
            return { success: true, items: [] };
        }

        // 2. Fetch items for this cart
        const records = await pb.collection('cart_items').getFullList({
            filter: `cart = "${cartId}"`,
            expand: 'product',
            sort: 'group_id,created'
        })

        const items: CartItem[] = records.map(record => ({
            id: record.id, // Keep DB ID
            product: {
                id: record.expand?.product?.id || record.product,
                name: record.expand?.product?.name_en || record.expand?.product?.name || '',
                nameEn: record.expand?.product?.name_en || '',
                nameFr: record.expand?.product?.name_fr || '',
                slug: record.expand?.product?.slug || '',
                imageUrl: record.expand?.product?.image_url,
                categoryId: record.expand?.product?.category || '',
                isAvailable: record.expand?.product?.is_available ?? true,
                category: record.expand?.product?.expand?.category,
            },
            quantity: record.quantity || 1,
            dates: record.dates || {
                start: new Date().toISOString(),
                end: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
            },
            groupId: record.group_id, // Restore group ID
            kitSelections: record.kit_selections ? JSON.parse(record.kit_selections) : undefined,
        }))

        log.info('Cart loaded successfully', { itemCount: items.length })
        return { success: true, items }
    } catch (error: any) {
        log.error('Cart load failed', error)
        return { success: false, items: [], error: 'Failed to load cart' }
    }
}

/**
 * Clear cart from database
 */
export async function clearCartFromDatabase(): Promise<{
    success: boolean
    error?: string
}> {
    try {
        const pb = await createServerClient()

        if (!pb.authStore.isValid) {
            return { success: false, error: 'Not authenticated' }
        }

        const userId = pb.authStore.model?.id

        log.debug('Clearing cart from database', { userId })

        let cartId: string;
        try {
            const cart = await pb.collection('carts').getFirstListItem(`user = "${userId}" && status = "active"`);
            cartId = cart.id;
        } catch {
            // If no cart, nothing to clear
            return { success: true }
        }

        const existing = await pb.collection('cart_items').getFullList({
            filter: `cart = "${cartId}"`
        })

        const deletePromises = existing.map(item => pb.collection('cart_items').delete(item.id));
        await Promise.all(deletePromises);

        // Optional: We could also update cart status to abandoned instead of deleting items, but for now strict clear

        log.info('Cart cleared from database')
        return { success: true }
    } catch (error: any) {
        log.error('Cart clear failed', error)
        return { success: false, error: 'Failed to clear cart' }
    }
}
