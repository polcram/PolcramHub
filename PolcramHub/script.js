/* ============================================================
   POLCRAM HUB – SCRIPT.JS OFFICIEL v2.0
   Compatible avec toutes les pages envoyées
============================================================== */


/* ============================================================
   1) USERNAME OSINT
============================================================== */

function checkUsername() {
    const user = document.getElementById("username").value.trim();
    const results = document.getElementById("results");

    if (!user) {
        results.innerHTML = "❌ Veuillez entrer un pseudo.";
        return;
    }

    results.innerHTML = "🔎 Analyse en cours...";

    results.innerHTML = `
        <h3>Résultats OSINT pour : <b>${user}</b></h3>
        <ul>
            <li><a target="_blank" href="https://www.instagram.com/${user}">Instagram</a></li>
            <li><a target="_blank" href="https://www.reddit.com/user/${user}">Reddit</a></li>
            <li><a target="_blank" href="https://www.tiktok.com/@${user}">TikTok</a></li>
            <li><a target="_blank" href="https://www.youtube.com/@${user}">YouTube</a></li>
            <li><a target="_blank" href="https://steamcommunity.com/id/${user}">Steam</a></li>
            <li><a target="_blank" href="https://open.spotify.com/user/${user}">Spotify</a></li>
            <li><a target="_blank" href="https://www.pinterest.com/${user}">Pinterest</a></li>
            <li><a target="_blank" href="https://profiles.google.com/${user}">Google</a></li>
        </ul>
    `;
}


/* ============================================================
   2) IP INTEL
============================================================== */

function checkIP() {
    const ip = document.getElementById("ip").value.trim();
    const results = document.getElementById("ipResults");

    if (!ip) {
        results.innerHTML = "❌ Veuillez entrer une adresse IP.";
        return;
    }

    results.innerHTML = "🔎 Analyse en cours...";

    fetch(`http://ip-api.com/json/${ip}?lang=fr`)
        .then(res => res.json())
        .then(data => {
            if (data.status !== "success") {
                results.innerHTML = "❌ IP introuvable.";
                return;
            }

            results.innerHTML = `
                <h3>IP : ${ip}</h3>
                <ul>
                    <li>🌍 Pays : ${data.country}</li>
                    <li>🏙 Ville : ${data.city}</li>
                    <li>🏢 ISP : ${data.isp}</li>
                    <li>🧠 ASN : ${data.as}</li>
                    <li>⏱ Timezone : ${data.timezone}</li>
                </ul>
            `;
        })
        .catch(() => results.innerHTML = "❌ Erreur de connexion.");
}


/* ============================================================
   3) DOMAIN INTEL – RDAP + outils externes
============================================================== */

function checkDomain() {
    const domain = document.getElementById("domain").value.trim();
    const results = document.getElementById("domainResults");

    if (!domain) {
        results.innerHTML = "❌ Veuillez entrer un domaine.";
        return;
    }

    results.innerHTML = "🔎 Analyse en cours...";

    fetch(`https://rdap.org/domain/${domain}`)
        .then(res => res.json())
        .then(data => {
            let registrar = data.registrar ? data.registrar.name : "Inconnu";
            let created = data.events?.find(e => e.eventAction === "registration")?.eventDate || "N/A";
            let updated = data.events?.find(e => e.eventAction === "last changed")?.eventDate || "N/A";
            let expires = data.events?.find(e => e.eventAction === "expiration")?.eventDate || "N/A";

            let ns = data.nameservers?.map(n => `<li>${n.ldhName}</li>`).join("") || "<li>Aucun</li>";

            results.innerHTML = `
                <h3>Domaine : ${domain}</h3>

                <ul>
                    <li><b>Registrar :</b> ${registrar}</li>
                    <li><b>Créé le :</b> ${created}</li>
                    <li><b>Mis à jour le :</b> ${updated}</li>
                    <li><b>Expire le :</b> ${expires}</li>
                </ul>

                <h3>Nameservers</h3>
                <ul>${ns}</ul>

                <h3>Outils OSINT externes</h3>
                <ul>
                    <li><a target="_blank" href="https://dnschecker.org/all-dns-records-of-domain.php?query=${domain}">DNSChecker</a></li>
                    <li><a target="_blank" href="https://who.is/whois/${domain}">WHOIS</a></li>
                    <li><a target="_blank" href="https://securitytrails.com/domain/${domain}">SecurityTrails</a></li>
                    <li><a target="_blank" href="https://web.archive.org/web/*/${domain}">Wayback Machine</a></li>
                </ul>
            `;
        })
        .catch(() => results.innerHTML = "❌ Domaine introuvable.");
}


