'use client';

import React, { useState, useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import { motion } from 'framer-motion';
import { withBasePath } from '@/lib/utils';

interface ImageCarouselProps {
  images: string[];
  heroImage?: string;
  alt: string;
  projectId: string;
  basePath?: string;
  onImageClick?: (index: number) => void;
  className?: string;
}

export default function ImageCarousel({
  images,
  heroImage,
  alt,
  projectId,
  basePath = '/projects',
  onImageClick,
  className = ''
}: ImageCarouselProps) {
  // Combine hero + images
  const allImages = heroImage && !images.includes(heroImage) ? [heroImage, ...images] : images;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [mainViewportRef, mainApi] = useEmblaCarousel({ loop: false });
  const [thumbViewportRef, thumbApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true
  });

  // Handle image selection
  const onThumbClick = useCallback(
    (index: number) => {
      if (!mainApi || !thumbApi) return;
      mainApi.scrollTo(index);
    },
    [mainApi, thumbApi]
  );

  // Sync thumbnails with main carousel
  const onSelect = useCallback(() => {
    if (!mainApi || !thumbApi) return;
    setSelectedIndex(mainApi.selectedScrollSnap());
    thumbApi.scrollTo(mainApi.selectedScrollSnap());
  }, [mainApi, thumbApi]);

  useEffect(() => {
    if (!mainApi) return;
    onSelect();
    mainApi.on('select', onSelect);
    return () => {
      mainApi.off('select', onSelect);
    };
  }, [mainApi, onSelect]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') mainApi?.scrollPrev();
      if (e.key === 'ArrowRight') mainApi?.scrollNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mainApi]);

  // Fallback for no images
  if (allImages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] md:h-[400px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg">
        <Camera className="w-16 h-16 text-gray-300 mb-4" />
        <p className="text-gray-500 text-center">No photos available for this project</p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Main Carousel */}
      <div className="overflow-hidden rounded-lg mb-4 relative bg-gray-100" ref={mainViewportRef}>
        <div className="flex">
          {allImages.map((image, index) => (
            <div
              key={index}
              className="flex-[0_0_100%] min-w-0 relative"
            >
              {/* Loading skeleton */}
              {isLoading && index === selectedIndex && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                  <div className="w-16 h-16 border-4 border-gray-300 border-t-purple-600 rounded-full animate-spin" />
                </div>
              )}

              <motion.img
                src={withBasePath(`${basePath}/${image}`)}
                alt={`${alt} - Image ${index + 1}`}
                className="w-full h-[300px] md:h-[400px] lg:h-[500px] object-cover cursor-pointer"
                loading={index === 0 ? 'eager' : 'lazy'}
                onClick={() => onImageClick?.(index)}
                onLoad={() => index === selectedIndex && setIsLoading(false)}
                onError={(e) => {
                  e.currentTarget.src = `data:image/svg+xml,%3Csvg width='800' height='600' xmlns='http://www.w3.org/2000/svg'%3E%3Crect fill='%237c3aed' width='800' height='600'/%3E%3Ctext x='50%25' y='50%25' font-size='20' fill='white' text-anchor='middle' dy='.3em'%3EImage Unavailable%3C/text%3E%3C/svg%3E`;
                  setIsLoading(false);
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={() => mainApi?.scrollPrev()}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all z-10 disabled:opacity-50"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-800" />
            </button>
            <button
              onClick={() => mainApi?.scrollNext()}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all z-10 disabled:opacity-50"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-800" />
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute top-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
          {selectedIndex + 1} / {allImages.length}
        </div>
      </div>

      {/* Thumbnail Strip */}
      {allImages.length > 1 && (
        <div className="overflow-hidden" ref={thumbViewportRef}>
          <div className="flex gap-2">
            {allImages.map((image, index) => (
              <motion.button
                key={index}
                onClick={() => onThumbClick(index)}
                className={`flex-shrink-0 w-20 h-20 rounded overflow-hidden transition-all ${
                  index === selectedIndex
                    ? 'ring-4 ring-purple-500 opacity-100'
                    : 'opacity-50 hover:opacity-75'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`View image ${index + 1}`}
              >
                <img
                  src={withBasePath(`${basePath}/${image}`)}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
