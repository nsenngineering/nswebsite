'use client';

import { useState, useMemo } from 'react';
import { Search, Users } from 'lucide-react';
import teamData from '@/data/generated/team.json';
import TeamCard from '@/components/team/TeamCard';
import TeamModal from '@/components/team/TeamModal';
import FadeIn from '@/components/animations/FadeIn';
import type { TeamMember } from '@/types/team';

export default function TeamClient() {
  const team = teamData.members as TeamMember[];

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Get unique roles for filter dropdown
  const uniqueRoles = useMemo(() => {
    const roles = Array.from(new Set(team.map(m => m.role)));
    return ['all', ...roles];
  }, [team]);

  // Filtering logic
  const filteredTeam = useMemo(() => {
    return team.filter((member) => {
      const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = selectedRole === 'all' || member.role === selectedRole;
      return matchesSearch && matchesRole;
    });
  }, [team, searchQuery, selectedRole]);

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-purple-600 to-primary-700">
        {/* Gradient pattern background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <FadeIn>
            <Users className="w-16 h-16 mx-auto mb-6 text-white opacity-90" />
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our Team
            </h1>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Meet the professionals behind NS Engineering & Geotechnical Services
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <FadeIn delay={0.1}>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search team members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Role Filter */}
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white"
              >
                {uniqueRoles.map(role => (
                  <option key={role} value={role}>
                    {role === 'all' ? 'All Roles' : role}
                  </option>
                ))}
              </select>
            </div>

            {/* Results count */}
            <p className="text-gray-600">
              Showing <span className="font-semibold text-primary-600">{filteredTeam.length}</span> of{' '}
              <span className="font-semibold">{team.length}</span> team members
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredTeam.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTeam.map((member, index) => (
                <FadeIn key={member.name} delay={index * 0.05}>
                  <TeamCard
                    member={member}
                    onOpenModal={() => setSelectedMember(member)}
                  />
                </FadeIn>
              ))}
            </div>
          ) : (
            <FadeIn>
              <div className="text-center py-20">
                <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No team members found</h3>
                <p className="text-gray-600">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            </FadeIn>
          )}
        </div>
      </section>

      {/* Modal */}
      <TeamModal
        member={selectedMember}
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </>
  );
}
