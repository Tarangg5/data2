const fetch = require('node-fetch'); // Vercel Node.js environment ke liye

module.exports = async (req, res) => {
    // 1. URL se stream ID nikalna (?id=660641)
    const { id } = req.query;

    if (!id) {
        return res.status(400).send("Error: Stream ID missing!");
    }

    // 2. Apne credentials yahan secure rakhein
    // Server badalne par bas yahan host change karein
    const currentHost = "http://datahub11.com"; 
    const username = "0AEHQ64ukI";
    const password = "50yxz17DyG";

    // Asli IPTV URL taiyar karna
    const realIPTVURL = `${currentHost}/index.php?username=${username}&password=${password}&stream=${id}`;

    try {
        // 3. IPTV Server se stream fetch karna
        const response = await fetch(realIPTVURL, {
            headers: {
                'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0'
            }
        });

        // CORS Headers set karna taaki player me block na ho
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', response.headers.get('content-type') || 'video/mp2t');

        // 4. Video data ko client/player ko pipe (forward) karna
        response.body.pipe(res);

    } catch (error) {
        return res.status(500).send("Server Connection Error");
    }
};
