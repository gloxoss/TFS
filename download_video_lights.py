import os
import requests
import time

SAVE_DIR = "pb_data/video_lights_images"
if not os.path.exists(SAVE_DIR):
    os.makedirs(SAVE_DIR)

items = [
    {"slug": "teradek-ranger-mk-ii-750", "url": "https://static.bhphoto.com/images/images500x500/1705406436_1761089.jpg"},
    {"slug": "teradek-bolt-6-lt-1500", "url": "https://static.bhphoto.com/images/images500x500/1662681512_1723714.jpg"},
    {"slug": "teradek-bolt-6-lt-750", "url": "https://static.bhphoto.com/images/images750x750/1722001523_1841011.jpg"},
    {"slug": "teradek-bolt-pro-3000", "url": "https://static.bhphoto.com/images/images500x500/1471872050_1273194.jpg"},
    {"slug": "teradek-bolt-sidekick-ii", "url": "https://static.bhphoto.com/images/images500x500/1491412879_1328070.jpg"},
    {"slug": "teradek-bolt-1000-xt", "url": "https://static.bhphoto.com/images/images500x500/1525370855_1403862.jpg"},
    {"slug": "teradek-bolt-500-xt", "url": "https://static.bhphoto.com/images/images750x750/1524585083_1403845.jpg"},
    {"slug": "hollyland-mars-400s-pro-ii", "url": "https://static.bhphoto.com/images/images500x500/1701775224_1797151.jpg"},
    {"slug": "dji-ronin-2", "url": "https://static.bhphoto.com/images/images500x500/1558517704_1479666.jpg"},
    {"slug": "dji-rs-3-pro", "url": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/dji_rs_3_pro_gimbal_1720204160_1797421.jpg"},
    {"slug": "dji-rs-4-pro", "url": "https://static.bhphoto.com/images/images500x500/1730825421_1816789.jpg"},
    {"slug": "dji-force-pro", "url": "https://store.droneway.ma/wp-content/uploads/2020/11/DJI-Force-Pro.jpg"},
    {"slug": "arri-m18", "url": "https://static.bhphoto.com/images/images500x500/1223968.jpg"},
    {"slug": "arri-m40", "url": "https://static.bhphoto.com/images/images500x500/1223969.jpg"},
    {"slug": "arri-junior-650", "url": "https://www.arri.com/resource/image/178532/landscape_ratio1x0_38/1920/737/9abc0a8c3fb59110e6d24c9e910fab4f/17A0DCC72072D62359DEBB1D7F067F67/arri-junior-stage.jpg"},
    {"slug": "arri-t1-true-blue", "url": "https://www.arri.com/resource/image/33178/landscape_ratio1x0_38/1920/737/7df9692b9699b47a591803a3528e084c/E869D365945DAF18E9F733DA558FC2E3/true-blue-t-series-t1-stage.png"},
    {"slug": "dino-light-12k", "url": "https://www.spottlight-dortmund.de/wp-content/uploads/2020/03/Dino-Light-12kw.png"},
    {"slug": "etc-source-4-750", "url": "https://megavision.com.au/wp-content/uploads/2022/06/ETC-Source-4-750W-Profile-Spotlight.jpg"},
    {"slug": "arri-skypanel-s60-c", "url": "https://static.bhphoto.com/images/images500x500/1432655173_1139001.jpg"},
    {"slug": "creamsource-vortex8", "url": "https://static.bhphoto.com/images/multiple_images/images500x500/1643912107_IMG_1690330.jpg"},
    {"slug": "astera-titan-tube-set", "url": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/astera_fp1_set_set_of_8_titan_1581676051_1541959.jpg"},
    {"slug": "aputure-ls-1200d-pro", "url": "https://cdn.shopify.com/s/files/1/1343/1935/files/LS1200dPro-2.png?v=1711009429&width=1000&crop=center"},
    {"slug": "aputure-ls-600c-pro-ii", "url": "https://cdn.shopify.com/s/files/1/1343/1935/files/LS1200dPro-6.png?v=1711009429&width=1000&crop=center"},
    {"slug": "nanlite-forza-500b", "url": "https://cdn-aliyun.nanlite.com/release/1694758773902-815500-1410622625-Forza+300%2B500II.png"},
    {"slug": "litemat-4-spectrum", "url": "https://s.turbifycdn.com/aah/filmandvideolighting/litegear-litemat-led-lighting-film-video-photo-17.jpg"},
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
