// @ts-nocheck
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, X, Check, ChevronRight, ChevronLeft, Calculator } from 'lucide-react';
import { useNavigate } from 'react-router';
import { db, storage, auth, addDoc, collection, doc, updateDoc, increment,
  serverTimestamp, ref, uploadBytesResumable, getDownloadURL } from '../../lib/firebase';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

const STEPS = ['기본 정보', '파일 업로드', '가격 설정'];
const LICENSES = ['일반 상업용','완전 독점','팀 라이선스','오픈소스 (MIT)'];
const CATEGORIES = ['스마트스토어 / 커머스','유튜브 / 쇼츠','GPT / AI','Google Sheets','n8n / Make','크롤링','데이터 처리','기타'];

export default function Sell() {
  const { accentColor, bgColor } = useTheme();
  const { user, profile } = useAuth();
  const nav = useNavigate();
  const [step, setStep] = useState(0);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [desc, setDesc] = useState('');
  const [lang, setLang] = useState('');
  const [license, setLicense] = useState(LICENSES[0]);
  const [price, setPrice] = useState('');
  const [file, setFile] = useState<File|null>(null);
  const [screenshots, setScreenshots] = useState<File[]>([]);
  const [screenshotPreviews, setScreenshotPreviews] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCalc, setShowCalc] = useState(false);
  const [calcQty, setCalcQty] = useState(50);

  const fileRef = useRef<HTMLInputElement>(null);
  const ssRef = useRef<HTMLInputElement>(null);

  const handleScreenshots = (files: FileList) => {
    const arr = Array.from(files).slice(0,5);
    setScreenshots(arr);
    setScreenshotPreviews(arr.map(f => URL.createObjectURL(f)));
  };

  const removeScreenshot = (i: number) => {
    setScreenshots(p => p.filter((_,j)=>j!==i));
    setScreenshotPreviews(p => p.filter((_,j)=>j!==i));
  };

  const uploadFile = (storageRef: any, f: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const task = uploadBytesResumable(storageRef, f);
      task.on('state_changed',
        snap => setProgress(Math.round(snap.bytesTransferred/snap.totalBytes*100)),
        reject,
        () => getDownloadURL(storageRef).then(resolve).catch(reject)
      );
    });

  const handleSubmit = async () => {
    if (!user) { nav('/login'); return; }
    if (!file) { alert('파일을 선택해주세요'); return; }
    if (!title.trim()) { alert('상품명을 입력해주세요'); return; }
    setUploading(true); setProgress(0);
    try {
      const nick = (profile?.nickname||user.email?.split('@')[0]||'user').replace(/[^a-zA-Z0-9가-힣]/g,'_').substring(0,15);
      const safeName = title.replace(/[^a-zA-Z0-9가-힣]/g,'_').substring(0,30);
      const ts = Date.now();
      const path = `uploads/${nick}_${safeName}_${ts}_${file.name}`;
      const fileUrl = await uploadFile(ref(storage, path), file);
      const ssUrls: string[] = [];
      for(let i=0; i<screenshots.length; i++) {
        const sPath = `screenshots/${nick}_${safeName}_${ts}_${i}_${screenshots[i].name}`;
        const ssUrl = await uploadFile(ref(storage, sPath), screenshots[i]);
        ssUrls.push(ssUrl);
        setProgress(0);
      }
      await addDoc(collection(db,'uploads'), {
        uid: user.uid, nickname: profile?.nickname||user.email,
        title, description: desc, category, language: lang,
        license, price: parseInt(price)||0,
        fileName: file.name, fileSize: file.size,
        fileUrl, storagePath: path, screenshots: ssUrls,
        status: 'pending', salesCount: 0, revenue: 0,
        createdAt: serverTimestamp()
      });
      await updateDoc(doc(db,'users',user.uid), { totalUploads: increment(1) }).catch(()=>{});
      setShowSuccess(true);
    } catch(e:any) { alert('업로드 실패: '+e.message); }
    setUploading(false);
  };

  const earnings = price ? Math.round(parseInt(price)*0.8) : 0;

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background:bgColor }}>
      <div className="text-center">
        <p className="text-white/50 text-sm mb-4" style={{ fontFamily:'Sora,sans-serif' }}>로그인이 필요해요</p>
        <button onClick={() => nav('/login')}
          className="px-6 py-3 rounded-xl text-sm font-semibold"
          style={{ background:`linear-gradient(135deg,${accentColor},#00d4ff)`, color:'#000', fontFamily:'Sora,sans-serif' }}>
          로그인하기
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen px-6 py-8" style={{ background:bgColor }}>
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily:'Sora,sans-serif' }}>코드 판매하기</h1>
          <p className="text-sm text-white/40" style={{ fontFamily:'Sora,sans-serif' }}>판매 수익의 80%가 바로 지급돼요</p>
        </div>

        {/* 스텝 표시 */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                  style={{ background: i<=step ? accentColor : 'rgba(255,255,255,0.06)',
                    color: i<=step ? '#000' : 'rgba(255,255,255,0.3)',
                    fontFamily:'Orbitron,monospace' }}>
                  {i<step ? <Check className="w-3.5 h-3.5" /> : i+1}
                </div>
                <span className="text-xs" style={{ color: i===step ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)',
                  fontFamily:'Sora,sans-serif' }}>{s}</span>
              </div>
              {i<STEPS.length-1 && <div className="w-8 h-px" style={{ background:'rgba(255,255,255,0.1)' }} />}
            </div>
          ))}
        </div>

        {/* 카드 */}
        <div className="rounded-2xl p-6"
          style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', backdropFilter:'blur(20px)' }}>

          {/* STEP 0: 기본 정보 */}
          {step===0 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-white/40 mb-2 uppercase tracking-widest"
                  style={{ fontFamily:'JetBrains Mono,monospace' }}>상품명 *</label>
                <input value={title} onChange={e=>setTitle(e.target.value)}
                  placeholder="예: 스마트스토어 주문 자동 처리 봇 v2.0"
                  className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/25 outline-none"
                  style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', fontFamily:'Sora,sans-serif' }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-white/40 mb-2 uppercase tracking-widest" style={{ fontFamily:'JetBrains Mono,monospace' }}>카테고리</label>
                  <select value={category} onChange={e=>setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none"
                    style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', fontFamily:'Sora,sans-serif' }}>
                    {CATEGORIES.map(c => <option key={c} value={c} style={{ background:'#06080f' }}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-2 uppercase tracking-widest" style={{ fontFamily:'JetBrains Mono,monospace' }}>언어/도구</label>
                  <input value={lang} onChange={e=>setLang(e.target.value)} placeholder="예: Python 3.11"
                    className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/25 outline-none"
                    style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', fontFamily:'Sora,sans-serif' }} />
                </div>
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-2 uppercase tracking-widest" style={{ fontFamily:'JetBrains Mono,monospace' }}>상품 설명 *</label>
                <textarea value={desc} onChange={e=>setDesc(e.target.value)} rows={4}
                  placeholder="어떤 문제를 해결하는지, 어떻게 사용하는지 구체적으로 설명해주세요."
                  className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/25 outline-none resize-none"
                  style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', fontFamily:'Sora,sans-serif' }} />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-2 uppercase tracking-widest" style={{ fontFamily:'JetBrains Mono,monospace' }}>라이선스</label>
                <div className="grid grid-cols-2 gap-2">
                  {LICENSES.map(l => (
                    <button key={l} onClick={()=>setLicense(l)}
                      className="px-3 py-2.5 rounded-xl text-xs text-left transition-all"
                      style={{ background: license===l ? `${accentColor}15` : 'rgba(255,255,255,0.03)',
                        border: license===l ? `1px solid ${accentColor}40` : '1px solid rgba(255,255,255,0.08)',
                        color: license===l ? accentColor : 'rgba(255,255,255,0.55)', fontFamily:'Sora,sans-serif' }}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: 파일 업로드 */}
          {step===1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs text-white/40 mb-2 uppercase tracking-widest" style={{ fontFamily:'JetBrains Mono,monospace' }}>메인 파일 *</label>
                <input ref={fileRef} type="file" accept=".py,.js,.ts,.json,.zip,.ipynb,.html,.sh,.txt" className="hidden"
                  onChange={e=>e.target.files?.[0] && setFile(e.target.files[0])} />
                {file ? (
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
                    style={{ background:`${accentColor}08`, border:`1px solid ${accentColor}25` }}>
                    <span className="text-sm text-white/80 flex-1 truncate" style={{ fontFamily:'JetBrains Mono,monospace' }}>{file.name}</span>
                    <span className="text-xs text-white/40">{(file.size/1024).toFixed(0)}KB</span>
                    <button onClick={()=>setFile(null)} className="text-white/30 hover:text-red-400"><X className="w-4 h-4" /></button>
                  </div>
                ) : (
                  <button onClick={()=>fileRef.current?.click()}
                    className="w-full py-10 rounded-xl flex flex-col items-center gap-3 transition-all hover:border-white/20"
                    style={{ border:'1px dashed rgba(0,245,196,0.2)', background:'rgba(0,245,196,0.02)' }}>
                    <Upload className="w-8 h-8" style={{ color:accentColor }} />
                    <div className="text-sm text-white/60" style={{ fontFamily:'Sora,sans-serif' }}>
                      <span style={{ color:accentColor }}>클릭</span> 또는 드래그해서 파일 업로드
                    </div>
                    <div className="text-xs text-white/25" style={{ fontFamily:'JetBrains Mono,monospace' }}>.py .js .ts .json .zip .ipynb · 최대 50MB</div>
                  </button>
                )}
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-2 uppercase tracking-widest" style={{ fontFamily:'JetBrains Mono,monospace' }}>스크린샷 (선택 · 최대 5장)</label>
                <input ref={ssRef} type="file" accept="image/*" multiple className="hidden"
                  onChange={e=>e.target.files && handleScreenshots(e.target.files)} />
                <div className="flex gap-2 flex-wrap">
                  {screenshotPreviews.map((p, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden"
                      style={{ border:'1px solid rgba(255,255,255,0.1)' }}>
                      <img src={p} alt="" className="w-full h-full object-cover" />
                      <button onClick={()=>removeScreenshot(i)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center">
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ))}
                  {screenshotPreviews.length < 5 && (
                    <button onClick={()=>ssRef.current?.click()}
                      className="w-20 h-20 rounded-xl flex items-center justify-center transition-all"
                      style={{ border:'1px dashed rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.02)' }}>
                      <Upload className="w-6 h-6 text-white/25" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: 가격 설정 */}
          {step===2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs text-white/40 mb-2 uppercase tracking-widest" style={{ fontFamily:'JetBrains Mono,monospace' }}>판매 가격 (원) *</label>
                <input type="number" value={price} onChange={e=>setPrice(e.target.value)} placeholder="예: 29000"
                  className="w-full px-4 py-3 rounded-xl text-lg font-bold text-white placeholder-white/25 outline-none"
                  style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)',
                    fontFamily:'Orbitron,monospace', color:accentColor }} />
                <p className="text-xs text-white/30 mt-1.5" style={{ fontFamily:'Sora,sans-serif' }}>
                  추천: 자동화 워크플로우 15,000~50,000원 / 기능 모듈 5,000~20,000원
                </p>
              </div>

              {price && parseInt(price) > 0 && (
                <div className="rounded-xl p-4"
                  style={{ background:`${accentColor}06`, border:`1px solid ${accentColor}18` }}>
                  <div className="text-xs text-white/30 mb-3 uppercase tracking-widest" style={{ fontFamily:'JetBrains Mono,monospace' }}>수익 예상</div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label:'건당 수익(80%)', val:`₩${earnings.toLocaleString()}` },
                      { label:'10건 판매시', val:`₩${(earnings*10).toLocaleString()}` },
                      { label:'100건 판매시', val:`₩${(earnings*100).toLocaleString()}` },
                    ].map(s => (
                      <div key={s.label} className="text-center rounded-lg py-3"
                        style={{ background:'rgba(255,255,255,0.04)' }}>
                        <div className="text-base font-bold" style={{ color:accentColor, fontFamily:'Orbitron,monospace' }}>{s.val}</div>
                        <div className="text-xs text-white/30 mt-1" style={{ fontFamily:'Sora,sans-serif' }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={()=>setShowCalc(true)}
                className="w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all"
                style={{ background:'rgba(139,92,246,0.08)', border:'1px solid rgba(139,92,246,0.2)',
                  color:'#a78bff', fontFamily:'Sora,sans-serif' }}>
                <Calculator className="w-4 h-4" />수익 시뮬레이터
              </button>

              {/* 업로드 진행 */}
              {uploading && (
                <div className="rounded-xl p-4" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
                  <div className="flex justify-between text-xs text-white/50 mb-2" style={{ fontFamily:'JetBrains Mono,monospace' }}>
                    <span>업로드 중...</span><span>{progress}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background:'rgba(255,255,255,0.08)' }}>
                    <div className="h-full rounded-full transition-all"
                      style={{ width:`${progress}%`, background:`linear-gradient(90deg,${accentColor},#00d4ff)`,
                        boxShadow:`0 0 10px ${accentColor}60` }} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 버튼 */}
          <div className="flex gap-3 mt-6">
            {step > 0 && (
              <button onClick={()=>setStep(p=>p-1)}
                className="flex items-center gap-1.5 px-4 py-3 rounded-xl text-sm transition-all"
                style={{ background:'rgba(255,255,255,0.05)', color:'rgba(255,255,255,0.6)', fontFamily:'Sora,sans-serif' }}>
                <ChevronLeft className="w-4 h-4" />이전
              </button>
            )}
            {step < STEPS.length-1 ? (
              <button onClick={()=>setStep(p=>p+1)}
                className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-sm font-semibold"
                style={{ background:`linear-gradient(135deg,${accentColor},#00d4ff)`, color:'#000', fontFamily:'Sora,sans-serif' }}>
                다음 단계<ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={uploading}
                className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{ background:`linear-gradient(135deg,${accentColor},#00d4ff)`, color:'#000',
                  fontFamily:'Sora,sans-serif', opacity: uploading ? 0.7 : 1 }}>
                {uploading ? `UPLOADING... ${progress}%` : '검수 신청하기 🚀'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 수익 시뮬레이터 모달 */}
      <AnimatePresence>
        {showCalc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-lg px-4">
            <motion.div initial={{ scale:0.95, opacity:0 }} animate={{ scale:1, opacity:1 }}
              exit={{ scale:0.95, opacity:0 }}
              className="w-full max-w-sm rounded-2xl p-6"
              style={{ background:'rgba(6,8,18,0.95)', border:`1px solid ${accentColor}25` }}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-white" style={{ fontFamily:'Sora,sans-serif' }}>수익 시뮬레이터</h3>
                <button onClick={()=>setShowCalc(false)} className="text-white/30"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-white/40 mb-2 block" style={{ fontFamily:'JetBrains Mono,monospace' }}>
                    월 판매량: <span style={{ color:accentColor }}>{calcQty}건</span>
                  </label>
                  <input type="range" min={1} max={500} value={calcQty} onChange={e=>setCalcQty(+e.target.value)}
                    className="w-full" style={{ accentColor }} />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label:'월 수익', val: `₩${(earnings*calcQty).toLocaleString()}` },
                    { label:'연 수익', val: `₩${(earnings*calcQty*12).toLocaleString()}` },
                    { label:'건당', val: `₩${earnings.toLocaleString()}` },
                  ].map(s => (
                    <div key={s.label} className="text-center rounded-xl py-3"
                      style={{ background:'rgba(255,255,255,0.04)' }}>
                      <div className="text-sm font-bold" style={{ color:accentColor, fontFamily:'Orbitron,monospace' }}>{s.val}</div>
                      <div className="text-xs text-white/30 mt-1" style={{ fontFamily:'Sora,sans-serif' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={()=>setShowCalc(false)}
                className="w-full mt-5 py-3 rounded-xl text-sm font-semibold"
                style={{ background:`linear-gradient(135deg,${accentColor},#00d4ff)`, color:'#000', fontFamily:'Sora,sans-serif' }}>
                확인
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 검수 완료 팝업 */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-lg px-4">
          <motion.div initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }}
            className="w-full max-w-sm rounded-2xl p-8 text-center"
            style={{ background:'rgba(6,8,18,0.95)', border:`1px solid ${accentColor}25`,
              boxShadow:`0 40px 100px rgba(0,0,0,0.9)` }}>
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily:'Sora,sans-serif' }}>완료되었습니다</h3>
            <p className="text-xs text-white/40 mb-6 leading-relaxed" style={{ fontFamily:'Sora,sans-serif' }}>
              관리자 검토 후 1~2일 내에<br />판매 목록에 자동 등록됩니다.
            </p>
            <button onClick={()=>{setShowSuccess(false); nav('/');}}
              className="w-full py-3.5 rounded-xl text-sm font-semibold"
              style={{ background:`linear-gradient(135deg,${accentColor},#00d4ff)`, color:'#000', fontFamily:'Sora,sans-serif' }}>
              메인으로 돌아가기
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
