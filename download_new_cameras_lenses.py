import os
import requests
import time

SAVE_DIR = "pb_data/new_cameras_lenses_images"
if not os.path.exists(SAVE_DIR):
    os.makedirs(SAVE_DIR)

items = [
    {"slug": "arri-alexa-35-xtreme", "url": "https://cdn.theasc.com/20250731-2-arri-alexa-35-xtreme-enso-32-front-right82.jpg"},
    {"slug": "sony-fx6", "url": "https://static.bhphoto.com/images/multiple_images/images500x500/1671614142_IMG_1901057.jpg"},
    {"slug": "cooke-s8i-set", "url": "https://twinsproduction.com/wp-content/uploads/2023/11/Cooke-S8i-set.jpg.webp"},
    {"slug": "sony-fe-50mm-gm", "url": "https://static.bhphoto.com/images/images500x500/1615895153_1630079.jpg"},
    {"slug": "sony-fe-24-70mm-gm-ii", "url": "https://static.bhphoto.com/images/multiple_images/images500x500/1651055463_IMG_1739517.jpg"},
    {"slug": "sony-fe-35mm-gm", "url": "https://static.bhphoto.com/images/multiple_images/images500x500/1610533948_IMG_1472020.jpg"},
    {"slug": "sony-fe-16-35mm-gm", "url": "https://static.bhphoto.com/images/multiple_images/images500x500/1504614646_IMG_863921.jpg"},
    {"slug": "sony-fe-85mm-gm", "url": "https://static.bhphoto.com/images/multiple_images/images500x500/1624972658_IMG_582639.jpg"},
    {"slug": "sony-fe-70-200mm-gm", "url": "https://static.bhphoto.com/images/images500x500/1454496359_1222776.jpg"},
    {"slug": "sony-fe-pz-28-135mm", "url": "https://static.bhphoto.com/images/images500x500/1410490265_1082051.jpg"}
]

session = requests.Session()
session.headers.update({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Referer': 'https://www.bhphotovideo.com/'
})

print(f"Downloading {len(items)} images for new cameras and lenses...")

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
