// =============================================
// EDUSNAKE WORLD - GAME DATA
// =============================================

export const ALPHABETS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const HINDI_SWAR = ['अ','आ','इ','ई','उ','ऊ','ए','ऐ','ओ','औ','अं','अः'];

export const HINDI_VYANJAN = [
  'क','ख','ग','घ','ङ',
  'च','छ','ज','झ','ञ',
  'ट','ठ','ड','ढ','ण',
  'त','थ','द','ध','न',
  'प','फ','ब','भ','म',
  'य','र','ल','व',
  'श','ष','स','ह'
];

export const NUMBERS = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20'];

export const WORDS = [
  { word: 'APPLE',  emoji: '🍎', meaning: 'A red fruit' },
  { word: 'BALL',   emoji: '⚽', meaning: 'A round toy' },
  { word: 'CAT',    emoji: '🐱', meaning: 'A small pet' },
  { word: 'DOG',    emoji: '🐶', meaning: 'A loyal pet' },
  { word: 'EGG',    emoji: '🥚', meaning: 'Laid by hens' },
  { word: 'FISH',   emoji: '🐟', meaning: 'Lives in water' },
  { word: 'GOAT',   emoji: '🐐', meaning: 'A farm animal' },
  { word: 'HEN',    emoji: '🐔', meaning: 'A female bird' },
  { word: 'ICE',    emoji: '🧊', meaning: 'Frozen water' },
  { word: 'JAM',    emoji: '🫙', meaning: 'Sweet spread' },
  { word: 'KITE',   emoji: '🪁', meaning: 'Flies in wind' },
  { word: 'LION',   emoji: '🦁', meaning: 'King of jungle' },
  { word: 'MANGO',  emoji: '🥭', meaning: 'King of fruits' },
  { word: 'NUT',    emoji: '🥜', meaning: 'Hard shell seed' },
  { word: 'OWL',    emoji: '🦉', meaning: 'Night bird' },
  { word: 'PIG',    emoji: '🐷', meaning: 'A pink animal' },
  { word: 'QUEEN',  emoji: '👑', meaning: 'Rules a kingdom' },
  { word: 'RAT',    emoji: '🐭', meaning: 'Small rodent' },
  { word: 'SUN',    emoji: '☀️', meaning: 'Gives us light' },
  { word: 'TOP',    emoji: '🪀', meaning: 'A spinning toy' },
  { word: 'URN',    emoji: '🏺', meaning: 'A tall vase' },
  { word: 'VAN',    emoji: '🚐', meaning: 'A big vehicle' },
  { word: 'WEB',    emoji: '🕸️', meaning: 'Spider makes it' },
  { word: 'YAK',    emoji: '🐂', meaning: 'Mountain animal' },
  { word: 'ZOO',    emoji: '🦒', meaning: 'Animals live here' },
];

export const SHAPES = [
  { name: 'Circle',    symbol: '⬤',  color: '#ff6b6b' },
  { name: 'Square',    symbol: '■',  color: '#ffd700' },
  { name: 'Triangle',  symbol: '▲',  color: '#00ff88' },
  { name: 'Rectangle', symbol: '▬',  color: '#00bfff' },
  { name: 'Star',      symbol: '★',  color: '#ff9a00' },
  { name: 'Heart',     symbol: '♥',  color: '#ff6bff' },
  { name: 'Diamond',   symbol: '◆',  color: '#aaffaa' },
  { name: 'Oval',      symbol: '⬬',  color: '#ffaaff' },
];

export const COLORS_MODE = [
  { name: 'Red',    hex: '#ff4444' },
  { name: 'Blue',   hex: '#4488ff' },
  { name: 'Green',  hex: '#44dd44' },
  { name: 'Yellow', hex: '#ffdd22' },
  { name: 'Orange', hex: '#ff8822' },
  { name: 'Purple', hex: '#aa44ff' },
  { name: 'Pink',   hex: '#ff88cc' },
  { name: 'White',  hex: '#eeeeee' },
];

export const MATH_OPS = [
  {
    level: 1,
    gen: () => {
      const a = rand(1, 5), b = rand(1, 5);
      return { question: `${a} + ${b} = ?`, answer: String(a + b), distractors: makeDistractors(a + b, 1, 10) };
    }
  },
  {
    level: 2,
    gen: () => {
      const a = rand(3, 9), b = rand(1, a);
      return { question: `${a} - ${b} = ?`, answer: String(a - b), distractors: makeDistractors(a - b, 0, 9) };
    }
  },
  {
    level: 3,
    gen: () => {
      const a = rand(2, 5), b = rand(2, 4);
      return { question: `${a} × ${b} = ?`, answer: String(a * b), distractors: makeDistractors(a * b, 2, 20) };
    }
  },
];

export const SNAKE_SKINS = [
  { id: 'classic',  name: 'Classic',  emoji: '🐍', headColor: '#00c853', bodyColor: '#00e676', locked: false },
  { id: 'dragon',   name: 'Dragon',   emoji: '🐉', headColor: '#ff6b00', bodyColor: '#ff9a00', locked: true,  cost: 100 },
  { id: 'rainbow',  name: 'Rainbow',  emoji: '🌈', headColor: '#ff6b6b', bodyColor: 'rainbow', locked: true,  cost: 200 },
  { id: 'robot',    name: 'Robot',    emoji: '🤖', headColor: '#aaaaaa', bodyColor: '#888888', locked: true,  cost: 150 },
  { id: 'dino',     name: 'Dino',     emoji: '🦕', headColor: '#44bb44', bodyColor: '#228822', locked: true,  cost: 120 },
  { id: 'space',    name: 'Space',    emoji: '🚀', headColor: '#334499', bodyColor: '#5566cc', locked: true,  cost: 180 },
];

