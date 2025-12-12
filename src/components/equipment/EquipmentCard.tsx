'use client';

import React from 'react';
import { Tag, Gauge, CheckCircle2, Camera } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import type { Equipment } from '@/types/equipment';
import { withBasePath } from '@/lib/utils';
import { getEquipmentCategoryGradient, getEquipmentCategoryLabel } from '@/lib/equipment-categories';

interface EquipmentCardProps {
  equipment: Equipment;
  onClick: () => void;
  isHighlighted?: boolean;
}

export default function EquipmentCard({
  equipment,
  onClick,
  isHighlighted = false
}: EquipmentCardProps) {
  const hasImages = equipment.media && (equipment.media.images.length > 0 || equipment.media.heroImage);
  const heroImage = equipment.media?.heroImage || equipment.media?.images[0];
  const imageCount = equipment.media?.images?.length || 0;

  return (
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
          <div className="relative h-[200px] overflow-hidden">
            <img
              src={withBasePath(`/equipment/${heroImage}`)}
              alt={equipment.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              onError={(e) => {
                // Fallback to gradient if image fails to load
                e.currentTarget.style.display = 'none';
                const colorClasses = getEquipmentCategoryGradient(equipment.category).split(' ');
                e.currentTarget.parentElement?.classList.add('bg-gradient-to-br', ...colorClasses);
              }}
            />

            {/* Category Badge Overlay */}
            <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-800">
              {getEquipmentCategoryLabel(equipment.category)}
            </div>

            {/* Manufacturer Badge Overlay */}
            {equipment.manufacturer && (
              <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-800">
                {equipment.manufacturer}
              </div>
            )}

            {/* Camera Badge (Photo Count) */}
            {imageCount > 0 && (
              <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-full text-xs font-medium text-white flex items-center gap-1">
                <Camera className="w-3 h-3" />
                {imageCount}
              </div>
            )}

            {/* Hover Overlay with "View Specifications" Button */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button size="sm" variant="secondary" className="shadow-lg">
                View Specifications →
              </Button>
            </div>
          </div>
        ) : (
          // Fallback gradient header if no images
          <div className={`p-6 bg-gradient-to-br ${getEquipmentCategoryGradient(equipment.category)} text-white`}>
            <div className="flex items-start justify-between mb-2">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                {getEquipmentCategoryLabel(equipment.category)}
              </span>
              {equipment.manufacturer && (
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                  {equipment.manufacturer}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Equipment Name */}
        <div className="px-6 pt-4">
          <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
            {equipment.name}
          </h3>
          {equipment.model && (
            <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-3">
              <Tag className="w-3.5 h-3.5" />
              <span>{equipment.model}</span>
            </div>
          )}
        </div>

        {/* Equipment Details */}
        <div className="px-6 pb-6">
          {/* Key Spec Highlight */}
          <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
            <div className="flex items-start gap-2">
              <Gauge className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-xs text-purple-600 font-medium mb-0.5">Key Specification</div>
                <div className="text-sm font-semibold text-gray-900">
                  {equipment.keySpec}
                </div>
              </div>
            </div>
          </div>

          {/* Applications Preview */}
          {equipment.applications.length > 0 && (
            <div className="border-t border-gray-100 pt-4">
              <div className="text-xs text-gray-500 mb-2 font-medium">Applications</div>
              <ul className="space-y-1.5">
                {equipment.applications.slice(0, 2).map((app, idx) => (
                  <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary-600 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-1">{app}</span>
                  </li>
                ))}
                {equipment.applications.length > 2 && (
                  <li className="text-xs text-primary-600 font-medium">
                    +{equipment.applications.length - 2} more applications
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
