from pathlib import Path
import re

TEMP = Path(r"C:\Users\Usuario\AppData\Local\Temp")
ROOT = Path(__file__).resolve().parent.parent

FILES = [
    "personalidade-basico",
    "personalidade-sacral",
    "personalidade-plexo-solar",
    "personalidade-cardiaco",
    "personalidade-laringeo",
    "personalidade-frontal",
    "personalidade-coronario",
]

BASE_CSS = """
:root {
    --bg: #0A0A0F; --bg-alt: #111118; --bg-card: #16161F;
    --surface: #1E1E2A; --surface-light: #252535;
    --text: #F0EFF4; --text-secondary: #B8B5C8; --text-muted: #7A7690; --text-dim: #4A475A;
    --text-primary: var(--text);
    --accent: #A78BFA; --accent-light: #C4B5FD; --accent-dark: #7C3AED;
    --accent-glow: rgba(167, 139, 250, 0.15);
    --gold: #F59E0B; --positive: #4ADE80; --negative: #FF6B6B;
    --q1: #EF4444; --q2: #F97316; --q3: #EAB308; --q4: #22C55E;
    --q5: #3B82F6; --q6: #8B5CF6; --q7: #A855F7;
    --radius-sm: 8px; --radius-md: 12px; --radius-lg: 20px;
    --transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    --font-display: 'Fraunces', Georgia, serif;
}
* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; font-size: 16px; }
body { font-family: 'DM Sans', -apple-system, sans-serif; background: var(--bg); color: var(--text); line-height: 1.7; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
.container { max-width: 1100px; margin: 0 auto; padding: 0 24px; }
a { color: inherit; }
::selection { background: var(--accent-dark); color: #fff; }
nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; background: rgba(10,10,15,.82); backdrop-filter: blur(12px); border-bottom: 1px solid var(--surface); }
.nav-inner { max-width: 1100px; margin: 0 auto; padding: 14px 24px; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.logo { font-family: 'Fraunces', serif; font-size: 1.15rem; font-weight: 600; text-decoration: none; color: var(--text); display: flex; gap: 8px; }
.logo span { color: var(--accent); }
.nav-links { display: flex; gap: 22px; align-items: center; }
.nav-links a { text-decoration: none; color: var(--text-secondary); font-size: .9rem; transition: color var(--transition); }
.nav-links a:hover { color: var(--text); }
.nav-cta { background: var(--accent-dark); color: #fff !important; padding: 8px 18px; border-radius: 999px; font-weight: 500; }
.nav-cta:hover { background: var(--accent); }
@media (max-width: 720px) { .nav-links a:not(.nav-cta) { display: none; } }
.btn { display: inline-block; text-decoration: none; font-weight: 500; padding: 14px 32px; border-radius: 999px; font-size: 1rem; transition: transform var(--transition), background var(--transition), border-color var(--transition); }
.btn-primary { background: var(--accent-dark); color: #fff; }
.btn-primary:hover { background: var(--accent); transform: translateY(-2px); }
.btn-ghost { border: 1px solid var(--surface-light); color: var(--text-secondary); }
.btn-ghost:hover { color: var(--text); border-color: var(--text-muted); }
.final-cta-actions { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; margin-top: 24px; }
footer.site-footer { border-top: 1px solid var(--surface); padding: 40px 24px; text-align: center; color: var(--text-muted); font-size: .85rem; }
footer.site-footer .disclaimer { margin-top: 8px; }
.animate-in { opacity: 0; transform: translateY(28px); transition: opacity .7s ease, transform .7s ease; }
.animate-in.visible { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } .animate-in { opacity: 1; transform: none; transition: none; } }
@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
"""

NAV = """
<nav>
    <div class="nav-inner">
        <a href="index.html" class="logo"><span>✦</span> Jogo da Alma</a>
        <div class="nav-links">
            <a href="index.html#p1">As 7 Perguntas</a>
            <a href="perguntas/1-quem-voce-e.html">Quem você é</a>
            <a href="questionario.html">Quiz Chakras</a>
            <a href="questionario-personalidade.html" class="nav-cta">Quiz Personalidade</a>
        </div>
    </div>
</nav>
"""

