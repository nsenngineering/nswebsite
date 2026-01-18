'use client';

import { Calendar, Tag, Download, FileText, User, ExternalLink, Building2, Globe } from 'lucide-react';
import type { ELibraryItem } from '@/types/elibrary';
import {
  isStandardCode,
  isPublication,
  isCuratedPaper,
  isDownload,
  isNewsletter,
} from '@/types/elibrary';

interface DocumentGridProps {
  items: ELibraryItem[];
  onItemClick: (item: ELibraryItem) => void;
  selectedItemId?: string;
}

export default function DocumentGrid({ items, onItemClick, selectedItemId }: DocumentGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] p-8 text-center bg-white border border-gray-200 rounded-lg">
        <FileText className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No items found
        </h3>
        <p className="text-sm text-gray-500 max-w-sm">
          Try adjusting your search or filter to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {items.map((item) => {
        const isSelected = selectedItemId === item.id;

        return (
          <div
            key={item.id}
            onClick={() => onItemClick(item)}
            className={`bg-white border rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden ${
              isSelected ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-200'
            }`}
          >
            {/* Card Header */}
            <div className="p-6 border-b border-gray-100">
              {/* Featured Badge */}
              {item.featured && (
                <span className="inline-block mb-2 px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
                  Featured
                </span>
              )}

              {/* Title */}
              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                {item.title}
              </h3>

              {/* Metadata Row - Section Specific */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                {isStandardCode(item) && (
                  <>
                    {/* Standards Count */}
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-4 h-4" />
                      <span>{item.standards.length} {item.standards.length === 1 ? 'Standard' : 'Standards'}</span>
                    </div>
                    {/* Category */}
                    {item.category && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
                        {item.category}
                      </span>
                    )}
                  </>
                )}

                {isPublication(item) && (
                  <>
                    {/* Date */}
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(item.publishDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </div>
                    {/* Authors */}
                    {item.authors.length > 0 && (
                      <div className="flex items-center gap-1.5">
                        <User className="w-4 h-4" />
                        <span>{item.authors.length > 2 ? `${item.authors[0]} et al.` : item.authors.join(', ')}</span>
                      </div>
                    )}
                    {/* Source (for external publications) */}
                    {item.source && (
                      <div className="flex items-center gap-1.5">
                        <Globe className="w-4 h-4" />
                        <span>{item.source}</span>
                      </div>
                    )}
                    {/* Category */}
                    {item.category && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
                        {item.category}
                      </span>
                    )}
                  </>
                )}

                {isCuratedPaper(item) && (
                  <>
                    {/* Source */}
                    {item.source && (
                      <div className="flex items-center gap-1.5">
                        <Globe className="w-4 h-4" />
                        <span>{item.source}</span>
                      </div>
                    )}
                    {/* Category */}
                    {item.category && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
                        {item.category}
                      </span>
                    )}
                  </>
                )}

                {isDownload(item) && (
                  <>
                    {/* File Type */}
                    {item.fileType && (
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-4 h-4" />
                        <span>{item.fileType}</span>
                      </div>
                    )}
                    {/* File Size */}
                    {item.fileSize && (
                      <span className="text-xs text-gray-500">{item.fileSize}</span>
                    )}
                    {/* Category */}
                    {item.category && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
                        {item.category}
                      </span>
                    )}
                  </>
                )}

                {isNewsletter(item) && (
                  <>
                    {/* Date */}
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(item.publishDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </div>
                    {/* Quarter Badge */}
                    {item.quarter && (
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs">
                        {item.quarter}
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6 space-y-4">
              {/* Description/Preview */}
              {isPublication(item) && (
                <>
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {item.description}
                  </p>
                  {item.externalUrl && (
                    <div className="flex items-center gap-2 text-sm text-blue-600 mt-2">
                      <ExternalLink className="w-4 h-4" />
                      <span>External publication</span>
                    </div>
                  )}
                </>
              )}

              {isDownload(item) && item.description && (
                <p className="text-sm text-gray-700 line-clamp-3">
                  {item.description}
                </p>
              )}

              {isNewsletter(item) && item.description && (
                <p className="text-sm text-gray-700 line-clamp-3">
                  {item.description}
                </p>
              )}

              {isStandardCode(item) && (
                <div className="space-y-2">
                  <div className="text-sm text-gray-600 font-medium mb-2">
                    Available Standards:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.standards.map((std, idx) => (
                      <a
                        key={idx}
                        href={std.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-md hover:bg-blue-100 border border-blue-200 transition-colors"
                      >
                        <Building2 className="w-3.5 h-3.5" />
                        <span>{std.organization}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {isCuratedPaper(item) && (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <ExternalLink className="w-4 h-4" />
                  <span>Read full paper</span>
                </div>
              )}

              {/* Tags */}
              {item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {item.tags.slice(0, 5).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                  {item.tags.length > 5 && (
                    <span className="px-2 py-1 text-xs text-gray-500">
                      +{item.tags.length - 5} more
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Card Footer - Action Button */}
            <div className="p-6 pt-0">
              {isStandardCode(item) && item.standards.length === 1 && (
                <a
                  href={item.standards[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Standard
                </a>
              )}

              {isStandardCode(item) && item.standards.length > 1 && (
                <div className="text-sm text-gray-500 italic">
                  Click any standard badge above to view
                </div>
              )}

              {isPublication(item) && item.externalUrl && (
                <a
                  href={item.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Read Paper
                </a>
              )}

              {isPublication(item) && item.fileUrl && !item.externalUrl && (
                <a
                  href={item.fileUrl}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </a>
              )}

              {isCuratedPaper(item) && (
                <a
                  href={item.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Read Paper
                </a>
              )}

              {isDownload(item) && (
                <a
                  href={item.fileUrl}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
              )}

              {isNewsletter(item) && (
                <a
                  href={item.fileUrl}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
