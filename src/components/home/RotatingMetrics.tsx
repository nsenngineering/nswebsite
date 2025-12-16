'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Briefcase, Wrench, ArrowRight, LucideIcon } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

// ===== DATA STRUCTURE =====

interface MetricCard {
  id: string;
  icon: 'Trophy' | 'Briefcase' | 'Wrench';
  value: string;
  label: string;
  description: string;
  gradient: string;
  href?: string;
}

const metricsData: MetricCard[] = [
  {
    id: 'experience',
    icon: 'Trophy',
    value: '10+',
    label: 'Years of Experience',
    description: 'Delivering excellence in geotechnical services across Nepal since 2015',
    gradient: 'from-primary-600 to-primary-800',
    href: '/about'
  },
  {
    id: 'projects',
    icon: 'Briefcase',
    value: '100+',
    label: 'Projects Completed',
    description: 'Successful projects across roads, bridges, hydropower, and infrastructure',
    gradient: 'from-primary-700 to-primary-900',
    href: '/projects'
  },
  {
    id: 'equipment',
    icon: 'Wrench',
    value: '15+',
    label: 'Advanced Equipment',
    description: 'State-of-the-art testing tools including PDA, PIT, drilling rigs, and laboratory instruments',
    gradient: 'from-primary-600 to-primary-800',
    href: '/equipment'
  }
];

const iconMap: Record<string, LucideIcon> = {
  Trophy,
  Briefcase,
  Wrench
};

// ===== UTILITY FUNCTIONS =====

const getPosition = (cardIndex: number, activeIndex: number, totalCards: number): number => {
  return (cardIndex - activeIndex + totalCards) % totalCards;
};

const getCardStyle = (position: number) => {
  const styles = {
    0: { translateX: '0%', scale: 1, opacity: 1, zIndex: 30, blur: 0 },
    1: { translateX: '85%', scale: 0.95, opacity: 0.6, zIndex: 20, blur: 0 },
    2: { translateX: '90%', scale: 0.9, opacity: 0.3, zIndex: 10, blur: 0 }
  };
  return styles[position as keyof typeof styles] || styles[2];
};

// ===== MAIN COMPONENT =====

