import React from 'react';
import EvolutionTimeline from '@/components/home/EvolutionTimeline';
import HeroSection from '@/components/home/HeroSection';
import ServiceCards from '@/components/home/ServiceCards';
import FeaturedProjects from '@/components/home/FeaturedProjects';
import FeaturedEquipment from '@/components/home/FeaturedEquipment';

export default function Home() {
  return (
    <>
      <EvolutionTimeline />
      <HeroSection />
      <ServiceCards />
      <FeaturedProjects />
      <FeaturedEquipment />
    </>
  );
}
