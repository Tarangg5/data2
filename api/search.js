export default async function handler(req, res) {
    // URL se stream ID nikalna
    const { id } = req.query;

    if (!id) {
        return res.status(400).send("Error: Stream ID missing!");
    }

    // Credentials aur Host (Kal ko host badle toh bas yahan badlein)
    const currentHost = "http://datahub11.com"; 
    const username = "0AEHQ64ukI";
    const password = "50yxz17DyG";

    const realIPTVURL = `${currentHost}/index.php?username=${username}&password=${password}&stream=${id}`;

    try {
        // Native fetch ka use (No require('node-fetch') needed)
        const response = await fetch(realIPTVURL, {
            headers: {
                'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0'
            }
        });

        if (!response.ok) {
            return res.status(response.status).send(`IPTV Server responded with status: ${response.status}`);
        }

        // CORS Headers set karna taaki browser/player me block na ho
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Content-Type', response.headers.get('content-type') || 'video/mp2t');

        // Web Stream Node.js ReadableStream me convert karke pipe karna
        const nodeReadableStream = ReadableStreamToNodeStream(response.body);
        nodeReadableStream.pipe(res);

    } catch (error) {
        console.error("Proxy Error:", error);
        return res.status(500).send("Server Connection Error");
    }
}

// Helper function jo Cloudflare/Web stream ko Node.js stream me badalta hai
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
