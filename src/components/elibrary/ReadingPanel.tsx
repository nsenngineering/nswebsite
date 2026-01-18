'use client';

import {
  X,
  ExternalLink,
  Download,
  Calendar,
  User,
  Building2,
  Globe,
  FileText,
  Tag as TagIcon,
} from 'lucide-react';
import type { ELibraryItem } from '@/types/elibrary';
import {
  isStandardCode,
  isPublication,
  isCuratedPaper,
  isDownload,
  isNewsletter,
} from '@/types/elibrary';

interface ReadingPanelProps {
  item: ELibraryItem;
  onClose: () => void;
}

export default function ReadingPanel({ item, onClose }: ReadingPanelProps) {
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header with Close Button */}
      <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Close preview"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-6">
        <article className="space-y-6">
          {/* Badges Row */}
          <div className="flex flex-wrap gap-2">
            {item.featured && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                Featured
              </span>
            )}
            {(isStandardCode(item) || isPublication(item) || isCuratedPaper(item) || isDownload(item)) &&
              item.category && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  {item.category}
                </span>
              )}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">
            {item.title}
          </h1>

          {/* Metadata - Section Specific */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {isStandardCode(item) && (
              <>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span>{item.standards.length} {item.standards.length === 1 ? 'Standard' : 'Standards'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(item.dateAdded).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>
              </>
            )}

            {isPublication(item) && (
              <>
                {item.authors.length > 0 && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{item.authors.join(', ')}</span>
                  </div>
                )}
                {item.source && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span>{item.source}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(item.publishDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                    })}
                  </span>
                </div>
              </>
            )}

            {isCuratedPaper(item) && (
              <>
                {item.source && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span>{item.source}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(item.dateAdded).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>
              </>
            )}

            {isDownload(item) && (
              <>
                {item.fileType && (
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>{item.fileType}</span>
                  </div>
                )}
                {item.fileSize && (
                  <span className="text-gray-500">{item.fileSize}</span>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(item.dateAdded).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>
              </>
            )}

            {isNewsletter(item) && (
              <>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(item.publishDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                    })}
                  </span>
                </div>
                {item.quarter && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                    {item.quarter}
                  </span>
                )}
              </>
            )}
          </div>

          {/* Description/Preview */}
          <div className="space-y-3">
            {isPublication(item) && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{item.description}</p>
              </div>
            )}

            {isDownload(item) && item.description && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{item.description}</p>
              </div>
            )}

            {isNewsletter(item) && item.description && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{item.description}</p>
              </div>
            )}

            {isStandardCode(item) && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900">Available Standards</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Industry standards for geotechnical engineering and testing protocols.
                  Click any standard below to access the full document.
                </p>
                <div className="space-y-2">
                  {item.standards.map((std, idx) => (
                    <a
                      key={idx}
                      href={std.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-blue-900">{std.organization}</span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-blue-600" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {isCuratedPaper(item) && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">About</h3>
                <p className="text-gray-600 text-sm">
                  Research paper curated by our team. Click "Read Paper" below to access the full publication.
                </p>
              </div>
            )}
          </div>

          {/* Tags */}
          {item.tags.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TagIcon className="w-4 h-4 text-gray-500" />
                <h3 className="text-sm font-semibold text-gray-900">Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-4 border-t border-gray-200">
            {isStandardCode(item) && item.standards.length === 1 && (
              <a
                href={item.standards[0].url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm w-full justify-center"
              >
                <ExternalLink className="w-5 h-5" />
                <span>View Standard</span>
              </a>
            )}

            {isStandardCode(item) && item.standards.length > 1 && (
              <div className="text-center text-sm text-gray-500 italic py-3">
                Multiple standards available - click any standard above to view
              </div>
            )}

            {isPublication(item) && item.externalUrl && (
              <a
                href={item.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm w-full justify-center"
              >
                <ExternalLink className="w-5 h-5" />
                <span>Read Paper</span>
              </a>
            )}

            {isPublication(item) && item.fileUrl && !item.externalUrl && (
              <a
                href={item.fileUrl}
                download
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm w-full justify-center"
              >
                <Download className="w-5 h-5" />
                <span>Download PDF</span>
              </a>
            )}

            {isCuratedPaper(item) && (
              <a
                href={item.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm w-full justify-center"
              >
                <ExternalLink className="w-5 h-5" />
                <span>Read Paper</span>
              </a>
            )}

            {isDownload(item) && (
              <a
                href={item.fileUrl}
                download
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm w-full justify-center"
              >
                <Download className="w-5 h-5" />
                <span>Download File</span>
              </a>
            )}

            {isNewsletter(item) && (
              <a
                href={item.fileUrl}
                download
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm w-full justify-center"
              >
                <Download className="w-5 h-5" />
                <span>Download Newsletter</span>
              </a>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
