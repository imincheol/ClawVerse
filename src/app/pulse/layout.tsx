import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pulse — ClawVerse",
  description:
    "OpenClaw ecosystem news, trends, and security alerts. Stay updated on the latest developments.",
};

export default function PulseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
