import asyncio
import aiohttp
import mimetypes
import os
import sys
import json
from urllib.parse import urlparse
from pathlib import Path

# Configuration
BASE_DIR = "cinema_equipment_assets/lighting"
CONCURRENCY_LIMIT = 8
TIMEOUT_SECONDS = 30

# Lighting Equipment URLs from CSV data
LIGHTING_URLS = {
    # DAYLIGHT HMI
    "arri-m-series": "https://www.arri.com/resource/image/179162/landscape_ratio1x0_38/1920/737/67ca2a010b4fa77f8129d59c0a4e5ff2/DB594B8F249D9DB4738D3CD846DC1156/m-series-stage.jpg",
    "arrisun": "https://www.arri.com/resource/image/269004/landscape_ratio1x0_38/1920/737/5342643664c015aaf16dcc539b6babf1/20E50AF76061D37B39A6459861E2C8F6/arri-arrisun-psn-data2.jpg",
    
    # TUNGSTEN
    "arri-fresnel": "https://www.arri.com/resource/image/178532/landscape_ratio1x0_38/1920/737/9abc0a8c3fb59110e6d24c9e910fab4f/17A0DCC72072D62359DEBB1D7F067F67/arri-junior-stage.jpg",
    "true-blue-t1": "https://www.arri.com/resource/image/33178/landscape_ratio1x0_38/1920/737/7df9692b9699b47a591803a3528e084c/E869D365945DAF18E9F733DA558FC2E3/true-blue-t-series-t1-stage.png",
    "arri-blonde": "https://www.goldcoastcamerahire.com.au/wp-content/uploads/2019/01/Arrilite-800-2.jpg",
    "dino-light": "https://www.spottlight-dortmund.de/wp-content/uploads/2020/03/Dino-Light-12kw.png",
    "kupo-par-64": "https://www.lightinglab.com.au/wp-content/uploads/2020/04/3-10-Par-64-Black.png",
    "etc-source-4": "https://megavision.com.au/wp-content/uploads/2022/06/ETC-Source-4-750W-Profile-Spotlight.jpg",
    "dedolight": "https://bollywoodfilmequipments.in/wp-content/uploads/2020/12/1-6.jpg",
    
    # LED
    "creamsource-vortex8": "https://static.bhphoto.com/images/multiple_images/images500x500/1643912107_IMG_1690330.jpg",
    "arri-skypanel": "https://static.bhphoto.com/images/images500x500/1432655173_1139001.jpg",
    "dmg-lumiere-mix": "https://static.bhphoto.com/images/images500x500/1564134460_1492286.jpg",
    "astera": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/astera_fp1_set_set_of_8_titan_1581676051_1541959.jpg",
    "nanlite-forza": "https://cdn-aliyun.nanlite.com/release/1694758773902-815500-1410622625-Forza+300%2B500II.png",
    "aputure-storm-xt52": "https://static.bhphoto.com/images/images500x500/1743508894_1889192.jpg",
    "aputure-electro-storm-cs15": "https://cdn.shopify.com/s/files/1/1343/1935/files/CS15_Meuium_Barndoor-5.png?v=1703557992",
    "aputure-electro-storm-xt26": "https://cdn.shopify.com/s/files/1/1343/1935/files/XT26_Meuium_Barndoor-2.png?v=1710323628",
    "aputure-ls-series": "https://cdn.shopify.com/s/files/1/1343/1935/files/LS1200dPro-2.png?v=1711009429",
    "aputure-mc-pro": "https://cdn.shopify.com/s/files/1/1343/1935/files/MCPro-1.png?v=1696906204",
    "amaran-f21c": "https://static.bhphoto.com/images/multiple_images/images500x500/1648739988_IMG_1725343.jpg",
    "amaran-f22c": "https://static.bhphoto.com/images/images500x500/1750692348_1698323.jpg",
    "litegear-litemat": "https://s.turbifycdn.com/aah/filmandvideolighting/litegear-litemat-led-lighting-film-video-photo-17.jpg",
    
    # LIGHTING ACCESSORIES
    "light-modifiers": "https://lightroom-photoshop-tutorials.com/wp-content/uploads/2021/06/Types-of-Light-Modifiers.webp",
    "butterfly-overhead": "https://us.rosco.com/sites/default/files/content/product/2023-06/butterlies-muslin_molton_camouflage-group1_web_size_0.jpg",
    "reflector-flag-panel": "https://m.media-amazon.com/images/I/51uyaF372FL._AC_SL1500_.jpg",
    "dimmer-systems": "https://www.resolutionhire.tv/wp-content/uploads/2020/01/2K-Dimmer-scaled.jpg",
}

def determine_extension(url, content_type):
    """Intelligently determine file extension from URL or Content-Type."""
    parsed = urlparse(url)
    path_ext = os.path.splitext(parsed.path)[1].lower()
    
    # Remove query string from extension if present
    if '?' in path_ext:
        path_ext = path_ext.split('?')[0]
    
    valid_extensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.tiff', '.bmp']
    if path_ext in valid_extensions:
        return path_ext
    
    if content_type:
        ext = mimetypes.guess_extension(content_type.split(';')[0])
        if ext and ext in valid_extensions:
            return ext
            
    return ".jpg"

async def download_image(session, key, url):
    """Download a single image."""
    os.makedirs(BASE_DIR, exist_ok=True)
    
    try:
        async with session.get(url, timeout=aiohttp.ClientTimeout(total=TIMEOUT_SECONDS)) as response:
            if response.status != 200:
                print(f"❌ Failed: {key} (HTTP {response.status})")
                return False

            content_type = response.headers.get('Content-Type', '')
            ext = determine_extension(url, content_type)
            filename = f"{key}{ext}"
            filepath = os.path.join(BASE_DIR, filename)

            with open(filepath, 'wb') as f:
                while True:
                    chunk = await response.content.read(8192)
                    if not chunk:
                        break
                    f.write(chunk)
            
            file_size = os.path.getsize(filepath) / 1024
            print(f"✅ {filename} ({file_size:.1f} KB)")
            return True

    except asyncio.TimeoutError:
        print(f"⏱️ Timeout: {key}")
        return False
    except Exception as e:
        print(f"⚠️ Error downloading {key}: {str(e)}")
        return False

async def main():
    print(f"💡 Lighting Equipment Image Downloader")
    print(f"📦 Total items: {len(LIGHTING_URLS)}")
    print(f"📁 Saving to: {os.path.abspath(BASE_DIR)}\n")

    if not os.path.exists(BASE_DIR):
        os.makedirs(BASE_DIR)

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://www.bhphotovideo.com/"
    }

    connector = aiohttp.TCPConnector(limit=CONCURRENCY_LIMIT, force_close=True)
    async with aiohttp.ClientSession(headers=headers, connector=connector) as session:
        tasks = []
        for key, url in LIGHTING_URLS.items():
            tasks.append(download_image(session, key, url))
        
        results = await asyncio.gather(*tasks)
        
    success_count = sum(results)
    fail_count = len(results) - success_count
    
    print(f"\n{'='*60}")
    print(f"✨ Download Complete")
    print(f"✅ Successful: {success_count}/{len(LIGHTING_URLS)}")
    print(f"❌ Failed: {fail_count}/{len(LIGHTING_URLS)}")
    print(f"📁 Assets saved to: {os.path.abspath(BASE_DIR)}")
    print(f"{'='*60}")

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    
    asyncio.run(main())
