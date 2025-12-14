export interface Milestone {
  year: number;
  title: string;
  description: string;
  image: string;
  featured: boolean;
  path: string;
}

export interface MilestonesConfig {
  milestones: Milestone[];
  startYear: number;
  endYear: number;
}
