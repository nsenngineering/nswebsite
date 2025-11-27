export type ServiceCategory =
  | 'pile-testing'
  | 'soil-laboratory'
  | 'rock-laboratory'
  | 'drilling'
  | 'geophysical'
  | 'ndt';

export interface Service {
  id: string;
  category: ServiceCategory;
  name: string;
  shortDescription: string;
  fullDescription: string;
  processSteps: string[];
  equipmentUsed: string[];
  typicalDeliverables: string[];
  icon: string;
  image: string;
  diagram?: string;
}
