import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata(
  "Pulse — News & Trends",
  "OpenClaw ecosystem news, trends, and security alerts. Aggregated from OpenClaw GitHub, ClawHub, OWASP, and more.",
  "/pulse",
);

export default function PulseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
