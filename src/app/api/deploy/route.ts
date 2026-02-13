import { NextRequest, NextResponse } from "next/server";
import { getDeployOptions } from "@/lib/data/deploy";

export async function GET(request: NextRequest) {
  const levelParam = request.nextUrl.searchParams.get("level");
  const level = levelParam ? Number(levelParam) : undefined;
  const options = await getDeployOptions(level);

  return NextResponse.json({ options, count: options.length });
}
