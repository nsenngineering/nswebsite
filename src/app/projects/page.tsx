'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  MapPin,
  Calendar,
  CheckCircle2,
  Filter,
  Search
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import FadeIn from '@/components/animations/FadeIn';
import { projects, projectCategories, type Project } from '@/data/projects';
import Input from '@/components/ui/Input';

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = projects.filter((project) => {
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (category: Project['category']) => {
    const colors = {
      'pile-testing': 'from-purple-500 to-purple-700',
      'tunnel-road': 'from-purple-600 to-purple-800',
      'hydropower': 'from-purple-400 to-purple-600',
      'transmission': 'from-purple-700 to-purple-900',
      'ndt': 'from-indigo-600 to-purple-700'
    };
    return colors[category];
  };

  const getCategoryLabel = (category: Project['category']) => {
    const labels = {
      'pile-testing': 'Pile Testing',
      'tunnel-road': 'Tunnel & Road',
      'hydropower': 'Hydropower',
      'transmission': 'Transmission',
      'ndt': 'NDT'
    };
    return labels[category];
  };

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
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                  Our Projects
                </h1>
                <p className="text-xl text-purple-100 max-w-3xl mx-auto">
                  <span className="text-secondary-400 font-semibold">100+ projects</span> across roads, bridges, tunnels, hydropower, and transmission lines
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
                  placeholder="Search projects, clients, locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-5 h-5 text-gray-400" />
              {projectCategories.map((category) => (
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
            Showing <span className="font-semibold text-gray-900">{filteredProjects.length}</span> of <span className="font-semibold text-gray-900">{projects.length}</span> projects
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-600">Try adjusting your filters or search query</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => (
                <FadeIn key={project.id} delay={index * 0.05}>
                  <Card hover className="h-full">
                    <CardContent className="p-0">
                      {/* Project Header */}
                      <div className={`p-6 bg-gradient-to-br ${getCategoryColor(project.category)} text-white`}>
                        <div className="flex items-start justify-between mb-4">
                          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                            {getCategoryLabel(project.category)}
                          </span>
                          <span className="flex items-center gap-1 text-sm">
                            <Calendar className="w-4 h-4" />
                            {project.year}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold mb-2 line-clamp-2">
                          {project.title}
                        </h3>
                      </div>

                      {/* Project Details */}
                      <div className="p-6">
                        <div className="space-y-3 mb-4">
                          <div className="flex items-start gap-2">
                            <Building2 className="w-4 h-4 text-primary-600 mt-1 flex-shrink-0" />
                            <div>
                              <div className="text-xs text-gray-500 mb-1">Client</div>
                              <div className="text-sm font-medium text-gray-900 line-clamp-2">
                                {project.client}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-primary-600 mt-1 flex-shrink-0" />
                            <div>
                              <div className="text-xs text-gray-500 mb-1">Location</div>
                              <div className="text-sm font-medium text-gray-900">
                                {project.location}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Scope */}
                        <div className="border-t border-gray-100 pt-4">
                          <div className="text-xs text-gray-500 mb-2 font-medium">Scope of Work</div>
                          <ul className="space-y-1.5">
                            {project.scope.slice(0, 3).map((item, idx) => (
                              <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-primary-600 mt-0.5 flex-shrink-0" />
                                <span className="line-clamp-2">{item}</span>
                              </li>
                            ))}
                            {project.scope.length > 3 && (
                              <li className="text-xs text-primary-600 font-medium">
                                +{project.scope.length - 3} more items
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {projects.filter(p => p.category === 'pile-testing').length}
                </div>
                <div className="text-sm text-gray-600">Pile Testing Projects</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {projects.filter(p => p.category === 'tunnel-road').length}
                </div>
                <div className="text-sm text-gray-600">Tunnel & Road Projects</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {projects.filter(p => p.category === 'hydropower').length}
                </div>
                <div className="text-sm text-gray-600">Hydropower Projects</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {projects.filter(p => p.category === 'transmission').length}
                </div>
                <div className="text-sm text-gray-600">Transmission Lines</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {projects.filter(p => p.category === 'ndt').length}
                </div>
                <div className="text-sm text-gray-600">NDT Projects</div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
