addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const jsonUrl = "https://binge-giotv.pages.dev/data/id.json";

  try {
    // 1. Target URL se JSON data fetch karein
    const response = await fetch(jsonUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      return new Response("Failed to fetch source data", { status: response.status });
    }

    const data = await response.json();
    const channels = data.channels || [];

    // 2. M3U Playlist ka header shuru karein
    let m3uOutput = "#EXTM3U\n";

    // 3. Loop chalakar har ek channel ko OTT Navigator format me convert karein
    channels.forEach(channel => {
      const id = channel.id || "";
      const name = channel.name || "";
      const url = channel.url || "";
      const logo = channel.logo || "";
      const cookie = channel.cookie || "";
      const keyId = channel.keyId || "";
      const key = channel.key || "";

      // tvg-id ke liye name me se spaces ko underscore se badlein ya id use karein
      const tvgId = name.replace(/ /g, "_");

      m3uOutput += `#EXTINF:-1 tvg-id="${tvgId}" tvg-name="${name}" tvg-logo="${logo}" group-title="⚡ LIVE TV",${name}\n`;
      m3uOutput += `#KODIPROP:inputstream.adaptive.license_type=clearkey\n`;
      m3uOutput += `#KODIPROP:inputstream.adaptive.license_key=${keyId}:${key}\n`;
      m3uOutput += `#EXTHTTP:{"Cookie":"${cookie}"}\n`;
      m3uOutput += `${url}\n\n`;
    });

    // 4. Plain Text response return karein taki app ise as a playlist read kar sake
    return new Response(m3uOutput.trim(), {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Access-Control-Allow-Origin": "*", // CORS handles, taki kisi bhi player me chal sake
        "Cache-Control": "public, max-age=60" // 1 minute caching taki bar-bar load hone par load na pade
      }
    });

  } catch (error) {
    return new Response("Error: " + error.message, { status: 500 });
  }
}
