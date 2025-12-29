'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Camera } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import ServiceModal from '@/components/services/ServiceModal';
import servicesDataRaw from '@/data/generated/services.json';
import type { Service } from '@/types/service';
import { withBasePath } from '@/lib/utils';

const servicesData = servicesDataRaw as { services: Service[] };
const featuredServices = servicesData.services.filter(s => s.featured);

// Category gradient mapping
const CATEGORY_GRADIENTS: Record<string, string> = {
  'pile-testing': 'from-purple-500 to-purple-700',
  'soil-laboratory': 'from-blue-500 to-blue-700',
  'rock-laboratory': 'from-indigo-500 to-indigo-700',
  'drilling': 'from-amber-500 to-amber-700',
  'geophysical': 'from-teal-500 to-teal-700',
  'ndt': 'from-rose-500 to-rose-700',
};

const CATEGORY_LABELS: Record<string, string> = {
  'pile-testing': 'Pile Testing',
  'soil-laboratory': 'Soil Laboratory',
  'rock-laboratory': 'Rock Laboratory',
  'drilling': 'Drilling',
  'geophysical': 'Geophysical',
  'ndt': 'NDT Services',
};

function getCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category] || category;
}

function getCategoryGradient(category: string): string {
  return CATEGORY_GRADIENTS[category] || 'from-gray-500 to-gray-700';
}

export default function FeaturedServices() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // If no featured services, don't render the section
  if (featuredServices.length === 0) {
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
                Featured Services
              </h2>
              <p className="text-xl text-gray-600">
                Comprehensive geotechnical and engineering services
              </p>
            </motion.div>
          </div>

          {/* Horizontal Scroll Carousel */}
          <div className="relative">
            <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
              {featuredServices.map((service, index) => {
                const hasImages = service.media && service.media.images.length > 0;
                const heroImage = service.media?.heroImage || service.media?.images[0];
                const imageCount = service.media?.images?.length || 0;

                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex-shrink-0 w-[350px] md:w-[400px] snap-start cursor-pointer group"
                    onClick={() => setSelectedService(service)}
                  >
                    <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-lg">
                      {/* Hero Image or Gradient Fallback */}
                      {hasImages && heroImage ? (
                        <img
                          src={withBasePath(heroImage)}
                          alt={service.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          onError={(e) => {
                            // Fallback to gradient if image fails
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement?.classList.add('bg-gradient-to-br');
                            const gradientClasses = getCategoryGradient(service.category).split(' ');
                            e.currentTarget.parentElement?.classList.add(...gradientClasses);
                          }}
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${getCategoryGradient(service.category)}`} />
                      )}

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                      {/* Content Overlay */}
                      <div className="absolute inset-0 p-6 flex flex-col justify-between">
                        {/* Top: Category Badge & Photo Count */}
                        <div className="flex justify-between items-start">
                          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-white">
                            {getCategoryLabel(service.category)}
                          </span>
                          {imageCount > 0 && (
                            <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white flex items-center gap-1">
                              <Camera className="w-3 h-3" />
                              {imageCount}
                            </span>
                          )}
                        </div>

                        {/* Bottom: Title, Description & CTA */}
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1 line-clamp-2">
                            {service.name}
                          </h3>
                          <p className="text-sm text-white/80 mb-3 line-clamp-2">{service.shortDescription}</p>
                          <div className="flex items-center text-white/90 text-sm font-medium group-hover:text-white transition-colors">
                            View Service Details →
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
            <Link href="/services">
              <Button size="lg" variant="purple">
                View All Services
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Modal */}
      <ServiceModal
        service={selectedService}
        isOpen={selectedService !== null}
        onClose={() => setSelectedService(null)}
      />
    </>
  );
}
