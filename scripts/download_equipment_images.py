"""
TFS Equipment Image Downloader

Downloads product images from URLs in the inventory JSON and saves them locally.
Images are organized in a flat structure with product slug as filename.

Usage:
    python download_equipment_images.py
"""

import json
import os
import re
import time
import urllib.request
from pathlib import Path
from urllib.parse import urlparse

# Configuration
SCRIPT_DIR = Path(__file__).parent
JSON_FILE = SCRIPT_DIR / "inventory_data.json"
OUTPUT_DIR = SCRIPT_DIR.parent / "web" / "public" / "images" / "equipment"

# Headers to avoid 403 errors from B&H Photo etc.
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}


def slugify(text: str) -> str:
    """Convert text to URL-friendly slug."""
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    return text


def get_extension(url: str, content_type: str = None) -> str:
    """Determine file extension from URL or content type."""
    # Try URL path first
    path = urlparse(url).path
    if '.' in path:
        ext = path.rsplit('.', 1)[-1].lower()
        if ext in ['jpg', 'jpeg', 'png', 'webp', 'gif']:
            return ext if ext != 'jpeg' else 'jpg'
    
    # Try content type
    if content_type:
        if 'jpeg' in content_type or 'jpg' in content_type:
            return 'jpg'
        elif 'png' in content_type:
            return 'png'
        elif 'webp' in content_type:
            return 'webp'
        elif 'gif' in content_type:
            return 'gif'
    
    return 'jpg'  # Default


def download_image(url: str, output_path: Path) -> bool:
    """Download an image from URL to local path."""
    try:
        request = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(request, timeout=30) as response:
            content_type = response.headers.get('Content-Type', '')
            data = response.read()
            
            # Determine extension
            ext = get_extension(url, content_type)
            final_path = output_path.with_suffix(f'.{ext}')
            
            # Write file
            with open(final_path, 'wb') as f:
                f.write(data)
            
            print(f"  ✓ Downloaded: {final_path.name} ({len(data) / 1024:.1f} KB)")
            return True
            
    except Exception as e:
        print(f"  ✗ Failed: {url[:60]}... - {str(e)[:50]}")
        return False


def main():
    """Main function to download all equipment images."""
    print("=" * 60)
    print("TFS Equipment Image Downloader")
    print("=" * 60)
    
    # Load JSON
    if not JSON_FILE.exists():
        print(f"Error: JSON file not found: {JSON_FILE}")
        return
    
    with open(JSON_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    equipment = data.get('collections', {}).get('equipment', [])
    print(f"Found {len(equipment)} equipment items\n")
    
    # Create output directory
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    print(f"Output directory: {OUTPUT_DIR}\n")
    
    # Download images
    success_count = 0
    fail_count = 0
    image_map = {}  # Maps product ID to local image path
    
    for item in equipment:
        item_id = item.get('id', '')
        name = item.get('name', 'unknown')
        images = item.get('images', [])
        
        if not images:
            print(f"[{item_id}] {name} - No images")
            continue
        
        print(f"[{item_id}] {name}")
        
        # Download first image (primary)
        slug = slugify(name)
        output_path = OUTPUT_DIR / slug
        
        url = images[0]
        if download_image(url, output_path):
            success_count += 1
            # Find the actual file that was saved
            for ext in ['jpg', 'png', 'webp', 'gif']:
                check_path = output_path.with_suffix(f'.{ext}')
                if check_path.exists():
                    image_map[item_id] = f"/images/equipment/{check_path.name}"
                    break
        else:
            fail_count += 1
        
        # Small delay to be polite to servers
        time.sleep(0.3)
    
    # Summary
    print("\n" + "=" * 60)
    print(f"Download complete: {success_count} success, {fail_count} failed")
    print("=" * 60)
    
    # Save image map for migration reference
    map_file = SCRIPT_DIR / "image_map.json"
    with open(map_file, 'w', encoding='utf-8') as f:
        json.dump(image_map, f, indent=2)
    print(f"\nImage map saved to: {map_file}")


if __name__ == '__main__':
    main()
