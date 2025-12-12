import categoriesData from '@/data/generated/categories.json';

// Dynamically generate union type from categories.json
export type ProjectCategory = typeof categoriesData[number]['id'];

export interface ProjectLocation {
  name: string;
  district?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface ProjectMedia {
  images: string[];
  pdfs: string[];
  heroImage?: string;
}

export interface Project {
  id: string;
  title: string;
  client: string;
  category: ProjectCategory;
  year: number;
  location: ProjectLocation;
  scope: string[];
  media: ProjectMedia;
  featured?: boolean;
}
