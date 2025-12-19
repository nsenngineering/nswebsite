'use client';

import { Calendar, Tag, Download, FileText, User } from 'lucide-react';
import type { ELibraryDocument } from '@/types/elibrary';

interface DocumentGridProps {
  documents: ELibraryDocument[];
}

export default function DocumentGrid({ documents }: DocumentGridProps) {
  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] p-8 text-center bg-white border border-gray-200 rounded-lg">
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
        >
          {/* Document Header */}
          <div className="p-6 border-b border-gray-100">
            {/* Featured Badge */}
            {doc.featured && (
              <span className="inline-block mb-2 px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
                Featured
              </span>
            )}

            {/* Title */}
            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
              {doc.title}
            </h3>

            {/* Metadata Row */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              {/* Date */}
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(doc.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>

              {/* Author */}
              {doc.author && (
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  <span>{doc.author}</span>
                </div>
              )}

              {/* Category Badge */}
              {doc.category && (
                <div className="flex items-center gap-1.5">
                  <Tag className="w-4 h-4" />
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
                    {doc.category}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Document Body */}
          <div className="p-6 space-y-4">
            {/* Summary */}
            <p className="text-sm text-gray-700 line-clamp-3">
              {doc.summary}
            </p>

            {/* Content Preview */}
            <p className="text-sm text-gray-600 line-clamp-4 leading-relaxed">
              {doc.content}
            </p>

            {/* Tags */}
            {doc.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {doc.tags.slice(0, 5).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-md"
                  >
                    {tag}
                  </span>
                ))}
                {doc.tags.length > 5 && (
                  <span className="px-2 py-1 text-xs text-gray-500">
                    +{doc.tags.length - 5} more
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Document Footer */}
          {doc.pdfUrl && (
            <div className="p-6 pt-0">
              <a
                href={doc.pdfUrl}
                download
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
