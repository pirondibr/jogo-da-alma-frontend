/* ============================================================
   THE SOUL GAME — Chakra Diagnosis (English)
   The AI returns structured JSON; the frontend builds the HTML
   from the clean visual diagnosis template.
   ============================================================ */

const CHAKRAS = {
    raiz:      { nome: 'Root',         label: 'Root Chakra',         glyph: '🔴', css: 'var(--root)',    soft: 'var(--root2)',    lane: 'Safety and foundation' },
    sacral:    { nome: 'Sacral',       label: 'Sacral Chakra',       glyph: '🟠', css: 'var(--sacral)',  soft: 'var(--sacral2)',  lane: 'Emotion and vitality' },
    plexo:     { nome: 'Solar Plexus', label: 'Solar Plexus Chakra', glyph: '☀️', css: 'var(--plexo)',   soft: 'var(--plexo2)',   lane: 'Boundary and position' },
    cardiaco:  { nome: 'Heart',        label: 'Heart Chakra',        glyph: '💚', css: 'var(--green)',   soft: 'var(--green2)',   lane: 'Love and bond' },
    laringeo:  { nome: 'Throat',       label: 'Throat Chakra',       glyph: '🔵', css: 'var(--blue)',    soft: 'var(--blue2)',    lane: 'Voice and truth' },
    frontal:   { nome: 'Third Eye',    label: 'Third Eye Chakra',    glyph: '👁', css: 'var(--frontal)', soft: 'var(--frontal2)', lane: 'Clarity and discernment' },
    coronario: { nome: 'Crown',        label: 'Crown Chakra',        glyph: '👑', css: '#8B5CF6',        soft: '#F3EEFF',         lane: 'Purpose and meaning' },
};

const CHAKRA_ORDER_MINI = ['raiz', 'sacral', 'plexo', 'cardiaco', 'laringeo', 'frontal', 'coronario'];

