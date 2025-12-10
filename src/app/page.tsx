import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import ServiceCards from '@/components/home/ServiceCards';
import FeaturedProjects from '@/components/home/FeaturedProjects';

export default function Home() {
  return (
    <>
      <HeroSection />
      <ServiceCards />
      <FeaturedProjects />
    </>
  );
}
