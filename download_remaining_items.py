import os
import requests
import time

SAVE_DIR = "pb_data/remaining_images"
if not os.path.exists(SAVE_DIR):
    os.makedirs(SAVE_DIR)

items = [
    {"slug": "fujinon-cabrio-14-35mm", "url": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/fujinon_zk2_5x14_14_35mm_t2_9_cabrio_premier_1384866604_1013528.jpg"},
    {"slug": "canon-cine-servo-15-120mm", "url": "https://static.bhphoto.com/images/images500x500/1662540395_1725850.jpg"},
    {"slug": "canon-cine-servo-25-250mm", "url": "https://static.bhphoto.com/images/images500x500/1587386883_1557489.jpg"},
    {"slug": "angenieux-optimo-28-76mm", "url": "https://static.bhphoto.com/images/images500x500/1493987833_1332901.jpg"},
    {"slug": "angenieux-optimo-style-48-130mm", "url": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/angenieux_optimo_48_130_style_with_asu_optimo_style_48_130mm_zoom_1513340578_1365594.jpg"},
    {"slug": "angenieux-optimo-19.5-94mm", "url": "https://epc.es/wp-content/uploads/2019/04/ANGENIEUX-195-94mm-20-scaled.jpg"},
    {"slug": "zeiss-cz2-15-30mm", "url": "https://static.bhphoto.com/images/images500x500/1390563263_1023801.jpg"},
    {"slug": "tokina-11-16mm", "url": "https://thehdhouse.com/wp-content/uploads/2023/09/tokina-duclos-11-16mm-T3.0-1.png"},
    {"slug": "zeiss-cp2-set", "url": "https://www.thevisionhouse.com.au/wp-content/uploads/2022/10/Zeiss-CP2-1-640x0-c-default.jpeg"},
    {"slug": "zeiss-standard-primes", "url": "https://utopiacam.com/wp-content/uploads/2016/05/standardspeeds.jpg"},
    {"slug": "zeiss-master-macro", "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3o7xDEWDfq1fss3q_AqUFFTJR_yWBlqdYjw&s"},
    {"slug": "scorpion-anamorphic", "url": "https://rental.servicevision.es/wp-content/uploads/2019/02/056_ScorpioLens_Anamorphic2x-1-scaled.jpg"},
    {"slug": "tvlogic-lqm-071w", "url": "https://tvlogic.tv/Monitors/UpImg/LQM-071W-FRONT.gif"},
    {"slug": "marshall-v-md241", "url": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/marshall_electronics_v_md241_24_led_lcd_1386257619_982146.jpg"},
    {"slug": "transvideo-starlite", "url": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/arri_k2_0015243_transvideo_starlite_arri_wvs_1525176383_1367785.jpg"},
    {"slug": "atomos-ninja-inferno", "url": "https://static.bhphoto.com/images/multiple_images/images500x500/1490258703_IMG_773212.jpg"},
    {"slug": "swit-cw-s300", "url": "https://media.tarad.com/9/99aplus/img-lib/spd_2018051492235_b.jpg"},
    {"slug": "zhiyun-crane-3s", "url": "https://static.bhphoto.com/images/images500x500/1584603943_1554049.jpg"},
    {"slug": "dedolight-150w-kit", "url": "https://bollywoodfilmequipments.in/wp-content/uploads/2020/12/1-6.jpg"},
    {"slug": "dmg-lumiere-mix", "url": "https://static.bhphoto.com/images/images500x500/1564134460_1492286.jpg"},
    {"slug": "aputure-cs15", "url": "https://cdn.shopify.com/s/files/1/1343/1935/files/CS15_Meuium_Barndoor-5.png?v=1703557992"},
    {"slug": "aputure-xt26", "url": "https://cdn.shopify.com/s/files/1/1343/1935/files/XT26_Meuium_Barndoor-2.png?v=1710323628&width=1000&crop=center"},
    {"slug": "aputure-xt52", "url": "https://static.bhphoto.com/images/images500x500/1743508894_1889192.jpg"},
    {"slug": "amaran-flex-mat", "url": "https://static.bhphoto.com/images/multiple_images/images500x500/1648739988_IMG_1725343.jpg"},
    {"slug": "aputure-mc-pro", "url": "https://cdn.shopify.com/s/files/1/1343/1935/files/MCPro-1.png?v=1696906204&width=1000&crop=center"},
    {"slug": "phoenix-crane", "url": "https://www.tsf.fr/wp-content/uploads/2017/12/G-PH-1-0.png"},
    {"slug": "panther-pegasus", "url": "https://mundocrane.com/wp-content/uploads/2020/03/pegasus-2-mundo-crane.jpg"},
    {"slug": "abc-120-crane", "url": "https://www.movietech.de/wp-content/uploads/2024/04/MovieTech-ABC-Crane-120-9m-Lightweight-Broadcast-Crane-650x650-1.jpg"},
    {"slug": "gizmo-jib", "url": "https://www.movietech.de/wp-content/uploads/2023/11/1301-03_Gizmo-Jib-Version-L-Ohne-Hintergrund_650x650px.jpg"},
    {"slug": "panther-lightweight-jib", "url": "https://utopiacam.com/wp-content/uploads/2016/10/lighweightjib_title.jpg"},
    {"slug": "panther-boogie-wheels", "url": "https://fookuspookus.ee/wp-content/uploads/2023/08/boogie-wheels-1.jpg"},
    {"slug": "multitower-scaffolding", "url": "https://cdn.djust-app.com/img/0000000034_ve/product/1493423/98195275_1d803712e87d414b81a5a34653667cd5?width=329&height=329&format=webp&fit=contain"},
    {"slug": "low-rig-riser", "url": "https://www.movietech.de/wp-content/uploads/2023/12/2005-3500Set-Syszem-Low-rig-new-turntsile-650x650-1.jpg"},
    {"slug": "barracuda-bar", "url": "https://turtlemaxlocation.com/wp-content/uploads/2019/02/jeu-de-barres-scaled.jpg"}
]

session = requests.Session()
session.headers.update({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Referer': 'https://www.bhphotovideo.com/'
})

print(f"Downloading {len(items)} images for remaining items...")

for item in items:
    url = item['url']
    slug = item['slug']
    
    # B&H rewrite logic
    if 'bhphotovideo.com' in url and 'cdn-cgi' in url:
        try:
            filename = url.split('images500x500/')[-1]
            if not filename: raise Exception("No filename")
            new_url = f"https://static.bhphoto.com/images/images500x500/{filename}"
            print(f"🔄 Rewriting B&H URL for {slug}")
            url = new_url
        except:
            pass

    clean_url = url.split('?')[0]
    ext = clean_url.split('.')[-1].lower()
    if len(ext) > 4 or '/' in ext or not ext: ext = 'jpg'
    
    filepath = os.path.join(SAVE_DIR, f"{slug}.{ext}")
    
    if os.path.exists(filepath):
        print(f"Skipping {slug}, exists.")
        continue

    try:
        print(f"Downloading {slug} from {url}...")
        res = session.get(url, timeout=20)
        if res.status_code == 200:
            with open(filepath, 'wb') as f:
                f.write(res.content)
            print(f"✅ Saved {slug}")
        else:
            print(f"❌ Failed {slug}: {res.status_code}")
    except Exception as e:
        print(f"❌ Error {slug}: {e}")
    
    time.sleep(1)

print("Done!")
