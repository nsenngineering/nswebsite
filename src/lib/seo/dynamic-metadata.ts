/**
 * Dynamic SEO Metadata Helpers
 *
 * These functions generate metadata that automatically updates based on
 * Google Sheets/CSV data. When content changes, SEO reflects the updates.
 */

import { generatePageMetadata } from './metadata-helpers';
import projectsData from '@/data/generated/projects.json';
import servicesData from '@/data/generated/services.json';
import teamData from '@/data/generated/team.json';
import alumniData from '@/data/generated/alumni.json';
import faqData from '@/data/generated/faq.json';

/**
 * Get dynamic counts from CMS data
 */
export function getDynamicCounts() {
  return {
    projects: projectsData.projects.length,
    services: servicesData.services.length,
    teamMembers: teamData.members.length,
    alumni: alumniData.alumni.length,
    faqItems: faqData.faqs.length,
  };
}

/**
 * About Page - Dynamic metadata based on team size and experience
 */
export function generateAboutMetadata() {
  const counts = getDynamicCounts();
  const teamYears = teamData.members
    .map(m => Number(m.experience))
    .filter(exp => !isNaN(exp) && exp > 0)
    .sort((a, b) => b - a)[0] || 30; // Max experience

  return generatePageMetadata({
    title: 'About Us - ISO 9001:2015 Certified Geotechnical Services',
    description: `NS Engineering & Geotechnical Services - Nepal's trusted partner in geotechnical investigation, pile testing, and material analysis since 2014. ISO 9001:2015 certified laboratory with ${counts.teamMembers}+ professionals and ${teamYears}+ years of combined experience.`,
    path: '/about',
    keywords: [
      'about NS Engineering',
      'geotechnical company Nepal',
      'ISO certified laboratory Nepal',
      'geotechnical testing Lalitpur',
      'pile testing company',
      'engineering services Nepal',
      'infrastructure testing Nepal',
    ],
  });
}

/**
 * Services Page - Dynamic metadata based on service count
 */
export function generateServicesMetadata() {
  const counts = getDynamicCounts();

  return generatePageMetadata({
    title: 'Professional Geotechnical Services - Testing, Investigation & Analysis',
    description: `Comprehensive geotechnical services including pile testing (PDA, PIT), soil & rock laboratory testing, drilling, geophysical surveys, and NDT testing across Nepal. ${counts.services} specialized services available.`,
    path: '/services',
    keywords: [
      'geotechnical services Nepal',
      'pile testing services',
      'PDA testing Nepal',
      'soil testing laboratory',
      'rock testing services',
      'drilling services Nepal',
      'geophysical survey Nepal',
      'NDT testing',
      'foundation testing',
      'geotechnical investigation',
    ],
  });
}

/**
 * Projects Page - Dynamic metadata based on project count
 */
export function generateProjectsMetadata() {
  const counts = getDynamicCounts();
  const hydropowerProjects = projectsData.projects.filter(
    project => project.category === 'hydropower'
  );

  return generatePageMetadata({
    title: `Projects - Hydropower & Infrastructure Work Across Nepal`,
    description: `${counts.projects}+ projects across Nepal, including ${hydropowerProjects.length} hydropower investigations. Published examples include 284 m drilling at Nalgad and ERT, SRT and MASW surveys at Upper Bheri.`,
    path: '/projects',
    keywords: [
      'geotechnical projects Nepal',
      'infrastructure projects Nepal',
      'pile testing projects',
      'hydropower geotechnical',
      'tunnel drilling Nepal',
      'road projects Nepal',
      'transmission line testing',
      'geotechnical investigation projects',
      'fast track expressway',
      'hydropower investigation',
    ],
  });
}

/**
 * Team Page - Dynamic metadata based on team count
 */
export function generateTeamMetadata() {
  const counts = getDynamicCounts();

  return generatePageMetadata({
    title: `Team - ${counts.teamMembers}+ Expert Engineers & Geologists`,
    description: `Meet our team of ${counts.teamMembers}+ experienced engineers, geologists, and technicians. Leadership with 15-30 years of experience in geotechnical testing, pile analysis, and infrastructure projects across Nepal.`,
    path: '/team',
    keywords: [
      'geotechnical engineers Nepal',
      'geologists Nepal',
      'pile testing experts',
      'geotechnical team',
      'engineering professionals Nepal',
      'experienced engineers Lalitpur',
      'geotechnical specialists',
      'infrastructure team',
    ],
  });
}

/**
 * FAQ Page - Dynamic metadata based on FAQ count
 */
