import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata(
  "Profile",
  "Your ClawVerse profile — reviews, stacks, and activity.",
  "/profile",
);

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
