/**
 * TypeScript interfaces for Team Members CMS
 */

export interface TeamMember {
  name: string;
  role: string;
  education: string;
  experience: string;
  order: number;
  image?: string; // Optional image path (e.g., "/team/arun-pandit.jpg")
  hasImage: boolean; // Whether an image exists for this member
}

export interface TeamConfig {
  members: TeamMember[];
}
