// =============================================
// EDUSNAKE WORLD - ProgressScreen Component
// =============================================
import React from 'react';
import { getProgressStats } from '../utils/storage';
import SFX from '../utils/audio';

function StatRow({ label, value, emoji, color = '#fff' }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 16px',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 20 }}>{emoji}</span>
        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 700 }}>{label}</span>
      </div>
      <span style={{ color, fontWeight: 900, fontSize: 16, fontFamily: "'Fredoka One', cursive" }}>{value}</span>
    </div>
  );
}

function MiniBar({ label, value, max, color }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, fontWeight: 700 }}>{label}</span>
        <span style={{ color: '#fff', fontSize: 12, fontWeight: 800 }}>{value}/{max}</span>
      </div>
      <div style={{ height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 4 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 4, transition: 'width 0.5s' }} />
      </div>
    </div>
  );
}

export default function ProgressScreen({ onBack }) {
  const stats = getProgressStats();

  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(160deg,#001a2e,#0a002e)',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Nunito', sans-serif",
      overflowY: 'auto',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 16px', background: 'rgba(0,0,0,0.5)', flexShrink: 0,
      }}>
        <button onClick={() => { SFX.menuClick(); onBack(); }} style={{
          background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.25)',
          borderRadius: 8, color: '#fff', fontWeight: 700, fontSize: 12,
          padding: '6px 12px', cursor: 'pointer', fontFamily: 'inherit',
        }}>← Back</button>
        <div style={{ fontFamily: "'Fredoka One',cursive", color: '#00bfff', fontSize: 20 }}>📊 My Progress</div>
        <div style={{ fontSize: 20 }}>🏅</div>
      </div>

      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Overview card */}
        <div style={{
          background: 'rgba(255,255,255,0.06)', borderRadius: 18,
          border: '1px solid rgba(255,255,255,0.12)', overflow: 'hidden',
        }}>
          <div style={{ padding: '12px 16px', background: 'rgba(0,191,255,0.12)', borderBottom: '1px solid rgba(0,191,255,0.2)' }}>
            <span style={{ color: '#00bfff', fontWeight: 800, fontSize: 13 }}>📈 Overview</span>
          </div>
          <StatRow label="High Score"     value={stats.highScore}      emoji="🏆" color="#ffd700" />
          <StatRow label="Games Played"   value={stats.gamesPlayed}    emoji="🎮" />
          <StatRow label="Avg Score"      value={stats.avgScore}       emoji="📊" color="#00bfff" />
          <StatRow label="Daily Streak"   value={`${stats.dailyStreak} days`} emoji="🔥" color="#ff9a00" />
          <StatRow label="Coins Earned"   value={stats.totalCoins}     emoji="🪙" color="#ffd700" />
          <StatRow label="Perfect Games"  value={stats.perfectGames}   emoji="✨" color="#00ff88" />
        </div>

        {/* Learning progress */}
        <div style={{
          background: 'rgba(255,255,255,0.06)', borderRadius: 18,
          border: '1px solid rgba(255,255,255,0.12)', padding: 16,
        }}>
          <div style={{ color: '#ff9a00', fontWeight: 800, fontSize: 13, marginBottom: 14 }}>📚 Learning Progress</div>
          <MiniBar label="Alphabet (A-Z)"  value={stats.learnedAlpha}   max={26}  color="#00bfff" />
          <MiniBar label="Hindi Swar"      value={stats.learnedHindi}   max={12}  color="#ff9a00" />
          <MiniBar label="Words Spelled"   value={stats.wordsCompleted} max={25}  color="#ff6bff" />
          <MiniBar label="Math Answers"    value={stats.mathCorrect}    max={50}  color="#ffd700" />
          <MiniBar label="Items Eaten"     value={stats.totalEaten}     max={500} color="#00ff88" />
        </div>

        {/* Recent scores */}
        {stats.recentScores && stats.recentScores.length > 0 && (
          <div style={{
            background: 'rgba(255,255,255,0.06)', borderRadius: 18,
            border: '1px solid rgba(255,255,255,0.12)', padding: 16,
          }}>
            <div style={{ color: '#00ff88', fontWeight: 800, fontSize: 13, marginBottom: 12 }}>🕹️ Recent Games</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 60 }}>
              {stats.recentScores.map((score, i) => {
                const maxScore = Math.max(...stats.recentScores, 1);
                const h = Math.max(6, (score / maxScore) * 50);
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    <div style={{
                      width: '100%', height: h,
                      background: `hsl(${120 + i * 20},70%,55%)`,
                      borderRadius: '4px 4px 0 0', minHeight: 6,
                    }} />
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 9 }}>{score}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tip for parents */}
        <div style={{
          background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.3)',
          borderRadius: 14, padding: 14,
        }}>
          <div style={{ color: '#ffd700', fontWeight: 800, fontSize: 12, marginBottom: 6 }}>👨‍👩‍👧 For Parents</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, lineHeight: 1.6 }}>
            Your child is learning through play! EduSnake adapts difficulty automatically.
            Longer streaks = more learning. Encourage daily 10-min sessions for best results. 🌟
          </div>
        </div>

      </div>
    </div>
  );
}
