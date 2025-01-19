/**
 * Root layout component for the Next.js application.
 * Provides global configuration and metadata.
 *
 * Features:
 * - SEO metadata configuration
 * - Favicon and apple-touch-icon setup
 * - Viewport configuration
 * - Language setting (pt-BR)
 * - Global CSS imports
 */

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shopping List",
  description: "O aplicativo que administra a sua lista de compras.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <title>Lista de Compras</title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
