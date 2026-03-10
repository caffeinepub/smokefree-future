import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────

const questions = [
  {
    q: "How many Americans does smoking kill each year?",
    options: ["100,000", "250,000", "480,000", "50,000"],
    answer: 2,
    explanation:
      "Smoking kills over 480,000 Americans per year — 1 in 5 deaths.",
  },
  {
    q: "How many chemicals are in cigarette smoke?",
    options: ["500", "7,000", "200", "1,000"],
    answer: 1,
    explanation: "Over 7,000 chemicals — at least 69 can cause cancer.",
  },
  {
    q: "How quickly does nicotine reach your brain after smoking?",
    options: ["1 minute", "30 seconds", "5 minutes", "10 seconds"],
    answer: 3,
    explanation:
      "Nicotine reaches the brain in just 10 seconds — faster than most medicines.",
  },
  {
    q: "Smokers are how many times more likely to get lung cancer?",
    options: ["2x", "5x", "10x", "15–30x"],
    answer: 3,
    explanation:
      "Smokers are 15 to 30 times more likely to develop lung cancer.",
  },
  {
    q: "What chemical makes tobacco addictive?",
    options: ["Tar", "Carbon monoxide", "Nicotine", "Ammonia"],
    answer: 2,
    explanation: "Nicotine is the addictive substance that hooks your brain.",
  },
  {
    q: "What percentage of smokers wish they'd never started?",
    options: ["50%", "70%", "90%", "30%"],
    answer: 2,
    explanation: "Studies show 9 out of 10 smokers regret ever starting.",
  },
  {
    q: "How soon after quitting does heart rate start to drop?",
    options: ["1 hour", "20 minutes", "1 day", "1 week"],
    answer: 1,
    explanation:
      "Within 20 minutes of quitting, heart rate and blood pressure begin to drop.",
  },
  {
    q: "Most adult smokers started at what age?",
    options: ["Over 25", "18–24", "Before 18", "Over 30"],
    answer: 2,
    explanation: "9 out of 10 smokers started before age 18.",
  },
  {
    q: "What does nicotine release in the brain that creates addiction?",
    options: ["Serotonin", "Adrenaline", "Dopamine", "Cortisol"],
    answer: 2,
    explanation:
      "Nicotine triggers dopamine release — the feel-good chemical — trapping the brain.",
  },
  {
    q: "After how many years smoke-free does lung cancer risk drop by half?",
    options: ["2 years", "5 years", "10 years", "20 years"],
    answer: 2,
    explanation:
      "After 10 smoke-free years, your lung cancer risk is cut in half.",
  },
];

