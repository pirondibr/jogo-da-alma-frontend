from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "Chakras base"
FELICIDADE = "perguntas/4-como-alcancar-a-felicidade.html"

CHAKRAS = [
    ("chakra-basico-problemas.html", "Básico"),
    ("chakra-sacral-problemas.html", "Sacral"),
    ("chakra-plexo-solar-problemas.html", "Plexo Solar"),
    ("chakra-cardiaco-problemas.html", "Cardíaco"),
    ("chakra-laringeo-problemas.html", "Laríngeo"),
    ("chakra-frontal-problemas.html", "Frontal"),
    ("chakra-coronario-problemas.html", "Coronário"),
]

SOURCE_MAP = {
    "chakra-laringeo-problemas.html": "chakra-laringeo-problemas (1).html",
}

NAV = """<nav>
    <div class="nav-inner">
        <a href="index.html" class="logo"><span>✦</span> Jogo da Alma</a>
        <div class="nav-links">
            <a href="index.html#p4">As 7 Perguntas</a>
            <a href="perguntas/4-como-alcancar-a-felicidade.html">Como alcançar a felicidade</a>
            <a href="questionario.html">Quiz Chakras</a>
            <a href="questionario.html" class="nav-cta">Fazer diagnóstico</a>
        </div>
    </div>
</nav>"""


def next_block(i: int) -> str:
    felicidade = f'<a href="{FELICIDADE}">← Voltar ao mapa dos chakras</a>'
    if i == 0:
        left = felicidade
    else:
        prev_file, prev_name = CHAKRAS[i - 1]
        left = f'<a href="{prev_file}">← Chakra anterior: {prev_name}</a>'

    if i == len(CHAKRAS) - 1:
        right = f'<a href="{FELICIDADE}">Voltar ao mapa dos chakras →</a>'
    else:
        next_file, next_name = CHAKRAS[i + 1]
        right = f'<a href="{next_file}">Próximo chakra: {next_name} →</a>'

    return f'<div class="next">\n    {left}\n    {right}\n</div>'


def migrate(filename: str, chakra_name: str, index: int) -> None:
    source_name = SOURCE_MAP.get(filename, filename)
    content = (SOURCE / source_name).read_text(encoding="utf-8")

    content = re.sub(r"<nav>.*?</nav>", NAV, content, count=1, flags=re.DOTALL)

    breadcrumb = (
        f'<p class="breadcrumb"><a href="index.html">Jogo da Alma</a> / '
        f'<a href="{FELICIDADE}">Como alcançar a felicidade?</a> / {chakra_name}</p>'
    )
    content = re.sub(
        r'<p class="breadcrumb">.*?</p>',
        breadcrumb,
        content,
        count=1,
        flags=re.DOTALL,
    )

    replacements = [
        ("../index.html#chakras", FELICIDADE),
        ("../index.html#objetivos", "index.html#p4"),
        ("../index.html#comecar", "questionario.html"),
        ("../index.html", "index.html"),
        ("../questionario.html", "questionario.html"),
        ("chakra-basico.html", "chakra-basico-problemas.html"),
        ("chakra-sacral.html", "chakra-sacral-problemas.html"),
        ("chakra-plexo-solar.html", "chakra-plexo-solar-problemas.html"),
        ("chakra-cardiaco.html", "chakra-cardiaco-problemas.html"),
        ("chakra-laringeo.html", "chakra-laringeo-problemas.html"),
        ("chakra-frontal.html", "chakra-frontal-problemas.html"),
    ]
    for old, new in replacements:
        content = content.replace(old, new)

    content = re.sub(r"<div class=\"next\">.*?</div>", next_block(index), content, count=1, flags=re.DOTALL)

    (ROOT / filename).write_text(content, encoding="utf-8")
    print(f"Wrote {filename}")


def main() -> None:
    for i, (filename, name) in enumerate(CHAKRAS):
        migrate(filename, name, i)


if __name__ == "__main__":
    main()
