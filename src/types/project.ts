export type Industry = 'roads' | 'bridges' | 'hydropower' | 'buildings';

export interface ProjectLocation {
  name: string;
  coordinates: [number, number]; // [latitude, longitude]
}

export interface Project {
  id: string;
  name: string;
  client: string;
  year: number;
  location: ProjectLocation;
  industry: Industry;
  services: string[];
  scopeOfWork: string;
  images: string[];
  equipmentUsed: string[];
  outcomes: string;
  caseStudyPDF?: string;
  featured?: boolean;
}
