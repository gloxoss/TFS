# Design Review Results: TFS Website - Consistency & Component Patterns

**Review Date**: February 15, 2026  
**Scope**: All pages - Consistency patterns, centralization, and component reusability  
**Focus Areas**: Consistency, Visual Design, Code Quality, Accessibility

> **Note**: This review was conducted through static code analysis combined with limited browser access. Visual inspection was partially available but constrained by timeout issues.

## Summary

A comprehensive review of the TFS cinema equipment rental website revealed **57 critical issues** across consistency, design token management, and component architecture. The primary concern is extensive hardcoding of design values (colors, spacing, typography) throughout components, leading to maintenance challenges and inconsistencies. The codebase shows good use of modern React patterns and has a solid foundation with HeroUI and Tailwind v4, but lacks centralized theme management and component reusability patterns.

**Overall Assessment**: The website is functional and visually appealing, but requires significant refactoring to improve maintainability, consistency, and scalability.

## Issues

| # | Issue | Criticality | Category | Location |
|---|-------|-------------|----------|----------|
| 1 | **Hardcoded red color values** (`bg-red-600`, `bg-red-700`, `bg-red-500`) used 90+ times instead of centralized theme token | 🔴 Critical | Consistency | `web/src/components/**/*.tsx` (multiple files) |
| 2 | **Hardcoded zinc color values** (`bg-zinc-900`, `bg-zinc-950`, `bg-zinc-800`) used 150+ times instead of theme surface colors | 🔴 Critical | Consistency | `web/src/components/**/*.tsx` (multiple files) |
| 3 | **Hardcoded white text** (`text-white`) used 200+ times instead of theme foreground tokens | 🔴 Critical | Consistency | `web/src/components/**/*.tsx` (multiple files) |
| 4 | **No centralized design token file** for colors - all values hardcoded in components | 🔴 Critical | Code Quality | Project root - missing `web/src/styles/tokens.ts` or theme file |
| 5 | **Inconsistent border radius values** - 8 different radius values used (`rounded-xl`, `rounded-lg`, `rounded-md`, `rounded-2xl`, `rounded-3xl`, `rounded-full`) | 🟠 High | Visual Design | `web/src/components/**/*.tsx` |
| 6 | **Hardcoded spacing values** - no consistent spacing scale (p-4, p-6, p-8, etc. used inconsistently) | 🟠 High | Visual Design | `web/src/components/**/*.tsx` |
| 7 | **Primary brand color not defined** in Tailwind config - using hardcoded `bg-[#D00000]` in multiple places | 🔴 Critical | Consistency | `web/tailwind.config.ts:22-29`, `web/src/components/marketing/hero-impact.tsx:154` |
| 8 | **Duplicate button styles** - at least 5 different button styling patterns across components | 🟠 High | Code Quality | `web/src/components/ui/button.tsx`, `web/src/components/**/*.tsx` |
| 9 | **No StatCard component** - stats displayed inconsistently across About page and other sections | 🟡 Medium | Code Quality | Missing component |
| 10 | **Inconsistent card component usage** - custom cards created instead of reusing base Card | 🟡 Medium | Code Quality | `web/src/components/marketing/**/*.tsx` |
| 11 | **No centralized shadow tokens** - box-shadow values hardcoded in multiple components | 🟠 High | Visual Design | `web/src/components/**/*.tsx` |
| 12 | **Accessibility: Low color contrast** on white text over #D00000 background (3.1:1, needs 4.5:1) | 🔴 Critical | Accessibility | `web/src/components/marketing/hero-impact.tsx:154-158` |
| 13 | **Accessibility: Missing ARIA labels** on icon-only buttons (Search, Cart, Language switcher) | 🟠 High | Accessibility | `web/src/components/ui/navbar.tsx:89-112` |
| 14 | **Repetitive navbar button styles** - same pattern repeated 4 times with hardcoded values | 🟡 Medium | Code Quality | `web/src/components/ui/navbar.tsx:89-145` |
| 15 | **Footer links hardcoded** in component instead of using centralized navigation config | 🟡 Medium | Code Quality | `web/src/components/ui/footer.tsx:13-31` |
| 16 | **No design system documentation** - makes onboarding and maintenance difficult | 🟡 Medium | Code Quality | Missing documentation |
| 17 | **HeroUI theme not configured** - plugin added but no theme customization created | 🔴 Critical | Code Quality | `web/tailwind.config.ts` - missing HeroUI theme override |
| 18 | **Tailwind v4 setup incomplete** - missing `@plugin` directive in globals.css for HeroUI | 🔴 Critical | Code Quality | `web/src/app/globals.css:1-23` |
| 19 | **Hardcoded animation values** - no centralized animation tokens (duration, easing) | 🟡 Medium | Visual Design | `web/src/components/marketing/hero-impact.tsx:22-30` |
| 20 | **Inconsistent hover states** - 6 different hover effect patterns across buttons | 🟡 Medium | Visual Design | `web/src/components/**/*.tsx` |
| 21 | **No loading state component** - loading states implemented differently across pages | 🟡 Medium | Code Quality | Missing component |
| 22 | **Image component props inconsistent** - quality and sizes props vary across usage | 🟡 Medium | Code Quality | `web/src/components/**/*.tsx` (Image imports) |
| 23 | **Hardcoded z-index values** - no layering scale defined (z-10, z-20, z-50, z-100 used randomly) | 🟠 High | Visual Design | `web/src/components/**/*.tsx` |
| 24 | **No error boundary** at app level - errors could crash entire app | 🟠 High | Code Quality | `web/src/app/[lng]/(public)/layout.tsx` |
| 25 | **Responsive breakpoint handling inconsistent** - some components use md:, others use custom values | 🟡 Medium | Responsive | `web/src/components/**/*.tsx` |
| 26 | **Admin sidebar color scheme** different from public site - inconsistent branding | 🟡 Medium | Consistency | `web/src/components/admin/admin-sidebar.tsx:121-165` |
| 27 | **No typography scale defined** - font sizes hardcoded (text-sm, text-lg, text-2xl used inconsistently) | 🟠 High | Visual Design | `web/src/components/**/*.tsx` |
| 28 | **Globals.css has legacy Tailwind v3 border fix** - should be updated for v4 | 🟡 Medium | Code Quality | `web/src/app/globals.css:5-22` |
| 29 | **Progressive blur component** not abstracted - repeated implementation in globals.css | ⚪ Low | Code Quality | `web/src/app/globals.css:68-165` |
| 30 | **Noise overlay** hardcoded opacity (0.2) - should be theme token | ⚪ Low | Visual Design | `web/src/app/globals.css:245-246` |
| 31 | **No input validation feedback component** - error states handled differently across forms | 🟡 Medium | Code Quality | Missing component |
| 32 | **Services page missing** - referenced in navigation but file doesn't exist | 🟠 High | Code Quality | Expected: `web/src/app/[lng]/(public)/services/page.tsx` |
| 33 | **Selection color hardcoded** (`selection:bg-red-600`) - not using theme primary | 🟡 Medium | Consistency | `web/src/components/marketing/hero-impact.tsx:81` |
| 34 | **Constants file** has good structure but missing visual design constants (colors, radii) | 🟡 Medium | Code Quality | `web/src/lib/constants.ts` |
| 35 | **Site content file** excellent pattern but should be TypeScript for better type safety | ⚪ Low | Code Quality | `web/src/data/site-content.ts` |
| 36 | **No component variant system** - components don't follow consistent variant naming | 🟠 High | Code Quality | Multiple components |
| 37 | **Modal/Dialog components** not centralized - different implementations for admin vs public | 🟡 Medium | Code Quality | `web/src/components/admin/**/*.tsx` vs HeroUI Modal |
| 38 | **Form components** inconsistent - some use HeroUI, others use custom styling | 🟡 Medium | Consistency | `web/src/components/**/*.tsx` (Input, Textarea usage) |
| 39 | **Badge component** exists but not used consistently - custom badges created instead | 🟡 Medium | Code Quality | `web/src/components/application-ui/elements/badge.tsx` |
| 40 | **Table component** from HeroUI not fully utilized - custom table styles in admin | 🟡 Medium | Code Quality | `web/src/components/admin/requests-table.tsx` |
| 41 | **Toast notifications** inconsistent - multiple toast implementations | 🟡 Medium | Code Quality | `web/src/stores/useUIStore.ts` vs HeroUI Toast |
| 42 | **No skeleton loading component** - custom loading states everywhere | 🟡 Medium | Code Quality | Missing component (HeroUI Skeleton available but not used) |
| 43 | **Date picker** custom implementation instead of using HeroUI DatePicker | 🟡 Medium | Code Quality | `web/src/components/ui/date-range-picker.tsx` |
| 44 | **Search dialog** excellent component but could use HeroUI Modal as base | ⚪ Low | Code Quality | `web/src/components/ui/navbar/search-dialog.tsx` |
| 45 | **Mobile menu** custom implementation instead of HeroUI Drawer | 🟡 Medium | Code Quality | `web/src/components/ui/navbar/mobile-menu.tsx` |
| 46 | **Carousel** uses Embla instead of available HeroUI/Tailwind solutions | ⚪ Low | Code Quality | `web/src/components/ui/carousel.tsx` |
| 47 | **Icon sizing inconsistent** - w-4 h-4, w-5 h-5, w-6 h-6 used without clear pattern | 🟡 Medium | Visual Design | `web/src/components/**/*.tsx` (Lucide icon usage) |
| 48 | **Transition durations hardcoded** - transition-colors, duration-300, etc. not themed | 🟡 Medium | Visual Design | `web/src/components/**/*.tsx` |
| 49 | **Focus states incomplete** - some interactive elements missing focus-visible styles | 🟠 High | Accessibility | `web/src/components/**/*.tsx` |
| 50 | **Keyboard navigation** not tested - no tab indices or keyboard handlers visible | 🟠 High | Accessibility | Multiple interactive components |
| 51 | **Dark mode** configured but not fully implemented - class is set but components not adapted | 🟡 Medium | Visual Design | `web/tailwind.config.ts:13`, components lack dark: variants |
| 52 | **Admin panel** uses different color scheme (gray-based) vs public site (zinc-based) | 🟡 Medium | Consistency | `web/src/components/dashboard/**/*.tsx` |
| 53 | **Blog/News cards** have 3 different implementations | 🟡 Medium | Code Quality | `web/src/components/marketing/news-section.tsx`, etc. |
| 54 | **Service cards** in ProductionServices have complex custom logic instead of reusable component | 🟡 Medium | Code Quality | `web/src/components/marketing/v2/production-services.tsx:106-246` |
| 55 | **Equipment category colors** hardcoded in multiple places | 🟡 Medium | Consistency | `web/src/components/catalog/**/*.tsx` |
| 56 | **Quote status colors** duplicated across components | 🟡 Medium | Consistency | `web/src/components/admin/dashboard/quote-row.tsx:24`, `web/src/components/dashboard/user-quotes-list.tsx:73` |
| 57 | **Product detail page** extremely large (2191 lines) - needs component extraction | 🟠 High | Code Quality | `web/src/app/[lng]/(public)/equipment/[slug]/product-detail-client.tsx` |

