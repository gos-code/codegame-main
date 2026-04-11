// @ts-nocheck
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PixelCity } from '../PixelCity';
import { useNavigate } from 'react-router';
import { PixelCharacter } from '../PixelCharacter';

// ── 데이터 ───────────────────────────────────────────────────────────────────
const OUTFIT_MALE = [
  { id:'HOODIE',   label:'후드티',      desc:'스트리트 기본' },
  { id:'TSHIRT',   label:'반팔 티셔츠', desc:'가장 기본형' },
  { id:'LONGTEE',  label:'긴팔 티셔츠', desc:'캐주얼' },
  { id:'JACKET',   label:'재킷',        desc:'도시적/쿨한 느낌' },
  { id:'CARDIGAN', label:'가디건',      desc:'부드럽고 차분한' },
  { id:'SCHOOL_M', label:'교복 상의',   desc:'학원물 느낌' },
  { id:'SUIT',     label:'정장 상의',   desc:'직장인/엘리트' },
  { id:'SPORT',    label:'운동복 상의', desc:'활동적인 캐릭터' },
  { id:'TECHWEAR', label:'테크웨어',    desc:'사이버펑크' },
  { id:'VEST',     label:'조끼',        desc:'RPG 느낌' },
  { id:'JUMPER',   label:'점프수트',    desc:'정비공/기술자' },
];
const OUTFIT_FEM = [
  { id:'HOODIE_F',   label:'후드티',        desc:'캐주얼/학생형' },
  { id:'BLOUSE',     label:'블라우스',      desc:'단정하고 여성스러운' },
  { id:'KNIT',       label:'니트',          desc:'포근한 분위기' },
  { id:'CROP',       label:'반팔 티셔츠',   desc:'가장 기본형' },
  { id:'ONEPIECE',   label:'원피스',        desc:'실루엣 차별화' },
  { id:'SCHOOL_F',   label:'교복 상의',     desc:'학교물 적합' },
  { id:'SUIT_F',     label:'정장 상의',     desc:'오피스/성숙형' },
  { id:'SPORT_F',    label:'운동복 상의',   desc:'활발한 캐릭터' },
  { id:'TECHWEAR_F', label:'테크웨어',      desc:'사이버펑크' },
  { id:'FANTASY',    label:'판타지 드레스', desc:'특별 코스튬' },
];
const BOTTOM_MALE = [
  { id:'CARGO',    label:'카고 팬츠', desc:'스트리트' },
  { id:'JEANS',    label:'청바지',    desc:'기본' },
  { id:'SLACKS',   label:'슬랙스',    desc:'단정/커리어형' },
  { id:'SHORTS',   label:'반바지',    desc:'캐주얼' },
  { id:'JOGGER',   label:'조거 팬츠', desc:'활동적' },
  { id:'SCHOOL_B', label:'교복 바지', desc:'학교' },
];
const BOTTOM_FEM = [
  { id:'LONGSKIRT', label:'롱스커트',  desc:'차분한 느낌' },
  { id:'MINISKIRT', label:'미니스커트',desc:'가볍고 귀여운' },
  { id:'JEANS_F',   label:'청바지',    desc:'기본' },
  { id:'LEGGINGS',  label:'레깅스',    desc:'활동성 강조' },
  { id:'SCHOOL_BF', label:'교복 치마', desc:'교복 세트용' },
  { id:'SHORTS_F',  label:'숏팬츠',    desc:'발랄함' },
];
const HAIR_MALE = [
  { id:'SHORTCUT',  label:'숏컷',           desc:'가장 기본형' },
  { id:'BANGSHORT', label:'앞머리 내린 숏컷', desc:'귀엽고 부드러운' },
  { id:'TWOBLOCK',  label:'투블럭',          desc:'현대적/깔끔' },
  { id:'ALLBACK',   label:'올백',            desc:'성숙하고 자신감' },
  { id:'SPIKY',     label:'스파이키',        desc:'활발하고 장난기' },
  { id:'MIDIUM',    label:'약간 긴 미디엄',  desc:'차분한 느낌' },
  { id:'CURLY',     label:'곱슬머리',        desc:'개성 강조' },
  { id:'DANDY',     label:'댄디컷',          desc:'호감형 기본 스타일' },
  { id:'LONG_M',    label:'장발',            desc:'유니크/서브컬처' },
  { id:'BEANIE',    label:'비니',            desc:'스트리트 포인트' },
];
const HAIR_FEM = [
  { id:'SHORTCUT_F', label:'숏컷',          desc:'깔끔하고 당찬' },
  { id:'BOBCUT',     label:'단발',           desc:'기본형으로 매우 좋음' },
  { id:'BANGBOB',    label:'앞머리 단발',    desc:'귀엽고 친근한' },
  { id:'MIDBOB',     label:'중단발',         desc:'무난하고 활용도 높음' },
  { id:'LONGHAIR',   label:'롱헤어',         desc:'가장 대중적' },
  { id:'WAVELONG',   label:'웨이브 롱헤어',  desc:'우아한 느낌' },
  { id:'PONYTAIL',   label:'포니테일',       desc:'활동적이고 시원한' },
  { id:'TWINTAIL',   label:'양갈래',         desc:'귀엽고 개성있는' },
  { id:'UPDO',       label:'번헤어/올림머리', desc:'단정하고 성숙한' },
  { id:'CURLYBOB',   label:'곱슬 단발/롱',   desc:'독특한 개성' },
];
const SHOES_MALE = [
  { id:'SNEAKER',  label:'기본 운동화',    desc:'가장 무난' },
  { id:'HIGHTOP',  label:'하이탑 스니커즈', desc:'스트리트 느낌' },
  { id:'LOAFER',   label:'로퍼',           desc:'단정한 캐주얼' },
  { id:'OXFORD',   label:'구두',           desc:'정장용' },
  { id:'BOOTS',    label:'부츠',           desc:'모험가/판타지형' },
  { id:'SANDAL',   label:'샌들',           desc:'여름/가벼운' },
];
const SHOES_FEM = [
  { id:'SNEAKER_F',  label:'기본 운동화', desc:'범용성 최고' },
  { id:'FLAT',       label:'플랫슈즈',    desc:'단정하고 귀여움' },
  { id:'LOAFER_F',   label:'로퍼',        desc:'교복/캐주얼에 적합' },
  { id:'ANKLEBOOT',  label:'앵클부츠',    desc:'스타일 강조' },
  { id:'LONGBOOT',   label:'롱부츠',      desc:'겨울/패션형' },
  { id:'HEELS',      label:'구두',        desc:'정장/성숙형' },
];
const SKIN_TONES = [
  { id:'SK01', color:'#FDEBD0', label:'화이트' },
  { id:'SK02', color:'#EFC4A8', label:'살색' },
  { id:'SK03', color:'#D4A843', label:'노란색' },
  { id:'SK04', color:'#8B5E3C', label:'갈색' },
  { id:'SK05', color:'#3B1A0A', label:'검정색' },
];
const HAIR_COLORS = [
  { id:'HC01', color:'#1a1a1a', label:'검정' },
  { id:'HC02', color:'#3d2b1f', label:'진한 갈색' },
  { id:'HC03', color:'#8B5E3C', label:'밝은 갈색' },
  { id:'HC04', color:'#D4A843', label:'금발' },
  { id:'HC05', color:'#cc3311', label:'레드' },
  { id:'HC06', color:'#ff6699', label:'핑크/브라운' },
  { id:'HC07', color:'#bbbbbb', label:'은색' },
  { id:'HC08', color:'#2255cc', label:'네이비' },
  { id:'HC09', color:'#ff88cc', label:'핑크' },
  { id:'HC10', color:'#441188', label:'보라' },
  { id:'HC11', color:'#00aaff', label:'블루' },
  { id:'HC12', color:'#22bb66', label:'그린' },
];

