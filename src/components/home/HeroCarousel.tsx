'use client';

import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import heroCarouselData from '@/data/generated/hero-carousel.json';
import { withBasePath } from '@/lib/utils';

export default function HeroCarousel() {
  const { images } = heroCarouselData;

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, duration: 20 },
    [Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true })]
  );

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Update current slide on change
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setIsTransitioning(true);
    setCurrentSlide(emblaApi.selectedScrollSnap());

    // Fade back in after transition
    setTimeout(() => setIsTransitioning(false), 300);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on('select', onSelect);
    onSelect(); // Set initial value

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        emblaApi?.scrollPrev();
      } else if (e.key === 'ArrowRight') {
        emblaApi?.scrollNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    emblaApi?.scrollTo(index);
  }, [emblaApi]);

  return (
    <section className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden">
      {/* Embla Carousel */}
      <div ref={emblaRef} className="absolute inset-0 overflow-hidden">
        <div className="flex h-full">
          {images.map((image, index) => (
            <div key={index} className="flex-[0_0_100%] relative min-w-0">
              {/* Image */}
              <img
                src={withBasePath(`/hero/${image.filename}`)}
                alt={image.alt}
                className="w-full h-full object-cover"
                loading={index === 0 ? 'eager' : 'lazy'}
              />

              {/* Purple gradient overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 via-transparent to-purple-900/30 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all z-20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-900"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-6 h-6 text-gray-800" />
      </button>

      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all z-20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-900"
        aria-label="Next image"
      >
        <ChevronRight className="w-6 h-6 text-gray-800" />
      </button>

      {/* Bottom Bar with Tagline and Indicators */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between gap-4">
            {/* Left Tagline */}
            <motion.div
              animate={{ opacity: isTransitioning ? 0.5 : 1 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight text-left drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                Constantly Evolving
              </h1>
            </motion.div>

            {/* Dot Indicators */}
            <div className="flex gap-2 flex-shrink-0">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={`transition-all focus:outline-none focus:ring-2 focus:ring-white ${
                    index === currentSlide
                      ? 'bg-white w-8 h-3 rounded-full'
                      : 'bg-white/50 hover:bg-white/75 w-3 h-3 rounded-full'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={index === currentSlide ? 'true' : 'false'}
                />
              ))}
            </div>

            {/* Right Tagline */}
            <motion.div
              animate={{ opacity: isTransitioning ? 0.5 : 1 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight text-right drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                <span className="text-secondary-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">
                  Foundation
                </span>{' '}
                You Can Trust
              </h1>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
