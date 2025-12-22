/**
 * Site Configuration
 *
 * This module exports company information loaded from generated JSON.
 * The data source is content/company/company-info.csv (or Google Sheets in cloud mode).
 *
 * To update company info:
 * 1. Edit content/company/company-info.csv
 * 2. Run: npm run build:content:local (or build:content:cloud)
 * 3. The changes will be reflected in src/data/generated/company-info.json
 */

import companyInfoData from './generated/company-info.json';
import type { CompanyInfo } from '@/types/company-info';

// Re-export the company info with additional static fields
export const siteConfig = {
  ...companyInfoData,

  // Static fields (not editable via CSV)
  operatingAreas: [
    'Kathmandu Valley',
    'Lalitpur',
    'Central Nepal',
    'Eastern Nepal',
    'Western Nepal',
    'Throughout Nepal',
  ],

  industries: [
    'Road Construction',
    'Bridge Construction',
    'Hydropower Projects',
    'Building Construction',
    'Tunnel Construction',
    'Transmission Lines & Substations',
    'Infrastructure Development',
  ],

  expertise: [
    'Geotechnical Investigation',
    'Pile Testing (PDA, PIT, Static Load)',
    'Soil & Rock Laboratory Testing',
    'Field Drilling (up to 700m)',
    'Geophysical Surveys (MASW, ERT, SRT)',
    'Non-Destructive Testing (NDT)',
    'Environmental Testing',
    'Quality Control',
  ],
} as CompanyInfo & {
  operatingAreas: string[];
  industries: string[];
  expertise: string[];
};
