import { motion } from "motion/react";
import { Home, Search, ArrowLeft } from "lucide-react";
import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center px-6">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl" />
      </div>

      <div className="relative text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-9xl font-bold text-white mb-4">404</h1>
          <h2 className="text-3xl font-bold text-white mb-4">페이지를 찾을 수 없습니다</h2>
          <p className="text-xl text-white/70 mb-12 max-w-md mx-auto">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/"
              className="flex items-center gap-2 px-8 py-4 bg-white text-neutral-900 rounded-xl hover:bg-neutral-100 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span className="font-semibold">홈으로 가기</span>
            </Link>
            <Link
              to="/marketplace"
              className="flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-colors border border-white/20"
            >
              <Search className="w-5 h-5" />
              <span className="font-semibold">코드 검색</span>
            </Link>
          </div>

          <button
            onClick={() => window.history.back()}
            className="mt-8 flex items-center gap-2 text-white/70 hover:text-white transition-colors mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>이전 페이지로</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
