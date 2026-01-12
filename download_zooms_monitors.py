import os
import requests
import time

SAVE_DIR = "pb_data/zooms_monitors_images"
if not os.path.exists(SAVE_DIR):
    os.makedirs(SAVE_DIR)

items = [
    {"slug": "arri-uwz-9.5-18mm", "url": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/arri_k2_0001686_uwz_9_5_18mm_t2_9_f_1499174765_1287811.jpg"},
    {"slug": "arri-alura-45-250mm", "url": "https://static.bhphoto.com/images/images750x750/1487692047_1287817.jpg"},
    {"slug": "arri-alura-18-80mm", "url": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/arri_k2_47931_0_alura_18_80mm_t2_6_wide_angle_1487692047_1287816.jpg"},
    {"slug": "fujinon-cabrio-19-90mm", "url": "https://static.bhphoto.com/images/multiple_images/images500x500/1498824105_IMG_823618.jpg"},
    {"slug": "fujinon-cabrio-85-300mm", "url": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/fujinon_zk3_5x85_saf_85_300mm_cabrio_lens_1684943711_1733118.jpg"},
    {"slug": "fujinon-cabrio-20-120mm", "url": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/fujinon_xk6x20_nm_xk6x20_20_120_pl_mount_1488383209_1322733.jpg"},
    {"slug": "canon-cne-15.5-47mm", "url": "https://static.bhphoto.com/images/images500x500/1346318521_889818.jpg"},
    {"slug": "canon-cine-servo-17-120mm", "url": "https://static.bhphoto.com/images/images500x500/1717598768_1833736.jpg"},
    {"slug": "angenieux-optimo-style-30-76mm", "url": "https://cvp.com/images/products/alt/large/angenieux_3076_1.jpg"},
    {"slug": "angenieux-optimo-style-16-40mm", "url": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/angenieux_16_40_optimo_16_to_40mm_optimo_1419417309_1107020.jpg"},
    {"slug": "sigma-50-100mm-t2", "url": "https://www.sigma-global.com/common/cas/product/cine/high_speed_zoom/50_100_2/img/01.jpg"},
    {"slug": "arri-lmb-4x5", "url": "https://static.bhphoto.com/images/images500x500/1496676931_1341045.jpg"},
    {"slug": "arri-lmb-25", "url": "https://static.bhphoto.com/images/images500x500/1488196247_1288790.jpg"},
    {"slug": "arri-mb-28", "url": "https://vmi.tv/wp-content/uploads/sites/3/2019/03/ARRI-MB28-Matte-Box-3-2.jpg"},
    {"slug": "arri-mmb-2", "url": "https://static.bhphoto.com/images/images500x500/1533910662_1220658.jpg"},
    {"slug": "chrosziel-450-r11", "url": "https://static.bhphoto.com/images/images500x500/1346675010_889174.jpg"},
    {"slug": "smallhd-ultra-7-bolt", "url": "https://static.bhphoto.com/images/images500x500/1715266825_1806333.jpg"},
    {"slug": "smallhd-ultra-7", "url": "https://static.bhphoto.com/images/images500x500/1731335130_1795838.jpg"},
    {"slug": "smallhd-703-bolt", "url": "https://static.bhphoto.com/images/images500x500/1515023115_1380051.jpg"},
    {"slug": "smallhd-cine-7-red", "url": "https://static.bhphoto.com/images/multiple_images/images500x500/1640703758_IMG_1667808.jpg"},
    {"slug": "tvlogic-vfm-055a", "url": "https://static.bhphoto.com/images/images500x500/1505816473_1362534.jpg"},
    {"slug": "sony-pvma170", "url": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/sony_pvm_a170b_pvm_a170_17_pro_oled_1490022375_1320839.jpg"},
    {"slug": "sony-bvm-e251", "url": "https://www.sony.com/image/3f6290bc8a31d7cf13236376d5e855dc?fmt=jpeg&wid=558&hei=336"},
    {"slug": "blackmagic-video-assist-7-12g", "url": "https://static.bhphoto.com/images/images500x500/1568713006_1507213.jpg"},
    {"slug": "atomos-shogun-7", "url": "https://static.bhphoto.com/images/images500x500/1727171715_1854463.jpg"},
]

session = requests.Session()
session.headers.update({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Cache-Control': 'max-age=0',
})

print(f"Downloading {len(items)} images...")

for item in items:
    url = item['url']
    slug = item['slug']
    
    # URL Rewriting for B&H to bypass Cloudflare/403
    if 'bhphotovideo.com' in url and 'cdn-cgi' in url:
        try:
            filename_part = url.split('images500x500/')[-1]
            new_url = f"https://static.bhphoto.com/images/images500x500/{filename_part}"
            print(f"🔄 Rewriting B&H URL for {slug}: \n  Old: {url}\n  New: {new_url}")
            url = new_url
        except:
            pass
            
    # Try to guess extension from URL
    clean_url = url.split('?')[0]
    ext = clean_url.split('.')[-1]
    if len(ext) > 4 or '/' in ext: 
        ext = 'jpg'
    
    filename = f"{slug}.{ext}"
    filepath = os.path.join(SAVE_DIR, filename)

    if os.path.exists(filepath):
        print(f"Skipping {slug}, already exists.")
        continue

    try:
        print(f"Downloading {slug} from {url}...")
        response = session.get(url, timeout=15, stream=True)
        if response.status_code == 200:
            with open(filepath, 'wb') as f:
                for chunk in response.iter_content(1024):
                    f.write(chunk)
            print(f"✅ Saved to {filepath}")
        else:
            print(f"❌ Failed to download {slug}: Status {response.status_code}")
    except Exception as e:
        print(f"❌ Error downloading {slug}: {e}")
    
    time.sleep(2)

print("Done!")
