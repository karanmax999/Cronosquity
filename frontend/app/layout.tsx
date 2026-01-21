import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Croquity Treasury Steward",
  description: "Governance and Treasury Management",
};

import { Providers } from "./providers";
import { Navbar } from "@/components/Navbar";
import { Boxes } from "@/components/ui/BackgroundBoxes";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-background text-foreground relative min-h-screen pt-16`} suppressHydrationWarning>
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <Boxes />
        </div>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
