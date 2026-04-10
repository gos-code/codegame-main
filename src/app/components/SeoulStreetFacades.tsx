// @ts-nocheck
import React from 'react';
import { motion } from 'motion/react';

// ── 공통 서브 컴포넌트 ────────────────────────────────────────────────

function BuildingWindow({ w=64, h=72, frameColor, frameW=5, glassColor, glowColor, children }) {
  return (
    <div style={{ width:w, height:h, border:`${frameW}px solid ${frameColor}`,
      backgroundColor:glassColor, position:'relative', overflow:'hidden', flexShrink:0,
      boxShadow: glowColor ? `0 0 16px ${glowColor}55, inset 0 0 10px ${glowColor}22` : undefined }}>
      <div style={{ position:'absolute', top:0, bottom:0, left:'50%', width:frameW, backgroundColor:frameColor, transform:'translateX(-50%)' }} />
      <div style={{ position:'absolute', left:0, right:0, top:'50%', height:frameW, backgroundColor:frameColor, transform:'translateY(-50%)' }} />
      <div style={{ position:'absolute', top:0, left:0, width:'30%', height:'100%', background:'linear-gradient(90deg,rgba(255,255,255,0.12),transparent)' }} />
      {children}
    </div>
  );
}

function NeonSign({ text, color, bg='#000', fontSize=18, px=16, py=8, subText }) {
  return (
    <motion.div
      animate={{ boxShadow:[`0 0 10px ${color}88, 0 0 24px ${color}44`,`0 0 18px ${color}cc, 0 0 40px ${color}66`,`0 0 10px ${color}88, 0 0 24px ${color}44`] }}
      transition={{ duration:2.5, repeat:Infinity }}
      style={{ backgroundColor:bg, border:`2px solid ${color}`, padding:`${py}px ${px}px`,
        display:'inline-flex', flexDirection:'column', alignItems:'center', gap:2 }}>
      <span style={{ color, fontFamily:'monospace', fontWeight:900, fontSize, letterSpacing:'0.15em', lineHeight:1, textShadow:`0 0 8px ${color}` }}>{text}</span>
      {subText && <span style={{ color, fontFamily:'monospace', fontSize:9, letterSpacing:'0.25em', opacity:0.8 }}>{subText}</span>}
    </motion.div>
  );
}

// ── CU 편의점 ──────────────────────────────────────────────────────────
export function CUFacade({ onClick, isOpen }) {
  const W = 220;
  return (
    <div onClick={onClick} style={{ width:W, position:'relative', cursor:'pointer', userSelect:'none' }}>
      {/* 건물 본체 */}
      <div style={{ width:W, height:480, backgroundColor:'#1a1a2e', border:'3px solid #2a2a4e', position:'relative', overflow:'hidden' }}>
        {/* 간판 배경 */}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:80, backgroundColor:'#6B2FA0', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <motion.div animate={{ opacity:[0.9,1,0.9] }} transition={{ duration:2, repeat:Infinity }}
            style={{ color:'#ffffff', fontFamily:'monospace', fontWeight:900, fontSize:36, letterSpacing:'0.15em', textShadow:'0 0 12px rgba(255,255,255,0.6)' }}>
            CU
          </motion.div>
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:4, backgroundColor:'#ff69b4' }} />
        </div>
        {/* 영업중 표시 */}
        <motion.div animate={{ opacity:[1,0.3,1] }} transition={{ duration:1.5, repeat:Infinity }}
          style={{ position:'absolute', top:88, right:12, padding:'2px 8px', backgroundColor:'#00ff88', color:'#000',
            fontFamily:'monospace', fontSize:10, fontWeight:700, borderRadius:2 }}>
          24H
        </motion.div>
        {/* 2층 창문들 */}
        <div style={{ position:'absolute', top:100, left:0, right:0, display:'flex', gap:8, padding:'0 16px' }}>
          {[0,1,2].map(i => (
            <BuildingWindow key={i} w={56} h={64} frameColor='#3a3a5a' glassColor={i===1?'#ffee99':'#334466'} glowColor={i===1?'#ffee99':undefined} />
          ))}
        </div>
        {/* 3층 창문들 */}
        <div style={{ position:'absolute', top:180, left:0, right:0, display:'flex', gap:8, padding:'0 16px' }}>
          {[0,1,2].map(i => (
            <BuildingWindow key={i} w={56} h={64} frameColor='#3a3a5a' glassColor='#223344' />
          ))}
        </div>
        {/* 쇼윈도 */}
        <div style={{ position:'absolute', bottom:110, left:8, right:8, height:100,
          border:'3px solid #6B2FA0', backgroundColor:'rgba(107,47,160,0.15)',
          display:'flex', alignItems:'center', justifyContent:'space-around', padding:'0 12px' }}>
          {['🍙','☕','🍺'].map((e,i) => (
            <div key={i} style={{ textAlign:'center' }}>
              <div style={{ fontSize:24 }}>{e}</div>
              <div style={{ color:'#aaa', fontSize:9, fontFamily:'monospace', marginTop:2 }}>
                {['삼각김밥','아메리카노','맥주'][i]}
              </div>
            </div>
          ))}
        </div>
        {/* 출입문 */}
        <div style={{ position:'absolute', bottom:0, left:'50%', transform:'translateX(-50%)',
          width:100, height:110, backgroundColor:isOpen?'rgba(107,47,160,0.3)':'#1a0a2e',
          border:'3px solid #6B2FA0', display:'flex', alignItems:'center', justifyContent:'center' }}>
          {isOpen && <div style={{ color:'#cc88ff', fontSize:9, fontFamily:'monospace', textAlign:'center' }}>OPEN<br/>↓↓↓</div>}
        </div>
        {/* 계단 */}
        <div style={{ position:'absolute', bottom:-6, left:0, right:0, height:6, backgroundColor:'#2a2a4e' }} />
      </div>
      {/* 호버 하이라이트 */}
      <div style={{ position:'absolute', inset:0, border:'2px solid transparent', transition:'border-color 0.2s',
        pointerEvents:'none' }}
        onMouseEnter={e => e.currentTarget.style.borderColor='#6B2FA0'}
        onMouseLeave={e => e.currentTarget.style.borderColor='transparent'} />
    </div>
  );
}

