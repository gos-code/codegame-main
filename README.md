# CodeGame — React 버전

## 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버
npm run dev

# 빌드
npm run build
```

## Firebase 설정

`src/lib/firebase.ts`에서 `appId`를 실제 값으로 교체해주세요.

Firebase Console → 프로젝트 설정 → 내 앱 → SDK 설정값에서 확인 가능합니다.

## GitHub Pages 배포

1. GitHub 저장소 생성 (codegame-mvp)
2. Settings → Pages → Source: GitHub Actions 선택
3. 코드 push하면 자동 배포

## 폴더 구조

```
src/
├── lib/firebase.ts          # Firebase 설정
├── app/
│   ├── contexts/
│   │   ├── AuthContext.tsx  # 인증 상태
│   │   └── ThemeContext.tsx # 테마/색상
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Layout.tsx
│   │   ├── MyPageModal.tsx  # 미니 대시보드
│   │   ├── AdminPanel.tsx
│   │   └── pages/
│   │       ├── Home.tsx
│   │       ├── Login.tsx    # Firebase 인증 연동
│   │       ├── Marketplace.tsx
│   │       ├── ProductDetail.tsx
│   │       ├── Sell.tsx     # 파일 업로드
│   │       ├── MyPage.tsx   # 독립 마이페이지
│   │       └── DevGardenTitle.tsx
│   └── ...
└── styles/
    ├── fonts.css   # Sora, Orbitron, JetBrains Mono
    └── theme.css
```
