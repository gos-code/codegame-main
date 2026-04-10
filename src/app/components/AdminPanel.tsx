// @ts-nocheck
import { useState, useEffect } from 'react';
import { db, collection, query, where, getDocs, doc, updateDoc, serverTimestamp } from '../../lib/firebase';

export default function AdminPanel({ accentColor }: { accentColor: string }) {
  const [status, setStatus] = useState<'pending'|'approved'|'rejected'>('pending');
  const [tab, setTab] = useState<'uploads'|'inquiries'>('uploads');
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { load(); }, [status, tab]);

  const loadInquiries = async () => {
    const snap = await getDocs(collection(db,'enterprise_inquiries'));
    setInquiries(snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>b.createdAt?.seconds-a.createdAt?.seconds));
  };

  const load = async () => {
    setLoading(true);
    try {
      if (tab === 'inquiries') { await loadInquiries(); setLoading(false); return; }
    const snap = await getDocs(query(collection(db,'uploads'), where('status','==',status)));
      setItems(snap.docs.map(d => ({ id:d.id,...d.data() })));
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  const action = async (id: string, act: 'approved'|'rejected') => {
    await updateDoc(doc(db,'uploads',id), { status:act, reviewedAt: serverTimestamp() });
    setItems(p => p.filter(i => i.id !== id));
  };

  return (
    <div>
      <div style={{display:'flex',gap:8,marginBottom:16}}>
        <button onClick={()=>setTab('uploads')}
          style={{padding:'6px 16px',borderRadius:8,fontSize:12,border:'none',cursor:'pointer',
            background:tab==='uploads'?accentColor:'rgba(255,255,255,0.06)',
            color:tab==='uploads'?'#000':'rgba(255,255,255,0.5)',fontFamily:'Sora,sans-serif'}}>
          파일 검수
        </button>
        <button onClick={()=>setTab('inquiries')}
          style={{padding:'6px 16px',borderRadius:8,fontSize:12,border:'none',cursor:'pointer',
            background:tab==='inquiries'?accentColor:'rgba(255,255,255,0.06)',
            color:tab==='inquiries'?'#000':'rgba(255,255,255,0.5)',fontFamily:'Sora,sans-serif'}}>
          기업 문의 {inquiries.length>0?`(${inquiries.length})`:''}
        </button>
      </div>
      {tab==='inquiries' && (
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {inquiries.length===0 ? (
            <div style={{textAlign:'center',padding:'40px 0',color:'rgba(255,255,255,0.3)',fontSize:12}}>
              문의 없음
            </div>
          ) : inquiries.map(inq=>(
            <div key={inq.id} style={{padding:14,borderRadius:12,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                <span style={{fontSize:13,fontWeight:600,color:'rgba(255,255,255,0.9)',fontFamily:'Sora,sans-serif'}}>{inq.company} - {inq.name}</span>
                <span style={{fontSize:10,padding:'2px 8px',borderRadius:99,background:'rgba(245,158,11,0.1)',color:'#f59e0b',border:'1px solid rgba(245,158,11,0.2)',fontFamily:'JetBrains Mono,monospace'}}>{inq.type||'문의'}</span>
              </div>
              <div style={{fontSize:11,color:'rgba(255,255,255,0.4)',marginBottom:4,fontFamily:'Sora,sans-serif'}}>{inq.email} · {inq.phone}</div>
              <div style={{fontSize:12,color:'rgba(255,255,255,0.6)',fontFamily:'Sora,sans-serif',lineHeight:1.6}}>{inq.message}</div>
              {inq.budget && <div style={{fontSize:11,color:'rgba(255,255,255,0.3)',marginTop:4}}>예산: {inq.budget}</div>}
            </div>
          ))}
        </div>
      )}
      {tab==='uploads' && <>
      <div className="flex gap-2 mb-5">
        {(['pending','approved','rejected'] as const).map(s => (
          <button key={s} onClick={()=>setStatus(s)}
            className="px-4 py-2 rounded-lg text-xs font-medium transition-all"
            style={{ background: status===s ? accentColor : 'rgba(255,255,255,0.05)',
              color: status===s ? '#000' : 'rgba(255,255,255,0.5)',
              fontFamily:'Sora,sans-serif', border:'1px solid rgba(255,255,255,0.08)' }}>
            {s==='pending' ? '대기중' : s==='approved' ? '승인됨' : '반려됨'}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-6 h-6 border-2 rounded-full animate-spin"
            style={{ borderColor:`${accentColor}30`, borderTopColor:accentColor }} />
        </div>
      ) : items.length===0 ? (
        <div className="text-center py-16 text-white/30 text-sm" style={{ fontFamily:'Sora,sans-serif' }}>
          {status} 항목이 없어요
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="p-4 rounded-xl"
              style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="text-sm font-medium text-white/85" style={{ fontFamily:'Sora,sans-serif' }}>{item.title}</div>
                  <div className="text-xs text-white/40 mt-0.5" style={{ fontFamily:'JetBrains Mono,monospace' }}>
                    {item.nickname} · {item.category} · ₩{(item.price||0).toLocaleString()}
                  </div>
                </div>
                <a href={item.fileUrl} target="_blank" rel="noreferrer"
                  className="text-xs px-3 py-1.5 rounded-lg flex-shrink-0"
                  style={{ background:`${accentColor}12`, color:accentColor, border:`1px solid ${accentColor}25`,
                    fontFamily:'Sora,sans-serif' }}>
                  파일 확인
                </a>
              </div>
              {item.description && (
                <p className="text-xs text-white/40 mb-3 line-clamp-2" style={{ fontFamily:'Sora,sans-serif' }}>{item.description}</p>
              )}
              {item.screenshots?.length > 0 && (
                <div className="flex gap-2 mb-3">
                  {item.screenshots.map((s:string, i:number) => (
                    <a key={i} href={s} target="_blank" rel="noreferrer">
                      <img src={s} alt="" className="w-16 h-16 object-cover rounded-lg"
                        style={{ border:'1px solid rgba(255,255,255,0.1)' }} />
                    </a>
                  ))}
                </div>
              )}
              {status==='pending' && (
                <div className="flex gap-2">
                  <button onClick={()=>action(item.id,'approved')}
                    className="px-4 py-2 rounded-lg text-xs font-medium transition-all"
                    style={{ background:`${accentColor}15`, color:accentColor, border:`1px solid ${accentColor}30`,
                      fontFamily:'Sora,sans-serif' }}>
                    ✅ 승인
                  </button>
                  <button onClick={()=>action(item.id,'rejected')}
                    className="px-4 py-2 rounded-lg text-xs font-medium transition-all"
                    style={{ background:'rgba(239,68,68,0.1)', color:'#f87171', border:'1px solid rgba(239,68,68,0.25)',
                      fontFamily:'Sora,sans-serif' }}>
                    ❌ 반려
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}