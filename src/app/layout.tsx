import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Connection Ladder — Build Social Skills Safely",
  description:
    "A gamified app helping people experiencing loneliness and social anxiety build social skills step by step.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {/* Skip to main content — accessibility requirement */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <main id="main-content" role="main" tabIndex={-1} className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