export function generateFAQMetadata() {
  const counts = getDynamicCounts();

  return generatePageMetadata({
    title: 'FAQ - Geotechnical Testing Questions Answered',
    description: `Frequently asked questions about pile testing, geotechnical services, pricing, testing procedures, and project timelines. Get answers to ${counts.faqItems}+ common questions about PDA testing, static load tests, drilling, and laboratory analysis.`,
    path: '/faq',
    keywords: [
      'geotechnical testing FAQ',
      'pile testing questions',
      'PDA testing FAQ',
      'static load test questions',
      'geotechnical services pricing',
      'soil testing FAQ',
      'drilling services questions',
      'laboratory testing FAQ',
    ],
  });
}

/**
 * Alumni Page - Dynamic metadata based on alumni count
 */
export function generateAlumniMetadata() {
  const counts = getDynamicCounts();

  return generatePageMetadata({
    title: `Alumni - ${counts.alumni} Professionals Who Built Their Careers With Us`,
    description: `Meet ${counts.alumni} talented professionals who built their careers at NS Engineering. Our alumni network continues to contribute to Nepal's geotechnical and infrastructure development.`,
    path: '/alumni',
    keywords: [
      'NS Engineering alumni',
      'geotechnical engineering careers',
      'former employees',
      'engineering professionals Nepal',
      'alumni network',
      'career development',
    ],
  });
}

/**
 * Careers Page - Static metadata
 */
export function generateCareersMetadata() {
  return generatePageMetadata({
    title: 'Careers - Join Nepal\'s Leading Geotechnical Engineering Team',
    description: 'Join NS Engineering & Geotechnical Services. Career opportunities for geotechnical engineers, geologists, field technicians, and laboratory specialists. Competitive salary, professional development, and ISO 9001:2015 certified workplace.',
    path: '/careers',
    keywords: [
      'geotechnical engineering jobs Nepal',
      'geotechnical engineer careers',
      'geologist jobs Nepal',
      'field technician jobs',
      'laboratory jobs Lalitpur',
      'engineering careers Nepal',
      'pile testing jobs',
      'drilling engineer jobs',
    ],
  });
}

/**
 * Contact Page - Static metadata
 */
export function generateContactMetadata() {
  return generatePageMetadata({
    title: 'Contact Us - Get Free Project Consultation',
    description: 'Contact NS Engineering for geotechnical testing services. Located in Jwagal, Lalitpur. Call +977-01-5260121, email info@nsengineering.com.np. Request free project quotation for pile testing, drilling, laboratory services.',
    path: '/contact',
    keywords: [
      'contact NS Engineering',
      'geotechnical services Lalitpur',
      'pile testing quotation',
      'geotechnical consultation Nepal',
      'engineering services contact',
      'Jwagal Lalitpur office',
      'geotechnical testing inquiry',
    ],
  });
}

/**
 * eLibrary Page - Static metadata
 */
export function generateELibraryMetadata() {
  return generatePageMetadata({
    title: 'eLibrary - Technical Resources, Standards & Publications',
    description: 'Access our technical library: geotechnical standards (ASTM, IS, BS codes), research publications, curated papers, project downloads, and quarterly newsletters. Free geotechnical engineering resources.',
    path: '/elibrary',
    keywords: [
      'geotechnical standards',
      'ASTM standards',
      'IS codes geotechnical',
      'BS codes Nepal',
      'geotechnical publications',
      'engineering research papers',
      'technical resources Nepal',
      'geotechnical library',
    ],
  });
}

/**
 * Privacy Page - Static metadata
 */
export function generatePrivacyMetadata() {
  return generatePageMetadata({
    title: 'Privacy Policy - Data Protection & Privacy',
    description: 'NS Engineering Privacy Policy. Learn how we collect, use, and protect your personal data. GDPR-inspired principles, secure data handling, and your privacy rights explained.',
    path: '/privacy',
    keywords: [
      'privacy policy',
      'data protection',
      'GDPR Nepal',
      'personal data privacy',
      'website privacy',
    ],
  });
}

/**
 * Terms Page - Static metadata
 */
export function generateTermsMetadata() {
  return generatePageMetadata({
    title: 'Terms of Use - Website Terms & Conditions',
    description: 'Terms of Use for NS Engineering website. Legal agreement governing website access, intellectual property, user responsibilities, and service agreements.',
    path: '/terms',
    keywords: [
      'terms of use',
      'terms and conditions',
      'website terms',
      'legal agreement',
      'service terms',
    ],
  });
}
