/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
    // ==========================================
    // 0. DATA
    // ==========================================
    const DATA = {
        "taxonomies": {
            "categories": [
                "Cameras", "Lenses", "Lens Control", "Support", "Matte Boxes",
                "Monitors", "Wireless Video", "Stabilization", "Power", "Lighting"
            ]
        },
        "equipment": [
            {
                "id": "cam_venice_2",
                "name": "Sony Venice 2 8K",
                "brand": "Sony",
                "category": "Cameras",
                "description": "Building on the original Venice, Venice 2 features a compact design, internal recording, and an 8.6K full-frame CMOS sensor that can capture 16 stops of dynamic range. The camera also offers a dual-base ISO of 800/3200 and 8 stops of built-in ND filters.",
                "specifications": {
                    "sensor_size": "35.9mm x 23.93mm (Diagonal: 43.14mm)",
                    "max_resolution": "8640 x 5760",
                    "dynamic_range": "16 Stops",
                    "media_type": "AXS Memory A-Series",
                    "mount": "PL mount / E-mount",
                    "weight_lbs": "9.48",
                    "codec": "X-OCN, ProRes",
                    "max_fps": "30fps full sensor, 90fps max"
                },
                "stock_available": 2
            },
            {
                "id": "cam_alexa_35",
                "name": "ARRI Alexa 35",
                "brand": "ARRI",
                "category": "Cameras",
                "description": "Arri’s compact Alexa 35 features a 4.6K Super 35-format sensor capable of capturing 17 stops of dynamic range. With an exposure index adjustable from 160 to 6400, the camera incorporates four built-in motorized ND filters.",
                "specifications": {
                    "sensor_size": "28.0 x 19.2mm",
                    "max_resolution": "4608 x 3164",
                    "dynamic_range": "17 Stops",
                    "media_type": "Codex Compact Drives",
                    "weight_lbs": "6.4",
                    "codec": "ProRes, ARRIRAW",
                    "max_fps": "75fps full sensor, 120fps max"
                },
                "stock_available": 2
            },
            {
                "id": "cam_alexa_mini_lf",
                "name": "ARRI Alexa Mini LF",
                "brand": "ARRI",
                "category": "Cameras",
                "description": "The Alexa Mini LF combines the Alexa Mini’s compact form factor with the Alexa LF’s large-format sensor. Includes Panavision Modular accessory system compatibility.",
                "specifications": {
                    "sensor_size": "36.7mm x 25.5mm (Diagonal: 44.7mm)",
                    "max_resolution": "4448 x 3096",
                    "dynamic_range": "14+ Stops",
                    "media_type": "Codex Compact Drives",
                    "weight_lbs": "5.7",
                    "codec": "ProRes, ARRIRAW",
                    "max_fps": "40fps full sensor, 100fps max"
                },
                "stock_available": 1
            },
            {
                "id": "cam_alexa_mini",
                "name": "ARRI Alexa Mini",
                "brand": "ARRI",
                "category": "Cameras",
                "description": "The compact and lightweight Alexa Mini can be fitted with a Panavision lens mount. Versatile and lightweight.",
                "specifications": {
                    "sensor_size": "28.3 mm x 18.2 mm",
                    "max_resolution": "3168 x 2202",
                    "dynamic_range": "14+ Stops",
                    "media_type": "CFast 2.0",
                    "weight_lbs": "5",
                    "codec": "ProRes, ARRIRAW",
                    "max_fps": "200 fps max"
                },
                "stock_available": 2
            },
            {
                "id": "cam_fx9",
                "name": "Sony PXW-FX9",
                "brand": "Sony",
                "category": "Cameras",
                "description": "The Sony FX9 packages Sony’s 6K full-frame Exmor R sensor into a compact, lightweight, single-body cinema camera designed for both documentary and narrative production.",
                "specifications": {
                    "sensor_size": "35.7 mm x 18.8 mm",
                    "max_resolution": "6048 x 4032",
                    "dynamic_range": "15+ Stops",
                    "media_type": "CFexpress Type A / XQD",
                    "weight_lbs": "7.6",
                    "codec": "ProRes (via extension unit)",
                    "max_fps": "60fps full sensor"
                },
                "stock_available": 3
            },
            {
                "id": "cam_fx3",
                "name": "Sony FX3",
                "brand": "Sony",
                "category": "Cameras",
                "description": "Inspired by Sony's high-end cinema cameras, the FX3 is a compact full-frame camera that delivers stunning 4K footage with 15 stops of dynamic range. Features dual base ISO (800/12,800).",
                "specifications": {
                    "sensor_size": "35.9 mm x 23.93 mm",
                    "max_resolution": "8640 x 5760",
                    "dynamic_range": "16 Stops",
                    "media_type": "CFexpress Type-A",
                    "weight_lbs": "9.48",
                    "codec": "XAVC S-I, ProRes RAW (Ext)",
                    "max_fps": "120 fps (4K)"
                },
                "stock_available": 4
            },
            {
                "id": "cam_red_monstro",
                "name": "RED DSMC2 Monstro 8K VV",
                "brand": "RED",
                "category": "Cameras",
                "description": "The RED Monstro 8K VV sensor can capture up to 60 fps when recording full format. The sensor is housed in a DSMC2 camera body.",
                "specifications": {
                    "sensor_size": "40.96mm x 21.6mm",
                    "max_resolution": "8192 x 4320",
                    "dynamic_range": "17+ Stops",
                    "media_type": "RED Mini Mag",
                    "weight_lbs": "3.5",
                    "codec": "R3D, ProRes, DNxHD",
                    "max_fps": "60fps full sensor"
                },
                "stock_available": 1
            },
            {
                "id": "lens_cooke_s4i",
                "name": "Cooke S4/i Prime Set",
                "brand": "Cooke",
                "category": "Lenses",
                "tags": ["Spherical"],
                "description": "Cooke S4/i focal lengths range from 12mm to 180mm, all with a wide-open aperture of T2. Color-matched and compatible with most lenses in the Cooke line. Offers the classic 'Cooke Look'.",
                "specifications": {
                    "mount": "PL",
                    "aperture": "T2",
                    "coverage": "Super 35"
                },
                "stock_available": 1
            },
            {
                "id": "lens_arri_master_ana",
                "name": "ARRI / Zeiss Master Anamorphic Set",
                "brand": "Zeiss",
                "category": "Lenses",
                "tags": ["Anamorphic"],
                "description": "Focal lengths range from 28mm to 135mm, all with a wide-open aperture of T1.9. Designed for premium anamorphic cinematography with exceptional sharpness and minimal distortion.",
                "specifications": {
                    "mount": "PL",
                    "aperture": "T1.9",
                    "coverage": "Super 35"
                },
                "stock_available": 1
            },
            {
                "id": "lens_atlas_orion",
                "name": "Atlas Orion Anamorphic Set",
                "brand": "Atlas",
                "category": "Lenses",
                "tags": ["Anamorphic"],
                "description": "Atlas Orion Anamorphic primes feature focal lengths ranging from 32mm to 100mm, all with a fast aperture of T2. Delivers a classic anamorphic look with controlled flares.",
                "specifications": {
                    "mount": "PL",
                    "aperture": "T2",
                    "coverage": "Super 35"
                },
                "stock_available": 1
            },
            {
                "id": "lens_arri_signature",
                "name": "ARRI Signature Primes Set",
                "brand": "ARRI",
                "category": "Lenses",
                "tags": ["Large Format", "Spherical"],
                "description": "Focal lengths range from 12mm to 280mm, all with a wide-open aperture of T1.8. Designed for large-format cinematography with warm, smooth skin tones.",
                "specifications": {
                    "mount": "LPL",
                    "aperture": "T1.8",
                    "coverage": "Large Format / Full Frame"
                },
                "stock_available": 1
            },
            {
                "id": "lens_zeiss_supreme",
                "name": "Zeiss Supreme Prime Set",
                "brand": "Zeiss",
                "category": "Lenses",
                "tags": ["Large Format", "Spherical"],
                "description": "Covering an image circle of 46.3mm, Zeiss Supreme Prime lenses offer a T1.5 maximum aperture across most of the range.",
                "specifications": {
                    "mount": "PL",
                    "aperture": "T1.5",
                    "coverage": "Full Frame"
                },
                "stock_available": 1
            },
            {
                "id": "lens_arri_alura_45_250",
                "name": "ARRI Alura 45-250mm T2.6 Telephoto Zoom",
                "brand": "ARRI",
                "category": "Lenses",
                "tags": ["Zoom"],
                "description": "The 45-250mm Alura features a fast T2.6 aperture throughout its zoom range and cine-style lens ergonomics. Optimized for ALEXA 2K 16:9 format.",
                "specifications": {
                    "focal_length": "45-250mm",
                    "aperture": "T2.6",
                    "mount": "PL",
                    "coverage": "Super 35"
                },
                "stock_available": 1
            },
            {
                "id": "lens_canon_17_120",
                "name": "Canon Cine-Servo 17-120mm T2.95-3.9",
                "brand": "Canon",
                "category": "Lenses",
                "tags": ["Zoom"],
                "description": "Combines functionality of broadcast ENG style motorized zoom with optical precision of cinema zoom. Suitable for 4K acquisition.",
                "specifications": {
                    "focal_length": "17-120mm",
                    "aperture": "T2.95-3.9",
                    "mount": "PL",
                    "coverage": "Super 35"
                },
                "stock_available": 2
            },
            {
                "id": "ctrl_hi5",
                "name": "ARRI Hi-5 Wireless Handheld Set",
                "brand": "ARRI",
                "category": "Lens Control",
                "description": "The versatile Hi-5 RX-TX 2400 Set from ARRI. 3-axis FIZ control. Compatible with Alexa 35, Mini LF, etc.",
                "specifications": {
                    "channels": "3 Axis",
                    "wireless_module": "RF-EMIP / RF-2400",
                    "compatibility": "ARRI Cameras & cforce motors"
                },
                "stock_available": 2
            },
            {
                "id": "ctrl_wcu4",
                "name": "ARRI WCU-4 Wireless Compact Unit",
                "brand": "ARRI",
                "category": "Lens Control",
                "description": "3-axis handheld controller featuring an integrated lens display. Control camera functions, focus, iris, and zoom.",
                "specifications": {
                    "channels": "3 Axis",
                    "features": "Vibrating Markers, Backlit Focus Knob"
                },
                "stock_available": 3
            },
            {
                "id": "ctrl_nucleus_m",
                "name": "Tilta Nucleus-M Wireless FIZ",
                "brand": "Tilta",
                "category": "Lens Control",
                "description": "Wireless lens control system with 1000' range and two motors. Features integrated receivers in motors.",
                "specifications": {
                    "range": "1000 ft",
                    "motors": "2 Included",
                    "gear_pitch": "0.8 MOD"
                },
                "stock_available": 5
            },
            {
                "id": "supp_oconnor_2575d",
                "name": "OConnor Ultimate 2575D Fluid Head",
                "brand": "OConnor",
                "category": "Support",
                "tags": ["Fluid Heads"],
                "description": "Industry standard fluid head. Supports up to 90 lbs. Includes sinusoidal counterbalance system for accurate balance.",
                "specifications": {
                    "payload": "Up to 90 lbs",
                    "base": "Mitchell / 150mm",
                    "tilt_range": "+/- 90 degrees"
                },
                "stock_available": 3
            },
            {
                "id": "supp_sachtler_25",
                "name": "Sachtler System 25 EFP 2",
                "brand": "Sachtler",
                "category": "Support",
                "tags": ["Tripods"],
                "description": "Heavy duty tripod system with carbon fiber legs. Features 18-step counterbalance.",
                "specifications": {
                    "payload": "77 lbs",
                    "bowl": "150mm",
                    "legs": "Carbon Fiber"
                },
                "stock_available": 2
            },
            {
                "id": "mon_smallhd_ultra7",
                "name": "SmallHD ULTRA 7 Bolt 6 RX 750",
                "brand": "SmallHD",
                "category": "Monitors",
                "tags": ["On-Camera"],
                "description": "Ultra-bright 7-inch monitor with integrated Bolt 6 Receiver. 2300 cd/m2 brightness.",
                "specifications": {
                    "size": "7 inch",
                    "brightness": "2300 nits",
                    "resolution": "1920 x 1080",
                    "wireless": "Bolt 6 RX Built-in"
                },
                "stock_available": 4
            },
            {
                "id": "mon_sony_pvm_a170",
                "name": "Sony PVMA170 17\" OLED Monitor",
                "brand": "Sony",
                "category": "Monitors",
                "tags": ["Production"],
                "description": "Professional OLED Production Monitor suitable for field and studio use. True black reproduction.",
                "specifications": {
                    "size": "17 inch",
                    "panel_type": "OLED",
                    "resolution": "1920 x 1080",
                    "inputs": "SDI, HDMI, Composite"
                },
                "stock_available": 3
            },
            {
                "id": "wireless_teradek_bolt6_1500",
                "name": "Teradek Bolt 6 LT 1500 Kit",
                "brand": "Teradek",
                "category": "Wireless Video",
                "description": "Transmit and receive lossless HD video from up to 1500' line of sight. Supports 6GHz frequency.",
                "specifications": {
                    "range": "1500 ft",
                    "resolution": "Up to 4K30",
                    "inputs": "3G-SDI / HDMI"
                },
                "stock_available": 3
            },
            {
                "id": "stab_ronin_2",
                "name": "DJI Ronin 2 Professional Combo",
                "brand": "DJI",
                "category": "Stabilization",
                "description": "High-end 3-axis motorized stabilization system designed for professional cinema cameras. Built for powerful payloads.",
                "specifications": {
                    "payload": "30 lbs",
                    "battery": "Dual Hot-Swappable",
                    "compatibility": "Cinema Cameras"
                },
                "stock_available": 2
            },
            {
                "id": "power_bebob_cube",
                "name": "bebob CUBE 1200 Multi-Voltage Battery",
                "brand": "Bebob",
                "category": "Power",
                "description": "Lithium-ion source that can run an ARRI SkyPanel S60 for 2.5 hours at full power. Provides 5V, 12V, 24V, and 48V.",
                "specifications": {
                    "capacity": "1176Wh",
                    "outputs": "12V, 24V, 48V, USB",
                    "weight": "19.7 lbs"
                },
                "stock_available": 2
            },
            {
                "id": "mb_arri_lmb4x5",
                "name": "ARRI LMB 4x5 Matte Box Pro Set",
                "brand": "ARRI",
                "category": "Matte Boxes",
                "description": "Modular matte box system. Includes 15mm lightweight rod support, rotating stages, and filter trays.",
                "specifications": {
                    "type": "Clip-on / Rod mounted",
                    "filters": "4x5.65 / 4x4",
                    "stages": "3"
                },
                "stock_available": 4
            },
            {
                "id": "cam_amira",
                "name": "ARRI Amira",
                "brand": "ARRI",
                "category": "Cameras",
                "description": "Arri’s Amira offers an ergonomic design that’s well-suited to handheld, shoulder-mount operation. Features the same sensor as the Alexa Mini.",
                "specifications": {
                    "sensor_size": "28.3mm x 18.2mm",
                    "max_resolution": "3200 x 1800",
                    "dynamic_range": "14+ Stops",
                    "media_type": "CFast 2.0",
                    "weight_lbs": "9.2",
                    "codec": "ProRes, ARRIRAW",
                    "max_fps": "200fps max"
                },
                "stock_available": 1
            },
            {
                "id": "cam_varicam_lt",
                "name": "Panasonic VariCam LT",
                "brand": "Panasonic",
                "category": "Cameras",
                "description": "The VariCam LT packages the VariCam 35’s 4K Super 35mm sensor in a lightweight, single-body design. Features dual native ISO.",
                "specifications": {
                    "sensor_size": "24.6mm x 12.9mm",
                    "max_resolution": "4096 x 2160",
                    "dynamic_range": "14+ Stops",
                    "media_type": "P2 Express, Micro P2",
                    "weight_lbs": "6",
                    "codec": "AVC-Intra, ProRes",
                    "max_fps": "60fps full sensor"
                },
                "stock_available": 1
            },
            {
                "id": "cam_sony_f55",
                "name": "Sony PMW-F55",
                "brand": "Sony",
                "category": "Cameras",
                "description": "The Super 35-format Sony F55 captures 16-bit image files at up to 4K raw. Features a global shutter.",
                "specifications": {
                    "sensor_size": "24mm x 12.7mm",
                    "max_resolution": "4096 x 2160",
                    "dynamic_range": "14 Stops",
                    "media_type": "SxS, AXSM",
                    "weight_lbs": "4.85",
                    "codec": "XAVC, X-OCN",
                    "max_fps": "180fps max"
                },
                "stock_available": 1
            },
            {
                "id": "lens_zeiss_master_prime",
                "name": "ARRI / Zeiss Master Prime Set",
                "brand": "Zeiss",
                "category": "Lenses",
                "tags": ["Spherical"],
                "description": "Arri/Zeiss Master Primes offer high contrast and resolution with virtually no breathing. T1.3 aperture across the set.",
                "specifications": {
                    "mount": "PL",
                    "aperture": "T1.3",
                    "coverage": "Super 35"
                },
                "stock_available": 1
            },
            {
                "id": "lens_zeiss_super_speed",
                "name": "ARRI / Zeiss Super Speed MK III Set",
                "brand": "Zeiss",
                "category": "Lenses",
                "tags": ["Spherical"],
                "description": "Renowned for their classic cinematic look, Super Speed MK III primes offer high light-gathering capability (T1.3) with a warm, organic image character.",
                "specifications": {
                    "mount": "PL",
                    "aperture": "T1.3",
                    "coverage": "Super 35"
                },
                "stock_available": 1
            },
            {
                "id": "lens_zeiss_cp2",
                "name": "Zeiss Compact Prime CP.2 Set",
                "brand": "Zeiss",
                "category": "Lenses",
                "tags": ["Spherical"],
                "description": "Designed for versatility, CP.2 lenses deliver sharp, high-contrast images. Interchangeable mounts and full-frame coverage.",
                "specifications": {
                    "mount": "PL / EF",
                    "aperture": "T2.1",
                    "coverage": "Full Frame"
                },
                "stock_available": 1
            },
            {
                "id": "lens_zeiss_cp3",
                "name": "Zeiss Compact Prime CP.3 Set",
                "brand": "Zeiss",
                "category": "Lenses",
                "tags": ["Spherical"],
                "description": "Building on the CP.2, the CP.3 offers improved mechanics, refined optical performance, and a smaller form factor.",
                "specifications": {
                    "mount": "PL / EF",
                    "aperture": "T2.1",
                    "coverage": "Full Frame"
                },
                "stock_available": 1
            },
            {
                "id": "lens_zeiss_ultra_prime",
                "name": "ARRI / Zeiss Ultra Prime Set",
                "brand": "Zeiss",
                "category": "Lenses",
                "tags": ["Spherical"],
                "description": "High-contrast, high-resolution lenses offering even field illumination. Widely considered a workhorse lens for cinema.",
                "specifications": {
                    "mount": "PL",
                    "aperture": "T1.9",
                    "coverage": "Super 35"
                },
                "stock_available": 1
            },
            {
                "id": "lens_zeiss_standard",
                "name": "Zeiss Standard Prime Set",
                "brand": "Zeiss",
                "category": "Lenses",
                "tags": ["Spherical"],
                "description": "Known for their classic ZEISS look, Standard Primes deliver sharp, high-contrast images with natural color reproduction in a tiny form factor.",
                "specifications": {
                    "mount": "PL",
                    "aperture": "T2.1",
                    "coverage": "Super 35"
                },
                "stock_available": 1
            },
            {
                "id": "lens_arri_macro",
                "name": "ARRI Macro Prime Set",
                "brand": "ARRI",
                "category": "Lenses",
                "tags": ["Macro"],
                "description": "Designed for close-focus cinematography, ARRI Macro Primes deliver exceptional sharpness and flat field performance.",
                "specifications": {
                    "mount": "PL",
                    "aperture": "T2.0",
                    "coverage": "Super 35"
                },
                "stock_available": 1
            },
            {
                "id": "lens_zeiss_master_macro",
                "name": "Zeiss Master Macro 100mm",
                "brand": "Zeiss",
                "category": "Lenses",
                "tags": ["Macro"],
                "description": "Designed for high-end macro cinematography, Master Macro Primes deliver exceptional sharpness and contrast from close focus to infinity.",
                "specifications": {
                    "focal_length": "100mm",
                    "mount": "PL",
                    "aperture": "T2.0",
                    "coverage": "Super 35"
                },
                "stock_available": 1
            },
            {
                "id": "lens_servicevision_scorpio",
                "name": "Servicevision Scorpion Anamorphic Set",
                "brand": "Servicevision",
                "category": "Lenses",
                "tags": ["Anamorphic"],
                "description": "Designed for lightweight anamorphic cinematography, Scorpion lenses deliver a classic character with pleasing oval bokeh.",
                "specifications": {
                    "mount": "PL",
                    "aperture": "T2.2",
                    "coverage": "Full Frame / Super 35"
                },
                "stock_available": 1
            },
            {
                "id": "lens_arri_uwz",
                "name": "ARRI 9.5-18mm T2.9 Ultra Wide Zoom",
                "brand": "ARRI",
                "category": "Lenses",
                "tags": ["Zoom"],
                "description": "This super-wide angle, near-telecentric zoom delivers optimal image quality with virtually no distortion.",
                "specifications": {
                    "focal_length": "9.5-18mm",
                    "aperture": "T2.9",
                    "mount": "PL",
                    "coverage": "Large Format (Open Gate)"
                },
                "stock_available": 1
            },
            {
                "id": "lens_arri_alura_18_80",
                "name": "ARRI Alura 18-80mm T2.6 Studio Zoom",
                "brand": "ARRI",
                "category": "Lenses",
                "tags": ["Zoom"],
                "description": "Designed to match ARRI prime lenses in color and contrast, it delivers exceptional optical consistency. Optimized for ALEXA 2K.",
                "specifications": {
                    "focal_length": "18-80mm",
                    "aperture": "T2.6",
                    "mount": "PL",
                    "coverage": "Super 35"
                },
                "stock_available": 1
            },
            {
                "id": "lens_fuji_14_35",
                "name": "Fujinon Cabrio 14-35mm T2.9",
                "brand": "Fujinon",
                "category": "Lenses",
                "tags": ["Zoom"],
                "description": "Wide to telephoto zoom for Super 35mm cameras. Features a detachable ENG-style digital drive unit.",
                "specifications": {
                    "focal_length": "14-35mm",
                    "aperture": "T2.9",
                    "mount": "PL",
                    "coverage": "Super 35"
                },
                "stock_available": 1
            },
            {
                "id": "lens_fuji_19_90",
                "name": "Fujinon Cabrio 19-90mm T2.9",
                "brand": "Fujinon",
                "category": "Lenses",
                "tags": ["Zoom"],
                "description": "Versatile standard zoom with detachable servo drive. A workhorse for documentary and commercial production.",
                "specifications": {
                    "focal_length": "19-90mm",
                    "aperture": "T2.9",
                    "mount": "PL",
                    "coverage": "Super 35"
                },
                "stock_available": 1
            },
            {
                "id": "lens_fuji_20_120",
                "name": "Fujinon Cabrio 20-120mm T3.5",
                "brand": "Fujinon",
                "category": "Lenses",
                "tags": ["Zoom"],
                "description": "Lightweight zoom with standard 0.8 pitch gears. Servo unit optional (sold separately/check kit).",
                "specifications": {
                    "focal_length": "20-120mm",
                    "aperture": "T3.5",
                    "mount": "PL",
                    "coverage": "Super 35"
                },
                "stock_available": 1
            },
            {
                "id": "lens_fuji_85_300",
                "name": "Fujinon Cabrio 85-300mm T2.9-4.0",
                "brand": "Fujinon",
                "category": "Lenses",
                "tags": ["Zoom"],
                "description": "Lightweight telephoto zoom with detachable servo. T2.9 until 200mm, ramping to T4.0 at 300mm.",
                "specifications": {
                    "focal_length": "85-300mm",
                    "aperture": "T2.9-4.0",
                    "mount": "PL",
                    "coverage": "Super 35"
                },
                "stock_available": 1
            },
            {
                "id": "lens_canon_15_47",
                "name": "Canon CN-E 15.5-47mm T2.8 Wide Zoom",
                "brand": "Canon",
                "category": "Lenses",
                "tags": ["Zoom"],
                "description": "Wide-angle cinema zoom engineered for 4K resolution. Compact and lightweight.",
                "specifications": {
                    "focal_length": "15.5-47mm",
                    "aperture": "T2.8",
                    "mount": "PL",
                    "coverage": "Super 35"
                },
                "stock_available": 1
            },
            {
                "id": "lens_canon_15_120",
                "name": "Canon Cine-Servo 15-120mm T2.95-3.9",
                "brand": "Canon",
                "category": "Lenses",
                "tags": ["Zoom"],
                "description": "Broadcast studio, sports, or live event lens. Pairs cine-style zoom with servo control.",
                "specifications": {
                    "focal_length": "15-120mm",
                    "aperture": "T2.95-3.9",
                    "mount": "PL / EF",
                    "coverage": "Full Frame / Super 35"
                },
                "stock_available": 1
            },
            {
                "id": "lens_canon_25_250",
                "name": "Canon Cine-Servo 25-250mm T2.95",
                "brand": "Canon",
                "category": "Lenses",
                "tags": ["Zoom"],
                "description": "High magnification zoom with servo control. Includes built-in 1.5x extender.",
                "specifications": {
                    "focal_length": "25-250mm",
                    "aperture": "T2.95",
                    "mount": "PL / EF",
                    "coverage": "Super 35"
                },
                "stock_available": 1
            },
            {
                "id": "lens_angenieux_16_40",
                "name": "Angenieux Optimo Style 16-40mm T2.8",
                "brand": "Angenieux",
                "category": "Lenses",
                "tags": ["Zoom"],
                "description": "Compact wide zoom supporting 4K resolution. Internal focus design with no breathing.",
                "specifications": {
                    "focal_length": "16-40mm",
                    "aperture": "T2.8",
                    "mount": "PL",
                    "coverage": "Super 35"
                },
                "stock_available": 1
            },
            {
                "id": "lens_angenieux_28_76",
                "name": "Angenieux Optimo 28-76mm T2.6",
                "brand": "Angenieux",
                "category": "Lenses",
                "tags": ["Zoom"],
                "description": "Lightweight wide-angle to portrait zoom. Extremely high optical quality.",
                "specifications": {
                    "focal_length": "28-76mm",
                    "aperture": "T2.6",
                    "mount": "PL",
                    "coverage": "Super 35"
                },
                "stock_available": 1
            },
            {
                "id": "lens_angenieux_48_130",
                "name": "Angenieux Optimo Style 48-130mm T3",
                "brand": "Angenieux",
                "category": "Lenses",
                "tags": ["Zoom"],
                "description": "Mid-telephoto zoom. Can be used with the Angenieux Servo Unit (ASU).",
                "specifications": {
                    "focal_length": "48-130mm",
                    "aperture": "T3",
                    "mount": "PL",
                    "coverage": "Super 35"
                },
                "stock_available": 1
            },
            {
                "id": "lens_angenieux_19_94",
                "name": "Angenieux Optimo Style 19.5-94mm T2.6",
                "brand": "Angenieux",
                "category": "Lenses",
                "tags": ["Zoom"],
                "description": "Replaces the classic 17-80mm. Superb homogeneity of colorimetry, contrast and resolution.",
                "specifications": {
                    "focal_length": "19.5-94mm",
                    "aperture": "T2.6",
                    "mount": "PL",
                    "coverage": "Super 35"
                },
                "stock_available": 1
            },
            {
                "id": "lens_angenieux_30_76",
                "name": "Angenieux Optimo Style 30-76mm T2.8",
                "brand": "Angenieux",
                "category": "Lenses",
                "tags": ["Zoom"],
                "description": "Lightweight, compact, mid-range lens. Matches the Optimo line look.",
                "specifications": {
                    "focal_length": "30-76mm",
                    "aperture": "T2.8",
                    "mount": "PL",
                    "coverage": "Super 35"
                },
                "stock_available": 1
            },
            {
                "id": "lens_zeiss_cz2_15_30",
                "name": "Zeiss CZ.2 15-30mm Compact Zoom",
                "brand": "Zeiss",
                "category": "Lenses",
                "tags": ["Zoom"],
                "description": "Short wide-angle zoom lens for full-frame sensors. Color matched to Zeiss primes.",
                "specifications": {
                    "focal_length": "15-30mm",
                    "aperture": "T2.9",
                    "mount": "PL / EF / E",
                    "coverage": "Full Frame"
                },
                "stock_available": 1
            },
            {
                "id": "lens_tokina_11_16",
                "name": "Tokina 11-16mm T3.0",
                "brand": "Tokina",
                "category": "Lenses",
                "tags": ["Zoom"],
                "description": "Professional cine wide-angle zoom. Re-housed with PL mount and 0.8 gears.",
                "specifications": {
                    "focal_length": "11-16mm",
                    "aperture": "T3.0",
                    "mount": "PL",
                    "coverage": "Super 35"
                },
                "stock_available": 1
            },
            {
                "id": "lens_sigma_50_100",
                "name": "Sigma 50-100mm T2 High-Speed Zoom",
                "brand": "Sigma",
                "category": "Lenses",
                "tags": ["Zoom"],
                "description": "Fast T2 aperture zoom. Delivers 6K-8K resolution performance.",
                "specifications": {
                    "focal_length": "50-100mm",
                    "aperture": "T2",
                    "mount": "PL",
                    "coverage": "Super 35"
                },
                "stock_available": 1
            },
            {
                "id": "ctrl_sxu1",
                "name": "ARRI SXU-1 Single Axis Unit",
                "brand": "ARRI",
                "category": "Lens Control",
                "description": "Wireless hand unit offering single-axis focus, iris, or zoom control.",
                "specifications": {
                    "channels": "1 Axis",
                    "compatibility": "ARRI / cforce"
                },
                "stock_available": 1
            },
            {
                "id": "ctrl_teradek_fiz",
                "name": "Teradek RT FIZ Wireless Lens Control",
                "brand": "Teradek",
                "category": "Lens Control",
                "description": "Features the CTRL.5 wireless lens controller, MDR.X receiver, and MOTR.S Max lens motor.",
                "specifications": {
                    "channels": "3 Axis",
                    "components": "CTRL.5, MDR.X, MOTR.S"
                },
                "stock_available": 1
            },
            {
                "id": "ctrl_teradek_ctrl3",
                "name": "Teradek CTRL.3 Three-Axis Controller",
                "brand": "Teradek",
                "category": "Lens Control",
                "description": "Control focus, iris, or zoom with ease. 5000' outdoor wireless range.",
                "specifications": {
                    "channels": "3 Axis",
                    "range": "5000 ft",
                    "display": "OLED"
                },
                "stock_available": 1
            },
            {
                "id": "ctrl_cmotion_one",
                "name": "cmotion compact ONE Set",
                "brand": "cmotion",
                "category": "Lens Control",
                "description": "Ready-to-shoot one motor system. Lightweight and compact.",
                "specifications": {
                    "channels": "1 Axis",
                    "motor": "Integrated"
                },
                "stock_available": 1
            },
            {
                "id": "ctrl_arri_ff5",
                "name": "ARRI FF-5 Cine Follow Focus",
                "brand": "ARRI",
                "category": "Lens Control",
                "description": "Gear ratio of 2:1, designed for cine-style lenses. Snaps onto 15mm or 19mm rods.",
                "specifications": {
                    "type": "Mechanical",
                    "ratio": "2:1",
                    "rod_support": "15mm/19mm"
                },
                "stock_available": 1
            },
            {
                "id": "ctrl_arri_ff4",
                "name": "ARRI FF-4 Follow Focus",
                "brand": "ARRI",
                "category": "Lens Control",
                "description": "1:2 knob-to-gear ratio for smooth, accurate focus pulls. Robust economical unit.",
                "specifications": {
                    "type": "Mechanical",
                    "ratio": "1:2",
                    "rod_support": "15mm LWS"
                },
                "stock_available": 1
            },
            {
                "id": "ctrl_arri_ff3",
                "name": "ARRI FF-3 Follow Focus",
                "brand": "ARRI",
                "category": "Lens Control",
                "description": "Lightweight single-sided follow focus. Ideal for handheld and studio setups.",
                "specifications": {
                    "type": "Mechanical",
                    "rod_support": "15mm LWS"
                },
                "stock_available": 1
            },
            {
                "id": "ctrl_chrosziel_dv",
                "name": "Chrosziel DV Studio Rig Follow Focus",
                "brand": "Chrosziel",
                "category": "Lens Control",
                "description": "15mm lightweight standard follow focus. Includes VariLock dual hard stops.",
                "specifications": {
                    "type": "Mechanical",
                    "rod_support": "15mm LWS",
                    "gears": "6 included"
                },
                "stock_available": 1
            }
        ],
        "kit_templates": [
            {
                "id": "kit_venice_pkg",
                "name": "Sony Venice 2 Cine Package",
                "main_product_id": "cam_venice_2",
                "base_price_modifier": -300,
                "description": "Ultimate full-frame cinema package. Includes Sony Venice 2 Body, OConnor 2575D Fluid Head, Power Distribution, and monitoring."
            },
            {
                "id": "kit_alexa35_pkg",
                "name": "ARRI Alexa 35 Production Package",
                "main_product_id": "cam_alexa_35",
                "base_price_modifier": -200,
                "description": "A complete cinema package ready for high-end production. Includes Alexa 35, MVF-2 Viewfinder, Codex Media, and Support."
            },
            {
                "id": "kit_fx3_rng",
                "name": "Sony FX3 Run & Gun Kit",
                "main_product_id": "cam_fx3",
                "base_price_modifier": 0,
                "description": "Lightweight setup for documentary and fast-paced shooting. Includes FX3, Batteries, Media, and lightweight support."
            }
        ],
        "kit_items": [
            {
                "id": "item_v2_cam",
                "template_id": "kit_venice_pkg",
                "product_id": "cam_venice_2",
                "slot_name": "Camera Body",
                "is_mandatory": true,
                "default_quantity": 1
            },
            {
                "id": "item_v2_head",
                "template_id": "kit_venice_pkg",
                "product_id": "supp_oconnor_2575d",
                "slot_name": "Fluid Head",
                "is_mandatory": true,
                "default_quantity": 1,
                "swappable_category": "Support"
            },
            {
                "id": "item_v2_legs",
                "template_id": "kit_venice_pkg",
                "product_id": "supp_sachtler_25",
                "slot_name": "Tripod Legs",
                "is_mandatory": true,
                "default_quantity": 1
            },
            {
                "id": "item_a35_cam",
                "template_id": "kit_alexa35_pkg",
                "product_id": "cam_alexa_35",
                "slot_name": "Camera Body",
                "is_mandatory": true,
                "default_quantity": 1
            },
            {
                "id": "item_a35_monitor",
                "template_id": "kit_alexa35_pkg",
                "product_id": "mon_smallhd_ultra7",
                "slot_name": "On-Camera Monitor",
                "is_mandatory": false,
                "default_quantity": 1,
                "swappable_category": "Monitors"
            },
            {
                "id": "item_fx3_cam",
                "template_id": "kit_fx3_rng",
                "product_id": "cam_fx3",
                "slot_name": "Camera Body",
                "is_mandatory": true,
                "default_quantity": 1
            },
            {
                "id": "item_fx3_control",
                "template_id": "kit_fx3_rng",
                "product_id": "ctrl_nucleus_m",
                "slot_name": "Lens Control",
                "is_mandatory": false,
                "default_quantity": 1
            }
        ]
    };

    // ==========================================
    // 1. UPDATE SCHEMA (All Collections)
    // ==========================================
    const eqCollection = app.findCollectionByNameOrId("equipment");

    // Ensure new fields exist on equipment
    const fieldsToAdd = ["type", "mount", "sensor_size", "resolution"];
    let schemaChanged = false;

    fieldsToAdd.forEach(fieldName => {
        const existing = eqCollection.fields.getByName(fieldName);
        if (!existing) {
            eqCollection.fields.add(new TextField({
                name: fieldName,
                required: false
            }));
            schemaChanged = true;
        }
    });

    if (schemaChanged) {
        app.save(eqCollection);
    }

    // ==========================================
    // 2. SEED CATEGORIES
    // ==========================================
    const catCollection = app.findCollectionByNameOrId("categories");
    const categoryMap = {}; // name -> id

    DATA.taxonomies.categories.forEach(catName => {
        // slugify
        const slug = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        try {
            let cat = app.findFirstRecordByData("categories", "slug", slug);
            categoryMap[catName] = cat.id;
            console.log(`Category exists: ${catName}`);
        } catch (e) {
            // Create
            const cat = new Record(catCollection);
            cat.set("name", catName);
            cat.set("name_en", catName);
            cat.set("name_fr", catName); // Fallback
            cat.set("slug", slug);
            cat.set("icon", "box"); // Default

            app.save(cat);
            categoryMap[catName] = cat.id;
            console.log(`Category created: ${catName}`);
        }
    });

    // ==========================================
    // 3. SEED EQUIPMENT
    // ==========================================

    DATA.equipment.forEach(item => {
        let record;
        // slugify ID to use as slug or just use ID provided if user wants
        const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        try {
            record = app.findFirstRecordByData("equipment", "slug", slug);
        } catch (e) {
            record = new Record(eqCollection);
        }

        const catId = categoryMap[item.category];
        if (!catId) {
            console.log(`Warning: Category ${item.category} not found for ${item.name}`);
        }

        record.set("slug", slug);
        record.set("name_en", item.name);
        record.set("name_fr", item.name);
        record.set("description_en", item.description);
        record.set("description_fr", item.description);

        record.set("brand", item.brand);
        record.set("category", catId);

        record.set("stock", 100);
        record.set("stock_available", 100);
        record.set("daily_rate", 100); // Set to non-zero to pass validation
        record.set("visibility", true);

        // Store full specs mostly for reference
        record.set("specs_en", JSON.stringify(item.specifications));
        record.set("specs_fr", JSON.stringify(item.specifications));

        // Extract Filters
        if (item.tags && item.tags.length > 0) {
            record.set("type", item.tags[0]);
        }

        // Mount
        if (item.specifications.mount) {
            record.set("mount", item.specifications.mount);
        }

        // Sensor
        if (item.specifications.sensor_size) {
            record.set("sensor_size", item.specifications.sensor_size);
        }

        // Resolution
        if (item.specifications.max_resolution) {
            record.set("resolution", item.specifications.max_resolution);
        } else if (item.specifications.resolution) {
            record.set("resolution", item.specifications.resolution);
        }

        try {
            app.save(record);
            console.log(`Upserted Equipment: ${item.name}`);
        } catch (err) {
            console.log(`Error processing ${item.name}: ${err}`);
        }
    });

    // ==========================================
    // 4. SEED KIT TEMPLATES & ITEMS
    // ==========================================
    const kitTmplCollection = app.findCollectionByNameOrId("kit_templates");
    const kitItemCollection = app.findCollectionByNameOrId("kit_items");

    // Process Templates
    const templateMap = {}; // id -> record.id

    DATA.kit_templates.forEach(tmpl => {
        let record;
        const slug = tmpl.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        try {
            record = app.findFirstRecordByData("kit_templates", "slug", slug);
        } catch (e) {
            record = new Record(kitTmplCollection);
        }

        // Find main product (camera)
        const mainProductData = DATA.equipment.find(e => e.id === tmpl.main_product_id);
        if (mainProductData) {
            const mpSlug = mainProductData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            try {
                const mp = app.findFirstRecordByData("equipment", "slug", mpSlug);
                record.set("main_product", mp.id);
            } catch (e) {
                console.log(`Warning: Main product not found for template ${tmpl.name}`);
            }
        }

        record.set("name", tmpl.name);
        record.set("slug", slug);
        record.set("description", tmpl.description);
        record.set("base_price_modifier", tmpl.base_price_modifier);

        try {
            app.save(record);
            templateMap[tmpl.id] = record.id;
            console.log(`Upserted Kit Template: ${tmpl.name}`);
        } catch (err) {
            console.log(`Error processing template ${tmpl.name}: ${err}`);
        }
    });

    // Process Kit Items
    DATA.kit_items.forEach(kItem => {
        const tmplId = templateMap[kItem.template_id];
        if (!tmplId) {
            console.log(`Skipping item ${kItem.slot_name}: Parent template not found`);
            return;
        }

        const prodData = DATA.equipment.find(e => e.id === kItem.product_id);
        let prodId = "";
        if (prodData) {
            const pSlug = prodData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            try {
                const p = app.findFirstRecordByData("equipment", "slug", pSlug);
                prodId = p.id;
            } catch (e) {
                console.log(`Warning: Product not found for kit item ${kItem.slot_name}`);
            }
        }

        let record;
        try {
            const existing = app.findRecordsByFilter(
                "kit_items",
                `template = "${tmplId}" && slot_name = "${kItem.slot_name}"`
            );
            if (existing && existing.length > 0) {
                record = existing[0];
            } else {
                record = new Record(kitItemCollection);
            }
        } catch (e) {
            record = new Record(kitItemCollection);
        }

        record.set("template", tmplId);
        record.set("product", prodId);
        record.set("slot_name", kItem.slot_name);
        record.set("is_mandatory", kItem.is_mandatory);
        record.set("default_quantity", kItem.default_quantity);

        if (kItem.swappable_category) {
            const catId = categoryMap[kItem.swappable_category];
            if (catId) {
                record.set("swappable_category", catId);
            }
        }

        try {
            app.save(record);
            console.log(`Upserted Kit Item: ${kItem.slot_name} for ${tmplId}`);
        } catch (err) {
            console.log(`Error processing kit item ${kItem.slot_name}: ${err}`);
        }
    });

}, (app) => {
    // Revert logic (optional)
});
