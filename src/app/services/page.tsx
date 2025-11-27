'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Hammer,
  Beaker,
  Box,
  Drill,
  Waves,
  Shield,
  ChevronDown,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import FadeIn from '@/components/animations/FadeIn';
import Link from 'next/link';

interface ServiceDetail {
  id: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  description: string;
  capabilities: string[];
  equipment: string[];
  applications: string[];
  deliverables: string[];
  color: string;
}

const services: ServiceDetail[] = [
  {
    id: 'pile-testing',
    icon: Hammer,
    title: 'Pile Testing Services',
    subtitle: 'Advanced Foundation Integrity & Load Testing',
    description: 'Comprehensive pile testing services ensuring foundation safety and compliance with international standards. Our state-of-the-art equipment and experienced team deliver accurate, reliable results for all pile types.',
    capabilities: [
      'High-Strain Dynamic Pile Testing (PDA)',
      'Low-Strain Pile Integrity Testing (PIT)',
      'Static Load Testing (Compression & Tension)',
      'Lateral Load Testing',
      'Cross-Hole Sonic Logging (CSL)',
      'Pile Pull-Out Testing',
      'O-Cell Testing',
      'Rebar Detection & Scanning'
    ],
    equipment: [
      'Pile Driving Analyzer (PDA)',
      'Pile Integrity Tester',
      'Static Load Test Setup (up to 1000 tons)',
      'Cross-Hole Sonic Logger',
      'Rebar Scanner',
      'Data Acquisition Systems'
    ],
    applications: [
      'Bridges and Flyovers',
      'High-rise Buildings',
      'Transmission Towers',
      'Industrial Structures',
      'Hydropower Projects'
    ],
    deliverables: [
      'Pile Capacity Analysis Report',
      'Load-Settlement Curves',
      'Integrity Assessment',
      'Signal Analysis & Wave Matching',
      'Compliance Certificates'
    ],
    color: 'from-purple-500 to-purple-700'
  },
  {
    id: 'soil-laboratory',
    icon: Beaker,
    title: 'Soil Laboratory Testing',
    subtitle: 'Comprehensive Geotechnical Analysis',
    description: 'Our ISO 9001:2015 certified laboratory in Lalitpur provides complete soil testing services with modern equipment and certified technicians, meeting national and international standards.',
    capabilities: [
      'Standard Proctor & Modified Proctor Compaction',
      'California Bearing Ratio (CBR)',
      'Triaxial Shear Test (UU, CU, CD)',
      'Direct Shear Test',
      'Unconfined Compressive Strength (UCS)',
      'Consolidation Test',
      'Permeability Test',
      'Grain Size Analysis (Sieve & Hydrometer)',
      'Atterberg Limits (LL, PL, SL)',
      'Specific Gravity',
      'Organic Content'
    ],
    equipment: [
      'Triaxial Testing System',
      'Direct Shear Apparatus',
      'Consolidation Equipment',
      'Permeability Test Setup',
      'Proctor Compaction Equipment',
      'Automated Sieve Shaker'
    ],
    applications: [
      'Foundation Design',
      'Road & Pavement Design',
      'Embankment Construction',
      'Slope Stability Analysis',
      'Earthwork Quality Control'
    ],
    deliverables: [
      'Soil Classification Report',
      'Shear Strength Parameters',
      'Compaction Characteristics',
      'Bearing Capacity Recommendations',
      'Test Certificates'
    ],
    color: 'from-purple-600 to-purple-800'
  },
  {
    id: 'rock-laboratory',
    icon: Box,
    title: 'Rock Laboratory Testing',
    subtitle: 'Rock Mechanics & Classification',
    description: 'Specialized rock testing services for tunnel, dam, and slope projects. Our laboratory handles core samples up to 100mm diameter with precise testing protocols.',
    capabilities: [
      'Unconfined Compressive Strength (UCS)',
      'Point Load Test (Axial & Diametral)',
      'Indirect Tensile Strength (Brazilian Test)',
      'Rock Quality Designation (RQD)',
      'Core Recovery & Logging',
      'Density & Porosity',
      'Water Absorption',
      'Slake Durability Test'
    ],
    equipment: [
      'Rock UCS Testing Machine (3000 kN)',
      'Point Load Tester',
      'Core Cutting Machine',
      'Digital Caliper & Measuring Tools'
    ],
    applications: [
      'Tunnel Design',
      'Dam Foundations',
      'Rock Slope Engineering',
      'Quarry Assessment',
      'Underground Excavation'
    ],
    deliverables: [
      'Rock Classification Report',
      'Strength Parameters',
      'RQD Analysis',
      'Geological Core Logs',
      'Design Recommendations'
    ],
    color: 'from-purple-400 to-purple-600'
  },
  {
    id: 'drilling',
    icon: Drill,
    title: 'Drilling & Field Investigation',
    subtitle: 'Up to 700m Depth Capability',
    description: 'Our fleet of modern drilling rigs can reach depths up to 700m, making us one of Nepal\'s most capable drilling service providers. Experienced drillers and geologists ensure quality sampling and logging.',
    capabilities: [
      'Rotary Core Drilling (NX, HQ, PQ sizes)',
      'Percussion Drilling',
      'Auger Drilling',
      'Standard Penetration Test (SPT)',
      'Borehole Logging',
      'In-Situ Permeability Test',
      'Piezometer Installation',
      'Groundwater Sampling'
    ],
    equipment: [
      'Rotary Drilling Rigs (up to 700m)',
      'SPT Equipment',
      'Core Barrels & Drill Bits',
      'Piezometers',
      'Water Level Indicators'
    ],
    applications: [
      'Deep Foundation Design',
      'Tunnel Investigations',
      'Dam Site Studies',
      'Hydropower Projects',
      'Landslide Investigation'
    ],
    deliverables: [
      'Borehole Logs',
      'SPT Data & N-values',
      'Core Photographs',
      'Groundwater Level Data',
      'Geotechnical Report'
    ],
    color: 'from-purple-700 to-purple-900'
  },
  {
    id: 'geophysical',
    icon: Waves,
    title: 'Geophysical Surveys',
    subtitle: 'Subsurface Imaging & Characterization',
    description: 'Non-invasive geophysical investigation methods for rapid subsurface characterization. Our surveys provide valuable data for preliminary design and site assessment.',
    capabilities: [
      'Multi-channel Analysis of Surface Waves (MASW)',
      'Electrical Resistivity Tomography (ERT)',
      'Seismic Refraction Tomography (SRT)',
      'Magnetotelluric (MT) Survey',
      'Microtremor Array Measurement (MAM)',
      'Borehole Camera & Televiewer',
      'Ground Penetrating Radar (GPR)'
    ],
    equipment: [
      'Seismic Data Acquisition System',
      'Resistivity Meter & Electrodes',
      'Borehole Camera',
      'Magnetotelluric Equipment',
      'GPS & Survey Instruments'
    ],
    applications: [
      'Seismic Site Classification',
      'Bedrock Depth Mapping',
      'Groundwater Exploration',
      'Tunnel Route Selection',
      'Landslide Characterization'
    ],
    deliverables: [
      'Subsurface Profile (2D/3D)',
      'Shear Wave Velocity (Vs30)',
      'Resistivity Models',
      'Seismic Hazard Parameters',
      'Interpretation Report'
    ],
    color: 'from-purple-500 to-indigo-700'
  },
  {
    id: 'ndt',
    icon: Shield,
    title: 'Non-Destructive Testing (NDT)',
    subtitle: 'Structure Assessment Without Damage',
    description: 'Assess existing structures without causing damage. Our NDT services are essential for renovation projects, structural audits, and quality control.',
    capabilities: [
      'Rebound Hammer Test (Schmidt Hammer)',
      'Ultrasonic Pulse Velocity (UPV)',
      'Rebar Detection & Scanning',
      'Core Cutting & Extraction',
      'Flat Jack Test',
      'Push-Out Shear Test',
      'Equipotential Test (Corrosion Detection)',
      'Concrete Cover Measurement'
    ],
    equipment: [
      'Digital Rebound Hammer',
      'Ultrasonic Pulse Velocity Tester',
      'Rebar Locator',
      'Core Drilling Machine',
      'Flat Jack Equipment'
    ],
    applications: [
      'Building Structural Audit',
      'Bridge Assessment',
      'Post-Earthquake Evaluation',
      'Quality Control',
      'Renovation Planning'
    ],
    deliverables: [
      'Concrete Strength Assessment',
      'Rebar Layout Drawings',
      'Structural Condition Report',
      'Repair Recommendations',
      'Compliance Certificates'
    ],
    color: 'from-indigo-600 to-purple-700'
  }
];

