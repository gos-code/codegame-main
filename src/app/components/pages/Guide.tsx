// @ts-nocheck
import AdminEditableText from '../../components/AdminEditableText';
import { Link } from 'react-router';
import { motion } from "motion/react";
import { BookOpen, Code2, Shield, DollarSign, Users, ArrowRight, CheckCircle2 } from "lucide-react";

export default function Guide() {
  const guides = [
    {
      icon: BookOpen,
      title: "시작하기",
      description: "CodeMarket 플랫폼 사용법을 단계별로 알아보세요",
      items: [
        "회원가입 및 프로필 설정",
        "코드 검색 및 둘러보기",
        "첫 구매 진행하기",
        "라이선스 키 관리하기"
      ]
    },
    {
      icon: Code2,
      title: "판매자 가이드",
      description: "코드를 판매하고 수익을 창출하는 방법",
      items: [
        "상품 등록 및 가격 책정",
        "코드 품질 가이드라인",
        "문서화 베스트 프랙티스",
        "고객 지원 및 업데이트"
      ]
    },
    {
      icon: Shield,
      title: "안전한 거래",
      description: "에스크로 시스템과 안전한 거래 방법",
      items: [
        "에스크로 시스템 이해하기",
        "분쟁 해결 프로세스",
        "환불 및 취소 정책",
        "사기 방지 팁"
      ]
    },
    {
      icon: DollarSign,
      title: "정산 가이드",
      description: "수익 관리 및 정산 프로세스",
      items: [
        "정산 일정 및 방법",
        "세금 계산서 발행",
        "수수료 구조 이해하기",
        "수익 최적화 전략"
      ]
    }
  ];

  const steps = [
    {
      number: "01",
      title: "회원가입",
      description: "간단한 정보 입력으로 무료 가입"
    },
    {
      number: "02",
      title: "코드 검색",
      description: "필요한 코드를 카테고리별로 탐색"
    },
    {
      number: "03",
      title: "구매 또는 판매",
      description: "안전한 에스크로 시스템으로 거래"
    },
    {
      number: "04",
      title: "다운로드 및 사용",
      description: "라이선스 키와 함께 즉시 사용"
    }
  ];

  return (
    <div className="min-h-screen py-12" style={{background:"var(--background)", color:"var(--foreground)"}}>
      <div className="max-w-7xl mx-auto px-6">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-5xl font-bold mb-4">이용 가이드</h1>
          <p className="text-xl text-neutral-600">CodeMarket을 효과적으로 사용하는 방법을 알아보세요</p>
        </motion.div>

        {/* 시작하기 스텝 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-3xl p-12 mb-12 text-white"
        >
          <h2 className="text-3xl font-bold mb-12 text-center">빠른 시작 가이드</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="relative"
              >
                <div className="text-6xl font-bold text-white/10 mb-4">{step.number}</div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-white/70">{step.description}</p>
                {index < steps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute -right-8 top-8 w-6 h-6 text-white/30" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 가이드 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 gap-6 mb-12"
        >
          {guides.map((guide, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              style={{background:"var(--card)"}} className=" rounded-2xl p-8 border  hover:shadow-lg transition-shadow"
            >
              <div className="w-14 h-14 bg-neutral-900 rounded-xl flex items-center justify-center mb-6">
                <guide.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{guide.title}</h3>
              <p className="text-neutral-600 mb-6">{guide.description}</p>
              <ul className="space-y-3">
                {guide.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-700">{item}</span>
                  </li>
                ))}
              </ul>
              <button className="mt-6 text-neutral-900 font-medium hover:gap-3 flex items-center gap-2 transition-all group">
                <span>자세히 보기</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          ))}
        </motion.div>

        {/* FAQ 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{background:"var(--card)"}} className=" rounded-2xl p-8 border "
        >
          <h2 className="text-3xl font-bold mb-8">자주 묻는 질문</h2>
          <div className="space-y-6">
            {[
              {
                id: "faq_refund",
              q: "코드 구매 후 환불이 가능한가요?",
                a: "구매 후 3일 이내 환불 신청 가능합니다. 구매 당일 100% 환불, 1일 후 70% 환불, 2일 후 40% 환불, 3일 후 환불 불가합니다. 단, 파일 다운로드 후에는 환불이 제한될 수 있습니다."
              },
              {
                id: "faq_fee",
              q: "판매 수수료는 얼마인가요?",
                a: "판매 금액의 20%를 수수료로 부과하며, 판매자에게는 80%가 지급됩니다. 정산은 매월 1일에 진행됩니다."
              },
              {
                q: "라이선스는 어떻게 관리되나요?",
                a: "각 구매마다 고유한 라이선스 키가 발급되며, 마이페이지에서 확인할 수 있습니다."
              },
              {
                q: "코드 품질은 어떻게 검증하나요?",
                a: "모든 코드는 전문가 리뷰를 거치며, 보안 취약점 스캔을 통과해야 등록됩니다."
              }
            ].map((faq, index) => (
              <div key={index} className="pb-6 border-b  last:border-0">
                <h3 className="font-bold mb-2 text-lg">{faq.q}</h3>
                <AdminEditableText id={faq.id || ('faq_'+index)} defaultText={faq.a} tag="p" style={{color:"var(--muted)", fontFamily:"Sora,sans-serif"}} multiline={true} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-12"
        >
          <Users className="w-16 h-16 mx-auto mb-4 text-neutral-900" />
          <h2 className="text-3xl font-bold mb-4">더 궁금한 점이 있으신가요?</h2>
          <p className="text-xl text-neutral-600 mb-8">
            커뮤니티에서 다른 개발자들과 소통하거나 고객센터로 문의하세요
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="/community"
              className="px-8 py-3 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-colors"
            >
              커뮤니티 가기
            </a>
            <a
              href="/contact"
              className="px-8 py-3 border border-neutral-300 rounded-xl hover:border-neutral-900 transition-colors"
            >
              문의하기
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
