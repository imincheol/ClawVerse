import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata(
  "Project Directory",
  "The complete OpenClaw ecosystem map. 26+ projects from core to experimental layers.",
  "/projects",
);

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
