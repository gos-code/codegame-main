// @ts-nocheck
import { useState, useEffect } from 'react';
import { db, storage, collection, query, where, getDocs, doc,
  updateDoc, deleteDoc, serverTimestamp,
  ref, uploadBytesResumable, getDownloadURL, deleteObject } from '../../lib/firebase';

const BUDGET_KO = {
  'under5m':'500만원 미만','5m-10m':'500~1,000만원',
  '10m-30m':'1,000~3,000만원','over30m':'3,000만원 이상',
  '500만원 미만':'500만원 미만','500~1,000만원':'500~1,000만원',
  '1,000~3,000만원':'1,000~3,000만원','3,000만원 이상':'3,000만원 이상',
};
const TYPE_KO = {
  'partnership':'파트너십','enterprise':'기업 솔루션',
  'custom':'맞춤 개발','support':'기술 지원','other':'기타',
};

// 상태별 스타일
const STATUS_STYLE = {
  pending:  { label:'대기중',  bg:'rgba(245,158,11,0.1)',  color:'#f59e0b',  border:'rgba(245,158,11,0.25)' },
  approved: { label:'승인됨',  bg:'rgba(16,185,129,0.1)', color:'#10b981',  border:'rgba(16,185,129,0.25)' },
  rejected: { label:'반려됨',  bg:'rgba(239,68,68,0.1)',  color:'#ef4444',  border:'rgba(239,68,68,0.25)' },
  hidden:   { label:'숨김',    bg:'rgba(99,102,241,0.1)', color:'#818cf8',  border:'rgba(99,102,241,0.25)' },
};

