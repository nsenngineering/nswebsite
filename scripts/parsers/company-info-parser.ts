import path from 'path';
import { fetchDataWithFallback } from './data-source.js';
import type { CompanyInfo, CompanyInfoCSVRecord } from '../../src/types/company-info.js';

const COMPANY_INFO_CSV_PATH = path.join(process.cwd(), 'content', 'company', 'company-info.csv');

/**
 * Parse company info CSV (key-value pairs)
 */
export async function parseCompanyInfo(): Promise<CompanyInfo> {
  console.log('🏢 Parsing company info...');

  // Fetch from Sheets or CSV
  const records = await fetchDataWithFallback(
    COMPANY_INFO_CSV_PATH,
    'CompanyInfo',
    'GOOGLE_SHEET_TAB_COMPANY_INFO'
  ) as unknown as CompanyInfoCSVRecord[];

  if (records.length === 0) {
    throw new Error('Company info CSV is empty');
  }

  // Convert key-value pairs to object
  const data: Record<string, string> = {};
  records.forEach(record => {
    data[record.key] = record.value;
  });

  // Helper function to get required value
  const get = (key: string): string => {
    const value = data[key];
    if (!value) {
      throw new Error(`Missing required company info key: ${key}`);
    }
    return value.trim();
  };

  // Helper function to get number value
  const getNumber = (key: string): number => {
    const value = get(key);
    const num = parseInt(value, 10);
    if (isNaN(num)) {
      throw new Error(`Invalid number for key ${key}: ${value}`);
    }
    return num;
  };

  // Build structured company info object
  const companyInfo: CompanyInfo = {
    name: get('company_name'),
    shortName: get('company_short_name'),
    tagline: get('company_tagline'),
    description: get('company_description'),
    url: get('company_url'),

    laboratory: {
      name: get('laboratory_name'),
      location: get('laboratory_location'),
      description: get('laboratory_description'),
    },

    certification: {
      iso: get('certification_iso'),
      badge: get('certification_badge'),
    },

    contact: {
      email: get('contact_email'),
      emailCareers: get('contact_email_careers'),
      phone: get('contact_phone'),
      phoneAlt: get('contact_phone_alt'),
      whatsapp: get('contact_whatsapp'),
      address: get('contact_address'),
    },

    social: {
      facebook: get('social_facebook'),
      linkedin: get('social_linkedin'),
      instagram: get('social_instagram'),
      tiktok: get('social_tiktok'),
    },

    stats: {
      yearsOfExperience: getNumber('stats_years_experience'),
      projectsCompleted: getNumber('stats_projects_completed'),
      teamSize: getNumber('stats_team_size'),
      drillingCapacity: get('stats_drilling_capacity'),
    },
  };

  console.log(`✅ Parsed company info: ${companyInfo.shortName}`);
  console.log(`   Contact: ${companyInfo.contact.email}`);
  console.log(`   Phone: ${companyInfo.contact.phone}`);

  return companyInfo;
}
