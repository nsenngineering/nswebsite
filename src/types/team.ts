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
  featured?: boolean; // Whether to show in leadership section (defaults to false)
  linkedinUrl?: string; // Optional LinkedIn profile URL
  specializations?: string[]; // Array of expertise areas (parsed from semicolon-separated)
}

export interface TeamConfig {
  members: TeamMember[];
}
