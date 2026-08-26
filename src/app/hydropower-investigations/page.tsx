import JsonLd from '@/components/seo/JsonLd';
import projectsData from '@/data/generated/projects.json';
import { generatePageMetadata } from '@/lib/seo/metadata-helpers';
import { generateBreadcrumbSchema, generateProjectListSchema } from '@/lib/seo/schema-generators';
import HydropowerBrowser from './HydropowerBrowser';

const hydropowerProjects = projectsData.projects.filter(
  project => project.category === 'hydropower'
);

export const metadata = generatePageMetadata({
  title: 'Hydropower Geotechnical Investigations in Nepal',
  description: 'Verified NS Engineering hydropower project records across Nepal, including drilling, rock mechanics, laboratory testing and ERT, SRT and MASW surveys.',
  path: '/hydropower-investigations',
  keywords: [
    'hydropower geotechnical investigation Nepal',
    'hydropower drilling Nepal',
    'hydropower rock mechanics Nepal',
    'hydropower geophysical survey Nepal',
    'hydropower project investigation',
  ],
});

export default function HydropowerInvestigationsPage() {
  const breadcrumbData = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Hydropower Investigations', path: '/hydropower-investigations' },
  ]);

  const projectListSchema = generateProjectListSchema(
    hydropowerProjects.map(project => ({
      id: project.id,
      title: project.title,
      client: project.client,
      category: project.category,
      year: project.year,
      location: project.location,
    }))
  );

  return (
    <>
      <JsonLd data={[breadcrumbData, projectListSchema]} />
      <HydropowerBrowser projects={hydropowerProjects} />
    </>
  );
}