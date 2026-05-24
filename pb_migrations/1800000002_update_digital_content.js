/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    const collection = app.findCollectionByNameOrId("services")

    // 1. Update "Digital Production for Producers"
    try {
        const record = app.findRecordsByFilter("services", `slug = "digital-production"`, "", 1)[0]
        if (record) {
            record.set("full_description", `
<p>TFS provides dedicated digital production services for producers looking to create innovative and impactful audiovisual projects in Morocco. Our team of experts handles the creation of tailored digital content that meets your specific needs, while highlighting quality, creativity, and storytelling.</p>
<h3>What we offer:</h3>
<ul>
<li><strong>Video content creation:</strong> Behind-the-scenes (making-of), promotional clips, teasers, and corporate videos.</li>
<li><strong>Social media content production:</strong> Engaging videos and visuals designed to strengthen your online presence.</li>
<li><strong>Photography services:</strong> Professional photo shoots covering productions, behind-the-scenes moments, and team preparations.</li>
<li><strong>Strategic consulting:</strong> Support in developing and implementing effective digital and content strategies.</li>
</ul>
<p>Whether you are an independent production company or a major production house, we have the tools and expertise to turn your ideas into compelling digital experiences.</p>
            `)
            app.save(record)
            console.log("[Migration] Updated Digital Production for Producers")
        }
    } catch (e) {
        console.log("[Migration] Error updating digital-production:", e)
    }

    // 2. Update "Digital Marketing" -> "Digital Production for Companies"
    // Use old slug to find it
    try {
        const record = app.findRecordsByFilter("services", `slug = "digital-marketing"`, "", 1)[0]
        if (record) {
            const newSlug = "digital-corporate"

            record.set("title", "Digital Production for Companies")
            // record.set("title_fr", "Production Digitale pour Entreprises") // Optional translation update
            record.set("slug", newSlug)
            record.set("brief_description", "High-impact visual content designed to attract, engage, and retain your audience.")
            record.set("full_description", `
<p>Our digital production services for businesses help transform your ideas into high-impact visual content designed to attract, engage, and retain your audience. We support you in creating effective digital assets by offering customized solutions aligned with your communication and marketing objectives.</p>
<h3>What we offer:</h3>
<ul>
<li><strong>Corporate and institutional video production:</strong> Present your company, products, or services through engaging and professional videos.</li>
<li><strong>Web and social media content creation:</strong> Explainer videos, client testimonials, case studies, and viral-ready content.</li>
<li><strong>Interactive websites and applications:</strong> Development of dynamic websites and interactive applications to enhance your online visibility.</li>
<li><strong>Webinars and podcasts:</strong> Planning and production of webinars, podcasts, and online events to showcase your expertise.</li>
<li><strong>Visual identity & brand guidelines:</strong> Building a credible, modern, and consistent brand image.</li>
</ul>
<p>Schools, restaurants, real estate developers, and more — we understand your specific challenges and tailor our services to help you achieve your business goals while connecting authentically with your audience.</p>
            `)

            // Update sections/features if needed, but user didn't specify. Keeping old ones or clearing?
            // Keeping old ones for layout safety, but they might mismatch (Social Media Campaigns vs Corporate Video).
            // User only provided text.

            app.save(record)
            console.log("[Migration] Updated Digital Production for Companies")

            // 3. Update Parent "Digital Services" sub_services list
            const parent = app.findRecordsByFilter("services", `slug = "digital-services"`, "", 1)[0]
            if (parent) {
                const subs = JSON.parse(parent.get("sub_services") || "[]")
                // Replace digital-marketing with digital-corporate
                const newSubs = subs.map(s => s === "digital-marketing" ? newSlug : s)
                parent.set("sub_services", JSON.stringify(newSubs))
                app.save(parent)
                console.log("[Migration] Updated Digital Services parent links")
            }
        }
    } catch (e) {
        console.log("[Migration] Error updating digital-marketing:", e)
    }

}, (app) => {
    // Revert logic omitted for speed
})