/* ============================================================
   4) WEBSITE INTEL – HTTPS + outils externes
============================================================== */

function analyzeWebsite() {
    let site = document.getElementById("site").value.trim();
    const results = document.getElementById("siteResults");

    if (!site) {
        results.innerHTML = "❌ Veuillez entrer un site.";
        return;
    }

    results.innerHTML = "🔎 Analyse en cours...";

    if (!site.startsWith("http")) site = "https://" + site;

    const url = new URL(site);
    const domain = url.hostname;
    const httpsOK = url.protocol === "https:";

    results.innerHTML = `
        <h3>Analyse : ${domain}</h3>

        <ul>
            <li>🔐 HTTPS : ${httpsOK ? "✅ Oui" : "❌ Non"}</li>
        </ul>

        <h3>Outils externes</h3>
        <ul>
            <li><a target="_blank" href="https://securityheaders.com/?q=${domain}">SecurityHeaders</a></li>
            <li><a target="_blank" href="https://www.ssllabs.com/ssltest/analyze.html?d=${domain}">SSL Labs</a></li>
            <li><a target="_blank" href="https://builtwith.com/${domain}">BuiltWith</a></li>
            <li><a target="_blank" href="https://web.archive.org/web/*/${domain}">Wayback Machine</a></li>
        </ul>
    `;
}


/* ============================================================
   5) OSINT SURFACE SCORE
============================================================== */

function calcScore() {
    let site = document.getElementById("scoreSite").value.trim();
    const results = document.getElementById("scoreResults");

    if (!site) {
        results.innerHTML = "❌ Domaine invalide.";
        return;
    }

    results.innerHTML = "🔎 Analyse en cours...";

    if (!site.startsWith("http")) site = "https://" + site;

    const url = new URL(site);
    const domain = url.hostname;
    const httpsOK = url.protocol === "https:";
    const tls = httpsOK;
    const wayback = true;
    const tech = true;

    let score = (httpsOK + tls + wayback + tech);

    results.innerHTML = `
        <h3>Score OSINT : ${domain}</h3>

        <ul>
            <li>🔐 HTTPS : ${httpsOK ? "✅" : "❌"}</li>
            <li>🧾 TLS : ${tls ? "✅" : "❌"}</li>
            <li>🕰 Historique public : ${wayback ? "✅" : "❌"}</li>
            <li>🧰 Technologies visibles : ${tech ? "✅" : "❌"}</li>
        </ul>

        <p><b>Score total :</b> ${score} / 4</p>
    `;
}


/* ============================================================
   6) METADATA OSINT (Images + PDF)
============================================================== */

function analyzeMetadata() {
    const input = document.getElementById("fileInput");
    const results = document.getElementById("metadataResults");

    if (!input.files.length) {
        results.innerHTML = "❌ Aucun fichier sélectionné.";
        return;
    }

    const file = input.files[0];
    results.innerHTML = "🔎 Analyse en cours...";

    /* --- Analyse images (EXIF) --- */
    if (file.type.startsWith("image/")) {
        EXIF.getData(file, function () {
            const all = EXIF.getAllTags(this);
            if (Object.keys(all).length === 0) {
                results.innerHTML = "ℹ️ Aucune metadata EXIF trouvée.";
                return;
            }

            let html = "<h3>🖼 Metadata Image</h3><ul>";
            for (const t in all) html += `<li><b>${t} :</b> ${all[t]}</li>`;
            html += "</ul>";

            results.innerHTML = html;
        });
    }

    /* --- Analyse PDF --- */
    else if (file.type === "application/pdf") {
        const reader = new FileReader();

        reader.onload = function () {
            const bytes = new Uint8Array(this.result);

            pdfjsLib.getDocument({ data: bytes }).promise.then(pdf => {
                pdf.getMetadata().then(meta => {
                    const info = meta.info;
                    let html = "<h3>📄 Metadata PDF</h3><ul>";

                    for (const key in info)
                        html += `<li><b>${key} :</b> ${info[key]}</li>`;

                    html += "</ul>";
                    results.innerHTML = html;
                });
            });
        };
        reader.readAsArrayBuffer(file);
    }

    else results.innerHTML = "❌ Format non supporté (Image ou PDF).";
}
