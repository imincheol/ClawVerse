import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata(
  "About",
  "ClawVerse.io is a meta-platform for the OpenClaw ecosystem. Aggregate, verify, categorize, and connect.",
  "/about",
);

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
