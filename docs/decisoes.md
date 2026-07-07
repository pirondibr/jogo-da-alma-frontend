# Log de Decisões: Site Jogo da Alma

Registro cronológico de decisões e contexto. Datas em Europe/Rome.

## 2026-07-07

**Setup do repositório**
- Repo `pirondibr/jogo-da-alma-frontend` conectado por deploy key (ed25519, com write access). Clonado localmente. Push exige aprovação do Lucas.

**Contexto absorvido**
- Analisada a wiki do método (`2026/Metodo Fractal v6/Wiki jogo da alma/`). Glossário de termos de marca e regras de tradução consolidados no `guia-de-estilo.md`.

**Método aprovado (Lucas)**
- Duas etapas: (1) humanizar o PT com foco em remover travessões, mão leve, sem mudar sentido; (2) versão bilíngue PT/EN-US com seletor de idioma, tradução contextual. Por partes, com revisão, para garantir qualidade.
- Registro em dois níveis: `docs/` no repo (versionado) e memória da IA (para retomar sessões).

**Etapa 1 iniciada**
- Diagnóstico: 384 travessões em 24 arquivos HTML.
- Piloto: `index.html` (30 travessões) humanizado. Padrão de substituição definido e aprovado pelo Lucas (ver `guia-de-estilo.md`, seção Etapa 1). Só travessões tocados; sentido e estrutura intactos.
- Descoberta técnica: hook da marca bloqueia qualquer conteúdo escrito contendo travessão. Confirma que os arquivos finais ficam limpos por construção.
- Propagação concluída nos 23 arquivos restantes (perguntas, chakras, personalidades, quizzes).

**Etapa 1 CONCLUÍDA**
- Resultado: 384 travessões removidos em 24 arquivos. QA global confirma zero travessões (longos e curtos) em todo o repo. Sentido, termos de marca e estrutura preservados.
- Decisões de estilo consolidadas (para Etapa 2 e manutenção):
  - Títulos das 7 perguntas: `Pergunta? · Jogo da Alma` (middot como separador título/marca).
  - Títulos de chakras/personalidades/quizzes: `Rótulo: subtítulo | Jogo da Alma` (dois-pontos interno; o pipe já era do original).
  - Home: `Jogo da Alma: As 7 Perguntas`. Rodapés: `✦ Jogo da Alma · © 2026` (24 iguais).
  - Contraposição "não X (travessão) Y": usar ", mas" quando a vírgula sozinha ficaria ambígua (ex.: "Não como ganância, mas como impulso vital").
  - Rótulos de nível/lista "Termo (travessão) descrição": dois-pontos.
- Pendências anotadas (fora do escopo de travessão, decidir depois):
  - `questionario.html`: 4 placeholders de UI que eram travessão viraram middot `·`. Revisar visualmente se um hífen simples ou vazio fica melhor.
  - Nome do arquétipo do Sacral: index diz "Criativo", título/conteúdo da página diz "Dinâmica/Social" e "Criativo" misturados. Uniformizar o nome do perfil.
- Notas operacionais: subagentes em paralelo funcionaram para chakras, perguntas 4-7 e quizzes; travaram (stall 600s) ou caíram por conexão nos arquivos mais densos (pergunta 3, personalidades plexo-solar e sacral), que foram finalizados manualmente.

**Próximo:** aprovação do Lucas para commit e push. Depois, Etapa 2 (bilíngue PT/EN-US), começando pela decisão de arquitetura do seletor de idioma.
