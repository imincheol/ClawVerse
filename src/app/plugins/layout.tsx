import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata(
  "Plugins",
  "OpenClaw plugins — channels, tools, AI providers, and memory backends. Extend your agent with 20+ verified plugins.",
  "/plugins",
);

export default function PluginsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
