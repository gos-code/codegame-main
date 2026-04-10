// @ts-nocheck
import { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Building2, Users, Briefcase, CheckCircle } from 'lucide-react';
import { db, addDoc, collection, serverTimestamp } from '../../../lib/firebase';
import { useTheme } from '../../contexts/ThemeContext';

export default function Contact() {
  const { accentColor, theme } = useTheme();
  const isDark = theme === 'dark';
  const [form, setForm] = useState({ company:'', name:'', email:'', phone:'', type:'', budget:'', message:'' });
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    if (!agreed) { alert('개인정보 수집에 동의해주세요'); return; }
    setLoading(true);
    try {
      await addDoc(collection(db, 'enterprise_inquiries'), {
        ...form, agreed: true,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setDone(true);
    } catch(err) { alert('전송 실패: ' + err.message); }
    setLoading(false);
  };

  const inputStyle = {
    width:'100%', padding:'11px 14px', borderRadius:10, fontSize:13,
    fontFamily:'Sora,sans-serif', outline:'none', transition:'border-color 0.2s',
    background:'var(--input)', border:'1px solid var(--border)', color:'var(--foreground)'
  };

  return (
    <div className="min-h-screen py-12" style={{ background:'var(--background)', color:'var(--foreground)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          className="mb-10">
          <div className="text-xs uppercase tracking-widest mb-3"
            style={{ color: accentColor, fontFamily:'JetBrains Mono,monospace' }}>
            ENTERPRISE
          </div>
          <h1 className="text-3xl font-bold mb-2"
            style={{ color:'var(--foreground)', fontFamily:'Sora,sans-serif' }}>
            기업 문의
          </h1>
          <p className="text-sm" style={{ color:'var(--muted)', fontFamily:'Sora,sans-serif' }}>
            기업 고객을 위한 맞춤형 솔루션을 제공합니다
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* 문의 폼 */}
          <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}
            transition={{ delay:0.1 }} className="lg:col-span-3">
            <div className="rounded-2xl p-7"
              style={{ background:'var(--card)', border:'1px solid var(--border)' }}>
              <h2 className="text-lg font-bold mb-6"
                style={{ color:'var(--foreground)', fontFamily:'Sora,sans-serif' }}>문의하기</h2>

              {done ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-14 h-14 mx-auto mb-4" style={{ color:accentColor }} />
                  <div className="text-lg font-bold mb-2"
                    style={{ color:'var(--foreground)', fontFamily:'Sora,sans-serif' }}>
                    문의가 접수됐어요!
                  </div>
                  <div className="text-sm" style={{ color:'var(--muted)', fontFamily:'Sora,sans-serif' }}>
                    영업일 1~2일 내에 연락드리겠습니다.
                  </div>
                  <button onClick={() => { setDone(false); setForm({ company:'',name:'',email:'',phone:'',type:'',budget:'',message:'' }); }}
                    className="mt-6 px-6 py-2.5 rounded-xl text-sm font-semibold"
                    style={{ background: accentColor, color:'#000', border:'none', cursor:'pointer',
                      fontFamily:'Sora,sans-serif' }}>
                    다시 문의하기
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide"
                        style={{ color:'var(--muted)', fontFamily:'JetBrains Mono,monospace' }}>회사명 *</label>
                      <input value={form.company} onChange={set('company')} required
                        placeholder="주식회사 CodeGame" style={inputStyle} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide"
                        style={{ color:'var(--muted)', fontFamily:'JetBrains Mono,monospace' }}>담당자명 *</label>
                      <input value={form.name} onChange={set('name')} required
                        placeholder="홍길동" style={inputStyle} />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide"
                        style={{ color:'var(--muted)', fontFamily:'JetBrains Mono,monospace' }}>이메일 *</label>
                      <input type="email" value={form.email} onChange={set('email')} required
                        placeholder="contact@company.com" style={inputStyle} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide"
                        style={{ color:'var(--muted)', fontFamily:'JetBrains Mono,monospace' }}>연락처</label>
                      <input value={form.phone} onChange={set('phone')}
                        placeholder="010-1234-5678" style={inputStyle} />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide"
                        style={{ color:'var(--muted)', fontFamily:'JetBrains Mono,monospace' }}>문의 유형 *</label>
                      <select value={form.type} onChange={set('type')} required style={inputStyle}>
                        <option value="">선택해주세요</option>
                        <option value="partnership">파트너십</option>
                        <option value="enterprise">기업 솔루션</option>
                        <option value="custom">맞춤 개발</option>
                        <option value="support">기술 지원</option>
                        <option value="other">기타</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide"
                        style={{ color:'var(--muted)', fontFamily:'JetBrains Mono,monospace' }}>예산 범위</label>
                      <select value={form.budget} onChange={set('budget')} style={inputStyle}>
                        <option value="">선택해주세요</option>
                        <option value="under5m">500만원 미만</option>
                        <option value="5m-10m">500~1,000만원</option>
                        <option value="10m-30m">1,000~3,000만원</option>
                        <option value="over30m">3,000만원 이상</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide"
                      style={{ color:'var(--muted)', fontFamily:'JetBrains Mono,monospace' }}>문의 내용 *</label>
                    <textarea value={form.message} onChange={set('message')} required rows={5}
                      placeholder="문의하실 내용을 상세히 작성해주세요..."
                      style={{ ...inputStyle, resize:'none' }} />
                  </div>
                  <div className="flex items-start gap-3">
                    <input type="checkbox" id="privacy" checked={agreed}
                      onChange={e => setAgreed(e.target.checked)} className="mt-1" />
                    <label htmlFor="privacy" className="text-xs"
                      style={{ color:'var(--muted)', fontFamily:'Sora,sans-serif' }}>
                      개인정보 수집 및 이용에 동의합니다 *
                    </label>
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all"
                    style={{ background:`linear-gradient(135deg,${accentColor},#00d4ff)`,
                      color:'#000', border:'none', cursor:'pointer',
                      fontFamily:'Sora,sans-serif', opacity: loading?0.7:1 }}>
                    <Send className="w-4 h-4" />
                    {loading ? '전송 중...' : '문의 보내기'}
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          {/* 혜택 & 통계 */}
          <div className="lg:col-span-2 space-y-5">
            <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
              transition={{ delay:0.2 }}
              className="rounded-2xl p-6"
              style={{ background:`linear-gradient(135deg,${accentColor}12,rgba(124,58,237,0.08))`,
                border:`1px solid ${accentColor}20` }}>
              <h2 className="text-base font-bold mb-5"
                style={{ color:'var(--foreground)', fontFamily:'Sora,sans-serif' }}>
                기업 고객 혜택
              </h2>
              <div className="space-y-4">
                {[
                  { icon: Building2, title:'전담 계정 관리자', desc:'1:1 맞춤 지원' },
                  { icon: Users, title:'팀 라이선스', desc:'최대 50% 할인' },
                  { icon: Briefcase, title:'맞춤 개발', desc:'전문가 직접 매칭' },
                ].map((b, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background:`${accentColor}15`, border:`1px solid ${accentColor}25` }}>
                      <b.icon className="w-4 h-4" style={{ color: accentColor }} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold"
                        style={{ color:'var(--foreground)', fontFamily:'Sora,sans-serif' }}>{b.title}</div>
                      <div className="text-xs" style={{ color:'var(--muted)', fontFamily:'Sora,sans-serif' }}>{b.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
              transition={{ delay:0.3 }}
              className="grid grid-cols-2 gap-3">
              {[
                { label:'파트너 기업', value:'250+' },
                { label:'기업 프로젝트', value:'1,200+' },
                { label:'평균 만족도', value:'98%' },
                { label:'재계약률', value:'92%' },
              ].map((s, i) => (
                <div key={i} className="rounded-xl p-4 text-center"
                  style={{ background:'var(--card)', border:'1px solid var(--border)' }}>
                  <div className="text-xl font-bold mb-1"
                    style={{ color: accentColor, fontFamily:'Orbitron,monospace' }}>{s.value}</div>
                  <div className="text-xs" style={{ color:'var(--muted)', fontFamily:'Sora,sans-serif' }}>{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
