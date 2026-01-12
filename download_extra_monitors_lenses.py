import os
import requests
import time

SAVE_DIR = "pb_data/extra_monitors_lenses_images"
if not os.path.exists(SAVE_DIR):
    os.makedirs(SAVE_DIR)

items = [
    {"slug": "smallhd-cine-5", "url": "https://static.bhphoto.com/images/multiple_images/images500x500/1662682690_IMG_1834568.jpg"},
    {"slug": "swit-s1051h", "url": "https://static.bhphoto.com/images/multiple_images/images500x500/1452426413_IMG_573410.jpg"},
    {"slug": "ruige-tl-701hda", "url": "https://en.ruige.com/wp-content/uploads/2022/02/index01-2.jpg"},
    {"slug": "lilliput-fs7", "url": "https://static.bhphoto.com/images/images500x500/1576780570_1412531.jpg"},
    {"slug": "tvlogic-f7hs", "url": "https://static.bhphoto.com/images/images500x500/1670343919_1737073.jpg"},
    {"slug": "smallhd-702-bright", "url": "https://static.bhphoto.com/images/images500x500/1517313952_1387386.jpg"},
    {"slug": "smallhd-dp6-sdi", "url": "https://www.talamas.com/sites/default/files/styles/large/public/smallhd-dp6-sdi-56-inch-monitor.jpg?itok=e8rBnTkR"},
    {"slug": "fujinon-cabrio-25-300mm", "url": "https://static.bhphoto.com/images/images500x500/1623843470_1055313.jpg"},
    {"slug": "tokina-50-135mm", "url": "https://www.cathayphoto.com.sg/_next/image?url=https%3A%2F%2Fassets.cathayphoto.com.sg%2Fproduct%2Ftok-50-135-t3-cinema-_ef_.jpg&w=1920&q=75"},
    {"slug": "laowa-24mm-periprobe", "url": "https://static.bhphoto.com/images/images500x500/1654688136_1710457.jpg"},
    {"slug": "canon-ej-6mm", "url": "https://media.exapro.com/product/2024/04/P240402264/595c32aab03f5ff7ce3717a00a678cc0/462x340/canon-ej-t15-p240402264_2.jpg"},
    {"slug": "canon-ef-100mm-macro", "url": "https://mpex.com/_ipx/f_webp,b_%23fff,fit_contain,s_500x500/https://mpex.com/pub/media/catalog/product/cache/2264c9e38777ed202d5c3170a063a3cf/i/m/image_6230_4.jpg"},
    {"slug": "canon-tse-45mm", "url": "https://i1.adis.ws/i/canon/2536A019_TS-E_45mm_f2.8_1?w=940&bg=rgb(245,246,246)&fmt=webp&qlt=100&sm=aspect&aspect=1:1"},
    {"slug": "ibe-plx2-extender", "url": "https://vmi.tv/wp-content/uploads/sites/3/2020/03/IBE-PLx2-Doubler.1.jpg"}
]

session = requests.Session()
session.headers.update({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Referer': 'https://www.bhphotovideo.com/'
})

print(f"Downloading {len(items)} images for extra monitors and lenses...")

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
