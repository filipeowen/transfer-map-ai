import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Washington CC to UW Transfer Planner",
  description:
    "A focused demo planner for Washington community and technical college students exploring transfer course equivalencies for UW Seattle."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html data-scroll-behavior="smooth" lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
