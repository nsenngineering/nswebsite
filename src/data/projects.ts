export interface Project {
  id: string;
  title: string;
  client: string;
  category: 'pile-testing' | 'tunnel-road' | 'hydropower' | 'transmission' | 'ndt';
  year: number;
  scope: string[];
  location: string;
  imageUrl?: string;
}

export const projectCategories = [
  { id: 'all', label: 'All Projects' },
  { id: 'pile-testing', label: 'Pile Testing' },
  { id: 'tunnel-road', label: 'Tunnel & Road' },
  { id: 'hydropower', label: 'Hydropower' },
  { id: 'transmission', label: 'Transmission Lines' },
  { id: 'ndt', label: 'NDT Services' },
];

export const projects: Project[] = [
  // Pile Testing Projects
  {
    id: 'ktft-fast-track',
    title: 'KTFT Project (Fast Track)',
    client: 'Kumar-Roshan-Sichuwan JV',
    category: 'pile-testing',
    year: 2024,
    location: 'Kathmandu Valley',
    scope: [
      '50 nos PDA (Pile Driving Analyzer)',
      '17 nos Lateral Load Test',
      '16 nos Cross Hole Sonic Logging'
    ]
  },
  {
    id: 'mugling-pokhara',
    title: 'SAEC Mugling-Pokhara Highway Phase-I',
    client: 'ANK-ZIEC JV',
    category: 'pile-testing',
    year: 2023,
    location: 'Mugling-Pokhara',
    scope: [
      '7 nos PDA Testing'
    ]
  },
  {
    id: 'kanchanpur-kamala',
    title: 'Kanchanpur-Kamala Road Project',
    client: 'China Railway No.2 Engineering',
    category: 'pile-testing',
    year: 2023,
    location: 'Kanchanpur-Kamala',
    scope: [
      '42 nos PDA Testing',
      '370 nos PIT (Pile Integrity Test)',
      '49 nos Static Load Test'
    ]
  },
  {
    id: 'ktft-package-07',
    title: 'KTFT Package-07',
    client: 'Xingrun-Ashish-Tundi JV',
    category: 'pile-testing',
    year: 2024,
    location: 'Kathmandu Valley',
    scope: [
      '160 nos PIT',
      '2 nos PDA',
      '10 nos Lateral Load Test',
      '60 nos Cross Hole Sonic Logging',
      '2 nos Pile Pull Out Test',
      '2 nos Plate Load Test',
      '6 nos Anchorage Vertical Load Test',
      '4 nos Rebar Pull Out Test'
    ]
  },
  {
    id: 'mahendra-highway',
    title: 'Mahendra Highway Upgrade Project',
    client: 'WEG-RCC JV',
    category: 'pile-testing',
    year: 2023,
    location: 'Mahendra Highway',
    scope: [
      '156 nos PIT',
      '6 nos PDA',
      '5 nos Anchorage Load Test'
    ]
  },
  {
    id: 'double-lane-expressway',
    title: 'Double Lane Dual Carriageway Expressway',
    client: 'Xingrun-Ashish-Tundi JV',
    category: 'pile-testing',
    year: 2024,
    location: 'Nepal',
    scope: [
      '183 nos PIT',
      '2 nos PDA',
      '15 nos Lateral Load Test',
      '93 nos Cross Hole Sonic Logging',
      '3 nos Pile Pull Out Test',
      '11 nos Plate Load Test',
      '12 nos Anchorage Load Test',
      '4 nos Rebar Pull Out Test'
    ]
  },

  // Tunnel & Road Projects
  {
    id: 'mahadevtar-tunnel',
    title: 'KTFT Mahadevtar Tunnel',
    client: 'Henan Communication & Planning Design Institute',
    category: 'tunnel-road',
    year: 2023,
    location: 'Kathmandu Valley',
    scope: [
      'Drilling up to 320m depth',
      'Rock sample testing',
      'Magnetotelluric Survey (depth up to 800m)'
    ]
  },
  {
    id: '5-road-tunnels',
    title: '5 Road Tunnels Feasibility Study',
    client: 'Department of Road Maintenance',
    category: 'tunnel-road',
    year: 2022,
    location: 'Multiple Locations',
    scope: [
      '2D ERT (Electrical Resistivity Tomography)',
      'Geological Study',
      'Seismic hazard analysis',
      'Tunnels: Kulekhani-Bhimphedi, Banepa-Sindhuli, Pokhara-Baglung, Lamjung-Besisahar, Butwal-Narayanghat'
    ]
  },
  {
    id: 'ktft-cp10',
    title: 'KTFT Package CP10',
    client: 'CREGC-COVEC JV',
    category: 'tunnel-road',
    year: 2023,
    location: 'Kathmandu Valley',
    scope: [
      'Rotary drilling',
      'ERT, SRT, MAM, MT surveys',
      'Geological & Engineering Survey',
      'Detailed Slope Investigation',
      'Hydrological Survey'
    ]
  },
  {
    id: 'ktft-cp8b',
    title: 'KTFT Package CP8B',
    client: 'Molidan Construction Sewa',
    category: 'tunnel-road',
    year: 2023,
    location: 'Kathmandu Valley',
    scope: [
      'Rotary Drilling',
      'SRT (Seismic Refraction Tomography)',
      'Geological Survey',
      'Hydrological Study',
      'Seismic Safety analysis'
    ]
  },
  {
    id: 'ktft-cp9b',
    title: 'KTFT Package CP9B',
    client: 'XCGC-Hanuman Baniya JV',
    category: 'tunnel-road',
    year: 2023,
    location: 'Kathmandu Valley',
    scope: [
      'Rotary drilling',
      'ERT, SRT, MAM, MT surveys',
      'Geological Survey',
      'Slope Investigation'
    ]
  },

  // Hydropower Projects
  {
    id: 'upper-trishuli',
    title: 'Upper Trishuli HEP',
    client: 'Power Construction Corporation of China',
    category: 'hydropower',
    year: 2022,
    location: 'Rasuwa',
    scope: [
      'Vertical, Inclined, Horizontal drilling',
      'Rock sample testing',
      'Geotechnical investigation'
    ]
  },
  {
    id: 'nalgad',
    title: 'Nalgad Hydropower Project',
    client: 'SMEC-MWH JV',
    category: 'hydropower',
    year: 2021,
    location: 'Jajarkot',
    scope: [
      '284m depth drilling',
      '4 nos In-situ Direct Shear Test',
      '9 nos Plate Jacking Test',
      'Piezometer installation',
      'Rock sample testing'
    ]
  },
  {
    id: 'lower-solu',
    title: 'Lower Solu HEP',
    client: 'Aera Consultant',
    category: 'hydropower',
    year: 2021,
    location: 'Solukhumbu',
    scope: [
      'Core drilling',
      'Rock sample testing',
      'Geotechnical investigation'
    ]
  },
  {
    id: 'upper-bheri',
    title: 'Upper Bheri HEP 325 MW',
    client: 'Integrated Mobility Solutions',
    category: 'hydropower',
    year: 2022,
    location: 'Dailekh',
    scope: [
      'ERT Survey',
      'SRT Survey',
      'MASW Survey'
    ]
  },
  {
    id: 'mewa-khola',
    title: 'Mewa Khola HEP 50 MW',
    client: 'Mewa Developers Ltd.',
    category: 'hydropower',
    year: 2020,
    location: 'Sankhuwasabha',
    scope: [
      'Core drilling',
      'Field testing',
      'Laboratory testing',
      'Liquefaction analysis',
      'Bearing capacity assessment'
    ]
  },
  {
    id: 'bhotekoshi',
    title: 'Bhotekoshi 1 Hydropower',
    client: 'Electropower Company Limited',
    category: 'hydropower',
    year: 2021,
    location: 'Sindhupalchok',
    scope: [
      'Vertically upward drilling',
      'Rock testing'
    ]
  },
  {
    id: 'upper-arun',
    title: 'Upper Arun HEP',
    client: 'NEA Engineering Company',
    category: 'hydropower',
    year: 2022,
    location: 'Sankhuwasabha',
    scope: [
      'Block Shear Test',
      'Plate jacking test',
      'Dilatometer test'
    ]
  },
  {
    id: 'super-trishuli',
    title: 'Super Trishuli HEP (100 MW)',
    client: 'CE Construction',
    category: 'hydropower',
    year: 2021,
    location: 'Nuwakot',
    scope: [
      'Direct Shear Test',
      'Geotechnical investigation'
    ]
  },
  {
    id: 'upper-tamor',
    title: 'Upper Tamor A Hydropower',
    client: 'Union Hydropower Ltd',
    category: 'hydropower',
    year: 2022,
    location: 'Taplejung',
    scope: [
      'Detailed Geotechnical Investigation',
      'Drilling and sampling'
    ]
  },

  // Transmission Line Projects
  {
    id: 'amlekhgunj-substation',
    title: 'Amlekhgunj 132/66/11KV Substation',
    client: 'TBEA Co. Ltd.',
    category: 'transmission',
    year: 2021,
    location: 'Bara',
    scope: [
      'Detailed Geotechnical Investigation',
      'Foundation design parameters'
    ]
  },
  {
    id: 'kohalpur-surkhet',
    title: 'Kohalpur-Surkhet-Upper Karnali 400KV',
    client: 'ELC Electroconsult SPA',
    category: 'transmission',
    year: 2022,
    location: 'Western Nepal',
    scope: [
      'Detailed Geotechnical Investigation',
      'Tower foundation assessment'
    ]
  },
  {
    id: 'tingla-anarmani',
    title: 'Different Substation and Transmission Lines (SS9 Anarmani, SS4 Tingla, TL3)',
    client: 'ELC Electroconsult SPA',
    category: 'transmission',
    year: 2022,
    location: 'Eastern Nepal',
    scope: [
      'Detailed Geotechnical Investigation',
      'Foundation design'
    ]
  },
  {
    id: 'inaruwa-arun',
    title: 'TL1, Inaruwa-Arun Hub, SS3, SS1-Arun Hub Transmission Lines',
    client: 'ELC Electroconsult SPA',
    category: 'transmission',
    year: 2023,
    location: 'Eastern Nepal',
    scope: [
      'Detailed Geotechnical Investigation',
      'Soil investigation for substations'
    ]
  },
  {
    id: 'karmadev-phukot',
    title: 'Karmadev-Phukot 400 kV Double Circuit Karnali Corridor',
    client: 'Jade Consult',
    category: 'transmission',
    year: 2023,
    location: 'Western Nepal',
    scope: [
      'Detailed Soil investigation',
      'Tower foundation study'
    ]
  },

  // NDT Projects
  {
    id: 'france-embassy',
    title: 'France Embassy, Lazimpath',
    client: 'Miyamoto International Nepal',
    category: 'ndt',
    year: 2020,
    location: 'Kathmandu',
    scope: [
      'Re-bar Scanning',
      'Push Shear Test',
      'Schmidt Hammer Test'
    ]
  },
  {
    id: 'sanepa-apartment',
    title: 'Sanepa Apartment, Lalitpur',
    client: 'Miyamoto International Nepal',
    category: 'ndt',
    year: 2020,
    location: 'Lalitpur',
    scope: [
      'Rebound Hammer Test',
      'Rebar Scan',
      'Core Cut',
      'UPVT (Ultrasonic Pulse Velocity Test)',
      'Equi-potential test'
    ]
  },
  {
    id: 'park-view-horizon',
    title: 'Park View Horizon',
    client: 'Park View Horizon',
    category: 'ndt',
    year: 2021,
    location: 'Kathmandu',
    scope: [
      'Ultrasonic Pulse Velocity test',
      'Structural assessment'
    ]
  },
  {
    id: 'gopichandra-mahabihar',
    title: 'Gopichandra Mahabihar, Lalitpur',
    client: 'Prakritik Sanu Suwal JV',
    category: 'ndt',
    year: 2020,
    location: 'Lalitpur',
    scope: [
      'Flat Jack test',
      'Structural assessment'
    ]
  },
  {
    id: 'skyone-tower',
    title: 'Skyone Tower, Naxal',
    client: 'Skyline Developers',
    category: 'ndt',
    year: 2021,
    location: 'Kathmandu',
    scope: [
      'Rebound Hammer Test',
      'Rebar Scan',
      'UPVT'
    ]
  },
  {
    id: 'lalbakaiya-bridge',
    title: 'Lalbakaiya River Bridge (28 piles)',
    client: 'Road Division, Chandranigahapur',
    category: 'ndt',
    year: 2022,
    location: 'Sarlahi',
    scope: [
      'Schmidt Hammer Test',
      'Ultrasonic Pulse Velocity',
      'Rebar Scanning',
      'MASW Survey'
    ]
  },
  {
    id: 'british-gurkhas',
    title: 'DIO (NEPAL) BRITISH GURKHAS',
    client: 'Miyamoto International Nepal',
    category: 'ndt',
    year: 2021,
    location: 'Kathmandu',
    scope: [
      'Rebar Scanning',
      'Schmidt Rebound Hammer',
      'Core Cutting',
      'UCS Testing'
    ]
  }
];
