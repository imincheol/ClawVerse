import { NextRequest, NextResponse } from "next/server";
import { getSkills } from "@/lib/data/skills";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const skills = await getSkills({
    search: searchParams.get("search") || undefined,
    security: searchParams.get("security") || undefined,
    category: searchParams.get("category") || undefined,
    source: searchParams.get("source") || undefined,
    sort: searchParams.get("sort") || undefined,
    limit: searchParams.has("limit") ? Number(searchParams.get("limit")) : undefined,
    offset: searchParams.has("offset") ? Number(searchParams.get("offset")) : undefined,
  });

  return NextResponse.json({ skills, count: skills.length });
}
