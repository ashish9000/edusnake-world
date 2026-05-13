// =============================================
// EDUSNAKE WORLD - PERSISTENCE / STORAGE
// =============================================

const KEY = 'edusnake_';

const defaultState = {
  highScore: 0,
  totalCoins: 0,
  totalEaten: 0,
  maxCombo: 0,
  wordsCompleted: 0,
  learnedAlpha: 0,
  learnedHindi: 0,
  mathCorrect: 0,
  perfectGames: 0,
  gamesPlayed: 0,
  dailyStreak: 0,
  lastPlayedDate: null,
  unlockedSkins: ['classic'],
  currentSkin: 'classic',
  unlockedWorlds: ['jungle'],
  currentWorld: 'jungle',
  achievements: [],
  soundEnabled: true,
  musicEnabled: true,
  vibrationEnabled: true,
  dyslexiaMode: false,
  autismMode: false,
  weakAlpha: [],
  weakHindi: [],
  weeklyScores: [],
  totalPlayTime: 0,   // seconds
  sessionStart: null,
};

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY + 'state');
    if (!raw) return { ...defaultState };
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return { ...defaultState };
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY + 'state', JSON.stringify(state));
  } catch (e) {
    console.warn('Storage save failed:', e);
  }
}

export function updateState(updates) {
  const current = loadState();
  const next = { ...current, ...updates };
  saveState(next);
  return next;
}

export function getHighScore() {
  return loadState().highScore;
}

export function setHighScore(score) {
  const state = loadState();
  if (score > state.highScore) {
    updateState({ highScore: score });
    return true; // new record!
  }
  return false;
}

export function addCoins(amount) {
  const state = loadState();
  updateState({ totalCoins: state.totalCoins + amount });
}

export function spendCoins(amount) {
  const state = loadState();
  if (state.totalCoins >= amount) {
    updateState({ totalCoins: state.totalCoins - amount });
    return true;
  }
  return false;
}

export function unlockSkin(skinId, cost) {
  const state = loadState();
  if (state.unlockedSkins.includes(skinId)) return false;
  if (spendCoins(cost)) {
    updateState({ unlockedSkins: [...state.unlockedSkins, skinId] });
    return true;
  }
  return false;
}

export function setSkin(skinId) {
  const state = loadState();
  if (state.unlockedSkins.includes(skinId)) {
    updateState({ currentSkin: skinId });
    return true;
  }
  return false;
}

export function unlockWorld(worldId, cost) {
  const state = loadState();
  if (state.unlockedWorlds.includes(worldId)) return false;
  if (spendCoins(cost)) {
    updateState({ unlockedWorlds: [...state.unlockedWorlds, worldId] });
    return true;
  }
  return false;
}

export function checkDailyStreak() {
  const state = loadState();
  const today = new Date().toDateString();
  if (state.lastPlayedDate === today) {
    return state.dailyStreak; // already updated today
  }
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const newStreak = state.lastPlayedDate === yesterday ? state.dailyStreak + 1 : 1;
  updateState({ dailyStreak: newStreak, lastPlayedDate: today });
  return newStreak;
}

export function recordGameEnd({ score, mode, mistakes, learned }) {
  const state = loadState();
  const updates = {
    gamesPlayed: state.gamesPlayed + 1,
    totalEaten: state.totalEaten + (learned?.length || 0),
  };
  if (score > state.highScore) updates.highScore = score;
  if (mistakes === 0) updates.perfectGames = state.perfectGames + 1;
  if (mode === 'math') updates.mathCorrect = state.mathCorrect + (learned?.length || 0);
  if (mode === 'word') updates.wordsCompleted = state.wordsCompleted + (learned?.length || 0);
  if (mode === 'alpha') updates.learnedAlpha = Math.max(state.learnedAlpha, learned?.length || 0);
  if (mode === 'hindi') updates.learnedHindi = Math.max(state.learnedHindi, learned?.length || 0);

  // Weekly scores
  const scores = [...(state.weeklyScores || []), { score, mode, date: new Date().toISOString() }]
    .slice(-50); // keep last 50 games
  updates.weeklyScores = scores;

  // Coins: 1 per 10 points
  updates.totalCoins = state.totalCoins + Math.floor(score / 10);

  updateState(updates);
  checkDailyStreak();
  return loadState();
}

export function getProgressStats() {
  const state = loadState();
  const recentScores = (state.weeklyScores || []).slice(-7).map(s => s.score);
  const avgScore = recentScores.length
    ? Math.round(recentScores.reduce((a, b) => a + b, 0) / recentScores.length)
    : 0;
  return {
    ...state,
    avgScore,
    recentScores,
  };
}

export function resetProgress() {
  localStorage.removeItem(KEY + 'state');
}

export default { loadState, saveState, updateState, getHighScore, setHighScore, addCoins, spendCoins };
