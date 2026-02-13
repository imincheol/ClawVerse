"use client";

import { useState } from "react";
import Link from "next/link";
import { DEPLOY_OPTIONS } from "@/data/deploy";

interface Question {
  question: string;
  options: { label: string; scores: Record<string, number> }[];
}

const QUESTIONS: Question[] = [
  {
    question: "What is your technical skill level?",
    options: [
      { label: "Non-developer (no coding experience)", scores: { simpleclaw: 3, easyclaw: 3, clawnest: 2 } },
      { label: "Beginner (basic terminal/CLI usage)", scores: { clawnest: 3, clawstack: 2, digitalocean: 2, kuberns: 2 } },
      { label: "Intermediate (comfortable with servers)", scores: { digitalocean: 3, kuberns: 3, moltworker: 2, nanoclaw: 1 } },
      { label: "Advanced (DevOps/infrastructure experience)", scores: { docker: 3, "local-install": 3, moltworker: 2, nanoclaw: 2 } },
    ],
  },
  {
    question: "What is your budget?",
    options: [
      { label: "Free only", scores: { "local-install": 3, nanoclaw: 3, docker: 2 } },
      { label: "Under $10/month", scores: { moltworker: 3, easyclaw: 2, simpleclaw: 2 } },
      { label: "$10-50/month", scores: { digitalocean: 3, clawnest: 2, kuberns: 2, clawstack: 2 } },
      { label: "Budget is not a concern", scores: { digitalocean: 3, clawnest: 3, simpleclaw: 2, easyclaw: 2 } },
    ],
  },
  {
    question: "How important is security to you?",
    options: [
      { label: "Maximum security is critical", scores: { nanoclaw: 3, clawnest: 2, digitalocean: 2 } },
      { label: "Important but not the top priority", scores: { digitalocean: 2, moltworker: 2, clawnest: 2 } },
      { label: "Standard security is fine", scores: { simpleclaw: 2, easyclaw: 2, kuberns: 2, clawstack: 2 } },
    ],
  },
  {
    question: "What is your primary use case?",
    options: [
      { label: "Personal/hobby project", scores: { simpleclaw: 2, "local-install": 3, nanoclaw: 2 } },
      { label: "Production deployment (always online)", scores: { digitalocean: 3, kuberns: 2, moltworker: 2 } },
      { label: "Multi-channel (WhatsApp, Telegram, etc.)", scores: { clawstack: 3, easyclaw: 3 } },
      { label: "Development and testing", scores: { "local-install": 3, docker: 3 } },
    ],
  },
  {
    question: "How quickly do you need to deploy?",
    options: [
      { label: "Right now (under 5 minutes)", scores: { simpleclaw: 3, easyclaw: 3, clawnest: 2 } },
      { label: "Within an hour", scores: { digitalocean: 2, kuberns: 2, clawstack: 2, moltworker: 2 } },
      { label: "I can spend a few hours setting up", scores: { docker: 2, "local-install": 2, nanoclaw: 2, moltworker: 2 } },
    ],
  },
];

export default function DeployQuizPage() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);

    if (currentQ + 1 < QUESTIONS.length) {
      setCurrentQ(currentQ + 1);
    } else {
      setShowResults(true);
    }
  };

  const getResults = () => {
    const scoreMap: Record<string, number> = {};
    answers.forEach((ansIdx, qIdx) => {
      const scores = QUESTIONS[qIdx].options[ansIdx]?.scores || {};
      for (const [slug, score] of Object.entries(scores)) {
        scoreMap[slug] = (scoreMap[slug] || 0) + score;
      }
    });

    return DEPLOY_OPTIONS
      .map((opt) => ({ ...opt, score: scoreMap[opt.slug] || 0 }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  };

  const restart = () => {
    setCurrentQ(0);
    setAnswers([]);
    setShowResults(false);
  };

  if (showResults) {
    const results = getResults();
    return (
      <div className="mx-auto max-w-2xl">
        <h1
          className="font-display mb-2 text-[28px] font-bold"
        >
          Your Results
        </h1>
        <p className="mb-6 text-sm text-text-secondary">
          Based on your answers, here are your top 3 recommended deployment
          options.
        </p>

        <div className="flex flex-col gap-4">
          {results.map((opt, i) => (
            <Link
              key={opt.id}
              href={`/deploy/${opt.slug}`}
              className="rounded-2xl border border-border bg-card p-5 no-underline transition-all hover:-translate-y-0.5 hover:border-accent-purple/40"
            >
              <div className="mb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold"
                    style={{
                      background:
                        i === 0
                          ? "rgba(139,92,246,0.2)"
                          : "rgba(255,255,255,0.06)",
                      color: i === 0 ? "#c084fc" : "#94a3b8",
                    }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-base font-bold text-text-primary">
                    {opt.name}
                  </span>
                </div>
                <span className="text-xs text-accent-purple">
                  {"★".repeat(opt.level)}
                </span>
              </div>
              <p className="mb-2 text-[13px] text-text-secondary">{opt.desc}</p>
              <div className="flex flex-wrap gap-3 text-xs text-text-muted">
                <span>
                  Cost: <span className="text-text-primary">{opt.cost}</span>
                </span>
                <span>
                  Setup: <span className="text-text-primary">{opt.setup}</span>
                </span>
                <span>
                  Security:{" "}
                  <span className="text-text-primary">{opt.security}</span>
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={restart}
            className="rounded-xl border border-border px-5 py-2 text-[13px] text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary"
          >
            Retake Quiz
          </button>
          <Link
            href="/deploy"
            className="rounded-xl border border-accent-purple/40 bg-accent-purple/10 px-5 py-2 text-[13px] text-accent-violet no-underline transition-colors hover:bg-accent-purple/20"
          >
            View all options →
          </Link>
        </div>
      </div>
    );
  }

  const q = QUESTIONS[currentQ];

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/deploy"
        className="mb-6 inline-block text-sm text-text-muted no-underline hover:text-text-secondary"
      >
        ← Back to Deploy Hub
      </Link>

      <h1
        className="font-display mb-2 text-[28px] font-bold"
      >
        Find Your Deploy Method
      </h1>
      <p className="mb-8 text-sm text-text-secondary">
        Answer {QUESTIONS.length} quick questions and we&apos;ll recommend the
        best deployment option for you.
      </p>

      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex justify-between text-xs text-text-muted">
          <span>
            Question {currentQ + 1} of {QUESTIONS.length}
          </span>
          <span>
            {Math.round(((currentQ + 1) / QUESTIONS.length) * 100)}%
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${((currentQ + 1) / QUESTIONS.length) * 100}%`,
              background: "linear-gradient(135deg, #8b5cf6, #f97316)",
            }}
          />
        </div>
      </div>

      {/* Question */}
      <h2 className="mb-5 text-lg font-semibold text-text-primary">
        {q.question}
      </h2>

      <div className="flex flex-col gap-2.5">
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(i)}
            className="rounded-[14px] border border-border bg-card px-5 py-3.5 text-left text-[14px] text-text-secondary transition-all hover:-translate-y-0.5 hover:border-accent-purple/40 hover:text-text-primary"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
