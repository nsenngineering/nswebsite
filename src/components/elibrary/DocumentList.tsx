'use client';

import { FileText, Calendar, Tag } from 'lucide-react';
import type { ELibraryDocument } from '@/types/elibrary';

interface DocumentListProps {
  documents: ELibraryDocument[];
  activeDocumentId: string | null;
  onDocumentSelect: (documentId: string) => void;
}

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
        <p className="text-sm text-gray-500 max-w-sm">
          Try adjusting your search or filter to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 space-y-2 max-h-[800px] overflow-y-auto">
        {documents.map((doc) => {
          const isActive = activeDocumentId === doc.id;

          return (
            <button
              key={doc.id}
              onClick={() => onDocumentSelect(doc.id)}
              className={`w-full text-left p-4 rounded-lg transition-all ${
                isActive
                  ? 'bg-white border-2 border-blue-500 shadow-md'
                  : 'bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              {/* Title */}
              <h3
                className={`text-sm font-semibold mb-2 line-clamp-2 ${
                  isActive ? 'text-blue-700' : 'text-gray-900'
                }`}
              >
                {doc.title}
              </h3>

              {/* Metadata Row */}
              <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                {/* Date */}
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {new Date(doc.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                {/* Category Badge */}
                {doc.category && (
                  <div className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full">
                      {doc.category}
                    </span>
                  </div>
                )}
              </div>

              {/* Summary */}
              <p className="text-xs text-gray-600 line-clamp-2">
                {doc.summary}
              </p>

              {/* Author */}
              {doc.author && (
                <p className="text-xs text-gray-500 mt-2">
                  By {doc.author}
                </p>
              )}

              {/* Featured Badge */}
              {doc.featured && (
                <span className="inline-block mt-2 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded-full">
                  Featured
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
