'use client';

import { FileText, Calendar, User, Download, Tag as TagIcon } from 'lucide-react';
import type { ELibraryDocument } from '@/types/elibrary';

interface ReadingPanelProps {
  document: ELibraryDocument | null;
}

export default function ReadingPanel({ document }: ReadingPanelProps) {
  if (!document) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gray-50">
        <FileText className="w-24 h-24 text-gray-300 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Select a document to read
        </h2>
        <p className="text-gray-500 max-w-md">
          Choose a document from the list to view its full content, download
          PDFs, and explore related materials.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <article className="max-w-4xl mx-auto p-8 max-h-[800px] overflow-y-auto">
        {/* Header */}
        <header className="mb-8 pb-8 border-b border-gray-200">
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {document.title}
          </h1>

          {/* Metadata Grid */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
            {/* Author */}
            {document.author && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{document.author}</span>
              </div>
            )}

            {/* Date */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(document.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>

            {/* Category Badge */}
            {document.category && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                {document.category}
              </span>
            )}

            {/* Featured Badge */}
            {document.featured && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                Featured
              </span>
            )}
          </div>

          {/* Summary */}
          <p className="text-lg text-gray-700 leading-relaxed">
            {document.summary}
          </p>

          {/* Download Button */}
          {document.fileUrl && (
            <a
              href={`/elibrary/${document.fileUrl}`}
              download
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Download className="w-5 h-5" />
              <span>Download PDF</span>
            </a>
          )}
        </header>

        {/* Content */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Full Document
          </h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {document.content}
            </p>
          </div>
        </section>

        {/* Tags */}
        {document.tags && document.tags.length > 0 && (
          <section className="pt-8 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <TagIcon className="w-5 h-5 text-gray-500" />
              <h3 className="text-sm font-semibold text-gray-900">Tags</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {document.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-default"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Section Badge */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <span className="inline-block px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium">
            {document.section.charAt(0).toUpperCase() + document.section.slice(1)}
          </span>
        </div>
      </article>
    </div>
  );
}
