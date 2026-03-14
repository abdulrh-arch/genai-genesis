import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MailForge — Zero-Hallucination Cold Email AI",
  description:
    "AI-powered cold email orchestrator for tech internship hunters. Personalized, verified, and sent straight to your Gmail drafts.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
