'use client';

import { Search, FileText, BookOpen, Newspaper } from 'lucide-react';
import type { ELibrarySection, ELibrarySectionInfo } from '@/types/elibrary';

interface ELibrarySidebarProps {
  sections: ELibrarySectionInfo[];
  activeSection: ELibrarySection | 'all';
  onSectionChange: (section: ELibrarySection | 'all') => void;
  documentCounts: Record<string, number>;
  totalDocuments: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const iconMap: Record<string, React.ElementType> = {
  FileText,
  BookOpen,
  Newspaper,
};

export default function ELibrarySidebar({
  sections,
  activeSection,
  onSectionChange,
  documentCounts,
  totalDocuments,
  searchQuery,
  onSearchChange,
}: ELibrarySidebarProps) {
  return (
    <aside className="w-full lg:w-64 lg:sticky lg:top-24 lg:self-start flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm lg:max-h-[calc(100vh-8rem)] overflow-hidden">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      {/* Section List */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {/* All Documents */}
        <button
          onClick={() => onSectionChange('all')}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
            activeSection === 'all'
              ? 'bg-blue-50 text-blue-700 font-medium'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5" />
            <span>All Documents</span>
          </div>
          <span
            className={`px-2 py-0.5 text-xs rounded-full ${
              activeSection === 'all'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {totalDocuments}
          </span>
        </button>

        {/* Divider */}
        <div className="py-2">
          <div className="h-px bg-gray-200" />
        </div>

        {/* Section Buttons */}
        {sections
          .sort((a, b) => a.order - b.order)
          .map((section) => {
            const Icon = iconMap[section.icon] || FileText;
            const count = documentCounts[section.id] || 0;
            const isActive = activeSection === section.id;

            return (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                title={section.description}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{section.label}</span>
                </div>
                <span
                  className={`px-2 py-0.5 text-xs rounded-full ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
      </nav>

      {/* Section Descriptions (shown on desktop only) */}
      {activeSection !== 'all' && (
        <div className="hidden lg:block p-4 border-t border-gray-200 bg-gray-50">
          {sections
            .filter((s) => s.id === activeSection)
            .map((section) => (
              <div key={section.id}>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  {section.label}
                </h3>
                <p className="text-xs text-gray-600">{section.description}</p>
              </div>
            ))}
        </div>
      )}
    </aside>
  );
}
