const http = require('http');

// Authenticate
const authData = JSON.stringify({ identity: 'zakiossama28@gmail.com', password: 'GloXoss123.' });
const authOpts = {
  hostname: '127.0.0.1', port: 8090,
  path: '/api/collections/_superusers/auth-with-password',
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(authData) }
};

const authReq = http.request(authOpts, (authRes) => {
  let body = '';
  authRes.on('data', c => body += c);
  authRes.on('end', () => {
    const token = JSON.parse(body).token;
    if (!token) { console.log('AUTH FAILED:', body); return; }

    const serviceData = JSON.stringify({
      title: "Equestrian Sports",
      title_fr: "Sports Équestres",
      slug: "equestrian",
      is_active: true,
      template: "default",
      type: "content_page",
      display_order: 110,
      icon: "Horse",
      brief_description: "High-level audiovisual coverage of horse racing and equestrian events in partnership with SOREC.",
      brief_description_fr: "Couverture audiovisuelle de haut niveau des courses hippiques et événements équestres en partenariat avec la SOREC.",
      full_description: "<p>TFS Equestrian Sports delivers high-level audiovisual coverage of horse racing and equestrian events, in strategic partnership with SOREC (Société Royale d'Encouragement du Cheval). From day-to-day race coverage to major events like the Morocco International Meeting, our expertise encompasses complete multi-camera setups, broadcast-quality graphics overlays, and seamless live production workflows. Our team understands the unique demands of equestrian broadcasting — from capturing gate-to-finish action to presenting paddock previews, jockey profiles, and real-time results. With years of proven experience in Moroccan horse racing, TFS is the trusted production partner for bringing the sport to audiences across every platform.</p>",
      full_description_fr: "<p>TFS Sports Équestres propose une couverture audiovisuelle de haut niveau des courses hippiques et des événements équestres, en partenariat stratégique avec la SOREC (Société Royale d'Encouragement du Cheval). De la captation quotidienne des courses aux grands rendez-vous comme le Morocco International Meeting, notre expertise englobe des dispositifs multi-caméras complets, des habillages graphiques de qualité broadcast et des workflows de production en direct fluides. Notre équipe maîtrise les exigences uniques de la diffusion équestre — de l'action du départ à l'arrivée, en passant par les présentations au paddock, les profils des jockeys et les résultats en temps réel. Forts d'années d'expérience éprouvée dans les courses hippiques marocaines, TFS est le partenaire de production de référence pour porter ce sport auprès du public sur toutes les plateformes.</p>",
      features: [
        { title: "Multi-Camera", description: "Complete racecourse coverage from every angle.", icon: "Camera" },
        { title: "Live Graphics", description: "Real-time results, odds, and race overlays.", icon: "BarChart" },
        { title: "SOREC Partnership", description: "Official production partner for years.", icon: "Award" }
      ],
      sections: [
        {
          title: "Complete Racecourse Coverage",
          content: "Our multi-camera setups cover every angle of the racecourse, from gate-to-finish tracking to paddock previews and jockey profiles. We capture the full intensity and atmosphere of horse racing with broadcast-quality precision.",
          layout: "right"
        },
        {
          title: "Live Production & Graphics",
          content: "TFS delivers seamless live production workflows with broadcast-quality graphics overlays including real-time results, odds displays, and race replays. Our technical team ensures flawless execution for both on-site screens and broadcast distribution.",
          layout: "left"
        },
        {
          title: "Major Events & Partnerships",
          content: "From day-to-day race coverage to prestigious events like the Morocco International Meeting, TFS brings years of proven experience in Moroccan horse racing. Our strategic partnership with SOREC makes us the trusted production partner for bringing equestrian sports to audiences across every platform.",
          layout: "right"
        }
      ],
      downloads: null,
      download_files: [],
      sub_services: null,
      stats: null,
      tags: null,
      target_url: "",
      video_url: ""
    });

    const createOpts = {
      hostname: '127.0.0.1', port: 8090,
      path: '/api/collections/services/records',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(serviceData),
        'Authorization': 'Bearer ' + token
      }
    };

    const createReq = http.request(createOpts, (createRes) => {
      let cBody = '';
      createRes.on('data', c => cBody += c);
      createRes.on('end', () => {
        const rec = JSON.parse(cBody);
        if (rec.id) {
          console.log('SUCCESS! Created equestrian service.');
          console.log('  ID:', rec.id);
          console.log('  Slug:', rec.slug);
          console.log('  Title:', rec.title);
          
          // Now update the Sport hub to include equestrian in sub_services
          const currentSubs = ["football","baseball","basketball","motorsports","athletics","combat-sports","tennis","rugby","cycling","extreme-sports"];
          currentSubs.push("equestrian");
          
          const updateData = JSON.stringify({ sub_services: currentSubs });
          const updateOpts = {
            hostname: '127.0.0.1', port: 8090,
            path: '/api/collections/services/records/di7oep5bcat70fr',
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(updateData),
              'Authorization': 'Bearer ' + token
            }
          };
          
          const updateReq = http.request(updateOpts, (updateRes) => {
            let uBody = '';
            updateRes.on('data', c => uBody += c);
            updateRes.on('end', () => {
              const uRec = JSON.parse(uBody);
              if (uRec.sub_services && uRec.sub_services.includes('equestrian')) {
                console.log('SUCCESS! Updated Sport hub sub_services:', JSON.stringify(uRec.sub_services));
              } else {
                console.log('Sport hub update result:', uBody);
              }
            });
          });
          updateReq.write(updateData);
          updateReq.end();
        } else {
          console.log('FAILED to create service:', cBody);
        }
      });
    });
    createReq.write(serviceData);
    createReq.end();
  });
});
authReq.write(authData);
authReq.end();
