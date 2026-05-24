import urllib.request
import json
import time

# Wait for 1s to make sure pocketbase is up if run in sequence
time.sleep(1)

# Mapping of slug to French translations for the 3 sections
TRANSLATIONS = {
    "football": [
        {
            "titleFr": "Couverture Complète du Stade",
            "contentFr": "Nos installations multi-caméras dans les stades offrent une couverture complète sous tous les angles. Nous déployons des positions de caméras stratégiques, notamment des angles surélevés derrière les buts, des plateformes surélevées au milieu de terrain et des positions de corner pour capturer les mouvements tactiques, les décisions sur la ligne de but et les réactions du public. Chaque caméra est utilisée par des directeurs de la photographie sportifs expérimentés qui comprennent le rythme et le déroulement du jeu."
        },
        {
            "titleFr": "Systèmes Aériens & de Mouvement",
            "contentFr": "TFS Football utilise la Spidercam pour des plans aériens emblématiques du stade, la Cablecam pour un suivi horizontal dynamique sur le terrain, et des systèmes de ligne de touche stabilisés incluant Steadicam et ARRI Trinity pour des mouvements fluides le long de la ligne de touche. Ces systèmes fonctionnent en parfaite coordination pour offrir des images de qualité exceptionnelle."
        },
        {
            "titleFr": "Production Jour de Match",
            "contentFr": "Au-delà du travail de la caméra, TFS fournit un soutien complet à la production le jour du match, y compris l'arrivée des joueurs avant le match, la couverture de l'échauffement, les moments dans le tunnel et les interviews d'après-match. Notre équipe capture l'atmosphère (les fans, les drapeaux, les chants) créant une expérience de visionnage immersive qui transporte le public au cœur du stade."
        }
    ],
    "baseball": [
        {
            "titleFr": "Suivi des Lancers à Grande Vitesse",
            "contentFr": "Le baseball exige une précision exceptionnelle pour capturer des instants en une fraction de seconde. TFS déploie des caméras à grande vitesse capables de plus de 1000 ips pour figer chaque lancer—balles rapides, balles courbes, curseurs—avec des détails cristallins. Nos rediffusions au ralenti révèlent la prise, l'effet et la trajectoire, offrant aux spectateurs des informations invisibles à l'œil nu."
        },
        {
            "titleFr": "Architecture de Couverture du Terrain",
            "contentFr": "Nous positionnons les caméras stratégiquement autour du terrain: au champ centre pour la vue classique lanceur-frappeur, le long des 1ère et 3ème bases pour les jeux défensifs, en hauteur au marbre pour un aperçu tactique, et au niveau des abris pour les réactions des joueurs. Cette configuration garantit de ne manquer aucune action décisive."
        },
        {
            "titleFr": "Intégration des Reprises & de l'Analyse",
            "contentFr": "Les productions TFS Baseball incluent une intégration transparente des reprises avec plusieurs options d'angles pour les révisions des arbitres, l'analyse des diffuseurs et les temps forts. Nos opérateurs anticipent les moments clés, garantissant que chaque appel serré ou élimination est capturé sous un angle optimal."
        }
    ],
    "basketball": [
        {
            "titleFr": "Immersion au Niveau du Terrain",
            "contentFr": "La vitesse et la physicalité du basketball requièrent des caméras qui suivent l'action. TFS positionne des opérateurs Steadicam et gimbal au niveau du terrain, suivant les contre-attaques, les rotations défensives et les isolations des joueurs. Nos opérateurs anticipent le jeu, offrant des images fluides qui placent les spectateurs au premier rang."
        },
        {
            "titleFr": "Vues Aériennes & Tactiques",
            "contentFr": "Nous déployons des caméras suspendues pour capturer l'ensemble du terrain—les pick-and-rolls, les défenses de zone deviennent clairs vu d'en haut. Associée à des caméras montées sur les panneaux pour les dunks fracassants et les contres, notre approche sous de multiples angles révèle la stratégie et l'athlétisme du basketball d'élite."
        },
        {
            "titleFr": "Capture de l'Atmosphère & de l'Énergie",
            "contentFr": "Les arènes de basketball vibrent d'énergie. TFS capture les réactions de la foule, les célébrations sur le banc, les temps morts et les spectacles de la mi-temps. Notre intégration audio capte les bruits du terrain—grincements de chaussures, maniement du ballon et communication des joueurs—ajoutant de l'authenticité à chaque diffusion."
        }
    ],
    "motorsports": [
        {
            "titleFr": "Technologie de Suivi de la Vitesse",
            "contentFr": "Capturer des véhicules à plus de 300 km/h exige un équipement pointu. TFS Motorsports déploie des systèmes Speedcam qui suivent la vitesse des courses, gardant les voitures nettes dans les lignes droites et les chicanes. Nos installations Cablecam offrent un suivi aérien dynamique des leaders à travers les sections critiques de la course."
        },
        {
            "titleFr": "Réseau de Couverture du Circuit",
            "contentFr": "Nous établissons des réseaux de caméras complets autour des circuits : entrées/sorties de virages, zones de dépassement, voie des stands et podiums. Les caméras robotiques AGITO offrent des mouvements précis pour les ralentis, tandis que les systèmes Electro Moto permettent des travellings fluides le long des barrières."
        },
        {
            "titleFr": "Sécurité & Coordination",
            "contentFr": "La production de sports mécaniques exige des protocoles de sécurité rigoureux. TFS opère en totale coordination avec la direction de course et les équipes médicales. Nos positions de caméras sont certifiées, avec zéro interférence sur le déroulement de la course tout en capturant chaque moment de l'action."
        }
    ],
    "athletics": [
        {
            "titleFr": "Excellence des Épreuves sur Piste",
            "contentFr": "Les épreuves d'athlétisme sur piste exigent une précision d'une fraction de seconde. TFS déploie des caméras à grande vitesse au départ, sur la ligne d'arrivée pour la photo-finish, et des caméras sur rail qui suivent les sprinteurs à pleine vitesse. Pour les épreuves de fond, nous capturons les pelotons, les échappées et le sprint final."
        },
        {
            "titleFr": "Spécialisation des Épreuves sur le Terrain",
            "contentFr": "Chaque épreuve technique a ses approches spécifiques. Pour les lancers, nous captons la technique et la trajectoire. Pour les sauts, nous utilisons des caméras à l'appel et à la réception, des vues plongeantes pour la technique, et des gros plans stabilisés pour la concentration de l'athlète (perche et saut en hauteur couverts sous de multiples angles)."
        },
        {
            "titleFr": "Atmosphère du Stade",
            "contentFr": "TFS capture le faste—les hymnes nationaux, les tours d'honneur, les remises de médailles, et les réactions de la foule aux records du monde. Notre couverture va au-delà de la compétition et inclut la préparation des athlètes, les rituels d'échauffement, et les moments d'émotion qui définissent l'athlétisme de championnat."
        }
    ],
    "combat-sports": [
        {
            "titleFr": "Couverture du Ring & de la Cage",
            "contentFr": "Les sports de combat requièrent des caméras intimes qui saisissent chaque coup, blocage et tentative de soumission. TFS positionne des caméras dans les coins, autour de la cage et au-dessus. Nos opérateurs anticipent l'action, restant concentrés durant les échanges explosifs et les phases au sol qui définissent le combat moderne."
        },
        {
            "titleFr": "Impact & Émotion",
            "contentFr": "Nous nous spécialisons dans la capture des moments clés—le KO, la soumission qui met fin au combat, les conseils dans le coin entre les rounds. Des caméras à grande vitesse figent les moments d'impact avec des détails époustouflants, tandis que nos gros plans capturent les émotions des combattants et la tension avant les combats principaux."
        },
        {
            "titleFr": "Production de l'Événement",
            "contentFr": "Les événements de sports de combat sont des expériences théâtrales. TFS offre un support de production complet incluant les entrées dramatiques, les regards d'avant-match, les annonces sur le ring et les célébrations. Notre travail prend en compte l'éclairage dramatique de l'arène propre aux soirées de championnat."
        }
    ],
    "tennis": [
        {
            "titleFr": "Géométrie du Court",
            "contentFr": "Le tennis exige un positionnement précis de la caméra qui respecte la géométrie du court. TFS installe la vue classique surélevée derrière la ligne de fond, complétée par des caméras au filet, des angles latéraux pour les services, et des positions élevées pour des vues tactiques. Tout est calculé pour offrir une vue nette sans gêner les joueurs."
        },
        {
            "titleFr": "Concentration & Émotion du Joueur",
            "contentFr": "Le tennis est une bataille autant mentale que physique. Notre couverture saisit la concentration lors des services, la frustration des fautes directes et la célébration des balles de break. Nous plaçons nos caméras pour capter les loges des joueurs, les réactions des entraîneurs et l'intensité qui monte au fil des sets décisifs."
        },
        {
            "titleFr": "Adaptation à la Surface & au Lieu",
            "contentFr": "De la terre battue au gazon en passant par les courts en dur, chaque surface demande des ajustements avec la vitesse et les rebonds. TFS adapte l'équipement pour les arènes couvertes, les grands stades ouverts et les clubs intimes, maintenant l'excellence de la diffusion quelle que soit l'échelle du site ou du type de surface."
        }
    ],
    "rugby": [
        {
            "titleFr": "Couverture des Phases Arrêtées",
            "contentFr": "Les mêlées, touches et mauls nécessitent des positions spécialisées. TFS déploie des caméras avec des angles serrés pour les mêlées, surélevées pour les sauts en touche, et sur rail pour les mauls portés. Nos opérateurs comprennent les éléments techniques, assurant une couverture claire des liaisons, du timing et du moment où le ballon sort."
        },
        {
            "titleFr": "Dynamique du Jeu Ouvert",
            "contentFr": "Lorsque le jeu s'ouvre, TFS offre une couverture fluide avec des opérateurs Steadicam sur la ligne de touche, des positions centrales en hauteur, et des caméras dans l'en-but pour les essais. Nos systèmes aériens suivent les percées et les longs coups de pied, maintenant la continuité visuelle lors des transitions rapides du rugby."
        },
        {
            "titleFr": "Physicalité & Atmosphère",
            "contentFr": "La physicalité du rugby exige de capter l'impact—les angles des plaquages, les nettoyages de rucks et les chocs qui définissent le sport. Au-delà du terrain, nous saisissons l'atmosphère unique du rugby : rituels d'avant-match, discours, chants de la foule et le respect entre adversaires post-match qui incarne les valeurs du rugby."
        }
    ],
    "cycling": [
        {
            "titleFr": "Couverture Mobile & Aérienne",
            "contentFr": "Le cyclisme sur route s'étend sur des centaines de kilomètres. TFS déploie des caméras sur moto qui accompagnent le peloton, capturant attaques, échappées et la dynamique de groupe. La couverture par hélicoptères et drones assure des vues aériennes panoramiques, combinées à des positions fixes sur les montées, sprints et zones de ravitaillement."
        },
        {
            "titleFr": "Excellence sur la Ligne d'Arrivée",
            "contentFr": "Les arrivées cyclistes demandent un chronométrage précis et des angles multiples. TFS place des caméras à grande vitesse pour une photo-finish nette, des plateformes stabilisées pour les sprints, et des vues en hauteur sur le placement dans les derniers kilomètres. Nous captons à la fois la célébration du vainqueur et les batailles du groupe."
        },
        {
            "titleFr": "Spécialisation Vélodrome & VTT",
            "contentFr": "Au-delà de la route, TFS offre une couverture spécialisée pour le cyclisme sur piste (poursuites, américaines et sprints) dans les vélodromes du monde entier. Pour le VTT, nous déployons des systèmes de caméras robustes qui affrontent les chemins forestiers, les descentes techniques et les courses d'endurance cross-country."
        }
    ],
    "extreme-sports": [
        {
            "titleFr": "Le Travail d'Image Tourné vers l'Action",
            "contentFr": "Les sports extrêmes demandent des caméras qui bougent avec les athlètes. Les opérateurs TFS utilisent des stabilisateurs légers (gimbals et harnais) pour suivre les skaters dans les parcs, les riders BMX sur les parcours et les grimpeurs. Une approche priorisant des angles dynamiques et authentiques qui traduisent vitesse, risque et habileté."
        },
        {
            "titleFr": "Couverture de Compétitions & Événements",
            "contentFr": "Pour les compétitions professionnelles (X Games, Street League, FMX), TFS fournit une infrastructure de diffusion complète tout en préservant l'esthétique créative propre aux sports de glisse. Les configurations multi-caméras saisissent les séries de tricks sous les meilleurs angles, pour appuyer le jugement avec des ralentis précis."
        },
        {
            "titleFr": "Lifestyle & Documentaire",
            "contentFr": "Au-delà de la compétition, les sports extrêmes sont un mode de vie. TFS capture la culture—sessions skate, voyages surf, expéditions en montagne—avec des approches documentaires cinématographiques. Nos équipes légères s'intègrent avec les athlètes, captant des instants authentiques traduits en contenus percutants."
        }
    ],
    "equestrian": [
        {
            "titleFr": "Développement et Promotion des Sports Équestres",
            "contentFr": "TFS Equestrian Sports offre une couverture primée et de haut niveau des courses hippiques et autres événements internationaux. Travaillant en partenariat avec la SOREC (Société Royale d'Encouragement du Cheval), l'autorité phare du Maroc pour le domaine équin."
        },
        {
            "titleFr": "Systèmes de Suivi à Grande Vitesse",
            "contentFr": "TFS opère avec les standards les plus professionnels : systèmes de suivi de vitesse ultra-rapides, mouvements de sol stabilisés, cadrage aérien avec drones, jumelles optiques de pointe afin de suivre chaque foulée, accélération et finish dramatique avec netteté et clarté exceptionnelles."
        },
        {
            "titleFr": "Partenariat Stratégique SOREC",
            "contentFr": "Partenaire officiel de la SOREC, TFS apporte des années d'expertise audiovisuelle locale de production depuis le Meeting International du Maroc aux courses récurrentes : nous diffusons l'excellence et faisons rayonner la discipline équestre sur de nombreuses plateformes mondiales."
        }
    ]
}

