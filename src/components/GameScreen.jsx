// EDUSNAKE WORLD - GameScreen v3 FIXED
/* eslint-disable no-unused-vars */
import React, { useRef, useEffect, useState, useCallback } from 'react';
import useGameEngine from '../hooks/useGameEngine';
import { GAME_MODES } from '../data/gameData';
import SFX from '../utils/audio';

function Confetti({ active }) {
  const [pieces, setPieces] = useState([]);
  useEffect(() => {
    if (!active) return;
    const colors = ['#FF6B6B','#FFD700','#00FF88','#00BFFF','#FF6BFF','#FF9A00'];
    setPieces(Array.from({length:20},(_,i)=>({
      id:Date.now()+i, x:15+Math.random()*70, y:5+Math.random()*30,
      color:colors[i%colors.length], rotate:Math.random()*360, delay:Math.random()*0.3,
    })));
    const t = setTimeout(()=>setPieces([]),1800);
    return ()=>clearTimeout(t);
  },[active]);
  return (
    <div style={{position:'absolute',inset:0,pointerEvents:'none',zIndex:20,overflow:'hidden'}}>
      {pieces.map(p=>(
        <div key={p.id} style={{
          position:'absolute',left:`${p.x}%`,top:`${p.y}%`,
          width:10,height:10,background:p.color,borderRadius:2,
          transform:`rotate(${p.rotate}deg)`,
          animation:`cFall 1.5s ${p.delay}s ease-in forwards`,
        }}/>
      ))}
      <style>{`@keyframes cFall{0%{opacity:1;transform:translateY(0) rotate(0deg)}100%{opacity:0;transform:translateY(180px) rotate(720deg)}}`}</style>
    </div>
  );
}

function FloatMsg({ msg }) {
  const [vis,setVis]=useState(false);
  const [text,setText]=useState('');
  const [color,setColor]=useState('#FFD700');
  useEffect(()=>{
    if(!msg)return;
    setText(msg.text); setColor(msg.color||'#FFD700');
    setVis(false);
    const t1=setTimeout(()=>setVis(true),10);
    const t2=setTimeout(()=>setVis(false),900);
    return()=>{clearTimeout(t1);clearTimeout(t2);};
  },[msg]);
  return (
    <div style={{
      position:'absolute',top:'38%',left:'50%',
      transform:`translate(-50%,-50%) scale(${vis?1:0.5})`,
      color,fontFamily:"'Fredoka One',cursive",
      fontSize:'clamp(22px,7vw,32px)',fontWeight:700,
      pointerEvents:'none',zIndex:15,
      opacity:vis?1:0,
      transition:'opacity 0.15s,transform 0.15s',
      textShadow:`0 0 24px ${color},0 2px 8px rgba(0,0,0,0.8)`,
      whiteSpace:'nowrap',
    }}>{text}</div>
  );
}

function WordProgress({ wordObj, wordIdx }) {
  if(!wordObj)return null;
  return (
    <div style={{
      display:'flex',gap:5,justifyContent:'center',
      padding:'5px 12px',flexWrap:'wrap',
      background:'rgba(0,0,0,0.3)',
      borderBottom:'1px solid rgba(255,255,255,0.08)',
      flexShrink:0,
    }}>
      {wordObj.word.split('').map((ch,i)=>(
        <div key={i} style={{
          width:28,height:28,borderRadius:8,
          border:i<wordIdx?'2px solid #00C853':i===wordIdx?'2px solid #FFD700':'2px solid rgba(255,255,255,0.2)',
          background:i<wordIdx?'#00C85325':i===wordIdx?'#FFD70020':'transparent',
          display:'flex',alignItems:'center',justifyContent:'center',
          color:i<=wordIdx?'#fff':'rgba(255,255,255,0.3)',
          fontWeight:900,fontSize:13,
        }}>
          {i<wordIdx?ch:i===wordIdx?ch:'·'}
        </div>
      ))}
    </div>
  );
}

