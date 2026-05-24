/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration: Update Sports Hub Content
 * 
 * Updates the sporting-events hub and all sub-services with detailed content.
 */

migrate((app) => {
    const collection = app.findCollectionByNameOrId("services")

    if (!collection) {
        console.log('[Migration] Services collection not found, skipping...')
        return
    }

    // ========================================
    // Update: Sporting Events Hub
    // ========================================
    try {
        const sportingEvents = app.findFirstRecordByFilter("services", 'slug = "sporting-events"')
        if (sportingEvents) {
            sportingEvents.set("title", "TFS Sports Broadcasting")
            sportingEvents.set("titleFr", "TFS Diffusion Sportive")
            sportingEvents.set("briefDescription", "World-class visual coverage for live events, competitions, and cinematic sports storytelling. Unmatched technology. Total control. Perfect coverage.")
            sportingEvents.set("briefDescriptionFr", "Couverture visuelle de classe mondiale pour les événements en direct, les compétitions et la narration sportive cinématographique.")
            sportingEvents.set("fullDescription", `<h2>Broadcast Excellence Without Compromise</h2>
<p>TFS (TV Film Solutions) is a high-end sports broadcasting and production company delivering world-class visual coverage for live events, competitions, and cinematic sports storytelling.</p>
<p>We specialize in elite broadcast solutions, combining cutting-edge camera systems, advanced motion technology, and professional communication infrastructure to capture sport with precision, intensity, and emotion.</p>
<p>From stadiums to circuits, arenas to open fields, TFS transforms sport into a premium visual experience.</p>

<h3>Unmatched Technology. Total Control. Perfect Coverage.</h3>
<p>At TFS, technology is not an option—it's our foundation.</p>

<h4>Elite Camera & Stabilization Systems</h4>
<p>We operate the most advanced stabilization and motion systems in the industry:</p>
<ul>
<li>MK-V Steadicam</li>
<li>ARRI Artemis 2</li>
<li>ARRI Trinity</li>
</ul>
<p>These systems allow us to deliver fluid, dynamic, and cinematic movement, even in the most intense live sports environments.</p>

<h4>Advanced Motion & Aerial Solutions</h4>
<p>To capture sport from every possible angle, we deploy:</p>
<ul>
<li>Spidercam – iconic aerial stadium coverage</li>
<li>Cablecam – dynamic horizontal motion across large venues</li>
<li>Speedcam – ultra-fast tracking for explosive action</li>
<li>Electro Moto – precision motorized movement</li>
<li>AGITO – robotic camera systems for repeatable, cinematic shots</li>
</ul>
<p>Every movement is calculated. Every angle is intentional.</p>

<h4>Professional Broadcast Communication</h4>
<p>Flawless communication is critical in live production. TFS uses industry-leading intercom systems:</p>
<ul>
<li>Riedel Bolero Intercom</li>
<li>Clear-Com Systems</li>
<li>Riedel 64×64 Matrix</li>
<li>Talkie-Walkies & In-Ear Monitoring</li>
</ul>
<p>This ensures perfect coordination between camera operators, directors, technicians, and production teams—without delay, without error.</p>

<h3>Why TFS</h3>
<ul>
<li>Broadcast-level equipment</li>
<li>International production standards</li>
<li>Elite camera operators & technicians</li>
<li>Total reliability for live events</li>
<li>Cinematic storytelling for sport</li>
</ul>
<p><strong>TFS – TV Film Solutions</strong><br/>Where sport meets technology, precision, and emotion.</p>`)
            app.save(sportingEvents)
            console.log('[Migration] Updated sporting-events hub content')
        }
    } catch (e) {
        console.log('[Migration] sporting-events not found:', e.message)
    }

    // ========================================
    // Sub-service content updates
    // ========================================
    const sportsContent = [
        {
            slug: "tfs-football",
            title: "TFS Football",
            titleFr: "TFS Football",
            icon: "Target",
            briefDescription: "Elite broadcast coverage for professional leagues, clubs, federations, and international competitions.",
            briefDescriptionFr: "Couverture de diffusion d'élite pour les ligues professionnelles, clubs, fédérations et compétitions internationales.",
            fullDescription: `<p>TFS Football delivers elite broadcast coverage for professional leagues, clubs, federations, and international competitions. Our productions combine multi-camera stadium setups, aerial systems such as Spidercam and Cablecam, stabilized sideline movement, and cinematic tracking to capture the full intensity of the game.</p>
<p>From pre-match atmosphere to decisive moments and post-match reactions, we ensure a complete football storytelling experience that meets the highest international broadcast standards.</p>`,
            sections: JSON.stringify([
                {
                    title: "Complete Stadium Coverage",
                    content: "Our multi-camera stadium setups provide comprehensive coverage from every angle. We deploy strategic camera positions including high behind-goal angles, midfield elevated platforms, and corner positions to capture tactical movements, goal-line decisions, and crowd reactions. Each camera is operated by experienced sports cinematographers who understand the rhythm and flow of the game."
                },
                {
                    title: "Aerial & Motion Systems",
                    content: "TFS Football utilizes Spidercam for iconic aerial stadium shots, Cablecam for dynamic horizontal tracking across the pitch, and stabilized sideline systems including Steadicam and ARRI Trinity for fluid movement along the touchline. These systems work in perfect coordination to deliver broadcast-quality footage that rivals the world's top football productions."
                },
                {
                    title: "Match Day Production",
                    content: "Beyond camera work, TFS provides complete match day production support including pre-match player arrivals, warm-up coverage, tunnel moments, and post-match interviews. Our team captures the atmosphere—fans, flags, chants—creating an immersive viewing experience that transports audiences into the heart of the stadium."
                }
            ])
        },
        {
            slug: "tfs-baseball",
            title: "TFS Baseball",
            titleFr: "TFS Baseball",
            icon: "Circle",
            briefDescription: "Precision coverage focusing on timing, visual clarity, and tactical storytelling for professional baseball.",
            briefDescriptionFr: "Couverture de précision axée sur le timing, la clarté visuelle et la narration tactique pour le baseball professionnel.",
            fullDescription: `<p>TFS Baseball focuses on precision, timing, and visual clarity. We deploy high-speed cameras, advanced stabilization systems, and carefully positioned angles to capture every pitch, hit, and defensive play.</p>
<p>Our coverage emphasizes accurate replays, tactical storytelling, and player focus, delivering clean, broadcast-ready productions for professional baseball events.</p>`,
            sections: JSON.stringify([
                {
                    title: "High-Speed Pitch Tracking",
                    content: "Baseball demands exceptional precision in capturing split-second moments. TFS deploys high-speed cameras capable of 1000+ fps to freeze every pitch—fastballs, curveballs, sliders—in crystal-clear detail. Our super slow-motion replays reveal the grip, spin, and trajectory that define elite pitching, providing viewers with insights invisible to the naked eye."
                },
                {
                    title: "Diamond Coverage Architecture",
                    content: "We position cameras strategically around the diamond: center field for the classic pitcher-batter view, first and third base lines for defensive plays, high home positions for tactical overview, and dugout-level angles for player reactions. This comprehensive setup ensures we never miss a stolen base, diving catch, or game-changing double play."
                },
                {
                    title: "Replay & Analysis Integration",
                    content: "TFS Baseball productions include seamless replay integration with multiple angle options for umpire reviews, broadcast analysis, and highlight packages. Our operators are trained to anticipate key moments, ensuring that every close call at the plate, every tag at second base, is captured from the optimal angle for immediate replay."
                }
            ])
        },
        {
            slug: "tfs-basketball",
            title: "TFS Basketball",
            titleFr: "TFS Basketball",
            icon: "Dribbble",
            briefDescription: "Immersive court-level coverage with smooth stabilized movement and high-impact broadcast storytelling.",
            briefDescriptionFr: "Couverture immersive au niveau du terrain avec mouvement stabilisé fluide et narration de diffusion à fort impact.",
            fullDescription: `<p>Fast, dynamic, and intense, basketball demands flawless execution. TFS Basketball provides immersive court-level coverage, smooth stabilized movement, overhead perspectives, and crowd-driven visuals.</p>
<p>Our approach enhances the rhythm of the game while delivering cinematic replays and high-impact broadcast storytelling.</p>`,
            sections: JSON.stringify([
                {
                    title: "Court-Level Immersion",
                    content: "Basketball's speed and physicality require cameras that move with the action. TFS positions stabilized Steadicam and gimbal operators at court level, tracking fast breaks, defensive rotations, and player isolation plays. Our operators anticipate the flow, delivering smooth, immersive footage that puts viewers in the front row of every possession."
                },
                {
                    title: "Overhead & Tactical Views",
                    content: "We deploy overhead camera systems to capture the full court—pick-and-rolls, zone defenses, and offensive sets become clear from above. Combined with backboard-mounted cameras for rim-shaking dunks and blocked shots, our multi-angle approach reveals the strategy and athleticism that define elite basketball."
                },
                {
                    title: "Atmosphere & Energy Capture",
                    content: "Basketball arenas pulse with energy. TFS captures the crowd reactions, bench celebrations, timeout huddles, and halftime shows that make basketball a complete entertainment experience. Our audio integration captures the court sounds—sneaker squeaks, ball handling, and player communication—adding authenticity to every broadcast."
                }
            ])
        },
        {
            slug: "tfs-motorsports",
            title: "TFS Motorsports",
            titleFr: "TFS Sports Mécaniques",
            icon: "Car",
            briefDescription: "High-performance broadcast solutions for racing events using Speedcam, Cablecam, and advanced tracking.",
            briefDescriptionFr: "Solutions de diffusion haute performance pour les événements de course utilisant Speedcam, Cablecam et suivi avancé.",
            fullDescription: `<p>TFS Motorsports delivers high-performance broadcast solutions for racing and motorsport events. Using Speedcam, Cablecam, Electro Moto, AGITO systems, and advanced tracking technologies, we capture extreme speed, technical precision, and driver emotion.</p>
<p>Every shot is designed for safety, accuracy, and maximum visual impact.</p>`,
            sections: JSON.stringify([
                {
                    title: "Speed Tracking Technology",
                    content: "Capturing vehicles at 300+ km/h requires specialized equipment and expertise. TFS Motorsports deploys Speedcam systems that match racing velocity, maintaining sharp focus on cars through straights and chicanes. Our Cablecam installations span pit lanes and grandstands, providing dynamic aerial tracking that follows the leaders through critical race sections."
                },
                {
                    title: "Circuit Coverage Network",
                    content: "We establish comprehensive camera networks around circuits—corner entry and exit positions, overtaking zones, pit lane coverage, and podium setups. AGITO robotic cameras provide repeatable, precise movements for replay sequences, while Electro Moto systems enable smooth tracking shots along barriers and access roads."
                },
                {
                    title: "Safety & Coordination",
                    content: "Motorsport production demands rigorous safety protocols. TFS operates in full coordination with race control, marshals, and medical teams. Our camera positions are certified, our operators are trained in circuit safety, and our communication systems integrate with race management to ensure zero interference with racing operations while capturing every moment of action."
                }
            ])
        },
        {
            slug: "tfs-athletics",
            title: "TFS Athletics",
            titleFr: "TFS Athlétisme",
            icon: "Trophy",
            briefDescription: "Precise athlete tracking and dramatic visual presentation for sprints, field events, and competitions.",
            briefDescriptionFr: "Suivi précis des athlètes et présentation visuelle dramatique pour les sprints, épreuves de terrain et compétitions.",
            fullDescription: `<p>From explosive sprints to technical field events, TFS Athletics ensures precise athlete tracking and dramatic visual presentation.</p>
<p>Our systems provide wide coverage, smooth motion, and accurate timing to highlight performance, competition, and emotional moments at the highest level of sport.</p>`,
            sections: JSON.stringify([
                {
                    title: "Track Event Excellence",
                    content: "Athletics track events demand split-second precision. TFS deploys high-speed cameras at start lines capturing explosive reactions, finish line photo-finish integration, and rail-mounted tracking cameras that follow sprinters at full speed. For distance events, our strategically positioned cameras capture pack dynamics, breakaways, and the final sprint drama."
                },
                {
                    title: "Field Event Specialization",
                    content: "Each field event requires unique camera approaches. For throws, we position cameras to capture release technique and flight trajectory. For jumps, we deploy high-speed cameras at takeoff and landing, overhead views for technique analysis, and stabilized close-ups for athlete focus moments. Pole vault and high jump receive multi-angle coverage emphasizing height and clearance."
                },
                {
                    title: "Stadium Atmosphere",
                    content: "Major athletics events fill stadiums with passionate fans. TFS captures the pageantry—national teams, victory laps, medal ceremonies, and crowd reactions to world records. Our coverage extends beyond competition to include athlete preparation, warm-up rituals, and the emotional moments that define championship athletics."
                }
            ])
        },
        {
            slug: "tfs-combat-sports",
            title: "TFS Combat Sports",
            titleFr: "TFS Sports de Combat",
            icon: "Sword",
            briefDescription: "Close-range intensity coverage for boxing, MMA, and martial arts with cinematic precision.",
            briefDescriptionFr: "Couverture d'intensité rapprochée pour la boxe, le MMA et les arts martiaux avec précision cinématographique.",
            fullDescription: `<p>TFS Combat Sports specializes in boxing, MMA, and martial arts productions. We focus on close-range intensity, reaction shots, impact moments, and atmosphere.</p>
<p>Our coverage brings viewers inside the fight, capturing power, tension, and emotion with cinematic precision.</p>`,
            sections: JSON.stringify([
                {
                    title: "Ring & Cage Coverage",
                    content: "Combat sports require intimate camera positions that capture every strike, block, and submission attempt. TFS positions cameras at ring corners, cage sides, and overhead to deliver comprehensive fight coverage. Our operators are trained to anticipate action, maintaining focus through explosive exchanges and ground transitions that define modern combat sports."
                },
                {
                    title: "Impact & Emotion",
                    content: "We specialize in capturing the defining moments—the knockout punch, the fight-ending submission, the corner advice between rounds. High-speed cameras freeze impact moments in stunning detail, while our stabilized close-up work captures fighter emotions, corner reactions, and the tension that builds before main events."
                },
                {
                    title: "Event Production",
                    content: "Combat sports events are theatrical experiences. TFS provides complete production support including dramatic walkouts, pre-fight staredowns, ring announcements, and post-fight celebrations. Our lighting-aware camera work handles the dramatic arena atmospherics that define championship fight nights."
                }
            ])
        },
        {
            slug: "tfs-tennis",
            title: "TFS Tennis",
            titleFr: "TFS Tennis",
            icon: "Radio",
            briefDescription: "Clean, tactical, and elegant broadcast coverage with precision camera placement and player focus.",
            briefDescriptionFr: "Couverture de diffusion propre, tactique et élégante avec placement de caméra précis et focus sur les joueurs.",
            fullDescription: `<p>TFS Tennis delivers clean, tactical, and elegant broadcast coverage. With precision camera placement, smooth tracking, and player-focused storytelling, we capture every rally, reaction, and decisive point with clarity and broadcast-level accuracy.</p>`,
            sections: JSON.stringify([
                {
                    title: "Court Geometry",
                    content: "Tennis demands precise camera positioning that respects the geometry of the court. TFS establishes the classic behind-baseline elevated position for rally coverage, supplemented by net-level cameras for approach shots, side angles for service technique, and high positions for tactical court coverage. Every position is calculated to deliver clean sight lines without player distraction."
                },
                {
                    title: "Player Focus & Emotion",
                    content: "Tennis is as much a mental battle as a physical one. Our coverage captures the focus during service routines, the frustration of unforced errors, and the celebration of break points won. We position cameras to capture player boxes, coaching reactions, and the quiet intensity that builds through deciding sets."
                },
                {
                    title: "Surface & Venue Adaptation",
                    content: "From clay to grass to hard courts, each surface demands adjusted camera work to handle ball speed, bounce, and lighting conditions. TFS adapts equipment and positioning for indoor arenas, outdoor stadiums, and intimate club settings, maintaining broadcast excellence regardless of venue scale or surface type."
                }
            ])
        },
        {
            slug: "tfs-rugby",
            title: "TFS Rugby",
            titleFr: "TFS Rugby",
            icon: "Shield",
            briefDescription: "Total coverage combining aerial systems, stabilized sideline cameras, and multi-angle setups.",
            briefDescriptionFr: "Couverture totale combinant systèmes aériens, caméras de touche stabilisées et configurations multi-angles.",
            fullDescription: `<p>Physical, fast, and unpredictable, rugby requires total coverage. TFS Rugby combines aerial systems, stabilized sideline cameras, and multi-angle setups to capture the intensity of collisions, tactical movement, and the flow of the game from every perspective.</p>`,
            sections: JSON.stringify([
                {
                    title: "Set Piece Coverage",
                    content: "Rugby's scrums, lineouts, and mauls require specialized camera positions. TFS deploys dedicated cameras for set pieces—tight angles on scrum engagements, elevated positions for lineout jumpers, and tracking cameras for rolling mauls. Our operators understand rugby's technical elements, ensuring clear coverage of binding, timing, and the explosive moments when the ball emerges."
                },
                {
                    title: "Open Play Dynamics",
                    content: "When play opens up, TFS delivers fluid coverage through Steadicam operators running the touchline, elevated mid-field positions tracking attacking movements, and in-goal cameras for try-scoring moments. Our aerial systems follow breakaway runs and kick-chase sequences, maintaining visual continuity through rugby's fast phase transitions."
                },
                {
                    title: "Physicality & Atmosphere",
                    content: "Rugby's physicality demands cameras that capture impact—tackle angles, ruck clearouts, and the collisions that define the sport. Beyond the pitch, we capture the unique rugby atmosphere: pre-match rituals, team huddles, crowd songs, and the post-match respect between opponents that embodies rugby's values."
                }
            ])
        },
        {
            slug: "tfs-cycling",
            title: "TFS Cycling",
            titleFr: "TFS Cyclisme",
            icon: "Bike",
            briefDescription: "Long-distance broadcast solutions for road, track, and mountain cycling with real-time athlete tracking.",
            briefDescriptionFr: "Solutions de diffusion longue distance pour le cyclisme sur route, piste et VTT avec suivi en temps réel.",
            fullDescription: `<p>TFS Cycling provides long-distance broadcast solutions for road, track, and mountain cycling events. Using mobile tracking units, aerial coverage, and stabilized cameras, we maintain visual continuity across extended routes and challenging environments while following the athletes in real time.</p>`,
            sections: JSON.stringify([
                {
                    title: "Mobile & Aerial Coverage",
                    content: "Road cycling spans hundreds of kilometers. TFS deploys motorcycle-mounted cameras that ride alongside the peloton, capturing attacks, breakaways, and group dynamics. Helicopter and drone coverage provides sweeping aerial views of the race against scenic backdrops, while fixed positions at climbs, sprints, and feed zones capture key strategic moments."
                },
                {
                    title: "Finish Line Excellence",
                    content: "Cycling finishes demand precision timing and multi-angle coverage. TFS positions high-speed cameras at finish lines for photo-finish clarity, stabilized platforms for sprint lead-outs, and elevated positions to capture the tactical positioning in the final kilometers. Our coverage captures both the winner's celebration and the battles throughout the finishing group."
                },
                {
                    title: "Velodrome & MTB Specialization",
                    content: "Beyond road racing, TFS provides specialized coverage for track cycling—capturing the speed of pursuits, the strategy of madison races, and the power of sprint events in velodromes worldwide. For mountain biking, we deploy rugged camera systems that handle forest trails, technical descents, and cross-country endurance courses."
                }
            ])
        },
        {
            slug: "tfs-extreme-sports",
            title: "TFS Extreme & Action Sports",
            titleFr: "TFS Sports Extrêmes",
            icon: "Flame",
            briefDescription: "Creative, mobile, and cinematic coverage for skateboarding, urban, and extreme sports productions.",
            briefDescriptionFr: "Couverture créative, mobile et cinématographique pour le skateboard, les sports urbains et extrêmes.",
            fullDescription: `<p>From skateboarding to urban and extreme sports, TFS delivers creative, mobile, and cinematic coverage. Our lightweight stabilization systems and dynamic movement techniques allow us to capture raw energy, authentic motion, and strong visual identity for action-driven productions.</p>`,
            sections: JSON.stringify([
                {
                    title: "Action-First Camera Work",
                    content: "Extreme sports demand cameras that move with athletes. TFS operators use lightweight gimbals, body-mounted rigs, and compact stabilizers to follow skaters through parks, BMX riders through courses, and climbers up walls. Our approach prioritizes dynamic angles and authentic perspectives that communicate the speed, risk, and skill of action sports."
                },
                {
                    title: "Competition & Event Coverage",
                    content: "For organized competitions—X Games, street league events, FMX shows—TFS provides full broadcast infrastructure while maintaining the creative aesthetic that defines action sports. Multi-camera setups capture trick sequences from optimal angles, with super slow-motion replay capability for judging and highlight packages."
                },
                {
                    title: "Lifestyle & Documentary",
                    content: "Beyond competition, extreme sports are lifestyle movements. TFS captures the culture—skate sessions, surf trips, mountain expeditions—with cinematic documentary approaches. Our small, agile crews embed with athletes, capturing authentic moments that translate into compelling content for brands, athletes, and broadcasters."
                }
            ])
        }
    ]

    // Update or create each sport sub-service
    for (const sport of sportsContent) {
        try {
            let record = null
            try {
                record = app.findFirstRecordByFilter("services", `slug = "${sport.slug}"`)
            } catch (e) {
                // Record doesn't exist, we'll create it
            }

            if (record) {
                // Update existing record
                record.set("title", sport.title)
                record.set("titleFr", sport.titleFr)
                record.set("icon", sport.icon)
                record.set("briefDescription", sport.briefDescription)
                record.set("briefDescriptionFr", sport.briefDescriptionFr)
                record.set("fullDescription", sport.fullDescription)
                record.set("sections", sport.sections)
                record.set("template", "default")
                app.save(record)
                console.log(`[Migration] Updated ${sport.slug}`)
            } else {
                // Create new record
                const newRecord = new Record(collection)
                newRecord.set("slug", sport.slug)
                newRecord.set("title", sport.title)
                newRecord.set("titleFr", sport.titleFr)
                newRecord.set("icon", sport.icon)
                newRecord.set("briefDescription", sport.briefDescription)
                newRecord.set("briefDescriptionFr", sport.briefDescriptionFr)
                newRecord.set("fullDescription", sport.fullDescription)
                newRecord.set("sections", sport.sections)
                newRecord.set("template", "default")
                newRecord.set("isActive", true)
                newRecord.set("order", 0)
                app.save(newRecord)
                console.log(`[Migration] Created ${sport.slug}`)
            }
        } catch (e) {
            console.log(`[Migration] Error with ${sport.slug}:`, e.message)
        }
    }

    // ========================================
    // Update sporting-events sub_services array
    // ========================================
    try {
        const sportingEvents = app.findFirstRecordByFilter("services", 'slug = "sporting-events"')
        if (sportingEvents) {
            const subServiceSlugs = sportsContent.map(s => s.slug)
            sportingEvents.set("sub_services", subServiceSlugs)
            app.save(sportingEvents)
            console.log('[Migration] Updated sporting-events sub_services array')
        }
    } catch (e) {
        console.log('[Migration] Error updating sub_services:', e.message)
    }

}, (app) => {
    // Rollback: We don't delete content, just log
    console.log('[Migration] Rollback: Sports content updates are not automatically reverted')
})
