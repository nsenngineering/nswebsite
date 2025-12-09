'use client';

import React from 'react';
import { Building2, MapPin, Calendar, CheckCircle2, Camera } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import type { Project } from '@/types/project';

interface ProjectCardProps {
  project: Project;
  isHighlighted: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

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

export default function ProjectCard({
  project,
  isHighlighted,
  onMouseEnter,
  onMouseLeave,
  onClick
}: ProjectCardProps) {
  const hasImages = project.media && (project.media.images.length > 0 || project.media.heroImage);
  const heroImage = project.media?.heroImage || project.media?.images[0];
  const imageCount = project.media?.images?.length || 0;

  return (
    <div
      id={`project-${project.id}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Card
        hover
        className={`h-full transition-all duration-300 cursor-pointer group ${
          isHighlighted ? 'ring-4 ring-purple-500 shadow-2xl scale-105' : ''
        }`}
        onClick={onClick}
      >
        <CardContent className="p-0">
          {/* Hero Image Section */}
          {hasImages && heroImage ? (
            <div className="relative h-[250px] overflow-hidden">
              <img
                src={`/projects/${heroImage}`}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  // Fallback to gradient if image fails to load
                  e.currentTarget.style.display = 'none';
                  const colorClasses = getCategoryColor(project.category).split(' ');
                  e.currentTarget.parentElement?.classList.add('bg-gradient-to-br', ...colorClasses);
                }}
              />

              {/* Category Badge Overlay */}
              <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-800">
                {getCategoryLabel(project.category)}
              </div>

              {/* Year Badge Overlay */}
              <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-800">
                <Calendar className="w-3 h-3" />
                {project.year}
              </div>

              {/* Camera Badge (Photo Count) */}
              {imageCount > 0 && (
                <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-full text-xs font-medium text-white flex items-center gap-1">
                  <Camera className="w-3 h-3" />
                  {imageCount}
                </div>
              )}

              {/* Hover Overlay with "View Details" Button */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button size="sm" variant="secondary" className="shadow-lg">
                  View Details →
                </Button>
              </div>
            </div>
          ) : (
            // Fallback gradient header if no images
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
            </div>
          )}

          {/* Project Title (if image exists, show below image) */}
          {hasImages && heroImage && (
            <div className="px-6 pt-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                {project.title}
              </h3>
            </div>
          )}

          {/* Project Title (if no image, already in gradient header) */}
          {(!hasImages || !heroImage) && (
            <div className={`px-6 ${hasImages ? 'pt-4' : ''}`}>
              <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                {project.title}
              </h3>
            </div>
          )}

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
                    {project.location.name}
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
    </div>
  );
}
