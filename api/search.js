export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // 1. URL se sirf Stream ID nikalna (e.g., ?id=660641)
    const streamId = url.searchParams.get("id");
    
    if (!streamId) {
      return new Response("Error: Stream ID missing!", { status: 400 });
    }

    // 2. Yahan aap apna secret credential set karke rkhiljiye
    // Kal ko agar host badle, toh bas yahan "datahub11.com" ko badal dena!
    const currentHost = "http://datahub11.com"; 
    const username = "0AEHQ64ukI";
    const password = "50yxz17DyG";

    // 3. Asli IPTV Server ka URL backend me taiyar karna
    // Agar server format /live/user/pass/id hai ya index.php, us hisab se set karein:
    const realIPTVURL = `${currentHost}/index.php?username=${username}&password=${password}&stream=${streamId}`;

    try {
      // 4. Cloudflare khud us server se video fetch karega (Proxy)
      const response = await fetch(realIPTVURL, {
        method: "GET",
        headers: {
          "User-Agent": request.headers.get("User-Agent") || "Mozilla/5.0",
        }
      });

      // 5. Video stream ko direct player (User) ko forward karna
      const newResponse = new Response(response.body, response);
      
      // CORS errors se bachne ke liye headers (ताकि player me error na aaye)
      newResponse.headers.set("Access-Control-Allow-Origin", "*");
      
      return newResponse;

    } catch (error) {
      return new Response("Server Connection Error", { status: 500 });
    }
  }
};
