'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import {
  Building2,
  MapPin,
  Calendar,
  Filter,
  Search
} from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';
import ProjectCard from '@/components/projects/ProjectCard';
import ProjectModal from '@/components/projects/ProjectModal';
import type { Project } from '@/types/project';
import projectsDataRaw from '@/data/generated/projects.json';
import Input from '@/components/ui/Input';

// Type assertion for imported JSON
const projectsData = projectsDataRaw as { projects: Project[] };

// Dynamic import for map component (client-side only)
const ProjectMap = dynamic(
  () => import('@/components/map/ProjectMap'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg shadow-lg overflow-hidden relative">
        {/* Animated loading skeleton */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading interactive map...</p>
            <p className="text-sm text-gray-500 mt-1">Preparing {projectsData.projects.length} project locations</p>
          </div>
        </div>
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
      </div>
    )
  }
);

const projects: Project[] = projectsData.projects;
const projectCategories = [
  { id: 'all', label: 'All Projects' },
  { id: 'pile-testing', label: 'Pile Testing' },
  { id: 'tunnel-road', label: 'Tunnel & Road' },
  { id: 'hydropower', label: 'Hydropower' },
  { id: 'transmission', label: 'Transmission Lines' },
  { id: 'ndt', label: 'NDT Services' },
];

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedProjectId, setHighlightedProjectId] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = projects.filter((project) => {
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.location.name.toLowerCase().includes(searchQuery.toLowerCase());
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

  // Map interaction handlers
  const handleMarkerClick = (projectId: string) => {
    setHighlightedProjectId(projectId);
    // Scroll to project card in list
    const element = document.getElementById(`project-${projectId}`);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  const handleMarkerHover = (projectId: string | null) => {
    setHighlightedProjectId(projectId);
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

      {/* Map Section */}
      <section className="bg-gray-100 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Project Locations</h2>
              <p className="text-gray-600">Click a marker to view project details below</p>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="text-gray-600 font-medium">Categories:</span>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#7c3aed] border-2 border-white shadow-sm"></div>
                <span className="text-gray-700">Pile Testing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#6d28d9] border-2 border-white shadow-sm"></div>
                <span className="text-gray-700">Tunnel & Road</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#8b5cf6] border-2 border-white shadow-sm"></div>
                <span className="text-gray-700">Hydropower</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#5b21b6] border-2 border-white shadow-sm"></div>
                <span className="text-gray-700">Transmission</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#6366f1] border-2 border-white shadow-sm"></div>
                <span className="text-gray-700">NDT</span>
              </div>
            </div>
          </div>

          <ProjectMap
            projects={filteredProjects}
            highlightedProjectId={highlightedProjectId}
            onMarkerClick={handleMarkerClick}
            onMarkerHover={handleMarkerHover}
          />

          {/* Map Stats */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary-600" />
              <span><strong>{filteredProjects.length}</strong> projects mapped</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary-600" />
              <span><strong>{new Set(filteredProjects.map(p => p.client)).size}</strong> unique clients</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary-600" />
              <span><strong>{filteredProjects.length > 0 ? Math.max(...filteredProjects.map(p => p.year)) - Math.min(...filteredProjects.map(p => p.year)) + 1 : 0}</strong> years of projects</span>
            </div>
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
              {filteredProjects.map((project, index) => {
                const isHighlighted = project.id === highlightedProjectId;
                return (
                  <FadeIn key={project.id} delay={index * 0.05}>
                    <ProjectCard
                      project={project}
                      isHighlighted={isHighlighted}
                      onMouseEnter={() => setHighlightedProjectId(project.id)}
                      onMouseLeave={() => setHighlightedProjectId(null)}
                      onClick={() => setSelectedProject(project)}
                    />
                  </FadeIn>
                );
              })}
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

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
