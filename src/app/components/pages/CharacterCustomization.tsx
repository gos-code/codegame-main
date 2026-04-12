// @ts-nocheck
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PixelCity } from '../PixelCity';
import { useNavigate } from 'react-router';
import { PixelDuck } from '../PixelDuck';

// ── 데이터 ───────────────────────────────────────────────────────────
const HATS = [
  { id:'none',   label:'없음',       desc:'민머리 오리' },
  { id:'cap',    label:'야구 모자',  desc:'스트리트 감성' },
  { id:'beanie', label:'비니',       desc:'힙한 느낌' },
  { id:'party',  label:'파티 모자',  desc:'축제 분위기' },
  { id:'crown',  label:'왕관',       desc:'귀족 오리' },
];

const TOP_COLORS = [
  { id:'blue',    color:'#4a90d9', label:'블루' },
  { id:'red',     color:'#d94a4a', label:'레드' },
  { id:'green',   color:'#4a9d5c', label:'그린' },
  { id:'purple',  color:'#7c4ad9', label:'퍼플' },
  { id:'orange',  color:'#d97c4a', label:'오렌지' },
  { id:'pink',    color:'#d94a8a', label:'핑크' },
  { id:'yellow',  color:'#d9c44a', label:'옐로우' },
  { id:'black',   color:'#2a2a2a', label:'블랙' },
  { id:'white',   color:'#f0f0f0', label:'화이트' },
  { id:'cyan',    color:'#4ad9d9', label:'시안' },
];

const BOTTOM_COLORS = [
  { id:'navy',    color:'#2c5f8a', label:'네이비' },
  { id:'black',   color:'#1a1a2a', label:'블랙' },
  { id:'khaki',   color:'#6b7c4a', label:'카키' },
  { id:'brown',   color:'#6b4a2a', label:'브라운' },
  { id:'gray',    color:'#5a5a6a', label:'그레이' },
  { id:'denim',   color:'#3d5a8a', label:'데님' },
  { id:'white',   color:'#e0e0e0', label:'화이트' },
  { id:'green',   color:'#3a6a4a', label:'그린' },
  { id:'red',     color:'#8a2a2a', label:'버건디' },
  { id:'purple',  color:'#5a3a8a', label:'퍼플' },
];

const BODY_COLORS = [
  { id:'white',   color:'#f5f0dc', label:'화이트' },
  { id:'yellow',  color:'#f0d060', label:'옐로우' },
  { id:'gray',    color:'#c0c0c0', label:'그레이' },
  { id:'brown',   color:'#c09060', label:'브라운' },
  { id:'black',   color:'#404040', label:'블랙' },
];

const HAT_COLORS = [
  { id:'red',     color:'#cc2222', label:'레드' },
  { id:'blue',    color:'#2244cc', label:'블루' },
  { id:'black',   color:'#111111', label:'블랙' },
  { id:'white',   color:'#eeeeee', label:'화이트' },
  { id:'green',   color:'#228822', label:'그린' },
  { id:'yellow',  color:'#ddaa00', label:'옐로우' },
  { id:'purple',  color:'#882288', label:'퍼플' },
  { id:'orange',  color:'#dd6600', label:'오렌지' },
  { id:'pink',    color:'#dd4499', label:'핑크' },
  { id:'navy',    color:'#1a2d5a', label:'네이비' },
];

const TABS = [
  { id:'body',    label:'몸통',  icon:'🦆', color:'#f0d060' },
  { id:'hat',     label:'모자',  icon:'🧢', color:'#ff6666' },
  { id:'top',     label:'상의',  icon:'👕', color:'#66aaff' },
  { id:'bottom',  label:'하의',  icon:'👖', color:'#aa66ff' },
] as const;
type TabId = typeof TABS[number]['id'];

