import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

// GitHub Pages SPA redirect 복원
// 404.html에서 저장한 appPath(basename 제거된 순수 내부 경로)를 복원
const redirect = sessionStorage.getItem('spa_redirect');
if (redirect) {
  sessionStorage.removeItem('spa_redirect');
  try {
    const { path, query, hash } = JSON.parse(redirect);
    // basename '/codegame-main'은 createBrowserRouter가 자동 처리
    // → history에는 full URL(/codegame-main + appPath)을 써야 함
    const fullPath = '/codegame-main' + (path.startsWith('/') ? path : '/' + path);
    window.history.replaceState(null, '', fullPath + (query || '') + (hash || ''));
  } catch {}
}

createRoot(document.getElementById("root")!).render(<App />);
