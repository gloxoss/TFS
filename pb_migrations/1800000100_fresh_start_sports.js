/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    const collection = app.findCollectionByNameOrId("services")

    // 0. SCHEMA UPDATE (Ensure heroImage field exists)
    let hasHeroImage = false
    try {
        // collection.fields is an array list in Go/PB, identifiable by name
        // In JSVM, we might iterate or use findByName if available. 
        // Safer to check by iterating.
        // PB 0.22+ JSVM: collection.fields.getByName("heroImage") might throw or return null

        // Loop check
        for (const f of collection.fields) {
            if (f.name === "heroImage") {
                hasHeroImage = true
                break
            }
        }
    } catch (e) { }

    if (!hasHeroImage) {
        console.log("[Migration] Adding heroImage field to services collection...")
        collection.fields.addAt(collection.fields.length, new Field({
            "name": "heroImage",
            "type": "text",
            "required": false,
            "presentable": false,
            "system": false,
            "options": {
                "pattern": ""
            }
        }))
        app.save(collection)
    }

    // 1. CLEANUP (Delete all existing sport services to ensure clean state)
    const slugsToDelete = [
        "sporting-events", // The Main Hub
        "sports-broadcast", // Possible legacy slug
        "tfs-football",
        "tfs-baseball",
        "tfs-basketball",
        "tfs-motorsports",
        "tfs-athletics",
        "tfs-combat-sports",
        "tfs-tennis",
        "tfs-rugby",
        "tfs-cycling",
        "tfs-extreme-sports",
        "tfs-extreme-action-sports" // Possible typo/variant
    ]

    console.log("[Migration] Cleaning up existing sports services...")
    slugsToDelete.forEach(slug => {
        try {
            const records = app.findRecordsByFilter("services", `slug = "${slug}"`, "", 10)
            records.forEach(r => app.delete(r))
        } catch (e) { }
    })


    // 2. DEFINE CONTENT
    const subServicesData = [
        {
            title: "TFS Football",
            slug: "tfs-football",
            brief_description: "Elite broadcast coverage for professional leagues, clubs, and international competitions.",
            full_description: "<p>TFS Football delivers elite broadcast coverage for professional leagues, clubs, federations, and international competitions. Our productions combine multi-camera stadium setups, aerial systems such as Spidercam and Cablecam, stabilized sideline movement, and cinematic tracking to capture the full intensity of the game. From pre-match atmosphere to decisive moments and post-match reactions, we ensure a complete football storytelling experience that meets the highest international broadcast standards.</p>",
            template: "showcase",
            display_order: 100,
            heroImage: "/images/services/sports/20250829_192233.jpg",
            sections: [
                {
                    type: "text_image",
                    title: "Stadium Scale Coverage",
                    content: "Multi-camera setups capturing every angle of the pitch, from wide tactical shots to emotional close-ups.",
                    image: "/images/services/sports/20250829_192233.jpg",
                    layout: "right"
                },
                {
                    type: "text_image",
                    title: "Advanced Aerial Systems",
                    content: "Spidercam and Cablecam technology providing dynamic overhead perspectives of the action.",
                    image: "/images/services/sports/20250829_192233.jpg",
                    layout: "left"
                }
            ],
            features: [
                { title: "Multi-Camera", description: "Comprehensive stadium setups.", icon: "Camera" },
                { title: "Aerial Cams", description: "Spidercam & Cablecam support.", icon: "Aperture" },
                { title: "Sideline Tech", description: "Stabilized tracking units.", icon: "Activity" }
            ]
        },
        {
            title: "TFS Baseball",
            slug: "tfs-baseball",
            brief_description: "Precision, timing, and visual clarity for professional baseball events.",
            full_description: "<p>TFS Baseball focuses on precision, timing, and visual clarity. We deploy high-speed cameras, advanced stabilization systems, and carefully positioned angles to capture every pitch, hit, and defensive play. Our coverage emphasizes accurate replays, tactical storytelling, and player focus, delivering clean, broadcast-ready productions for professional baseball events.</p>",
            template: "showcase",
            display_order: 101,
            heroImage: "/images/services/sports/20250830_105916.jpg",
            sections: [
                {
                    type: "text_image",
                    title: "High-Speed Capture",
                    content: "Ultra-slow motion replays to analyze the mechanics of every pitch and swing.",
                    image: "/images/services/sports/20250830_105916.jpg",
                    layout: "right"
                }
            ],
            features: [
                { title: "High-Speed", description: "Detailed slow-motion replays.", icon: "Zap" },
                { title: "Tactical Angles", description: "Strategic camera positioning.", icon: "Target" },
                { title: "Player Focus", description: "Emphasizing individual performance.", icon: "User" }
            ]
        },
        {
            title: "TFS Basketball",
            slug: "tfs-basketball",
            brief_description: "Immersive court-level coverage and dynamic visuals for fast-paced action.",
            full_description: "<p>Fast, dynamic, and intense, basketball demands flawless execution. TFS Basketball provides immersive court-level coverage, smooth stabilized movement, overhead perspectives, and crowd-driven visuals. Our approach enhances the rhythm of the game while delivering cinematic replays and high-impact broadcast storytelling.</p>",
            template: "showcase",
            display_order: 102,
            heroImage: "/images/services/sports/20250830_162318.jpg",
            sections: [
                {
                    type: "text_image",
                    title: "Court-Level Immersion",
                    content: "Get close to the action with stabilized mobile units on the sideline.",
                    image: "/images/services/sports/20250830_162318.jpg",
                    layout: "left"
                }
            ],
            features: [
                { title: "Court-Level", description: "Immersive sideline perspectives.", icon: "Maximize" },
                { title: "Dynamic Motion", description: "Matching the game's speed.", icon: "Activity" },
                { title: "Crowd Emotion", description: "Capturing the atmosphere.", icon: "Users" }
            ]
        },
        {
            title: "TFS Motorsports",
            slug: "tfs-motorsports",
            brief_description: "High-performance broadcast solutions capturing extreme speed and technical precision.",
            full_description: "<p>TFS Motorsports delivers high-performance broadcast solutions for racing and motorsport events. Using Speedcam, Cablecam, Electro Moto, AGITO systems, and advanced tracking technologies, we capture extreme speed, technical precision, and driver emotion. Every shot is designed for safety, accuracy, and maximum visual impact.</p>",
            template: "showcase",
            display_order: 103,
            heroImage: "/images/services/sports/20250831_114505.jpg",
            sections: [
                {
                    type: "text_image",
                    title: "Speed Tracking",
                    content: "Specialized tracking vehicles and cameras to keep pace with high-speed racing.",
                    image: "/images/services/sports/20250831_114505.jpg",
                    layout: "right"
                }
            ],
            features: [
                { title: "Speedcam", description: "Ultra-fast tracking capability.", icon: "Zap" },
                { title: "Robotic Systems", description: "AGITO & remote heads.", icon: "Cpu" },
                { title: "Safety First", description: "Secure rigging and operation.", icon: "Shield" }
            ]
        },
        {
            title: "TFS Athletics",
            slug: "tfs-athletics",
            brief_description: "Precise athlete tracking and dramatic presentation for track and field.",
            full_description: "<p>From explosive sprints to technical field events, TFS Athletics ensures precise athlete tracking and dramatic visual presentation. Our systems provide wide coverage, smooth motion, and accurate timing to highlight performance, competition, and emotional moments at the highest level of sport.</p>",
            template: "showcase",
            display_order: 104,
            heroImage: "/images/services/sports/20250831_114512.jpg",
            sections: [
                {
                    type: "text_image",
                    title: "Precision Tracking",
                    content: "Following athletes seamlessly from start block to finish line.",
                    image: "/images/services/sports/20250831_114512.jpg",
                    layout: "left"
                }
            ],
            features: [
                { title: "Track Coverage", description: "smooth rail & mobile cams.", icon: "Activity" },
                { title: "Field Events", description: "Dedicated technical angles.", icon: "Target" },
                { title: "Emotion", description: "Finish line reactions.", icon: "Heart" }
            ]
        },
        {
            title: "TFS Combat Sports",
            slug: "tfs-combat-sports",
            brief_description: "Close-range intensity, capturing power, tension, and emotion inside the ring.",
            full_description: "<p>TFS Combat Sports specializes in boxing, MMA, and martial arts productions. We focus on close-range intensity, reaction shots, impact moments, and atmosphere. Our coverage brings viewers inside the fight, capturing power, tension, and emotion with cinematic precision.</p>",
            template: "showcase",
            display_order: 105,
            heroImage: "/images/services/sports/20250831_114519.jpg",
            sections: [
                {
                    type: "text_image",
                    title: "Ringside Intensity",
                    content: "Capturing every strike and grapple with high-impact close-ups.",
                    image: "/images/services/sports/20250831_114519.jpg",
                    layout: "right"
                }
            ],
            features: [
                { title: "Close-Range", description: "Intimate fighting action.", icon: "ZoomIn" },
                { title: "Impact", description: "Highlighting power shots.", icon: "Zap" },
                { title: "Atmosphere", description: "Crowd and corner reactions.", icon: "Mic" }
            ]
        },
        {
            title: "TFS Tennis",
            slug: "tfs-tennis",
            brief_description: "Clean, tactical, and elegant coverage with precision camera placement.",
            full_description: "<p>TFS Tennis delivers clean, tactical, and elegant broadcast coverage. With precision camera placement, smooth tracking, and player-focused storytelling, we capture every rally, reaction, and decisive point with clarity and broadcast-level accuracy.</p>",
            template: "showcase",
            display_order: 106,
            heroImage: "/images/services/sports/20250831_164803.jpg",
            sections: [
                {
                    type: "text_image",
                    title: "Tactical Overview",
                    content: "High angles revealing court geometry and player strategy.",
                    image: "/images/services/sports/20250831_164803.jpg",
                    layout: "left"
                }
            ],
            features: [
                { title: "Precision", description: "Exact ball tracking.", icon: "Crosshair" },
                { title: "Elegance", description: "Smooth camera movement.", icon: "Feather" },
                { title: "Reactions", description: "Player focus.", icon: "User" }
            ]
        },
        {
            title: "TFS Rugby",
            slug: "tfs-rugby",
            brief_description: "Total coverage of physical intensity and tactical movement.",
            full_description: "<p>Physical, fast, and unpredictable, rugby requires total coverage. TFS Rugby combines aerial systems, stabilized sideline cameras, and multi-angle setups to capture the intensity of collisions, tactical movement, and the flow of the game from every perspective.</p>",
            template: "showcase",
            display_order: 107,
            heroImage: "/images/services/sports/20250904_174540.jpg",
            sections: [
                {
                    type: "text_image",
                    title: "Impact Coverage",
                    content: "Capturing the physicality of the scrum and the speed of the break.",
                    image: "/images/services/sports/20250904_174540.jpg",
                    layout: "right"
                }
            ],
            features: [
                { title: "Aerial View", description: "Tactical overheads.", icon: "Aperture" },
                { title: "Sideline", description: "Tracking the run.", icon: "Activity" },
                { title: "Impact", description: "Capturing collisions.", icon: "Zap" }
            ]
        },
        {
            title: "TFS Cycling",
            slug: "tfs-cycling",
            brief_description: "Long-distance broadcast solutions for road, track, and mountain cycling.",
            full_description: "<p>TFS Cycling provides long-distance broadcast solutions for road, track, and mountain cycling events. Using mobile tracking units, aerial coverage, and stabilized cameras, we maintain visual continuity across extended routes and challenging environments while following the athletes in real time.</p>",
            template: "showcase",
            display_order: 108,
            heroImage: "/images/services/sports/20250905_172243.jpg",
            sections: [
                {
                    type: "text_image",
                    title: "Mobile Tracking Unit",
                    content: "Motorcycles and vehicles equipped with stabilized cameras for road coverage.",
                    image: "/images/services/sports/20250905_172243.jpg",
                    layout: "left"
                }
            ],
            features: [
                { title: "Mobile Units", description: "Moto & vehicle tracking.", icon: "Truck" },
                { title: "Aerial Support", description: "Helicopter & drone shots.", icon: "Wind" },
                { title: "Long-Range", description: "Extended transmission.", icon: "Wifi" }
            ]
        },
        {
            title: "TFS Extreme & Action Sports",
            slug: "tfs-extreme-sports",
            brief_description: "Creative, mobile, and cinematic coverage for action-driven productions.",
            full_description: "<p>From skateboarding to urban and extreme sports, TFS delivers creative, mobile, and cinematic coverage. Our lightweight stabilization systems and dynamic movement techniques allow us to capture raw energy, authentic motion, and strong visual identity for action-driven productions.</p>",
            template: "showcase",
            display_order: 109,
            heroImage: "/images/services/sports/20250905_173321.jpg",
            sections: [
                {
                    type: "text_image",
                    title: "Dynamic Movement",
                    content: "Using gimbals and compact cameras to move with the athlete.",
                    image: "/images/services/sports/20250905_173321.jpg",
                    layout: "right"
                }
            ],
            features: [
                { title: "Mobility", description: "Lightweight gear.", icon: "Move" },
                { title: "Energy", description: "Dynamic camera moves.", icon: "Zap" },
                { title: "Authenticity", description: "Street-style production.", icon: "Camera" }
            ]
        }
    ]


    // 3. CREATE RESOURCES
    // Helper to create a service
    const createService = (data) => {
        const record = new Record(collection)

        // Common fields
        record.set("title", data.title)
        record.set("slug", data.slug)
        record.set("type", "content_page")
        record.set("is_active", true)

        // Optional fields
        if (data.brief_description) record.set("brief_description", data.brief_description)
        if (data.full_description) record.set("full_description", data.full_description)
        if (data.template) record.set("template", data.template)
        if (data.display_order) record.set("display_order", data.display_order)
        if (data.sections) record.set("sections", JSON.stringify(data.sections))
        if (data.features) record.set("features", JSON.stringify(data.features))
        if (data.sub_services) record.set("sub_services", JSON.stringify(data.sub_services))
        if (data.heroImage) record.set("heroImage", data.heroImage)

        app.save(record)
        console.log(`[Migration] Created service: ${data.slug}`)
        return record
    }

    // Create sub-services
    console.log("[Migration] Re-creating sub-services...")
    subServicesData.forEach(svc => createService(svc))

    // Create Parent Hub
    console.log("[Migration] Re-creating Sports Hub parent (Sporting Events)...")
    createService({
        title: "Sporting Events",
        slug: "sporting-events",
        brief_description: "High-end sports broadcasting and production for live events and cinematic storytelling.",
        full_description: "<p>TFS (TV Film Solutions) is a high-end sports broadcasting and production company delivering world-class visual coverage for live events, competitions, and cinematic sports storytelling. We specialize in elite broadcast solutions, combining cutting-edge camera systems, advanced motion technology, and professional communication infrastructure to capture sport with precision, intensity, and emotion.</p>",
        template: "hub",
        display_order: 16,
        sub_services: subServicesData.map(s => s.slug),
        sections: [
            {
                type: "text_image",
                title: "Unmatched Technology. Total Control.",
                content: "At TFS, technology is not an option—it’s our foundation. We operate the most advanced stabilization and motion systems in the industry, including MK-V Steadicam, ARRI Artemis 2, and ARRI Trinity. These systems allow us to deliver fluid, dynamic, and cinematic movement, even in the most intense live sports environments.",
                image: "/images/services/sports/technology-hub.jpg",
                layout: "right"
            },
            {
                type: "text_image",
                title: "Advanced Motion & Aerial Solutions",
                content: "To capture sport from every possible angle, we deploy Spidercam, Cablecam, Speedcam, Electro Moto, and AGITO robotic systems. Every movement is calculated. Every angle is intentional.",
                image: "/images/services/sports/aerial-hub.jpg",
                layout: "left"
            },
            {
                type: "text_image",
                title: "Professional Broadcast Communication",
                content: "Flawless communication is critical. TFS uses industry-leading intercom systems (Riedel Bolero, Clear-Com) to ensure perfect coordination between camera operators, directors, and technicians without delay or error.",
                image: "/images/services/sports/comms-hub.jpg",
                layout: "right"
            }
        ],
        features: [
            { title: "Broadcasting", description: "Live event coverage.", icon: "Radio" },
            { title: "Cinematic", description: "Storytelling focus.", icon: "Film" },
            { title: "Technology", description: "Elite camera systems.", icon: "Cpu" }
        ]
    })

    console.log("[Migration] Fresh Sports Service Seed Complete.")

}, (app) => {
    // Rollback - delete only what we just created
    const slugs = [
        "sporting-events",
        "tfs-football", "tfs-baseball", "tfs-basketball",
        "tfs-motorsports", "tfs-athletics", "tfs-combat-sports",
        "tfs-tennis", "tfs-rugby", "tfs-cycling", "tfs-extreme-sports"
    ]

    slugs.forEach(slug => {
        try {
            const records = app.findRecordsByFilter("services", `slug = "${slug}"`, "", 10)
            records.forEach(r => app.delete(r))
        } catch (e) { }
    })
})
