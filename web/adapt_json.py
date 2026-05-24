import json, os

BASE = r"c:\Users\zakio\Documents\Project\PB-Next\web\src\app\i18n\locales"

def adapt_locale(lang):
    path = os.path.join(BASE, lang, "about.json")
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    if lang == "en":
        data["hero"]["title"] = "We don't just support productions. We build them."
        data["hero"]["subtitle"] = "As the industry evolved, so did we. In 2025, TFS expanded beyond equipment rental to become a full-service cinema production company, combining technical mastery with creative execution."
        data["description_reveal"]["text"] = "Founded in 2015 as a dedicated cinema equipment rental house, TFS was built to support filmmakers with reliable, high-end technical resources and professional expertise. From the beginning, our mission was simple — to provide creators with the tools they need to bring powerful stories to life."
        data["expertise"]["description"] = "Today, we operate as a complete production and rental partner, delivering integrated solutions for film, television, sports, cultural, and broadcast projects. With over a decade of industry experience, we provide professional cinema equipment rental, full film and television production services from concept to final delivery, technical crew and production expertise, and tailor-made solutions for local and international productions."
        data["team"]["description"] = "Our strength lies in merging advanced technology with skilled professionals who understand every stage of production. Whether supporting a major broadcast, producing cinematic content, or equipping a film set with world-class gear, we ensure precision, reliability, and excellence in every detail."
        data["cta"]["subtitle"] = "Today, TFS stands as a trusted partner for creators, producers, and broadcasters — delivering complete, innovative, and high-standard cinema production solutions under one roof."
    else:
        # FR
        data["hero"]["title"] = "Nous ne faisons pas qu’accompagner les productions. Nous les construisons."
        data["hero"]["subtitle"] = "Avec l’évolution de l’industrie, nous avons évolué nous aussi. En 2021, TFS a élargi son activité au-delà de la location d’équipements pour devenir une société de production à service complet, alliant maîtrise technique et exécution créative."
        data["description_reveal"]["text"] = "Fondée en 2015 en tant que société spécialisée dans la location d’équipements cinématographiques, TFS a été créée pour accompagner les réalisateurs et producteurs avec des ressources techniques fiables, haut de gamme et une expertise professionnelle reconnue. Dès le départ, notre mission était simple — fournir aux créateurs les moyens nécessaires pour donner vie à des histoires fortes et inspirantes."
        data["expertise"]["description"] = "Aujourd’hui, nous opérons comme un partenaire global en production et en location, en proposant des solutions intégrées pour le cinéma, la télévision, le sport, la culture et les projets de diffusion broadcast. Fort de plus d’une décennie d’expérience, nous proposons la location professionnelle d’équipements cinéma, des services complets de production de la conception à la livraison finale, des équipes techniques spécialisées ainsi que des solutions sur mesure pour les productions locales et internationales."
        data["team"]["description"] = "Notre force réside dans l’alliance entre technologies de pointe et professionnels expérimentés maîtrisant chaque étape du processus de production. Qu’il s’agisse d’accompagner une grande diffusion, de produire un contenu cinématographique ou d’équiper un plateau avec du matériel de classe mondiale, nous garantissons précision, fiabilité et excellence à chaque détail."
        data["cta"]["subtitle"] = "Aujourd’hui, TFS est un partenaire de confiance pour les créateurs, producteurs et diffuseurs — offrant des solutions de production complètes, innovantes et de très haut niveau sous un même toit."

    # Remove the unneeded story node
    if "story" in data:
        del data["story"]

    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
        print(f"Updated {lang.upper()}")

adapt_locale("en")
adapt_locale("fr")
