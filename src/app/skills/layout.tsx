import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Skills Hub — ClawVerse",
  description:
    "Search and discover 5,705+ OpenClaw skills from ClawHub, GitHub, and Community. Security verified with 5-tier rating system.",
};

export default function SkillsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
