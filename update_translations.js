
const translations = {
    "film-shipping": {
        brief: "Expertise en dédouanement et expédition internationale pour l'équipement de tournage.",
        full: "<p>Nous assurons une logistique fluide pour votre équipement de production à travers les frontières. Nos services incluent la gestion des carnets ATA, le dédouanement temporaire et l'expédition sécurisée par fret aérien ou maritime.</p>"
    },
    "equipment-hire": {
        brief: "Location de caméras, lumières et équipements de cinéma de pointe.",
        full: "<p>Accédez à notre vaste inventaire comprenant les dernières caméras ARRI, RED, Sony, ainsi qu'une gamme complète d'éclairages et de machinerie. Tout notre matériel est méticuleusement entretenu et testé.</p>"
    },
    "broadcasting-live": {
        brief: "Solutions de diffusion en direct pour événements et productions.",
        full: "<p>Services complets de régie et de diffusion pour le sport, les concerts et les événements d'entreprise. Nous fournissons la technologie et l'expertise pour des directs sans faille.</p>"
    },
    "film-permits": {
        brief: "Gestion des autorisations de tournage et permis de localisation.",
        full: "<p>Nous naviguons dans la bureaucratie pour obtenir vos permis de tournage rapidement. Que ce soit en ville, dans des lieux historiques ou des zones protégées, nous avons les contacts nécessaires.</p>"
    },
    "crewing": {
        brief: "Personnel technique qualifié pour vos productions.",
        full: "<p>Trouvez les meilleurs techniciens de l'industrie : chefs opérateurs, assistants, ingénieurs du son, et plus encore. Nos équipes sont bilingues et expérimentées.</p>"
    },
    "scouting": {
        brief: "Repérage de lieux de tournage exceptionnels.",
        full: "<p>Découvrez des décors uniques pour votre prochain projet. Nos repéreurs connaissent les lieux les plus photogéniques et gèrent les négociations avec les propriétaires.</p>"
    },
    "catering": {
        brief: "Services de restauration complets pour équipes de tournage.",
        full: "<p>Des repas sains et variés pour garder votre équipe énergique. Nous nous adaptons à tous les régimes alimentaires et horaires de tournage.</p>"
    },
    "accommodation": {
        brief: "Hébergement et logistique pour vos équipes.",
        full: "<p>Nous organisons le logement de votre équipe à proximité des lieux de tournage, en négociant les meilleurs tarifs hôteliers et en gérant les transports.</p>"
    },
    "transportation": {
        brief: "Transport logistique pour matériel et personnel.",
        full: "<p>Flotte de véhicules adaptés au cinéma : camions loges, camions caméra, vans de production. Chauffeurs expérimentés habitués aux horaires de tournage.</p>"
    },
    "casting": {
        brief: "Services de casting pour acteurs et figurants.",
        full: "<p>Accès à un large vivier de talents locaux et internationaux. Nous organisons les auditions et gérons les contrats pour vos acteurs et figurants.</p>"
    },
    "makeup-hair": {
        brief: "Coiffure et maquillage professionnel pour le cinéma.",
        full: "<p>Artistes maquilleurs et coiffeurs expérimentés pour le cinéma, la TV et la mode. Effets spéciaux, prothèses et mises en beauté naturelle.</p>"
    },
    "costume-wardrobe": {
        brief: "Gestion des costumes et stylisme.",
        full: "<p>Création, location et gestion de costumes. Nos stylistes travaillent en étroite collaboration avec la direction artistique pour donner vie à vos personnages.</p>"
    },
    "props-set-dressing": {
        brief: "Accessoires et décoration de plateau.",
        full: "<p>Recherche et création d'accessoires. Nos décorateurs transforment n'importe quel lieu pour correspondre à votre vision artistique.</p>"
    },
    "security-management": {
        brief: "Sécurité pour plateaux de tournage et événements.",
        full: "<p>Protection des équipements, contrôle d'accès et sécurité des VIP. Nos agents sont formés aux spécificités des environnements de production.</p>"
    },
    "sporting-events": {
        brief: "Production et couverture d'événements sportifs majeurs.",
        full: "<p>Captation multi-caméras et retransmission d'événements sportifs. Ralentis, graphiques en direct et commentaires pour une expérience spectateur immersive.</p>"
    }
};

// Generic for TFS Sports series
const sports = [
    "tfs-football", "tfs-baseball", "tfs-basketball", "tfs-motorsports",
    "tfs-athletics", "tfs-combat-sports", "tfs-tennis", "tfs-rugby",
    "tfs-cycling", "tfs-extreme-sports"
];

sports.forEach(slug => {
    const sportName = slug.replace("tfs-", "").replace("-", " ");
    const Name = sportName.charAt(0).toUpperCase() + sportName.slice(1);
    translations[slug] = {
        brief: `Couverture experte et production pour le ${Name}.`,
        full: `<p>Spécialistes de la captation de ${Name}. Nous offrons des solutions complètes incluant caméras haute vitesse, drones et régie mobile pour sublimer chaque action.</p>`
    };
});

async function updateTranslations() {
    const { default: PocketBase } = await import('pocketbase');
    const pb = new PocketBase('http://127.0.0.1:8090');

    try {
        console.log("--- Updating Service Translations ---");

        // Authenticate
        await pb.admins.authWithPassword('zakiossama28@gmail.com', 'GloXoss123.');
        console.log("✅ Authenticated as admin.");

        for (const [slug, texts] of Object.entries(translations)) {
            try {
                const service = await pb.collection('services').getFirstListItem(`slug="${slug}"`);
                await pb.collection('services').update(service.id, {
                    brief_description_fr: texts.brief,
                    full_description_fr: texts.full
                });
                console.log(`✅ Updated: ${slug}`);
            } catch (e) {
                console.log(`❌ Failed: ${slug} (${e.message})`);
            }
        }

        console.log("--- Update Complete ---");

    } catch (e) {
        console.error("General Error:", e.message);
    }
}

updateTranslations();
