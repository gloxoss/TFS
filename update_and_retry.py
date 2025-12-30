import json
import os
import asyncio
import aiohttp
import ssl
from download_lenses import download_image, categorize_item, BASE_DIR

async def main():
    # 1. Load original data
    with open('cinema_equipment_urls.json', 'r') as f:
        data = json.load(f)

    # 2. Load fixes
    if os.path.exists('fix_failures.json'):
        with open('fix_failures.json', 'r') as f:
            fixes = json.load(f)
            data.update(fixes)
            print(f"🔧 Applied {len(fixes)} URL fixes.")
    else:
        print("⚠️ fix_failures.json not found.")
        return

    # 3. Save updated list
    with open('cinema_equipment_urls.json', 'w') as f:
        json.dump(data, f, indent=2)

    # 4. Retry Downloads with relaxed SSL
    print("\n🔄 Retrying downloads...")
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    }

    # Create an SSL context that ignores certificate errors
    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE

    connector = aiohttp.TCPConnector(limit=5, ssl=ssl_context)
    async with aiohttp.ClientSession(headers=headers, connector=connector) as session:
        tasks = []
        for key, url in fixes.items():
            category = categorize_item(key)
            tasks.append(download_image(session, key, url, category))
        
        await asyncio.gather(*tasks)

if __name__ == "__main__":
    if os.name == 'nt':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(main())
