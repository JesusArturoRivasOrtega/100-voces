import { handleLive } from "../lib/live-service.mjs";
interface Env { DB: D1Database; ASSETS: Fetcher; }
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const path = new URL(request.url).pathname;
    if (path === "/api/live" || path.startsWith("/api/live/")) return handleLive(request, env.DB);
    if (path.startsWith("/api/")) return Response.json({ error: "Ruta no disponible." }, { status: 404 });
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
