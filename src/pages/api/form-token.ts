import type { APIRoute } from "astro";

export const GET: APIRoute = () =>
  new Response(JSON.stringify(import.meta.env.FORM_TOKEN));
