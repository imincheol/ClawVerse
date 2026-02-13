import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — ClawVerse",
  description:
    "ClawVerse.io is a meta-platform for the OpenClaw ecosystem. Aggregate, verify, categorize, and connect.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
