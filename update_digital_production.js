const PocketBase = require('pocketbase').default;

const sections = [
    // --- Producers Section ---
    {
        "type": "text_image",
        "title": "Digital Production for Producers",
        "titleFr": "Production Digitale pour les Producteurs",
        "content": "TFS provides dedicated digital production services for producers looking to create innovative and impactful audiovisual projects in Morocco. Our team of experts handles the creation of tailored digital content that meets your specific needs, while highlighting quality, creativity, and storytelling.",
        "contentFr": "TFS offre un service de production digitale dédié aux producteurs souhaitant réaliser des projets audiovisuels innovants et percutants au Maroc. Notre équipe d’experts se charge de la création de contenus numériques adaptés à vos besoins spécifiques, tout en mettant en avant la qualité et la créativité.",
        "image": "/images/about/about-center.png",
        "layout": "right"
    },
    {
        "type": "features",
        "title": "What we offer",
        "titleFr": "Ce que nous proposons",
        "items": [
            {
                "title": "Video content creation",
                "titleFr": "Création de contenus vidéo",
                "description": "Behind-the-scenes (making-of), promotional clips, teasers, and corporate videos.",
                "descriptionFr": "Making-of, clips promotionnels, teasers, et vidéos institutionnelles."
            },
            {
                "title": "Social media content production",
                "titleFr": "Production de contenu pour les réseaux sociaux",
                "description": "Engaging videos and visuals designed to strengthen your online presence.",
                "descriptionFr": "Vidéos et visuels engageants pour renforcer votre présence en ligne."
            },
            {
                "title": "Photography services",
                "titleFr": "Prise de photos",
                "description": "Professional photo shoots covering productions, behind-the-scenes moments, and team preparations.",
                "descriptionFr": "Shooting photo des tournages et préparatifs des équipes."
            },
            {
                "title": "Strategic consulting",
                "titleFr": "Consultation stratégique",
                "description": "Support in developing and implementing effective digital and content strategies.",
                "descriptionFr": "Accompagnement dans la mise en place de stratégies numériques et de contenu."
            }
        ]
    },
    {
        "type": "text_only",
        "content": "Whether you are an independent production company or a major production house, we have the tools and expertise to turn your ideas into compelling digital experiences.",
        "contentFr": "Que vous soyez une petite production ou une grande maison de production, nous avons les outils et le savoir-faire pour transformer vos idées en réalité digitale."
    },

    // --- Companies Section ---
    {
        "type": "text_image",
        "title": "Digital Production for Companies",
        "titleFr": "Production Digitale pour les Entreprises",
        "content": "Our digital production services for businesses help transform your ideas into high-impact visual content designed to attract, engage, and retain your audience. We support you in creating effective digital assets by offering customized solutions aligned with your communication and marketing objectives.",
        "contentFr": "Notre service de production digitale pour entreprises vous aide à transformer vos idées en contenus visuels impactants, conçus pour attirer, engager et fidéliser votre audience. Nous vous accompagnons dans la création de supports numériques efficaces, en vous offrant des solutions personnalisées en fonction de vos objectifs de communication et de marketing.",
        "image": "/images/about/about-center.png",
        "layout": "left"
    },
    {
        "type": "features",
        "title": "What we offer",
        "titleFr": "Ce que nous proposons",
        "items": [
            {
                "title": "Corporate and institutional video production",
                "titleFr": "Création de vidéos institutionnelles et corporatives",
                "description": "Present your company, products, or services through engaging and professional videos.",
                "descriptionFr": "Présentation de votre entreprise, produits ou services sous forme de vidéos captivantes."
            },
            {
                "title": "Web and social media content creation",
                "titleFr": "Production de contenus pour le web et les réseaux sociaux",
                "description": "Explainer videos, client testimonials, case studies, and viral-ready content.",
                "descriptionFr": "Vidéos explicatives, témoignages clients, études de cas, et contenus viraux."
            },
            {
                "title": "Interactive websites and applications",
                "titleFr": "Sites web et applications interactives",
                "description": "Development of dynamic websites and interactive applications to enhance your online visibility.",
                "descriptionFr": "Création de sites web dynamiques et d’applications pour renforcer votre visibilité en ligne."
            },
            {
                "title": "Webinars and podcasts",
                "titleFr": "Webinaires et podcasts",
                "description": "Planning and production of webinars, podcasts, and online events to showcase your expertise.",
                "descriptionFr": "Organisation et production de webinaires, podcasts et événements en ligne pour promouvoir votre expertise."
            },
            {
                "title": "Visual identity & brand guidelines",
                "titleFr": "Identité Visuelle et Charte Graphique",
                "description": "Building a credible, modern, and consistent brand image.",
                "descriptionFr": "Construire une image crédible, moderne et cohérente."
            }
        ]
    },
    {
        "type": "text_only",
        "content": "Schools, restaurants, real estate developers, and more — we understand your specific challenges and tailor our services to help you achieve your business goals while connecting authentically with your audience.",
        "contentFr": "Ecoles, restaurants, promoteurs immobiliers…nous comprenons vos défis spécifiques et nous adaptons nos services à vos besoins pour vous aider à atteindre vos objectifs commerciaux tout en vous connectant avec vos clients de manière authentique."
    }
];

async function updateService() {
    const pb = new PocketBase('http://127.0.0.1:8090');
    try {
        await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');

        let service;
        try {
            service = await pb.collection('services').getFirstListItem('slug="digital-production"');
        } catch (e) {
            service = await pb.collection('services').getFirstListItem('slug="digital-services"');
        }

        if (service) {
            console.log(`Updating service: ${service.slug}`);
            await pb.collection('services').update(service.id, {
                sections: JSON.stringify(sections)
            });
            console.log("✅ Service updated successfully!");
        } else {
            console.error("❌ Service not found.");
        }

    } catch (e) {
        console.error("Error:", e);
    }
}

updateService();
