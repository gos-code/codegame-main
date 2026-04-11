// @ts-nocheck
import { createContext, useContext, useState, useEffect, useRef, useCallback, type ReactNode } from 'react';

const BASE = '/codegame-main/music/';
const TRACKS = [
  { id:1,  title:'Lo-fi Breeze',    genre:'Lo-fi Hip Hop', file:'track1.wav'  },
  { id:2,  title:'Night Code',      genre:'Chillhop',      file:'track2.wav'  },
  { id:3,  title:'Rainy Seoul',     genre:'Ambient',       file:'track3.wav'  },
  { id:4,  title:'Chill Compiler',  genre:'Lo-fi Hip Hop', file:'track4.wav'  },
  { id:5,  title:'Midnight Deploy', genre:'Synthwave',     file:'track5.wav'  },
  { id:6,  title:'Stack Overflow',  genre:'Chillhop',      file:'track6.wav'  },
  { id:7,  title:'Debug Session',   genre:'Ambient',       file:'track7.wav'  },
  { id:8,  title:'Pull Request',    genre:'Lo-fi Hip Hop', file:'track8.wav'  },
  { id:9,  title:'Git Commit',      genre:'Synthwave',     file:'track9.wav'  },
  { id:10, title:'Hot Reload',      genre:'Chillhop',      file:'track10.wav' },
  { id:11, title:'Final Build',     genre:'Ambient',       file:'track11.wav' },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const MusicContext = createContext(undefined);

export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef     = useRef<HTMLAudioElement | null>(null);
  const isPlayingRef = useRef(false);          // state 비동기 문제 방지용 ref
  const [queue, setQueue]         = useState(() => shuffle(TRACKS));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState]  = useState(() => {
    try { return parseFloat(localStorage.getItem('cg_volume') || '0.4'); } catch { return 0.4; }
  });

  // ─── Audio 초기화 ───────────────────────────────────────────
  useEffect(() => {
    const audio = new Audio();
    audio.volume = volume;
    audio.preload = 'none';
    audio.onended = () => setCurrentIdx(p => (p + 1) % TRACKS.length);
    audio.onerror = () => setCurrentIdx(p => (p + 1) % TRACKS.length);
    audioRef.current = audio;
    return () => { audio.pause(); audioRef.current = null; };
  }, []);

  // ─── 트랙 변경 → 로드 → 재생 ────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const track = queue[currentIdx];
    audio.src = BASE + track.file;
    audio.load();
    // ref를 보고 재생 여부 결정 (state는 비동기라 늦을 수 있음)
    if (isPlayingRef.current) {
      audio.play().catch(() => {
        isPlayingRef.current = false;
        setIsPlaying(false);
      });
    }
  }, [currentIdx, queue]);

  // ─── 볼륨 변경 ──────────────────────────────────────────────
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
    try { localStorage.setItem('cg_volume', String(volume)); } catch {}
  }, [volume]);

  // ─── play ───────────────────────────────────────────────────
  const play = useCallback((track?: typeof TRACKS[0]) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (track) {
      const idx = queue.findIndex(t => t.id === track.id);
      isPlayingRef.current = true;
      setIsPlaying(true);
      if (idx !== -1) {
        if (idx === currentIdx) {
          // 같은 트랙 → 그냥 재생
          audio.play().catch(() => { isPlayingRef.current = false; setIsPlaying(false); });
        } else {
          setCurrentIdx(idx);   // useEffect에서 load 후 재생
        }
      } else {
        setQueue(p => [track, ...p]);
        setCurrentIdx(0);
      }
      return;
    }

    // 트랙 지정 없이 play() → 현재 트랙 재생
    isPlayingRef.current = true;
    setIsPlaying(true);
    audio.play().catch(() => {
      isPlayingRef.current = false;
      setIsPlaying(false);
    });
  }, [queue, currentIdx]);

  // ─── pause ──────────────────────────────────────────────────
  const pause = useCallback(() => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    audioRef.current?.pause();
  }, []);

  const toggle = useCallback(() => {
    isPlayingRef.current ? pause() : play();
  }, [pause, play]);

  const next = useCallback(() => {
    isPlayingRef.current = true;
    setIsPlaying(true);
    setCurrentIdx(p => (p + 1) % queue.length);
  }, [queue.length]);

  const prev = useCallback(() => {
    isPlayingRef.current = true;
    setIsPlaying(true);
    setCurrentIdx(p => (p - 1 + queue.length) % queue.length);
  }, [queue.length]);

  const setVolume = useCallback((v: number) => setVolumeState(v), []);

  return (
    <MusicContext.Provider value={{
      tracks: TRACKS,
      currentTrack: queue[currentIdx],
      isPlaying, volume,
      play, pause, toggle, next, prev, setVolume,
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
