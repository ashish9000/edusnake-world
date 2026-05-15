// =============================================
// EDUSNAKE WORLD - useGameEngine v3 PREMIUM
// =============================================
import { useRef, useState, useCallback, useEffect } from 'react';
import { GAME_MODES, WORDS, MATH_OPS } from '../data/gameData';
import SFX, { speakEnglish, speakHindi } from '../utils/audio';
import { recordGameEnd, loadState } from '../utils/storage';

const INITIAL_SPEED = 200;
const MIN_SPEED     = 90;
const SPEED_STEP    = 10;
const COLS          = 14;
const LIVES_START   = 3;

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function makeDistractors(correct, pool, count = 7) {
  const set = new Set();
  const filtered = pool.filter(p => p !== correct);
  let tries = 0;
  while (set.size < Math.min(count, filtered.length) && tries < 100) {
    set.add(filtered[rand(0, filtered.length - 1)]);
    tries++;
  }
  return [...set];
}

function randomWord() { return WORDS[rand(0, WORDS.length - 1)]; }

function randomMathQ(level = 1) {
  const op = MATH_OPS[Math.min(level - 1, MATH_OPS.length - 1)];
  return op.gen();
}

// ── Cartoon snake colors per skin ─────────────
const SKIN_COLORS = {
  classic: { head:'#00E676', body1:'#00C853', body2:'#00963E', tongue:'#FF1744', eye:'#fff', pupil:'#111' },
  dragon:  { head:'#FF6D00', body1:'#E65100', body2:'#BF360C', tongue:'#FFD740', eye:'#FFD740', pupil:'#111' },
  rainbow: null, // special
  robot:   { head:'#B0BEC5', body1:'#90A4AE', body2:'#607D8B', tongue:'#FF4081', eye:'#00E5FF', pupil:'#000' },
  dino:    { head:'#69F0AE', body1:'#00E676', body2:'#00BFA5', tongue:'#FF1744', eye:'#fff', pupil:'#1a1a1a' },
  space:   { head:'#7C4DFF', body1:'#651FFF', body2:'#4527A0', tongue:'#E040FB', eye:'#E040FB', pupil:'#000' },
};

