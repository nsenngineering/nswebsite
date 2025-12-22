import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingContactButtons from "@/components/layout/FloatingContactButtons";
import { siteConfig } from "@/data/site-config";
import { getLogoUrl } from "@/lib/utils";

const logoUrl = getLogoUrl();

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  icons: {
    icon: logoUrl,
    apple: logoUrl,
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    images: [logoUrl],
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
