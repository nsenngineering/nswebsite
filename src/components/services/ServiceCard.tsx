'use client';

import React from 'react';
import { Wrench, Package, Camera, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import type { Service } from '@/types/service';
import { withBasePath } from '@/lib/utils';

interface ServiceCardProps {
  service: Service;
  onOpenModal: () => void;
}

// Category gradient mapping (matching service categories)
const CATEGORY_GRADIENTS: Record<string, string> = {
  'pile-testing': 'from-purple-500 to-purple-700',
  'soil-laboratory': 'from-blue-500 to-blue-700',
  'rock-laboratory': 'from-indigo-500 to-indigo-700',
  'drilling': 'from-amber-500 to-amber-700',
  'geophysical': 'from-teal-500 to-teal-700',
  'ndt': 'from-rose-500 to-rose-700',
};

// Category label mapping
const CATEGORY_LABELS: Record<string, string> = {
  'pile-testing': 'Pile Testing',
  'soil-laboratory': 'Soil Laboratory',
  'rock-laboratory': 'Rock Laboratory',
  'drilling': 'Drilling',
  'geophysical': 'Geophysical',
  'ndt': 'NDT Services',
};

function getCategoryGradient(category: string): string {
  return CATEGORY_GRADIENTS[category] || 'from-gray-500 to-gray-700';
}

function getCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category] || category;
}

export default function ServiceCard({ service, onOpenModal }: ServiceCardProps) {
  const hasImages = service.media && service.media.images.length > 0;
  const heroImage = service.media?.heroImage || service.media?.images[0];
  const imageCount = service.media?.images?.length || 0;

  return (
    <Card
      hover
      className="h-full transition-all duration-300 cursor-pointer group"
      onClick={onOpenModal}
    >
      <CardContent className="p-0">
        {/* Hero Image Section */}
        {hasImages && heroImage ? (
          <div className="relative h-[250px] overflow-hidden">
            <img
              src={withBasePath(heroImage)}
              alt={service.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              onError={(e) => {
                // Fallback to gradient if image fails to load
                e.currentTarget.style.display = 'none';
                const colorClasses = getCategoryGradient(service.category).split(' ');
                e.currentTarget.parentElement?.classList.add('bg-gradient-to-br', ...colorClasses);
              }}
            />

            {/* Category Badge Overlay */}
            <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-800">
              {getCategoryLabel(service.category)}
            </div>

            {/* Service Name Overlay at Bottom */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent pt-8 pb-3 px-4">
              <h3 className="text-base font-bold text-white line-clamp-2">
                {service.name}
              </h3>
            </div>

            {/* Camera Badge (Photo Count) */}
            {imageCount > 0 && (
              <div className="absolute top-[210px] right-3 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-full text-xs font-medium text-white flex items-center gap-1 z-10">
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
          <div className={`p-6 pb-8 bg-gradient-to-br ${getCategoryGradient(service.category)} text-white`}>
            <div className="flex items-start justify-between mb-6">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                {getCategoryLabel(service.category)}
              </span>
            </div>
            {/* Service Title inside gradient */}
            <h3 className="text-lg font-bold text-white line-clamp-2">
              {service.name}
            </h3>
          </div>
        )}

        {/* Service Details */}
        <div className="p-6">
          {/* Short Description */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {service.shortDescription}
          </p>

          {/* Equipment Preview */}
          {service.equipmentUsed && service.equipmentUsed.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2 font-medium">
                <Wrench className="w-3.5 h-3.5" />
                Equipment
              </div>
              <ul className="space-y-1.5">
                {service.equipmentUsed.slice(0, 3).map((item, idx) => (
                  <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary-600 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-1">{item}</span>
                  </li>
                ))}
                {service.equipmentUsed.length > 3 && (
                  <li className="text-xs text-primary-600 font-medium">
                    +{service.equipmentUsed.length - 3} more items
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Deliverables Preview */}
          {service.typicalDeliverables && service.typicalDeliverables.length > 0 && (
            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2 font-medium">
                <Package className="w-3.5 h-3.5" />
                Deliverables
              </div>
              <ul className="space-y-1.5">
                {service.typicalDeliverables.slice(0, 2).map((item, idx) => (
                  <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary-600 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-1">{item}</span>
                  </li>
                ))}
                {service.typicalDeliverables.length > 2 && (
                  <li className="text-xs text-primary-600 font-medium">
                    +{service.typicalDeliverables.length - 2} more items
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
