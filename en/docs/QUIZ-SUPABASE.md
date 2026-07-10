# EN quizzes — Supabase lead capture

## 1. Create the table

In Supabase → SQL Editor, run:

[`quiz-submissions.sql`](./quiz-submissions.sql)

## 2. Vercel environment variables

Project → Settings → Environment Variables (Production + Preview):

| Name | Value |
|------|--------|
| `SUPABASE_URL` | `https://YOUR_PROJECT.supabase.co` |
| `SUPABASE_ANON_KEY` | anon / public key |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key (server only) |
| `ADMIN_PASSWORD` | password for the admin page |
| `OPENROUTER_API_KEY` | (existing) chakra diagnosis |
| `OPENROUTER_MODEL` | optional |

Redeploy after saving.

## 3. URLs

- Chakra quiz: `/questionario.html` (asks name + email first)
- Personality quiz: `/questionario-personalidade.html`
- Admin dashboard: `/admin/quiz-results.html`

Admin can search by email/name and see totals. Do not share the admin URL publicly.
