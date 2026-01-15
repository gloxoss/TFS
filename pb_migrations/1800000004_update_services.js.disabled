/// <reference path="../pb_data/types.d.ts" />
/**
 * Update TFS Services with Complete Section Data
 */
migrate((app) => {
    // Delete all existing services
    try {
        const existing = app.findRecordsByFilter("services", "id != ''", "", 50, 0);
        existing.forEach(rec => {
            try { app.delete(rec); } catch { }
        });
        console.log("[Update] Deleted existing services");
    } catch (e) {
        console.log("[Update] No existing services to delete");
    }

    const servicesCol = app.findCollectionByNameOrId("services");

    const SERVICES = [
        // 1. EQUIPMENT HIRE
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
            is_active: true,
            sections: [
                {
                    type: "hero",
                    title: "World-Class Cinema Equipment",
                    title_fr: "Équipement Cinéma de Classe Mondiale",
                    description: "Access Morocco's largest inventory of professional cinema cameras, lenses, lighting, and grip equipment.",
                    description_fr: "Accédez au plus grand inventaire marocain de caméras, objectifs, éclairage et équipement de grip.",
                    background: "gradient-dark"
                },
                {
                    type: "what_we_offer",
                    title: "What We Offer",
                    title_fr: "Ce Que Nous Offrons",
                    description: "Comprehensive solutions for your production needs.",
                    description_fr: "Solutions complètes pour vos besoins de production.",
                    items: [
                        { number: "01", title: "Premium Cameras", title_fr: "Caméras Premium", description: "ARRI Alexa 35, Sony Venice 2, RED V-Raptor, and more high-end cinema cameras.", description_fr: "ARRI Alexa 35, Sony Venice 2, RED V-Raptor et caméras cinéma haut de gamme." },
                        { number: "02", title: "Lens Collections", title_fr: "Collections d'Objectifs", description: "Cooke S8/i, Zeiss Supreme, Atlas Orion anamorphic, and vintage rehoused primes.", description_fr: "Cooke S8/i, Zeiss Supreme, Atlas Orion anamorphiques et optiques vintage." },
                        { number: "03", title: "Lighting & Grip", title_fr: "Éclairage & Machinerie", description: "ARRI SkyPanels, Creamsource, HMIs, and complete grip packages.", description_fr: "ARRI SkyPanels, Creamsource, HMI et packages grip complets." }
                    ]
                },
                {
                    type: "features",
                    title: "Why Choose TFS Equipment",
                    title_fr: "Pourquoi Choisir TFS",
                    items: [
                        { icon: "Wrench", title: "On-Set Support", title_fr: "Support Plateau", description: "Experienced technicians available 24/7", description_fr: "Techniciens expérimentés 24h/24" },
                        { icon: "Truck", title: "Delivery Service", title_fr: "Service Livraison", description: "Direct delivery anywhere in Morocco", description_fr: "Livraison directe partout au Maroc" },
                        { icon: "Shield", title: "Full Insurance", title_fr: "Assurance Complète", description: "Comprehensive coverage included", description_fr: "Couverture complète incluse" }
                    ]
                }
            ],
            stats: [
                { value: "500+", label: "Equipment Items", label_fr: "Équipements" },
                { value: "24/7", label: "Technical Support", label_fr: "Support Technique" },
                { value: "100+", label: "Productions Served", label_fr: "Productions Servies" },
                { value: "15+", label: "Years Experience", label_fr: "Années d'Expérience" }
            ],
            tags: ["Cameras", "Lenses", "Lighting", "Grip", "ARRI", "RED", "Sony"],
            features: [
                { icon: "CheckCircle", text: "Latest cinema cameras", text_fr: "Dernières caméras cinéma" },
                { icon: "CheckCircle", text: "Premium lens collections", text_fr: "Collections d'objectifs premium" },
                { icon: "CheckCircle", text: "On-set technical support", text_fr: "Support technique sur plateau" }
            ]
        },

        // 2. FILM SHIPPING
        {
            title: "Film Shipping & Customs",
            title_fr: "Expédition & Douanes",
            slug: "film-shipping",
            icon: "Truck",
            type: "content_page",
            brief_description: "Expert customs clearance and international shipping for film equipment.",
            brief_description_fr: "Dédouanement expert et expédition internationale d'équipements.",
            full_description: "<p>Professional shipping coordination with complete customs clearance.</p>",
            full_description_fr: "<p>Coordination d'expédition professionnelle avec dédouanement complet.</p>",
            display_order: 1,
            is_active: true,
            sections: [
                {
                    type: "hero",
                    title: "Seamless Global Film Logistics",
                    title_fr: "Logistique Cinéma Mondiale Sans Faille",
                    description: "From any corner of the world to Morocco, we handle your equipment with care and precision.",
                    description_fr: "De n'importe où dans le monde vers le Maroc, nous gérons votre équipement avec soin.",
                    background: "gradient-blue"
                },
                {
                    type: "what_we_offer",
                    title: "What We Offer",
                    title_fr: "Ce Que Nous Offrons",
                    description: "End-to-end logistics solutions for film productions.",
                    description_fr: "Solutions logistiques de bout en bout pour les productions.",
                    items: [
                        { number: "01", title: "Customs Clearance", title_fr: "Dédouanement", description: "Fast and efficient port and airport clearance with direct authority relationships.", description_fr: "Dédouanement rapide et efficace avec relations directes aux autorités." },
                        { number: "02", title: "ATA Carnet Processing", title_fr: "Traitement Carnet ATA", description: "Complete temporary import/export documentation for international productions.", description_fr: "Documentation complète d'import/export temporaire." },
                        { number: "03", title: "Sensitive Shipments", title_fr: "Expéditions Sensibles", description: "Specialized handling for high-value cameras, vehicles, and regulated materials.", description_fr: "Manutention spécialisée pour équipements de haute valeur." }
                    ]
                },
                {
                    type: "process",
                    title: "Our Shipping Process",
                    title_fr: "Notre Processus",
                    steps: [
                        { number: 1, title: "Inventory", title_fr: "Inventaire", description: "Detailed manifest preparation", description_fr: "Préparation du manifeste" },
                        { number: 2, title: "Documentation", title_fr: "Documentation", description: "ATA Carnet and customs forms", description_fr: "Carnet ATA et formulaires" },
                        { number: 3, title: "Transit", title_fr: "Transit", description: "Real-time tracking", description_fr: "Suivi en temps réel" },
                        { number: 4, title: "Delivery", title_fr: "Livraison", description: "Direct to set", description_fr: "Direct sur plateau" }
                    ]
                }
            ],
            stats: [
                { value: "200+", label: "Shipments Cleared", label_fr: "Expéditions Dédouanées" },
                { value: "48h", label: "Average Clearance", label_fr: "Délai Moyen" },
                { value: "0", label: "Lost Equipment", label_fr: "Équipement Perdu" },
                { value: "100%", label: "Compliance Rate", label_fr: "Taux Conformité" }
            ],
            tags: ["Customs", "Logistics", "Import", "Export", "Carnet ATA"],
            features: [
                { icon: "Shield", text: "Full insurance coverage", text_fr: "Assurance complète" },
                { icon: "Clock", text: "24/7 tracking", text_fr: "Suivi 24h/24" },
                { icon: "FileCheck", text: "Complete documentation", text_fr: "Documentation complète" }
            ]
        },

        // 3. FILM PERMITS
        {
            title: "Film Permits",
            title_fr: "Autorisations de Tournage",
            slug: "film-permits",
            icon: "FileCheck",
            type: "content_page",
            brief_description: "Official filming authorizations through CCM and Moroccan authorities.",
            brief_description_fr: "Autorisations officielles via le CCM et autorités marocaines.",
            full_description: "<p>Direct partnership with CCM for seamless permit acquisition.</p>",
            full_description_fr: "<p>Partenariat direct avec le CCM pour permis sans accroc.</p>",
            display_order: 2,
            is_active: true,
            sections: [
                {
                    type: "hero",
                    title: "Your Gateway to Filming in Morocco",
                    title_fr: "Votre Passerelle pour Tourner au Maroc",
                    description: "Direct CCM partnership for seamless permit acquisition, regardless of project complexity.",
                    description_fr: "Partenariat CCM direct pour permis sans accroc, quelle que soit la complexité.",
                    background: "gradient-gold"
                },
                {
                    type: "what_we_offer",
                    title: "What We Offer",
                    title_fr: "Ce Que Nous Offrons",
                    description: "Comprehensive permit services for any production requirement.",
                    description_fr: "Services de permis complets pour toute exigence.",
                    items: [
                        { number: "01", title: "General Filming Permits", title_fr: "Permis Généraux", description: "Standard authorizations for commercial, feature film, documentary, and TV.", description_fr: "Autorisations pour productions commerciales, longs métrages, documentaires et TV." },
                        { number: "02", title: "Special Location Access", title_fr: "Accès Lieux Spéciaux", description: "Historic sites, government buildings, military zones, and restricted areas.", description_fr: "Sites historiques, bâtiments gouvernementaux, zones militaires." },
                        { number: "03", title: "Drone & Aerial Permits", title_fr: "Permis Drone", description: "Aviation authority coordination for drone filming and helicopter shots.", description_fr: "Coordination aviation civile pour drone et hélicoptère." }
                    ]
                },
                {
                    type: "process",
                    title: "Our Permit Process",
                    title_fr: "Notre Processus",
                    steps: [
                        { number: 1, title: "Submit Request", title_fr: "Demande", description: "Share locations and dates", description_fr: "Partagez lieux et dates" },
                        { number: 2, title: "CCM Liaison", title_fr: "Liaison CCM", description: "Authority coordination", description_fr: "Coordination autorités" },
                        { number: 3, title: "Processing", title_fr: "Traitement", description: "Fast-track available", description_fr: "Voie rapide disponible" },
                        { number: 4, title: "Delivery", title_fr: "Livraison", description: "Official documents ready", description_fr: "Documents officiels prêts" }
                    ]
                }
            ],
            stats: [
                { value: "100%", label: "Success Rate", label_fr: "Taux Réussite" },
                { value: "72h", label: "Fast Track", label_fr: "Voie Rapide" },
                { value: "15+", label: "Years with CCM", label_fr: "Années CCM" },
                { value: "500+", label: "Permits Obtained", label_fr: "Permis Obtenus" }
            ],
            tags: ["CCM", "Permits", "Authorization", "Government", "Locations"],
            features: [
                { icon: "BadgeCheck", text: "Official CCM partner", text_fr: "Partenaire CCM officiel" },
                { icon: "Zap", text: "Fast-track processing", text_fr: "Traitement accéléré" },
                { icon: "Globe", text: "Any location in Morocco", text_fr: "Tout lieu au Maroc" }
            ]
        },

        // 4. CREWING
        {
            title: "Film Crewing",
            title_fr: "Équipes de Tournage",
            slug: "crewing",
            icon: "Users",
            type: "content_page",
            brief_description: "Access Morocco's finest film professionals with international experience.",
            brief_description_fr: "Accédez aux meilleurs professionnels du cinéma marocain.",
            full_description: "<p>Multilingual crews for seamless international production collaboration.</p>",
            full_description_fr: "<p>Équipes multilingues pour collaboration internationale fluide.</p>",
            display_order: 3,
            is_active: true,
            sections: [
                {
                    type: "hero",
                    title: "World-Class Moroccan Film Talent",
                    title_fr: "Talents Cinéma Marocains de Classe Mondiale",
                    description: "Multilingual crews for seamless collaboration on international productions.",
                    description_fr: "Équipes multilingues pour collaboration fluide sur productions internationales.",
                    background: "gradient-purple"
                },
                {
                    type: "what_we_offer",
                    title: "What We Offer",
                    title_fr: "Ce Que Nous Offrons",
                    description: "Complete crew solutions for every department.",
                    description_fr: "Solutions d'équipe complètes pour chaque département.",
                    items: [
                        { number: "01", title: "Camera & Lighting", title_fr: "Caméra & Éclairage", description: "Experienced DOPs, camera operators, gaffers, and electricians with Hollywood credits.", description_fr: "DOPs, opérateurs caméra, chefs électriciens avec crédits Hollywood." },
                        { number: "02", title: "Art & Construction", title_fr: "Décors & Construction", description: "Production designers, art directors, and skilled set builders for any scale.", description_fr: "Chefs décorateurs, directeurs artistiques et constructeurs qualifiés." },
                        { number: "03", title: "Stunts & SFX", title_fr: "Cascades & Effets", description: "Professional stunt coordinators and special effects teams for action sequences.", description_fr: "Coordinateurs cascades et équipes effets spéciaux pour l'action." }
                    ]
                },
                {
                    type: "departments",
                    title: "All Departments Covered",
                    title_fr: "Tous Départements Couverts",
                    items: ["Camera", "Lighting", "Grip", "Art", "Wardrobe", "Makeup", "Sound", "Stunts", "VFX", "Production"]
                }
            ],
            stats: [
                { value: "500+", label: "Crew Members", label_fr: "Membres Équipe" },
                { value: "5", label: "Languages", label_fr: "Langues" },
                { value: "50+", label: "International Projects", label_fr: "Projets Internationaux" },
                { value: "12", label: "Departments", label_fr: "Départements" }
            ],
            tags: ["Crew", "Technicians", "Camera", "Lighting", "Art", "Stunts"],
            features: [
                { icon: "Languages", text: "Arabic, French, English, Spanish", text_fr: "Arabe, Français, Anglais, Espagnol" },
                { icon: "Award", text: "Award-winning professionals", text_fr: "Professionnels primés" },
                { icon: "Users", text: "All departments covered", text_fr: "Tous départements couverts" }
            ]
        },

        // 5. SCOUTING
        {
            title: "Location Scouting",
            title_fr: "Repérage des Lieux",
            slug: "scouting",
            icon: "MapPin",
            type: "content_page",
            brief_description: "Discover Morocco's cinematic landscapes for your next production.",
            brief_description_fr: "Découvrez les paysages cinématographiques du Maroc.",
            full_description: "<p>Curated location selections that match your creative vision.</p>",
            full_description_fr: "<p>Sélections de lieux correspondant à votre vision créative.</p>",
            display_order: 4,
            is_active: true,
            sections: [
                {
                    type: "hero",
                    title: "Morocco: A World of Locations",
                    title_fr: "Maroc: Un Monde de Lieux",
                    description: "From ancient medinas to Sahara dunes, find the perfect backdrop for your vision.",
                    description_fr: "Des médinas anciennes aux dunes du Sahara, trouvez le décor parfait.",
                    background: "gradient-orange"
                },
                {
                    type: "what_we_offer",
                    title: "What We Offer",
                    title_fr: "Ce Que Nous Offrons",
                    description: "Comprehensive location services tailored to your production.",
                    description_fr: "Services de repérage complets adaptés à votre production.",
                    items: [
                        { number: "01", title: "Desert & Mountains", title_fr: "Désert & Montagnes", description: "Sahara dunes, Atlas peaks, and dramatic landscapes that have doubled for Mars and Egypt.", description_fr: "Dunes du Sahara, sommets de l'Atlas, paysages doublant Mars et l'Égypte." },
                        { number: "02", title: "Historic Sites", title_fr: "Sites Historiques", description: "Authentic kasbahs, ancient medinas, and UNESCO sites for period productions.", description_fr: "Kasbahs authentiques, médinas anciennes et sites UNESCO." },
                        { number: "03", title: "Modern & Urban", title_fr: "Moderne & Urbain", description: "Contemporary architecture, cosmopolitan cities, and studio facilities.", description_fr: "Architecture contemporaine, villes cosmopolites et studios." }
                    ]
                },
                {
                    type: "gallery",
                    title: "Featured Locations",
                    title_fr: "Lieux en Vedette",
                    categories: [
                        { name: "Desert", name_fr: "Désert", description: "Sahara, Merzouga, Zagora" },
                        { name: "Mountains", name_fr: "Montagnes", description: "Atlas, Ouarzazate" },
                        { name: "Cities", name_fr: "Villes", description: "Marrakech, Casablanca, Fes" },
                        { name: "Coastal", name_fr: "Côtier", description: "Essaouira, Tangier" }
                    ]
                }
            ],
            stats: [
                { value: "1000+", label: "Locations", label_fr: "Lieux" },
                { value: "12", label: "Regions", label_fr: "Régions" },
                { value: "48h", label: "Scout Turnaround", label_fr: "Délai Repérage" },
                { value: "HD", label: "Photo Library", label_fr: "Photothèque" }
            ],
            tags: ["Locations", "Desert", "Medina", "Mountains", "Coastal"],
            features: [
                { icon: "Image", text: "Extensive photo library", text_fr: "Bibliothèque photo extensive" },
                { icon: "Map", text: "GPS-tagged locations", text_fr: "Lieux géolocalisés GPS" },
                { icon: "FileImage", text: "HD scout reports", text_fr: "Rapports repérage HD" }
            ]
        },

        // 6. CATERING
        {
            title: "Film Catering",
            title_fr: "Restauration de Plateau",
            slug: "catering",
            icon: "Utensils",
            type: "content_page",
            brief_description: "Professional on-set catering with fresh, locally-sourced ingredients.",
            brief_description_fr: "Restauration professionnelle avec ingrédients frais et locaux.",
            full_description: "<p>Quality meals that keep your crew energized throughout the shoot.</p>",
            full_description_fr: "<p>Repas de qualité pour garder votre équipe énergisée.</p>",
            display_order: 5,
            is_active: true,
            sections: [
                {
                    type: "hero",
                    title: "Fuel Your Production",
                    title_fr: "Alimentez Votre Production",
                    description: "Quality meals that keep your crew energized and focused throughout the shoot.",
                    description_fr: "Repas de qualité pour garder votre équipe énergisée et concentrée.",
                    background: "gradient-green"
                },
                {
                    type: "what_we_offer",
                    title: "What We Offer",
                    title_fr: "Ce Que Nous Offrons",
                    description: "Flexible catering solutions for any production size.",
                    description_fr: "Solutions de restauration flexibles pour toute production.",
                    items: [
                        { number: "01", title: "Full Crew Meals", title_fr: "Repas Complets", description: "Breakfast, lunch, and dinner with varied daily menus featuring local and international cuisine.", description_fr: "Petit-déjeuner, déjeuner et dîner avec menus variés cuisine locale et internationale." },
                        { number: "02", title: "Craft Services", title_fr: "Services Craft", description: "All-day snacks, beverages, and refreshments to keep energy levels high.", description_fr: "Collations, boissons et rafraîchissements toute la journée." },
                        { number: "03", title: "Special Dietary", title_fr: "Régimes Spéciaux", description: "Vegan, vegetarian, halal, kosher, and allergy-conscious options for every meal.", description_fr: "Options végane, végétarien, halal, casher et allergies." }
                    ]
                },
                {
                    type: "features",
                    title: "Our Standards",
                    title_fr: "Nos Standards",
                    items: [
                        { icon: "Leaf", title: "Fresh Daily", title_fr: "Frais Quotidien", description: "Ingredients from local markets", description_fr: "Ingrédients des marchés locaux" },
                        { icon: "Shield", title: "A+ Hygiene", title_fr: "Hygiène A+", description: "Strict food safety protocols", description_fr: "Protocoles sécurité alimentaire" },
                        { icon: "Truck", title: "Mobile Kitchen", title_fr: "Cuisine Mobile", description: "Service in remote locations", description_fr: "Service en lieux isolés" }
                    ]
                }
            ],
            stats: [
                { value: "5000+", label: "Meals Daily", label_fr: "Repas par Jour" },
                { value: "100%", label: "Local Ingredients", label_fr: "Ingrédients Locaux" },
                { value: "A+", label: "Hygiene Rating", label_fr: "Note Hygiène" },
                { value: "24/7", label: "Service", label_fr: "Service" }
            ],
            tags: ["Catering", "Food", "Craft Services", "Meals", "Halal"],
            features: [
                { icon: "Leaf", text: "Fresh daily ingredients", text_fr: "Ingrédients frais" },
                { icon: "Heart", text: "All dietary needs", text_fr: "Besoins alimentaires" },
                { icon: "Truck", text: "Mobile kitchen", text_fr: "Cuisine mobile" }
            ]
        },

        // 7. ACCOMMODATION
        {
            title: "Accommodation",
            title_fr: "Hébergement",
            slug: "accommodation",
            icon: "Hotel",
            type: "content_page",
            brief_description: "Premium crew accommodations at preferential production rates.",
            brief_description_fr: "Hébergements premium à tarifs préférentiels production.",
            full_description: "<p>From luxury hotels to private villas across Morocco.</p>",
            full_description_fr: "<p>Des hôtels de luxe aux villas privées à travers le Maroc.</p>",
            display_order: 6,
            is_active: true,
            sections: [
                {
                    type: "hero",
                    title: "Rest in Comfort",
                    title_fr: "Reposez-vous Confortablement",
                    description: "Premium accommodations nationwide with significant production discounts.",
                    description_fr: "Hébergements premium nationaux avec remises production significatives.",
                    background: "gradient-indigo"
                },
                {
                    type: "what_we_offer",
                    title: "What We Offer",
                    title_fr: "Ce Que Nous Offrons",
                    description: "Accommodation solutions for any budget and requirement.",
                    description_fr: "Solutions d'hébergement pour tout budget et exigence.",
                    items: [
                        { number: "01", title: "Luxury Hotels", title_fr: "Hôtels de Luxe", description: "5-star international chains and boutique properties with preferential rates.", description_fr: "Chaînes 5 étoiles et propriétés boutique à tarifs préférentiels." },
                        { number: "02", title: "Traditional Riads", title_fr: "Riads Traditionnels", description: "Authentic Moroccan guesthouses with character for smaller crews.", description_fr: "Maisons d'hôtes marocaines authentiques pour petites équipes." },
                        { number: "03", title: "Private Villas", title_fr: "Villas Privées", description: "Exclusive estates for talent, production offices, or long-term stays.", description_fr: "Domaines exclusifs pour talents, bureaux production ou séjours longs." }
                    ]
                },
                {
                    type: "features",
                    title: "Booking Benefits",
                    title_fr: "Avantages Réservation",
                    items: [
                        { icon: "Percent", title: "30% Savings", title_fr: "30% Économies", description: "Through our partnerships", description_fr: "Via nos partenariats" },
                        { icon: "Clock", title: "Flexible Terms", title_fr: "Conditions Flexibles", description: "Production-friendly policies", description_fr: "Politiques adaptées production" },
                        { icon: "MapPin", title: "Nationwide", title_fr: "National", description: "All filming regions", description_fr: "Toutes régions de tournage" }
                    ]
                }
            ],
            stats: [
                { value: "50+", label: "Partner Hotels", label_fr: "Hôtels Partenaires" },
                { value: "30%", label: "Average Savings", label_fr: "Économies Moyennes" },
                { value: "12", label: "Cities", label_fr: "Villes" },
                { value: "1000+", label: "Rooms Booked", label_fr: "Chambres Réservées" }
            ],
            tags: ["Hotels", "Riads", "Villas", "Accommodation"],
            features: [
                { icon: "Percent", text: "Preferential rates", text_fr: "Tarifs préférentiels" },
                { icon: "Star", text: "Luxury to budget", text_fr: "Luxe à économique" },
                { icon: "MapPin", text: "Nationwide coverage", text_fr: "Couverture nationale" }
            ]
        },

        // 8. TRANSPORTATION
        {
            title: "Transportation",
            title_fr: "Transport",
            slug: "transportation",
            icon: "Car",
            type: "content_page",
            brief_description: "Complete ground and air transport solutions for productions.",
            brief_description_fr: "Solutions complètes de transport terrestre et aérien.",
            full_description: "<p>Reliable fleet and logistics for any production need.</p>",
            full_description_fr: "<p>Flotte fiable et logistique pour tout besoin de production.</p>",
            display_order: 7,
            is_active: true,
            sections: [
                {
                    type: "hero",
                    title: "Move Your Production",
                    title_fr: "Déplacez Votre Production",
                    description: "Reliable fleet and logistics for seamless crew and equipment movement.",
                    description_fr: "Flotte fiable pour déplacement fluide équipe et équipement.",
                    background: "gradient-red"
                },
                {
                    type: "what_we_offer",
                    title: "What We Offer",
                    title_fr: "Ce Que Nous Offrons",
                    description: "Comprehensive transport services for any production need.",
                    description_fr: "Services de transport complets pour tout besoin.",
                    items: [
                        { number: "01", title: "Crew Transport", title_fr: "Transport Équipe", description: "Air-conditioned vans and buses for comfortable crew movement.", description_fr: "Vans et bus climatisés pour déplacement confortable." },
                        { number: "02", title: "Equipment Trucks", title_fr: "Camions Équipement", description: "Specialized grip trucks, generators, and equipment transport.", description_fr: "Camions grip, générateurs et transport équipement." },
                        { number: "03", title: "4x4 & Specialty", title_fr: "4x4 & Spécialité", description: "Desert-ready vehicles, camera cars for any terrain.", description_fr: "Véhicules désert, voitures caméra pour tout terrain." }
                    ]
                },
                {
                    type: "fleet",
                    title: "Our Fleet",
                    title_fr: "Notre Flotte",
                    vehicles: [
                        { type: "Passenger Vans", type_fr: "Vans", count: "25+" },
                        { type: "Crew Buses", type_fr: "Bus", count: "10+" },
                        { type: "4x4 Vehicles", type_fr: "4x4", count: "20+" },
                        { type: "Equipment Trucks", type_fr: "Camions", count: "15+" }
                    ]
                }
            ],
            stats: [
                { value: "100+", label: "Vehicles", label_fr: "Véhicules" },
                { value: "24/7", label: "Dispatch", label_fr: "Dispatch" },
                { value: "GPS", label: "Tracking", label_fr: "Suivi" },
                { value: "0", label: "Breakdowns", label_fr: "Pannes" }
            ],
            tags: ["Transport", "Vehicles", "Logistics", "Fleet", "4x4"],
            features: [
                { icon: "Truck", text: "Diverse fleet", text_fr: "Flotte diverse" },
                { icon: "Navigation", text: "GPS tracking", text_fr: "Suivi GPS" },
                { icon: "Plane", text: "Air transport", text_fr: "Transport aérien" }
            ]
        },

        // 9. CASTING
        {
            title: "Casting",
            title_fr: "Casting",
            slug: "casting",
            icon: "UserCheck",
            type: "content_page",
            brief_description: "Diverse Moroccan talent for international productions.",
            brief_description_fr: "Talents marocains divers pour productions internationales.",
            full_description: "<p>A rich diversity of looks and profiles for any role.</p>",
            full_description_fr: "<p>Une riche diversité de looks et profils pour tout rôle.</p>",
            display_order: 8,
            is_active: true,
            sections: [
                {
                    type: "hero",
                    title: "Discover Moroccan Talent",
                    title_fr: "Découvrez les Talents Marocains",
                    description: "A rich diversity of looks and profiles for any character or role.",
                    description_fr: "Une riche diversité de looks et profils pour tout personnage.",
                    background: "gradient-pink"
                },
                {
                    type: "what_we_offer",
                    title: "What We Offer",
                    title_fr: "Ce Que Nous Offrons",
                    description: "Complete casting services with professional facilities.",
                    description_fr: "Services de casting complets avec installations professionnelles.",
                    items: [
                        { number: "01", title: "Professional Actors", title_fr: "Acteurs Pro", description: "Trained actors with international credits, multilingual.", description_fr: "Acteurs formés avec crédits internationaux, multilingues." },
                        { number: "02", title: "Stunt Performers", title_fr: "Cascadeurs", description: "Skilled stunt coordinators, martial artists, and action performers.", description_fr: "Coordinateurs cascades qualifiés et artistes martiaux." },
                        { number: "03", title: "Extras & Background", title_fr: "Figurants", description: "Large database of extras with diverse looks for any scene.", description_fr: "Grande base de figurants avec looks divers." }
                    ]
                },
                {
                    type: "talent_categories",
                    title: "Talent Categories",
                    title_fr: "Catégories Talents",
                    categories: [
                        { name: "Actors", name_fr: "Acteurs", count: "500+" },
                        { name: "Stunts", name_fr: "Cascades", count: "100+" },
                        { name: "Models", name_fr: "Mannequins", count: "300+" },
                        { name: "Extras", name_fr: "Figurants", count: "10,000+" }
                    ]
                }
            ],
            stats: [
                { value: "10,000+", label: "Talent Database", label_fr: "Base Talents" },
                { value: "4K", label: "Self-Tape", label_fr: "Self-Tape" },
                { value: "48h", label: "Tape Delivery", label_fr: "Livraison" },
                { value: "5", label: "Languages", label_fr: "Langues" }
            ],
            tags: ["Casting", "Actors", "Extras", "Stunts", "Talent"],
            features: [
                { icon: "Database", text: "Talent database", text_fr: "Base de talents" },
                { icon: "Video", text: "4K self-tape", text_fr: "Self-tape 4K" },
                { icon: "Globe", text: "Diverse looks", text_fr: "Looks divers" }
            ]
        }
    ];

    SERVICES.forEach(svc => {
        const rec = new Record(servicesCol);
        Object.keys(svc).forEach(key => {
            rec.set(key, svc[key]);
        });
        app.save(rec);
        console.log(`[Seed] Created: ${svc.title}`);
    });

    console.log("[Migration] Complete: 9 TFS Services with full sections");
}, (app) => { });
