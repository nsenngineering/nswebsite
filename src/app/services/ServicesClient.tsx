'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wrench,
  Filter,
  Search
} from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';
import ServiceCard from '@/components/services/ServiceCard';
import ServiceModal from '@/components/services/ServiceModal';
import ServiceListSchema from '@/components/seo/ServiceListSchema';
import type { Service } from '@/types/service';
import servicesDataRaw from '@/data/generated/services.json';
import Input from '@/components/ui/Input';

// Type assertion for imported JSON
const servicesData = servicesDataRaw as { services: Service[]; categories: Array<{ id: string; name: string }> };

const services = servicesData.services as Service[];
const categories = servicesData.categories;

// Generate service categories with "All Services"
const serviceCategories = [
  { id: 'all', label: 'All Services' },
  ...categories.map(cat => ({ id: cat.id, label: cat.name }))
];

export default function ServicesClient() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Calculate category stats
  const categoryStats = services.reduce((acc, service) => {
    acc[service.category] = (acc[service.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const filteredServices = services.filter((service) => {
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.fullDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <ServiceListSchema />
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
                  <span className="text-secondary-400 font-semibold">Comprehensive geotechnical testing</span> and engineering services for infrastructure projects
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
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-5 h-5 text-gray-400" />
              {serviceCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === category.id
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredServices.length}</span> of <span className="font-semibold text-gray-900">{services.length}</span> services
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredServices.length === 0 ? (
            <div className="text-center py-20">
              <Wrench className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No services found</h3>
              <p className="text-gray-600">Try adjusting your filters or search query</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service, index) => (
                <FadeIn key={service.id} delay={index * 0.05}>
                  <ServiceCard
                    service={service}
                    onOpenModal={() => setSelectedService(service)}
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
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Services by Category</h2>
              <p className="text-gray-600">Comprehensive testing and analysis across all disciplines</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
              {categories.map((category) => (
                <div key={category.id} className="group cursor-pointer" onClick={() => setSelectedCategory(category.id)}>
                  <div className="text-4xl font-bold text-primary-600 mb-2 group-hover:scale-110 transition-transform">
                    {categoryStats[category.id] || 0}
                  </div>
                  <div className="text-sm text-gray-600 group-hover:text-primary-600 transition-colors">{category.name}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Service Modal */}
      <ServiceModal
        service={selectedService}
        isOpen={selectedService !== null}
        onClose={() => setSelectedService(null)}
      />
    </div>
    </>
  );
}
