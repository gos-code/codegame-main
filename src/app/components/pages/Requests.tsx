// @ts-nocheck
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Clock, DollarSign, User, MessageSquare, X, Send } from 'lucide-react';
import { db, collection, addDoc, getDocs, query, orderBy,
  onSnapshot, serverTimestamp } from '../../../lib/firebase';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

const REQUEST_CATS = ['모바일','웹','AI/ML','백엔드','프론트엔드','자동화','기타'];

export default function Requests() {
  const { accentColor, theme } = useTheme();
  const { user, profile } = useAuth();
  const isDark = theme === 'dark';
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [proposing, setProposing] = useState(null);
  const [proposalMsg, setProposalMsg] = useState('');
  const [form, setForm] = useState({ title:'', desc:'', budgetMin:'', budgetMax:'', period:'', category:'웹' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const q = query(collection(db,'dev_requests'), orderBy('createdAt','desc'));
    const unsub = onSnapshot(q, snap => {
      setRequests(snap.docs.map(d => ({ id:d.id, ...d.data() })));
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, []);

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const submitRequest = async () => {
    if (!user) { alert('로그인이 필요해요'); return; }
    if (!form.title || !form.desc) { alert('제목과 내용을 입력해주세요'); return; }
    setSubmitting(true);
    try {
      await addDoc(collection(db,'dev_requests'), {
        ...form,
        budgetMin: parseInt(form.budgetMin)||0,
        budgetMax: parseInt(form.budgetMax)||0,
        uid: user.uid,
        author: profile?.nickname || user.email,
        status: 'open',
        proposalCount: 0,
        createdAt: serverTimestamp()
      });
      setShowNew(false);
      setForm({ title:'', desc:'', budgetMin:'', budgetMax:'', period:'', category:'웹' });
    } catch(e) { alert('등록 실패: '+e.message); }
    setSubmitting(false);
  };

  const sendProposal = async () => {
    if (!user) { alert('로그인이 필요해요'); return; }
    if (!proposalMsg.trim()) return;
    try {
      await addDoc(collection(db,'dev_requests',proposing.id,'proposals'), {
        message: proposalMsg, uid: user.uid,
        author: profile?.nickname || user.email,
        codetalkHandle: profile?.codetalkHandle || null,
        createdAt: serverTimestamp()
      });
      alert('제안이 전송됐어요! 요청자가 CodeTalk으로 연락할 수 있어요.');
      setProposing(null);
      setProposalMsg('');
    } catch(e) { alert('전송 실패: '+e.message); }
  };

  const inputStyle = {
    width:'100%', padding:'10px 14px', borderRadius:10, fontSize:13,
    fontFamily:'Sora,sans-serif', outline:'none',
    background:'var(--input)', border:'1px solid var(--border)', color:'var(--foreground)'
  };

  const cardStyle = {
    background:'var(--card)', border:'1px solid var(--border)',
    borderRadius:16, padding:'20px', transition:'all 0.2s'
  };

  return (
    <div className="min-h-screen py-10" style={{ background:'var(--background)', color:'var(--foreground)' }}>
      <div className="max-w-4xl mx-auto px-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-xs uppercase tracking-widest mb-2"
              style={{ color:accentColor, fontFamily:'JetBrains Mono,monospace' }}>DEV REQUESTS</div>
            <h1 className="text-2xl font-bold"
              style={{ color:'var(--foreground)', fontFamily:'Sora,sans-serif' }}>개발 요청</h1>
            <p className="text-sm mt-1" style={{ color:'var(--muted)', fontFamily:'Sora,sans-serif' }}>
              필요한 개발을 요청하고 전문가를 찾아보세요
            </p>
          </div>
          <button onClick={() => user ? setShowNew(true) : alert('로그인이 필요해요')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background:`linear-gradient(135deg,${accentColor},#00d4ff)`, color:'#000',
              border:'none', cursor:'pointer', fontFamily:'Sora,sans-serif' }}>
            <Plus className="w-4 h-4" /> 새 요청 등록
          </button>
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: Plus, label:'활성 요청', num: requests.filter(r=>r.status==='open').length, unit:'건' },
            { icon: MessageSquare, label:'총 제안', num: requests.reduce((a,r)=>a+(r.proposalCount||0),0), unit:'건' },
            { icon: DollarSign, label:'평균 예산',
              num: requests.length ? '₩'+Math.round(requests.reduce((a,r)=>a+((r.budgetMin+r.budgetMax)/2||0),0)/requests.length/10000) : '—',
              unit: requests.length ? '만원' : '' },
          ].map((s,i) => (
            <div key={i} style={cardStyle}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background:`${accentColor}12`, border:`1px solid ${accentColor}20` }}>
                  <s.icon className="w-5 h-5" style={{ color:accentColor }} />
                </div>
                <div>
                  <div className="text-xs" style={{ color:'var(--muted)', fontFamily:'Sora,sans-serif' }}>
                    {s.label}
                  </div>
                  <div className="text-lg font-bold flex items-baseline gap-0.5">
                    <span style={{ color:'var(--foreground)', fontFamily:'Orbitron,monospace' }}>{s.num}</span>
                    {s.unit && <span style={{ color:'var(--muted)', fontFamily:'Sora,sans-serif', fontSize:12 }}>{s.unit}</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 요청 목록 */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_,i) => (
              <div key={i} className="h-32 rounded-2xl animate-pulse" style={{ background:'var(--card)' }} />
            ))}
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-3">📋</div>
            <p className="text-sm" style={{ color:'var(--muted)', fontFamily:'Sora,sans-serif' }}>
              아직 등록된 요청이 없어요. 첫 번째 요청을 올려보세요!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((r, i) => (
              <motion.div key={r.id} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                transition={{ delay:i*0.05 }}
                style={cardStyle}
                onMouseOver={e => e.currentTarget.style.borderColor = `${accentColor}35`}
                onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                        style={{ background:`${accentColor}12`, color:accentColor,
                          border:`1px solid ${accentColor}20`, fontFamily:'JetBrains Mono,monospace' }}>
                        진행중
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background:'var(--secondary)', color:'var(--muted)',
                          fontFamily:'JetBrains Mono,monospace' }}>
                        {r.category}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold mb-1.5"
                      style={{ color:'var(--foreground)', fontFamily:'Sora,sans-serif' }}>
                      {r.title}
                    </h3>
                    <p className="text-xs line-clamp-2 mb-3"
                      style={{ color:'var(--muted)', fontFamily:'Sora,sans-serif' }}>
                      {r.desc}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs"
                      style={{ color:'var(--muted)', fontFamily:'Sora,sans-serif' }}>
                      {r.budgetMin > 0 && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {r.budgetMin?.toLocaleString()} - {r.budgetMax?.toLocaleString()}원
                        </span>
                      )}
                      {r.period && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />{r.period}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />{r.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />{r.proposalCount||0}개 제안
                      </span>
                    </div>
                  </div>
                  <button onClick={() => setProposing(r)}
                    className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold"
                    style={{ background:`linear-gradient(135deg,${accentColor},#00d4ff)`, color:'#000',
                      border:'none', cursor:'pointer', fontFamily:'Sora,sans-serif' }}>
                    제안하기
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* 새 요청 모달 */}
      <AnimatePresence>
        {showNew && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background:'rgba(0,0,0,0.7)', backdropFilter:'blur(8px)' }}>
            <motion.div initial={{ scale:0.95, opacity:0 }} animate={{ scale:1, opacity:1 }}
              exit={{ scale:0.95, opacity:0 }}
              className="w-full max-w-lg rounded-2xl p-7"
              style={{ background: isDark ? '#070b16' : '#fff', border:'1px solid var(--border)',
                maxHeight:'90vh', overflowY:'auto' }}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold"
                  style={{ color:'var(--foreground)', fontFamily:'Sora,sans-serif' }}>새 요청 등록</h3>
                <button onClick={() => setShowNew(false)}
                  style={{ background:'none', border:'none', cursor:'pointer', color:'var(--muted)' }}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs mb-1.5 uppercase tracking-wide"
                    style={{ color:'var(--muted)', fontFamily:'JetBrains Mono,monospace' }}>카테고리</label>
                  <select value={form.category} onChange={set('category')} style={inputStyle}>
                    {REQUEST_CATS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs mb-1.5 uppercase tracking-wide"
                    style={{ color:'var(--muted)', fontFamily:'JetBrains Mono,monospace' }}>제목 *</label>
                  <input value={form.title} onChange={set('title')}
                    placeholder="요청 제목을 입력하세요" style={inputStyle} />
                </div>
                <div>
                  <label className="block text-xs mb-1.5 uppercase tracking-wide"
                    style={{ color:'var(--muted)', fontFamily:'JetBrains Mono,monospace' }}>내용 *</label>
                  <textarea value={form.desc} onChange={set('desc')} rows={4}
                    placeholder="필요한 개발 내용을 상세히 적어주세요"
                    style={{ ...inputStyle, resize:'none' }} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs mb-1.5 uppercase tracking-wide"
                      style={{ color:'var(--muted)', fontFamily:'JetBrains Mono,monospace' }}>최소 예산 (원)</label>
                    <input type="number" value={form.budgetMin} onChange={set('budgetMin')}
                      placeholder="500000" style={inputStyle} />
                  </div>
                  <div>
                    <label className="block text-xs mb-1.5 uppercase tracking-wide"
                      style={{ color:'var(--muted)', fontFamily:'JetBrains Mono,monospace' }}>최대 예산 (원)</label>
                    <input type="number" value={form.budgetMax} onChange={set('budgetMax')}
                      placeholder="1000000" style={inputStyle} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs mb-1.5 uppercase tracking-wide"
                    style={{ color:'var(--muted)', fontFamily:'JetBrains Mono,monospace' }}>기간</label>
                  <input value={form.period} onChange={set('period')}
                    placeholder="예: 2주, 1개월" style={inputStyle} />
                </div>
                <button onClick={submitRequest} disabled={submitting}
                  className="w-full py-3 rounded-xl text-sm font-semibold"
                  style={{ background:`linear-gradient(135deg,${accentColor},#00d4ff)`, color:'#000',
                    border:'none', cursor:'pointer', fontFamily:'Sora,sans-serif',
                    opacity: submitting?0.7:1 }}>
                  {submitting ? '등록 중...' : '요청 등록하기'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 제안하기 모달 */}
      <AnimatePresence>
        {proposing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background:'rgba(0,0,0,0.7)', backdropFilter:'blur(8px)' }}>
            <motion.div initial={{ scale:0.95, opacity:0 }} animate={{ scale:1, opacity:1 }}
              exit={{ scale:0.95, opacity:0 }}
              className="w-full max-w-md rounded-2xl p-7"
              style={{ background: isDark ? '#070b16' : '#fff', border:'1px solid var(--border)' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold"
                  style={{ color:'var(--foreground)', fontFamily:'Sora,sans-serif' }}>제안하기</h3>
                <button onClick={() => setProposing(null)}
                  style={{ background:'none', border:'none', cursor:'pointer', color:'var(--muted)' }}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm mb-1" style={{ color:'var(--foreground)', fontFamily:'Sora,sans-serif' }}>
                {proposing.title}
              </p>
              <p className="text-xs mb-5" style={{ color:'var(--muted)', fontFamily:'Sora,sans-serif' }}>
                제안 내용을 보내면 CodeTalk으로 요청자와 연결돼요
              </p>
              <textarea value={proposalMsg} onChange={e=>setProposalMsg(e.target.value)} rows={5}
                placeholder="제안 내용을 작성해주세요. 본인의 경험, 예상 기간, 견적 등을 포함하면 좋아요."
                style={{ ...inputStyle, resize:'none', marginBottom:12 }} />
              <button onClick={sendProposal}
                className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                style={{ background:`linear-gradient(135deg,${accentColor},#00d4ff)`, color:'#000',
                  border:'none', cursor:'pointer', fontFamily:'Sora,sans-serif' }}>
                <Send className="w-4 h-4" /> 제안 보내기
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
