# Guia de Estilo: Site Jogo da Alma

Fonte da verdade para humanização (PT) e tradução (EN) do site. Mantido junto ao código para não depender de uma sessão de IA específica.

Nota de notação: neste guia, `&mdash;` representa o travessão original (o caractere em si é proibido no projeto, então não pode ser escrito nem aqui).

## Contexto do projeto

Site estático (HTML/CSS/JS puro) do método **Jogo da Alma**. Trabalho em duas etapas:

1. **Humanizar o português** (em andamento): tirar cara de IA, com foco em remover travessões. A copy já está boa, então a mão é leve.
2. **Bilíngue PT/EN-US** (depois): adicionar inglês dos EUA sem remover o português, com seletor de idioma. Tradução contextual, nunca literal.

## Regras invioláveis (as duas etapas)

- **Não mudar o sentido.** Só a forma. Se uma troca altera o significado, não faça.
- **Só texto visível** (mais `<title>` e `<meta description>`). Nunca tocar em HTML estrutural, classes, IDs, `href`, `style`, CSS ou `<script>`.
- **Preservar termos de marca** (ver lista abaixo).
- **Mão leve.** Não reescrever o que já está bom, não inflar, não adicionar.
- **Nenhum travessão** (`&mdash;` nem travessão curto) em nenhum arquivo. Regra da marca, validada por hook.

## Etapa 1: remoção de travessões

Cada travessão sai. Escolha o substituto pelo papel que ele exercia na frase. Quatro padrões, validados no `index.html`:

**1. Vírgula:** apostos e continuações com "e / ou / mas".
- Antes: `...caótico, cruel e sem sentido &mdash; mas existe uma explicação.`
- Depois: `...caótico, cruel e sem sentido, mas existe uma explicação.`
- Antes: `E sombras previsíveis &mdash; que deixam de te controlar quando têm nome`
- Depois: `E sombras previsíveis, que deixam de te controlar quando têm nome`

**2. Dois-pontos:** listas "termo → descrição" e revelações (o segundo lado explica o primeiro).
- Antes: `Um objetivo &mdash; evoluir do 1.0 para o 2.0`
- Depois: `Um objetivo: evoluir do 1.0 para o 2.0`
- Antes: `O futuro não está decidido &mdash; ele é a soma de como cada jogador joga.`
- Depois: `O futuro não está decidido: ele é a soma de como cada jogador joga.`

**3. Ponto:** para dar respiro, ou quando a frase já tem um dois-pontos adiante (evitar dois-pontos duplo).
- Antes: `...não são a sua essência &mdash; são o Humano 1.0.`
- Depois: `...não são a sua essência. São o Humano 1.0.`

**4. Middot ·:** só em separadores de layout (rodapé, créditos), reaproveitando o `·` que o design já usa nos chips.
- Antes: `✦ Jogo da Alma &mdash; © 2026.`
- Depois: `✦ Jogo da Alma · © 2026.`

Regra de desempate: se dois padrões cabem, prefira o que dá leitura mais natural em voz alta. Nunca repita dois-pontos na mesma frase.

Outras melhorias (fora travessão): só se forem óbvias e sem risco de mudar sentido. Na dúvida, não mexa.

## Termos de marca (preservar; traduzir assim na Etapa 2, nunca literal)

- Triângulo (Triangle), Estrela (Star), Constelação (Constellation), Chakra (Chakra)
- Humano 1.0/2.0/3.0 (Human 1.0/2.0/3.0), Civilização 1.0/2.0 (Civilization 1.0/2.0)
- Geometria da Consciência (Geometry of Consciousness), Espiral Consciente (Conscious Spiral)
- Músculos dos Chakras (Chakra Muscles), Materialização (Materialization, nunca "manifestation")
- **Dualidade** (falta/excesso de UM elemento) → Duality. **Polaridade** (entre DOIS elementos, ex. masculino/feminino) → Polarity. Nunca confundir os dois.
- "frequências" (como o site chama os chakras) → "frequencies"

### 7 frequências / chakras (rótulos do site)
Básico·Segurança, Sacral·Prazer, Plexo·Poder, Cardíaco·Conexão, Laríngeo·Expressão, Frontal·Saber, Coronário·Sentido

### 7 arquétipos de personalidade (nomes definidos pelo site)
Tradicional, Criativo, Ambicioso, Empático, Expressivo, Intelectual, Espiritualista.
(A wiki não nomeia perfis; os nomes são decisão do site. Manter como estão.)

## Tom do material
Semi-formal, direto, não dogmático ("depende do contexto"), prático com exemplos, linguagem de agência (não vitimista). Fala direto com o leitor ("você").
