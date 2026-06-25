import { fixtures, sortedTeams } from '../src/data';

export interface Env {
  OPENAI_API_KEY?: string;
  OPENAI_MODEL?: string;
  ALLOWED_ORIGIN?: string;
}

const jsonHeaders = (origin: string) => ({
  'Access-Control-Allow-Origin': origin,
  'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'no-store',
  'Content-Type': 'application/json; charset=utf-8',
});

function fallbackInsight(query: string) {
  const leader = sortedTeams[0];
  return `Offline insight for “${query}”: ${leader.name} are the strongest side on points, goal difference, and recent form. Configure OPENAI_API_KEY as a Cloudflare Worker secret for live model analysis.`;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = env.ALLOWED_ORIGIN ?? new URL(request.url).origin;
    if (request.method === 'OPTIONS') return new Response(null, { headers: jsonHeaders(origin) });
    const url = new URL(request.url);
    if (url.pathname === '/api/health' && request.method === 'GET') return Response.json({ ok: true }, { headers: jsonHeaders(origin) });
    if (url.pathname !== '/api/insights' || request.method !== 'POST') return Response.json({ error: 'Not found' }, { status: 404, headers: jsonHeaders(origin) });

    let query = '';
    try {
      const body = await request.json() as { query?: unknown };
      query = typeof body.query === 'string' ? body.query.trim().slice(0, 300) : '';
    } catch {
      return Response.json({ error: 'Invalid JSON body.' }, { status: 400, headers: jsonHeaders(origin) });
    }
    if (query.length < 4) return Response.json({ error: 'Query must be at least 4 characters.' }, { status: 400, headers: jsonHeaders(origin) });
    if (!env.OPENAI_API_KEY) return Response.json({ insight: fallbackInsight(query) }, { headers: jsonHeaders(origin) });

    const openaiResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: env.OPENAI_MODEL ?? 'gpt-4.1-mini',
        input: [{ role: 'system', content: 'You are a concise football tournament analyst. Do not reveal secrets.' }, { role: 'user', content: `Question: ${query}\nStandings: ${JSON.stringify(sortedTeams)}\nFixtures: ${JSON.stringify(fixtures)}` }],
      }),
    });
    if (!openaiResponse.ok) return Response.json({ error: 'OpenAI request failed.' }, { status: 502, headers: jsonHeaders(origin) });
    const data = await openaiResponse.json() as { output_text?: string };
    return Response.json({ insight: data.output_text ?? fallbackInsight(query) }, { headers: jsonHeaders(origin) });
  },
};
