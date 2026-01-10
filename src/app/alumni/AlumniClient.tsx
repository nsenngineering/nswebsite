'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Filter, User } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';
import AlumniCard from '@/components/alumni/AlumniCard';
import AlumniModal from '@/components/alumni/AlumniModal';
import Input from '@/components/ui/Input';
import type { Alumni } from '@/types/alumni';
import alumniDataRaw from '@/data/generated/alumni.json';

const alumniData = alumniDataRaw as { alumni: Alumni[] };
const alumni = alumniData.alumni as Alumni[];

// Generate year range filters based on alumni data
const allYears = alumni.flatMap(a => [a.yearFrom, a.yearTo]);
const minYear = Math.min(...allYears);
const maxYear = Math.max(...allYears);

const yearRanges = [
  { id: 'all', label: 'All Years' },
  { id: '2014-2017', label: '2014-2017' },
  { id: '2018-2021', label: '2018-2021' },
  { id: '2022-2025', label: '2022-2025' }
];

export default function AlumniPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYearRange, setSelectedYearRange] = useState('all');
  const [selectedAlumnus, setSelectedAlumnus] = useState<Alumni | null>(null);

  // Filter alumni based on search and year range
  const filteredAlumni = alumni.filter((alumnus) => {
    // Search filter (name)
    const matchesSearch = alumnus.name.toLowerCase().includes(searchQuery.toLowerCase());

    // Year range filter
    const matchesYearRange = selectedYearRange === 'all' || (() => {
      const [startYear, endYear] = selectedYearRange.split('-').map(Number);
      // Alumni matches if their employment period overlaps with the selected range
      return alumnus.yearFrom <= endYear && alumnus.yearTo >= startYear;
    })();

    return matchesSearch && matchesYearRange;
  });

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
                  Our Alumni
                </h1>
                <p className="text-xl text-purple-100 max-w-3xl mx-auto">
                  <span className="text-secondary-400 font-semibold">Talented professionals</span> who built their careers at NS Engineering
                </p>
              </motion.div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="py-8 bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="w-full md:w-96">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Year Range Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-5 h-5 text-gray-400" />
              {yearRanges.map((range) => (
                <button
                  key={range.id}
                  onClick={() => setSelectedYearRange(range.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedYearRange === range.id
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredAlumni.length}</span> of <span className="font-semibold text-gray-900">{alumni.length}</span> alumni
          </div>
        </div>
      </section>

      {/* Alumni Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredAlumni.length === 0 ? (
            <div className="text-center py-20">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No alumni found</h3>
              <p className="text-gray-600">Try adjusting your filters or search query</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAlumni.map((alumnus, index) => (
                <FadeIn key={alumnus.id} delay={index * 0.05}>
                  <AlumniCard
                    alumnus={alumnus}
                    onOpenModal={() => setSelectedAlumnus(alumnus)}
                  />
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Alumni Impact</h2>
              <p className="text-gray-600">Our alumni continue to make a difference in the geotechnical engineering field</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="group">
                <div className="text-4xl font-bold text-primary-600 mb-2 group-hover:scale-110 transition-transform">
                  {alumni.length}
                </div>
                <div className="text-sm text-gray-600">Total Alumni</div>
              </div>
              <div className="group">
                <div className="text-4xl font-bold text-primary-600 mb-2 group-hover:scale-110 transition-transform">
                  {maxYear - minYear + 1}
                </div>
                <div className="text-sm text-gray-600">Years of Legacy</div>
              </div>
              <div className="group">
                <div className="text-4xl font-bold text-primary-600 mb-2 group-hover:scale-110 transition-transform">
                  {alumni.filter(a => a.linkedinUrl).length}
                </div>
                <div className="text-sm text-gray-600">On LinkedIn</div>
              </div>
              <div className="group">
                <div className="text-4xl font-bold text-primary-600 mb-2 group-hover:scale-110 transition-transform">
                  {alumni.reduce((sum, a) => sum + a.achievements.length, 0)}
                </div>
                <div className="text-sm text-gray-600">Achievements</div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Alumni Modal */}
      <AlumniModal
        alumnus={selectedAlumnus}
        isOpen={selectedAlumnus !== null}
        onClose={() => setSelectedAlumnus(null)}
      />
    </div>
  );
}
