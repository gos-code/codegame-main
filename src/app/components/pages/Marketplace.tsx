// @ts-nocheck
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link, useSearchParams } from 'react-router';
import { db, collection, query, where, getDocs } from '../../../lib/firebase';
import { useTheme } from '../../contexts/ThemeContext';

const CATEGORIES = [
  { id: 'all', name: '전체' },
  { id: '자동화', name: '자동화' },
  { id: '기능 모듈', name: '기능 모듈' },
  { id: '템플릿', name: '템플릿' },
  { id: '도구', name: '도구' },
  { id: 'GPT', name: 'AI/GPT' },
];

export default function Marketplace() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState('all');
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const { theme } = useTheme();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const snap = await getDocs(query(collection(db,'uploads'), where('status','==','approved')));
        setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch(e) { console.error(e); }
      setLoading(false);
    };
    load();
  }, []);

  const filtered = products.filter(p => {
    const matchCat = cat === 'all' || p.category?.includes(cat);
    const matchQ = !q || p.title?.toLowerCase().includes(q.toLowerCase());
    return matchCat && matchQ;
  });

  const isDark = theme === 'dark';

  return (
    <div className="min-h-screen px-6 py-8" style={{ background: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--foreground)', fontFamily: 'Sora,sans-serif' }}>
            마켓플레이스
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted)', fontFamily: 'Sora,sans-serif' }}>
            검증된 코드 자산을 찾아보세요
          </p>
        </div>

        {/* 카테고리 - 라이트/다크 모두 잘 보이게 */}
        <div className="flex gap-2 flex-wrap mb-6">
          {CATEGORIES.map(c => {
            const isActive = cat === c.id;
            return (
              <button key={c.id} onClick={() => setCat(c.id)}
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                style={{
                  background: isActive
                    ? (isDark ? '#00f5c4' : '#0f172a')
                    : (isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'),
                  color: isActive
                    ? (isDark ? '#000000' : '#ffffff')
                    : (isDark ? 'rgba(255,255,255,0.7)' : '#374151'),
                  border: isActive ? 'none' : `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#d1d5db'}`,
                  fontFamily: 'Sora,sans-serif'
                }}>
                {c.name}
              </button>
            );
          })}
        </div>

        {/* 상품 그리드 */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_,i) => (
              <div key={i} className="h-56 rounded-2xl animate-pulse"
                style={{ background: isDark ? 'rgba(255,255,255,0.04)' : '#e5e7eb' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🛒</div>
            <p className="text-sm mb-4" style={{ color: 'var(--muted)', fontFamily: 'Sora,sans-serif' }}>
              {q ? `"${q}" 검색 결과가 없어요` : '아직 등록된 상품이 없어요'}
            </p>
            <Link to="/sell"
              className="inline-block mt-2 px-6 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: isDark ? '#00f5c4' : '#0f172a', color: isDark ? '#000' : '#fff',
                fontFamily: 'Sora,sans-serif' }}>
              첫 번째 판매자 되기
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                transition={{ delay: i*0.05 }}>
                <Link to={`/marketplace/${p.id}`}>
                  <div className="rounded-2xl overflow-hidden transition-all hover:-translate-y-1.5 cursor-pointer"
                    style={{
                      background: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb'}`,
                      boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)'
                    }}>
                    <div className="h-32 flex items-center justify-center"
                      style={{ background: isDark ? 'rgba(0,245,196,0.05)' : '#f8fafc' }}>
                      {p.screenshots?.[0]
                        ? <img src={p.screenshots[0]} alt="" className="w-full h-full object-cover" />
                        : <span className="text-4xl">📦</span>}
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-semibold mb-1.5 line-clamp-2"
                        style={{ color: 'var(--foreground)', fontFamily: 'Sora,sans-serif' }}>
                        {p.title}
                      </h3>
                      <p className="text-xs line-clamp-2 mb-3"
                        style={{ color: 'var(--muted)', fontFamily: 'Sora,sans-serif' }}>
                        {p.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-base font-bold"
                          style={{ color: isDark ? '#00f5c4' : '#0f172a', fontFamily: 'Orbitron,monospace' }}>
                          ₩{(p.price||0).toLocaleString()}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--muted)' }}>{p.salesCount||0}판매</span>
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
