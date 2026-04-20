// @ts-nocheck
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Package, Star, TrendingUp } from 'lucide-react';
import { db, collection, query, where, getDocs, doc, getDoc } from '../../../lib/firebase';
import { useTheme } from '../../contexts/ThemeContext';

export default function SellerProfile() {
  const { uid } = useParams<{ uid:string }>();
  const { theme, accentColor } = useTheme();
  const isDark = theme === 'dark';
  const accent = isDark ? (accentColor||'#00f5c4') : '#0f172a';

  const [profile, setProfile]   = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    if (!uid) return;
    const load = async () => {
      try {
        // 프로필 로드
        const profileSnap = await getDoc(doc(db,'users',uid));
        if (profileSnap.exists()) setProfile(profileSnap.data());

        // 승인된 상품 로드
        const snap = await getDocs(query(collection(db,'uploads'),
          where('uid','==',uid), where('status','==','approved')));
        setProducts(snap.docs.map(d => ({ id:d.id, ...d.data() }))
          .sort((a,b) => (b.createdAt?.seconds||0)-(a.createdAt?.seconds||0)));
      } catch(e) { console.error(e); }
      setLoading(false);
    };
    load();
  }, [uid]);

  const totalSales   = products.reduce((a,p) => a+(p.salesCount||0), 0);
  const totalRevenue = products.reduce((a,p) => a+(p.revenue||0), 0);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background:'var(--background)' }}>
      <div className="w-8 h-8 border-2 rounded-full animate-spin"
        style={{ borderColor:`${accent}30`, borderTopColor:accent }} />
    </div>
  );

  return (
    <div className="min-h-screen px-4 py-8" style={{ background:'var(--background)' }}>
      <div className="max-w-4xl mx-auto">

        <Link to="/marketplace"
          className="inline-flex items-center gap-2 text-sm mb-6 transition-colors"
          style={{ color:'var(--muted-foreground)', fontFamily:'JetBrains Mono,monospace' }}>
          <ArrowLeft className="w-4 h-4" /> 마켓으로
        </Link>

        {/* 판매자 프로필 카드 */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          className="rounded-2xl p-6 mb-6"
          style={{ background:'var(--card)', border:'1px solid var(--border)' }}>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black flex-shrink-0"
              style={{ background:`linear-gradient(135deg,${accent},#00d4ff)`,
                color:'#000', fontFamily:'Orbitron,monospace' }}>
              {(profile?.nickname||'?')[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold mb-1"
                style={{ color:'var(--foreground)', fontFamily:'Sora,sans-serif' }}>
                {profile?.nickname || '판매자'}
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background:`${accent}15`, color:accent,
                    fontFamily:'JetBrains Mono,monospace',
                    border:`1px solid ${accent}25` }}>
                  ✓ 인증 판매자
                </span>
                <span className="text-xs" style={{ color:'var(--muted-foreground)', fontFamily:'Sora,sans-serif' }}>
                  LV.{String(profile?.level||1).padStart(2,'0')}
                </span>
              </div>
            </div>
          </div>

          {/* 통계 */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              { label:'등록 상품', value:`${products.length}개`, icon:Package },
              { label:'총 판매',   value:`${totalSales}건`,      icon:TrendingUp },
              { label:'평점',      value:'4.9★',                 icon:Star },
            ].map(s => (
              <div key={s.label} className="text-center rounded-xl py-3"
                style={{ background:'var(--background)', border:'1px solid var(--border)' }}>
                <div className="text-lg font-bold mb-0.5"
                  style={{ color:accent, fontFamily:'Orbitron,monospace' }}>{s.value}</div>
                <div className="text-xs" style={{ color:'var(--muted-foreground)', fontFamily:'Sora,sans-serif' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 상품 목록 */}
        <h2 className="text-base font-semibold mb-4"
          style={{ color:'var(--foreground)', fontFamily:'Sora,sans-serif' }}>
          등록 상품 ({products.length})
        </h2>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">📦</div>
            <p className="text-sm" style={{ color:'var(--muted-foreground)', fontFamily:'Sora,sans-serif' }}>
              등록된 상품이 없어요
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                transition={{ delay:i*0.05 }}>
                <Link to={`/marketplace/${p.id}`} style={{ textDecoration:'none' }}>
                  <div className="rounded-2xl overflow-hidden transition-all hover:-translate-y-1 cursor-pointer"
                    style={{ background: isDark?'rgba(255,255,255,0.04)':'#ffffff',
                      border:`1px solid ${isDark?'rgba(255,255,255,0.08)':'#e5e7eb'}` }}>
                    <div className="h-32 flex items-center justify-center"
                      style={{ background: isDark?`${accent}08`:'#f8fafc' }}>
                      {p.screenshots?.[0]
                        ? <img src={p.screenshots[0]} alt="" className="w-full h-full object-cover" />
                        : <span className="text-3xl">📦</span>}
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-semibold mb-1 line-clamp-1"
                        style={{ color:'var(--foreground)', fontFamily:'Sora,sans-serif' }}>
                        {p.title}
                      </h3>
                      <p className="text-xs line-clamp-2 mb-3"
                        style={{ color:'var(--muted-foreground)', fontFamily:'Sora,sans-serif' }}>
                        {p.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold"
                          style={{ color:accent, fontFamily:'Orbitron,monospace', fontSize:14 }}>
                          ₩{(p.price||0).toLocaleString()}
                        </span>
                        <span className="text-xs" style={{ color:'var(--muted-foreground)' }}>
                          {p.salesCount||0}판매
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
