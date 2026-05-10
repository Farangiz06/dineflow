import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DineFlow",
  description: "Restaurant booking and pre-order platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}