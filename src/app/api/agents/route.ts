import { NextRequest, NextResponse } from "next/server";
import { getAgents } from "@/lib/data/agents";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const agents = await getAgents({
    search: searchParams.get("search") || undefined,
    type: searchParams.get("type") || undefined,
    role: searchParams.get("role") || undefined,
    framework: searchParams.get("framework") || undefined,
    security: searchParams.get("security") || undefined,
    sort: searchParams.get("sort") || undefined,
    limit: searchParams.has("limit") ? Number(searchParams.get("limit")) : undefined,
    offset: searchParams.has("offset") ? Number(searchParams.get("offset")) : undefined,
  });

  return NextResponse.json({ agents, count: agents.length });
}
