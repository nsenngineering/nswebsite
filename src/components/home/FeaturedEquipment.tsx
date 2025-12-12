'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Settings, Wrench } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import equipmentDataRaw from '@/data/generated/equipment.json';
import type { Equipment } from '@/types/equipment';
import { withBasePath } from '@/lib/utils';

const equipmentData = equipmentDataRaw as { equipment: Equipment[] };
const featuredEquipment = equipmentData.equipment.filter(e => e.featured);

const getCategoryLabel = (category: Equipment['category']): string => {
  const labels: Record<Equipment['category'], string> = {
    'pile-testing': 'Pile Testing',
    'drilling': 'Drilling',
    'laboratory': 'Laboratory',
    'geophysical': 'Geophysical',
    'field-testing': 'Field Testing'
  };
  return labels[category];
};

const getCategoryColor = (category: Equipment['category']): string => {
  const colors: Record<Equipment['category'], string> = {
    'pile-testing': 'from-purple-500 to-purple-700',
    'drilling': 'from-purple-600 to-purple-800',
    'laboratory': 'from-purple-400 to-purple-600',
    'geophysical': 'from-purple-700 to-purple-900',
    'field-testing': 'from-indigo-600 to-purple-700'
  };
  return colors[category];
};

export default function FeaturedEquipment() {
  // If no featured equipment, don't render the section
  if (featuredEquipment.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-white">
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
              Featured Equipment
            </h2>
            <p className="text-xl text-gray-600">
              State-of-the-art testing and investigation equipment
            </p>
          </motion.div>
        </div>

        {/* Horizontal Scroll Carousel */}
        <div className="relative">
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {featuredEquipment.map((equipment, index) => {
              const hasImages = equipment.media && (equipment.media.images.length > 0 || equipment.media.heroImage);
              const heroImage = equipment.media?.heroImage || equipment.media?.images[0];

              return (
                <motion.div
                  key={equipment.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex-shrink-0 w-[350px] md:w-[400px] snap-start group"
                >
                  <Link href={`/equipment#${equipment.id}`}>
                    <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-lg cursor-pointer">
                      {/* Hero Image or Gradient Fallback */}
                      {hasImages && heroImage ? (
                        <img
                          src={withBasePath(`/equipment/${heroImage}`)}
                          alt={equipment.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          onError={(e) => {
                            // Fallback to gradient if image fails
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${getCategoryColor(equipment.category)}`}>
                          {/* Icon overlay for equipment without images */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            {equipment.category === 'pile-testing' || equipment.category === 'field-testing' ? (
                              <Settings className="w-24 h-24 text-white/30" />
                            ) : (
                              <Wrench className="w-24 h-24 text-white/30" />
                            )}
                          </div>
                        </div>
                      )}

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                      {/* Content Overlay */}
                      <div className="absolute inset-0 p-6 flex flex-col justify-between">
                        {/* Top: Category Badge */}
                        <div className="flex justify-between items-start">
                          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-white">
                            {getCategoryLabel(equipment.category)}
                          </span>
                        </div>

                        {/* Bottom: Name, Key Spec & CTA */}
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1 line-clamp-2">
                            {equipment.name}
                          </h3>
                          <p className="text-sm text-white/80 mb-1">{equipment.manufacturer || 'Professional Grade'}</p>
                          <p className="text-sm font-medium text-white/90 mb-3">{equipment.keySpec}</p>
                          <div className="flex items-center text-white/90 text-sm font-medium group-hover:text-white transition-colors">
                            View Specifications →
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* View All CTA */}
        <div className="text-center mt-10">
          <Link href="/equipment">
            <Button size="lg" variant="purple">
              View All Equipment
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
