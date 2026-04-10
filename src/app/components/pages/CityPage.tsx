// @ts-nocheck
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Rain } from '../Rain';
import { PixelCharacter } from '../PixelCharacter';
import { PixelCat, CAT_COLORS } from '../PixelCat';
import { CUFacade, Emart24Facade, GS25Facade, PochaFacade, HangangCafeFacade } from '../SeoulStreetFacades';
import { useMusic } from '../MusicContext';

// ── 계절 설정 (분기별로 변경) ──────────────────────────────────────
const SEASON = 'winter'; // spring | summer | autumn | winter
const SEASON_CONFIG = {
  spring: { skyTop:'#1a0f2e', skyBot:'#2d1b4e', groundColor:'#1a2e1a', groundLine:'#2a4a2a', ambientLight:'#ffccff' },
  summer: { skyTop:'#000814', skyBot:'#001a33', groundColor:'#0a1a0a', groundLine:'#1a2e1a', ambientLight:'#aaddff' },
  autumn: { skyTop:'#1a0800', skyBot:'#2a1200', groundColor:'#1a1000', groundLine:'#3a2000', ambientLight:'#ffaa44' },
  winter: { skyTop:'#050812', skyBot:'#0a1428', groundColor:'#0f1520', groundLine:'#1a2535', ambientLight:'#aaccff' },
};
const SC = SEASON_CONFIG[SEASON];

// ── 광고판 슬라이드 (한국 버전) ─────────────────────────────────────
const AD_SLIDES = [
  { bg:'#0a0014', border:'#ff0055', accent:'#ff3377', topText:'신제품 출시!', mainText:'TERRA', subText:'BEER', tagline:'갈증해소 MAX !!', icon:'🍺' },
  { bg:'#001428', border:'#0088ff', accent:'#44aaff', topText:'치킨 + 맥주', mainText:'BBQ', subText:'치킨', tagline:'지금 주문하세요', icon:'🍗' },
  { bg:'#001410', border:'#00cc88', accent:'#44ffbb', topText:'스타벅스 NEW', mainText:'한강', subText:'LATTE', tagline:'한정판매 중', icon:'☕' },
  { bg:'#140008', border:'#ff44aa', accent:'#ff88cc', topText:'KPOP NEW ALBUM', mainText:'IVE', subText:'COMEBACK', tagline:'지금 스트리밍', icon:'🎵' },
  { bg:'#100800', border:'#ffaa00', accent:'#ffcc44', topText:'프리미엄 소주', mainText:'참이슬', subText:'FRESH', tagline:'No.1 소주 브랜드', icon:'🥂' },
];

