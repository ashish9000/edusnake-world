// =============================================
// EDUSNAKE WORLD - HomeScreen Component
// =============================================
import React, { useEffect, useRef, useState } from 'react';
import { GAME_MODES } from '../data/gameData';
import { loadState } from '../utils/storage';
import SFX from '../utils/audio';

// ── Starfield ─────────────────────────────────
function Starfield() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random() * 400, y: Math.random() * 800,
      r: Math.random() * 1.5 + 0.5,
      alpha: Math.random(),
      speed: Math.random() * 0.008 + 0.002,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, 400, 800);
      stars.forEach(s => {
        s.alpha += s.speed;
        if (s.alpha > 1) s.speed = -Math.abs(s.speed);
        if (s.alpha < 0) s.speed =  Math.abs(s.speed);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.alpha.toFixed(2)})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <canvas ref={canvasRef} width={400} height={800}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.7 }} />
  );
}

// ── Mode Card ─────────────────────────────────
function ModeCard({ mode, onClick }) {
  const [pressed, setPressed] = useState(false);
  return (
    <div
      onPointerDown={() => { setPressed(true); SFX.menuClick(); }}
      onPointerUp={() => { setPressed(false); onClick(mode.id); }}
      onPointerLeave={() => setPressed(false)}
      style={{
        background: pressed ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)',
        border: `2px solid ${pressed ? mode.color : 'rgba(255,255,255,0.15)'}`,
        borderRadius: 18, padding: '12px 8px',
        textAlign: 'center', cursor: 'pointer',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 4,
        transform: pressed ? 'scale(0.95)' : 'scale(1)',
        transition: 'all 0.15s',
        boxShadow: pressed ? `0 0 16px ${mode.color}44` : 'none',
        touchAction: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <span style={{ fontSize: 28 }}>{mode.emoji}</span>
      <span style={{ color: '#fff', fontSize: 11, fontWeight: 800, letterSpacing: 0.5 }}>{mode.name}</span>
      <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 9 }}>{mode.desc}</span>
    </div>
  );
}

// ── Daily Streak Badge ────────────────────────
function StreakBadge({ streak }) {
  if (!streak) return null;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      background: 'rgba(255,150,0,0.2)', border: '1px solid #ff9a00',
      borderRadius: 20, padding: '4px 12px', margin: '0 auto',
      color: '#ff9a00', fontSize: 12, fontWeight: 800,
    }}>
      🔥 {streak} Day Streak!
    </div>
  );
}

// ── HomeScreen ────────────────────────────────
export default function HomeScreen({ onStart, onOpenShop, onOpenProgress }) {
  const [userState, setUserState] = useState(null);
  const [mascotBounce, setMascotBounce] = useState(true);

  useEffect(() => {
    setUserState(loadState());
    const t = setInterval(() => setUserState(loadState()), 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      background: 'linear-gradient(160deg,#1a0a2e 0%,#0d1b8a 50%,#1a0a2e 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', overflowY: 'auto',
      fontFamily: "'Nunito', sans-serif",
    }}>
      <Starfield />

      <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 420, padding: '16px 16px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>

        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <div style={{
            background: 'rgba(255,215,0,0.15)', border: '1px solid #ffd700',
            borderRadius: 20, padding: '5px 12px',
            color: '#ffd700', fontSize: 12, fontWeight: 800,
            cursor: 'pointer',
          }} onClick={onOpenShop}>
            🪙 {userState?.totalCoins ?? 0}
          </div>
          <div style={{
            color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: 700,
            cursor: 'pointer',
          }} onClick={onOpenProgress}>
            📊 Progress
          </div>
        </div>

        {/* Mascot */}
        <div style={{
          fontSize: 64,
          animation: 'bounce 1.2s ease-in-out infinite alternate',
          lineHeight: 1,
        }}>
          🐍
        </div>

        {/* Logo */}
        <div style={{
          fontFamily: "'Fredoka One', cursive",
          fontSize: 'clamp(28px,9vw,46px)',
          background: 'linear-gradient(90deg,#ff6b6b,#ffd700,#00ff88,#00bfff,#ff6bff)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundSize: '200%',
          animation: 'logoShine 3s linear infinite',
          textAlign: 'center', lineHeight: 1.1,
        }}>
          EduSnake<br />World
        </div>
        <div style={{ color: '#aaa0ff', fontSize: 12, fontWeight: 700, letterSpacing: 2, marginTop: -4 }}>
          LEARN • PLAY • GROW
        </div>

        {/* High score */}
        <div style={{ color: '#ffd700', fontSize: 13, fontWeight: 800 }}>
          🏆 Best: {userState?.highScore ?? 0} &nbsp;|&nbsp; 🎮 Games: {userState?.gamesPlayed ?? 0}
        </div>

        {/* Streak */}
        <StreakBadge streak={userState?.dailyStreak} />

        {/* Mode grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 10, width: '100%', marginTop: 4,
        }}>
          {GAME_MODES.map(mode => (
            <ModeCard key={mode.id} mode={mode} onClick={onStart} />
          ))}
        </div>

        {/* Bottom actions */}
        <div style={{ display: 'flex', gap: 10, width: '100%', marginTop: 4 }}>
          <button
            onClick={onOpenShop}
            style={{
              flex: 1, background: 'rgba(255,107,255,0.15)',
              border: '2px solid #ff6bff', borderRadius: 14,
              color: '#ff6bff', fontWeight: 800, fontSize: 13,
              padding: '10px', cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            🐍 Snake Shop
          </button>
          <button
            onClick={onOpenProgress}
            style={{
              flex: 1, background: 'rgba(0,191,255,0.15)',
              border: '2px solid #00bfff', borderRadius: 14,
              color: '#00bfff', fontWeight: 800, fontSize: 13,
              padding: '10px', cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            📈 My Progress
          </button>
        </div>

        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, marginTop: 8 }}>
          EduSnake World v1.0 • swipe or use arrow keys
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          from { transform: translateY(0) rotate(-5deg); }
          to   { transform: translateY(-12px) rotate(5deg); }
        }
        @keyframes logoShine {
          to { background-position: 200%; }
        }
      `}</style>
    </div>
  );
}