export default function AdminPanel({ accentColor }) {
  const [tab,             setTab]             = useState('uploads');
  const [status,          setStatus]          = useState('pending');
  const [items,           setItems]           = useState([]);
  const [inquiries,       setInquiries]       = useState([]);
  const [loading,         setLoading]         = useState(false);
  const [replacing,       setReplacing]       = useState(false);
  const [replaceProgress, setReplaceProgress] = useState(0);
  const [editingId,       setEditingId]       = useState(null);   // 편집 중인 아이템 ID
  const [confirmDelete,   setConfirmDelete]   = useState(null);   // 영구삭제 확인 대상

  useEffect(() => { load(); }, [tab, status]);

  const load = async () => {
    setLoading(true);
    try {
      if (tab === 'inquiries') {
        const snap = await getDocs(collection(db,'enterprise_inquiries'));
        setInquiries(snap.docs.map(d=>({id:d.id,...d.data()}))
          .sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0)));
      } else {
        // 전체 다 불러와서 프론트에서 필터 (hidden 포함)
        const snap = await getDocs(collection(db,'uploads'));
        const all = snap.docs.map(d=>({id:d.id,...d.data()}));
        setItems(all.filter(i => (i.status||'pending') === status));
      }
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  // 상태 변경 (승인/반려/대기/숨김 모두 자유롭게)
  const changeStatus = async (id, newStatus) => {
    await updateDoc(doc(db,'uploads',id), { status:newStatus, reviewedAt:serverTimestamp() });
    setItems(p => p.filter(i => i.id !== id));
    setEditingId(null);
  };

  // 파일 교체
  const handleFileReplace = async (item, newFile) => {
    if (!newFile) return;
    setReplacing(true); setReplaceProgress(0);
    try {
      const ext = newFile.name.split('.').pop()?.replace(/[^a-zA-Z0-9]/g,'') || 'bin';
      const path = item.storagePath || `uploads/replaced_${item.id}.${ext}`;
      const storageRef = ref(storage, path);
      const task = uploadBytesResumable(storageRef, newFile);
      await new Promise((resolve, reject) => {
        task.on('state_changed',
          snap => setReplaceProgress(Math.round(snap.bytesTransferred/snap.totalBytes*100)),
          reject,
          async () => {
            const newUrl = await getDownloadURL(storageRef);
            await updateDoc(doc(db,'uploads',item.id), {
              fileUrl: newUrl, fileName: newFile.name,
              fileSize: newFile.size, replacedAt: serverTimestamp(),
            });
            resolve(null);
          }
        );
      });
      alert('✅ 파일 교체 완료!');
      load();
    } catch(e) { alert('교체 실패: '+e.message); }
    setReplacing(false);
  };

  // 영구 삭제 (Storage + Firestore 모두)
  const permanentDelete = async (item) => {
    try {
      // Storage 파일 삭제 (있으면)
      if (item.storagePath) {
        await deleteObject(ref(storage, item.storagePath)).catch(()=>{});
      }
      // 스크린샷 삭제
      if (item.screenshots?.length) {
        for (const url of item.screenshots) {
          try {
            // URL에서 경로 추출
            const path = decodeURIComponent(url.split('/o/')[1]?.split('?')[0] || '');
            if (path) await deleteObject(ref(storage, path)).catch(()=>{});
          } catch {}
        }
      }
      // Firestore 문서 삭제
      await deleteDoc(doc(db,'uploads',item.id));
      setItems(p => p.filter(i => i.id !== item.id));
      setConfirmDelete(null);
      alert('🗑️ 영구 삭제 완료');
    } catch(e) { alert('삭제 실패: '+e.message); }
  };

  // 탭 버튼
  const TabBtn = ({ id, label }) => (
    <button onClick={() => setTab(id)} style={{
      padding:'6px 16px', borderRadius:8, fontSize:12, cursor:'pointer',
      background: tab===id ? accentColor : 'var(--card)',
      color: tab===id ? '#000' : 'var(--foreground)',
      border:`1px solid ${tab===id ? accentColor : 'var(--border)'}`,
      fontFamily:'Sora,sans-serif',
    }}>{label}</button>
  );

  const StatusBtn = ({ s, label }) => (
    <button onClick={() => setStatus(s)} style={{
      padding:'6px 14px', borderRadius:8, fontSize:12, cursor:'pointer',
      background: status===s ? accentColor : 'var(--card)',
      color: status===s ? '#000' : 'var(--foreground)',
      border:`1px solid ${status===s ? accentColor : 'var(--border)'}`,
      fontFamily:'Sora,sans-serif',
    }}>{label}</button>
  );

  return (
    <div>
      {/* 탭 */}
      <div style={{ display:'flex', gap:8, marginBottom:16 }}>
        <TabBtn id="uploads" label="파일 검수" />
        <TabBtn id="inquiries" label={`기업 문의${inquiries.length>0?' ('+inquiries.length+')':''}`} />
      </div>

      {/* 파일 교체 진행바 */}
      {replacing && (
        <div style={{ marginBottom:12, padding:'10px 14px', borderRadius:10,
          background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.2)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:11,
            color:'#f59e0b', fontFamily:'Sora,sans-serif', marginBottom:6 }}>
            <span>파일 교체 중...</span><span>{replaceProgress}%</span>
          </div>
          <div style={{ height:4, borderRadius:99, background:'rgba(245,158,11,0.15)', overflow:'hidden' }}>
            <div style={{ height:'100%', borderRadius:99, background:'#f59e0b',
              width:`${replaceProgress}%`, transition:'width 0.2s' }} />
          </div>
        </div>
      )}

      {loading && (
        <div style={{ display:'flex', justifyContent:'center', padding:'40px 0' }}>
          <div style={{ width:24, height:24, borderRadius:'50%',
            border:`2px solid ${accentColor}30`, borderTopColor:accentColor,
            animation:'spin 0.8s linear infinite' }} />
        </div>
      )}

      {/* ── 기업 문의 탭 ── */}
      {!loading && tab==='inquiries' && (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {inquiries.length===0 ? (
            <div style={{ textAlign:'center', padding:'40px 0',
              color:'var(--muted-foreground)', fontSize:12, fontFamily:'Sora,sans-serif' }}>
              문의 없음
            </div>
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

      {/* ── 파일 검수 탭 ── */}
      {!loading && tab==='uploads' && (
        <div>
          {/* 상태 필터 */}
          <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
            <StatusBtn s="pending"  label="⏳ 대기중" />
            <StatusBtn s="approved" label="✅ 승인됨" />
            <StatusBtn s="rejected" label="❌ 반려됨" />
            <StatusBtn s="hidden"   label="🚫 숨김" />
          </div>

          {items.length===0 ? (
            <div style={{ textAlign:'center', padding:'40px 0',
              color:'var(--muted-foreground)', fontSize:12, fontFamily:'Sora,sans-serif' }}>
              {STATUS_STYLE[status]?.label || status} 항목 없음
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {items.map(item => {
                const isEditing = editingId === item.id;
                const st = STATUS_STYLE[item.status] || STATUS_STYLE.pending;
                return (
                  <div key={item.id} style={{ padding:16, borderRadius:14,
                    background:'var(--card)', border:'1px solid var(--border)' }}>

                    {/* 상단: 제목 + 상태 배지 + 버튼들 */}
                    <div style={{ display:'flex', justifyContent:'space-between',
                      alignItems:'flex-start', gap:12, marginBottom:10 }}>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4, flexWrap:'wrap' }}>
                          <span style={{ fontSize:13, fontWeight:600, color:'var(--foreground)',
                            fontFamily:'Sora,sans-serif' }}>{item.title}</span>
                          {/* 현재 상태 배지 */}
                          <span style={{ fontSize:10, padding:'2px 8px', borderRadius:99,
                            background:st.bg, color:st.color,
                            border:`1px solid ${st.border}`, fontFamily:'JetBrains Mono,monospace',
                            flexShrink:0 }}>
                            {st.label}
                          </span>
                        </div>
                        <div style={{ fontSize:11, color:'var(--muted-foreground)',
                          fontFamily:'JetBrains Mono,monospace' }}>
                          {item.nickname} · {item.category} · ₩{(item.price||0).toLocaleString()}
                        </div>
                      </div>

                      {/* 액션 버튼들 */}
                      <div style={{ display:'flex', gap:5, flexShrink:0, flexWrap:'wrap', justifyContent:'flex-end' }}>
                        <a href={item.fileUrl} target="_blank" rel="noreferrer"
                          style={{ fontSize:11, padding:'5px 10px', borderRadius:8,
                            background:`${accentColor}12`, color:accentColor,
                            border:`1px solid ${accentColor}25`, fontFamily:'Sora,sans-serif',
                            textDecoration:'none' }}>
                          🔍 파일
                        </a>
                        <label style={{ fontSize:11, padding:'5px 10px', borderRadius:8,
                          cursor:'pointer', background:'rgba(245,158,11,0.1)', color:'#f59e0b',
                          border:'1px solid rgba(245,158,11,0.25)', fontFamily:'Sora,sans-serif' }}>
                          📁 교체
                          <input type="file" style={{ display:'none' }}
                            onChange={e => {
                              const f = e.target.files?.[0];
                              if (f) handleFileReplace(item, f);
                              e.target.value = '';
                            }} />
                        </label>
                        {/* 편집 토글 */}
                        <button onClick={() => setEditingId(isEditing ? null : item.id)}
                          style={{ fontSize:11, padding:'5px 10px', borderRadius:8, cursor:'pointer',
                            background: isEditing ? accentColor : 'var(--secondary)',
                            color: isEditing ? '#000' : 'var(--foreground)',
                            border:`1px solid ${isEditing ? accentColor : 'var(--border)'}`,
                            fontFamily:'Sora,sans-serif' }}>
                          ✏️ 편집
                        </button>
                      </div>
                    </div>

                    {/* 설명 */}
                    {item.description && (
                      <p style={{ fontSize:11, color:'var(--muted-foreground)', marginBottom:10,
                        fontFamily:'Sora,sans-serif', lineHeight:1.5,
                        overflow:'hidden', display:'-webkit-box',
                        WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>
                        {item.description}
                      </p>
                    )}

                    {/* 스크린샷 */}
                    {item.screenshots?.length > 0 && (
                      <div style={{ display:'flex', gap:6, marginBottom:10, flexWrap:'wrap' }}>
                        {item.screenshots.map((s, i) => (
                          <a key={i} href={s} target="_blank" rel="noreferrer">
                            <img src={s} alt="" style={{ width:56, height:56, objectFit:'cover',
                              borderRadius:8, border:'1px solid var(--border)' }} />
                          </a>
                        ))}
                      </div>
                    )}

                    {/* ── 편집 패널 (토글) ── */}
                    {isEditing && (
                      <div style={{ marginTop:12, padding:14, borderRadius:10,
                        background:'var(--background)', border:`1px solid ${accentColor}30` }}>
                        <p style={{ fontSize:11, color:'var(--muted-foreground)', marginBottom:10,
                          fontFamily:'Sora,sans-serif' }}>
                          상태를 변경하거나 삭제할 수 있어요
                        </p>

                        {/* 상태 변경 버튼들 */}
                        <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:12 }}>
                          {Object.entries(STATUS_STYLE).map(([key, val]) => (
                            <button key={key}
                              onClick={() => changeStatus(item.id, key)}
                              disabled={item.status === key}
                              style={{ fontSize:11, padding:'6px 14px', borderRadius:8,
                                cursor: item.status===key ? 'not-allowed' : 'pointer',
                                background: item.status===key ? val.bg : 'var(--card)',
                                color: item.status===key ? val.color : 'var(--foreground)',
                                border:`1px solid ${item.status===key ? val.border : 'var(--border)'}`,
                                fontFamily:'Sora,sans-serif',
                                opacity: item.status===key ? 0.6 : 1 }}>
                              {item.status===key ? `현재: ${val.label}` : `→ ${val.label}`}
                            </button>
                          ))}
                        </div>

                        {/* 구분선 */}
                        <div style={{ height:1, background:'var(--border)', margin:'10px 0' }} />

                        {/* 영구 삭제 */}
                        {confirmDelete === item.id ? (
                          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                            <span style={{ fontSize:11, color:'#ef4444', fontFamily:'Sora,sans-serif' }}>
                              정말 삭제할까요? 복구 불가능해요
                            </span>
                            <button onClick={() => permanentDelete(item)}
                              style={{ fontSize:11, padding:'5px 14px', borderRadius:8, cursor:'pointer',
                                background:'rgba(239,68,68,0.15)', color:'#ef4444',
                                border:'1px solid rgba(239,68,68,0.3)', fontFamily:'Sora,sans-serif' }}>
                              🗑️ 확인 삭제
                            </button>
                            <button onClick={() => setConfirmDelete(null)}
                              style={{ fontSize:11, padding:'5px 14px', borderRadius:8, cursor:'pointer',
                                background:'var(--card)', color:'var(--muted-foreground)',
                                border:'1px solid var(--border)', fontFamily:'Sora,sans-serif' }}>
                              취소
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => setConfirmDelete(item.id)}
                            style={{ fontSize:11, padding:'6px 16px', borderRadius:8, cursor:'pointer',
                              background:'rgba(239,68,68,0.08)', color:'#ef4444',
                              border:'1px solid rgba(239,68,68,0.2)', fontFamily:'Sora,sans-serif' }}>
                            🗑️ 영구 삭제 (Storage + DB 모두)
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 영구삭제 확인 모달 */}
    </div>
  );
}
