import { NextResponse } from "next/server";
import type { ELibraryConfig } from "@/types/elibrary";
import elibraryData from "@/data/generated/elibrary.json";

const staticData = elibraryData as unknown as ELibraryConfig;

// Save as: src/app/api/elibrary/downloads/route.ts
// See src/app/api/elibrary/standard-codes/route.ts for the full explanation
// of runtime = "edge", JSON_SERVER_URL, and the static-data fallback pattern.
export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  const jsonServerUrl = process.env.JSON_SERVER_URL;

  if (!jsonServerUrl) {
    console.error("JSON_SERVER_URL is not configured for this environment.");
    return NextResponse.json(staticData.downloads ?? []);
  }

  try {
    const upstream = await fetch(`${jsonServerUrl}/downloads`, {
      cache: "no-store",
    });

    if (!upstream.ok) {
      console.error(`Upstream request failed: ${upstream.status} ${upstream.statusText}`);
      return NextResponse.json(staticData.downloads ?? []);
    }

    const contentType = upstream.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      const text = await upstream.text();
      console.error(
        `Upstream returned non-JSON content-type "${contentType}". First 120 chars: ${text.slice(0, 120)}`
      );
      return NextResponse.json(staticData.downloads ?? []);
    }

    const data = await upstream.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to reach the eLibrary API for downloads", error);
    return NextResponse.json(staticData.downloads ?? []);
  }
}