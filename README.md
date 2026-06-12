# Mi Amorzito Helenice 💕

Um presente de Dia dos Namorados da **Lê (Cascãozinho 💜)** para a **Helen (Leãozinho 🦁)** —
feito para durar **para sempre**: sem servidores pagos, sem dependências, sem prazo de validade.

## O que tem aqui dentro

- 🕹️ **Nossa Aventura** — jogo de plataforma pixel-art (estilo Mario/Sonic) passeando pelos
  cantinhos do casal: Via Parque (com o banquinho "PENSE VERDE"), Cinema New York do
  BarraShopping, McDonald's, Lagoa, praia à noite e Rocinha ilustrada. Colete ❤️ corações e
  💍 alianças de prata, desbloqueie as 10 fotos, conquistas e acessórios. Jogue com a Lê, a
  Helen, a gatinha siamesa ou a Nice. 🐈‍⬛
- 🎲 **Tabuleiro do Amor** — ludo digital para jogarem juntinhas no mesmo celular, com dado
  aleatório animado, casas fofas 💗, picantes 🔥, de sorte ⭐ e de memória 📸.
- 📸 **Nosso Álbum** — fotos e conquistas desbloqueadas jogando.
- 💌 **Nossa Cartinha** — a declaração de Dia dos Namorados.

## Como publicar (1 minuto, faça isso primeiro!)

1. Abra **Settings → Pages** neste repositório:
   `https://github.com/leletns/miamorzitohelenice/settings/pages`
2. Em **Build and deployment → Source**, escolha **GitHub Actions**. Pronto, é só isso.
3. O workflow roda sozinho a cada push. Quando terminar (aba **Actions**), o presente fica em:

   **https://leletns.github.io/miamorzitohelenice/** 💝

> Dica: se o workflow já tiver rodado antes de você ativar o Pages, vá na aba **Actions**,
> abra "Publicar no GitHub Pages 💕" e clique em **Re-run all jobs**.

## Como a Helen instala no celular (vira um app, funciona offline para sempre)

**iPhone (Safari):** abrir o link → botão de compartilhar (quadradinho com seta) →
**Adicionar à Tela de Início** → aparece o ícone de coração 💕.

**Android (Chrome):** abrir o link → menu ⋮ → **Adicionar à tela inicial** (ou
"Instalar app").

Depois de aberto uma vez, o app funciona **sem internet** — tudo fica salvo no celular
(fotos, jogos, progresso, recordes).

## Personalizar

- Frases dos cantinhos, desafios do tabuleiro e a cartinha: `js/challenges.js`
- Fotos: troque os arquivos em `assets/photos/` (p01 a p10) e as legendas em `js/challenges.js`
- Cores de cabelo/roupa dos personagens: `js/sprites.js` (paletas em `CHARACTERS`)

> Importante: ao mudar qualquer arquivo, aumente a versão do cache em `sw.js`
> (`miamorzito-v1` → `v2`) para o app instalado se atualizar.

---

Feito com muito amor, pixel por pixel. É de dedinho. ☝🏽💜
