import { NextRequest, NextResponse } from "next/server";
import { getPulseItems } from "@/lib/data/pulse";

export async function GET(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get("tag") || undefined;
  const items = await getPulseItems(tag);

  return NextResponse.json({ items, count: items.length });
}
