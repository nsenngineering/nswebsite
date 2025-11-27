'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  Users,
  Target,
  Globe,
  CheckCircle2,
  TrendingUp,
  Shield,
  Building2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import FadeIn from '@/components/animations/FadeIn';
import Image from 'next/image';

interface TeamMember {
  name: string;
  role: string;
  education: string;
  experience: string;
}

interface Stat {
  icon: React.ElementType;
  value: string;
  label: string;
  color: string;
}

const stats: Stat[] = [
  {
    icon: Users,
    value: '50+',
    label: 'Team Members',
    color: 'text-purple-600'
  },
  {
    icon: Building2,
    value: '100+',
    label: 'Projects Completed',
    color: 'text-purple-600'
  },
  {
    icon: TrendingUp,
    value: '700m',
    label: 'Drilling Capacity',
    color: 'text-purple-600'
  },
  {
    icon: Award,
    value: '10+',
    label: 'Years Experience',
    color: 'text-purple-600'
  }
];

const leadership: TeamMember[] = [
  {
    name: 'Arun Kumar Pandit',
    role: 'Managing Director',
    education: 'MSc. Geotechnical Engineering',
    experience: '19 Years'
  },
  {
    name: 'Dhurba Raj Tirpathi',
    role: 'Director',
    education: 'Bachelor in Civil Engineering',
    experience: '28 Years'
  },
  {
    name: 'Shrawan Kumar Thapa',
    role: 'Director',
    education: 'MSc. Transportation Engineering',
    experience: '30 Years'
  },
  {
    name: 'Madhav Pokhrel',
    role: 'Director',
    education: 'MSc. Disaster Risk Engineering',
    experience: '15 Years'
  },
  {
    name: 'Arjun Adhikari',
    role: 'Director',
    education: 'MSc. Geotechnical Engineering',
    experience: '20 Years'
  }
];

const values = [
  {
    icon: Shield,
    title: 'Quality & Safety',
    description: 'ISO 9001:2015 certified processes ensuring the highest standards in every project'
  },
  {
    icon: Target,
    title: 'Precision & Accuracy',
    description: 'State-of-the-art equipment and rigorous testing protocols for reliable results'
  },
  {
    icon: Users,
    title: 'Client Focus',
    description: 'Building long-term partnerships through exceptional service and technical support'
  },
  {
    icon: TrendingUp,
    title: 'Continuous Innovation',
    description: 'Investing in latest technology and training to stay ahead of industry standards'
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 py-20">
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
                <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full shadow-sm mb-6">
                  <Award className="w-4 h-4 text-secondary-400 mr-2" />
                  <span className="text-sm font-medium text-white">
                    ISO 9001:2015 Certified
                  </span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                  About <span className="text-secondary-400">NS Engineering</span>
                </h1>
                <p className="text-xl text-purple-100 max-w-3xl mx-auto">
                  Nepal's trusted partner in geotechnical investigation, pile testing, and material analysis since 2014
                </p>
              </motion.div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <FadeIn key={stat.label} delay={index * 0.1}>
                  <div className="text-center">
                    <Icon className={`w-10 h-10 ${stat.color} mx-auto mb-3`} />
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">
                      {stat.label}
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Constantly Evolving, <span className="text-primary-600">Foundation You Can Trust</span>
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    <strong className="text-gray-900">N.S. Engineering & Geotechnical Services Pvt. Ltd. (NSEGS)</strong> was founded with a commitment to provide high-quality geotechnical investigation and testing services in Nepal. Over the past decade, we have established ourselves as a trusted partner for major infrastructure projects across the country.
                  </p>
                  <p>
                    Our ISO 9001:2015 certified laboratory in Lalitpur is equipped with state-of-the-art testing equipment, staffed by experienced engineers, geologists, and certified technicians who ensure every test meets national and international standards.
                  </p>
                  <p>
                    From pile testing on major highways to deep drilling for hydropower projects, we bring technical expertise, modern equipment, and a commitment to accuracy that our clients depend on.
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-gradient-to-br from-purple-500 to-purple-700 text-white p-6">
                  <CardContent>
                    <Award className="w-12 h-12 mb-4 opacity-80" />
                    <h3 className="text-2xl font-bold mb-2">ISO Certified</h3>
                    <p className="text-sm text-purple-100">Quality management system certified to international standards</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-600 to-purple-800 text-white p-6">
                  <CardContent>
                    <Globe className="w-12 h-12 mb-4 opacity-80" />
                    <h3 className="text-2xl font-bold mb-2">Global Partners</h3>
                    <p className="text-sm text-purple-100">Collaboration with firms from 15+ countries</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-400 to-purple-600 text-white p-6 col-span-2">
                  <CardContent>
                    <Target className="w-12 h-12 mb-4 opacity-80" />
                    <h3 className="text-2xl font-bold mb-2">Comprehensive Services</h3>
                    <p className="text-sm text-purple-100">From field investigation to laboratory analysis, we handle every aspect of geotechnical testing</p>
                  </CardContent>
                </Card>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FadeIn>
              <Card className="h-full">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center mb-6">
                    <Target className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                  <p className="text-gray-600 leading-relaxed">
                    To deliver high-quality, innovative, and customized engineering solutions that consistently exceed client expectations. We focus on complex pile load tests, advanced geophysical surveys, and precise interpretation of soil and rock behavior to ensure safe, reliable infrastructure.
                  </p>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.2}>
              <Card className="h-full">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center mb-6">
                    <TrendingUp className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                  <p className="text-gray-600 leading-relaxed">
                    To be recognized as Nepal's most dependable and forward-thinking geotechnical and engineering solutions provider. We aspire to be the long-term partner of choice for public institutions, private developers, and international collaborators across the region.
                  </p>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Our Core Values
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                The principles that guide every project we undertake
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <FadeIn key={value.title} delay={index * 0.1}>
                  <Card hover className="h-full">
                    <CardContent className="p-6 text-center">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {value.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Leadership Team
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experienced professionals guiding Nepal's infrastructure development
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {leadership.map((member, index) => (
              <FadeIn key={member.name} delay={index * 0.1}>
                <Card hover className="h-full">
                  <CardContent className="p-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center mx-auto mb-4">
                      <Users className="w-10 h-10 text-white" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {member.name}
                      </h3>
                      <p className="text-sm font-medium text-primary-600 mb-3">
                        {member.role}
                      </p>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p className="flex items-center justify-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary-600" />
                          {member.education}
                        </p>
                        <p className="flex items-center justify-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary-600" />
                          {member.experience} Experience
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* International Collaboration */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center text-white">
              <Globe className="w-16 h-16 mx-auto mb-6 opacity-80" />
              <h2 className="text-4xl font-bold mb-4">
                International Collaboration
              </h2>
              <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8">
                We work with consulting firms and contractors from around the world, bringing global expertise to Nepal's infrastructure projects
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                {['China', 'Japan', 'Germany', 'UK', 'France', 'Canada', 'Italy', 'Australia', 'India', 'Norway', 'USA', 'Malaysia'].map((country) => (
                  <span key={country} className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full">
                    {country}
                  </span>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
