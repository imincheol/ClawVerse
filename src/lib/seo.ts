import type { Metadata } from "next";

const SITE_NAME = "ClawVerse";
const SITE_URL = "https://clawverse.io";
const SITE_DESC =
  "Discover, share, and connect every project built on the OpenClaw universe.";

export function generatePageMetadata(
  title: string,
  description?: string,
  path?: string,
): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const desc = description ?? SITE_DESC;
  const url = path ? `${SITE_URL}${path}` : SITE_URL;

  return {
    title: fullTitle,
    description: desc,
    openGraph: {
      title: fullTitle,
      description: desc,
      url,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
    },
  };
}
