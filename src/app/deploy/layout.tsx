import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deploy Hub — ClawVerse",
  description:
    "Compare 10+ OpenClaw deployment options. Find the right method for your needs — from one-click to self-hosted.",
};

export default function DeployLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