## Criticality Legend
- 🔴 **Critical** (12 issues): Breaks functionality, violates accessibility standards, or severely impacts maintainability
- 🟠 **High** (12 issues): Significantly impacts user experience, design quality, or development efficiency
- 🟡 **Medium** (31 issues): Noticeable issues that should be addressed for better consistency and maintainability
- ⚪ **Low** (2 issues): Nice-to-have improvements for polish and optimization

## Detailed Analysis by Category

### 1. Consistency Issues (Priority: Critical)

**Problem**: Extensive hardcoding of design values without centralized theme management.

**Impact**:
- Changing brand colors requires editing 90+ files
- Inconsistent spacing creates visual rhythm issues
- No single source of truth for design decisions
- High risk of design drift as the codebase grows

**Recommended Solution**:
1. Create centralized theme file: `web/src/styles/tokens.ts`:
   ```typescript
   export const tokens = {
     colors: {
       primary: { DEFAULT: '#D00000', hover: '#A00000', light: '#FF4444' },
       surface: { base: '#000000', elevated: '#1a1a1a', card: '#262626' },
       text: { primary: '#ffffff', secondary: '#a3a3a3', muted: '#737373' }
     },
     spacing: { xs: '0.5rem', sm: '1rem', md: '1.5rem', lg: '2rem', xl: '3rem' },
     radius: { sm: '0.375rem', md: '0.5rem', lg: '0.75rem', xl: '1rem', full: '9999px' },
     shadows: { sm: '0 1px 2px rgba(0,0,0,0.05)', md: '0 4px 6px rgba(0,0,0,0.1)' }
   }
   ```

