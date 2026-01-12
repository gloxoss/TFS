import os
import requests
import time

SAVE_DIR = "pb_data/lighting_detailed_images"
if not os.path.exists(SAVE_DIR):
    os.makedirs(SAVE_DIR)

items = [
    {"slug": "arri-m18", "url": "https://static.bhphoto.com/images/multiple_images/images500x500/1562148955_IMG_1211145.jpg"},
    {"slug": "arri-m40", "url": "https://www.arri.com/resource/blob/32896/8761a77702c9e0ef5e3479f8c2520fce/m40-gallery-right-data.jpg"},
    {"slug": "arri-m90", "url": "https://www.arri.com/resource/blob/32904/caecf68c1c7bac653c1f233ba5b678da/m90-gallery-back-data.jpg"},
    {"slug": "arrisun-5", "url": "https://www.arri.com/resource/image/269004/landscape_ratio1x0_38/1920/737/5342643664c015aaf16dcc539b6babf1/20E50AF76061D37B39A6459861E2C8F6/arri-arrisun-psn-data2.jpg"},
    {"slug": "arrisun-12", "url": "https://www.arri.com/resource/image/269004/landscape_ratio1x0_38/1920/737/5342643664c015aaf16dcc539b6babf1/20E50AF76061D37B39A6459861E2C8F6/arri-arrisun-psn-data2.jpg"},
    {"slug": "arrisun-40-25", "url": "https://www.arri.com/resource/image/269004/landscape_ratio1x0_38/1920/737/5342643664c015aaf16dcc539b6babf1/20E50AF76061D37B39A6459861E2C8F6/arri-arrisun-psn-data2.jpg"},
    {"slug": "arrisun-60", "url": "https://www.arri.com/resource/image/269004/landscape_ratio1x0_38/1920/737/5342643664c015aaf16dcc539b6babf1/20E50AF76061D37B39A6459861E2C8F6/arri-arrisun-psn-data2.jpg"},
    {"slug": "arrisun-120", "url": "https://www.arri.com/resource/image/269004/landscape_ratio1x0_38/1920/737/5342643664c015aaf16dcc539b6babf1/20E50AF76061D37B39A6459861E2C8F6/arri-arrisun-psn-data2.jpg"},
    {"slug": "bron-kobold-dw200", "url": "https://static.bhphoto.com/images/images500x500/1574789783_561478.jpg"},
    {"slug": "bron-kobold-dw400", "url": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/Bron_Kobold_332_0145_DW400_400_Watt_HMI_1241016409_615590.jpg"},
    {"slug": "bron-kobold-dw800", "url": "https://static.bhphoto.com/images/images500x500/1233195638_561593.jpg"},
    {"slug": "arri-junior-150", "url": "https://www.arri.com/resource/image/32996/landscape_ratio1x0_38/1920/737/888de7382a202c783d9087e4783250bf/30A4873357CDD137981F9E76FB52E72C/arri-fresnel-150-plus.png"},
    {"slug": "arri-junior-300", "url": "https://www.arri.com/resource/image/32998/landscape_ratio1x0_38/1920/737/5cda24f897c64df9dd68afd45fa9d79f/3913610CD9671146DC8BD4EF59EABDCA/arri-fresnel-300-plus-stage.png"},
    {"slug": "arri-junior-650", "url": "https://www.arri.com/resource/image/33000/landscape_ratio1x0_38/1920/737/c5b2f072998ebf2101a8f16f3eef94ef/B58966F468C65BD30CAB20CA72E38FC8/arri-fresnel-650-plus.png"},
    {"slug": "arri-true-blue-t1", "url": "https://www.arri.com/resource/image/33178/landscape_ratio1x0_38/1920/737/7df9692b9699b47a591803a3528e084c/E869D365945DAF18E9F733DA558FC2E3/true-blue-t-series-t1-stage.png"},
    {"slug": "arrilite-800", "url": "https://www.goldcoastcamerahire.com.au/wp-content/uploads/2019/01/Arrilite-800-2.jpg"},
    {"slug": "arri-blonde-2000", "url": "https://www.puzzlevideo.fr/wp-content/uploads/2021/01/tungsten.png"},
    {"slug": "dino-light-9k", "url": "https://cineplanet.tv/wp-content/uploads/2023/11/1002346.00-1536x1152.jpg"},
    {"slug": "dino-light-12k", "url": "https://cineplanet.tv/wp-content/uploads/2023/11/1002345.00.jpg"},
    {"slug": "dino-light-24k", "url": "https://cinelightshop.com/7953-superlarge_default_2x/maxi-brute-twenty-four-light-24000-watts.jpg"},
    {"slug": "par-64-can", "url": "https://www.lightinglab.com.au/wp-content/uploads/2020/04/3-10-Par-64-Black.png"},
    {"slug": "etc-source-4", "url": "https://megavision.com.au/wp-content/uploads/2022/06/ETC-Source-4-750W-Profile-Spotlight.jpg"},
    {"slug": "dedolight-dlh4", "url": "https://bollywoodfilmequipments.in/wp-content/uploads/2020/12/1-6.jpg"},
    {"slug": "dedolight-dlh2", "url": "https://rent.loca-images.com/cdn/shop/products/has_627e816bc1c45714.jpg?v=1687425571&width=800"},
    {"slug": "creamsource-vortex8", "url": "https://static.bhphoto.com/images/multiple_images/images500x500/1643912107_IMG_1690330.jpg"},
    {"slug": "arri-skypanel-s60c", "url": "https://static.bhphoto.com/images/images500x500/1432655173_1139001.jpg"},
    {"slug": "arri-skypanel-s30c", "url": "https://static.bhphoto.com/images/images500x500/1568299854_1166185.jpg"},
    {"slug": "dmg-mini-mix", "url": "https://static.bhphoto.com/images/images500x500/1564134460_1492286.jpg"},
    {"slug": "dmg-sl1-mix", "url": "https://static.bhphoto.com/images/images500x500/1553262310_1463102.jpg"},
    {"slug": "dmg-maxi-mix", "url": "https://static.bhphoto.com/images/images500x500/1578328552_1524613.jpg"},
    {"slug": "astera-titan-fp1", "url": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/astera_fp1_set_set_of_8_titan_1581676051_1541959.jpg"},
    {"slug": "astera-ax1", "url": "https://media.astera-led.com/wp-content/uploads/astera-ax1-kit-pixeltube-1200x1200.png"},
    {"slug": "astera-ax2", "url": "https://photocinerent.com/storage/3008/conversions/IMG_0212-slide.jpg"},
    {"slug": "astera-ax3", "url": "https://media.astera-led.com/wp-content/uploads/astera-ax3-crmx-kit-ax3-lightdrop-1200x1200.png"},
    {"slug": "astera-ax5", "url": "https://photocinerent.com/storage/2735/conversions/Astera_AX5_01-QWPO-slide.jpg"},
    {"slug": "astera-ax10", "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmcxAL5sIwJ3whMA5T753bYXcIigFRa37UDA&s"},
    {"slug": "astera-lunabulb", "url": "https://static.bhphoto.com/images/images500x500/1718010615_1834164.jpg"},
    {"slug": "nanlite-forza-60b", "url": "https://static.bhphoto.com/images/images500x500/1673336808_1736656.jpg"},
    {"slug": "nanlite-forza-300", "url": "https://www.avbroadcast.fr/media/catalog/product/cache/1/image/933x/602f0fa2c1f0d1ba5e241f914e856ff9/n/a/nanlite-forza-300/Forza-300-Projecteur-LED-COB-300-W-5600-K-Nanlite-31.jpg"},
    {"slug": "nanlite-forza-300b", "url": "https://s3-ap-southeast-1.amazonaws.com/altech-prod/uploads/public/640/195/26a/64019526a37e7837538936.jpg"},
    {"slug": "nanlite-forza-500", "url": "https://www.hightechstore.ma/wp-content/uploads/2021/11/NANLITE-Forza-500-2Kit-3.jpg"},
    {"slug": "nanlite-forza-500b-ii", "url": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/nanlite_forza500bii_forza_500b_ii_led_1673336808_1736660.jpg"},
    {"slug": "aputure-xt52", "url": "https://static.bhphoto.com/images/images500x500/1743508894_1889192.jpg"},
    {"slug": "aputure-cs15", "url": "https://cdn.shopify.com/s/files/1/1343/1935/files/CS15_Meuium_Barndoor-5.png?v=1703557992"},
    {"slug": "aputure-xt26", "url": "https://cdn.shopify.com/s/files/1/1343/1935/files/XT26_Meuium_Barndoor-2.png?v=1710323628&width=1000&crop=center"},
    {"slug": "aputure-1200d-pro", "url": "https://www.camerahire.com.au/images/hire/aputure-1200d-lightstorm-led-light.jpeg"},
    {"slug": "aputure-600c-pro-ii", "url": "https://static.bhphoto.com/images/images500x500/1717501568_1828005.jpg"},
    {"slug": "aputure-600c-pro", "url": "https://www.tsf.fr/wp-content/uploads/2022/12/LS_600c_pro-1024x1024.jpg"},
    {"slug": "aputure-600x-pro", "url": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/aputure_als600xprovus_ls_600x_pro_lamp_1628606136_1657955.jpg"},
    {"slug": "aputure-600d-pro", "url": "https://www.bhphotovideo.com/images/fb/nanlite_forza500bii_forza_500b_ii_led_1736660.jpg"},
    {"slug": "amaran-300c", "url": "https://kamerty.ma/wp-content/uploads/2024/06/Amaran-300c-Projecteur-LED-prix-maroc-kamerty-1.jpg"},
    {"slug": "aputure-300d-ii", "url": "https://yahyaouishop.com/wp-content/uploads/2023/10/APUTURE-LS-C300D-II-1.jpg"},
    {"slug": "aputure-60x", "url": "https://www.panavision.com/images/default-source/product-images/panalux/heads/hpp6zai_aputure_ls-60x/px_heads_led_aputure_light-storm-60x_01-1500x999-0bfec42.jpg?sfvrsn=23b2fc2e_1"},
    {"slug": "aputure-mc-pro", "url": "https://cdn.shopify.com/s/files/1/1343/1935/files/MCPro-1.png?v=1696906204&width=1000&crop=center"},
    {"slug": "amaran-f21c", "url": "https://static.bhphoto.com/images/multiple_images/images500x500/1648739988_IMG_1725343.jpg"},
    {"slug": "amaran-f22c", "url": "https://static.bhphoto.com/images/images500x500/1750692348_1698323.jpg"},
    {"slug": "litemat-2", "url": "https://www.litegear.com/wp-content/uploads/2019/06/S2-2BACK.png"},
    {"slug": "litemat-2l", "url": "https://www.tsf.fr/wp-content/uploads/2017/10/LiteMat_2L.png"},
    {"slug": "litemat-4", "url": "https://photocinerent.com/storage/2663/conversions/Litegear-Litemat-Plu-DCP2-slide.jpg"},
    {"slug": "kinoflo-4ft-4bank", "url": "https://www.visualsfrance.com/location/1189-large_default/kino-4120.jpg"},
    {"slug": "kinoflo-2ft-4bank", "url": "https://www.visualsfrance.com/location/1190-large_default/bank-460.jpg"},
    {"slug": "swit-s2620", "url": "https://www.visualsfrance.com/2187-large_default/s-2620.jpg"},
    {"slug": "swit-s2610", "url": "https://www.visualsfrance.com/2188-medium_default/s-2610.jpg"},
    {"slug": "falconeyes-c100bl", "url": "https://m.media-amazon.com/images/I/61ERWHDKH0L._AC_SX522_.jpg"}
]

session = requests.Session()
session.headers.update({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Referer': 'https://www.bhphotovideo.com/'
})

print(f"Downloading {len(items)} images for detailed lighting...")

for item in items:
    url = item['url']
    slug = item['slug']
    
    # B&H rewrite logic
    if 'bhphotovideo.com' in url and 'cdn-cgi' in url:
        try:
            filename = url.split('images500x500/')[-1]
            if not filename: raise Exception("No filename")
            new_url = f"https://static.bhphoto.com/images/images500x500/{filename}"
            print(f"🔄 Rewriting B&H URL for {slug}")
            url = new_url
        except:
            pass

    clean_url = url.split('?')[0]
    ext = clean_url.split('.')[-1].lower()
    if len(ext) > 4 or '/' in ext or not ext: ext = 'jpg'
    
    filepath = os.path.join(SAVE_DIR, f"{slug}.{ext}")
    
    if os.path.exists(filepath):
        print(f"Skipping {slug}, exists.")
        continue

    try:
        print(f"Downloading {slug} from {url}...")
        res = session.get(url, timeout=20)
        if res.status_code == 200:
            with open(filepath, 'wb') as f:
                f.write(res.content)
            print(f"✅ Saved {slug}")
        else:
            print(f"❌ Failed {slug}: {res.status_code}")
    except Exception as e:
        print(f"❌ Error {slug}: {e}")
    
    time.sleep(1)

print("Done!")
