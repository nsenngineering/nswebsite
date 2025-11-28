export type ProjectCategory = 'pile-testing' | 'tunnel-road' | 'hydropower' | 'transmission' | 'ndt';

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
