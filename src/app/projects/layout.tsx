import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Directory — ClawVerse",
  description:
    "The complete OpenClaw ecosystem map. 26+ projects from core to experimental layers.",
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
