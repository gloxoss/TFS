/**
 * Root Layout
 * 
 * Minimal layout for the root redirect page.
 * The actual app layouts are in [lng]/ subdirectories.
 */
export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html>
            <body>{children}</body>
        </html>
    )
}
