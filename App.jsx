// =============================================
// EDUSNAKE WORLD - App.jsx (Main Router)
// =============================================
import React, { useState, useEffect } from 'react';
import HomeScreen    from './components/HomeScreen';
import GameScreen    from './components/GameScreen';
import GameOverScreen from './components/GameOverScreen';
import ShopScreen    from './components/ShopScreen';
import ProgressScreen from './components/ProgressScreen';
import { checkDailyStreak } from './utils/storage';

// Global styles injected once
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800&family=Noto+Sans+Devanagari:wght@400;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

  html, body, #root {
    width: 100%; height: 100%;
    overflow: hidden;
    touch-action: none;
    background: #0d0d2e;
    font-family: 'Nunito', 'Noto Sans Devanagari', sans-serif;
  }

  button { font-family: inherit; }

  /* Scrollable containers */
  .scroll-y { overflow-y: auto; -webkit-overflow-scrolling: touch; touch-action: pan-y; }

  /* Thin scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 2px; }

  /* Prevent text selection on game elements */
  canvas, button { user-select: none; -webkit-user-select: none; }
`;

// Inject global CSS once
function GlobalStyles() {
  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);
  return null;
}

// ── SCREENS ────────────────────────────────────
const SCREENS = {
  HOME:     'home',
  GAME:     'game',
  GAMEOVER: 'gameover',
  SHOP:     'shop',
  PROGRESS: 'progress',
};

export default function App() {
  const [screen, setScreen] = useState(SCREENS.HOME);
  const [mode,   setMode]   = useState('alpha');
  const [result, setResult] = useState(null);

  // Check daily streak on mount
  useEffect(() => {
    checkDailyStreak();
  }, []);

  // Prevent back-swipe / overscroll on iOS
  useEffect(() => {
    const prevent = e => e.preventDefault();
    document.addEventListener('touchmove', prevent, { passive: false });
    return () => document.removeEventListener('touchmove', prevent);
  }, []);

  function handleStart(selectedMode) {
    setMode(selectedMode);
    setScreen(SCREENS.GAME);
  }

  function handleGameOver(gameResult) {
    setResult(gameResult);
    setScreen(SCREENS.GAMEOVER);
  }

  function handlePlayAgain() {
    setScreen(SCREENS.GAME);
  }

  function handleMenu() {
    setScreen(SCREENS.HOME);
  }

  return (
    <>
      <GlobalStyles />
      <div style={{
        width: '100vw', height: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#0d0d2e',
      }}>
        {/* Cap width for tablet/desktop — feels like a mobile game */}
        <div style={{
          width: '100%', maxWidth: 430,
          height: '100%', maxHeight: 932,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 0 60px rgba(0,0,0,0.9)',
        }}>
          {screen === SCREENS.HOME && (
            <HomeScreen
              onStart={handleStart}
              onOpenShop={() => setScreen(SCREENS.SHOP)}
              onOpenProgress={() => setScreen(SCREENS.PROGRESS)}
            />
          )}

          {screen === SCREENS.GAME && (
            <GameScreen
              mode={mode}
              onGameOver={handleGameOver}
              onMenu={handleMenu}
            />
          )}

          {screen === SCREENS.GAMEOVER && (
            <GameOverScreen
              result={result}
              onPlayAgain={handlePlayAgain}
              onMenu={handleMenu}
            />
          )}

          {screen === SCREENS.SHOP && (
            <ShopScreen onBack={handleMenu} />
          )}

          {screen === SCREENS.PROGRESS && (
            <ProgressScreen onBack={handleMenu} />
          )}
        </div>
      </div>
    </>
  );
}
