export default async function handler(req, res) {
    // 1. URL se stream ID nikalna (?id=2494 ya ?id=660641)
    let { id } = req.query;

    if (!id) {
        return res.status(400).send("Error: Stream ID missing!");
    }

    // Agar ID ke saath .ts likha ho, toh use saaf karna
    id = id.replace('.ts', '');

    // 2. Naya Host IP jo aapne nikaala aur aapke credentials
    const currentHost = "http://188.241.218.179:80"; // Agar bina port ke na chale toh :80 ya :8080 lagta hai, abhi standard rakhte hain
    const username = "0AEHQ64ukI";
    const password = "50yxz17DyG";

    // Standard IPTV Stream URL Format
    const realIPTVURL = `${currentHost}/live/${username}/${password}/${id}.ts`;

    try {
        // 3. Naye IP Server se stream fetch karna
        const response = await fetch(realIPTVURL, {
            headers: {
                'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0'
            }
        });

        // Agar server fir bhi mana kare toh error response dikhana
        if (!response.ok) {
            return res.status(response.status).send(`IPTV Server Responded with: ${response.status}`);
        }

        // 4. Player ke liye Headers set karna (CORS Bypass)
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Content-Type', response.headers.get('content-type') || 'video/mp2t');

        // 5. Video stream ko pipe/forward karna
        const nodeReadableStream = ReadableStreamToNodeStream(response.body);
        nodeReadableStream.pipe(res);

    } catch (error) {
        console.error("Proxy Error:", error);
        return res.status(500).send("Server Connection Error");
    }
}

// Stream Converter Helper
function ReadableStreamToNodeStream(readableStream) {
    const reader = readableStream.getReader();
    const { Readable } = require('stream');
    
    return new Readable({
        async read() {
            try {
                const { done, value } = await reader.read();
                if (done) {
                    this.push(null);
                } else {
                    this.push(Buffer.from(value));
                }
            } catch (err) {
                this.destroy(err);
            }
        }
    });
}
