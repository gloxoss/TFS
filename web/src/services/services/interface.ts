/**
 * Services Interface
 * 
 * Types for the services collection used in the homepage grid and detail pages.
 */

// Section types for structured content
export interface ServiceSection {
    type: 'text_image' | 'text_only' | 'image_only' | 'features' | 'hero_slider' | 'text_image_bg' | 'downloads_categorized' | 'partners_svg' | 'video_featured'
    layout?: 'left' | 'right'
    title?: string
    titleFr?: string
    description?: string // Added for hero_slider
    content?: string
    contentFr?: string
    image?: string
    images?: string[] // Added for sliders/galleries
    video_url?: string // Added for video sections
    status?: 'coming_soon' | 'active' // Added for video sections
    categories?: { // Added for downloads_categorized
        category: string
        items: {
            title: string
            file: string
        }[]
    }[]
    items?: {
        title: string
        titleFr?: string
        description?: string
        descriptionFr?: string
        icon?: string
    }[]
}

export interface ServiceStat {
    value: string
    valueFr?: string
    label: string
    labelFr?: string
}

export interface ServiceFeature {
    title: string
    titleFr?: string
    description?: string
    descriptionFr?: string
    icon?: string
}

export interface ServiceDownload {
    title: string
    titleFr?: string
    url: string
    category?: string
    categoryFr?: string
}

export interface Service {
    id: string
    title: string
    titleFr?: string
    slug: string
    icon?: string
    briefDescription?: string
    briefDescriptionFr?: string
    fullDescription?: string
    fullDescriptionFr?: string
    type: 'internal_link' | 'content_page'
    targetUrl?: string
    images?: string[]
    heroImage?: string
    sections?: ServiceSection[]
    stats?: ServiceStat[]
    tags?: string[]
    features?: ServiceFeature[]
    template?: 'default' | 'showcase' | 'hub' | 'hub_alt' | 'digital_production'
    sliderImages?: string[]
    videoUrl?: string
    downloads?: ServiceDownload[]
    subServices?: string[]  // Array of child service slugs for hub template
    displayOrder: number
    isActive: boolean
    created: string
    updated: string
}

export interface IServicesService {
    getServices(): Promise<Service[]>
    getServiceBySlug(slug: string): Promise<Service | null>
}
