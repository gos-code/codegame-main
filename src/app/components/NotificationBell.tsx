// @ts-nocheck
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, Check, CheckCheck } from 'lucide-react';
import { db, collection, query, where, orderBy, onSnapshot,
  updateDoc, doc, writeBatch } from '../../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

// 알림 생성 유틸 함수 (다른 파일에서 import해서 사용)
export async function createNotification(
  uid: string,
  type: 'purchase' | 'approved' | 'rejected' | 'review',
  title: string,
  body: string,
  link?: string
) {
  try {
    const { addDoc, collection: col, serverTimestamp } = await import('../../lib/firebase');
    await addDoc(col(db, 'notifications'), {
      uid, type, title, body, link: link || '',
      read: false, createdAt: serverTimestamp(),
    });
  } catch(e) { console.error('알림 생성 실패:', e); }
}

const TYPE_ICON = {
  purchase:  '🛒',
  approved:  '✅',
  rejected:  '❌',
  review:    '⭐',
};

export default function NotificationBell() {
  const { user } = useAuth();
  const { accentColor, theme } = useTheme();
  const isDark = theme === 'dark';
  const [open,    setOpen]    = useState(false);
  const [notifs,  setNotifs]  = useState<any[]>([]);
  const unread = notifs.filter(n => !n.read).length;

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db,'notifications'),
      where('uid','==',user.uid),
      orderBy('createdAt','desc')
    );
    const unsub = onSnapshot(q, snap => {
      setNotifs(snap.docs.map(d => ({ id:d.id, ...d.data() })).slice(0,30));
    });
    return unsub;
  }, [user]);

  const markAllRead = async () => {
    const unreadList = notifs.filter(n => !n.read);
    if (!unreadList.length) return;
    // batch update
    for (const n of unreadList) {
      await updateDoc(doc(db,'notifications',n.id), { read:true }).catch(()=>{});
    }
  };

  const markOne = async (id: string) => {
    await updateDoc(doc(db,'notifications',id), { read:true }).catch(()=>{});
  };

  if (!user) return null;

  return (
    <div style={{ position:'relative' }}>
      {/* 벨 버튼 */}
      <button onClick={() => { setOpen(!open); if(!open) markAllRead(); }}
        style={{ position:'relative', padding:8, borderRadius:8, cursor:'pointer',
          background:'var(--card)', border:'1px solid var(--border)', color:'var(--foreground)',
          display:'flex', alignItems:'center' }}>
        <Bell className="w-4 h-4" />
        {unread > 0 && (
          <motion.span initial={{ scale:0 }} animate={{ scale:1 }}
            style={{ position:'absolute', top:-4, right:-4, width:18, height:18,
              borderRadius:'50%', background:'#ef4444', color:'#fff',
              fontSize:10, fontWeight:700, display:'flex', alignItems:'center',
              justifyContent:'center', fontFamily:'Sora,sans-serif' }}>
            {unread > 9 ? '9+' : unread}
          </motion.span>
        )}
      </button>

      {/* 알림 드롭다운 */}
      <AnimatePresence>
        {open && (
          <>
            {/* 외부 클릭 닫기 */}
            <div style={{ position:'fixed', inset:0, zIndex:40 }}
              onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity:0, y:-8, scale:0.96 }}
              animate={{ opacity:1, y:0, scale:1 }}
              exit={{ opacity:0, y:-8, scale:0.96 }}
              transition={{ duration:0.15 }}
              style={{ position:'absolute', top:'calc(100% + 8px)', right:0, zIndex:50,
                width:320, maxHeight:440, overflow:'hidden',
                background:'var(--card)', border:'1px solid var(--border)',
                borderRadius:16, boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}>

              {/* 헤더 */}
              <div style={{ padding:'14px 16px', borderBottom:'1px solid var(--border)',
                display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <span style={{ fontSize:14, fontWeight:600, color:'var(--foreground)',
                  fontFamily:'Sora,sans-serif' }}>
                  알림
                  {unread > 0 && (
                    <span style={{ marginLeft:6, fontSize:11, padding:'1px 6px', borderRadius:99,
                      background:`${accentColor}15`, color:accentColor,
                      fontFamily:'JetBrains Mono,monospace' }}>
                      {unread}
                    </span>
                  )}
                </span>
                <div style={{ display:'flex', gap:4 }}>
                  {unread > 0 && (
                    <button onClick={markAllRead}
                      style={{ fontSize:11, padding:'3px 8px', borderRadius:6,
                        background:`${accentColor}12`, color:accentColor,
                        border:'none', cursor:'pointer', fontFamily:'Sora,sans-serif' }}>
                      모두 읽음
                    </button>
                  )}
                  <button onClick={() => setOpen(false)}
                    style={{ background:'none', border:'none', cursor:'pointer',
                      color:'var(--muted-foreground)', padding:4 }}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 알림 목록 */}
              <div style={{ overflowY:'auto', maxHeight:360 }}>
                {notifs.length === 0 ? (
                  <div style={{ textAlign:'center', padding:'40px 16px',
                    color:'var(--muted-foreground)', fontSize:13, fontFamily:'Sora,sans-serif' }}>
                    알림이 없어요
                  </div>
                ) : notifs.map(n => (
                  <div key={n.id}
                    onClick={() => { markOne(n.id); if(n.link) window.location.href = n.link; }}
                    style={{ padding:'12px 16px', cursor:'pointer',
                      background: n.read ? 'transparent' : `${accentColor}06`,
                      borderBottom:'1px solid var(--border)',
                      display:'flex', gap:10, alignItems:'flex-start',
                      transition:'background 0.15s' }}>
                    <span style={{ fontSize:18, flexShrink:0, marginTop:1 }}>
                      {TYPE_ICON[n.type] || '🔔'}
                    </span>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:13, fontWeight: n.read ? 400 : 600,
                        color:'var(--foreground)', fontFamily:'Sora,sans-serif',
                        marginBottom:2 }}>
                        {n.title}
                      </div>
                      <div style={{ fontSize:11, color:'var(--muted-foreground)',
                        fontFamily:'Sora,sans-serif', lineHeight:1.5 }}>
                        {n.body}
                      </div>
                      {n.createdAt && (
                        <div style={{ fontSize:10, color:'var(--muted-foreground)',
                          marginTop:4, fontFamily:'JetBrains Mono,monospace' }}>
                          {new Date(n.createdAt.seconds*1000).toLocaleDateString('ko-KR')}
                        </div>
                      )}
                    </div>
                    {!n.read && (
                      <div style={{ width:6, height:6, borderRadius:'50%',
                        background:accentColor, flexShrink:0, marginTop:6 }} />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
