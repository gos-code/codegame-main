// @ts-nocheck
import { motion } from "motion/react";
import { Plus, Clock, DollarSign, User, MessageSquare, TrendingUp } from "lucide-react";
import { useState } from "react";

export default function Requests() {
  const [showNewRequest, setShowNewRequest] = useState(false);

  const requests = [
    {
      id: 1,
      title: "React Native 쇼핑몰 앱 개발",
      budget: "500,000 - 800,000원",
      deadline: "2주",
      requester: "UserA",
      category: "모바일",
      description: "iOS/Android 크로스 플랫폼 쇼핑몰 앱 제작 요청합니다.",
      proposals: 12,
      postedAt: "2일 전",
      status: "진행중"
    },
    {
      id: 2,
      title: "AI 챗봇 통합 개발",
      budget: "1,000,000 - 1,500,000원",
      deadline: "3주",
      requester: "CompanyB",
      category: "AI/ML",
      description: "OpenAI API를 활용한 고객 상담 챗봇 시스템",
      proposals: 8,
      postedAt: "5일 전",
      status: "진행중"
    },
    {
      id: 3,
      title: "관리자 대시보드 UI 개선",
      budget: "300,000 - 500,000원",
      deadline: "1주",
      requester: "StartupC",
      category: "프론트엔드",
      description: "기존 대시보드 UI/UX 개선 및 반응형 작업",
      proposals: 15,
      postedAt: "1일 전",
      status: "진행중"
    },
    {
      id: 4,
      title: "결제 시스템 모듈 개발",
      budget: "800,000 - 1,200,000원",
      deadline: "2주",
      requester: "UserD",
      category: "백엔드",
      description: "PG사 연동 및 결제 처리 모듈",
      proposals: 6,
      postedAt: "3일 전",
      status: "진행중"
    }
  ];

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
            <h1 className="text-5xl font-bold">개발 요청</h1>
            <button
              onClick={() => setShowNewRequest(!showNewRequest)}
              className="flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>새 요청 등록</span>
            </button>
          </div>
          <p className="text-xl text-neutral-600">필요한 개발을 요청하고 전문가를 찾아보세요</p>
        </motion.div>

        {/* 새 요청 작성 폼 */}
        {showNewRequest && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{background:"var(--card)"}} className=" rounded-2xl p-8 border  mb-8"
          >
            <h2 className="text-2xl font-bold mb-6">새 개발 요청</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">프로젝트 제목</label>
                <input
                  type="text"
                  placeholder="예: React 쇼핑몰 사이트 개발"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">카테고리</label>
                <select className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900">
                  <option>프론트엔드</option>
                  <option>백엔드</option>
                  <option>풀스택</option>
                  <option>모바일</option>
                  <option>AI/ML</option>
                </select>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">예산 범위</label>
                  <input
                    type="text"
                    placeholder="예: 500,000 - 800,000원"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">희망 기한</label>
                  <input
                    type="text"
                    placeholder="예: 2주"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">상세 설명</label>
                <textarea
                  rows={6}
                  placeholder="프로젝트에 대한 자세한 설명을 작성해주세요..."
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                />
              </div>
              <div className="flex gap-3">
                <button className="flex-1 px-6 py-3 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-colors">
                  등록하기
                </button>
                <button
                  onClick={() => setShowNewRequest(false)}
                  className="px-6 py-3 bg-neutral-200 text-neutral-700 rounded-xl hover:bg-neutral-300 transition-colors"
                >
                  취소
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* 통계 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          <div style={{background:"var(--card)"}} className=" rounded-xl p-6 border ">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-600">활성 요청</p>
                <p className="text-2xl font-bold">{requests.length}건</p>
              </div>
            </div>
          </div>
          <div style={{background:"var(--card)"}} className=" rounded-xl p-6 border ">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-600">총 제안</p>
                <p className="text-2xl font-bold">
                  {requests.reduce((sum, r) => sum + r.proposals, 0)}건
                </p>
              </div>
            </div>
          </div>
          <div style={{background:"var(--card)"}} className=" rounded-xl p-6 border ">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-600">평균 예산</p>
                <p className="text-2xl font-bold">₩750K</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 요청 목록 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {requests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              style={{background:"var(--card)"}} className=" rounded-2xl p-6 border  hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">{request.title}</h3>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      {request.status}
                    </span>
                  </div>
                  <p className="text-neutral-600 mb-4">{request.description}</p>

                  <div className="flex flex-wrap gap-4 text-sm text-neutral-600">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      <span>{request.budget}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{request.deadline}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{request.requester}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{request.proposals}개 제안</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t ">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-sm">
                    {request.category}
                  </span>
                  <span className="text-sm text-neutral-500">{request.postedAt}</span>
                </div>
                <button className="px-6 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors">
                  제안하기
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
