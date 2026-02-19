"use client";

import { useState, useCallback } from "react";
import { CATEGORIES } from "@/data/skills";
import { LAYERS } from "@/data/projects";
import { AGENT_ROLES } from "@/data/agents";

type SubmitType = "skill" | "agent" | "project" | "deploy" | "report";

const SUBMIT_TYPES: { value: SubmitType; label: string }[] = [
  { value: "skill", label: "Skill" },
  { value: "agent", label: "Agent Template" },
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

function isValidUrl(str: string): boolean {
  try {
    const url = new URL(str);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

type FieldErrors = Partial<Record<string, string>>;

function validate(type: SubmitType, formData: { name: string; url: string; desc: string; category: string; severity: string }): FieldErrors {
  const errors: FieldErrors = {};

  if (!formData.name.trim()) {
    errors.name = "Name is required";
  } else if (formData.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  if (type !== "report" && !formData.url.trim()) {
    errors.url = "URL is required";
  } else if (formData.url.trim() && !isValidUrl(formData.url.trim())) {
    errors.url = "Please enter a valid URL (https://...)";
  }

  if (type === "report" && !formData.desc.trim()) {
    errors.desc = "Description is required for security reports";
  }

  if (type === "report" && !formData.severity) {
    errors.severity = "Severity is required for security reports";
  }

  return errors;
}

export default function SubmitPage() {
  const [type, setType] = useState<SubmitType>("skill");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    desc: "",
    category: "",
    severity: "",
  });

  const update = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field error on change
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const markTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = useCallback(async () => {
    const errors = validate(type, formData);
    setFieldErrors(errors);
    // Mark all fields as touched
    setTouched({ name: true, url: true, desc: true, severity: true });

    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: type === "report" ? "security_report" : type,
          name: formData.name.trim(),
          url: formData.url.trim() || undefined,
          description: formData.desc.trim() || undefined,
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
  }, [type, formData]);

  if (submitted) {
    return (
      <div className="mx-auto max-w-md py-20 text-center">
        <div className="mb-4 text-5xl">&#x1F99E;</div>
        <h2 className="font-display mb-2 text-xl font-bold text-text-primary">
          Submitted!
        </h2>
        <p className="mb-6 text-sm text-text-secondary">
          Your submission will be reviewed and added to ClawVerse. Thank you!
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setFormData({ name: "", url: "", desc: "", category: "", severity: "" });
            setFieldErrors({});
            setTouched({});
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

  const showError = (field: string) => touched[field] && fieldErrors[field];

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-7">
        <h1 className="font-display mb-1.5 text-[28px] font-bold">
          Submit to ClawVerse
        </h1>
        <p className="text-sm text-text-secondary">
          Help us grow the ecosystem. Submit skills, agent templates, projects,
          deploy services, or report security issues.
        </p>
      </div>

      {/* Type Tabs */}
      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Submission type">
        {SUBMIT_TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => {
              setType(t.value);
              setFieldErrors({});
              setTouched({});
            }}
            className={`rounded-lg border px-3.5 py-1.5 text-xs font-medium transition-all ${
              type === t.value
                ? "border-accent-purple/50 bg-accent-purple/15 text-accent-violet"
                : "border-border bg-card text-text-secondary hover:border-border-hover"
            }`}
            aria-pressed={type === t.value}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-[10px] border border-sec-red/20 bg-sec-red/10 px-4 py-2.5 text-[13px] text-[#fca5a5]" role="alert">
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
            onBlur={() => markTouched("name")}
            placeholder={
              type === "report"
                ? "e.g. crypto-wallet-sync"
                : "e.g. my-awesome-skill"
            }
            className={`mt-1.5 w-full rounded-[10px] border px-3.5 py-2.5 text-sm text-text-primary ${
              showError("name")
                ? "border-sec-red/50 bg-sec-red/[0.04]"
                : "border-border bg-card"
            }`}
            aria-invalid={!!showError("name")}
            aria-describedby={showError("name") ? "name-error" : undefined}
          />
          {showError("name") && (
            <span id="name-error" className="mt-1 block text-[12px] text-[#fca5a5]" role="alert">
              {fieldErrors.name}
            </span>
          )}
        </label>

        <label className="text-[13px] text-text-secondary">
          URL (GitHub / Website) {type !== "report" && "*"}
          <input
            value={formData.url}
            onChange={(e) => update("url", e.target.value)}
            onBlur={() => markTouched("url")}
            placeholder="https://github.com/..."
            className={`mt-1.5 w-full rounded-[10px] border px-3.5 py-2.5 text-sm text-text-primary ${
              showError("url")
                ? "border-sec-red/50 bg-sec-red/[0.04]"
                : "border-border bg-card"
            }`}
            aria-invalid={!!showError("url")}
            aria-describedby={showError("url") ? "url-error" : undefined}
          />
          {showError("url") && (
            <span id="url-error" className="mt-1 block text-[12px] text-[#fca5a5]" role="alert">
              {fieldErrors.url}
            </span>
          )}
        </label>

        <label className="text-[13px] text-text-secondary">
          {type === "report" ? "Report reason *" : "Description"}
          <textarea
            value={formData.desc}
            onChange={(e) => update("desc", e.target.value)}
            onBlur={() => markTouched("desc")}
            placeholder={
              type === "report"
                ? "What security issue have you found? (API key theft, malicious code, etc.)"
                : "Brief description"
            }
            rows={3}
            className={`mt-1.5 w-full resize-vertical rounded-[10px] border px-3.5 py-2.5 font-[inherit] text-sm text-text-primary ${
              showError("desc")
                ? "border-sec-red/50 bg-sec-red/[0.04]"
                : "border-border bg-card"
            }`}
            aria-invalid={!!showError("desc")}
            aria-describedby={showError("desc") ? "desc-error" : undefined}
          />
          {showError("desc") && (
            <span id="desc-error" className="mt-1 block text-[12px] text-[#fca5a5]" role="alert">
              {fieldErrors.desc}
            </span>
          )}
        </label>

        {type !== "report" && (
          <label className="text-[13px] text-text-secondary">
            {type === "agent" ? "Role" : "Category"}
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
                : type === "agent"
                  ? AGENT_ROLES.filter((r) => r.id !== "all").map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.label}
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
            Severity *
            <select
              value={formData.severity}
              onChange={(e) => update("severity", e.target.value)}
              onBlur={() => markTouched("severity")}
              className={`mt-1.5 w-full rounded-[10px] border px-3.5 py-2.5 text-sm text-text-primary ${
                showError("severity")
                  ? "border-sec-red/50 bg-sec-red/[0.04]"
                  : "border-border bg-void"
              }`}
              aria-invalid={!!showError("severity")}
              aria-describedby={showError("severity") ? "severity-error" : undefined}
            >
              <option value="">Select...</option>
              {SEVERITY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {showError("severity") && (
              <span id="severity-error" className="mt-1 block text-[12px] text-[#fca5a5]" role="alert">
                {fieldErrors.severity}
              </span>
            )}
          </label>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitting}
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
