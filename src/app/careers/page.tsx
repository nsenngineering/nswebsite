'use client';

import { useState } from 'react';
import {
  Users,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Heart,
  GraduationCap,
  Wrench,
  Briefcase,
  TrendingUp,
  Shield,
} from 'lucide-react';
import JobCard from '@/components/careers/JobCard';
import JobModal from '@/components/careers/JobModal';
import { jobListings, companyBenefits, careerContact } from '@/data/careers';
import type { JobListing } from '@/data/careers';

const benefitIconMap: Record<string, React.ElementType> = {
  DollarSign,
  Heart,
  GraduationCap,
  Wrench,
  Briefcase,
  TrendingUp,
  Users,
  Shield,
};

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (job: JobListing) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedJob(null), 200);
  };

  const activeJobs = jobListings.filter((job) => job.active);
  const hasOpenings = activeJobs.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <header className="bg-gradient-to-br from-purple-700 via-purple-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-12 h-12" />
            <h1 className="text-4xl md:text-5xl font-bold">Join Our Team</h1>
          </div>
          <p className="text-xl text-purple-100 max-w-3xl">
            Build your career with Nepal's leading geotechnical engineering and testing company.
            Work on challenging projects, grow your skills, and make an impact.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Company Culture Section */}
        <section className="mb-12">
          <div className="bg-white rounded-xl p-8 border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Work With Us?
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              At NS Engineering & Geotechnical Services, we're more than just a testing company—we're
              a team of dedicated professionals committed to excellence in geotechnical engineering.
              For over 10 years, we've been at the forefront of major infrastructure projects across
              Nepal, from hydropower developments to highway tunnels, providing our team with
              unparalleled exposure to diverse and challenging work.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We value continuous learning, safety, and technical excellence. Join us to work with
              modern equipment, collaborate with experienced engineers, and contribute to projects
              that shape Nepal's infrastructure future.
            </p>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Employee Benefits
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {companyBenefits.map((benefit) => {
              const Icon = benefitIconMap[benefit.icon] || Briefcase;
              return (
                <div
                  key={benefit.title}
                  className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Job Listings Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            {hasOpenings ? 'Open Positions' : 'Current Openings'}
          </h2>

          {hasOpenings ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
              <div className="max-w-2xl mx-auto">
                <Briefcase className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  No Current Openings
                </h3>
                <p className="text-lg text-gray-600 mb-6">
                  We don't have any open positions at the moment, but we're always looking for
                  talented individuals to join our team. If you're passionate about geotechnical
                  engineering and want to be part of our growing company, we'd love to hear from you.
                </p>
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Send us your resume
                  </h4>
                  <p className="text-gray-700 mb-4">
                    We keep applications on file and will reach out when suitable positions become
                    available.
                  </p>
                  <a
                    href={`mailto:${careerContact.email}?subject=Resume Submission - Future Opportunities`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    <Mail className="w-5 h-5" />
                    Email Your Resume
                  </a>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Contact Section */}
        <section className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 text-white">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
            <p className="text-gray-300 mb-6">
              Have questions about careers at NS Engineering? We'd be happy to discuss opportunities,
              answer your questions, or learn more about your background.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <a
                href={`mailto:${careerContact.email}`}
                className="flex items-center gap-3 p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                <Mail className="w-6 h-6" />
                <div>
                  <p className="text-sm text-gray-300">Email</p>
                  <p className="font-medium">{careerContact.email}</p>
                </div>
              </a>

              <a
                href={`tel:${careerContact.phone}`}
                className="flex items-center gap-3 p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                <Phone className="w-6 h-6" />
                <div>
                  <p className="text-sm text-gray-300">Phone</p>
                  <p className="font-medium">{careerContact.phone}</p>
                </div>
              </a>

              <div className="flex items-start gap-3 p-4 bg-white/10 rounded-lg md:col-span-2">
                <MapPin className="w-6 h-6 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-300">Office Address</p>
                  <p className="font-medium">{careerContact.address}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Job Modal */}
      <JobModal job={selectedJob} isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}
