import os
import requests
import time

# Directory to save images
SAVE_DIR = "pb_data/accessory_images"
if not os.path.exists(SAVE_DIR):
    os.makedirs(SAVE_DIR)

# List of accessories and their image URLs
accessories = [
    {"slug": "arri-hi-5-wireless-set", "url": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/arri_kk_0041793_hi_5_rx_tx_2400_set_1655120170_1710021.jpg"},
    {"slug": "arri-wcu-4", "url": "https://static.bhphoto.com/images/multiple_images/images500x500/1486487704_IMG_749127.jpg"},
    {"slug": "arri-sxu-1", "url": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/arri_k2_0000071_sxu_1_single_axis_unit_1486549411_1287348.jpg"},
    {"slug": "teradek-rt-fiz", "url": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/teradek_15_0056_rt_fiz_wireless_lens_1726150825_1848823.jpg"},
    {"slug": "teradek-ctrl-3", "url": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/teradek_15_0047_i_rt_ctrl_3_wireless_lens_1557400011_1473056.jpg"},
    {"slug": "cmotion-compact-one", "url": "https://videoking.eu/wp-content/uploads/2022/10/compact-ONE-set-E.jpg"},
    {"slug": "tilta-nucleus-m", "url": "https://static.bhphoto.com/images/multiple_images/images500x500/1526318171_IMG_988009.jpg"},
    {"slug": "arri-ff-5-cine", "url": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/arri_kk_0005758_follow_focus_ff_5_cine_1478778337_1288927.jpg"},
    {"slug": "arri-ff-4", "url": "https://static.bhphoto.com/images/images500x500/1478779549_1288924.jpg"},
    {"slug": "arri-ff-3", "url": "https://tv-team.no/cdn/shop/files/arri-ff3-1x1-1.png?v=1688412622"},
    {"slug": "chrosziel-dv-studio", "url": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/chrosziel_c_206_60skit_dv_studio_rig_follow_1427280621_1131821.jpg"},
    {"slug": "oconnor-2575d", "url": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/oconnor_c1234_0005_ultimate_2575d_fluid_head_1466607922_1232548.jpg"},
    {"slug": "oconnor-2560", "url": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/oconnor_c1260_0001_ultimate_2560_fluid_head_1434101716_1157454.jpg"},
    {"slug": "cartoni-master-mk2", "url": "https://www.cartoni.com/wp-content/uploads/ProductImages/FluidHeads/Cartoni_FluidHeads_H541_MasterMK2.jpg"},
    {"slug": "cartoni-maxima-30", "url": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/cartoni_hm3100_maxima_30_head_1499187934_1324640.jpg"},
    {"slug": "sachtler-video-30-ii", "url": "https://www.trm.fr/wp-content/uploads/2024/02/SAC_3007_Cine-30-fluid-head_02-600x600-c.jpg"},
    {"slug": "sachtler-system-25", "url": "https://static.bhphoto.com/images/multiple_images/images500x500/1668707156_IMG_1876954.jpg"},
    {"slug": "arrihead-2", "url": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/arri_k2_43670_0_arrihead_2_production_tripod_1478794858_1288722.jpg"},
    {"slug": "cooke-s4i-set", "url": "https://res.cloudinary.com/offshoot/q_50,w_1920,c_limit,f_auto/REIS/products/5fb741a435394a631fe5a51f/cooke_mini_s4_i_lens_set_alt_2"},
    {"slug": "arri-zeiss-master-anamorphic", "url": "https://cinevo.com/wp-content/uploads/2022/08/ARRI-Zeiss-Master-Anamorphic-Set-a.jpg"},
    {"slug": "arri-signature-primes", "url": "https://images.squarespace-cdn.com/content/v1/5e72aea433a7b935087f9d5d/5b69e981-9bea-4ff0-bf2d-ddfaa2152c5a/Screenshot+2024-06-02+at+1.17.06%E2%80%AFPM.jpg?format=1000w"},
    {"slug": "zeiss-supreme-primes", "url": "https://cinevo.com/wp-content/uploads/2023/01/cnv-arri-supreme-primes-a-980x652.jpg"},
    {"slug": "arri-zeiss-master-primes", "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsKM9wNQwbX7kJIuSdy2K69ysSMwtJmeDWZQ&s"},
    {"slug": "zeiss-super-speed-mk3", "url": "https://www.fomorentals.co.uk/img/containers/assets/Zeiss-Super-Speeds.png/2a7a8c282cb7b4f4161f9653311013fe.webp"},
    {"slug": "zeiss-cp3-set", "url": "https://vmi.tv/wp-content/uploads/sites/3/2023/04/Zeiss-CP3-Set.jpg"},
    {"slug": "zeiss-ultra-primes", "url": "https://images.squarespace-cdn.com/content/v1/5e72aea433a7b935087f9d5d/83d842be-acd1-48e0-8b2d-be1e11120327/Screen+Shot+2023-02-15+at+9.08.34+AM.jpg"},
    {"slug": "atlas-orion-anamorphic", "url": "https://res.cloudinary.com/offshoot/q_70,w_3840,c_limit,f_auto/REIS/products/5fba0435a9eb364eeb7b54c1/atlas_orion_2x_anamorphic_a_set_hr_3"},
    {"slug": "arri-macro-primes", "url": "https://static.madedaily.com/managed_images/a4fee251-1a0e-4276-b95d-716d2d3536ad/35617/ARRI-Macro-100mm-T2_C.jpg"},
]

# Create a session to maintain cookies/headers
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

print(f"Downloading {len(accessories)} images...")

for item in accessories:
    url = item['url']
    slug = item['slug']
    
    # URL Rewriting for B&H to bypass Cloudflare/403
    # Pattern: .../cdn-cgi/.../https://www.bhphotovideo.com/images/...
    if 'bhphotovideo.com' in url and 'cdn-cgi' in url:
        # Extract the filename part
        # Expected format: .../images/images500x500/FILENAME
        try:
            filename_part = url.split('images500x500/')[-1]
            # rewritten_url = f"https://static.bhphoto.com/images/images500x500/{filename_part}"
            # Actually, let's try just the raw inner URL but with static domain if possible
            # But the inner URL usually is www.bhphotovideo.com/images/images500x500/...
            # Let's try converting www -> static
            
            # Simple heuristic: try to find the image ID/name.
            # Let's try to construct a static URL.
            new_url = f"https://static.bhphoto.com/images/images500x500/{filename_part}"
            print(f"🔄 Rewriting B&H URL for {slug}: \n  Old: {url}\n  New: {new_url}")
            url = new_url
        except:
            pass
            
    # Try to guess extension from URL
    clean_url = url.split('?')[0]
    ext = clean_url.split('.')[-1]
    if len(ext) > 4 or '/' in ext: # Fallback if extension parsing fails
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
            
            # Fallback: try original URL if rewrite failed (or vice versa? No, original failed 403)
            if 'static.bhphoto.com' in url:
                 # Maybe the rewrite was wrong?
                 pass

    except Exception as e:
        print(f"❌ Error downloading {slug}: {e}")
    
    time.sleep(2)

print("Done!")
