// @ts-nocheck
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, ThumbsUp, Eye, Plus, ArrowLeft, Send, X } from 'lucide-react';
import { db, collection, addDoc, getDocs, query, orderBy, where,
  doc, getDoc, updateDoc, increment, serverTimestamp, onSnapshot } from '../../../lib/firebase';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

const CATEGORIES = ['전체','프론트엔드','백엔드','AI/ML','아키텍처','언어'];

export default function Community() {
  const { accentColor, theme } = useTheme();
  const { user, profile } = useAuth();
  const isDark = theme === 'dark';
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState('전체');
  const [search, setSearch] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [showWrite, setShowWrite] = useState(false);
  const [newPost, setNewPost] = useState({ title:'', content:'', category:'프론트엔드', tags:'' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const q = query(collection(db,'community_posts'), orderBy('createdAt','desc'));
    const unsub = onSnapshot(q, snap => {
      setPosts(snap.docs.map(d => ({ id:d.id, ...d.data() })));
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, []);

  useEffect(() => {
    if (!selectedPost) return;
    const q = query(collection(db,'community_posts',selectedPost.id,'comments'),
      orderBy('createdAt','asc'));
    const unsub = onSnapshot(q, snap => {
      setComments(snap.docs.map(d => ({ id:d.id, ...d.data() })));
    });
    return unsub;
  }, [selectedPost]);

  const openPost = async (post) => {
    setSelectedPost(post);
    await updateDoc(doc(db,'community_posts',post.id), { views: increment(1) }).catch(()=>{});
  };

  const submitPost = async () => {
    if (!user) { alert('로그인이 필요해요'); return; }
    if (!newPost.title.trim() || !newPost.content.trim()) { alert('제목과 내용을 입력해주세요'); return; }
    setSubmitting(true);
    try {
      await addDoc(collection(db,'community_posts'), {
        ...newPost,
        tags: newPost.tags.split(',').map(t=>t.trim()).filter(Boolean),
        uid: user.uid,
        author: profile?.nickname || user.email,
        likes: 0, views: 0, commentCount: 0,
        createdAt: serverTimestamp()
      });
      setShowWrite(false);
      setNewPost({ title:'', content:'', category:'프론트엔드', tags:'' });
    } catch(e) { alert('등록 실패: '+e.message); }
    setSubmitting(false);
  };

  const submitComment = async () => {
    if (!user) { alert('로그인이 필요해요'); return; }
    if (!commentInput.trim()) return;
    const text = commentInput.trim();
    setCommentInput('');
    await addDoc(collection(db,'community_posts',selectedPost.id,'comments'), {
      text, uid: user.uid,
      author: profile?.nickname || user.email,
      createdAt: serverTimestamp()
    });
    await updateDoc(doc(db,'community_posts',selectedPost.id), { commentCount: increment(1) }).catch(()=>{});
  };

  const likePost = async (postId, e) => {
    e.stopPropagation();
    if (!user) return;
    await updateDoc(doc(db,'community_posts',postId), { likes: increment(1) }).catch(()=>{});
  };

  const filtered = posts.filter(p => {
    const matchCat = cat==='전체' || p.category===cat;
    const matchQ = !search || p.title?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchQ;
  });

  const cardStyle = {
    background:'var(--card)', border:'1px solid var(--border)',
    borderRadius:14, padding:'18px 20px', cursor:'pointer', transition:'all 0.2s'
  };

  const inputStyle = {
    width:'100%', padding:'10px 14px', borderRadius:10, fontSize:13,
    fontFamily:'Sora,sans-serif', outline:'none',
    background:'var(--input)', border:'1px solid var(--border)', color:'var(--foreground)'
  };

  // 게시글 상세 화면
  if (selectedPost) return (
    <div className="min-h-screen py-10" style={{ background:'var(--background)', color:'var(--foreground)' }}>
      <div className="max-w-3xl mx-auto px-6">
        <button onClick={() => setSelectedPost(null)}
          className="flex items-center gap-2 mb-6 text-sm"
          style={{ color:'var(--muted)', fontFamily:'Sora,sans-serif', background:'none', border:'none', cursor:'pointer' }}>
          <ArrowLeft className="w-4 h-4" /> 목록으로
        </button>
        <div className="rounded-2xl p-8 mb-6" style={{ background:'var(--card)', border:'1px solid var(--border)' }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium"
              style={{ background:`${accentColor}15`, color:accentColor, border:`1px solid ${accentColor}25`,
                fontFamily:'JetBrains Mono,monospace' }}>
              {selectedPost.category}
            </span>
          </div>
          <h1 className="text-xl font-bold mb-3"
            style={{ color:'var(--foreground)', fontFamily:'Sora,sans-serif' }}>
            {selectedPost.title}
          </h1>
          <div className="flex items-center gap-4 text-xs mb-6"
            style={{ color:'var(--muted)', fontFamily:'Sora,sans-serif' }}>
            <span>{selectedPost.author}</span>
            <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{selectedPost.views||0}</span>
            <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" />{selectedPost.likes||0}</span>
          </div>
          <div className="text-sm leading-relaxed mb-5"
            style={{ color:'var(--foreground)', fontFamily:'Sora,sans-serif', whiteSpace:'pre-wrap' }}>
            {selectedPost.content}
          </div>
          {selectedPost.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedPost.tags.map((t,i) => (
                <span key={i} className="px-2.5 py-0.5 rounded-full text-xs"
                  style={{ background:'var(--secondary)', color:'var(--foreground)',
                    fontFamily:'JetBrains Mono,monospace' }}>
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 댓글 */}
        <div className="rounded-2xl p-6" style={{ background:'var(--card)', border:'1px solid var(--border)' }}>
          <h3 className="text-sm font-bold mb-4"
            style={{ color:'var(--foreground)', fontFamily:'Sora,sans-serif' }}>
            댓글 {comments.length}개
          </h3>
          <div className="space-y-3 mb-5">
            {comments.map(c => (
              <div key={c.id} className="flex gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background:`linear-gradient(135deg,${accentColor},#00d4ff)`, color:'#000',
                    fontFamily:'Orbitron,monospace' }}>
                  {(c.author||'?')[0].toUpperCase()}
                </div>
                <div>
                  <div className="text-xs font-semibold mb-0.5"
                    style={{ color: accentColor, fontFamily:'Sora,sans-serif' }}>{c.author}</div>
                  <div className="text-sm" style={{ color:'var(--foreground)', fontFamily:'Sora,sans-serif' }}>
                    {c.text}
                  </div>
                </div>
              </div>
            ))}
            {comments.length === 0 && (
              <div className="text-center py-6 text-sm" style={{ color:'var(--muted)' }}>
                첫 댓글을 남겨보세요!
              </div>
            )}
          </div>
          {user ? (
            <div className="flex gap-3">
              <input value={commentInput} onChange={e=>setCommentInput(e.target.value)}
                onKeyDown={e=>e.key==='Enter'&&submitComment()}
                placeholder="댓글을 입력하세요..."
                style={{ ...inputStyle, flex:1 }} />
              <button onClick={submitComment}
                className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold"
                style={{ background:`linear-gradient(135deg,${accentColor},#00d4ff)`, color:'#000',
                  border:'none', cursor:'pointer', fontFamily:'Sora,sans-serif' }}>
                <Send className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="text-center text-sm py-3" style={{ color:'var(--muted)' }}>
              <a href="/codegame-main/login" style={{ color:accentColor }}>로그인</a>하면 댓글을 남길 수 있어요
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-10" style={{ background:'var(--background)', color:'var(--foreground)' }}>
      <div className="max-w-6xl mx-auto px-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-xs uppercase tracking-widest mb-2"
              style={{ color:accentColor, fontFamily:'JetBrains Mono,monospace' }}>COMMUNITY</div>
            <h1 className="text-2xl font-bold" style={{ color:'var(--foreground)', fontFamily:'Sora,sans-serif' }}>
              커뮤니티
            </h1>
            <p className="text-sm mt-1" style={{ color:'var(--muted)', fontFamily:'Sora,sans-serif' }}>
              개발자들과 지식을 공유하고 소통하세요
            </p>
          </div>
          <button onClick={() => user ? setShowWrite(true) : alert('로그인이 필요해요')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background:`linear-gradient(135deg,${accentColor},#00d4ff)`, color:'#000',
              border:'none', cursor:'pointer', fontFamily:'Sora,sans-serif' }}>
            <Plus className="w-4 h-4" /> 글쓰기
          </button>
        </div>

        {/* 검색 + 카테고리 */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="게시글 검색..."
            className="flex-1 min-w-48"
            style={{ ...inputStyle, padding:'9px 14px' }} />
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={{
                  background: cat===c ? accentColor : 'var(--card)',
                  color: cat===c ? '#000' : 'var(--muted)',
                  border: `1px solid ${cat===c ? 'transparent' : 'var(--border)'}`,
                  fontFamily:'Sora,sans-serif'
                }}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* 게시글 목록 */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_,i) => (
              <div key={i} className="h-24 rounded-2xl animate-pulse"
                style={{ background:'var(--card)' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <MessageSquare className="w-10 h-10 mx-auto mb-3" style={{ color:'var(--muted)' }} />
            <p className="text-sm" style={{ color:'var(--muted)', fontFamily:'Sora,sans-serif' }}>
              아직 게시글이 없어요. 첫 글을 써보세요!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((post, i) => (
              <motion.div key={post.id} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                transition={{ delay:i*0.04 }}
                onClick={() => openPost(post)}
                style={cardStyle}
                onMouseOver={e => e.currentTarget.style.borderColor = `${accentColor}40`}
                onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded-full text-xs"
                        style={{ background:`${accentColor}12`, color:accentColor,
                          border:`1px solid ${accentColor}20`, fontFamily:'JetBrains Mono,monospace' }}>
                        {post.category}
                      </span>
                      {post.tags?.slice(0,2).map((t,j) => (
                        <span key={j} className="px-2 py-0.5 rounded-full text-xs"
                          style={{ background:'var(--secondary)', color:'var(--muted)',
                            fontFamily:'JetBrains Mono,monospace' }}>
                          #{t}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-sm font-semibold mb-1 truncate"
                      style={{ color:'var(--foreground)', fontFamily:'Sora,sans-serif' }}>
                      {post.title}
                    </h3>
                    <p className="text-xs line-clamp-1"
                      style={{ color:'var(--muted)', fontFamily:'Sora,sans-serif' }}>
                      {post.content}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <div className="flex items-center gap-3 text-xs" style={{ color:'var(--muted)' }}>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" />{post.likes||0}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />{post.commentCount||0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />{post.views||0}
                      </span>
                    </div>
                    <div className="text-xs" style={{ color:'var(--muted)', fontFamily:'Sora,sans-serif' }}>
                      {post.author}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* 글쓰기 모달 */}
      <AnimatePresence>
        {showWrite && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background:'rgba(0,0,0,0.7)', backdropFilter:'blur(8px)' }}>
            <motion.div initial={{ scale:0.95, opacity:0 }} animate={{ scale:1, opacity:1 }}
              exit={{ scale:0.95, opacity:0 }}
              className="w-full max-w-lg rounded-2xl p-7"
              style={{ background: isDark ? '#070b16' : '#fff', border:`1px solid var(--border)` }}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold"
                  style={{ color:'var(--foreground)', fontFamily:'Sora,sans-serif' }}>새 글 쓰기</h3>
                <button onClick={() => setShowWrite(false)}
                  style={{ background:'none', border:'none', cursor:'pointer', color:'var(--muted)' }}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs mb-1.5 uppercase tracking-wide"
                      style={{ color:'var(--muted)', fontFamily:'JetBrains Mono,monospace' }}>카테고리</label>
                    <select value={newPost.category}
                      onChange={e=>setNewPost(p=>({...p,category:e.target.value}))}
                      style={inputStyle}>
                      {CATEGORIES.filter(c=>c!=='전체').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs mb-1.5 uppercase tracking-wide"
                      style={{ color:'var(--muted)', fontFamily:'JetBrains Mono,monospace' }}>태그</label>
                    <input value={newPost.tags}
                      onChange={e=>setNewPost(p=>({...p,tags:e.target.value}))}
                      placeholder="React, TypeScript (쉼표 구분)"
                      style={inputStyle} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs mb-1.5 uppercase tracking-wide"
                    style={{ color:'var(--muted)', fontFamily:'JetBrains Mono,monospace' }}>제목 *</label>
                  <input value={newPost.title}
                    onChange={e=>setNewPost(p=>({...p,title:e.target.value}))}
                    placeholder="게시글 제목을 입력하세요"
                    style={inputStyle} />
                </div>
                <div>
                  <label className="block text-xs mb-1.5 uppercase tracking-wide"
                    style={{ color:'var(--muted)', fontFamily:'JetBrains Mono,monospace' }}>내용 *</label>
                  <textarea value={newPost.content}
                    onChange={e=>setNewPost(p=>({...p,content:e.target.value}))}
                    rows={6} placeholder="내용을 작성해주세요..."
                    style={{ ...inputStyle, resize:'none' }} />
                </div>
                <button onClick={submitPost} disabled={submitting}
                  className="w-full py-3 rounded-xl text-sm font-semibold"
                  style={{ background:`linear-gradient(135deg,${accentColor},#00d4ff)`, color:'#000',
                    border:'none', cursor:'pointer', fontFamily:'Sora,sans-serif',
                    opacity: submitting?0.7:1 }}>
                  {submitting ? '등록 중...' : '게시글 등록'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
