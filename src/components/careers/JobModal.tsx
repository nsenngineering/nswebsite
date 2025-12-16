'use client';

import { X, MapPin, Clock, Briefcase, Calendar, CheckCircle2, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { JobListing } from '@/data/careers';
import { careerContact } from '@/data/careers';

interface JobModalProps {
  job: JobListing | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function JobModal({ job, isOpen, onClose }: JobModalProps) {
  if (!job) return null;

  const typeColors = {
    'full-time': 'bg-green-100 text-green-700 border-green-200',
    'part-time': 'bg-blue-100 text-blue-700 border-blue-200',
    'contract': 'bg-purple-100 text-purple-700 border-purple-200',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Modal Content */}
                <div className="p-8 max-h-[85vh] overflow-y-auto">
                  {/* Header */}
                  <div className="mb-6 pr-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      {job.title}
                    </h2>
                    <p className="text-lg text-gray-600">{job.department}</p>
                  </div>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-gray-200">
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="font-medium">{job.location}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-gray-700">
                      <Briefcase className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Experience</p>
                        <p className="font-medium">{job.experience}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Type</p>
                        <span
                          className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${
                            typeColors[job.type]
                          }`}
                        >
                          {job.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Posted</p>
                        <p className="font-medium">
                          {new Date(job.posted).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <section className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Job Description
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{job.description}</p>
                  </section>

                  {/* Requirements */}
                  <section className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Requirements
                    </h3>
                    <ul className="space-y-2">
                      {job.requirements.map((req, index) => (
                        <li key={index} className="flex gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  {/* Responsibilities */}
                  <section className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Responsibilities
                    </h3>
                    <ul className="space-y-2">
                      {job.responsibilities.map((resp, index) => (
                        <li key={index} className="flex gap-3">
                          <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  {/* Benefits (if available) */}
                  {job.benefits && job.benefits.length > 0 && (
                    <section className="mb-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        Benefits
                      </h3>
                      <ul className="space-y-2">
                        {job.benefits.map((benefit, index) => (
                          <li key={index} className="flex gap-3">
                            <CheckCircle2 className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {/* Salary (if available) */}
                  {job.salary && (
                    <section className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                      <p className="text-sm text-gray-600">Salary Range</p>
                      <p className="text-lg font-semibold text-gray-900">{job.salary}</p>
                    </section>
                  )}

                  {/* Apply Button */}
                  <div className="pt-6 border-t border-gray-200">
                    <a
                      href={`mailto:${careerContact.email}?subject=Application for ${job.title}&body=Dear Hiring Team,%0D%0A%0D%0AI am interested in applying for the ${job.title} position.%0D%0A%0D%0APlease find my resume attached.%0D%0A%0D%0ABest regards`}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg shadow-md"
                    >
                      <Mail className="w-5 h-5" />
                      Apply via Email
                    </a>
                    <p className="mt-3 text-sm text-gray-600">
                      Send your resume and cover letter to{' '}
                      <a
                        href={`mailto:${careerContact.email}`}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {careerContact.email}
                      </a>
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
