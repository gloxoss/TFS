import asyncio
import aiohttp
import mimetypes
import os
import sys
import json
from urllib.parse import urlparse
from pathlib import Path

# Configuration
BASE_DIR = "cinema_equipment_assets"
CONCURRENCY_LIMIT = 8
TIMEOUT_SECONDS = 30

# Category-based folder structure
CATEGORIES = {
    "cameras": ["sony-venice", "arri-alexa", "red-dsmc2", "sony-pxw", "sony-fx3", "panasonic-varicam", "sony-pmw"],
    "lenses": ["cooke-s4i", "arri-zeiss", "atlas-orion", "zeiss-supreme", "zeiss-compact", "zeiss-standard", "arri-macro", "zeiss-master-macro", "servicevision-scorpion"],
    "zoom_lenses": ["arri-95", "arri-alura", "fujinon-cabrio", "canon-cn-e", "canon-cine-servo", "angenieux-optimo", "zeiss-cz2", "tokina-11", "sigma-50"],
    "lens_control": ["arri-hi-5", "arri-wcu", "tilta-nucleus", "arri-sxu", "teradek-rt", "teradek-ctrl", "cmotion-compact", "arri-ff", "chrosziel-dv"],
    "support": ["oconnor", "sachtler", "cartoni", "arrihead"],
    "matte_boxes": ["arri-lmb", "arri-mmb", "arri-mb", "chrosziel-450"],
    "monitors": ["smallhd", "sony-pvm", "sony-bvm", "tvlogic", "marshall-v", "arri-transvideo", "blackmagic-video", "atomos", "video-devices"],
    "wireless_video": ["teradek-bolt", "teradek-ranger", "swit-cw", "hollyland-mars"],
    "stabilization": ["dji-ronin", "dji-rs", "dji-force", "zhiyun-crane"],
    "power": ["bebob-cube", "ecoflow-delta", "mobile-film-generator", "power-distribution", "professional-inline"],
    "lighting": ["arri-m-series", "arri-arrisun", "arri-junior", "arri-true-blue", "arri-redhead", "dino-light", "kupo-par", "etc-source", "dedolight", "creamsource", "arri-skypanel", "dmg-lumire", "astera-titan", "nanlite-forza", "aputure", "amaran-f21c", "litegear"],
    "grip": ["professional-light-modifier", "butterfly", "professional-grip-stand"],
    "filters": ["tiffen", "schneider"]
}

def categorize_item(key):
    """Determine which category folder an item belongs to."""
    key_lower = key.lower()
    for category, patterns in CATEGORIES.items():
        for pattern in patterns:
            if pattern in key_lower:
                return category
    return "misc"

def determine_extension(url, content_type):
    """Intelligently determine file extension from URL or Content-Type."""
    parsed = urlparse(url)
    path_ext = os.path.splitext(parsed.path)[1].lower()
    
    valid_extensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.tiff', '.bmp']
    if path_ext in valid_extensions:
        return path_ext
    
    if content_type:
        ext = mimetypes.guess_extension(content_type.split(';')[0])
        if ext and ext in valid_extensions:
            return ext
            
    return ".jpg"

async def download_image(session, key, url, category):
    """Download a single image with category-based organization."""
    category_dir = os.path.join(BASE_DIR, category)
    os.makedirs(category_dir, exist_ok=True)
    
    try:
        async with session.get(url, timeout=aiohttp.ClientTimeout(total=TIMEOUT_SECONDS)) as response:
            if response.status != 200:
                print(f"❌ [{category}] Failed: {key} (HTTP {response.status})")
                return False

            content_type = response.headers.get('Content-Type', '')
            ext = determine_extension(url, content_type)
            filename = f"{key}{ext}"
            filepath = os.path.join(category_dir, filename)

            with open(filepath, 'wb') as f:
                while True:
                    chunk = await response.content.read(8192)
                    if not chunk:
                        break
                    f.write(chunk)
            
            file_size = os.path.getsize(filepath) / 1024
            print(f"✅ [{category}] {filename} ({file_size:.1f} KB)")
            return True

    except asyncio.TimeoutError:
        print(f"⏱️ [{category}] Timeout: {key}")
        return False
    except Exception as e:
        print(f"⚠️ [{category}] Error downloading {key}: {str(e)}")
        return False

async def main():
    # Load URLs from JSON
    json_path = 'cinema_equipment_urls.json'
    if not os.path.exists(json_path):
        print(f"❌ Error: {json_path} not found!")
        print("Please ensure cinema_equipment_urls.json is in the same directory.")
        return
    
    with open(json_path, 'r') as f:
        equipment_data = json.load(f)

    print(f"🎬 Cinema Equipment Asset Downloader")
    print(f"📦 Total items: {len(equipment_data)}")
    print(f"🗂️ Organizing into {len(CATEGORIES)} categories\n")

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
        for key, url in equipment_data.items():
            category = categorize_item(key)
            tasks.append(download_image(session, key, url, category))
        
        results = await asyncio.gather(*tasks)
        
    success_count = sum(results)
    fail_count = len(results) - success_count
    
    print(f"\n{'='*60}")
    print(f"✨ Download Complete")
    print(f"✅ Successful: {success_count}/{len(equipment_data)}")
    print(f"❌ Failed: {fail_count}/{len(equipment_data)}")
    print(f"📁 Assets saved to: {os.path.abspath(BASE_DIR)}")
    print(f"{'='*60}")

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    
    asyncio.run(main())
