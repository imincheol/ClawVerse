"use client";

import { useState } from "react";
import { CATEGORIES } from "@/data/skills";
import { LAYERS } from "@/data/projects";

type SubmitType = "skill" | "project" | "deploy" | "report";

const SUBMIT_TYPES: { value: SubmitType; label: string }[] = [
  { value: "skill", label: "Skill" },
  { value: "project", label: "Project" },
  { value: "deploy", label: "Deploy Service" },
  { value: "report", label: "Security Report" },
];

const SEVERITY_OPTIONS = [
  { value: "low", label: "Low — Suspicious behavior" },
  { value: "medium", label: "Medium — Unnecessary permission requests" },
  { value: "high", label: "High — Suspected API key/password theft" },
  { value: "critical", label: "Critical — Confirmed malicious code" },
];

export default function SubmitPage() {
  const [type, setType] = useState<SubmitType>("skill");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    desc: "",
    category: "",
    severity: "",
  });

  const update = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: type === "report" ? "security_report" : type,
          name: formData.name,
          url: formData.url || undefined,
          description: formData.desc || undefined,
          category: formData.category || undefined,
          severity: type === "report" ? formData.severity || undefined : undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Submission failed");
      } else {
        setSubmitted(true);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-md py-20 text-center">
        <div className="mb-4 text-5xl">&#x1F99E;</div>
        <h2
          className="font-display mb-2 text-xl font-bold text-text-primary"
        >
          Submitted!
        </h2>
        <p className="mb-6 text-sm text-text-secondary">
          Your submission will be reviewed and added to ClawVerse. Thank you!
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setFormData({ name: "", url: "", desc: "", category: "", severity: "" });
          }}
          className="rounded-xl border-none px-8 py-2.5 font-semibold text-white"
          style={{
            background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
          }}
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-7">
        <h1
          className="font-display mb-1.5 text-[28px] font-bold"
        >
          Submit to ClawVerse
        </h1>
        <p className="text-sm text-text-secondary">
          Help us grow the ecosystem. Submit skills, projects, deploy services,
          or report security issues.
        </p>
      </div>

      {/* Type Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {SUBMIT_TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => setType(t.value)}
            className={`rounded-lg border px-3.5 py-1.5 text-xs font-medium transition-all ${
              type === t.value
                ? "border-accent-purple/50 bg-accent-purple/15 text-accent-violet"
                : "border-border bg-card text-text-secondary hover:border-border-hover"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-[10px] border border-sec-red/20 bg-sec-red/10 px-4 py-2.5 text-[13px] text-[#fca5a5]">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="flex flex-col gap-4">
        <label className="text-[13px] text-text-secondary">
          {type === "report" ? "Target skill/project name" : "Name"} *
          <input
            value={formData.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder={
              type === "report"
                ? "e.g. crypto-wallet-sync"
                : "e.g. my-awesome-skill"
            }
            className="mt-1.5 w-full rounded-[10px] border border-border bg-card px-3.5 py-2.5 text-sm text-text-primary"
          />
        </label>

        <label className="text-[13px] text-text-secondary">
          URL (GitHub / Website) {type !== "report" && "*"}
          <input
            value={formData.url}
            onChange={(e) => update("url", e.target.value)}
            placeholder="https://github.com/..."
            className="mt-1.5 w-full rounded-[10px] border border-border bg-card px-3.5 py-2.5 text-sm text-text-primary"
          />
        </label>

        <label className="text-[13px] text-text-secondary">
          {type === "report" ? "Report reason *" : "Description"}
          <textarea
            value={formData.desc}
            onChange={(e) => update("desc", e.target.value)}
            placeholder={
              type === "report"
                ? "What security issue have you found? (API key theft, malicious code, etc.)"
                : "Brief description"
            }
            rows={3}
            className="mt-1.5 w-full resize-vertical rounded-[10px] border border-border bg-card px-3.5 py-2.5 font-[inherit] text-sm text-text-primary"
          />
        </label>

        {type !== "report" && (
          <label className="text-[13px] text-text-secondary">
            Category
            <select
              value={formData.category}
              onChange={(e) => update("category", e.target.value)}
              className="mt-1.5 w-full rounded-[10px] border border-border bg-void px-3.5 py-2.5 text-sm text-text-primary"
            >
              <option value="">Select...</option>
              {type === "project"
                ? Object.entries(LAYERS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.label}
                    </option>
                  ))
                : CATEGORIES.filter((c) => c.id !== "all").map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
            </select>
          </label>
        )}

        {type === "report" && (
          <label className="text-[13px] text-text-secondary">
            Severity
            <select
              value={formData.severity}
              onChange={(e) => update("severity", e.target.value)}
              className="mt-1.5 w-full rounded-[10px] border border-border bg-void px-3.5 py-2.5 text-sm text-text-primary"
            >
              <option value="">Select...</option>
              {SEVERITY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitting || !formData.name}
        className="mt-6 w-full rounded-xl border-none py-3 text-[15px] font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        style={{
          background:
            type === "report"
              ? "linear-gradient(135deg, #ef4444, #dc2626)"
              : "linear-gradient(135deg, #8b5cf6, #6366f1)",
        }}
      >
        {submitting
          ? "Submitting..."
          : type === "report"
          ? "Submit Security Report"
          : "Submit"}
      </button>
    </div>
  );
}
