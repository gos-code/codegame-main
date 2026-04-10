// @ts-nocheck
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import {
  auth, db,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  doc, getDoc, updateDoc, setDoc,
  serverTimestamp,
  type User
} from '../../lib/firebase';

interface UserProfile {
  uid: string;
  nickname: string;
  email: string;
  xp: number;
  level: number;
  totalUploads: number;
  bgColor?: string;
  accentColor?: string;
  bio?: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, nickname: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          const snap = await getDoc(doc(db, 'users', u.uid));
          if (snap.exists()) {
            setProfile(snap.data() as UserProfile);
          } else {
            const newProfile: UserProfile = {
              uid: u.uid,
              nickname: u.displayName || u.email?.split('@')[0] || '개발자',
              email: u.email || '',
              xp: 0,
              level: 1,
              totalUploads: 0,
            };
            await setDoc(doc(db, 'users', u.uid), { ...newProfile, createdAt: serverTimestamp() });
            setProfile(newProfile);
          }
          const adminSnap = await getDoc(doc(db, 'config', 'admin'));
          if (adminSnap.exists()) {
            const adminEmail = adminSnap.data()?.email;
            setIsAdmin(adminEmail && u.email?.toLowerCase() === adminEmail.toLowerCase());
          }
        } catch (e) {
          console.error('프로필 로드 실패:', e);
        }
      } else {
        setProfile(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email: string, password: string, nickname: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: nickname });
    await setDoc(doc(db, 'users', cred.user.uid), {
      uid: cred.user.uid,
      nickname,
      email,
      xp: 10,
      level: 1,
      totalUploads: 0,
      createdAt: serverTimestamp()
    });
  };

  const logout = async () => {
    await signOut(auth);
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    await updateDoc(doc(db, 'users', user.uid), data);
    setProfile(prev => prev ? { ...prev, ...data } : null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, register, logout, updateUserProfile, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
