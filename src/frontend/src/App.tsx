import { TriviaGameSection } from "@/components/TriviaGameSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

// ─── Animation hook: detect when element enters viewport ───────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

// ─── Data ───────────────────────────────────────────────────────────────────
const dangerStats = [
  {
    emoji: "💀",
    title: "480,000 Deaths Per Year",
    desc: "Smoking kills more than 480,000 Americans every year — that's 1 in every 5 deaths in the US.",
    source: "CDC",
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
  },
  {
    emoji: "🧪",
    title: "7,000+ Toxic Chemicals",
    desc: "Cigarette smoke contains over 7,000 chemicals. At least 250 are harmful, and 69 can cause cancer.",
    source: "CDC",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  {
    emoji: "🫁",
    title: "15–30x Higher Lung Cancer Risk",
    desc: "Smokers are 15 to 30 times more likely to develop lung cancer than people who have never smoked.",
    source: "CDC",
    color: "text-teal-700",
    bg: "bg-teal-50",
    border: "border-teal-200",
  },
  {
    emoji: "❤️",
    title: "Heart & Organ Damage",
    desc: "Smoking harms nearly every organ in the body and is the leading cause of preventable death in the US.",
    source: "CDC",
    color: "text-rose-700",
    bg: "bg-rose-50",
    border: "border-rose-200",
  },
  {
    emoji: "👶",
    title: "Harms Unborn Babies",
    desc: "Smoking during pregnancy can cause premature birth, low birth weight, and birth defects.",
    source: "CDC",
    color: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200",
  },
  {
    emoji: "🦷",
    title: "Causes Tooth & Gum Disease",
    desc: "Smokers are twice as likely to have gum disease and tooth loss compared to non-smokers.",
    source: "ADA",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
];

const addictionFacts = [
  {
    step: "01",
    title: "10 Seconds to the Brain",
    desc: "Nicotine reaches your brain in just 10 seconds after you inhale cigarette smoke — faster than most medicines.",
    emoji: "⚡",
  },
  {
    step: "02",
    title: "The Dopamine Trick",
    desc: "Nicotine causes your brain to release dopamine — a chemical that makes you feel good. But it's a trap!",
    emoji: "🧠",
  },
  {
    step: "03",
    title: "Your Brain Wants More",
    desc: "Over time, your brain stops making its own dopamine and starts depending on nicotine just to feel normal.",
    emoji: "🔄",
  },
  {
    step: "04",
    title: "Withdrawal is Brutal",
    desc: "When you try to stop, you can feel anxious, irritable, and unable to concentrate. This is your body missing the drug.",
    emoji: "😰",
  },
  {
    step: "05",
    title: "Teens Get Addicted Faster",
    desc: "Young brains are still developing, making teens get addicted to nicotine more quickly than adults.",
    emoji: "⚠️",
  },
  {
    step: "06",
    title: "Most Wish They'd Never Started",
    desc: "Studies show that 9 out of 10 smokers wish they had never started. Addiction makes quitting very hard.",
    emoji: "💔",
  },
];

const timelineItems = [
  {
    time: "20 minutes",
    benefit: "Heart rate and blood pressure begin to drop",
    icon: "💓",
  },
  {
    time: "12 hours",
    benefit: "Carbon monoxide level in blood returns to normal",
    icon: "🌿",
  },
  {
    time: "2 weeks",
    benefit: "Circulation improves and lung function increases",
    icon: "🏃",
  },
  {
    time: "1 month",
    benefit: "Lungs start healing — coughing and shortness of breath decrease",
    icon: "🫁",
  },
  {
    time: "1 year",
    benefit: "Risk of heart disease is cut in HALF compared to a smoker",
    icon: "❤️",
  },
  {
    time: "5 years",
    benefit: "Stroke risk drops to that of a non-smoker",
    icon: "🧠",
  },
  {
    time: "10 years",
    benefit: "Lung cancer risk is cut in half — your body is healing!",
    icon: "🌟",
  },
  {
    time: "15 years",
    benefit: "Heart disease risk is equal to someone who never smoked",
    icon: "🎉",
  },
];

const resources = [
  {
    icon: "📞",
    title: "Call 1-800-QUIT-NOW",
    desc: "Free, confidential quitline available 24/7. Talk to a trained counselor who can help you make a quit plan.",
    action: "Call Now",
    href: "tel:1-800-784-8669",
    highlight: true,
  },
  {
    icon: "🌐",
    title: "smokefree.gov",
    desc: "Official US government resource with free tools, apps, and personalized quit plans for teens and adults.",
    action: "Visit Website",
    href: "https://smokefree.gov",
    highlight: false,
  },
  {
    icon: "💬",
    title: "Text QUIT to 47848",
    desc: "Text message support from SmokefreeTXT. Receive motivational messages and tips to get through cravings.",
    action: "Text QUIT",
    href: "sms:47848?body=QUIT",
    highlight: false,
  },
  {
    icon: "🏫",
    title: "Talk to a Trusted Adult",
    desc: "Your school counselor, doctor, or a trusted family member can help you or someone you know get support.",
    action: null,
    href: null,
    highlight: false,
  },
];

// ─── Components ─────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { href: "#dangers", label: "Dangers" },
    { href: "#addiction", label: "Addiction" },
    { href: "#quit", label: "Benefits" },
    { href: "#game", label: "🧠 Trivia" },
    { href: "#help", label: "Get Help" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-border"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex flex-col">
          <span
            className={`font-display font-bold text-lg leading-tight transition-colors ${
              scrolled ? "text-primary" : "text-white"
            }`}
          >
            SmokeFree Future
          </span>
          <span
            className={`text-xs font-body font-medium tracking-wide transition-colors ${
              scrolled ? "text-muted-foreground" : "text-white/80"
            }`}
          >
            Breathe Better, Live Longer
          </span>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              data-ocid={`nav.${link.href.replace("#", "")}.link`}
              className={`px-4 py-2 rounded-full text-sm font-body font-medium transition-all ${
                scrolled
                  ? "text-foreground hover:bg-primary/10 hover:text-primary"
                  : "text-white/90 hover:text-white hover:bg-white/15"
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#help"
            className="ml-3 px-5 py-2 rounded-full text-sm font-body font-semibold bg-accent text-accent-foreground hover:opacity-90 transition-opacity shadow-sm"
          >
            Take Action
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className={`md:hidden p-2 rounded-md transition-colors ${
            scrolled ? "text-foreground" : "text-white"
          }`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/98 backdrop-blur-md border-b border-border px-4 pb-4 shadow-lg">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 text-foreground font-body font-medium rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              window.location.hash = "#help";
            }}
            className="block w-full mt-2 px-4 py-3 text-center text-accent-foreground font-body font-semibold bg-accent rounded-full hover:opacity-90 transition-opacity"
          >
            Take Action
          </button>
        </div>
      )}
    </header>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/assets/generated/hero-banner.dim_1200x500.jpg')",
        }}
      />
      {/* Overlay */}
      <div className="hero-overlay absolute inset-0" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto pt-20">
        <Badge className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm font-body text-sm px-4 py-1.5 animate-fade-in">
          🌿 A Student Activist Movement
        </Badge>

        <h1 className="font-display font-black text-5xl sm:text-6xl md:text-7xl text-white leading-tight mb-6 animate-fade-up delay-100 text-balance">
          The Future is{" "}
          <span className="italic text-green-300">Smoke-Free</span>
        </h1>

        <p className="font-body text-xl sm:text-2xl text-white/90 mb-4 animate-fade-up delay-200 font-light tracking-wide">
          Breathe Better, Live Longer
        </p>

        <p className="font-body text-base sm:text-lg text-white/75 mb-10 max-w-2xl mx-auto animate-fade-up delay-300 leading-relaxed">
          Every cigarette shortens a life. Together, we can build a generation
          that knows the truth about tobacco — and chooses health.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up delay-400">
          <a href="#dangers">
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:opacity-90 font-body font-semibold text-base px-8 py-6 rounded-full shadow-hero transition-all hover:-translate-y-0.5"
            >
              📚 Learn the Facts
            </Button>
          </a>
          <a href="#game">
            <Button
              size="lg"
              className="bg-white/20 text-white border border-white/40 hover:bg-white/30 font-body font-semibold text-base px-8 py-6 rounded-full backdrop-blur-sm transition-all hover:-translate-y-0.5"
            >
              🧠 Take the Trivia
            </Button>
          </a>
          <a href="#help">
            <Button
              size="lg"
              className="bg-white/20 text-white border border-white/40 hover:bg-white/30 font-body font-medium text-base px-8 py-6 rounded-full backdrop-blur-sm transition-all hover:-translate-y-0.5"
            >
              💚 Get Help Now
            </Button>
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 animate-bounce opacity-60" aria-hidden="true">
          <svg
            className="w-6 h-6 text-white mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            role="img"
            aria-label="Scroll down"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}

function DangersSection() {
  const { ref, inView } = useInView();

  return (
    <section id="dangers" className="py-20 sm:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div
          ref={ref}
          className={`text-center mb-16 ${inView ? "animate-fade-up" : "opacity-0"}`}
        >
          <Badge className="mb-4 bg-red-100 text-red-700 border-red-200 font-body">
            ⚠️ The Dangers
          </Badge>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-5">
            What Smoking Does to Your Body
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            These aren't just warnings on a label — they're real facts backed by
            decades of scientific research from the CDC and leading health
            organizations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dangerStats.map((stat, i) => (
            <div
              key={stat.title}
              className={`group rounded-2xl p-6 border-2 ${stat.bg} ${stat.border} card-hover ${
                inView
                  ? `animate-fade-up delay-${Math.min((i + 1) * 100, 600)}`
                  : "opacity-0"
              }`}
            >
              <div className="text-4xl mb-4">{stat.emoji}</div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3
                  className={`font-display font-bold text-xl leading-tight ${stat.color}`}
                >
                  {stat.title}
                </h3>
              </div>
              <p className="font-body text-sm text-foreground/80 leading-relaxed mb-3">
                {stat.desc}
              </p>
              <span className="inline-block text-xs font-body font-medium text-muted-foreground bg-white/60 px-2 py-1 rounded-full">
                Source: {stat.source}
              </span>
            </div>
          ))}
        </div>

        {/* Callout banner */}
        <div
          className={`mt-12 rounded-3xl bg-primary text-primary-foreground p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-6 ${
            inView ? "animate-fade-up delay-600" : "opacity-0"
          }`}
        >
          <div className="text-6xl shrink-0">🚭</div>
          <div>
            <h3 className="font-display font-bold text-2xl mb-2">
              There is NO safe level of tobacco use.
            </h3>
            <p className="font-body text-primary-foreground/85 leading-relaxed">
              Even "light" smoking or occasional use causes real damage to your
              lungs, heart, and other organs. The only safe choice is to never
              start — or to quit as soon as possible.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function AddictionSection() {
  const { ref, inView } = useInView();

  return (
    <section id="addiction" className="py-20 sm:py-28 section-gradient">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div
          ref={ref}
          className={`text-center mb-16 ${inView ? "animate-fade-up" : "opacity-0"}`}
        >
          <Badge className="mb-4 bg-amber-100 text-amber-700 border-amber-200 font-body">
            🧠 How Addiction Works
          </Badge>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-5">
            Why Tobacco is So Hard to Quit
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Nicotine is one of the most addictive substances known to science.
            Here's what actually happens inside your brain when you smoke.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {addictionFacts.map((fact, i) => (
            <div
              key={fact.step}
              className={`bg-white rounded-2xl p-6 shadow-card border border-border card-hover ${
                inView
                  ? `animate-fade-up delay-${Math.min((i + 1) * 100, 600)}`
                  : "opacity-0"
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="font-display font-black text-3xl text-primary/20">
                  {fact.step}
                </span>
                <span className="text-3xl">{fact.emoji}</span>
              </div>
              <h3 className="font-display font-bold text-xl text-foreground mb-3">
                {fact.title}
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {fact.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Teen focus callout */}
        <div
          className={`mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 ${
            inView ? "animate-fade-up delay-600" : "opacity-0"
          }`}
        >
          {[
            {
              icon: "📊",
              stat: "9 out of 10",
              label: "smokers started before age 18",
            },
            {
              icon: "⏱️",
              stat: "10 seconds",
              label: "for nicotine to reach the brain",
            },
            {
              icon: "😔",
              stat: "90%",
              label: "of smokers wish they never started",
            },
          ].map((item) => (
            <div
              key={item.stat}
              className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center"
            >
              <div className="text-4xl mb-3">{item.icon}</div>
              <div className="font-display font-black text-3xl text-primary mb-2">
                {item.stat}
              </div>
              <p className="font-body text-sm text-muted-foreground">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuitSection() {
  const { ref, inView } = useInView();

  return (
    <section id="quit" className="py-20 sm:py-28 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div
          ref={ref}
          className={`text-center mb-16 ${inView ? "animate-fade-up" : "opacity-0"}`}
        >
          <Badge className="mb-4 bg-green-100 text-green-700 border-green-200 font-body">
            🌱 The Path to Recovery
          </Badge>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-5">
            What Happens When You Quit?
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Your body is amazing — it starts healing the moment you stop
            smoking. Here's what happens on the road to recovery.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent via-primary to-accent/30 rounded-full hidden sm:block" />

          <div className="space-y-6">
            {timelineItems.map((item, i) => (
              <div
                key={item.time}
                className={`flex gap-5 items-start ${
                  inView
                    ? `animate-fade-up delay-${Math.min((i + 1) * 100, 600)}`
                    : "opacity-0"
                }`}
              >
                {/* Dot */}
                <div className="hidden sm:flex flex-col items-center shrink-0 w-12">
                  <div className="timeline-dot mt-1" />
                </div>

                {/* Card */}
                <div className="flex-1 bg-card rounded-2xl border border-border p-5 shadow-card card-hover">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="font-display font-bold text-accent text-lg">
                      After {item.time}
                    </span>
                  </div>
                  <p className="font-body text-foreground/80 leading-relaxed text-sm sm:text-base">
                    {item.benefit}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div
          className={`mt-14 text-center ${inView ? "animate-fade-up delay-600" : "opacity-0"}`}
        >
          <div className="bg-accent/10 border-2 border-accent/30 rounded-3xl p-8 sm:p-10">
            <p className="font-display font-bold text-2xl sm:text-3xl text-foreground mb-3">
              Your body wants to heal. 🌱
            </p>
            <p className="font-body text-muted-foreground mb-6 max-w-lg mx-auto leading-relaxed">
              It's never too late to quit. Every hour without a cigarette is
              your body getting stronger. The best time to stop is right now.
            </p>
            <a href="#help">
              <Button className="bg-accent text-accent-foreground hover:opacity-90 font-body font-semibold px-8 py-3 rounded-full text-base shadow-sm">
                Find Help to Quit →
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function HelpSection() {
  const { ref, inView } = useInView();

  return (
    <section
      id="help"
      className="py-20 sm:py-28 bg-primary text-primary-foreground noise-texture"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div
          ref={ref}
          className={`text-center mb-16 ${inView ? "animate-fade-up" : "opacity-0"}`}
        >
          <Badge className="mb-4 bg-white/20 text-white border-white/30 font-body">
            💚 You Are Not Alone
          </Badge>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-white mb-5">
            Ready to Get Help?
          </h2>
          <p className="font-body text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            Whether you want to quit yourself, or help someone you care about —
            these free resources are here for you, right now.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {resources.map((res, i) => (
            <div
              key={res.title}
              className={`rounded-2xl p-7 border transition-all ${
                res.highlight
                  ? "bg-white/15 border-white/40 shadow-hero"
                  : "bg-white/8 border-white/20"
              } ${inView ? `animate-fade-up delay-${Math.min((i + 1) * 100, 500)}` : "opacity-0"} hover:bg-white/20`}
            >
              <div className="text-4xl mb-4">{res.icon}</div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="font-display font-bold text-xl text-white">
                  {res.title}
                </h3>
                {res.highlight && (
                  <Badge className="bg-accent text-accent-foreground border-0 font-body text-xs shrink-0">
                    Free 24/7
                  </Badge>
                )}
              </div>
              <p className="font-body text-white/75 leading-relaxed text-sm mb-5">
                {res.desc}
              </p>
              {res.action && res.href && (
                <a
                  href={res.href}
                  target={res.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                >
                  <Button className="bg-white/20 text-white border border-white/40 hover:bg-white/30 font-body font-semibold rounded-full text-sm">
                    {res.action}
                  </Button>
                </a>
              )}
              {!res.action && (
                <p className="font-body text-white/50 text-xs italic">
                  No referral needed — just reach out.
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Emergency tip */}
        <div
          className={`mt-10 bg-white/10 border border-white/25 rounded-2xl p-6 flex gap-4 items-start ${
            inView ? "animate-fade-up delay-500" : "opacity-0"
          }`}
        >
          <span className="text-3xl">💡</span>
          <div>
            <h4 className="font-display font-bold text-white mb-1">
              Craving a cigarette?
            </h4>
            <p className="font-body text-white/75 text-sm leading-relaxed">
              Try the 4D strategy: <strong className="text-white">Delay</strong>{" "}
              for 10 minutes,
              <strong className="text-white"> Deep breathe</strong>,
              <strong className="text-white"> Drink water</strong>, and
              <strong className="text-white"> Do something else</strong> to
              distract yourself. Most cravings only last a few minutes!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="font-display font-bold text-xl text-white mb-1">
              SmokeFree Future
            </div>
            <div className="font-body text-white/60 text-sm italic">
              Breathe Better, Live Longer
            </div>
          </div>

          <div className="flex gap-1 flex-wrap justify-center">
            {[
              { href: "#dangers", label: "Dangers" },
              { href: "#addiction", label: "Addiction" },
              { href: "#quit", label: "Benefits of Quitting" },
              { href: "#game", label: "🧠 Trivia" },
              { href: "#help", label: "Get Help" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-1 text-white/60 hover:text-white font-body text-sm transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-center">
          <p className="font-body text-white/50 text-sm">
            Created by a 6th grader who cares about our future. 🌿
          </p>
          <p className="font-body text-white/40 text-sm">
            &copy; {new Date().getFullYear()} SmokeFree Future |
            smokefreefuture.com |{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white/70 transition-colors"
            >
              Built with ♥ using caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <DangersSection />
        <AddictionSection />
        <QuitSection />
        <TriviaGameSection />
        <HelpSection />
      </main>
      <Footer />
    </div>
  );
}
