import EvolutionTimeline from '@/components/home/EvolutionTimeline';
import RotatingMetrics from '@/components/home/RotatingMetrics';
import ServiceCards from '@/components/home/ServiceCards';
import FeaturedProjects from '@/components/home/FeaturedProjects';

export default function Home() {
  return (
    <>
      <EvolutionTimeline />
      <RotatingMetrics />
      <ServiceCards />
      <FeaturedProjects />
    </>
  );
}
