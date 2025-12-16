'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import milestonesData from '@/data/generated/milestones.json';
import { withBasePath } from '@/lib/utils';
import { getNodePosition, generateArrowPath, generateTextPath } from './timelineMath';

export default function EvolutionTimeline() {
  const { milestones, startYear, endYear } = milestonesData;

  // Find featured milestone as default active
  const featuredIndex = milestones.findIndex(m => m.featured);
  const defaultIndex = featuredIndex >= 0 ? featuredIndex : 0;

  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
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

  // Pause on hover
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // Handle milestone click
  const handleMilestoneClick = (index: number) => {
    setActiveIndex(index);
    setIsPaused(true);
  };

  return (
    <section
      className="relative w-full h-[70vh] md:h-[80vh] lg:h-[90vh] overflow-x-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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

      {/* Tagline - Mobile Only (at top) */}
      <div className="md:hidden absolute top-0 left-0 right-0 z-20 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-center">
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

      {/* Timeline - Desktop (Diagonal) */}
      <DiagonalTimeline
        milestones={milestones}
        activeIndex={activeIndex}
        hoveredIndex={hoveredIndex}
        startYear={startYear}
        endYear={endYear}
        onHover={setHoveredIndex}
        onClick={handleMilestoneClick}
      />

      {/* Active Milestone Info - Desktop Only */}
      <div className="hidden md:block absolute bottom-0 left-0 right-0 z-20 pb-12 pointer-events-none">
        <div className="max-w-2xl ml-auto mr-8 px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-3 text-right"
            >
              {/* Year */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-5xl lg:text-6xl font-bold text-secondary-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]"
              >
                {activeMilestone.year}
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl lg:text-3xl font-bold text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
              >
                {activeMilestone.title}
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-base lg:text-lg text-purple-100 max-w-xl ml-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] line-clamp-3"
              >
                {activeMilestone.description}
              </motion.p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Timeline - Mobile (Horizontal) with Year Above and Title/Description Below */}
      <HorizontalTimeline
        milestones={milestones}
        activeIndex={activeIndex}
        activeMilestone={activeMilestone}
        startYear={startYear}
        endYear={endYear}
        onClick={handleMilestoneClick}
      />
    </section>
  );
}

