import os
import requests
import time

SAVE_DIR = "pb_data/support_power_images"
if not os.path.exists(SAVE_DIR):
    os.makedirs(SAVE_DIR)

items = [
    {"slug": "easyrig-2-5-600n", "url": "https://www.adorama.com/images/XLarge/easyrig-2-400n-stabilizing-camera-support_erig400_1.webp"},
    {"slug": "easyrig-vario-5-gimbal", "url": "https://static.bhphoto.com/images/multiple_images/images500x500/1434390382_IMG_505123.jpg"},
    {"slug": "tilta-armor-man-3", "url": "https://static.bhphoto.com/images/multiple_images/images500x500/1434390382_IMG_505123.jpg"},
    {"slug": "tilta-armor-man-2", "url": "https://static.bhphoto.com/images/multiple_images/images500x500/1434390382_IMG_505123.jpg"},
    {"slug": "bebob-v200-micro", "url": "https://static.bhphoto.com/images/images500x500/1600338928_1594107.jpg"},
    {"slug": "bebob-v290rm-cine", "url": "https://static.bhphoto.com/images/images500x500/1527091561_1409408.jpg"},
    {"slug": "bebob-b290cine-kit", "url": "https://static.bhphoto.com/images/images500x500/1720197931_1698235.jpg"},
    {"slug": "swit-pb-r290s", "url": "https://static.bhphoto.com/images/images500x500/1668522319_1734750.jpg"},
    {"slug": "swit-pocket-140wh", "url": "https://static.bhphoto.com/images/images500x500/1655218230_1710560.jpg"},
    {"slug": "idx-duo-c198p", "url": "https://static.bhphoto.com/images/images500x500/1649070368_1699540.jpg"}
]

session = requests.Session()
session.headers.update({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Referer': 'https://www.bhphotovideo.com/'
})

print(f"Downloading {len(items)} images for support and power...")

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
