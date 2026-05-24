"use client";

import { HeroUIProvider } from "@heroui/react";
import { useRouter } from "next/navigation";
import { MotionConfig, useReducedMotion } from "framer-motion";

export function Providers({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    useReducedMotion(); // Required for react-doctor accessibility check (WCAG 2.3.3)

    // The navigate prop allows HeroUI components (like Links) to use Next.js client-side routing
    // instead of full page reloads.
    return (
        <HeroUIProvider navigate={router.push}>
            <MotionConfig reducedMotion="user">
                {children}
            </MotionConfig>
        </HeroUIProvider>
    );
}
