// @ts-nocheck
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Rain } from '../Rain';
import { PixelCharacter } from '../PixelCharacter';
import { PixelCat, CAT_COLORS } from '../PixelCat';
import { CUFacade, Emart24Facade, GS25Facade } from '../SeoulStreetFacades';
import { useMusic } from '../../contexts/MusicContext';

const STREET_W = 2400;

// ── 배경 ──────────────────────────────────────────────────────────────
function SkyBackground() {
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
      <div style={{ position:'absolute', inset:0,
        background:'linear-gradient(to bottom, #050812 0%, #0a1428 60%, #0d1a30 100%)' }} />
      {/* 달 */}
      <motion.div animate={{ opacity:[0.8,1,0.8] }} transition={{ duration:5, repeat:Infinity }}
        style={{ position:'absolute', top:'10%', right:'18%', width:48, height:48,
          borderRadius:'50%',
          background:'radial-gradient(circle at 35% 35%, #fffff0, #d4d4a0 60%, #a0a060)',
          boxShadow:'0 0 25px rgba(255,255,200,0.25)' }} />
      {/* 별 */}
      {useMemo(() => [...Array(50)].map((_,i) => (
        <motion.div key={i}
          animate={{ opacity:[0.2+Math.random()*0.5, 0.9, 0.2+Math.random()*0.5] }}
          transition={{ duration:1.5+Math.random()*3, repeat:Infinity, delay:Math.random()*3 }}
          style={{ position:'absolute', top:`${Math.random()*50}%`, left:`${Math.random()*100}%`,
            width:2, height:2, backgroundColor:'#fff', borderRadius:'50%' }} />
      )), [])}
      {/* 수평선 빛 반사 */}
      <div style={{ position:'absolute', bottom:'28%', left:0, right:0, height:60,
        background:'linear-gradient(to bottom, transparent, rgba(10,30,60,0.5))',
        borderTop:'1px solid rgba(68,136,255,0.15)' }}>
        {[...Array(6)].map((_,i) => (
          <motion.div key={i} animate={{ opacity:[0.1,0.35,0.1], scaleX:[1,1.4,1] }}
            transition={{ duration:2.5+i*0.6, repeat:Infinity, delay:i*0.4 }}
            style={{ position:'absolute', top:`${15+i*10}%`, left:`${8+i*13}%`,
              width:`${5+i*2}%`, height:1.5,
              backgroundColor:['#ffcc00','#ff8800','#4488ff','#ff0088','#00ffaa','#ffaa00'][i],
              borderRadius:99, filter:'blur(1px)' }} />
        ))}
      </div>
      {/* 원경 빌딩 */}
      <div style={{ position:'absolute', bottom:'26%', left:0, right:0,
        display:'flex', alignItems:'flex-end', gap:1, padding:'0 3%', pointerEvents:'none' }}>
        {[100,60,140,50,120,80,160,55,110,70,130,45,95,150,65].map((h,i) => (
          <div key={i} style={{ flex:1, height:h, minWidth:20,
            backgroundColor:i%3===0?'#0d1f40':i%3===1?'#091530':'#0b1838', position:'relative' }}>
            {[...Array(Math.floor(h/20))].map((_,j) => (
              <motion.div key={j}
                animate={{ opacity:Math.random()>0.4?[1,0.2,1]:[0.1,0.7,0.1] }}
                transition={{ duration:2+Math.random()*4, repeat:Infinity, delay:Math.random()*3 }}
                style={{ position:'absolute', top:4+j*18, left:'15%', right:'15%', height:7,
                  backgroundColor:['#ffee88','#88bbff','#ffaa44','#aaffdd'][Math.floor(Math.random()*4)],
                  opacity:0.4, filter:'blur(0.5px)' }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 픽셀 강아지 ───────────────────────────────────────────────────────
function PixelDog({ color='#c8a878', flipped=false }) {
  const pixels = [
    [0,0,1,1,0,0,0,0],
    [0,1,1,1,1,0,0,0],
    [0,1,0,1,0,0,0,0],
    [0,1,1,1,1,1,0,0],
    [1,1,1,1,1,1,1,0],
    [1,1,0,0,1,1,0,0],
    [1,0,0,0,1,0,0,0],
  ];
  const display = flipped ? pixels.map(r => [...r].reverse()) : pixels;
  return (
    <svg width={32} height={28} viewBox="0 0 8 7" style={{ imageRendering:'pixelated' }}>
      {display.map((row,y) => row.map((v,x) => v ? (
        <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1}
          fill={y===1&&x>=1&&x<=4?'#664422':y===2&&(x===2)?'#ff6666':color} />
      ) : null))}
    </svg>
  );
}

// ── 픽셀 벤치 ─────────────────────────────────────────────────────────
function PixelBench() {
  return (
    <svg width={48} height={28} viewBox="0 0 12 7" style={{ imageRendering:'pixelated' }}>
      {/* 등받이 */}
      <rect x="1" y="0" width="10" height="1" fill="#5a3e1a"/>
      <rect x="1" y="1" width="10" height="1" fill="#7a5628"/>
      {/* 좌석 */}
      <rect x="0" y="3" width="12" height="1" fill="#5a3e1a"/>
      <rect x="0" y="4" width="12" height="1" fill="#7a5628"/>
      {/* 다리 */}
      <rect x="1" y="5" width="1" height="2" fill="#4a3010"/>
      <rect x="10" y="5" width="1" height="2" fill="#4a3010"/>
      {/* 볼트 */}
      <rect x="2" y="3" width="1" height="1" fill="#aaa"/>
      <rect x="9" y="3" width="1" height="1" fill="#aaa"/>
    </svg>
  );
}

// ── 공사중 건물 ───────────────────────────────────────────────────────
function ConstructionBuilding({ x, width=200, height=260 }: { x:number; width?:number; height?:number }) {
  return (
    <div style={{ position:'absolute', bottom:'28%', left:x, zIndex:4, width, height,
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-end' }}>
      {/* 건물 본체 */}
      <div style={{ width:'100%', height:'85%', position:'relative',
        background:'linear-gradient(to bottom, #1a1a2a, #0f0f1a)',
        border:'2px solid #333344' }}>
        {/* 격자 비계 */}
        {[...Array(5)].map((_,i) => (
          <div key={i} style={{ position:'absolute', left:`${i*25}%`, top:0, bottom:0,
            width:2, background:'#ff8800', opacity:0.6 }} />
        ))}
        {[...Array(6)].map((_,i) => (
          <div key={i} style={{ position:'absolute', top:`${i*18}%`, left:0, right:0,
            height:2, background:'#ff8800', opacity:0.5 }} />
        ))}
        {/* 창문(미완성) */}
        {[...Array(3)].map((_,col) =>
          [...Array(4)].map((_,row) => (
            <div key={`${col}-${row}`} style={{
              position:'absolute',
              left:`${15+col*30}%`, top:`${10+row*22}%`,
              width:'18%', height:'14%',
              background: Math.random()>0.5 ? 'rgba(255,200,80,0.1)' : 'rgba(0,0,0,0.6)',
              border:'1px solid #2a2a3a'
            }} />
          ))
        )}
        {/* 공사중 띠 */}
        <div style={{ position:'absolute', top:'40%', left:0, right:0,
          background:'repeating-linear-gradient(45deg, #ff8800, #ff8800 10px, #111 10px, #111 20px)',
          height:28, display:'flex', alignItems:'center', justifyContent:'center',
          zIndex:2 }}>
          <span style={{ color:'#fff', fontFamily:'"Press Start 2P", monospace',
            fontSize:9, letterSpacing:'0.15em',
            textShadow:'1px 1px 0 #000', padding:'0 8px',
            background:'rgba(0,0,0,0.5)' }}>
            🚧 공사중 🚧
          </span>
        </div>
        {/* 크레인 */}
        <div style={{ position:'absolute', top:-60, right:10, width:4,
          height:60, background:'#ff8800' }} />
        <div style={{ position:'absolute', top:-60, right:10, width:60,
          height:4, background:'#ff8800' }} />
        <div style={{ position:'absolute', top:-56, right:10, width:2,
          height:30, background:'#ffcc00', opacity:0.7 }} />
      </div>
      {/* 건물 이름 */}
      <div style={{ marginTop:6, fontSize:9, fontFamily:'"Press Start 2P", monospace',
        color:'#ff8800', textShadow:'0 0 8px #ff880088', textAlign:'center' }}>
        공사중
      </div>
    </div>
  );
}

// ── 가로등 ────────────────────────────────────────────────────────────
function Streetlight({ x }: { x:number }) {
  return (
    <div style={{ position:'absolute', bottom:'28%', left:x, zIndex:3 }}>
      <div style={{ width:5, height:75, backgroundColor:'#334466', margin:'0 auto' }} />
      <motion.div
        animate={{ boxShadow:['0 0 10px #ffee8866','0 0 18px #ffee88aa','0 0 10px #ffee8866'] }}
        transition={{ duration:4, repeat:Infinity }}
        style={{ width:18, height:12, backgroundColor:'#ffee88',
          margin:'0 auto', borderRadius:'2px 2px 5px 5px' }} />
    </div>
  );
}

export function CityPage() {
  useEffect(() => {
    document.body.classList.add('dev-garden-page');
    document.documentElement.style.background = '#000';
    document.body.style.background = '#000';
    const root = document.getElementById('root');
    if (root) root.style.background = '#000';
    return () => {
      document.body.classList.remove('dev-garden-page');
      document.documentElement.style.background = '';
      document.body.style.background = '';
      if (root) root.style.background = '';
    };
  }, []);

  const nav = useNavigate();
  const [openShop, setOpenShop] = useState(null);
  const charX = useRef(300);
  const [charPos, setCharPos] = useState(300);
  const [charDir, setCharDir] = useState(1);
  const [isWalking, setIsWalking] = useState(false);
  const keys = useRef({});
  const rafRef = useRef(null);

  const savedChar = (() => {
    try { return JSON.parse(localStorage.getItem('cg_character') || '{}'); } catch { return {}; }
  })();

  const { play } = useMusic();
  useEffect(() => { play(); }, []);

  useEffect(() => {
    const down = (e) => { keys.current[e.key] = true; };
    const up   = (e) => { keys.current[e.key] = false; };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    const loop = () => {
      let dx = 0;
      if (keys.current['ArrowLeft']  || keys.current['a'] || keys.current['A']) dx = -3;
      if (keys.current['ArrowRight'] || keys.current['d'] || keys.current['D']) dx = 3;
      if (dx !== 0) {
        charX.current = Math.max(40, Math.min(STREET_W - 40, charX.current + dx));
        setCharPos(charX.current);
        setCharDir(dx > 0 ? 1 : -1);
        setIsWalking(true);
      } else {
        setIsWalking(false);
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const VIEWPORT_W = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const camX = Math.max(0, Math.min(STREET_W - VIEWPORT_W, charPos - VIEWPORT_W / 2));

  // 편의점 3개
  const shops = [
    { comp: CUFacade,      x: 80,   label:'CU',      color:'#6B2FA0' },
    { comp: GS25Facade,    x: 360,  label:'GS25',    color:'#003B8E' },
    { comp: Emart24Facade, x: 640,  label:'이마트24', color:'#FFD600' },
  ];

  // 캐릭터 prop 매핑
  const charHair = savedChar?.hair?.includes('LONG') || savedChar?.hair?.includes('WAVE') || savedChar?.hair?.includes('PONY') ? 'LONG'
    : savedChar?.hair?.includes('BEANIE') ? 'BEANIE'
    : savedChar?.hair?.includes('SPIKY') ? 'SPIKY' : 'SHORT';

  return (
    <div style={{ width:'100vw', height:'100vh', overflow:'hidden',
      backgroundColor:'#050810', position:'relative', cursor:'none' }}>

      <SkyBackground />

      {/* 뒤로가기 */}
      <button onClick={() => nav('/dev-garden')}
        style={{ position:'fixed', top:14, left:14, zIndex:100, padding:'6px 14px',
          backgroundColor:'rgba(0,0,0,0.7)', color:'#aabbcc',
          border:'1px solid rgba(100,120,200,0.3)', fontFamily:'"Press Start 2P", monospace',
          fontSize:9, cursor:'pointer', backdropFilter:'blur(8px)', letterSpacing:'0.05em' }}>
        ← BACK
      </button>

      {/* 조작 안내 */}
      <div style={{ position:'fixed', bottom:14, left:'50%', transform:'translateX(-50%)',
        zIndex:100, padding:'6px 18px', backgroundColor:'rgba(0,0,0,0.6)',
        color:'rgba(255,255,255,0.4)', border:'1px solid rgba(255,255,255,0.08)',
        fontFamily:'"Press Start 2P", monospace', fontSize:8,
        backdropFilter:'blur(8px)', whiteSpace:'nowrap', letterSpacing:'0.05em' }}>
        ← → / A D  이동
      </div>

      {/* 스크롤 월드 */}
      <div style={{ position:'absolute', bottom:0, left:0, height:'100%', width:STREET_W,
        transform:`translateX(${-camX}px)`, transition:'transform 0.04s linear' }}>

        {/* ── 편의점 3개 ── */}
        {shops.map((s, i) => {
          const Comp = s.comp;
          return (
            <div key={i} style={{ position:'absolute', bottom:'28%', left:s.x, zIndex:4 }}>
              <Comp onClick={() => setOpenShop(s)} isOpen={openShop?.x === s.x} />
              <div style={{ textAlign:'center', color:s.color, fontFamily:'"Press Start 2P", monospace',
                fontSize:8, marginTop:4, textShadow:`0 0 6px ${s.color}88` }}>
                {s.label}
              </div>
            </div>
          );
        })}

        {/* ── 공사중 건물들 ── */}
        <ConstructionBuilding x={980}  width={180} height={240} />
        <ConstructionBuilding x={1220} width={220} height={290} />
        <ConstructionBuilding x={1500} width={160} height={210} />
        <ConstructionBuilding x={1720} width={200} height={270} />

        {/* ── 벤치 ── */}
        {[920, 1100, 1460, 1840, 2100].map((bx, i) => (
          <div key={i} style={{ position:'absolute', bottom:'28%', left:bx, zIndex:5 }}>
            <PixelBench />
          </div>
        ))}

        {/* ── 강아지들 ── */}
        {[850, 1380, 2050].map((dx, i) => (
          <div key={i} style={{ position:'absolute', bottom:'28%', left:dx, zIndex:6 }}>
            <motion.div animate={{ x:[0,3,0,-3,0] }} transition={{ duration:3+i, repeat:Infinity }}>
              <PixelDog color={['#c8a878','#885533','#eeeeee'][i]} flipped={i%2===1} />
            </motion.div>
          </div>
        ))}

        {/* ── 고양이들 ── */}
        {[1150, 1700, 2200].map((cx, i) => (
          <div key={i} style={{ position:'absolute', bottom:'28%', left:cx, zIndex:6 }}>
            <PixelCat color={CAT_COLORS[i % CAT_COLORS.length]} />
          </div>
        ))}

        {/* ── 가로등 ── */}
        {[200, 500, 780, 1060, 1350, 1640, 1920, 2200].map((lx, i) => (
          <Streetlight key={i} x={lx} />
        ))}

        {/* ── 지면 ── */}
        <div style={{ position:'absolute', bottom:0, left:0, width:STREET_W, height:'28%',
          background:'linear-gradient(to bottom, #1a2535, #0f1520)' }}>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:7,
            backgroundColor:'#1a2a3a', borderTop:'2px solid #2a3a4a' }} />
          {[...Array(Math.ceil(STREET_W / 60))].map((_, i) => (
            <div key={i} style={{ position:'absolute', top:7, left:i*60, width:58, height:5,
              borderRight:'1px solid rgba(255,255,255,0.04)' }} />
          ))}
        </div>

        {/* ── 캐릭터 ── */}
        <div style={{ position:'absolute', bottom:'28%', left:charPos,
          zIndex:10, transform:'translateX(-50%)' }}>
          <PixelCharacter
            outfit={savedChar?.outfit}
            bottom={savedChar?.bottom}
            hair={charHair}
            hairColor={savedChar?.hairColor || '#1a1a1a'}
            gender={savedChar?.gender === '여자' ? 'FEM' : 'MASC'}
            skin={savedChar?.skin || '#EFC4A8'}
            direction={charDir}
            isWalking={isWalking}
            scale={4}
          />
          <div style={{ color:'rgba(255,255,255,0.45)', fontFamily:'monospace',
            fontSize:9, textAlign:'center', marginTop:1 }}>YOU</div>
        </div>
      </div>

      <Rain />

      {/* ── 가게 팝업 ── */}
      <AnimatePresence>
        {openShop && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            style={{ position:'fixed', inset:0, zIndex:200,
              backgroundColor:'rgba(0,0,0,0.8)', display:'flex',
              alignItems:'center', justifyContent:'center', backdropFilter:'blur(4px)' }}
            onClick={() => setOpenShop(null)}>
            <motion.div initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }}
              exit={{ scale:0.9, opacity:0 }}
              onClick={e => e.stopPropagation()}
              style={{ backgroundColor:'#0a1020', border:`2px solid ${openShop.color}`,
                padding:'28px 36px', textAlign:'center', minWidth:240,
                boxShadow:`0 0 40px ${openShop.color}44` }}>
              <div style={{ fontSize:28, marginBottom:10 }}>🏪</div>
              <div style={{ color:openShop.color, fontFamily:'"Press Start 2P", monospace',
                fontSize:14, fontWeight:700, marginBottom:8 }}>
                {openShop.label}
              </div>
              <div style={{ color:'rgba(255,255,255,0.45)', fontFamily:'"Press Start 2P", monospace',
                fontSize:9, marginBottom:18, lineHeight:2 }}>
                준비 중이에요.<br/>다음 업데이트에서 오픈!
              </div>
              <button onClick={() => setOpenShop(null)}
                style={{ padding:'8px 22px', backgroundColor:openShop.color, color:'#000',
                  border:'none', fontFamily:'"Press Start 2P", monospace',
                  fontSize:10, cursor:'pointer' }}>
                돌아가기
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
