import type { ReactNode } from "react";

/**
 * Root Layout
 * 
 * This is the minimal root layout required by Next.js App Router.
 * The main layout with providers, fonts, and styling is in [lng]/layout.tsx
 * 
 * This layout only handles the root page.tsx redirect.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
