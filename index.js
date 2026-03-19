export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const SECRET_KEY = env.SECRET_KEY;

        if (url.pathname === '/api/execute' && request.method === 'GET') {
            if (url.searchParams.get('key') !== SECRET_KEY) {
                return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
            }
            const code = await env.STORE.get("currentCode") || "";
            await env.STORE.put("currentCode", "");
            return new Response(JSON.stringify({ code }), {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (url.pathname === '/api/push' && request.method === 'POST') {
            const body = await request.json();
            if (body.key !== SECRET_KEY) {
                return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
            }
            await env.STORE.put("currentCode", body.code);
            return new Response(JSON.stringify({ success: true }), {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response("Not found", { status: 404 });
    }
}
