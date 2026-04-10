import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Shield, Zap, Code2, Gamepad2, TrendingUp } from 'lucide-react';
import { Link } from 'react-router';
import { db, collection, query, where, getDocs } from '../../lib/firebase';
import { useTheme } from '../../contexts/ThemeContext';

export default function Home() {
  const { accentColor, bgColor } = useTheme();
  const [stats, setStats] = useState({ products: 0, sellers: 0 });

  useEffect(() => {
    getDocs(query(collection(db,'uploads'), where('status','==','approved')))
      .then(snap => {
        const sellers = new Set(snap.docs.map(d => d.data().uid)).size;
        setStats({ products: snap.docs.length, sellers });
      }).catch(() => {});
  }, []);

  const features = [
    { icon: Shield, title: 'Code Risk Scanner', desc: '악성코드 자동 탐지 · API키 노출 방지 · 라이선스 검증' },
    { icon: Zap, title: '즉시 거래', desc: '라이선스 키 자동 발급 · 구매 즉시 다운로드 · 영구 소유' },
    { icon: Code2, title: '검증된 코드', desc: '관리자 검수 통과 · 완성형 코드만 판매 · README 포함' },
    { icon: TrendingUp, title: '수익 창출', desc: '판매 수익 80% 지급 · 반복 수익 · 자는 동안도 수익' },
  ];

  return (
    <div className="min-h-screen" style={{ background: bgColor }}>
      {/* 배경 오브 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl opacity-8" style={{ background: accentColor }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-6" style={{ background: '#7c3aed' }} />
        <div className="absolute top-1/2 left-0 w-72 h-72 rounded-full blur-3xl opacity-4" style={{ background: '#00d4ff' }} />
      </div>

      {/* 매트릭스 배경 캔버스 */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0">
        <div className="w-full h-full" style={{
          backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 30px,rgba(0,245,196,0.15) 30px,rgba(0,245,196,0.15) 31px)',
        }} />
      </div>

      {/* 히어로 */}
      <section className="relative min-h-[85vh] flex items-center px-6">
        <div className="max-w-7xl mx-auto w-full">
          <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8 }}
            className="max-w-3xl">
            <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
              transition={{ delay:0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-xs"
              style={{ background:`${accentColor}12`, border:`1px solid ${accentColor}30`,
                color:accentColor, fontFamily:'JetBrains Mono,monospace', letterSpacing:'.12em' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background:accentColor }} />
              BETA · 지금 무료로 시작하세요
            </motion.div>

            <h1 className="font-bold leading-tight mb-6 text-white"
              style={{ fontSize:'clamp(38px,5.5vw,72px)', fontFamily:'Sora,sans-serif', letterSpacing:'-.03em' }}>
              코드가 <span style={{ color:accentColor }}>자산</span>이<br />되는 곳
            </h1>
            <p className="text-white/50 mb-10 leading-relaxed"
              style={{ fontSize:'clamp(14px,1.5vw,18px)', fontFamily:'Sora,sans-serif', fontWeight:300, maxWidth:'480px' }}>
              자동화 코드와 디지털 창작물을 안전하게 사고 파는<br />국내 최초 코드 자산 마켓플레이스
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/marketplace"
                className="group flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all"
                style={{ background:`linear-gradient(135deg,${accentColor},#00d4ff)`, color:'#000',
                  fontFamily:'Sora,sans-serif', boxShadow:`0 8px 30px ${accentColor}40` }}>
                마켓 둘러보기
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/sell"
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-medium text-sm transition-all"
                style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.12)',
                  color:'rgba(255,255,255,0.8)', fontFamily:'Sora,sans-serif', backdropFilter:'blur(12px)' }}>
                코드 판매하기
              </Link>
              <Link to="/dev-garden"
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-medium text-sm transition-all"
                style={{ background:'rgba(124,58,237,0.1)', border:'1px solid rgba(124,58,237,0.3)',
                  color:'#a78bff', fontFamily:'Sora,sans-serif' }}>
                <Gamepad2 className="w-4 h-4" />Dev Garden
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 통계 */}
      <section className="px-6 py-10 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-12 flex-wrap"
            style={{ borderTop:`1px solid rgba(255,255,255,0.07)`, borderBottom:`1px solid rgba(255,255,255,0.07)`,
              padding:'28px 0' }}>
            {[
              { num: stats.products || '—', label: '등록 자산', accent: true },
              { num: stats.sellers || '—', label: '활성 판매자' },
              { num: '4.9★', label: '평균 평점' },
              { num: 'FREE', label: '등록 비용' },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                transition={{ delay: 0.3+i*0.1 }} className="text-center">
                <div className="text-2xl font-bold mb-1"
                  style={{ fontFamily:'Orbitron,monospace',
                    color: s.accent ? accentColor : 'rgba(255,255,255,0.9)' }}>
                  {s.num}
                </div>
                <div className="text-xs text-white/30 uppercase tracking-widest"
                  style={{ fontFamily:'JetBrains Mono,monospace' }}>{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 기능 소개 */}
      <section className="px-6 py-16 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }} className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily:'Sora,sans-serif' }}>
              왜 CodeGame인가
            </h2>
            <p className="text-sm text-white/40" style={{ fontFamily:'Sora,sans-serif' }}>신뢰할 수 있는 코드 거래를 위한 핵심 시스템</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }} transition={{ delay: i*0.1 }}
                className="p-6 rounded-2xl transition-all hover:-translate-y-1"
                style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)',
                  backdropFilter:'blur(16px)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background:`${accentColor}12`, border:`1px solid ${accentColor}25` }}>
                  <f.icon className="w-5 h-5" style={{ color:accentColor }} />
                </div>
                <h3 className="text-sm font-semibold text-white/90 mb-2" style={{ fontFamily:'Sora,sans-serif' }}>
                  {f.title}
                </h3>
                <p className="text-xs text-white/40 leading-relaxed" style={{ fontFamily:'Sora,sans-serif', fontWeight:300 }}>
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dev Garden CTA */}
      <section className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
            className="rounded-2xl p-8 flex items-center justify-between gap-6 flex-wrap"
            style={{ background:'rgba(124,58,237,0.08)', border:'1px solid rgba(124,58,237,0.2)', backdropFilter:'blur(16px)' }}>
            <div>
              <div className="text-xs text-purple-400 mb-2 uppercase tracking-widest"
                style={{ fontFamily:'JetBrains Mono,monospace' }}>NEW</div>
              <h3 className="text-lg font-bold text-white mb-1" style={{ fontFamily:'Sora,sans-serif' }}>
                Developer Garden
              </h3>
              <p className="text-sm text-white/40" style={{ fontFamily:'Sora,sans-serif', fontWeight:300 }}>
                픽셀 도시를 탐험하고 개발자들과 교류하는 공간
              </p>
            </div>
            <Link to="/dev-garden"
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
              style={{ background:'rgba(124,58,237,0.2)', border:'1px solid rgba(124,58,237,0.4)',
                color:'#a78bff', fontFamily:'Sora,sans-serif' }}>
              <Gamepad2 className="w-4 h-4" />
              입장하기
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
