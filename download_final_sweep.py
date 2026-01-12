import os
import requests
import time

SAVE_DIR = "pb_data/final_sweep_images"
if not os.path.exists(SAVE_DIR):
    os.makedirs(SAVE_DIR)

items = [
    {"slug": "teradek-bolt-pro-2000", "url": "https://static.bhphoto.com/images/images500x500/1425923204_1076568.jpg"},
    {"slug": "teradek-bolt-pro-1000", "url": "https://static.bhphoto.com/images/images500x500/1471867680_1273184.jpg"},
    {"slug": "teradek-bolt-lt-500", "url": "https://tdmstore.tdm.ma/wp-content/uploads/2020/05/TERADEK-HF-BOLT-LT-500.jpg"},
    {"slug": "teradek-bolt-pro-300", "url": "https://static.bhphoto.com/images/images500x500/1425923204_1076568.jpg"},
    {"slug": "video-devices-pix-e7", "url": "https://static.bhphoto.com/images/images500x500/1428938280_1137280.jpg"},
    {"slug": "tvlogic-lvm-091w", "url": "https://www.tvlogic.tv/Monitors/UpImg/1042_782_LVM-091W(1).png"},
    {"slug": "arri-blonde-2000", "url": "https://www.goldcoastcamerahire.com.au/wp-content/uploads/2019/01/Arrilite-800-2.jpg"},
    {"slug": "par-64-can", "url": "https://www.lightinglab.com.au/wp-content/uploads/2020/04/3-10-Par-64-Black.png"},
    {"slug": "gfm-lite-dolly", "url": "https://www.tsf.fr/wp-content/uploads/2017/12/G-LITE-1-0.png"},
    {"slug": "egripment-javelin", "url": "https://egripment.com/assets/components/phpthumbof/cache/Naamloos.b8d4572a526726ec7e9752fd1c024425.jpg"},
    {"slug": "ball-adapter-150mm", "url": "https://www.movietech.de/wp-content/uploads/2023/12/2031-0_MovieTech_Bowl_Adapter_150_mm_650x650.jpg"}
]

session = requests.Session()
session.headers.update({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
})

print(f"Downloading {len(items)} images for final sweep...")

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
