# Mi Amorzito Helenice

Presente de Dia dos Namorados da Lê para a Helen. Site estático, sem dependências
externas — funciona para sempre e offline depois de instalado no celular.

## O que tem

- **Nossa aventura** — plataforma 2D em pixel art pelos lugares do casal (Via Parque,
  Cine New York, praça de alimentação, Lagoa, praia à noite, Rocinha), com 4 personagens,
  corações, alianças, combos, recordes, conquistas e 10 fotos desbloqueáveis
- **Tabuleiro do amor** — estilo ludo, para duas jogadoras no mesmo celular, com dado
  animado e cartas surpresa
- **Nosso álbum** — fotos e conquistas
- **Nossa cartinha** — a declaração

## Publicar no Netlify

1. Entre em [app.netlify.com](https://app.netlify.com) e faça login
2. **Add new site → Import an existing project** e conecte este repositório
   (branch `main`, sem comando de build, publish directory = `/`)
   — ou **Deploy manually** e arraste a pasta do projeto inteira
3. Pronto: o Netlify gera o link na hora (dá para personalizar o nome do site
   em *Site settings → Change site name*)

## Instalar no celular (vira app, funciona offline)

- **iPhone (Safari):** abrir o link → compartilhar → *Adicionar à Tela de Início*
- **Android (Chrome):** abrir o link → menu ⋮ → *Adicionar à tela inicial*

O progresso (recordes, fotos, conquistas, acessórios) fica salvo no aparelho.

## Personalizar

- Frases, desafios e a cartinha: `js/challenges.js`
- Fotos: `assets/photos/p01.jpg` a `p10.jpg` (legendas em `js/challenges.js`)
- Cores e roupas das personagens: `js/sprites.js`

Ao alterar qualquer arquivo, suba a versão do cache em `sw.js`
(`miamorzito-v3` → `v4`) para o app instalado se atualizar.
