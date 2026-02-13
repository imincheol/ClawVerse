import { NextRequest, NextResponse } from "next/server";
import {
  getSubmissions,
  getSubmissionById,
  updateSubmissionStatus,
  processApprovedSubmission,
} from "@/lib/data/submissions";
import { rateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";
import { guardMutationRequest } from "@/lib/security/request-guard";
import { sendEmail } from "@/lib/email/client";
import { submissionApproved, submissionRejected } from "@/lib/email/templates";

let supabaseModule: typeof import("@/lib/supabase/server") | null = null;

async function getSupabase() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  if (!supabaseModule) {
    supabaseModule = await import("@/lib/supabase/server");
  }
  try {
    return await supabaseModule.createServerSupabaseClient();
  } catch {
    return null;
  }
}

async function isAdmin() {
  const supabase = await getSupabase();
  if (!supabase) return false;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  if (adminEmails.length === 0) return false;
  return adminEmails.includes(user.email?.toLowerCase() || "");
}

export async function GET(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const status = request.nextUrl.searchParams.get("status") || "pending";
  const submissions = await getSubmissions(status);

  return NextResponse.json({ submissions, count: submissions.length });
}

export async function PATCH(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const guard = await guardMutationRequest(request, { requireCsrf: true });
  if (guard) return guard;

  const ip = getClientIp(request);
  const rl = await rateLimit(`admin-submissions:${ip}`, RATE_LIMITS.adminWrite);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  try {
    const body = await request.json();

    if (!body.id || !body.status) {
      return NextResponse.json(
        { error: "id and status are required" },
        { status: 400 }
      );
    }

    if (!["approved", "rejected"].includes(body.status)) {
      return NextResponse.json(
        { error: "status must be approved or rejected" },
        { status: 400 }
      );
    }

    const submission = await getSubmissionById(body.id);
    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    const result = await updateSubmissionStatus(body.id, body.status);
    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to update submission" }, { status: 500 });
    }

    if (body.status === "approved") {
      const processResult = await processApprovedSubmission(submission);
      if (!processResult.success) {
        console.error(
          `[Admin] Failed to process approved submission ${body.id}:`,
          processResult.error
        );
      }

      if (submission.submitted_email) {
        const { subject, html } = submissionApproved(submission.name, submission.type);
        sendEmail({ to: submission.submitted_email, subject, html }).catch(() => {});
      }
    } else if (body.status === "rejected") {
      if (submission.submitted_email) {
        const { subject, html } = submissionRejected(
          submission.name,
          submission.type,
          body.reason
        );
        sendEmail({ to: submission.submitted_email, subject, html }).catch(() => {});
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
