export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { search = '', type = 'live' } = req.query;

    if (search.length < 3) {
        return res.send("#EXTM3U\n#EXTINF:-1,Search min 3 chars\nhttp://google.com");
    }

    const host = "http://datahub11.com";
    const username = "0AEHQ64ukI";
    const password = "50yxz17DyG";

    let action = 'get_live_streams';
    if (type === 'vod') action = 'get_vod_streams';
    if (type === 'series') action = 'get_series';

    const apiUrl = `${host}/player_api.php?username=${username}&password=${password}&action=${action}`;

    try {
        const apiResponse = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        if (!apiResponse.ok) {
            return res.send("#EXTM3U\n#EXTINF:-1,Server Connection Failed\nhttp://error.com");
        }

        const items = await apiResponse.json();

        if (!Array.isArray(items)) {
            return res.send("#EXTM3U\n#EXTINF:-1,Invalid Data From Provider\nhttp://error.com");
        }

        let m3uResponse = "#EXTM3U\n";
        const query = search.toLowerCase();

        for (const item of items) {
            if (item.name && item.name.toLowerCase().includes(query)) {
                let finalUrl = "";
                
                if (type === 'live') {
                    finalUrl = `${host}/live/${username}/${password}/${item.stream_id}.ts`;
                } else if (type === 'vod') {
                    const ext = item.container_extension || 'mp4';
                    finalUrl = `${host}/movie/${username}/${password}/${item.stream_id}.${ext}`;
                } else if (type === 'series') {
                    finalUrl = `SERIES_ID:${item.series_id}`;
                }

                const logo = item.cover || item.stream_icon || '';
                m3uResponse += `#EXTINF:-1 tvg-logo="${logo}",${item.name}\n${finalUrl}\n`;
            }
        }

        return res.send(m3uResponse);

    } catch (error) {
        return res.send("#EXTM3U\n#EXTINF:-1,Server Connection Failed\nhttp://error.com");
    }
}
