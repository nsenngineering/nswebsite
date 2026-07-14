'use client';

import {
  ArrowLeft,
  ArrowRight,
  Bolt,
  Box,
  Boxes,
  Building2,
  Droplets,
  ExternalLink,
  FileText,
  Hammer,
  Layers,
  Mountain,
  Package,
  SearchX,
  Waves,
  Wind,
} from 'lucide-react';
import type { ElementType } from 'react';
import type { StandardCode } from '@/types/elibrary';

interface StandardCodesCategoryViewProps {
  items: StandardCode[];
  selectedCategory: string | null;
  onCategorySelect: (category: string) => void;
  onBack: () => void;
}

type CategoryTheme = {
  icon: ElementType;
  iconBg: string;
  iconText: string;
  badgeBg: string;
  badgeText: string;
};

type CategoryGroup = {
  name: string;
  items: StandardCode[];
  theme: CategoryTheme;
};

const categoryThemes: Record<string, CategoryTheme> = {
  'Metal & Structural Materials': {
    icon: Hammer,
    iconBg: 'bg-orange-50',
    iconText: 'text-orange-700',
    badgeBg: 'bg-orange-50',
    badgeText: 'text-orange-800',
  },
  'Geotechnical Testing': {
    icon: Mountain,
    iconBg: 'bg-amber-50',
    iconText: 'text-amber-700',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800',
  },
  'Water & Environmental': {
    icon: Droplets,
    iconBg: 'bg-sky-50',
    iconText: 'text-sky-700',
    badgeBg: 'bg-sky-50',
    badgeText: 'text-sky-800',
  },
  'Concrete & Masonry': {
    icon: Building2,
    iconBg: 'bg-stone-100',
    iconText: 'text-stone-700',
    badgeBg: 'bg-stone-100',
    badgeText: 'text-stone-800',
  },
  'Cement & Binders': {
    icon: Package,
    iconBg: 'bg-emerald-50',
    iconText: 'text-emerald-700',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-800',
  },
  'Pipes & Conduits': {
    icon: Waves,
    iconBg: 'bg-teal-50',
    iconText: 'text-teal-700',
    badgeBg: 'bg-teal-50',
    badgeText: 'text-teal-800',
  },
  'Coatings & Electrical': {
    icon: Bolt,
    iconBg: 'bg-yellow-50',
    iconText: 'text-yellow-700',
    badgeBg: 'bg-yellow-50',
    badgeText: 'text-yellow-800',
  },
  'Waterproofing & Protection': {
    icon: Layers,
    iconBg: 'bg-indigo-50',
    iconText: 'text-indigo-700',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-800',
  },
  'Fly Ash & Pozzolans': {
    icon: Wind,
    iconBg: 'bg-violet-50',
    iconText: 'text-violet-700',
    badgeBg: 'bg-violet-50',
    badgeText: 'text-violet-800',
  },
  Aggregates: {
    icon: Boxes,
    iconBg: 'bg-lime-50',
    iconText: 'text-lime-700',
    badgeBg: 'bg-lime-50',
    badgeText: 'text-lime-800',
  },
};

const fallbackTheme: CategoryTheme = {
  icon: Box,
  iconBg: 'bg-gray-100',
  iconText: 'text-gray-700',
  badgeBg: 'bg-gray-100',
  badgeText: 'text-gray-700',
};

function getCategoryGroups(items: StandardCode[]): CategoryGroup[] {
  const groups = new Map<string, StandardCode[]>();

  for (const item of items) {
    const category = item.category?.trim() || 'Misc Materials';
    const existing = groups.get(category);
    if (existing) {
      existing.push(item);
    } else {
      groups.set(category, [item]);
    }
  }

  return Array.from(groups.entries())
    .map(([name, groupItems]) => ({
      name,
      items: groupItems,
      theme: categoryThemes[name] ?? fallbackTheme,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Derive a short human-readable label from a standard URL */
function getStandardLabel(url: string, index: number): string {
  // BIS search query  → e.g. "IS 1786"
  const bisSearch = url.match(/[?&]search=([^&#]+)/i)?.[1];
  if (bisSearch) return `IS ${decodeURIComponent(bisSearch)}`;

  // ISO standard
  const iso = url.match(/iso:std:iso:([^:#]+)/i)?.[1];
  if (iso) return `ISO ${iso}`;

  // ASTM page slug  → e.g. "ASTM A370"
  const astm = url.match(/astm\.org\/([a-z]\d+[a-z0-9]*)/i)?.[1];
  if (astm) return `ASTM ${astm.toUpperCase()}`;

  return `Ref ${index + 1}`;
}

function CategoryIcon({ group }: { group: CategoryGroup }) {
  const Icon = group.theme.icon;
  return (
    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${group.theme.iconBg}`}>
      <Icon className={`h-5 w-5 ${group.theme.iconText}`} aria-hidden="true" />
    </div>
  );
}

export default function StandardCodesCategoryView({
  items,
  selectedCategory,
  onCategorySelect,
  onBack,
}: StandardCodesCategoryViewProps) {
  const groups = getCategoryGroups(items);
  const selectedGroup = selectedCategory
    ? groups.find((g) => g.name === selectedCategory) ?? null
    : null;

  /* ── Empty state ── */
  if (items.length === 0) {
    return (
      <div className="flex min-h-[360px] flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-8 text-center">
        <SearchX className="mb-3 h-10 w-10 text-gray-300" aria-hidden="true" />
        <h2 className="text-base font-semibold text-gray-900">No standard codes found</h2>
        <p className="mt-1 max-w-sm text-sm text-gray-500">
          Try searching by test name, category, code number, or standard body.
        </p>
      </div>
    );
  }

  /* ── Detail view: one category ── */
  if (selectedGroup) {
    return (
      <section className="space-y-5">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
          <FileText className="h-4 w-4" aria-hidden="true" />
          <span>Standard codes</span>
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="font-medium text-gray-900">{selectedGroup.name}</span>
        </div>

        {/* Back + heading */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </button>
          <CategoryIcon group={selectedGroup} />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{selectedGroup.name}</h2>
            <p className="text-sm text-gray-500">
              {selectedGroup.items.length}{' '}
              {selectedGroup.items.length === 1 ? 'test protocol' : 'test protocols'}
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {selectedGroup.items.map((item) => (
            <article
              key={item.id}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
            >
              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${selectedGroup.theme.badgeBg} ${selectedGroup.theme.badgeText}`}
              >
                {item.id}
              </span>
              <h3 className="mt-3 text-sm font-semibold leading-6 text-gray-900">{item.title}</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.standards.map((standard, index) => (
                  <a
                    key={`${item.id}-${index}`}
                    href={standard.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-200"
                    title={standard.organization}
                  >
                    <span>{getStandardLabel(standard.url, index)}</span>
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  }

  /* ── Grid view: all categories ── */
  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          All Categories
        </p>
        <p className="text-sm text-gray-500">{items.length} matching protocols</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {groups.map((group) => (
          <button
            key={group.name}
            type="button"
            onClick={() => onCategorySelect(group.name)}
            className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
          >
            <CategoryIcon group={group} />
            <h2 className="mt-4 text-sm font-semibold text-gray-900">{group.name}</h2>
            <p className="mt-1 text-sm text-gray-500">
              {group.items.length} {group.items.length === 1 ? 'test' : 'tests'}
            </p>
            <ArrowRight
              className="absolute right-4 top-4 h-4 w-4 text-gray-300 opacity-0 transition group-hover:opacity-100"
              aria-hidden="true"
            />
          </button>
        ))}
      </div>
    </section>
  );
}
