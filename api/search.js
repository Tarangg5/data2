/**
 * Universal IPTV Converter (Stalker / Xtream / Mac)
 * FIXED: Exact Match for Metrics JSON and Version String
 */

// ==========================================
// 1. THE UI SKIN (HTML/CSS/JS)
// ==========================================
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Universal IPTV Converter</title>
    <style>
        :root {
            --bg: #0f172a; --card: #1e293b; --input: #334155;
            --text: #f1f5f9; --muted: #94a3b8; --accent: #06b6d4;
            --border: #475569; --tab-bg: #1e293b; --tab-active: #06b6d4;
        }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: var(--bg); color: var(--text); margin: 0; padding: 20px; display: flex; justify-content: center; min-height: 100vh; }
        .container { width: 100%; max-width: 600px; }
        .card { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.5); }
        h1 { margin-top: 0; font-size: 1.5rem; color: var(--accent); text-align: center; }
        .subtitle { color: var(--muted); font-size: 0.9rem; text-align: center; margin-bottom: 20px; }

        /* Tabs */
        .tabs { display: flex; margin-bottom: 20px; border-bottom: 1px solid var(--border); }
        .tab-btn { flex: 1; padding: 12px; background: transparent; border: none; color: var(--muted); cursor: pointer; font-weight: bold; transition: 0.3s; border-bottom: 2px solid transparent; }
        .tab-btn:hover { color: var(--text); background: rgba(255,255,255,0.05); }
        .tab-btn.active { color: var(--tab-active); border-bottom: 2px solid var(--tab-active); }

        /* Forms */
        .form-section { display: none; animation: fadeIn 0.3s; }
        .form-section.active { display: block; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .input-group { margin-bottom: 15px; }
        label { display: block; font-size: 0.85rem; color: var(--muted); margin-bottom: 5px; }
        input, select { width: 100%; padding: 10px; border-radius: 6px; border: 1px solid var(--border); background: var(--input); color: var(--text); box-sizing: border-box; }
        
        button { width: 100%; padding: 12px; background: var(--accent); color: #000; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 1rem; margin-top: 10px; transition: 0.2s; }
        button:hover { opacity: 0.9; transform: translateY(-1px); }
        button.btn-copy { background: #475569; color: #fff; margin-top: 10px; padding: 8px; font-size: 0.9rem; }
        
        .result { margin-top: 20px; padding: 15px; background: rgba(0,0,0,0.3); border-radius: 8px; display: none; border: 1px solid var(--accent); }
        .result-item { margin-bottom: 15px; }
        .result-item label { color: var(--accent); font-weight: bold; }
        .result a { color: var(--muted); word-break: break-all; text-decoration: none; display: block; margin-bottom: 5px; font-size: 0.9rem; }
        .result a:hover { text-decoration: underline; color: var(--text); }
        
        .note { font-size: 0.75rem; color: #f87171; margin-top: 4px; }
        .info { font-size: 0.8rem; color: #94a3b8; margin-bottom: 10px; line-height: 1.4; }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <h1>Universal Converter</h1>
            <p class="subtitle">Stalker • Xtream • Mac to M3U</p>
            
            <div class="tabs">
                <button class="tab-btn active" onclick="openTab('stalker')">Stalker</button>
                <button class="tab-btn" onclick="openTab('xtream')">Xtream</button>
                <button class="tab-btn" onclick="openTab('mac')">Mac</button>
            </div>

            <!-- STALKER FORM -->
            <div id="stalker" class="form-section active">
                <div class="input-group">
                    <label>Portal Host</label>
                    <input type="text" id="stalker_host" placeholder="89.187.191.54">
                </div>
                <div class="input-group">
                    <label>Portal Path</label>
                    <input type="text" id="stalker_path" placeholder="/stalker_portal/" value="/stalker_portal/">
                    <div class="note">Most servers use /stalker_portal/. If API is at root, leave this empty or use /</div>
                </div>
                <div class="input-group">
                    <label>MAC Address</label>
                    <input type="text" id="stalker_mac" placeholder="00:1A:79:XX:XX:XX">
                </div>
                <div class="input-group" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div><label>Device ID</label><input type="text" id="stalker_deviceId"></div>
                    <div><label>Device ID 2</label><input type="text" id="stalker_deviceId2"></div>
                </div>
                <div class="input-group">
                    <label>Serial Number</label>
                    <input type="text" id="stalker_serial">
                </div>
                <div class="input-group">
                    <label>STB Type</label>
                    <select id="stalker_type">
                        <option value="MAG250">MAG250</option>
                        <option value="MAG254">MAG254</option>
                        <option value="MAG324">MAG324</option>
                        <option value="MAG420">MAG420</option>
                    </select>
                </div>
                <button onclick="generateStalker()">Generate Stalker Links</button>
            </div>

            <!-- XTREAM FORM -->
            <div id="xtream" class="form-section">
                <div class="input-group">
                    <label>Host Name</label>
                    <input type="text" id="xtream_host" placeholder="example.com">
                </div>
                <div class="input-group">
                    <label>Username</label>
                    <input type="text" id="xtream_user" placeholder="Username">
                </div>
                <div class="input-group">
                    <label>Password</label>
                    <input type="text" id="xtream_pass" placeholder="Password">
                </div>
                <button onclick="generateXtream()">Generate Xtream Links</button>
            </div>

            <!-- MAC FORM -->
            <div id="mac" class="form-section">
                <div class="info">
                    <strong>Auto-Login Mode:</strong> Enter your Portal URL and MAC. The worker will auto-detect the path and generate required login details.
                </div>
                <div class="input-group">
                    <label>Full Portal URL</label>
                    <input type="text" id="mac_panel" placeholder="http://domain.com/c/">
                    <div class="note">e.g. http://89.187.191.54/stalker_portal/c/</div>
                </div>
                <div class="input-group">
                    <label>MAC Address</label>
                    <input type="text" id="mac_addr" placeholder="00:1A:79:XX:XX:XX">
                </div>
                <button onclick="generateMac()">Generate Links</button>
            </div>

            <!-- RESULT BOX -->
            <div class="result" id="resultBox">
                <!-- Stalker Results -->
                <div id="res_stalker">
                    <div class="result-item">
                        <label>M3U Playlist:</label>
                        <a href="#" id="stalker_m3u" target="_blank">...</a>
                        <button class="btn-copy" onclick="copyText('stalker_m3u')">Copy M3U</button>
                    </div>
                    <div class="result-item">
                        <label>EPG (XMLTV) Link:</label>
                        <a href="#" id="stalker_epg" target="_blank">...</a>
                        <button class="btn-copy" onclick="copyText('stalker_epg')">Copy EPG</button>
                    </div>
                </div>

                <!-- Xtream Results -->
                <div id="res_xtream" style="display:none;">
                    <div class="info">M3U converted to Stalker format. Streams point to this Worker.</div>
                    <div class="result-item">
                        <label>Converted M3U Playlist:</label>
                        <a href="#" id="xtream_m3u" target="_blank">...</a>
                        <button class="btn-copy" onclick="copyText('xtream_m3u')">Copy M3U</button>
                    </div>
                    <div class="result-item">
                        <label>EPG (XMLTV) Link:</label>
                        <a href="#" id="xtream_epg" target="_blank">...</a>
                        <button class="btn-copy" onclick="copyText('xtream_epg')">Copy EPG</button>
                    </div>
                    <div class="result-item">
                        <label>Portal Link (For OTT Navigator):</label>
                        <div class="info" style="margin-bottom:5px">Use this if the M3U above doesn't load categories in OTT Navigator.</div>
                        <a href="#" id="xtream_api" target="_blank">...</a>
                        <button class="btn-copy" onclick="copyText('xtream_api')">Copy Portal</button>
                    </div>
                </div>

                <!-- Mac Results (Now outputs Stalker style) -->
                <div id="res_mac" style="display:none;">
                    <div class="info">Auto-Generated M3U (Stalker Protocol)</div>
                    <div class="result-item">
                        <label>M3U Playlist:</label>
                        <a href="#" id="mac_m3u" target="_blank">...</a>
                        <button class="btn-copy" onclick="copyText('mac_m3u')">Copy M3U</button>
                    </div>
                    <div class="result-item">
                        <label>EPG (XMLTV) Link:</label>
                        <a href="#" id="mac_epg" target="_blank">...</a>
                        <button class="btn-copy" onclick="copyText('mac_epg')">Copy EPG</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        function openTab(tabName) {
            document.querySelectorAll('.form-section').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
            document.getElementById(tabName).classList.add('active');
            event.target.classList.add('active');
            document.getElementById('resultBox').style.display = 'none';
        }

        function showResult(type, links) {
            document.getElementById('resultBox').style.display = 'block';
            document.getElementById('res_stalker').style.display = 'none';
            document.getElementById('res_xtream').style.display = 'none';
            document.getElementById('res_mac').style.display = 'none';

            if(type === 'stalker') {
                document.getElementById('res_stalker').style.display = 'block';
                document.getElementById('stalker_m3u').href = links.m3u;
                document.getElementById('stalker_m3u').innerText = links.m3u;
                document.getElementById('stalker_epg').href = links.epg;
                document.getElementById('stalker_epg').innerText = links.epg;
            } else if (type === 'xtream') {
                document.getElementById('res_xtream').style.display = 'block';
                document.getElementById('xtream_m3u').href = links.m3u;
                document.getElementById('xtream_m3u').innerText = links.m3u;
                document.getElementById('xtream_epg').href = links.epg;
                document.getElementById('xtream_epg').innerText = links.epg;
                document.getElementById('xtream_api').href = links.api;
                document.getElementById('xtream_api').innerText = links.api;
            } else if (type === 'mac') {
                document.getElementById('res_mac').style.display = 'block';
                document.getElementById('mac_m3u').href = links.m3u;
                document.getElementById('mac_m3u').innerText = links.m3u;
                document.getElementById('mac_epg').href = links.epg;
                document.getElementById('mac_epg').innerText = links.epg;
            }
        }

        function generateStalker() {
            const host = document.getElementById('stalker_host').value.trim();
            const path = document.getElementById('stalker_path').value.trim();
            const mac = document.getElementById('stalker_mac').value.trim();
            const serial = document.getElementById('stalker_serial').value.trim();
            const deviceId = document.getElementById('stalker_deviceId').value.trim();
            const deviceId2 = document.getElementById('stalker_deviceId2').value.trim();
            const stbType = document.getElementById('stalker_type').value;

            if (!host || !mac) { alert("Host and MAC required"); return; }

            const params = new URLSearchParams({ 
                host: host, path: path, mac: mac, serial: serial, 
                device_id: deviceId, device_id_2: deviceId2, stb_type: stbType 
            });
            const origin = window.location.origin;
            showResult('stalker', {
                m3u: origin + '/playlist.m3u8?' + params.toString(),
                epg: origin + '/epg.xml?' + params.toString()
            });
        }

        function generateXtream() {
            const host = document.getElementById('xtream_host').value.trim();
            const user = document.getElementById('xtream_user').value.trim();
            const pass = document.getElementById('xtream_pass').value.trim();

            if (!host || !user || !pass) { alert("All fields required"); return; }

            const params = new URLSearchParams({ host: host, username: user, password: pass });
            const origin = window.location.origin;
            
            const m3uLink = origin + '/xtream_convert?' + params.toString();
            const epgLink = origin + '/xtream_epg?' + params.toString();
            const apiLink = origin + '/xtream_api?' + params.toString();

            showResult('xtream', { m3u: m3uLink, epg: epgLink, api: apiLink });
        }

        function generateMac() {
            let panel = document.getElementById('mac_panel').value.trim();
            const mac = document.getElementById('mac_addr').value.trim();

            if (!panel || !mac) { alert("Panel URL and MAC required"); return; }
            
            if (!panel.endsWith('/')) panel += '/';

            const params = new URLSearchParams({ panel: panel, mac: mac });
            const origin = window.location.origin;
            
            // Now Mac uses the Stalker backend but with auto-gen params
            showResult('mac', { 
                m3u: origin + '/mac.m3u?' + params.toString(), 
                epg: origin + '/mac_epg.xml?' + params.toString() 
            });
        }

        function copyText(elementId) {
            const text = document.getElementById(elementId).innerText;
            navigator.clipboard.writeText(text).then(() => {
                const btn = document.activeElement;
                const original = btn.innerText;
                btn.innerText = "Copied!";
                setTimeout(() => btn.innerText = original, 2000);
            });
        }
    </script>
</body>
</html>
`;

// ==========================================
// 2. WORKER LOGIC
// ==========================================

// --- Stalker Config & Helpers ---
const defaultStalkerConfig = {
    host: '', path: '/stalker_portal/', mac_address: '', serial_number: '',
    device_id: '', device_id_2: '', stb_type: 'MAG250', api_signature: '263',
};

async function generateConfigFromMac(panelUrl, mac) {
    try {
        const urlObj = new URL(panelUrl);
        let host = urlObj.hostname;
        let path = urlObj.pathname; 

        if (path.endsWith('/c/')) {
            path = path.slice(0, -3);
        }
        if (path === '' || path === '/') {
            path = '/';
        }

        const seed = mac.replace(/:/g, '');
        const serial = (await hash(mac)).substring(0, 16).toUpperCase();
        const deviceId = (await hash(seed + '1')).substring(0, 32);
        const deviceId2 = (await hash(seed + '2')).substring(0, 32);

        return {
            host: host,
            path: path,
            mac_address: mac,
            serial_number: serial,
            device_id: deviceId,
            device_id_2: deviceId2,
            stb_type: 'MAG250',
            api_signature: '263'
        };
    } catch (e) {
        return null;
    }
}

function getStalkerConfig(request) {
    const url = new URL(request.url);
    const params = url.searchParams;
    let path = params.get('path') || defaultStalkerConfig.path;
    if (!path.startsWith('/')) path = '/' + path;
    if (path.endsWith('/')) path = path.slice(0, -1);

    return {
        host: params.get('host') || defaultStalkerConfig.host,
        path: path,
        mac_address: params.get('mac') || defaultStalkerConfig.mac_address,
        serial_number: params.get('serial') || defaultStalkerConfig.serial_number,
        device_id: params.get('device_id') || defaultStalkerConfig.device_id,
        device_id_2: params.get('device_id_2') || defaultStalkerConfig.device_id_2,
        stb_type: params.get('stb_type') || defaultStalkerConfig.stb_type,
        api_signature: params.get('api_signature') || defaultStalkerConfig.api_signature,
    };
}

async function hash(str) {
    const data = new TextEncoder().encode(str);
    const digest = await crypto.subtle.digest('MD5', data);
    return Array.from(new Uint8Array(digest)).map(x => x.toString(16).padStart(2, '0')).join('');
}

// Helper to generate random hex string
function getRandomHex(length) {
    const chars = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

async function generateHardwareVersions(config) {
    const hw = '1.7-BD-' + (await hash(config.mac_address)).substring(0, 2).toUpperCase();
    const hw2 = await hash(config.serial_number.toLowerCase() + config.mac_address.toLowerCase());
    config.hw_version = hw;
    config.hw_version_2 = hw2;
}

function getHeaders(config, token = '') {
    const refererPath = config.path === '/' ? '/c/' : config.path + '/c/';
    return {
        'Cookie': `mac=${config.mac_address}; stb_lang=en; timezone=GMT`,
        'Referer': `http://${config.host}${refererPath}`,
        'User-Agent': 'Mozilla/5.0 (QtEmbedded; U; Linux; C) AppleWebKit/533.3 (KHTML, like Gecko) MAG200 stbapp ver: 2 rev: 250 Safari/533.3',
        'X-User-Agent': `Model: ${config.stb_type}; Link: WiFi`,
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
}

async function fetchStalkerToken(config) {
    const url = `http://${config.host}${config.path}/server/load.php?type=stb&action=handshake&token=&JsHttpRequest=1-xml`;
    try {
        const response = await fetch(url, { headers: getHeaders(config) });
        if (!response.ok) return '';
        const text = await response.text();
        return JSON.parse(text).js?.token || '';
    } catch (e) { return ''; }
}

async function authStalker(config, token) {
    // Updated Metrics JSON to match logs exactly
    const metrics = {
        mac: config.mac_address,
        sn: config.serial_number,
        model: config.stb_type,
        type: 'STB',
        uid: '',
        device: config.device_id,
        random: getRandomHex(32) // FIX: Added random string
    };
    const metricsEncoded = encodeURIComponent(JSON.stringify(metrics));
    const timestamp = Math.floor(Date.now() / 1000);

    // Updated 'ver' string to be more complete
    const verString = `ImageDescription:%200.2.18-r14-pub-250;%20ImageDate:%20${new Date().toUTCString().replace(/ /g, '%20')};%20PORTAL%20version:%205.5.0;%20API%20Version:%20JS%20API%20version:%20328;%20STB%20API%20version:%20134;%20Player%20Engine%20version:%200x566`;

    const url = `http://${config.host}${config.path}/server/load.php?type=stb&action=get_profile`
        + `&hd=1&ver=${verString}`
        + `&num_banks=2&sn=${config.serial_number}`
        + `&stb_type=${config.stb_type}&client_type=STB&image_version=218&video_out=hdmi`
        + `&device_id=${config.device_id}&device_id2=${config.device_id_2}`
        + `&signature=&auth_second_step=1&hw_version=${config.hw_version}`
        + `&not_valid_token=0&metrics=${metricsEncoded}`
        + `&hw_version_2=${config.hw_version_2}&api_signature=${config.api_signature}`
        + `&prehash=&timestamp=${timestamp}`
        + `&JsHttpRequest=1-xml`;

    try {
        const response = await fetch(url, { headers: getHeaders(config, token) });
        if (!response.ok) return [];
        const text = await response.text();
        return JSON.parse(text).js || [];
    } catch (e) { return []; }
}

async function handshakeStalker(config, token) {
    const url = `http://${config.host}${config.path}/server/load.php?type=stb&action=handshake&token=${token}&JsHttpRequest=1-xml`;
    try {
        const response = await fetch(url, { headers: getHeaders(config) });
        if (!response.ok) return '';
        const text = await response.text();
        return JSON.parse(text).js?.token || '';
    } catch (e) { return ''; }
}

async function getAccountInfo(config, token) {
    const url = `http://${config.host}${config.path}/server/load.php?type=account_info&action=get_main_info&JsHttpRequest=1-xml`;
    try {
        const response = await fetch(url, { headers: getHeaders(config, token) });
        if (!response.ok) return [];
        const text = await response.text();
        return JSON.parse(text).js || [];
    } catch (e) { return []; }
}

async function getGenres(config, token) {
    const url = `http://${config.host}${config.path}/server/load.php?type=itv&action=get_genres&JsHttpRequest=1-xml`;
    try {
        const response = await fetch(url, { headers: getHeaders(config, token) });
        if (!response.ok) return [];
        const text = await response.text();
        return JSON.parse(text).js || [];
    } catch (e) { return []; }
}

async function getStalkerStreamURL(config, token, id) {
    const url = `http://${config.host}${config.path}/server/load.php?type=itv&action=create_link&cmd=ffrt%20http://localhost/ch/${id}&JsHttpRequest=1-xml`;
    try {
        const response = await fetch(url, { headers: getHeaders(config, token) });
        if (!response.ok) return '';
        const text = await response.text();
        return JSON.parse(text).js?.cmd || '';
    } catch (e) { return ''; }
}

async function genStalkerToken(config) {
    await generateHardwareVersions(config);
    const token = await fetchStalkerToken(config);
    if (!token) return { token: '', profile: [], account_info: [] };
    const profile = await authStalker(config, token);
    const newToken = await handshakeStalker(config, token);
    if (!newToken) return { token: '', profile, account_info: [] };
    const account_info = await getAccountInfo(config, newToken);
    return { token: newToken, profile, account_info };
}

async function convertJsonToM3U(channels, config, requestUrl) {
    const urlObj = new URL(requestUrl);
    const searchString = urlObj.search;
    const origin = urlObj.origin;
    const epgRoute = urlObj.pathname.includes('mac') ? '/mac_epg.xml' : '/epg.xml';
    const epgUrl = `${origin}${epgRoute}${searchString}`;

    let m3u = [
        `#EXTM3U x-tvg-url="${epgUrl}"`,
        `# Total Channels => ${channels.length}`,
        '# Generated by Stalker Worker', ''
    ];

    m3u.push(`#EXTINF:-1 tvg-logo="https://upload.wikimedia.org/wikipedia/commons/6/6f/IPTV.png" group-title="Info",Portal: ${config.host}`);
    m3u.push('https://vaathala.vercel.app/intro.m3u8');

    if (!channels.length) return m3u.join('\n');

    channels.forEach(channel => {
        let cmd = channel.cmd || '';
        let real_cmd = cmd.replace('ffrt http://localhost/ch/', '');
        if (!real_cmd) real_cmd = 'unknown';
        const logo_url = channel.logo ? `http://${config.host}${config.path}/misc/logos/320/${channel.logo}` : '';
        const channel_stream_url = `${origin}/${real_cmd}.m3u8${searchString}`;
        m3u.push(`#EXTINF:-1 tvg-id="${channel.tvgid}" tvg-name="${channel.name}" tvg-logo="${logo_url}" group-title="${channel.title}",${channel.name}`);
        m3u.push(channel_stream_url);
    });

    return m3u.join('\n');
}

// ==========================================
// 3. MAIN ROUTER
// ==========================================

// ISKO PASTE KAREIN:
export const config = {
    runtime: 'edge', // Vercel ko batayega ki ise Edge par chalana hai
};

export default async function handler(request) {
    return handleRequest(request);
}


async function handleRequest(request) {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const lastPart = pathParts[pathParts.length - 1];

    // 1. Serve HTML UI
    if (url.pathname === '/') {
        return new Response(htmlContent, { headers: { 'Content-Type': 'text/html;charset=UTF-8' } });
    }

    // ==========================================
    // ROUTE: MAC M3U (Auto-Login Stalker)
    // ==========================================
    if (url.pathname === '/mac.m3u') {
        const panel = url.searchParams.get('panel');
        const mac = url.searchParams.get('mac');

        if (!panel || !mac) return new Response("Missing parameters.", { status: 400 });

        const config = await generateConfigFromMac(panel, mac);
        if (!config) return new Response("Invalid Panel URL", { status: 400 });

        const { token, profile, account_info } = await genStalkerToken(config);
        if (!token) return new Response("Auth Failed. Check MAC and Panel URL.", { status: 500 });

        const channelsUrl = `http://${config.host}${config.path}/server/load.php?type=itv&action=get_all_channels&JsHttpRequest=1-xml`;
        let channelsData;
        try {
            const response = await fetch(channelsUrl, { headers: getHeaders(config, token) });
            const text = await response.text();
            channelsData = JSON.parse(text);
        } catch (e) { return new Response("Error fetching channels.", { status: 500 }); }

        const genresData = await getGenres(config, token);
        const genreMap = {};
        genresData.forEach(g => genreMap[g.id] = g.title);

        let channels = (channelsData.js?.data || []).map(item => ({
            name: item.name || 'Unknown', cmd: item.cmd || '', tvgid: item.xmltv_id || '',
            id: item.tv_genre_id || '', logo: item.logo || ''
        })).map(c => ({ ...c, title: genreMap[c.id] || 'Other' }));

        const m3uContent = await convertJsonToM3U(channels, config, url);
        return new Response(m3uContent, { headers: { 'Content-Type': 'application/vnd.apple.mpegurl' } });
    }

    // ==========================================
    // ROUTE: MAC EPG
    // ==========================================
    if (url.pathname === '/mac_epg.xml') {
        const panel = url.searchParams.get('panel');
        const mac = url.searchParams.get('mac');
        if (!panel || !mac) return new Response("Missing parameters.", { status: 400 });

        const config = await generateConfigFromMac(panel, mac);
        const { token } = await genStalkerToken(config);
        if (!token) return new Response("Auth Failed.", { status: 500 });

        const basePath = `http://${config.host}${config.path}`;
        const possiblePaths = [
            `${basePath}/server/xmltv.php?token=${token}`,
            `${basePath}/server/xmltv.php`,
            `${basePath}/xmltv.php`,
            `${basePath}/../xmltv.php`, 
            `http://${config.host}/xmltv.php` 
        ];

        let epgText = null;
        for (const path of possiblePaths) {
            try {
                const response = await fetch(path, { headers: getHeaders(config, token) });
                if (response.ok) {
                    const text = await response.text();
                    if (text.trim().startsWith('<?xml')) {
                        epgText = text;
                        break; 
                    }
                }
            } catch (e) {}
        }
        
        if (!epgText) {
             for (const path of possiblePaths) {
                try {
                    const httpsPath = path.replace('http://', 'https://');
                    const response = await fetch(httpsPath, { headers: getHeaders(config, token) });
                    if (response.ok) {
                        const text = await response.text();
                        if (text.trim().startsWith('<?xml')) {
                            epgText = text;
                            break;
                        }
                    }
                } catch (e) {}
            }
        }

        if (epgText) {
            return new Response(epgText, {
                headers: { 'Content-Type': 'text/xml; charset=utf-8', 'Access-Control-Allow-Origin': '*' },
            });
        } else {
            return new Response("Could not find EPG file on server.", { status: 404 });
        }
    }

    // ==========================================
    // ROUTE: XTREAM CONVERT M3U
    // ==========================================
    if (url.pathname === '/xtream_convert') {
        const host = url.searchParams.get('host');
        const username = url.searchParams.get('username');
        const password = url.searchParams.get('password');
        
        if (!host || !username || !password) return new Response("Missing parameters.", { status: 400 });

        const sourceUrl = `http://${host}/get.php?username=${username}&password=${password}&type=m3u_plus`;
        const origin = url.origin;
        const epgUrl = `${origin}/xtream_epg?host=${host}&username=${username}&password=${password}`;
        const params = url.searchParams.toString();

        try {
            const response = await fetch(sourceUrl);
            if (!response.ok) throw new Error('Failed to fetch source');

            const { readable, writable } = new TransformStream({
                start(controller) {
                    controller.enqueue(new TextEncoder().encode(`#EXTM3U x-tvg-url="${epgUrl}"\n`));
                    controller.enqueue(new TextEncoder().encode(`# Converted M3U by Worker\n\n`));
                },
                transform(chunk, controller) {
                    const decoder = new TextDecoder();
                    const encoder = new TextEncoder();
                    const text = decoder.decode(chunk, { stream: true });
                    const lines = text.split('\n');

                    lines.forEach(line => {
                        if (line.trim().startsWith('#')) {
                            if (!line.trim().startsWith('#EXTM3U')) {
                                controller.enqueue(encoder.encode(line + '\n'));
                            }
                        } else if (line.trim().length > 0) {
                            const originalUrl = line.trim();
                            let streamId = 'unknown';
                            let extension = 'm3u8';
                            
                            const match = originalUrl.match(/\/(\d+)\.(m3u8|ts|mkv|mp4)/);
                            if (match) {
                                streamId = match[1];
                                extension = match[2];
                            } else {
                                const parts = originalUrl.split('/');
                                const lastPart = parts[parts.length - 1];
                                const dotIndex = lastPart.lastIndexOf('.');
                                if (dotIndex > 0) {
                                    streamId = lastPart.substring(0, dotIndex);
                                    extension = lastPart.substring(dotIndex + 1);
                                }
                            }
                            const newUrl = `${origin}/${streamId}.m3u8?type=xtream&${params}&ext=${extension}`;
                            controller.enqueue(encoder.encode(newUrl + '\n'));
                        }
                    });
                }
            });

            response.body.pipeTo(writable);
            return new Response(readable, {
                headers: { 'Content-Type': 'application/vnd.apple.mpegurl; charset=utf-8' }
            });

        } catch (e) {
            return new Response(`Error converting M3U: ${e.message}`, { status: 500 });
        }
    }

    // ==========================================
    // ROUTE: XTREAM STREAM REDIRECTOR
    // ==========================================
    if (lastPart.endsWith('.m3u8') && lastPart !== 'playlist.m3u8') {
        const type = url.searchParams.get('type');
        
        if (type === 'xtream') {
            const host = url.searchParams.get('host');
            const username = url.searchParams.get('username');
            const password = url.searchParams.get('password');
            const id = lastPart.replace('.m3u8', '');
            const ext = url.searchParams.get('ext') || 'm3u8';

            if (!host || !username || !password || !id) return new Response("Missing parameters", { status: 400 });

            let typePath = 'live'; 
            if (ext === 'mkv' || ext === 'mp4') typePath = 'movie'; 
            
            const targetUrl = `http://${host}/${typePath}/${username}/${password}/${id}.${ext}`;
            return Response.redirect(targetUrl, 302);
        }

        const config = getStalkerConfig(request);
        if (config.host && config.mac_address) {
            const id = lastPart.replace(/\.m3u8$/, '');
            const { token } = await genStalkerToken(config);
            if (!token) return new Response("Auth Failed", { status: 500 });
            const stream = await getStalkerStreamURL(config, token, id);
            if (!stream) return new Response("Stream not found", { status: 404 });
            return Response.redirect(stream, 302);
        }
    }

    // ==========================================
    // ROUTE: XTREAM EPG
    // ==========================================
    if (url.pathname === '/xtream_epg') {
        const host = url.searchParams.get('host');
        const username = url.searchParams.get('username');
        const password = url.searchParams.get('password');
        if (!host || !username || !password) return new Response("Missing parameters", { status: 400 });
        const targetUrl = `http://${host}/xmltv.php?username=${username}&password=${password}`;
        return Response.redirect(targetUrl, 302);
    }

    // ==========================================
    // ROUTE: XTREAM API PROXY
    // ==========================================
    if (url.pathname.startsWith('/xtream_api')) {
        const host = url.searchParams.get('host');
        const username = url.searchParams.get('username');
        const password = url.searchParams.get('password');
        if (!host || !username || !password) return new Response("Missing parameters.", { status: 400 });

        url.searchParams.delete('host');
        let subPath = url.pathname.replace('/xtream_api', '');
        if (subPath === '') subPath = '/player_api.php';

        const targetUrl = `http://${host}${subPath}?${url.searchParams.toString()}`;

        try {
            const response = await fetch(targetUrl, {
                method: request.method,
                headers: request.headers,
                body: request.body
            });
            return new Response(response.body, {
                status: response.status,
                headers: {
                    'Content-Type': response.headers.get('Content-Type') || 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        } catch (e) {
            return new Response(`Error proxying API: ${e.message}`, { status: 500 });
        }
    }

    // ==========================================
    // ROUTE: STALKER EPG
    // ==========================================
    if (url.pathname === '/epg.xml') {
        const config = getStalkerConfig(request);
        if (!config.host || !config.mac_address) return new Response("Missing 'host' or 'mac'.", { status: 400 });

        const { token } = await genStalkerToken(config);
        if (!token) return new Response("Auth Failed.", { status: 500 });

        const basePath = `http://${config.host}${config.path}`;
        const possiblePaths = [
            `${basePath}/server/xmltv.php?token=${token}`,
            `${basePath}/server/xmltv.php`,
            `${basePath}/xmltv.php`,
            `${basePath}/../xmltv.php`,
            `http://${config.host}/xmltv.php`
        ];

        let epgText = null;
        for (const path of possiblePaths) {
            try {
                const response = await fetch(path, { headers: getHeaders(config, token) });
                if (response.ok) {
                    const text = await response.text();
                    if (text.trim().startsWith('<?xml')) {
                        epgText = text;
                        break; 
                    }
                }
            } catch (e) {}
        }
        
        if (!epgText) {
             for (const path of possiblePaths) {
                try {
                    const httpsPath = path.replace('http://', 'https://');
                    const response = await fetch(httpsPath, { headers: getHeaders(config, token) });
                    if (response.ok) {
                        const text = await response.text();
                        if (text.trim().startsWith('<?xml')) {
                            epgText = text;
                            break;
                        }
                    }
                } catch (e) {}
            }
        }

        if (epgText) {
            return new Response(epgText, {
                headers: { 'Content-Type': 'text/xml; charset=utf-8', 'Access-Control-Allow-Origin': '*' },
            });
        } else {
            return new Response("Could not find EPG file on server.", { status: 404 });
        }
    }

    // ==========================================
    // ROUTE: STALKER PLAYLIST
    // ==========================================
    if (url.pathname === '/playlist.m3u8') {
        const config = getStalkerConfig(request);
        if (!config.host || !config.mac_address) return new Response("Missing 'host' or 'mac'.", { status: 400 });

        const { token, profile, account_info } = await genStalkerToken(config);
        if (!token) return new Response("Auth Failed.", { status: 500 });

        const channelsUrl = `http://${config.host}${config.path}/server/load.php?type=itv&action=get_all_channels&JsHttpRequest=1-xml`;
        let channelsData;
        try {
            const response = await fetch(channelsUrl, { headers: getHeaders(config, token) });
            const text = await response.text();
            channelsData = JSON.parse(text);
        } catch (e) { return new Response("Error fetching channels.", { status: 500 }); }

        const genresData = await getGenres(config, token);
        const genreMap = {};
        genresData.forEach(g => genreMap[g.id] = g.title);

        let channels = (channelsData.js?.data || []).map(item => ({
            name: item.name || 'Unknown', cmd: item.cmd || '', tvgid: item.xmltv_id || '',
            id: item.tv_genre_id || '', logo: item.logo || ''
        })).map(c => ({ ...c, title: genreMap[c.id] || 'Other' }));

        const m3uContent = await convertJsonToM3U(channels, config, url);
        return new Response(m3uContent, { headers: { 'Content-Type': 'application/vnd.apple.mpegurl' } });
    }

    return new Response("Not Found", { status: 404 });
}