const REPORT_STYLE = `
:root{
  --bg:#F6F1E6; --paper:#FFFDF7; --ink:#18211E; --muted:#6D6A5F; --line:#DCCFB9;
  --night:#101820; --night2:#17222C; --gold:#D3A53D; --gold2:#F2D27C;
  --green:#4CAF82; --green2:#EAF8F0; --blue:#4A9FD9; --blue2:#EAF5FF;
  --plexo:#E8A317; --plexo2:#FFF5D7; --sacral:#E67E22; --sacral2:#FFF0E4;
  --frontal:#5C6BC0; --frontal2:#F0F1FF; --root:#C0503F; --root2:#FFEDEC;
  --shadow:0 18px 48px rgba(18,24,32,.14); --softShadow:0 10px 24px rgba(18,24,32,.07);
}
*{box-sizing:border-box;margin:0;padding:0}
body{
  font-family:Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,"Segoe UI",sans-serif;
  background:radial-gradient(circle at 8% 0%,rgba(76,175,130,.16),transparent 30%),radial-gradient(circle at 90% 14%,rgba(211,165,61,.18),transparent 34%),var(--bg);
  color:var(--ink); line-height:1.5; padding:24px;
}
.wrapper{max-width:1220px;margin:auto}.card{background:rgba(255,253,247,.96);border:1px solid var(--line);border-radius:28px;box-shadow:var(--softShadow);overflow:hidden}
.hero{background:linear-gradient(135deg,#0C131A,#14212B 58%,#101820);color:#F9F1DA;border:1px solid rgba(211,165,61,.48);border-radius:32px;padding:30px;box-shadow:var(--shadow);display:grid;grid-template-columns:118px 1fr;gap:24px;align-items:center;margin-bottom:18px}
.mandala{width:112px;height:112px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:58px;background:radial-gradient(circle,rgba(91,255,166,.32),rgba(76,175,130,.11) 45%,rgba(76,175,130,.02) 68%);border:1px solid rgba(114,255,184,.5);box-shadow:0 0 34px rgba(76,175,130,.38),inset 0 0 24px rgba(255,255,255,.08)}
h1{font-family:Georgia,"Times New Roman",serif;font-size:clamp(34px,4.5vw,56px);line-height:1.04;margin-bottom:10px}h1 span{color:var(--gold2)}.hero-sub{font-size:16px;color:#E8E0CC;max-width:820px}.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:18px}.step{display:grid;grid-template-columns:38px 1fr;gap:10px;align-items:center;background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.12);border-radius:18px;padding:12px}.step-num{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:900;background:linear-gradient(135deg,var(--green),#2D7A58)}.step b{display:block;font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#FFF2B9}.step span{font-size:12px;color:#CEC8B8}
.topline{display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:16px;margin-bottom:16px}.top-card{padding:22px;display:grid;grid-template-columns:62px 1fr;gap:14px;align-items:center}.case-card{background:linear-gradient(135deg,#124322,#0C301B);color:#F7F5EA}.ico{width:58px;height:58px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:29px;background:rgba(255,255,255,.13);border:1px solid rgba(255,255,255,.2)}.label{font-size:11px;letter-spacing:.12em;text-transform:uppercase;font-weight:900;color:var(--gold);margin-bottom:6px}.top-card h2{font-family:Georgia,"Times New Roman",serif;font-size:25px;line-height:1.12}.top-card p{font-size:13.3px;color:var(--muted)}.case-card p{color:#F7F2E6;font-style:italic}.case-card .label{color:var(--gold2)}
.main-grid{display:grid;grid-template-columns:1.35fr .9fr;gap:16px;align-items:start}.content{padding:20px}.side{padding:20px;background:linear-gradient(160deg,#0E151B,#14212B 62%,#0E151B);color:#F7F1E4;border-color:rgba(211,165,61,.45);position:sticky;top:20px}.section-title{text-align:center;margin-bottom:18px}.kicker{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);font-weight:900}.section-title h2{font-family:Georgia,"Times New Roman",serif;font-size:32px;line-height:1.1}.section-title p{font-size:13.5px;color:var(--muted);max-width:720px;margin:7px auto 0}
.block{border:1px solid var(--line);border-radius:26px;background:#FFFDF8;margin-bottom:18px;overflow:hidden}.block-head{display:grid;grid-template-columns:56px 1fr;gap:14px;align-items:center;padding:20px 22px;border-bottom:1px solid var(--line);background:linear-gradient(90deg,#FFFDF8,#FAF3DD)}.num{width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--gold);color:white;font-size:23px;font-weight:900}.block-head small{display:block;font-size:11px;letter-spacing:.12em;text-transform:uppercase;font-weight:900;color:var(--muted);margin-bottom:2px}.block-head h2{font-family:Georgia,"Times New Roman",serif;font-size:28px;line-height:1.1}.block-head p{font-size:13px;color:var(--muted);margin-top:4px}.block-body{padding:20px 22px}
.result-split{display:grid;grid-template-columns:1fr 1fr;gap:14px}.result-box{border:1px solid var(--line);border-radius:20px;padding:18px;background:#FCFBF8}.result-box.internal{border-top:5px solid var(--green);background:var(--green2)}.result-box.external{border-top:5px solid var(--blue);background:var(--blue2)}.result-box h3{font-family:Georgia,"Times New Roman",serif;font-size:22px;margin-bottom:10px}.result-box li:before{background:var(--green)}.external li:before{background:var(--blue)}
ul{list-style:none;display:grid;gap:8px}li{position:relative;padding-left:18px;font-size:13.5px;color:#353A34}li:before{content:"";position:absolute;left:0;top:.65em;width:7px;height:7px;border-radius:50%;background:var(--gold)}
.capacity-board{display:grid;gap:16px}.capacity-row{display:grid;grid-template-columns:210px 1fr;gap:14px;align-items:stretch}.chakra-lane{border-radius:22px;padding:18px;color:#fff;background:linear-gradient(135deg,var(--c),color-mix(in srgb,var(--c),#000 32%));box-shadow:0 10px 22px color-mix(in srgb,var(--c),transparent 78%);display:flex;flex-direction:column;justify-content:space-between}.chakra-lane .glyph{width:54px;height:54px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:28px;background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.25);margin-bottom:12px}.chakra-lane h3{font-family:Georgia,"Times New Roman",serif;font-size:24px;line-height:1.05}.chakra-lane span{font-size:11px;letter-spacing:.12em;text-transform:uppercase;font-weight:900;opacity:.86}.cap-list{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.cap-item{border:1px solid var(--line);border-radius:20px;background:#FFFDF8;padding:16px;display:grid;gap:9px}.cap-item h4{font-family:Georgia,"Times New Roman",serif;font-size:20px;line-height:1.12}.cap-item p{font-size:13px;color:var(--muted)}.tag-row{display:flex;flex-wrap:wrap;gap:6px}.tag{font-size:10.5px;font-weight:900;text-transform:uppercase;letter-spacing:.07em;border-radius:999px;padding:5px 9px;background:var(--soft);color:color-mix(in srgb,var(--c),#000 25%);border:1px solid color-mix(in srgb,var(--c),transparent 60%)}
.belief-lanes{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.belief-lane{border:1px solid color-mix(in srgb,var(--c),transparent 60%);border-radius:24px;background:linear-gradient(180deg,var(--soft),#FFFDF8 55%);overflow:hidden}.belief-top{padding:18px;border-bottom:1px solid color-mix(in srgb,var(--c),transparent 70%);display:flex;gap:12px;align-items:center}.belief-icon{width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:24px;background:#fff;border:2px solid var(--c);box-shadow:0 0 16px color-mix(in srgb,var(--c),transparent 70%)}.belief-top h3{font-family:Georgia,"Times New Roman",serif;font-size:22px;line-height:1.05}.belief-top span{display:block;font-size:10.5px;text-transform:uppercase;letter-spacing:.1em;font-weight:900;color:var(--c);margin-top:3px}.belief-body{padding:18px}.belief-body blockquote{font-family:Georgia,"Times New Roman",serif;font-size:20px;line-height:1.28;color:#2E2A25;margin-bottom:12px}.belief-body p{font-size:13px;color:var(--muted);margin-bottom:14px}.old-new{display:grid;gap:8px}.belief-chip{border-radius:14px;padding:10px 12px;font-size:12.5px;border:1px solid var(--line);background:#fff}.belief-chip b{display:block;font-size:10px;letter-spacing:.1em;text-transform:uppercase;margin-bottom:3px}.belief-chip.old{background:#FFF1F0}.belief-chip.old b{color:#B94A48}.belief-chip.new{background:#F0FFF6}.belief-chip.new b{color:#2B8A57}
.quest-open{border:1px solid var(--line);border-left:6px solid var(--gold);background:var(--plexo2);border-radius:20px;padding:18px 20px;margin-bottom:14px}.quest-open .q-label{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#8A6D1E;font-weight:900;margin-bottom:6px}.quest-open h3{font-family:Georgia,"Times New Roman",serif;font-size:24px;line-height:1.22;margin-bottom:8px}.quest-open p{font-size:14px;color:#5D574E}.training-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.training-card{border:1px solid var(--line);border-radius:20px;padding:16px;background:#FCFBF8}.training-card .field{font-size:10.5px;text-transform:uppercase;letter-spacing:.12em;font-weight:900;color:var(--c);margin-bottom:6px}.training-card h3{font-family:Georgia,"Times New Roman",serif;font-size:20px;margin-bottom:6px}.training-card p{font-size:13px;color:var(--muted)}
.symptom-flow{display:grid;grid-template-columns:1fr auto 1fr;gap:14px;align-items:stretch}.version{border-radius:22px;padding:18px;border:1px solid var(--line);background:#FCFBF8}.version.old{border-top:5px solid #B94A48;background:#FFF1F0}.version.new{border-top:5px solid var(--green);background:var(--green2)}.version h4{font-family:Georgia,"Times New Roman",serif;font-size:22px;margin-bottom:10px}.mini-row{border:1px solid var(--line);border-radius:14px;padding:11px 12px;background:rgba(255,255,255,.66);margin-bottom:8px}.mini-row b{display:block;font-size:10.5px;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);margin-bottom:2px}.mini-row span{font-family:Georgia,"Times New Roman",serif;font-size:17px;line-height:1.25}.arrow{width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--paper);border:1px solid var(--line);color:var(--gold);font-size:26px;font-weight:900;align-self:center}
.diag-title{text-align:center;margin-bottom:16px}.diag-title .kicker{color:var(--gold2)}.diag-title h2{font-family:Georgia,"Times New Roman",serif;font-size:31px;line-height:1.05}.activation-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:12px}.activation{border:1px solid var(--c);border-radius:18px;padding:12px;background:rgba(255,255,255,.045);box-shadow:0 0 22px color-mix(in srgb,var(--c),transparent 80%)}.activation .seal{width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:24px;background:#0A1117;border:2px solid var(--c);box-shadow:0 0 16px color-mix(in srgb,var(--c),transparent 62%);margin-bottom:8px}.activation b{font-family:Georgia,"Times New Roman",serif;font-size:17px;color:#F4E5B6}.activation span{display:block;font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--c);font-weight:900;margin-top:3px}.activation p{font-size:11.5px;color:#C6C8C2;margin-top:5px}.diag-panel{border:1px solid rgba(255,255,255,.12);border-radius:18px;padding:15px;margin-bottom:12px;background:rgba(255,255,255,.045)}.diag-panel.highlight{border-color:rgba(211,165,61,.45);background:rgba(211,165,61,.08)}.diag-panel h4{font-size:11.5px;letter-spacing:.11em;text-transform:uppercase;color:var(--gold2);margin-bottom:7px}.diag-panel p,.diag-panel li{font-size:13px;color:#D9D4C8}.diag-panel li:before{background:#7BE0A7}.mission-box{display:grid;grid-template-columns:52px 1fr;gap:12px;align-items:start}.mission-ico{width:52px;height:52px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:25px;background:rgba(211,165,61,.12);border:1px solid rgba(211,165,61,.35);color:var(--gold2)}.mini-map{display:grid;grid-template-columns:repeat(7,1fr);gap:7px;margin-top:10px}.ck-mini{text-align:center;opacity:.42;filter:saturate(.5)}.ck-mini.on{opacity:1;filter:none}.ck-mini.sup{opacity:.75;filter:none}.ck-dot{width:32px;height:32px;border-radius:50%;margin:0 auto 5px;display:flex;align-items:center;justify-content:center;font-size:15px;background:#0A1117;border:2px solid var(--c);box-shadow:0 0 12px color-mix(in srgb,var(--c),transparent 65%)}.ck-mini b{font-size:9px;color:#C9C4B8}.final{margin-top:18px;text-align:center;background:#1F2933;color:#F7F5F0;border-radius:24px;padding:24px}.final .label{color:#D8C070}.final h2{font-family:Georgia,"Times New Roman",serif;font-size:30px;line-height:1.15;margin-bottom:10px}.final p{color:#EAE6DC;max-width:760px;margin:0 auto;font-size:15px}
@media(max-width:1050px){.hero,.topline,.main-grid,.capacity-row{grid-template-columns:1fr}.side{position:static}.hero{text-align:center}.mandala{margin:auto}.steps,.activation-grid,.belief-lanes,.result-split,.training-grid,.symptom-flow{grid-template-columns:1fr}.cap-list{grid-template-columns:1fr}.arrow{margin:auto;transform:rotate(90deg)}.top-card{text-align:center;grid-template-columns:1fr}.ico{margin:auto}.mini-map{grid-template-columns:repeat(4,1fr)}}
@media(max-width:560px){body{padding:12px}.content,.side{padding:13px}.hero{padding:22px 16px}.block-head{grid-template-columns:1fr;text-align:center}.num{margin:auto}.belief-top{flex-direction:column;text-align:center}}
`;

