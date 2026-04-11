// @ts-nocheck
// 관리자가 사이트 내에서 직접 텍스트 수정할 수 있는 컴포넌트
// 사용법: <AdminEditableText id="faq_refund" defaultText="기본 텍스트" tag="p" className="..." />
import { useState, useEffect, useRef } from 'react';
import { db, doc, getDoc, setDoc, serverTimestamp } from '../../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  id: string;           // Firestore 문서 ID (고유 키)
  defaultText: string;  // 기본 텍스트
  tag?: string;         // 렌더링 태그 (p, h1, h2, span 등)
  className?: string;
  style?: React.CSSProperties;
  multiline?: boolean;  // 여러 줄 편집 여부
}

export default function AdminEditableText({
  id, defaultText, tag='p', className='', style={}, multiline=false
}: Props) {
  const { isAdmin } = useAuth();
  const [text, setText] = useState(defaultText);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const inputRef = useRef(null);

  // Firestore에서 저장된 텍스트 로드
  useEffect(() => {
    getDoc(doc(db, 'admin_content', id)).then(snap => {
      if (snap.exists()) setText(snap.data().text);
    }).catch(() => {});
  }, [id]);

  const startEdit = () => {
    if (!isAdmin) return;
    setDraft(text);
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const save = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'admin_content', id), {
        text: draft, updatedAt: serverTimestamp()
      });
      setText(draft);
      setEditing(false);
    } catch(e) { alert('저장 실패: '+e.message); }
    setSaving(false);
  };

  const cancel = () => {
    setEditing(false);
    setDraft('');
  };

  const Tag = tag as any;

  if (editing) {
    return (
      <div style={{ position:'relative', display:'inline-block', width:'100%' }}>
        {multiline ? (
          <textarea ref={inputRef} value={draft} onChange={e=>setDraft(e.target.value)}
            rows={4}
            style={{ width:'100%', padding:'8px', borderRadius:8, fontSize:'inherit',
              fontFamily:'inherit', border:'2px solid #f59e0b', outline:'none',
              background:'rgba(245,158,11,0.05)', color:'var(--foreground)', resize:'vertical' }} />
        ) : (
          <input ref={inputRef} value={draft} onChange={e=>setDraft(e.target.value)}
            onKeyDown={e=>{ if(e.key==='Enter') save(); if(e.key==='Escape') cancel(); }}
            style={{ width:'100%', padding:'6px 8px', borderRadius:8, fontSize:'inherit',
              fontFamily:'inherit', border:'2px solid #f59e0b', outline:'none',
              background:'rgba(245,158,11,0.05)', color:'var(--foreground)' }} />
        )}
        <div style={{ display:'flex', gap:6, marginTop:6 }}>
          <button onClick={save} disabled={saving}
            style={{ padding:'4px 12px', borderRadius:6, fontSize:11, border:'none',
              cursor:'pointer', background:'#f59e0b', color:'#000', fontFamily:'Sora,sans-serif',
              fontWeight:600 }}>
            {saving ? '저장 중...' : '저장'}
          </button>
          <button onClick={cancel}
            style={{ padding:'4px 12px', borderRadius:6, fontSize:11, border:'none',
              cursor:'pointer', background:'rgba(255,255,255,0.1)', color:'var(--muted)',
              fontFamily:'Sora,sans-serif' }}>
            취소
          </button>
        </div>
      </div>
    );
  }

  return (
    <Tag className={className} style={{ ...style, position:'relative', display:'inline-block' }}
      title={isAdmin ? '클릭해서 편집' : undefined}>
      {text}
      {isAdmin && (
        <button onClick={startEdit}
          style={{ position:'absolute', top:-8, right:-24, width:18, height:18,
            borderRadius:4, border:'1px solid #f59e0b', background:'rgba(245,158,11,0.15)',
            cursor:'pointer', fontSize:10, display:'flex', alignItems:'center',
            justifyContent:'center', color:'#f59e0b', lineHeight:1 }}
          title="편집">
          ✎
        </button>
      )}
    </Tag>
  );
}
