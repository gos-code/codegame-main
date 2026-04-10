import { motion } from "motion/react";
import { useState } from "react";
import { Palette, Shirt, Smile, Save, Undo2, Eye } from "lucide-react";

export default function DeveloperVillage() {
  const [character, setCharacter] = useState({
    skinColor: "#FFD1A9",
    hairColor: "#2C1810",
    hairStyle: "short",
    shirtColor: "#3B82F6",
    eyeStyle: "normal",
    mouthStyle: "smile"
  });

  const [bgColor, setBgColor] = useState("#E0F2FE");
  const [minimiTitle, setMinimiTitle] = useState("내 미니홈피");
  const [todayMood, setTodayMood] = useState("코딩 중...");
  const [guestbook, setGuestbook] = useState([
    { id: 1, author: "친구1", message: "놀러왔어요~!", date: "2026-04-08" },
    { id: 2, author: "친구2", message: "미니홈피 이쁘다!", date: "2026-04-09" }
  ]);

  const skinColors = ["#FFD1A9", "#F4C2A0", "#E5A97F", "#C68642", "#8D5524", "#603913"];
  const hairColors = ["#2C1810", "#8B4513", "#DAA520", "#FF6B6B", "#9B59B6", "#3498DB"];
  const hairStyles = [
    { id: "short", name: "숏컷" },
    { id: "long", name: "장발" },
    { id: "curly", name: "곱슬" }
  ];
  const shirtColors = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899"];
  const eyeStyles = [
    { id: "normal", name: "보통" },
    { id: "happy", name: "웃음" },
    { id: "wink", name: "윙크" }
  ];
  const mouthStyles = [
    { id: "smile", name: "미소" },
    { id: "laugh", name: "활짝" },
    { id: "normal", name: "일자" }
  ];
  const bgColors = ["#E0F2FE", "#FCE7F3", "#F3E8FF", "#DBEAFE", "#D1FAE5", "#FEF3C7"];

  const renderCharacter = () => {
    return (
      <svg viewBox="0 0 200 300" className="w-full h-full">
        {/* 몸통 */}
        <ellipse cx="100" cy="220" rx="50" ry="60" fill={character.shirtColor} />

        {/* 목 */}
        <rect x="85" y="180" width="30" height="30" fill={character.skinColor} />

        {/* 머리 */}
        <circle cx="100" cy="120" r="60" fill={character.skinColor} />

        {/* 머리카락 */}
        {character.hairStyle === "short" && (
          <>
            <ellipse cx="100" cy="80" rx="65" ry="50" fill={character.hairColor} />
            <ellipse cx="100" cy="105" rx="65" ry="20" fill={character.hairColor} />
          </>
        )}
        {character.hairStyle === "long" && (
          <>
            <ellipse cx="100" cy="80" rx="65" ry="50" fill={character.hairColor} />
            <rect x="35" y="100" width="30" height="100" fill={character.hairColor} rx="15" />
            <rect x="135" y="100" width="30" height="100" fill={character.hairColor} rx="15" />
          </>
        )}
        {character.hairStyle === "curly" && (
          <>
            <circle cx="70" cy="85" r="25" fill={character.hairColor} />
            <circle cx="100" cy="75" r="25" fill={character.hairColor} />
            <circle cx="130" cy="85" r="25" fill={character.hairColor} />
            <circle cx="85" cy="105" r="20" fill={character.hairColor} />
            <circle cx="115" cy="105" r="20" fill={character.hairColor} />
          </>
        )}

        {/* 눈 */}
        {character.eyeStyle === "normal" && (
          <>
            <circle cx="80" cy="115" r="8" fill="#000" />
            <circle cx="120" cy="115" r="8" fill="#000" />
            <circle cx="82" cy="113" r="3" fill="#fff" />
            <circle cx="122" cy="113" r="3" fill="#fff" />
          </>
        )}
        {character.eyeStyle === "happy" && (
          <>
            <path d="M 70 115 Q 80 120 90 115" stroke="#000" strokeWidth="3" fill="none" />
            <path d="M 110 115 Q 120 120 130 115" stroke="#000" strokeWidth="3" fill="none" />
          </>
        )}
        {character.eyeStyle === "wink" && (
          <>
            <path d="M 70 115 Q 80 120 90 115" stroke="#000" strokeWidth="3" fill="none" />
            <circle cx="120" cy="115" r="8" fill="#000" />
            <circle cx="122" cy="113" r="3" fill="#fff" />
          </>
        )}

        {/* 입 */}
        {character.mouthStyle === "smile" && (
          <path d="M 80 140 Q 100 150 120 140" stroke="#000" strokeWidth="2.5" fill="none" />
        )}
        {character.mouthStyle === "laugh" && (
          <path d="M 75 140 Q 100 155 125 140" stroke="#000" strokeWidth="3" fill="none" />
        )}
        {character.mouthStyle === "normal" && (
          <line x1="80" y1="145" x2="120" y2="145" stroke="#000" strokeWidth="2.5" />
        )}
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-5xl font-bold mb-4">Developer Village</h1>
          <p className="text-xl text-neutral-600">싸이월드처럼 나만의 개발자 공간을 만들어보세요</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 미니홈피 프리뷰 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-4 border-neutral-900">
              {/* 헤더 */}
              <div className="bg-neutral-900 text-white p-4 flex items-center justify-between">
                <input
                  type="text"
                  value={minimiTitle}
                  onChange={(e) => setMinimiTitle(e.target.value)}
                  className="bg-transparent border-none outline-none text-lg font-semibold"
                />
                <Eye className="w-5 h-5" />
              </div>

              {/* 메인 영역 */}
              <div style={{ backgroundColor: bgColor }} className="p-6 min-h-[600px]">
                {/* 프로필 박스 */}
                <div className="bg-white rounded-xl p-6 shadow-md mb-6">
                  <div className="flex items-start gap-6">
                    <div className="w-32 h-40 bg-white rounded-lg border-2 border-neutral-200 overflow-hidden">
                      {renderCharacter()}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-2">CodeMaster</h2>
                      <p className="text-neutral-600 mb-4">{todayMood}</p>
                      <div className="flex gap-2 flex-wrap">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">React</span>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Node.js</span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">TypeScript</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 방명록 */}
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <span>방명록</span>
                    <span className="text-sm text-neutral-500">({guestbook.length})</span>
                  </h3>
                  <div className="space-y-3">
                    {guestbook.map((entry) => (
                      <div key={entry.id} className="p-3 bg-neutral-50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{entry.author}</span>
                          <span className="text-xs text-neutral-500">{entry.date}</span>
                        </div>
                        <p className="text-sm text-neutral-700">{entry.message}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <input
                      type="text"
                      placeholder="방명록을 남겨주세요..."
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 커스터마이징 패널 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* 배경 색상 */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5" />
                배경 색상
              </h3>
              <div className="grid grid-cols-6 gap-2">
                {bgColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setBgColor(color)}
                    className={`w-full aspect-square rounded-lg transition-transform ${
                      bgColor === color ? "scale-110 ring-2 ring-neutral-900" : ""
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* 피부 색상 */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Smile className="w-5 h-5" />
                피부 색상
              </h3>
              <div className="grid grid-cols-6 gap-2">
                {skinColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setCharacter({ ...character, skinColor: color })}
                    className={`w-full aspect-square rounded-lg transition-transform ${
                      character.skinColor === color ? "scale-110 ring-2 ring-neutral-900" : ""
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* 머리 스타일 */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="font-bold mb-4">머리 스타일</h3>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {hairStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setCharacter({ ...character, hairStyle: style.id })}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      character.hairStyle === style.id
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-300 hover:border-neutral-400"
                    }`}
                  >
                    {style.name}
                  </button>
                ))}
              </div>
              <h4 className="font-medium mb-2 text-sm text-neutral-600">머리 색상</h4>
              <div className="grid grid-cols-6 gap-2">
                {hairColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setCharacter({ ...character, hairColor: color })}
                    className={`w-full aspect-square rounded-lg transition-transform ${
                      character.hairColor === color ? "scale-110 ring-2 ring-neutral-900" : ""
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* 옷 색상 */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Shirt className="w-5 h-5" />
                옷 색상
              </h3>
              <div className="grid grid-cols-6 gap-2">
                {shirtColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setCharacter({ ...character, shirtColor: color })}
                    className={`w-full aspect-square rounded-lg transition-transform ${
                      character.shirtColor === color ? "scale-110 ring-2 ring-neutral-900" : ""
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* 표정 */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="font-bold mb-4">표정</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium mb-2 text-sm text-neutral-600">눈</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {eyeStyles.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setCharacter({ ...character, eyeStyle: style.id })}
                        className={`px-4 py-2 rounded-lg border-2 transition-all ${
                          character.eyeStyle === style.id
                            ? "border-neutral-900 bg-neutral-900 text-white"
                            : "border-neutral-300 hover:border-neutral-400"
                        }`}
                      >
                        {style.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-sm text-neutral-600">입</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {mouthStyles.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setCharacter({ ...character, mouthStyle: style.id })}
                        className={`px-4 py-2 rounded-lg border-2 transition-all ${
                          character.mouthStyle === style.id
                            ? "border-neutral-900 bg-neutral-900 text-white"
                            : "border-neutral-300 hover:border-neutral-400"
                        }`}
                      >
                        {style.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 오늘의 기분 */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="font-bold mb-4">오늘의 기분</h3>
              <input
                type="text"
                value={todayMood}
                onChange={(e) => setTodayMood(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                placeholder="오늘의 기분을 입력하세요"
              />
            </div>

            {/* 저장 버튼 */}
            <div className="flex gap-3">
              <button className="flex-1 px-6 py-3 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2">
                <Save className="w-5 h-5" />
                저장하기
              </button>
              <button className="px-6 py-3 bg-neutral-200 text-neutral-700 rounded-xl hover:bg-neutral-300 transition-colors flex items-center justify-center gap-2">
                <Undo2 className="w-5 h-5" />
                초기화
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
