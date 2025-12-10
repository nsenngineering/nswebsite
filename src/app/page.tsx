import React from 'react';
import HeroCarousel from '@/components/home/HeroCarousel';
import HeroSection from '@/components/home/HeroSection';
import ServiceCards from '@/components/home/ServiceCards';
import FeaturedProjects from '@/components/home/FeaturedProjects';

export default function Home() {
  return (
    <>
      <HeroCarousel />
      <HeroSection />
      <ServiceCards />
      <FeaturedProjects />
    </>
  );
}
