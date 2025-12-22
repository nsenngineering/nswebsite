import EvolutionTimeline from '@/components/home/EvolutionTimeline';
import RotatingMetrics from '@/components/home/RotatingMetrics';
import FeaturedServices from '@/components/home/FeaturedServices';
import FeaturedProjects from '@/components/home/FeaturedProjects';

export default function Home() {
  return (
    <>
      <EvolutionTimeline />
      <RotatingMetrics />
      <FeaturedServices />
      <FeaturedProjects />
    </>
  );
}
