'use client';

import { FileText } from 'lucide-react';
import type { ELibraryItem } from '@/types/elibrary';

interface DocumentListProps {
  documents: ELibraryItem[];
  activeDocumentId: string | null;
  onDocumentSelect: (documentId: string) => void;
}

/**
 * DocumentList component - Currently unused
 * This component was part of the old eLibrary implementation
 * Kept for potential future use
 */
export default function DocumentList({
  documents,
  activeDocumentId,
  onDocumentSelect,
}: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <FileText className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No documents found
        </h3>
        <p className="text-sm text-gray-500">
          Try adjusting your search or filter.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[600px] overflow-y-auto p-4">
      {documents.map((doc) => {
        const isActive = activeDocumentId === doc.id;

        return (
          <button
            key={doc.id}
            onClick={() => onDocumentSelect(doc.id)}
            className={`w-full text-left p-4 rounded-lg transition-all ${
              isActive
                ? 'bg-blue-50 border-2 border-blue-500'
                : 'bg-white border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <h3 className="font-semibold text-gray-900 line-clamp-1 mb-1">
              {doc.title}
            </h3>
            <div className="flex flex-wrap gap-2 text-xs text-gray-500">
              {doc.featured && (
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">
                  Featured
                </span>
              )}
              {doc.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-gray-600">
                  #{tag}
                </span>
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
}
