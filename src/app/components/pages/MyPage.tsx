// @ts-nocheck
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate, useSearchParams } from 'react-router';
import { Download, Copy, Check, Trash2, LogOut, ShoppingBag, DollarSign, Key, Settings, Shield } from 'lucide-react';
import { db, auth, collection, query, where, getDocs, doc, getDoc, updateDoc, deleteDoc,
  serverTimestamp, increment } from '../../../lib/firebase';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import AdminPanel from '../AdminPanel';

// ── 라이선스 엑셀 다운로드 (SheetJS CDN 없이 CSV로 대체) ──────────
function downloadLicenseCSV(purchases: any[]) {
  const now = new Date();
  const rows = [
    ['상품명', '라이선스 키', '구매일', '유효기간', '상태', '남은 일수'],
    ...purchases
      .filter(p => p.licenseKey)
      .map(p => {
        const purchased = p.purchasedAt?.toDate?.() || new Date();
        const expires = p.expiresAt ? new Date(p.expiresAt) : new Date(purchased.getTime() + 365*24*60*60*1000);
        const daysLeft = Math.ceil((expires.getTime() - now.getTime()) / (1000*60*60*24));
        return [
          p.title || '—',
          p.licenseKey,
          purchased.toLocaleDateString('ko-KR'),
          expires.toLocaleDateString('ko-KR'),
          daysLeft > 0 ? '활성' : '만료',
          daysLeft > 0 ? `${daysLeft}일` : '만료됨',
        ];
      })
      .sort((a, b) => {
        // 유효기간 남은 일수 오름차순 (임박한 것이 위로)
        const da = parseInt(String(a[5])) || 9999;
        const db2 = parseInt(String(b[5])) || 9999;
        return da - db2;
      })
  ];
  const csv = rows.map(r => r.map(c => '"' + String(c).replace(/"/g, '""') + '"').join(',')).join('\n');
  const blob = new Blob(['﻿' + csv], { type:'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `codeduck_licenses_${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}

type Tab = 'purchases' | 'sales' | 'revenue' | 'licenses' | 'settings' | 'admin';

export default function MyPage() {
  const { accentColor, bgColor } = useTheme();
  const { user, profile, logout, isAdmin } = useAuth();
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState<Tab>((searchParams.get('tab') as Tab) || 'purchases');
  const [purchases, setPurchases] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState('');

  useEffect(() => {
    if (!user) { nav('/login'); return; }
    loadData();
  }, [user, tab]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      if (tab === 'purchases' || tab === 'licenses') {
        const snap = await getDocs(query(collection(db,'purchases'), where('buyerUid','==',user.uid)));
        setPurchases(snap.docs.map(d => ({ id:d.id,...d.data() })));
      }
      if (tab === 'sales' || tab === 'revenue') {
        const snap = await getDocs(query(collection(db,'uploads'), where('uid','==',user.uid)));
        setSales(snap.docs.map(d => ({ id:d.id,...d.data() })));
      }
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key).then(() => {
      setCopiedKey(key); setTimeout(() => setCopiedKey(''), 2000);
    });
  };

  const recordDownload = async (purchaseId: string) => {
    await updateDoc(doc(db,'purchases',purchaseId), { downloadCount: increment(1) }).catch(()=>{});
  };

  const deleteSale = async (id: string) => {
    if (!window.confirm('정말 삭제할까요?')) return;
    await deleteDoc(doc(db,'uploads',id));
    setSales(p => p.filter(s => s.id !== id));
  };

  if (!user) return null;

  const totalRevenue = sales.reduce((a,s) => a + (s.revenue||0), 0);
  const tabs: {id:Tab; label:string; icon:any}[] = [
    { id:'purchases', label:'구매 내역', icon:ShoppingBag },
    { id:'sales', label:'내 상품', icon:DollarSign },
    { id:'revenue', label:'수익 현황', icon:TrendingUp },
    { id:'licenses', label:'라이선스 키', icon:Key },
    { id:'settings', label:'설정', icon:Settings },
    ...(isAdmin ? [{ id:'admin' as Tab, label:'관리자', icon:Shield }] : []),
  ];

  return (
    <div className="min-h-screen px-6 py-8" style={{ background:'var(--background)' }}>
      <div className="max-w-5xl mx-auto">
        {/* 프로필 헤더 */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          className="flex items-center gap-5 mb-8 p-6 rounded-2xl"
          style={{ background:'var(--card)', border:'1px solid var(--border)', backdropFilter:'blur(20px)' }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black"
            style={{ background:`linear-gradient(135deg,${accentColor},#00d4ff)`, color:'#000',
              fontFamily:'Orbitron,monospace', boxShadow:`0 0 30px ${accentColor}40`, flexShrink:0 }}>
            {(profile?.nickname||'U')[0].toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold" style={{ color:'var(--foreground)' }} style={{ fontFamily:'Sora,sans-serif' }}>
              {profile?.nickname || user.email}
            </h1>
            <p className="text-sm mt-0.5" style={{ color:'var(--muted-foreground)' }} style={{ fontFamily:'Sora,sans-serif' }}>{user.email}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs font-bold" style={{ color:accentColor, fontFamily:'Orbitron,monospace' }}>
                LV.{String(profile?.level||1).padStart(2,'0')}
              </span>
              <div className="w-24 h-1.5 rounded-full" style={{ background:'var(--border)' }}>
                <div className="h-full rounded-full" style={{ width:`${(profile?.xp||0)%100}%`, background:accentColor }} />
              </div>
              <span className="text-xs" style={{ color:'var(--muted-foreground)' }} style={{ fontFamily:'JetBrains Mono,monospace' }}>
                {profile?.xp||0} XP
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label:'등록', val: profile?.totalUploads||0 },
              { label:'수익', val: `₩${(totalRevenue/10000).toFixed(0)}만` },
              { label:'구매', val: purchases.length },
            ].map(s => (
              <div key={s.label} className="text-center rounded-xl py-3 px-4"
                style={{ background:'var(--card)' }}>
                <div className="text-lg font-bold" style={{ color:accentColor, fontFamily:'Orbitron,monospace' }}>{s.val}</div>
                <div className="text-xs mt-0.5" style={{ color:'var(--muted-foreground)' }} style={{ fontFamily:'Sora,sans-serif' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 탭 */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background:'var(--card)' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={()=>setTab(t.id)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-medium transition-all"
              style={{ background: tab===t.id ? accentColor : 'transparent',
                color: tab===t.id ? '#000' : 'var(--muted-foreground)',
                fontFamily:'Sora,sans-serif' }}>
              <t.icon className="w-3.5 h-3.5" />{t.label}
            </button>
          ))}
        </div>

        {/* 콘텐츠 */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 rounded-full animate-spin"
              style={{ borderColor:`${accentColor}30`, borderTopColor:accentColor }} />
          </div>
        ) : (
          <>
            {/* 구매 내역 */}
            {tab==='purchases' && (
              <div className="space-y-3">
                {purchases.length===0 ? (
                  <div className="text-center py-20 text-sm" style={{ color:'var(--muted-foreground)' }} style={{ fontFamily:'Sora,sans-serif' }}>
                    구매한 상품이 없어요
                  </div>
                ) : purchases.map(p => (
                  <div key={p.id} className="flex items-center gap-4 p-4 rounded-xl"
                    style={{ background:'var(--card)', border:'1px solid var(--border)' }}>
                    <div className="flex-1">
                      <div className="text-sm font-medium" style={{ color:'var(--foreground)' }} style={{ fontFamily:'Sora,sans-serif' }}>{p.title}</div>
                      <div className="text-xs mt-1" style={{ color:'var(--muted-foreground)' }} style={{ fontFamily:'JetBrains Mono,monospace' }}>
                        {p.purchasedAt?.toDate?.()?.toLocaleDateString('ko-KR')||'—'} · ₩{(p.price||0).toLocaleString()}
                      </div>
                    </div>
                    <a href={p.fileUrl} target="_blank" rel="noreferrer" onClick={()=>recordDownload(p.id)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs transition-all"
                      style={{ background:`${accentColor}12`, color:accentColor, border:`1px solid ${accentColor}25`,
                        fontFamily:'Sora,sans-serif' }}>
                      <Download className="w-3.5 h-3.5" />다운로드
                    </a>
                  </div>
                ))}
              </div>
            )}

            {/* 내 상품 */}
            {tab==='sales' && (
              <div className="space-y-3">
                {sales.length===0 ? (
                  <div className="text-center py-20 text-sm" style={{ color:'var(--muted-foreground)' }} style={{ fontFamily:'Sora,sans-serif' }}>
                    등록한 상품이 없어요
                  </div>
                ) : sales.map(s => (
                  <div key={s.id} className="flex items-center gap-4 p-4 rounded-xl"
                    style={{ background:'var(--card)', border:'1px solid var(--border)' }}>
                    <div className="flex-1">
                      <div className="text-sm font-medium" style={{ color:'var(--foreground)' }} style={{ fontFamily:'Sora,sans-serif' }}>{s.title}</div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: s.status==='approved' ? `${accentColor}15` : s.status==='pending' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                            color: s.status==='approved' ? accentColor : s.status==='pending' ? '#f59e0b' : '#ef4444',
                            border: `1px solid ${s.status==='approved' ? `${accentColor}30` : s.status==='pending' ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.2)'}`,
                            fontFamily:'JetBrains Mono,monospace' }}>
                          {s.status==='approved' ? '승인' : s.status==='pending' ? '검수중' : '반려'}
                        </span>
                        <span className="text-xs" style={{ color:'var(--muted-foreground)' }} style={{ fontFamily:'JetBrains Mono,monospace' }}>
                          {s.salesCount||0}판매 · ₩{(s.revenue||0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm font-bold" style={{ color:accentColor, fontFamily:'Orbitron,monospace' }}>
                      ₩{(s.price||0).toLocaleString()}
                    </div>
                    <button onClick={()=>deleteSale(s.id)} className="hover:text-red-400 transition-colors p-1.5" style={{ color:'var(--muted-foreground)' }}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 수익 현황 */}
            {tab==='revenue' && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label:'총 수익', val:`₩${totalRevenue.toLocaleString()}`, color:accentColor },
                    { label:'총 판매', val:`${sales.reduce((a,s)=>a+(s.salesCount||0),0)}건`, color:'white' },
                    { label:'등록 상품', val:`${sales.length}개`, color:'white' },
                  ].map(s => (
                    <div key={s.label} className="text-center rounded-xl p-5"
                      style={{ background:'var(--card)', border:'1px solid var(--border)' }}>
                      <div className="text-2xl font-bold mb-1"
                        style={{ color:s.color==='white'?'var(--foreground)':s.color, fontFamily:'Orbitron,monospace' }}>
                        {s.val}
                      </div>
                      <div className="text-xs" style={{ color:'var(--muted-foreground)' }} style={{ fontFamily:'Sora,sans-serif' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                {sales.filter(s=>s.status==='approved').map(s => (
                  <div key={s.id} className="flex items-center justify-between p-4 rounded-xl"
                    style={{ background:'var(--card)', border:'1px solid var(--border)' }}>
                    <div className="text-sm" style={{ color:'var(--foreground)' }} style={{ fontFamily:'Sora,sans-serif' }}>{s.title}</div>
                    <div className="text-right">
                      <div className="text-sm font-bold" style={{ color:accentColor, fontFamily:'Orbitron,monospace' }}>
                        ₩{(s.revenue||0).toLocaleString()}
                      </div>
                      <div className="text-xs" style={{ color:'var(--muted-foreground)' }} style={{ fontFamily:'JetBrains Mono,monospace' }}>{s.salesCount||0}건</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 라이선스 키 */}
            {tab==='licenses' && (
              <div className="space-y-3">
                {purchases.length===0 ? (
                  <div className="text-center py-20 text-sm" style={{ color:'var(--muted-foreground)' }} style={{ fontFamily:'Sora,sans-serif' }}>라이선스 키가 없어요</div>
                ) : purchases.map(p => (
                  <div key={p.id} className="p-4 rounded-xl"
                    style={{ background:'var(--card)', border:'1px solid var(--border)' }}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm font-medium" style={{ color:'var(--foreground)' }} style={{ fontFamily:'Sora,sans-serif' }}>{p.title}</div>
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background:`${accentColor}12`, color:accentColor, border:`1px solid ${accentColor}25`,
                          fontFamily:'JetBrains Mono,monospace' }}>
                        {p.isActive!==false ? '● 활성' : '○ 만료'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-xl"
                      style={{ background:`${accentColor}06`, border:`1px solid ${accentColor}18` }}>
                      <code className="flex-1 text-xs break-all" style={{ color:accentColor, fontFamily:'JetBrains Mono,monospace' }}>
                        {p.licenseKey||'키 없음'}
                      </code>
                      {p.licenseKey && (
                        <button onClick={()=>copyKey(p.licenseKey)}
                          className="flex-shrink-0 p-1.5 rounded-lg transition-colors"
                          style={{ background:'var(--secondary)' }}>
                          {copiedKey===p.licenseKey ? <Check className="w-4 h-4" style={{ color:accentColor }} /> : <Copy className="w-4 h-4" style={{ color:'var(--muted-foreground)' }} />}
                        </button>
                      )}
                    </div>
                    <div className="text-xs mt-2" style={{ color:'var(--muted-foreground)' }} style={{ fontFamily:'JetBrains Mono,monospace' }}>유효기간: 영구</div>
                  </div>
                ))}
              </div>
            )}

            {/* 설정 */}
            {tab==='settings' && (
              <div className="space-y-4 max-w-md">
                <div className="p-5 rounded-xl" style={{ background:'var(--card)', border:'1px solid var(--border)' }}>
                  <h3 className="text-sm font-semibold mb-4" style={{ color:'var(--foreground)' }} style={{ fontFamily:'Sora,sans-serif' }}>계정 정보</h3>
                  <div className="space-y-2 text-xs" style={{ color:'var(--muted-foreground)' }}>
                    <div>이메일: <span className="" style={{ color:'var(--foreground)' }}>{user.email}</span></div>
                    <div>닉네임: <span className="" style={{ color:'var(--foreground)' }}>{profile?.nickname}</span></div>
                    <div>레벨: <span style={{ color:accentColor }}>LV.{profile?.level||1}</span></div>
                  </div>
                </div>
                <button onClick={()=>logout().then(()=>nav('/'))}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm transition-all"
                  style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)',
                    color:'#f87171', fontFamily:'Sora,sans-serif' }}>
                  <LogOut className="w-4 h-4" />로그아웃
                </button>
              </div>
            )}

            {/* 관리자 패널 */}
            {tab==='admin' && isAdmin && <AdminPanel accentColor={accentColor} />}
          </>
        )}
      </div>
    </div>
  );
}

function TrendingUp(props: any) { return <DollarSign {...props} />; }
