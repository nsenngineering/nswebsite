#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';

const SITE_URL = 'https://www.nsengineering.com.np';

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

/**
 * Generate sitemap.xml with all static pages, services, and projects
 */
export async function generateSitemap() {
  console.log('🗺️  Generating sitemap.xml...\n');

  const urls: SitemapUrl[] = [];
  const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

  // ========================================
  // Static Pages
  // ========================================
  const staticPages = [
    { path: '', priority: 1.0, changefreq: 'weekly' as const },
    { path: '/about', priority: 0.9, changefreq: 'monthly' as const },
    { path: '/services', priority: 0.9, changefreq: 'weekly' as const },
    { path: '/projects', priority: 0.9, changefreq: 'weekly' as const },
    { path: '/hydropower-investigations', priority: 0.9, changefreq: 'monthly' as const },
    { path: '/team', priority: 0.8, changefreq: 'monthly' as const },
    { path: '/elibrary', priority: 0.7, changefreq: 'weekly' as const },
    { path: '/faq', priority: 0.7, changefreq: 'monthly' as const },
    { path: '/careers', priority: 0.7, changefreq: 'weekly' as const },
    { path: '/contact', priority: 0.8, changefreq: 'monthly' as const },
    { path: '/alumni', priority: 0.5, changefreq: 'monthly' as const },
    { path: '/privacy', priority: 0.3, changefreq: 'yearly' as const },
    { path: '/terms', priority: 0.3, changefreq: 'yearly' as const },
  ];

  console.log('   📄 Adding static pages...');
  staticPages.forEach(page => {
    urls.push({
      loc: `${SITE_URL}${page.path}`,
      lastmod: currentDate,
      changefreq: page.changefreq,
      priority: page.priority,
    });
  });
  console.log(`   ✅ Added ${staticPages.length} static pages`);

  // ========================================
  // Dynamic Services
  // ========================================
  try {
    const servicesPath = path.join(process.cwd(), 'src', 'data', 'generated', 'services.json');

    if (await fs.pathExists(servicesPath)) {
      const servicesData = await fs.readJson(servicesPath);
      const services = servicesData.services || [];

      console.log(`\n   🔧 Adding ${services.length} services...`);
      services.forEach((service: any) => {
        urls.push({
          loc: `${SITE_URL}/services#${service.id}`,
          lastmod: currentDate,
          changefreq: 'monthly',
          priority: 0.6,
        });
      });
      console.log(`   ✅ Added ${services.length} service URLs`);
    } else {
      console.log('   ⚠️  services.json not found, skipping services');
    }
  } catch (error) {
    console.error('   ❌ Error loading services:', error);
  }

  // ========================================
  // Dynamic Projects
  // ========================================
  try {
    const projectsPath = path.join(process.cwd(), 'src', 'data', 'generated', 'projects.json');

    if (await fs.pathExists(projectsPath)) {
      const projectsData = await fs.readJson(projectsPath);
      const projects = projectsData.projects || [];

      console.log(`\n   🏗️  Adding ${projects.length} projects...`);
      projects.forEach((project: any) => {
        // Use project year for lastmod if available
        const projectDate = project.year ? `${project.year}-01-01` : currentDate;

        urls.push({
          loc: `${SITE_URL}/projects#${project.id}`,
          lastmod: projectDate,
          changefreq: 'yearly', // Projects rarely change once completed
          priority: 0.5,
        });
      });
      console.log(`   ✅ Added ${projects.length} project URLs`);
    } else {
      console.log('   ⚠️  projects.json not found, skipping projects');
    }
  } catch (error) {
    console.error('   ❌ Error loading projects:', error);
  }

  // ========================================
  // Generate XML
  // ========================================
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  // ========================================
  // Write to public directory
  // ========================================
  const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  await fs.writeFile(sitemapPath, xml, 'utf-8');

  console.log(`\n✅ Sitemap generated successfully!`);
  console.log(`   📍 Location: ${sitemapPath}`);
  console.log(`   📊 Total URLs: ${urls.length}`);
  console.log(`   🌐 Sitemap URL: ${SITE_URL}/sitemap.xml\n`);
}

// Run if called directly (not imported)
if (require.main === module) {
  generateSitemap().catch(error => {
    console.error('❌ Failed to generate sitemap:', error);
    process.exit(1);
  });
}
