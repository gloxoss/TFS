/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration: Restore All 14 Services
 * Combines data from:
 * 1. Base Services (Equipment Hire ... Casting)
 * 2. Enhanced SEO Content (Hero images, text_image sections)
 * 3. New Services (Makeup, Costume, Props, Production Design, Security)
 */

migrate((app) => {
    const servicesCol = app.findCollectionByNameOrId("services");

    // Clear existing services to ensure clean slate
    try {
        const existing = app.findAllRecords("services");
        existing.forEach(rec => app.delete(rec));
    } catch (e) { /* ignore */ }

    // --- HELPER: Image Loader ---
    const loadImage = (path) => {
        try {
            // Path example: "/images/services/crewing/hero.jpg" -> "web/public/images/services/crewing/hero.jpg"
            const localPath = "web/public" + path;
            return $filesystem.fileFromPath(localPath);
        } catch (e) {
            // console.log(`Warning: Image not found ${path}`);
            return null;
        }
    };

    // --- DATA ---
    const SERVICES = [
        // 1. EQUIPMENT HIRE (Enhanced)
        {
            title: "Equipment Hire",
            title_fr: "Location d'Équipement",
            slug: "equipment-hire",
            icon: "Camera",
            type: "internal_link",
            target_url: "/equipment",
            brief_description: "Professional cinema equipment rental for world-class productions.",
            brief_description_fr: "Location d'équipement cinématographique professionnel.",
            display_order: 0,
            sections: [
                {
                    type: "hero",
                    title: "World-Class Cinema Equipment",
                    title_fr: "Équipement Cinéma de Classe Mondiale",
                    description: "Access Morocco's largest inventory of professional cinema cameras, lenses, lighting, and grip equipment.",
                    description_fr: "Accédez au plus grand inventaire marocain de caméras, objectifs, éclairage et équipement de grip.",
                    background: "/images/services/equipment/hero.webp"
                },
                {
                    type: "text_image",
                    title: "Premier Cinema Equipment Rental in Morocco",
                    titleFr: "Location d'Équipement Cinéma de Premier Plan au Maroc",
                    content: "TFS Cinema Solutions provides top-tier camera, lighting, and grip rental services for international film productions filming in Morocco. Our extensive inventory features industry-standard gear including the ARRI ALEXA 35, ARRI ALEXA Mini LF, Sony VENICE 2, and RED DSMC2 Monstro 8K VV, alongside premium optics from Cooke S4/i, Zeiss Supreme Primes, and ARRI Signature Primes.",
                    contentFr: "TFS Cinema Solutions fournit des services de location de caméras, d'éclairage et de machinerie de haut niveau pour les productions cinématographiques internationales tournant au Maroc.",
                    layout: "right",
                    image: "/images/services/equipment/hero.webp"
                },
                {
                    type: "text_image",
                    title: "24/7 Technical Support & On-Set Maintenance",
                    titleFr: "Support Technique 24/7 et Maintenance sur Plateau",
                    content: "Our dedicated technical team at TFS Cinema Solutions offers round-the-clock support for all equipment rental packages during your Morocco film production. From on-set troubleshooting and emergency repairs to rapid equipment replacement anywhere in Morocco, we guarantee seamless operation during your shoot.",
                    contentFr: "Notre équipe technique dédiée chez TFS Cinema Solutions offre un support 24/7 pour tous les forfaits de location d'équipement pendant votre production au Maroc.",
                    layout: "left",
                    image: "/images/services/equipment/tech-support.jpg"
                }
            ],
            tags: ["Cameras", "Lenses", "Lighting", "Grip", "Support", "ARRI", "RED", "Sony"],
            features: [
                { icon: "CheckCircle", text: "Latest cinema cameras", text_fr: "Dernières caméras cinéma" },
                { icon: "CheckCircle", text: "Premium lens collections", text_fr: "Collections d'objectifs premium" },
                { icon: "CheckCircle", text: "On-set technical support", text_fr: "Support technique sur plateau" }
            ],
            hero_image_path: "/images/services/equipment/hero.webp"
        },
        // 2. FILM SHIPPING (Enhanced)
        {
            title: "Film Shipping & Customs",
            title_fr: "Expédition & Douanes",
            slug: "film-shipping",
            icon: "Truck",
            type: "content_page",
            brief_description: "Expert customs clearance and international shipping for film equipment.",
            brief_description_fr: "Dédouanement expert et expédition internationale d'équipements.",
            display_order: 1,
            sections: [
                {
                    type: "hero",
                    title: "Seamless Global Film Logistics",
                    title_fr: "Logistique Cinématographique Mondiale Sans Faille",
                    description: "From any corner of the world to Morocco, we handle your equipment with care and precision.",
                    description_fr: "De n'importe quel coin du monde vers le Maroc, nous gérons votre équipement avec soin et précision.",
                    background: "/images/services/shipping/hero.jpg"
                },
                {
                    type: "text_image",
                    title: "Expert Film Equipment Logistics & Customs Clearance",
                    titleFr: "Logistique Experte et Dédouanement d'Équipement Cinéma",
                    content: "TFS Film Solutions specializes in the complex logistics of importing and exporting filming equipment to and from Morocco. Our experienced logistics coordinators manage the entire customs clearance process at all Moroccan ports and airports.",
                    contentFr: "TFS Film Solutions se spécialise dans la logistique complexe de l'importation et l'exportation d'équipement de tournage vers et depuis le Maroc.",
                    layout: "right",
                    image: "/images/services/shipping/customs-clearance.jpg"
                },
                {
                    type: "text_image",
                    title: "Secure Door-to-Door Production Delivery",
                    titleFr: "Livraison Porte-à-Porte Sécurisée pour Productions",
                    content: "TFS Cinema Solutions provides comprehensive door-to-door shipping coordination for international film productions, working closely with Moroccan governmental authorities and trusted global freight partners.",
                    contentFr: "TFS Cinema Solutions assure une coordination complète de l'expédition porte-à-porte pour les productions cinématographiques internationales.",
                    layout: "left",
                    image: "/images/services/shipping/logistics.jpg"
                }
            ],
            tags: ["Customs", "Logistics", "Import", "Export", "Carnet ATA", "Shipping"],
            features: [
                { icon: "Shield", text: "Full insurance coverage", text_fr: "Couverture d'assurance complète" },
                { icon: "Clock", text: "24/7 tracking", text_fr: "Suivi 24h/24" },
                { icon: "FileCheck", text: "Complete documentation", text_fr: "Documentation complète" }
            ],
            hero_image_path: "/images/services/shipping/hero.jpg"
        },
        // 3. FILM PERMITS (Enhanced)
        {
            title: "Film Permits",
            title_fr: "Autorisations de Tournage",
            slug: "film-permits",
            icon: "FileCheck",
            type: "content_page",
            brief_description: "Official filming authorizations through CCM and Moroccan authorities.",
            brief_description_fr: "Autorisations officielles via le CCM et les autorités marocaines.",
            display_order: 2,
            sections: [
                {
                    type: "hero",
                    title: "Your Gateway to Filming in Morocco",
                    title_fr: "Votre Passerelle pour Tourner au Maroc",
                    description: "Direct partnership with CCM for seamless permit acquisition, regardless of project complexity.",
                    description_fr: "Partenariat direct avec le CCM pour l'acquisition de permis sans accroc.",
                    background: "/images/services/permits/hero.jpg"
                },
                {
                    type: "text_image",
                    title: "Official CCM Permit Coordination & Licensing",
                    titleFr: "Coordination Officielle des Permis CCM et Licences",
                    content: "As a trusted partner in the Moroccan film industry, TFS Cinema Solutions maintains strong, direct relationships with the Centre Cinématographique Marocain (CCM) and all relevant governmental authorities.",
                    contentFr: "En tant que partenaire de confiance dans l'industrie cinématographique marocaine, TFS Cinema Solutions maintient des relations directes et solides avec le Centre Cinématographique Marocain (CCM).",
                    layout: "right",
                    image: "/images/services/permits/ccm-authorization.jpg"
                },
                {
                    type: "text_image",
                    title: "Fast-Track Government Authorizations",
                    titleFr: "Autorisations Gouvernementales Accélérées",
                    content: "Our proactive communication with Moroccan governmental departments ensures permit applications are processed efficiently for your film production timeline.",
                    contentFr: "Notre communication proactive avec les départements gouvernementaux marocains assure un traitement efficace des demandes de permis selon votre planning de production.",
                    layout: "left",
                    image: "/images/services/permits/location-access.jpg"
                }
            ],
            tags: ["CCM", "Permits", "Authorization", "Government", "Locations", "Drone"],
            features: [
                { icon: "BadgeCheck", text: "Official CCM partner", text_fr: "Partenaire officiel CCM" },
                { icon: "Zap", text: "Fast-track processing", text_fr: "Traitement accéléré" },
                { icon: "Globe", text: "Any location in Morocco", text_fr: "N'importe quel lieu au Maroc" }
            ],
            hero_image_path: "/images/services/permits/hero.jpg"
        },
        // 4. CREWING (Enhanced)
        {
            title: "Film Crewing",
            title_fr: "Équipes de Tournage",
            slug: "crewing",
            icon: "Users",
            type: "content_page",
            brief_description: "Access Morocco's finest film professionals with international experience.",
            brief_description_fr: "Accédez aux meilleurs professionnels du cinéma marocain.",
            display_order: 3,
            sections: [
                {
                    type: "hero",
                    title: "World-Class Moroccan Film Talent",
                    title_fr: "Talents Cinématographiques Marocains de Classe Mondiale",
                    description: "Multilingual crews for seamless collaboration on international productions.",
                    description_fr: "Équipes multilingues pour une collaboration fluide sur les productions internationales.",
                    background: "/images/services/crewing/hero.jpg"
                },
                {
                    type: "text_image",
                    title: "World-Class Multilingual Film Crews",
                    titleFr: "Équipes de Tournage Multilingues de Classe Mondiale",
                    content: "TFS Cinema Solutions provides access to an extensive database of highly skilled film technicians and production professionals with proven international project experience. Our crews include cinematographers, camera operators, gaffers, key grips, sound mixers, and department heads.",
                    contentFr: "TFS Cinema Solutions donne accès à une base de données étendue de techniciens de cinéma hautement qualifiés et professionnels de production avec une expérience internationale prouvée.",
                    layout: "right",
                    image: "/images/services/crewing/professional-crew.jpg"
                },
                {
                    type: "text_image",
                    title: "Tailored Technical Talent Matching",
                    titleFr: "Matching de Talents Techniques sur Mesure",
                    content: "We carefully select and vet local Moroccan talent to match your film production's specific creative and technical requirements.",
                    contentFr: "Nous sélectionnons et vérifions soigneusement les talents locaux marocains pour correspondre aux exigences créatives et techniques spécifiques de votre production.",
                    layout: "left",
                    image: "/images/services/crewing/multilingual-team.webp"
                }
            ],
            tags: ["Crew", "Technicians", "Camera", "Lighting", "Art Department", "Stunts"],
            features: [
                { icon: "Languages", text: "Arabic, French, English, Spanish", text_fr: "Arabe, Français, Anglais, Espagnol" },
                { icon: "Award", text: "Award-winning professionals", text_fr: "Professionnels primés" },
                { icon: "Users", text: "All departments covered", text_fr: "Tous les départements couverts" }
            ],
            hero_image_path: "/images/services/crewing/hero.jpg"
        },
        // 5. LOCATION SCOUTING (Enhanced)
        {
            title: "Location Scouting",
            title_fr: "Repérage des Lieux",
            slug: "scouting",
            icon: "MapPin",
            type: "content_page",
            brief_description: "Discover Morocco's cinematic landscapes for your next production.",
            brief_description_fr: "Découvrez les paysages cinématographiques du Maroc.",
            display_order: 4,
            sections: [
                {
                    type: "hero",
                    title: "Morocco: A World of Locations",
                    title_fr: "Maroc: Un Monde de Lieux",
                    description: "From ancient medinas to Sahara dunes, find the perfect backdrop for your vision.",
                    description_fr: "Des médinas anciennes aux dunes du Sahara, trouvez le décor parfait.",
                    background: "/images/services/scouting/hero.jpg"
                },
                {
                    type: "text_image",
                    title: "Strategic Location Scouting Across Morocco",
                    titleFr: "Repérage de Lieux Stratégique à Travers le Maroc",
                    content: "TFS Cinema Solutions transforms your screenplay into visual reality by identifying precise location matches across Morocco's incredibly diverse landscapes. From the sweeping Sahara Desert dunes to ancient Medinas, Roman ruins, snow-capped Atlas Mountains, and Atlantic coastal cliffs.",
                    contentFr: "TFS Cinema Solutions transforme votre scénario en réalité visuelle en identifiant des correspondances précises de lieux à travers les paysages incroyablement diversifiés du Maroc.",
                    layout: "right",
                    image: "/images/services/scouting/morocco-locations.webp"
                },
                {
                    type: "text_image",
                    title: "Comprehensive Location Library & Documentation",
                    titleFr: "Bibliothèque de Lieux Complète et Documentation",
                    content: "Film production clients gain exclusive access to our extensive photo and video library showcasing Morocco's most iconic and hidden filming locations.",
                    contentFr: "Les clients de production cinématographique obtiennent un accès exclusif à notre vaste bibliothèque de photos et vidéos présentant les lieux de tournage les plus emblématiques et cachés du Maroc.",
                    layout: "left",
                    image: "/images/services/scouting/desert-landscape.avif"
                }
            ],
            tags: ["Locations", "Desert", "Medina", "Mountains", "Coastal", "Kasbah"],
            features: [
                { icon: "Image", text: "Extensive photo library", text_fr: "Bibliothèque photo extensive" },
                { icon: "Map", text: "GPS-tagged locations", text_fr: "Lieux géolocalisés GPS" },
                { icon: "FileImage", text: "HD scout reports", text_fr: "Rapports de repérage HD" }
            ],
            hero_image_path: "/images/services/scouting/hero.jpg"
        },
        // 6. CATERING (Enhanced)
        {
            title: "Film Catering",
            title_fr: "Restauration de Plateau",
            slug: "catering",
            icon: "Utensils",
            type: "content_page",
            brief_description: "Professional on-set catering with fresh, locally-sourced ingredients.",
            brief_description_fr: "Restauration professionnelle sur plateau avec ingrédients frais.",
            display_order: 5,
            sections: [
                {
                    type: "hero",
                    title: "Fuel Your Production",
                    title_fr: "Alimentez Votre Production",
                    description: "Quality meals that keep your crew energized and focused throughout the shoot.",
                    description_fr: "Repas de qualité qui gardent votre équipe énergisée et concentrée.",
                    background: "/images/services/catering/hero.jpg"
                },
                {
                    type: "text_image",
                    title: "Professional Film Set Catering Services",
                    titleFr: "Services Traiteur Professionnels pour Plateaux de Tournage",
                    content: "TFS Cinema Solutions offers reliable, high-quality catering services led by professionally trained chefs who prioritize food safety, hygiene, and exceptional taste for demanding film productions.",
                    contentFr: "TFS Cinema Solutions offre des services de traiteur fiables et de haute qualité dirigés par des chefs professionnellement formés.",
                    layout: "right",
                    image: "/images/services/catering/gourmet-dining.jpg"
                },
                {
                    type: "text_image",
                    title: "Flexible Production Dining Solutions",
                    titleFr: "Solutions de Repas de Production Flexibles",
                    content: "Whether your film production needs all-day craft services for continuous grazing, structured set menus for scheduled meal breaks, or customized meal plans for special requests and VIP talent, our catering solutions adapt seamlessly.",
                    contentFr: "Que votre production ait besoin de services de régie toute la journée ou de menus structurés pour les pauses repas, nos solutions s'adaptent parfaitement.",
                    layout: "left",
                    image: "/images/services/catering/flexible-service.jpg"
                }
            ],
            tags: ["Catering", "Food", "Craft Services", "Meals", "Dietary", "Halal"],
            features: [
                { icon: "Leaf", text: "Fresh daily ingredients", text_fr: "Ingrédients frais quotidiens" },
                { icon: "Heart", text: "All dietary needs covered", text_fr: "Besoins alimentaires couverts" },
                { icon: "Truck", text: "Mobile kitchen available", text_fr: "Cuisine mobile disponible" }
            ],
            hero_image_path: "/images/services/catering/hero.jpg"
        },
        // 7. ACCOMMODATION (Enhanced)
        {
            title: "Accommodation",
            title_fr: "Hébergement",
            slug: "accommodation",
            icon: "Hotel",
            type: "content_page",
            brief_description: "Premium crew accommodations at preferential production rates.",
            brief_description_fr: "Hébergements premium à tarifs préférentiels production.",
            display_order: 6,
            sections: [
                {
                    type: "hero",
                    title: "Rest in Comfort",
                    title_fr: "Reposez-vous Confortablement",
                    description: "Premium accommodations nationwide with significant production discounts.",
                    description_fr: "Hébergements premium nationaux avec remises production significatives.",
                    background: "/images/services/accommodation/luxury-hotel.jpg"
                },
                {
                    type: "text_image",
                    title: "Optimized Production Travel Logistics",
                    titleFr: "Logistique de Voyage de Production Optimisée",
                    content: "Our production coordinators at TFS Cinema Solutions specialize in comprehensive travel logistics for international film productions, including hotel bookings, air transportation, and ground transfers throughout Morocco.",
                    contentFr: "Nos coordinateurs de production chez TFS Cinema Solutions se spécialisent dans la logistique de voyage complète pour les productions cinématographiques internationales.",
                    layout: "right",
                    image: "/images/services/accommodation/luxury-hotel.jpg"
                },
                {
                    type: "text_image",
                    title: "Comfortable Cast & Crew Lodging",
                    titleFr: "Hébergement Confortable pour Distribution et Équipe",
                    content: "TFS Film Solutions arranges accommodation tailored to any production budget while maintaining high comfort standards essential for keeping your cast and crew rested and productive.",
                    contentFr: "TFS Film Solutions organise des hébergements adaptés à tout budget de production tout en maintenant des standards de confort élevés.",
                    layout: "left",
                    image: "/images/services/accommodation/moroccan-riad.jpg"
                }
            ],
            tags: ["Hotels", "Riads", "Villas", "Accommodation", "Lodging", "Luxury"],
            features: [
                { icon: "Percent", text: "Preferential production rates", text_fr: "Tarifs préférentiels production" },
                { icon: "Star", text: "Luxury to budget options", text_fr: "Options luxe à économique" },
                { icon: "MapPin", text: "Nationwide coverage", text_fr: "Couverture nationale" }
            ],
            hero_image_path: "/images/services/accommodation/luxury-hotel.jpg"
        },
        // 8. TRANSPORTATION (Enhanced)
        {
            title: "Transportation",
            title_fr: "Transport",
            slug: "transportation",
            icon: "Car",
            type: "content_page",
            brief_description: "Complete ground and air transport solutions for productions.",
            brief_description_fr: "Solutions complètes de transport terrestre et aérien.",
            display_order: 7,
            sections: [
                {
                    type: "hero",
                    title: "Move Your Production",
                    title_fr: "Déplacez Votre Production",
                    description: "Reliable fleet and logistics for seamless crew and equipment movement.",
                    description_fr: "Flotte fiable et logistique pour déplacement fluide équipe et équipement.",
                    background: "/images/services/transportation/hero.jpg"
                },
                {
                    type: "text_image",
                    title: "Diverse Film Production Vehicle Fleet",
                    titleFr: "Flotte Diversifiée de Véhicules de Production",
                    content: "TFS Cinema Solutions provides dependable, budget-efficient transportation solutions with a diverse fleet specifically adapted to the demanding needs of film productions in Morocco.",
                    contentFr: "TFS Cinema Solutions fournit des solutions de transport fiables et économiques avec une flotte diversifiée spécifiquement adaptée aux besoins exigeants des productions.",
                    layout: "right",
                    image: "/images/services/transportation/production-fleet.jpg"
                },
                {
                    type: "text_image",
                    title: "Specialized Off-Road & Remote Access",
                    titleFr: "Accès Spécialisé Hors-Piste et Zones Isolées",
                    content: "For complex film shoots in challenging terrain, TFS Film Solutions coordinates specialized 4x4 vehicles, modified desert transport, and off-road solutions for safe access to Morocco's most remote and spectacular filming locations.",
                    contentFr: "Pour les tournages complexes en terrain difficile, TFS Film Solutions coordonne des véhicules 4x4 spécialisés, transport désertique modifié et solutions hors-piste.",
                    layout: "left",
                    image: "/images/services/transportation/desert-4x4.jpg"
                }
            ],
            tags: ["Transport", "Vehicles", "Logistics", "Fleet", "4x4", "Trucks"],
            features: [
                { icon: "Truck", text: "Diverse vehicle fleet", text_fr: "Flotte de véhicules diverse" },
                { icon: "Navigation", text: "GPS fleet tracking", text_fr: "Suivi GPS de flotte" },
                { icon: "Plane", text: "Air transport coordination", text_fr: "Coordination transport aérien" }
            ],
            hero_image_path: "/images/services/transportation/hero.jpg"
        },
        // 9. CASTING (Enhanced)
        {
            title: "Casting",
            title_fr: "Casting",
            slug: "casting",
            icon: "UserCheck",
            type: "content_page",
            brief_description: "Diverse Moroccan talent for international productions.",
            brief_description_fr: "Talents marocains divers pour productions internationales.",
            display_order: 8,
            sections: [
                {
                    type: "hero",
                    title: "Discover Moroccan Talent",
                    title_fr: "Découvrez les Talents Marocains",
                    description: "A rich diversity of looks and profiles for any character or role.",
                    description_fr: "Une riche diversité de looks et profils pour tout personnage ou rôle.",
                    background: "/images/services/casting/hero.jpg"
                },
                {
                    type: "text_image",
                    title: "Diverse International Talent Pool",
                    titleFr: "Vivier de Talents Internationaux Diversifiés",
                    content: "Morocco's rich multicultural history makes it an exceptional destination for diverse casting requirements. TFS Cinema Solutions accesses a wide range of professional profiles reflecting the region's unique blend of European, Middle Eastern, Berber, and African influences.",
                    contentFr: "L'histoire multiculturelle riche du Maroc en fait une destination exceptionnelle pour des exigences de casting diverses. TFS Cinema Solutions accède à une large gamme de profils professionnels.",
                    layout: "right",
                    image: "/images/services/casting/talent-pool.jpeg"
                },
                {
                    type: "text_image",
                    title: "Professional Audition Management",
                    titleFr: "Gestion d'Auditions Professionnelle",
                    content: "TFS Film Solutions manages the entire casting process for productions filming in Morocco, from initial talent sourcing for background extras to principal role auditions.",
                    contentFr: "TFS Film Solutions gère l'ensemble du processus de casting pour les productions tournant au Maroc, de la recherche initiale de talents pour figurants aux auditions de rôles principaux.",
                    layout: "left",
                    image: "/images/services/casting/auditions.jpg"
                }
            ],
            tags: ["Casting", "Actors", "Extras", "Stunts", "Talent", "Models"],
            features: [
                { icon: "Database", text: "Extensive talent database", text_fr: "Base de talents extensive" },
                { icon: "Video", text: "4K self-tape facility", text_fr: "Studio self-tape 4K" },
                { icon: "Globe", text: "Diverse ethnic looks", text_fr: "Looks ethniques divers" }
            ],
            hero_image_path: "/images/services/casting/hero.jpg"
        },
        // 10. MAKE-UP & HAIR (New)
        {
            title: "Make-up & Hair",
            title_fr: "Maquillage & Coiffure",
            slug: "makeup-hair",
            icon: "Palette",
            type: "content_page",
            brief_description: "TFS provides professional make-up and hair services tailored to the specific demands of film, television, and commercial productions.",
            brief_description_fr: "TFS fournit des services professionnels de maquillage et coiffure adaptés aux exigences spécifiques des productions.",
            display_order: 9,
            sections: [
                {
                    type: "text_image",
                    title: "Experienced Team",
                    title_fr: "Équipe Expérimentée",
                    content: "Our team consists of experienced make-up artists and hair stylists skilled in character design, continuity, and on-set efficiency.",
                    contentFr: "Notre équipe se compose de maquilleurs et coiffeurs expérimentés qualifiés en conception de personnages et continuité.",
                    layout: "left",
                    image: "/images/services/crewing/hero.jpg"
                },
                {
                    type: "text_image",
                    title: "Industry Standards",
                    title_fr: "Standards de l'Industrie",
                    content: "We use high-quality, industry-standard products to ensure durability under demanding shooting conditions, lighting setups, and long production hours.",
                    contentFr: "Nous utilisons des produits de haute qualité aux standards de l'industrie pour assurer la durabilité.",
                    layout: "right",
                    image: "/images/services/crewing/hero.jpg"
                }
            ],
            tags: ["Makeup", "Hair", "Styling", "SFX Makeup", "Continuity"],
            features: [
                { icon: "CheckCircle", text: "Character design experts", text_fr: "Experts en design de personnage" },
                { icon: "Clock", text: "Long-lasting products", text_fr: "Produits longue durée" },
                { icon: "User", text: "On-set efficiency", text_fr: "Efficacité sur plateau" }
            ],
            hero_image_path: "/images/services/crewing/hero.jpg" // Placeholder for now
        },
        // 11. COSTUME & WARDROBE (New)
        {
            title: "Costume & Wardrobe",
            title_fr: "Costume & Garde-robe",
            slug: "costume-wardrobe",
            icon: "Shirt",
            type: "content_page",
            brief_description: "TFS offers comprehensive costume and wardrobe services designed to support the visual identity and storytelling of each production.",
            brief_description_fr: "TFS offre des services complets de costumes et garde-robe conçus pour soutenir l'identité visuelle.",
            display_order: 10,
            sections: [
                {
                    type: "text_image",
                    title: "Design & Sourcing",
                    title_fr: "Design & Sourcing",
                    content: "Our costume department assists with costume design, sourcing, fittings, alterations, and on-set wardrobe management.",
                    contentFr: "Notre département costumes assiste avec la conception, le sourcing, lesessayages et les retouches.",
                    layout: "left",
                    image: "/images/services/crewing/professional-crew.jpg"
                },
                {
                    type: "text_image",
                    title: "Local Partnerships",
                    title_fr: "Partenariats Locaux",
                    content: "Through partnerships with local designers, tailors, and rental houses, TFS provides flexible solutions adapted to creative vision, schedule, and budget.",
                    contentFr: "Grâce à des partenariats avec des designers locaux et tailleurs, TFS fournit des solutions flexibles.",
                    layout: "right",
                    image: "/images/services/crewing/professional-crew.jpg"
                }
            ],
            tags: ["Costume", "Wardrobe", "Period", "Styling", "Tailoring"],
            features: [
                { icon: "Scissors", text: "Custom alterations", text_fr: "Retouches sur mesure" },
                { icon: "Search", text: "Local sourcing", text_fr: "Sourcing local" },
                { icon: "Shirt", text: "Period & contemporary", text_fr: "Époque & contemporain" }
            ],
            hero_image_path: "/images/services/crewing/professional-crew.jpg"
        },
        // 12. PROPS (New)
        {
            title: "Props & Set Dressing",
            title_fr: "Accessoires & Habillage",
            slug: "props-set-dressing",
            icon: "Box",
            type: "content_page",
            brief_description: "TFS supports productions with prop sourcing and set dressing services to enhance authenticity and visual impact.",
            brief_description_fr: "TFS soutient les productions avec le sourcing d'accessoires et l'habillage de plateau.",
            display_order: 11,
            sections: [
                {
                    type: "text_image",
                    title: "Sourcing & Fabrication",
                    title_fr: "Sourcing & Fabrication",
                    content: "From period-accurate objects to custom-made props, our team handles research, acquisition, fabrication, transportation, and on-set coordination.",
                    contentFr: "Des objets d'époque aux accessoires sur mesure, notre équipe gère la recherche et la fabrication.",
                    layout: "left",
                    image: "/images/services/scouting/hero.jpg"
                },
                {
                    type: "text_image",
                    title: "Director's Vision",
                    title_fr: "Vision du Réalisateur",
                    content: "Every detail is carefully selected to align with the director’s vision and production design requirements.",
                    contentFr: "Chaque détail est soigneusement sélectionné pour s'aligner avec la vision du réalisateur.",
                    layout: "right",
                    image: "/images/services/scouting/hero.jpg"
                }
            ],
            tags: ["Props", "Set Dressing", "Fabrication", "Sourcing", "Art"],
            features: [
                { icon: "Search", text: "Authentic sourcing", text_fr: "Sourcing authentique" },
                { icon: "Hammer", text: "Custom fabrication", text_fr: "Fabrication sur mesure" },
                { icon: "Eye", text: "Detail oriented", text_fr: "Souci du détail" }
            ],
            hero_image_path: "/images/services/scouting/hero.jpg"
        },
        // 13. PRODUCTION DESIGN (New)
        {
            title: "Production Design",
            title_fr: "Design de Production",
            slug: "production-design",
            icon: "Paintbrush",
            type: "content_page",
            brief_description: "TFS provides experienced art department professionals to oversee production design and visual coherence across all shooting locations.",
            brief_description_fr: "TFS fournit des professionnels expérimentés pour superviser le design de production.",
            display_order: 12,
            sections: [
                {
                    type: "text_image",
                    title: "Concept to Reality",
                    title_fr: "Du Concept à la Réalité",
                    content: "Our services include concept development, set construction, scenic painting, and location adaptation.",
                    contentFr: "Nos services incluent le développement de concept, la construction de décors et l'adaptation de lieux.",
                    layout: "left",
                    image: "/images/services/scouting/morocco-locations.webp"
                },
                {
                    type: "text_image",
                    title: "Efficiency",
                    title_fr: "Efficacité",
                    content: "We work closely with directors and production designers to ensure each environment supports the narrative while remaining efficient and cost-effective.",
                    contentFr: "Nous travaillons étroitement avec les réalisateurs pour assurer que chaque environnement soutient la narration.",
                    layout: "right",
                    image: "/images/services/scouting/morocco-locations.webp"
                }
            ],
            tags: ["Art Department", "Set Construction", "Scenic", "Design", "Concept"],
            features: [
                { icon: "PenTool", text: "Concept development", text_fr: "Développement de concept" },
                { icon: "Hammer", text: "Set construction", text_fr: "Construction de décors" },
                { icon: "Palette", text: "Scenic painting", text_fr: "Peinture scénique" }
            ],
            hero_image_path: "/images/services/scouting/morocco-locations.webp"
        },
        // 14. SECURITY (New)
        {
            title: "Security & Set Management",
            title_fr: "Sécurité & Gestion de Plateau",
            slug: "security-management",
            icon: "ShieldAlert",
            type: "content_page",
            brief_description: "To ensure smooth and uninterrupted filming, TFS offers professional security and set management services.",
            brief_description_fr: "Pour assurer un tournage fluide, TFS offre des services de sécurité professionnels.",
            display_order: 13,
            sections: [
                {
                    type: "text_image",
                    title: "Set Management",
                    title_fr: "Gestion de Plateau",
                    content: "Our teams coordinate crowd control, equipment protection, access management, and on-location safety—particularly for sensitive or high-profile productions.",
                    contentFr: "Nos équipes coordonnent le contrôle des foules, la protection de l'équipement et la sécurité sur site.",
                    layout: "left",
                    image: "/images/services/transportation/hero.jpg"
                },
                {
                    type: "text_image",
                    title: "Safety Compliance",
                    title_fr: "Conformité Sécurité",
                    content: "All operations are conducted in compliance with local regulations and production safety standards.",
                    contentFr: "Toutes les opérations sont menées en conformité avec les réglementations locales.",
                    layout: "right",
                    image: "/images/services/transportation/hero.jpg"
                }
            ],
            tags: ["Security", "Safety", "Crowd Control", "Access", "Protection"],
            features: [
                { icon: "Shield", text: "Crowd control", text_fr: "Contrôle des foules" },
                { icon: "Lock", text: "Access management", text_fr: "Gestion d'accès" },
                { icon: "FileCheck", text: "Regulatory compliance", text_fr: "Conformité réglementaire" }
            ],
            hero_image_path: "/images/services/transportation/hero.jpg"
        }
    ];

    // --- EXECUTION ---
    SERVICES.forEach(svc => {
        const rec = new Record(servicesCol);

        // Basic fields
        rec.set("title", svc.title);
        rec.set("title_fr", svc.title_fr);
        rec.set("slug", svc.slug);
        rec.set("icon", svc.icon);
        rec.set("type", svc.type);
        if (svc.target_url) rec.set("target_url", svc.target_url);

        rec.set("brief_description", svc.brief_description);
        rec.set("brief_description_fr", svc.brief_description_fr);

        rec.set("display_order", svc.display_order);
        rec.set("is_active", true); // Force active

        // JSON fields (auto-serialized)
        rec.set("sections", svc.sections);
        rec.set("tags", svc.tags);
        rec.set("features", svc.features);

        // Image Attachment
        if (svc.hero_image_path) {
            const imgFile = loadImage(svc.hero_image_path);
            if (imgFile) {
                rec.set("hero_image", imgFile);
            }
        }

        app.save(rec);
        console.log(`✅ Restored: ${svc.title}`);
    });

}, (app) => {
    // Rollback: Not implemented for restore scripts usually
});