// ── 탭 ───────────────────────────────────────────────────────────────────────
const TABS = [
  { id:'성별', icon:'♀♂', color:'#ff66aa' },
  { id:'상의', icon:'👕', color:'#cc44ff' },
  { id:'하의', icon:'👖', color:'#8866ff' },
  { id:'헤어', icon:'✂', color:'#00ddff' },
  { id:'신발', icon:'👟', color:'#ffcc00' },
  { id:'피부', icon:'◉', color:'#ffaa55' },
] as const;
type TabId = typeof TABS[number]['id'];

// ── 픽셀 커서 ────────────────────────────────────────────────────────────────
function PixelCursor({ x, y }: { x:number; y:number }) {
  return (
    <div style={{ position:'fixed', left:x, top:y, pointerEvents:'none', zIndex:9999, transform:'translate(-1px,-1px)' }}>
      <svg width="16" height="16" viewBox="0 0 8 8" style={{ imageRendering:'pixelated' }}>
        <rect x="0" y="0" width="1" height="6" fill="#00ffcc"/>
        <rect x="1" y="1" width="1" height="1" fill="#00ffcc"/>
        <rect x="2" y="2" width="1" height="1" fill="#00ffcc"/>
        <rect x="3" y="3" width="1" height="1" fill="#00ffcc"/>
        <rect x="0" y="0" width="1" height="1" fill="#fff"/>
      </svg>
    </div>
  );
}

