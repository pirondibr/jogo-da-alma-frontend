from pathlib import Path
import re
import shutil

ROOT = Path(__file__).resolve().parent.parent
OLD_CHAKRAS = ROOT / "_old-questionario.html"
OLD_PERSONALITY = ROOT / "_old-questionario-personalidade.html"
OLD_CHAKRAS_CSS = ROOT / "_old-questionario.css"
OLD_PERSONALITY_CSS = ROOT / "_old-questionario-personalidade.css"

FONT_LINK = (
    '<link rel="preconnect" href="https://fonts.googleapis.com">\n'
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
    '<link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&family=Fraunces:opsz,wght@9..144,400;9..144,600&display=swap" rel="stylesheet">'
)

NAV_CHAKRAS = """<nav>
    <div class="nav-inner">
        <a href="index.html" class="logo"><span>✦</span> Jogo da Alma</a>
        <div class="nav-links">
            <a href="index.html#p1">As 7 Perguntas</a>
            <a href="perguntas/4-como-alcancar-a-felicidade.html">Como alcançar a felicidade</a>
            <a href="questionario.html">Quiz Chakras</a>
            <a href="questionario-personalidade.html" class="nav-cta">Quiz Personalidade</a>
        </div>
    </div>
</nav>"""

NAV_PERSONALITY = """<nav>
    <div class="nav-inner">
        <a href="index.html" class="logo"><span>✦</span> Jogo da Alma</a>
        <div class="nav-links">
            <a href="index.html#p1">As 7 Perguntas</a>
            <a href="perguntas/1-quem-voce-e.html">Quem você é</a>
            <a href="questionario.html">Quiz Chakras</a>
            <a href="questionario-personalidade.html" class="nav-cta">Quiz Personalidade</a>
        </div>
    </div>
</nav>"""

FOOTER = """<footer class="site-footer">
    <div>✦ Jogo da Alma — © 2026. Todos os direitos reservados.</div>
    <div class="disclaimer">Não substitui acompanhamento profissional.</div>
</footer>"""


def migrate_head(content: str, title: str, description: str, extra_css: str) -> str:
    head = f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <meta name="description" content="{description}">
    {FONT_LINK}
    <link rel="stylesheet" href="quiz-base.css">
    <link rel="stylesheet" href="{extra_css}">
    <script src="https://unpkg.com/jspdf@2.5.2/dist/jspdf.umd.min.js"></script>
</head>
<body>
"""
    content = re.sub(r"<!DOCTYPE html>.*?</head>\s*<body>\s*", "", content, count=1, flags=re.DOTALL)
    return head + content


def strip_old_shell(content: str, nav: str) -> str:
    content = re.sub(r"<nav class=\"navbar.*?</nav>", nav, content, count=1, flags=re.DOTALL)
    content = re.sub(r'<div style="height:\s*72px"></div>\s*', "", content)
    content = re.sub(
        r"<footer class=\"footer\">.*?</footer>",
        FOOTER,
        content,
        count=1,
        flags=re.DOTALL,
    )
    content = re.sub(
        r"document\.getElementById\('navToggle'\)\.addEventListener\([^;]+;\s*\n?\s*\}\);?\s*\n?",
        "",
        content,
    )
    return content


def migrate_chakras() -> None:
    content = OLD_CHAKRAS.read_text(encoding="utf-8")
    content = migrate_head(
        content,
        "Mapa dos Chakras — Questionário | Jogo da Alma",
        "Descubra seu mapa energético. Identifique desequilíbrios nos 7 chakras e entenda como eles afetam sua vida real.",
        "questionario.css",
    )
    content = strip_old_shell(content, NAV_CHAKRAS)
    (ROOT / "questionario.html").write_text(content, encoding="utf-8")
    shutil.copy2(OLD_CHAKRAS_CSS, ROOT / "questionario.css")
    print("Wrote questionario.html + questionario.css")


def migrate_personality() -> None:
    content = OLD_PERSONALITY.read_text(encoding="utf-8")
    content = content.replace(
        "name:'Tradicional / Familiar'",
        "name:'Tradicional / Consistente'",
    )
    content = content.replace(
        "name:'Criativa / Social'",
        "name:'Dinâmica / Social'",
    )
    content = migrate_head(
        content,
        "Perfil de Personalidade — Questionário | Jogo da Alma",
        "Descubra qual das 7 personalidades mais combina com você. Questionário baseado nos arquétipos dos 7 chakras.",
        "questionario-personalidade.css",
    )
    content = strip_old_shell(content, NAV_PERSONALITY)
    (ROOT / "questionario-personalidade.html").write_text(content, encoding="utf-8")
    shutil.copy2(OLD_PERSONALITY_CSS, ROOT / "questionario-personalidade.css")
    print("Wrote questionario-personalidade.html + questionario-personalidade.css")


def main() -> None:
    migrate_chakras()
    migrate_personality()


if __name__ == "__main__":
    main()
