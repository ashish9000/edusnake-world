// =============================================
// EDUSNAKE WORLD - ShopScreen Component
// =============================================
import React, { useState } from 'react';
import { SNAKE_SKINS } from '../data/gameData';
import { loadState, unlockSkin, setSkin } from '../utils/storage';
import SFX from '../utils/audio';

export default function ShopScreen({ onBack }) {
  const [state, setState] = useState(loadState());
  const [msg, setMsg] = useState(null);

  const refresh = () => setState(loadState());

  function handleSkin(skin) {
    SFX.menuClick();
    if (!skin.locked || state.unlockedSkins.includes(skin.id)) {
      // Equip
      setSkin(skin.id);
      setMsg({ text: `${skin.emoji} ${skin.name} equipped!`, ok: true });
      refresh();
    } else {
      // Try unlock
      const ok = unlockSkin(skin.id, skin.cost);
      if (ok) {
        SFX.unlock();
        setSkin(skin.id);
        setMsg({ text: `🎉 ${skin.name} unlocked & equipped!`, ok: true });
      } else {
        SFX.wrong();
        setMsg({ text: `Need ${skin.cost} coins! You have ${state.totalCoins}.`, ok: false });
      }
      refresh();
    }
    setTimeout(() => setMsg(null), 2000);
  }

  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(160deg,#1a0a2e,#0d002e)',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Nunito', sans-serif",
      overflowY: 'auto',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 16px', background: 'rgba(0,0,0,0.4)',
        flexShrink: 0,
      }}>
        <button onClick={() => { SFX.menuClick(); onBack(); }} style={{
          background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.25)',
          borderRadius: 8, color: '#fff', fontWeight: 700, fontSize: 12,
          padding: '6px 12px', cursor: 'pointer', fontFamily: 'inherit',
        }}>← Back</button>
        <div style={{ fontFamily: "'Fredoka One',cursive", color: '#ff6bff', fontSize: 20 }}>🐍 Snake Shop</div>
        <div style={{
          background: 'rgba(255,215,0,0.15)', border: '1px solid #ffd700',
          borderRadius: 20, padding: '5px 12px', color: '#ffd700', fontWeight: 800, fontSize: 13,
        }}>🪙 {state.totalCoins}</div>
      </div>

      {/* Msg */}
      {msg && (
        <div style={{
          margin: '10px 16px', padding: '10px 16px', borderRadius: 12,
          background: msg.ok ? 'rgba(0,200,83,0.2)' : 'rgba(255,100,100,0.2)',
          border: `1px solid ${msg.ok ? '#00c853' : '#ff4444'}`,
          color: '#fff', fontWeight: 700, textAlign: 'center', fontSize: 13,
        }}>{msg.text}</div>
      )}

      {/* Skins grid */}
      <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {SNAKE_SKINS.map(skin => {
          const owned   = !skin.locked || state.unlockedSkins.includes(skin.id);
          const current = state.currentSkin === skin.id;
          return (
            <div
              key={skin.id}
              onClick={() => handleSkin(skin)}
              style={{
                background: current
                  ? `${skin.headColor}22`
                  : 'rgba(255,255,255,0.06)',
                border: `2px solid ${current ? skin.headColor : owned ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 18, padding: '16px 10px',
                textAlign: 'center', cursor: 'pointer',
                transition: 'all 0.2s',
                opacity: !owned ? 0.75 : 1,
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 6 }}>{skin.emoji}</div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: 14 }}>{skin.name}</div>
              <div style={{ marginTop: 6 }}>
                {current ? (
                  <span style={{ color: '#00c853', fontWeight: 800, fontSize: 12 }}>✅ Equipped</span>
                ) : owned ? (
                  <span style={{ color: '#aaa', fontWeight: 700, fontSize: 11 }}>Tap to equip</span>
                ) : (
                  <span style={{ color: '#ffd700', fontWeight: 800, fontSize: 12 }}>🪙 {skin.cost}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ padding: '0 16px 24px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>
        Earn coins by playing! 10 pts = 1 coin 🪙
      </div>
    </div>
  );
}
