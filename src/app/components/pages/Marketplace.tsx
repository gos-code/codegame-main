// @ts-nocheck
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Link, useSearchParams, useNavigate } from 'react-router';
import { Search, SlidersHorizontal, X, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { db, collection, query, where, getDocs } from '../../../lib/firebase';
import { useTheme } from '../../contexts/ThemeContext';

const CATEGORIES = [
  { id:'all',                    name:'전체' },
  { id:'스마트스토어 / 커머스',  name:'커머스' },
  { id:'유튜브 / 쇼츠',         name:'유튜브' },
  { id:'GPT / AI',              name:'AI/GPT' },
  { id:'Google Sheets',         name:'스프레드시트' },
  { id:'n8n / Make',           name:'n8n/Make' },
  { id:'크롤링',                 name:'크롤링' },
  { id:'데이터 처리',            name:'데이터' },
  { id:'기타',                   name:'기타' },
];

const SORT_OPTIONS = [
  { id:'newest',    label:'최신순',    icon: Clock },
  { id:'popular',   label:'인기순',    icon: TrendingUp },
  { id:'price_asc', label:'낮은 가격', icon: DollarSign },
  { id:'price_desc',label:'높은 가격', icon: DollarSign },
];

export default function Marketplace() {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [cat,      setCat]      = useState('all');
  const [sort,     setSort]     = useState('newest');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const { theme, accentColor } = useTheme();
  const isDark = theme === 'dark';
  const nav = useNavigate();

  useEffect(() => {
    setSearchInput(q);
  }, [q]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const snap = await getDocs(query(collection(db,'uploads'), where('status','==','approved')));
        setProducts(snap.docs.map(d => ({ id:d.id, ...d.data() })));
      } catch(e) { console.error(e); }
      setLoading(false);
    };
    load();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) setSearchParams({ q: searchInput.trim() });
    else setSearchParams({});
  };

  const filtered = useMemo(() => {
    let list = products.filter(p => {
      const matchCat = cat === 'all' || p.category?.includes(cat);
      const matchQ   = !q || p.title?.toLowerCase().includes(q.toLowerCase())
                          || p.description?.toLowerCase().includes(q.toLowerCase());
      const matchMin = !priceMin || (p.price||0) >= parseInt(priceMin);
      const matchMax = !priceMax || (p.price||0) <= parseInt(priceMax);
      return matchCat && matchQ && matchMin && matchMax;
    });
    switch(sort) {
      case 'popular':    list = [...list].sort((a,b) => (b.salesCount||0)-(a.salesCount||0)); break;
      case 'price_asc':  list = [...list].sort((a,b) => (a.price||0)-(b.price||0)); break;
      case 'price_desc': list = [...list].sort((a,b) => (b.price||0)-(a.price||0)); break;
      default: list = [...list].sort((a,b) => (b.createdAt?.seconds||0)-(a.createdAt?.seconds||0));
    }
    return list;
  }, [products, cat, q, sort, priceMin, priceMax]);

  const accent = isDark ? (accentColor || '#00f5c4') : '#0f172a';

  return (
    <div className="min-h-screen px-4 py-8" style={{ background:'var(--background)' }}>
      <div className="max-w-7xl mx-auto">

        {/* 헤더 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1"
            style={{ color:'var(--foreground)', fontFamily:'Sora,sans-serif' }}>
            마켓플레이스
          </h1>
          <p className="text-sm" style={{ color:'var(--muted)', fontFamily:'Sora,sans-serif' }}>
            검증된 코드 자산을 찾아보세요 · {products.length}개 상품
          </p>
        </div>

        {/* 검색바 */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-5">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color:'var(--muted-foreground)' }} />
            <input value={searchInput} onChange={e => setSearchInput(e.target.value)}
              placeholder="상품명, 키워드 검색..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ background:'var(--card)', border:'1px solid var(--border)',
                color:'var(--foreground)', fontFamily:'Sora,sans-serif' }} />
            {searchInput && (
              <button type="button" onClick={() => { setSearchInput(''); setSearchParams({}); }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ background:'none', border:'none', cursor:'pointer', color:'var(--muted-foreground)' }}>
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button type="submit" className="px-5 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background:accent, color: isDark?'#000':'#fff',
              border:'none', cursor:'pointer', fontFamily:'Sora,sans-serif' }}>
            검색
          </button>
          <button type="button" onClick={() => setShowFilter(!showFilter)}
            className="px-4 py-2.5 rounded-xl text-sm flex items-center gap-1.5"
            style={{ background: showFilter ? `${accent}15` : 'var(--card)',
              color: showFilter ? accent : 'var(--foreground)',
              border:`1px solid ${showFilter ? accent : 'var(--border)'}`,
              cursor:'pointer', fontFamily:'Sora,sans-serif' }}>
            <SlidersHorizontal className="w-4 h-4" />필터
          </button>
        </form>

        {/* 필터 패널 */}
        {showFilter && (
          <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
            className="mb-5 p-4 rounded-xl"
            style={{ background:'var(--card)', border:'1px solid var(--border)' }}>
            <div className="flex flex-wrap gap-6">
              <div>
                <p className="text-xs mb-2 uppercase tracking-widest"
                  style={{ color:'var(--muted-foreground)', fontFamily:'JetBrains Mono,monospace' }}>
                  가격 범위 (원)
                </p>
                <div className="flex items-center gap-2">
                  <input type="number" value={priceMin} onChange={e => setPriceMin(e.target.value)}
                    placeholder="최소" className="w-24 px-3 py-1.5 rounded-lg text-sm outline-none"
                    style={{ background:'var(--background)', border:'1px solid var(--border)',
                      color:'var(--foreground)', fontFamily:'Sora,sans-serif' }} />
                  <span style={{ color:'var(--muted-foreground)' }}>~</span>
                  <input type="number" value={priceMax} onChange={e => setPriceMax(e.target.value)}
                    placeholder="최대" className="w-24 px-3 py-1.5 rounded-lg text-sm outline-none"
                    style={{ background:'var(--background)', border:'1px solid var(--border)',
                      color:'var(--foreground)', fontFamily:'Sora,sans-serif' }} />
                  {(priceMin || priceMax) && (
                    <button onClick={() => { setPriceMin(''); setPriceMax(''); }}
                      style={{ background:'none', border:'none', cursor:'pointer',
                        color:'var(--muted-foreground)', fontSize:12, fontFamily:'Sora,sans-serif' }}>
                      초기화
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 카테고리 + 정렬 */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(c => (
              <button key={c.id} onClick={() => setCat(c.id)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={{
                  background: cat===c.id ? accent : (isDark?'rgba(255,255,255,0.06)':'rgba(0,0,0,0.06)'),
                  color: cat===c.id ? (isDark?'#000':'#fff') : 'var(--foreground)',
                  border: cat===c.id ? 'none' : `1px solid var(--border)`,
                  fontFamily:'Sora,sans-serif', cursor:'pointer',
                }}>
                {c.name}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5">
            {SORT_OPTIONS.map(s => (
              <button key={s.id} onClick={() => setSort(s.id)}
                className="px-3 py-1.5 rounded-lg text-xs transition-all"
                style={{
                  background: sort===s.id ? `${accent}15` : 'var(--card)',
                  color: sort===s.id ? accent : 'var(--muted-foreground)',
                  border:`1px solid ${sort===s.id ? accent+'40' : 'var(--border)'}`,
                  fontFamily:'Sora,sans-serif', cursor:'pointer',
                }}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* 검색 결과 안내 */}
        {q && (
          <div className="mb-4 flex items-center gap-2">
            <span className="text-sm" style={{ color:'var(--muted-foreground)', fontFamily:'Sora,sans-serif' }}>
              "{q}" 검색 결과 {filtered.length}개
            </span>
            <button onClick={() => { setSearchInput(''); setSearchParams({}); }}
              className="text-xs px-2 py-1 rounded-md"
              style={{ background:`${accent}15`, color:accent,
                border:`1px solid ${accent}30`, fontFamily:'Sora,sans-serif', cursor:'pointer' }}>
              검색 초기화
            </button>
          </div>
        )}

        {/* 상품 그리드 */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_,i) => (
              <div key={i} className="h-64 rounded-2xl animate-pulse"
                style={{ background: isDark?'rgba(255,255,255,0.04)':'#e5e7eb' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🛒</div>
            <p className="text-sm mb-2" style={{ color:'var(--muted)', fontFamily:'Sora,sans-serif' }}>
              {q ? `"${q}" 검색 결과가 없어요` : '아직 등록된 상품이 없어요'}
            </p>
            <Link to="/sell" className="inline-block mt-4 px-6 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background:accent, color:isDark?'#000':'#fff', fontFamily:'Sora,sans-serif' }}>
              첫 번째 판매자 되기
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                transition={{ delay: Math.min(i*0.05, 0.3) }}>
                <Link to={`/marketplace/${p.id}`} style={{ textDecoration:'none' }}>
                  <div className="rounded-2xl overflow-hidden transition-all hover:-translate-y-1.5 cursor-pointer h-full"
                    style={{
                      background: isDark?'rgba(255,255,255,0.04)':'#ffffff',
                      border:`1px solid ${isDark?'rgba(255,255,255,0.08)':'#e5e7eb'}`,
                      boxShadow: isDark?'none':'0 1px 4px rgba(0,0,0,0.06)',
                    }}>
                    {/* 썸네일 */}
                    <div className="h-36 flex items-center justify-center overflow-hidden"
                      style={{ background: isDark?`${accentColor||'#00f5c4'}08`:'#f8fafc' }}>
                      {p.screenshots?.[0]
                        ? <img src={p.screenshots[0]} alt="" className="w-full h-full object-cover" />
                        : (
                          <div className="flex flex-col items-center gap-2">
                            <span className="text-3xl">📦</span>
                            <span className="text-xs px-2 py-0.5 rounded-full"
                              style={{ background:`${accent}15`, color:accent,
                                fontFamily:'JetBrains Mono,monospace' }}>
                              {p.category?.split('/')[0]?.trim() || '코드'}
                            </span>
                          </div>
                        )
                      }
                    </div>
                    <div className="p-4">
                      {/* 카테고리 태그 */}
                      {p.category && (
                        <span className="inline-block text-xs px-2 py-0.5 rounded-full mb-2"
                          style={{ background:`${accent}12`, color:accent,
                            fontFamily:'JetBrains Mono,monospace',
                            border:`1px solid ${accent}25` }}>
                          {p.category.split('/')[0].trim()}
                        </span>
                      )}
                      <h3 className="text-sm font-semibold mb-1.5 line-clamp-2"
                        style={{ color:'var(--foreground)', fontFamily:'Sora,sans-serif' }}>
                        {p.title}
                      </h3>
                      <p className="text-xs line-clamp-2 mb-3"
                        style={{ color:'var(--muted-foreground)', fontFamily:'Sora,sans-serif' }}>
                        {p.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-base font-bold"
                          style={{ color:accent, fontFamily:'Orbitron,monospace' }}>
                          ₩{(p.price||0).toLocaleString()}
                        </span>
                        <div className="flex items-center gap-2">
                          {p.salesCount > 0 && (
                            <span className="text-xs" style={{ color:'var(--muted-foreground)' }}>
                              {p.salesCount}판매
                            </span>
                          )}
                          <span className="text-xs px-1.5 py-0.5 rounded"
                            style={{ background:'var(--secondary)',
                              color:'var(--muted-foreground)', fontFamily:'JetBrains Mono,monospace' }}>
                            {p.language?.split(' ')[0] || '코드'}
                          </span>
                        </div>
                      </div>
                      {/* 판매자 */}
                      <div className="mt-3 pt-3 flex items-center gap-2"
                        style={{ borderTop:'1px solid var(--border)' }}>
                        <div className="w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold"
                          style={{ background:`linear-gradient(135deg,${accent},#00d4ff)`,
                            color:'#000', fontFamily:'Orbitron,monospace', flexShrink:0 }}>
                          {(p.nickname||'?')[0].toUpperCase()}
                        </div>
                        <Link to={`/seller/${p.uid}`}
                          onClick={e => e.stopPropagation()}
                          className="text-xs hover:underline"
                          style={{ color:'var(--muted-foreground)', fontFamily:'Sora,sans-serif' }}>
                          {p.nickname || '판매자'}
                        </Link>
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
