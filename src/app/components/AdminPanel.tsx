// @ts-nocheck
import { useState, useEffect } from 'react';
import { db, collection, query, where, getDocs, doc, updateDoc, serverTimestamp } from '../../lib/firebase';

// 영어 value → 한국어 표시 매핑 (과거 데이터 + 현재 데이터 모두 처리)
const BUDGET_KO = {
  'under5m':        '500만원 미만',
  '5m-10m':         '500~1,000만원',
  '10m-30m':        '1,000~3,000만원',
  'over30m':        '3,000만원 이상',
  '500만원 미만':   '500만원 미만',
  '500~1,000만원':  '500~1,000만원',
  '1,000~3,000만원':'1,000~3,000만원',
  '3,000만원 이상': '3,000만원 이상',
};

const TYPE_KO = {
  'partnership': '파트너십',
  'enterprise':  '기업 솔루션',
  'custom':      '맞춤 개발',
  'support':     '기술 지원',
  'other':       '기타',
};

export default function AdminPanel({ accentColor }) {
  const [tab, setTab] = useState('uploads');
  const [status, setStatus] = useState('pending');
  const [items, setItems] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { load(); }, [tab, status]);

  const load = async () => {
    setLoading(true);
    try {
      if (tab === 'inquiries') {
        const snap = await getDocs(collection(db,'enterprise_inquiries'));
        setInquiries(snap.docs.map(d=>({id:d.id,...d.data()}))
          .sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0)));
      } else {
        const snap = await getDocs(query(collection(db,'uploads'), where('status','==',status)));
        setItems(snap.docs.map(d=>({id:d.id,...d.data()})));
      }
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  const action = async (id, act) => {
    await updateDoc(doc(db,'uploads',id), { status:act, reviewedAt:serverTimestamp() });
    setItems(p=>p.filter(i=>i.id!==id));
  };

  // 라이트/다크 모두 보이는 버튼 스타일
  const tabBtn = (id, label) => (
    <button key={id} onClick={()=>setTab(id)}
      style={{
        padding:'6px 16px', borderRadius:8, fontSize:12, cursor:'pointer',
        background: tab===id ? accentColor : 'var(--card)',
        color: tab===id ? '#000' : 'var(--foreground)',
        border: `1px solid ${tab===id ? accentColor : 'var(--border)'}`,
        fontFamily:'Sora,sans-serif',
      }}>
      {label}
    </button>
  );

  const statusBtn = (s, label) => (
    <button key={s} onClick={()=>setStatus(s)}
      style={{
        padding:'6px 14px', borderRadius:8, fontSize:12, cursor:'pointer',
        background: status===s ? accentColor : 'var(--card)',
        color: status===s ? '#000' : 'var(--foreground)',
        border: `1px solid ${status===s ? accentColor : 'var(--border)'}`,
        fontFamily:'Sora,sans-serif',
      }}>
      {label}
    </button>
  );

  return (
    <div>
      {/* 탭 버튼 */}
      <div style={{ display:'flex', gap:8, marginBottom:16 }}>
        {tabBtn('uploads', '파일 검수')}
        {tabBtn('inquiries', `기업 문의${inquiries.length>0?' ('+inquiries.length+')':''}`)}
      </div>

      {loading && (
        <div style={{ display:'flex', justifyContent:'center', padding:'40px 0' }}>
          <div style={{ width:24, height:24, borderRadius:'50%', border:`2px solid ${accentColor}30`,
            borderTopColor:accentColor, animation:'spin 0.8s linear infinite' }} />
        </div>
      )}

      {/* 기업문의 탭 */}
      {!loading && tab==='inquiries' && (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {inquiries.length===0 ? (
            <div style={{ textAlign:'center', padding:'40px 0', color:'var(--muted-foreground)',
              fontSize:12, fontFamily:'Sora,sans-serif' }}>문의 없음</div>
          ) : inquiries.map(inq => (
            <div key={inq.id} style={{ padding:14, borderRadius:12,
              background:'var(--card)', border:'1px solid var(--border)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                <span style={{ fontSize:13, fontWeight:600, color:'var(--foreground)',
                  fontFamily:'Sora,sans-serif' }}>{inq.company} — {inq.name}</span>
                <span style={{ fontSize:10, padding:'2px 8px', borderRadius:99,
                  background:'rgba(245,158,11,0.1)', color:'#f59e0b',
                  border:'1px solid rgba(245,158,11,0.2)', fontFamily:'JetBrains Mono,monospace' }}>
                  {TYPE_KO[inq.type] || inq.type || '문의'}
                </span>
              </div>
              <div style={{ fontSize:11, color:'var(--muted-foreground)', marginBottom:4,
                fontFamily:'Sora,sans-serif' }}>{inq.email} · {inq.phone}</div>
              <div style={{ fontSize:12, color:'var(--foreground)', lineHeight:1.6,
                fontFamily:'Sora,sans-serif' }}>{inq.message}</div>
              {inq.budget && (
                <div style={{ marginTop:6, display:'inline-block', fontSize:11,
                  padding:'2px 10px', borderRadius:99,
                  background:'rgba(99,102,241,0.1)', color:'#818cf8',
                  border:'1px solid rgba(99,102,241,0.2)', fontFamily:'Sora,sans-serif' }}>
                  예산: {BUDGET_KO[inq.budget] || inq.budget}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 파일검수 탭 */}
      {!loading && tab==='uploads' && (
        <div>
          <div style={{ display:'flex', gap:8, marginBottom:16 }}>
            {statusBtn('pending', '대기중')}
            {statusBtn('approved', '승인됨')}
            {statusBtn('rejected', '반려됨')}
          </div>
          {items.length===0 ? (
            <div style={{ textAlign:'center', padding:'40px 0', color:'var(--muted-foreground)',
              fontSize:12, fontFamily:'Sora,sans-serif' }}>{status} 항목 없음</div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {items.map(item => (
                <div key={item.id} style={{ padding:16, borderRadius:14,
                  background:'var(--card)', border:'1px solid var(--border)' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12, marginBottom:10 }}>
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color:'var(--foreground)',
                        fontFamily:'Sora,sans-serif', marginBottom:2 }}>{item.title}</div>
                      <div style={{ fontSize:11, color:'var(--muted-foreground)',
                        fontFamily:'JetBrains Mono,monospace' }}>
                        {item.nickname} · {item.category} · ₩{(item.price||0).toLocaleString()}
                      </div>
                    </div>
                    <a href={item.fileUrl} target="_blank" rel="noreferrer"
                      style={{ fontSize:11, padding:'5px 12px', borderRadius:8, flexShrink:0,
                        background:`${accentColor}12`, color:accentColor,
                        border:`1px solid ${accentColor}25`, fontFamily:'Sora,sans-serif',
                        textDecoration:'none' }}>
                      파일 확인
                    </a>
                  </div>
                  {item.description && (
                    <p style={{ fontSize:11, color:'var(--muted-foreground)', marginBottom:10,
                      fontFamily:'Sora,sans-serif', lineHeight:1.5,
                      overflow:'hidden', display:'-webkit-box',
                      WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>
                      {item.description}
                    </p>
                  )}
                  {item.screenshots?.length > 0 && (
                    <div style={{ display:'flex', gap:8, marginBottom:10 }}>
                      {item.screenshots.map((s, i) => (
                        <a key={i} href={s} target="_blank" rel="noreferrer">
                          <img src={s} alt="" style={{ width:60, height:60, objectFit:'cover',
                            borderRadius:8, border:'1px solid var(--border)' }} />
                        </a>
                      ))}
                    </div>
                  )}
                  {status==='pending' && (
                    <div style={{ display:'flex', gap:8 }}>
                      <button onClick={()=>action(item.id,'approved')}
                        style={{ padding:'7px 16px', borderRadius:8, fontSize:12, cursor:'pointer', border:'none',
                          background:`${accentColor}15`, color:accentColor, fontFamily:'Sora,sans-serif' }}>
                        ✅ 승인
                      </button>
                      <button onClick={()=>action(item.id,'rejected')}
                        style={{ padding:'7px 16px', borderRadius:8, fontSize:12, cursor:'pointer', border:'none',
                          background:'rgba(239,68,68,0.1)', color:'#ef4444', fontFamily:'Sora,sans-serif' }}>
                        ❌ 반려
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
