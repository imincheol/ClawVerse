import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata(
  "Submit",
  "Submit skills, projects, deploy services, or report security issues to ClawVerse.",
  "/submit",
);

export default function SubmitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
