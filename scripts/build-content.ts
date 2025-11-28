#!/usr/bin/env node

import path from 'path';
import fs from 'fs-extra';
import { parseCSVFile } from './parsers/csv-parser.js';
import { parseProjects } from './parsers/project-parser.js';
import { validateAllMedia, copyProjectMedia } from './parsers/validate-media.js';

const CSV_PATH = path.join(process.cwd(), 'content', 'projects', 'projects.csv');
const OUTPUT_PATH = path.join(process.cwd(), 'src', 'data', 'generated', 'projects.json');

interface GeneratedOutput {
  projects: any[];
  categories: Record<string, number>;
  metadata: {
    totalProjects: number;
    lastUpdated: string;
    buildVersion: string;
  };
}

/**
 * Count projects by category
 */
function categorizeProjects(projects: any[]): Record<string, number> {
  const counts: Record<string, number> = {
    'pile-testing': 0,
    'tunnel-road': 0,
    'hydropower': 0,
    'transmission': 0,
    'ndt': 0
  };

  for (const project of projects) {
    counts[project.category] = (counts[project.category] || 0) + 1;
  }

  return counts;
}

/**
 * Main build function
 */
async function buildContent() {
  console.log('🔨 Building content from CSV files...\n');

  try {
    // Step 1: Parse CSV
    console.log('📄 Parsing CSV file...');
    const records = await parseCSVFile(CSV_PATH);
    console.log(`   Found ${records.length} records in CSV\n`);

    // Step 2: Validate and transform data
    console.log('🔍 Validating project data...');
    const projects = parseProjects(records);
    console.log();

    // Step 3: Validate media files
    await validateAllMedia(projects);

    // Step 4: Copy media to public folder
    await copyProjectMedia(projects);

    // Step 5: Generate JSON output
    console.log('\n💾 Generating JSON file...');

    const output: GeneratedOutput = {
      projects,
      categories: categorizeProjects(projects),
      metadata: {
        totalProjects: projects.length,
        lastUpdated: new Date().toISOString(),
        buildVersion: '1.0.0'
      }
    };

    // Ensure output directory exists
    await fs.ensureDir(path.dirname(OUTPUT_PATH));

    // Write JSON file
    await fs.writeJSON(OUTPUT_PATH, output, { spaces: 2 });
    console.log(`✅ Generated: ${path.relative(process.cwd(), OUTPUT_PATH)}`);

    // Summary
    console.log('\n📊 Build Summary:');
    console.log(`   Total projects: ${projects.length}`);
    console.log(`   Categories:`);
    for (const [category, count] of Object.entries(output.categories)) {
      if (count > 0) {
        console.log(`      ${category}: ${count}`);
      }
    }
    console.log(`   Featured projects: ${projects.filter(p => p.featured).length}`);

    console.log('\n✅ Content build complete!\n');
    process.exit(0);

  } catch (error) {
    console.error('\n💥 Build failed:\n');
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }
    console.error();
    process.exit(1);
  }
}

// Run the build
buildContent();
