import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

// Server-only secret — deliberately NOT prefixed with NEXT_PUBLIC_.
// See the reasoning tied back to JSON_SERVER_URL below.
const DRAFT_MODE_SECRET = process.env.DRAFT_MODE_SECRET;

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  const itemId = request.nextUrl.searchParams.get('id'); // e.g. a StandardCode id

  if (!DRAFT_MODE_SECRET) {
    return new NextResponse('Draft mode is not configured on this server', { status: 500 });
  }

  if (!secret || secret !== DRAFT_MODE_SECRET) {
    return new NextResponse('Invalid or missing secret', { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();

  // Land back on the eLibrary, optionally scrolled/filtered to the
  // specific unpublished item being previewed. The secret is never
  // echoed into this redirect — the cookie carries the authorization
  // from here on, so the URL itself is safe to share/bookmark.
  redirect(itemId ? `/elibrary?preview=${encodeURIComponent(itemId)}` : '/elibrary');
}