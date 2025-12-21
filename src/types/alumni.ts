export interface Alumni {
  id: string;
  name: string;
  yearFrom: number;
  yearTo: number;
  yearsWorked: string;           // Computed: "2015 - 2018" or "2015 - Present"
  achievements: string[];         // Semicolon-separated in CSV
  linkedinUrl?: string;
  testimonial: string;
  profileImage?: string;          // Auto-detected or fallback
  featured?: boolean;
}