export default function RotatingMetrics() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-rotation effect (3 seconds)
  useEffect(() => {
    if (isPaused) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setActiveIndex((current) => (current + 1) % metricsData.length);
    }, 3000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [activeIndex, isPaused]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        setActiveIndex((current) => (current + 1) % metricsData.length);
        setIsPaused(true);
      }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        setActiveIndex((current) =>
          (current - 1 + metricsData.length) % metricsData.length
        );
        setIsPaused(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCardClick = (cardIndex: number, position: number) => {
    if (position !== 0) {
      // Inactive card - bring to front
      setActiveIndex(cardIndex);
      setIsPaused(true);
    }
  };

  return (
    <section
      className="relative bg-white py-16 md:py-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile: Heading (centered, before cards) */}
        <div className="md:hidden text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-primary-100 border border-primary-200 rounded-full shadow-sm mb-6">
            <span className="w-2 h-2 bg-secondary-400 rounded-full mr-2 animate-pulse" />
            <span className="text-sm font-medium text-primary-800">
              ISO 9001:2015 Certified | 10+ Years Excellence
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Leading Geotechnical Services in Nepal
          </h2>

          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Advanced provider of geotechnical investigation, in-situ & laboratory testing services.
            Delivering reliable results with state-of-the-art equipment and experienced professionals.
          </p>
        </div>

        {/* Desktop: Two-Column Layout */}
        <div className="hidden md:grid md:grid-cols-2 md:gap-12 lg:gap-16 md:items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-primary-100 border border-primary-200 rounded-full shadow-sm">
              <span className="w-2 h-2 bg-secondary-400 rounded-full mr-2 animate-pulse" />
              <span className="text-sm font-medium text-primary-800">
                ISO 9001:2015 Certified | 10+ Years Excellence
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight">
              Leading Geotechnical Services in Nepal
            </h2>

            {/* Description */}
            <p className="text-lg lg:text-xl text-gray-600 leading-relaxed">
              Advanced provider of geotechnical investigation, in-situ & laboratory testing services.
              Delivering reliable results with state-of-the-art equipment and experienced professionals.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/contact">
                <Button size="lg" className="group">
                  Request a Quote
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/services">
                <Button size="lg" variant="outline">
                  Our Services
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column - 3D Card Stack */}
          <div>
            <DesktopStack
              metricsData={metricsData}
              activeIndex={activeIndex}
              onCardClick={handleCardClick}
            />
          </div>
        </div>

        {/* Mobile: Horizontal Carousel */}
        <div className="md:hidden">
          <MobileCarousel
            metricsData={metricsData}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            setIsPaused={setIsPaused}
          />

          {/* Mobile CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 px-4">
            <Link href="/contact" className="flex-1">
              <Button size="lg" className="w-full group">
                Request a Quote
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/services" className="flex-1">
              <Button size="lg" variant="outline" className="w-full">
                Our Services
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== DESKTOP 3D STACK COMPONENT =====

function DesktopStack({
  metricsData,
  activeIndex,
  onCardClick
}: {
  metricsData: MetricCard[];
  activeIndex: number;
  onCardClick: (cardIndex: number, position: number) => void;
}) {
  return (
    <div
      className="relative w-full h-[520px] flex items-center"
      role="region"
      aria-label="Company metrics showcase"
      tabIndex={0}
    >
      {metricsData.map((metric, cardIndex) => {
        const position = getPosition(cardIndex, activeIndex, metricsData.length);
        const style = getCardStyle(position);
        const isActive = position === 0;

        return (
          <motion.div
            key={metric.id}
            className="absolute inset-y-0 left-0 w-80"
            initial={false}
            animate={{
              x: style.translateX,
              scale: style.scale,
              opacity: style.opacity,
            }}
            transition={{
              duration: 0.6,
              ease: [0.4, 0, 0.2, 1]
            }}
            style={{
              zIndex: style.zIndex,
              willChange: 'transform',
              transform: 'translateZ(0)'
            }}
            onClick={() => onCardClick(cardIndex, position)}
          >
            <MetricCardContent metric={metric} isActive={isActive} />
          </motion.div>
        );
      })}
    </div>
  );
}

// ===== MOBILE CAROUSEL COMPONENT =====

function MobileCarousel({
  metricsData,
  activeIndex,
  setActiveIndex,
  setIsPaused
}: {
  metricsData: MetricCard[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  setIsPaused: (paused: boolean) => void;
}) {
  const handleDotClick = (index: number) => {
    setActiveIndex(index);
    setIsPaused(true);
  };

  return (
    <div>
      {/* Active Card */}
      <div className="w-full mb-8 h-[480px] flex justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="h-full w-80 max-w-full px-4"
          >
            <MetricCardContent
              metric={metricsData[activeIndex]}
              isActive={true}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-2">
        {metricsData.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`h-2 rounded-full transition-all ${
              index === activeIndex
                ? 'bg-primary-600 w-8'
                : 'bg-gray-300 w-2'
            }`}
            aria-label={`Go to metric ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// ===== CARD CONTENT COMPONENT =====

function MetricCardContent({
  metric,
  isActive
}: {
  metric: MetricCard;
  isActive: boolean;
}) {
  const Icon = iconMap[metric.icon];

  const iconPulseAnimation = isActive ? {
    scale: [1, 1.05, 1],
    opacity: [0.9, 1, 0.9]
  } : {};

  const iconPulseTransition = {
    duration: 2,
    repeat: Infinity,
    ease: [0.42, 0, 0.58, 1] as const
  };

  return (
    <div
      className={`
        bg-gradient-to-br ${metric.gradient}
        rounded-2xl shadow-2xl p-8 h-full
        flex flex-col justify-center
        ${isActive ? 'cursor-pointer' : 'cursor-default'}
        transition-shadow hover:shadow-3xl
      `}
    >
      {/* Icon */}
      <div className="flex justify-center mb-6">
        <motion.div
          className={`w-32 h-32 rounded-full flex items-center justify-center ${
            isActive ? 'bg-secondary-400/20' : 'bg-white/30'
          }`}
          animate={iconPulseAnimation}
          transition={iconPulseTransition}
        >
          <Icon
            className={`w-20 h-20 ${
              isActive
                ? 'text-secondary-400 drop-shadow-[0_0_16px_rgba(250,204,21,0.5)]'
                : 'text-white'
            }`}
          />
        </motion.div>
      </div>

      {/* Value */}
      <div className="text-center mb-2">
        <div className="text-5xl md:text-6xl font-bold text-white">
          {metric.value}
        </div>
      </div>

      {/* Label */}
      <div className="text-center mb-4">
        <div className="text-xl md:text-2xl font-semibold text-white/90">
          {metric.label}
        </div>
      </div>

      {/* Description - Only visible on active card */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center overflow-hidden"
          >
            <p className="text-white/80 text-sm leading-relaxed">
              {metric.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