// ── 픽셀 커서 ────────────────────────────────────────────────────────
function PixelCursor({ x, y }: { x:number; y:number }) {
  return (
    <div style={{ position:'fixed', left:x, top:y, pointerEvents:'none', zIndex:9999,
      transform:'translate(-1px,-1px)' }}>
      <svg width="16" height="16" viewBox="0 0 8 8" style={{ imageRendering:'pixelated' }}>
        <rect x="0" y="0" width="1" height="6" fill="#f0d060"/>
        <rect x="1" y="1" width="1" height="1" fill="#f0d060"/>
        <rect x="2" y="2" width="1" height="1" fill="#f0d060"/>
        <rect x="3" y="3" width="1" height="1" fill="#f0d060"/>
        <rect x="0" y="0" width="1" height="1" fill="#fff"/>
      </svg>
    </div>
  );
}

export function CharacterCustomization() {
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

  const [bodyColor, setBodyColor]     = useState('#f5f0dc');
  const [hat, setHat]                 = useState('cap');
  const [hatColor, setHatColor]       = useState('#cc2222');
  const [topColor, setTopColor]       = useState('#4a90d9');
  const [bottomColor, setBottomColor] = useState('#2c5f8a');
  const [activeTab, setActiveTab]     = useState<TabId>('body');
  const [isExiting, setIsExiting]     = useState(false);
  const [cursor, setCursor]           = useState({ x:-100, y:-100 });
  const navigate = useNavigate();

  useEffect(() => {
    const move = (e: MouseEvent) => setCursor({ x:e.clientX, y:e.clientY });
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  const handleEnter = () => {
    setIsExiting(true);
    const char = { bodyColor, hat, hatColor, topColor, bottomColor, isDuck: true };
    localStorage.setItem('cg_character', JSON.stringify(char));
    setTimeout(() => navigate('/dev-garden/city', { state: { character: char } }), 700);
  };

  const activeColor = TABS.find(t => t.id === activeTab)?.color || '#f0d060';

  return (
    <div style={{ position:'relative', width:'100%', minHeight:'100vh',
      background:'#02020f', overflow:'hidden', color:'#fff',
      cursor:'none', userSelect:'none', fontFamily:'"Press Start 2P", monospace' }}>

      <PixelCursor x={cursor.x} y={cursor.y} />

      {/* 배경 도시 */}
      <div style={{ position:'absolute', inset:0, opacity:0.15, filter:'blur(3px)', pointerEvents:'none' }}>
        <PixelCity />
      </div>
      <div style={{ position:'absolute', inset:0, zIndex:1, pointerEvents:'none',
        background:'linear-gradient(to bottom, rgba(2,2,15,0.75) 0%, rgba(2,2,15,0.55) 50%, rgba(2,2,15,0.88) 100%)' }} />

      {/* 상단 컬러 라인 */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:2, zIndex:2,
        background:`linear-gradient(90deg, transparent, ${activeColor}99, ${activeColor}, ${activeColor}99, transparent)`,
        transition:'background 0.3s' }} />

      {/* 스캔라인 */}
      <div style={{ position:'absolute', inset:0, zIndex:2, pointerEvents:'none', opacity:0.2,
        backgroundImage:'linear-gradient(transparent 50%, rgba(0,0,0,0.4) 50%)',
        backgroundSize:'100% 4px' }} />

      {/* ── 메인 ── */}
      <div style={{ position:'relative', zIndex:3, display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center', minHeight:'100vh', padding:'40px 16px 40px' }}>

        {/* 헤더 */}
        <motion.div initial={{ y:-30, opacity:0 }} animate={{ y:0, opacity:1 }}
          style={{ textAlign:'center', marginBottom:20, width:'100%', maxWidth:1000 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:12, marginBottom:6 }}>
            <div style={{ height:1, flex:1, background:`linear-gradient(90deg,transparent,${activeColor}55)` }} />
            <h1 style={{ fontSize:'clamp(13px,1.8vw,20px)', color:activeColor, letterSpacing:'0.2em',
              margin:0, textShadow:`0 0 20px ${activeColor}66`, transition:'color 0.3s, text-shadow 0.3s' }}>
              🦆 나의 오리 만들기
            </h1>
            <div style={{ height:1, flex:1, background:`linear-gradient(90deg,${activeColor}55,transparent)` }} />
          </div>
          <p style={{ fontSize:7, color:'rgba(255,255,255,0.2)', margin:0, letterSpacing:'0.15em' }}>
            DUCK CREATOR · DEV GARDEN SEOUL
          </p>
        </motion.div>

        {/* 3열 레이아웃 */}
        <div style={{ display:'flex', gap:24, width:'100%', maxWidth:1000,
          alignItems:'flex-start', justifyContent:'center', flexWrap:'wrap' }}>

          {/* ─ 왼쪽: 탭 + 옵션 ─ */}
          <motion.div initial={{ x:-30, opacity:0 }} animate={{ x:0, opacity:1 }}
            style={{ flex:'0 0 300px', minWidth:260, display:'flex', flexDirection:'column', gap:10 }}>

            {/* 탭 */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:3 }}>
              {TABS.map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                  padding:'12px 4px 8px', border:'1px solid',
                  borderColor: activeTab===t.id ? t.color : 'rgba(255,255,255,0.08)',
                  background: activeTab===t.id ? `${t.color}18` : 'rgba(255,255,255,0.02)',
                  color: activeTab===t.id ? t.color : 'rgba(255,255,255,0.25)',
                  cursor:'none', transition:'all 0.15s',
                  boxShadow: activeTab===t.id ? `0 0 12px ${t.color}33` : 'none',
                  fontFamily:'"Press Start 2P"',
                  display:'flex', flexDirection:'column', alignItems:'center', gap:4,
                }}>
                  <span style={{ fontSize:18 }}>{t.icon}</span>
                  <span style={{ fontSize:7 }}>{t.label}</span>
                </button>
              ))}
            </div>

            {/* 옵션 패널 */}
            <div style={{ background:'rgba(4,4,18,0.92)', border:`1px solid ${activeColor}33`,
              boxShadow:`0 0 24px ${activeColor}18`, padding:16, minHeight:320,
              position:'relative', overflow:'hidden', transition:'border-color 0.3s' }}>

              {/* 코너 장식 */}
              {[[0,0],[1,0],[0,1],[1,1]].map(([ri,ci],i) => (
                <div key={i} style={{ position:'absolute',
                  top: ri===0 ? 4 : 'auto', bottom: ri===1 ? 4 : 'auto',
                  left: ci===0 ? 4 : 'auto', right: ci===1 ? 4 : 'auto',
                  width:8, height:8,
                  borderTop: ri===0 ? `1px solid ${activeColor}88` : 'none',
                  borderBottom: ri===1 ? `1px solid ${activeColor}88` : 'none',
                  borderLeft: ci===0 ? `1px solid ${activeColor}88` : 'none',
                  borderRight: ci===1 ? `1px solid ${activeColor}88` : 'none',
                }} />
              ))}

              <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }}
                  exit={{ opacity:0, y:-6 }} transition={{ duration:0.12 }}>

                  {/* 몸통색 */}
                  {activeTab==='body' && (
                    <div>
                      <TabTitle color={activeColor}>BODY COLOR</TabTitle>
                      <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
                        {BODY_COLORS.map(c => (
                          <ColorRow key={c.id} color={c.color} label={c.label}
                            selected={bodyColor===c.color} activeColor={activeColor}
                            onClick={() => setBodyColor(c.color)} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 모자 */}
                  {activeTab==='hat' && (
                    <div>
                      <TabTitle color={activeColor}>HAT STYLE</TabTitle>
                      <div style={{ display:'flex', flexDirection:'column', gap:3, marginBottom:14 }}>
                        {HATS.map(h => (
                          <OptionRow key={h.id} label={h.label} desc={h.desc}
                            selected={hat===h.id} color={activeColor}
                            onClick={() => setHat(h.id)} />
                        ))}
                      </div>
                      {hat !== 'none' && (
                        <>
                          <TabTitle color={activeColor} small>HAT COLOR</TabTitle>
                          <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:5 }}>
                            {HAT_COLORS.map(c => (
                              <ColorSwatch key={c.id} color={c.color} label={c.label}
                                selected={hatColor===c.color}
                                onClick={() => setHatColor(c.color)} />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* 상의 */}
                  {activeTab==='top' && (
                    <div>
                      <TabTitle color={activeColor}>TOP COLOR</TabTitle>
                      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:4 }}>
                        {TOP_COLORS.map(c => (
                          <ColorRow key={c.id} color={c.color} label={c.label}
                            selected={topColor===c.color} activeColor={activeColor}
                            onClick={() => setTopColor(c.color)} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 하의 */}
                  {activeTab==='bottom' && (
                    <div>
                      <TabTitle color={activeColor}>BOTTOM COLOR</TabTitle>
                      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:4 }}>
                        {BOTTOM_COLORS.map(c => (
                          <ColorRow key={c.id} color={c.color} label={c.label}
                            selected={bottomColor===c.color} activeColor={activeColor}
                            onClick={() => setBottomColor(c.color)} />
                        ))}
                      </div>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ─ 중앙: 오리 프리뷰 ─ */}
          <motion.div initial={{ y:20, opacity:0 }} animate={{ y:0, opacity:1 }}
            transition={{ delay:0.08 }}
            style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14 }}>

            {/* 오리 프리뷰 박스 */}
            <div style={{ position:'relative', width:210, height:260,
              background:'rgba(4,4,18,0.85)', border:`1px solid ${activeColor}44`,
              display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow:`0 0 30px ${activeColor}18, inset 0 0 40px rgba(0,0,0,0.4)`,
              transition:'border-color 0.3s, box-shadow 0.3s', overflow:'hidden' }}>

              {/* 격자 바닥 */}
              <div style={{ position:'absolute', bottom:0, left:0, right:0, height:50,
                backgroundImage:`linear-gradient(${activeColor}15 1px,transparent 1px),linear-gradient(90deg,${activeColor}15 1px,transparent 1px)`,
                backgroundSize:'18px 18px',
                maskImage:'linear-gradient(transparent,rgba(0,0,0,0.5))',
                WebkitMaskImage:'linear-gradient(transparent,rgba(0,0,0,0.5))',
              }} />

              {/* 스포트라이트 */}
              <div style={{ position:'absolute', top:'35%', left:'50%',
                transform:'translate(-50%,-50%)', width:110, height:110,
                background:`radial-gradient(circle, ${activeColor}18 0%, transparent 70%)`,
                borderRadius:'50%', transition:'background 0.3s' }} />

              {/* 그림자 */}
              <div style={{ position:'absolute', bottom:18, left:'50%', transform:'translateX(-50%)',
                width:60, height:8, background:'rgba(0,0,0,0.5)',
                borderRadius:'50%', filter:'blur(4px)' }} />

              {/* 오리 */}
              <motion.div
                animate={{ y:[0,-3,0] }}
                transition={{ duration:2, repeat:Infinity, ease:'easeInOut' }}
                style={{ position:'relative', zIndex:2,
                  filter:'drop-shadow(0 6px 10px rgba(0,0,0,0.8))' }}>
                <PixelDuck
                  bodyColor={bodyColor} hat={hat} hatColor={hatColor}
                  topColor={topColor} bottomColor={bottomColor}
                  direction={1} scale={9} />
              </motion.div>

              {/* 코너 마킹 */}
              {[[0,0],[1,0],[0,1],[1,1]].map(([ri,ci],i) => (
                <div key={i} style={{ position:'absolute',
                  top: ri===0 ? 6 : 'auto', bottom: ri===1 ? 6 : 'auto',
                  left: ci===0 ? 6 : 'auto', right: ci===1 ? 6 : 'auto',
                  width:10, height:10,
                  borderTop: ri===0 ? `1px solid ${activeColor}88` : 'none',
                  borderBottom: ri===1 ? `1px solid ${activeColor}88` : 'none',
                  borderLeft: ci===0 ? `1px solid ${activeColor}88` : 'none',
                  borderRight: ci===1 ? `1px solid ${activeColor}88` : 'none',
                }} />
              ))}
            </div>

            {/* 현재 정보 */}
            <div style={{ background:'rgba(4,4,18,0.85)', border:`1px solid ${activeColor}33`,
              padding:'8px 16px', textAlign:'center', width:'100%',
              transition:'border-color 0.3s' }}>
              <div style={{ fontSize:7, color:'rgba(255,255,255,0.3)', marginBottom:4 }}>MY DUCK</div>
              <div style={{ fontSize:8, color:activeColor, transition:'color 0.3s' }}>
                {HATS.find(h=>h.id===hat)?.label || '민머리'} 오리
              </div>
            </div>

            {/* 입장 버튼 */}
            <motion.button onClick={handleEnter}
              whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
              style={{ cursor:'none', background:'none', border:'none', padding:0, width:'100%' }}>
              <motion.div
                animate={{ borderColor:['#ffffff66','#ffffff','#ffffff66'],
                  boxShadow:['0 0 8px #f0d06033','0 0 20px #f0d06077','0 0 8px #f0d06033'] }}
                transition={{ duration:2, repeat:Infinity }}
                style={{ padding:'14px 0', fontSize:9, color:'#f0d060',
                  background:'rgba(0,0,0,0.8)', border:'2px solid',
                  fontFamily:'"Press Start 2P"', letterSpacing:'0.08em',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  gap:10, width:'100%' }}>
                <span>🦆 서울로 입장</span>
                <motion.span animate={{ x:[0,4,0] }} transition={{ duration:1.2, repeat:Infinity }}>►</motion.span>
              </motion.div>
            </motion.button>
          </motion.div>

          {/* ─ 오른쪽: 설정 요약 ─ */}
          <motion.div initial={{ x:30, opacity:0 }} animate={{ x:0, opacity:1 }}
            transition={{ delay:0.12 }}
            style={{ flex:'0 0 190px', minWidth:170,
              background:'rgba(4,4,18,0.85)', border:`1px solid ${activeColor}22`,
              padding:14, transition:'border-color 0.3s' }}>

            <div style={{ fontSize:8, color:activeColor, marginBottom:12, paddingBottom:8,
              borderBottom:`1px solid ${activeColor}33`, letterSpacing:'0.1em',
              transition:'color 0.3s' }}>
              ▌ 내 오리
            </div>

            {[
              { label:'모자', value: HATS.find(h=>h.id===hat)?.label || '없음' },
              { label:'상의', value: TOP_COLORS.find(c=>c.color===topColor)?.label || topColor },
              { label:'하의', value: BOTTOM_COLORS.find(c=>c.color===bottomColor)?.label || bottomColor },
              { label:'몸통', value: BODY_COLORS.find(c=>c.color===bodyColor)?.label || bodyColor },
            ].map(item => (
              <div key={item.label} style={{ display:'flex', justifyContent:'space-between',
                padding:'5px 0', borderBottom:'1px solid rgba(255,255,255,0.04)', gap:8 }}>
                <span style={{ fontSize:7, color:'rgba(255,255,255,0.3)', flexShrink:0 }}>{item.label}</span>
                <span style={{ fontSize:7, color:'rgba(255,255,255,0.75)', textAlign:'right' }}>{item.value}</span>
              </div>
            ))}

            {/* 컬러 미리보기 */}
            <div style={{ marginTop:12, display:'flex', gap:4 }}>
              {[bodyColor, topColor, bottomColor, hatColor].map((c,i) => (
                <div key={i} style={{ flex:1, height:16, background:c,
                  border:'1px solid rgba(255,255,255,0.2)' }} />
              ))}
            </div>

            <div style={{ marginTop:14, fontSize:7, color:'rgba(255,255,255,0.12)',
              lineHeight:2.2, borderTop:'1px solid rgba(255,255,255,0.05)', paddingTop:10 }}>
              <div>▸ 탭 눌러서 변경</div>
              <div>▸ 실시간 미리보기</div>
              <div style={{ marginTop:4, color:'rgba(255,255,255,0.08)' }}>
                DUCK v1.0
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 전환 오버레이 */}
      <AnimatePresence>
        {isExiting && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
            transition={{ duration:0.6 }}
            style={{ position:'fixed', inset:0, zIndex:50, background:'#000',
              display:'flex', alignItems:'center', justifyContent:'center' }}>
            <motion.div initial={{ scale:0.8, opacity:0 }} animate={{ scale:1, opacity:1 }}
              transition={{ delay:0.15 }}>
              <div style={{ fontSize:9, color:'#f0d060', letterSpacing:'0.2em',
                fontFamily:'"Press Start 2P"', textShadow:'0 0 20px #f0d060' }}>
                🦆 ENTERING SEOUL...
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── 서브 컴포넌트 ─────────────────────────────────────────────────────
function TabTitle({ children, color, small=false }: { children:string; color:string; small?:boolean }) {
  return (
    <div style={{ fontSize: small ? 7 : 8, color, marginBottom: small ? 6 : 10,
      borderBottom: small ? 'none' : `1px solid ${color}33`, paddingBottom: small ? 0 : 7,
      letterSpacing:'0.12em', fontFamily:'"Press Start 2P"',
      textShadow:`0 0 6px ${color}66`, transition:'color 0.3s' }}>
      {children}
    </div>
  );
}

function OptionRow({ label, desc, selected, color, onClick }:
  { label:string; desc:string; selected:boolean; color:string; onClick:()=>void }) {
  return (
    <button onClick={onClick} style={{
      width:'100%', padding:'7px 10px', textAlign:'left',
      borderLeft:`3px solid ${selected ? color : 'transparent'}`,
      background: selected ? `${color}14` : 'transparent',
      cursor:'none', transition:'all 0.1s', display:'flex',
      justifyContent:'space-between', alignItems:'center', border:'none',
      fontFamily:'"Press Start 2P"',
    }}>
      <span style={{ fontSize:9, color: selected ? '#fff' : 'rgba(255,255,255,0.5)' }}>{label}</span>
      <span style={{ fontSize:7, color: selected ? `${color}cc` : 'rgba(255,255,255,0.2)', marginLeft:6, flexShrink:0 }}>{desc}</span>
    </button>
  );
}

function ColorRow({ color, label, selected, activeColor, onClick }:
  { color:string; label:string; selected:boolean; activeColor:string; onClick:()=>void }) {
  return (
    <button onClick={onClick} style={{
      width:'100%', padding:'8px 10px', textAlign:'left', cursor:'none',
      background: selected ? `${activeColor}14` : 'transparent',
      border:`1px solid ${selected ? activeColor : 'transparent'}`,
      display:'flex', alignItems:'center', gap:8, fontFamily:'"Press Start 2P"',
      transition:'all 0.1s',
    }}>
      <div style={{ width:14, height:14, background:color, flexShrink:0,
        border: selected ? '2px solid #fff' : '1px solid rgba(255,255,255,0.2)',
        boxShadow: selected ? `0 0 6px ${color}` : 'none' }} />
      <span style={{ fontSize:7, color: selected ? '#fff' : 'rgba(255,255,255,0.5)' }}>{label}</span>
    </button>
  );
}

function ColorSwatch({ color, label, selected, onClick }:
  { color:string; label:string; selected:boolean; onClick:()=>void }) {
  return (
    <button onClick={onClick} title={label} style={{
      width:'100%', aspectRatio:'1', background:color, cursor:'none',
      border: selected ? '2px solid #fff' : '2px solid transparent',
      transform: selected ? 'scale(1.15)' : 'scale(1)',
      boxShadow: selected ? `0 0 8px ${color}` : 'none',
      transition:'all 0.1s',
    }} />
  );
}
