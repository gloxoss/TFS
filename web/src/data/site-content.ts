/**
 * TFS Site Content - Centralized Content Management
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * EDIT THIS FILE TO UPDATE ALL STATIC CONTENT ON THE WEBSITE
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * This is your SINGLE SOURCE OF TRUTH for:
 * - Company information (name, address, phone, email)
 * - Navigation labels
 * - Footer content
 * - Page-specific SEO and content
 */

// =============================================================================
// TYPES
// =============================================================================

export interface LocalizedString {
    en: string
    fr: string
}

// =============================================================================
// COMPANY INFORMATION
// =============================================================================

export const company = {
    name: "TFS",
    fullName: "TV Film Solutions",

    // Tagline shown in various places
    tagline: {
        en: "We provide professional production solutions, handling every aspect of film and TV projects—from equipment and crew to locations, permits, props, and post-production.",
        fr: "Nous fournissons des solutions de production professionnelles, gérant chaque aspect des projets cinématographiques et télévisés-de l'équipement et personnel à emplacements, permis, accessoires et post-production.",
    },

    // Contact details
    address: {
        street: "N°55-57, Rue Souleimane El Farissi, Ain Borja",
        city: "Casablanca",
        postalCode: "20330",
        country: "Morocco",
        countryFr: "Maroc"
    },

    phone: {
        display: "+212 522 246 372",
        link: "+212522246372"
    },

    fax: {
        display: "+212 522 241 396",
        link: "+212522241396"
    },

    email: "info@tfs.ma",
    website: "www.tfs.ma",

    // Social media links (leave empty string if not used)
    social: {
        facebook: "https://facebook.com/tfs",
        instagram: "https://instagram.com/tfs",
        linkedin: "",
        youtube: "https://youtube.com/@tfs"
    },

    // Copyright year - dynamically generated
    get copyrightYear() {
        return new Date().getFullYear().toString()
    }
}

// =============================================================================
// NAVIGATION
// =============================================================================

export const nav = {
    // Main navigation items (Services is a dynamic dropdown, not listed here)
    links: [
        { href: "/about", label: { en: "About Us", fr: "À Propos" } },
        { href: "/contact", label: { en: "Contact Us", fr: "Contactez-nous" } }
    ],

    // CTA button
    cta: {
        href: "/quote",
        label: { en: "Request Quote", fr: "Demander un Devis" }
    }
}


// =============================================================================
// FOOTER
// =============================================================================

export const footer = {
    // Description below logo
    description: {
        en: "Professional cinema equipment rental for filmmakers, production companies, and content creators in Morocco.",
        fr: "Location de matériel cinéma professionnel pour cinéastes, sociétés de production et créateurs de contenu au Maroc."
    },

    // Section titles
    sections: {
        services: { en: "Services", fr: "Services" },
        support: { en: "Support", fr: "Support" },
        company: { en: "Company", fr: "Entreprise" },
        legal: { en: "Legal", fr: "Légal" }
    },

    // Navigation links
    services: [
        { href: "/equipment?category=cameras", label: { en: "Camera Rentals", fr: "Location Caméras" } },
        { href: "/equipment?category=lighting", label: { en: "Lighting Equipment", fr: "Équipement Éclairage" } },
        { href: "/equipment?category=audio", label: { en: "Audio Gear", fr: "Matériel Audio" } },
        { href: "/equipment?category=grip", label: { en: "Grip & Support", fr: "Grip & Support" } }
    ],

    support: [
        { href: "/guide", label: { en: "Rental Guide", fr: "Guide de Location" } },
        { href: "/contact", label: { en: "Contact Us", fr: "Nous Contacter" } }
    ],

    companyLinks: [
        { href: "/about", label: { en: "About Us", fr: "Notre Histoire" } },
        { href: "/equipment", label: { en: "Our Equipment", fr: "Notre Équipement" } }
    ],

    legal: [
        { href: "/terms", label: { en: "Terms of Service", fr: "Conditions d'Utilisation" } },
        { href: "/privacy", label: { en: "Privacy Policy", fr: "Politique de Confidentialité" } }
    ],

    // Copyright text
    copyright: {
        en: `© ${company.copyrightYear} TFS - TV Film Solutions. All rights reserved.`,
        fr: `© ${company.copyrightYear} TFS - TV Film Solutions. Tous droits réservés.`
    }
}

// =============================================================================
// PAGE CONTENT - HOME
// =============================================================================

