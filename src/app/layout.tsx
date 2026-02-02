import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Process Bot | Premium Operational Assistant",
  description: "Advanced RAG-based AI assistant for bưu cục operations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ margin: 0 }} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
