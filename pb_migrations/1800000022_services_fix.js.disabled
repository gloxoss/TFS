/// <reference path="../pb_data/types.d.ts" />
/**
 * TFS Services - SEO ENHANCED V3
 * 
 * FIXED: 
 * - Uses hero_image field for hero background (NOT section[0].image)
 * - Sections use unique images (no duplicates)
 * - Alternating layouts: section1 = left (text right), section2 = right (text left)
 * - Placeholder images marked with "placeholder-" prefix for manual replacement
 * 
 * Valid section types: text_image, text_only, image_only
 */
migrate((app) => {
    const servicesData = {
        "equipment-hire": {
            hero_image: "/images/services/equipment/hero.webp",
            sections: [
                {
                    type: "text_image",
                    title: "Premier Cinema Equipment Rental in Morocco",
                    titleFr: "Location d'Équipement Cinéma de Premier Plan au Maroc",
                    content: "TFS Cinema Solutions provides top-tier camera, lighting, and grip rental services for international film productions filming in Morocco. Our extensive inventory features industry-standard gear including the ARRI ALEXA 35, ARRI ALEXA Mini LF, Sony VENICE 2, and RED DSMC2 Monstro 8K VV, alongside premium optics from Cooke S4/i, Zeiss Supreme Primes, and ARRI Signature Primes. We ensure every piece of cinema equipment is meticulously maintained, calibrated, and camera-ready.",
                    contentFr: "TFS Cinema Solutions fournit des services de location de caméras, d'éclairage et de machinerie de haut niveau pour les productions cinématographiques internationales tournant au Maroc. Notre inventaire comprend des équipements standards de l'industrie comme l'ARRI ALEXA 35, l'ARRI ALEXA Mini LF, la Sony VENICE 2, et la RED DSMC2 Monstro 8K VV.",
                    layout: "left",
                    image: "/images/services/equipment/tech-support.jpg"
                },
                {
                    type: "text_image",
                    title: "24/7 Technical Support & On-Set Maintenance",
                    titleFr: "Support Technique 24/7 et Maintenance sur Plateau",
                    content: "Our dedicated technical team at TFS Cinema Solutions offers round-the-clock support for all equipment rental packages during your Morocco film production. From on-set troubleshooting and emergency repairs to rapid equipment replacement anywhere in Morocco, we guarantee seamless operation during your shoot.",
                    contentFr: "Notre équipe technique dédiée chez TFS Cinema Solutions offre un support 24/7 pour tous les forfaits de location d'équipement pendant votre production au Maroc. Du dépannage sur plateau aux réparations d'urgence.",
                    layout: "right",
                    image: "/images/services/equipment/placeholder-maintenance.jpg"
                }
            ]
        },
        "film-shipping": {
            hero_image: "/images/services/shipping/hero.jpg",
            sections: [
                {
                    type: "text_image",
                    title: "Expert Film Equipment Logistics & Customs Clearance",
                    titleFr: "Logistique Experte et Dédouanement d'Équipement Cinéma",
                    content: "TFS Film Solutions specializes in the complex logistics of importing and exporting filming equipment to and from Morocco. Our experienced logistics coordinators manage the entire customs clearance process at all Moroccan ports and airports, handling sensitive shipments including cinema cameras, prime lenses, grip trucks, and specialty vehicles with strict regulatory compliance.",
                    contentFr: "TFS Film Solutions se spécialise dans la logistique complexe de l'importation et l'exportation d'équipement de tournage vers et depuis le Maroc.",
                    layout: "left",
                    image: "/images/services/shipping/logistics.jpg"
                },
                {
                    type: "text_image",
                    title: "Secure Door-to-Door Production Delivery",
                    titleFr: "Livraison Porte-à-Porte Sécurisée pour Productions",
                    content: "TFS Cinema Solutions provides comprehensive door-to-door shipping coordination for international film productions, working closely with Moroccan governmental authorities and trusted global freight partners. Whether handling temporary imports with ATA carnets or managing permanent equipment imports for co-productions.",
                    contentFr: "TFS Cinema Solutions assure une coordination complète de l'expédition porte-à-porte pour les productions cinématographiques internationales.",
                    layout: "right",
                    image: "/images/services/shipping/placeholder-delivery.jpg"
                }
            ]
        },
        "film-permits": {
            hero_image: "/images/services/permits/hero.jpg",
            sections: [
                {
                    type: "text_image",
                    title: "Official CCM Permit Coordination & Licensing",
                    titleFr: "Coordination Officielle des Permis CCM et Licences",
                    content: "As a trusted partner in the Moroccan film industry, TFS Cinema Solutions maintains strong, direct relationships with the Centre Cinématographique Marocain (CCM) and all relevant governmental authorities. We act as your official liaison for securing all necessary filming authorizations and permits.",
                    contentFr: "En tant que partenaire de confiance dans l'industrie cinématographique marocaine, TFS Cinema Solutions maintient des relations directes avec le CCM.",
                    layout: "left",
                    image: "/images/services/permits/ccm-authorization.jpg"
                },
                {
                    type: "text_image",
                    title: "Fast-Track Government Authorizations",
                    titleFr: "Autorisations Gouvernementales Accélérées",
                    content: "Our proactive communication with Moroccan governmental departments ensures permit applications are processed efficiently for your film production timeline. TFS Film Solutions coordinates with municipal authorities, police departments, and regional governments to secure location access permits.",
                    contentFr: "Notre communication proactive avec les départements gouvernementaux marocains assure un traitement efficace des demandes de permis.",
                    layout: "right",
                    image: "/images/services/permits/government-liaison.jpg"
                }
            ]
        },
        "crewing": {
            hero_image: "/images/services/crewing/hero.jpg",
            sections: [
                {
                    type: "text_image",
                    title: "World-Class Multilingual Film Crews",
                    titleFr: "Équipes de Tournage Multilingues de Classe Mondiale",
                    content: "TFS Cinema Solutions provides access to an extensive database of highly skilled film technicians and production professionals with proven international project experience. Our crews include cinematographers, camera operators, gaffers, key grips, sound mixers, and department heads fluent in English, French, Arabic, and Spanish.",
                    contentFr: "TFS Cinema Solutions donne accès à une base de données étendue de techniciens de cinéma hautement qualifiés et professionnels de production.",
                    layout: "left",
                    image: "/images/services/crewing/multilingual-team.webp"
                },
                {
                    type: "text_image",
                    title: "Tailored Technical Talent Matching",
                    titleFr: "Matching de Talents Techniques sur Mesure",
                    content: "We carefully select and vet local Moroccan talent to match your film production's specific creative and technical requirements. TFS Film Solutions personally interviews each crew member, verifying their credits, technical expertise, and professionalism before recommendation.",
                    contentFr: "Nous sélectionnons et vérifions soigneusement les talents locaux marocains pour correspondre aux exigences de votre production.",
                    layout: "right",
                    image: "/images/services/crewing/placeholder-talent.jpg"
                }
            ]
        },
        "scouting": {
            hero_image: "/images/services/scouting/hero.jpg",
            sections: [
                {
                    type: "text_image",
                    title: "Strategic Location Scouting Across Morocco",
                    titleFr: "Repérage de Lieux Stratégique à Travers le Maroc",
                    content: "TFS Cinema Solutions transforms your screenplay into visual reality by identifying precise location matches across Morocco's incredibly diverse landscapes. From the sweeping Sahara Desert dunes to ancient Medinas, Roman ruins, snow-capped Atlas Mountains, and Atlantic coastal cliffs.",
                    contentFr: "TFS Cinema Solutions transforme votre scénario en réalité visuelle en identifiant des correspondances précises de lieux.",
                    layout: "left",
                    image: "/images/services/scouting/desert-landscape.avif"
                },
                {
                    type: "text_image",
                    title: "Comprehensive Location Library & Documentation",
                    titleFr: "Bibliothèque de Lieux Complète et Documentation",
                    content: "Film production clients gain exclusive access to our extensive photo and video library showcasing Morocco's most iconic and hidden filming locations. Our expert location scouts leverage decades of combined experience in the Moroccan film industry.",
                    contentFr: "Les clients de production cinématographique obtiennent un accès exclusif à notre vaste bibliothèque de photos et vidéos.",
                    layout: "right",
                    image: "/images/services/scouting/placeholder-library.jpg"
                }
            ]
        },
        "catering": {
            hero_image: "/images/services/catering/hero.jpg",
            sections: [
                {
                    type: "text_image",
                    title: "Professional Film Set Catering Services",
                    titleFr: "Services Traiteur Professionnels pour Plateaux de Tournage",
                    content: "TFS Cinema Solutions offers reliable, high-quality catering services led by professionally trained chefs who prioritize food safety, hygiene, and exceptional taste for demanding film productions. We source fresh ingredients daily from local Moroccan markets.",
                    contentFr: "TFS Cinema Solutions offre des services de traiteur fiables et de haute qualité dirigés par des chefs professionnellement formés.",
                    layout: "left",
                    image: "/images/services/catering/flexible-service.jpg"
                },
                {
                    type: "text_image",
                    title: "Flexible Production Dining Solutions",
                    titleFr: "Solutions de Repas de Production Flexibles",
                    content: "Whether your film production needs all-day craft services for continuous grazing, structured set menus for scheduled meal breaks, or customized meal plans for special requests and VIP talent, our catering solutions adapt seamlessly.",
                    contentFr: "Que votre production ait besoin de services de régie toute la journée, de menus structurés, nos solutions s'adaptent parfaitement.",
                    layout: "right",
                    image: "/images/services/catering/placeholder-dining.jpg"
                }
            ]
        },
        "accommodation": {
            hero_image: "/images/services/accommodation/luxury-hotel.jpg",
            sections: [
                {
                    type: "text_image",
                    title: "Optimized Production Travel Logistics",
                    titleFr: "Logistique de Voyage de Production Optimisée",
                    content: "Our production coordinators at TFS Cinema Solutions specialize in comprehensive travel logistics for international film productions, including hotel bookings, air transportation, and ground transfers throughout Morocco. We leverage long-standing partnerships with Morocco's finest hospitality providers.",
                    contentFr: "Nos coordinateurs de production chez TFS Cinema Solutions se spécialisent dans la logistique de voyage complète.",
                    layout: "left",
                    image: "/images/services/accommodation/moroccan-riad.jpg"
                },
                {
                    type: "text_image",
                    title: "Comfortable Cast & Crew Lodging",
                    titleFr: "Hébergement Confortable pour Distribution et Équipe",
                    content: "TFS Film Solutions arranges accommodation tailored to any production budget while maintaining high comfort standards essential for keeping your cast and crew rested and productive. From major Moroccan cities to remote shooting locations.",
                    contentFr: "TFS Film Solutions organise des hébergements adaptés à tout budget de production.",
                    layout: "right",
                    image: "/images/services/accommodation/placeholder-crew.jpg"
                }
            ]
        },
        "transportation": {
            hero_image: "/images/services/transportation/hero.jpg",
            sections: [
                {
                    type: "text_image",
                    title: "Diverse Film Production Vehicle Fleet",
                    titleFr: "Flotte Diversifiée de Véhicules de Production",
                    content: "TFS Cinema Solutions provides dependable, budget-efficient transportation solutions with a diverse fleet specifically adapted to the demanding needs of film productions in Morocco. From fully-equipped grip trucks to comfortable passenger shuttles.",
                    contentFr: "TFS Cinema Solutions fournit des solutions de transport fiables et économiques avec une flotte diversifiée.",
                    layout: "left",
                    image: "/images/services/transportation/desert-4x4.jpg"
                },
                {
                    type: "text_image",
                    title: "Specialized Off-Road & Remote Access",
                    titleFr: "Accès Spécialisé Hors-Piste et Zones Isolées",
                    content: "For complex film shoots in challenging terrain, TFS Film Solutions coordinates specialized 4x4 vehicles, modified desert transport, and off-road solutions for safe access to Morocco's most remote and spectacular filming locations.",
                    contentFr: "Pour les tournages complexes en terrain difficile, TFS Film Solutions coordonne des véhicules 4x4 spécialisés.",
                    layout: "right",
                    image: "/images/services/transportation/placeholder-offroad.jpg"
                }
            ]
        },
        "casting": {
            hero_image: "/images/services/casting/hero.jpg",
            sections: [
                {
                    type: "text_image",
                    title: "Diverse International Talent Pool",
                    titleFr: "Vivier de Talents Internationaux Diversifiés",
                    content: "Morocco's rich multicultural history makes it an exceptional destination for diverse casting requirements. TFS Cinema Solutions accesses a wide range of professional profiles reflecting the region's unique blend of European, Middle Eastern, Berber, and African influences.",
                    contentFr: "L'histoire multiculturelle riche du Maroc en fait une destination exceptionnelle pour des exigences de casting diverses.",
                    layout: "left",
                    image: "/images/services/casting/auditions.jpg"
                },
                {
                    type: "text_image",
                    title: "Professional Audition Management",
                    titleFr: "Gestion d'Auditions Professionnelle",
                    content: "TFS Film Solutions manages the entire casting process for productions filming in Morocco, from initial talent sourcing for background extras to principal role auditions. All casting sessions are professionally recorded in high-definition video.",
                    contentFr: "TFS Film Solutions gère l'ensemble du processus de casting pour les productions tournant au Maroc.",
                    layout: "right",
                    image: "/images/services/casting/placeholder-casting.jpg"
                }
            ]
        }
    };

    const services = app.findRecordsByFilter("services", "slug != ''", "", 50, 0);

    services.forEach(service => {
        const slug = service.get("slug");
        const data = servicesData[slug];

        if (data) {
            // Set hero_image separately from sections
            if (data.hero_image) {
                service.set("hero_image", data.hero_image);
            }
            service.set("sections", data.sections);
            app.save(service);
            console.log(`[FIXED V3] Updated: ${slug} with hero_image and unique section images`);
        }
    });

    console.log("[Migration] All services fixed with unique images and alternating layouts");
}, (app) => { });
