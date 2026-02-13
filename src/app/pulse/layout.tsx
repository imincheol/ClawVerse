import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata(
  "Pulse",
  "OpenClaw ecosystem news, trends, and security alerts. Stay updated on the latest developments.",
  "/pulse",
);

export default function PulseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
