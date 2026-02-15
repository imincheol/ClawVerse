import { NextRequest, NextResponse } from "next/server";
import { getProjectGrowthBySlug } from "@/lib/data/metrics";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      slug: string;
    }>;
  }
) {
  const { slug } = await params;
  const days = request.nextUrl.searchParams.get("days");
  const data = await getProjectGrowthBySlug(slug, days ? Number(days) : 30);
  return NextResponse.json({ slug, growth: data });
}
