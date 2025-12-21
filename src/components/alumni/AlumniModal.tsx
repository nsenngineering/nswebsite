'use client';

import React from 'react';
import { User, Linkedin, Award, Calendar, Quote } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import type { Alumni } from '@/types/alumni';
import { withBasePath } from '@/lib/utils';

interface AlumniModalProps {
  alumnus: Alumni | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AlumniModal({ alumnus, isOpen, onClose }: AlumniModalProps) {
  if (!alumnus) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title={alumnus.name}>
      <div className="space-y-6">
        {/* Profile Image - Centered */}
        <div className="flex justify-center">
          {alumnus.profileImage ? (
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-500 shadow-lg">
              <img
                src={withBasePath(alumnus.profileImage)}
                alt={alumnus.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to icon if image fails
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.className = 'w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg';
                    const icon = document.createElement('div');
                    icon.innerHTML = '<svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>';
                    parent.appendChild(icon);
                  }
                }}
              />
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg">
              <User className="w-16 h-16 text-white" />
            </div>
          )}
        </div>

        {/* Years Worked */}
        <div className="flex items-center justify-center gap-2 text-center">
          <Calendar className="w-5 h-5 text-primary-600" />
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Years at NSEGS</h3>
            <p className="text-lg font-bold text-primary-600">{alumnus.yearsWorked}</p>
          </div>
        </div>

        {/* Achievements */}
        {alumnus.achievements.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-primary-600" />
              <h3 className="text-sm font-semibold text-gray-900">Achievements</h3>
            </div>
            <ul className="space-y-2">
              {alumnus.achievements.map((achievement, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-600 mt-2 flex-shrink-0" />
                  <span>{achievement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Testimonial */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Quote className="w-5 h-5 text-primary-600" />
            <h3 className="text-sm font-semibold text-gray-900">Testimonial</h3>
          </div>
          <blockquote className="text-sm text-gray-700 italic border-l-4 border-primary-500 pl-4 py-2 bg-gray-50 rounded-r">
            "{alumnus.testimonial}"
          </blockquote>
        </div>

        {/* LinkedIn Button */}
        {alumnus.linkedinUrl && (
          <div className="pt-2">
            <a
              href={alumnus.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Linkedin className="w-4 h-4" />
              View LinkedIn Profile
            </a>
          </div>
        )}
      </div>
    </Modal>
  );
}