// ── 이마트24 편의점 ─────────────────────────────────────────────────────
export function Emart24Facade({ onClick, isOpen }) {
  const W = 220;
  return (
    <div onClick={onClick} style={{ width:W, position:'relative', cursor:'pointer', userSelect:'none' }}>
      <div style={{ width:W, height:480, backgroundColor:'#0d1117', border:'3px solid #1a2233', position:'relative', overflow:'hidden' }}>
        {/* 간판 - 이마트24 노란색 */}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:80,
          backgroundColor:'#FFD600', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
          <span style={{ color:'#003087', fontFamily:'monospace', fontWeight:900, fontSize:14, letterSpacing:'0.05em' }}>이마트</span>
          <motion.span animate={{ color:['#ff3300','#cc0000','#ff3300'] }} transition={{ duration:2, repeat:Infinity }}
            style={{ fontFamily:'monospace', fontWeight:900, fontSize:28, letterSpacing:'0.1em' }}>24</motion.span>
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:4, backgroundColor:'#003087' }} />
        </div>
        {/* 24H */}
        <motion.div animate={{ opacity:[1,0.4,1] }} transition={{ duration:1.8, repeat:Infinity }}
          style={{ position:'absolute', top:88, right:12, padding:'2px 8px', backgroundColor:'#ff3300',
            color:'#fff', fontFamily:'monospace', fontSize:10, fontWeight:700 }}>
          24H
        </motion.div>
        {/* 창문 2층 */}
        <div style={{ position:'absolute', top:100, left:0, right:0, display:'flex', gap:8, padding:'0 16px' }}>
          {[0,1,2].map(i => (
            <BuildingWindow key={i} w={56} h={64} frameColor='#2a3344' glassColor={i===0?'#ffe080':'#1a2233'} glowColor={i===0?'#ffe080':undefined} />
          ))}
        </div>
        {/* 창문 3층 */}
        <div style={{ position:'absolute', top:180, left:0, right:0, display:'flex', gap:8, padding:'0 16px' }}>
          {[0,1,2].map(i => (
            <BuildingWindow key={i} w={56} h={64} frameColor='#2a3344' glassColor='#111827' />
          ))}
        </div>
        {/* 쇼윈도 */}
        <div style={{ position:'absolute', bottom:110, left:8, right:8, height:100,
          border:'3px solid #FFD600', backgroundColor:'rgba(255,214,0,0.08)',
          display:'flex', alignItems:'center', justifyContent:'space-around', padding:'0 12px' }}>
          {['🥤','🍜','🍫'].map((e,i) => (
            <div key={i} style={{ textAlign:'center' }}>
              <div style={{ fontSize:24 }}>{e}</div>
              <div style={{ color:'#888', fontSize:9, fontFamily:'monospace', marginTop:2 }}>
                {['음료','라면','과자'][i]}
              </div>
            </div>
          ))}
        </div>
        {/* 출입문 */}
        <div style={{ position:'absolute', bottom:0, left:'50%', transform:'translateX(-50%)',
          width:100, height:110, backgroundColor:isOpen?'rgba(255,214,0,0.1)':'#0a0f1a',
          border:'3px solid #FFD600', display:'flex', alignItems:'center', justifyContent:'center' }}>
          {isOpen && <div style={{ color:'#FFD600', fontSize:9, fontFamily:'monospace', textAlign:'center' }}>OPEN<br/>↓↓↓</div>}
        </div>
        <div style={{ position:'absolute', bottom:-6, left:0, right:0, height:6, backgroundColor:'#1a2233' }} />
      </div>
    </div>
  );
}

