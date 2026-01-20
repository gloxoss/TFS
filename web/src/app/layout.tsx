import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'TFS Equipment Rentals',
    description: 'Professional Cinema Equipment Rentals',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body suppressHydrationWarning>{children}</body>
        </html>
    )
}
