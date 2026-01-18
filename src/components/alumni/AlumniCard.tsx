'use client';

import React from 'react';
import { User, Linkedin, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import type { Alumni } from '@/types/alumni';
import { withBasePath } from '@/lib/utils';

interface AlumniCardProps {
  alumnus: Alumni;
  onOpenModal: () => void;
}

export default function AlumniCard({ alumnus, onOpenModal }: AlumniCardProps) {
  return (
    <Card
      hover
      className="h-full transition-all duration-300 cursor-pointer group"
      onClick={onOpenModal}
    >
      <CardContent className="p-6">
        {/* Profile Image or Icon */}
        <div className="flex justify-center mb-4">
          {alumnus.profileImage ? (
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-purple-500 shadow-lg group-hover:scale-105 transition-transform">
              <img
                src={withBasePath(alumnus.profileImage)}
                alt={alumnus.name}
                className="w-full h-full object-cover object-[center_30%]"
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
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <User className="w-14 h-14 text-white" />
            </div>
          )}
        </div>

        {/* Name */}
        <h3 className="text-xl font-bold text-gray-900 mb-1 text-center line-clamp-1">
          {alumnus.name}
        </h3>

        {/* Years Worked */}
        {alumnus.yearsWorked && (
          <p className="text-sm font-medium text-primary-600 mb-4 text-center">
            {alumnus.yearsWorked}
          </p>
        )}

        {/* Achievements Preview (first 2 items) */}
        {alumnus.achievements.length > 0 && (
          <div className="space-y-2 mb-4">
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <Award className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2">{alumnus.achievements[0]}</span>
            </div>
            {alumnus.achievements.length > 1 && (
              <div className="flex items-start gap-2 text-sm text-gray-700">
                <Award className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-2">{alumnus.achievements[1]}</span>
              </div>
            )}
            {alumnus.achievements.length > 2 && (
              <p className="text-xs text-gray-500 text-center mt-2">
                +{alumnus.achievements.length - 2} more achievement{alumnus.achievements.length - 2 !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        )}

        {/* LinkedIn Badge */}
        {alumnus.linkedinUrl && (
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
              <Linkedin className="w-3.5 h-3.5" />
              LinkedIn
            </div>
          </div>
        )}

        {/* Testimonial Preview */}
        {alumnus.testimonial && (
          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm text-gray-600 italic line-clamp-3 text-center">
              "{alumnus.testimonial}"
            </p>
          </div>
        )}

        {/* Hover Overlay with "View Details" Button */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-4">
          <Button size="sm" variant="purple" className="w-full">
            View Full Profile →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