// ── GS25 편의점 ────────────────────────────────────────────────────────
export function GS25Facade({ onClick, isOpen }) {
  const W = 220;
  return (
    <div onClick={onClick} style={{ width:W, position:'relative', cursor:'pointer', userSelect:'none' }}>
      <div style={{ width:W, height:480, backgroundColor:'#0a1628', border:'3px solid #1a2844', position:'relative', overflow:'hidden' }}>
        {/* 간판 GS25 블루 */}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:80, backgroundColor:'#003B8E',
          display:'flex', alignItems:'center', justifyContent:'center', gap:4 }}>
          <motion.div animate={{ textShadow:['0 0 8px rgba(255,255,255,0.5)','0 0 16px rgba(255,255,255,0.8)','0 0 8px rgba(255,255,255,0.5)'] }}
            transition={{ duration:2, repeat:Infinity }}
            style={{ color:'#ffffff', fontFamily:'monospace', fontWeight:900, fontSize:30, letterSpacing:'0.1em' }}>
            GS25
          </motion.div>
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:4, backgroundColor:'#00AAFF' }} />
        </div>
        {/* 24H */}
        <motion.div animate={{ opacity:[1,0.3,1] }} transition={{ duration:1.6, repeat:Infinity }}
          style={{ position:'absolute', top:88, right:12, padding:'2px 8px', backgroundColor:'#00AAFF',
            color:'#000', fontFamily:'monospace', fontSize:10, fontWeight:700 }}>
          24H
        </motion.div>
        {/* 창문 2층 */}
        <div style={{ position:'absolute', top:100, left:0, right:0, display:'flex', gap:8, padding:'0 16px' }}>
          {[0,1,2].map(i => (
            <BuildingWindow key={i} w={56} h={64} frameColor='#1a3055' glassColor={i===2?'#aaddff':'#0d1f33'} glowColor={i===2?'#aaddff':undefined} />
          ))}
        </div>
        {/* 창문 3층 */}
        <div style={{ position:'absolute', top:180, left:0, right:0, display:'flex', gap:8, padding:'0 16px' }}>
          {[0,1,2].map(i => (
            <BuildingWindow key={i} w={56} h={64} frameColor='#1a3055' glassColor='#091420' />
          ))}
        </div>
        {/* 쇼윈도 */}
        <div style={{ position:'absolute', bottom:110, left:8, right:8, height:100,
          border:'3px solid #00AAFF', backgroundColor:'rgba(0,170,255,0.08)',
          display:'flex', alignItems:'center', justifyContent:'space-around', padding:'0 12px' }}>
          {['🧃','🍕','🍦'].map((e,i) => (
            <div key={i} style={{ textAlign:'center' }}>
              <div style={{ fontSize:24 }}>{e}</div>
              <div style={{ color:'#888', fontSize:9, fontFamily:'monospace', marginTop:2 }}>
                {['주스','피자','아이스크림'][i]}
              </div>
            </div>
          ))}
        </div>
        {/* 출입문 */}
        <div style={{ position:'absolute', bottom:0, left:'50%', transform:'translateX(-50%)',
          width:100, height:110, backgroundColor:isOpen?'rgba(0,170,255,0.1)':'#060e1a',
          border:'3px solid #00AAFF', display:'flex', alignItems:'center', justifyContent:'center' }}>
          {isOpen && <div style={{ color:'#00AAFF', fontSize:9, fontFamily:'monospace', textAlign:'center' }}>OPEN<br/>↓↓↓</div>}
        </div>
        <div style={{ position:'absolute', bottom:-6, left:0, right:0, height:6, backgroundColor:'#1a2844' }} />
      </div>
    </div>
  );
}

