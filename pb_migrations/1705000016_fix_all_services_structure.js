/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    const servicesCollection = app.findCollectionByNameOrId("services");

    // 1. Definition of ALL Services (New & Old) with the CORRECT Structure
    const servicesData = [
        // --- 1. FILM SHIPPING (Using your exact provided example) ---
        {
            slug: "film-shipping",
            title: "Film Shipping & Customs",
            title_fr: "Expédition & Douanes",
            brief_description: "Expert customs clearance and international shipping for film equipment.",
            hero_image: "",
            display_order: 1,
            stats: [
                { label: "Shipments Cleared", labelFr: "Expéditions Dédouanées", value: "200+" },
                { label: "Average Clearance", labelFr: "Délai Moyen", value: "48h" },
                { label: "Lost Equipment", labelFr: "Équipement Perdu", value: "0" },
                { label: "Compliance Rate", labelFr: "Taux Conformité", value: "100%" }
            ],
            features: [
                {
                    title: "Customs Clearance", titleFr: "Dédouanement", icon: "FileCheck",
                    description: "Fast and efficient port and airport clearance with direct relationships to Moroccan authorities.",
                    descriptionFr: "Dédouanement rapide et efficace avec relations directes aux autorités."
                },
                {
                    title: "ATA Carnet Processing", titleFr: "Traitement Carnet ATA", icon: "FileText",
                    description: "Complete temporary import/export documentation handling for international productions.",
                    descriptionFr: "Documentation complète d'import/export temporaire pour productions internationales."
                },
                {
                    title: "Sensitive Shipments", titleFr: "Expéditions Sensibles", icon: "Shield",
                    description: "Specialized handling for high-value cameras, vehicles, and regulated materials.",
                    descriptionFr: "Manutention spécialisée pour équipements de haute valeur."
                }
            ],
            sections: [
                {
                    type: "text_image", layout: "left", image: "/images/services/shipping/logistics.jpg",
                    title: "Expert Film Equipment Logistics & Customs Clearance",
                    titleFr: "Logistique Experte et Dédouanement d'Équipement Cinéma",
                    content: "TFS Film Solutions specializes in the complex logistics of importing and exporting filming equipment to and from Morocco. Our experienced logistics coordinators manage the entire customs clearance process at all Moroccan ports and airports, handling sensitive shipments including cinema cameras, prime lenses, grip trucks, and specialty vehicles with strict regulatory compliance.",
                    contentFr: "TFS Film Solutions se spécialise dans la logistique complexe de l'importation et l'exportation d'équipement de tournage vers et depuis le Maroc."
                },
                {
                    type: "text_image", layout: "right", image: "/images/services/shipping/customs-clearance.jpg",
                    title: "Secure Door-to-Door Production Delivery",
                    titleFr: "Livraison Porte-à-Porte Sécurisée pour Productions",
                    content: "TFS Cinema Solutions provides comprehensive door-to-door shipping coordination for international film productions, working closely with Moroccan governmental authorities and trusted global freight partners. Whether handling temporary imports with ATA carnets or managing permanent equipment imports for co-productions.",
                    contentFr: "TFS Cinema Solutions assure une coordination complète de l'expédition porte-à-porte pour les productions cinématographiques internationales."
                }
            ]
        },

        // --- 2. EQUIPMENT HIRE ---
        {
            slug: "equipment-hire",
            title: "Equipment Hire",
            title_fr: "Location d'Équipement",
            brief_description: "Professional cinema equipment rental for world-class productions.",
            hero_image: "",
            display_order: 2,
            stats: [
                { label: "Cameras Available", labelFr: "Caméras Disponibles", value: "50+" },
                { label: "Lens Sets", labelFr: "Séries d'Objectifs", value: "30+" },
                { label: "Support 24/7", labelFr: "Support 24/7", value: "Yes" },
                { label: "Brands", labelFr: "Marques", value: "ARRI/Sony/RED" }
            ],
            features: [
                { title: "Latest Cameras", titleFr: "Dernières Caméras", icon: "Camera", description: "ARRI Alexa 35, Mini LF, Sony Venice 2.", descriptionFr: "ARRI Alexa 35, Mini LF, Sony Venice 2." },
                { title: "Premium Optics", titleFr: "Optiques Premium", icon: "Aperture", description: "Cooke, Zeiss, Angenieux collections.", descriptionFr: "Collections Cooke, Zeiss, Angenieux." },
                { title: "On-Set Support", titleFr: "Support Plateau", icon: "Wrench", description: "Immediate technical assistance during shoots.", descriptionFr: "Assistance technique immédiate pendant les tournages." }
            ],
            sections: [
                {
                    type: "text_image", layout: "right", image: "/images/services/equipment/hero.webp",
                    title: "Premier Cinema Equipment Rental in Morocco",
                    titleFr: "Location d'Équipement Cinéma de Premier Plan au Maroc",
                    content: "TFS Cinema Solutions provides top-tier camera, lighting, and grip rental services for international film productions filming in Morocco. Our extensive inventory features industry-standard gear including the ARRI ALEXA 35, ARRI ALEXA Mini LF, Sony VENICE 2, and RED DSMC2 Monstro 8K VV, alongside premium optics.",
                    contentFr: "TFS Cinema Solutions fournit des services de location de caméras, d'éclairage et de machinerie de haut niveau pour les productions cinématographiques internationales tournant au Maroc."
                },
                {
                    type: "text_image", layout: "left", image: "/images/services/equipment/tech-support.jpg",
                    title: "24/7 Technical Support & On-Set Maintenance",
                    titleFr: "Support Technique 24/7 et Maintenance sur Plateau",
                    content: "Our dedicated technical team at TFS Cinema Solutions offers round-the-clock support for all equipment rental packages during your Morocco film production. From on-set troubleshooting and emergency repairs to rapid equipment replacement anywhere in Morocco.",
                    contentFr: "Notre équipe technique dédiée chez TFS Cinema Solutions offre un support 24/7 pour tous les forfaits de location d'équipement pendant votre production au Maroc."
                }
            ]
        },

        // --- 3. BROADCASTING & LIVE TRANSMISSION (NEW) ---
        {
            slug: "broadcasting-live",
            title: "Broadcasting & Live Transmission",
            title_fr: "Diffusion & Transmission en Direct",
            brief_description: "Professional broadcasting services for national and international productions.",
            hero_image: "",
            display_order: 3,
            stats: [
                { label: "Live Events", labelFr: "Événements Live", value: "500+" },
                { label: "Uptime", labelFr: "Disponibilité", value: "99.9%" },
                { label: "Cameras", labelFr: "Caméras", value: "Multi-Cam" }
            ],
            features: [
                { title: "Multi-Camera Production", titleFr: "Production Multi-Caméra", icon: "Radio", description: "Studio and on-location environments.", descriptionFr: "Environnements studio et extérieur." },
                { title: "Live Streaming", titleFr: "Streaming en Direct", icon: "Wifi", description: "Low latency streaming to any platform.", descriptionFr: "Streaming à faible latence vers toutes plateformes." },
                { title: "Audio Integration", titleFr: "Intégration Audio", icon: "Mic", description: "Synchronized sound for live transmission.", descriptionFr: "Son synchronisé pour transmission en direct." }
            ],
            sections: [
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
            ]
        },

        // --- 4. DIGITAL PRODUCTION (NEW) ---
        {
            slug: "digital-production-marketing",
            title: "Digital Production & Marketing",
            title_fr: "Production Numérique & Marketing",
            brief_description: "Integrated digital solutions combining filming, content production, and marketing.",
            hero_image: "",
            display_order: 4,
            stats: [
                { label: "Content Hours", labelFr: "Heures de Contenu", value: "1000+" },
                { label: "Platforms", labelFr: "Plateformes", value: "All" },
                { label: "Optimization", labelFr: "Optimisation", value: "SEO/Social" }
            ],
            features: [
                { title: "Branded Content", titleFr: "Contenu de Marque", icon: "Video", description: "High-end filming for digital platforms.", descriptionFr: "Tournage haut de gamme pour plateformes numériques." },
                { title: "Strategy", titleFr: "Stratégie", icon: "TrendingUp", description: "Content structuring and optimization.", descriptionFr: "Structuration et optimisation de contenu." },
                { title: "Marketing", titleFr: "Marketing", icon: "Share2", description: "Campaign-oriented content delivery.", descriptionFr: "Livraison de contenu orientée campagne." }
            ],
            sections: [
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
            ]
        },

        // --- 5. FILM PERMITS ---
        {
            slug: "film-permits",
            title: "Film Permits",
            title_fr: "Autorisations de Tournage",
            brief_description: "Official filming authorizations through CCM and Moroccan authorities.",
            hero_image: "",
            display_order: 5,
            stats: [
                { label: "Permits Issued", labelFr: "Permis Délivrés", value: "1000+" },
                { label: "Speed", labelFr: "Vitesse", value: "Fast-Track" },
                { label: "Regions", labelFr: "Régions", value: "All Morocco" },
                { label: "Success Rate", labelFr: "Taux de Succès", value: "100%" }
            ],
            features: [
                { title: "Official CCM Partner", titleFr: "Partenaire Officiel CCM", icon: "BadgeCheck", description: "Direct partnership with Centre Cinématographique Marocain.", descriptionFr: "Partenariat direct avec le Centre Cinématographique Marocain." },
                { title: "Fast-Track Processing", titleFr: "Traitement Accéléré", icon: "Zap", description: "Expedited handling for tight schedules.", descriptionFr: "Traitement accéléré pour les plannings serrés." },
                { title: "Nationwide Access", titleFr: "Accès National", icon: "Globe", description: "Permits for any location in Morocco.", descriptionFr: "Permis pour n'importe quel lieu au Maroc." }
            ],
            sections: [
                {
                    type: "text_image", layout: "right", image: "/images/services/permits/ccm-authorization.jpg",
                    title: "Official CCM Permit Coordination & Licensing",
                    titleFr: "Coordination Officielle des Permis CCM et Licences",
                    content: "As a trusted partner in the Moroccan film industry, TFS Cinema Solutions maintains strong, direct relationships with the Centre Cinématographique Marocain (CCM) and all relevant governmental authorities.",
                    contentFr: "En tant que partenaire de confiance dans l'industrie cinématographique marocaine, TFS Cinema Solutions maintient des relations directes et solides avec le Centre Cinématographique Marocain (CCM)."
                },
                {
                    type: "text_image", layout: "left", image: "/images/services/permits/location-access.jpg",
                    title: "Fast-Track Government Authorizations",
                    titleFr: "Autorisations Gouvernementales Accélérées",
                    content: "Our proactive communication with Moroccan governmental departments ensures permit applications are processed efficiently for your film production timeline.",
                    contentFr: "Notre communication proactive avec les départements gouvernementaux marocains assure un traitement efficace des demandes de permis selon votre planning de production."
                }
            ]
        },

        // --- 6. CREWING ---
        {
            slug: "crewing",
            title: "Film Crewing",
            title_fr: "Équipes de Tournage",
            brief_description: "Access Morocco's finest film professionals with international experience.",
            hero_image: "",
            display_order: 6,
            stats: [
                { label: "Crew Database", labelFr: "Base de Données", value: "500+" },
                { label: "Experience", labelFr: "Expérience", value: "International" },
                { label: "Languages", labelFr: "Langues", value: "4+" },
                { label: "Departments", labelFr: "Départements", value: "All" }
            ],
            features: [
                { title: "Multilingual", titleFr: "Multilingue", icon: "Languages", description: "Arabic, French, English, Spanish speaking crews.", descriptionFr: "Équipes parlant Arabe, Français, Anglais, Espagnol." },
                { title: "Vetted Talent", titleFr: "Talents Vérifiés", icon: "Award", description: "Professionals with proven international track records.", descriptionFr: "Professionnels avec une expérience internationale prouvée." },
                { title: "Full Crewing", titleFr: "Équipe Complète", icon: "Users", description: "From HoDs to assistants and dailies.", descriptionFr: "Des chefs de département aux assistants." }
            ],
            sections: [
                {
                    type: "text_image", layout: "right", image: "/images/services/crewing/professional-crew.jpg",
                    title: "World-Class Multilingual Film Crews",
                    titleFr: "Équipes de Tournage Multilingues de Classe Mondiale",
                    content: "TFS Cinema Solutions provides access to an extensive database of highly skilled film technicians and production professionals with proven international project experience. Our crews include cinematographers, camera operators, gaffers, key grips, and sound mixers.",
                    contentFr: "TFS Cinema Solutions donne accès à une base de données étendue de techniciens de cinéma hautement qualifiés et professionnels de production avec une expérience internationale prouvée."
                },
                {
                    type: "text_image", layout: "left", image: "/images/services/crewing/multilingual-team.webp",
                    title: "Tailored Technical Talent Matching",
                    titleFr: "Matching de Talents Techniques sur Mesure",
                    content: "We carefully select and vet local Moroccan talent to match your film production's specific creative and technical requirements.",
                    contentFr: "Nous sélectionnons et vérifions soigneusement les talents locaux marocains pour correspondre aux exigences créatives et techniques spécifiques de votre production."
                }
            ]
        },

        // --- 7. LOCATION SCOUTING ---
        {
            slug: "scouting",
            title: "Location Scouting",
            title_fr: "Repérage des Lieux",
            brief_description: "Discover Morocco's cinematic landscapes for your next production.",
            hero_image: "",
            display_order: 7,
            stats: [
                { label: "Locations", labelFr: "Lieux", value: "Unlimited" },
                { label: "Database", labelFr: "Base de Données", value: "Extensive" },
                { label: "Scouts", labelFr: "Repéreurs", value: "Expert" },
                { label: "Permits", labelFr: "Permis", value: "Included" }
            ],
            features: [
                { title: "Photo Library", titleFr: "Bibliothèque Photo", icon: "Image", description: "Extensive archive of locations.", descriptionFr: "Vaste archive de lieux." },
                { title: "GPS Tagged", titleFr: "Géolocalisé", icon: "Map", description: "Precise coordinates for all locations.", descriptionFr: "Coordonnées précises pour tous les lieux." },
                { title: "Scout Reports", titleFr: "Rapports de Repérage", icon: "FileImage", description: "Detailed logistical reports.", descriptionFr: "Rapports logistiques détaillés." }
            ],
            sections: [
                {
                    type: "text_image", layout: "right", image: "/images/services/scouting/morocco-locations.webp",
                    title: "Strategic Location Scouting Across Morocco",
                    titleFr: "Repérage de Lieux Stratégique à Travers le Maroc",
                    content: "TFS Cinema Solutions transforms your screenplay into visual reality by identifying precise location matches across Morocco's incredibly diverse landscapes. From the sweeping Sahara Desert dunes to ancient Medinas, Roman ruins, and Atlas Mountains.",
                    contentFr: "TFS Cinema Solutions transforme votre scénario en réalité visuelle en identifiant des correspondances précises de lieux à travers les paysages incroyablement diversifiés du Maroc."
                },
                {
                    type: "text_image", layout: "left", image: "/images/services/scouting/desert-landscape.avif",
                    title: "Comprehensive Location Library & Documentation",
                    titleFr: "Bibliothèque de Lieux Complète et Documentation",
                    content: "Film production clients gain exclusive access to our extensive photo and video library showcasing Morocco's most iconic and hidden filming locations.",
                    contentFr: "Les clients de production cinématographique obtiennent un accès exclusif à notre vaste bibliothèque de photos et vidéos présentant les lieux de tournage les plus emblématiques et cachés du Maroc."
                }
            ]
        },

        // --- 8. CATERING ---
        {
            slug: "catering",
            title: "Film Catering",
            title_fr: "Restauration de Plateau",
            brief_description: "Professional on-set catering with fresh, locally-sourced ingredients.",
            hero_image: "",
            display_order: 8,
            stats: [
                { label: "Meals Served", labelFr: "Repas Servis", value: "10k+" },
                { label: "Dietary", labelFr: "Régimes", value: "All" },
                { label: "Freshness", labelFr: "Fraîcheur", value: "Daily" },
                { label: "Mobile", labelFr: "Mobile", value: "Yes" }
            ],
            features: [
                { title: "Fresh Ingredients", titleFr: "Ingrédients Frais", icon: "Leaf", description: "Locally sourced produce daily.", descriptionFr: "Produits locaux frais quotidiens." },
                { title: "Dietary Needs", titleFr: "Besoins Alimentaires", icon: "Heart", description: "Vegan, Gluten-free, Halal options.", descriptionFr: "Options Végan, Sans Gluten, Halal." },
                { title: "Mobile Kitchen", titleFr: "Cuisine Mobile", icon: "Truck", description: "Catering anywhere, even remote locations.", descriptionFr: "Traiteur partout, même en lieux isolés." }
            ],
            sections: [
                {
                    type: "text_image", layout: "right", image: "/images/services/catering/gourmet-dining.jpg",
                    title: "Professional Film Set Catering Services",
                    titleFr: "Services Traiteur Professionnels pour Plateaux de Tournage",
                    content: "TFS Cinema Solutions offers reliable, high-quality catering services led by professionally trained chefs who prioritize food safety, hygiene, and exceptional taste for demanding film productions.",
                    contentFr: "TFS Cinema Solutions offre des services de traiteur fiables et de haute qualité dirigés par des chefs professionnellement formés."
                },
                {
                    type: "text_image", layout: "left", image: "/images/services/catering/flexible-service.jpg",
                    title: "Flexible Production Dining Solutions",
                    titleFr: "Solutions de Repas de Production Flexibles",
                    content: "Whether your film production needs all-day craft services for continuous grazing, structured set menus for scheduled meal breaks, or customized meal plans for special requests and VIP talent.",
                    contentFr: "Que votre production ait besoin de services de régie toute la journée ou de menus structurés pour les pauses repas, nos solutions s'adaptent parfaitement."
                }
            ]
        },

        // --- 9. ACCOMMODATION ---
        {
            slug: "accommodation",
            title: "Accommodation",
            title_fr: "Hébergement",
            brief_description: "Premium crew accommodations at preferential production rates.",
            hero_image: "",
            display_order: 9,
            stats: [
                { label: "Partners", labelFr: "Partenaires", value: "100+" },
                { label: "Savings", labelFr: "Économies", value: "High" },
                { label: "Range", labelFr: "Gamme", value: "Budget-Luxury" },
                { label: "Booking", labelFr: "Réservation", value: "Managed" }
            ],
            features: [
                { title: "Production Rates", titleFr: "Tarifs Production", icon: "Percent", description: "Exclusive discounts for crews.", descriptionFr: "Remises exclusives pour les équipes." },
                { title: "Versatile Options", titleFr: "Options Polyvalentes", icon: "Star", description: "From Riads to 5-star hotels.", descriptionFr: "Des Riads aux hôtels 5 étoiles." },
                { title: "National Reach", titleFr: "Portée Nationale", icon: "MapPin", description: "Hotels in every Moroccan city.", descriptionFr: "Hôtels dans chaque ville marocaine." }
            ],
            sections: [
                {
                    type: "text_image", layout: "right", image: "/images/services/accommodation/luxury-hotel.jpg",
                    title: "Optimized Production Travel Logistics",
                    titleFr: "Logistique de Voyage de Production Optimisée",
                    content: "Our production coordinators at TFS Cinema Solutions specialize in comprehensive travel logistics for international film productions, including hotel bookings, air transportation, and ground transfers throughout Morocco.",
                    contentFr: "Nos coordinateurs de production chez TFS Cinema Solutions se spécialisent dans la logistique de voyage complète pour les productions cinématographiques internationales."
                },
                {
                    type: "text_image", layout: "left", image: "/images/services/accommodation/moroccan-riad.jpg",
                    title: "Comfortable Cast & Crew Lodging",
                    titleFr: "Hébergement Confortable pour Distribution et Équipe",
                    content: "TFS Film Solutions arranges accommodation tailored to any production budget while maintaining high comfort standards essential for keeping your cast and crew rested and productive.",
                    contentFr: "TFS Film Solutions organise des hébergements adaptés à tout budget de production tout en maintenant des standards de confort élevés."
                }
            ]
        },

        // --- 10. TRANSPORTATION ---
        {
            slug: "transportation",
            title: "Transportation",
            title_fr: "Transport",
            brief_description: "Complete ground and air transport solutions for productions.",
            hero_image: "",
            display_order: 10,
            stats: [
                { label: "Fleet Size", labelFr: "Taille Flotte", value: "Large" },
                { label: "Types", labelFr: "Types", value: "Van/Truck/4x4" },
                { label: "Drivers", labelFr: "Chauffeurs", value: "Vetted" },
                { label: "Coverage", labelFr: "Couverture", value: "National" }
            ],
            features: [
                { title: "Diverse Fleet", titleFr: "Flotte Diversifiée", icon: "Truck", description: "Trucks, vans, cars for all needs.", descriptionFr: "Camions, fourgons, voitures pour tous besoins." },
                { title: "GPS Tracking", titleFr: "Suivi GPS", icon: "Navigation", description: "Real-time location monitoring.", descriptionFr: "Surveillance de localisation en temps réel." },
                { title: "Air Transport", titleFr: "Transport Aérien", icon: "Plane", description: "Helicopter and charter coordination.", descriptionFr: "Coordination hélicoptère et charter." }
            ],
            sections: [
                {
                    type: "text_image", layout: "right", image: "/images/services/transportation/production-fleet.jpg",
                    title: "Diverse Film Production Vehicle Fleet",
                    titleFr: "Flotte Diversifiée de Véhicules de Production",
                    content: "TFS Cinema Solutions provides dependable, budget-efficient transportation solutions with a diverse fleet specifically adapted to the demanding needs of film productions in Morocco.",
                    contentFr: "TFS Cinema Solutions fournit des solutions de transport fiables et économiques avec une flotte diversifiée spécifiquement adaptée aux besoins exigeants des productions."
                },
                {
                    type: "text_image", layout: "left", image: "/images/services/transportation/desert-4x4.jpg",
                    title: "Specialized Off-Road & Remote Access",
                    titleFr: "Accès Spécialisé Hors-Piste et Zones Isolées",
                    content: "For complex film shoots in challenging terrain, TFS Film Solutions coordinates specialized 4x4 vehicles, modified desert transport, and off-road solutions for safe access to Morocco's most remote locations.",
                    contentFr: "Pour les tournages complexes en terrain difficile, TFS Film Solutions coordonne des véhicules 4x4 spécialisés, transport désertique modifié et solutions hors-piste."
                }
            ]
        },

        // --- 11. CASTING ---
        {
            slug: "casting",
            title: "Casting",
            title_fr: "Casting",
            brief_description: "Diverse Moroccan talent for international productions.",
            hero_image: "",
            display_order: 11,
            stats: [
                { label: "Talent Pool", labelFr: "Vivier Talents", value: "Huge" },
                { label: "Diversity", labelFr: "Diversité", value: "High" },
                { label: "Extras", labelFr: "Figurants", value: "Available" },
                { label: "Studio", labelFr: "Studio", value: "On-site" }
            ],
            features: [
                { title: "Extensive Database", titleFr: "Base de Données Étendue", icon: "Database", description: "Thousands of profiles.", descriptionFr: "Des milliers de profils." },
                { title: "Self-Tape Studio", titleFr: "Studio Self-Tape", icon: "Video", description: "4K audition facility.", descriptionFr: "Installation d'audition 4K." },
                { title: "Diverse Looks", titleFr: "Looks Diversifiés", icon: "Globe", description: "Multi-ethnic casting options.", descriptionFr: "Options de casting multi-ethniques." }
            ],
            sections: [
                {
                    type: "text_image", layout: "right", image: "/images/services/casting/talent-pool.jpeg",
                    title: "Diverse International Talent Pool",
                    titleFr: "Vivier de Talents Internationaux Diversifiés",
                    content: "Morocco's rich multicultural history makes it an exceptional destination for diverse casting requirements. TFS Cinema Solutions accesses a wide range of professional profiles reflecting the region's unique blend of European, Middle Eastern, Berber, and African influences.",
                    contentFr: "L'histoire multiculturelle riche du Maroc en fait une destination exceptionnelle pour des exigences de casting diverses. TFS Cinema Solutions accède à une large gamme de profils professionnels."
                },
                {
                    type: "text_image", layout: "left", image: "/images/services/casting/auditions.jpg",
                    title: "Professional Audition Management",
                    titleFr: "Gestion d'Auditions Professionnelle",
                    content: "TFS Film Solutions manages the entire casting process for productions filming in Morocco, from initial talent sourcing for background extras to principal role auditions.",
                    contentFr: "TFS Film Solutions gère l'ensemble du processus de casting pour les productions tournant au Maroc, de la recherche initiale de talents pour figurants aux auditions de rôles principaux."
                }
            ]
        },

        // --- 12. MAKEUP & HAIR ---
        {
            slug: "makeup-hair",
            title: "Make-up & Hair",
            title_fr: "Maquillage & Coiffure",
            brief_description: "Professional services tailored to film, TV, and commercials.",
            hero_image: "",
            display_order: 12,
            stats: [
                { label: "Artists", labelFr: "Artistes", value: "Expert" },
                { label: "Continuity", labelFr: "Continuité", value: "Managed" },
                { label: "SFX", labelFr: "SFX", value: "Available" },
                { label: "Products", labelFr: "Produits", value: "Pro" }
            ],
            features: [
                { title: "Character Design", titleFr: "Design Personnage", icon: "CheckCircle", description: "Expert stylists and artists.", descriptionFr: "Stylistes et artistes experts." },
                { title: "Durability", titleFr: "Durabilité", icon: "Clock", description: "Long-lasting application.", descriptionFr: "Application longue durée." },
                { title: "Efficiency", titleFr: "Efficacité", icon: "User", description: "Fast on-set turnover.", descriptionFr: "Rotation rapide sur plateau." }
            ],
            sections: [
                {
                    type: "text_image", layout: "left", image: "/images/services/crewing/hero.jpg",
                    title: "Experienced Team",
                    titleFr: "Équipe Expérimentée",
                    content: "Our team consists of experienced make-up artists and hair stylists skilled in character design, continuity, and on-set efficiency.",
                    contentFr: "Notre équipe se compose de maquilleurs et coiffeurs expérimentés qualifiés en conception de personnages et continuité."
                },
                {
                    type: "text_image", layout: "right", image: "/images/services/crewing/hero.jpg",
                    title: "Industry Standards",
                    titleFr: "Standards de l'Industrie",
                    content: "We use high-quality, industry-standard products to ensure durability under demanding shooting conditions, lighting setups, and long production hours.",
                    contentFr: "Nous utilisons des produits de haute qualité aux standards de l'industrie pour assurer la durabilité."
                }
            ]
        },

        // --- 13. COSTUME & WARDROBE ---
        {
            slug: "costume-wardrobe",
            title: "Costume & Wardrobe",
            title_fr: "Costume & Garde-robe",
            brief_description: "Comprehensive costume services supporting visual identity.",
            hero_image: "",
            display_order: 13,
            stats: [
                { label: "Stock", labelFr: "Stock", value: "Large" },
                { label: "Tailors", labelFr: "Tailleurs", value: "Skilled" },
                { label: "Sourcing", labelFr: "Sourcing", value: "Local/Intl" },
                { label: "Period", labelFr: "Époque", value: "Specialists" }
            ],
            features: [
                { title: "Custom Alterations", titleFr: "Retouches sur Mesure", icon: "Scissors", description: "Tailoring to fit talent perfectly.", descriptionFr: "Ajustement parfait pour les talents." },
                { title: "Local Sourcing", titleFr: "Sourcing Local", icon: "Search", description: "Access to Moroccan textiles.", descriptionFr: "Accès aux textiles marocains." },
                { title: "Period Pieces", titleFr: "Pièces d'Époque", icon: "Shirt", description: "Historical accuracy.", descriptionFr: "Précision historique." }
            ],
            sections: [
                {
                    type: "text_image", layout: "left", image: "/images/services/crewing/professional-crew.jpg",
                    title: "Design & Sourcing",
                    titleFr: "Design & Sourcing",
                    content: "Our costume department assists with costume design, sourcing, fittings, alterations, and on-set wardrobe management.",
                    contentFr: "Notre département costumes assiste avec la conception, le sourcing, les essayages et les retouches."
                },
                {
                    type: "text_image", layout: "right", image: "/images/services/crewing/professional-crew.jpg",
                    title: "Local Partnerships",
                    titleFr: "Partenariats Locaux",
                    content: "Through partnerships with local designers, tailors, and rental houses, TFS provides flexible solutions adapted to creative vision, schedule, and budget.",
                    contentFr: "Grâce à des partenariats avec des designers locaux et tailleurs, TFS fournit des solutions flexibles."
                }
            ]
        },

        // --- 14. PROPS & SET DRESSING ---
        {
            slug: "props-set-dressing",
            title: "Props & Set Dressing",
            title_fr: "Accessoires & Habillage",
            brief_description: "Prop sourcing and set dressing for authenticity and impact.",
            hero_image: "",
            display_order: 14,
            stats: [
                { label: "Props", labelFr: "Accessoires", value: "Diverse" },
                { label: "Fabrication", labelFr: "Fabrication", value: "Custom" },
                { label: "Accuracy", labelFr: "Précision", value: "High" },
                { label: "Sourcing", labelFr: "Sourcing", value: "Rapid" }
            ],
            features: [
                { title: "Authentic Sourcing", titleFr: "Sourcing Authentique", icon: "Search", description: "Finding real period items.", descriptionFr: "Trouver des objets d'époque réels." },
                { title: "Custom Fabrication", titleFr: "Fabrication sur Mesure", icon: "Hammer", description: "Building unique props.", descriptionFr: "Construction d'accessoires uniques." },
                { title: "Detail Oriented", titleFr: "Souci du Détail", icon: "Eye", description: "Perfect set dressing.", descriptionFr: "Habillage de plateau parfait." }
            ],
            sections: [
                {
                    type: "text_image", layout: "left", image: "/images/services/scouting/hero.jpg",
                    title: "Sourcing & Fabrication",
                    titleFr: "Sourcing & Fabrication",
                    content: "From period-accurate objects to custom-made props, our team handles research, acquisition, fabrication, transportation, and on-set coordination.",
                    contentFr: "Des objets d'époque aux accessoires sur mesure, notre équipe gère la recherche et la fabrication."
                },
                {
                    type: "text_image", layout: "right", image: "/images/services/scouting/hero.jpg",
                    title: "Director's Vision",
                    titleFr: "Vision du Réalisateur",
                    content: "Every detail is carefully selected to align with the director’s vision and production design requirements.",
                    contentFr: "Chaque détail est soigneusement sélectionné pour s'aligner avec la vision du réalisateur."
                }
            ]
        },

        // --- 15. SECURITY & SET MANAGEMENT ---
        {
            slug: "security-management",
            title: "Security & Set Management",
            title_fr: "Sécurité & Gestion de Plateau",
            brief_description: "Professional security and set management for smooth filming.",
            hero_image: "",
            display_order: 15,
            stats: [
                { label: "Safety", labelFr: "Sécurité", value: "100%" },
                { label: "Guards", labelFr: "Gardes", value: "Trained" },
                { label: "Crowd", labelFr: "Foule", value: "Managed" },
                { label: "Access", labelFr: "Accès", value: "Secure" }
            ],
            features: [
                { title: "Crowd Control", titleFr: "Contrôle des Foules", icon: "Shield", description: "Managing public interaction.", descriptionFr: "Gestion de l'interaction publique." },
                { title: "Access Management", titleFr: "Gestion d'Accès", icon: "Lock", description: "Securing set perimeters.", descriptionFr: "Sécurisation des périmètres de plateau." },
                { title: "Regulatory Compliance", titleFr: "Conformité Réglementaire", icon: "FileCheck", description: "Adhering to local laws.", descriptionFr: "Adhésion aux lois locales." }
            ],
            sections: [
                {
                    type: "text_image", layout: "left", image: "/images/services/transportation/hero.jpg",
                    title: "Set Management",
                    titleFr: "Gestion de Plateau",
                    content: "Our teams coordinate crowd control, equipment protection, access management, and on-location safety—particularly for sensitive or high-profile productions.",
                    contentFr: "Nos équipes coordonnent le contrôle des foules, la protection de l'équipement et la sécurité sur site."
                },
                {
                    type: "text_image", layout: "right", image: "/images/services/transportation/hero.jpg",
                    title: "Safety Compliance",
                    titleFr: "Conformité Sécurité",
                    content: "All operations are conducted in compliance with local regulations and production safety standards.",
                    contentFr: "Toutes les opérations sont menées en conformité avec les réglementations locales."
                }
            ]
        }
    ];

    // Execution
    const slugsToRemove = [
        "production-design",
        ...servicesData.map(s => s.slug) // Also remove existing versions of the ones we are adding to ensure updates apply
    ];

    slugsToRemove.forEach(slug => {
        try {
            const existing = app.findFirstRecordByFilter("services", `slug="${slug}"`);
            app.delete(existing);
        } catch (e) {
            // Ignore if not found
        }
    });

    servicesData.forEach(service => {
        console.log(`Seeding Service: ${service.title}`);
        const record = new Record(servicesCollection);

        record.set("slug", service.slug);
        record.set("title", service.title);
        record.set("title_fr", service.title_fr);
        record.set("brief_description", service.brief_description);
        record.set("hero_image", service.hero_image);
        record.set("sections", service.sections);
        record.set("stats", service.stats);
        record.set("features", service.features);
        record.set("display_order", service.display_order);
        record.set("is_active", true);
        record.set("type", "content_page");

        app.save(record);
    });

}, (app) => {
    // Rollback logic
});