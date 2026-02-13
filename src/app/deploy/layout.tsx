import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata(
  "Deploy Hub",
  "Compare 10+ OpenClaw deployment options. Find the right method for your needs — from one-click to self-hosted.",
  "/deploy",
);

export default function DeployLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
