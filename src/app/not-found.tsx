'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { redirectRules, findRedirect } from '@/data/redirects';

export default function NotFound() {
  const pathname = usePathname();
  const [redirect, setRedirect] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!pathname) return;

    // Check if current path matches a redirect rule
    const target = findRedirect(pathname);

    if (target) {
      setRedirect(target);

      // Start countdown
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            window.location.replace(target);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [pathname]);

  // If redirect found, show countdown
  if (redirect) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-600 text-white px-4">
        <div className="max-w-md text-center">
          <div className="mb-8">
            <div className="inline-block">
              <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-4">Page Moved</h1>
          <p className="text-lg mb-6">
            This page has moved to{' '}
            <Link href={redirect} className="underline font-semibold">
              {redirect}
            </Link>
          </p>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
            <p className="text-sm mb-2">Redirecting in</p>
            <div className="text-5xl font-bold">{countdown}</div>
            <p className="text-sm mt-2">seconds</p>
          </div>

          <Link
            href={redirect}
            className="inline-block bg-white text-blue-900 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            Go Now
          </Link>
        </div>
      </div>
    );
  }

  // Standard 404 page (no redirect found)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 text-white px-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-9xl font-bold mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-6">Page Not Found</h2>
        <p className="text-lg mb-8 text-slate-300">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition"
          >
            Go to Homepage
          </Link>
          <Link
            href="/services"
            className="bg-slate-600 hover:bg-slate-700 px-6 py-3 rounded-lg font-semibold transition"
          >
            Browse Services
          </Link>
        </div>

        <div className="text-left bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Popular Pages:</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/about" className="text-blue-400 hover:underline">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/projects" className="text-blue-400 hover:underline">
                Projects
              </Link>
            </li>
            <li>
              <Link href="/team" className="text-blue-400 hover:underline">
                Team
              </Link>
            </li>
            <li>
              <Link href="/careers" className="text-blue-400 hover:underline">
                Careers
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-blue-400 hover:underline">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {pathname && (
          <p className="mt-6 text-sm text-slate-400">
            Requested: <code className="bg-slate-800 px-2 py-1 rounded">{pathname}</code>
          </p>
        )}
      </div>
    </div>
  );
}