const judges = [
  {
    id: "harriet",
    name: "Judge Harriet",
    emoji: "👩‍⚖️",
    title: "The Strict One",
    color: "from-purple-600 to-purple-800",
    bg: "bg-purple-50",
    border: "border-purple-300",
    textColor: "text-purple-800",
    bubbleBg: "bg-purple-100",
    correct: [
      "Correct. I expected nothing less.",
      "That is the right answer. Well done.",
      "Finally, someone who did their homework.",
    ],
    incorrect: [
      "Wrong. Completely wrong.",
      "That is simply incorrect. Pay attention.",
      "Unacceptable. The correct answer was obvious.",
    ],
    final: {
      A: "An excellent performance. I am begrudgingly impressed.",
      B: "Above average. You have potential.",
      C: "Passing, but barely. Study harder.",
      D: "Disappointing. You must do better.",
      F: "A failure. I strongly recommend a full review of the facts.",
    },
  },
  {
    id: "cool",
    name: "Judge Cool",
    emoji: "😎",
    title: "The Trendy One",
    color: "from-blue-500 to-cyan-600",
    bg: "bg-cyan-50",
    border: "border-cyan-300",
    textColor: "text-cyan-800",
    bubbleBg: "bg-cyan-100",
    correct: [
      "No cap, you knew that one! 🔥",
      "Ayy, that's facts! Big brain energy.",
      "Fr fr, you're built different. 💯",
    ],
    incorrect: [
      "Oof, that's an L my friend. 😬",
      "Nah, that ain't it chief.",
      "Yikes, you gotta study up on that one.",
    ],
    final: {
      A: "No cap, you're goated with the sauce on tobacco facts! 🏆",
      B: "Solid run, no cap. You got the knowledge fr.",
      C: "Mid performance, lowkey. You can do better.",
      D: "Bro that was rough, not gonna lie.",
      F: "That was a major L. Time to hit the books, fr fr.",
    },
  },
  {
    id: "lungs",
    name: "Dr. Lungs",
    emoji: "🫁",
    title: "The Medical Expert",
    color: "from-emerald-600 to-teal-700",
    bg: "bg-emerald-50",
    border: "border-emerald-300",
    textColor: "text-emerald-800",
    bubbleBg: "bg-emerald-100",
    correct: [
      "Clinically accurate. Well done.",
      "Correct! That is medically verified.",
      "As a health professional, I approve this answer.",
    ],
    incorrect: [
      "Medically incorrect. This concerns me.",
      "That answer could be dangerous misinformation.",
      "I strongly recommend reviewing the health literature.",
    ],
    final: {
      A: "Exemplary health literacy. Your lungs thank you! 🫁✅",
      B: "Solid medical knowledge. Keep up the healthy habits.",
      C: "Adequate, but there is room for clinical improvement.",
      D: "Your health knowledge needs significant attention.",
      F: "As your doctor, I am prescribing more study time immediately.",
    },
  },
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getGrade(score: number): string {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

const gradeColors: Record<string, string> = {
  A: "text-emerald-600",
  B: "text-teal-600",
  C: "text-amber-600",
  D: "text-orange-600",
  F: "text-red-600",
};

const OPTION_LABELS = ["A", "B", "C", "D"];

// ─── Sub-components ───────────────────────────────────────────────────────────

function JudgeCard({
  judge,
  comment,
  score,
  visible,
}: {
  judge: (typeof judges)[0];
  comment: string | null;
  score: number | null;
  visible: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border-2 ${judge.border} ${judge.bg} p-4 transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <div className="flex items-center gap-2 mb-3">
        <div
          className={`w-12 h-12 rounded-full bg-gradient-to-br ${judge.color} flex items-center justify-center text-2xl shadow-md shrink-0`}
        >
          {judge.emoji}
        </div>
        <div>
          <div className={`font-display font-bold text-sm ${judge.textColor}`}>
            {judge.name}
          </div>
          <div className="text-xs text-muted-foreground font-body">
            {judge.title}
          </div>
        </div>
        {score !== null && (
          <div
            className={`ml-auto font-display font-black text-xl ${judge.textColor}`}
          >
            {score}/10
          </div>
        )}
      </div>

      {comment && (
        <div className="relative">
          <div
            className={`${judge.bubbleBg} rounded-xl rounded-tl-none p-3 text-sm font-body ${judge.textColor} leading-snug`}
          >
            {comment}
          </div>
          <div
            className={`absolute -top-2 left-3 w-3 h-3 ${judge.bubbleBg} rotate-45`}
            style={{ clipPath: "polygon(0 0, 100% 100%, 0 100%)" }}
          />
        </div>
      )}

      {!comment && (
        <div
          className={`${judge.bubbleBg} rounded-xl rounded-tl-none p-3 text-sm font-body ${judge.textColor} opacity-50 italic`}
        >
          Waiting for your answer...
        </div>
      )}
    </div>
  );
}

function JudgePreview({ judge }: { judge: (typeof judges)[0] }) {
  return (
    <div
      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 ${judge.border} ${judge.bg}`}
    >
      <div
        className={`w-16 h-16 rounded-full bg-gradient-to-br ${judge.color} flex items-center justify-center text-3xl shadow-lg`}
      >
        {judge.emoji}
      </div>
      <div className="text-center">
        <div className={`font-display font-bold text-sm ${judge.textColor}`}>
          {judge.name}
        </div>
        <div className="text-xs text-muted-foreground font-body">
          {judge.title}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

type Screen = "intro" | "question" | "reveal" | "final";

interface JudgeReaction {
  comment: string;
  score: number;
}

export function JudgeGameSection() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [judgeReactions, setJudgeReactions] = useState<
    (JudgeReaction | null)[]
  >([null, null, null]);
  const [visibleJudges, setVisibleJudges] = useState([false, false, false]);
  const [showNext, setShowNext] = useState(false);

  const question = questions[currentQ];
  const progress = (currentQ / questions.length) * 100;

  function startGame() {
    setScreen("question");
    setCurrentQ(0);
    setTotalScore(0);
    setSelectedAnswer(null);
    setJudgeReactions([null, null, null]);
    setVisibleJudges([false, false, false]);
    setShowNext(false);
  }

  function handleAnswer(idx: number) {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);

    const isCorrect = idx === question.answer;
    const reactions: JudgeReaction[] = judges.map((j) => ({
      comment: pick(isCorrect ? j.correct : j.incorrect),
      score: isCorrect
        ? Math.floor(Math.random() * 2) + 9
        : Math.floor(Math.random() * 4) + 1,
    }));

    if (isCorrect) {
      setTotalScore((s) => s + 10);
    }

    setJudgeReactions(reactions);
    setScreen("reveal");
  }

  useEffect(() => {
    if (screen !== "reveal") return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    judges.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setVisibleJudges((prev) => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
        }, i * 350),
      );
    });
    timers.push(setTimeout(() => setShowNext(true), judges.length * 350 + 300));
    return () => timers.forEach(clearTimeout);
  }, [screen]);

  function nextQuestion() {
    const nextIdx = currentQ + 1;
    if (nextIdx >= questions.length) {
      setScreen("final");
    } else {
      setCurrentQ(nextIdx);
      setSelectedAnswer(null);
      setJudgeReactions([null, null, null]);
      setVisibleJudges([false, false, false]);
      setShowNext(false);
      setScreen("question");
    }
  }

  const grade = getGrade(totalScore);

  return (
    <section id="game" className="py-20 sm:py-28 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <Badge className="mb-4 bg-teal-100 text-teal-700 border-teal-200 font-body">
            🎮 Interactive Game
          </Badge>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-4">
            ⚖️ Judge the Facts
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-xl mx-auto">
            Test your tobacco knowledge — our 3 judges will score every answer!
          </p>
        </div>

        {/* ── INTRO SCREEN ─────────────────────────────────────────────── */}
        {screen === "intro" && (
          <div className="text-center">
            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border-2 border-teal-200 rounded-3xl p-8 sm:p-12 mb-8">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="font-display font-bold text-2xl text-foreground mb-3">
                How to Play
              </h3>
              <p className="font-body text-muted-foreground mb-2 max-w-md mx-auto">
                Answer <strong>10 questions</strong> about tobacco and smoking
                dangers.
              </p>
              <p className="font-body text-muted-foreground mb-6 max-w-md mx-auto">
                Our 3 judges will react to each answer and give you a score out
                of 10. Get it right to earn points — can you score{" "}
                <strong>100/100</strong>?
              </p>

              {/* Judge preview */}
              <div className="grid grid-cols-3 gap-4 mb-8 max-w-lg mx-auto">
                {judges.map((j) => (
                  <JudgePreview key={j.id} judge={j} />
                ))}
              </div>

              <Button
                size="lg"
                data-ocid="game.primary_button"
                onClick={startGame}
                className="bg-accent text-accent-foreground hover:opacity-90 font-body font-semibold text-lg px-10 py-6 rounded-full shadow-lg transition-all hover:-translate-y-1"
              >
                🎮 Start Game!
              </Button>
            </div>
          </div>
        )}

        {/* ── QUESTION SCREEN ──────────────────────────────────────────── */}
        {(screen === "question" || screen === "reveal") && (
          <div>
            {/* Progress & score bar */}
            <div className="flex items-center justify-between mb-3">
              <span className="font-body text-sm text-muted-foreground">
                Question <strong>{currentQ + 1}</strong> of {questions.length}
              </span>
              <span className="font-display font-bold text-primary text-lg">
                Score: {totalScore}
              </span>
            </div>
            <Progress value={progress} className="h-3 mb-6 rounded-full" />

            {/* Question card */}
            <div className="bg-gradient-to-br from-teal-600 to-emerald-700 rounded-3xl p-6 sm:p-8 mb-6 shadow-xl">
              <p className="font-display font-bold text-2xl sm:text-3xl text-white text-balance leading-snug">
                {question.q}
              </p>
            </div>

            {/* Answer buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {question.options.map((opt, idx) => {
                let btnClass =
                  "border-2 border-border bg-white text-foreground hover:border-primary hover:bg-primary/5";
                if (screen === "reveal" && selectedAnswer !== null) {
                  if (idx === question.answer) {
                    btnClass =
                      "border-2 border-emerald-500 bg-emerald-50 text-emerald-800";
                  } else if (
                    idx === selectedAnswer &&
                    selectedAnswer !== question.answer
                  ) {
                    btnClass = "border-2 border-red-400 bg-red-50 text-red-700";
                  } else {
                    btnClass =
                      "border-2 border-border bg-gray-50 text-muted-foreground opacity-60";
                  }
                }
                return (
                  <button
                    key={opt}
                    type="button"
                    data-ocid={`game.answer.button.${idx + 1}`}
                    onClick={() => handleAnswer(idx)}
                    disabled={screen === "reveal"}
                    className={`w-full text-left p-4 rounded-2xl font-body font-medium transition-all duration-200 ${
                      screen === "question"
                        ? "cursor-pointer"
                        : "cursor-default"
                    } ${btnClass}`}
                  >
                    <span className="inline-block w-7 h-7 rounded-full bg-primary/10 text-primary font-display font-bold text-sm text-center leading-7 mr-3 shrink-0">
                      {OPTION_LABELS[idx]}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Explanation on reveal */}
            {screen === "reveal" && (
              <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 mb-6 animate-fade-in">
                <p className="font-body text-sm text-amber-800 leading-relaxed">
                  <strong>💡 Did you know?</strong> {question.explanation}
                </p>
              </div>
            )}

            {/* Judge reactions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {judges.map((judge, i) => (
                <JudgeCard
                  key={judge.id}
                  judge={judge}
                  comment={judgeReactions[i]?.comment ?? null}
                  score={judgeReactions[i]?.score ?? null}
                  visible={screen === "question" ? true : visibleJudges[i]}
                />
              ))}
            </div>

            {/* Next button */}
            {screen === "reveal" && showNext && (
              <div className="text-center animate-fade-in">
                <Button
                  size="lg"
                  data-ocid="game.next_button"
                  onClick={nextQuestion}
                  className="bg-primary text-primary-foreground hover:opacity-90 font-body font-semibold px-10 py-4 rounded-full shadow-md transition-all hover:-translate-y-0.5"
                >
                  {currentQ + 1 < questions.length
                    ? "Next Question →"
                    : "See Final Score 🏆"}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* ── FINAL SCORE SCREEN ───────────────────────────────────────── */}
        {screen === "final" && (
          <div className="text-center animate-fade-up">
            <div className="bg-gradient-to-br from-teal-50 via-emerald-50 to-green-50 border-2 border-teal-200 rounded-3xl p-8 sm:p-12 mb-8">
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="font-display font-bold text-3xl text-foreground mb-2">
                Final Score
              </h3>
              <div className="font-display font-black text-7xl sm:text-8xl text-primary my-4">
                {totalScore}
                <span className="text-3xl text-muted-foreground">/100</span>
              </div>
              <div
                className={`font-display font-black text-5xl ${gradeColors[grade]} mb-2`}
              >
                Grade: {grade}
              </div>
              <p className="font-body text-muted-foreground mb-8">
                {totalScore >= 90 &&
                  "Outstanding! You're a tobacco facts expert! 🌟"}
                {totalScore >= 80 &&
                  totalScore < 90 &&
                  "Great job! You know your stuff! 💪"}
                {totalScore >= 70 &&
                  totalScore < 80 &&
                  "Good effort! Keep learning the facts. 📚"}
                {totalScore >= 60 &&
                  totalScore < 70 &&
                  "Not bad, but there's more to learn! 🔍"}
                {totalScore < 60 &&
                  "Keep studying — knowing the facts saves lives! 💡"}
              </p>

              {/* Judge final verdicts */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left mb-8">
                {judges.map((judge) => (
                  <div
                    key={judge.id}
                    className={`rounded-2xl border-2 ${judge.border} ${judge.bg} p-4`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className={`w-10 h-10 rounded-full bg-gradient-to-br ${judge.color} flex items-center justify-center text-xl shadow-sm`}
                      >
                        {judge.emoji}
                      </div>
                      <div
                        className={`font-display font-bold text-sm ${judge.textColor}`}
                      >
                        {judge.name}
                      </div>
                    </div>
                    <p
                      className={`text-sm font-body ${judge.textColor} leading-snug`}
                    >
                      {judge.final[grade as keyof typeof judge.final]}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  size="lg"
                  data-ocid="game.restart_button"
                  onClick={startGame}
                  className="bg-accent text-accent-foreground hover:opacity-90 font-body font-semibold px-8 py-4 rounded-full shadow-md transition-all hover:-translate-y-0.5"
                >
                  🔄 Play Again
                </Button>
                <a href="#dangers">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary/10 font-body font-semibold px-8 py-4 rounded-full transition-all hover:-translate-y-0.5"
                  >
                    📚 Learn More
                  </Button>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
