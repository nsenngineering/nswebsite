'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Camera } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import ProjectModal from '@/components/projects/ProjectModal';
import projectsDataRaw from '@/data/generated/projects.json';
import type { Project } from '@/types/project';
import { withBasePath } from '@/lib/utils';

const projectsData = projectsDataRaw as { projects: Project[] };
const featuredProjects = projectsData.projects.filter(p => p.featured);

const getCategoryLabel = (category: Project['category']): string => {
  const labels: Record<Project['category'], string> = {
    'pile-testing': 'Pile Testing',
    'tunnel-road': 'Tunnel & Road',
    'hydropower': 'Hydropower',
    'transmission': 'Transmission',
    'ndt': 'NDT'
  };
  return labels[category];
};

export default function FeaturedProjects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // If no featured projects, don't render the section
  if (featuredProjects.length === 0) {
    return null;
  }

  return (
    <>
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Featured Projects
              </h2>
              <p className="text-xl text-gray-600">
                Explore our recent work across Nepal
              </p>
            </motion.div>
          </div>

          {/* Horizontal Scroll Carousel */}
          <div className="relative">
            <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
              {featuredProjects.map((project, index) => {
                const hasImages = project.media && (project.media.images.length > 0 || project.media.heroImage);
                const heroImage = project.media?.heroImage || project.media?.images[0];
                const imageCount = project.media?.images?.length || 0;

                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex-shrink-0 w-[350px] md:w-[400px] snap-start cursor-pointer group"
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-lg">
                      {/* Hero Image or Gradient Fallback */}
                      {hasImages && heroImage ? (
                        <img
                          src={withBasePath(`/projects/${heroImage}`)}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          onError={(e) => {
                            // Fallback to gradient if image fails
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-500 to-purple-700" />
                      )}

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                      {/* Content Overlay */}
                      <div className="absolute inset-0 p-6 flex flex-col justify-between">
                        {/* Top: Category Badge & Photo Count */}
                        <div className="flex justify-between items-start">
                          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-white">
                            {getCategoryLabel(project.category)}
                          </span>
                          {imageCount > 0 && (
                            <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white flex items-center gap-1">
                              <Camera className="w-3 h-3" />
                              {imageCount}
                            </span>
                          )}
                        </div>

                        {/* Bottom: Title, Client & CTA */}
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1 line-clamp-2">
                            {project.title}
                          </h3>
                          <p className="text-sm text-white/80 mb-3">{project.client}</p>
                          <div className="flex items-center text-white/90 text-sm font-medium group-hover:text-white transition-colors">
                            View Project Details →
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* View All CTA */}
          <div className="text-center mt-10">
            <Link href="/projects">
              <Button size="lg" variant="purple">
                View All Projects
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}
