import { NextRequest, NextResponse } from "next/server";
import { createSubmission } from "@/lib/data/submissions";
import { rateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/email/client";
import { submissionConfirmation, securityAlert } from "@/lib/email/templates";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rl = rateLimit(`submit:${ip}`, RATE_LIMITS.submit);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  try {
    const body = await request.json();

    if (!body.type || !body.name) {
      return NextResponse.json(
        { error: "type and name are required" },
        { status: 400 }
      );
    }

    const validTypes = ["skill", "project", "deploy", "security_report"];
    if (!validTypes.includes(body.type)) {
      return NextResponse.json(
        { error: `type must be one of: ${validTypes.join(", ")}` },
        { status: 400 }
      );
    }

    if (body.type === "security_report" && !body.description) {
      return NextResponse.json(
        { error: "description is required for security reports" },
        { status: 400 }
      );
    }

    const result = await createSubmission({
      type: body.type,
      name: body.name,
      url: body.url,
      description: body.description,
      category: body.category,
      severity: body.severity,
      submitted_by: body.email,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    // Send confirmation email to submitter
    if (body.email) {
      const { subject, html } = submissionConfirmation(body.name, body.type);
      sendEmail({ to: body.email, subject, html }).catch(() => {});
    }

    // Critical/High security reports: notify admin immediately
    if (
      body.type === "security_report" &&
      body.severity &&
      ["critical", "high"].includes(body.severity.toLowerCase())
    ) {
      const adminEmail = process.env.ADMIN_EMAIL;
      if (adminEmail) {
        const { subject, html } = securityAlert(
          body.name,
          body.severity,
          body.description || "No description provided"
        );
        sendEmail({ to: adminEmail, subject, html }).catch(() => {});
      }
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
