# Jogo da Alma — Frontend

Site estático da metodologia de autoconhecimento **Jogo da Alma**, construído por partes.

## Estrutura atual

```
.
├── index.html                              # Página inicial — As 7 Perguntas
├── personalidade.css                     # Estilos compartilhados dos perfis
├── personalidade-basico.html               # Perfil Tradicional
├── personalidade-sacral.html               # Perfil Criativo
├── personalidade-plexo-solar.html          # Perfil Ambicioso
├── personalidade-cardiaco.html             # Perfil Empático
├── personalidade-laringeo.html             # Perfil Expressivo
├── personalidade-frontal.html              # Perfil Intelectual
├── personalidade-coronario.html            # Perfil Espiritualista
├── chakra-basico-problemas.html            # Chakra Básico — problemas e estratégias
├── chakra-sacral-problemas.html            # Chakra Sacral
├── chakra-plexo-solar-problemas.html       # Chakra Plexo Solar
├── chakra-cardiaco-problemas.html          # Chakra Cardíaco
├── chakra-laringeo-problemas.html          # Chakra Laríngeo
├── chakra-frontal-problemas.html           # Chakra Frontal
├── chakra-coronario-problemas.html         # Chakra Coronário
├── questionario.html                       # Quiz diagnóstico dos 7 chakras
├── questionario.css
├── questionario-personalidade.html         # Quiz de personalidade
├── questionario-personalidade.css
├── quiz-base.css                           # Estilos compartilhados dos quizzes
└── perguntas/
    ├── 1-quem-voce-e.html                  # Pergunta 1
    ├── 2-por-que-o-mundo-e-assim.html      # Pergunta 2
    ├── 3-por-que-estamos-aqui.html         # Pergunta 3
    ├── 4-como-alcancar-a-felicidade.html   # Pergunta 4
    ├── 5-como-alcancar-o-sucesso-material.html      # Pergunta 5
    ├── 6-qual-e-o-nosso-futuro.html                 # Pergunta 6
    └── 7-qual-e-o-seu-papel-nesse-futuro.html       # Pergunta 7
```

> As 7 perguntas, os 7 perfis de personalidade, as 7 páginas de chakras e os 2 questionários estão completos.

## Rodar localmente

```bash
python -m http.server 8000
```

Depois acesse http://localhost:8000
