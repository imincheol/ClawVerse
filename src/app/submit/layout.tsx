import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit — ClawVerse",
  description:
    "Submit skills, projects, deploy services, or report security issues to ClawVerse.",
};

export default function SubmitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
