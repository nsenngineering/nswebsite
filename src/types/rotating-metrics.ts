/**
 * Rotating Metrics Types
 */

export interface RotatingMetric {
  id: string;
  icon: 'Trophy' | 'Briefcase' | 'Wrench' | 'Users' | 'Award' | 'Target';
  value: string;
  label: string;
  description: string;
  gradient: string;
  href?: string;
}

export interface RotatingMetricsConfig {
  metrics: RotatingMetric[];
}

/**
 * CSV Record for rotating metrics
 */
export interface RotatingMetricCSVRecord {
  id: string;
  icon: string;
  value: string;
  label: string;
  description: string;
  gradient: string;
  href: string;
}
