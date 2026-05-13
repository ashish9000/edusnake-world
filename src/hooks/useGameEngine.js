// =============================================
// EDUSNAKE WORLD - useGameEngine Hook
// =============================================
import { useRef, useState, useCallback, useEffect } from 'react';
import { GAME_MODES, WORDS, MATH_OPS, HINDI_SWAR, HINDI_VYANJAN } from '../data/gameData';
import SFX, { speakEnglish, speakHindi } from '../utils/audio';
import { recordGameEnd, loadState } from '../utils/storage';

const INITIAL_SPEED = 180;
const MIN_SPEED = 75;
const SPEED_INCREASE = 8;
const COLS = 14;
const LIVES_START = 3;

// ── helpers ──────────────────────────────────
function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function makeDistractors(correct, pool, count = 7) {
  const set = new Set();
  const filtered = pool.filter(p => p !== correct);
  while (set.size < count && filtered.length > 0) {
    set.add(filtered[rand(0, filtered.length - 1)]);
  }
  return [...set];
}

function randomWord() {
  return WORDS[rand(0, WORDS.length - 1)];
}

function randomMathQ(level = 1) {
  const op = MATH_OPS[Math.min(level - 1, MATH_OPS.length - 1)];
  return op.gen();
}

// ── main hook ────────────────────────────────
export default function useGameEngine(canvasRef, mode, onGameOver) {
  const stateRef = useRef(null);
  const loopRef  = useRef(null);
  const [displayState, setDisplayState] = useState(null);

  // Sync display state from ref (called after every mutation)
  const sync = useCallback(() => {
    if (stateRef.current) setDisplayState({ ...stateRef.current });
  }, []);

  // ── Initialize / Reset ──────────────────────
  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const wrap = canvas.parentElement;
    const size = Math.min(wrap.clientWidth, wrap.clientHeight);
    const cellSize = Math.floor(size / COLS);
    const cols = Math.floor(wrap.clientWidth / cellSize);
    const rows = Math.floor(wrap.clientHeight / cellSize);
    canvas.width  = cols * cellSize;
    canvas.height = rows * cellSize;

    const midX = Math.floor(cols / 2);
    const midY = Math.floor(rows / 2);

    // Mode-specific initialization
    let target = null, wordObj = null, mathQ = null, wordIdx = 0, numSeq = 0;
    const modeData = GAME_MODES.find(m => m.id === mode);

    if (mode === 'word') {
      wordObj = randomWord();
      target  = wordObj.word[0];
    } else if (mode === 'math') {
      mathQ  = randomMathQ(1);
      target = mathQ.answer;
    } else if (mode === 'number') {
      numSeq = 0;
      target = '1';
    } else {
      const pool = modeData?.items || [];
      target = pool[rand(0, pool.length - 1)];
    }

    stateRef.current = {
      // canvas
      cols, rows, cellSize,
      // snake
      snake: [
        { x: midX,     y: midY },
        { x: midX - 1, y: midY },
        { x: midX - 2, y: midY },
      ],
      dir:     { x: 1, y: 0 },
      nextDir: { x: 1, y: 0 },
      // game
      score: 0,
      lives: LIVES_START,
      combo: 0,
      maxCombo: 0,
      xp: 0,
      speed: INITIAL_SPEED,
      paused: false,
      gameOver: false,
      mistakes: 0,
      // items on board
      items: [],
      // learning
      target,
      wordObj,
      wordIdx,
      mathQ,
      numSeq,
      learned: [],
      learnedSet: new Set(),
      wordsCompleted: 0,
      // feedback
      floatMsg: null,
      shake: false,
      // mode ref
      mode,
      modeData,
    };

    spawnAllItems();
    sync();
  }, [canvasRef, mode, sync]); // eslint-disable-line

  // ── Item spawning ───────────────────────────
  const spawnAllItems = useCallback(() => {
    const s = stateRef.current;
    if (!s) return;
    const { cols, rows, snake, mode, modeData, target, mathQ } = s;

    s.items = [];

    // Determine distractors
    let pool = [];
    if (mode === 'math') {
      pool = makeDistractors(target, Array.from({ length: 20 }, (_, i) => String(i)));
    } else if (mode === 'number') {
      pool = makeDistractors(target, Array.from({ length: 20 }, (_, i) => String(i + 1)));
    } else if (mode === 'word') {
      pool = makeDistractors(target, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''));
    } else {
      pool = makeDistractors(target, modeData?.items || []);
    }

    // Place target first
    placeItem(target, true);
    // Place distractors
    const count = Math.min(pool.length, 6 + Math.floor(s.score / 40));
    for (let i = 0; i < count; i++) placeItem(pool[i], false);
  }, []);

  function placeItem(value, isTarget) {
    const s = stateRef.current;
    const { cols, rows, snake, items } = s;
    for (let tries = 0; tries < 60; tries++) {
      const x = rand(0, cols - 1);
      const y = rand(0, rows - 1);
      if (!snake.some(seg => seg.x === x && seg.y === y) &&
          !items.some(it  => it.x  === x && it.y  === y)) {
        items.push({ x, y, value, isTarget });
        return;
      }
    }
  }

  // ── Advance target ──────────────────────────
  const advanceTarget = useCallback(() => {
    const s = stateRef.current;
    if (!s) return;
    const { mode, modeData } = s;

    if (mode === 'word') {
      s.wordIdx++;
      if (s.wordIdx >= s.wordObj.word.length) {
        // Word complete!
        SFX.wordComplete();
        s.score       += 50;
        s.wordsCompleted++;
        s.floatMsg = { text: `🌟 ${s.wordObj.word}!`, color: '#ffd700' };
        s.learnedSet.add(s.wordObj.word);
        s.learned = [...s.learnedSet];
        s.wordObj = randomWord();
        s.wordIdx = 0;
      }
      s.target = s.wordObj.word[s.wordIdx];
    } else if (mode === 'number') {
      s.numSeq++;
      const nums = modeData?.items || [];
      s.target = nums[s.numSeq % nums.length];
    } else if (mode === 'math') {
      const lvl = Math.floor(s.score / 80) + 1;
      s.mathQ  = randomMathQ(lvl);
      s.target = s.mathQ.answer;
    } else {
      const pool = modeData?.items || [];
      let next = s.target;
      while (next === s.target && pool.length > 1) {
        next = pool[rand(0, pool.length - 1)];
      }
      s.target = next;
    }
  }, []);

  // ── Tick (one game step) ────────────────────
  const tick = useCallback(() => {
    const s = stateRef.current;
    if (!s || s.paused || s.gameOver) return;

    s.dir = { ...s.nextDir };
    const head = {
      x: (s.snake[0].x + s.dir.x + s.cols) % s.cols,
      y: (s.snake[0].y + s.dir.y + s.rows) % s.rows,
    };

    // Self collision
    if (s.snake.some(seg => seg.x === head.x && seg.y === head.y)) {
      loseLife();
      return;
    }

    s.snake.unshift(head);
    s.floatMsg = null;
    s.shake    = false;

    // Check item collision
    const hitIdx = s.items.findIndex(it => it.x === head.x && it.y === head.y);
    if (hitIdx >= 0) {
      const hit = s.items.splice(hitIdx, 1)[0];
      if (hit.value === s.target) {
        eatCorrect(hit);
      } else {
        eatWrong(hit);
        s.snake.pop(); // don't grow
        s.items.push({ ...hit }); // re-place
      }
    } else {
      s.snake.pop();
    }

    draw();
    sync();
  }, [sync]); // eslint-disable-line

  // ── Eat correct ─────────────────────────────
  function eatCorrect(item) {
    const s = stateRef.current;
    SFX.correct();
    s.combo++;
    if (s.combo > s.maxCombo) s.maxCombo = s.combo;
    const pts = 10 * s.combo;
    s.score += pts;
    s.xp    += 20;

    // Track learned items
    if (!s.learnedSet.has(item.value)) {
      s.learnedSet.add(item.value);
      s.learned = [...s.learnedSet];
    }

    const msgs = ['Great! 🎉', 'Awesome! ⭐', 'Perfect! 💯', 'Wow! 🌟', 'Super! 🚀'];
    s.floatMsg = { text: msgs[rand(0, msgs.length - 1)] + ` +${pts}`, color: '#00ff88' };

    // TTS
    if (s.mode === 'hindi' || s.mode === 'vyanjan') speakHindi(item.value);
    else speakEnglish(item.value);

    // Adaptive speed
    if (s.score > 0 && s.score % 50 === 0) {
      s.speed = Math.max(MIN_SPEED, s.speed - SPEED_INCREASE);
      restartLoop();
    }

    advanceTarget();
    spawnAllItems();
  }

  // ── Eat wrong ───────────────────────────────
  function eatWrong(item) {
    const s = stateRef.current;
    SFX.wrong();
    s.combo    = 0;
    s.mistakes++;
    s.score    = Math.max(0, s.score - 5);
    s.shake    = true;
    s.floatMsg = { text: `Oops! -5 🙈`, color: '#ff4444' };
    if (s.mode === 'hindi' || s.mode === 'vyanjan') speakHindi(s.target);
    else speakEnglish(`Find ${s.target}!`);
  }

  // ── Lose life ───────────────────────────────
  function loseLife() {
    const s = stateRef.current;
    SFX.die();
    s.lives--;
    s.combo = 0;
    s.floatMsg = { text: '💔 Ouch!', color: '#ff4444' };

    if (s.lives <= 0) {
      s.gameOver = true;
      clearInterval(loopRef.current);
      const savedState = recordGameEnd({
        score:    s.score,
        mode:     s.mode,
        mistakes: s.mistakes,
        learned:  s.learned,
      });
      sync();
      onGameOver?.({ score: s.score, learned: s.learned, wordsCompleted: s.wordsCompleted, savedState });
      return;
    }

    // Reset snake position
    const midX = Math.floor(s.cols / 2);
    const midY = Math.floor(s.rows / 2);
    s.snake  = [
      { x: midX,     y: midY },
      { x: midX - 1, y: midY },
      { x: midX - 2, y: midY },
    ];
    s.dir    = { x: 1, y: 0 };
    s.nextDir = { x: 1, y: 0 };
    sync();
  }

  // ── Draw ─────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const s = stateRef.current;
    if (!canvas || !s) return;
    const ctx = canvas.getContext('2d');
    const { cols, rows, cellSize: cs, snake, items, dir, mode, modeData } = s;
    const W = canvas.width, H = canvas.height;

    // Background
    ctx.fillStyle = '#08081e';
    ctx.fillRect(0, 0, W, H);

    // Grid dots
    ctx.fillStyle = 'rgba(255,255,255,0.03)';
    for (let x = 0; x < cols; x++) for (let y = 0; y < rows; y++) {
      ctx.fillRect(x * cs + cs / 2 - 1, y * cs + cs / 2 - 1, 2, 2);
    }

    // Items
    items.forEach(item => {
      const px = item.x * cs, py = item.y * cs;
      const isT = item.value === s.target;
      const accentColor = modeData?.color || '#00bfff';

      ctx.save();
      ctx.translate(px + cs / 2, py + cs / 2);

      if (isT) {
        ctx.shadowColor = accentColor;
        ctx.shadowBlur  = 16;
      }

      // Circle bg
      ctx.beginPath();
      ctx.arc(0, 0, cs * 0.42, 0, Math.PI * 2);
      ctx.fillStyle   = isT ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.4)';
      ctx.fill();
      ctx.strokeStyle = isT ? accentColor : 'rgba(255,255,255,0.18)';
      ctx.lineWidth   = isT ? 2.5 : 1;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Text
      ctx.fillStyle    = isT ? accentColor : 'rgba(255,255,255,0.75)';
      const fontSize   = item.value.length > 2 ? cs * 0.28 : cs * 0.38;
      ctx.font         = `bold ${fontSize}px 'Nunito', 'Noto Sans Devanagari', sans-serif`;
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.value, 0, 1);
      ctx.restore();
    });

    // Snake
    const skin = loadState().currentSkin;
    snake.forEach((seg, i) => {
      const px = seg.x * cs, py = seg.y * cs;
      ctx.save();
      ctx.translate(px + cs / 2, py + cs / 2);

      if (i === 0) {
        // Head with glow
        ctx.shadowColor = '#00ff88';
        ctx.shadowBlur  = 14;
        ctx.beginPath();
        ctx.roundRect(-cs * 0.44, -cs * 0.44, cs * 0.88, cs * 0.88, cs * 0.22);
        ctx.fillStyle = getHeadColor(skin);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Eyes
        drawEyes(ctx, dir, cs);
      } else {
        // Body gradient by segment index
        const t = i / snake.length;
        ctx.beginPath();
        ctx.roundRect(-cs * 0.38, -cs * 0.38, cs * 0.76, cs * 0.76, cs * 0.15);
        ctx.fillStyle = getBodyColor(skin, t, i);
        ctx.fill();
      }
      ctx.restore();
    });
  }, [canvasRef]); // eslint-disable-line

  // ── Direction ────────────────────────────────
  const changeDir = useCallback((dx, dy) => {
    const s = stateRef.current;
    if (!s) return;
    if (dx === 1  && s.dir.x === -1) return;
    if (dx === -1 && s.dir.x ===  1) return;
    if (dy === 1  && s.dir.y === -1) return;
    if (dy === -1 && s.dir.y ===  1) return;
    s.nextDir = { x: dx, y: dy };
  }, []);

  // ── Pause ────────────────────────────────────
  const togglePause = useCallback(() => {
    const s = stateRef.current;
    if (!s) return;
    s.paused = !s.paused;
    sync();
  }, [sync]);

  // ── Loop management ──────────────────────────
  const restartLoop = useCallback(() => {
    clearInterval(loopRef.current);
    loopRef.current = setInterval(tick, stateRef.current?.speed || INITIAL_SPEED);
  }, [tick]);

  // ── Start ────────────────────────────────────
  const start = useCallback(() => {
    init();
    restartLoop();
  }, [init, restartLoop]);

  // ── Keyboard ─────────────────────────────────
  useEffect(() => {
    const keyMap = {
      ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0],
      w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0],
    };
    const handler = e => {
      if (keyMap[e.key]) {
        e.preventDefault();
        changeDir(...keyMap[e.key]);
      }
      if (e.key === 'p' || e.key === 'P') togglePause();
    };
    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
      clearInterval(loopRef.current);
    };
  }, [changeDir, togglePause]);

  return { start, changeDir, togglePause, displayState, draw };
}

