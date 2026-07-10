/* Shared lead gate + Supabase save for EN quizzes */
(function (global) {
  const STORAGE_KEY = 'sg_quiz_lead';
  let cachedConfig = null;
  let saveInFlight = false;

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
  }

  function getLead() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data || !data.name || !data.email) return null;
      return { name: String(data.name).trim(), email: String(data.email).trim().toLowerCase() };
    } catch {
      return null;
    }
  }

  function setLead(name, email) {
    const lead = {
      name: String(name || '').trim(),
      email: String(email || '').trim().toLowerCase(),
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(lead));
    return lead;
  }

  function renderLeadForm(opts) {
    const title = opts.title || 'Before you begin';
    const subtitle = opts.subtitle || 'Enter your name and email to start the quiz. We use this to save your results.';
    const buttonLabel = opts.buttonLabel || 'Continue';
    const onContinue = opts.onContinue;
    const existing = getLead() || { name: '', email: '' };

    return `
      <div class="quiz-lead-card">
        <div class="quiz-lead-icon">✦</div>
        <h1>${esc(title)}</h1>
        <p class="quiz-lead-sub">${esc(subtitle)}</p>
        <form class="quiz-lead-form" id="quizLeadForm" novalidate>
          <label class="quiz-lead-label" for="quizLeadName">Name</label>
          <input class="quiz-lead-input" id="quizLeadName" name="name" type="text" autocomplete="name" required placeholder="Your name" value="${esc(existing.name)}">
          <label class="quiz-lead-label" for="quizLeadEmail">Email</label>
          <input class="quiz-lead-input" id="quizLeadEmail" name="email" type="email" autocomplete="email" required placeholder="you@email.com" value="${esc(existing.email)}">
          <p class="quiz-lead-error" id="quizLeadError" hidden></p>
          <button class="quiz-lead-btn" type="submit">${esc(buttonLabel)}</button>
          <p class="quiz-lead-note">We only use this to store your quiz results and improve the experience.</p>
        </form>
      </div>`;
  }

  function bindLeadForm(onContinue) {
    const form = document.getElementById('quizLeadForm');
    const err = document.getElementById('quizLeadError');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (document.getElementById('quizLeadName')?.value || '').trim();
      const email = (document.getElementById('quizLeadEmail')?.value || '').trim();

      if (name.length < 2) {
        err.hidden = false;
        err.textContent = 'Please enter your name.';
        return;
      }
      if (!isValidEmail(email)) {
        err.hidden = false;
        err.textContent = 'Please enter a valid email.';
        return;
      }

      err.hidden = true;
      setLead(name, email);
      if (typeof onContinue === 'function') onContinue(getLead());
    });
  }

  async function getPublicConfig() {
    if (cachedConfig) return cachedConfig;
    const resp = await fetch('/api/public-config');
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) throw new Error(data.error || 'Could not load config');
    if (!data.supabaseUrl || !data.supabaseAnonKey) {
      throw new Error('Supabase public config incomplete');
    }
    cachedConfig = data;
    return cachedConfig;
  }

  async function saveQuizSubmission({ quizType, summary, answers }) {
    const lead = getLead();
    if (!lead) throw new Error('Missing name/email');
    if (saveInFlight) return { ok: false, skipped: true };

    saveInFlight = true;
    try {
      const config = await getPublicConfig();
      const resp = await fetch(`${config.supabaseUrl}/rest/v1/quiz_submissions`, {
        method: 'POST',
        headers: {
          apikey: config.supabaseAnonKey,
          Authorization: `Bearer ${config.supabaseAnonKey}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          quiz_type: quizType,
          name: lead.name,
          email: lead.email,
          summary: summary || {},
          answers: answers || {},
        }),
      });

      if (!resp.ok) {
        const errText = await resp.text().catch(() => '');
        throw new Error(errText || `Save failed (${resp.status})`);
      }

      return { ok: true };
    } finally {
      saveInFlight = false;
    }
  }

  function saveStatusHtml(state) {
    if (state === 'saving') {
      return '<p class="quiz-save-status quiz-save-saving">Saving your results…</p>';
    }
    if (state === 'saved') {
      return '<p class="quiz-save-status quiz-save-ok">Results saved. You can come back later — we have your map linked to your email.</p>';
    }
    if (state === 'error') {
      return '<p class="quiz-save-status quiz-save-err">Your results are ready, but we could not save them right now. You can still download the PDF.</p>';
    }
    return '';
  }

  global.QuizLead = {
    getLead,
    setLead,
    renderLeadForm,
    bindLeadForm,
    saveQuizSubmission,
    saveStatusHtml,
    isValidEmail,
  };
})(window);
