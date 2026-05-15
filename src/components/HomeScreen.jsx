// EDUSNAKE WORLD - HomeScreen v3 FIXED
import React, { useEffect, useState } from 'react';
import { loadState } from '../utils/storage';
import SFX from '../utils/audio';

const MODES = [
  { id:'alpha',   name:'A-B-C Hunt',    emoji:'🔤', desc:'Learn A to Z!',        color:'#FF6B6B', num:'1' },
  { id:'hindi',   name:'Hindi Swar',    emoji:'🕉️', desc:'अ आ इ ई उ ऊ...',      color:'#FF9A00', num:'2' },
  { id:'vyanjan', name:'Hindi Vyanjan', emoji:'✍️', desc:'क ख ग घ...',           color:'#FF6BFF', num:'3' },
  { id:'number',  name:'Numbers 1-20',  emoji:'🔢', desc:'Count 1 to 20!',       color:'#00E676', num:'4' },
  { id:'word',    name:'Word Builder',  emoji:'🌟', desc:'Spell APPLE, BALL...', color:'#00BFFF', num:'5' },
  { id:'math',    name:'Math Snake',    emoji:'➕', desc:'2+3=? Eat answer!',    color:'#FFD700', num:'6' },
  { id:'shapes',  name:'Shape Hunt',    emoji:'🔷', desc:'Circle, Square...',    color:'#00FFAA', num:'7' },
  { id:'colors',  name:'Color World',   emoji:'🌈', desc:'Red, Blue, Green...',  color:'#FF9A00', num:'8' },
];

const BGS = [
  ['#1a0a2e','#0d1b8a'],
  ['#0a2e1a','#0d8a3b'],
  ['#2e0a1a','#8a0d4b'],
  ['#0a1a2e','#0d4b8a'],
  ['#2e1a00','#8a5500'],
  ['#1a001a','#6b0d8a'],
];