export const homePage = {
    seo: {
        title: {
            en: "Cinema Equipment Rental Morocco | TFS - TV Film Solutions",
            fr: "Location Matériel Cinéma Maroc | TFS - TV Film Solutions"
        },
        description: {
            en: "Professional cinema cameras, lenses, lighting, and audio equipment rental in Casablanca, Morocco. Trusted by film productions.",
            fr: "Location de caméras cinéma, objectifs, éclairages et équipements audio professionnels à Casablanca, Maroc."
        },
        keywords: ["camera rental Morocco", "film equipment Casablanca", "location matériel cinéma Maroc"]
    },

    hero: {
        title: { en: "Every Frame Tells a Story", fr: "Chaque Image Raconte une Histoire" },
        subtitle: {
            en: "Stories That Move the World.",
            fr: "Des Histoires Qui Font Bouger le Monde."
        }
    },

    // Hero Impact component - main homepage banner
    heroImpact: {
        // Large split text at bottom
        megaText: {
            line1: { en: "TV FILM", fr: "TV FILM" },
            line2: { en: "SOLUTIONS", fr: "SOLUTIONS" }
        },
        // Top-right headline
        headline: {
            line1: { en: "Every Frame", fr: "Chaque Image" },
            line2: { en: "Tells a Story", fr: "Raconte une Histoire" }
        },
        // Description text
        description: {
            en: "Stories That Move the World.",
            fr: "Des Histoires Qui Font Bouger le Monde."
        },
        // CTA button
        cta: {
            text: { en: "Let's Talk", fr: "Parlons" },
            href: "/contact"
        }
    },

    // Expert Bento Grid component
    expertBento: {
        title: { en: "Global Expertise", fr: "Expertise Mondiale" },
        mainTitle: { en: "RECOGNIZED EXPERTISE", fr: "EXPERTISE RECONNUE" },
        mainDescription: {
            en: [
                "The expertise of our teams, combined with a state-of-the-art equipment fleet, ensures complete mastery of the entire film and television production workflow — from technical preparation to final delivery.",
                "Our know-how is recognized across Morocco, Africa, and the Middle East, supporting major productions and large-scale events including sports broadcasts, entertainment programs, live performances, and television productions.",
                "To meet the highest professional standards, TFS (TV Film Solutions) operates a fully equipped in-house TV studio within its facilities, designed with advanced technical infrastructure and professional soundproofing — providing an optimal environment for high-end cinematic and broadcast production."
            ],
            fr: [
                "L’expertise de nos équipes, combinée à un parc d’équipements de pointe, garantit une maîtrise complète de l’ensemble du processus de production cinématographique et télévisuelle — de la préparation technique à la livraison finale.",
                "Notre savoir-faire est reconnu au Maroc, en Afrique et au Moyen-Orient, accompagnant des productions majeures et des événements d’envergure tels que les retransmissions sportives, les programmes de divertissement, les spectacles en direct et les productions télévisuelles.",
                "Afin de répondre aux plus hauts standards professionnels, TFS (TV Film Solutions) exploite un studio TV entièrement équipé au sein de ses installations, conçu avec une infrastructure technique avancée et une insonorisation professionnelle — offrant un environnement optimal pour les productions cinématographiques et les diffusions haut de gamme."
            ]
        },
        stats: {
            stat1: {
                title: { en: "10+ YEARS", fr: "10+ ANS" },
                desc: { en: "Leading the industry since 2015 with consistent excellence.", fr: "Leader du secteur depuis 2015 avec une excellence constante." }
            },
            stat2: {
                title: { en: "500+ PROJECTS", fr: "500+ PROJETS" },
                desc: { en: "Successfully delivered major events across the region.", fr: "Événements majeurs livrés avec succès dans la région." }
            },
            fact1: {
                title: { en: "INTERNATIONAL STANDARDS", fr: "NORMES INTERNATIONALES" },
                desc: { en: "Production quality meeting strict global broadcast requirements.", fr: "Qualité de production répondant aux exigences strictes de diffusion mondiale." }
            },
            fact2: {
                title: { en: "HIGH-TECH FLEET", fr: "FLOTTE HIGH-TECH" },
                desc: { en: "State-of-the-art OB Vans and cameras.", fr: "Cars   régie et caméras à la pointe de la technologie." }
            },
            fact3: {
                title: { en: "EXPERT TEAMS", fr: "ÉQUIPES EXPERTES" },
                desc: { en: "Highly trained technical staff.", fr: "Personnel technique hautement qualifié." }
            }
        },

        // Bottom CTA Section
        bottomCta: {
            href: "/equipment",
            label: { en: "Browse Equipment", fr: "Parcourir l'Équipement" }
        }
    }
}

