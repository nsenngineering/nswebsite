'use client';

import React from 'react';
import { Building2, MapPin, Calendar, CheckCircle2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import ImageCarousel from '@/components/ui/ImageCarousel';
import type { Project } from '@/types/project';
import { withBasePath } from '@/lib/utils';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const getCategoryColor = (category: Project['category']): string => {
  const colors: Record<Project['category'], string> = {
    'pile-testing': 'bg-purple-100 text-purple-700',
    'tunnel-road': 'bg-purple-200 text-purple-800',
    'hydropower': 'bg-purple-50 text-purple-600',
    'transmission': 'bg-purple-200 text-purple-900',
    'ndt': 'bg-indigo-100 text-indigo-700'
  };
  return colors[category];
};

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

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  if (!project) return null;

  const hasImages = project.media && (project.media.images.length > 0 || project.media.heroImage);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" title={project.title}>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Carousel Column - 60% on desktop */}
        <div className="lg:col-span-3">
          {hasImages ? (
            <ImageCarousel
              images={project.media.images}
              heroImage={project.media.heroImage}
              alt={project.title}
              projectId={project.id}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] md:h-[400px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg">
              <Building2 className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-center">No photos available for this project</p>
            </div>
          )}
        </div>

        {/* Details Column - 40% on desktop */}
        <div className="lg:col-span-2 space-y-6">
          {/* Category Badge */}
          <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getCategoryColor(project.category)}`}>
            {getCategoryLabel(project.category)}
          </div>

          {/* Project Metadata */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Client</div>
                <div className="text-base font-medium text-gray-900">{project.client}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Location</div>
                <div className="text-base font-medium text-gray-900">
                  {project.location.name}
                  {project.location.district && `, ${project.location.district}`}
                </div>
                {project.location.coordinates && (
                  <div className="text-xs text-gray-400 mt-1">
                    {project.location.coordinates.lat.toFixed(4)}°N, {project.location.coordinates.lng.toFixed(4)}°E
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Year</div>
                <div className="text-base font-medium text-gray-900">{project.year}</div>
              </div>
            </div>
          </div>

          {/* Scope of Work */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Scope of Work</h3>
            <ul className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {project.scope.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Project Documents (if available) */}
          {project.media?.pdfs && project.media.pdfs.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Documents</h3>
              <ul className="space-y-2">
                {project.media.pdfs.map((pdf, idx) => (
                  <li key={idx}>
                    <a
                      href={withBasePath(`/projects/${project.id}/pdfs/${pdf}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 hover:underline"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {pdf}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
