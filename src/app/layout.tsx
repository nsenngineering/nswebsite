import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingContactButtons from "@/components/layout/FloatingContactButtons";
import { siteConfig } from "@/data/site-config";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  icons: {
    icon: '/logo/ns-logo.jpg',
    apple: '/logo/ns-logo.jpg',
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    images: ['/logo/ns-logo.jpg'],
    type: 'website',
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
        <Header />
        <main className="pt-20">
          {children}
        </main>
        <Footer />
        <FloatingContactButtons />
      </body>
    </html>
  );
}
