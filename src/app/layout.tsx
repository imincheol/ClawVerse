import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans, JetBrains_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StarField from "@/components/StarField";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display-face",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body-face",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-code-face",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://clawverse.io",
  ),
  title: "ClawVerse — Every Claw. One Universe.",
  description:
    "Discover, share, and connect every project built on the OpenClaw universe. Skills Hub, Deploy comparison, Project Directory, and more.",
  other: {
    "color-scheme": "dark",
    "theme-color": "#09090f",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased">
        <StarField />
        <div className="relative z-[1]">
          <Header />
          <main className="mx-auto max-w-[1200px] px-6 py-6 pb-20">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
