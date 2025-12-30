/// <reference path="../pb_data/types.d.ts" />
/**
 * TFS Services - FIXED JSON Format
 * 
 * Sections use: type='text_image'|'text_only', content (not description), image URL
 * Features use: title, description (not text)
 * Stats use: value, label, labelFr (correct)
 */
migrate((app) => {
    // Delete existing services
    try {
        const existing = app.findRecordsByFilter("services", "id != ''", "", 50, 0);
        existing.forEach(rec => { try { app.delete(rec); } catch { } });
    } catch { }

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
            brief_description: "Professional cinema equipment rental for world-class productions. ARRI, RED, Sony cameras and premium lenses.",
            brief_description_fr: "Location d'équipement cinématographique professionnel. Caméras ARRI, RED, Sony et objectifs premium.",
            display_order: 0,
            is_active: true,
            sections: [
                {
                    type: "text_image",
                    layout: "right",
                    title: "World-Class Cinema Equipment",
                    titleFr: "Équipement Cinéma de Classe Mondiale",
                    content: "<p>Access Morocco's largest inventory of professional cinema cameras, lenses, lighting, and grip equipment. From ARRI Alexa 35 to Sony Venice 2, we have the gear your production needs.</p>",
                    contentFr: "<p>Accédez au plus grand inventaire marocain de caméras, objectifs, éclairage et équipement de grip professionnels. De l'ARRI Alexa 35 au Sony Venice 2.</p>"
                },
                {
                    type: "text_only",
                    title: "On-Set Technical Support",
                    titleFr: "Support Technique sur Plateau",
                    content: "<p>Our experienced technicians are available 24/7 to ensure your equipment runs smoothly. We offer delivery, setup, and on-call support throughout your production.</p>",
                    contentFr: "<p>Nos techniciens expérimentés sont disponibles 24h/24 pour assurer le bon fonctionnement de votre équipement.</p>"
                }
            ],
            stats: [
                { value: "500+", label: "Equipment Items", labelFr: "Équipements" },
                { value: "24/7", label: "Technical Support", labelFr: "Support Technique" },
                { value: "100+", label: "Productions Served", labelFr: "Productions Servies" },
                { value: "15+", label: "Years Experience", labelFr: "Années d'Expérience" }
            ],
            tags: ["Cameras", "Lenses", "Lighting", "Grip", "ARRI", "RED", "Sony"],
            features: [
                { title: "Premium Cameras", titleFr: "Caméras Premium", description: "ARRI Alexa 35, Sony Venice 2, RED V-Raptor, and more high-end cinema cameras ready for your production.", descriptionFr: "ARRI Alexa 35, Sony Venice 2, RED V-Raptor et plus de caméras cinéma haut de gamme.", icon: "Camera" },
                { title: "Lens Collections", titleFr: "Collections d'Objectifs", description: "Cooke S8/i, Zeiss Supreme, Atlas Orion anamorphic, and vintage rehoused primes and zooms.", descriptionFr: "Cooke S8/i, Zeiss Supreme, Atlas Orion anamorphiques et optiques vintage.", icon: "Aperture" },
                { title: "Lighting & Grip", titleFr: "Éclairage & Machinerie", description: "ARRI SkyPanels, Creamsource, HMIs, and complete grip packages including dollies and cranes.", descriptionFr: "ARRI SkyPanels, Creamsource, HMI et packages grip complets.", icon: "Sun" }
            ]
        },

        // 2. FILM SHIPPING
        {
            title: "Film Shipping & Customs",
            title_fr: "Expédition & Douanes",
            slug: "film-shipping",
            icon: "Truck",
            type: "content_page",
            brief_description: "Expert customs clearance and international shipping for film equipment. Seamless port and airport handling with full compliance.",
            brief_description_fr: "Dédouanement expert et expédition internationale d'équipements. Gestion fluide des ports et aéroports.",
            full_description: "<p>Our production shipping division is managed by highly experienced coordinators with strong backgrounds in servicing major international film productions.</p>",
            full_description_fr: "<p>Notre division d'expédition est gérée par des coordinateurs expérimentés dans les grandes productions internationales.</p>",
            display_order: 1,
            is_active: true,
            sections: [
                {
                    type: "text_image",
                    layout: "right",
                    title: "Seamless Global Film Logistics",
                    titleFr: "Logistique Cinéma Mondiale Sans Faille",
                    content: "<p>From any corner of the world to Morocco, we handle your equipment with care and precision. Our specialized team supervises the entire process from start to finish, working closely with local authorities and trusted customs clearance partners.</p>",
                    contentFr: "<p>De n'importe où dans le monde vers le Maroc, nous gérons votre équipement avec soin et précision. Notre équipe spécialisée supervise l'ensemble du processus.</p>"
                },
                {
                    type: "text_only",
                    title: "Customs Clearance Expertise",
                    titleFr: "Expertise en Dédouanement",
                    content: "<p>We ensure fast and secure port and airport clearance, including sensitive shipments such as filming equipment, vehicles, and regulated materials—all handled with strict compliance and professionalism.</p>",
                    contentFr: "<p>Nous assurons un dédouanement rapide et sécurisé aux ports et aéroports, y compris les expéditions sensibles.</p>"
                }
            ],
            stats: [
                { value: "200+", label: "Shipments Cleared", labelFr: "Expéditions Dédouanées" },
                { value: "48h", label: "Average Clearance", labelFr: "Délai Moyen" },
                { value: "0", label: "Lost Equipment", labelFr: "Équipement Perdu" },
                { value: "100%", label: "Compliance Rate", labelFr: "Taux Conformité" }
            ],
            tags: ["Customs", "Logistics", "Import", "Export", "Carnet ATA"],
            features: [
                { title: "Customs Clearance", titleFr: "Dédouanement", description: "Fast and efficient port and airport clearance with direct relationships to Moroccan authorities.", descriptionFr: "Dédouanement rapide et efficace avec relations directes aux autorités.", icon: "FileCheck" },
                { title: "ATA Carnet Processing", titleFr: "Traitement Carnet ATA", description: "Complete temporary import/export documentation handling for international productions.", descriptionFr: "Documentation complète d'import/export temporaire pour productions internationales.", icon: "FileText" },
                { title: "Sensitive Shipments", titleFr: "Expéditions Sensibles", description: "Specialized handling for high-value cameras, vehicles, and regulated materials.", descriptionFr: "Manutention spécialisée pour équipements de haute valeur.", icon: "Shield" }
            ]
        },

        // 3. FILM PERMITS
        {
            title: "Film Permits",
            title_fr: "Autorisations de Tournage",
            slug: "film-permits",
            icon: "FileCheck",
            type: "content_page",
            brief_description: "Official filming authorizations through CCM and Moroccan authorities. Fast-track permits for any location or project complexity.",
            brief_description_fr: "Autorisations officielles via le CCM et autorités marocaines. Permis accélérés pour tout lieu.",
            full_description: "<p>TFS maintains strong relationships with the Centre Cinématographique Marocain (CCM), the official body regulating film production in Morocco.</p>",
            full_description_fr: "<p>TFS entretient des relations solides avec le Centre Cinématographique Marocain (CCM).</p>",
            display_order: 2,
            is_active: true,
            sections: [
                {
                    type: "text_image",
                    layout: "right",
                    title: "Your Gateway to Filming in Morocco",
                    titleFr: "Votre Passerelle pour Tourner au Maroc",
                    content: "<p>The CCM acts as the main liaison between production companies and governmental departments, facilitating filming authorizations regardless of project complexity. From pre-production approvals to on-set supervision, all filming activities are overseen by this institution.</p>",
                    contentFr: "<p>Le CCM agit comme principal intermédiaire entre les sociétés de production et les départements gouvernementaux.</p>"
                },
                {
                    type: "text_only",
                    title: "Our Permit Process",
                    titleFr: "Notre Processus de Permis",
                    content: "<p>Through constant coordination and proactive communication, TFS ensures that all permits are obtained on time, allowing productions to move forward smoothly and efficiently. We handle general filming permits, drone authorizations, historic site access, and more.</p>",
                    contentFr: "<p>Grâce à une coordination constante, TFS s'assure que tous les permis sont obtenus à temps.</p>"
                }
            ],
            stats: [
                { value: "100%", label: "Success Rate", labelFr: "Taux Réussite" },
                { value: "72h", label: "Fast Track", labelFr: "Voie Rapide" },
                { value: "15+", label: "Years with CCM", labelFr: "Années CCM" },
                { value: "500+", label: "Permits Obtained", labelFr: "Permis Obtenus" }
            ],
            tags: ["CCM", "Permits", "Authorization", "Government", "Locations", "Drone"],
            features: [
                { title: "General Filming Permits", titleFr: "Permis Généraux", description: "Standard authorizations for commercial, feature film, documentary, and TV productions anywhere in Morocco.", descriptionFr: "Autorisations pour productions commerciales, longs métrages, documentaires et TV.", icon: "FileCheck" },
                { title: "Special Location Access", titleFr: "Accès Lieux Spéciaux", description: "Historic sites, government buildings, military zones, and restricted areas with proper clearance.", descriptionFr: "Sites historiques, bâtiments gouvernementaux, zones militaires.", icon: "MapPin" },
                { title: "Drone & Aerial Permits", titleFr: "Permis Drone", description: "Aviation authority coordination for drone filming and helicopter aerial shots anywhere in Morocco.", descriptionFr: "Coordination aviation civile pour drone et hélicoptère.", icon: "Plane" }
            ]
        },

        // 4. CREWING
        {
            title: "Film Crewing",
            title_fr: "Équipes de Tournage",
            slug: "crewing",
            icon: "Users",
            type: "content_page",
            brief_description: "Access Morocco's finest film professionals. Multilingual crews with international production experience for any department.",
            brief_description_fr: "Accédez aux meilleurs professionnels du cinéma marocain. Équipes multilingues avec expérience internationale.",
            full_description: "<p>TFS provides access to highly skilled technicians with extensive international project backgrounds.</p>",
            full_description_fr: "<p>TFS donne accès à des techniciens hautement qualifiés avec expérience internationale.</p>",
            display_order: 3,
            is_active: true,
            sections: [
                {
                    type: "text_image",
                    layout: "right",
                    title: "World-Class Moroccan Film Talent",
                    titleFr: "Talents Cinéma Marocains de Classe Mondiale",
                    content: "<p>Our multilingual crews enable seamless collaboration in multicultural environments. We carefully select the best local talent to match each project's creative and technical requirements, maximizing efficiency on set.</p>",
                    contentFr: "<p>Nos équipes multilingues permettent une collaboration fluide dans des environnements multiculturels.</p>"
                },
                {
                    type: "text_only",
                    title: "All Departments Covered",
                    titleFr: "Tous Départements Couverts",
                    content: "<p>From Camera and Lighting to Art Department, Wardrobe, Makeup, Sound, Stunts, and VFX—we have experienced professionals for every role. Our crews speak Arabic, French, English, and Spanish.</p>",
                    contentFr: "<p>De la Caméra à l'Éclairage, Direction Artistique, Costumes, Maquillage, Son, Cascades et VFX.</p>"
                }
            ],
            stats: [
                { value: "500+", label: "Crew Members", labelFr: "Membres Équipe" },
                { value: "5", label: "Languages", labelFr: "Langues" },
                { value: "50+", label: "International Projects", labelFr: "Projets Internationaux" },
                { value: "12", label: "Departments", labelFr: "Départements" }
            ],
            tags: ["Crew", "Technicians", "Camera", "Lighting", "Art Department", "Stunts"],
            features: [
                { title: "Camera & Lighting", titleFr: "Caméra & Éclairage", description: "Experienced DOPs, camera operators, gaffers, and electricians with Hollywood and European credits.", descriptionFr: "DOPs, opérateurs caméra, chefs électriciens avec crédits Hollywood et européens.", icon: "Camera" },
                { title: "Art & Construction", titleFr: "Décors & Construction", description: "Production designers, art directors, and skilled set builders capable of creating any world you envision.", descriptionFr: "Chefs décorateurs, directeurs artistiques et constructeurs qualifiés.", icon: "Palette" },
                { title: "Stunts & SFX", titleFr: "Cascades & Effets", description: "Professional stunt coordinators, martial artists, and special effects teams for action sequences of any scale.", descriptionFr: "Coordinateurs cascades et équipes effets spéciaux pour l'action.", icon: "Zap" }
            ]
        },

        // 5. SCOUTING
        {
            title: "Location Scouting",
            title_fr: "Repérage des Lieux",
            slug: "scouting",
            icon: "MapPin",
            type: "content_page",
            brief_description: "Discover Morocco's cinematic landscapes. From ancient medinas to Sahara dunes, we find the perfect backdrop for your vision.",
            brief_description_fr: "Découvrez les paysages cinématographiques du Maroc. Des médinas aux dunes du Sahara.",
            full_description: "<p>TFS presents curated location selections that match your project's creative vision.</p>",
            full_description_fr: "<p>TFS présente des sélections de lieux correspondant à votre vision créative.</p>",
            display_order: 4,
            is_active: true,
            sections: [
                {
                    type: "text_image",
                    layout: "right",
                    title: "Morocco: A World of Locations",
                    titleFr: "Maroc: Un Monde de Lieux",
                    content: "<p>After reviewing the screenplay and understanding the creative vision, we present curated locations that best match your needs. Thanks to our extensive experience, we identify precise location matches quickly and efficiently.</p>",
                    contentFr: "<p>Après avoir examiné le scénario et compris la vision créative, nous présentons des lieux correspondant à vos besoins.</p>"
                },
                {
                    type: "text_only",
                    title: "Famous Productions Shot Here",
                    titleFr: "Productions Célèbres Tournées Ici",
                    content: "<p>Morocco has been the backdrop for Hollywood blockbusters including Gladiator, Game of Thrones, Kingdom of Heaven, and many more. Our photo library showcases locations that have hosted the country's most iconic productions.</p>",
                    contentFr: "<p>Le Maroc a été le décor de succès hollywoodiens dont Gladiator, Game of Thrones, Kingdom of Heaven.</p>"
                }
            ],
            stats: [
                { value: "1000+", label: "Locations", labelFr: "Lieux" },
                { value: "12", label: "Regions", labelFr: "Régions" },
                { value: "48h", label: "Scout Turnaround", labelFr: "Délai Repérage" },
                { value: "HD", label: "Photo Library", labelFr: "Photothèque" }
            ],
            tags: ["Locations", "Desert", "Medina", "Mountains", "Coastal", "Kasbah"],
            features: [
                { title: "Desert & Mountains", titleFr: "Désert & Montagnes", description: "Sahara dunes, Atlas peaks, and dramatic landscapes that have doubled for Mars, Egypt, and biblical settings.", descriptionFr: "Dunes du Sahara, sommets de l'Atlas, paysages doublant Mars et l'Égypte.", icon: "Mountain" },
                { title: "Historic Sites", titleFr: "Sites Historiques", description: "Authentic kasbahs, ancient medinas, and UNESCO World Heritage sites perfect for period productions.", descriptionFr: "Kasbahs authentiques, médinas anciennes et sites UNESCO.", icon: "Building" },
                { title: "Modern & Urban", titleFr: "Moderne & Urbain", description: "Contemporary architecture, cosmopolitan cities like Casablanca and Marrakech, and state-of-the-art studio facilities.", descriptionFr: "Architecture contemporaine, villes cosmopolites et studios.", icon: "Building2" }
            ]
        },

        // 6. CATERING
        {
            title: "Film Catering",
            title_fr: "Restauration de Plateau",
            slug: "catering",
            icon: "Utensils",
            type: "content_page",
            brief_description: "Professional on-set catering with fresh, locally-sourced ingredients. From craft services to gourmet meals for any crew size.",
            brief_description_fr: "Restauration professionnelle avec ingrédients frais et locaux. Services craft aux repas gastronomiques.",
            full_description: "<p>TFS offers reliable catering services led by professionally trained chefs.</p>",
            full_description_fr: "<p>TFS propose des services de restauration fiables dirigés par des chefs professionnels.</p>",
            display_order: 5,
            is_active: true,
            sections: [
                {
                    type: "text_image",
                    layout: "right",
                    title: "Fuel Your Production",
                    titleFr: "Alimentez Votre Production",
                    content: "<p>Our catering services are led by professionally trained chefs with a strong focus on hygiene, food safety, and quality. Ingredients are sourced daily from local markets to ensure fresh, natural, and high-quality meals.</p>",
                    contentFr: "<p>Nos services de restauration sont dirigés par des chefs formés avec un accent sur l'hygiène, la sécurité alimentaire et la qualité.</p>"
                },
                {
                    type: "text_only",
                    title: "Flexible Options",
                    titleFr: "Options Flexibles",
                    content: "<p>Our catering includes set menus, all-day craft services, and customized meal plans for special dietary requests. Pricing is flexible and adapted to production size and budget, while maintaining excellent taste.</p>",
                    contentFr: "<p>Notre restauration inclut menus fixes, services craft et plans repas personnalisés.</p>"
                }
            ],
            stats: [
                { value: "5000+", label: "Meals Daily", labelFr: "Repas par Jour" },
                { value: "100%", label: "Local Ingredients", labelFr: "Ingrédients Locaux" },
                { value: "A+", label: "Hygiene Rating", labelFr: "Note Hygiène" },
                { value: "24/7", label: "Service", labelFr: "Service" }
            ],
            tags: ["Catering", "Food", "Craft Services", "Meals", "Dietary", "Halal"],
            features: [
                { title: "Full Crew Meals", titleFr: "Repas Complets", description: "Breakfast, lunch, and dinner service with varied daily menus featuring both local Moroccan and international cuisine.", descriptionFr: "Petit-déjeuner, déjeuner et dîner avec menus variés cuisine locale et internationale.", icon: "Utensils" },
                { title: "Craft Services", titleFr: "Services Craft", description: "All-day snacks, fresh beverages, coffee stations, and refreshments to keep energy levels high between meals.", descriptionFr: "Collations, boissons fraîches, stations café et rafraîchissements toute la journée.", icon: "Coffee" },
                { title: "Special Dietary", titleFr: "Régimes Spéciaux", description: "Vegan, vegetarian, halal, kosher, gluten-free, and allergy-conscious options available for every single meal.", descriptionFr: "Options végane, végétarien, halal, casher, sans gluten et allergies.", icon: "Heart" }
            ]
        },

        // 7. ACCOMMODATION
        {
            title: "Accommodation",
            title_fr: "Hébergement",
            slug: "accommodation",
            icon: "Hotel",
            type: "content_page",
            brief_description: "Premium crew accommodations across Morocco. From luxury hotels to traditional riads, all at preferential production rates.",
            brief_description_fr: "Hébergements premium à travers le Maroc. Hôtels de luxe aux riads traditionnels à tarifs préférentiels.",
            full_description: "<p>TFS arranges accommodations from luxury hotels to private villas across Morocco.</p>",
            full_description_fr: "<p>TFS organise des hébergements des hôtels de luxe aux villas privées.</p>",
            display_order: 6,
            is_active: true,
            sections: [
                {
                    type: "text_image",
                    layout: "right",
                    title: "Rest in Comfort",
                    titleFr: "Reposez-vous Confortablement",
                    content: "<p>Our production coordinators specialize in hotel bookings and travel logistics. Thanks to long-standing partnerships, we secure preferential rates offering significant cost savings while maintaining high comfort standards.</p>",
                    contentFr: "<p>Nos coordinateurs se spécialisent dans les réservations et la logistique de voyage.</p>"
                },
                {
                    type: "text_only",
                    title: "Diverse Options",
                    titleFr: "Options Diverses",
                    content: "<p>From 5-star international chains to boutique riads and private villas, we arrange accommodations suitable for any budget. Our network spans 12 cities across Morocco.</p>",
                    contentFr: "<p>Des chaînes 5 étoiles aux riads boutique et villas privées pour tout budget.</p>"
                }
            ],
            stats: [
                { value: "50+", label: "Partner Hotels", labelFr: "Hôtels Partenaires" },
                { value: "30%", label: "Average Savings", labelFr: "Économies Moyennes" },
                { value: "12", label: "Cities", labelFr: "Villes" },
                { value: "1000+", label: "Rooms Booked", labelFr: "Chambres Réservées" }
            ],
            tags: ["Hotels", "Riads", "Villas", "Accommodation", "Lodging", "Luxury"],
            features: [
                { title: "Luxury Hotels", titleFr: "Hôtels de Luxe", description: "5-star international chains and boutique luxury properties with exclusive production rates and VIP amenities.", descriptionFr: "Chaînes 5 étoiles et propriétés boutique luxe à tarifs exclusifs.", icon: "Star" },
                { title: "Traditional Riads", titleFr: "Riads Traditionnels", description: "Authentic Moroccan guesthouses with character, perfect for smaller crews seeking a local experience.", descriptionFr: "Maisons d'hôtes marocaines authentiques pour petites équipes.", icon: "Home" },
                { title: "Private Villas", titleFr: "Villas Privées", description: "Exclusive estates and villas for talent housing, production offices, or long-term crew accommodations.", descriptionFr: "Domaines exclusifs pour talents, bureaux production ou séjours longs.", icon: "Castle" }
            ]
        },

        // 8. TRANSPORTATION
        {
            title: "Transportation",
            title_fr: "Transport",
            slug: "transportation",
            icon: "Car",
            type: "content_page",
            brief_description: "Complete ground and air transport solutions. From crew shuttles to specialized equipment vehicles and aerial coordination.",
            brief_description_fr: "Solutions complètes de transport terrestre et aérien. Navettes aux véhicules spécialisés.",
            full_description: "<p>TFS provides dependable transportation solutions for film productions of all sizes.</p>",
            full_description_fr: "<p>TFS fournit des solutions de transport fiables pour productions de toutes tailles.</p>",
            display_order: 7,
            is_active: true,
            sections: [
                {
                    type: "text_image",
                    layout: "right",
                    title: "Move Your Production",
                    titleFr: "Déplacez Votre Production",
                    content: "<p>Our experience allows us to organize ground and air transport under optimal conditions. We offer a diverse fleet of vehicles adapted to production needs, and coordinate with international suppliers when required.</p>",
                    contentFr: "<p>Notre expérience nous permet d'organiser le transport dans des conditions optimales.</p>"
                },
                {
                    type: "text_only",
                    title: "Our Fleet",
                    titleFr: "Notre Flotte",
                    content: "<p>Over 100 vehicles including crew vans, equipment trucks, 4x4 desert vehicles, VIP cars, generators, and mobile production units. All GPS-tracked with 24/7 dispatch service.</p>",
                    contentFr: "<p>Plus de 100 véhicules incluant vans, camions, 4x4 désert, voitures VIP et unités mobiles.</p>"
                }
            ],
            stats: [
                { value: "100+", label: "Vehicles", labelFr: "Véhicules" },
                { value: "24/7", label: "Dispatch", labelFr: "Dispatch" },
                { value: "GPS", label: "Tracking", labelFr: "Suivi" },
                { value: "0", label: "Breakdowns", labelFr: "Pannes" }
            ],
            tags: ["Transport", "Vehicles", "Logistics", "Fleet", "4x4", "Trucks"],
            features: [
                { title: "Crew Transport", titleFr: "Transport Équipe", description: "Air-conditioned passenger vans and buses for comfortable crew movement to any location in Morocco.", descriptionFr: "Vans et bus climatisés pour déplacement confortable de l'équipe.", icon: "Bus" },
                { title: "Equipment Trucks", titleFr: "Camions Équipement", description: "Specialized grip trucks, generator vehicles, and secure equipment transport for any production scale.", descriptionFr: "Camions grip, générateurs et transport équipement sécurisé.", icon: "Truck" },
                { title: "4x4 & Specialty", titleFr: "4x4 & Spécialité", description: "Desert-ready 4x4 vehicles, camera tracking cars, and specialty transport for challenging terrain.", descriptionFr: "4x4 désert, voitures caméra et transport spécialisé pour terrains difficiles.", icon: "CarFront" }
            ]
        },

        // 9. CASTING
        {
            title: "Casting",
            title_fr: "Casting",
            slug: "casting",
            icon: "UserCheck",
            type: "content_page",
            brief_description: "Diverse Moroccan talent for international productions. Actors, stunt performers, models, and extras with professional sessions.",
            brief_description_fr: "Talents marocains divers pour productions internationales. Acteurs, cascadeurs, mannequins et figurants.",
            full_description: "<p>Morocco's cultural diversity makes it exceptional for international casting needs.</p>",
            full_description_fr: "<p>La diversité culturelle du Maroc le rend exceptionnel pour le casting international.</p>",
            display_order: 8,
            is_active: true,
            sections: [
                {
                    type: "text_image",
                    layout: "right",
                    title: "Discover Moroccan Talent",
                    titleFr: "Découvrez les Talents Marocains",
                    content: "<p>Morocco's rich history and cultural diversity offer a wide range of looks and profiles, reflecting influences from Europe, the Middle East, Africa, and beyond. TFS works closely with casting directors to source the perfect talent.</p>",
                    contentFr: "<p>L'histoire riche et la diversité culturelle du Maroc offrent une large gamme de looks et profils.</p>"
                },
                {
                    type: "text_only",
                    title: "Professional Sessions",
                    titleFr: "Sessions Professionnelles",
                    content: "<p>All casting sessions are professionally recorded in 4K and photographed. Materials are made available to clients within 48 hours. We have over 10,000 talent profiles in our database.</p>",
                    contentFr: "<p>Toutes les sessions sont enregistrées en 4K et photographiées professionnellement.</p>"
                }
            ],
            stats: [
                { value: "10000+", label: "Talent Database", labelFr: "Base Talents" },
                { value: "4K", label: "Self-Tape", labelFr: "Self-Tape" },
                { value: "48h", label: "Tape Delivery", labelFr: "Livraison" },
                { value: "5", label: "Languages", labelFr: "Langues" }
            ],
            tags: ["Casting", "Actors", "Extras", "Stunts", "Talent", "Models"],
            features: [
                { title: "Professional Actors", titleFr: "Acteurs Pro", description: "Trained actors with international credits, fluent in Arabic, French, English, and Spanish for lead and supporting roles.", descriptionFr: "Acteurs formés avec crédits internationaux, multilingues.", icon: "User" },
                { title: "Stunt Performers", titleFr: "Cascadeurs", description: "Skilled stunt coordinators, martial artists, horseback riders, and action performers for sequences of any scale.", descriptionFr: "Coordinateurs cascades qualifiés, artistes martiaux et cavaliers.", icon: "Swords" },
                { title: "Extras & Background", titleFr: "Figurants", description: "Large database of 10,000+ extras with diverse looks—all ages, ethnicities, and types for any crowd or background scene.", descriptionFr: "Base de 10,000+ figurants avec looks divers pour toute scène.", icon: "Users" }
            ]
        }
    ];

    SERVICES.forEach(svc => {
        const rec = new Record(servicesCol);
        Object.keys(svc).forEach(key => rec.set(key, svc[key]));
        app.save(rec);
        console.log(`[Seed] Created: ${svc.title}`);
    });

    console.log("[Migration] TFS Services with CORRECT format seeded");
}, (app) => { });
