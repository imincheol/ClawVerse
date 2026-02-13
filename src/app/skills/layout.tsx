import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata(
  "Skills Hub",
  "Search and discover 5,705+ OpenClaw skills from ClawHub, GitHub, and Community. Security verified with 5-tier rating system.",
  "/skills",
);

export default function SkillsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