export default function HomeScreen({ onStart, onOpenShop, onOpenProgress }) {
  const [userState, setUserState] = useState(null);
  const [bgIdx, setBgIdx] = useState(0);
  const [floatY, setFloatY] = useState(0);

  useEffect(() => {
    setUserState(loadState());
    const t = setInterval(() => setUserState(loadState()), 3000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setBgIdx(i => (i + 1) % BGS.length), 4000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let frame = 0;
    const t = setInterval(() => {
      frame++;
      setFloatY(Math.sin(frame * 0.07) * 9);
    }, 40);
    return () => clearInterval(t);
  }, []);

  const bg = BGS[bgIdx];

  return (
    <div style={{
      position:'relative', width:'100%', minHeight:'100%',
      background:`linear-gradient(160deg,${bg[0]} 0%,${bg[1]} 100%)`,
      transition:'background 1.8s ease',
      display:'flex', flexDirection:'column',
      alignItems:'center',
      fontFamily:"'Nunito',sans-serif",
      overflowY:'auto',
      WebkitOverflowScrolling:'touch',
    }}>

      {/* Floating decor */}
      <div style={{position:'absolute',inset:0,overflow:'hidden',pointerEvents:'none'}}>
        {['🌟','⭐','✨','💫','🎈','🎀','🍭','🌈','🦋','🌸'].map((e,i)=>(
          <div key={i} style={{
            position:'absolute',
            left:`${5+i*9.5}%`,
            top:`${3+(i%4)*22}%`,
            fontSize:16+(i%3)*7,
            opacity:0.12,
            animation:`floatUp ${2.5+i*0.4}s ease-in-out ${i*0.3}s infinite alternate`,
          }}>{e}</div>
        ))}
      </div>

      <div style={{
        position:'relative', zIndex:2,
        width:'100%', maxWidth:430,
        padding:'12px 14px 32px',
        display:'flex', flexDirection:'column',
        alignItems:'center', gap:10,
      }}>

        {/* Top bar */}
        <div style={{display:'flex',justifyContent:'space-between',width:'100%',alignItems:'center'}}>
          <div onClick={onOpenShop} style={{
            background:'linear-gradient(135deg,#FFD700,#FF8C00)',
            borderRadius:24, padding:'9px 18px',
            color:'#000', fontSize:15, fontWeight:900,
            cursor:'pointer', boxShadow:'0 4px 16px #FFD70060',
          }}>🪙 {userState?.totalCoins ?? 0}</div>
          <div onClick={onOpenProgress} style={{
            background:'linear-gradient(135deg,#00BFFF,#0055FF)',
            borderRadius:24, padding:'9px 18px',
            color:'#fff', fontSize:13, fontWeight:800,
            cursor:'pointer', boxShadow:'0 4px 16px #00BFFF55',
          }}>📊 Progress</div>
        </div>

        {/* Snake mascot */}
        <div style={{
          fontSize:78,
          transform:`translateY(${floatY}px)`,
          filter:'drop-shadow(0 10px 24px rgba(0,255,136,0.45))',
          lineHeight:1, marginTop:4,
        }}>🐍</div>

        {/* Logo */}
        <div style={{
          fontFamily:"'Fredoka One',cursive",
          fontSize:'clamp(36px,10vw,52px)',
          background:'linear-gradient(90deg,#FF6B6B,#FFD700,#00FF88,#00BFFF,#FF6BFF,#FF6B6B)',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
          backgroundSize:'300%',
          animation:'logoShine 3s linear infinite',
          textAlign:'center', lineHeight:1.1,
        }}>EduSnake<br/>World</div>

        <div style={{
          background:'rgba(255,255,255,0.12)',
          borderRadius:20, padding:'6px 18px',
          color:'#fff', fontSize:12, fontWeight:800, letterSpacing:2,
        }}>🎓 LEARN • PLAY • GROW 🎮</div>

        {/* Stats */}
        <div style={{display:'flex',gap:8,width:'100%',justifyContent:'center'}}>
          {[
            {icon:'🏆', val:userState?.highScore??0,       label:'BEST',   color:'#FFD700'},
            {icon:'🔥', val:`${userState?.dailyStreak??0}d`,label:'STREAK', color:'#FF9A00'},
            {icon:'🎮', val:userState?.gamesPlayed??0,      label:'GAMES',  color:'#00E676'},
          ].map(s=>(
            <div key={s.label} style={{
              background:`${s.color}18`,
              border:`2px solid ${s.color}`,
              borderRadius:16, padding:'8px 12px',
              textAlign:'center', flex:1,
            }}>
              <div style={{fontSize:16}}>{s.icon}</div>
              <div style={{color:s.color,fontWeight:900,fontSize:15,fontFamily:"'Fredoka One',cursive"}}>{s.val}</div>
              <div style={{color:`${s.color}99`,fontSize:8,fontWeight:800,letterSpacing:1}}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Title */}
        <div style={{
          width:'100%', textAlign:'center',
          background:'linear-gradient(90deg,#FF6B6B,#FFD700,#00FF88,#00BFFF)',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
          fontSize:13, fontWeight:900, letterSpacing:0.5,
        }}>✨ Choose Your Adventure — Start from Step 1! ✨</div>

        {/* Mode grid */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,width:'100%'}}>
          {MODES.map(mode => <ModeCard key={mode.id} mode={mode} onStart={onStart}/>)}
        </div>

        {/* Buttons */}
        <div style={{display:'flex',gap:10,width:'100%',marginTop:4}}>
          <button onClick={()=>{SFX.menuClick();onOpenShop();}} style={{
            flex:1, background:'linear-gradient(135deg,#FF6BFF,#8800CC)',
            border:'none', borderRadius:20, color:'#fff',
            fontWeight:900, fontSize:14, padding:'16px',
            cursor:'pointer', fontFamily:'inherit',
            boxShadow:'0 6px 20px #FF6BFF44',
          }}>🐍 Snake Shop</button>
          <button onClick={()=>{SFX.menuClick();onOpenProgress();}} style={{
            flex:1, background:'linear-gradient(135deg,#00BFFF,#0040CC)',
            border:'none', borderRadius:20, color:'#fff',
            fontWeight:900, fontSize:14, padding:'16px',
            cursor:'pointer', fontFamily:'inherit',
            boxShadow:'0 6px 20px #00BFFF44',
          }}>📈 My Progress</button>
        </div>

        <div style={{color:'rgba(255,255,255,0.3)',fontSize:10,marginTop:4}}>
          EduSnake World v3.0
        </div>
      </div>

      <style>{`
        @keyframes logoShine{to{background-position:300%;}}
        @keyframes floatUp{from{transform:translateY(0) rotate(-5deg)}to{transform:translateY(-20px) rotate(5deg)}}
      `}</style>
    </div>
  );
}

function ModeCard({ mode, onStart }) {
  const [pressed, setPressed] = useState(false);
  return (
    <div
      onPointerDown={()=>{ setPressed(true); SFX.menuClick(); }}
      onPointerUp={()=>{ setPressed(false); onStart(mode.id); }}
      onPointerLeave={()=>setPressed(false)}
      style={{
        background:pressed?`${mode.color}30`:'rgba(255,255,255,0.09)',
        border:`2.5px solid ${pressed?mode.color:'rgba(255,255,255,0.18)'}`,
        borderRadius:22, padding:'14px 8px 12px',
        textAlign:'center', cursor:'pointer',
        display:'flex', flexDirection:'column',
        alignItems:'center', gap:5,
        transform:pressed?'scale(0.92)':'scale(1)',
        transition:'all 0.15s',
        boxShadow:pressed?`0 0 24px ${mode.color}55`:'0 4px 12px rgba(0,0,0,0.25)',
        touchAction:'none',
        WebkitTapHighlightColor:'transparent',
        position:'relative', minHeight:120,
      }}
    >
      <div style={{
        position:'absolute',top:7,left:9,
        background:mode.color,color:'#000',
        fontSize:9,fontWeight:900,
        width:19,height:19,borderRadius:'50%',
        display:'flex',alignItems:'center',justifyContent:'center',
      }}>{mode.num}</div>
      <span style={{fontSize:34}}>{mode.emoji}</span>
      <span style={{color:'#fff',fontSize:12,fontWeight:900,lineHeight:1.2}}>{mode.name}</span>
      <span style={{color:mode.color,fontSize:10,fontWeight:700,lineHeight:1.3}}>{mode.desc}</span>
    </div>
  );
}
