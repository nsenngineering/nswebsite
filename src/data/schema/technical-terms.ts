/**
 * Technical Terminology Definitions for AI SEO
 *
 * Defines geotechnical acronyms and terms to help AI assistants understand
 * and explain NS Engineering's specialized services.
 */

export interface TechnicalTerm {
  acronym: string;
  fullName: string;
  description: string;
  relatedServiceId: string; // Service ID from services.json
}

/**
 * Priority geotechnical terms for AI citation
 * These are the most commonly searched and queried acronyms
 */
export const technicalTerms: TechnicalTerm[] = [
  {
    acronym: 'PDA',
    fullName: 'Pile Driving Analyzer',
    description:
      'High-strain dynamic testing method for real-time pile capacity verification during driving operations. Uses strain gauges and accelerometers to measure force and velocity, calculating bearing capacity and pile integrity.',
    relatedServiceId: 'pda-testing',
  },
  {
    acronym: 'PIT',
    fullName: 'Pile Integrity Test',
    description:
      'Low-strain non-destructive testing method that evaluates pile integrity by analyzing stress wave reflections. Can detect cracks, necking, bulging, and soil inclusions along the pile shaft.',
    relatedServiceId: 'pit-testing',
  },
  {
    acronym: 'MASW',
    fullName: 'Multi-channel Analysis of Surface Waves',
    description:
      'Geophysical survey method that analyzes seismic surface waves to determine shear wave velocity profiles. Used for site characterization and soil layer identification.',
    relatedServiceId: 'masw',
  },
  {
    acronym: 'SPT',
    fullName: 'Standard Penetration Test',
    description:
      'In-situ soil investigation method that measures soil resistance by driving a split-spoon sampler. The blow count (N-value) indicates soil density and strength. Widely used for foundation design.',
    relatedServiceId: 'spt',
  },
  {
    acronym: 'CBR',
    fullName: 'California Bearing Ratio',
    description:
      'Laboratory or in-situ test measuring the mechanical strength of road sub-grades and base courses. Critical parameter for pavement design and road construction quality control.',
    relatedServiceId: 'soil-lab',
  },
  {
    acronym: 'UCS',
    fullName: 'Unconfined Compressive Strength',
    description:
      'Laboratory test measuring the maximum axial compressive stress that a rock or soil specimen can withstand under zero confining stress. Essential for foundation and slope stability analysis.',
    relatedServiceId: 'rock-lab',
  },
  {
    acronym: 'NDT',
    fullName: 'Non-Destructive Testing',
    description:
      'Testing techniques that evaluate concrete structures and foundations without causing damage. Includes methods like rebound hammer, ultrasonic pulse velocity, rebar detection, and concrete integrity scanning.',
    relatedServiceId: 'ndt-testing',
  },
  {
    acronym: 'ERT',
    fullName: 'Electrical Resistivity Tomography',
    description:
      'Geophysical imaging technique that measures ground electrical resistivity variations to map subsurface conditions. Used for groundwater investigation, landfill characterization, and archaeological surveys.',
    relatedServiceId: 'ert',
  },
];
