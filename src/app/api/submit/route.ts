import { NextRequest, NextResponse } from "next/server";
import { createSubmission } from "@/lib/data/submissions";
import { rateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";

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
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