function esc(s) {
    return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function chakraKey(k) {
    const key = String(k || '').toLowerCase().replace(/[áàâã]/g, 'a').replace(/í/g, 'i');
    if (key.includes('basico') || key === 'raiz' || key.includes('root')) return 'raiz';
    if (key.includes('sacral')) return 'sacral';
    if (key.includes('plexo') || key.includes('solar')) return 'plexo';
    if (key.includes('card') || key.includes('heart')) return 'cardiaco';
    if (key.includes('lar') || key.includes('throat')) return 'laringeo';
    if (key.includes('front') || key.includes('third') || key.includes('eye')) return 'frontal';
    if (key.includes('coron') || key.includes('crown')) return 'coronario';
    return CHAKRAS[key] ? key : 'cardiaco';
}

function chakraStyle(k) {
    const c = CHAKRAS[chakraKey(k)];
    return `--c:${c.css};--soft:${c.soft}`;
}

function listItems(arr) {
    return (arr || []).map(i => `<li>${esc(i)}</li>`).join('');
}

function buildCapacityBoard(rows) {
    return (rows || []).map(row => {
        const k = chakraKey(row.chakra);
        const c = CHAKRAS[k];
        const caps = (row.capacidades || []).map(cap => `
              <article class="cap-item"><h4>${esc(cap.titulo)}</h4><p>${esc(cap.descricao)}</p>
              <div class="tag-row">${(cap.tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div></article>`).join('');
        return `<div class="capacity-row" style="${chakraStyle(k)}">
            <div class="chakra-lane"><div><div class="glyph">${c.glyph}</div><span>${esc(c.label)}</span><h3>${esc(row.titulo_lane || c.lane)}</h3></div></div>
            <div class="cap-list">${caps}</div>
          </div>`;
    }).join('');
}

function buildBeliefLanes(crencas) {
    return (crencas || []).map(b => {
        const k = chakraKey(b.chakra);
        const c = CHAKRAS[k];
        return `<article class="belief-lane" style="${chakraStyle(k)}">
            <div class="belief-top"><div class="belief-icon">${c.glyph}</div><div><h3>${esc(c.nome)}</h3><span>${esc(b.subtitulo || '')}</span></div></div>
            <div class="belief-body"><blockquote>“${esc(b.frase_chave)}”</blockquote><p>${esc(b.explicacao)}</p>
            <div class="old-new">
              <div class="belief-chip old"><b>Old belief</b>${esc(b.crenca_antiga)}</div>
              <div class="belief-chip new"><b>New belief</b>${esc(b.crenca_nova)}</div>
            </div></div>
          </article>`;
    }).join('');
}

function buildTrainingGrid(items) {
    return (items || []).map(t => {
        const k = chakraKey(t.chakra);
        return `<article class="training-card" style="${chakraStyle(k)}">
            <div class="field">${esc(t.campo)}</div><h3>${esc(t.titulo)}</h3><p>${esc(t.descricao)}</p></article>`;
    }).join('');
}

function buildActivationGrid(items) {
    return (items || []).map(a => {
        const k = chakraKey(a.chakra);
        const c = CHAKRAS[k];
        return `<div class="activation" style="${chakraStyle(k)}">
          <div class="seal">${c.glyph}</div><b>${esc(c.nome)}</b><span>${esc(a.papel || 'Primary')}</span><p>${esc(a.resumo)}</p></div>`;
    }).join('');
}

function buildMiniMap(mapa) {
    const states = mapa || {};
    return CHAKRA_ORDER_MINI.map(k => {
        const c = CHAKRAS[k];
        const st = states[k] || 'off';
        const cls = st === 'on' ? 'on' : st === 'sup' ? 'sup' : '';
        const short = k === 'coronario' ? 'Crown' : k === 'laringeo' ? 'Throat' : k === 'cardiaco' ? 'Heart' : k === 'plexo' ? 'Plexus' : k === 'frontal' ? '3rd Eye' : c.nome;
        return `<div class="ck-mini ${cls}" style="--c:${c.css}"><div class="ck-dot">${c.glyph}</div><b>${esc(short)}</b></div>`;
    }).join('');
}

function buildDiagnosticoDocument(data) {
    const nome = esc(data.nome || 'you');
    const sit = esc(data.situacao_texto || '');
    const area = data.area_identificada || {};
    const obj = data.objetivo || {};
    const quest = data.quest || {};
    const va = data.versao_antiga || {};
    const vn = data.versao_nova || {};
    const side = data.sidebar || {};

    const body = `<main class="wrapper">
  <header class="hero">
    <div class="mandala">🌈</div>
    <div>
      <h1>Situation <span>Diagnosis</span></h1>
      <p class="hero-sub">Clear teaching with a playful layout: result, capacity, belief, and experience — without crowding the page.</p>
      <div class="steps">
        <div class="step"><div class="step-num">1</div><div><b>Situation</b><span>Life presents the experience.</span></div></div>
        <div class="step"><div class="step-num">2</div><div><b>Map</b><span>We see chakras, capacities, and beliefs.</span></div></div>
        <div class="step"><div class="step-num">3</div><div><b>Quest</b><span>The crossing develops the new version.</span></div></div>
      </div>
    </div>
  </header>

  <section class="topline">
    <article class="card top-card case-card"><div class="ico">👩‍👧</div><div><div class="label">${nome}'s situation</div><p>“${sit}”</p></div></article>
    <article class="card top-card"><div class="ico" style="background:#EAF6EE;color:#24794E;border-color:#BEE8CD">🧭</div><div><div class="label">Area identified</div><h2>${esc(area.titulo)}</h2><p>${esc(area.descricao)}</p></div></article>
    <article class="card top-card"><div class="ico" style="background:#FFF7E1;color:#B07C17;border-color:#E8D5A2">🎯</div><div><div class="label">Goal</div><h2>${esc(obj.titulo)}</h2><p>${esc(obj.descricao)}</p></div></article>
  </section>

  <section class="main-grid">
    <article class="card content">
      <div class="section-title"><div class="kicker">Central map</div><h2>The journey of the new version</h2><p>The structure stays didactic, but each block has more visual room to breathe.</p></div>

      <section class="block">
        <div class="block-head"><div class="num">1</div><div><small>What do I want to have?</small><h2>Results</h2><p>Separating what ${nome} wants to feel inside and build outside.</p></div></div>
        <div class="block-body result-split">
          <div class="result-box internal"><h3>Internal Results</h3><ul>${listItems(data.resultados_internos)}</ul></div>
          <div class="result-box external"><h3>External Results</h3><ul>${listItems(data.resultados_externos)}</ul></div>
        </div>
      </section>

      <section class="block">
        <div class="block-head"><div class="num">2</div><div><small>What do I need to develop?</small><h2>Capacities linked to Chakras</h2><p>The link to the chakras appears in separate lanes, without becoming a cramped grid.</p></div></div>
        <div class="block-body capacity-board">${buildCapacityBoard(data.capacidades_por_chakra)}</div>
      </section>

      <section class="block">
        <div class="block-head"><div class="num">3</div><div><small>What do I need to understand?</small><h2>Beliefs organized by Chakra</h2><p>Each chakra gets a key belief with contrast between the old pattern and a new understanding.</p></div></div>
        <div class="block-body belief-lanes">${buildBeliefLanes(data.crencas)}</div>
      </section>

      <section class="block">
        <div class="block-head"><div class="num">4</div><div><small>How will I learn this?</small><h2>Training Field / Quest</h2><p>Capacity does not develop in theory alone — it develops in the crossing.</p></div></div>
        <div class="block-body">
          <div class="quest-open"><div class="q-label">The quest is open</div><h3>${esc(quest.titulo)}</h3><p>${esc(quest.texto)}</p></div>
          <div class="training-grid">${buildTrainingGrid(data.treinamentos)}</div>
        </div>
      </section>

      <section class="block">
        <div class="block-head"><div class="num">5</div><div><small>How do I know which version is running?</small><h2>Mirror of the old and new version</h2><p>Thought, emotion, and action are symptoms of the current state.</p></div></div>
        <div class="block-body symptom-flow">
          <article class="version old"><h4>Old Version</h4>
            <div class="mini-row"><b>💭 Thought</b><span>“${esc(va.pensamento)}”</span></div>
            <div class="mini-row"><b>🌊 Emotion</b><span>${esc(va.emocao)}</span></div>
            <div class="mini-row"><b>👣 Action</b><span>${esc(va.acao)}</span></div></article>
          <div class="arrow">→</div>
          <article class="version new"><h4>New Version</h4>
            <div class="mini-row"><b>💭 Thought</b><span>“${esc(vn.pensamento)}”</span></div>
            <div class="mini-row"><b>🌊 Emotion</b><span>${esc(vn.emocao)}</span></div>
            <div class="mini-row"><b>👣 Action</b><span>${esc(vn.acao)}</span></div></article>
        </div>
      </section>

      <section class="final"><div class="label">Diagnosis Summary</div><h2>Experience reveals the capacity.<br/>The crossing develops it.</h2><p>${esc(data.resumo_final || 'The new version stops being an idea when it crosses the experience. The map shows what is being trained; the quest turns that into life.')}</p></section>
    </article>

    <aside class="card side">
      <div class="diag-title"><div class="kicker">Your diagnosis</div><h2>Activated chakras</h2></div>
      <div class="activation-grid">${buildActivationGrid(side.chakras_ativados)}</div>
      <div class="diag-panel highlight mission-box"><div class="mission-ico">🚩</div><div><h4>Priority mission</h4><p>${esc(side.missao)}</p></div></div>
      <div class="diag-panel"><h4>Main belief</h4><p>“${esc(side.crenca_principal)}”</p></div>
      <div class="diag-panel"><h4>Key capacities</h4><ul>${listItems(side.capacidades_chave)}</ul></div>
      <div class="diag-panel"><h4>Map of the 7 chakras</h4><div class="mini-map">${buildMiniMap(side.mapa_chakras)}</div></div>
    </aside>
  </section>
</main>`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>The Soul Game — Chakra Diagnosis · ${nome}</title>
<style>${REPORT_STYLE}</style>
</head>
<body>${body}</body>
</html>`;
}

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

const LOADING_MESSAGES = [
    'Reading your situation carefully...',
    'Identifying the area and the goal...',
    'Mapping chakras and capacities...',
    'Formulating old and new beliefs...',
    'Opening the formative quest...',
    'Mirroring old and new versions...',
    'Building your visual diagnosis...'
];

class DiagnosticoDaAlma {
    constructor() {
        this.apiKey = localStorage.getItem('ja_diag_api_key') || localStorage.getItem('jda_api_key') || '';
        this.model = localStorage.getItem('ja_diag_model') || 'openai/gpt-5.5';
        this.reportHtml = '';
        this.lastName = '';
        this.isGenerating = false;
        this.init();
    }

    init() {
        this.cacheDOM();
        this.bindEvents();
        this.loadSettings();
        if (!this.apiKey) this.settingsPanel.classList.add('open');
    }

    cacheDOM() {
        this.settingsToggle = document.getElementById('settingsToggle');
        this.settingsPanel = document.getElementById('settingsPanel');
        this.apiKeyInput = document.getElementById('apiKeyInput');
        this.modelInput = document.getElementById('modelInput');
        this.saveSettingsBtn = document.getElementById('saveSettingsBtn');
        this.nameInput = document.getElementById('nameInput');
        this.userInput = document.getElementById('userInput');
        this.charCount = document.getElementById('charCount');
        this.generateBtn = document.getElementById('generateBtn');
        this.statusBox = document.getElementById('statusBox');
        this.loadingText = document.getElementById('loadingText');
        this.loadingCount = document.getElementById('loadingCount');
        this.errorMsg = document.getElementById('errorMsg');
        this.resultSection = document.getElementById('resultSection');
        this.resultFrame = document.getElementById('resultFrame');
        this.downloadHtmlBtn = document.getElementById('downloadHtmlBtn');
        this.openTabBtn = document.getElementById('openTabBtn');
        this.newAnalysisBtn = document.getElementById('newAnalysisBtn');
        this.ctaBtn = document.getElementById('ctaBtn');
    }

    bindEvents() {
        this.settingsToggle.addEventListener('click', () => this.settingsPanel.classList.toggle('open'));
        this.saveSettingsBtn.addEventListener('click', () => this.saveSettings());
        this.generateBtn.addEventListener('click', () => this.handleGenerate());
        this.userInput.addEventListener('input', () => this.updateCharCount());
        this.userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) this.handleGenerate();
        });
        this.downloadHtmlBtn.addEventListener('click', () => this.downloadHTML());
        this.openTabBtn.addEventListener('click', () => this.openInNewTab());
        this.newAnalysisBtn.addEventListener('click', () => this.resetForm());
        this.ctaBtn?.addEventListener('click', () => {
            document.getElementById('ferramenta').scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => this.userInput.focus(), 500);
        });
    }

    loadSettings() {
        if (this.apiKey) this.apiKeyInput.value = this.apiKey;
        if (this.model) this.modelInput.value = this.model;
    }

    saveSettings() {
        this.apiKey = this.apiKeyInput.value.trim();
        this.model = this.modelInput.value.trim() || 'openai/gpt-5.5';
        localStorage.setItem('ja_diag_api_key', this.apiKey);
        localStorage.setItem('ja_diag_model', this.model);
        this.settingsPanel.classList.remove('open');
        this.showToast('Settings saved');
    }

    updateCharCount() {
        const len = this.userInput.value.length;
        this.charCount.textContent = len > 0 ? `${len} characters` : '';
    }

    async handleGenerate() {
        const situation = this.userInput.value.trim();
        const name = this.nameInput.value.trim();
        if (this.isGenerating) return;

        if (!this.apiKey) {
            this.showToast('Set your API key first (gear icon)', true);
            this.settingsPanel.classList.add('open');
            return;
        }
        if (situation.length < 30) {
            this.showToast('Describe the situation in more detail', true);
            return;
        }

        this.lastName = name;
        this.isGenerating = true;
        this.generateBtn.disabled = true;
        this.userInput.disabled = true;
        this.errorMsg.style.display = 'none';
        this.resultSection.style.display = 'none';
        this.statusBox.style.display = 'flex';
        this.startLoadingMessages();

        try {
            const userContent = (name ? `Name: ${name}\n\n` : '') + `Report:\n${situation}`;
            const raw = await this.streamAPI(userContent);
            const data = this.parseJSON(raw);
            if (name && !data.nome) data.nome = name;
            this.reportHtml = buildDiagnosticoDocument(data);
            this.renderResult();
        } catch (err) {
            this.errorMsg.innerHTML = `<strong>Error generating diagnosis:</strong> ${this.escapeHtml(err.message)}<br><br>Check your API key and model.`;
            this.errorMsg.style.display = 'block';
        } finally {
            this.stopLoadingMessages();
            this.statusBox.style.display = 'none';
            this.isGenerating = false;
            this.generateBtn.disabled = false;
            this.userInput.disabled = false;
        }
    }

    async streamAPI(userContent) {
        const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`,
                'HTTP-Referer': window.location.href,
                'X-Title': 'The Soul Game Chakra Diagnosis'
            },
            body: JSON.stringify({
                model: this.model,
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: userContent }
                ],
                stream: true,
                max_tokens: 8000,
                temperature: 0.75
            })
        });

        if (!resp.ok) {
            const errData = await resp.json().catch(() => ({}));
            throw new Error(errData.error?.message || `Error ${resp.status}`);
        }

        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let full = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';
            for (const line of lines) {
                const t = line.trim();
                if (!t.startsWith('data: ')) continue;
                const payload = t.slice(6);
                if (payload === '[DONE]') continue;
                try {
                    const json = JSON.parse(payload);
                    const delta = json.choices?.[0]?.delta?.content || '';
                    if (delta) {
                        full += delta;
                        this.loadingCount.textContent = `${full.length.toLocaleString('en-US')} characters`;
                    }
                } catch { /* partial chunk */ }
            }
        }
        return full;
    }

    parseJSON(raw) {
        let t = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
        const first = t.indexOf('{');
        const last = t.lastIndexOf('}');
        if (first === -1 || last === -1) throw new Error('Response without valid JSON.');
        const data = JSON.parse(t.slice(first, last + 1));
        if (!data.situacao_texto && !data.resultados_internos) {
            throw new Error('Incomplete JSON — try generating again.');
        }
        return data;
    }

    startLoadingMessages() {
        let idx = 0;
        this.loadingText.textContent = LOADING_MESSAGES[0];
        this.loadingInterval = setInterval(() => {
            idx = (idx + 1) % LOADING_MESSAGES.length;
            this.loadingText.textContent = LOADING_MESSAGES[idx];
        }, 3200);
    }

    stopLoadingMessages() {
        if (this.loadingInterval) clearInterval(this.loadingInterval);
        this.loadingInterval = null;
    }

    renderResult() {
        this.resultFrame.srcdoc = this.reportHtml;
        this.resultSection.style.display = 'block';
        this.resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    downloadHTML() {
        if (!this.reportHtml) return;
        const slug = (this.lastName || 'diagnosis').toLowerCase().normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        this.downloadFile(this.reportHtml, `soul-game-chakra-diagnosis-${slug}.html`, 'text/html');
        this.showToast('HTML downloaded');
    }

    openInNewTab() {
        if (!this.reportHtml) return;
        const url = URL.createObjectURL(new Blob([this.reportHtml], { type: 'text/html;charset=utf-8' }));
        window.open(url, '_blank');
        setTimeout(() => URL.revokeObjectURL(url), 60000);
    }

    downloadFile(content, filename, mime) {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([content], { type: mime + ';charset=utf-8' }));
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    resetForm() {
        this.userInput.value = '';
        this.nameInput.value = '';
        this.charCount.textContent = '';
        this.reportHtml = '';
        this.resultFrame.srcdoc = '';
        this.resultSection.style.display = 'none';
        this.errorMsg.style.display = 'none';
        document.getElementById('ferramenta').scrollIntoView({ behavior: 'smooth' });
        this.userInput.focus();
    }

    escapeHtml(text) {
        const d = document.createElement('div');
        d.textContent = text;
        return d.innerHTML;
    }

    showToast(message, isError) {
        document.querySelector('.toast')?.remove();
        const toast = document.createElement('div');
        toast.className = `toast ${isError ? 'toast-error' : 'toast-success'}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('show'));
        setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 2800);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DiagnosticoDaAlma();
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.12 });
    document.querySelectorAll('.animate-in').forEach(el => obs.observe(el));
});