// =============================================================================
// PAGE CONTENT - QUOTE
// =============================================================================

export const quotePage = {
    title: { en: "Request a Quote", fr: "Demander un Devis" },
    subtitle: { en: "Complete the form below and we'll get back to you with pricing and availability.", fr: "Remplissez le formulaire ci-dessous et nous vous contacterons avec les prix et la disponibilité." },
    steps: {
        dates: { en: "Rental Dates", fr: "Dates de Location" },
        contact: { en: "Contact Info", fr: "Coordonnées" },
        project: { en: "Project Details", fr: "Détails du Projet" },
        review: { en: "Review & Submit", fr: "Vérifier et Soumettre" }
    },
    datesStep: {
        title: { en: "Rental Period", fr: "Période de Location" },
        description: { en: "Select the start and end dates for your rental. We'll check availability for these dates.", fr: "Sélectionnez les dates de début et de fin de votre location. Nous vérifierons la disponibilité pour ces dates." },
        note: { en: "Note:", fr: "Note:" },
        noteText: { en: "Standard rental period is usually 1-3 days. Extended rentals may qualify for a discount, which will be applied in your formal quote.", fr: "La période de location standard est généralement de 1 à 3 jours. Les locations prolongées peuvent bénéficier d'une réduction, qui sera appliquée dans votre devis formel." },
        yourItems: { en: "Your Equipment", fr: "Votre Équipement" },
        itemsCount: { en: "items in your quote", fr: "articles dans votre devis" }
    },
    navigation: {
        back: { en: "Back", fr: "Retour" },
        backToCart: { en: "Back to Cart", fr: "Retour au Panier" },
        continue: { en: "Continue", fr: "Continuer" },
        submit: { en: "Submit Quote Request", fr: "Soumettre la Demande" },
        submitting: { en: "Submitting...", fr: "Envoi en cours..." }
    },
    success: {
        title: { en: "Quote Request Received!", fr: "Demande de Devis Reçue !" },
        subtitle: { en: "Thank you. We've received your request and will get back to you with a formal quote shortly.", fr: "Merci. Nous avons reçu votre demande et vous contacterons avec un devis formel sous peu." },
        reference: { en: "Reference", fr: "Référence" },
        status: { en: "Request Pending", fr: "Demande en Attente" },
        rentalPeriod: { en: "Rental Period", fr: "Période de Location" },
        equipment: { en: "Equipment", fr: "Équipement" },
        itemsRequested: { en: "items requested", fr: "articles demandés" },
        includingKits: { en: "Including kits & accessories", fr: "Kits et accessoires inclus" },
        step1Title: { en: "Review Process", fr: "Processus de Révision" },
        step1Desc: { en: "Our team checks availability for your dates within 24 hours.", fr: "Notre équipe vérifie la disponibilité pour vos dates sous 24 heures." },
        step2Title: { en: "Formal Quote", fr: "Devis Formel" },
        step2Desc: { en: "You'll receive a detailed PDF quote with final pricing via email.", fr: "Vous recevrez un devis PDF détaillé avec les prix finaux par email." },
        trackRequest: { en: "Track Request", fr: "Suivre la Demande" },
        backToHome: { en: "Back to Home", fr: "Retour à l'Accueil" }
    },
    emptyCart: {
        title: { en: "Your cart is empty", fr: "Votre panier est vide" },
        description: { en: "Add some equipment to request a quote.", fr: "Ajoutez des équipements pour demander un devis." },
        browseEquipment: { en: "Browse Equipment", fr: "Parcourir l'Équipement" }
    }
}

// =============================================================================
// PAGE CONTENT - ABOUT
// =============================================================================

