import { NextRequest, NextResponse } from "next/server";
import { getPlugins } from "@/lib/data/plugins";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const plugins = await getPlugins({
    search: searchParams.get("search") || undefined,
    type: searchParams.get("type") || undefined,
    source: searchParams.get("source") || undefined,
    security: searchParams.get("security") || undefined,
    sort: searchParams.get("sort") || undefined,
    limit: searchParams.has("limit") ? Number(searchParams.get("limit")) : undefined,
    offset: searchParams.has("offset") ? Number(searchParams.get("offset")) : undefined,
  });

  return NextResponse.json({ plugins, count: plugins.length });
}
