import React from 'react';
import HeroCarousel from '@/components/home/HeroCarousel';
import HeroSection from '@/components/home/HeroSection';
import ServiceCards from '@/components/home/ServiceCards';
import FeaturedProjects from '@/components/home/FeaturedProjects';
import FeaturedEquipment from '@/components/home/FeaturedEquipment';

export default function Home() {
  return (
    <>
      <HeroCarousel />
      <HeroSection />
      <ServiceCards />
      <FeaturedProjects />
      <FeaturedEquipment />
    </>
  );
}
