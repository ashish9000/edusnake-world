// =============================================
// EDUSNAKE WORLD - GameScreen Component
// =============================================
import React, { useRef, useEffect, useState, useCallback } from 'react';
import useGameEngine from '../hooks/useGameEngine';
import { GAME_MODES } from '../data/gameData';
import SFX from '../utils/audio';

// ── Confetti burst ────────────────────────────
function Confetti({ active }) {
  const [pieces, setPieces] = useState([]);
  useEffect(() => {
    if (!active) return;
    const colors = ['#ff6b6b','#ffd700','#00ff88','#00bfff','#ff6bff','#ff9a00'];
    const newPieces = Array.from({ length: 24 }, (_, i) => ({
      id: Date.now() + i,
      x: 20 + Math.random() * 60,
      y: 10 + Math.random() * 30,
      color: colors[i % colors.length],
      rotate: Math.random() * 360,
      delay: Math.random() * 0.3,
    }));
    setPieces(newPieces);
    const t = setTimeout(() => setPieces([]), 1800);
    return () => clearTimeout(t);
  }, [active]);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 20, overflow: 'hidden' }}>
      {pieces.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          left: `${p.x}%`, top: `${p.y}%`,
          width: 10, height: 10,
          background: p.color,
          borderRadius: 2,
          transform: `rotate(${p.rotate}deg)`,
          animation: `confettiFall 1.5s ${p.delay}s ease-in forwards`,
        }} />
      ))}
      <style>{`
        @keyframes confettiFall {
          0%   { opacity:1; transform: translateY(0)   rotate(0deg); }
          100% { opacity:0; transform: translateY(180px) rotate(720deg); }
        }
      `}</style>
    </div>
  );
}

// ── Floating message ──────────────────────────
function FloatMsg({ msg }) {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('');
  const [color, setColor] = useState('#ffd700');

  useEffect(() => {
    if (!msg) return;
    setText(msg.text);
    setColor(msg.color || '#ffd700');
    setVisible(false);
    const t1 = setTimeout(() => setVisible(true), 10);
    const t2 = setTimeout(() => setVisible(false), 900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [msg, msg?.text]);

  return (
    <div style={{
      position: 'absolute', top: '40%', left: '50%',
      transform: `translate(-50%,-50%) ${visible ? 'scale(1)' : 'scale(0.6)'}`,
      color, fontFamily: "'Fredoka One', cursive",
      fontSize: 'clamp(20px, 6vw, 30px)',
      fontWeight: 700, pointerEvents: 'none', zIndex: 15,
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.15s, transform 0.15s',
      textShadow: `0 0 20px ${color}`,
      whiteSpace: 'nowrap',
    }}>
      {text}
    </div>
  );
}

// ── Word progress bar ─────────────────────────
function WordProgress({ wordObj, wordIdx }) {
  if (!wordObj) return null;
  return (
    <div style={{
      display: 'flex', gap: 6, justifyContent: 'center',
      padding: '6px 12px', flexWrap: 'wrap',
      background: 'rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.1)',
    }}>
      {wordObj.word.split('').map((ch, i) => (
        <div key={i} style={{
          width: 30, height: 30, borderRadius: 8,
          border: i < wordIdx
            ? '2px solid #00c853'
            : i === wordIdx
              ? '2px solid #ffd700'
              : '2px solid rgba(255,255,255,0.25)',
          background: i < wordIdx
            ? '#00c85330'
            : i === wordIdx
              ? '#ffd70020'
              : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: i <= wordIdx ? '#fff' : 'rgba(255,255,255,0.3)',
          fontWeight: 800, fontSize: 14,
          animation: i === wordIdx ? 'pulse 0.5s infinite alternate' : 'none',
        }}>
          {i < wordIdx ? ch : i === wordIdx ? ch : '·'}
        </div>
      ))}
      <style>{`@keyframes pulse { from{transform:scale(1)} to{transform:scale(1.12)} }`}</style>
    </div>
  );
}

// ── D-Pad ─────────────────────────────────────
function DPad({ onDir }) {
  const [pressed, setPressed] = useState(null);

  const btn = (symbol, dx, dy, area) => {
    const isPressed = pressed === area;
    return (
      <button
        onPointerDown={e => {
          e.preventDefault();
          setPressed(area);
          onDir(dx, dy);
        }}
        onPointerUp={() => setPressed(null)}
        onPointerLeave={() => setPressed(null)}
        style={{
          gridArea: area,
          background: isPressed
            ? 'linear-gradient(135deg,#00E676,#00C853)'
            : 'linear-gradient(135deg,rgba(255,255,255,0.18),rgba(255,255,255,0.08))',
          border: `2.5px solid ${isPressed ? '#00E676' : 'rgba(255,255,255,0.35)'}`,
          borderRadius: 16,
          color: '#fff',
          fontSize: 28,
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          height: 58, width: 58,
          touchAction: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
          transform: isPressed ? 'scale(0.88)' : 'scale(1)',
          transition: 'all 0.1s',
          boxShadow: isPressed
            ? '0 0 16px #00E67688'
            : '0 4px 12px rgba(0,0,0,0.35)',
          fontFamily: 'inherit',
        }}
      >
        {symbol}
      </button>
    );
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateAreas: '". up ." "left center right" ". down ."',
      gridTemplateColumns: '1fr 1fr 1fr',
      gridTemplateRows: '1fr 1fr 1fr',
      gap: 8,
      padding: '8px 20px 12px',
      alignItems: 'center',
      justifyItems: 'center',
      flexShrink: 0,
      background: 'rgba(0,0,0,0.25)',
      borderTop: '1px solid rgba(255,255,255,0.08)',
    }}>
      {btn('▲', 0, -1, 'up')}
      {btn('◀', -1, 0, 'left')}
      <div style={{
        gridArea: 'center',
        width: 28, height: 28,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.08)',
        border: '2px solid rgba(255,255,255,0.15)',
      }} />
      {btn('▶', 1, 0, 'right')}
      {btn('▼', 0, 1, 'down')}
    </div>
  );
}

