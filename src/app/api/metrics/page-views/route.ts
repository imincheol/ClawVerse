import { NextRequest, NextResponse } from "next/server";
import { getPageViewStatsForPath } from "@/lib/data/metrics";

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path") || "/";
  const days = request.nextUrl.searchParams.get("days");

  const stats = await getPageViewStatsForPath(path, days ? Number(days) : 30);
  return NextResponse.json(stats);
}
