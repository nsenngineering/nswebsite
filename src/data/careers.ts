export interface JobListing {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract';
  experience: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits?: string[];
  salary?: string;
  posted: string;
  active: boolean;
}

export const companyBenefits = [
  {
    title: 'Competitive Salary',
    description: 'Industry-leading compensation packages based on experience and qualifications',
    icon: 'DollarSign',
  },
  {
    title: 'Health Insurance',
    description: 'Comprehensive health insurance coverage for you and your family',
    icon: 'Heart',
  },
  {
    title: 'Professional Development',
    description: 'Training opportunities, certifications, and skill development programs',
    icon: 'GraduationCap',
  },
  {
    title: 'Modern Equipment',
    description: 'Work with state-of-the-art geotechnical testing and investigation equipment',
    icon: 'Wrench',
  },
  {
    title: 'Project Variety',
    description: 'Exposure to diverse projects including hydropower, highways, tunnels, and bridges',
    icon: 'Briefcase',
  },
  {
    title: 'Career Growth',
    description: 'Clear career progression paths and leadership opportunities',
    icon: 'TrendingUp',
  },
  {
    title: 'Team Environment',
    description: 'Collaborative work culture with experienced professionals',
    icon: 'Users',
  },
  {
    title: 'Safety First',
    description: 'Comprehensive safety training and equipment for all field operations',
    icon: 'Shield',
  },
];

// Job listings - currently empty (no openings)
// When positions open, add them to this array following the JobListing interface
export const jobListings: JobListing[] = [
  // Example job listing (commented out):
  // {
  //   id: 'geotechnical-engineer-2025',
  //   title: 'Geotechnical Engineer',
  //   department: 'Engineering',
  //   location: 'Lalitpur, Nepal',
  //   type: 'full-time',
  //   experience: '3-5 years',
  //   description: 'We are seeking an experienced Geotechnical Engineer to join our team...',
  //   requirements: [
  //     'Bachelor's or Master's degree in Civil Engineering with specialization in Geotechnical Engineering',
  //     '3-5 years of experience in geotechnical investigation and testing',
  //     'Proficiency in geotechnical analysis software (PLAXIS, GeoStudio, etc.)',
  //     'Strong understanding of soil mechanics and foundation engineering',
  //     'Experience with international standards (ASTM, ISO, BS)',
  //   ],
  //   responsibilities: [
  //     'Conduct geotechnical site investigations and prepare technical reports',
  //     'Analyze soil and rock test data and provide engineering recommendations',
  //     'Coordinate with project teams and clients',
  //     'Supervise field testing operations',
  //     'Review and approve laboratory test results',
  //   ],
  //   benefits: [
  //     'Competitive salary based on experience',
  //     'Health insurance',
  //     'Professional development opportunities',
  //     'Modern work environment',
  //   ],
  //   salary: 'Competitive (based on experience)',
  //   posted: '2025-01-15',
  //   active: true,
  // },
];

export const careerContact = {
  email: 'careers@nsengineering.com.np',
  phone: '+977-01-5260121',
  alternatePhone: '+977-9851228995',
  address: 'Bishal Niwash, 4th Cross, Jwagal, Lalitpur, Nepal',
};
