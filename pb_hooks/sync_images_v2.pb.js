/// <reference path="../pb_data/types.d.ts" />

routerAdd("GET", "/api/dev/sync-images-v2", (c) => {
    try {
        const records = $app.findRecordsByFilter("equipment", "id != ''", "", 500, 0);

        let updated = 0;
        let failed = 0;
        let skipped = 0;
        let logs = [];

        // Complete image map from all migration files
        const imageMap = {
            // CAMERAS (from 1800000009)
            "sony-venice-2-8k": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/sony_mpc_3628_venice_2_digital_motion_1636969601_1672825.jpg",
            "arri-alexa-35": "https://static.bhphoto.com/images/multiple_images/images500x500/1754407216_IMG_2544984.jpg",
            "arri-alexa-mini-lf": "https://static.bhphoto.com/images/multiple_images/images500x500/1717001182_IMG_2256540.jpg",
            "arri-alexa-mini": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/arri_k0_0024310_alexa_mini_lf_and_1553752231_1470347.jpg",
            "sony-pxw-fx9": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/sony_pxw_fx9v_pxw_fx9_xdcam_6k_full_frame_1568344897_1506002.jpg",
            "sony-fx3": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/sony_ilme_fx3a_fx3_full_frame_cinema_camera_1746547141_1894322.jpg",
            "red-dsmc2-monstro-8k-vv": "https://static.bhphoto.com/images/multiple_images/images500x500/1458487193_IMG_604767.jpg",
            "arri-amira": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/panasonic_au_v35lt1g_cinema_varicam_lt_4k_1455802590_1226386.jpg",
            "panasonic-varicam-lt": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/arri_k0_0014798_amira_camera_set_with_1513877808_1346962.jpg",
            "sony-pmw-f55": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/Sony_PMW_F55_CineAlta_4K_Digital_1458308124_898428.jpg",

            // LENSES (from 1800000009 and 1800000010)
            "cooke-s4i-prime-set": "https://res.cloudinary.com/offshoot/q_50,w_1920,c_limit,f_auto/REIS/products/5fb741a435394a631fe5a51f/cooke_mini_s4_i_lens_set_alt_2",
            "arri-zeiss-master-anamorphic-set": "https://cinevo.com/wp-content/uploads/2022/08/ARRI-Zeiss-Master-Anamorphic-Set-a.jpg",
            "atlas-orion-anamorphic-set": "https://res.cloudinary.com/offshoot/q_70,w_3840,c_limit,f_auto/REIS/products/5fba0435a9eb364eeb7b54c1/atlas_orion_2x_anamorphic_a_set_hr_3",
            "arri-signature-primes-set": "https://images.squarespace-cdn.com/content/v1/5e72aea433a7b935087f9d5d/5b69e981-9bea-4ff0-bf2d-ddfaa2152c5a/Screenshot+2024-06-02+at+1.17.06%E2%80%AFPM.jpg?format=1000w",
            "zeiss-supreme-prime-set": "https://cinevo.com/wp-content/uploads/2023/01/cnv-arri-supreme-primes-a-980x652.jpg",
            "arri-alura-45-250mm": "https://static.bhphoto.com/images/images750x750/1487692047_1287817.jpg",
            "canon-cine-servo-17-120mm": "https://static.bhphoto.com/images/images500x500/1717598768_1833736.jpg",
            "arri--zeiss-master-prime-set": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsKM9wNQwbX7kJIuSdy2K69ysSMwtJmeDWZQ&s",
            "arri--zeiss-super-speed-mk-iii-set": "https://cdn.sanity.io/images/rns5gelz/production/f76305fe454e6a8a91c77fb0d2bc937bd2c91988-2000x2000.jpg?w=1000&fit=max&auto=format",
            "zeiss-compact-prime-cp2-set": "https://www.thevisionhouse.com.au/wp-content/uploads/2022/10/Zeiss-CP2-1-640x0-c-default.jpeg",
            "zeiss-compact-prime-cp3-set": "https://vmi.tv/wp-content/uploads/sites/3/2023/04/Zeiss-CP3-Set.jpg",
            "arri--zeiss-ultra-prime-set": "https://images.squarespace-cdn.com/content/v1/5e72aea433a7b935087f9d5d/83d842be-acd1-48e0-8b2d-be1e11120327/Screen+Shot+2023-02-15+at+9.08.34+AM.jpg",
            "zeiss-standard-prime-set": "https://utopiacam.com/wp-content/uploads/2016/05/standardspeeds.jpg",
            "arri-macro-prime-set": "https://static.madedaily.com/managed_images/a4fee251-1a0e-4276-b95d-716d2d3536ad/35617/ARRI-Macro-100mm-T2_C.jpg",
            "zeiss-master-macro-100mm": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3o7xDEWDfq1fss3q_AqUFFTJR_yWBlqdYjw&s",
            "servicevision-scorpion-anamorphic-set": "https://rental.servicevision.es/wp-content/uploads/2019/02/056_ScorpioLens_Anamorphic2x-1-scaled.jpg",

            // ZOOM LENSES (from 1800000010)
            "arri-95-18mm-t29-ultra-wide-zoom": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/arri_k2_0001686_uwz_9_5_18mm_t2_9_f_1499174765_1287811.jpg",
            "arri-alura-18-80mm-t26-studio-zoom": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/arri_k2_47931_0_alura_18_80mm_t2_6_wide_angle_1487692047_1287816.jpg",
            "fujinon-cabrio-14-35mm-t29": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/fujinon_zk2_5x14_14_35mm_t2_9_cabrio_premier_1384866604_1013528.jpg",
            "fujinon-cabrio-19-90mm-t29": "https://static.bhphoto.com/images/multiple_images/images500x500/1498824105_IMG_823618.jpg",
            "fujinon-cabrio-20-120mm-t35": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/fujinon_xk6x20_nm_xk6x20_20_120_pl_mount_1488383209_1322733.jpg",
            "fujinon-cabrio-85-300mm-t29-40": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/fujinon_zk3_5x85_saf_85_300mm_cabrio_lens_1684943711_1733118.jpg",
            "canon-cn-e-155-47mm-t28-wide-zoom": "https://static.bhphoto.com/images/images500x500/1346318521_889818.jpg",
            "canon-cine-servo-15-120mm-t295-39": "https://static.bhphoto.com/images/images500x500/1662540395_1725850.jpg",
            "canon-cine-servo-25-250mm-t295": "https://static.bhphoto.com/images/images500x500/1587386883_1557489.jpg",
            "angenieux-optimo-style-16-40mm-t28": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/angenieux_16_40_optimo_16_to_40mm_optimo_1419417309_1107020.jpg",
            "angenieux-optimo-28-76mm-t26": "https://static.bhphoto.com/images/images500x500/1493987833_1332901.jpg",
            "angenieux-optimo-style-48-130mm-t3": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/angenieux_optimo_48_130_style_with_asu_optimo_style_48_130mm_zoom_1513340578_1365594.jpg",
            "angenieux-optimo-style-195-94mm-t26": "https://epc.es/wp-content/uploads/2019/04/ANGENIEUX-195-94mm-20-scaled.jpg",
            "angenieux-optimo-style-30-76mm-t28": "https://www.bhphotovideo.com/images/fb/angenieux_optimo_30_76_style_optimo_style_30_76mm_zoom_1365593.jpg",
            "zeiss-cz2-15-30mm-compact-zoom": "https://static.bhphoto.com/images/images500x500/1390563263_1023801.jpg",
            "tokina-11-16mm-t30": "https://thehdhouse.com/wp-content/uploads/2023/09/tokina-duclos-11-16mm-T3.0-1.png",
            "sigma-50-100mm-t2-high-speed-zoom": "https://www.bhphotovideo.com/images/fb/sigma_693968_sigma_50_100mm_t2_for_1327932.jpg",

            // LENS CONTROL (from 1800000010)
            "arri-hi-5-wireless-set": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/arri_kk_0041793_hi_5_rx_tx_2400_set_1655120170_1710021.jpg",
            "arri-wcu-4": "https://static.bhphoto.com/images/multiple_images/images500x500/1486487704_IMG_749127.jpg",
            "tilta-nucleus-m": "https://static.bhphoto.com/images/multiple_images/images500x500/1526318171_IMG_988009.jpg",
            "arri-sxu-1-single-axis-unit": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/arri_k2_0000071_sxu_1_single_axis_unit_1486549411_1287348.jpg",
            "teradek-rt-fiz-wireless-lens-control": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/teradek_15_0056_rt_fiz_wireless_lens_1726150825_1848823.jpg",
            "teradek-ctrl3-three-axis-controller": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/teradek_15_0047_i_rt_ctrl_3_wireless_lens_1557400011_1473056.jpg",
            "cmotion-compact-one-set": "https://videoking.eu/wp-content/uploads/2022/10/compact-ONE-set-E.jpg",
            "arri-ff-5-cine-follow-focus": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/arri_kk_0005758_follow_focus_ff_5_cine_1478778337_1288927.jpg",
            "arri-ff-4-follow-focus": "https://static.bhphoto.com/images/images500x500/1478779549_1288924.jpg",
            "arri-ff-3-follow-focus": "https://tv-team.no/cdn/shop/files/arri-ff3-1x1-1.png?v=1688412622",
            "chrosziel-dv-studio-rig-follow-focus": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/chrosziel_c_206_60skit_dv_studio_rig_follow_1427280621_1131821.jpg",

            // SUPPORT (from 1800000009 and 1800000011)
            "oconnor-2575d-fluid-head": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/oconnor_c1234_0005_ultimate_2575d_fluid_head_1466607922_1232548.jpg",
            "sachtler-system-25": "https://static.bhphoto.com/images/multiple_images/images500x500/1668707156_IMG_1876954.jpg",
            "oconnor-ultimate-2560-fluid-head": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/oconnor_c1260_0001_ultimate_2560_fluid_head_1434101716_1157454.jpg",
            "cartoni-master-mk2-head": "https://www.cartoni.com/wp-content/uploads/ProductImages/FluidHeads/Cartoni_FluidHeads_H541_MasterMK2.jpg",
            "cartoni-maxima-30-video-fluid-head": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/cartoni_hm3100_maxima_30_head_1499187934_1324640.jpg",
            "sachtler-video-30-ii-tripod": "https://www.trm.fr/wp-content/uploads/2024/02/SAC_3007_Cine-30-fluid-head_02-600x600-c.jpg",
            "arrihead-2-geared-head": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/arri_k2_43670_0_arrihead_2_production_tripod_1478794858_1288722.jpg",

            // MATTE BOXES (from 1800000011)
            "arri-lmb-4x5-matte-box-pro-set": "https://static.bhphoto.com/images/images500x500/1496676931_1341045.jpg",
            "arri-lmb-25-matte-box-set": "https://static.bhphoto.com/images/images500x500/1488196247_1288790.jpg",
            "arri-mmb-2-double-lws-set": "https://static.bhphoto.com/images/images500x500/1533910662_1220658.jpg",
            "arri-mb-28-6x6-production-matte-box": "https://vmi.tv/wp-content/uploads/sites/3/2019/03/ARRI-MB28-Matte-Box-3-2.jpg",
            "arri-mb-14-matte-box": "https://patriot.ua/wp-content/uploads/2019/06/MB14-e1581070184302-1300x1299.jpg",
            "chrosziel-450-r11-matte-box": "https://static.bhphoto.com/images/images500x500/1346675010_889174.jpg",

            // MONITORS (from 1800000009 and 1800000011)
            "smallhd-ultra-7-bolt-6": "https://static.bhphoto.com/images/images500x500/1715266825_1806333.jpg",
            "sony-pvma170-oled": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/sony_pvm_a170b_pvm_a170_17_pro_oled_1490022375_1320839.jpg",
            "smallhd-ultra-7-uhd-4k-monitor": "https://static.bhphoto.com/images/images500x500/1731335130_1795838.jpg",
            "smallhd-703-bolt-7-wireless-monitor": "https://static.bhphoto.com/images/images500x500/1515023115_1380051.jpg",
            "smallhd-702-oled-on-camera-monitor": "https://static.bhphoto.com/images/images500x500/1487601332_1320437.jpg",
            "smallhd-cine-7-red-rcp2-monitor": "https://static.bhphoto.com/images/multiple_images/images500x500/1640703758_IMG_1667808.jpg",
            "tvlogic-vfm-055a-55-oled": "https://static.bhphoto.com/images/images500x500/1505816473_1362534.jpg",
            "tvlogic-vfm-056wwp": "https://www.tvlogic.tv/Monitors/UpImg/VFM-056WP-FRONT(0)(1).png",
            "tvlogic-lqm-071w": "https://tvlogic.tv/Monitors/UpImg/LQM-071W-FRONT.gif",
            "tvlogic-lvm-091w-m": "https://www.tvlogic.tv/Monitors/UpImg/1042_782_LVM-091W(1).png",
            "tvlogic-24-full-hd-3g-sdi-monitor": "https://static.bhphoto.com/images/images500x500/1671531924_1737071.jpg",
            "sony-bvm-e251-24-oled-reference": "https://www.sony.com/image/3f6290bc8a31d7cf13236376d5e855dc?fmt=jpeg&wid=558&hei=336",
            "marshall-v-md241-24-led-lcd": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/marshall_electronics_v_md241_24_led_lcd_1386257619_982146.jpg",
            "arri-transvideo-starlite-arri-wvs": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/arri_k2_0015243_transvideo_starlite_arri_wvs_1525176383_1367785.jpg",
            "blackmagic-video-assist-5-3g-sdi": "https://static.bhphoto.com/images/images500x500/1594908697_1578060.jpg",
            "blackmagic-video-assist-7-12g-sdi": "https://static.bhphoto.com/images/images500x500/1568713006_1507213.jpg",
            "atomos-shogun-7-hdr-monitor": "https://static.bhphoto.com/images/images500x500/1727171715_1854463.jpg",
            "atomos-ninja-inferno-7": "https://static.bhphoto.com/images/multiple_images/images500x500/1490258703_IMG_773212.jpg",
            "video-devices-pix-e7-7-4k-recorder": "https://static.bhphoto.com/images/images500x500/1428938280_1137280.jpg",

            // WIRELESS VIDEO (from 1800000011)
            "teradek-bolt-6-lt-1500": "https://static.bhphoto.com/images/images500x500/1662681512_1723714.jpg",
            "teradek-ranger-mk-ii-750": "https://static.bhphoto.com/images/images500x500/1705406436_1761089.jpg",
            "teradek-bolt-6-lt-750-kit": "https://static.bhphoto.com/images/images750x750/1722001523_1841011.jpg",
            "teradek-bolt-pro-3000-set": "https://static.bhphoto.com/images/images500x500/1471872050_1273194.jpg",
            "teradek-bolt-sidekick-ii": "https://static.bhphoto.com/images/images500x500/1491412879_1328070.jpg",
            "teradek-bolt-pro-2000-set": "https://static.bhphoto.com/images/images500x500/1425923204_1076568.jpg",
            "teradek-bolt-1000-xt-set": "https://static.bhphoto.com/images/images500x500/1525370855_1403862.jpg",
            "teradek-bolt-pro-1000-set": "https://static.bhphoto.com/images/images500x500/1471867680_1273184.jpg",
            "teradek-bolt-lt-500-set": "https://tdmstore.tdm.ma/wp-content/uploads/2020/05/TERADEK-HF-BOLT-LT-500.jpg",
            "teradek-bolt-500-xt-set": "https://static.bhphoto.com/images/images750x750/1524585083_1403845.jpg",
            "swit-cw-s300-wireless-system": "https://media.tarad.com/9/99aplus/img-lib/spd_2018051492235_b.jpg",
            "hollyland-mars-400s-pro-ii": "https://static.bhphoto.com/images/images500x500/1701775224_1797151.jpg",

            // STABILIZATION (from 1800000011)
            "dji-ronin-2-professional": "https://static.bhphoto.com/images/images500x500/1558517704_1479666.jpg",
            "dji-ronin-s": "https://static.bhphoto.com/images/images500x500/1527601874_1383648.jpg",
            "dji-force-pro": "https://store.droneway.ma/wp-content/uploads/2020/11/DJI-Force-Pro.jpg",
            "dji-rs-3-pro-combo": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/dji_rs_3_pro_gimbal_1720204160_1797421.jpg",
            "dji-rs-4-pro-combo": "https://static.bhphoto.com/images/images500x500/1730825421_1816789.jpg",
            "zhiyun-crane-3s": "https://static.bhphoto.com/images/images500x500/1584603943_1554049.jpg",

            // POWER (from 1800000011 and 1800000013)
            "bebob-cube-1200": "https://static.bhphoto.com/images/images500x500/1527082640_1409393.jpg",
            "ecoflow-delta-pro-power-station": "https://static.bhphoto.com/images/images500x500/1642768650_1685678.jpg",
            "mobile-film-generator-silent": "https://www.pro-lift-montagetechnik.com/WebRoot/Store15/Shops/78156040/6336/C105/EA30/C18A/1998/0A0C/6D0B/2F36/02823_Stromaggregat_Diesel_Silent_400V_E-Starter_10000W_DG14000SE3_1.png",
            "power-distribution-box-3-phase1-phase": "https://thehireman.co.uk/app/uploads/2022/03/125a-distribution-board_1-2.jpg",
            "professional-inline-dimmer": "https://www.resolutionhire.tv/wp-content/uploads/2020/01/2K-Dimmer-scaled.jpg",

            // LIGHTING (from 1800000013)
            "arri-m-series-daylight-hmi": "https://www.arri.com/resource/image/179162/landscape_ratio1x0_38/1920/737/67ca2a010b4fa77f8129d59c0a4e5ff2/DB594B8F249D9DB4738D3CD846DC1156/m-series-stage.jpg",
            "arri-arrisun-hmi-series": "https://www.arri.com/resource/image/269004/landscape_ratio1x0_38/1920/737/5342643664c015aaf16dcc539b6babf1/20E50AF76061D37B39A6459861E2C8F6/arri-arrisun-psn-data2.jpg",
            "arri-junior-tungsten-fresnel-set": "https://www.arri.com/resource/image/178532/landscape_ratio1x0_38/1920/737/9abc0a8c3fb59110e6d24c9e910fab4f/17A0DCC72072D62359DEBB1D7F067F67/arri-junior-stage.jpg",
            "arri-true-blue-t1": "https://www.arri.com/resource/image/33178/landscape_ratio1x0_38/1920/737/7df9692b9699b47a591803a3528e084c/E869D365945DAF18E9F733DA558FC2E3/true-blue-t-series-t1-stage.png",
            "arri-redhead--blonde-kit": "https://www.goldcoastcamerahire.com.au/wp-content/uploads/2019/01/Arrilite-800-2.jpg",
            "dino-light-12x1kw-par-64": "https://www.spottlight-dortmund.de/wp-content/uploads/2020/03/Dino-Light-12kw.png",
            "kupo-par-64-can": "https://www.lightinglab.com.au/wp-content/uploads/2020/04/3-10-Par-64-Black.png",
            "etc-source-4-profile-750w": "https://megavision.com.au/wp-content/uploads/2022/06/ETC-Source-4-750W-Profile-Spotlight.jpg",
            "dedolight-dlh4-150w-3-light-kit": "https://bollywoodfilmequipments.in/wp-content/uploads/2020/12/1-6.jpg",
            "creamsource-vortex8-rgb-panel": "https://static.bhphoto.com/images/multiple_images/images500x500/1643912107_IMG_1690330.jpg",
            "arri-skypanel-s60-c-softlight": "https://static.bhphoto.com/images/images500x500/1432655173_1139001.jpg",
            "dmg-lumire-mix-series": "https://static.bhphoto.com/images/images500x500/1564134460_1492286.jpg",
            "astera-titan-tube-set-8-tube": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/astera_fp1_set_set_of_8_titan_1581676051_1541959.jpg",
            "nanlite-forza-series-300500": "https://cdn-aliyun.nanlite.com/release/1694758773902-815500-1410622625-Forza+300%2B500II.png",
            "aputure-storm-xt52": "https://static.bhphoto.com/images/images500x500/1743508894_1889192.jpg",
            "aputure-electro-storm-cs15": "https://cdn.shopify.com/s/files/1/1343/1935/files/CS15_Meuium_Barndoor-5.png?v=1703557992",
            "aputure-light-storm-pro-series": "https://cdn.shopify.com/s/files/1/1343/1935/files/LS1200dPro-2.png?v=1711009429&width=1000&crop=center",
            "aputure-mc-pro-rgb": "https://cdn.shopify.com/s/files/1/1343/1935/files/MCPro-1.png?v=1696906204&width=1000&crop=center",
            "amaran-f21c-flexible-led-mat": "https://static.bhphoto.com/images/multiple_images/images500x500/1648739988_IMG_1725343.jpg",
            "litegear-litemat-series": "https://s.turbifycdn.com/aah/filmandvideolighting/litegear-litemat-led-lighting-film-video-photo-17.jpg",

            // GRIP (from 1800000013)
            "professional-light-modifier-kit": "https://lightroom-photoshop-tutorials.com/wp-content/uploads/2021/06/Types-of-Light-Modifiers.webp",
            "butterfly--overhead-frames": "https://us.rosco.com/sites/default/files/content/product/2023-06/butterlies-muslin_molton_camouflage-group1_web_size_0.jpg",
            "professional-grip-stand-package": "https://www.essentialphoto.co.uk/cdn/shop/products/K-040047-PIXAPRO-HEAVY-DUTY-COMMERCIAL-STAND-BUNDLE-01.jpg?v=1682072193",

            // FILTERS (from 1800000013)
            "tiffenschneider-solid-nd-filter-4x565": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/Tiffen_45650ND3_4_x_5_65_Neutral_1636720564_86014.jpg",
            "tiffenschneider-irnd-filter-4x565": "https://static.bhphoto.com/images/images500x500/1502792755_572940.jpg",
            "schneider-soft-edge-grad-nd-4x565": "https://static.bhphoto.com/images/images500x500/1629724915_373624.jpg",
            "tiffen-black-pro-mist-filter": "https://static.bhphoto.com/images/images500x500/1727344805_85878.jpg",
            "schneider-true-pol-linear-polarizer": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/Schneider_68013056_True_Polarizing_Filter_4_x_1565868205_398939.jpg",
            "tiffen-138mm-full-field-diopter-set": "https://images.squarespace-cdn.com/content/v1/61a7f2611cbe417ce838e1b3/09e74e3c-45b5-48cf-9681-5cf3b2cb3187/Tiffen-138mm-Diopter-Set-Wide.png?format=2500w",
            "schneider-blue-true-streak-filter": "https://static.bhphoto.com/images/images500x500/1568816621_944109.jpg"
        };

        logs.push("Found " + records.length + " records. Image map has " + Object.keys(imageMap).length + " entries.");

        for (const record of records) {
            const slug = record.get("slug");
            const imageUrl = imageMap[slug];

            if (!imageUrl) {
                skipped++;
                continue;
            }

            try {
                const res = $http.send({
                    url: imageUrl,
                    method: "GET",
                    timeout: 60
                });

                if (res.statusCode === 200 && res.raw && res.raw.length > 0) {
                    let ext = ".jpg";
                    const lowerUrl = imageUrl.toLowerCase();
                    if (lowerUrl.includes(".png")) ext = ".png";
                    else if (lowerUrl.includes(".webp")) ext = ".webp";
                    else if (lowerUrl.includes(".gif")) ext = ".gif";

                    const fileName = record.id + "_" + Date.now() + ext;
                    const file = $filesystem.fileFromBytes(res.raw, fileName);

                    record.set("image", file);
                    $app.save(record);
                    updated++;
                } else {
                    failed++;
                    if (logs.length < 20) {
                        logs.push("Failed (" + res.statusCode + "): " + slug);
                    }
                }
            } catch (err) {
                failed++;
                if (logs.length < 20) {
                    logs.push("Error: " + slug + " - " + err.message);
                }
            }
        }

        return c.json(200, {
            message: "Sync complete",
            updated: updated,
            failed: failed,
            skipped: skipped,
            total: records.length,
            logs: logs
        });
    } catch (e) {
        return c.json(500, { error: e.toString() });
    }
});