// ── 술집 포차 ──────────────────────────────────────────────────────────
export function PochaFacade({ onClick, isOpen }) {
  const W = 260;
  return (
    <div onClick={onClick} style={{ width:W, position:'relative', cursor:'pointer', userSelect:'none' }}>
      <div style={{ width:W, height:480, backgroundColor:'#1a0a00', border:'3px solid #3a1a00', position:'relative', overflow:'hidden' }}>
        {/* 포차 천막 */}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:60, backgroundColor:'#cc3300',
          display:'flex', alignItems:'center', justifyContent:'center' }}>
          <NeonSign text="포차" color="#ffaa00" bg="#cc3300" fontSize={26} px={20} py={8} />
        </div>
        {/* 랜턴 장식 */}
        <div style={{ position:'absolute', top:65, left:0, right:0, display:'flex', justifyContent:'space-around', padding:'0 20px' }}>
          {[0,1,2,3].map(i => (
            <motion.div key={i} animate={{ y:[0,-3,0] }} transition={{ duration:1.5+i*0.3, repeat:Infinity }}>
              <div style={{ width:16, height:20, backgroundColor:'#ff4400', border:'2px solid #ff8800',
                borderRadius:'30% 30% 40% 40%', boxShadow:'0 0 8px #ff440099' }} />
              <div style={{ width:2, height:12, backgroundColor:'#996633', margin:'0 auto' }} />
            </motion.div>
          ))}
        </div>
        {/* 메뉴판 */}
        <div style={{ position:'absolute', top:110, left:12, width:100, backgroundColor:'#1a0800',
          border:'2px solid #cc5500', padding:'8px 10px' }}>
          <div style={{ color:'#ffaa00', fontFamily:'monospace', fontSize:10, fontWeight:700, marginBottom:6 }}>오늘의 메뉴</div>
          {['삼겹살 ₩12,000','소맥 ₩4,000','파전 ₩8,000','골뱅이 ₩9,000'].map((item,i) => (
            <div key={i} style={{ color:'#cc8844', fontFamily:'monospace', fontSize:9, marginBottom:3 }}>{item}</div>
          ))}
        </div>
        {/* 창문들 */}
        <div style={{ position:'absolute', top:110, right:12, display:'flex', flexDirection:'column', gap:8 }}>
          {[0,1].map(i => (
            <BuildingWindow key={i} w={80} h={64} frameColor='#3a1a00' glassColor='#ff8800' glowColor='#ff8800' />
          ))}
        </div>
        {/* 맥주 광고 */}
        <div style={{ position:'absolute', top:260, left:0, right:0, display:'flex', justifyContent:'center' }}>
          <NeonSign text="🍺 HITE" color="#ff8800" bg="#1a0a00" fontSize={16} />
        </div>
        {/* 출입문 */}
        <div style={{ position:'absolute', bottom:0, left:'50%', transform:'translateX(-50%)',
          width:120, height:110,
          backgroundColor:isOpen?'rgba(255,100,0,0.15)':'#110500',
          border:'3px solid #cc3300',
          display:'flex', alignItems:'center', justifyContent:'center' }}>
          {isOpen
            ? <div style={{ color:'#ffaa00', fontSize:9, fontFamily:'monospace', textAlign:'center' }}>영업중<br/>↓↓↓</div>
            : <div style={{ color:'#553300', fontSize:9, fontFamily:'monospace', textAlign:'center' }}>준비중</div>}
        </div>
        <div style={{ position:'absolute', bottom:-6, left:0, right:0, height:6, backgroundColor:'#3a1a00' }} />
      </div>
    </div>
  );
}

