import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { scanUnreviewedSkills } from "@/lib/integrations/virustotal";
import { verifyCronRequest } from "@/lib/security/cron-signature";

export async function POST(request: NextRequest) {
  const authorized = await verifyCronRequest(request, "/api/cron/virustotal-scan");
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "Missing Supabase config" }, { status: 500 });
  }

  if (!process.env.VIRUSTOTAL_API_KEY) {
    return NextResponse.json({ error: "Missing VirusTotal API key" }, { status: 500 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const result = await scanUnreviewedSkills(supabase);

  return NextResponse.json({
    success: true,
    ...result,
    timestamp: new Date().toISOString(),
  });
}
