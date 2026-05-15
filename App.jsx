import { useState, useEffect, useRef } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const STORY = {
  title: "Arjun and the Germ Demon",
  pillar: "Hygiene",
  badge: "🛡️ Hygiene Hero",
  xp: 50,
  moral: "Tiny habits like washing your hands can defeat the mightiest enemies — even invisible ones!",
  chapters: [
    {
      id: 1,
      type: "scene",
      bg: "village",
      character: "arjun",
      narration:
        "In the village of Sukhagram, young Arjun returns home after playing cricket all afternoon. His hands are dusty and he is very hungry. Maa has made fresh rotis and dal!",
      image: "🏡",
    },
    {
      id: 2,
      type: "choice",
      bg: "kitchen",
      character: "arjun",
      question: "Arjun rushes to the kitchen. What should he do first?",
      options: [
        {
          id: "a",
          text: "Grab a roti straight away — so hungry!",
          isGood: false,
          feedback:
            "Oops! Arjun's hands carried thousands of invisible germs from the cricket ground. Eating without washing lets the Germ Demon sneak into his tummy!",
          emoji: "🍞",
        },
        {
          id: "b",
          text: "Wash hands with soap for 20 seconds first.",
          isGood: true,
          feedback:
            "Excellent! Washing with soap kills 99% of germs. Arjun defeated the Germ Demon before it could even enter his body. +15 XP!",
          emoji: "🧼",
        },
      ],
    },
    {
      id: 3,
      type: "scene",
      bg: "school",
      character: "arjun",
      narration:
        "Next morning at school, Arjun's friend Priya sneezes loudly and rubs her nose, then reaches for the shared pencil box. Arjun notices something strange — a tiny glowing germ floating in the air!",
      image: "🏫",
    },
    {
      id: 4,
      type: "choice",
      bg: "school",
      character: "arjun",
      question: "Priya offers Arjun her pencil. The Germ Demon is watching! What does Arjun do?",
      options: [
        {
          id: "a",
          text: "Take the pencil — he doesn't want to hurt Priya's feelings.",
          isGood: false,
          feedback:
            "Sharing items when someone is sick spreads germs easily. The Germ Demon laughs! Arjun could have politely explained and used his own pencil.",
          emoji: "✏️",
        },
        {
          id: "b",
          text: "Politely say 'No thanks!' and use his own stationery.",
          isGood: true,
          feedback:
            "Smart move! Arjun protected himself and reminded Priya to cover sneezes too. The Germ Demon retreated! +15 XP!",
          emoji: "🛡️",
        },
      ],
    },
    {
      id: 5,
      type: "scene",
      bg: "toilet",
      character: "arjun",
      narration:
        "After lunch, Arjun uses the school washroom. He sees other kids walking straight out without washing. The Germ Demon is growing bigger — feeding on everyone's bad habits!",
      image: "🚻",
    },
    {
      id: 6,
      type: "choice",
      bg: "toilet",
      character: "arjun",
      question: "What does Arjun do after using the toilet?",
      options: [
        {
          id: "a",
          text: "Rush out quickly to catch his friends.",
          isGood: false,
          feedback:
            "After using the toilet, hands carry the most germs. Skipping handwashing gives the Germ Demon its biggest feast. Always wash!",
          emoji: "🏃",
        },
        {
          id: "b",
          text: "Wash hands properly and encourage friends to do the same.",
          isGood: true,
          feedback:
            "Champion move! Arjun not only protected himself but became a Hygiene Hero for his whole class. The Germ Demon is shrinking! +20 XP!",
          emoji: "💪",
        },
      ],
    },
    {
      id: 7,
      type: "moral",
      bg: "temple",
      character: "arjun",
      narration:
        "By evening, the Germ Demon was defeated — shrunk to nothing by Arjun's good hygiene habits. Arjun's teacher called him a true Arogya Yodha — a Health Warrior! The whole class cheered.",
      image: "🏆",
    },
  ],
};

const BG_GRADIENTS = {
  village: "from-amber-50 via-orange-50 to-yellow-100",
  kitchen: "from-green-50 via-emerald-50 to-teal-100",
  school: "from-blue-50 via-sky-50 to-indigo-100",
  toilet: "from-cyan-50 via-teal-50 to-blue-100",
  temple: "from-purple-50 via-violet-50 to-indigo-100",
};