export default function ServicesPage() {
  const [expandedService, setExpandedService] = useState<string | null>(null);

  const toggleService = (id: string) => {
    setExpandedService(expandedService === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-600 to-purple-800 py-20">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                  Our Services
                </h1>
                <p className="text-xl text-purple-100 max-w-3xl mx-auto">
                  Comprehensive geotechnical, testing, and investigation services backed by
                  <span className="text-secondary-400 font-semibold"> ISO 9001:2015 certification</span> and over a decade of experience
                </p>
              </motion.div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Services List */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              const isExpanded = expandedService === service.id;

              return (
                <FadeIn key={service.id} delay={index * 0.1}>
                  <Card hover className="overflow-hidden">
                    <CardContent className="p-0">
                      {/* Service Header */}
                      <button
                        onClick={() => toggleService(service.id)}
                        className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className="flex items-center gap-6 flex-1">
                          <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center flex-shrink-0`}>
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">
                              {service.title}
                            </h3>
                            <p className="text-sm text-primary-600 font-medium">
                              {service.subtitle}
                            </p>
                          </div>
                        </div>
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown className="w-6 h-6 text-gray-400" />
                        </motion.div>
                      </button>

                      {/* Expanded Content */}
                      <motion.div
                        initial={false}
                        animate={{
                          height: isExpanded ? 'auto' : 0,
                          opacity: isExpanded ? 1 : 0
                        }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 pt-0 border-t border-gray-100">
                          <p className="text-gray-600 mb-8 leading-relaxed">
                            {service.description}
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Capabilities */}
                            <div>
                              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-primary-600" />
                                Capabilities
                              </h4>
                              <ul className="space-y-2">
                                {service.capabilities.map((cap) => (
                                  <li key={cap} className="text-sm text-gray-600 flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary-600 mt-2 flex-shrink-0" />
                                    {cap}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Equipment */}
                            <div>
                              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-primary-600" />
                                Equipment
                              </h4>
                              <ul className="space-y-2">
                                {service.equipment.map((eq) => (
                                  <li key={eq} className="text-sm text-gray-600 flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary-600 mt-2 flex-shrink-0" />
                                    {eq}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Applications */}
                            <div>
                              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-primary-600" />
                                Applications
                              </h4>
                              <ul className="space-y-2">
                                {service.applications.map((app) => (
                                  <li key={app} className="text-sm text-gray-600 flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary-600 mt-2 flex-shrink-0" />
                                    {app}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Deliverables */}
                            <div>
                              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-primary-600" />
                                Deliverables
                              </h4>
                              <ul className="space-y-2">
                                {service.deliverables.map((del) => (
                                  <li key={del} className="text-sm text-gray-600 flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary-600 mt-2 flex-shrink-0" />
                                    {del}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="mt-8 pt-6 border-t border-gray-100">
                            <Link href="/contact">
                              <Button variant="purple" className="group">
                                Request Quote for {service.title}
                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 to-purple-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Get in touch with our team to discuss your geotechnical testing needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" variant="primary" className="group">
                  Request a Quote
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/projects">
                <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20">
                  View Our Projects
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
