'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';
import Button from '@/components/ui/Button';
import { motion } from 'framer-motion';

const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-purple-600 to-purple-800 min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full shadow-sm mb-6">
              <span className="w-2 h-2 bg-secondary-400 rounded-full mr-2 animate-pulse" />
              <span className="text-sm font-medium text-white">
                ISO 9001:2015 Certified | 10+ Years Excellence
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
              Constantly Evolving,{' '}
              <span className="text-secondary-400">Foundation</span> You Can Trust
            </h1>

            <p className="text-xl text-purple-100 mb-8 leading-relaxed">
              Leading provider of geotechnical investigation, in-situ & laboratory testing services in Nepal.
              Advanced equipment, experienced team, reliable results.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact">
                <Button size="lg" className="group">
                  Request a Quote
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/services">
                <Button size="lg" variant="outline">
                  Our Services
                </Button>
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-8">
              <div>
                <div className="text-3xl font-bold text-secondary-400">100+</div>
                <div className="text-sm text-purple-200">Projects Completed</div>
              </div>
              <div className="w-px h-12 bg-white/30" />
              <div>
                <div className="text-3xl font-bold text-secondary-400">700m</div>
                <div className="text-sm text-purple-200">Drilling Capacity</div>
              </div>
              <div className="w-px h-12 bg-white/30" />
              <div>
                <div className="text-3xl font-bold text-secondary-400">50+</div>
                <div className="text-sm text-purple-200">Team Members</div>
              </div>
            </div>
          </motion.div>

          {/* Image/Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
              {/* Placeholder for hero image */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-900 to-primary-700 flex items-center justify-center">
                <div className="text-center text-white">
                  <Phone className="w-24 h-24 mx-auto mb-4 opacity-50" />
                  <p className="text-lg opacity-75">
                    Field Operations Image
                  </p>
                  <p className="text-sm opacity-50 mt-2">
                    Pile testing, drilling, and laboratory work
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl max-w-xs border-2 border-secondary-400"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-secondary-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Need Consultation?</div>
                  <div className="text-xs text-gray-500">ISO 9001:2015 Certified</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