export function CharacterCustomization() {
  // 배경 강제 검정
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

  const [gender, setGender]       = useState<'남자'|'여자'>('남자');
  const [outfit, setOutfit]       = useState('HOODIE');
  const [bottom, setBottom]       = useState('CARGO');
  const [hair, setHair]           = useState('TWOBLOCK');
  const [shoes, setShoes]         = useState('SNEAKER');
  const [skin, setSkin]           = useState('#EFC4A8');
  const [hairColor, setHairColor] = useState('#1a1a1a');
  const [activeTab, setActiveTab] = useState<TabId>('성별');
  const [isExiting, setIsExiting] = useState(false);
  const [cursor, setCursor]       = useState({ x:-100, y:-100 });
  const navigate = useNavigate();

  useEffect(() => {
    const move = (e: MouseEvent) => setCursor({ x:e.clientX, y:e.clientY });
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  useEffect(() => {
    if (gender === '남자') { setOutfit('HOODIE'); setBottom('CARGO'); setHair('TWOBLOCK'); setShoes('SNEAKER'); }
    else { setOutfit('HOODIE_F'); setBottom('JEANS_F'); setHair('MIDBOB'); setShoes('SNEAKER_F'); }
  }, [gender]);

  const outfits  = gender === '남자' ? OUTFIT_MALE : OUTFIT_FEM;
  const bottoms  = gender === '남자' ? BOTTOM_MALE : BOTTOM_FEM;
  const hairs    = gender === '남자' ? HAIR_MALE   : HAIR_FEM;
  const shoeList = gender === '남자' ? SHOES_MALE  : SHOES_FEM;

  const handleEnter = () => {
    setIsExiting(true);
    const char = { gender, outfit, bottom, hair, shoes, skin, hairColor };
    localStorage.setItem('cg_character', JSON.stringify(char));
    setTimeout(() => navigate('/dev-garden/city', { state: { character: char } }), 700);
  };

  const charStyle  = outfit.includes('SCHOOL') ? 'SCHOOL' : outfit.includes('TECH') ? 'TECHWEAR' : outfit.includes('SUIT') ? 'VINTAGE' : 'STREETWEAR';
  const charGender = gender === '남자' ? 'MASC' : 'FEM';
  const charHair   = hair.includes('LONG') || hair.includes('WAVE') || hair.includes('PONY') ? 'LONG' : hair.includes('BEANIE') ? 'BEANIE' : hair.includes('SPIKY') ? 'SPIKY' : 'SHORT';
  const activeColor = TABS.find(t => t.id === activeTab)?.color || '#00ffcc';

  return (
    <div style={{ position:'relative', width:'100%', minHeight:'100vh', background:'#02020f',
      overflow:'hidden', color:'#fff', cursor:'none', userSelect:'none',
      fontFamily:'"Press Start 2P", monospace' }}>

      <PixelCursor x={cursor.x} y={cursor.y} />

      {/* 배경 도시 */}
      <div style={{ position:'absolute', inset:0, opacity:0.15, filter:'blur(3px)', pointerEvents:'none' }}>
        <PixelCity />
      </div>

      {/* 그라디언트 오버레이 */}
      <div style={{ position:'absolute', inset:0, zIndex:1, pointerEvents:'none',
        background:'linear-gradient(to bottom, rgba(2,2,15,0.7) 0%, rgba(2,2,15,0.5) 50%, rgba(2,2,15,0.85) 100%)' }} />

      {/* 수평선 장식 */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:2, zIndex:2,
        background:`linear-gradient(90deg, transparent 0%, ${activeColor}88 30%, ${activeColor} 50%, ${activeColor}88 70%, transparent 100%)`,
        transition:'background 0.3s' }} />
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:1, zIndex:2,
        background:`linear-gradient(90deg, transparent, ${activeColor}44, transparent)` }} />

      {/* 스캔라인 */}
      <div style={{ position:'absolute', inset:0, zIndex:2, pointerEvents:'none', opacity:0.25,
        backgroundImage:'linear-gradient(transparent 50%, rgba(0,0,0,0.4) 50%)',
        backgroundSize:'100% 4px' }} />

      {/* ── 메인 컨텐츠 ── */}
      <div style={{ position:'relative', zIndex:3, display:'flex', flexDirection:'column',
        alignItems:'center', minHeight:'100vh', padding:'20px 12px 32px' }}>

        {/* ── 헤더 ── */}
        <motion.div initial={{ y:-30, opacity:0 }} animate={{ y:0, opacity:1 }}
          style={{ textAlign:'center', marginBottom:24, width:'100%', maxWidth:900 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:12, marginBottom:6 }}>
            <div style={{ height:1, flex:1, background:`linear-gradient(90deg,transparent,${activeColor}66)` }} />
            <h1 style={{ fontSize:'clamp(11px,1.8vw,18px)', color:activeColor, letterSpacing:'0.2em', margin:0,
              textShadow:`0 0 20px ${activeColor}66`, transition:'color 0.3s, text-shadow 0.3s' }}>
              나의 서울 시민 만들기
            </h1>
            <div style={{ height:1, flex:1, background:`linear-gradient(90deg,${activeColor}66,transparent)` }} />
          </div>
          <p style={{ fontSize:8, color:'rgba(255,255,255,0.25)', margin:0, letterSpacing:'0.15em' }}>
            SEOUL CITIZEN CREATOR · DEV GARDEN
          </p>
        </motion.div>

        {/* ── 본문 3열 레이아웃 ── */}
        <div style={{ display:'flex', gap:16, width:'100%', maxWidth:980,
          alignItems:'flex-start', justifyContent:'center', flexWrap:'wrap', flex:1 }}>

          {/* ─ 왼쪽: 탭 + 옵션 ─ */}
          <motion.div initial={{ x:-30, opacity:0 }} animate={{ x:0, opacity:1 }}
            style={{ flex:'0 0 270px', minWidth:220, display:'flex', flexDirection:'column', gap:8 }}>

            {/* 탭 버튼 */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:3 }}>
              {TABS.map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                  padding:'8px 4px 6px', border:'1px solid',
                  borderColor: activeTab===t.id ? t.color : 'rgba(255,255,255,0.08)',
                  background: activeTab===t.id ? `${t.color}18` : 'rgba(255,255,255,0.02)',
                  color: activeTab===t.id ? t.color : 'rgba(255,255,255,0.25)',
                  cursor:'none', transition:'all 0.15s',
                  boxShadow: activeTab===t.id ? `0 0 12px ${t.color}33, inset 0 0 8px ${t.color}11` : 'none',
                  fontFamily:'"Press Start 2P"', display:'flex', flexDirection:'column',
                  alignItems:'center', gap:4,
                }}>
                  <span style={{ fontSize:12 }}>{t.icon}</span>
                  <span style={{ fontSize:7 }}>{t.id}</span>
                </button>
              ))}
            </div>

            {/* 옵션 패널 */}
            <div style={{
              background:'rgba(4,4,18,0.92)', border:`1px solid ${activeColor}33`,
              boxShadow:`0 0 24px ${activeColor}18, inset 0 0 20px rgba(0,0,0,0.4)`,
              padding:14, transition:'border-color 0.3s, box-shadow 0.3s', minHeight:320,
              position:'relative', overflow:'hidden',
            }}>
              {/* 코너 장식 */}
              {[['0%','0%'],['100%','0%'],['0%','100%'],['100%','100%']].map(([l,t],i) => (
                <div key={i} style={{ position:'absolute', left:l, top:t, width:6, height:6,
                  borderTop: i<2 ? `2px solid ${activeColor}88` : 'none',
                  borderBottom: i>=2 ? `2px solid ${activeColor}88` : 'none',
                  borderLeft: i%2===0 ? `2px solid ${activeColor}88` : 'none',
                  borderRight: i%2===1 ? `2px solid ${activeColor}88` : 'none',
                  transform: i===0?'none':i===1?'none':i===2?'none':'none',
                }} />
              ))}

              <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                  exit={{ opacity:0, y:-8 }} transition={{ duration:0.15 }}>

                  {/* ── 성별 ── */}
                  {activeTab==='성별' && (
                    <div>
                      <TabTitle color={activeColor}>GENDER</TabTitle>
                      <div style={{ display:'flex', gap:8, marginBottom:20 }}>
                        {(['남자','여자'] as const).map(g => (
                          <button key={g} onClick={() => setGender(g)} style={{
                            flex:1, padding:'18px 8px', fontSize:10, fontFamily:'"Press Start 2P"',
                            border:`2px solid ${gender===g ? activeColor : 'rgba(255,255,255,0.1)'}`,
                            background: gender===g ? `${activeColor}22` : 'transparent',
                            color: gender===g ? activeColor : 'rgba(255,255,255,0.3)',
                            cursor:'none', transition:'all 0.2s',
                            boxShadow: gender===g ? `0 0 16px ${activeColor}44` : 'none',
                          }}>
                            {g === '남자' ? '♂  남자' : '♀  여자'}
                          </button>
                        ))}
                      </div>
                      <div style={{ fontSize:7, color:'rgba(255,255,255,0.2)', lineHeight:2.2,
                        borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:12 }}>
                        <div>▸ 성별 선택 시 옷/헤어 옵션이 변경돼요</div>
                        <div>▸ 피부색은 남녀 공통 팔레트입니다</div>
                      </div>
                    </div>
                  )}

                  {/* ── 상의 ── */}
                  {activeTab==='상의' && (
                    <div>
                      <TabTitle color={activeColor}>OUTFIT TOP</TabTitle>
                      <div style={{ display:'flex', flexDirection:'column', gap:2, maxHeight:290, overflowY:'auto',
                        scrollbarWidth:'thin', scrollbarColor:`${activeColor}44 transparent` }}>
                        {outfits.map(o => <OptionRow key={o.id} {...o} selected={outfit===o.id} color={activeColor} onClick={() => setOutfit(o.id)} />)}
                      </div>
                    </div>
                  )}

                  {/* ── 하의 ── */}
                  {activeTab==='하의' && (
                    <div>
                      <TabTitle color={activeColor}>OUTFIT BOTTOM</TabTitle>
                      <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
                        {bottoms.map(b => <OptionRow key={b.id} {...b} selected={bottom===b.id} color={activeColor} onClick={() => setBottom(b.id)} />)}
                      </div>
                    </div>
                  )}

                  {/* ── 헤어 ── */}
                  {activeTab==='헤어' && (
                    <div>
                      <TabTitle color={activeColor}>HAIR STYLE</TabTitle>
                      <div style={{ display:'flex', flexDirection:'column', gap:2, maxHeight:180, overflowY:'auto', marginBottom:14,
                        scrollbarWidth:'thin', scrollbarColor:`${activeColor}44 transparent` }}>
                        {hairs.map(h => <OptionRow key={h.id} {...h} selected={hair===h.id} color={activeColor} onClick={() => setHair(h.id)} />)}
                      </div>
                      <TabTitle color={activeColor} small>HAIR COLOR</TabTitle>
                      <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:5 }}>
                        {HAIR_COLORS.map(c => (
                          <button key={c.id} onClick={() => setHairColor(c.color)} title={c.label} style={{
                            width:'100%', aspectRatio:'1', background:c.color, cursor:'none',
                            border: hairColor===c.color ? '2px solid #fff' : '2px solid transparent',
                            transform: hairColor===c.color ? 'scale(1.2)' : 'scale(1)',
                            boxShadow: hairColor===c.color ? `0 0 8px ${c.color}` : 'none',
                            transition:'all 0.1s',
                          }} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── 신발 ── */}
                  {activeTab==='신발' && (
                    <div>
                      <TabTitle color={activeColor}>SHOES</TabTitle>
                      <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
                        {shoeList.map(s => <OptionRow key={s.id} {...s} selected={shoes===s.id} color={activeColor} onClick={() => setShoes(s.id)} />)}
                      </div>
                    </div>
                  )}

                  {/* ── 피부 ── */}
                  {activeTab==='피부' && (
                    <div>
                      <TabTitle color={activeColor}>SKIN TONE</TabTitle>
                      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:8, marginBottom:12 }}>
                        {SKIN_TONES.map(s => (
                          <button key={s.id} onClick={() => setSkin(s.color)} title={s.label} style={{
                            width:'100%', aspectRatio:'1', background:s.color, cursor:'none',
                            border: skin===s.color ? '2px solid #fff' : '2px solid rgba(255,255,255,0.15)',
                            transform: skin===s.color ? 'scale(1.15)' : 'scale(1)',
                            boxShadow: skin===s.color ? '0 0 10px rgba(255,255,255,0.5)' : 'none',
                            transition:'all 0.12s',
                          }} />
                        ))}
                      </div>
                      <div style={{ fontSize:7, color:'rgba(255,255,255,0.2)', lineHeight:2 }}>
                        <div>▸ 남녀 공통 팔레트 · 8단계</div>
                        <div>▸ 픽셀아트 최적화 색상</div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ─ 중앙: 캐릭터 + 입장 버튼 ─ */}
          <motion.div initial={{ y:20, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ delay:0.08 }}
            style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14, minWidth:180 }}>

            {/* 캐릭터 프리뷰 박스 */}
            <div style={{ position:'relative', width:200, height:280,
              background:'rgba(4,4,18,0.85)', border:`1px solid ${activeColor}44`,
              display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow:`0 0 30px ${activeColor}18, inset 0 0 40px rgba(0,0,0,0.5)`,
              transition:'border-color 0.3s, box-shadow 0.3s',
              overflow:'hidden',
            }}>
              {/* 격자 바닥 */}
              <div style={{ position:'absolute', bottom:0, left:0, right:0, height:60,
                backgroundImage:`linear-gradient(${activeColor}18 1px,transparent 1px),linear-gradient(90deg,${activeColor}18 1px,transparent 1px)`,
                backgroundSize:'20px 20px',
                maskImage:'linear-gradient(transparent,rgba(0,0,0,0.6))',
                WebkitMaskImage:'linear-gradient(transparent,rgba(0,0,0,0.6))',
              }} />
              {/* 스포트라이트 */}
              <div style={{ position:'absolute', top:'40%', left:'50%',
                transform:'translate(-50%,-50%)', width:120, height:120,
                background:`radial-gradient(circle, ${activeColor}18 0%, transparent 70%)`,
                borderRadius:'50%', transition:'background 0.3s' }} />
              {/* 그림자 */}
              <div style={{ position:'absolute', bottom:20, left:'50%', transform:'translateX(-50%)',
                width:70, height:10, background:'rgba(0,0,0,0.5)',
                borderRadius:'50%', filter:'blur(5px)' }} />
              {/* 캐릭터 */}
              <div style={{ position:'relative', zIndex:2, filter:'drop-shadow(0 6px 12px rgba(0,0,0,0.9))' }}>
                <PixelCharacter
                  outfit={outfit} bottom={bottom}
                  style={charStyle} hair={charHair}
                  hairColor={hairColor} gender={charGender} skin={skin} scale={8} />
              </div>
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

            {/* 현재 설정 미니 정보 */}
            <div style={{ background:'rgba(4,4,18,0.85)', border:`1px solid ${activeColor}33`,
              padding:'8px 16px', textAlign:'center', width:'100%',
              transition:'border-color 0.3s' }}>
              <div style={{ fontSize:7, color:'rgba(255,255,255,0.3)', marginBottom:5, letterSpacing:'0.1em' }}>CURRENT LOOK</div>
              <div style={{ fontSize:8, color:activeColor, marginBottom:2, transition:'color 0.3s' }}>
                {gender} · {outfits.find(o=>o.id===outfit)?.label || outfit}
              </div>
              <div style={{ fontSize:7, color:'rgba(255,255,255,0.4)' }}>
                {hairs.find(h=>h.id===hair)?.label || hair}
              </div>
              <div style={{ display:'flex', justifyContent:'center', gap:6, marginTop:8 }}>
                <ColorDot color={skin} label="피부" />
                <ColorDot color={hairColor} label="헤어" />
              </div>
            </div>

            {/* 입장 버튼 */}
            <motion.button onClick={handleEnter}
              whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
              style={{ cursor:'none', background:'none', border:'none', padding:0, width:'100%' }}>
              <motion.div
                animate={{ borderColor:['#ffffff88','#ffffff','#ffffff88'],
                  boxShadow:['0 0 8px #ffcc0033','0 0 20px #ffcc0077','0 0 8px #ffcc0033'] }}
                transition={{ duration:2, repeat:Infinity }}
                style={{ padding:'14px 0', fontSize:10, color:'#ffcc00',
                  background:'rgba(0,0,0,0.8)', border:'2px solid',
                  fontFamily:'"Press Start 2P"', letterSpacing:'0.08em',
                  display:'flex', alignItems:'center', justifyContent:'center', gap:12,
                  width:'100%', textAlign:'center' }}>
                <span>서울로 입장</span>
                <motion.span animate={{ x:[0,4,0] }} transition={{ duration:1.2, repeat:Infinity }}>►</motion.span>
              </motion.div>
            </motion.button>
          </motion.div>

          {/* ─ 오른쪽: 설정 요약 ─ */}
          <motion.div initial={{ x:30, opacity:0 }} animate={{ x:0, opacity:1 }} transition={{ delay:0.12 }}
            style={{ flex:'0 0 185px', minWidth:160,
              background:'rgba(4,4,18,0.85)', border:`1px solid ${activeColor}22`,
              padding:14, display:'flex', flexDirection:'column', gap:0,
              transition:'border-color 0.3s' }}>

            <div style={{ fontSize:8, color:activeColor, marginBottom:12, paddingBottom:8,
              borderBottom:`1px solid ${activeColor}33`, letterSpacing:'0.1em',
              transition:'color 0.3s, border-color 0.3s' }}>
              ▌ 현재 설정
            </div>

            {[
              { label:'성별', value: gender },
              { label:'상의', value: outfits.find(o=>o.id===outfit)?.label || outfit },
              { label:'하의', value: bottoms.find(b=>b.id===bottom)?.label || bottom },
              { label:'헤어', value: hairs.find(h=>h.id===hair)?.label || hair },
              { label:'신발', value: shoeList.find(s=>s.id===shoes)?.label || shoes },
            ].map(item => (
              <div key={item.label} style={{ display:'flex', justifyContent:'space-between',
                padding:'6px 0', borderBottom:'1px solid rgba(255,255,255,0.04)', gap:8 }}>
                <span style={{ fontSize:7, color:'rgba(255,255,255,0.3)', flexShrink:0 }}>{item.label}</span>
                <span style={{ fontSize:7, color:'rgba(255,255,255,0.75)', textAlign:'right', wordBreak:'keep-all', lineHeight:1.6 }}>
                  {item.value}
                </span>
              </div>
            ))}

            {/* 컬러 팔레트 미리보기 */}
            <div style={{ marginTop:12, display:'flex', gap:6 }}>
              <ColorBlock color={skin} label="피부" />
              <ColorBlock color={hairColor} label="헤어" />
            </div>

            {/* 팁 */}
            <div style={{ marginTop:16, fontSize:7, color:'rgba(255,255,255,0.15)', lineHeight:2.2,
              borderTop:'1px solid rgba(255,255,255,0.05)', paddingTop:12 }}>
              <div>▸ 탭을 눌러 각 항목 변경</div>
              <div>▸ 선택 즉시 미리보기 반영</div>
              <div style={{ marginTop:6, color:'rgba(255,255,255,0.1)' }}>
                v1.0 · SEOUL PIXEL ART
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
              transition={{ delay:0.1 }}>
              <div style={{ fontSize:10, color:'#00ffcc', letterSpacing:'0.2em',
                fontFamily:'"Press Start 2P"', textShadow:'0 0 20px #00ffcc' }}>
                LOADING SEOUL...
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── 서브 컴포넌트 ─────────────────────────────────────────────────────────────
function TabTitle({ children, color, small=false }:{ children:string; color:string; small?:boolean }) {
  return (
    <div style={{ fontSize: small ? 7 : 8, color, marginBottom: small ? 8 : 10,
      borderBottom: small ? 'none' : `1px solid ${color}33`, paddingBottom: small ? 0 : 8,
      letterSpacing:'0.12em', fontFamily:'"Press Start 2P"',
      textShadow:`0 0 8px ${color}66`, transition:'color 0.3s' }}>
      {children}
    </div>
  );
}

