// @ts-nocheck
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Download, Star, Copy, Check, User } from 'lucide-react';
import { db, storage, auth, doc, getDoc, addDoc, collection, query, where, getDocs,
  updateDoc, increment, serverTimestamp, ref, getDownloadURL } from '../../lib/firebase';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

function generateLicenseKey() {
  const s = () => Math.floor((1+Math.random())*0x10000).toString(16).substring(1).toUpperCase();
  return `CG-${s()}${s()}-${s()}${s()}-${s()}${s()}-${s()}${s()}`;
}

export default function ProductDetail() {
  const { id } = useParams<{id:string}>();
  const { accentColor, bgColor } = useTheme();
  const { user } = useAuth();
  const nav = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');

  useEffect(() => {
    if (!id) return;
    getDoc(doc(db,'uploads',id)).then(snap => {
      if (snap.exists()) setProduct({ id:snap.id, ...snap.data() });
      setLoading(false);
    });
  }, [id]);

  const handleBuy = async () => {
    if (!user) { nav('/login'); return; }
    if (!product) return;
    setBuying(true);
    try {
      const dupQ = await getDocs(query(collection(db,'purchases'),
        where('buyerUid','==',user.uid), where('uploadId','==',product.id)));
      if (!dupQ.empty) { alert('이미 구매한 상품이에요!'); setBuying(false); return; }
      if (!window.confirm(`"${product.title}"\n₩${(product.price||0).toLocaleString()}에 구매할까요?`)) { setBuying(false); return; }
      const key = generateLicenseKey();
      await addDoc(collection(db,'purchases'), {
        buyerUid: user.uid, buyerNick: user.displayName||user.email,
        uploadId: product.id, title: product.title,
        price: product.price||0, fileUrl: product.fileUrl,
        licenseKey: key, isActive: true, downloadCount: 0,
        purchasedAt: serverTimestamp()
      });
      await updateDoc(doc(db,'uploads',product.id), { salesCount: increment(1) });
      setLicenseKey(key);
      setShowSuccess(true);
    } catch(e:any) { alert('구매 실패: '+e.message); }
    setBuying(false);
  };

  const copyKey = () => {
    navigator.clipboard.writeText(licenseKey).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background:bgColor }}>
      <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor:`${accentColor}30`, borderTopColor:accentColor }} />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background:bgColor }}>
      <div className="text-center">
        <div className="text-4xl mb-4">🔍</div>
        <p className="text-white/40 text-sm" style={{ fontFamily:'Sora,sans-serif' }}>상품을 찾을 수 없어요</p>
        <Link to="/marketplace" className="mt-4 inline-block text-sm" style={{ color:accentColor }}>← 마켓으로</Link>
      </div>
    </div>
  );

  const screens = product.screenshots || [];

  return (
    <div className="min-h-screen px-6 py-8" style={{ background:bgColor }}>
      {/* 배경 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-6" style={{ background:accentColor }} />
      </div>

      <div className="max-w-5xl mx-auto relative">
        <Link to="/marketplace" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 mb-6 transition-colors"
          style={{ fontFamily:'JetBrains Mono,monospace' }}>
          <ArrowLeft className="w-4 h-4" /> 마켓으로 돌아가기
        </Link>

        <div className="grid lg:grid-cols-[1fr,320px] gap-8">
          {/* 왼쪽 */}
          <div>
            {/* 스크린샷 갤러리 */}
            {screens.length > 0 && (
              <div className="mb-6">
                <div className="rounded-2xl overflow-hidden h-56 mb-2"
                  style={{ border:`1px solid rgba(255,255,255,0.08)` }}>
                  <img src={screens[imgIdx]} alt="" className="w-full h-full object-cover" />
                </div>
                {screens.length > 1 && (
                  <div className="flex gap-2">
                    {screens.map((s:string, i:number) => (
                      <button key={i} onClick={() => setImgIdx(i)}
                        className="w-14 h-14 rounded-lg overflow-hidden transition-all"
                        style={{ outline: imgIdx===i ? `2px solid ${accentColor}` : 'none', outlineOffset:'2px' }}>
                        <img src={s} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 태그 + 제목 */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs" style={{ background:`${accentColor}15`,
                color:accentColor, border:`1px solid ${accentColor}30`, fontFamily:'JetBrains Mono,monospace' }}>
                {product.category || '코드'}
              </span>
              {product.language && (
                <span className="px-3 py-1 rounded-full text-xs"
                  style={{ background:'rgba(255,255,255,0.05)', color:'rgba(255,255,255,0.5)',
                    border:'1px solid rgba(255,255,255,0.1)', fontFamily:'JetBrains Mono,monospace' }}>
                  {product.language}
                </span>
              )}
            </div>
            <h1 className="text-xl font-bold text-white mb-3 leading-snug" style={{ fontFamily:'Sora,sans-serif' }}>
              {product.title}
            </h1>
            <p className="text-sm text-white/55 leading-relaxed mb-6" style={{ fontFamily:'Sora,sans-serif', fontWeight:300 }}>
              {product.description}
            </p>

            {/* 파일 정보 */}
            <div className="rounded-xl p-4 mb-4"
              style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-xs text-white/30 uppercase tracking-widest mb-3"
                style={{ fontFamily:'JetBrains Mono,monospace' }}>파일 정보</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  ['파일명', product.fileName || '—'],
                  ['크기', product.fileSize ? `${(product.fileSize/1024).toFixed(0)}KB` : '—'],
                  ['라이선스', product.license || '일반 상업용'],
                  ['판매', `${product.salesCount||0}건`],
                ].map(([k,v]) => (
                  <div key={k}>
                    <span className="text-white/30" style={{ fontFamily:'JetBrains Mono,monospace' }}>{k}</span>
                    <span className="text-white/70 ml-2" style={{ fontFamily:'Sora,sans-serif' }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 오른쪽 — 구매 카드 */}
          <div>
            <div className="sticky top-24 rounded-2xl p-6"
              style={{ background:'rgba(255,255,255,0.04)', border:`1px solid ${accentColor}20`,
                backdropFilter:'blur(24px)', boxShadow:`0 20px 60px rgba(0,0,0,0.6)` }}>
              <div className="text-3xl font-bold mb-4" style={{ color:accentColor, fontFamily:'Orbitron,monospace' }}>
                ₩{(product.price||0).toLocaleString()}
              </div>
              <div className="space-y-2 mb-5 text-xs">
                {[['라이선스', product.license||'일반 상업용'],['실행환경', product.language||'—']].map(([k,v]) => (
                  <div key={k} className="flex justify-between py-2" style={{ borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                    <span className="text-white/40" style={{ fontFamily:'Sora,sans-serif' }}>{k}</span>
                    <span className="text-white/70" style={{ fontFamily:'Sora,sans-serif' }}>{v}</span>
                  </div>
                ))}
              </div>
              <button onClick={handleBuy} disabled={buying}
                className="w-full py-3.5 rounded-xl text-sm font-semibold mb-3 transition-all"
                style={{ background:`linear-gradient(135deg,${accentColor},#00d4ff)`, color:'#000',
                  fontFamily:'Sora,sans-serif', opacity: buying ? 0.7 : 1 }}>
                {buying ? '처리 중...' : '🛒 지금 구매하기'}
              </button>

              {/* 판매자 */}
              <div className="pt-4" style={{ borderTop:'1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-xs text-white/30 mb-2 uppercase tracking-widest"
                  style={{ fontFamily:'JetBrains Mono,monospace' }}>판매자</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                    style={{ background:`linear-gradient(135deg,${accentColor},#00d4ff)`, color:'#000',
                      fontFamily:'Orbitron,monospace' }}>
                    {(product.nickname||'?')[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm text-white/80" style={{ fontFamily:'Sora,sans-serif' }}>{product.nickname||'판매자'}</div>
                    <div className="text-xs" style={{ color:accentColor, fontFamily:'JetBrains Mono,monospace' }}>⭐ 인증 판매자</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 구매 완료 팝업 */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-lg px-4">
          <motion.div initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }}
            className="w-full max-w-sm rounded-2xl p-8 text-center"
            style={{ background:'rgba(6,8,18,0.95)', border:`1px solid ${accentColor}25`,
              boxShadow:`0 40px 100px rgba(0,0,0,0.9)` }}>
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily:'Sora,sans-serif' }}>구매 완료!</h3>
            <p className="text-xs text-white/40 mb-5" style={{ fontFamily:'Sora,sans-serif' }}>라이선스 키가 발급됐어요</p>
            <div className="rounded-xl p-4 mb-5" style={{ background:'rgba(0,245,196,0.05)', border:`1px solid ${accentColor}25` }}>
              <p className="text-xs text-white/40 mb-2" style={{ fontFamily:'JetBrains Mono,monospace' }}>LICENSE KEY</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs break-all" style={{ color:accentColor, fontFamily:'JetBrains Mono,monospace' }}>
                  {licenseKey}
                </code>
                <button onClick={copyKey} className="flex-shrink-0 p-1.5 rounded-lg transition-colors"
                  style={{ background:'rgba(255,255,255,0.06)' }}>
                  {copied ? <Check className="w-4 h-4" style={{ color:accentColor }} /> : <Copy className="w-4 h-4 text-white/40" />}
                </button>
              </div>
            </div>
            <div className="flex gap-3">
              <a href={product.fileUrl} target="_blank" rel="noreferrer"
                className="flex-1 py-3 rounded-xl text-sm font-semibold"
                style={{ background:`linear-gradient(135deg,${accentColor},#00d4ff)`, color:'#000', fontFamily:'Sora,sans-serif' }}>
                <Download className="w-4 h-4 inline mr-1" />다운로드
              </a>
              <Link to="/mypage" onClick={() => setShowSuccess(false)}
                className="flex-1 py-3 rounded-xl text-sm text-center"
                style={{ background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.6)', fontFamily:'Sora,sans-serif' }}>
                마이페이지
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
