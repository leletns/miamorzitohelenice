// ============================================================
// Conteúdo personalizado do presente: frases, desafios e carta
// ============================================================

// Frases personalizadas de cada cantinho (uma é sorteada ao
// completar uma fase daquele cenário)
const PHRASES = {
  viaparque: [
    'Até banquinho de shopping vira lugar especial quando é do teu lado. Pense verde, ame a Helen.',
    'Via Parque, mãos dadas, passos lentos... pressa pra quê, se o melhor lugar é do seu lado?',
    'Qualquer corredor de shopping vira passarela quando você tá comigo.',
  ],
  cinema: [
    'Sofá vermelho, filme passando... e eu só conseguindo olhar pra você.',
    'O melhor filme da sala New York sempre foi a gente.',
    'Pode ser qualquer sessão: do seu lado, todo final é feliz.',
  ],
  mcdonalds: [
    'Nosso amor é tipo McLanche Feliz: simples, e sempre vem com brinde — você.',
    'Méqui, batata e você rindo na minha frente: meu combo favorito.',
    'Nem o sundae é tão doce quanto esse seu sorriso.',
  ],
  lagoa: [
    'Com você até a volta na Lagoa vira o melhor rolê do mundo.',
    'A Lagoa fica bonita de tarde, mas fica perfeita com você do lado.',
    'Pedalinho, calçadão, sua mão na minha: é disso que eu chamo paz.',
  ],
  praia: [
    'O mar à noite é bonito, mas eu tava olhando os olhinhos de jabuticaba.',
    'Praia de noite, pé na areia, você: minha definição de infinito.',
    'A lua viu a gente e ficou com inveja.',
  ],
  rocinha: [
    'De ladeira em ladeira, de laje em laje: contigo qualquer caminho é casa.',
    'Nenhuma subida é difícil quando é com você.',
    'Casa não é lugar, é você. Em qualquer cantinho do mundo.',
  ],
};

// Cenários na ordem das fases
const THEME_ORDER = ['viaparque', 'cinema', 'mcdonalds', 'lagoa', 'praia', 'rocinha'];

const THEME_NAMES = {
  viaparque: 'Via Parque',
  cinema: 'Cine New York',
  mcdonalds: 'Praça de alimentação',
  lagoa: 'Lagoa',
  praia: 'Praia à noite',
  rocinha: 'Rocinha',
};

// Legendas das 10 fotos (polaroids do álbum e da cartinha)
const PHOTOS = [
  { src: 'assets/photos/p01.jpg', caption: 'Nós duas, do jeito que eu amo' },
  { src: 'assets/photos/p02.jpg', caption: 'Esse sorriso é meu lugar favorito' },
  { src: 'assets/photos/p03.jpg', caption: 'Pense verde, ame a Helen' },
  { src: 'assets/photos/p04.jpg', caption: 'Deitadas no banco, vendo o mundo passar' },
  { src: 'assets/photos/p05.jpg', caption: 'Festa, luz rosa e a gente' },
  { src: 'assets/photos/p06.jpg', caption: 'Acordar do seu lado é meu presente diário' },
  { src: 'assets/photos/p07.jpg', caption: 'Céu azul com gostinho de beijo seu' },
  { src: 'assets/photos/p08.jpg', caption: 'Apertadinha em você é onde eu moro' },
  { src: 'assets/photos/p09.jpg', caption: 'Qualquer sofá vira lar contigo' },
  { src: 'assets/photos/p10.jpg', caption: 'Aquela noite, aquele beijo, a gente' },
];

// ============================================================
// Tabuleiro do Amor — desafios
// ============================================================
const BOARD_CUTE = [
  'Diga 3 coisas que você ama na outra.',
  'Conte sua memória favorita de vocês duas.',
  'Elogie os olhinhos de jabuticaba dela.',
  'Cante um trecho de Pupila pra ela.',
  'Abraço de 10 segundos sem rir. (Boa sorte.)',
  'Conte algo que você aprendeu com ela.',
  'Descreva a outra usando só 3 palavras.',
  'Conte qual foi o momento em que pensou: "é ela".',
  'Faça a outra rir em 30 segundos. Se conseguir, ande 1 casa.',
  'Diga qual é o cheiro dela que você mais ama.',
  'Conte um sonho que você quer realizar com ela.',
  'Imite a gata dela. Miau obrigatório.',
  'Agradeça por algo que ela fez essa semana.',
  'Diga o que você mais admira nela.',
  'Olhem-se nos olhos por 15 segundos sem desviar.',
];

const BOARD_SPICY = [
  'Beije o pescoço dela.',
  'Massagem de 1 minuto onde ela escolher.',
  'Sussurre algo no ouvido dela.',
  'Beijo de 15 segundos. Cronometrado.',
  'Conte um desejo que você tem com ela.',
  'Deixe ela escolher: beijo ou mordidinha.',
  'Dê um beijo onde ela pedir.',
  'Diga, olhando nos olhos, o que ela tem de mais irresistível.',
  'Cafuné de 1 minuto, do jeito que ela gosta.',
  'Beijo de cinema: pode caprichar.',
];

const BOARD_LUCK = [
  { text: 'Sorte! O amor te empurra: avance 2 casas.', move: 2 },
  { text: 'Saudade bateu: volte 2 casas (mas vá de mãos dadas).', move: -2 },
  { text: 'Os olhinhos de jabuticaba hipnotizaram o dado: jogue de novo!', again: true },
  { text: 'Vento da praia à noite: avance 3 casas!', move: 3 },
  { text: 'Parou pra comprar McFlurry: volte 1 casa (valeu a pena).', move: -1 },
  { text: 'A gata deitou no tabuleiro: todo mundo fica onde está, mas vocês se beijam.', move: 0 },
];

// ============================================================
// A declaração — Dia dos Namorados 2026
// ============================================================
const LETTER_TITLE = 'Pra você, meu Leãozinho. 🦁💗';
const LETTER_PARAGRAPHS = [
  'Feliz Dia dos Namorados, amor.',
  'Eu podia ter comprado flor, chocolate, qualquer coisa que se acaba. Mas você sabe que eu sou de guardar — então eu construí um lugarzinho que é nosso e que não acaba nunca. Tá aqui dentro: nossos cantos, nossas gatinhas, nossos olhinhos de jabuticaba.',
  'Você já sabe que eu falo muito, kkkkk. Mas hoje eu quis falar diferente: em fase, em coração, em aliança de prata escondida no caminho. Porque é isso que você fez comigo — transformou minha vida em um lugar onde dá vontade de continuar jogando, mesmo quando a fase aperta. Com você eu não tenho pressa de chegar no final. Eu gosto é do caminho.',
  'Cada cenário desse jogo é um pedaço de nós: o banquinho, o sofá vermelho do cinema, o lanche que vira banquete porque você tá rindo na minha frente, a lagoa, o mar de noite, as ladeiras. Em todos eles eu descobri a mesma coisa: casa não é lugar, é você.',
  'Então joga sem medo, meu amor. Perde coração, ganha de novo, tenta outra vez — que nem a gente. Eu tô aqui pra nós, pelo tempo que for. Pode confiar: é de dedinho. ☝🏽',
  'Te amo, meus olhinhos de jabuticaba.\nHoje, amanhã e em todas as fases que vierem.',
];
const LETTER_SIGNATURE = '— Tua, Cascãozinho 💜';
