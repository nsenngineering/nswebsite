#!/usr/bin/env node

import path from 'path';
import fs from 'fs-extra';
import { fetchDataWithFallback } from './parsers/data-source.js';
import { parseProjectsFromSource, extractCategories } from './parsers/project-parser.js';
import { validateAllMedia, copyProjectMedia, validateAllELibraryFiles, copyELibraryFiles } from './parsers/validate-media.js';
import { parseHeroCarousel, copyHeroImages } from './parsers/hero-carousel-parser.js';
import { parseMilestones, copyMilestoneImages } from './parsers/milestone-parser.js';
import { parseTeam, copyTeamImages } from './parsers/team-parser.js';
import { parseELibraryDocuments, extractSectionCounts, loadSectionMetadata } from './parsers/elibrary-parser.js';
import { parseServices } from './parsers/services-parser.js';
import { exportAllSheetsToCSV, shouldExportToCSV } from './parsers/csv-exporter.js';

const OUTPUT_PATH = path.join(process.cwd(), 'src', 'data', 'generated', 'projects.json');
const CATEGORIES_OUTPUT_PATH = path.join(process.cwd(), 'src', 'data', 'generated', 'categories.json');
const HERO_OUTPUT_PATH = path.join(process.cwd(), 'src', 'data', 'generated', 'hero-carousel.json');
const MILESTONES_OUTPUT_PATH = path.join(process.cwd(), 'src', 'data', 'generated', 'milestones.json');
const TEAM_OUTPUT_PATH = path.join(process.cwd(), 'src', 'data', 'generated', 'team.json');
const ELIBRARY_CSV_PATH = path.join(process.cwd(), 'content', 'elibrary', 'documents.csv');
const ELIBRARY_OUTPUT_PATH = path.join(process.cwd(), 'src', 'data', 'generated', 'elibrary.json');

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
 * Count projects by category (dynamic)
 */
function categorizeProjects(projects: any[]): Record<string, number> {
  const counts: Record<string, number> = {};

  for (const project of projects) {
    counts[project.category] = (counts[project.category] || 0) + 1;
  }

  return counts;
}

/**
 * Main build function
 */