FOOTER = """
<footer class="site-footer">
    <div>✦ Jogo da Alma — © 2026. Todos os direitos reservados.</div>
    <div class="disclaimer">Não substitui acompanhamento profissional.</div>
</footer>
"""

SCRIPT = """
<script>
(function () {
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var items = document.querySelectorAll('.animate-in');
    if ('IntersectionObserver' in window && !reduced) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
            });
        }, { threshold: 0.12 });
        items.forEach(function (el) { io.observe(el); });
    } else {
        items.forEach(function (el) { el.classList.add('visible'); });
    }
    var links = document.querySelectorAll('.toc-link');
    var sections = document.querySelectorAll('.article-section[id]');
    function updateToc() {
        var y = window.scrollY + 120;
        var current = '';
        sections.forEach(function (s) { if (s.offsetTop <= y) current = s.id; });
        links.forEach(function (l) {
            l.classList.toggle('active', l.getAttribute('href') === '#' + current);
        });
    }
    window.addEventListener('scroll', updateToc, { passive: true });
    updateToc();
    links.forEach(function (l) {
        l.addEventListener('click', function (ev) {
            ev.preventDefault();
            var target = document.querySelector(l.getAttribute('href'));
            if (target) window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        });
    });
})();
</script>
"""


def build_css():
    artigo = (TEMP / "artigo.css").read_text(encoding="utf-8")
    pers = (TEMP / "personalidade.css").read_text(encoding="utf-8")
    css = BASE_CSS + artigo + pers
    css = css.replace("'Playfair Display', Georgia, serif", "'Fraunces', Georgia, serif")
    css = css.replace("font-family: var(--font-display)", "font-family: 'Fraunces', Georgia, serif")
    (ROOT / "personalidade.css").write_text(css, encoding="utf-8")


def transform_body(html: str) -> str:
    html = re.sub(
        r'<div class="article-breadcrumb[^"]*">.*?</div>',
        '<div class="article-breadcrumb animate-in">'
        '<a href="index.html">Jogo da Alma</a><span class="breadcrumb-sep">›</span>'
        '<a href="perguntas/1-quem-voce-e.html">Quem você é?</a><span class="breadcrumb-sep">›</span>'
        '<span>Perfil</span></div>',
        html,
        count=1,
        flags=re.DOTALL,
    )
    html = html.replace("Módulo 2 — Personalidade", "Perfil de Personalidade")
    html = html.replace("../index.html#personalidades", "perguntas/1-quem-voce-e.html")
    html = html.replace("../index.html#modulos", "perguntas/1-quem-voce-e.html")
    html = html.replace("../index.html", "index.html")
    html = html.replace("../questionario-personalidade.html", "questionario-personalidade.html")
    html = re.sub(
        r'<a href="chakra-[^"]+\.html" class="btn btn-ghost">[^<]+</a>\s*',
        "",
        html,
    )
    return html


def migrate_file(name: str):
    old = (TEMP / f"{name}.html").read_text(encoding="utf-8")
    match = re.search(r"(<header class=\"article-hero\">.*?</main>)", old, re.DOTALL)
    if not match:
        raise RuntimeError(f"Could not extract article content from {name}")
    body = transform_body(match.group(1))

    title_match = re.search(r"<title>(.*?)</title>", old)
    desc_match = re.search(r'<meta name="description" content="(.*?)"', old)
    title = title_match.group(1) if title_match else "Personalidade — Jogo da Alma"
    desc = desc_match.group(1) if desc_match else ""

    page = f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&family=Fraunces:opsz,wght@9..144,400;9..144,600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="personalidade.css">
</head>
<body>
{NAV}
{body}
{FOOTER}
{SCRIPT}
</body>
</html>
"""
    (ROOT / f"{name}.html").write_text(page, encoding="utf-8")


def main():
    build_css()
    for name in FILES:
        migrate_file(name)
        print("Migrated", name)


if __name__ == "__main__":
    main()
