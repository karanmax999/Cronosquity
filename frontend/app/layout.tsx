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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-background text-foreground relative min-h-screen pt-16`} suppressHydrationWarning>
        {/* Universe Background Effects - Adjusted for Light/Dark */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/5 blur-[150px] rounded-full animate-pulse-slow" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-glow-blue/5 blur-[150px] rounded-full animate-pulse-slow delay-1000" />
        </div>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
