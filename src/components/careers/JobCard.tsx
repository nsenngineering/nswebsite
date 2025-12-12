'use client';

import { MapPin, Clock, Briefcase, Calendar } from 'lucide-react';
import type { JobListing } from '@/data/careers';

interface JobCardProps {
  job: JobListing;
  onViewDetails: (job: JobListing) => void;
}

export default function JobCard({ job, onViewDetails }: JobCardProps) {
  const typeColors = {
    'full-time': 'bg-green-100 text-green-700 border-green-200',
    'part-time': 'bg-blue-100 text-blue-700 border-blue-200',
    'contract': 'bg-purple-100 text-purple-700 border-purple-200',
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all hover:border-blue-300">
      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>

      {/* Department */}
      <p className="text-gray-600 mb-4">{job.department}</p>

      {/* Metadata Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{job.location}</span>
        </div>

        {/* Experience */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Briefcase className="w-4 h-4" />
          <span>{job.experience}</span>
        </div>

        {/* Type Badge */}
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full border ${
              typeColors[job.type]
            }`}
          >
            {job.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-')}
          </span>
        </div>

        {/* Posted Date */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>
            {new Date(job.posted).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* Description Preview */}
      <p className="text-gray-700 text-sm mb-4 line-clamp-2">{job.description}</p>

      {/* View Details Button */}
      <button
        onClick={() => onViewDetails(job)}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        View Details & Apply
      </button>
    </div>
  );
}
