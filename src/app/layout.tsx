import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingContactButtons from "@/components/layout/FloatingContactButtons";
import OrganizationSchema from "@/components/seo/OrganizationSchema";
import LocalBusinessSchema from "@/components/seo/LocalBusinessSchema";
import { siteConfig } from "@/data/site-config";
import { getLogoUrl } from "@/lib/utils";

const logoUrl = getLogoUrl();
const siteUrl = 'https://www.nsengineering.com.np';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.shortName || 'NS Engineering'}`,
  },
  description: siteConfig.description,
  keywords: [
    'geotechnical engineering Nepal',
    'pile testing Nepal',
    'PDA testing Nepal',
    'soil testing laboratory Nepal',
    'rock testing Nepal',
    'drilling services Nepal',
    'geophysical surveys Nepal',
    'NDT testing Nepal',
    'ISO 9001:2015 laboratory',
    'foundation testing Nepal',
    'hydropower geotechnical Nepal',
    'tunnel investigation Nepal',
    'PIT testing',
    'static load test',
    'soil laboratory Lalitpur',
    'geotechnical investigation Nepal',
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: logoUrl,
    apple: logoUrl,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: logoUrl,
        width: 512,
        height: 512,
        alt: `${siteConfig.name} Logo`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [logoUrl],
    creator: '@nsengineering',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    // Add when available:
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
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
        <OrganizationSchema />
        <LocalBusinessSchema />
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
