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

function getSupabaseBase() {
  let base = String(process.env.SUPABASE_URL || '').trim().replace(/\/+$/, '');
  // Allow pasting a URL that already includes /rest/v1
  base = base.replace(/\/rest\/v1$/i, '');
  return base;
}

function restUrl(pathname, searchParams) {
  const base = getSupabaseBase();
  if (!base) throw new Error('SUPABASE_URL is missing');
  const url = new URL(`${base}/rest/v1/${pathname.replace(/^\//, '')}`);
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value != null && value !== '') url.searchParams.set(key, String(value));
    });
  }
  return url;
}

async function supabaseRequest(pathname, searchParams, { method = 'GET', body, prefer } = {}) {
  const key = String(process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing');

  const url = restUrl(pathname, searchParams);
  const headers = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    Accept: 'application/json',
  };
  if (prefer) headers.Prefer = prefer;
  if (body) headers['Content-Type'] = 'application/json';

  const resp = await fetch(url.toString(), {
    method,
    headers,
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
    throw new Error(`${msg} (url: ${url.pathname}${url.search})`);
  }

  return { data, headers: resp.headers, url };
}

function parseCount(headers) {
  const range = headers.get('content-range') || '';
  const m = range.match(/\/(\d+|\*)/);
  if (!m || m[1] === '*') return null;
  return Number(m[1]);
}

async function countRows(extraParams = {}) {
  const { headers } = await supabaseRequest(
    'quiz_submissions',
    { select: 'id', limit: '0', ...extraParams },
    { method: 'GET', prefer: 'count=exact' }
  );
  return parseCount(headers) ?? 0;
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

      const [total, chakra, personality, last7Days] = await Promise.all([
        countRows(),
        countRows({ quiz_type: 'eq.chakra' }),
        countRows({ quiz_type: 'eq.personality' }),
        countRows({ created_at: `gte.${sevenDaysAgo}` }),
      ]);

      return json({ total, chakra, personality, last7Days });
    }

    if (action === 'search') {
      const email = String(payload.email || '').trim().toLowerCase();
      const name = String(payload.name || '').trim();
      const limit = Math.min(Number(payload.limit) || 100, 100);

      const params = {
        select: 'id,created_at,quiz_type,name,email,summary,answers',
        order: 'created_at.desc',
        limit: String(limit),
      };
      if (email) params.email = `ilike.*${email}*`;
      if (name) params.name = `ilike.*${name}*`;

      const { data } = await supabaseRequest('quiz_submissions', params);
      return json({ rows: Array.isArray(data) ? data : [] });
    }

    if (action === 'recent') {
      const limit = Math.min(Number(payload.limit) || 50, 100);
      const { data } = await supabaseRequest('quiz_submissions', {
        select: 'id,created_at,quiz_type,name,email,summary',
        order: 'created_at.desc',
        limit: String(limit),
      });
      return json({ rows: Array.isArray(data) ? data : [] });
    }

    return json({ error: 'Unknown action' }, 400);
  } catch (err) {
    return json({ error: err.message || 'Admin query failed' }, 500);
  }
}
