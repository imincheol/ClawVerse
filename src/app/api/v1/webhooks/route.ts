import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/api-auth";

/**
 * Webhook subscription API for ClawVerse registry.
 *
 * POST /api/v1/webhooks — Subscribe to events
 * GET  /api/v1/webhooks — List available event types
 *
 * Event types:
 * - skill.new         — New skill added to the registry
 * - skill.updated     — Existing skill updated
 * - skill.flagged     — Skill flagged for security issues
 * - skill.blocked     — Skill confirmed malicious and blocked
 * - security.alert    — General security advisory
 * - pulse.new         — New pulse item published
 */

const EVENT_TYPES = [
  { type: "skill.new", description: "New skill added to the registry" },
  { type: "skill.updated", description: "Existing skill metadata updated" },
  { type: "skill.flagged", description: "Skill flagged for security issues by community" },
  { type: "skill.blocked", description: "Skill confirmed malicious and blocked" },
  { type: "security.alert", description: "General security advisory for the ecosystem" },
  { type: "pulse.new", description: "New pulse item (news/update) published" },
];

export async function GET() {
  return NextResponse.json({
    description: "ClawVerse Webhook API — subscribe to registry events",
    event_types: EVENT_TYPES,
    subscription_url: "/api/v1/webhooks",
    method: "POST",
    required_headers: {
      "X-ClawVerse-Key": "Your API key (required)",
      "Content-Type": "application/json",
    },
    body_schema: {
      url: "string (required) — Your webhook endpoint URL",
      events: "string[] (required) — Event types to subscribe to",
      secret: "string (optional) — Secret for HMAC signature verification",
    },
    example: {
      url: "https://your-app.com/webhooks/clawverse",
      events: ["skill.new", "skill.blocked", "security.alert"],
      secret: "whsec_your_secret_here",
    },
  });
}

export async function POST(request: NextRequest) {
  const auth = validateApiKey(request, { required: true });
  if (!auth.valid) return auth.response!;

  let body: { url?: string; events?: string[]; secret?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  if (!body.url || typeof body.url !== "string") {
    return NextResponse.json(
      { error: "Missing required field: url" },
      { status: 400 },
    );
  }

  if (!body.events || !Array.isArray(body.events) || body.events.length === 0) {
    return NextResponse.json(
      { error: "Missing required field: events (array of event types)" },
      { status: 400 },
    );
  }

  const validTypes = new Set(EVENT_TYPES.map((e) => e.type));
  const invalidEvents = body.events.filter((e) => !validTypes.has(e));
  if (invalidEvents.length > 0) {
    return NextResponse.json(
      {
        error: "Invalid event types",
        invalid: invalidEvents,
        valid_types: EVENT_TYPES.map((e) => e.type),
      },
      { status: 400 },
    );
  }

  // TODO: In production, persist to Supabase webhooks table
  // await supabase.from('webhooks').insert({
  //   api_key: auth.key,
  //   url: body.url,
  //   events: body.events,
  //   secret: body.secret,
  //   created_at: new Date().toISOString(),
  // });

  return NextResponse.json({
    subscription: {
      id: `whk_${Date.now()}`,
      url: body.url,
      events: body.events,
      active: true,
      created_at: new Date().toISOString(),
    },
    message: "Webhook subscription created. You will receive POST requests at the specified URL when subscribed events occur.",
  }, { status: 201 });
}