export default function useGameEngine(canvasRef, mode, onGameOver) {
  const stateRef = useRef(null);
  const loopRef  = useRef(null);
  const animRef  = useRef(0);
  const [displayState, setDisplayState] = useState(null);

  const sync = useCallback(() => {
    if (stateRef.current) setDisplayState({ ...stateRef.current });
  }, []);

  // ── Init ──────────────────────────────────────
  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const wrap = canvas.parentElement;
    const size = Math.min(wrap.clientWidth, wrap.clientHeight);
    const cellSize = Math.floor(size / COLS);
    const cols = Math.floor(wrap.clientWidth  / cellSize);
    const rows = Math.floor(wrap.clientHeight / cellSize);
    canvas.width  = cols * cellSize;
    canvas.height = rows * cellSize;

    const midX = Math.floor(cols / 2);
    const midY = Math.floor(rows / 2);
    const modeData = GAME_MODES.find(m => m.id === mode);

    let target = null, wordObj = null, mathQ = null, numSeq = 0;
    if (mode === 'word') {
      wordObj = randomWord();
      target  = wordObj.word[0];
    } else if (mode === 'math') {
      mathQ  = randomMathQ(1);
      target = mathQ.answer;
    } else if (mode === 'number') {
      target = '1'; numSeq = 0;
    } else {
      const pool = modeData?.items || [];
      target = pool[rand(0, pool.length - 1)];
    }

    stateRef.current = {
      cols, rows, cellSize,
      snake: [
        { x: midX,     y: midY },
        { x: midX - 1, y: midY },
        { x: midX - 2, y: midY },
      ],
      dir: { x: 1, y: 0 }, nextDir: { x: 1, y: 0 },
      score: 0, lives: LIVES_START, combo: 0, maxCombo: 0,
      xp: 0, speed: INITIAL_SPEED, paused: false, gameOver: false,
      mistakes: 0, items: [],
      target, wordObj, wordIdx: 0, mathQ, numSeq,
      learned: [], learnedSet: new Set(),
      wordsCompleted: 0, floatMsg: null, shake: false,
      mode, modeData,
      // animation state
      tongueOut: false, tongueTimer: 0,
    };

    spawnAllItems();
    sync();
  }, [canvasRef, mode, sync]); // eslint-disable-line

  // ── Spawn items ───────────────────────────────
  const spawnAllItems = useCallback(() => {
    const s = stateRef.current;
    if (!s) return;
    const { cols, rows, snake, mode, modeData, target, mathQ } = s;
    s.items = [];

    let pool = [];
    if (mode === 'math') {
      pool = makeDistractors(target, Array.from({length:20},(_,i)=>String(i)));
    } else if (mode === 'number') {
      pool = makeDistractors(target, Array.from({length:20},(_,i)=>String(i+1)));
    } else if (mode === 'word') {
      pool = makeDistractors(target, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''));
    } else {
      pool = makeDistractors(target, modeData?.items || []);
    }

    placeItem(target, true);
    const count = Math.min(pool.length, 7 + Math.floor(s.score / 50));
    for (let i = 0; i < count; i++) placeItem(pool[i], false);
  }, []); // eslint-disable-line

  function placeItem(value, isTarget) {
    const s = stateRef.current;
    for (let t = 0; t < 60; t++) {
      const x = rand(0, s.cols - 1);
      const y = rand(0, s.rows - 1);
      if (!s.snake.some(seg => seg.x===x && seg.y===y) &&
          !s.items.some(it  => it.x ===x && it.y ===y)) {
        s.items.push({ x, y, value, isTarget });
        return;
      }
    }
  }

  // ── Advance target ────────────────────────────
  const advanceTarget = useCallback(() => {
    const s = stateRef.current;
    if (!s) return;
    const { mode, modeData } = s;

    if (mode === 'word') {
      s.wordIdx++;
      if (s.wordIdx >= s.wordObj.word.length) {
        SFX.wordComplete();
        s.score += 50; s.wordsCompleted++;
        s.floatMsg = { text:`🌟 ${s.wordObj.word}!`, color:'#FFD700' };
        s.learnedSet.add(s.wordObj.word);
        s.learned = [...s.learnedSet];
        s.wordObj = randomWord(); s.wordIdx = 0;
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
      let tries = 0;
      while (next === s.target && pool.length > 1 && tries < 20) {
        next = pool[rand(0, pool.length - 1)]; tries++;
      }
      s.target = next;
    }
  }, []);

  // ── Tick ──────────────────────────────────────
  const tick = useCallback(() => {
    const s = stateRef.current;
    if (!s || s.paused || s.gameOver) return;

    s.dir = { ...s.nextDir };
    const head = {
      x: (s.snake[0].x + s.dir.x + s.cols) % s.cols,
      y: (s.snake[0].y + s.dir.y + s.rows) % s.rows,
    };

    if (s.snake.some(seg => seg.x===head.x && seg.y===head.y)) {
      loseLife(); return;
    }

    s.snake.unshift(head);
    s.floatMsg = null; s.shake = false;

    // Tongue animation
    s.tongueTimer++;
    if (s.tongueTimer % 8 === 0) s.tongueOut = !s.tongueOut;

    const hitIdx = s.items.findIndex(it => it.x===head.x && it.y===head.y);
    if (hitIdx >= 0) {
      const hit = s.items.splice(hitIdx, 1)[0];
      if (hit.value === s.target) { eatCorrect(hit); }
      else { eatWrong(hit); s.snake.pop(); s.items.push({ ...hit }); }
    } else {
      s.snake.pop();
    }

    draw();
    sync();
  }, [sync]); // eslint-disable-line

  // ── Eat correct ───────────────────────────────
  function eatCorrect(item) {
    const s = stateRef.current;
    SFX.correct();
    s.combo++;
    if (s.combo > s.maxCombo) s.maxCombo = s.combo;
    const pts = 10 * s.combo;
    s.score += pts;
    s.xp = Math.min(s.xp + 20, 100);

    if (!s.learnedSet.has(item.value)) {
      s.learnedSet.add(item.value);
      s.learned = [...s.learnedSet];
    }

    const msgs = ['Great! 🎉','Awesome! ⭐','Perfect! 💯','Wow! 🌟','Super! 🚀','Brilliant! 🏆'];
    s.floatMsg = { text: msgs[rand(0, msgs.length-1)] + ` +${pts}`, color:'#00FF88' };

    if (s.mode === 'hindi' || s.mode === 'vyanjan') speakHindi(item.value);
    else speakEnglish(item.value);

    if (s.score > 0 && s.score % 50 === 0) {
      s.speed = Math.max(MIN_SPEED, s.speed - SPEED_STEP);
      restartLoop();
    }
    advanceTarget();
    spawnAllItems();
  }

  // ── Eat wrong ─────────────────────────────────
  function eatWrong(item) {
    const s = stateRef.current;
    SFX.wrong();
    s.combo = 0; s.mistakes++;
    s.score = Math.max(0, s.score - 5);
    s.shake = true;
    s.floatMsg = { text:`Oops! -5 🙈`, color:'#FF4444' };
    if (s.mode === 'hindi' || s.mode === 'vyanjan') speakHindi(s.target);
    else speakEnglish(`Find ${s.target}!`);
  }

  // ── Lose life ─────────────────────────────────
  function loseLife() {
    const s = stateRef.current;
    SFX.die();
    s.lives--; s.combo = 0;
    s.floatMsg = { text:'💔 Ouch!', color:'#FF4444' };
    if (s.lives <= 0) {
      s.gameOver = true;
      clearInterval(loopRef.current);
      const saved = recordGameEnd({ score:s.score, mode:s.mode, mistakes:s.mistakes, learned:s.learned });
      sync();
      onGameOver?.({ score:s.score, learned:s.learned, wordsCompleted:s.wordsCompleted, savedState:saved });
      return;
    }
    const midX = Math.floor(s.cols / 2);
    const midY = Math.floor(s.rows / 2);
    s.snake   = [{ x:midX, y:midY },{ x:midX-1, y:midY },{ x:midX-2, y:midY }];
    s.dir     = { x:1, y:0 }; s.nextDir = { x:1, y:0 };
    sync();
  }

  // ── PREMIUM DRAW ──────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const s = stateRef.current;
    if (!canvas || !s) return;
    const ctx = canvas.getContext('2d');
    const { cols, rows, cellSize: cs, snake, items, dir, mode, modeData } = s;
    const W = canvas.width, H = canvas.height;
    const accentColor = modeData?.color || '#00BFFF';

    // Transparent background (world bg shows through)
    ctx.clearRect(0, 0, W, H);

    // Subtle grid
    ctx.fillStyle = 'rgba(255,255,255,0.025)';
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        ctx.fillRect(x*cs + cs/2-1, y*cs + cs/2-1, 2, 2);
      }
    }

    // ── Items — ALL SAME SIZE, child finds target themselves ──
    items.forEach(item => {
      const px = item.x * cs, py = item.y * cs;
      const isT = item.value === s.target;
      const r   = cs * 0.42;
      ctx.save();
      ctx.translate(px + cs/2, py + cs/2);

      // Same circle for all — colorful, equal size
      const colors6 = ['#FF6B6B','#FF9A00','#FFD700','#00E676','#00BFFF','#FF6BFF','#AA88FF','#FF88AA'];
      const colorIdx = (item.x * 3 + item.y * 7) % colors6.length;
      const itemColor = colors6[colorIdx];

      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fillStyle = itemColor + '33';
      ctx.fill();
      ctx.strokeStyle = itemColor + 'BB';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Letter/number text — same size for all
      const fontSize = item.value.length > 2 ? cs * 0.28 : cs * 0.40;
      ctx.fillStyle    = '#fff';
      ctx.font         = `900 ${fontSize}px 'Nunito','Noto Sans Devanagari',sans-serif`;
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.value, 0, 1);

      ctx.restore();
    });

    // ── Arrow pointing to target (above target item) ──
    const tItem = items.find(it => it.value === s.target);
    if (tItem) {
      const px = tItem.x * cs;
      const py = tItem.y * cs;
      ctx.save();

      // Bounce animation
      const bounce = Math.sin(Date.now() * 0.007) * 4;

      // Arrow stem + head
      const ax = px + cs/2;
      const ay = py - cs*0.15 + bounce;

      ctx.shadowColor = '#FFD700';
      ctx.shadowBlur  = 12;

      // Draw down-pointing arrow
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      // Triangle
      ctx.moveTo(ax, ay);
      ctx.lineTo(ax - cs*0.22, ay - cs*0.32);
      ctx.lineTo(ax + cs*0.22, ay - cs*0.32);
      ctx.closePath();
      ctx.fill();

      // Stem
      ctx.fillRect(ax - cs*0.08, ay - cs*0.55, cs*0.16, cs*0.25);

      ctx.shadowBlur = 0;
      ctx.restore();
    }

    // ── Cartoon Snake ──────────────────────────
    const skin   = loadState().currentSkin || 'classic';
    const colors = SKIN_COLORS[skin] || SKIN_COLORS.classic;

    snake.forEach((seg, i) => {
      const px = seg.x * cs, py = seg.y * cs;
      ctx.save();
      ctx.translate(px + cs/2, py + cs/2);

      if (i === 0) {
        // HEAD
        ctx.shadowColor = colors.head;
        ctx.shadowBlur  = 16;

        // Head shape — rounded rect slightly larger
        const hw = cs * 0.46;
        ctx.beginPath();
        ctx.roundRect(-hw, -hw, hw*2, hw*2, hw*0.45);

        if (skin === 'rainbow') {
          const hg = ctx.createLinearGradient(-hw, -hw, hw, hw);
          const hue = (Date.now() / 20) % 360;
          hg.addColorStop(0, `hsl(${hue},90%,55%)`);
          hg.addColorStop(1, `hsl(${hue+90},90%,45%)`);
          ctx.fillStyle = hg;
        } else {
          const hg = ctx.createRadialGradient(-cs*0.1,-cs*0.1, 0, 0,0, hw);
          hg.addColorStop(0, colors.head);
          hg.addColorStop(1, colors.body1);
          ctx.fillStyle = hg;
        }
        ctx.fill();
        ctx.shadowBlur = 0;

        // Snout bump
        const angle = Math.atan2(dir.y, dir.x);
        const snoutX = Math.cos(angle) * cs * 0.22;
        const snoutY = Math.sin(angle) * cs * 0.22;
        ctx.beginPath();
        ctx.arc(snoutX, snoutY, cs * 0.2, 0, Math.PI * 2);
        ctx.fillStyle = skin === 'rainbow' ? 'rgba(255,255,255,0.3)' : colors.body1;
        ctx.fill();

        // Nostrils
        const perpAngle = angle + Math.PI / 2;
        [-1, 1].forEach(side => {
          const nx = snoutX + Math.cos(perpAngle)*side*cs*0.07;
          const ny = snoutY + Math.sin(perpAngle)*side*cs*0.07;
          ctx.beginPath();
          ctx.arc(nx + Math.cos(angle)*cs*0.06, ny + Math.sin(angle)*cs*0.06, cs*0.04, 0, Math.PI*2);
          ctx.fillStyle = 'rgba(0,0,0,0.4)';
          ctx.fill();
        });

        // Eyes
        const eyeOffset = cs * 0.16;
        const eyeR      = cs * 0.11;
        [-1, 1].forEach(side => {
          const perpA  = angle - side * Math.PI / 2;
          const ex = Math.cos(perpA) * eyeOffset + Math.cos(angle) * cs * 0.05;
          const ey = Math.sin(perpA) * eyeOffset + Math.sin(angle) * cs * 0.05;

          // Eye white
          ctx.beginPath(); ctx.arc(ex, ey, eyeR, 0, Math.PI*2);
          ctx.fillStyle = colors.eye; ctx.fill();

          // Pupil
          ctx.beginPath();
          ctx.arc(ex + Math.cos(angle)*eyeR*0.4, ey + Math.sin(angle)*eyeR*0.4, eyeR*0.52, 0, Math.PI*2);
          ctx.fillStyle = colors.pupil; ctx.fill();

          // Shine
          ctx.beginPath();
          ctx.arc(ex + Math.cos(angle)*eyeR*0.1 - eyeR*0.25, ey + Math.sin(angle)*eyeR*0.1 - eyeR*0.25, eyeR*0.22, 0, Math.PI*2);
          ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.fill();
        });

        // Tongue (animated)
        if (s.tongueOut) {
          const tBase  = cs * 0.28;
          const tFork  = cs * 0.14;
          const tAngle = Math.PI / 5;
          ctx.save();
          ctx.rotate(angle);
          ctx.strokeStyle = colors.tongue;
          ctx.lineWidth   = cs * 0.055;
          ctx.lineCap     = 'round';
          ctx.shadowColor = colors.tongue;
          ctx.shadowBlur  = 6;
          // Base
          ctx.beginPath();
          ctx.moveTo(cs*0.3, 0);
          ctx.lineTo(cs*0.3 + tBase, 0);
          ctx.stroke();
          // Fork left
          ctx.beginPath();
          ctx.moveTo(cs*0.3 + tBase, 0);
          ctx.lineTo(cs*0.3 + tBase + Math.cos(tAngle)*tFork, -Math.sin(tAngle)*tFork);
          ctx.stroke();
          // Fork right
          ctx.beginPath();
          ctx.moveTo(cs*0.3 + tBase, 0);
          ctx.lineTo(cs*0.3 + tBase + Math.cos(tAngle)*tFork,  Math.sin(tAngle)*tFork);
          ctx.stroke();
          ctx.restore();
        }

      } else {
        // BODY SEGMENTS
        const t   = i / snake.length;
        const bw  = cs * (0.40 - t * 0.06); // taper toward tail

        ctx.beginPath();
        ctx.roundRect(-bw, -bw, bw*2, bw*2, bw*0.4);

        if (skin === 'rainbow') {
          const hue = ((i * 28) + Date.now() / 30) % 360;
          ctx.fillStyle = `hsl(${hue},80%,50%)`;
        } else {
          const bg = ctx.createRadialGradient(-bw*0.3,-bw*0.3, 0, 0,0, bw);
          bg.addColorStop(0, colors.body1);
          bg.addColorStop(1, colors.body2);
          ctx.fillStyle = bg;
        }
        ctx.fill();

        // Scale pattern on body
        if (i % 2 === 0 && bw > cs*0.25) {
          ctx.beginPath();
          ctx.arc(0, 0, bw*0.45, 0, Math.PI*2);
          ctx.strokeStyle = 'rgba(255,255,255,0.12)';
          ctx.lineWidth   = 1;
          ctx.stroke();
        }
      }
      ctx.restore();
    });
  }, [canvasRef]); // eslint-disable-line

  // ── Direction ─────────────────────────────────
  const changeDir = useCallback((dx, dy) => {
    const s = stateRef.current;
    if (!s) return;
    if (dx === 1  && s.dir.x === -1) return;
    if (dx === -1 && s.dir.x ===  1) return;
    if (dy === 1  && s.dir.y === -1) return;
    if (dy === -1 && s.dir.y ===  1) return;
    s.nextDir = { x:dx, y:dy };
  }, []);

  const togglePause = useCallback(() => {
    const s = stateRef.current;
    if (!s) return;
    s.paused = !s.paused; sync();
  }, [sync]);

  const restartLoop = useCallback(() => {
    clearInterval(loopRef.current);
    loopRef.current = setInterval(tick, stateRef.current?.speed || INITIAL_SPEED);
  }, [tick]);

  const start = useCallback(() => {
    init();
    restartLoop();
  }, [init, restartLoop]);

  // Keyboard
  useEffect(() => {
    const keyMap = {
      ArrowUp:[0,-1], ArrowDown:[0,1], ArrowLeft:[-1,0], ArrowRight:[1,0],
      w:[0,-1], s:[0,1], a:[-1,0], d:[1,0],
    };
    const handler = e => {
      if (keyMap[e.key]) { e.preventDefault(); changeDir(...keyMap[e.key]); }
      if (e.key === 'p' || e.key === 'P') togglePause();
    };
    window.addEventListener('keydown', handler);
    return () => { window.removeEventListener('keydown', handler); clearInterval(loopRef.current); };
  }, [changeDir, togglePause]);

  return { start, changeDir, togglePause, displayState, draw };
}
