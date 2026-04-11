// @ts-nocheck
import React from 'react';

const GRID_W = 16;
const GRID_H = 24;

interface PixelCharacterProps {
  style?: string;
  outfit?: string;
  bottom?: string;
  hair?: string;
  hairColor?: string;
  gender?: string;
  skin?: string;
  scale?: number;
  direction?: number;
  isWalking?: boolean;
}

// outfit ID → 상의 색상 팔레트
const OUTFIT_COLORS: Record<string, { top: string; sleeve: string; detail: string }> = {
  // 남자
  HOODIE:   { top:'#2a2a3a', sleeve:'#2a2a3a', detail:'#00ccff' },
  TSHIRT:   { top:'#e8e8e8', sleeve:'#e8e8e8', detail:'#888888' },
  LONGTEE:  { top:'#3355aa', sleeve:'#3355aa', detail:'#aabbff' },
  JACKET:   { top:'#1a1a1a', sleeve:'#222222', detail:'#ffcc00' },
  CARDIGAN: { top:'#c0a080', sleeve:'#c0a080', detail:'#ffffff' },
  SCHOOL_M: { top:'#f0f0f0', sleeve:'#f0f0f0', detail:'#2233aa' },
  SUIT:     { top:'#223344', sleeve:'#223344', detail:'#ffffff' },
  SPORT:    { top:'#cc2200', sleeve:'#cc2200', detail:'#ffffff' },
  TECHWEAR: { top:'#111111', sleeve:'#111111', detail:'#00ff88' },
  VEST:     { top:'#664422', sleeve:'#aa6633', detail:'#ffcc88' },
  JUMPER:   { top:'#445533', sleeve:'#445533', detail:'#ffaa00' },
  // 여자
  HOODIE_F:   { top:'#cc4488', sleeve:'#cc4488', detail:'#ffaacc' },
  BLOUSE:     { top:'#f8f0e8', sleeve:'#f8f0e8', detail:'#cc8844' },
  KNIT:       { top:'#aa6633', sleeve:'#aa6633', detail:'#ffddbb' },
  CROP:       { top:'#ffffff', sleeve:'#ffffff', detail:'#cccccc' },
  ONEPIECE:   { top:'#8844cc', sleeve:'#8844cc', detail:'#ffaaff' },
  SCHOOL_F:   { top:'#f0f0f0', sleeve:'#f0f0f0', detail:'#cc2222' },
  SUIT_F:     { top:'#334455', sleeve:'#334455', detail:'#aabbcc' },
  SPORT_F:    { top:'#0044cc', sleeve:'#0044cc', detail:'#ffffff' },
  TECHWEAR_F: { top:'#111122', sleeve:'#111122', detail:'#ff00ff' },
  FANTASY:    { top:'#6622aa', sleeve:'#8833cc', detail:'#ffdd44' },
};

// bottom ID → 하의 색상
const BOTTOM_COLORS: Record<string, string> = {
  CARGO: '#556644', JEANS: '#334477', SLACKS: '#333344',
  SHORTS: '#224466', JOGGER: '#222222', SCHOOL_B: '#222222',
  LONGSKIRT: '#334466', MINISKIRT: '#cc4477', JEANS_F: '#334477',
  LEGGINGS: '#111111', SCHOOL_BF: '#334466', SHORTS_F: '#ff6688',
};

// shoes ID → 신발 색상
const SHOES_COLORS: Record<string, string> = {
  SNEAKER: '#eeeeee', HIGHTOP: '#222222', LOAFER: '#332211',
  OXFORD: '#221100', BOOTS: '#442200', SANDAL: '#cc9966',
  SNEAKER_F: '#ffffff', FLAT: '#cc8866', LOAFER_F: '#554433',
  ANKLEBOOT: '#222222', LONGBOOT: '#111111', HEELS: '#cc4466',
};