// ── 한강 야경 배경 ────────────────────────────────────────────────────
function HangangBackground() {
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
      {/* 하늘 그라데이션 */}
      <div style={{ position:'absolute', inset:0, background:`linear-gradient(to bottom, ${SC.skyTop} 0%, ${SC.skyBot} 60%, #0a1020 100%)` }} />
      {/* 달 */}
      <motion.div animate={{ opacity:[0.7,1,0.7], scale:[1,1.03,1] }} transition={{ duration:6, repeat:Infinity }}
        style={{ position:'absolute', top:'8%', right:'15%', width:52, height:52, borderRadius:'50%',
          background:'radial-gradient(circle at 35% 35%, #fffff0, #d4d4a0 60%, #a0a060)',
          boxShadow:'0 0 30px rgba(255,255,200,0.3), 0 0 60px rgba(255,255,200,0.15)' }} />
      {/* 별 */}
      {useMemo(() => [...Array(60)].map((_,i) => (
        <motion.div key={i} animate={{ opacity:[0.2+Math.random()*0.6, 0.8, 0.2+Math.random()*0.6] }}
          transition={{ duration:1.5+Math.random()*3, repeat:Infinity, delay:Math.random()*3 }}
          style={{ position:'absolute', top:`${Math.random()*55}%`, left:`${Math.random()*100}%`,
            width: Math.random()>0.8 ? 3 : 2, height: Math.random()>0.8 ? 3 : 2,
            backgroundColor:'#ffffff', borderRadius:'50%', opacity:0.6 }} />
      )), [])}
      {/* 한강 (수평선) */}
      <div style={{ position:'absolute', bottom:'28%', left:0, right:0, height:80,
        background:'linear-gradient(to bottom, transparent, rgba(10,30,60,0.6) 40%, rgba(5,15,35,0.8))',
        borderTop:'1px solid rgba(68,136,255,0.2)' }}>
        {/* 물 반사 라이트 */}
        {[...Array(8)].map((_,i) => (
          <motion.div key={i} animate={{ opacity:[0.1,0.4,0.1], scaleX:[1,1.3,1] }}
            transition={{ duration:2+i*0.5, repeat:Infinity, delay:i*0.3 }}
            style={{ position:'absolute', top:`${20+i*8}%`, left:`${5+i*11}%`,
              width:`${4+i*2}%`, height:2,
              backgroundColor:['#ffcc00','#ff8800','#4488ff','#ff0088','#00ffaa','#ffaa00','#88aaff','#ff6644'][i],
              borderRadius:99, filter:'blur(2px)' }} />
        ))}
      </div>
      {/* 원경 빌딩 실루엣 */}
      <div style={{ position:'absolute', bottom:'26%', left:0, right:0, display:'flex', alignItems:'flex-end', gap:2, padding:'0 5%', pointerEvents:'none' }}>
        {[120,80,150,60,100,130,70,110,90,140,65,95].map((h,i) => (
          <div key={i} style={{ flex:1, height:h, backgroundColor:i%3===0?'#0d1f40':i%3===1?'#091530':'#0b1838',
            position:'relative', minWidth:30 }}>
            {/* 빌딩 창문 */}
            {[...Array(Math.floor(h/20))].map((_,j) => (
              <motion.div key={j} animate={{ opacity:Math.random()>0.4?[1,0.2,1]:[0.2,0.8,0.2] }}
                transition={{ duration:2+Math.random()*4, repeat:Infinity, delay:Math.random()*3 }}
                style={{ position:'absolute', top:6+j*18, left:'20%', right:'20%', height:8,
                  backgroundColor:['#ffee88','#88bbff','#ffaa44','#aaffdd'][Math.floor(Math.random()*4)],
                  opacity:0.5, filter:'blur(0.5px)' }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 광고판 ───────────────────────────────────────────────────────────
function AdBillboard({ slide }: { slide: typeof AD_SLIDES[0] }) {
  return (
    <div style={{ width:180, height:130, backgroundColor:slide.bg, border:`3px solid ${slide.border}`,
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      padding:10, gap:3, position:'relative', overflow:'hidden',
      boxShadow:`0 0 20px ${slide.border}66` }}>
      <div style={{ fontSize:9, color:slide.accent, fontFamily:'monospace', letterSpacing:'0.15em' }}>{slide.topText}</div>
      <div style={{ display:'flex', alignItems:'center', gap:4 }}>
        <span style={{ fontSize:20 }}>{slide.icon}</span>
        <div>
          <div style={{ color:slide.accent, fontFamily:'monospace', fontWeight:900, fontSize:22, lineHeight:1 }}>{slide.mainText}</div>
          <div style={{ color:slide.accent, fontFamily:'monospace', fontSize:12, opacity:0.8 }}>{slide.subText}</div>
        </div>
      </div>
      <div style={{ color:slide.accent, fontFamily:'monospace', fontSize:8, opacity:0.75, letterSpacing:'0.1em' }}>{slide.tagline}</div>
      <motion.div animate={{ opacity:[0,1,0] }} transition={{ duration:0.8, repeat:Infinity, repeatDelay:2 }}
        style={{ position:'absolute', inset:0, border:`1px solid ${slide.border}`, opacity:0.3 }} />
    </div>
  );
}

export function CityPage() {
  const nav = useNavigate();
  const [curAd, setCurAd] = useState(0);
  const [openShop, setOpenShop] = useState(null);
  const { playTrack } = useMusic?.() || {};
  const charX = useRef(400);
  const [charPos, setCharPos] = useState(400);
  const [charDir, setCharDir] = useState(1);
  const [isWalking, setIsWalking] = useState(false);
  const keys = useRef({});
  const rafRef = useRef(null);
  const musicRef = useRef(null);

  // 광고 슬라이드
  useEffect(() => {
    const t = setInterval(() => setCurAd(p => (p+1) % AD_SLIDES.length), 3500);
    return () => clearInterval(t);
  }, []);

  // 배경음악
  useEffect(() => {
    const audio = new Audio('/codegame-main/music/city_main.mp3');
    audio.loop = true;
    audio.volume = 0.3;
    audio.play().catch(() => {});
    musicRef.current = audio;
    return () => { audio.pause(); audio.src = ''; };
  }, []);

  // 키보드 이동
  useEffect(() => {
    const down = (e) => { keys.current[e.key] = true; };
    const up = (e) => { keys.current[e.key] = false; };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    const STREET_W = 3200;
    const loop = () => {
      let dx = 0;
      if (keys.current['ArrowLeft']||keys.current['a']||keys.current['A']) dx = -3;
      if (keys.current['ArrowRight']||keys.current['d']||keys.current['D']) dx = 3;
      if (dx !== 0) {
        charX.current = Math.max(60, Math.min(STREET_W - 60, charX.current + dx));
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

  const STREET_W = 3200;
  const VIEWPORT_W = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const camX = Math.max(0, Math.min(STREET_W - VIEWPORT_W, charPos - VIEWPORT_W / 2));

  const shops = [
    { comp: CUFacade,         x: 100,  label: 'CU',        color: '#6B2FA0' },
    { comp: Emart24Facade,    x: 340,  label: '이마트24',   color: '#FFD600' },
    { comp: GS25Facade,       x: 580,  label: 'GS25',       color: '#003B8E' },
    { comp: PochaFacade,      x: 900,  label: '포차',        color: '#ff8800' },
    { comp: HangangCafeFacade,x: 1200, label: '한강카페',    color: '#4488ff' },
    { comp: PochaFacade,      x: 1600, label: '포차2',       color: '#ff8800' },
    { comp: CUFacade,         x: 2000, label: 'CU',         color: '#6B2FA0' },
    { comp: GS25Facade,       x: 2300, label: 'GS25',       color: '#003B8E' },
    { comp: Emart24Facade,    x: 2600, label: '이마트24',   color: '#FFD600' },
    { comp: HangangCafeFacade,x: 2900, label: '한강카페',   color: '#4488ff' },
  ];

  return (
    <div style={{ width:'100vw', height:'100vh', overflow:'hidden', backgroundColor:'#050810', position:'relative', cursor:'none' }}>
      <HangangBackground />

      {/* 뒤로가기 */}
      <button onClick={() => nav('/dev-garden')}
        style={{ position:'fixed', top:16, left:16, zIndex:100, padding:'6px 16px',
          backgroundColor:'rgba(0,0,0,0.7)', color:'#aaaacc', border:'1px solid rgba(100,100,200,0.3)',
          fontFamily:'monospace', fontSize:12, cursor:'pointer', backdropFilter:'blur(8px)' }}>
        ← BACK
      </button>

      {/* 안내 */}
      <div style={{ position:'fixed', bottom:16, left:'50%', transform:'translateX(-50%)',
        zIndex:100, padding:'6px 20px', backgroundColor:'rgba(0,0,0,0.6)',
        color:'rgba(255,255,255,0.5)', border:'1px solid rgba(255,255,255,0.1)',
        fontFamily:'monospace', fontSize:11, backdropFilter:'blur(8px)', whiteSpace:'nowrap' }}>
        ← → / A D 이동 &nbsp;·&nbsp; ENTER / 클릭 입장
      </div>

      {/* 스크롤 월드 */}
      <div style={{ position:'absolute', bottom:0, left:0, height:'100%', width:STREET_W,
        transform:`translateX(${-camX}px)`, transition:'transform 0.05s linear' }}>

        {/* 광고판 */}
        <div style={{ position:'absolute', bottom:'38%', left:700, zIndex:5 }}>
          <AnimatePresence mode="wait">
            <motion.div key={curAd} initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              transition={{ duration:0.5 }}>
              <AdBillboard slide={AD_SLIDES[curAd]} />
            </motion.div>
          </AnimatePresence>
        </div>
        <div style={{ position:'absolute', bottom:'38%', left:1800, zIndex:5 }}>
          <AnimatePresence mode="wait">
            <motion.div key={(curAd+2)%AD_SLIDES.length} initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              transition={{ duration:0.5 }}>
              <AdBillboard slide={AD_SLIDES[(curAd+2)%AD_SLIDES.length]} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 건물들 */}
        {shops.map((s, i) => {
          const Comp = s.comp;
          return (
            <div key={i} style={{ position:'absolute', bottom:'28%', left:s.x, zIndex:4 }}>
              <Comp onClick={() => setOpenShop(s)} isOpen={openShop?.x === s.x} />
              {/* 건물 이름표 */}
              <div style={{ textAlign:'center', color:s.color, fontFamily:'monospace',
                fontSize:10, marginTop:4, textShadow:`0 0 6px ${s.color}88` }}>
                {s.label}
              </div>
            </div>
          );
        })}

        {/* 가로등 */}
        {[200,450,700,950,1200,1500,1800,2100,2400,2700,3000].map((lx,i) => (
          <div key={i} style={{ position:'absolute', bottom:'28%', left:lx, zIndex:3 }}>
            <div style={{ width:6, height:80, backgroundColor:'#334466', margin:'0 auto' }} />
            <motion.div animate={{ boxShadow:['0 0 12px #ffee8888','0 0 20px #ffee88cc','0 0 12px #ffee8888'] }}
              transition={{ duration:3+i*0.4, repeat:Infinity }}
              style={{ width:20, height:14, backgroundColor:'#ffee88', margin:'0 auto',
                borderRadius:'2px 2px 6px 6px' }} />
          </div>
        ))}

        {/* 지면 */}
        <div style={{ position:'absolute', bottom:0, left:0, width:STREET_W, height:'28%',
          background:`linear-gradient(to bottom, ${SC.groundLine}, ${SC.groundColor})` }}>
          {/* 인도 */}
          <div style={{ position:'absolute', top:0, left:0, right:0, height:8,
            backgroundColor:'#1a2a3a', borderTop:'2px solid #2a3a4a' }} />
          {/* 보도블록 */}
          {[...Array(Math.ceil(STREET_W/60))].map((_,i) => (
            <div key={i} style={{ position:'absolute', top:8, left:i*60, width:58, height:6,
              borderRight:'1px solid rgba(255,255,255,0.05)', borderBottom:'1px solid rgba(255,255,255,0.03)' }} />
          ))}
        </div>

        {/* 캐릭터 */}
        <div style={{ position:'absolute', bottom:'28%', left:charPos, zIndex:10, transform:'translateX(-50%)' }}>
          <PixelCharacter direction={charDir} isWalking={isWalking} />
          <div style={{ color:'rgba(255,255,255,0.5)', fontFamily:'monospace', fontSize:9,
            textAlign:'center', marginTop:2 }}>YOU</div>
        </div>

        {/* 고양이들 */}
        {[300,800,1400,2200].map((cx,i) => (
          <div key={i} style={{ position:'absolute', bottom:'28%', left:cx, zIndex:8 }}>
            <PixelCat color={CAT_COLORS[i%CAT_COLORS.length]} />
          </div>
        ))}
      </div>

      {/* 비 효과 */}
      <Rain />

      {/* 가게 입장 팝업 */}
      <AnimatePresence>
        {openShop && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            style={{ position:'fixed', inset:0, zIndex:200, backgroundColor:'rgba(0,0,0,0.8)',
              display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(4px)' }}
            onClick={() => setOpenShop(null)}>
            <motion.div initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }}
              exit={{ scale:0.9, opacity:0 }}
              onClick={e => e.stopPropagation()}
              style={{ backgroundColor:'#0a1020', border:`2px solid ${openShop.color}`,
                borderRadius:8, padding:'32px 40px', textAlign:'center', minWidth:260,
                boxShadow:`0 0 40px ${openShop.color}44` }}>
              <div style={{ fontSize:32, marginBottom:12 }}>🏪</div>
              <div style={{ color:openShop.color, fontFamily:'monospace', fontWeight:700, fontSize:20, marginBottom:8 }}>
                {openShop.label}
              </div>
              <div style={{ color:'rgba(255,255,255,0.5)', fontFamily:'monospace', fontSize:12, marginBottom:20 }}>
                현재 준비 중이에요.<br />다음 업데이트에서 오픈합니다!
              </div>
              <button onClick={() => setOpenShop(null)}
                style={{ padding:'8px 24px', backgroundColor:openShop.color, color:'#000',
                  border:'none', fontFamily:'monospace', fontWeight:700, fontSize:13, cursor:'pointer' }}>
                돌아가기
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
