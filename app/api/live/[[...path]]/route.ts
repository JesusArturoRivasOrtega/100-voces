import { env } from "cloudflare:workers";
import { handleLive } from "../../../../lib/live-service.mjs";
export const dynamic = "force-dynamic";
export function GET(request: Request) { return handleLive(request, env.DB); }
export function POST(request: Request) { return handleLive(request, env.DB); }
