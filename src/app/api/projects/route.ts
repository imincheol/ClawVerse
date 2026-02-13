import { NextRequest, NextResponse } from "next/server";
import { getProjects } from "@/lib/data/projects";

export async function GET(request: NextRequest) {
  const layer = request.nextUrl.searchParams.get("layer") || undefined;
  const projects = await getProjects(layer);

  return NextResponse.json({ projects, count: projects.length });
}
