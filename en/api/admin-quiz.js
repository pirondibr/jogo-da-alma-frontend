export const config = { runtime: 'edge' };

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

function unauthorized() {
  return json({ error: 'Invalid password' }, 401);
}

async function supabaseRequest(path, { method = 'GET', body } = {}) {
  const base = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!base || !key) {
    throw new Error('Supabase service config is missing');
  }

  const resp = await fetch(`${base}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'count=exact',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await resp.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!resp.ok) {
    const msg = data?.message || data?.error || text || `Supabase error ${resp.status}`;
    throw new Error(msg);
  }

  return { data, headers: resp.headers };
}

function parseCount(headers) {
  const range = headers.get('content-range') || '';
  const m = range.match(/\/(\d+|\*)/);
  if (!m || m[1] === '*') return null;
  return Number(m[1]);
}

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return json({ error: 'ADMIN_PASSWORD is not configured' }, 500);
  }

  let payload;
  try {
    payload = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  if (!payload.password || payload.password !== adminPassword) {
    return unauthorized();
  }

  const action = payload.action || 'stats';

  try {
    if (action === 'stats') {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

      const [all, chakra, personality, recent] = await Promise.all([
        supabaseRequest('quiz_submissions?select=id'),
        supabaseRequest('quiz_submissions?select=id&quiz_type=eq.chakra'),
        supabaseRequest('quiz_submissions?select=id&quiz_type=eq.personality'),
        supabaseRequest(`quiz_submissions?select=id&created_at=gte.${encodeURIComponent(sevenDaysAgo)}`),
      ]);

      return json({
        total: parseCount(all.headers) ?? (all.data?.length || 0),
        chakra: parseCount(chakra.headers) ?? (chakra.data?.length || 0),
        personality: parseCount(personality.headers) ?? (personality.data?.length || 0),
        last7Days: parseCount(recent.headers) ?? (recent.data?.length || 0),
      });
    }

    if (action === 'search') {
      const email = String(payload.email || '').trim().toLowerCase();
      const name = String(payload.name || '').trim();
      const limit = Math.min(Number(payload.limit) || 100, 100);

      let query = `quiz_submissions?select=id,created_at,quiz_type,name,email,summary,answers&order=created_at.desc&limit=${limit}`;

      if (email) {
        query += `&email=ilike.*${encodeURIComponent(email)}*`;
      }
      if (name) {
        query += `&name=ilike.*${encodeURIComponent(name)}*`;
      }

      const { data } = await supabaseRequest(query);
      return json({ rows: Array.isArray(data) ? data : [] });
    }

    if (action === 'recent') {
      const limit = Math.min(Number(payload.limit) || 50, 100);
      const { data } = await supabaseRequest(
        `quiz_submissions?select=id,created_at,quiz_type,name,email,summary&order=created_at.desc&limit=${limit}`
      );
      return json({ rows: Array.isArray(data) ? data : [] });
    }

    return json({ error: 'Unknown action' }, 400);
  } catch (err) {
    return json({ error: err.message || 'Admin query failed' }, 500);
  }
}
