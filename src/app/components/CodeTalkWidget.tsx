// @ts-nocheck
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, MessageCircle, Plus, Search, ArrowLeft, User } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { db, collection, addDoc, getDocs, query, where, orderBy,
  onSnapshot, serverTimestamp, doc, setDoc, getDoc, updateDoc } from '../lib/firebase';

export default function CodeTalkWidget() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState('rooms'); // rooms | chat | setup
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [searchId, setSearchId] = useState('');
  const [myHandle, setMyHandle] = useState('');
  const [handleInput, setHandleInput] = useState('');
  const [handleError, setHandleError] = useState('');
  const [loading, setLoading] = useState(false);
  const msgEndRef = useRef(null);
  const { accentColor } = useTheme();
  const { user, profile } = useAuth();

  // 내 핸들 로드
  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, 'codetalk_users', user.uid)).then(snap => {
      if (snap.exists()) setMyHandle(snap.data().handle);
      else setView('setup');
    }).catch(() => {});
  }, [user]);

  // 채팅방 목록 로드
  useEffect(() => {
    if (!user || !open) return;
    const q = query(collection(db, 'codetalk_rooms'),
      where('members', 'array-contains', user.uid));
    const unsub = onSnapshot(q, snap => {
      setRooms(snap.docs.map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.lastAt?.seconds || 0) - (a.lastAt?.seconds || 0)));
    });
    return unsub;
  }, [user, open]);

  // 메시지 로드
  useEffect(() => {
    if (!activeRoom) return;
    const q = query(collection(db, 'codetalk_rooms', activeRoom.id, 'messages'),
      orderBy('createdAt', 'asc'));
    const unsub = onSnapshot(q, snap => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setTimeout(() => msgEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });
    return unsub;
  }, [activeRoom]);

  // 핸들 등록
  const registerHandle = async () => {
    if (!handleInput.trim()) return;
    setHandleError(''); setLoading(true);
    const handle = handleInput.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (handle.length < 3) { setHandleError('3자 이상 입력해주세요'); setLoading(false); return; }
    try {
      const snap = await getDocs(query(collection(db, 'codetalk_users'), where('handle', '==', handle)));
      if (!snap.empty) { setHandleError('이미 사용 중인 아이디예요'); setLoading(false); return; }
      await setDoc(doc(db, 'codetalk_users', user.uid), {
        handle, uid: user.uid, nickname: profile?.nickname || user.email,
        createdAt: serverTimestamp()
      });
      await updateDoc(doc(db, 'users', user.uid), { codetalkHandle: handle });
      setMyHandle(handle);
      setView('rooms');
    } catch (e) { setHandleError('등록 실패: ' + e.message); }
    setLoading(false);
  };

  // 1:1 채팅 시작
  const startChat = async () => {
    if (!searchId.trim()) return;
    const handle = searchId.trim().toLowerCase();
    const snap = await getDocs(query(collection(db, 'codetalk_users'), where('handle', '==', handle)));
    if (snap.empty) { alert('존재하지 않는 아이디예요'); return; }
    const target = snap.docs[0].data();
    const roomId = [user.uid, target.uid].sort().join('_');
    const roomRef = doc(db, 'codetalk_rooms', roomId);
    const existing = await getDoc(roomRef);
    if (!existing.exists()) {
      await setDoc(roomRef, {
        members: [user.uid, target.uid],
        memberHandles: [myHandle, target.handle],
        memberNicks: [profile?.nickname || myHandle, target.nickname],
        lastMsg: '', lastAt: serverTimestamp(), type: 'dm'
      });
    }
    setActiveRoom({ id: roomId, ...existing.data(),
      memberHandles: [myHandle, handle],
      memberNicks: [profile?.nickname || myHandle, target.nickname] });
    setView('chat');
    setSearchId('');
  };

  // 메시지 전송
  const send = async () => {
    if (!input.trim() || !activeRoom) return;
    const text = input.trim();
    setInput('');
    await addDoc(collection(db, 'codetalk_rooms', activeRoom.id, 'messages'), {
      uid: user.uid, handle: myHandle,
      nick: profile?.nickname || myHandle,
      text, createdAt: serverTimestamp()
    });
    await updateDoc(doc(db, 'codetalk_rooms', activeRoom.id), {
      lastMsg: text, lastAt: serverTimestamp()
    });
  };

  const otherNick = activeRoom?.memberNicks?.find((_, i) =>
    activeRoom?.members?.[i] !== user?.uid) || activeRoom?.memberHandles?.find(h => h !== myHandle) || '상대방';

  return (
    <div style={{ position:'fixed', bottom:24, right:24, zIndex:999 }}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity:0, scale:0.88, y:16 }}
            animate={{ opacity:1, scale:1, y:0 }}
            exit={{ opacity:0, scale:0.88, y:16 }}
            transition={{ type:'spring', damping:22, stiffness:280 }}
            style={{ position:'absolute', bottom:64, right:0, width:420, height:520,
              borderRadius:20, display:'flex', overflow:'hidden',
              background:'#070b16',
              border:`1px solid ${accentColor}20`,
              boxShadow:`0 24px 60px rgba(0,0,0,0.85)` }}>

            {/* 왼쪽 채팅방 목록 */}
            <div style={{ width:130, borderRight:`1px solid rgba(255,255,255,0.07)`,
              display:'flex', flexDirection:'column', background:'rgba(0,0,0,0.3)' }}>
              {/* 헤더 */}
              <div style={{ padding:'14px 10px 10px', borderBottom:`1px solid rgba(255,255,255,0.06)` }}>
                <div style={{ fontSize:11, fontWeight:700, color:accentColor,
                  fontFamily:'Orbitron,monospace', letterSpacing:'0.1em' }}>CODE</div>
                <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.5)',
                  fontFamily:'Orbitron,monospace', letterSpacing:'0.1em' }}>TALK</div>
                {myHandle && (
                  <div style={{ fontSize:9, color:'rgba(255,255,255,0.3)', marginTop:4,
                    fontFamily:'JetBrains Mono,monospace' }}>@{myHandle}</div>
                )}
              </div>
              {/* 새 채팅 버튼 */}
              {myHandle && (
                <button onClick={() => setView('search')}
                  style={{ margin:'8px', padding:'6px', borderRadius:8, border:'none', cursor:'pointer',
                    background:`${accentColor}15`, color:accentColor, fontSize:11,
                    fontFamily:'Sora,sans-serif', display:'flex', alignItems:'center', gap:4 }}>
                  <Plus style={{width:12,height:12}} /> 새 채팅
                </button>
              )}
              {/* 채팅방 목록 */}
              <div style={{ flex:1, overflowY:'auto' }}>
                {rooms.length === 0 ? (
                  <div style={{ padding:'12px 10px', fontSize:10, color:'rgba(255,255,255,0.25)',
                    fontFamily:'Sora,sans-serif', textAlign:'center' }}>
                    채팅방 없음
                  </div>
                ) : rooms.map(r => {
                  const otherH = r.memberHandles?.find(h => h !== myHandle) || '?';
                  const isActive = activeRoom?.id === r.id;
                  return (
                    <button key={r.id}
                      onClick={() => { setActiveRoom(r); setView('chat'); }}
                      style={{ width:'100%', padding:'8px 10px', textAlign:'left', border:'none',
                        cursor:'pointer', transition:'all 0.15s',
                        background: isActive ? `${accentColor}15` : 'transparent',
                        borderLeft: isActive ? `2px solid ${accentColor}` : '2px solid transparent' }}>
                      <div style={{ width:28, height:28, borderRadius:'50%', margin:'0 auto 4px',
                        background:`linear-gradient(135deg,${accentColor},#00d4ff)`,
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontSize:11, fontWeight:700, color:'#000', fontFamily:'Orbitron,monospace' }}>
                        {otherH[0]?.toUpperCase()}
                      </div>
                      <div style={{ fontSize:10, color:'rgba(255,255,255,0.7)', textAlign:'center',
                        fontFamily:'JetBrains Mono,monospace', overflow:'hidden',
                        textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                        @{otherH}
                      </div>
                      {r.lastMsg && (
                        <div style={{ fontSize:9, color:'rgba(255,255,255,0.3)', textAlign:'center',
                          overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
                          fontFamily:'Sora,sans-serif', marginTop:2 }}>
                          {r.lastMsg}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 오른쪽 메인 영역 */}
            <div style={{ flex:1, display:'flex', flexDirection:'column' }}>

              {/* 헤더 */}
              <div style={{ padding:'12px 14px', borderBottom:`1px solid rgba(255,255,255,0.07)`,
                display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  {view === 'chat' && (
                    <button onClick={() => setView('rooms')}
                      style={{ background:'none', border:'none', cursor:'pointer',
                        color:'rgba(255,255,255,0.4)', padding:2 }}>
                      <ArrowLeft style={{width:16,height:16}} />
                    </button>
                  )}
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.9)',
                      fontFamily:'Sora,sans-serif' }}>
                      {view === 'chat' ? otherNick : view === 'setup' ? '아이디 설정' : view === 'search' ? '새 채팅' : '채팅'}
                    </div>
                    {view === 'chat' && activeRoom?.memberHandles && (
                      <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)',
                        fontFamily:'JetBrains Mono,monospace' }}>
                        @{activeRoom.memberHandles.find(h => h !== myHandle)}
                      </div>
                    )}
                  </div>
                </div>
                <button onClick={() => setOpen(false)}
                  style={{ background:'none', border:'none', cursor:'pointer',
                    color:'rgba(255,255,255,0.3)', padding:4 }}>
                  <X style={{width:16,height:16}} />
                </button>
              </div>

              {/* 아이디 설정 화면 */}
              {view === 'setup' && (
                <div style={{ flex:1, display:'flex', flexDirection:'column',
                  alignItems:'center', justifyContent:'center', padding:20 }}>
                  <div style={{ fontSize:24, marginBottom:12 }}>💬</div>
                  <div style={{ fontSize:14, fontWeight:600, color:'rgba(255,255,255,0.9)',
                    marginBottom:6, fontFamily:'Sora,sans-serif' }}>CodeTalk 시작하기</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginBottom:20,
                    textAlign:'center', fontFamily:'Sora,sans-serif' }}>
                    고유한 아이디를 설정해야<br />다른 개발자와 채팅할 수 있어요
                  </div>
                  <div style={{ width:'100%', position:'relative', marginBottom:8 }}>
                    <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)',
                      color:'rgba(255,255,255,0.3)', fontSize:13 }}>@</span>
                    <input value={handleInput} onChange={e => setHandleInput(e.target.value)}
                      onKeyDown={e => e.key==='Enter' && registerHandle()}
                      placeholder="아이디 입력 (영문/숫자/_)"
                      style={{ width:'100%', paddingLeft:28, paddingRight:12, paddingTop:10, paddingBottom:10,
                        borderRadius:10, background:'rgba(255,255,255,0.07)',
                        border:`1px solid ${handleError?'rgba(239,68,68,0.5)':'rgba(255,255,255,0.1)'}`,
                        color:'rgba(255,255,255,0.9)', fontSize:12, outline:'none',
                        fontFamily:'JetBrains Mono,monospace' }} />
                  </div>
                  {handleError && (
                    <div style={{ fontSize:11, color:'#f87171', marginBottom:8,
                      fontFamily:'Sora,sans-serif' }}>{handleError}</div>
                  )}
                  <button onClick={registerHandle} disabled={loading}
                    style={{ width:'100%', padding:'10px', borderRadius:10,
                      background:`linear-gradient(135deg,${accentColor},#00d4ff)`, color:'#000',
                      border:'none', cursor:'pointer', fontSize:12, fontWeight:700,
                      fontFamily:'Sora,sans-serif', opacity: loading?0.7:1 }}>
                    {loading ? '설정 중...' : '아이디 설정하기'}
                  </button>
                </div>
              )}

              {/* 새 채팅 검색 */}
              {view === 'search' && (
                <div style={{ flex:1, padding:16 }}>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)', marginBottom:12,
                    fontFamily:'Sora,sans-serif' }}>
                    상대방 @아이디를 입력하세요
                  </div>
                  <div style={{ display:'flex', gap:8 }}>
                    <div style={{ flex:1, position:'relative' }}>
                      <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)',
                        color:'rgba(255,255,255,0.3)', fontSize:12 }}>@</span>
                      <input value={searchId} onChange={e => setSearchId(e.target.value)}
                        onKeyDown={e => e.key==='Enter' && startChat()}
                        placeholder="아이디 검색"
                        style={{ width:'100%', paddingLeft:24, paddingRight:10, paddingTop:9, paddingBottom:9,
                          borderRadius:10, background:'rgba(255,255,255,0.07)',
                          border:'1px solid rgba(255,255,255,0.1)',
                          color:'rgba(255,255,255,0.9)', fontSize:12, outline:'none',
                          fontFamily:'JetBrains Mono,monospace' }} />
                    </div>
                    <button onClick={startChat}
                      style={{ padding:'9px 14px', borderRadius:10,
                        background:`linear-gradient(135deg,${accentColor},#00d4ff)`,
                        color:'#000', border:'none', cursor:'pointer' }}>
                      <Search style={{width:15,height:15}} />
                    </button>
                  </div>
                </div>
              )}

              {/* 채팅방 목록 (빈 상태) */}
              {view === 'rooms' && (
                <div style={{ flex:1, display:'flex', flexDirection:'column',
                  alignItems:'center', justifyContent:'center' }}>
                  {!user ? (
                    <div style={{ textAlign:'center', padding:20 }}>
                      <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)',
                        fontFamily:'Sora,sans-serif' }}>
                        채팅하려면 <a href="/codegame-main/login"
                          style={{ color:accentColor }}>로그인</a>이 필요해요
                      </div>
                    </div>
                  ) : !myHandle ? (
                    <button onClick={() => setView('setup')}
                      style={{ padding:'10px 20px', borderRadius:10,
                        background:`linear-gradient(135deg,${accentColor},#00d4ff)`,
                        color:'#000', border:'none', cursor:'pointer',
                        fontSize:12, fontFamily:'Sora,sans-serif', fontWeight:600 }}>
                      아이디 설정하기
                    </button>
                  ) : (
                    <div style={{ textAlign:'center' }}>
                      <MessageCircle style={{ width:32, height:32,
                        color:'rgba(255,255,255,0.15)', margin:'0 auto 10px' }} />
                      <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)',
                        fontFamily:'Sora,sans-serif' }}>
                        왼쪽에서 채팅방을 선택하거나<br />새 채팅을 시작하세요
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 채팅 화면 */}
              {view === 'chat' && (
                <>
                  <div style={{ flex:1, overflowY:'auto', padding:'12px 14px',
                    display:'flex', flexDirection:'column', gap:8 }}>
                    {messages.map(msg => {
                      const isMe = msg.uid === user?.uid;
                      return (
                        <div key={msg.id} style={{ display:'flex', flexDirection:'column',
                          alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                          {!isMe && (
                            <div style={{ fontSize:9, color:'rgba(255,255,255,0.3)',
                              marginBottom:2, fontFamily:'JetBrains Mono,monospace' }}>
                              @{msg.handle}
                            </div>
                          )}
                          <div style={{ maxWidth:'78%', padding:'8px 12px',
                            borderRadius: isMe ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                            background: isMe
                              ? `linear-gradient(135deg,${accentColor},#00d4ff)`
                              : 'rgba(255,255,255,0.09)',
                            color: isMe ? '#000' : 'rgba(255,255,255,0.88)',
                            fontSize:12, fontFamily:'Sora,sans-serif', lineHeight:1.5 }}>
                            {msg.text}
                          </div>
                        </div>
                      );
                    })}
                    {messages.length === 0 && (
                      <div style={{ textAlign:'center', marginTop:40, fontSize:11,
                        color:'rgba(255,255,255,0.25)', fontFamily:'Sora,sans-serif' }}>
                        첫 메시지를 보내보세요!
                      </div>
                    )}
                    <div ref={msgEndRef} />
                  </div>
                  <div style={{ padding:'10px 12px', borderTop:'1px solid rgba(255,255,255,0.07)',
                    display:'flex', gap:8 }}>
                    <input value={input} onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key==='Enter' && send()}
                      placeholder="메시지 입력..."
                      style={{ flex:1, background:'rgba(255,255,255,0.07)',
                        border:'1px solid rgba(255,255,255,0.1)', borderRadius:10,
                        padding:'8px 12px', color:'rgba(255,255,255,0.9)',
                        fontSize:12, fontFamily:'Sora,sans-serif', outline:'none' }} />
                    <button onClick={send}
                      style={{ width:34, height:34, borderRadius:10,
                        background:`linear-gradient(135deg,${accentColor},#00d4ff)`,
                        border:'none', cursor:'pointer', display:'flex',
                        alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <Send style={{width:14,height:14,color:'#000'}} />
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Talk 버튼 */}
      <motion.button onClick={() => setOpen(p => !p)}
        whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
        style={{ width:52, height:52, borderRadius:'50%',
          background:`linear-gradient(135deg,${accentColor},#00d4ff)`,
          border:'none', cursor:'pointer', display:'flex',
          alignItems:'center', justifyContent:'center',
          boxShadow:`0 4px 20px ${accentColor}50`, position:'relative' }}>
        <AnimatePresence mode="wait">
          {open
            ? <motion.div key="x" initial={{rotate:-90,opacity:0}} animate={{rotate:0,opacity:1}} exit={{rotate:90,opacity:0}}>
                <X style={{width:22,height:22,color:'#000'}} />
              </motion.div>
            : <motion.div key="msg" initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.8,opacity:0}}>
                <MessageCircle style={{width:22,height:22,color:'#000'}} />
              </motion.div>
          }
        </AnimatePresence>
        {!open && (
          <motion.div animate={{ scale:[1,1.5,1], opacity:[0.6,0,0.6] }}
            transition={{ duration:2, repeat:Infinity }}
            style={{ position:'absolute', inset:-4, borderRadius:'50%',
              border:`2px solid ${accentColor}`, pointerEvents:'none' }} />
        )}
      </motion.button>
    </div>
  );
}
