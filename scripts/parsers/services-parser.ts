/**
 * Services Parser
 *
 * Parses services.csv and service-categories.csv from Google Sheets or local files
 * to generate services.json for the website. Validates data and copies media files.
 */

import fs from 'fs';
import path from 'path';
import { Service, ServiceCategory } from '../../src/types/service';
import { fetchDataWithFallback } from './data-source.js';

interface ServiceCSVRow {
  id: string;
  category: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  processSteps: string;
  equipmentUsed: string;
  typicalDeliverables: string;
  icon: string;
  image: string;
  diagram: string;
}

interface CategoryCSVRow {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface ServicesOutput {
  services: Service[];
  categories: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
  }>;
}

const CONTENT_DIR = path.join(process.cwd(), 'content/services');
const OUTPUT_DIR = path.join(process.cwd(), 'src/data/generated');
const PUBLIC_SERVICES_DIR = path.join(process.cwd(), 'public/images/services');
const PUBLIC_DIAGRAMS_DIR = path.join(process.cwd(), 'public/images/diagrams');

const VALID_CATEGORIES: ServiceCategory[] = [
  'pile-testing',
  'soil-laboratory',
  'rock-laboratory',
  'drilling',
  'geophysical',
  'ndt'
];

/**
 * Parse services from Google Sheets or CSV file
 */
async function parseServicesCSV(): Promise<Service[]> {
  const csvPath = path.join(CONTENT_DIR, 'services.csv');

  if (!fs.existsSync(csvPath)) {
    throw new Error(`Services CSV not found at: ${csvPath}`);
  }

  // Fetch from Google Sheets with CSV fallback
  const rows = await fetchDataWithFallback(
    csvPath,
    'Services',
    'GOOGLE_SHEET_TAB_SERVICES'
  ) as unknown as ServiceCSVRow[];

  console.log(`📋 Parsing ${rows.length} services...`);

  const services: Service[] = rows.map((row, index) => {
    // Validate required fields
    if (!row.id || !row.category || !row.name) {
      throw new Error(
        `Service at row ${index + 2} is missing required fields (id, category, or name)`
      );
    }

    // Validate category
    if (!VALID_CATEGORIES.includes(row.category as ServiceCategory)) {
      throw new Error(
        `Invalid category "${row.category}" for service "${row.id}". ` +
        `Must be one of: ${VALID_CATEGORIES.join(', ')}`
      );
    }

    // Parse array fields (semicolon-separated)
    const processSteps = row.processSteps
      ? row.processSteps.split(';').map(s => s.trim()).filter(Boolean)
      : [];

    const equipmentUsed = row.equipmentUsed
      ? row.equipmentUsed.split(';').map(s => s.trim()).filter(Boolean)
      : [];

    const typicalDeliverables = row.typicalDeliverables
      ? row.typicalDeliverables.split(';').map(s => s.trim()).filter(Boolean)
      : [];

    // Handle image path
    const imagePath = row.image ? `/images/services/${row.image}` : '/images/services/placeholder.jpg';

    // Handle optional diagram path
    const diagramPath = row.diagram ? `/images/diagrams/${row.diagram}` : undefined;

    return {
      id: row.id,
      category: row.category as ServiceCategory,
      name: row.name,
      shortDescription: row.shortDescription || '',
      fullDescription: row.fullDescription || '',
      processSteps,
      equipmentUsed,
      typicalDeliverables,
      icon: row.icon || 'Circle',
      image: imagePath,
      diagram: diagramPath
    };
  });

  return services;
}

/**
 * Parse service categories from Google Sheets or CSV file
 */
async function parseCategoriesCSV() {
  const csvPath = path.join(CONTENT_DIR, 'service-categories.csv');

  if (!fs.existsSync(csvPath)) {
    console.warn(`⚠️  Categories CSV not found at: ${csvPath}. Using defaults.`);
    return [];
  }

  // Fetch from Google Sheets with CSV fallback
  const rows = await fetchDataWithFallback(
    csvPath,
    'ServiceCategories',
    'GOOGLE_SHEET_TAB_SERVICE_CATEGORIES'
  ) as unknown as CategoryCSVRow[];

  console.log(`📂 Parsing ${rows.length} service categories...`);

  return rows.map(row => ({
    id: row.id,
    name: row.name,
    description: row.description || '',
    icon: row.icon || 'Circle'
  }));
}

/**
 * Copy media files (images and diagrams) to public directory
 */
function copyMediaFiles(services: Service[]): void {
  console.log('📁 Copying media files...');

  // Ensure public directories exist
  if (!fs.existsSync(PUBLIC_SERVICES_DIR)) {
    fs.mkdirSync(PUBLIC_SERVICES_DIR, { recursive: true });
  }
  if (!fs.existsSync(PUBLIC_DIAGRAMS_DIR)) {
    fs.mkdirSync(PUBLIC_DIAGRAMS_DIR, { recursive: true });
  }

  let imagesCopied = 0;
  let diagramsCopied = 0;

  for (const service of services) {
    // Copy service image
    if (service.image && !service.image.includes('placeholder')) {
      const imageFilename = path.basename(service.image);
      const sourcePath = path.join(CONTENT_DIR, service.id, 'images', imageFilename);
      const destPath = path.join(PUBLIC_SERVICES_DIR, imageFilename);

      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, destPath);
        imagesCopied++;
      } else {
        console.warn(`⚠️  Image not found for ${service.id}: ${sourcePath}`);
      }
    }

    // Copy diagram if exists
    if (service.diagram) {
      const diagramFilename = path.basename(service.diagram);
      const sourcePath = path.join(CONTENT_DIR, service.id, 'diagrams', diagramFilename);
      const destPath = path.join(PUBLIC_DIAGRAMS_DIR, diagramFilename);

      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, destPath);
        diagramsCopied++;
      } else {
        console.warn(`⚠️  Diagram not found for ${service.id}: ${sourcePath}`);
      }
    }
  }

  console.log(`✅ Copied ${imagesCopied} images and ${diagramsCopied} diagrams`);
}

/**
 * Main parser function
 */
export async function parseServices(): Promise<void> {
  console.log('🔧 Parsing services data...\n');

  try {
    // Parse from Google Sheets or CSV files
    const services = await parseServicesCSV();
    const categories = await parseCategoriesCSV();

    // Validate that all categories referenced by services exist
    const categoryIds = new Set(categories.map(c => c.id));
    for (const service of services) {
      if (!categoryIds.has(service.category)) {
        console.warn(
          `⚠️  Service "${service.id}" references category "${service.category}" ` +
          `which is not defined in service-categories.csv`
        );
      }
    }

    // Copy media files
    copyMediaFiles(services);

    // Prepare output
    const output: ServicesOutput = {
      services,
      categories
    };

    // Write JSON output
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const outputPath = path.join(OUTPUT_DIR, 'services.json');
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

    console.log(`\n✅ Services data generated successfully!`);
    console.log(`   Services: ${services.length}`);
    console.log(`   Categories: ${categories.length}`);
    console.log(`   Output: ${outputPath}`);
  } catch (error) {
    console.error('❌ Error parsing services:', error);
    throw error;
  }
}
