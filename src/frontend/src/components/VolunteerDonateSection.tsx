import { Badge } from "@/components/ui/badge";
import { useEffect, useRef, useState } from "react";

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

const volunteerLinks = [
  {
    label: "Become a Truth Ambassador",
    href: "https://www.thetruth.com/articles/take-action",
    ocid: "volunteer.button.1",
  },
  {
    label: "Join the American Cancer Society",
    href: "https://www.cancer.org/involved/volunteer.html",
    ocid: "volunteer.button.2",
  },
  {
    label: "Volunteer with the American Lung Association",
    href: "https://www.lung.org/get-involved/ways-to-give/volunteer",
    ocid: "volunteer.button.3",
  },
];

const donateLinks = [
  {
    label: "Donate to the American Lung Association",
    href: "https://www.lung.org/get-involved/ways-to-give",
    ocid: "donate.button.1",
  },
  {
    label: "Support Truth Initiative",
    href: "https://truthinitiative.org/support-us",
    ocid: "donate.button.2",
  },
  {
    label: "Give to the American Cancer Society",
    href: "https://donate.cancer.org",
    ocid: "donate.button.3",
  },
];

export function VolunteerDonateSection() {
  const { ref, inView } = useInView();

  return (
    <section id="support" className="py-20 sm:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div
          ref={ref}
          className={`text-center mb-14 ${inView ? "animate-fade-up" : "opacity-0"}`}
        >
          <Badge className="mb-4 bg-teal-100 text-teal-700 border-teal-200 font-body">
            🤝 Get Involved
          </Badge>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-5">
            Help Someone Quit
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            You don't have to be a doctor to save a life. Here's how you can
            make a real difference.
          </p>
        </div>

        {/* Two-column cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Volunteer card */}
          <div
            className={`rounded-2xl border-2 border-green-200 bg-green-50 p-8 ${
              inView ? "animate-fade-up delay-100" : "opacity-0"
            }`}
          >
            <div className="text-4xl mb-3">🙋</div>
            <h3 className="font-display font-bold text-2xl text-green-800 mb-3">
              Volunteer Your Time
            </h3>
            <p className="font-body text-green-900/75 leading-relaxed text-sm mb-6">
              Share your voice, spread awareness, and support people trying to
              quit — in your community, school, or online.
            </p>
            <div className="space-y-3">
              {volunteerLinks.map((item) => (
                <a
                  key={item.ocid}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  data-ocid={item.ocid}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-white border border-green-200 text-green-800 font-body font-medium text-sm hover:bg-green-100 hover:border-green-400 transition-all group"
                >
                  <span className="text-green-500 text-base">→</span>
                  <span className="group-hover:underline underline-offset-2">
                    {item.label}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Donate card */}
          <div
            className={`rounded-2xl border-2 border-teal-200 bg-teal-50 p-8 ${
              inView ? "animate-fade-up delay-200" : "opacity-0"
            }`}
          >
            <div className="text-4xl mb-3">💛</div>
            <h3 className="font-display font-bold text-2xl text-teal-800 mb-3">
              Donate to a Cause
            </h3>
            <p className="font-body text-teal-900/75 leading-relaxed text-sm mb-6">
              Even a small donation helps fund free quitlines, counseling, and
              support programs for people who want to quit.
            </p>
            <div className="space-y-3">
              {donateLinks.map((item) => (
                <a
                  key={item.ocid}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  data-ocid={item.ocid}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-white border border-teal-200 text-teal-800 font-body font-medium text-sm hover:bg-teal-100 hover:border-teal-400 transition-all group"
                >
                  <span className="text-teal-500 text-base">→</span>
                  <span className="group-hover:underline underline-offset-2">
                    {item.label}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Full-width callout */}
        <div
          className={`rounded-2xl border-l-4 border-accent bg-accent/8 p-7 flex gap-4 items-start ${
            inView ? "animate-fade-up delay-300" : "opacity-0"
          }`}
        >
          <span className="text-3xl shrink-0">💬</span>
          <p className="font-body text-foreground/80 leading-relaxed text-base">
            <strong className="font-display font-bold text-foreground">
              Every action counts.
            </strong>{" "}
            Whether you give an hour or a dollar, you're helping someone breathe
            easier.
          </p>
        </div>
      </div>
    </section>
  );
}