function DPad({ onDir }) {
  const [pressed,setPressed]=useState(null);
  const btn=(symbol,dx,dy,area)=>{
    const isP=pressed===area;
    return (
      <button
        onPointerDown={e=>{e.preventDefault();setPressed(area);onDir(dx,dy);}}
        onPointerUp={()=>setPressed(null)}
        onPointerLeave={()=>setPressed(null)}
        onPointerCancel={()=>setPressed(null)}
        style={{
          gridArea:area,
          background:isP?'linear-gradient(135deg,#00E676,#00A040)':'linear-gradient(160deg,rgba(255,255,255,0.22),rgba(255,255,255,0.06))',
          border:`3px solid ${isP?'#00E676':'rgba(255,255,255,0.4)'}`,
          borderRadius:18,color:'#fff',fontSize:26,fontWeight:900,
          cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',
          width:'100%',height:'100%',touchAction:'none',
          userSelect:'none',WebkitUserSelect:'none',WebkitTapHighlightColor:'transparent',
          transform:isP?'scale(0.86)':'scale(1)',transition:'all 0.08s',
          boxShadow:isP?'0 0 20px #00E67699':'0 6px 16px rgba(0,0,0,0.4)',
        }}
      >{symbol}</button>
    );
  };
  return (
    <div style={{
      display:'grid',
      gridTemplateAreas:'". up ." "left center right" ". down ."',
      gridTemplateColumns:'1fr 1fr 1fr',
      gridTemplateRows:'56px 56px 56px',
      gap:6,padding:'8px 24px 10px',flexShrink:0,
      background:'rgba(0,0,0,0.35)',
      borderTop:'1px solid rgba(255,255,255,0.1)',
    }}>
      {btn('▲',0,-1,'up')}
      {btn('◀',-1,0,'left')}
      <div style={{gridArea:'center',background:'rgba(255,255,255,0.06)',border:'2px solid rgba(255,255,255,0.15)',borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(255,255,255,0.3)'}}>●</div>
      {btn('▶',1,0,'right')}
      {btn('▼',0,1,'down')}
    </div>
  );
}

const MODE_BG = {
  alpha:   ['#0a2e0a','#1a5c1a','#0d3d0d'],
  hindi:   ['#2e1400','#8a3d00','#cc6600'],
  vyanjan: ['#2e0033','#660066','#aa00aa'],
  number:  ['#001a33','#003366','#0055aa'],
  word:    ['#050510','#0d0d2e','#1a1a4e'],
  math:    ['#1a1000','#4d3300','#806600'],
  shapes:  ['#001a0d','#003d1a','#006633'],
  colors:  ['#1a0033','#330066','#550099'],
};

const DECOR = {
  alpha:   ['🌸','🌿','🍀','🌺','🦋','🌻','🐝','🌱'],
  hindi:   ['🪔','✨','🌸','🎆','⭐','🌟','💫','🪷'],
  vyanjan: ['🍭','🎀','🌈','🎠','🎡','🎪','🎭','🎨'],
  number:  ['🐠','🐟','🦀','🐙','🦈','🐬','⭐','🌊'],
  word:    ['🚀','⭐','🌟','💫','🛸','🪐','✨','🌙'],
  math:    ['🌵','⭐','☀️','🌟','💛','🌾','🔢','📐'],
  shapes:  ['🌿','🍃','🌲','🌳','🦜','🌺','🦋','🌸'],
  colors:  ['🎨','🌈','✨','🎭','💎','🌟','💫','🎪'],
};

export default function GameScreen({ mode, onGameOver, onMenu }) {
  const canvasRef = useRef(null);
  const [confetti,setConfetti] = useState(false);
  const [shake,setShake] = useState(false);
  const [bgTick,setBgTick] = useState(0);
  const modeData = GAME_MODES.find(m=>m.id===mode);
  const modeBg = MODE_BG[mode]||MODE_BG.alpha;
  const decor = DECOR[mode]||DECOR.alpha;

  const handleGameOver = useCallback((result)=>{ onGameOver?.(result); },[onGameOver]);
  const { start, changeDir, displayState } = useGameEngine(canvasRef, mode, handleGameOver);

  useEffect(()=>{ start(); },[start]);

  useEffect(()=>{
    const t=setInterval(()=>setBgTick(n=>n+1),60);
    return()=>clearInterval(t);
  },[]);

  useEffect(()=>{
    if(displayState?.combo>0){
      setConfetti(true);
      const t=setTimeout(()=>setConfetti(false),100);
      return()=>clearTimeout(t);
    }
  },[displayState?.combo]);

  useEffect(()=>{
    if(displayState?.shake){
      setShake(true);
      const t=setTimeout(()=>setShake(false),400);
      return()=>clearTimeout(t);
    }
  },[displayState?.shake]);

  const touchStart=useRef({x:0,y:0});
  const onTouchStart=e=>{ touchStart.current={x:e.touches[0].clientX,y:e.touches[0].clientY}; };
  const onTouchEnd=e=>{
    const dx=e.changedTouches[0].clientX-touchStart.current.x;
    const dy=e.changedTouches[0].clientY-touchStart.current.y;
    if(Math.abs(dx)>Math.abs(dy))changeDir(dx>0?1:-1,0);
    else changeDir(0,dy>0?1:-1);
  };

  const s=displayState;
  const lives=Array.from({length:3},(_,i)=>i<(s?.lives??3));
  const bgShift=Math.sin(bgTick*0.02)*5;

  return (
    <div style={{
      display:'flex',flexDirection:'column',
      width:'100%',height:'100%',
      background:`linear-gradient(${155+bgShift}deg,${modeBg[0]} 0%,${modeBg[1]} 50%,${modeBg[2]} 100%)`,
      overflow:'hidden',position:'relative',
    }}>

      {/* Decorations */}
      <div style={{position:'absolute',inset:0,pointerEvents:'none',overflow:'hidden',zIndex:1}}>
        {decor.map((emoji,i)=>{
          const y=Math.sin(bgTick*0.015+i*0.9)*6;
          const x=Math.cos(bgTick*0.01+i*0.7)*4;
          return (
            <div key={i} style={{
              position:'absolute',
              left:`${5+i*11.5}%`,top:`${10+(i%3)*28}%`,
              fontSize:18+(i%3)*6,opacity:0.13,
              transform:`translate(${x}px,${y}px)`,
            }}>{emoji}</div>
          );
        })}
      </div>

      {/* Header */}
      <div style={{
        display:'flex',alignItems:'center',justifyContent:'space-between',
        padding:'8px 14px',flexShrink:0,
        background:'rgba(0,0,0,0.45)',
        borderBottom:`2px solid ${modeData?.color}44`,zIndex:5,
      }}>
        <button onClick={()=>{SFX.menuClick();onMenu?.();}} style={{
          background:'rgba(255,255,255,0.15)',border:'2px solid rgba(255,255,255,0.3)',
          borderRadius:12,color:'#fff',fontSize:12,fontWeight:800,
          padding:'6px 12px',cursor:'pointer',fontFamily:'inherit',
        }}>← Menu</button>
        <div style={{
          background:'linear-gradient(135deg,#FFD70033,#FF9A0033)',
          border:'2px solid #FFD700',borderRadius:14,padding:'5px 14px',
          color:'#FFD700',fontWeight:900,fontSize:16,
          fontFamily:"'Fredoka One',cursive",boxShadow:'0 0 12px #FFD70044',
        }}>⭐ {s?.score??0}</div>
        <div style={{display:'flex',gap:3}}>
          {lives.map((alive,i)=>(
            <span key={i} style={{fontSize:20,filter:alive?'drop-shadow(0 0 6px #ff4444)':'grayscale(1) opacity(0.4)',transition:'all 0.3s'}}>❤️</span>
          ))}
        </div>
      </div>

      {/* XP Bar */}
      <div style={{height:6,background:'rgba(255,255,255,0.08)',flexShrink:0}}>
        <div style={{
          height:'100%',
          width:`${Math.min(100,((s?.xp??0)/100)*100)}%`,
          background:`linear-gradient(90deg,${modeData?.color||'#00c853'},#FFD700)`,
          transition:'width 0.4s',boxShadow:`0 0 8px ${modeData?.color||'#00c853'}`,
        }}/>
      </div>

      {/* Target Banner */}
      <div style={{
        textAlign:'center',padding:'6px 12px',flexShrink:0,
        background:`linear-gradient(90deg,${modeData?.color}11,${modeData?.color}28,${modeData?.color}11)`,
        borderBottom:`2px solid ${modeData?.color}44`,zIndex:5,
      }}>
        <div style={{color:'rgba(255,255,255,0.65)',fontSize:10,fontWeight:800,letterSpacing:1.5}}>
          {s?.mode==='math'?'🧮 SOLVE & EAT ANSWER':`🎯 EAT THIS ${modeData?.emoji||''}`}
        </div>
        <div style={{
          color:modeData?.color||'#fff',
          fontSize:s?.mode==='math'?'clamp(15px,4.5vw,22px)':'clamp(24px,8vw,36px)',
          fontWeight:900,fontFamily:"'Fredoka One',cursive",lineHeight:1.1,
          textShadow:`0 0 20px ${modeData?.color}88`,
        }}>
          {s?.mode==='math'?s?.mathQ?.question:s?.target}
        </div>
        {s?.combo>1&&(
          <div style={{color:'#FFD700',fontSize:11,fontWeight:900}}>🔥 Combo x{s.combo}!</div>
        )}
      </div>

      {s?.mode==='word'&&<WordProgress wordObj={s?.wordObj} wordIdx={s?.wordIdx}/>}

      {/* Canvas */}
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden',zIndex:2,minHeight:0}}>
        <canvas
          ref={canvasRef}
          style={{display:'block',animation:shake?'gShake 0.35s':'none',borderRadius:4}}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        />
        <FloatMsg msg={s?.floatMsg}/>
        <Confetti active={confetti&&(s?.combo??0)>0}/>
      </div>

      <DPad onDir={changeDir}/>

      <style>{`
        @keyframes gShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}
      `}</style>
    </div>
  );
}
