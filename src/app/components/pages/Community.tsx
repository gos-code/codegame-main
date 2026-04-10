// @ts-nocheck
import { motion } from "motion/react";
import { MessageSquare, ThumbsUp, Eye, Clock, TrendingUp, Hash, Search } from "lucide-react";
import { useState } from "react";

export default function Community() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const posts = [
    {
      id: 1,
      title: "React 18의 새로운 기능 Concurrent Features 정리",
      author: "DevMaster",
      category: "프론트엔드",
      views: 1234,
      likes: 89,
      comments: 23,
      postedAt: "2시간 전",
      tags: ["React", "JavaScript", "Tutorial"],
      excerpt: "React 18에서 추가된 Concurrent Features에 대해 자세히 알아봅시다..."
    },
    {
      id: 2,
      title: "Node.js 성능 최적화 팁 10가지",
      author: "BackendPro",
      category: "백엔드",
      views: 2341,
      likes: 156,
      comments: 45,
      postedAt: "5시간 전",
      tags: ["Node.js", "Performance", "Backend"],
      excerpt: "프로덕션 환경에서 Node.js 애플리케이션의 성능을 최적화하는 방법..."
    },
    {
      id: 3,
      title: "TypeScript 5.0 업데이트 내용 총정리",
      author: "CodeGuru",
      category: "언어",
      views: 987,
      likes: 72,
      comments: 18,
      postedAt: "1일 전",
      tags: ["TypeScript", "Update"],
      excerpt: "TypeScript 5.0의 주요 변경사항과 새로운 기능들을 살펴봅니다..."
    },
    {
      id: 4,
      title: "마이크로서비스 아키텍처 설계 가이드",
      author: "ArchitectX",
      category: "아키텍처",
      views: 3456,
      likes: 234,
      comments: 67,
      postedAt: "2일 전",
      tags: ["Microservices", "Architecture", "Backend"],
      excerpt: "실전에서 적용 가능한 마이크로서비스 아키텍처 설계 방법론..."
    },
    {
      id: 5,
      title: "AI 개발자를 위한 PyTorch 시작하기",
      author: "AIResearcher",
      category: "AI/ML",
      views: 1876,
      likes: 123,
      comments: 34,
      postedAt: "3일 전",
      tags: ["PyTorch", "AI", "Machine Learning"],
      excerpt: "딥러닝 프레임워크 PyTorch의 기본 개념과 실습 예제..."
    }
  ];

  const trendingTags = [
    { name: "React", count: 1234 },
    { name: "TypeScript", count: 987 },
    { name: "Node.js", count: 876 },
    { name: "AI/ML", count: 654 },
    { name: "Backend", count: 543 },
    { name: "Frontend", count: 432 }
  ];

  const categories = [
    { name: "전체", count: posts.length },
    { name: "프론트엔드", count: 45 },
    { name: "백엔드", count: 38 },
    { name: "AI/ML", count: 22 },
    { name: "아키텍처", count: 15 },
    { name: "언어", count: 28 }
  ];

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "전체" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen py-12" style={{background:"var(--background)", color:"var(--foreground)"}}>
      <div className="max-w-7xl mx-auto px-6">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-5xl font-bold">커뮤니티</h1>
            <button className="px-6 py-3 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-colors">
              글쓰기
            </button>
          </div>
          <p className="text-xl text-neutral-600">개발자들과 지식을 공유하고 소통하세요</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 검색 바 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{background:"var(--card)"}} className="  rounded-2xl p-4 border "
            >
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="게시글, 태그, 내용 검색..."
                  className="w-full pl-12 pr-4 py-3 border  rounded-xl focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-400   "
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              </div>
            </motion.div>

            {/* 카테고리 탭 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              style={{background:"var(--card)"}} className="  rounded-2xl p-6 border "
            >
              <div className="flex flex-wrap gap-2">
                {categories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.name
                        ? "bg-neutral-900 dark:bg-blue-600 text-white"
                        : "bg-neutral-100  text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                    }`}
                  >
                    {category.name}
                    <span className="ml-2 text-sm opacity-70">({category.count})</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* 게시글 목록 */}
            <div className="space-y-4">
              {filteredPosts.length === 0 ? (
                <div style={{background:"var(--card)"}} className="  rounded-2xl p-12 border  text-center">
                  <MessageSquare className="w-16 h-16 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-neutral-600 dark:text-neutral-400 mb-2">
                    검색 결과가 없습니다
                  </h3>
                  <p className="text-neutral-500 dark:text-neutral-500">
                    다른 키워드로 검색해보세요
                  </p>
                </div>
              ) : (
                filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  style={{background:"var(--card)"}} className="  rounded-2xl p-6 border  hover:shadow-lg transition-shadow cursor-pointer group"
                >
                  <div className="flex items-start gap-4">
                    {/* 좋아요 영역 */}
                    <div className="flex flex-col items-center gap-1 pt-1">
                      <button className="w-10 h-10 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center justify-center transition-colors">
                        <ThumbsUp className="w-5 h-5 text-neutral-400 group-hover:text-blue-600" />
                      </button>
                      <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{post.likes}</span>
                    </div>

                    {/* 콘텐츠 */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs font-medium">
                          {post.category}
                        </span>
                        <span className="text-sm text-neutral-500 dark:text-neutral-400">{post.postedAt}</span>
                      </div>

                      <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors ">
                        {post.title}
                      </h3>

                      <p className="text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">{post.excerpt}</p>

                      {/* 태그 */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-neutral-100  text-neutral-600 dark:text-neutral-300 rounded text-sm hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* 메타 정보 */}
                      <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
                        <span>{post.author}</span>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{post.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>{post.comments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )))}
            </div>

            {/* 더보기 버튼 */}
            {filteredPosts.length > 0 && (
              <div className="text-center">
                <button className="px-8 py-3  border border-neutral-300 dark:border-neutral-700 rounded-xl hover:border-neutral-900 dark:hover:border-neutral-500 transition-colors ">
                  더보기
                </button>
              </div>
            )}
          </div>

          {/* 사이드바 */}
          <div className="space-y-6">
            {/* 인기 태그 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{background:"var(--card)"}} className="  rounded-2xl p-6 border  sticky top-24"
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 " />
                <h3 className="font-bold ">인기 태그</h3>
              </div>
              <div className="space-y-2">
                {trendingTags.map((tag, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-neutral-400 group-hover:text-blue-600" />
                      <span className="font-medium ">{tag.name}</span>
                    </div>
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">{tag.count}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* 커뮤니티 통계 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white"
            >
              <h3 className="font-bold mb-4">커뮤니티 통계</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/80">총 게시글</span>
                  <span className="font-bold">2,345</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80">활성 회원</span>
                  <span className="font-bold">8,912</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80">오늘의 게시글</span>
                  <span className="font-bold">127</span>
                </div>
              </div>
            </motion.div>

            {/* 최근 활동 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{background:"var(--card)"}} className="  rounded-2xl p-6 border "
            >
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 " />
                <h3 className="font-bold ">최근 활동</h3>
              </div>
              <div className="space-y-3 text-sm">
                {[
                  { user: "DevMaster", action: "새 글을 작성했습니다", time: "방금 전" },
                  { user: "CodeGuru", action: "댓글을 남겼습니다", time: "5분 전" },
                  { user: "BackendPro", action: "글을 수정했습니다", time: "10분 전" }
                ].map((activity, index) => (
                  <div key={index} className="pb-3 border-b border-neutral-100 dark:border-neutral-700 last:border-0">
                    <p className=" mb-1">
                      <span className="font-medium">{activity.user}</span>님이 {activity.action}
                    </p>
                    <p className="text-neutral-500 dark:text-neutral-400 text-xs">{activity.time}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
