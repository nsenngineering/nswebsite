/**
 * Equipment types for the NS Engineering equipment catalog
 * CSV-based content management system
 */

export type EquipmentCategory =
  | 'pile-testing'
  | 'drilling'
  | 'laboratory'
  | 'geophysical'
  | 'field-testing';

export interface EquipmentSpecs {
  capacity: string;
  accuracy: string;
  standards: string[];
  software?: string;
}

export interface EquipmentMedia {
  images: string[];
  specSheet?: string;
  heroImage?: string;
}

export interface Equipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  manufacturer?: string;
  model?: string;
  keySpec: string;
  description: string;
  specs: EquipmentSpecs;
  applications: string[];
  media: EquipmentMedia;
  featured?: boolean;
}

export interface EquipmentConfig {
  equipment: Equipment[];
  categories: Record<string, number>;
  metadata: {
    totalEquipment: number;
    lastUpdated: string;
    buildVersion: string;
  };
}

export interface EquipmentCategoryInfo {
  id: EquipmentCategory;
  label: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  description: string;
}
