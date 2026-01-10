import ProjectsClient from './ProjectsClient';
import JsonLd from '@/components/seo/JsonLd';
import { generateBreadcrumbSchema, generateProjectListSchema } from '@/lib/seo/schema-generators';
import { generateProjectsMetadata } from '@/lib/seo/dynamic-metadata';
import projectsData from '@/data/generated/projects.json';

export const metadata = generateProjectsMetadata();

export default function ProjectsPage() {
  // Generate breadcrumb schema
  const breadcrumbData = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
  ]);

  // Generate ProjectList schema from actual data
  const projectListSchema = generateProjectListSchema(
    projectsData.projects.map(project => ({
      id: project.id,
      title: project.title,
      category: project.category,
      year: project.year,
      client: project.client,
    }))
  );

  return (
    <>
      <JsonLd data={[breadcrumbData, projectListSchema]} />
      <ProjectsClient />
    </>
  );
}