// ── 한강 뷰 카페 ────────────────────────────────────────────────────────
export function HangangCafeFacade({ onClick, isOpen }) {
  const W = 280;
  return (
    <div onClick={onClick} style={{ width:W, position:'relative', cursor:'pointer', userSelect:'none' }}>
      <div style={{ width:W, height:520, backgroundColor:'#080c18', border:'3px solid #131c30', position:'relative', overflow:'hidden' }}>
        {/* 카페 간판 */}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:70,
          backgroundColor:'#0a1628', borderBottom:'3px solid #4488ff',
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:2 }}>
          <motion.div animate={{ textShadow:['0 0 8px #4488ff88','0 0 16px #4488ffcc','0 0 8px #4488ff88'] }}
            transition={{ duration:3, repeat:Infinity }}
            style={{ color:'#88bbff', fontFamily:'monospace', fontWeight:900, fontSize:18, letterSpacing:'0.2em' }}>
            HAN•RIVER
          </motion.div>
          <div style={{ color:'#4466aa', fontFamily:'monospace', fontSize:9, letterSpacing:'0.3em' }}>CAFÉ & VIEW</div>
        </div>
        {/* 한강 뷰 창문 (크게) */}
        <div style={{ position:'absolute', top:78, left:8, right:8, height:160,
          border:'3px solid #2244aa', backgroundColor:'#0a1830', overflow:'hidden' }}>
          {/* 한강 야경 시뮬레이션 */}
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'50%', backgroundColor:'#050a14' }}>
            {/* 물 반사 */}
            {[0,1,2,3,4,5].map(i => (
              <motion.div key={i} animate={{ opacity:[0.3,0.7,0.3] }}
                transition={{ duration:1.5+i*0.4, repeat:Infinity }}
                style={{ position:'absolute', bottom:i*8, left:`${10+i*12}%`, width:'8%', height:3,
                  backgroundColor:['#ffcc00','#ff8800','#0088ff','#ffffff','#ff4400','#88ff88'][i],
                  borderRadius:2, opacity:0.4 }} />
            ))}
          </div>
          {/* 하늘 */}
          <div style={{ position:'absolute', top:0, left:0, right:0, height:'50%',
            background:'linear-gradient(to bottom, #020510, #0a1830)' }}>
            {/* 별 */}
            {[...Array(12)].map((_,i) => (
              <motion.div key={i} animate={{ opacity:[0.4,1,0.4] }}
                transition={{ duration:1+i*0.3, repeat:Infinity }}
                style={{ position:'absolute', top:`${10+Math.random()*80}%`,
                  left:`${Math.random()*100}%`, width:2, height:2,
                  backgroundColor:'#ffffff', borderRadius:'50%' }} />
            ))}
          </div>
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:1, backgroundColor:'#1a3066', opacity:0.5 }} />
        </div>
        {/* 테라스 좌석 */}
        <div style={{ position:'absolute', top:248, left:12, right:12, height:60,
          border:'1px solid #1a3066', backgroundColor:'rgba(20,40,80,0.3)',
          display:'flex', alignItems:'center', justifyContent:'space-around' }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
              <div style={{ width:24, height:8, backgroundColor:'#334466', borderRadius:2 }} />
              <div style={{ width:16, height:20, backgroundColor:'#1a2844', border:'1px solid #2a3854' }} />
            </div>
          ))}
        </div>
        {/* 메뉴 */}
        <div style={{ position:'absolute', top:318, left:12, right:12, display:'flex', justifyContent:'space-around' }}>
          {['☕ 아메리카노','🧋 한강라떼','🍰 케이크'].map((item,i) => (
            <div key={i} style={{ textAlign:'center' }}>
              <div style={{ color:'#88aacc', fontFamily:'monospace', fontSize:9 }}>{item}</div>
              <div style={{ color:'#4466aa', fontFamily:'monospace', fontSize:8, marginTop:2 }}>
                {['₩4,500','₩5,500','₩6,000'][i]}
              </div>
            </div>
          ))}
        </div>
        {/* 출입문 */}
        <div style={{ position:'absolute', bottom:0, left:'50%', transform:'translateX(-50%)',
          width:110, height:110,
          backgroundColor:isOpen?'rgba(68,136,255,0.1)':'#040810',
          border:'3px solid #2244aa',
          display:'flex', alignItems:'center', justifyContent:'center' }}>
          {isOpen && <div style={{ color:'#4488ff', fontSize:9, fontFamily:'monospace', textAlign:'center' }}>OPEN<br/>↓↓↓</div>}
        </div>
        <div style={{ position:'absolute', bottom:-6, left:0, right:0, height:6, backgroundColor:'#131c30' }} />
      </div>
    </div>
  );
}
