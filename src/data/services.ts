import { Service } from '@/types/service';

export const services: Service[] = [
  // Pile Testing Services
  {
    id: 'pda-testing',
    category: 'pile-testing',
    name: 'Pile Driving Analyzer (PDA)',
    shortDescription: 'High-strain dynamic testing for pile capacity verification',
    fullDescription: 'PDA testing provides real-time analysis of pile capacity during driving operations. This advanced method uses strain gauges and accelerometers to measure force and velocity, calculating bearing capacity and pile integrity.',
    processSteps: [
      'Install sensors on pile head',
      'Monitor pile driving process',
      'Capture stress wave data',
      'Analyze capacity and integrity',
      'Generate comprehensive report'
    ],
    equipmentUsed: ['PDA System', 'Strain Transducers', 'Accelerometers'],
    typicalDeliverables: ['PDA Report', 'Capacity Analysis', 'Driving Record', 'Wave Match Analysis'],
    icon: 'Hammer',
    image: '/images/services/pda-testing.jpg',
    diagram: '/images/diagrams/pda-process.svg'
  },
  {
    id: 'pit-testing',
    category: 'pile-testing',
    name: 'Pile Integrity Test (PIT)',
    shortDescription: 'Low-strain integrity testing for pile defect detection',
    fullDescription: 'PIT is a non-destructive testing method that evaluates pile integrity by analyzing stress wave reflections. It can detect cracks, necking, bulging, and soil inclusions along the pile shaft.',
    processSteps: [
      'Prepare pile head surface',
      'Apply light impact',
      'Record wave reflections',
      'Analyze signal patterns',
      'Identify defects and anomalies'
    ],
    equipmentUsed: ['PIT Equipment', 'Accelerometer', 'Impact Hammer'],
    typicalDeliverables: ['PIT Report', 'Velocity Records', 'Integrity Assessment', 'Defect Locations'],
    icon: 'Activity',
    image: '/images/services/pit-testing.jpg',
    diagram: '/images/diagrams/pit-process.svg'
  },
  {
    id: 'static-load-test',
    category: 'pile-testing',
    name: 'Static Load Test',
    shortDescription: 'Direct measurement of pile load-settlement behavior',
    fullDescription: 'Static load testing is the most reliable method for determining pile capacity. It directly measures pile behavior under applied loads, providing definitive capacity values and load-settlement characteristics.',
    processSteps: [
      'Install reaction system',
      'Set up hydraulic jacks and gauges',
      'Apply incremental loads',
      'Monitor settlement continuously',
      'Analyze load-settlement curve'
    ],
    equipmentUsed: ['Hydraulic Jacks', 'Load Cells', 'Dial Gauges', 'Reaction System'],
    typicalDeliverables: ['Load Test Report', 'Load-Settlement Curves', 'Ultimate Capacity Analysis', 'Safety Factor Assessment'],
    icon: 'TrendingUp',
    image: '/images/services/static-load-test.jpg'
  },
  {
    id: 'crosshole-sonic-logging',
    category: 'pile-testing',
    name: 'Cross-Hole Sonic Logging',
    shortDescription: 'Advanced integrity testing for drilled shafts',
    fullDescription: 'CSL uses ultrasonic pulses transmitted between access tubes to evaluate concrete quality throughout the pile length. This method can detect defects, voids, and concrete segregation.',
    processSteps: [
      'Install access tubes during concreting',
      'Lower probes into tubes',
      'Transmit ultrasonic pulses',
      'Measure wave velocity and energy',
      'Map concrete quality in 3D'
    ],
    equipmentUsed: ['CSL Equipment', 'Access Tubes', 'Ultrasonic Probes'],
    typicalDeliverables: ['CSL Report', 'Velocity Maps', '3D Quality Assessment', 'Defect Identification'],
    icon: 'Radio',
    image: '/images/services/crosshole-sonic.jpg'
  },
  {
    id: 'rebar-detection',
    category: 'pile-testing',
    name: 'Rebar Detection & Scanning',
    shortDescription: 'Non-destructive location of reinforcement in concrete',
    fullDescription: 'Advanced electromagnetic scanning to locate reinforcing steel, determine cover depth, and assess rebar spacing and size in existing concrete structures.',
    processSteps: [
      'Scan concrete surface',
      'Identify rebar locations',
      'Measure cover depth',
      'Determine rebar spacing',
      'Generate detailed maps'
    ],
    equipmentUsed: ['Rebar Scanner', 'GPR Equipment', 'Cover Meter'],
    typicalDeliverables: ['Rebar Location Maps', 'Cover Depth Report', 'Spacing Analysis', 'Detailed Drawings'],
    icon: 'Grid',
    image: '/images/services/rebar-detection.jpg'
  },

  // Soil Laboratory Services
  {
    id: 'compaction-test',
    category: 'soil-laboratory',
    name: 'Compaction Test (Proctor)',
    shortDescription: 'Determine optimum moisture content and maximum dry density',
    fullDescription: 'Standard and modified Proctor tests to establish soil compaction characteristics. Essential for quality control in earthwork and road construction projects.',
    processSteps: [
      'Prepare soil samples',
      'Compact in standard mold',
      'Vary moisture content',
      'Measure dry density',
      'Plot compaction curve'
    ],
    equipmentUsed: ['Proctor Mold', 'Compaction Hammer', 'Oven', 'Balance'],
    typicalDeliverables: ['Compaction Curve', 'OMC Value', 'MDD Value', 'Test Report'],
    icon: 'Layers',
    image: '/images/services/compaction-test.jpg'
  },
  {
    id: 'cbr-test',
    category: 'soil-laboratory',
    name: 'California Bearing Ratio (CBR)',
    shortDescription: 'Evaluate subgrade strength for pavement design',
    fullDescription: 'CBR testing measures soil strength for pavement design. It determines the bearing capacity of soil and aggregates for road construction applications.',
    processSteps: [
      'Prepare compacted specimen',
      'Soak sample (if required)',
      'Measure swell',
      'Perform penetration test',
      'Calculate CBR value'
    ],
    equipmentUsed: ['CBR Mold', 'Loading Machine', 'Dial Gauges', 'Surcharge Weights'],
    typicalDeliverables: ['CBR Report', 'Load-Penetration Curve', 'Swell Data', 'Design Recommendations'],
    icon: 'BarChart',
    image: '/images/services/cbr-test.jpg'
  },
  {
    id: 'triaxial-test',
    category: 'soil-laboratory',
    name: 'Triaxial Shear Test',
    shortDescription: 'Determine shear strength parameters of soil',
    fullDescription: 'Advanced laboratory testing to determine cohesion and angle of internal friction. Essential for slope stability, foundation design, and earth pressure calculations.',
    processSteps: [
      'Prepare cylindrical specimen',
      'Set up in triaxial cell',
      'Apply confining pressure',
      'Axially load to failure',
      'Calculate shear parameters'
    ],
    equipmentUsed: ['Triaxial Cell', 'Loading Frame', 'Pressure System', 'Data Logger'],
    typicalDeliverables: ['Shear Strength Parameters', 'Mohr Circle', 'Stress-Strain Curves', 'Test Report'],
    icon: 'Triangle',
    image: '/images/services/triaxial-test.jpg'
  },
  {
    id: 'direct-shear',
    category: 'soil-laboratory',
    name: 'Direct Shear Test',
    shortDescription: 'Measure shear strength along a predetermined plane',
    fullDescription: 'Direct shear testing determines shear strength parameters by forcing failure along a horizontal plane. Quick and economical method for cohesionless soils.',
    processSteps: [
      'Place sample in shear box',
      'Apply normal load',
      'Apply horizontal shear force',
      'Record displacement and load',
      'Determine shear parameters'
    ],
    equipmentUsed: ['Shear Box', 'Loading Frame', 'Proving Ring', 'Dial Gauges'],
    typicalDeliverables: ['Shear Strength Parameters', 'Failure Envelope', 'Test Report'],
    icon: 'Scissors',
    image: '/images/services/direct-shear.jpg'
  },
  {
    id: 'grain-size-analysis',
    category: 'soil-laboratory',
    name: 'Grain Size Analysis',
    shortDescription: 'Particle size distribution by sieving and hydrometer',
    fullDescription: 'Comprehensive particle size distribution analysis combining sieve analysis for coarse particles and hydrometer method for fine particles. Essential for soil classification.',
    processSteps: [
      'Dry and weigh sample',
      'Sieve through standard sieves',
      'Perform hydrometer test for fines',
      'Calculate percentages',
      'Plot gradation curve'
    ],
    equipmentUsed: ['Sieve Set', 'Hydrometer', 'Mechanical Shaker', 'Balance'],
    typicalDeliverables: ['Gradation Curve', 'Soil Classification', 'D10, D30, D60 Values', 'Test Report'],
    icon: 'Filter',
    image: '/images/services/grain-size.jpg'
  },

  // Rock Laboratory Services
  {
    id: 'ucs-test',
    category: 'rock-laboratory',
    name: 'Unconfined Compressive Strength (UCS)',
    shortDescription: 'Determine compressive strength of rock cores',
    fullDescription: 'Standard test to measure the uniaxial compressive strength of rock specimens. Critical parameter for rock mass classification and foundation design on rock.',
    processSteps: [
      'Prepare rock core specimen',
      'Ensure parallel end surfaces',
      'Place in compression machine',
      'Load to failure',
      'Calculate UCS value'
    ],
    equipmentUsed: ['Compression Testing Machine', 'Core Cutting Machine', 'End Grinding Machine'],
    typicalDeliverables: ['UCS Value', 'Stress-Strain Curve', 'Failure Mode', 'Test Report'],
    icon: 'Box',
    image: '/images/services/ucs-test.jpg'
  },
  {
    id: 'point-load-test',
    category: 'rock-laboratory',
    name: 'Point Load Test',
    shortDescription: 'Quick index test for rock strength estimation',
    fullDescription: 'Simple field and laboratory test to estimate rock strength. Results can be correlated with UCS. Useful for preliminary assessments and when core samples are limited.',
    processSteps: [
      'Prepare rock lump or core',
      'Place between point load platens',
      'Apply load until failure',
      'Measure failure load and dimensions',
      'Calculate Point Load Index'
    ],
    equipmentUsed: ['Point Load Tester', 'Caliper', 'Core Samples'],
    typicalDeliverables: ['Point Load Index', 'Estimated UCS', 'Test Report'],
    icon: 'Zap',
    image: '/images/services/point-load.jpg'
  },

  // Drilling & Field Investigation
  {
    id: 'rotary-drilling',
    category: 'drilling',
    name: 'Rotary Core Drilling',
    shortDescription: 'Deep drilling up to 600m for soil and rock investigation',
    fullDescription: 'Advanced rotary drilling for deep subsurface investigation. Provides continuous core samples for detailed geological and geotechnical analysis.',
    processSteps: [
      'Set up drilling rig',
      'Advance borehole with coring',
      'Retrieve core samples',
      'Log soil/rock strata',
      'Install monitoring instruments if required'
    ],
    equipmentUsed: ['Rotary Drilling Rig', 'Core Barrels', 'Drilling Mud System'],
    typicalDeliverables: ['Borehole Log', 'Core Samples', 'SPT/Rock Core', 'Groundwater Data'],
    icon: 'Drill',
    image: '/images/services/rotary-drilling.jpg'
  },
  {
    id: 'spt-test',
    category: 'drilling',
    name: 'Standard Penetration Test (SPT)',
    shortDescription: 'In-situ soil strength and sampling method',
    fullDescription: 'Most common in-situ test for soil investigation. Provides N-values for soil strength estimation and disturbed samples for classification.',
    processSteps: [
      'Drill to test depth',
      'Insert SPT sampler',
      'Drive with standard hammer',
      'Count blows for 30cm penetration',
      'Retrieve soil sample'
    ],
    equipmentUsed: ['SPT Sampler', 'Drop Hammer (63.5 kg)', 'Drilling Rig'],
    typicalDeliverables: ['SPT N-values', 'Borehole Log', 'Soil Samples', 'Correlation with Properties'],
    icon: 'Gauge',
    image: '/images/services/spt-test.jpg'
  },

  // Geophysical Services
  {
    id: 'masw-survey',
    category: 'geophysical',
    name: 'MASW (Multi-channel Analysis of Surface Waves)',
    shortDescription: 'Seismic method for shear wave velocity profiling',
    fullDescription: 'Non-invasive geophysical method to determine shear wave velocity (Vs) profile. Essential for seismic site classification and liquefaction assessment.',
    processSteps: [
      'Deploy geophone array',
      'Generate seismic waves',
      'Record surface wave data',
      'Process dispersion curve',
      'Invert for Vs profile'
    ],
    equipmentUsed: ['Seismograph', 'Geophones', 'Seismic Source', 'Analysis Software'],
    typicalDeliverables: ['Vs30 Value', 'Shear Wave Velocity Profile', 'Site Classification', 'Test Report'],
    icon: 'Waves',
    image: '/images/services/masw-survey.jpg'
  },
  {
    id: 'ert-survey',
    category: 'geophysical',
    name: 'Electrical Resistivity Tomography (ERT)',
    shortDescription: '2D/3D subsurface imaging using resistivity',
    fullDescription: 'Advanced geophysical imaging technique for mapping subsurface variations. Useful for groundwater detection, cavity mapping, and contamination studies.',
    processSteps: [
      'Layout electrode array',
      'Inject current and measure potential',
      'Collect data at multiple configurations',
      'Process and invert data',
      'Generate 2D/3D resistivity model'
    ],
    equipmentUsed: ['Resistivity Meter', 'Electrodes', 'Cables', 'Inversion Software'],
    typicalDeliverables: ['Resistivity Sections', 'Interpreted Model', 'Geological Mapping', 'Report'],
    icon: 'Map',
    image: '/images/services/ert-survey.jpg'
  },
  {
    id: 'seismic-refraction',
    category: 'geophysical',
    name: 'Seismic Refraction Survey',
    shortDescription: 'Determine depth to bedrock and layer velocities',
    fullDescription: 'Classic geophysical method for determining depth to competent layers and seismic velocities. Widely used for foundation design and excavation planning.',
    processSteps: [
      'Layout seismic line',
      'Position geophones',
      'Generate seismic waves',
      'Record first arrivals',
      'Interpret layer depths and velocities'
    ],
    equipmentUsed: ['Seismograph', 'Geophones', 'Seismic Source'],
    typicalDeliverables: ['Seismic Velocity Profile', 'Bedrock Depth', 'Layer Thicknesses', 'Report'],
    icon: 'TrendingUp',
    image: '/images/services/seismic-refraction.jpg'
  },
];

export const serviceCategories = [
  {
    id: 'pile-testing',
    name: 'Pile Testing',
    description: 'Comprehensive pile foundation testing services',
    icon: 'Hammer',
  },
  {
    id: 'soil-laboratory',
    name: 'Soil Laboratory',
    description: 'Complete soil testing and analysis',
    icon: 'Beaker',
  },
  {
    id: 'rock-laboratory',
    name: 'Rock Laboratory',
    description: 'Rock mechanics and strength testing',
    icon: 'Box',
  },
  {
    id: 'drilling',
    name: 'Drilling & Field Investigation',
    description: 'Subsurface exploration and sampling',
    icon: 'Drill',
  },
  {
    id: 'geophysical',
    name: 'Geophysical Surveys',
    description: 'Non-invasive subsurface imaging',
    icon: 'Waves',
  },
  {
    id: 'ndt',
    name: 'Non-Destructive Testing',
    description: 'Concrete and structure integrity testing',
    icon: 'Shield',
  },
];
