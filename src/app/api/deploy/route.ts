import { NextRequest, NextResponse } from "next/server";
import { getDeployOptions } from "@/lib/data/deploy";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const levelParam = searchParams.get("level");
  const level = levelParam && levelParam !== "all" ? Number(levelParam) : undefined;
  const result = await getDeployOptions({
    search: searchParams.get("search") || undefined,
    level,
    security: searchParams.get("security") || undefined,
    sort: searchParams.get("sort") || undefined,
    page: Number(searchParams.get("page") || "1"),
    limit: Number(searchParams.get("limit") || "20"),
  });

  return NextResponse.json(result);
}
