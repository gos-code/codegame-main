// @ts-nocheck
import React from 'react';

// 16x20 픽셀 오리 캐릭터
// 파츠: 모자(hat), 상의색(topColor), 하의색(bottomColor), 신발색(shoesColor), 몸통색(bodyColor)

interface PixelDuckProps {
  bodyColor?: string;
  topColor?: string;
  bottomColor?: string;
  shoesColor?: string;
  hat?: string;        // 'none' | 'cap' | 'beanie' | 'party' | 'crown'
  hatColor?: string;
  direction?: number;  // 1=오른쪽, -1=왼쪽
  isWalking?: boolean;
  scale?: number;
}

const W = 16;
const H = 20;

export function PixelDuck({
  bodyColor = '#f5f0dc',
  topColor = '#4a90d9',
  bottomColor = '#2c5f8a',
  shoesColor = '#ff6600',
  hat = 'cap',
  hatColor = '#cc2222',
  direction = 1,
  isWalking = false,
  scale = 4,
}: PixelDuckProps) {

  const px: string[][] = Array(H).fill(null).map(() => Array(W).fill(null));

  const fill = (x: number, y: number, w: number, h: number, c: string) => {
    for (let i = y; i < y+h; i++)
      for (let j = x; j < x+w; j++)
        if (i >= 0 && i < H && j >= 0 && j < W) px[i][j] = c;
  };
  const set = (x: number, y: number, c: string) => {
    if (x >= 0 && x < W && y >= 0 && y < H) px[y][x] = c;
  };

  const outline = '#1a1008';
  const highlight = '#fffff0';
  const beak = '#ff8c00';
  const eye = '#1a1a2e';
  const wing = bodyColor;
  const darkBody = '#d4c89a'; // 몸통 음영

  // ── 몸통 (둥글고 통통한 오리) ──────────────────────────────────────
  // 하체 (배)
  fill(4, 11, 8, 5, bodyColor);
  fill(3, 12, 10, 3, bodyColor);
  fill(3, 11, 1, 2, bodyColor);
  fill(12, 11, 1, 2, bodyColor);
  // 몸통 음영
  fill(4, 14, 8, 1, darkBody);
  fill(3, 14, 1, 1, darkBody);
  fill(12, 14, 1, 1, darkBody);

  // 상의 (조끼/티셔츠 느낌)
  fill(5, 9, 6, 4, topColor);
  fill(4, 10, 1, 3, topColor);
  fill(11, 10, 1, 3, topColor);
  // 상의 테두리
  set(5, 9, outline); set(10, 9, outline);

  // 날개 (양 옆)
  fill(2, 11, 2, 4, wing);
  fill(12, 11, 2, 4, wing);
  set(2, 11, darkBody); set(13, 11, darkBody);
  set(2, 14, darkBody); set(13, 14, darkBody);

  // ── 목과 머리 ─────────────────────────────────────────────────────
  // 목
  fill(7, 7, 3, 3, bodyColor);
  // 머리 (둥글게)
  fill(5, 3, 6, 5, bodyColor);
  fill(4, 4, 1, 3, bodyColor);
  fill(11, 4, 1, 3, bodyColor);
  fill(6, 2, 4, 1, bodyColor);
  // 머리 하이라이트
  set(7, 3, highlight);
  set(8, 3, highlight);

  // ── 부리 ─────────────────────────────────────────────────────────
  const beakX = direction > 0 ? 11 : 3;
  const beak2X = direction > 0 ? 12 : 2;
  fill(beakX, 5, 2, 2, beak);
  set(beak2X, 5, '#ff6600');
  set(beak2X, 6, '#ff6600');
  // 부리 윗선
  set(beakX, 5, '#cc6600');
  set(direction > 0 ? 12 : 2, 5, '#cc6600');

  // ── 눈 ───────────────────────────────────────────────────────────
  const eyeX = direction > 0 ? 9 : 6;
  set(eyeX, 4, eye);
  set(eyeX, 5, eye);
  // 눈 하이라이트
  set(direction > 0 ? 10 : 7, 4, '#ffffff');

  // ── 하의 ─────────────────────────────────────────────────────────
  fill(5, 14, 6, 2, bottomColor);
  fill(4, 15, 8, 1, bottomColor);

  // ── 발/신발 ──────────────────────────────────────────────────────
  // 발 2개 (오리발 느낌)
  fill(4, 17, 3, 1, shoesColor);
  fill(3, 17, 1, 1, shoesColor);  // 발가락
  fill(5, 18, 2, 1, '#cc5500');

  fill(9, 17, 3, 1, shoesColor);
  fill(10, 17, 2, 1, shoesColor);
  fill(12, 17, 1, 1, shoesColor);  // 발가락
  fill(9, 18, 2, 1, '#cc5500');

  // 걷기 애니메이션 (발 위치 살짝 변경)
  if (isWalking) {
    fill(4, 17, 3, 1, shoesColor);
    fill(9, 17, 3, 1, shoesColor);
  }

  // ── 모자 ─────────────────────────────────────────────────────────
  if (hat === 'cap') {
    // 야구 모자
    fill(5, 2, 7, 1, hatColor);   // 챙
    fill(6, 0, 5, 3, hatColor);   // 모자 본체
    fill(5, 1, 1, 2, hatColor);
    fill(11, 1, 1, 1, hatColor);
    // 챙 연장
    set(direction > 0 ? 11 : 4, 2, hatColor);
    set(direction > 0 ? 12 : 3, 2, hatColor);
    // 모자 버튼
    set(8, 0, '#ffffff');
  } else if (hat === 'beanie') {
    // 비니
    fill(5, 0, 7, 3, hatColor);
    fill(4, 1, 1, 2, hatColor);
    fill(11, 1, 1, 2, hatColor);
    fill(4, 3, 9, 1, '#aa1111');  // 비니 띠
    set(8, 0, '#ffffff');         // 폼폼
    set(9, 0, '#ffffff');
  } else if (hat === 'party') {
    // 파티 고깔모자
    fill(8, 0, 1, 1, hatColor);
    fill(7, 1, 2, 1, hatColor);
    fill(6, 2, 4, 1, hatColor);
    fill(5, 3, 5, 1, hatColor);
    // 별 장식
    set(8, 0, '#ffff00');
    set(7, 2, '#ff88ff');
    set(10, 2, '#88ffff');
  } else if (hat === 'crown') {
    // 왕관
    fill(5, 2, 7, 2, '#ffcc00');
    set(5, 1, '#ffcc00');
    set(8, 0, '#ffcc00');
    set(11, 1, '#ffcc00');
    // 보석
    set(8, 1, '#ff4444');
    set(6, 2, '#4444ff');
    set(10, 2, '#44ff44');
  }

  // 아웃라인 처리 (외곽)
  const outlinePoints = [
    [4,3],[5,2],[6,2],[9,2],[10,2],[11,3],[12,4],[12,6],[13,7],[13,10],
    [14,11],[14,14],[13,15],[13,16],[12,17],[9,17],[8,18],[7,18],[5,18],
    [4,17],[3,16],[3,15],[2,14],[2,11],[3,10],[3,7],[4,6],[4,3]
  ];

  // ── 반전 (왼쪽 방향) ────────────────────────────────────────────
  const finalPx = direction < 0
    ? px.map(row => [...row].reverse())
    : px;

  return (
    <svg width={W * scale} height={H * scale}
      viewBox={`0 0 ${W} ${H}`}
      style={{ imageRendering:'pixelated', shapeRendering:'crispEdges' }}>
      {finalPx.map((row, y) =>
        row.map((color, x) => {
          if (!color) return null;
          return <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={color} />;
        })
      )}
    </svg>
  );
}