export function PixelCharacter({
  style = 'STREETWEAR',
  outfit,
  bottom,
  hair = 'SHORT',
  hairColor = '#1a1a1a',
  gender = 'NEUTRAL',
  skin = '#EFC4A8',
  scale = 1,
  direction = 1,
  isWalking = false,
}: PixelCharacterProps) {

  const pixels: string[][] = Array(GRID_H).fill(null).map(() => Array(GRID_W).fill(null));

  const fillRect = (x: number, y: number, w: number, h: number, c: string) => {
    for (let i = y; i < y + h; i++)
      for (let j = x; j < x + w; j++)
        if (i >= 0 && i < GRID_H && j >= 0 && j < GRID_W) pixels[i][j] = c;
  };

  // 색상 결정 - outfit ID 우선, 없으면 style 기반 fallback
  let topColor = '#cccccc', sleeveColor = '#cccccc', detailColor = '#ffffff';
  let bottomColor = '#334455', shoesColor = '#111111';

  if (outfit && OUTFIT_COLORS[outfit]) {
    topColor    = OUTFIT_COLORS[outfit].top;
    sleeveColor = OUTFIT_COLORS[outfit].sleeve;
    detailColor = OUTFIT_COLORS[outfit].detail;
  } else {
    // style 기반 fallback
    if (style === 'STREETWEAR') { topColor='#2a2a3a'; sleeveColor='#2a2a3a'; detailColor='#00ccff'; }
    else if (style === 'SCHOOL') { topColor='#f0f0f0'; sleeveColor='#f0f0f0'; detailColor = gender==='FEM'?'#cc2222':'#2233aa'; }
    else if (style === 'VINTAGE') { topColor='#554433'; sleeveColor='#554433'; detailColor='#ddccaa'; }
    else if (style === 'TECHWEAR') { topColor='#111111'; sleeveColor='#111111'; detailColor='#00ff88'; }
  }

  if (bottom && BOTTOM_COLORS[bottom]) bottomColor = BOTTOM_COLORS[bottom];
  else if (style === 'SCHOOL') bottomColor = gender==='FEM' ? '#334466' : '#222222';

  // outfit에서 신발 결정
  const shoeKey = outfit?.replace(/_F$/, '') === 'BOOTS' ? 'BOOTS'
    : outfit === 'OXFORD' || outfit === 'SUIT' || outfit === 'SUIT_F' ? 'OXFORD'
    : outfit === 'SCHOOL_M' || outfit === 'SCHOOL_F' ? 'LOAFER'
    : outfit === 'HEELS' ? 'HEELS'
    : gender === 'FEM' ? 'SNEAKER_F' : 'SNEAKER';
  shoesColor = SHOES_COLORS[shoeKey] || '#111111';

  // ── 바디 그리기 ──────────────────────────────────────
  // 피부
  fillRect(5, 2, 6, 5, skin);   // 머리
  fillRect(7, 7, 2, 1, skin);   // 목
  fillRect(4, 8, 2, 4, skin);   // 왼팔 (짧은 소매 기본)
  fillRect(10, 8, 2, 4, skin);
  fillRect(4, 12, 2, 4, skin);  // 손목/손
  fillRect(10, 12, 2, 4, skin);
  fillRect(5, 16, 2, 6, skin);  // 다리
  fillRect(9, 16, 2, 6, skin);

  // 상의 몸통
  fillRect(6, 8, 4, 7, topColor);
  // 소매
  fillRect(4, 8, 2, 4, sleeveColor);
  fillRect(10, 8, 2, 4, sleeveColor);

  // 긴 소매 여부 (후드티, 긴팔, 자켓, 가디건, 교복, 정장, 테크웨어, 조끼, 점프수트)
  const longSleeve = outfit && ['HOODIE','LONGTEE','JACKET','CARDIGAN','SCHOOL_M','SUIT',
    'TECHWEAR','VEST','JUMPER','HOODIE_F','KNIT','SCHOOL_F','SUIT_F','TECHWEAR_F','FANTASY'].includes(outfit);
  if (longSleeve || style === 'STREETWEAR' || style === 'TECHWEAR' || style === 'VINTAGE') {
    fillRect(4, 12, 2, 4, sleeveColor);
    fillRect(10, 12, 2, 4, sleeveColor);
  }

  // 하의
  const isSkirt = bottom && ['LONGSKIRT','MINISKIRT','SCHOOL_BF'].includes(bottom);
  const skirtLen = bottom === 'LONGSKIRT' ? 8 : bottom === 'SCHOOL_BF' ? 6 : 4;
  if (isSkirt) {
    fillRect(5, 15, 6, skirtLen, bottomColor);
    if (bottom === 'LONGSKIRT' || bottom === 'SCHOOL_BF') {
      // 다리 가리기
      fillRect(5, 15, 6, skirtLen, bottomColor);
    }
  } else {
    fillRect(5, 15, 2, 7, bottomColor);
    fillRect(9, 15, 2, 7, bottomColor);
    fillRect(6, 15, 4, 2, bottomColor);
    // 반바지/숏팬츠
    if (bottom === 'SHORTS' || bottom === 'SHORTS_F') {
      fillRect(5, 18, 2, 4, skin);
      fillRect(9, 18, 2, 4, skin);
    }
  }

  // 신발
  fillRect(4, 22, 4, 2, shoesColor);
  fillRect(9, 22, 4, 2, shoesColor);

  // 디테일
  if (outfit === 'SCHOOL_M') fillRect(7, 9, 2, 4, detailColor);      // 넥타이
  if (outfit === 'SCHOOL_F') fillRect(7, 9, 2, 2, detailColor);       // 리본
  if (outfit === 'SUIT' || outfit === 'SUIT_F') {
    fillRect(7, 9, 2, 5, detailColor); fillRect(6, 8, 1, 2, detailColor); // 라펠
  }
  if (outfit === 'HOODIE' || outfit === 'HOODIE_F') fillRect(6, 14, 4, 1, topColor); // 포켓라인
  if (outfit === 'TECHWEAR' || outfit === 'TECHWEAR_F') {
    fillRect(5, 17, 1, 1, detailColor); fillRect(10, 19, 1, 1, detailColor); // LED
  }
  if (outfit === 'JACKET') { fillRect(6, 8, 1, 7, '#333'); fillRect(9, 8, 1, 7, '#333'); } // 지퍼라인
  if (outfit === 'FANTASY') {
    fillRect(6, 8, 1, 1, detailColor); fillRect(9, 8, 1, 1, detailColor); // 어깨 장식
    fillRect(7, 14, 2, 1, detailColor);
  }

  // ── 눈 ──────────────────────────────────────────────
  if (outfit === 'TECHWEAR' || outfit === 'TECHWEAR_F') {
    fillRect(5, 4, 6, 1, detailColor); // 바이저
  } else {
    fillRect(6, 4, 1, 1, '#222222');
    fillRect(9, 4, 1, 1, '#222222');
  }

  // ── 헤어 ────────────────────────────────────────────
  if (hair === 'BEANIE') {
    fillRect(4, 0, 8, 3, '#333333');
    fillRect(4, 3, 1, 2, hairColor);
    fillRect(11, 3, 1, 2, hairColor);
  } else if (hair === 'SHORT') {
    fillRect(5, 1, 6, 2, hairColor);
    fillRect(4, 2, 1, 2, hairColor);
    fillRect(11, 2, 1, 2, hairColor);
  } else if (hair === 'LONG') {
    fillRect(5, 1, 6, 2, hairColor);
    fillRect(4, 2, 1, 9, hairColor);
    fillRect(11, 2, 1, 9, hairColor);
    fillRect(3, 3, 1, 6, hairColor);
    fillRect(12, 3, 1, 6, hairColor);
  } else if (hair === 'SPIKY') {
    fillRect(5, 1, 6, 1, hairColor);
    fillRect(6, 0, 1, 1, hairColor);
    fillRect(8, 0, 1, 1, hairColor);
    fillRect(10, 0, 1, 1, hairColor);
    fillRect(4, 2, 1, 3, hairColor);
    fillRect(11, 2, 1, 3, hairColor);
  } else {
    // default SHORT
    fillRect(5, 1, 6, 2, hairColor);
    fillRect(4, 2, 1, 2, hairColor);
    fillRect(11, 2, 1, 2, hairColor);
  }

  // 반전 (왼쪽 방향)
  const finalPixels = direction < 0
    ? pixels.map(row => [...row].reverse())
    : pixels;

  return (
    <svg
      width={GRID_W * scale} height={GRID_H * scale}
      viewBox={`0 0 ${GRID_W} ${GRID_H}`}
      style={{ imageRendering:'pixelated', shapeRendering:'crispEdges' }}
    >
      {finalPixels.map((row, y) =>
        row.map((color, x) => {
          if (!color) return null;
          return <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={color} />;
        })
      )}
    </svg>
  );
}
