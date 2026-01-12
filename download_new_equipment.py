import asyncio
import aiohttp
import os
import sys

# Items and their image URLs
ITEMS = [
    # Stabilization
    {"slug": "easyrig-2-600n", "url": "https://www.adorama.com/images/XLarge/easyrig-2-400n-stabilizing-camera-support_erig400_1.webp"},
    {"slug": "easyrig-vario-5", "url": "https://static.bhphoto.com/images/multiple_images/images500x500/1434390382_IMG_505123.jpg"},
    {"slug": "tilta-armor-man-3", "url": "https://static.bhphoto.com/images/multiple_images/images500x500/1434390382_IMG_505123.jpg"},
    {"slug": "tilta-armor-man-2", "url": "https://static.bhphoto.com/images/multiple_images/images500x500/1434390382_IMG_505123.jpg"},
    
    # Batteries
    {"slug": "bebob-v200-micro", "url": "https://static.bhphoto.com/images/images500x500/1600338928_1594107.jpg"},
    {"slug": "bebob-v290rm-cine", "url": "https://static.bhphoto.com/images/images500x500/1527091561_1409408.jpg"},
    {"slug": "bebob-b290cine-kit", "url": "https://static.bhphoto.com/images/images500x500/1720197931_1698235.jpg"},
    {"slug": "swit-pb-r290s", "url": "https://static.bhphoto.com/images/images500x500/1668522319_1734750.jpg"},
    {"slug": "swit-140wh-pocket", "url": "https://static.bhphoto.com/images/images500x500/1655218230_1710560.jpg"},
    {"slug": "idx-duoc198p", "url": "https://static.bhphoto.com/images/images500x500/1649070368_1699540.jpg"}
]

DEST_DIR = "pb_data/new_assets"

async def download_image(session, slug, url):
    try:
        async with session.get(url) as response:
            if response.status == 200:
                ext = ".jpg"
                if "webp" in url: ext = ".webp"
                if "png" in url: ext = ".png"
                
                filename = f"{slug}{ext}"
                filepath = os.path.join(DEST_DIR, filename)
                
                content = await response.read()
                with open(filepath, "wb") as f:
                    f.write(content)
                print(f"✅ Downloaded: {filename}")
            else:
                print(f"❌ Failed {slug}: HTTP {response.status}")
    except Exception as e:
        print(f"❌ Error {slug}: {e}")

async def main():
    if not os.path.exists(DEST_DIR):
        os.makedirs(DEST_DIR)
        
    async with aiohttp.ClientSession() as session:
        tasks = [download_image(session, item["slug"], item["url"]) for item in ITEMS]
        await asyncio.gather(*tasks)

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(main())
