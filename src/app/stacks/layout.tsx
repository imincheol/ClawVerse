import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata(
  "Stacks",
  "Curated collections of skills and projects from the OpenClaw ecosystem.",
  "/stacks",
);

export default function StacksLayout({ children }: { children: React.ReactNode }) {
  return children;
}