export const WORLDS = [
  { id: 'jungle',  name: 'Jungle',      emoji: '🌿', bg: ['#0d2b0d','#1a4d1a'], unlocked: true  },
  { id: 'ocean',   name: 'Ocean',       emoji: '🌊', bg: ['#001a33','#003366'], unlocked: false, cost: 200 },
  { id: 'space',   name: 'Space',       emoji: '🌌', bg: ['#050510','#0d0d30'], unlocked: false, cost: 300 },
  { id: 'candy',   name: 'Candy World', emoji: '🍭', bg: ['#2d0033','#550055'], unlocked: false, cost: 250 },
  { id: 'dino',    name: 'Dino World',  emoji: '🦕', bg: ['#1a2000','#334000'], unlocked: false, cost: 350 },
  { id: 'school',  name: 'Magic School',emoji: '🏫', bg: ['#1a0a2e','#2d1555'], unlocked: false, cost: 400 },
];

export const ACHIEVEMENTS = [
  { id: 'first_eat',   name: 'First Bite!',       desc: 'Eat your first correct item',     emoji: '🥇', condition: s => s.totalEaten >= 1 },
  { id: 'streak_5',    name: 'Combo x5',           desc: 'Get a 5x combo',                 emoji: '🔥', condition: s => s.maxCombo >= 5 },
  { id: 'score_100',   name: 'Century!',           desc: 'Score 100 points',               emoji: '💯', condition: s => s.highScore >= 100 },
  { id: 'word_done',   name: 'Word Master',        desc: 'Complete a full word',            emoji: '📝', condition: s => s.wordsCompleted >= 1 },
  { id: 'all_alpha',   name: 'Alphabet Hero',      desc: 'Learn all 26 letters',            emoji: '🔤', condition: s => s.learnedAlpha >= 26 },
  { id: 'all_hindi',   name: 'Hindi Champion',     desc: 'Learn all Hindi Swar',            emoji: '🕉️', condition: s => s.learnedHindi >= 12 },
  { id: 'math_10',     name: 'Math Wizard',        desc: 'Answer 10 math questions right',  emoji: '🧮', condition: s => s.mathCorrect >= 10 },
  { id: 'no_mistakes', name: 'Perfectionist',      desc: 'Finish a game with no mistakes',  emoji: '✨', condition: s => s.perfectGames >= 1 },
];

// =============================================
// HELPER FUNCTIONS
// =============================================
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeDistractors(correct, min, max) {
  const set = new Set();
  while (set.size < 5) {
    const v = rand(min, max);
    if (v !== correct) set.add(v);
  }
  return [...set].map(String);
}

export const GAME_MODES = [
  {
    id: 'alpha',
    name: 'A-B-C Hunt',
    desc: 'Find the correct alphabet!',
    emoji: '🔤',
    color: '#00bfff',
    bg: '#001a33',
    items: ALPHABETS,
    maxItems: 10,
  },
  {
    id: 'hindi',
    name: 'Hindi Swar',
    desc: 'अ आ इ ई — eat the right vowel!',
    emoji: '🕉️',
    color: '#ff9a00',
    bg: '#2d1800',
    items: HINDI_SWAR,
    maxItems: 8,
  },
  {
    id: 'vyanjan',
    name: 'Hindi Vyanjan',
    desc: 'क ख ग — find the consonant!',
    emoji: '✍️',
    color: '#ff6b6b',
    bg: '#2d0000',
    items: HINDI_VYANJAN,
    maxItems: 10,
  },
  {
    id: 'number',
    name: 'Numbers',
    desc: 'Count 1→20 in order!',
    emoji: '🔢',
    color: '#00e676',
    bg: '#002200',
    items: NUMBERS,
    maxItems: 9,
    sequential: true,
  },
  {
    id: 'word',
    name: 'Word Builder',
    desc: 'Spell the word letter by letter!',
    emoji: '🌟',
    color: '#ff6bff',
    bg: '#1a0033',
    items: ALPHABETS,
    maxItems: 10,
  },
  {
    id: 'math',
    name: 'Math Snake',
    desc: 'Solve 2+3=? Eat the answer!',
    emoji: '➕',
    color: '#ffd700',
    bg: '#1a1400',
    items: NUMBERS,
    maxItems: 8,
  },
  {
    id: 'shapes',
    name: 'Shape Hunt',
    desc: 'Eat the correct shape!',
    emoji: '🔷',
    color: '#aaffaa',
    bg: '#001a00',
    items: SHAPES.map(s => s.symbol),
    maxItems: 8,
  },
  {
    id: 'colors',
    name: 'Color World',
    desc: 'Eat items of the right color!',
    emoji: '🌈',
    color: '#ff9a00',
    bg: '#0d0010',
    items: COLORS_MODE.map(c => c.name),
    maxItems: 8,
  },
];

export default GAME_MODES;
