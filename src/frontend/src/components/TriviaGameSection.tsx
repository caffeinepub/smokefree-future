import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

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

const OPTION_LABELS = ["A", "B", "C", "D"];

function getGrade(score: number) {
  if (score >= 90)
    return {
      letter: "A",
      color: "text-emerald-600",
      message: "Outstanding! You're a tobacco facts expert! 🌟",
    };
  if (score >= 80)
    return {
      letter: "B",
      color: "text-teal-600",
      message: "Great job! You really know your stuff! 💪",
    };
  if (score >= 70)
    return {
      letter: "C",
      color: "text-amber-600",
      message: "Good effort! Keep learning the facts. 📚",
    };
  if (score >= 60)
    return {
      letter: "D",
      color: "text-orange-600",
      message: "Not bad, but there's more to discover! 🔍",
    };
  return {
    letter: "F",
    color: "text-red-600",
    message: "Keep studying — knowing the facts saves lives! 💡",
  };
}

type Screen = "intro" | "question" | "reveal" | "final";

export function TriviaGameSection() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showNext, setShowNext] = useState(false);

  const question = questions[currentQ];
  const progress = (currentQ / questions.length) * 100;

  function startGame() {
    setScreen("question");
    setCurrentQ(0);
    setScore(0);
    setSelected(null);
    setShowNext(false);
  }

  function handleAnswer(idx: number) {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === question.answer) setScore((s) => s + 10);
    setScreen("reveal");
  }

  useEffect(() => {
    if (screen !== "reveal") return;
    const t = setTimeout(() => setShowNext(true), 400);
    return () => clearTimeout(t);
  }, [screen]);

  function nextQuestion() {
    const next = currentQ + 1;
    if (next >= questions.length) {
      setScreen("final");
    } else {
      setCurrentQ(next);
      setSelected(null);
      setShowNext(false);
      setScreen("question");
    }
  }

  const grade = getGrade(score);

  return (
    <section id="game" className="py-20 sm:py-28 bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <Badge className="mb-4 bg-teal-100 text-teal-700 border-teal-200 font-body">
            🧠 Trivia Quiz
          </Badge>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-4">
            SmokeFree Trivia
          </h2>
          <p className="font-body text-lg text-muted-foreground">
            Test your knowledge about tobacco dangers!
          </p>
        </div>

        {/* INTRO */}
        {screen === "intro" && (
          <div className="text-center">
            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border-2 border-teal-200 rounded-3xl p-8 sm:p-12">
              <div className="text-6xl mb-5">🎯</div>
              <h3 className="font-display font-bold text-2xl text-foreground mb-3">
                How to Play
              </h3>
              <p className="font-body text-muted-foreground mb-2 max-w-sm mx-auto">
                Answer <strong>10 questions</strong> about tobacco and smoking.
              </p>
              <p className="font-body text-muted-foreground mb-8 max-w-sm mx-auto">
                Each correct answer earns <strong>10 points</strong>. Can you
                score 100/100?
              </p>
              <Button
                size="lg"
                data-ocid="game.primary_button"
                onClick={startGame}
                className="bg-accent text-accent-foreground hover:opacity-90 font-body font-semibold text-lg px-10 py-6 rounded-full shadow-lg transition-all hover:-translate-y-1"
              >
                🚀 Start Quiz!
              </Button>
            </div>
          </div>
        )}

        {/* QUESTION + REVEAL */}
        {(screen === "question" || screen === "reveal") && (
          <div>
            {/* Progress bar */}
            <div className="flex items-center justify-between mb-2">
              <span className="font-body text-sm text-muted-foreground">
                Question <strong>{currentQ + 1}</strong> of {questions.length}
              </span>
              <span className="font-display font-bold text-primary text-lg">
                Score: {score}
              </span>
            </div>
            <Progress value={progress} className="h-3 mb-6 rounded-full" />

            {/* Question */}
            <div className="bg-gradient-to-br from-teal-600 to-emerald-700 rounded-3xl p-6 sm:p-8 mb-6 shadow-xl">
              <p className="font-display font-bold text-2xl sm:text-3xl text-white leading-snug text-balance">
                {question.q}
              </p>
            </div>

            {/* Answer options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {question.options.map((opt, idx) => {
                let cls =
                  "border-2 border-border bg-white text-foreground hover:border-primary hover:bg-primary/5";
                if (screen === "reveal" && selected !== null) {
                  if (idx === question.answer) {
                    cls =
                      "border-2 border-emerald-500 bg-emerald-50 text-emerald-800";
                  } else if (idx === selected) {
                    cls = "border-2 border-red-400 bg-red-50 text-red-700";
                  } else {
                    cls =
                      "border-2 border-border bg-gray-50 text-muted-foreground opacity-50";
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
                    } ${cls}`}
                  >
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary font-display font-bold text-sm mr-3 shrink-0">
                      {OPTION_LABELS[idx]}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {screen === "reveal" && (
              <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 mb-6 animate-fade-in">
                <p className="font-body text-sm text-amber-800 leading-relaxed">
                  <strong>💡 Did you know?</strong> {question.explanation}
                </p>
              </div>
            )}

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
                    : "See My Score 🏆"}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* FINAL SCORE */}
        {screen === "final" && (
          <div className="text-center animate-fade-up">
            <div className="bg-gradient-to-br from-teal-50 via-emerald-50 to-green-50 border-2 border-teal-200 rounded-3xl p-8 sm:p-12">
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="font-display font-bold text-3xl text-foreground mb-4">
                Quiz Complete!
              </h3>
              <div className="font-display font-black text-7xl sm:text-8xl text-primary mb-2">
                {score}
                <span className="text-3xl text-muted-foreground">/100</span>
              </div>
              <div
                className={`font-display font-black text-5xl ${grade.color} mb-4`}
              >
                Grade: {grade.letter}
              </div>
              <p className="font-body text-muted-foreground text-lg mb-8">
                {grade.message}
              </p>
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
