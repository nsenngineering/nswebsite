'use client';

import React, { useState, useMemo } from 'react';
import { Gauge } from 'lucide-react';
import EquipmentCard from '@/components/equipment/EquipmentCard';
import EquipmentModal from '@/components/equipment/EquipmentModal';
import FadeIn from '@/components/animations/FadeIn';
import equipmentData from '@/data/generated/equipment.json';
import { getAllEquipmentCategories } from '@/lib/equipment-categories';
import type { Equipment } from '@/types/equipment';

export default function EquipmentPage() {
  const equipment = equipmentData.equipment as Equipment[];
  const categories = getAllEquipmentCategories();

  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter equipment based on category and search query
  const filteredEquipment = useMemo(() => {
    return equipment.filter(eq => {
      const matchesCategory = categoryFilter === 'all' || eq.category === categoryFilter;
      const matchesSearch = eq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           eq.manufacturer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           eq.model?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [equipment, categoryFilter, searchQuery]);

  // Calculate statistics
  const stats = {
    total: equipment.length,
    categories: categories.length,
    featured: equipment.filter(e => e.featured).length
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <FadeIn>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Gauge className="w-10 h-10 text-purple-600" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Equipment Catalog
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
              State-of-the-art testing and investigation equipment for geotechnical, pile testing, and subsurface exploration
            </p>

            {/* Statistics */}
            <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
              <div>
                <span className="font-bold text-2xl text-purple-600">{stats.total}</span>
                <span className="ml-2">Equipment</span>
              </div>
              <div className="h-8 w-px bg-gray-300" />
              <div>
                <span className="font-bold text-2xl text-purple-600">{stats.categories}</span>
                <span className="ml-2">Categories</span>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Filter Section */}
        <FadeIn delay={0.1}>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category Filter */}
              <div>
                <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Category
                </label>
                <select
                  id="category-filter"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Categories ({equipment.length})</option>
                  {categories.map(cat => {
                    const count = equipment.filter(e => e.category === cat.id).length;
                    return (
                      <option key={cat.id} value={cat.id}>
                        {cat.label} ({count})
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Search Input */}
              <div>
                <label htmlFor="search-equipment" className="block text-sm font-medium text-gray-700 mb-2">
                  Search Equipment
                </label>
                <input
                  id="search-equipment"
                  type="text"
                  placeholder="Search by name, manufacturer, or model..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-gray-600">
              Showing <span className="font-medium text-gray-900">{filteredEquipment.length}</span> of {equipment.length} equipment items
            </div>
          </div>
        </FadeIn>

        {/* Equipment Grid */}
        <FadeIn delay={0.2}>
          {filteredEquipment.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEquipment.map((eq, index) => (
                <FadeIn key={eq.id} delay={0.1 * (index % 3)}>
                  <EquipmentCard
                    equipment={eq}
                    onClick={() => setSelectedEquipment(eq)}
                  />
                </FadeIn>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Gauge className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No equipment found</h3>
              <p className="text-gray-600">
                {searchQuery
                  ? `No equipment matching "${searchQuery}" in the selected category.`
                  : 'No equipment available in the selected category.'}
              </p>
              <button
                onClick={() => {
                  setCategoryFilter('all');
                  setSearchQuery('');
                }}
                className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
              >
                Clear filters
              </button>
            </div>
          )}
        </FadeIn>

        {/* Category Legend (Optional) */}
        <FadeIn delay={0.3}>
          <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Equipment Categories</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map(cat => {
                const count = equipment.filter(e => e.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`text-left p-4 rounded-lg border-2 transition-all ${
                      categoryFilter === cat.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-gray-900">{cat.label}</h4>
                      <span className="text-sm font-medium text-purple-600">{count}</span>
                    </div>
                    <p className="text-sm text-gray-600">{cat.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Equipment Modal */}
      <EquipmentModal
        equipment={selectedEquipment}
        isOpen={selectedEquipment !== null}
        onClose={() => setSelectedEquipment(null)}
      />
    </div>
  );
}
