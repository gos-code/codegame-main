// @ts-nocheck
import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react';

const BASE = '/codegame-main/music/';
const TRACKS = [
  { id:1,  title:'Lo-fi Breeze',     file:'track1.wav'  },
  { id:2,  title:'Night Code',       file:'track2.wav'  },
  { id:3,  title:'Rainy Seoul',      file:'track3.wav'  },
  { id:4,  title:'Chill Compiler',   file:'track4.wav'  },
  { id:5,  title:'Midnight Deploy',  file:'track5.wav'  },
  { id:6,  title:'Stack Overflow',   file:'track6.wav'  },
  { id:7,  title:'Debug Session',    file:'track7.wav'  },
  { id:8,  title:'Pull Request',     file:'track8.wav'  },
  { id:9,  title:'Git Commit',       file:'track9.wav'  },
  { id:10, title:'Hot Reload',       file:'track10.wav' },
  { id:11, title:'Final Build',      file:'track11.wav' },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i=a.length-1; i>0; i--) {
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}

interface MusicContextType {
  tracks: typeof TRACKS;
  currentTrack: typeof TRACKS[0] | null;
  isPlaying: boolean;
  volume: number;
  play: (track?: typeof TRACKS[0]) => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  setVolume: (v: number) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [queue, setQueue] = useState(() => shuffle(TRACKS));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(() => parseFloat(localStorage.getItem('cg_volume') || '0.4'));

  // Audio 초기화 (한 번만)
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;
    audioRef.current.preload = 'metadata';
    audioRef.current.onended = () => {
      setCurrentIdx(p => (p + 1) % TRACKS.length);
    };
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  // 트랙 변경 시 로드
  useEffect(() => {
    if (!audioRef.current) return;
    const track = queue[currentIdx];
    audioRef.current.src = BASE + track.file;
    audioRef.current.load();
    if (isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [currentIdx, queue]);

  // 볼륨 변경
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
    localStorage.setItem('cg_volume', String(volume));
  }, [volume]);

  const play = (track?: typeof TRACKS[0]) => {
    if (track) {
      const idx = queue.findIndex(t => t.id === track.id);
      if (idx !== -1) setCurrentIdx(idx);
      else {
        setQueue(p => { const q=[...p]; q.unshift(track); return q; });
        setCurrentIdx(0);
      }
    }
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // 자동재생 차단 - 사용자 클릭 후 재생됨
        setIsPlaying(false);
      });
    }
  };

  const pause = () => {
    setIsPlaying(false);
    audioRef.current?.pause();
  };

  const toggle = () => isPlaying ? pause() : play();

  const next = () => {
    setCurrentIdx(p => (p + 1) % queue.length);
    setIsPlaying(true);
  };

  const prev = () => {
    setCurrentIdx(p => (p - 1 + queue.length) % queue.length);
    setIsPlaying(true);
  };

  const setVolume = (v: number) => setVolumeState(v);

  return (
    <MusicContext.Provider value={{
      tracks: TRACKS, currentTrack: queue[currentIdx],
      isPlaying, volume, play, pause, toggle, next, prev, setVolume
    }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error('useMusic must be used within MusicProvider');
  return ctx;
}
