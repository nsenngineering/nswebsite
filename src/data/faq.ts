export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface FAQCategory {
  id: string;
  label: string;
  icon: string;
}

export const faqCategories: FAQCategory[] = [
  { id: 'all', label: 'All Questions', icon: 'HelpCircle' },
  { id: 'services', label: 'Services & Testing', icon: 'Wrench' },
  { id: 'pricing', label: 'Pricing & Quotes', icon: 'DollarSign' },
  { id: 'technical', label: 'Technical Questions', icon: 'FileQuestion' },
  { id: 'general', label: 'General', icon: 'Info' },
];

export const faqData: FAQItem[] = [
  // Services & Testing
  {
    id: 'what-is-pile-testing',
    question: 'What is pile testing and why is it important?',
    answer:
      'Pile testing is a quality assurance process that verifies the structural integrity and load-bearing capacity of foundation piles. It is crucial for ensuring that piles can safely support the intended structural loads and meet design specifications. We offer multiple testing methods including PDA (high-strain dynamic testing), PIT (low-strain integrity testing), static load testing, and cross-hole sonic logging. Each method provides different insights into pile performance, helping engineers make informed decisions about foundation safety.',
    category: 'services',
  },
  {
    id: 'difference-pda-pit',
    question: 'What is the difference between PDA and PIT testing?',
    answer:
      'PDA (Pile Driving Analyzer) is a high-strain dynamic test that measures pile capacity and integrity during or after driving. It applies large impact forces and provides data on bearing capacity, soil resistance, and pile stresses. PIT (Pile Integrity Test) is a low-strain test that checks for defects, cracks, or changes in cross-section. PIT is faster and less expensive, ideal for integrity verification, while PDA provides comprehensive capacity data. Many projects use both methods for complete quality assurance.',
    category: 'services',
  },
  {
    id: 'geophysical-surveys',
    question: 'What geophysical surveys do you offer?',
    answer:
      'We conduct three main types of geophysical surveys: MASW (Multi-channel Analysis of Surface Waves) for shear wave velocity profiling, ERT (Electrical Resistivity Tomography) for subsurface imaging and groundwater detection, and Seismic Refraction Surveys for bedrock depth and seismic site classification. These non-invasive methods provide valuable subsurface information for site characterization, tunnel planning, slope stability assessment, and seismic hazard evaluation.',
    category: 'services',
  },
  {
    id: 'drilling-depth',
    question: 'What is your maximum drilling depth?',
    answer:
      'Our rotary drilling rigs can reach depths of up to 700 meters, making us capable of handling the most demanding geotechnical investigation projects in Nepal. We offer vertical, inclined, and horizontal drilling for various applications including subsurface exploration, hydropower projects, tunnel investigations, and deep foundation studies. Our experienced drilling crews and modern equipment ensure efficient operations even in challenging mountainous terrain.',
    category: 'services',
  },
  {
    id: 'lab-testing',
    question: 'What laboratory testing services are available?',
    answer:
      'Our ISO 9001:2015 certified laboratory in Lalitpur offers comprehensive soil and rock testing. Soil tests include: compaction (Proctor), CBR, triaxial shear, direct shear, consolidation, grain size analysis, Atterberg limits, and permeability. Rock tests include: unconfined compressive strength (UCS), point load tests, triaxial testing, Brazilian tensile strength, and core analysis. We provide fast turnaround times with accurate, reliable results for your project needs.',
    category: 'services',
  },
  {
    id: 'ndt-services',
    question: 'What Non-Destructive Testing (NDT) services do you provide?',
    answer:
      'Our NDT services include: concrete integrity testing using ultrasonic pulse velocity (UPV), rebound hammer testing for strength estimation, rebar detection and scanning to locate reinforcement, core cutting and testing, flat jack testing for in-situ stress measurement, and equi-potential testing. These methods allow assessment of existing structures without causing damage, ideal for renovation projects, structural health monitoring, and forensic investigations.',
    category: 'services',
  },

  // Pricing & Quotes
  {
    id: 'how-to-get-quote',
    question: 'How do I request a quote for testing services?',
    answer:
      'You can request a quote by clicking the "Request Quote" button in the top navigation, filling out our online form, or contacting us directly at +977-01-5260121 or info@nsengineering.com.np. Please provide details about your project location, type of testing required, number of tests, and timeline. We typically respond within 24 hours with a detailed quotation. For urgent projects, call us directly for immediate assistance.',
    category: 'pricing',
  },
  {
    id: 'pricing-factors',
    question: 'What factors affect the cost of geotechnical testing?',
    answer:
      'Pricing depends on several factors: type and complexity of tests, number of test locations, site accessibility (remote sites require mobilization costs), depth of investigation, project urgency, and whether laboratory or field testing is required. Volume discounts are available for large projects. We provide transparent pricing with no hidden costs. Contact us with your project details for an accurate quote tailored to your specific requirements.',
    category: 'pricing',
  },
  {
    id: 'payment-terms',
    question: 'What are your payment terms?',
    answer:
      'We typically work on a milestone-based payment schedule: 30% advance upon contract signing, 40% during fieldwork/testing phase, and 30% upon report delivery. For long-term projects or regular clients, we offer flexible payment arrangements. We accept bank transfers, cheques, and cash payments. All invoices include detailed breakdowns of services rendered. Contact our billing department for specific payment arrangements for your project.',
    category: 'pricing',
  },

  // Technical Questions
  {
    id: 'report-turnaround',
    question: 'How long does it take to receive test reports?',
    answer:
      'Standard turnaround time is 7-10 working days for laboratory tests and 5-7 days for field testing reports after completion of fieldwork. Urgent projects can be expedited (24-48 hours) with additional charges. Reports include test methodology, data tables, graphs, analysis, and recommendations. All reports are reviewed by senior engineers and comply with relevant international standards (ASTM, ISO, BS). Digital reports are provided via email, with hard copies available upon request.',
    category: 'technical',
  },
  {
    id: 'standards-compliance',
    question: 'Which international standards do you follow?',
    answer:
      'We follow internationally recognized testing standards including ASTM (American Society for Testing and Materials), ISO (International Organization for Standardization), BS (British Standards), and IS (Indian Standards) where applicable. Our ISO 9001:2015 certification ensures quality management in all testing procedures. Our reports clearly reference the specific standards used for each test, ensuring your project meets international quality benchmarks and regulatory requirements.',
    category: 'technical',
  },
  {
    id: 'equipment-calibration',
    question: 'How is your equipment calibrated and maintained?',
    answer:
      'All our testing equipment undergoes regular calibration according to manufacturer specifications and international standards. We maintain calibration certificates for all instruments and perform routine maintenance checks. Our pile testing equipment (PDA, PIT) is calibrated by certified technicians. Laboratory equipment follows annual calibration schedules with traceability to national/international standards. This ensures accuracy and reliability of all test results we provide.',
    category: 'technical',
  },
  {
    id: 'site-access',
    question: 'Do you work in remote or difficult-to-access locations?',
    answer:
      'Yes, we have extensive experience working in challenging terrain throughout Nepal, including remote mountainous areas, steep slopes, and limited-access sites. Our equipment can be transported via road, helicopter, or manual carrying as needed. We have successfully completed projects in all regions of Nepal, from the Terai plains to high-altitude Himalayan sites. Our experienced field crews are trained to work safely and efficiently in difficult conditions.',
    category: 'technical',
  },

  // General Questions
  {
    id: 'project-locations',
    question: 'Where do you provide services?',
    answer:
      'We provide geotechnical services throughout Nepal, including Kathmandu Valley, Eastern Nepal, Central Nepal, and Western Nepal. Our head office and laboratory are located in Lalitpur, but we have successfully completed projects in all 7 provinces. We have worked on major infrastructure projects including the Kathmandu-Terai Fast Track, multiple hydropower projects, transmission lines, bridges, and tunnels across the country.',
    category: 'general',
  },
  {
    id: 'company-experience',
    question: 'How long has NS Engineering been in operation?',
    answer:
      'NS Engineering & Geotechnical Services has been providing professional geotechnical services for over 10 years. We have completed hundreds of projects for government agencies, international consultants, and private developers. Our team includes experienced directors, senior engineers, geologists, and technicians with decades of combined experience. We are an ISO 9001:2015 certified company committed to quality, safety, and technical excellence.',
    category: 'general',
  },
  {
    id: 'international-clients',
    question: 'Do you work with international consultants?',
    answer:
      'Yes, we have extensive experience working with international consulting firms from China, Japan, Germany, UK, France, Canada, Italy, Australia, India, Norway, Finland, Austria, Netherlands, USA, Malaysia, and New Zealand. We understand international project requirements, reporting formats, and quality standards. Our technical staff can communicate effectively in English and are familiar with international best practices in geotechnical engineering.',
    category: 'general',
  },
  {
    id: 'emergency-services',
    question: 'Do you provide emergency or urgent testing services?',
    answer:
      'Yes, we offer expedited services for urgent projects or emergency situations. Our team can mobilize within 24-48 hours for critical projects, and we provide rush report delivery for time-sensitive situations. Emergency services are available 24/7 for disaster response, structural emergencies, or project-critical testing needs. Additional charges apply for expedited services. Contact our emergency hotline at +977-9851228995 for immediate assistance.',
    category: 'general',
  },
  {
    id: 'safety-protocols',
    question: 'What safety measures do you follow on site?',
    answer:
      'Safety is our top priority. We follow strict safety protocols including: mandatory PPE (helmets, safety boots, vests) for all personnel, pre-project safety briefings and risk assessments, regular equipment safety checks, trained safety officers on major projects, and adherence to international safety standards. We have maintained an excellent safety record with zero major accidents. Our current achievement is 18 consecutive months without Lost Time Injuries (LTI).',
    category: 'general',
  },
  {
    id: 'quality-assurance',
    question: 'What quality assurance processes do you have?',
    answer:
      'As an ISO 9001:2015 certified company, we maintain rigorous quality management systems. Our QA processes include: documented standard operating procedures (SOPs), regular equipment calibration, independent review of test results by senior engineers, participation in proficiency testing programs, detailed record-keeping and traceability, and continuous staff training. All reports undergo technical review before delivery to ensure accuracy and compliance with project specifications.',
    category: 'general',
  },
  {
    id: 'staff-qualifications',
    question: 'What are the qualifications of your technical staff?',
    answer:
      'Our team includes highly qualified professionals: Directors with MSc/PhD degrees and 15-30 years of experience, licensed professional engineers and geologists, ASTM/ISO trained testing technicians, and certified equipment operators. Our Managing Director, Arun Kumar Pandit, holds an MSc in Geotechnical Engineering with 19 years of experience. We invest in continuous professional development to ensure our team stays current with latest technologies and best practices.',
    category: 'general',
  },
];
