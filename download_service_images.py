import asyncio
import aiohttp
import os
import sys

# Configuration
BASE_DIR = "web/public/images/services"
CONCURRENCY_LIMIT = 3

# Curated high-quality images for each TFS service
SERVICE_IMAGES = {
    # Equipment Hire
    "equipment/camera-rental.jpg": "https://images.unsplash.com/photo-1616469829581-73993eb86b02?w=1920&q=80",
    "equipment/tech-support.jpg": "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1920&q=80",
    
    # Film Shipping
    "shipping/customs-clearance.jpg": "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1920&q=80",
    "shipping/cargo-logistics.jpg": "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=1920&q=80",
    
    # Film Permits
    "permits/ccm-authorization.jpg": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1920&q=80",
    "permits/location-access.jpg": "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=1920&q=80",
    
    # Crewing
    "crewing/professional-crew.jpg": "https://images.unsplash.com/photo-1533928298208-27ff66555d8d?w=1920&q=80",
    "crewing/multilingual-team.jpg": "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1920&q=80",
    
    # Scouting
    "scouting/morocco-desert.jpg": "https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=1920&q=80",
    "scouting/atlas-mountains.jpg": "https://images.unsplash.com/photo-1517821099606-cef63a9bcda6?w=1920&q=80",
    
    # Catering
    "catering/gourmet-dining.jpg": "https://images.unsplash.com/photo-1555244162-803834f70033?w=1920&q=80",
    "catering/flexible-service.jpg": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80",
    
    # Accommodation
    "accommodation/luxury-hotel.jpg": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&q=80",
    "accommodation/moroccan-riad.jpg": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&q=80",
    
    # Transportation
    "transportation/production-fleet.jpg": "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1920&q=80",
    "transportation/desert-4x4.jpg": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1920&q=80",
    
    # Casting
    "casting/diverse-talent.jpg": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80",
    "casting/audition-studio.jpg": "https://images.unsplash.com/photo-1576267423048-15c0040fec78?w=1920&q=80",
}

async def download_image(session, path, url):
    """Download a single image."""
    full_path = os.path.join(BASE_DIR, path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    
    try:
        async with session.get(url, timeout=aiohttp.ClientTimeout(total=30)) as response:
            if response.status == 200:
                with open(full_path, 'wb') as f:
                    while True:
                        chunk = await response.content.read(8192)
                        if not chunk:
                            break
                        f.write(chunk)
                size = os.path.getsize(full_path) / 1024
                print(f"✅ {path} ({size:.1f} KB)")
                return True
            else:
                print(f"❌ {path} (HTTP {response.status})")
                return False
    except Exception as e:
        print(f"⚠️ {path}: {str(e)}")
        return False

async def main():
    print("🎬 TFS Service Images Downloader")
    print(f"📦 Total images: {len(SERVICE_IMAGES)}\n")

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }
    
    connector = aiohttp.TCPConnector(limit=CONCURRENCY_LIMIT)
    async with aiohttp.ClientSession(headers=headers, connector=connector) as session:
        tasks = [download_image(session, path, url) for path, url in SERVICE_IMAGES.items()]
        results = await asyncio.gather(*tasks)
    
    success = sum(results)
    print(f"\n{'='*50}")
    print(f"✅ Downloaded: {success}/{len(SERVICE_IMAGES)}")
    print(f"📁 Saved to: {os.path.abspath(BASE_DIR)}")

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(main())