async function buildContent() {
  console.log('🔨 Building content...\n');

  try {
    // Step 1: Parse projects from Google Sheets or CSV fallback
    console.log('🔍 Parsing and validating project data...');
    const projects = await parseProjectsFromSource();
    console.log();

    // Step 2: Validate media files (local mode) or R2 config (R2 mode)
    await validateAllMedia(projects);

    // Step 3: Copy media to public folder (local mode) or skip (R2 mode)
    await copyProjectMedia(projects);

    // Step 4: Generate JSON output
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

    // Generate categories metadata
    console.log('\n🏷️  Generating categories metadata...');
    const categories = await extractCategories(projects);
    await fs.writeJSON(CATEGORIES_OUTPUT_PATH, categories, { spaces: 2 });
    console.log(`✅ Generated: ${path.relative(process.cwd(), CATEGORIES_OUTPUT_PATH)}`);
    console.log(`   Extracted ${categories.length} unique categories`);

    // Show which categories have custom config vs defaults
    const DEFAULT_COLOR = '#9333ea';
    const customConfigured = categories.filter(c => c.color !== DEFAULT_COLOR).length;
    console.log(`   ${customConfigured} with custom styling, ${categories.length - customConfigured} using defaults`);

    // Summary
    console.log('\n📊 Build Summary:');
    console.log(`   Total projects: ${projects.length}`);
    console.log(`   Categories:`);
    for (const category of categories) {
      const count = output.categories[category.id] || 0;
      console.log(`      ${category.label} (${category.id}): ${count}`);
    }
    console.log(`   Featured projects: ${projects.filter(p => p.featured).length}`);

    // Step 5: Parse hero carousel
    console.log('\n📸 Building hero carousel...');
    const heroCarousel = await parseHeroCarousel();

    // Step 6: Copy hero images to public folder
    await copyHeroImages(heroCarousel);

    // Step 7: Generate hero carousel JSON output
    console.log('\n💾 Generating hero carousel JSON...');
    await fs.ensureDir(path.dirname(HERO_OUTPUT_PATH));
    await fs.writeJSON(HERO_OUTPUT_PATH, heroCarousel, { spaces: 2 });
    console.log(`✅ Generated: ${path.relative(process.cwd(), HERO_OUTPUT_PATH)}`);

    // Step 8: Parse milestones
    console.log('\n🏛️  Building milestones timeline...');
    const milestones = await parseMilestones();

    // Step 9: Copy milestone images to public folder
    await copyMilestoneImages(milestones);

    // Step 10: Generate milestones JSON output
    console.log('\n💾 Generating milestones JSON...');
    await fs.ensureDir(path.dirname(MILESTONES_OUTPUT_PATH));
    await fs.writeJSON(MILESTONES_OUTPUT_PATH, milestones, { spaces: 2 });
    console.log(`✅ Generated: ${path.relative(process.cwd(), MILESTONES_OUTPUT_PATH)}`);
    console.log(`   Timeline: ${milestones.startYear} - ${milestones.endYear}`);
    console.log(`   Milestones: ${milestones.milestones.length}`);

    // Step 11: Parse team
    console.log('\n👥 Building team...');
    const team = await parseTeam();

    // Step 12: Copy team images to public folder
    await copyTeamImages(team);

    // Step 13: Generate team JSON output
    console.log('\n💾 Generating team JSON...');
    await fs.ensureDir(path.dirname(TEAM_OUTPUT_PATH));
    await fs.writeJSON(TEAM_OUTPUT_PATH, team, { spaces: 2 });
    console.log(`✅ Generated: ${path.relative(process.cwd(), TEAM_OUTPUT_PATH)}`);

    // Step 14: Parse eLibrary data (Sheets or CSV)
    console.log('\n📚 Building eLibrary...');
    const elibraryRecords = await fetchDataWithFallback(
      ELIBRARY_CSV_PATH,
      'ElibraryDocuments',
      'GOOGLE_SHEET_TAB_ELIBRARY'
    );
    console.log(`   Found ${elibraryRecords.length} documents`);

    const elibraryDocs = await parseELibraryDocuments(elibraryRecords);
    console.log();

    // Step 15: Validate and copy eLibrary files
    await validateAllELibraryFiles(elibraryDocs);
    await copyELibraryFiles(elibraryDocs);

    // Step 16: Generate eLibrary JSON
    console.log('\n💾 Generating eLibrary JSON...');

    const sectionCounts = extractSectionCounts(elibraryDocs);
    const sectionMetadata = await loadSectionMetadata();

    const elibraryOutput = {
      documents: elibraryDocs,
      sections: sectionCounts,
      sectionInfo: sectionMetadata,
      metadata: {
        totalDocuments: elibraryDocs.length,
        lastUpdated: new Date().toISOString(),
        buildVersion: '1.0.0'
      }
    };

    await fs.ensureDir(path.dirname(ELIBRARY_OUTPUT_PATH));
    await fs.writeJSON(ELIBRARY_OUTPUT_PATH, elibraryOutput, { spaces: 2 });
    console.log(`✅ Generated: ${path.relative(process.cwd(), ELIBRARY_OUTPUT_PATH)}`);

    // eLibrary summary
    console.log('\n📊 eLibrary Summary:');
    console.log(`   Total documents: ${elibraryDocs.length}`);
    console.log(`   Sections:`);
    for (const [sectionId, count] of Object.entries(sectionCounts)) {
      const sectionInfo = sectionMetadata.find(s => s.id === sectionId);
      const label = sectionInfo?.label || sectionId;
      console.log(`      ${label} (${sectionId}): ${count}`);
    }
    console.log(`   Featured documents: ${elibraryDocs.filter(d => d.featured).length}`);

    // Step 17: Parse services
    console.log('\n🔧 Building services catalog...');
    await parseServices();

    // Step 18: Export Sheets to CSV for version control (cloud mode only)
    if (shouldExportToCSV()) {
      await exportAllSheetsToCSV();
    }

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
