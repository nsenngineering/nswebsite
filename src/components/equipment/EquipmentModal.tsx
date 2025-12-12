'use client';

import React from 'react';
import { Building2, Tag, Gauge, CheckCircle2, FileText } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import ImageCarousel from '@/components/ui/ImageCarousel';
import type { Equipment } from '@/types/equipment';
import { withBasePath } from '@/lib/utils';
import { getEquipmentCategoryLabel, getEquipmentCategoryColor } from '@/lib/equipment-categories';

interface EquipmentModalProps {
  equipment: Equipment | null;
  isOpen: boolean;
  onClose: () => void;
}

const getCategoryColor = (category: Equipment['category']) => {
  const colors = {
    'pile-testing': 'bg-purple-100 text-purple-700',
    'drilling': 'bg-purple-200 text-purple-800',
    'laboratory': 'bg-purple-50 text-purple-600',
    'geophysical': 'bg-purple-200 text-purple-900',
    'field-testing': 'bg-indigo-100 text-indigo-700'
  };
  return colors[category] || 'bg-purple-100 text-purple-700';
};

export default function EquipmentModal({ equipment, isOpen, onClose }: EquipmentModalProps) {
  if (!equipment) return null;

  const hasImages = equipment.media && (equipment.media.images.length > 0 || equipment.media.heroImage);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" title={equipment.name}>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Carousel Column - 60% on desktop */}
        <div className="lg:col-span-3">
          {hasImages ? (
            <ImageCarousel
              images={equipment.media.images}
              heroImage={equipment.media.heroImage}
              alt={equipment.name}
              projectId={equipment.id}
              basePath="/equipment"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] md:h-[400px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg">
              <Gauge className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-center">No photos available for this equipment</p>
            </div>
          )}
        </div>

        {/* Details Column - 40% on desktop */}
        <div className="lg:col-span-2 space-y-6">
          {/* Category Badge */}
          <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getCategoryColor(equipment.category)}`}>
            {getEquipmentCategoryLabel(equipment.category)}
          </div>

          {/* Equipment Metadata */}
          <div className="space-y-4">
            {equipment.manufacturer && (
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Manufacturer</div>
                  <div className="text-base font-medium text-gray-900">{equipment.manufacturer}</div>
                </div>
              </div>
            )}

            {equipment.model && (
              <div className="flex items-start gap-3">
                <Tag className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Model</div>
                  <div className="text-base font-medium text-gray-900">{equipment.model}</div>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Gauge className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Key Specification</div>
                <div className="text-base font-medium text-gray-900">{equipment.keySpec}</div>
              </div>
            </div>
          </div>

          {/* Overview/Description */}
          {equipment.description && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Overview</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {equipment.description}
              </p>
            </div>
          )}

          {/* Technical Specifications Table */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Technical Specifications</h3>
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-gray-200">
                  {equipment.specs.capacity && (
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-700 bg-gray-50">Capacity</td>
                      <td className="px-4 py-3 text-gray-900">{equipment.specs.capacity}</td>
                    </tr>
                  )}
                  {equipment.specs.accuracy && (
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-700 bg-gray-50">Accuracy</td>
                      <td className="px-4 py-3 text-gray-900">{equipment.specs.accuracy}</td>
                    </tr>
                  )}
                  {equipment.specs.standards && equipment.specs.standards.length > 0 && (
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-700 bg-gray-50">Standards</td>
                      <td className="px-4 py-3 text-gray-900">{equipment.specs.standards.join(', ')}</td>
                    </tr>
                  )}
                  {equipment.specs.software && (
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-700 bg-gray-50">Software</td>
                      <td className="px-4 py-3 text-gray-900">{equipment.specs.software}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Applications */}
          {equipment.applications && equipment.applications.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Applications</h3>
              <ul className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                {equipment.applications.map((app, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>{app}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Specification Sheet Download */}
          {equipment.media?.specSheet && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Documents</h3>
              <a
                href={withBasePath(`/equipment/${equipment.media.specSheet}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors text-sm font-medium"
              >
                <FileText className="w-4 h-4" />
                Download Specification Sheet
              </a>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
