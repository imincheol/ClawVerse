import { NextRequest, NextResponse } from "next/server";
import { getProjects } from "@/lib/data/projects";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const result = await getProjects({
    search: searchParams.get("search") || undefined,
    layer: searchParams.get("layer") || undefined,
    status: searchParams.get("status") || undefined,
    sort: searchParams.get("sort") || undefined,
    page: Number(searchParams.get("page") || "1"),
    limit: Number(searchParams.get("limit") || "20"),
  });

  return NextResponse.json(result);
}
