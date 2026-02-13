import { NextRequest, NextResponse } from "next/server";
import { getClientIp, rateLimit, RATE_LIMITS } from "@/lib/rate-limit";

type LegacyCspReport = {
  "document-uri"?: unknown;
  "violated-directive"?: unknown;
  "effective-directive"?: unknown;
  "blocked-uri"?: unknown;
  disposition?: unknown;
  "source-file"?: unknown;
  "line-number"?: unknown;
  "column-number"?: unknown;
  "status-code"?: unknown;
};

type ReportToPayload = {
  type?: unknown;
  url?: unknown;
  body?: LegacyCspReport;
};

type NormalizedReport = {
  type: string;
  documentUri?: string;
  violatedDirective?: string;
  blockedUri?: string;
  sourceFile?: string;
  lineNumber?: number;
  statusCode?: number;
};

function toStringIfPresent(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value.slice(0, 512) : undefined;
}

function toNumberIfPresent(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function fromLegacyReport(report: LegacyCspReport): NormalizedReport {
  return {
    type: "csp-violation",
    documentUri: toStringIfPresent(report["document-uri"]),
    violatedDirective:
      toStringIfPresent(report["effective-directive"]) ||
      toStringIfPresent(report["violated-directive"]),
    blockedUri: toStringIfPresent(report["blocked-uri"]),
    sourceFile: toStringIfPresent(report["source-file"]),
    lineNumber: toNumberIfPresent(report["line-number"]),
    statusCode: toNumberIfPresent(report["status-code"]),
  };
}

function normalizeReports(payload: unknown): NormalizedReport[] {
  if (!payload || typeof payload !== "object") return [];

  const reports: NormalizedReport[] = [];

  const legacy = (payload as { "csp-report"?: unknown })["csp-report"];
  if (legacy && typeof legacy === "object") {
    reports.push(fromLegacyReport(legacy as LegacyCspReport));
  }

  if (Array.isArray(payload)) {
    for (const item of payload) {
      if (!item || typeof item !== "object") continue;
      const report = item as ReportToPayload;
      if (!report.body || typeof report.body !== "object") continue;
      reports.push({
        ...fromLegacyReport(report.body),
        type: toStringIfPresent(report.type) || "csp-violation",
        documentUri:
          toStringIfPresent(report.url) ||
          fromLegacyReport(report.body).documentUri,
      });
    }
  }

  return reports;
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rl = await rateLimit(`csp-report:${ip}`, RATE_LIMITS.cspReport);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many reports. Please retry later." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const reports = normalizeReports(payload);
  if (reports.length > 0) {
    console.warn(
      "[security] CSP violation report",
      JSON.stringify({
        ip,
        userAgent: request.headers.get("user-agent") || "unknown",
        reports: reports.slice(0, 10),
      })
    );
  }

  return new Response(null, { status: 204 });
}