const BG_PATTERNS = {
  village: "🌾🏡🌳🌻",
  kitchen: "🍲🥘🌿🫙",
  school: "📚✏️🎒📐",
  toilet: "🚿💧🧼🪥",
  temple: "🪔🌸🔔✨",
};

// ─── STARS BACKGROUND ────────────────────────────────────────────────────────

function FloatingEmoji({ emojis }) {
  const items = emojis.split("");
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {items.map((e, i) => (
        <span
          key={i}
          className="absolute text-2xl opacity-10"
          style={{
            left: `${10 + i * 22}%`,
            top: `${15 + (i % 3) * 25}%`,
            animation: `float ${3 + i * 0.7}s ease-in-out infinite alternate`,
            animationDelay: `${i * 0.4}s`,
          }}
        >
          {e}
        </span>
      ))}
    </div>
  );
}

// ─── XP BAR ──────────────────────────────────────────────────────────────────

function XPBar({ xp, maxXp }) {
  const pct = Math.min(100, (xp / maxXp) * 100);
  return (
    <div className="flex items-center gap-2">
      <span className="text-amber-600 font-bold text-sm">⭐ {xp} XP</span>
      <div className="flex-1 h-3 bg-amber-100 rounded-full overflow-hidden border border-amber-200">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── CHARACTER AVATAR ─────────────────────────────────────────────────────────

function Character({ mood }) {
  const faces = { happy: "😄", thinking: "🤔", sad: "😟", proud: "🥳", neutral: "😐" };
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-200 to-orange-300 border-4 border-white shadow-lg flex items-center justify-center text-4xl"
        style={{ animation: "bobble 2s ease-in-out infinite" }}
      >
        {faces[mood] || "😐"}
      </div>
      <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">Arjun</span>
    </div>
  );
}

// ─── PROGRESS DOTS ─────────────────────────────────────────────────────────

function ProgressDots({ total, current }) {
  return (
    <div className="flex gap-1.5 justify-center">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all duration-300 ${
            i < current
              ? "w-3 h-3 bg-orange-500"
              : i === current
              ? "w-4 h-4 bg-amber-400 ring-2 ring-amber-300"
              : "w-3 h-3 bg-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

// ─── SCENE CARD ──────────────────────────────────────────────────────────────

function SceneCard({ chapter, onNext, chapterIdx, totalChapters }) {
  const bg = BG_GRADIENTS[chapter.bg] || "from-white to-gray-50";
  const pat = BG_PATTERNS[chapter.bg] || "";
  const isMoral = chapter.type === "moral";

  return (
    <div className={`relative bg-gradient-to-br ${bg} rounded-3xl p-6 shadow-xl border border-white/60 overflow-hidden`}>
      <FloatingEmoji emojis={pat} />
      <div className="relative z-10">
        <div className="flex justify-center mb-4">
          <div className="text-7xl" style={{ animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}>
            {chapter.image}
          </div>
        </div>

        {isMoral && (
          <div className="text-center mb-3">
            <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              🌟 The Moral
            </span>
          </div>
        )}

        <p className="text-gray-700 text-base leading-relaxed text-center font-medium mb-6">
          {chapter.narration}
        </p>

        {isMoral && (
          <div className="bg-white/80 rounded-2xl p-4 border-l-4 border-purple-400 mb-6 text-center">
            <p className="text-purple-800 font-semibold text-sm italic">"{STORY.moral}"</p>
          </div>
        )}

        <button
          onClick={onNext}
          className="w-full py-3 rounded-2xl font-bold text-white text-base shadow-lg active:scale-95 transition-transform"
          style={{
            background: isMoral
              ? "linear-gradient(135deg,#7c3aed,#a855f7)"
              : "linear-gradient(135deg,#f97316,#ef4444)",
          }}
        >
          {isMoral ? "🏆 See My Results" : chapterIdx === totalChapters - 2 ? "Finish the Story →" : "Continue the Story →"}
        </button>
      </div>
    </div>
  );
}

// ─── CHOICE CARD ─────────────────────────────────────────────────────────────

function ChoiceCard({ chapter, onChoice, chosen }) {
  const bg = BG_GRADIENTS[chapter.bg] || "from-white to-gray-50";
  const pat = BG_PATTERNS[chapter.bg] || "";

  return (
    <div className={`relative bg-gradient-to-br ${bg} rounded-3xl p-6 shadow-xl border border-white/60 overflow-hidden`}>
      <FloatingEmoji emojis={pat} />
      <div className="relative z-10">
        <div className="bg-white/80 rounded-2xl p-4 mb-5 shadow-sm">
          <p className="text-gray-800 font-bold text-base text-center leading-snug">
            🤔 {chapter.question}
          </p>
        </div>

        {!chosen ? (
          <div className="flex flex-col gap-3">
            {chapter.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onChoice(opt)}
                className="flex items-center gap-3 p-4 bg-white/90 rounded-2xl border-2 border-gray-100 hover:border-orange-300 shadow-sm active:scale-95 transition-all text-left"
              >
                <span className="text-3xl">{opt.emoji}</span>
                <span className="text-gray-800 font-medium text-sm leading-snug">{opt.text}</span>
              </button>
            ))}
          </div>
        ) : (
          <div
            className={`rounded-2xl p-5 border-2 ${
              chosen.isGood
                ? "bg-green-50 border-green-300"
                : "bg-red-50 border-red-300"
            }`}
            style={{ animation: "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}
          >
            <div className="text-center text-3xl mb-2">{chosen.isGood ? "✅" : "❌"}</div>
            <p
              className={`text-sm font-semibold text-center leading-relaxed ${
                chosen.isGood ? "text-green-800" : "text-red-800"
              }`}
            >
              {chosen.feedback}
            </p>
            {chosen.isGood && (
              <div className="mt-3 text-center">
                <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full">
                  ⭐ +15 XP Earned!
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── RESULTS SCREEN ──────────────────────────────────────────────────────────

function ResultsScreen({ score, total, xp, onRestart }) {
  const pct = Math.round((score / total) * 100);
  let title, message, color, emoji;

  if (pct === 100) {
    title = "Perfect Hygiene Hero! 🏆";
    message =
      "Shabash! You made every right choice! Arjun is proud of you. You are a true Arogya Yodha — a Health Warrior! Keep practising these habits every single day.";
    color = "from-green-400 to-emerald-500";
    emoji = "🥳";
  } else if (pct >= 50) {
    title = "Good Effort, Young Warrior! 💪";
    message =
      "You got most choices right! Remember — handwashing, not sharing personal items, and encouraging friends are your superpowers. Practise them daily and you'll be a full Yodha soon!";
    color = "from-amber-400 to-orange-500";
    emoji = "😊";
  } else {
    title = "Keep Practising, Yodha! 🌱";
    message =
      "The Germ Demon is still out there! Review the story again and remember — wash hands before eating, after the toilet, and always use your own stationery. You can beat the Germ Demon!";
    color = "from-blue-400 to-indigo-500";
    emoji = "😤";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 flex flex-col">
      <style>{`
        @keyframes confetti { 0%{transform:translateY(-10px) rotate(0deg);opacity:1} 100%{transform:translateY(100vh) rotate(720deg);opacity:0} }
        @keyframes popIn { 0%{transform:scale(0.5);opacity:0} 100%{transform:scale(1);opacity:1} }
        @keyframes float { 0%{transform:translateY(0)} 100%{transform:translateY(-12px)} }
        @keyframes bobble { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes shine { 0%{left:-100%} 100%{left:200%} }
      `}</style>

      {/* Confetti */}
      {pct === 100 && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
          {["🟠","🟡","🟢","🔵","🟣","🔴","🟤"].map((c, i) => (
            <div
              key={i}
              className="absolute text-lg"
              style={{
                left: `${i * 14 + 5}%`,
                top: "-20px",
                animation: `confetti ${2 + i * 0.3}s linear ${i * 0.2}s infinite`,
              }}
            >
              {c}
            </div>
          ))}
        </div>
      )}

      <div className="max-w-sm mx-auto w-full flex-1 flex flex-col justify-center gap-5">
        {/* Trophy */}
        <div className="text-center" style={{ animation: "popIn 0.6s cubic-bezier(0.34,1.56,0.64,1)" }}>
          <div className="text-8xl mb-2">{emoji}</div>
          <h2 className="text-2xl font-black text-gray-800 leading-tight">{title}</h2>
        </div>

        {/* Score card */}
        <div className={`bg-gradient-to-br ${color} rounded-3xl p-5 text-white shadow-xl`}>
          <div className="flex justify-around mb-4">
            <div className="text-center">
              <div className="text-4xl font-black">{score}/{total}</div>
              <div className="text-xs opacity-80 font-semibold">Good Choices</div>
            </div>
            <div className="w-px bg-white/30" />
            <div className="text-center">
              <div className="text-4xl font-black">{xp}</div>
              <div className="text-xs opacity-80 font-semibold">XP Earned</div>
            </div>
            <div className="w-px bg-white/30" />
            <div className="text-center">
              <div className="text-4xl font-black">{pct}%</div>
              <div className="text-xs opacity-80 font-semibold">Score</div>
            </div>
          </div>
          {/* Bar */}
          <div className="h-3 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-1000"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Badge */}
        <div className="bg-white rounded-3xl p-4 shadow-lg border border-purple-100 text-center">
          <div className="text-4xl mb-1">{STORY.badge.split(" ")[0]}</div>
          <div className="font-bold text-purple-700 text-sm">{STORY.badge}</div>
          <div className="text-xs text-gray-400 mt-1">Badge Unlocked!</div>
        </div>

        {/* Feedback */}
        <div className="bg-white rounded-3xl p-5 shadow-lg border border-orange-100">
          <p className="text-gray-700 text-sm leading-relaxed text-center">{message}</p>
        </div>

        {/* Moral */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-4 border border-amber-200">
          <p className="text-amber-800 text-xs font-bold uppercase tracking-wide mb-1 text-center">🌟 Story Moral</p>
          <p className="text-amber-900 text-sm text-center italic">"{STORY.moral}"</p>
        </div>

        {/* Replay */}
        <button
          onClick={onRestart}
          className="w-full py-4 rounded-2xl font-black text-white text-base shadow-xl active:scale-95 transition-transform relative overflow-hidden"
          style={{ background: "linear-gradient(135deg,#f97316,#ef4444)" }}
        >
          <span className="relative z-10">🔄 Play Again</span>
        </button>
      </div>
    </div>
  );
}

// ─── INTRO SCREEN ─────────────────────────────────────────────────────────────

function IntroScreen({ onStart }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-amber-400 to-yellow-300 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <style>{`
        @keyframes float { 0%{transform:translateY(0)} 100%{transform:translateY(-14px)} }
        @keyframes popIn { 0%{transform:scale(0.5);opacity:0} 100%{transform:scale(1);opacity:1} }
        @keyframes bobble { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes shine { 0%{left:-100%} 100%{left:200%} }
        @keyframes confetti { 0%{transform:translateY(-10px) rotate(0deg);opacity:1} 100%{transform:translateY(100vh) rotate(720deg);opacity:0} }
      `}</style>

      {/* Background blobs */}
      <div className="absolute top-10 left-5 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute bottom-20 right-5 w-40 h-40 rounded-full bg-red-400/20 blur-3xl" />

      {/* Floating icons */}
      {["🛡️","⭐","🏹","🌿","💪","🧼","🏆","✨"].map((e, i) => (
        <div
          key={i}
          className="absolute text-2xl opacity-30"
          style={{
            left: `${5 + i * 12}%`,
            top: `${10 + (i % 4) * 20}%`,
            animation: `float ${2.5 + i * 0.5}s ease-in-out infinite alternate`,
            animationDelay: `${i * 0.3}s`,
          }}
        >
          {e}
        </div>
      ))}

      <div className="relative z-10 text-center max-w-sm">
        <div
          className="text-8xl mb-4"
          style={{ animation: "bobble 2s ease-in-out infinite" }}
        >
          ⚔️
        </div>

        <h1 className="text-4xl font-black text-white drop-shadow-lg leading-tight mb-1">
          Arogya Yodha
        </h1>
        <p className="text-amber-100 font-semibold text-lg mb-6">आरोग्य योद्धा</p>

        <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-5 mb-6 border border-white/30">
          <p className="text-white font-bold text-base mb-1">📖 Today's Quest</p>
          <p className="text-amber-50 text-sm leading-snug">"{STORY.title}"</p>
          <div className="flex justify-center gap-3 mt-3">
            <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-semibold">
              🧼 {STORY.pillar}
            </span>
            <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-semibold">
              ⭐ {STORY.xp} XP
            </span>
          </div>
        </div>

        <div className="flex gap-3 justify-center mb-6">
          {["Age 6–16", "Hindi/English", "3 Choices"].map((tag, i) => (
            <div key={i} className="bg-white/25 rounded-xl px-3 py-2 text-white text-xs font-bold">
              {tag}
            </div>
          ))}
        </div>

        <button
          onClick={onStart}
          className="w-full py-4 bg-white text-orange-600 rounded-2xl font-black text-lg shadow-2xl active:scale-95 transition-transform relative overflow-hidden"
        >
          <span className="relative z-10">🚀 Start the Quest!</span>
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
            style={{ animation: "shine 2s linear infinite", position: "absolute", top: 0, width: "60%" }}
          />
        </button>

        <p className="text-amber-100/70 text-xs mt-4">
          Inospire Infotech · Arogya Yodha Phase 1
        </p>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function ArogyaYodha() {
  const [screen, setScreen] = useState("intro"); // intro | game | results
  const [chapterIdx, setChapterIdx] = useState(0);
  const [xp, setXp] = useState(0);
  const [score, setScore] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [mood, setMood] = useState("happy");
  const containerRef = useRef(null);

  const chapters = STORY.chapters;
  const totalChoices = chapters.filter((c) => c.type === "choice").length;
  const chapter = chapters[chapterIdx];

  const scrollTop = () => {
    containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStart = () => setScreen("game");

  const handleNext = () => {
    setChosen(null);
    if (chapterIdx + 1 >= chapters.length) {
      setScreen("results");
    } else {
      setChapterIdx((i) => i + 1);
      scrollTop();
    }
  };

  const handleChoice = (opt) => {
    setChosen(opt);
    if (opt.isGood) {
      setXp((x) => x + 15);
      setScore((s) => s + 1);
      setMood("proud");
    } else {
      setMood("sad");
    }
    setTimeout(() => setMood("happy"), 2000);
  };

  const handleContinueAfterChoice = () => {
    setChosen(null);
    setChapterIdx((i) => i + 1);
    scrollTop();
  };

  const handleRestart = () => {
    setScreen("intro");
    setChapterIdx(0);
    setXp(0);
    setScore(0);
    setChosen(null);
    setMood("happy");
  };

  if (screen === "intro") return <IntroScreen onStart={handleStart} />;
  if (screen === "results")
    return <ResultsScreen score={score} total={totalChoices} xp={xp} onRestart={handleRestart} />;

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-slate-100 to-orange-50 overflow-y-auto"
    >
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md shadow-sm px-4 py-3">
        <div className="max-w-sm mx-auto">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚔️</span>
              <div>
                <p className="font-black text-gray-800 text-sm leading-tight">Arogya Yodha</p>
                <p className="text-xs text-orange-500 font-semibold">{STORY.title}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 font-medium">
                Chapter {chapterIdx + 1} of {chapters.length}
              </p>
            </div>
          </div>
          <XPBar xp={xp} maxXp={STORY.xp} />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-sm mx-auto px-4 py-4 flex flex-col gap-4">
        {/* Progress */}
        <ProgressDots total={chapters.length} current={chapterIdx} />

        {/* Character */}
        <div className="flex justify-center">
          <Character mood={chosen ? (chosen.isGood ? "proud" : "sad") : mood} />
        </div>

        {/* Pillar badge */}
        <div className="flex justify-center">
          <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">
            🧼 Pillar: {STORY.pillar}
          </span>
        </div>

        {/* Main card */}
        {chapter.type === "scene" || chapter.type === "moral" ? (
          <SceneCard
            chapter={chapter}
            onNext={handleNext}
            chapterIdx={chapterIdx}
            totalChapters={chapters.length}
          />
        ) : chapter.type === "choice" ? (
          <div className="flex flex-col gap-3">
            <ChoiceCard chapter={chapter} onChoice={handleChoice} chosen={chosen} />
            {chosen && (
              <button
                onClick={handleContinueAfterChoice}
                className="w-full py-3 rounded-2xl font-bold text-white text-base shadow-lg active:scale-95 transition-transform"
                style={{ background: "linear-gradient(135deg,#f97316,#ef4444)" }}
              >
                Continue the Story →
              </button>
            )}
          </div>
        ) : null}

        {/* Score tracker */}
        <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100 flex justify-around text-center">
          <div>
            <p className="text-xl font-black text-green-600">{score}</p>
            <p className="text-xs text-gray-400">Good Choices</p>
          </div>
          <div className="w-px bg-gray-100" />
          <div>
            <p className="text-xl font-black text-amber-500">{xp}</p>
            <p className="text-xs text-gray-400">XP</p>
          </div>
          <div className="w-px bg-gray-100" />
          <div>
            <p className="text-xl font-black text-purple-500">{totalChoices - score}</p>
            <p className="text-xs text-gray-400">Missed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