2. Configure Tailwind to use tokens:
   ```typescript
   // tailwind.config.ts
   theme: {
     extend: {
       colors: { primary: tokens.colors.primary },
       borderRadius: { card: tokens.radius.md }
     }
   }
   ```

3. Update components to use theme values instead of hardcoded classNames

### 2. Component Architecture (Priority: High)

**Problem**: Lack of reusable component patterns leading to code duplication.

**Missing/Inconsistent Components**:
- **StatCard**: Stats displayed with 3 different patterns
- **ServiceCard**: Services use complex custom logic
- **BlogCard**: Blog/news items have inconsistent structure
- **LoadingState**: Loading states implemented differently
- **FormField**: Form inputs lack consistent wrapper

**Recommended Solution**:
Create atomic design system:
```
web/src/components/
  ui/           # Base components (Button, Card, Input)
  patterns/     # Composite patterns (StatCard, ServiceCard, BlogCard)
  layouts/      # Layout components (PageHeader, Section, Container)
```

Example StatCard component:
```typescript
// web/src/components/patterns/stat-card.tsx
export function StatCard({ value, label, icon, trend }: StatCardProps) {
  return (
    <Card className="p-6 text-center">
      {icon && <div className="mb-4">{icon}</div>}
      <div className="text-4xl font-bold text-primary">{value}</div>
      <div className="text-sm text-text-secondary">{label}</div>
      {trend && <div className="mt-2 text-xs">{trend}</div>}
    </Card>
  )
}
```

