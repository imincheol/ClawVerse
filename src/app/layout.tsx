import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StarField from "@/components/StarField";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://clawverse.io",
  ),
  title: "ClawVerse — Every Claw. One Universe.",
  description:
    "Discover, share, and connect every project built on the OpenClaw universe. Skills Hub, Deploy comparison, Project Directory, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
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
