/// <reference path="../pb_data/types.d.ts" />

/**
 * Command: fix-missing-images
 * Usage: ./pocketbase fix-missing-images
 */
$app.rootCmd.addCommand(new Command({
    use: "fix-missing-images",
    run: (cmd, args) => {
        console.log("🛠️  STARTING IMAGE FIX...");
        const app = $app;

        const imageMap = {
            "cooke-s8i-set": "https://cvp.com/images/products/altimage/17-03-20221647514309cooke-s8i-ff-lenses.jpg",
            "hollyland-cosmo-c1": "https://cdn.cvp.com/images/products/altimage/hollyland-cosmo-c1.jpg",
            "canon-tse-45mm": "https://static.bhphoto.com/images/images500x500/Canon_2536A004_Tilt_Shift_TS_E_45mm_163458.jpg",
            "dino-light-24k": "https://www.tsf.fr/wp-content/uploads/2017/12/DINO-24-1-0.png",
            "aputure-600d-pro": "https://cdn.cvp.com/images/products/altimage/aputure-ls-600d-pro-v-mount.jpg",
            "schneider-nd-03": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/Tiffen_45650ND3_4_x_5_65_Neutral_1636720564_86014.jpg",
            "schneider-true-pol": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/Schneider_68013056_True_Polarizing_Filter_4_x_1565868205_398939.jpg",
            "moviebird-45": "https://eurogrip.com/media/com_jmsproduct/tmpl/83/MB45-2-tlo-6-znak-wodny800px.png",
            "manfrotto-autopoles": "https://www.bhphotovideo.com/cdn-cgi/image/fit=scale-down,width=500,quality=95/https://www.bhphotovideo.com/images/images500x500/Manfrotto_076SET_076SET_Short_Autopoles_1233192889_560187.jpg",
            "barracuda-bar": "https://turtlemaxlocation.com/wp-content/uploads/2019/02/jeu-de-barres-scaled.jpg"
        };

        const headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        };

        for (const [slug, url] of Object.entries(imageMap)) {
            try {
                const record = app.findFirstRecordByFilter("equipment", `slug='${slug}'`);

                if (record.get("image")) {
                    console.log(`✅ [${slug}] Already has image.`);
                    continue;
                }

                console.log(`⬇️  Downloading for [${slug}]...`);

                const res = $http.send({
                    url: url,
                    method: "GET",
                    headers: headers,
                    timeout: 15
                });

                if (res.statusCode === 200) {
                    const ext = url.includes(".png") ? ".png" : ".jpg";
                    const file = $filesystem.fileFromBytes(res.raw, `${slug}${ext}`);

                    record.set("image", file);
                    app.save(record);
                    console.log(`   ✨ Success! Attached image.`);
                } else {
                    console.log(`   ❌ Failed download: Status ${res.statusCode}`);
                }

            } catch (e) {
                console.log(`   ⚠️  Error processing [${slug}]: ${e.message}`);
            }
        }

        console.log("🏁 FIX COMPLETE.");
    }
}));
