'use client';

import React from 'react';
import { Wrench, Package, List, CheckCircle2, Beaker } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import ImageCarousel from '@/components/ui/ImageCarousel';
import type { Service } from '@/types/service';

interface ServiceModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
}

// Category color mapping
const CATEGORY_COLORS: Record<string, string> = {
  'pile-testing': 'bg-purple-100 text-purple-700',
  'soil-laboratory': 'bg-blue-100 text-blue-700',
  'rock-laboratory': 'bg-indigo-100 text-indigo-700',
  'drilling': 'bg-amber-100 text-amber-700',
  'geophysical': 'bg-teal-100 text-teal-700',
  'ndt': 'bg-rose-100 text-rose-700',
};

const CATEGORY_LABELS: Record<string, string> = {
  'pile-testing': 'Pile Testing',
  'soil-laboratory': 'Soil Laboratory',
  'rock-laboratory': 'Rock Laboratory',
  'drilling': 'Drilling',
  'geophysical': 'Geophysical',
  'ndt': 'NDT Services',
};

function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] || 'bg-gray-100 text-gray-700';
}

function getCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category] || category;
}

export default function ServiceModal({ service, isOpen, onClose }: ServiceModalProps) {
  if (!service) return null;

  const hasImages = service.media && service.media.images.length > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" title={service.name}>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Carousel Column - 60% on desktop */}
        <div className="lg:col-span-3">
          {hasImages ? (
            <ImageCarousel
              images={service.media.images}
              heroImage={service.media.heroImage}
              alt={service.name}
              projectId={service.id}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] md:h-[400px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg">
              <Beaker className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-center">No photos available for this service</p>
            </div>
          )}
        </div>

        {/* Details Column - 40% on desktop */}
        <div className="lg:col-span-2 space-y-6">
          {/* Category Badge */}
          <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getCategoryColor(service.category)}`}>
            {getCategoryLabel(service.category)}
          </div>

          {/* Short Description */}
          {service.shortDescription && (
            <div>
              <p className="text-base text-gray-700 leading-relaxed">{service.shortDescription}</p>
            </div>
          )}

          {/* Full Description */}
          {service.fullDescription && (
            <div className="border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-600 leading-relaxed">{service.fullDescription}</p>
            </div>
          )}

          {/* Process Steps */}
          {service.processSteps && service.processSteps.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <List className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-bold text-gray-900">Process Steps</h3>
              </div>
              <ol className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                {service.processSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-semibold flex items-center justify-center text-xs">
                      {idx + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Equipment Used */}
          {service.equipmentUsed && service.equipmentUsed.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Wrench className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-bold text-gray-900">Equipment Used</h3>
              </div>
              <ul className="space-y-2 max-h-[150px] overflow-y-auto pr-2">
                {service.equipmentUsed.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Typical Deliverables */}
          {service.typicalDeliverables && service.typicalDeliverables.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-bold text-gray-900">Typical Deliverables</h3>
              </div>
              <ul className="space-y-2 max-h-[150px] overflow-y-auto pr-2">
                {service.typicalDeliverables.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
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
