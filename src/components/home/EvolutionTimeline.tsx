'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import milestonesData from '@/data/generated/milestones.json';
import { withBasePath } from '@/lib/utils';

export default function EvolutionTimeline() {
  const { milestones } = milestonesData;

  // Find featured milestone as default active
  const featuredIndex = milestones.findIndex(m => m.featured);
  const defaultIndex = featuredIndex >= 0 ? featuredIndex : 0;

  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const activeMilestone = milestones[activeIndex];

  // Auto-play functionality
  useEffect(() => {
    if (isPaused) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      setActiveIndex((current) => {
        return current === milestones.length - 1 ? 0 : current + 1;
      });
    }, 4000); // 4 seconds

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [activeIndex, isPaused, milestones.length]);

  // Handle milestone click - pause on user interaction
  const handleMilestoneClick = (index: number) => {
    setActiveIndex(index);
    setIsPaused(true);
    console.log('here is the milestone click',activeMilestone)
  };

  return (
    <section
      className="relative w-full h-[70vh] md:h-[80vh] lg:h-[90vh] overflow-x-hidden"
    >
      {/* Background Stage - Full-screen photos */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0"
          >
            {/* Background Image */}
            <img
              src={withBasePath(activeMilestone.path)}
              alt={activeMilestone.title}
              className="w-full h-full object-cover"
              loading="eager"
            />

            {/* Purple gradient overlay for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-purple-900/40 to-purple-900/20" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Tagline at top */}
      <div className="absolute top-0 left-0 right-0 z-20 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-center">
            <span className="text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
              Constantly Evolving,
            </span>{' '}
            <span className="text-secondary-400 drop-shadow-[0_0_16px_rgba(250,204,21,0.6)]">
              Foundation
            </span>{' '}
            <span className="text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
              You Can Trust
            </span>
          </h1>
        </div>
      </div>

      {/* Horizontal Timeline with Title/Description */}
      <HorizontalTimeline
        milestones={milestones}
        activeIndex={activeIndex}
        activeMilestone={activeMilestone}
        onClick={handleMilestoneClick}
      />
    </section>
  );
}

// Horizontal Timeline (All screen sizes)
function HorizontalTimeline({
  milestones,
  activeIndex,
  activeMilestone,
  onClick
}: {
  milestones: any[];
  activeIndex: number;
  activeMilestone: any;
  onClick: (index: number) => void;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="absolute inset-0 z-30 flex flex-col">
      <div className="flex-1" /> {/* Spacer to push content to bottom */}

      <div className="px-4 sm:px-6 md:px-8 pb-8 md:pb-12">
        {/* Horizontal Timeline */}
        <div className="relative h-12 flex items-center mb-6">
          <div className="absolute left-0 right-0 h-0.5 bg-white/30" />

          {/* Milestone nodes */}
          <div className="relative w-full flex justify-between items-center">
            {milestones.map((milestone, index) => {
              const isActive = index === activeIndex;
              const isHovered = index === hoveredIndex;

              return (
                <div
                  key={milestone.year}
                  className="relative"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Hover Preview Thumbnail - Desktop Only */}
                  <AnimatePresence>
                    {isHovered && !isActive && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="hidden md:block absolute left-1/2 -translate-x-1/2 bottom-full mb-3"
                        style={{ zIndex: 9999 }}
                      >
                        <div className="relative w-40 h-24 rounded-lg overflow-hidden shadow-2xl ring-2 ring-white/50">
                          <img
                            src={withBasePath(milestone.path)}
                            alt={milestone.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1">
                          <div className="text-xs font-semibold text-white bg-black/70 px-2 py-1 rounded whitespace-nowrap">
                            {milestone.title}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Node */}
                  <button
                    onClick={() => onClick(index)}
                    className={`relative rounded-full transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/80 ${
                      isActive
                        ? 'w-5 h-5 md:w-6 md:h-6 bg-secondary-400 ring-4 ring-white/60 shadow-[0_0_20px_rgba(250,204,21,0.8)]'
                        : 'w-3 h-3 md:w-4 md:h-4 bg-white/60 hover:bg-white/90 active:bg-white/90'
                    }`}
                    aria-label={milestone.title}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Title and Description - Below Timeline */}
        <div className="space-y-2 md:space-y-3 max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {/* Title */}
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] text-center">
                {activeMilestone.title}
              </h2>

              {/* Description */}
              <p className="text-sm md:text-base lg:text-lg text-purple-100 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] line-clamp-3 text-center">
                {activeMilestone.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
