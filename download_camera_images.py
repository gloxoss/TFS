"""
Download camera images from B&H Photo and save them locally.
This script uses requests with proper headers to avoid being blocked.
"""

import os
import requests
import time
from urllib.parse import urlparse

# Create images directory
IMAGES_DIR = os.path.join(os.path.dirname(__file__), "camera_images")
os.makedirs(IMAGES_DIR, exist_ok=True)

# Camera data with image URLs
CAMERAS = [
    {
        "slug": "arri-alexa-35",
        "name": "ARRI Alexa 35",
        "image_url": "https://static.bhphoto.com/images/multiple_images/images500x500/1754407216_IMG_2544984.jpg",
        "gallery_urls": ["https://static.bhphoto.com/images/multiple_images/images500x500/1754407216_IMG_2544977.jpg"]
    },
    {
        "slug": "sony-venice-2-8k",
        "name": "Sony Venice 2 8K",
        "image_url": "https://static.bhphoto.com/images/multiple_images/images500x500/1636969594_IMG_1641924.jpg",
        "gallery_urls": []
    },
    {
        "slug": "arri-alexa-mini-lf",
        "name": "ARRI Alexa Mini LF",
        "image_url": "https://static.bhphoto.com/images/multiple_images/images500x500/1717001182_IMG_2256540.jpg",
        "gallery_urls": ["https://static.bhphoto.com/images/images500x500/1717001118_1829047.jpg"]
    },
    {
        "slug": "arri-alexa-mini",
        "name": "ARRI Alexa Mini",
        "image_url": "https://static.bhphoto.com/images/multiple_images/images500x500/1553767658_IMG_1161265.jpg",
        "gallery_urls": []
    },
    {
        "slug": "arri-amira",
        "name": "ARRI Amira",
        "image_url": "https://static.bhphoto.com/images/multiple_images/images500x500/1513878399_IMG_920926.jpg",
        "gallery_urls": []
    },
    {
        "slug": "panasonic-varicam-lt",
        "name": "Panasonic VariCam LT", 
        "image_url": "https://static.bhphoto.com/images/multiple_images/images500x500/1455802213_IMG_588330.jpg",
        "gallery_urls": []
    },
    {
        "slug": "sony-pxw-fx9",
        "name": "Sony PXW-FX9",
        "image_url": "https://static.bhphoto.com/images/multiple_images/images500x500/1568344558_IMG_1251228.jpg",
        "gallery_urls": []
    },
    {
        "slug": "sony-fx3",
        "name": "Sony FX3",
        "image_url": "https://static.bhphoto.com/images/multiple_images/images500x500/1746725588_IMG_2489166.jpg",
        "gallery_urls": []
    },
    {
        "slug": "sony-f55",
        "name": "Sony F55",
        "image_url": "https://static.bhphoto.com/images/multiple_images/images500x500/1458487193_IMG_604767.jpg",
        "gallery_urls": []
    },
    {
        "slug": "dsmc2-monstro-8k",
        "name": "DSMC2 Monstro 8K",
        "image_url": "https://static.bhphoto.com/images/multiple_images/images500x500/1458487193_IMG_604767.jpg",  # Placeholder
        "gallery_urls": []
    }
]

# Headers to mimic a browser
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://www.bhphotovideo.com/",
}

def download_image(url, filename):
    """Download an image from URL and save it locally."""
    if not url:
        return None
    
    try:
        print(f"  Downloading: {url[:60]}...")
        response = requests.get(url, headers=HEADERS, timeout=30)
        
        if response.status_code == 200:
            filepath = os.path.join(IMAGES_DIR, filename)
            with open(filepath, 'wb') as f:
                f.write(response.content)
            print(f"  ✓ Saved: {filename}")
            return filepath
        else:
            print(f"  ✗ Failed ({response.status_code}): {url}")
            return None
    except Exception as e:
        print(f"  ✗ Error: {e}")
        return None

def main():
    print("=" * 60)
    print("Camera Image Downloader")
    print("=" * 60)
    print(f"Saving to: {IMAGES_DIR}")
    print()
    
    downloaded = 0
    failed = 0
    
    for camera in CAMERAS:
        print(f"\n📷 {camera['name']}")
        
        # Download main image
        main_filename = f"{camera['slug']}.jpg"
        result = download_image(camera['image_url'], main_filename)
        if result:
            downloaded += 1
        else:
            failed += 1
        
        # Download gallery images
        for i, gallery_url in enumerate(camera.get('gallery_urls', [])):
            gallery_filename = f"{camera['slug']}_gallery_{i+1}.jpg"
            result = download_image(gallery_url, gallery_filename)
            if result:
                downloaded += 1
            else:
                failed += 1
        
        # Rate limiting
        time.sleep(0.5)
    
    print()
    print("=" * 60)
    print(f"Done! Downloaded: {downloaded}, Failed: {failed}")
    print(f"Images saved in: {IMAGES_DIR}")
    print("=" * 60)

if __name__ == "__main__":
    main()
