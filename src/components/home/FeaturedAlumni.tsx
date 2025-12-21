'use client';

import { motion } from 'framer-motion';
import { ArrowRight, User } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import alumniDataRaw from '@/data/generated/alumni.json';
import type { Alumni } from '@/types/alumni';
import { withBasePath } from '@/lib/utils';

const alumniData = alumniDataRaw as { alumni: Alumni[] };
const featuredAlumni = alumniData.alumni.filter(a => a.featured);

export default function FeaturedAlumni() {
  // If no featured alumni, don't render the section
  if (featuredAlumni.length === 0) {
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
              Our Alumni
            </h2>
            <p className="text-xl text-gray-600">
              Talented professionals who built their careers at NS Engineering
            </p>
          </motion.div>
        </div>

        {/* Horizontal Scroll Carousel */}
        <div className="relative">
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {featuredAlumni.map((alumnus, index) => (
              <motion.div
                key={alumnus.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0 w-[350px] md:w-[400px] snap-start"
              >
                <Link href="/alumni">
                  <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow cursor-pointer h-full flex flex-col">
                    {/* Profile Image or Icon */}
                    <div className="flex justify-center mb-6">
                      {alumnus.profileImage ? (
                        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-purple-500 shadow-lg">
                          <img
                            src={withBasePath(alumnus.profileImage)}
                            alt={alumnus.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              // Fallback to icon if image fails
                              e.currentTarget.style.display = 'none';
                              const parent = e.currentTarget.parentElement;
                              if (parent) {
                                parent.className = 'w-28 h-28 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg';
                                const icon = document.createElement('div');
                                icon.innerHTML = '<svg class="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>';
                                parent.appendChild(icon);
                              }
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg">
                          <User className="w-14 h-14 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Name */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                      {alumnus.name}
                    </h3>

                    {/* Years Worked */}
                    <p className="text-sm font-medium text-primary-600 mb-4 text-center">
                      {alumnus.yearsWorked}
                    </p>

                    {/* Testimonial Preview */}
                    <div className="flex-grow">
                      <p className="text-sm text-gray-600 italic line-clamp-4 text-center">
                        "{alumnus.testimonial}"
                      </p>
                    </div>

                    {/* View More Link */}
                    <div className="flex items-center justify-center text-primary-600 text-sm font-medium mt-4 hover:text-primary-700 transition-colors">
                      View Alumni Profile →
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* View All CTA */}
        <div className="text-center mt-10">
          <Link href="/alumni">
            <Button size="lg" variant="purple">
              View All Alumni
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
