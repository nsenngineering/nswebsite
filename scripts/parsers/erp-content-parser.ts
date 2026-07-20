/**
 * ERP Content Parser
 *
 * Fetches published-content JSON snapshots that ERPNext (eng_lab_suite's
 * website_publish.py) pushes to Cloudflare R2, replacing what used to be a
 * live Google Sheets API call for content types that have moved to ERP as
 * their source of truth (Standard Codes first).
 *
 * ERPNext pushes, this only ever pulls: a plain, unauthenticated GET
 * against the same public R2 bucket the build already trusts for media, at
 * content/erp/{contentType}.json. No new credentials, and no direct call
 * to ERPNext itself — the public build should never be a live inbound
 * request against production ERP.
 *
 * @module scripts/parsers/erp-content-parser
 */

import { CSVRecord } from './csv-parser.js';

/**
 * Fetch a published content-type snapshot from R2.
 *
 * Returns rows in the same shape parseCSVFile() and the Google Sheets
 * parser already return — plain {header: value} objects — so every
 * downstream content parser (parseStandardCodes, etc.) needs zero changes
 * to consume this. The ERP-side serializer is responsible for producing
 * field names that already match what those parsers expect.
 *
 * @param contentType - Content type key, e.g. 'standard-codes'
 * @returns Array of row objects
 */
export async function fetchErpContent(contentType: string): Promise<CSVRecord[]> {
  const base = process.env.NEXT_PUBLIC_R2_BASE_URL;
  if (!base) {
    throw new Error(
      'NEXT_PUBLIC_R2_BASE_URL not set!\n' +
      'ERP content mode (CONTENT_SOURCE_MODE=erp) reuses the same R2 base URL already used for media.'
    );
  }

  const url = `${base.replace(/\/$/, '')}/content/erp/${contentType}.json`;

  console.log(`📊 Fetching ERP-published content: "${contentType}"`);

  let response: Response;
  try {
    response = await fetch(url);
  } catch (error) {
    throw new Error(
      `Failed to reach R2 for ERP content "${contentType}"\n` +
      `URL: ${url}\n` +
      `${error instanceof Error ? error.message : error}`
    );
  }

  if (!response.ok) {
    throw new Error(
      `ERP content fetch failed for "${contentType}": HTTP ${response.status}\n` +
      `URL: ${url}`
    );
  }

  const data = (await response.json()) as CSVRecord[];
  console.log(`✅ Fetched ${data.length} rows from ERP-published content ("${contentType}")`);
  return data;
}

/**
 * Check if we should use ERP-published content as the data source.
 *
 * Deliberately its own flag, not a third CONTENT_SOURCE_MODE value —
 * migration is phased (one content type at a time over several PRs), and
 * CONTENT_SOURCE_MODE=sheets/csv already governs every call site that
 * hasn't migrated yet. If ERP were a third exclusive mode value, turning
 * it on would silently stop fetching everything still on Sheets for the
 * entire migration window. This way both stay on simultaneously:
 * CONTENT_SOURCE_MODE=sheets and ERP_CONTENT_ENABLED=true together mean
 * "Standard Codes (and whatever else has migrated) comes from ERP,
 * everything else still comes from Sheets, same as today."
 */
export function shouldUseErp(): boolean {
  return process.env.ERP_CONTENT_ENABLED === 'true';
}