export const aboutPage = {
    seo: {
        title: {
            en: "About TFS | Morocco's Premier Film Equipment Rental",
            fr: "À Propos de TFS | Location Matériel Cinéma Maroc"
        },
        description: {
            en: "TFS has been equipping Morocco's film industry since 2015.",
            fr: "TFS équipe l'industrie cinématographique marocaine depuis 2015."
        }
    },

    hero: {
        title: { en: "Morocco's Premier Cinema Equipment House", fr: "Premier Loueur de Matériel Cinéma au Maroc" },
        subtitle: { en: "Empowering visionary filmmakers with world-class cameras, lenses, and lighting since 2015.", fr: "Au service des cinéastes visionnaires avec des caméras, objectifs et éclairages de classe mondiale depuis 2015." }
    },

    story: [
        {
            en: "TFS - TV Film Solutions was founded in Casablanca with a simple mission: to provide filmmakers in Morocco with access to world-class cinema equipment.",
            fr: "TFS - TV Film Solutions a été fondée à Casablanca avec une mission simple : offrir aux cinéastes du Maroc un accès à un équipement cinéma de classe mondiale."
        },
        {
            en: "We understand that great stories deserve great tools. That's why we've invested in premium equipment from RED, ARRI, Sony, and other industry leaders.",
            fr: "Nous comprenons que les grandes histoires méritent de grands outils. C'est pourquoi nous avons investi dans des équipements premium de RED, ARRI, Sony."
        }
    ],

    mission: {
        title: { en: "Our Mission", fr: "Notre Mission" },
        text: {
            en: "To empower visual storytellers with professional-grade equipment and expert support.",
            fr: "Donner aux conteurs visuels les moyens de créer avec un équipement professionnel et un support expert."
        }
    },

    // Numerical stat values used in about-story-section.tsx
    statsData: [
        { value: 10, suffix: "+", labelKey: "stats.years" },
        { value: 12000, suffix: "+", labelKey: "stats.projects" },
        { value: 200, suffix: "+", labelKey: "stats.countries" },
        { value: 98, suffix: "%", labelKey: "stats.satisfaction" },
    ],

    // Team member data used in team-section.tsx
    teamMembers: [
        {
            name: "Karim Benjelloun",
            roleKey: "md",
            image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop",
            link: "#",
        },
        {
            name: "Youssef Amrani",
            roleKey: "tech_lead",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop",
            link: "#",
        },
        {
            name: "Nadia El Fassi",
            roleKey: "booking",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
            link: "#",
        },
        {
            name: "Omar Tazi",
            roleKey: "logistics",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
            link: "#",
        },
        {
            name: "Hassan Berrada",
            roleKey: "maintenance",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
            link: "#",
        },
        {
            name: "Laila Chaoui",
            roleKey: "support",
            image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop",
            link: "#",
        },
    ]
}

// =============================================================================
// SOCIAL PROOF - Client names
// =============================================================================

export const clients = [
    "NETFLIX",
    "HBO",
    "SONY PICTURES",
    "UNIVERSAL",
    "WARNER BROS",
    "DISNEY+",
    "APPLE TV+",
    "PARAMOUNT",
    "AMAZON STUDIOS"
]

// =============================================================================
// INTRO BENTO - Homepage "Who Are We?" section
// =============================================================================

export const introBento = {
    title: { en: "WHO ARE WE?", fr: "QUI SOMMES-NOUS ?" },
    subtitle: { en: "The Standard of Excellence", fr: "Le Standard d'Excellence" },
    description: {
        en: "We combine technical mastery with logistical power to bring your vision to life.",
        fr: "Nous combinons maîtrise technique et puissance logistique pour donner vie à votre vision."
    },
    items: [
        {
            title: { en: "A RELIABLE PARTNER", fr: "UN PARTENAIRE FIABLE" },
            description: {
                en: "We are the technical backbone of the Moroccan audiovisual industry, providing comprehensive solutions from consulting to storage for productions of all scales.",
                fr: "Nous sommes l'épine dorsale technique de l'industrie audiovisuelle marocaine, offrant des solutions complètes du conseil au stockage pour des productions de toutes tailles."
            }
        },
        {
            title: { en: "EXCELLENCE MODEL", fr: "MODÈLE D'EXCELLENCE" },
            description: {
                en: "TFS has built its business model around three fundamental values that form the foundation of its corporate culture.",
                fr: "TFS a construit son modèle économique autour de trois valeurs fondamentales qui constituent le socle de sa culture d'entreprise."
            }
        },
        {
            title: { en: "Innovation", fr: "Innovation" },
            description: {
                en: "Every service we deliver is unique. We design specialized solutions with our partners to meet the highest standards.",
                fr: "Chaque service que nous fournissons est unique. Nous concevons des solutions spécialisées avec nos partenaires pour répondre aux plus hauts standards."
            }
        },
        {
            title: { en: "Technical Quality", fr: "Qualité Technique" },
            description: {
                en: "Guaranteed by the expertise of our teams and the reliability of our equipment, devices, and IT/digital solutions.",
                fr: "Garantie par l'expertise de nos équipes et la fiabilité de nos équipements, appareils et solutions IT/numériques."
            }
        },
        {
            title: { en: "Customer Service", fr: "Service Client" },
            description: {
                en: "We guarantee compliance with deadlines thanks to the professionalism of our teams and efficient operational processes.",
                fr: "Nous garantissons le respect des délais grâce au professionnalisme de nos équipes et à des processus opérationnels efficaces."
            }
        }
    ]
}

