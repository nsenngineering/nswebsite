'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, Mountain, Layers, Radio, FlaskConical, SlidersHorizontal } from 'lucide-react';

type Project = {
  id: string;
  title: string;
  client: string;
  category: string;
  year: string | number;
  location: { name: string };
  scope: string[];
};

const METHOD_FILTERS = [
  { id: 'all', label: 'All Methods', keywords: [] as string[] },
  { id: 'drilling', label: 'Drilling & Sampling', keywords: ['drill', 'sampl', 'core', 'boring'] },
  { id: 'rock-mechanics', label: 'Rock Mechanics', keywords: ['shear', 'jacking', 'dilatometer', 'pressure-meter', 'rock mechanic'] },
  { id: 'geophysical', label: 'Geophysical Survey', keywords: ['ert', 'srt', 'masw', 'geophysic'] },
  { id: 'laboratory', label: 'Laboratory & Field', keywords: ['laboratory', 'liquefaction', 'bearing', 'field analysis'] },
];

const METHOD_ICONS: Record<string, typeof Mountain> = {
  all: Mountain,
  drilling: Layers,
  'rock-mechanics': Mountain,
  geophysical: Radio,
  laboratory: FlaskConical,
};

function projectMatchesMethod(project: Project, methodId: string) {
  if (methodId === 'all') return true;
  const method = METHOD_FILTERS.find(m => m.id === methodId);
  if (!method) return true;
  const scopeText = project.scope.join(' ').toLowerCase();
  return method.keywords.some(keyword => scopeText.includes(keyword));
}

export default function HydropowerBrowser({ projects }: { projects: Project[] }) {
  const [query, setQuery] = useState('');
  const [activeMethod, setActiveMethod] = useState('all');

  const filteredProjects = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter(project => {
      const matchesMethod = projectMatchesMethod(project, activeMethod);
      const matchesQuery =
        q === '' ||
        project.title.toLowerCase().includes(q) ||
        project.location.name.toLowerCase().includes(q) ||
        project.client.toLowerCase().includes(q);
      return matchesMethod && matchesQuery;
    });
  }, [projects, query, activeMethod]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hero — purple gradient */}
      <section className="relative overflow-hidden bg-gradient-to-r from-violet-700 via-purple-600 to-purple-700 px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
            Hydropower Investigations
          </h1>
          <p className="mt-6 text-lg leading-8 text-purple-100 sm:text-xl">
            <span className="font-semibold text-amber-300">Verified project records</span> documenting geotechnical investigations across Nepal
          </p>
        </div>
      </section>

      {/* Search + filter bar */}
      <section className="border-b border-slate-200 bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search by project, location or client..."
                className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <SlidersHorizontal className="mr-1 hidden h-4 w-4 text-slate-400 sm:block" />
              {METHOD_FILTERS.map(method => {
                const Icon = METHOD_ICONS[method.id];
                const isActive = activeMethod === method.id;
                return (
                  <button
                    key={method.id}
                    onClick={() => setActiveMethod(method.id)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {method.label}
                  </button>
                );
              })}
            </div>
          </div>

          <p className="mt-5 text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-900">{filteredProjects.length}</span> of{' '}
            <span className="font-semibold text-slate-900">{projects.length}</span> projects
          </p>
        </div>
      </section>

      {/* Project grid */}
      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {filteredProjects.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-200 bg-white py-16 text-center text-slate-500">
              No projects match that search or filter. Try a different keyword or method.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map(project => (
                <article
                  key={project.id}
                  className="flex flex-col items-center border border-slate-200 bg-white p-6 text-center shadow-sm"
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-purple-600">
                    <Mountain className="h-9 w-9 text-white" />
                  </div>
                  <p className="mt-4 text-sm font-semibold text-purple-700">{project.year}</p>
                  <h3 className="mt-1 text-lg font-bold leading-snug">{project.title}</h3>
                  <p className="mt-2 text-sm text-slate-500">{project.location.name}, Nepal</p>
                  <p className="mt-1 text-sm text-slate-500">{project.client}</p>

                  <ul className="mt-4 space-y-1.5 text-left text-sm leading-6 text-slate-700">
                    {project.scope.slice(0, 3).map(scopeItem => (
                      <li key={scopeItem} className="flex gap-2">
                        <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-500" />
                        <span>{scopeItem}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/projects#${project.id}`}
                    className="mt-6 text-sm font-semibold text-purple-700 underline underline-offset-4 hover:text-purple-900"
                  >
                    View portfolio record
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Method breakdown stats */}
            {/* Method breakdown stats */}
      <section className="border-t border-slate-200 bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-8 text-center sm:grid-cols-4">
            {METHOD_FILTERS.filter(m => m.id !== 'all').map(method => {
              const count = projects.filter(project =>
                projectMatchesMethod(project, method.id)
              ).length;
              return (
                <div key={method.id}>
                  <p className="text-5xl font-extrabold text-purple-600">{count}</p>
                  <p className="mt-2 text-sm text-slate-600">{method.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}