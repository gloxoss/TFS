/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    // Update Broadcasting service: 3 stats + 3 sections
    try {
        const broadcasting = app.findFirstRecordByFilter("services", `slug="broadcasting-live"`);
        if (broadcasting) {
            broadcasting.set("stats", [
                { label: "Live Events", labelFr: "Événements Live", value: "500+" },
                { label: "Uptime", labelFr: "Disponibilité", value: "99.9%" },
                { label: "Cameras", labelFr: "Caméras", value: "Multi-Cam" }
            ]);
            broadcasting.set("sections", [
                {
                    type: "text_image", layout: "right", image: "/images/services/broadcasting/multicam.jpg",
                    title: "Live Capture & Multi-Camera Production",
                    titleFr: "Captation Live & Production Multi-Caméra",
                    content: "TFS deploys professional broadcast camera systems suitable for studio and on-location environments. Our setups support multi-camera configurations, enabling dynamic coverage and real-time storytelling for live television and streaming platforms.",
                    contentFr: "TFS déploie des systèmes de caméras broadcast professionnels adaptés aux studios et aux tournages en extérieur. Nos configurations supportent le multi-caméras pour une couverture dynamique."
                },
                {
                    type: "text_image", layout: "left", image: "/images/services/broadcasting/streaming.jpg",
                    title: "Live Streaming & Transmission",
                    titleFr: "Streaming en Direct & Transmission",
                    content: "TFS specializes in live streaming and broadcast transmission workflows adapted to both local and international distribution, ensuring continuity, low latency, and uninterrupted transmission.",
                    contentFr: "TFS se spécialise dans les flux de streaming en direct et de transmission broadcast adaptés à la distribution locale et internationale, assurant continuité et faible latence."
                },
                {
                    type: "text_image", layout: "right", image: "/images/services/broadcasting/control-room.jpg",
                    title: "Broadcast Control & Signal Management",
                    titleFr: "Régie & Gestion du Signal",
                    content: "Our broadcast control solutions include vision mixing, graphics integration, and signal routing to ensure seamless live production. TFS provides experienced technicians and modern equipment for events of any scale.",
                    contentFr: "Nos solutions de régie broadcast incluent le mélange vidéo, l'intégration graphique et le routage de signal pour assurer une production live fluide. TFS fournit des techniciens expérimentés et du matériel moderne."
                }
            ]);
            app.save(broadcasting);
            console.log("Updated: Broadcasting & Live Transmission");
        }
    } catch (e) {
        console.log("Broadcasting service not found, skipping");
    }

    // Update Digital Production service: 3 stats + 3 sections
    try {
        const digital = app.findFirstRecordByFilter("services", `slug="digital-production-marketing"`);
        if (digital) {
            digital.set("stats", [
                { label: "Content Hours", labelFr: "Heures de Contenu", value: "1000+" },
                { label: "Platforms", labelFr: "Plateformes", value: "All" },
                { label: "Optimization", labelFr: "Optimisation", value: "SEO/Social" }
            ]);
            digital.set("sections", [
                {
                    type: "text_image", layout: "right", image: "/images/services/digital/content-creation.jpg",
                    title: "Digital Filming & Content Production",
                    titleFr: "Tournage Numérique & Production de Contenu",
                    content: "TFS provides high-end filming solutions for digital platforms, branded content, corporate communication, events, and live productions. Our team handles multi-camera filming ensuring visual consistency and high-quality output.",
                    contentFr: "TFS fournit des solutions de tournage haut de gamme pour les plateformes numériques, le contenu de marque et la communication d'entreprise. Notre équipe gère le tournage multi-caméras."
                },
                {
                    type: "text_image", layout: "left", image: "/images/services/digital/marketing.jpg",
                    title: "Digital Marketing & Online Visibility",
                    titleFr: "Marketing Numérique & Visibilité en Ligne",
                    content: "TFS integrates digital marketing solutions to amplify the impact of produced content. This includes campaign-oriented content delivery, platform-ready video formats, and strategic distribution aligned with client objectives.",
                    contentFr: "TFS intègre des solutions de marketing numérique pour amplifier l'impact du contenu produit. Cela inclut la livraison de contenu orientée campagne et la distribution stratégique."
                },
                {
                    type: "text_image", layout: "right", image: "/images/services/digital/analytics.jpg",
                    title: "Performance Analytics & Reporting",
                    titleFr: "Analyse de Performance & Reporting",
                    content: "TFS provides detailed analytics and reporting on digital content performance, helping clients understand audience engagement and optimize future campaigns for maximum impact.",
                    contentFr: "TFS fournit des analyses détaillées et des rapports sur la performance du contenu digital, aidant les clients à comprendre l'engagement de leur audience et à optimiser les campagnes futures."
                }
            ]);
            app.save(digital);
            console.log("Updated: Digital Production & Marketing");
        }
    } catch (e) {
        console.log("Digital service not found, skipping");
    }

}, (app) => {
    // Rollback - not implemented
});
