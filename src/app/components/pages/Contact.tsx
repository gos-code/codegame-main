// @ts-nocheck
import { motion } from "motion/react";
import { Mail, Phone, MapPin, Send, Building2, Users, Briefcase } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-5xl font-bold mb-4">기업문의</h1>
          <p className="text-xl text-neutral-600">
            기업 고객을 위한 맞춤형 솔루션을 제공합니다
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* 문의 폼 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-white rounded-2xl p-8 border border-neutral-200">
              <h2 className="text-2xl font-bold mb-6">문의하기</h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">회사명 *</label>
                    <input
                      type="text"
                      required
                      placeholder="주식회사 CodeMarket"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">담당자명 *</label>
                    <input
                      type="text"
                      required
                      placeholder="홍길동"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">이메일 *</label>
                    <input
                      type="email"
                      required
                      placeholder="contact@company.com"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">연락처 *</label>
                    <input
                      type="tel"
                      required
                      placeholder="010-1234-5678"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">문의 유형 *</label>
                  <select
                    required
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                  >
                    <option value="">선택해주세요</option>
                    <option value="partnership">파트너십</option>
                    <option value="enterprise">기업 솔루션</option>
                    <option value="custom">맞춤 개발</option>
                    <option value="support">기술 지원</option>
                    <option value="other">기타</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">예산 범위</label>
                  <select className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900">
                    <option value="">선택해주세요</option>
                    <option value="under5m">500만원 미만</option>
                    <option value="5m-10m">500만원 - 1,000만원</option>
                    <option value="10m-30m">1,000만원 - 3,000만원</option>
                    <option value="30m-50m">3,000만원 - 5,000만원</option>
                    <option value="over50m">5,000만원 이상</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">문의 내용 *</label>
                  <textarea
                    required
                    rows={6}
                    placeholder="문의하실 내용을 상세히 작성해주세요..."
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900 resize-none"
                  />
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="privacy"
                    required
                    className="mt-1"
                  />
                  <label htmlFor="privacy" className="text-sm text-neutral-600">
                    개인정보 수집 및 이용에 동의합니다 *
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-colors"
                >
                  <Send className="w-5 h-5" />
                  <span className="font-semibold">문의 보내기</span>
                </button>
              </form>
            </div>
          </motion.div>

          {/* 정보 및 혜택 */}
          <div className="space-y-6">
            {/* 연락처 정보 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-8 border border-neutral-200"
            >
              <h2 className="text-2xl font-bold mb-6">연락처</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium mb-1">이메일</p>
                    <p className="text-neutral-600">enterprise@codemarket.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium mb-1">전화</p>
                    <p className="text-neutral-600">02-1234-5678</p>
                    <p className="text-sm text-neutral-500">평일 09:00 - 18:00</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium mb-1">주소</p>
                    <p className="text-neutral-600">
                      서울특별시 강남구 테헤란로 123<br />
                      CodeMarket 빌딩 10층
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 기업 혜택 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-8 text-white"
            >
              <h2 className="text-2xl font-bold mb-6">기업 고객 혜택</h2>
              <div className="space-y-4">
                {[
                  {
                    icon: Building2,
                    title: "전담 계정 관리자",
                    description: "1:1 맞춤 지원"
                  },
                  {
                    icon: Users,
                    title: "팀 라이선스",
                    description: "최대 50% 할인"
                  },
                  {
                    icon: Briefcase,
                    title: "맞춤 개발",
                    description: "전문가 매칭"
                  }
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold mb-1">{benefit.title}</p>
                      <p className="text-white/70 text-sm">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 파트너사 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-8 border border-neutral-200"
            >
              <h3 className="font-bold mb-4">함께하는 기업</h3>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="aspect-square bg-neutral-100 rounded-lg flex items-center justify-center"
                  >
                    <Building2 className="w-8 h-8 text-neutral-400" />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* 통계 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-4 gap-6 mt-12"
        >
          {[
            { label: "파트너 기업", value: "250+" },
            { label: "기업 프로젝트", value: "1,200+" },
            { label: "평균 만족도", value: "98%" },
            { label: "재계약률", value: "92%" }
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 border border-neutral-200 text-center"
            >
              <p className="text-4xl font-bold mb-2">{stat.value}</p>
              <p className="text-neutral-600">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
