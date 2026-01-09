'use client';

import React from 'react';
import { Users, Linkedin, CheckCircle2, Briefcase, GraduationCap, Award } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import type { TeamMember } from '@/types/team';
import { withBasePath } from '@/lib/utils';

interface TeamModalProps {
  member: TeamMember | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TeamModal({ member, isOpen, onClose }: TeamModalProps) {
  if (!member) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title={member.name}>
      <div className="space-y-6">
        {/* Profile Image - Centered */}
        <div className="flex justify-center">
          {member.hasImage && member.image ? (
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-500 shadow-lg">
              <img
                src={withBasePath(member.image)}
                alt={member.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to icon if image fails
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.className = 'w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg';
                    const icon = document.createElement('div');
                    icon.innerHTML = '<svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>';
                    parent.appendChild(icon);
                  }
                }}
              />
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg">
              <Users className="w-16 h-16 text-white" />
            </div>
          )}
        </div>

        {/* Role */}
        <div className="text-center">
          <p className="text-lg font-bold text-primary-600">{member.role}</p>
        </div>

        {/* Education */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <GraduationCap className="w-5 h-5 text-primary-600" />
            <h3 className="text-sm font-semibold text-gray-900">Education</h3>
          </div>
          <p className="text-sm text-gray-700 pl-7">{member.education}</p>
        </div>

        {/* Experience */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Briefcase className="w-5 h-5 text-primary-600" />
            <h3 className="text-sm font-semibold text-gray-900">Experience</h3>
          </div>
          <p className="text-sm text-gray-700 pl-7">{member.experience} of professional experience</p>
        </div>

        {/* Specializations */}
        {member.specializations && member.specializations.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-primary-600" />
              <h3 className="text-sm font-semibold text-gray-900">Specializations</h3>
            </div>
            <ul className="space-y-2">
              {member.specializations.map((specialization, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>{specialization}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* LinkedIn Button */}
        {member.linkedinUrl && (
          <div className="pt-2">
            <a
              href={member.linkedinUrl}
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
