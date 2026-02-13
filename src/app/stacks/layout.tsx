import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stacks — ClawVerse",
  description: "Curated collections of skills and projects from the OpenClaw ecosystem.",
};

export default function StacksLayout({ children }: { children: React.ReactNode }) {
  return children;
}
