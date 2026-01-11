'use client';

import React from 'react';
import { Users, Linkedin, CheckCircle2, Briefcase } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import type { TeamMember } from '@/types/team';
import { withBasePath } from '@/lib/utils';

interface TeamCardProps {
  member: TeamMember;
  onOpenModal: () => void;
}

export default function TeamCard({ member, onOpenModal }: TeamCardProps) {
  return (
    <Card
      hover
      className="h-full transition-all duration-300 cursor-pointer group"
      onClick={onOpenModal}
    >
      <CardContent className="p-6">
        {/* Profile Image or Icon */}
        <div className="flex justify-center mb-4">
          {member.hasImage && member.image ? (
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-purple-500 shadow-lg group-hover:scale-105 transition-transform">
              <img
                src={withBasePath(member.image)}
                alt={member.name}
                className="w-full h-full object-cover object-[center_30%]"
                loading="lazy"
                onError={(e) => {
                  // Fallback to icon if image fails
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.className = 'w-28 h-28 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg';
                    const icon = document.createElement('div');
                    icon.innerHTML = '<svg class="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>';
                    parent.appendChild(icon);
                  }
                }}
              />
            </div>
          ) : (
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Users className="w-14 h-14 text-white" />
            </div>
          )}
        </div>

        {/* Name */}
        <h3 className="text-xl font-bold text-gray-900 mb-1 text-center line-clamp-1">
          {member.name}
        </h3>

        {/* Role */}
        <p className="text-sm font-medium text-primary-600 mb-4 text-center">
          {member.role}
        </p>

        {/* Education & Experience */}
        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-2 text-sm text-gray-700">
            <CheckCircle2 className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2">{member.education}</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-gray-700">
            <Briefcase className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
            <span>{member.experience} Experience</span>
          </div>
        </div>

        {/* Specializations Preview (first 2 items) */}
        {member.specializations && member.specializations.length > 0 && (
          <div className="space-y-2 mb-4 border-t border-gray-100 pt-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Specializations
            </p>
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2">{member.specializations[0]}</span>
            </div>
            {member.specializations.length > 1 && (
              <div className="flex items-start gap-2 text-sm text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-2">{member.specializations[1]}</span>
              </div>
            )}
            {member.specializations.length > 2 && (
              <p className="text-xs text-gray-500 text-center mt-2">
                +{member.specializations.length - 2} more specialization{member.specializations.length - 2 !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        )}

        {/* LinkedIn Badge */}
        {member.linkedinUrl && (
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
              <Linkedin className="w-3.5 h-3.5" />
              LinkedIn
            </div>
          </div>
        )}

        {/* Hover Overlay with "View Profile" Button */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-4">
          <Button size="sm" variant="purple" className="w-full">
            View Profile →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
