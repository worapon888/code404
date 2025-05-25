// app/layout.tsx
import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// โหลด IBM Plex Mono
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Code404",
  description: "Creating software that feels.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plexMono.variable}>
      <body className="bg-black text-white font-mono antialiased">
        {children}
      </body>
    </html>
  );
}
