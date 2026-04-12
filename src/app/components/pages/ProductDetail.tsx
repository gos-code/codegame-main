// @ts-nocheck
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Download, Copy, Check, Shield, Package, Code2, ChevronLeft, ChevronRight } from 'lucide-react';
import { db, doc, getDoc, addDoc, collection, query, where, getDocs,
  updateDoc, increment, serverTimestamp } from '../../../lib/firebase';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

// ── SHA256 기반 라이선스 키 생성 ──────────────────────────────────────
async function generateLicenseKey(productId: string, buyerUid: string): Promise<string> {
  const SECRET = 'codegame_license_v1_secret';
  const raw = `${productId}::${buyerUid}::${SECRET}`;
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw));
  const hex = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('').toUpperCase();
  // CG-XXXX-XXXX-XXXX-XXXX 형식
  return `CG-${hex.slice(0,4)}-${hex.slice(4,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}`;
}

export default function ProductDetail() {
  const { id } = useParams<{id:string}>();
  const { accentColor, theme } = useTheme();
  const { user } = useAuth();
  const nav = useNavigate();
  const isDark = theme === 'dark';

  const [product, setProduct]       = useState<any>(null);
  const [loading, setLoading]       = useState(true);
  const [buying, setBuying]         = useState(false);
  const [imgIdx, setImgIdx]         = useState(0);
  const [copied, setCopied]         = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');
  const [alreadyBought, setAlreadyBought] = useState(false);
  const [existingPurchase, setExistingPurchase] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    getDoc(doc(db,'uploads',id)).then(snap => {
      if (snap.exists()) setProduct({ id:snap.id, ...snap.data() });
      setLoading(false);
    });
  }, [id]);

  // 이미 구매했는지 확인
  useEffect(() => {
    if (!user || !id) return;
    getDocs(query(collection(db,'purchases'),
      where('buyerUid','==',user.uid), where('uploadId','==',id)))
      .then(snap => {
        if (!snap.empty) {
          setAlreadyBought(true);
          setExistingPurchase({ id:snap.docs[0].id, ...snap.docs[0].data() });
        }
      });
  }, [user, id]);

  const handleBuy = async () => {
    if (!user) { nav('/login'); return; }
    if (!product) return;
    if (alreadyBought) { alert('이미 구매한 상품이에요!'); return; }
    if (!window.confirm(`"${product.title}"\n₩${(product.price||0).toLocaleString()}에 구매할까요?`)) return;
    setBuying(true);
    try {
      const key = await generateLicenseKey(product.id, user.uid);
      // 유효기간: 구매일 + 1년
      const expiry = new Date();
      expiry.setFullYear(expiry.getFullYear() + 1);
      await addDoc(collection(db,'purchases'), {
        buyerUid: user.uid,
        buyerNick: user.displayName || user.email,
        uploadId: product.id,
        title: product.title,
        price: product.price || 0,
        fileUrl: product.fileUrl,
        licenseKey: key,
        isActive: true,
        downloadCount: 0,
        expiresAt: expiry.toISOString(),
        purchasedAt: serverTimestamp(),
      });
      await updateDoc(doc(db,'uploads',product.id), {
        salesCount: increment(1),
        revenue: increment(Math.round((product.price||0) * 0.8)),
      });
      setLicenseKey(key);
      setShowSuccess(true);
      setAlreadyBought(true);
    } catch(e:any) { alert('구매 실패: '+e.message); }
    setBuying(false);
  };

  const handleDownload = async (fileUrl: string, purchaseId?: string) => {
    if (!fileUrl) { alert('다운로드 링크가 없어요'); return; }
    if (purchaseId) {
      await updateDoc(doc(db,'purchases',purchaseId), { downloadCount: increment(1) }).catch(()=>{});
    }
    try {
      // Firebase Storage는 크로스 오리진이라 fetch로 blob 변환 후 다운로드
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error('다운로드 실패');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = product?.fileName || 'download';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch(e) {
      // fetch 실패 시 새 탭으로 열기 (fallback)
      window.open(fileUrl, '_blank');
    }
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    });
  };

  const screens = product?.screenshots || [];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background:'var(--background)' }}>
      <div className="w-8 h-8 border-2 rounded-full animate-spin"
        style={{ borderColor:`${accentColor}30`, borderTopColor:accentColor }} />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background:'var(--background)' }}>
      <div className="text-center">
        <div className="text-4xl mb-4">🔍</div>
        <p className="text-sm mb-4" style={{ color:'var(--muted-foreground)', fontFamily:'Sora,sans-serif' }}>
          상품을 찾을 수 없어요
        </p>
        <Link to="/marketplace" style={{ color:accentColor, fontFamily:'Sora,sans-serif', fontSize:14 }}>
          ← 마켓으로
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen px-4 py-8" style={{ background:'var(--background)' }}>
      <div className="max-w-5xl mx-auto">

        {/* 뒤로가기 */}
        <Link to="/marketplace"
          className="inline-flex items-center gap-2 text-sm mb-6 transition-colors"
          style={{ color:'var(--muted-foreground)', fontFamily:'JetBrains Mono,monospace' }}>
          <ArrowLeft className="w-4 h-4" /> 마켓으로 돌아가기
        </Link>

        <div className="grid lg:grid-cols-[1fr,300px] gap-8">

          {/* ── 왼쪽 ── */}
          <div>
            {/* 이미지 갤러리 */}
            {screens.length > 0 ? (
              <div className="mb-6">
                <div className="relative rounded-2xl overflow-hidden mb-3"
                  style={{ height:320, background:'var(--card)', border:'1px solid var(--border)' }}>
                  <img src={screens[imgIdx]} alt=""
                    className="w-full h-full object-contain" />
                  {screens.length > 1 && (
                    <>
                      <button onClick={() => setImgIdx(p => (p-1+screens.length)%screens.length)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all"
                        style={{ background:'rgba(0,0,0,0.5)', color:'#fff', border:'none', cursor:'pointer' }}>
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button onClick={() => setImgIdx(p => (p+1)%screens.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all"
                        style={{ background:'rgba(0,0,0,0.5)', color:'#fff', border:'none', cursor:'pointer' }}>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      {/* 인디케이터 */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {screens.map((_:string, i:number) => (
                          <button key={i} onClick={() => setImgIdx(i)}
                            style={{ width: imgIdx===i ? 16 : 6, height:6, borderRadius:3,
                              background: imgIdx===i ? accentColor : 'rgba(255,255,255,0.3)',
                              border:'none', cursor:'pointer', transition:'all 0.2s' }} />
                        ))}
                      </div>
                    </>
                  )}
                </div>
                {/* 썸네일 */}
                {screens.length > 1 && (
                  <div className="flex gap-2 flex-wrap">
                    {screens.map((s:string, i:number) => (
                      <button key={i} onClick={() => setImgIdx(i)}
                        className="w-16 h-16 rounded-xl overflow-hidden transition-all"
                        style={{ outline: imgIdx===i ? `2px solid ${accentColor}` : '2px solid transparent',
                          outlineOffset:'2px', border:'none', cursor:'pointer' }}>
                        <img src={s} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* 스크린샷 없을 때 플레이스홀더 */
              <div className="rounded-2xl mb-6 flex items-center justify-center"
                style={{ height:200, background:'var(--card)', border:'1px solid var(--border)' }}>
                <div className="text-center">
                  <Code2 className="w-12 h-12 mx-auto mb-3" style={{ color:'var(--muted-foreground)' }} />
                  <p className="text-sm" style={{ color:'var(--muted-foreground)', fontFamily:'Sora,sans-serif' }}>
                    미리보기 이미지 없음
                  </p>
                </div>
              </div>
            )}

            {/* 태그 */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {product.category && (
                <span className="px-3 py-1 rounded-full text-xs"
                  style={{ background:`${accentColor}15`, color:accentColor,
                    border:`1px solid ${accentColor}30`, fontFamily:'JetBrains Mono,monospace' }}>
                  {product.category}
                </span>
              )}
              {product.language && (
                <span className="px-3 py-1 rounded-full text-xs"
                  style={{ background:'var(--secondary)', color:'var(--muted-foreground)',
                    border:'1px solid var(--border)', fontFamily:'JetBrains Mono,monospace' }}>
                  {product.language}
                </span>
              )}
              {product.license && (
                <span className="px-3 py-1 rounded-full text-xs"
                  style={{ background:'var(--secondary)', color:'var(--muted-foreground)',
                    border:'1px solid var(--border)', fontFamily:'JetBrains Mono,monospace' }}>
                  {product.license}
                </span>
              )}
            </div>

            {/* 제목 */}
            <h1 className="text-2xl font-bold mb-3 leading-snug"
              style={{ fontFamily:'Sora,sans-serif', color:'var(--foreground)' }}>
              {product.title}
            </h1>

            {/* 설명 */}
            <p className="text-sm leading-relaxed mb-6"
              style={{ fontFamily:'Sora,sans-serif', fontWeight:300,
                color:'var(--muted-foreground)', whiteSpace:'pre-wrap' }}>
              {product.description}
            </p>

            {/* 파일 정보 */}
            <div className="rounded-xl p-5 mb-4"
              style={{ background:'var(--card)', border:'1px solid var(--border)' }}>
              <p className="text-xs uppercase tracking-widest mb-4"
                style={{ fontFamily:'JetBrains Mono,monospace', color:'var(--muted-foreground)' }}>
                파일 정보
              </p>
              <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
                {[
                  ['파일명', product.fileName || '—'],
                  ['크기', product.fileSize ? `${(product.fileSize/1024/1024).toFixed(2)}MB` : '—'],
                  ['라이선스', product.license || '일반 상업용'],
                  ['판매 건수', `${product.salesCount||0}건`],
                  ['언어/도구', product.language || '—'],
                  ['카테고리', product.category || '—'],
                ].map(([k,v]) => (
                  <div key={k} className="flex flex-col gap-1">
                    <span className="text-xs" style={{ color:'var(--muted-foreground)', fontFamily:'JetBrains Mono,monospace' }}>{k}</span>
                    <span className="font-medium" style={{ color:'var(--foreground)', fontFamily:'Sora,sans-serif' }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 이미 구매한 경우 다운로드 버튼 */}
            {alreadyBought && existingPurchase && (
              <div className="rounded-xl p-5"
                style={{ background:`${accentColor}08`, border:`1px solid ${accentColor}25` }}>
                <p className="text-xs uppercase tracking-widest mb-3"
                  style={{ fontFamily:'JetBrains Mono,monospace', color:accentColor }}>
                  ✅ 구매 완료된 상품
                </p>
                <div className="mb-3">
                  <p className="text-xs mb-1" style={{ color:'var(--muted-foreground)', fontFamily:'JetBrains Mono,monospace' }}>
                    LICENSE KEY
                  </p>
                  <div className="flex items-center gap-2 p-3 rounded-lg"
                    style={{ background:'var(--card)', border:`1px solid ${accentColor}20` }}>
                    <code className="flex-1 text-xs break-all"
                      style={{ color:accentColor, fontFamily:'JetBrains Mono,monospace' }}>
                      {existingPurchase.licenseKey || '—'}
                    </code>
                    {existingPurchase.licenseKey && (
                      <button onClick={() => copyKey(existingPurchase.licenseKey)}
                        style={{ background:'none', border:'none', cursor:'pointer', flexShrink:0 }}>
                        {copied ? <Check className="w-4 h-4" style={{ color:accentColor }} />
                          : <Copy className="w-4 h-4" style={{ color:'var(--muted-foreground)' }} />}
                      </button>
                    )}
                  </div>
                </div>
                <button onClick={() => handleDownload(existingPurchase.fileUrl, existingPurchase.id)}
                  className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                  style={{ background:`linear-gradient(135deg,${accentColor},#00d4ff)`,
                    color:'#000', fontFamily:'Sora,sans-serif', border:'none', cursor:'pointer' }}>
                  <Download className="w-4 h-4" /> 파일 다운로드
                </button>
              </div>
            )}
          </div>

          {/* ── 오른쪽: 구매 카드 ── */}
          <div>
            <div className="sticky top-24 rounded-2xl p-6"
              style={{ background:'var(--card)', border:`1px solid ${accentColor}20`,
                boxShadow:`0 20px 60px rgba(0,0,0,0.15)` }}>

              {/* 가격 */}
              <div className="text-3xl font-bold mb-1"
                style={{ color:accentColor, fontFamily:'Orbitron,monospace' }}>
                ₩{(product.price||0).toLocaleString()}
              </div>
              <p className="text-xs mb-5" style={{ color:'var(--muted-foreground)', fontFamily:'Sora,sans-serif' }}>
                부가세 포함 · 영구 소유
              </p>

              {/* 혜택 목록 */}
              <div className="space-y-2 mb-5">
                {[
                  { icon:'⬇', text:'즉시 다운로드' },
                  { icon:'🔑', text:'라이선스 키 발급' },
                  { icon:'♾', text:'영구 소유' },
                  { icon:'🔄', text:'업데이트 포함' },
                ].map(item => (
                  <div key={item.text} className="flex items-center gap-2 text-xs"
                    style={{ fontFamily:'Sora,sans-serif', color:'var(--foreground)' }}>
                    <span>{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="mb-5 pt-4" style={{ borderTop:'1px solid var(--border)' }}>
                <div className="flex justify-between text-xs py-2" style={{ borderBottom:'1px solid var(--border)' }}>
                  <span style={{ color:'var(--muted-foreground)', fontFamily:'Sora,sans-serif' }}>라이선스</span>
                  <span style={{ color:'var(--foreground)', fontFamily:'Sora,sans-serif' }}>{product.license||'일반 상업용'}</span>
                </div>
                <div className="flex justify-between text-xs py-2">
                  <span style={{ color:'var(--muted-foreground)', fontFamily:'Sora,sans-serif' }}>실행환경</span>
                  <span style={{ color:'var(--foreground)', fontFamily:'Sora,sans-serif' }}>{product.language||'—'}</span>
                </div>
              </div>

              {/* 구매 버튼 */}
              {alreadyBought ? (
                <button onClick={() => handleDownload(existingPurchase?.fileUrl, existingPurchase?.id)}
                  className="w-full py-3.5 rounded-xl text-sm font-semibold mb-3 flex items-center justify-center gap-2"
                  style={{ background:`linear-gradient(135deg,${accentColor},#00d4ff)`,
                    color:'#000', fontFamily:'Sora,sans-serif', border:'none', cursor:'pointer' }}>
                  <Download className="w-4 h-4" /> 다운로드
                </button>
              ) : (
                <button onClick={handleBuy} disabled={buying}
                  className="w-full py-3.5 rounded-xl text-sm font-semibold mb-3 transition-all"
                  style={{ background:`linear-gradient(135deg,${accentColor},#00d4ff)`,
                    color:'#000', fontFamily:'Sora,sans-serif',
                    border:'none', cursor: buying ? 'not-allowed' : 'pointer',
                    opacity: buying ? 0.7 : 1 }}>
                  {buying ? '처리 중...' : '🛒 지금 구매하기'}
                </button>
              )}

              {/* 보안 안내 */}
              <div className="flex items-center justify-center gap-2 text-xs"
                style={{ color:'var(--muted-foreground)', fontFamily:'Sora,sans-serif' }}>
                <Shield className="w-3.5 h-3.5" />
                <span>안전한 결제 · 환불 정책 적용</span>
              </div>

              {/* 판매자 */}
              <div className="mt-5 pt-4" style={{ borderTop:'1px solid var(--border)' }}>
                <p className="text-xs uppercase tracking-widest mb-3"
                  style={{ fontFamily:'JetBrains Mono,monospace', color:'var(--muted-foreground)' }}>
                  판매자
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold"
                    style={{ background:`linear-gradient(135deg,${accentColor},#00d4ff)`,
                      color:'#000', fontFamily:'Orbitron,monospace', flexShrink:0 }}>
                    {(product.nickname||'?')[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-medium"
                      style={{ fontFamily:'Sora,sans-serif', color:'var(--foreground)' }}>
                      {product.nickname || '판매자'}
                    </div>
                    <div className="text-xs" style={{ color:accentColor, fontFamily:'JetBrains Mono,monospace' }}>
                      ✓ 인증 판매자
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 구매 완료 팝업 ── */}
      <AnimatePresence>
        {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-lg px-4">
            <motion.div initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }}
              exit={{ scale:0.9, opacity:0 }}
              className="w-full max-w-sm rounded-2xl p-8 text-center"
              style={{ background:'var(--card)', border:`1px solid ${accentColor}25`,
                boxShadow:`0 40px 100px rgba(0,0,0,0.5)` }}>
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-lg font-bold mb-1"
                style={{ fontFamily:'Sora,sans-serif', color:'var(--foreground)' }}>
                구매 완료!
              </h3>
              <p className="text-xs mb-5"
                style={{ fontFamily:'Sora,sans-serif', color:'var(--muted-foreground)' }}>
                라이선스 키가 발급됐어요
              </p>

              {/* 라이선스 키 */}
              <div className="rounded-xl p-4 mb-5"
                style={{ background:`${accentColor}08`, border:`1px solid ${accentColor}25` }}>
                <p className="text-xs mb-2"
                  style={{ fontFamily:'JetBrains Mono,monospace', color:'var(--muted-foreground)' }}>
                  LICENSE KEY
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs break-all text-left"
                    style={{ color:accentColor, fontFamily:'JetBrains Mono,monospace' }}>
                    {licenseKey}
                  </code>
                  <button onClick={() => copyKey(licenseKey)}
                    className="flex-shrink-0 p-1.5 rounded-lg transition-colors"
                    style={{ background:'var(--secondary)', border:'none', cursor:'pointer' }}>
                    {copied
                      ? <Check className="w-4 h-4" style={{ color:accentColor }} />
                      : <Copy className="w-4 h-4" style={{ color:'var(--muted-foreground)' }} />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => handleDownload(product.fileUrl)}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5"
                  style={{ background:`linear-gradient(135deg,${accentColor},#00d4ff)`,
                    color:'#000', fontFamily:'Sora,sans-serif', border:'none', cursor:'pointer' }}>
                  <Download className="w-4 h-4" /> 다운로드
                </button>
                <Link to="/mypage" onClick={() => setShowSuccess(false)}
                  className="flex-1 py-3 rounded-xl text-sm text-center flex items-center justify-center"
                  style={{ background:'var(--secondary)', color:'var(--foreground)',
                    fontFamily:'Sora,sans-serif', textDecoration:'none' }}>
                  마이페이지
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
