// EDUSNAKE WORLD - GameOverScreen FIXED
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import SFX from '../utils/audio';

export default function GameOverScreen({ result, onPlayAgain, onMenu }) {
  const isNewRecord = result?.savedState?.highScore === result?.score && result?.score > 0;

  useEffect(() => {
    if (isNewRecord) SFX.levelUp();
  }, [isNewRecord]);

  const learned = (result?.learned || []).slice(0, 12).join('  ');

  return (
    <div style={{
      width:'100%', minHeight:'100%',
      background:'linear-gradient(160deg,#1a0a2e,#2d0a0a)',
      display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center',
      fontFamily:"'Nunito',sans-serif",
      padding:20, gap:12,
      overflowY:'auto',
    }}>
      <div style={{fontSize:64, animation:'wobble 1s infinite'}}>
        {result?.score > 100 ? '🥳' : '😵'}
      </div>

      <div style={{
        fontFamily:"'Fredoka One',cursive",
        fontSize:'clamp(32px,10vw,48px)',
        color: isNewRecord ? '#ffd700' : '#ff6b6b',
        textAlign:'center',
        textShadow:`0 0 30px ${isNewRecord ? '#ffd70088' : '#ff6b6b88'}`,
      }}>
        {isNewRecord ? '🏆 New Record!' : 'Game Over!'}
      </div>

      <div style={{
        fontFamily:"'Fredoka One',cursive",
        fontSize:'clamp(28px,8vw,40px)',
        color:'#fff', textAlign:'center',
      }}>
        {result?.score ?? 0} pts
      </div>

      {/* Stats */}
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, width:'100%', maxWidth:360}}>
        {[
          {label:'Learned', value:result?.learned?.length??0, emoji:'📚'},
          {label:'Words',   value:result?.wordsCompleted??0,  emoji:'✍️'},
          {label:'Best',    value:result?.savedState?.highScore??0, emoji:'🏆'},
        ].map(s=>(
          <div key={s.label} style={{
            background:'rgba(255,255,255,0.07)',
            border:'1px solid rgba(255,255,255,0.15)',
            borderRadius:14, padding:'10px 8px', textAlign:'center',
          }}>
            <div style={{fontSize:22}}>{s.emoji}</div>
            <div style={{color:'#fff',fontSize:18,fontWeight:900,fontFamily:"'Fredoka One',cursive"}}>{s.value}</div>
            <div style={{color:'rgba(255,255,255,0.5)',fontSize:10,fontWeight:700}}>{s.label}</div>
          </div>
        ))}
      </div>

      {learned && (
        <div style={{
          background:'rgba(0,200,83,0.1)', border:'1px solid #00c853',
          borderRadius:14, padding:'10px 16px', width:'100%', maxWidth:360,
          textAlign:'center',
        }}>
          <div style={{color:'#00c853',fontSize:11,fontWeight:800,marginBottom:4}}>✅ You Learned:</div>
          <div style={{color:'#fff',fontSize:14,fontWeight:700,letterSpacing:2}}>{learned}</div>
        </div>
      )}

      <div style={{color:'rgba(255,255,255,0.6)',fontSize:13,textAlign:'center',maxWidth:280}}>
        {result?.score > 150
          ? "🌟 Amazing! You're a learning superstar!"
          : result?.score > 80
            ? "🎉 Great job! Keep practicing!"
            : "💪 Good try! You'll do better next time!"}
      </div>

      <div style={{color:'#ffd700',fontSize:14,fontWeight:800}}>
        🪙 +{Math.floor((result?.score??0)/10)} coins earned!
      </div>

      <div style={{display:'flex',flexDirection:'column',gap:10,width:'100%',maxWidth:300}}>
        <button onClick={()=>{SFX.menuClick();onPlayAgain?.();}} style={{
          fontFamily:"'Fredoka One',cursive", fontSize:20,
          border:'none', borderRadius:18, padding:'14px',
          cursor:'pointer',
          background:'linear-gradient(135deg,#00c853,#00e676)',
          color:'#fff', boxShadow:'0 6px 20px #00c85355',
        }}>🔄 Play Again</button>
        <button onClick={()=>{SFX.menuClick();onMenu?.();}} style={{
          fontFamily:"'Fredoka One',cursive", fontSize:18,
          border:'2px solid rgba(255,255,255,0.3)',
          borderRadius:18, padding:'12px', cursor:'pointer',
          background:'rgba(255,255,255,0.1)', color:'#fff',
        }}>🏠 Main Menu</button>
      </div>

      <style>{`
        @keyframes wobble {
          0%,100%{transform:rotate(-5deg)} 50%{transform:rotate(5deg)}
        }
      `}</style>
    </div>
  );
}
