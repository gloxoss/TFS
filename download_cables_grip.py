import os
import requests
import time

SAVE_DIR = "pb_data/cables_grip_images"
if not os.path.exists(SAVE_DIR):
    os.makedirs(SAVE_DIR)

items = [
    {"slug": "power-cable-16a", "url": "https://smithshire.com/wp-content/uploads/2016/01/51BCAD90-5EF5-4719-8705-9DF169A4D618-huge.jpg"},
    {"slug": "power-cable-32a-3phase", "url": "https://smithshire.com/wp-content/uploads/2016/01/51BCAD90-5EF5-4719-8705-9DF169A4D618-huge.jpg"},
    {"slug": "power-cable-63a-3phase", "url": "https://smithshire.com/wp-content/uploads/2016/01/51BCAD90-5EF5-4719-8705-9DF169A4D618-huge.jpg"},
    {"slug": "power-cable-125a-3phase", "url": "https://smithshire.com/wp-content/uploads/2016/01/51BCAD90-5EF5-4719-8705-9DF169A4D618-huge.jpg"},
    {"slug": "distro-vipere-32a", "url": "https://smithshire.com/wp-content/uploads/2016/01/51BCAD90-5EF5-4719-8705-9DF169A4D618-huge.jpg"},
    {"slug": "schneider-nd-3", "url": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/Tiffen_45650ND3_4_x_5_65_Neutral_1636720564_86014.jpg"},
    {"slug": "schneider-irnd-3", "url": "https://static.bhphoto.com/images/images500x500/1502792755_572940.jpg"},
    {"slug": "schneider-grad-nd-9", "url": "https://static.bhphoto.com/images/images500x500/1629724915_373624.jpg"},
    {"slug": "tiffen-bpm-1-4", "url": "https://static.bhphoto.com/images/images500x500/1727344805_85878.jpg"},
    {"slug": "schneider-glimmerglass-1", "url": "https://cdn.cvp.com/images/products/altimage/25-03-20201585145210tiffen-glimmerglass-filter-1.jpg"},
    {"slug": "schneider-hbm", "url": "https://www.camerahire.com.au/images/hire/Schneider_ND_Filters_480x3502.png"},
    {"slug": "arri-rota-pola", "url": "https://static.bhphoto.com/images/images500x500/1641919557_1367822.jpg"},
    {"slug": "schneider-true-pol", "url": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/Schneider_68013056_True_Polarizing_Filter_4_x_1565868205_398939.jpg"},
    {"slug": "tiffen-138mm-diopter-set", "url": "https://images.squarespace-cdn.com/content/v1/61a7f2611cbe417ce838e1b3/09e74e3c-45b5-48cf-9681-5cf3b2cb3187/Tiffen-138mm-Diopter-Set-Wide.png?format=2500w"},
    {"slug": "schneider-streak-blue", "url": "https://static.bhphoto.com/images/images500x500/1568816621_944109.jpg"},
    {"slug": "movietech-magnum-dolly", "url": "https://fookuspookus.ee/wp-content/uploads/2024/03/magnum-dolly.png"},
    {"slug": "movietech-scooter-dolly", "url": "https://www.movietech.de/wp-content/uploads/2024/02/MovieTech-Scooter-Dolly-650x650-1.jpg"},
    {"slug": "panther-super-panther", "url": "https://finalcutequipped.com/wp-content/uploads/2023/02/5cad1611d10c09ca67455c2c_classicplusdolly-943x1024.jpg"},
    {"slug": "panther-husky-dolly", "url": "https://patriot.ua/wp-content/uploads/2019/06/A62A0080-kopyya.jpg"},
    {"slug": "chapman-peewee", "url": "https://www.tsf.fr/wp-content/uploads/2023/10/PEEWEE-V-1024x718.jpg"},
    {"slug": "moviebird-45", "url": "https://eurogrip.com/media/com_jmsproduct/tmpl/83/MB45-2-tlo-6-znak-wodny800px.png"},
    {"slug": "stanton-jimmy-jib", "url": "https://www.jimmyjib.com/uimages/home/featured/home-triangle-pro-series.jpg"},
    {"slug": "egripment-javelin", "url": "https://egripment.com/assets/components/phpthumbof/cache/Naamloos.b8d4572a526726ec7e9752fd1c024425.jpg"},
    {"slug": "panther-u-bangi", "url": "https://utopiacam.com/wp-content/uploads/2016/10/panther-u-bangi.jpg"},
    {"slug": "gfm-mini-jib", "url": "https://photocinerent.com/storage/1382/conversions/GFM-Mini-JIB-6QVH-slide.jpg"},
    {"slug": "panther-straight-track", "url": "https://cdn.prod.website-files.com/66ba0723facf47228bf58e73/684a7a35344929502a0ec11f_curved%20tracks%20cover.png"},
    {"slug": "panther-curved-track", "url": "https://cdn.prod.website-files.com/66ba0723facf47228bf58e73/684a7a35344929502a0ec11f_curved%20tracks%20cover.png"},
    {"slug": "manfrotto-autopoles", "url": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/Manfrotto_076SET_076SET_Short_Autopoles_1233192889_560187.jpg"}
]

session = requests.Session()
session.headers.update({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
})

print(f"Downloading {len(items)} images...")

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
    ext = clean_url.split('.')[-1]
    if len(ext) > 4 or '/' in ext: ext = 'jpg'
    
    filepath = os.path.join(SAVE_DIR, f"{slug}.{ext}")
    
    if os.path.exists(filepath):
        print(f"Skipping {slug}, exists.")
        continue

    try:
        print(f"Downloading {slug}...")
        res = session.get(url, timeout=15)
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
