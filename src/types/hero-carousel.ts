/**
 * TypeScript interfaces for Homepage Hero Carousel
 */

export interface HeroCarouselImage {
  order: number;
  filename: string;
  alt: string;
  path: string; // Full public path (e.g., "/hero/01-founding.jpg")
}

export interface HeroCarouselConfig {
  images: HeroCarouselImage[];
}