// ── Main GameScreen ───────────────────────────
export default function GameScreen({ mode, onGameOver, onMenu }) {
  const canvasRef = useRef(null);
  const [confetti, setConfetti] = useState(false);
  const [shakeCanvas, setShakeCanvas] = useState(false);
  const modeData = GAME_MODES.find(m => m.id === mode);

  const handleGameOver = useCallback((result) => {
    onGameOver?.(result);
  }, [onGameOver]);

  const { start, changeDir, togglePause, displayState } = useGameEngine(
    canvasRef, mode, handleGameOver
  );

  useEffect(() => {
    start();
  }, [start]);

  // Confetti on correct eat (combo >= 1)
  useEffect(() => {
    if (displayState?.combo > 0) {
      setConfetti(true);
      const t = setTimeout(() => setConfetti(false), 100);
      return () => clearTimeout(t);
    }
  }, [displayState?.combo]);

  // Shake on wrong
  useEffect(() => {
    if (displayState?.shake) {
      setShakeCanvas(true);
      const t = setTimeout(() => setShakeCanvas(false), 400);
      return () => clearTimeout(t);
    }
  }, [displayState?.shake]);

  // Touch swipe on canvas
  const touchStart = useRef({ x: 0, y: 0 });
  const handleTouchStart = e => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const handleTouchEnd = e => {
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    if (Math.abs(dx) > Math.abs(dy)) changeDir(dx > 0 ? 1 : -1, 0);
    else changeDir(0, dy > 0 ? 1 : -1);
  };

  const s = displayState;
  const lives = s ? '❤️'.repeat(Math.max(0, s.lives)) + '🖤'.repeat(Math.max(0, 3 - s.lives)) : '❤️❤️❤️';

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      width: '100%', height: '100%',
      background: '#0d0d2e',
    }}>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '6px 12px', background: 'rgba(0,0,0,0.55)', flexShrink: 0,
      }}>
        <button
          onClick={() => { SFX.menuClick(); onMenu?.(); }}
          style={{
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: 8, color: '#fff', fontSize: 11, fontWeight: 700,
            padding: '5px 10px', cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          ← Menu
        </button>
        <div style={{
          background: 'rgba(255,215,0,0.15)', border: '1px solid #ffd700',
          borderRadius: 10, padding: '4px 10px', color: '#ffd700',
          fontWeight: 800, fontSize: 14,
        }}>
          ⭐ {s?.score ?? 0}
        </div>
        <div style={{ fontSize: 16 }}>{lives}</div>
      </div>

      {/* XP Bar */}
      <div style={{
        height: 5, background: 'rgba(255,255,255,0.1)',
        flexShrink: 0, margin: '0 0',
      }}>
        <div style={{
          height: '100%',
          width: `${Math.min(100, ((s?.xp ?? 0) / 100) * 100)}%`,
          background: 'linear-gradient(90deg,#00c853,#ffd700)',
          transition: 'width 0.4s',
        }} />
      </div>

      {/* Target Banner */}
      <div style={{
        textAlign: 'center', padding: '5px 12px', flexShrink: 0,
        background: `${modeData?.color}18`,
        borderBottom: `2px solid ${modeData?.color}55`,
      }}>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>
          {s?.mode === 'math' ? 'SOLVE & EAT ANSWER' : `EAT THIS ${modeData?.emoji || '👇'}`}
        </div>
        <div style={{
          color: modeData?.color || '#fff',
          fontSize: s?.mode === 'math' ? 'clamp(14px,4vw,20px)' : 'clamp(22px,7vw,34px)',
          fontWeight: 900, fontFamily: "'Fredoka One', cursive",
          lineHeight: 1.1,
        }}>
          {s?.mode === 'math' ? s?.mathQ?.question : s?.target}
        </div>
        {s?.combo > 1 && (
          <div style={{ color: '#ffd700', fontSize: 11, fontWeight: 800 }}>
            🔥 Combo x{s.combo}
          </div>
        )}
      </div>

      {/* Word progress */}
      {s?.mode === 'word' && (
        <WordProgress wordObj={s?.wordObj} wordIdx={s?.wordIdx} />
      )}

      {/* Canvas */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <canvas
          ref={canvasRef}
          style={{
            display: 'block',
            transform: shakeCanvas ? 'translateX(6px)' : 'translateX(0)',
            transition: shakeCanvas ? 'none' : 'transform 0.05s',
            animation: shakeCanvas ? 'shake 0.35s' : 'none',
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        />
        <FloatMsg msg={s?.floatMsg} />
        <Confetti active={confetti && s?.combo > 0} />
        <style>{`
          @keyframes shake {
            0%,100% { transform: translateX(0); }
            20%      { transform: translateX(-7px); }
            40%      { transform: translateX(7px); }
            60%      { transform: translateX(-5px); }
            80%      { transform: translateX(5px); }
          }
        `}</style>
      </div>

      {/* D-Pad */}
      <DPad onDir={changeDir} />
    </div>
  );
}
