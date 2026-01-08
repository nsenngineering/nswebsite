/**
 * Company Information Types
 */

export interface CompanyInfo {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  url: string;

  laboratory: {
    name: string;
    location: string;
    description: string;
  };

  certification: {
    iso: string;
    badge: string;
  };

  contact: {
    email: string;
    emailCareers: string;
    phone: string;
    phoneAlt: string;
    whatsapp: string;
    address: string;
  };

  social: {
    facebook: string;
    linkedin: string;
    instagram: string;
    tiktok: string;
  };

  stats: {
    yearsOfExperience: number;
    projectsCompleted: number;
    teamSize: number;
    drillingCapacity: string;
  };
}

/**
 * CSV Record (key-value pairs)
 */
export interface CompanyInfoCSVRecord {
  key: string;
  value: string;
}
