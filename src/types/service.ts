/**
 * Service category ID (kebab-case)
 * Categories are dynamically loaded from service-categories.csv
 * Examples: 'pile-testing', 'soil-laboratory', 'material', etc.
 */
export type ServiceCategory = string;

export interface Service {
  id: string;
  category: ServiceCategory;
  name: string;
  shortDescription: string;
  fullDescription: string;
  processSteps: string[];
  equipmentUsed: string[];
  typicalDeliverables: string[];
  media: {
    images: string[];
    heroImage?: string;
  };
  featured?: boolean;
}
