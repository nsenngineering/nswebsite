import { NextResponse } from 'next/server';
 
// Server-only env var — no NEXT_PUBLIC_ prefix, so it never ships to the
// browser bundle. Only this Route Handler (running on the server) reads it.
const JSON_SERVER_URL = process.env.JSON_SERVER_URL ?? '';
 
/**
 * GET /api/elibrary/standard-codes
 *
 * This is the boundary. The browser calls this same-origin path — no CORS
 * involved. This handler then makes the "real" request to json-server from
 * the server, where CORS simply doesn't apply (it's a browser-only concept).
 *
 * If json-server ever required an API key, this is exactly where it would
 * live: in a server-only env var, attached to the outgoing fetch below,
 * never visible to anything running in the user's browser.
 */
export async function GET() {
  if (!JSON_SERVER_URL) {
    console.error('JSON_SERVER_URL is not configured.');
    return NextResponse.json(
      { error: 'JSON_SERVER_URL is not configured on the server.' },
      { status: 500 }
    );
  }
 
  let upstream: Response;
  try {
    upstream = await fetch(`${JSON_SERVER_URL}/standardCodes`, {
      cache: 'no-store',
    });
  } catch (error) {
    console.error('Failed to reach json-server for standard codes', error);
    return NextResponse.json(
      { error: 'Could not reach the upstream data source.' },
      { status: 502 }
    );
  }
 
  if (!upstream.ok) {
    return NextResponse.json(
      { error: `Upstream request failed: ${upstream.status} ${upstream.statusText}` },
      { status: upstream.status }
    );
  }
 
  const contentType = upstream.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    const text = await upstream.text();
    console.error(
      `Upstream returned non-JSON content-type "${contentType}". First 120 chars: ${text.slice(0, 120)}`
    );
    return NextResponse.json(
      { error: 'Upstream did not return JSON.' },
      { status: 502 }
    );
  }
 
  const data = await upstream.json();
  return NextResponse.json(data);
}
 