def update_sections():
    # Load the English sections from the file we just exported
    with open('sports_sections.json', 'r', encoding='utf-8') as f:
        export_data = json.load(f)

    # API configuration
    BASE_URL = 'http://127.0.0.1:8090/api/collections/services/records'
    # Use authentication headers if required (assuming standard test local PB ignores this or just patch as admin)
    
    # We will iterate through each sport, apply French values, and execute a PATCH
    for sport in export_data:
        slug = sport['slug']
        record_id = sport['id']
        sections = sport['sections']
        
        # Only process if we have translations for this sports
        translations = TRANSLATIONS.get(slug)
        if translations:
            # Apply french translations to sections
            for i, section_translation in enumerate(translations):
                if i < len(sections):
                    sections[i]['titleFr'] = section_translation['titleFr']
                    sections[i]['contentFr'] = section_translation['contentFr']
            
            # Send PATCH request
            patch_url = f"{BASE_URL}/{record_id}"
            
            data = json.dumps({'sections': sections}).encode('utf-8')
            
            req = urllib.request.Request(
                patch_url, 
                data=data, 
                method='PATCH',
                headers={
                    'Content-Type': 'application/json'
                }
            )
            
            print(f"Updating: {slug} ({record_id})...", end="")
            try:
                # To patch PocketBase API directly like this, might require auth.
                # If it responds with 401 or 403, we need an admin token. But first we try.
                res = urllib.request.urlopen(req)
                print(' SUCCESS')
            except urllib.error.HTTPError as e:
                # Print proper error from Pocketbase
                err_body = e.read().decode('utf-8')
                print(f" FAILED: {e.code} - {err_body}")
            except Exception as e:
                print(f" ERROR: {e}")

if __name__ == '__main__':
    update_sections()
