import { NextRequest, NextResponse } from "next/server";
import { getMcpServers } from "@/lib/data/mcp-servers";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const servers = await getMcpServers({
    search: searchParams.get("search") || undefined,
    category: searchParams.get("category") || undefined,
    source: searchParams.get("source") || undefined,
    security: searchParams.get("security") || undefined,
    sort: searchParams.get("sort") || undefined,
    limit: searchParams.has("limit") ? Number(searchParams.get("limit")) : undefined,
    offset: searchParams.has("offset") ? Number(searchParams.get("offset")) : undefined,
  });

  return NextResponse.json({ servers, count: servers.length });
}
