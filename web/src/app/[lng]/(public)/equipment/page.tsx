/**
 * Equipment Catalog Page (Server Component)
 * 
 * Server-side data fetching for initial products and categories.
 * Passes data to client component for interactive filtering.
 */

import { productService } from '@/services'
import { EquipmentCatalogClient } from './equipment-client'

interface EquipmentPageProps {
  params: Promise<{ lng: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function EquipmentPage({ params, searchParams }: EquipmentPageProps) {
  const { lng } = await params
  const resolvedSearchParams = await searchParams
  const { category, search, page } = resolvedSearchParams

  // Parse dynamic attribute filters (prefix: spec_)
  const specs: Record<string, string | string[]> = {}
  Object.entries(resolvedSearchParams).forEach(([key, value]) => {
    if (key.startsWith('spec_') && value) {
      const slug = key.replace('spec_', '')
      specs[slug] = value
    }
  })

  // Get the product service
  const service = productService()

  // Fetch initial data server-side (including attributes for filters)
  const [productsResult, categories, attributes] = await Promise.all([
    service.getProducts(
      {
        categorySlug: typeof category === 'string' ? category : undefined,
        search: typeof search === 'string' ? search : undefined,
        specs, // Pass dynamic specs filters
      },
      parseInt(typeof page === 'string' ? page : '1', 10),
      12
    ),
    service.getCategories(),
    service.getAttributes(), // Fetch all attributes for filters
  ])

  return (
    <EquipmentCatalogClient
      lng={lng}
      initialProducts={productsResult.items}
      initialPagination={{
        page: productsResult.page,
        totalPages: productsResult.totalPages,
        totalItems: productsResult.totalItems,
      }}
      categories={categories}
      attributes={attributes}
      initialCategory={typeof category === 'string' ? category : null}
      initialSearch={typeof search === 'string' ? search : ''}
    />
  )
}

export async function generateMetadata({ params }: EquipmentPageProps) {
  const { lng } = await params

  const titles: Record<string, string> = {
    en: 'Equipment Catalog | TFS Cinema Rental',
    fr: 'Catalogue d\'équipement | TFS Location Cinéma',
  }

  const descriptions: Record<string, string> = {
    en: 'Browse our professional cinema equipment catalog. Cameras, lenses, lighting, and more available for rent.',
    fr: 'Parcourez notre catalogue d\'équipement cinéma professionnel. Caméras, objectifs, éclairage et plus disponibles à la location.',
  }

  return {
    title: titles[lng] || titles.en,
    description: descriptions[lng] || descriptions.en,
  }
}
