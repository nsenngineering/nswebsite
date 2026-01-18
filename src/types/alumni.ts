export interface Alumni {
  id: string;
  name: string;
  yearFrom?: number;              // Optional - alumni shows without year info if missing
  yearTo?: number;                // Optional - alumni shows without year info if missing
  yearsWorked?: string;           // Computed: "2015 - 2018" or "2015 - Present" (only if years provided)
  achievements: string[];         // Semicolon-separated in CSV
  linkedinUrl?: string;
  testimonial: string;
  profileImage?: string;          // Auto-detected or fallback
  featured?: boolean;
}