// Diagonal Timeline (Desktop)
function DiagonalTimeline({
  milestones,
  activeIndex,
  hoveredIndex,
  startYear,
  endYear,
  onHover,
  onClick
}: {
  milestones: any[];
  activeIndex: number;
  hoveredIndex: number | null;
  startYear: number;
  endYear: number;
  onHover: (index: number | null) => void;
  onClick: (index: number) => void;
}) {
  return (
    <div className="hidden md:block absolute inset-0 z-10 pointer-events-none overflow-visible">
      <div className="relative w-full h-full overflow-visible">
        {/* Curved Growth Arrow with Tagline Inside */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ shapeRendering: 'geometricPrecision' }}
        >
          <defs>
            {/* Path for text to follow (outer curve) */}
            <path id="textCurvePath" d={generateTextPath()} fill="none" />

            {/* Gradient with userSpaceOnUse for diagonal flow */}
            <linearGradient
              id="arrowGradient"
              x1="10"
              y1="90"
              x2="90"
              y2="18"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="rgba(147, 51, 234, 0.35)" />
              <stop offset="50%" stopColor="rgba(147, 51, 234, 0.3)" />
              <stop offset="100%" stopColor="rgba(250, 204, 21, 0.35)" />
            </linearGradient>

            {/* Text shadow filter for legibility */}
            <filter id="textShadow">
              <feGaussianBlur in="SourceAlpha" stdDeviation="0.5" />
              <feOffset dx="0" dy="0.3" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.8" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Glow filter for yellow text */}
            <filter id="glowShadow">
              <feGaussianBlur in="SourceAlpha" stdDeviation="0.8" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="1.2" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Thick curved arrow body (closed filled path) */}
          <path
            d={generateArrowPath()}
            fill="url(#arrowGradient)"
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth="0.2"
          />

          {/* Tagline text following the curve */}
          <text
            fontSize="4.0"
            fontWeight="700"
            fontFamily="Montserrat, sans-serif"
            letterSpacing="0.04em"
            dominantBaseline="text-after-edge"
            textAnchor="middle"
          >
            <textPath href="#textCurvePath" startOffset="50%">
              <tspan fill="white" filter="url(#textShadow)">
                Constantly Evolving,{' '}
              </tspan>
              <tspan fill="#facc15" filter="url(#glowShadow)">
                Foundation{' '}
              </tspan>
              <tspan fill="white" filter="url(#textShadow)">
                You Can Trust
              </tspan>
            </textPath>
          </text>
        </svg>

        {/* Year labels at endpoints */}
        <div className="absolute left-[4%] bottom-[2%] text-white/80 text-lg font-bold drop-shadow-lg bg-purple-900/40 px-3 py-1 rounded-full">
          {startYear}
        </div>
        <div className="absolute right-[2%] top-[10%] text-white/80 text-lg font-bold drop-shadow-lg bg-purple-900/40 px-3 py-1 rounded-full">
          {endYear}
        </div>

        {/* Milestone nodes */}
        {milestones.map((milestone, index) => {
          // Calculate position on curved path's top edge
          const nodePos = getNodePosition(index, milestones.length);
          const x = nodePos.x;
          const y = nodePos.y;

          const isActive = index === activeIndex;
          const isHovered = index === hoveredIndex;

          // Bottom nodes (y > 60%) should show thumbnails ABOVE to stay visible
          const isBottomNode = y > 60;

          return (
            <div
              key={milestone.year}
              className="absolute pointer-events-auto"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 50 // Ensure thumbnails appear above other elements
              }}
              onMouseEnter={() => onHover(index)}
              onMouseLeave={() => onHover(null)}
              onClick={() => onClick(index)}
            >
              {/* Hover Preview Thumbnail */}
              <AnimatePresence>
                {isHovered && !isActive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: isBottomNode ? 10 : -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: isBottomNode ? 10 : -10 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute left-1/2 -translate-x-1/2 ${
                      isBottomNode ? 'bottom-full mb-3' : 'top-full mt-3'
                    }`}
                    style={{ zIndex: 9999 }}
                  >
                    <div className="relative w-32 h-20 rounded-lg overflow-hidden shadow-2xl ring-2 ring-white/50">
                      <img
                        src={withBasePath(milestone.path)}
                        alt={milestone.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap ${
                      isBottomNode ? 'top-full mt-1' : 'bottom-full mb-1'
                    }`}>
                      <div className="text-xs font-semibold text-white bg-black/60 px-2 py-1 rounded">
                        {milestone.year}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Node */}
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
                className={`relative rounded-full transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/80 ${
                  isActive
                    ? 'w-6 h-6 bg-secondary-400 ring-4 ring-white/60 shadow-[0_0_20px_rgba(250,204,21,0.8)]'
                    : 'w-4 h-4 bg-white/60 hover:bg-white/90 shadow-lg'
                }`}
                aria-label={`${milestone.year}: ${milestone.title}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Horizontal Timeline (Mobile)
function HorizontalTimeline({
  milestones,
  activeIndex,
  activeMilestone,
  startYear,
  endYear,
  onClick
}: {
  milestones: any[];
  activeIndex: number;
  activeMilestone: any;
  startYear: number;
  endYear: number;
  onClick: (index: number) => void;
}) {
  const isActiveFirstOrLast = activeMilestone.year === startYear || activeMilestone.year === endYear;

  return (
    <div className="md:hidden absolute inset-0 z-30 flex flex-col">
      <div className="flex-1" /> {/* Spacer to push content to bottom */}

      <div className="px-4 pb-8">
        {/* Active Year - Above Timeline */}
        <div className="mb-6 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="text-5xl font-bold text-secondary-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]"
            >
              {activeMilestone.year}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Horizontal Timeline */}
        <div className="relative h-12 flex items-center mb-6">
          <div className="absolute left-0 right-0 h-0.5 bg-white/30" />

          {/* Year labels - Only show if NOT active milestone */}
          {!isActiveFirstOrLast && (
            <>
              <div className="absolute left-0 bottom-full mb-2 text-xs text-white/70 font-semibold drop-shadow">
                {startYear}
              </div>
              <div className="absolute right-0 bottom-full mb-2 text-xs text-white/70 font-semibold drop-shadow">
                {endYear}
              </div>
            </>
          )}

          {/* If active is first year, only show end year */}
          {activeMilestone.year === startYear && (
            <div className="absolute right-0 bottom-full mb-2 text-xs text-white/70 font-semibold drop-shadow">
              {endYear}
            </div>
          )}

          {/* If active is last year, only show start year */}
          {activeMilestone.year === endYear && activeMilestone.year !== startYear && (
            <div className="absolute left-0 bottom-full mb-2 text-xs text-white/70 font-semibold drop-shadow">
              {startYear}
            </div>
          )}

          {/* Milestone nodes */}
          <div className="relative w-full flex justify-between items-center">
            {milestones.map((milestone, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={milestone.year}
                  onClick={() => onClick(index)}
                  className={`relative rounded-full transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/80 ${
                    isActive
                      ? 'w-5 h-5 bg-secondary-400 ring-4 ring-white/60 shadow-[0_0_20px_rgba(250,204,21,0.8)]'
                      : 'w-3 h-3 bg-white/60 active:bg-white/90'
                  }`}
                  aria-label={`${milestone.year}: ${milestone.title}`}
                />
              );
            })}
          </div>
        </div>

        {/* Title and Description - Below Timeline */}
        <div className="space-y-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {/* Title */}
              <h2 className="text-xl font-bold text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] text-center">
                {activeMilestone.title}
              </h2>

              {/* Description */}
              <p className="text-sm text-purple-100 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] line-clamp-3 text-center">
                {activeMilestone.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
