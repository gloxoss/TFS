import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/pocketbase/server'
import { getServicesService } from '@/services/services/pocketbase-service'
import ServiceDetailClient from './service-client'

export const revalidate = 0

interface PageProps {
    params: Promise<{ lng: string; slug: string }>
}

async function getService(slug: string) {
    const pb = await createServerClient()
    const servicesService = getServicesService(pb)
    return servicesService.getServiceBySlug(slug)
}

async function getSubServices(slugs: string[]) {
    const pb = await createServerClient()
    const servicesService = getServicesService(pb)
    const allServices = await servicesService.getServices()
    return allServices.filter(s => slugs.includes(s.slug))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug, lng } = await params
    const service = await getService(slug)

    if (!service) {
        return {
            title: 'Service Not Found',
        }
    }

    const title = lng === 'fr' && service.titleFr ? service.titleFr : service.title
    const description = lng === 'fr' && service.briefDescriptionFr
        ? service.briefDescriptionFr
        : service.briefDescription

    return {
        title: `${title} | TFS`,
        description: description || `Learn more about our ${title} services.`,
    }
}

export default async function ServicePage({ params }: PageProps) {
    const { slug, lng } = await params
    const service = await getService(slug)

    if (!service) {
        notFound()
    }

    // If this is an internal_link type, redirect to the target URL
    if (service.type === 'internal_link' && service.targetUrl) {
        const { redirect } = await import('next/navigation')
        redirect(service.targetUrl)
    }

    // Fetch sub-services for hub templates (both 'hub' and 'hub_alt')
    let subServices = undefined
    if ((service.template === 'hub' || service.template === 'hub_alt') && service.subServices && service.subServices.length > 0) {
        subServices = await getSubServices(service.subServices)
    }

    // Custom Template for Digital Production
    if (service.slug === 'digital-production' || service.slug === 'digital-corporate') {
        const DigitalProductionPage = (await import('@/components/features/digital-production/DigitalProductionPage')).default
        return <DigitalProductionPage service={service} lng={lng} />;
    }

    if (service.slug === 'broadcasting-live') {
        const { BroadcastPage } = await import('@/components/features/broadcast/BroadcastPage')
        return <BroadcastPage service={service} locale={lng} />;
    }

    // Default: generic service detail page
    return <ServiceDetailClient service={service} lng={lng} subServices={subServices} />;
}
