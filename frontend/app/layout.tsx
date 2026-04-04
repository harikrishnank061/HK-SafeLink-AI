import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HK SafeLink AI | Advanced URL Security",
  description: "Secure your workspace with HK SafeLink AI. Real-time malicious URL detection powered by machine learning.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
