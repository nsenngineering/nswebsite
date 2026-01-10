'use client';

import projectsData from '@/data/generated/projects.json';
import { generateProjectListSchema } from '@/lib/seo/schema-generators';

/**
 * ProjectList Schema Component
 * Auto-generates Project schema for ALL projects from JSON
 * When you add project #50, it automatically appears here!
 * Add to /projects page
 */
export default function ProjectListSchema() {
  const projects = projectsData.projects || [];

  // Auto-generate schema from all projects
  const schema = generateProjectListSchema(projects.map(project => ({
    id: project.id,
    title: project.title,
    client: project.client,
    category: project.category,
    year: project.year,
  })));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
