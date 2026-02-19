import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata(
  "MCP Servers",
  "Discover MCP (Model Context Protocol) servers from Official Registry, MCP.so, Smithery, Glama, and more. 30+ servers aggregated with security ratings.",
  "/mcp",
);

export default function McpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
