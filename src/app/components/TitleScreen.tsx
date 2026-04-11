// @ts-nocheck
import { TitleOverlay } from "./TitleOverlay";
import { PixelCity } from "./PixelCity";
import { Rain } from "./Rain";
import { motion } from "motion/react";
import { useNavigate } from "react-router";

export function TitleScreen() {
  const navigate = useNavigate();

  return (
    // min-h-screen + style로 배경 강제 고정 (theme CSS 변수 무시)
    <div
      className="relative w-full min-h-screen overflow-hidden select-none font-sans cursor-pointer"
      style={{ background: '#000', minHeight: '100vh' }}
      onClick={() => navigate('/dev-garden/customization')}
    >
      <PixelCity />
      <Rain />

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none z-40 bg-[radial-gradient(circle_at_center,transparent_60%,rgba(0,0,0,0.8)_100%)]" />

      {/* CRT Scanlines */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-40 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))]"
        style={{ backgroundSize: "100% 4px, 6px 100%" }}
        animate={{ backgroundPosition: ["0% 0%", "0% 100%"] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      {/* Chromatic Aberration Pulse */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-50 mix-blend-color-dodge opacity-0"
        animate={{ opacity: [0, 0.05, 0] }}
        transition={{ duration: 5, repeat: Infinity, times: [0, 0.1, 1], repeatDelay: 3 }}
        style={{ backgroundColor: 'rgba(255, 0, 255, 0.2)' }}
      />

      <TitleOverlay />
    </div>
  );
}
