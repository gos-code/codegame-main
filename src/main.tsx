import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

// GitHub Pages SPA redirect 복원
const redirect = sessionStorage.getItem('spa_redirect');
if (redirect) {
  sessionStorage.removeItem('spa_redirect');
  try {
    const { path, query, hash } = JSON.parse(redirect);
    window.history.replaceState(null, '', '/codegame-main' + path + query + hash);
  } catch {}
}

createRoot(document.getElementById("root")!).render(<App />);