// ── helpers ──────────────────────────────────
function getHeadColor(skin) {
  const map = {
    classic: '#00c853', dragon: '#ff6b00', rainbow: '#ff6b6b',
    robot: '#aaaaaa', dino: '#44bb44', space: '#334499',
  };
  return map[skin] || '#00c853';
}

function getBodyColor(skin, t, idx) {
  if (skin === 'rainbow') {
    const hue = (idx * 25) % 360;
    return `hsl(${hue},80%,45%)`;
  }
  const map = {
    classic: () => { const g = Math.floor(200 - t * 80); return `rgb(0,${g},70)`; },
    dragon:  () => { const r = Math.floor(255 - t * 60); return `rgb(${r},${Math.floor(120 - t*50)},0)`; },
    robot:   () => { const v = Math.floor(160 - t * 60); return `rgb(${v},${v},${v})`; },
    dino:    () => { const g = Math.floor(180 - t * 80); return `rgb(30,${g},30)`; },
    space:   () => { const b = Math.floor(200 - t * 80); return `rgb(20,40,${b})`; },
  };
  return (map[skin] || map.classic)();
}

function drawEyes(ctx, dir, cs) {
  const eyeOffset = cs * 0.14;
  const eyeR      = cs * 0.1;
  const angle     = Math.atan2(dir.y, dir.x);
  [-1, 1].forEach(side => {
    const perpAngle = angle - side * Math.PI / 2;
    const ex = Math.cos(perpAngle) * eyeOffset;
    const ey = Math.sin(perpAngle) * eyeOffset;
    ctx.beginPath(); ctx.arc(ex, ey, eyeR, 0, Math.PI * 2);
    ctx.fillStyle = '#fff'; ctx.fill();
    ctx.beginPath();
    ctx.arc(
      ex + Math.cos(angle) * eyeR * 0.4,
      ey + Math.sin(angle) * eyeR * 0.4,
      eyeR * 0.5, 0, Math.PI * 2
    );
    ctx.fillStyle = '#111'; ctx.fill();
  });
}
