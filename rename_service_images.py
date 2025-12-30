"""
Rename service images to clean, mappable names and output the final mapping
"""
import os
import shutil

BASE_PATH = "web/public/images/services"

# Mapping: old filename -> new filename (within each folder)
RENAMES = {
    # Equipment
    "equipment/camera-gear-selection.webp": "equipment/hero.webp",
    "equipment/fuar-video-ve-fotoraf-ekimi-2.jpg": "equipment/tech-support.jpg",
    
    # Shipping  
    "shipping/2025-10-21-04-39-21-481-68f70e79a145dcbe5450cc75.jpg": "shipping/hero.jpg",
    "shipping/lojistik-tasimacilik.jpg": "shipping/logistics.jpg",
    "shipping/transportation-porto-topbanner.jpg": "shipping/cargo-port.jpg",
    
    # Permits
    "permits/GettyImages-1069764660-168a0ce38c5248e2bc9515fe62471e9e.jpg": "permits/hero.jpg",
    "permits/SoL-Cover-Image-1-1.png": "permits/documentation.png",
    "permits/رواد-الاعمال-ادارة-المشاريع-عميل-واحد.jpg": "permits/government-liaison.jpg",
    
    # Crewing
    "crewing/527188b1ea.jpg": "crewing/hero.jpg",
    "crewing/IZDyS5KQc0J6SzPtAr33rOEGxFfpx2IfW4Lrim-ulW37q--OurxlcVugVguT3QWzRr2Gmduc_hfVaJoTNhiswWTU-lzeyWQbbxggqRWxou_5S8EW4tBzVmq43uRKlK4S04DSobryOiAO609fzIh13gfIxu2FyJpvpFr.jpg": "crewing/professional-crew.jpg",
    "crewing/IZDyS5KQc0J6SzPtAr33rOEGxFfpx2IfW4Lrim-ulW3xrvWAs_w9NwC-CFHCgk-uFrqBntya-gHXOpwUNkqvkHzRrgWJ3DEUN05s_E7mqvKtSsMPtcF5BFPXrJcn-thyqr_EsILSFhskwSh76qtT4Enp09HFz6BDv1.webp": "crewing/multilingual-team.webp",
    
    # Scouting
    "scouting/2cdd90b920e90f3c0490dd69da71db96.jpg": "scouting/hero.jpg",
    "scouting/chefchaouen-plus-bel-endroit-maroc-1920x560.webp": "scouting/morocco-locations.webp",
    "scouting/shutterstock2555172071.avif": "scouting/desert-landscape.avif",
    
    # Catering
    "catering/orig.jpg": "catering/hero.jpg",
    
    # Transportation
    "transportation/LOJİSTİK-3-scaled.jpg": "transportation/hero.jpg",
    "transportation/_log_.jpg": "transportation/logistics-fleet.jpg",
    "transportation/shutterstock_1015410481.jpg": "transportation/vehicle-fleet.jpg",
    
    # Casting
    "casting/GettyImages-928149350-5c3db18d46e0fb0001638db7.jpg": "casting/hero.jpg",
    "casting/Guide-to-Casting-Auditions-StudioBinder-2048x1152.jpg": "casting/auditions.jpg",
    "casting/a1de1c158ea2-2400x1600.jpeg": "casting/talent-pool.jpeg",
    "casting/o3mM2IvCoPbONbVjLJFC33Y4dJM7xE9MiS2LZTy1-iBYyJ3MsgPBrEQMYDbUxvV9AGNZ8yQTPz9CTGzgazgJxsGhxTyy833f5_x-oGYK8d4wstRRwLbI6MNRoBfCxJDl.avif": "casting/professional-casting.avif",
}

def main():
    print("🖼️ TFS Service Image Renamer\n")
    
    renamed = 0
    skipped = 0
    
    for old_rel, new_rel in RENAMES.items():
        old_path = os.path.join(BASE_PATH, old_rel)
        new_path = os.path.join(BASE_PATH, new_rel)
        
        if os.path.exists(old_path):
            shutil.move(old_path, new_path)
            print(f"✅ {old_rel} → {new_rel}")
            renamed += 1
        else:
            print(f"⏭️ Not found: {old_rel}")
            skipped += 1
    
    print(f"\n{'='*50}")
    print(f"✅ Renamed: {renamed}")
    print(f"⏭️ Skipped: {skipped}")
    
    # List final structure
    print(f"\n📁 Final Image Structure:")
    for folder in sorted(os.listdir(BASE_PATH)):
        folder_path = os.path.join(BASE_PATH, folder)
        if os.path.isdir(folder_path):
            files = os.listdir(folder_path)
            print(f"\n  {folder}/")
            for f in sorted(files):
                print(f"    - {f}")

if __name__ == "__main__":
    main()
