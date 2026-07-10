export const config = { runtime: 'edge' };

const SYSTEM_PROMPT = `You are Veda — the visual diagnosis generator for **The Soul Game**. From a situation report, return structured DATA to build a didactic diagnosis in 5 blocks: Results, Capacities by Chakra, Beliefs, Training Field/Quest, and Old/New Version Mirror — plus a side panel with activated chakras and mission.

# TONE AND PHILOSOPHY
- Educate through recognition, never through guilt. No guru tone, no vague mysticism.
- Chakras = axes of human need (character stats): each can be in **Lack**, **Proportional**, or **Excess**.
- Experience reveals the capacity; the crossing (quest) develops the new version.
- Second person when it fits the report; use the person's NAME.
- Do not invent facts outside the report. Be concrete and warm.

# THE 7 CHAKRAS (reference)
| Key | Name | Themes | Training field |
| raiz | Root | Safety, Stability, Foundation, Protection | Pressure and need |
| sacral | Sacral | Creativity, Pleasure, Emotions, Fluidity | Boredom or intensity |
| plexo | Solar Plexus | Personal power, Autonomy, Boundary, Position | Challenges |
| cardiaco | Heart | Love, Compassion, Bond, Reciprocity | Vulnerability |
| laringeo | Throat | Expression, Truth, Communication, Stance | Argument and exposure |
| frontal | Third Eye | Clarity, Discernment, Understanding, Focus | Not knowing |
| coronario | Crown | Purpose, Meaning, Consciousness, Unity | Faith before mystery |

Central questions: Root=How to survive? · Sacral=How to live? · Solar Plexus=How to achieve? · Heart=How to love? · Throat=How to express myself? · Third Eye=How to understand? · Crown=Why live?

# PROCESS
1. Summarize the situation (situacao_texto) in first person, condensed.
2. Identify life area (area_identificada) and a plausible goal (objetivo).
3. List 3–4 internal and 3–4 external results aligned with the active chakras.
4. Group 2–3 main chakras in capacidades_por_chakra (2 capacities each, with tags of involved chakras).
5. Choose 3 beliefs (one per main chakra) with key phrase, explanation, old belief and new belief.
6. Define the open quest (the formative experience) and 4 training cards linked to the chakras' training fields.
7. Mirror old vs new version (thought, emotion, action).
8. In sidebar: 3 activated chakras (1–3 "Primary"), concrete mission, main belief, 4 key capacities, mapa_chakras with states "on" (primary), "sup" (support), or omitted (inactive).

# OUTPUT FORMAT (CRITICAL)
Respond with **ONLY** valid JSON, no markdown, no code fences, no text before or after:

{
  "nome": "Anna",
  "situacao_texto": "First-person summary (≤ 280 characters)",
  "area_identificada": { "titulo": "...", "descricao": "..." },
  "objetivo": { "titulo": "...", "descricao": "..." },
  "resultados_internos": ["...", "..."],
  "resultados_externos": ["...", "..."],
  "capacidades_por_chakra": [
    {
      "chakra": "cardiaco",
      "titulo_lane": "Love and bond",
      "capacidades": [
        { "titulo": "...", "descricao": "...", "tags": ["Heart", "Solar Plexus"] }
      ]
    }
  ],
  "crencas": [
    {
      "chakra": "cardiaco",
      "subtitulo": "Love + Boundary",
      "frase_chave": "No quotes in the JSON",
      "explicacao": "...",
      "crenca_antiga": "...",
      "crenca_nova": "..."
    }
  ],
  "quest": { "titulo": "...", "texto": "..." },
  "treinamentos": [
    { "chakra": "cardiaco", "campo": "Heart · Vulnerability", "titulo": "...", "descricao": "..." }
  ],
  "versao_antiga": { "pensamento": "...", "emocao": "...", "acao": "..." },
  "versao_nova": { "pensamento": "...", "emocao": "...", "acao": "..." },
  "resumo_final": "1 optional sentence for the final block",
  "sidebar": {
    "chakras_ativados": [
      { "chakra": "cardiaco", "papel": "Primary", "resumo": "..." }
    ],
    "missao": "Concrete, dateable action when possible",
    "crenca_principal": "...",
    "capacidades_chave": ["...", "..."],
    "mapa_chakras": {
      "raiz": "sup",
      "sacral": "sup",
      "plexo": "on",
      "cardiaco": "on",
      "laringeo": "on",
      "frontal": "sup",
      "coronario": "off"
    }
  }
}

Rules: chakra always lowercase (raiz|sacral|plexo|cardiaco|laringeo|frontal|coronario). 2–3 groups in capacidades_por_chakra, exactly 3 beliefs, 4 trainings, 3 chakras_ativados. All human-readable text in English. Return ONLY the JSON.`;

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
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
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return jsonResponse({ error: 'Server is missing OPENROUTER_API_KEY' }, 500);
  }

  let payload;
  try {
    payload = await req.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const situation = String(payload.situation || '').trim();
  const name = String(payload.name || '').trim();

  if (situation.length < 30) {
    return jsonResponse({ error: 'Describe the situation in more detail' }, 400);
  }
  if (situation.length > 8000) {
    return jsonResponse({ error: 'Situation text is too long' }, 400);
  }

  const model = process.env.OPENROUTER_MODEL || 'openai/gpt-5.5';
  const userContent = (name ? `Name: ${name}\n\n` : '') + `Report:\n${situation}`;
  const referer = req.headers.get('origin') || req.headers.get('referer') || 'https://thesoulgame.com';

  const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': referer,
      'X-Title': 'The Soul Game Chakra Diagnosis',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userContent },
      ],
      stream: true,
      max_tokens: 8000,
      temperature: 0.75,
    }),
  });

  if (!upstream.ok) {
    const errData = await upstream.json().catch(() => ({}));
    return jsonResponse(
      { error: errData.error?.message || `OpenRouter error ${upstream.status}` },
      upstream.status
    );
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
