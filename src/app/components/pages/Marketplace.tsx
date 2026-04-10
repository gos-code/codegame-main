// @ts-nocheck
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, Star, ShoppingCart } from 'lucide-react';
import { Link, useSearchParams } from 'react-router';
import { db, collection, query, where, getDocs } from '../../lib/firebase';
import { useTheme } from '../../contexts/ThemeContext';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  language: string;
  license: string;
  nickname: string;
  uid: string;
  salesCount: number;
  fileUrl: string;
  screenshots: string[];
  createdAt: any;
}

const CATEGORIES = [
  { id: 'all', name: '전체' },
  { id: 'workflow', name: '자동화' },
  { id: 'function', name: '기능 모듈' },
  { id: 'template', name: '템플릿' },
  { id: 'tool', name: '도구' },
  { id: 'GPT / AI', name: 'AI/GPT' },
];

export default function Marketplace() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState('all');
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const { accentColor, bgColor } = useTheme();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const snap = await getDocs(query(collection(db,'uploads'), where('status','==','approved')));
        setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
      } catch(e) { console.error(e); }
      setLoading(false);
    };
    load();
  }, []);

  const filtered = products.filter(p => {
    const matchCat = cat === 'all' || p.category?.includes(cat) || p.language?.includes(cat);
    const matchQ = !q || p.title?.toLowerCase().includes(q.toLowerCase()) || p.description?.toLowerCase().includes(q.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <div className="min-h-screen px-6 py-8" style={{ background: bgColor }}>
      {/* 배경 오브 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-5" style={{ background: accentColor }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl opacity-5" style={{ background: '#7c3aed' }} />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1 text-white" style={{ fontFamily:'Sora,sans-serif' }}>
            마켓플레이스
          </h1>
          <p className="text-sm text-white/40" style={{ fontFamily:'Sora,sans-serif' }}>검증된 코드 자산을 찾아보세요</p>
        </div>

        {/* 카테고리 필터 */}
        <div className="flex gap-2 flex-wrap mb-6">
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => setCat(c.id)}
              className="px-4 py-1.5 rounded-full text-xs transition-all"
              style={{
                background: cat===c.id ? accentColor : 'rgba(255,255,255,0.05)',
                border: cat===c.id ? 'none' : '1px solid rgba(255,255,255,0.08)',
                color: cat===c.id ? '#000' : 'rgba(255,255,255,0.5)',
                fontFamily:'Sora,sans-serif', fontWeight: cat===c.id ? 600 : 400
              }}>
              {c.name}
            </button>
          ))}
        </div>

        {/* 상품 그리드 */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_,i) => (
              <div key={i} className="h-56 rounded-2xl animate-pulse" style={{ background:'rgba(255,255,255,0.04)' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🛒</div>
            <p className="text-white/40 text-sm" style={{ fontFamily:'Sora,sans-serif' }}>
              {q ? `"${q}" 검색 결과가 없어요` : '아직 등록된 상품이 없어요'}
            </p>
            <Link to="/sell" className="inline-block mt-4 px-6 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background:`linear-gradient(135deg,${accentColor},#00d4ff)`, color:'#000', fontFamily:'Sora,sans-serif' }}>
              첫 번째 판매자 되기
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((p, i) => (
              <motion.div key={p.id}
                initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                transition={{ delay: i*0.05 }}>
                <Link to={`/marketplace/${p.id}`}>
                  <div className="rounded-2xl overflow-hidden transition-all hover:-translate-y-1.5 cursor-pointer"
                    style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)',
                      backdropFilter:'blur(16px)' }}
                    onMouseOver={e => (e.currentTarget.style.borderColor = `${accentColor}40`)}
                    onMouseOut={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}>
                    {/* 썸네일 */}
                    <div className="h-32 flex items-center justify-center relative overflow-hidden"
                      style={{ background:`linear-gradient(135deg, ${accentColor}12, rgba(124,58,237,0.08))` }}>
                      {p.screenshots?.[0] ? (
                        <img src={p.screenshots[0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-4xl">📦</span>
                      )}
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs"
                        style={{ background:`${accentColor}20`, color:accentColor, border:`1px solid ${accentColor}30`,
                          fontFamily:'JetBrains Mono,monospace' }}>
                        {p.category?.split('/')[0]?.trim() || '코드'}
                      </div>
                    </div>
                    {/* 내용 */}
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-white/90 mb-1.5 line-clamp-2 leading-snug"
                        style={{ fontFamily:'Sora,sans-serif' }}>{p.title}</h3>
                      <p className="text-xs text-white/40 line-clamp-2 mb-3" style={{ fontFamily:'Sora,sans-serif' }}>
                        {p.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-base font-bold" style={{ color:accentColor, fontFamily:'Orbitron,monospace' }}>
                          ₩{(p.price||0).toLocaleString()}
                        </span>
                        <span className="text-xs text-white/30" style={{ fontFamily:'Sora,sans-serif' }}>
                          {p.salesCount||0}판매
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-white/25" style={{ fontFamily:'JetBrains Mono,monospace' }}>
                        by {p.nickname}
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
