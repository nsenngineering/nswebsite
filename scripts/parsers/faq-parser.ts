/**
 * FAQ Parser
 *
 * Parses faq.csv and faq-categories.csv from Google Sheets or local files
 * to generate faq.json for the website.
 */

import fs from 'fs-extra';
import path from 'path';
import type { FAQItem, FAQCategory } from '../../src/types/faq.js';
import { fetchDataWithFallback } from './data-source.js';

interface FAQCSVRow {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface FAQCategoryCSVRow {
  id: string;
  label: string;
  icon: string;
}

interface FAQOutput {
  faqs: FAQItem[];
  categories: FAQCategory[];
  metadata: {
    totalFAQs: number;
    lastUpdated: string;
    buildVersion: string;
  };
}

const OUTPUT_DIR = path.join(process.cwd(), 'src/data/generated');

/**
 * Parse FAQ categories
 */
async function parseFAQCategories(): Promise<FAQCategory[]> {
  console.log('📂 Parsing FAQ categories...');

  const records = await fetchDataWithFallback(
    'content/faq/faq-categories.csv',
    'FAQCategories',
    'GOOGLE_SHEET_TAB_FAQ_CATEGORIES'
  );

  const categories: FAQCategory[] = records.map(record => {
    const row = record as unknown as FAQCategoryCSVRow;
    return {
      id: row.id,
      label: row.label,
      icon: row.icon
    };
  });

  console.log(`✅ Parsed ${categories.length} FAQ categories`);
  return categories;
}

/**
 * Parse FAQ items
 */
async function parseFAQItems(): Promise<FAQItem[]> {
  console.log('📋 Parsing FAQ items...');

  const records = await fetchDataWithFallback(
    'content/faq/faq.csv',
    'FAQ',
    'GOOGLE_SHEET_TAB_FAQ'
  );

  const faqs: FAQItem[] = records.map(record => {
    const row = record as unknown as FAQCSVRow;
    return {
      id: row.id,
      question: row.question,
      answer: row.answer,
      category: row.category
    };
  });

  console.log(`✅ Parsed ${faqs.length} FAQ items`);
  return faqs;
}

/**
 * Main build function for FAQ data
 */
export async function buildFAQs(): Promise<void> {
  console.log('❓ Building FAQs...');

  try {
    // Parse categories and FAQs
    const categories = await parseFAQCategories();
    const faqs = await parseFAQItems();

    // Count FAQs by category
    const categoryCounts: Record<string, number> = {};
    for (const faq of faqs) {
      categoryCounts[faq.category] = (categoryCounts[faq.category] || 0) + 1;
    }

    // Generate JSON output
    const output: FAQOutput = {
      faqs,
      categories,
      metadata: {
        totalFAQs: faqs.length,
        lastUpdated: new Date().toISOString(),
        buildVersion: '1.0.0'
      }
    };

    const outputPath = path.join(OUTPUT_DIR, 'faq.json');
    await fs.ensureDir(OUTPUT_DIR);
    await fs.writeJson(outputPath, output, { spaces: 2 });

    // Summary
    console.log(`✅ FAQ data generated successfully!`);
    console.log(`   Total FAQs: ${faqs.length}`);
    console.log(`   Categories:`);
    for (const category of categories) {
      const count = categoryCounts[category.id] || 0;
      console.log(`      ${category.label} (${category.id}): ${count}`);
    }
    console.log(`   Output: ${outputPath}`);
  } catch (error) {
    console.error('❌ Error building FAQs:', error);
    throw error;
  }
}
