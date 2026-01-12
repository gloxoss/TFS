/// <reference path="../pb_data/types.d.ts" />
/**
 * TFS Services - Complete Content with Full Sections
 * 
 * Each service has:
 * - Hero section with title, description, background
 * - What We Offer section with 3 items
 * - Features/Process section
 * - Stats section (already in stats field)
 */
migrate((app) => {
    const servicesCol = app.findCollectionByNameOrId("services");

    // First, delete existing services to replace with complete data
    try {
        const existing = app.findRecordsByFilter("services", "id != ''", "", 50);
        existing.forEach(rec => {
            try { app.delete(rec); } catch { }
        });
    } catch { }

    const SERVICES = [
        // =====================================================================
        // 1. EQUIPMENT HIRE
        // =====================================================================
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
                        {
                            number: "01",
                            title: "Premium Cameras",
                            title_fr: "Caméras Premium",
                            description: "ARRI Alexa 35, Sony Venice 2, RED V-Raptor, and more high-end cinema cameras ready for your production.",
                            description_fr: "ARRI Alexa 35, Sony Venice 2, RED V-Raptor et plus de caméras cinéma haut de gamme."
                        },
                        {
                            number: "02",
                            title: "Lens Collections",
                            title_fr: "Collections d'Objectifs",
                            description: "Cooke S8/i, Zeiss Supreme, Atlas Orion anamorphic, and vintage rehoused primes and zooms.",
                            description_fr: "Cooke S8/i, Zeiss Supreme, Atlas Orion anamorphiques et optiques vintage."
                        },
                        {
                            number: "03",
                            title: "Lighting & Grip",
                            title_fr: "Éclairage & Machinerie",
                            description: "ARRI SkyPanels, Creamsource, HMIs, and complete grip packages including dollies and cranes.",
                            description_fr: "ARRI SkyPanels, Creamsource, HMI et packages grip complets incluant dollies et grues."
                        }
                    ]
                },
                {
                    type: "features",
                    title: "Why Choose TFS Equipment",
                    title_fr: "Pourquoi Choisir TFS Équipement",
                    items: [
                        { icon: "Wrench", title: "On-Set Support", title_fr: "Support sur Plateau", description: "Experienced technicians available 24/7", description_fr: "Techniciens expérimentés disponibles 24h/24" },
                        { icon: "Truck", title: "Delivery Service", title_fr: "Service de Livraison", description: "Direct delivery to any location in Morocco", description_fr: "Livraison directe partout au Maroc" },
                        { icon: "Shield", title: "Full Insurance", title_fr: "Assurance Complète", description: "Comprehensive coverage for peace of mind", description_fr: "Couverture complète pour votre tranquillité" }
                    ]
                }
            ],
            stats: [
                { value: "500+", label: "Equipment Items", label_fr: "Équipements" },
                { value: "24/7", label: "Technical Support", label_fr: "Support Technique" },
                { value: "100+", label: "Productions Served", label_fr: "Productions Servies" },
                { value: "15+", label: "Years Experience", label_fr: "Années d'Expérience" }
            ],
            tags: ["Cameras", "Lenses", "Lighting", "Grip", "Support", "ARRI", "RED", "Sony"],
            features: [
                { icon: "CheckCircle", text: "Latest cinema cameras", text_fr: "Dernières caméras cinéma" },
                { icon: "CheckCircle", text: "Premium lens collections", text_fr: "Collections d'objectifs premium" },
                { icon: "CheckCircle", text: "On-set technical support", text_fr: "Support technique sur plateau" }
            ]
        },

        // =====================================================================
        // 2. FILM SHIPPING & CUSTOMS
        // =====================================================================
        {
            title: "Film Shipping & Customs",
            title_fr: "Expédition & Douanes",
            slug: "film-shipping",
            icon: "Truck",
            type: "content_page",
            brief_description: "Expert customs clearance and international shipping for film equipment.",
            brief_description_fr: "Dédouanement expert et expédition internationale d'équipements.",
            full_description: "<p>Our production shipping division is managed by highly experienced coordinators with strong backgrounds in servicing major international film productions.</p>",
            full_description_fr: "<p>Notre division d'expédition est gérée par des coordinateurs expérimentés dans les grandes productions internationales.</p>",
            display_order: 1,
            is_active: true,
            sections: [
                {
                    type: "hero",
                    title: "Seamless Global Film Logistics",
                    title_fr: "Logistique Cinématographique Mondiale Sans Faille",
                    description: "From any corner of the world to Morocco, we handle your equipment with care and precision.",
                    description_fr: "De n'importe quel coin du monde vers le Maroc, nous gérons votre équipement avec soin et précision.",
                    background: "gradient-blue"
                },
                {
                    type: "what_we_offer",
                    title: "What We Offer",
                    title_fr: "Ce Que Nous Offrons",
                    description: "End-to-end logistics solutions for film productions.",
                    description_fr: "Solutions logistiques de bout en bout pour les productions.",
                    items: [
                        {
                            number: "01",
                            title: "Customs Clearance",
                            title_fr: "Dédouanement",
                            description: "Fast and efficient port and airport clearance with direct relationships to Moroccan authorities.",
                            description_fr: "Dédouanement rapide et efficace aux ports et aéroports avec relations directes aux autorités."
                        },
                        {
                            number: "02",
                            title: "ATA Carnet Processing",
                            title_fr: "Traitement Carnet ATA",
                            description: "Complete temporary import/export documentation handling for international productions.",
                            description_fr: "Gestion complète des documents d'import/export temporaire pour productions internationales."
                        },
                        {
                            number: "03",
                            title: "Sensitive Shipments",
                            title_fr: "Expéditions Sensibles",
                            description: "Specialized handling for high-value cameras, vehicles, and regulated materials.",
                            description_fr: "Manutention spécialisée pour caméras de haute valeur, véhicules et matériaux réglementés."
                        }
                    ]
                },
                {
                    type: "process",
                    title: "Our Shipping Process",
                    title_fr: "Notre Processus d'Expédition",
                    steps: [
                        { number: 1, title: "Equipment Inventory", title_fr: "Inventaire Équipement", description: "Detailed manifest preparation", description_fr: "Préparation du manifeste détaillé" },
                        { number: 2, title: "Documentation", title_fr: "Documentation", description: "ATA Carnet and customs forms", description_fr: "Carnet ATA et formulaires douaniers" },
                        { number: 3, title: "Transit Management", title_fr: "Gestion Transit", description: "Real-time tracking and updates", description_fr: "Suivi en temps réel et mises à jour" },
                        { number: 4, title: "Delivery", title_fr: "Livraison", description: "Direct to set or warehouse", description_fr: "Direct sur plateau ou entrepôt" }
                    ]
                }
            ],
            stats: [
                { value: "200+", label: "Shipments Cleared", label_fr: "Expéditions Dédouanées" },
                { value: "48h", label: "Average Clearance", label_fr: "Délai Moyen" },
                { value: "0", label: "Lost Equipment", label_fr: "Équipement Perdu" },
                { value: "100%", label: "Compliance Rate", label_fr: "Taux de Conformité" }
            ],
            tags: ["Customs", "Logistics", "Import", "Export", "Carnet ATA", "Shipping"],
            features: [
                { icon: "Shield", text: "Full insurance coverage", text_fr: "Couverture d'assurance complète" },
                { icon: "Clock", text: "24/7 tracking", text_fr: "Suivi 24h/24" },
                { icon: "FileCheck", text: "Complete documentation", text_fr: "Documentation complète" }
            ]
        },

        // =====================================================================
        // 3. FILM PERMITS
        // =====================================================================
        {
            title: "Film Permits",
            title_fr: "Autorisations de Tournage",
            slug: "film-permits",
            icon: "FileCheck",
            type: "content_page",
            brief_description: "Official filming authorizations through CCM and Moroccan authorities.",
            brief_description_fr: "Autorisations officielles via le CCM et les autorités marocaines.",
            full_description: "<p>TFS maintains strong relationships with the Centre Cinématographique Marocain (CCM), the official body regulating film production in Morocco.</p>",
            full_description_fr: "<p>TFS entretient des relations solides avec le Centre Cinématographique Marocain (CCM).</p>",
            display_order: 2,
            is_active: true,
            sections: [
                {
                    type: "hero",
                    title: "Your Gateway to Filming in Morocco",
                    title_fr: "Votre Passerelle pour Tourner au Maroc",
                    description: "Direct partnership with CCM for seamless permit acquisition, regardless of project complexity.",
                    description_fr: "Partenariat direct avec le CCM pour l'acquisition de permis sans accroc.",
                    background: "gradient-gold"
                },
                {
                    type: "what_we_offer",
                    title: "What We Offer",
                    title_fr: "Ce Que Nous Offrons",
                    description: "Comprehensive permit services for any production requirement.",
                    description_fr: "Services de permis complets pour toute exigence de production.",
                    items: [
                        {
                            number: "01",
                            title: "General Filming Permits",
                            title_fr: "Permis de Tournage Généraux",
                            description: "Standard authorizations for commercial, feature film, documentary, and TV productions.",
                            description_fr: "Autorisations standard pour productions commerciales, longs métrages, documentaires et TV."
                        },
                        {
                            number: "02",
                            title: "Special Location Access",
                            title_fr: "Accès Lieux Spéciaux",
                            description: "Historic sites, government buildings, military zones, and restricted areas.",
                            description_fr: "Sites historiques, bâtiments gouvernementaux, zones militaires et zones restreintes."
                        },
                        {
                            number: "03",
                            title: "Drone & Aerial Permits",
                            title_fr: "Permis Drone & Aérien",
                            description: "Aviation authority coordination for drone filming and helicopter aerial shots.",
                            description_fr: "Coordination avec l'aviation civile pour tournage drone et prises de vue aériennes."
                        }
                    ]
                },
                {
                    type: "process",
                    title: "Our Permit Process",
                    title_fr: "Notre Processus de Permis",
                    steps: [
                        { number: 1, title: "Submit Request", title_fr: "Soumettre Demande", description: "Share your locations and dates", description_fr: "Partagez vos lieux et dates" },
                        { number: 2, title: "CCM Liaison", title_fr: "Liaison CCM", description: "We coordinate with authorities", description_fr: "Nous coordonnons avec les autorités" },
                        { number: 3, title: "Permit Processing", title_fr: "Traitement Permis", description: "Fast-track when needed", description_fr: "Voie rapide si nécessaire" },
                        { number: 4, title: "Permit Delivery", title_fr: "Livraison Permis", description: "Official documents in hand", description_fr: "Documents officiels en main" }
                    ]
                }
            ],
            stats: [
                { value: "100%", label: "Success Rate", label_fr: "Taux de Réussite" },
                { value: "72h", label: "Fast Track Available", label_fr: "Voie Rapide Disponible" },
                { value: "15+", label: "Years with CCM", label_fr: "Années avec CCM" },
                { value: "500+", label: "Permits Obtained", label_fr: "Permis Obtenus" }
            ],
            tags: ["CCM", "Permits", "Authorization", "Government", "Locations", "Drone"],
            features: [
                { icon: "BadgeCheck", text: "Official CCM partner", text_fr: "Partenaire officiel CCM" },
                { icon: "Zap", text: "Fast-track processing", text_fr: "Traitement accéléré" },
                { icon: "Globe", text: "Any location in Morocco", text_fr: "N'importe quel lieu au Maroc" }
            ]
        },

        // =====================================================================
        // 4. CREWING
        // =====================================================================
        {
            title: "Film Crewing",
            title_fr: "Équipes de Tournage",
            slug: "crewing",
            icon: "Users",
            type: "content_page",
            brief_description: "Access Morocco's finest film professionals with international experience.",
            brief_description_fr: "Accédez aux meilleurs professionnels du cinéma marocain.",
            full_description: "<p>TFS provides access to highly skilled technicians with extensive international project backgrounds.</p>",
            full_description_fr: "<p>TFS donne accès à des techniciens hautement qualifiés avec une expérience internationale.</p>",
            display_order: 3,
            is_active: true,
            sections: [
                {
                    type: "hero",
                    title: "World-Class Moroccan Film Talent",
                    title_fr: "Talents Cinématographiques Marocains de Classe Mondiale",
                    description: "Multilingual crews for seamless collaboration on international productions.",
                    description_fr: "Équipes multilingues pour une collaboration fluide sur les productions internationales.",
                    background: "gradient-purple"
                },
                {
                    type: "what_we_offer",
                    title: "What We Offer",
                    title_fr: "Ce Que Nous Offrons",
                    description: "Complete crew solutions for every department.",
                    description_fr: "Solutions d'équipe complètes pour chaque département.",
                    items: [
                        {
                            number: "01",
                            title: "Camera & Lighting",
                            title_fr: "Caméra & Éclairage",
                            description: "Experienced DOPs, camera operators, gaffers, and electricians with Hollywood credits.",
                            description_fr: "DOPs, opérateurs caméra, chefs électriciens expérimentés avec crédits Hollywood."
                        },
                        {
                            number: "02",
                            title: "Art & Construction",
                            title_fr: "Décors & Construction",
                            description: "Production designers, art directors, and skilled set builders for any scale.",
                            description_fr: "Chefs décorateurs, directeurs artistiques et constructeurs de décors qualifiés."
                        },
                        {
                            number: "03",
                            title: "Stunts & SFX",
                            title_fr: "Cascades & Effets Spéciaux",
                            description: "Professional stunt coordinators and special effects teams for action sequences.",
                            description_fr: "Coordinateurs cascades et équipes effets spéciaux pour séquences d'action."
                        }
                    ]
                },
                {
                    type: "departments",
                    title: "All Departments Covered",
                    title_fr: "Tous les Départements Couverts",
                    items: ["Camera", "Lighting", "Grip", "Art Department", "Wardrobe", "Makeup", "Sound", "Stunts", "VFX", "Production", "AD Team", "Transport"]
                }
            ],
            stats: [
                { value: "500+", label: "Crew Members", label_fr: "Membres d'Équipe" },
                { value: "5", label: "Languages Spoken", label_fr: "Langues Parlées" },
                { value: "50+", label: "International Projects", label_fr: "Projets Internationaux" },
                { value: "12", label: "Departments", label_fr: "Départements" }
            ],
            tags: ["Crew", "Technicians", "Camera", "Lighting", "Art Department", "Stunts"],
            features: [
                { icon: "Languages", text: "Arabic, French, English, Spanish", text_fr: "Arabe, Français, Anglais, Espagnol" },
                { icon: "Award", text: "Award-winning professionals", text_fr: "Professionnels primés" },
                { icon: "Users", text: "All departments covered", text_fr: "Tous les départements couverts" }
            ]
        },

        // =====================================================================
        // 5. LOCATION SCOUTING
        // =====================================================================
        {
            title: "Location Scouting",
            title_fr: "Repérage des Lieux",
            slug: "scouting",
            icon: "MapPin",
            type: "content_page",
            brief_description: "Discover Morocco's cinematic landscapes for your next production.",
            brief_description_fr: "Découvrez les paysages cinématographiques du Maroc.",
            full_description: "<p>TFS presents curated location selections that match your project's creative vision.</p>",
            full_description_fr: "<p>TFS présente des sélections de lieux qui correspondent à votre vision créative.</p>",
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
                        {
                            number: "01",
                            title: "Desert & Mountains",
                            title_fr: "Désert & Montagnes",
                            description: "Sahara dunes, Atlas peaks, and dramatic landscapes that have doubled for Mars, Egypt, and beyond.",
                            description_fr: "Dunes du Sahara, sommets de l'Atlas et paysages dramatiques doublant Mars, l'Égypte et plus."
                        },
                        {
                            number: "02",
                            title: "Historic Sites",
                            title_fr: "Sites Historiques",
                            description: "Authentic kasbahs, ancient medinas, and UNESCO sites perfect for period productions.",
                            description_fr: "Kasbahs authentiques, médinas anciennes et sites UNESCO parfaits pour productions d'époque."
                        },
                        {
                            number: "03",
                            title: "Modern & Urban",
                            title_fr: "Moderne & Urbain",
                            description: "Contemporary architecture, cosmopolitan cities, and studio facilities for any setting.",
                            description_fr: "Architecture contemporaine, villes cosmopolites et studios pour tout décor."
                        }
                    ]
                },
                {
                    type: "gallery",
                    title: "Featured Locations",
                    title_fr: "Lieux en Vedette",
                    categories: [
                        { name: "Desert", name_fr: "Désert", description: "Sahara, Merzouga, Zagora" },
                        { name: "Mountains", name_fr: "Montagnes", description: "Atlas, Ouarzazate, Ait Ben Haddou" },
                        { name: "Cities", name_fr: "Villes", description: "Marrakech, Casablanca, Fes" },
                        { name: "Coastal", name_fr: "Côtier", description: "Essaouira, Tangier, Agadir" }
                    ]
                }
            ],
            stats: [
                { value: "1000+", label: "Locations Catalogued", label_fr: "Lieux Catalogués" },
                { value: "12", label: "Regions Covered", label_fr: "Régions Couvertes" },
                { value: "48h", label: "Scout Turnaround", label_fr: "Délai de Repérage" },
                { value: "HD", label: "Photo Library", label_fr: "Photothèque" }
            ],
            tags: ["Locations", "Desert", "Medina", "Mountains", "Coastal", "Kasbah"],
            features: [
                { icon: "Image", text: "Extensive photo library", text_fr: "Bibliothèque photo extensive" },
                { icon: "Map", text: "GPS-tagged locations", text_fr: "Lieux géolocalisés GPS" },
                { icon: "FileImage", text: "HD scout reports", text_fr: "Rapports de repérage HD" }
            ]
        },

        // =====================================================================
        // 6. CATERING
        // =====================================================================
        {
            title: "Film Catering",
            title_fr: "Restauration de Plateau",
            slug: "catering",
            icon: "Utensils",
            type: "content_page",
            brief_description: "Professional on-set catering with fresh, locally-sourced ingredients.",
            brief_description_fr: "Restauration professionnelle sur plateau avec ingrédients frais.",
            full_description: "<p>TFS offers reliable catering services led by professionally trained chefs.</p>",
            full_description_fr: "<p>TFS propose des services de restauration fiables dirigés par des chefs professionnels.</p>",
            display_order: 5,
            is_active: true,
            sections: [
                {
                    type: "hero",
                    title: "Fuel Your Production",
                    title_fr: "Alimentez Votre Production",
                    description: "Quality meals that keep your crew energized and focused throughout the shoot.",
                    description_fr: "Repas de qualité qui gardent votre équipe énergisée et concentrée.",
                    background: "gradient-green"
                },
                {
                    type: "what_we_offer",
                    title: "What We Offer",
                    title_fr: "Ce Que Nous Offrons",
                    description: "Flexible catering solutions for any production size.",
                    description_fr: "Solutions de restauration flexibles pour toute taille de production.",
                    items: [
                        {
                            number: "01",
                            title: "Full Crew Meals",
                            title_fr: "Repas d'Équipe Complets",
                            description: "Breakfast, lunch, and dinner service with varied daily menus featuring local and international cuisine.",
                            description_fr: "Service petit-déjeuner, déjeuner et dîner avec menus variés cuisine locale et internationale."
                        },
                        {
                            number: "02",
                            title: "Craft Services",
                            title_fr: "Services Craft",
                            description: "All-day snacks, beverages, and refreshments to keep energy levels high between meals.",
                            description_fr: "Collations, boissons et rafraîchissements toute la journée entre les repas."
                        },
                        {
                            number: "03",
                            title: "Special Dietary",
                            title_fr: "Régimes Spéciaux",
                            description: "Vegan, vegetarian, halal, kosher, and allergy-conscious options available for every meal.",
                            description_fr: "Options végane, végétarien, halal, casher et allergies disponibles à chaque repas."
                        }
                    ]
                },
                {
                    type: "features",
                    title: "Our Standards",
                    title_fr: "Nos Standards",
                    items: [
                        { icon: "Leaf", title: "Fresh Daily", title_fr: "Frais Quotidien", description: "Ingredients sourced from local markets each morning", description_fr: "Ingrédients des marchés locaux chaque matin" },
                        { icon: "Shield", title: "A+ Hygiene", title_fr: "Hygiène A+", description: "Strict food safety and cleanliness protocols", description_fr: "Protocoles stricts de sécurité alimentaire" },
                        { icon: "Truck", title: "Mobile Kitchen", title_fr: "Cuisine Mobile", description: "Full service even in remote locations", description_fr: "Service complet même en lieux isolés" }
                    ]
                }
            ],
            stats: [
                { value: "5000+", label: "Meals Served Daily", label_fr: "Repas Servis par Jour" },
                { value: "100%", label: "Local Ingredients", label_fr: "Ingrédients Locaux" },
                { value: "A+", label: "Hygiene Rating", label_fr: "Note d'Hygiène" },
                { value: "24/7", label: "Service Available", label_fr: "Service Disponible" }
            ],
            tags: ["Catering", "Food", "Craft Services", "Meals", "Dietary", "Halal"],
            features: [
                { icon: "Leaf", text: "Fresh daily ingredients", text_fr: "Ingrédients frais quotidiens" },
                { icon: "Heart", text: "All dietary needs covered", text_fr: "Besoins alimentaires couverts" },
                { icon: "Truck", text: "Mobile kitchen available", text_fr: "Cuisine mobile disponible" }
            ]
        },

        // =====================================================================
        // 7. ACCOMMODATION
        // =====================================================================
        {
            title: "Accommodation",
            title_fr: "Hébergement",
            slug: "accommodation",
            icon: "Hotel",
            type: "content_page",
            brief_description: "Premium crew accommodations at preferential production rates.",
            brief_description_fr: "Hébergements premium à tarifs préférentiels production.",
            full_description: "<p>TFS arranges accommodations from luxury hotels to private villas across Morocco.</p>",
            full_description_fr: "<p>TFS organise des hébergements des hôtels de luxe aux villas privées.</p>",
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
                        {
                            number: "01",
                            title: "Luxury Hotels",
                            title_fr: "Hôtels de Luxe",
                            description: "5-star international chains and boutique luxury properties with preferential rates.",
                            description_fr: "Chaînes internationales 5 étoiles et propriétés boutique luxe à tarifs préférentiels."
                        },
                        {
                            number: "02",
                            title: "Traditional Riads",
                            title_fr: "Riads Traditionnels",
                            description: "Authentic Moroccan guesthouses with character, perfect for smaller crews.",
                            description_fr: "Maisons d'hôtes marocaines authentiques avec caractère, parfaites pour petites équipes."
                        },
                        {
                            number: "03",
                            title: "Private Villas",
                            title_fr: "Villas Privées",
                            description: "Exclusive estates and villas for talent, production offices, or long-term stays.",
                            description_fr: "Domaines et villas exclusifs pour talents, bureaux production ou séjours longs."
                        }
                    ]
                },
                {
                    type: "features",
                    title: "Booking Benefits",
                    title_fr: "Avantages Réservation",
                    items: [
                        { icon: "Percent", title: "30% Savings", title_fr: "30% d'Économies", description: "Average discount through our partnerships", description_fr: "Remise moyenne via nos partenariats" },
                        { icon: "Clock", title: "Flexible Terms", title_fr: "Conditions Flexibles", description: "Production-friendly cancellation policies", description_fr: "Politiques d'annulation adaptées production" },
                        { icon: "MapPin", title: "Nationwide", title_fr: "National", description: "Coverage in all major filming regions", description_fr: "Couverture dans toutes les régions de tournage" }
                    ]
                }
            ],
            stats: [
                { value: "50+", label: "Partner Hotels", label_fr: "Hôtels Partenaires" },
                { value: "30%", label: "Average Savings", label_fr: "Économies Moyennes" },
                { value: "12", label: "Cities Covered", label_fr: "Villes Couvertes" },
                { value: "1000+", label: "Rooms Booked", label_fr: "Chambres Réservées" }
            ],
            tags: ["Hotels", "Riads", "Villas", "Accommodation", "Lodging", "Luxury"],
            features: [
                { icon: "Percent", text: "Preferential production rates", text_fr: "Tarifs préférentiels production" },
                { icon: "Star", text: "Luxury to budget options", text_fr: "Options luxe à économique" },
                { icon: "MapPin", text: "Nationwide coverage", text_fr: "Couverture nationale" }
            ]
        },

        // =====================================================================
        // 8. TRANSPORTATION
        // =====================================================================
        {
            title: "Transportation",
            title_fr: "Transport",
            slug: "transportation",
            icon: "Car",
            type: "content_page",
            brief_description: "Complete ground and air transport solutions for productions.",
            brief_description_fr: "Solutions complètes de transport terrestre et aérien.",
            full_description: "<p>TFS provides dependable transportation solutions for film productions of all sizes.</p>",
            full_description_fr: "<p>TFS fournit des solutions de transport fiables pour productions de toutes tailles.</p>",
            display_order: 7,
            is_active: true,
            sections: [
                {
                    type: "hero",
                    title: "Move Your Production",
                    title_fr: "Déplacez Votre Production",
                    description: "Reliable fleet and logistics for seamless crew and equipment movement.",
                    description_fr: "Flotte fiable et logistique pour déplacement fluide équipe et équipement.",
                    background: "gradient-red"
                },
                {
                    type: "what_we_offer",
                    title: "What We Offer",
                    title_fr: "Ce Que Nous Offrons",
                    description: "Comprehensive transport services for any production need.",
                    description_fr: "Services de transport complets pour tout besoin de production.",
                    items: [
                        {
                            number: "01",
                            title: "Crew Transport",
                            title_fr: "Transport Équipe",
                            description: "Air-conditioned vans and buses for comfortable crew movement to any location.",
                            description_fr: "Vans et bus climatisés pour déplacement confortable de l'équipe."
                        },
                        {
                            number: "02",
                            title: "Equipment Trucks",
                            title_fr: "Camions Équipement",
                            description: "Specialized grip trucks, generator vehicles, and equipment transport solutions.",
                            description_fr: "Camions grip spécialisés, véhicules générateurs et solutions transport équipement."
                        },
                        {
                            number: "03",
                            title: "4x4 & Specialty",
                            title_fr: "4x4 & Spécialité",
                            description: "Desert-ready vehicles, camera cars, and specialty transport for any terrain.",
                            description_fr: "Véhicules prêts pour le désert, voitures caméra et transport spécialisé."
                        }
                    ]
                },
                {
                    type: "fleet",
                    title: "Our Fleet",
                    title_fr: "Notre Flotte",
                    vehicles: [
                        { type: "Passenger Vans", type_fr: "Vans Passagers", count: "25+" },
                        { type: "Crew Buses", type_fr: "Bus Équipe", count: "10+" },
                        { type: "4x4 Vehicles", type_fr: "Véhicules 4x4", count: "20+" },
                        { type: "Equipment Trucks", type_fr: "Camions Équipement", count: "15+" },
                        { type: "VIP Cars", type_fr: "Voitures VIP", count: "10+" },
                        { type: "Generators", type_fr: "Générateurs", count: "8+" }
                    ]
                }
            ],
            stats: [
                { value: "100+", label: "Vehicles Available", label_fr: "Véhicules Disponibles" },
                { value: "24/7", label: "Dispatch Service", label_fr: "Service de Dispatch" },
                { value: "GPS", label: "Fleet Tracking", label_fr: "Suivi de Flotte" },
                { value: "0", label: "Breakdowns", label_fr: "Pannes" }
            ],
            tags: ["Transport", "Vehicles", "Logistics", "Fleet", "4x4", "Trucks"],
            features: [
                { icon: "Truck", text: "Diverse vehicle fleet", text_fr: "Flotte de véhicules diverse" },
                { icon: "Navigation", text: "GPS fleet tracking", text_fr: "Suivi GPS de flotte" },
                { icon: "Plane", text: "Air transport coordination", text_fr: "Coordination transport aérien" }
            ]
        },

        // =====================================================================
        // 9. CASTING
        // =====================================================================
        {
            title: "Casting",
            title_fr: "Casting",
            slug: "casting",
            icon: "UserCheck",
            type: "content_page",
            brief_description: "Diverse Moroccan talent for international productions.",
            brief_description_fr: "Talents marocains divers pour productions internationales.",
            full_description: "<p>Morocco's cultural diversity makes it exceptional for international casting needs.</p>",
            full_description_fr: "<p>La diversité culturelle du Maroc le rend exceptionnel pour les besoins de casting international.</p>",
            display_order: 8,
            is_active: true,
            sections: [
                {
                    type: "hero",
                    title: "Discover Moroccan Talent",
                    title_fr: "Découvrez les Talents Marocains",
                    description: "A rich diversity of looks and profiles for any character or role.",
                    description_fr: "Une riche diversité de looks et profils pour tout personnage ou rôle.",
                    background: "gradient-pink"
                },
                {
                    type: "what_we_offer",
                    title: "What We Offer",
                    title_fr: "Ce Que Nous Offrons",
                    description: "Complete casting services with professional facilities.",
                    description_fr: "Services de casting complets avec installations professionnelles.",
                    items: [
                        {
                            number: "01",
                            title: "Professional Actors",
                            title_fr: "Acteurs Professionnels",
                            description: "Trained actors with international credits, fluent in multiple languages.",
                            description_fr: "Acteurs formés avec crédits internationaux, multilingues."
                        },
                        {
                            number: "02",
                            title: "Stunt Performers",
                            title_fr: "Cascadeurs",
                            description: "Skilled stunt coordinators, martial artists, and action performers.",
                            description_fr: "Coordinateurs cascades qualifiés, artistes martiaux et performeurs d'action."
                        },
                        {
                            number: "03",
                            title: "Extras & Background",
                            title_fr: "Figurants & Background",
                            description: "Large database of extras with diverse looks for any crowd or background scene.",
                            description_fr: "Grande base de figurants avec looks divers pour toute scène de foule."
                        }
                    ]
                },
                {
                    type: "talent_categories",
                    title: "Talent Categories",
                    title_fr: "Catégories de Talents",
                    categories: [
                        { name: "Actors", name_fr: "Acteurs", count: "500+" },
                        { name: "Stunt Performers", name_fr: "Cascadeurs", count: "100+" },
                        { name: "Models", name_fr: "Mannequins", count: "300+" },
                        { name: "Extras", name_fr: "Figurants", count: "10,000+" },
                        { name: "Child Actors", name_fr: "Acteurs Enfants", count: "200+" },
                        { name: "Specialty", name_fr: "Spécialité", count: "150+" }
                    ]
                }
            ],
            stats: [
                { value: "10,000+", label: "Talent Database", label_fr: "Base de Talents" },
                { value: "4K", label: "Self-Tape Quality", label_fr: "Qualité Self-Tape" },
                { value: "48h", label: "Tape Delivery", label_fr: "Livraison Bandes" },
                { value: "5", label: "Languages", label_fr: "Langues" }
            ],
            tags: ["Casting", "Actors", "Extras", "Stunts", "Talent", "Models"],
            features: [
                { icon: "Database", text: "Extensive talent database", text_fr: "Base de talents extensive" },
                { icon: "Video", text: "4K self-tape facility", text_fr: "Studio self-tape 4K" },
                { icon: "Globe", text: "Diverse ethnic looks", text_fr: "Looks ethniques divers" }
            ]
        }
    ];

    // Seed all services
    SERVICES.forEach(svc => {
        const rec = new Record(servicesCol);
        rec.set("title", svc.title);
        rec.set("title_fr", svc.title_fr);
        rec.set("slug", svc.slug);
        rec.set("icon", svc.icon);
        rec.set("type", svc.type);
        if (svc.target_url) rec.set("target_url", svc.target_url);
        rec.set("brief_description", svc.brief_description);
        rec.set("brief_description_fr", svc.brief_description_fr);
        if (svc.full_description) rec.set("full_description", svc.full_description);
        if (svc.full_description_fr) rec.set("full_description_fr", svc.full_description_fr);
        rec.set("display_order", svc.display_order);
        rec.set("is_active", svc.is_active);
        rec.set("sections", svc.sections);
        rec.set("stats", svc.stats);
        rec.set("tags", svc.tags);
        rec.set("features", svc.features);
        app.save(rec);
        console.log(`[Seed] Created service: ${svc.title}`);
    });

    console.log("[Migration] TFS Services with full sections seeded successfully");

}, (app) => {
    console.log("[Migration] Rollback: Manual deletion required");
});
