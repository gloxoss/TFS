import os
import requests
import time

SAVE_DIR = "pb_data/hollyland_images"
if not os.path.exists(SAVE_DIR):
    os.makedirs(SAVE_DIR)

items = [
    # Hollyland Items
    {"slug": "hollyland-cosmo-c1", "url": "https://www.bhphotovideo.com/images/fb/hollyland_hl_cosmo_c1_cosmo_c1_sdi_hdmi_wireless_1671905.jpg"},
    {"slug": "hollyland-mars-400s", "url": "https://static.bhphoto.com/images/images500x500/1572948797_1513264.jpg"},
    
    # FIX: Cooke S8/i (Previous 403 error)
    {"slug": "cooke-s8i-set", "url": "https://static.bhphoto.com/images/images500x500/1648128038_1694665.jpg"}
]

session = requests.Session()
session.headers.update({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Referer': 'https://www.bhphotovideo.com/'
})

print(f"Downloading {len(items)} images for Hollyland & Fixes...")

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
    
    # Always overwrite for the fix items if needed, or check validity
    if os.path.exists(filepath):
        # Optional: check size? allow overwrite
        print(f"Overwriting/Updating {slug}...")
    
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