// =============================================================================
// PAGE CONTENT - CONTACT
// =============================================================================

export const contactPage = {
    seo: {
        title: {
            en: "Contact TFS | Cinema Equipment Rental Casablanca",
            fr: "Contactez TFS | Location Matériel Cinéma Casablanca"
        },
        description: {
            en: "Get in touch for equipment rental inquiries and quotes.",
            fr: "Contactez-nous pour vos demandes de location et devis."
        }
    },

    hero: {
        title: { en: "Get In Touch", fr: "Contactez-Nous" },
        subtitle: { en: "Ready to equip your next production?", fr: "Prêt à équiper votre prochaine production ?" }
    },

    form: {
        name: { en: "Your Name", fr: "Votre Nom" },
        email: { en: "Email Address", fr: "Adresse Email" },
        phone: { en: "Phone Number", fr: "Numéro de Téléphone" },
        message: { en: "Your Message", fr: "Votre Message" },
        submit: { en: "Send Message", fr: "Envoyer" }
    },

    hours: {
        title: { en: "Opening Hours", fr: "Heures d'Ouverture" },
        weekdays: { en: "Mon - Fri: 9:00 - 18:00", fr: "Lun - Ven: 9h00 - 18h00" },
        saturday: { en: "Saturday: Closed", fr: "Samedi: Fermé" },
        sunday: { en: "Sunday: Closed", fr: "Dimanche: Fermé" }
    }
}

// =============================================================================
// GLOBAL OPERATIONS GRID (About page)
// =============================================================================

export const globalOperations = {
    title: {
        en: "Our Equipment Services",
        fr: "Nos Services d'Équipement"
    },
    subtitle: {
        en: "Professional equipment solutions for productions of all sizes.",
        fr: "Solutions d'équipement professionnelles pour productions de toutes tailles."
    },
    features: [
        {
            title: { en: "Premium Equipment", fr: "Équipement Premium" },
            description: {
                en: "Access RED, ARRI, Sony and other industry-leading cameras and accessories.",
                fr: "Accédez aux caméras RED, ARRI, Sony et autres équipements professionnels."
            }
        },
        {
            title: { en: "Quality Tested", fr: "Qualité Vérifiée" },
            description: {
                en: "Every piece of gear is tested and verified before it leaves our warehouse.",
                fr: "Chaque équipement est testé et vérifié avant de quitter notre entrepôt."
            }
        },
        {
            title: { en: "Expert Support", fr: "Support Expert" },
            description: {
                en: "Our team of film professionals is available to help with any technical questions.",
                fr: "Notre équipe de professionnels du cinéma est disponible pour toute question technique."
            }
        },
        {
            title: { en: "Morocco Coverage", fr: "Couverture au Maroc" },
            description: {
                en: "We deliver to productions across Morocco, from Casablanca to the desert.",
                fr: "Nous livrons aux productions dans tout le Maroc, de Casablanca au désert."
            }
        }
    ]
}

// =============================================================================
// NAVBAR - Search Suggestions
// =============================================================================

export const searchConfig = {
    categories: [
        { key: "camera", label: { en: "Cameras", fr: "Caméras" }, query: "cameras" },
        { key: "lens", label: { en: "Lenses", fr: "Objectifs" }, query: "lenses" },
        { key: "lighting", label: { en: "Lighting", fr: "Éclairages" }, query: "lighting" },
        { key: "audio", label: { en: "Monitors", fr: "Moniteurs" }, query: "monitors" }
    ],
    popular: [
        "ARRI Alexa",
        "Sony Venice",
        "RED Komodo",
        "Teradek",
        "Zeiss",
        "Aputure"
    ]
}

// =============================================================================
// HELPER FUNCTION
// =============================================================================

/**
 * Get localized string based on current language
 * Usage: t(content.hero.title, 'fr') => "Équipez Votre Vision"
 */
export function t(content: LocalizedString, lng: string = 'en'): string {
    return content[lng as keyof LocalizedString] || content.en
}

