import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const font = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OpenClaw Chat",
  description: "AI Voice Chat with OpenRouter and Supabase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${font.variable} h-full antialiased`}
      data-theme="dark"
    >
      <body className={`${font.className} min-h-full flex flex-col`}>
        {children}
      </body>
    </html>
  );
}