function OptionRow({ label, desc, selected, color, onClick }:
  { label:string; desc:string; selected:boolean; color:string; onClick:()=>void }) {
  return (
    <button onClick={onClick} style={{
      width:'100%', padding:'8px 10px', textAlign:'left',
      borderLeft: `3px solid ${selected ? color : 'transparent'}`,
      background: selected ? `${color}14` : 'transparent',
      cursor:'none', transition:'all 0.1s',
      display:'flex', justifyContent:'space-between', alignItems:'center',
      border:'none', borderLeft: `3px solid ${selected ? color : 'transparent'}`,
      fontFamily:'"Press Start 2P"',
    }}>
      <span style={{ fontSize:8, color: selected ? '#fff' : 'rgba(255,255,255,0.45)' }}>{label}</span>
      <span style={{ fontSize:6, color: selected ? `${color}cc` : 'rgba(255,255,255,0.15)',
        marginLeft:6, flexShrink:0 }}>{desc}</span>
    </button>
  );
}

function ColorDot({ color, label }:{ color:string; label:string }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:4 }}>
      <div style={{ width:10, height:10, background:color,
        border:'1px solid rgba(255,255,255,0.3)' }} />
      <span style={{ fontSize:6, color:'rgba(255,255,255,0.3)', fontFamily:'"Press Start 2P"' }}>{label}</span>
    </div>
  );
}

function ColorBlock({ color, label }:{ color:string; label:string }) {
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', gap:4 }}>
      <div style={{ height:20, background:color, border:'1px solid rgba(255,255,255,0.2)' }} />
      <div style={{ fontSize:6, color:'rgba(255,255,255,0.25)', fontFamily:'"Press Start 2P"',
        textAlign:'center' }}>{label}</div>
    </div>
  );
}