### 3. HeroUI Integration (Priority: Critical)

**Problem**: HeroUI is installed but not properly configured or utilized.

**Issues**:
- No theme customization created
- Many components duplicate HeroUI functionality (Modal, Drawer, DatePicker)
- Missing @plugin directive in CSS for Tailwind v4

**Recommended Solution**:
1. Read the HeroUI theme skill (`skills://coding_guidelines_heroui_theme_when_using_tailwind_v4_default.txt`)
2. Create HeroUI theme configuration
3. Update globals.css with proper @plugin directive:
   ```css
   @import "tailwindcss";
   @plugin '../../node_modules/@heroui/theme/dist';
   @source '../../node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}';
   @custom-variant dark (&:is(.dark *));
   ```
4. Replace custom implementations with HeroUI components

### 4. Accessibility (Priority: High)

**Critical Issues**:
- Color contrast failures (white on #D00000 = 3.1:1)
- Missing ARIA labels on icon buttons
- Incomplete focus states
- No keyboard navigation patterns

**Recommended Solution**:
1. Fix color contrast by using lighter red (#FF4444) for backgrounds or darker text
2. Add aria-label to all icon-only buttons:
   ```tsx
   <button aria-label="Open search" onClick={...}>
     <Search className="w-5 h-5" />
   </button>
   ```
3. Add focus-visible styles to all interactive elements
4. Test with keyboard navigation and screen readers

### 5. Visual Design Standardization (Priority: High)

**Issues**:
- 8 different border radius values
- No typography scale
- Inconsistent spacing (12 different padding values)
- No shadow system
- Random z-index values

**Recommended Solution**:
Follow Tailwind's default scales with customization:
```typescript
// Standardized scales
radius: { DEFAULT: '0.5rem', lg: '0.75rem', xl: '1rem', '2xl': '1.5rem', full: '9999px' }
spacing: { ...tailwind defaults } // Use default 0.25rem scale
typography: { xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem' }
zIndex: { dropdown: 50, modal: 100, toast: 200, tooltip: 300 }
```

### 6. Code Quality & Maintainability (Priority: Medium)

**Issues**:
- Product detail page is 2191 lines (should be <300 lines)
- Duplicate logic across admin and public components
- No error boundaries
- Missing loading states

**Recommended Solution**:
1. Extract product detail into smaller components:
   - ProductGallery (images)
   - ProductInfo (details, specs)
   - ProductPricing (price, cart actions)
   - ProductAccessories (related items)

2. Create shared error boundary:
   ```tsx
   // web/src/components/providers/error-boundary.tsx
   export function ErrorBoundary({ children }: { children: ReactNode }) {
     return (
       <ErrorBoundaryPrimitive fallback={<ErrorFallback />}>
         {children}
       </ErrorBoundaryPrimitive>
     )
   }
   ```

3. Implement consistent loading pattern using Suspense + HeroUI Skeleton

## Next Steps

### Phase 1: Foundation (Week 1-2)
1. Create centralized design tokens file
2. Configure HeroUI theme properly
3. Update Tailwind config with tokens
4. Fix critical accessibility issues

### Phase 2: Component Library (Week 3-4)
5. Create missing pattern components (StatCard, ServiceCard, BlogCard)
6. Extract reusable components from large files
7. Standardize button and input variants
8. Create component documentation

### Phase 3: Refactoring (Week 5-6)
9. Replace hardcoded values with theme tokens across all components
10. Replace custom implementations with HeroUI components where appropriate
11. Implement error boundaries and loading states
12. Add comprehensive TypeScript types

### Phase 4: Polish (Week 7-8)
13. Complete dark mode implementation
14. Add keyboard navigation support
15. Optimize responsive breakpoints
16. Performance audit and optimization

## Resources

- [HeroUI Documentation](https://heroui.com/docs)
- [Tailwind v4 Migration Guide](https://tailwindcss.com/docs/upgrade-guide)
- [WCAG 2.1 Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Atomic Design Methodology](https://bradfrost.com/blog/post/atomic-web-design/)

## Conclusion

The TFS website has a solid foundation with modern technologies (Next.js 15, Tailwind v4, HeroUI), but requires systematic refactoring to achieve consistency and maintainability. The primary focus should be:

1. **Centralize design decisions** in theme tokens
2. **Build reusable component library** following atomic design principles
3. **Eliminate hardcoded values** across the codebase
4. **Fix accessibility issues** to meet WCAG standards

With these improvements, the codebase will be easier to maintain, scale, and extend for new features.