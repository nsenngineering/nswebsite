'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { ArrowRight, Hammer, Beaker, Box, Drill, Waves, Shield } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';

const iconMap = {
  Hammer,
  Beaker,
  Box,
  Drill,
  Waves,
  Shield,
};

interface ServiceCardData {
  icon: keyof typeof iconMap;
  title: string;
  description: string;
  href: string;
  color: string;
}

const services: ServiceCardData[] = [
  {
    icon: 'Hammer',
    title: 'Pile Testing',
    description: 'PDA, PIT, Static Load Test, Cross-Hole Sonic Logging, Rebar Detection',
    href: '/services#pile-testing',
    color: 'from-purple-500 to-purple-700',
  },
  {
    icon: 'Beaker',
    title: 'Soil Laboratory',
    description: 'Compaction, CBR, Triaxial, UCS, SPT, Field Vane, Grain Analysis',
    href: '/services#soil-laboratory',
    color: 'from-purple-600 to-purple-800',
  },
  {
    icon: 'Box',
    title: 'Rock Laboratory',
    description: 'UCS Testing, Point Load Test, Core Analysis, Rock Classification',
    href: '/services#rock-laboratory',
    color: 'from-purple-400 to-purple-600',
  },
  {
    icon: 'Drill',
    title: 'Drilling Services',
    description: 'Rotary/Core Drilling up to 700m, Borehole Logging, Permeability Tests',
    href: '/services#drilling',
    color: 'from-purple-700 to-purple-900',
  },
  {
    icon: 'Waves',
    title: 'Geophysical Surveys',
    description: 'MASW, ERT, Seismic Refraction, Subsurface Imaging',
    href: '/services#geophysical',
    color: 'from-purple-500 to-indigo-700',
  },
  {
    icon: 'Shield',
    title: 'NDT Services',
    description: 'Concrete Integrity, Rebar Detection, Structure Assessment',
    href: '/services#ndt',
    color: 'from-indigo-600 to-purple-700',
  },
];

const ServiceCards: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Comprehensive Testing Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From foundation testing to material analysis, we provide complete geotechnical
            solutions for your construction projects
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon];

            return (
              <FadeIn key={service.title} delay={index * 0.1}>
                <Link href={service.href} className="block h-full group">
                  <Card hover className="h-full">
                    <CardContent className="p-6">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                        {service.title}
                      </h3>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {service.description}
                      </p>

                      <div className="flex items-center text-primary-600 font-medium text-sm group-hover:gap-2 transition-all">
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </FadeIn>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/services"
            className="inline-flex items-center px-6 py-3 text-base font-medium text-primary-600 border-2 border-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
          >
            View All Services
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServiceCards;
