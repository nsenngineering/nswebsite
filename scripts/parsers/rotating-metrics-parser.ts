import path from 'path';
import { fetchDataWithFallback } from './data-source.js';
import type { RotatingMetric, RotatingMetricsConfig, RotatingMetricCSVRecord } from '../../src/types/rotating-metrics.js';

const METRICS_CSV_PATH = path.join(process.cwd(), 'content', 'rotating_metrics', 'metrics.csv');

/**
 * Valid icon names (matching lucide-react icons)
 */
const VALID_ICONS = ['Trophy', 'Briefcase', 'Wrench', 'Users', 'Award', 'Target'] as const;

/**
 * Validate rotating metric record
 */
function validateMetric(record: RotatingMetricCSVRecord, index: number): void {
  const errors: string[] = [];

  // Validate required fields
  if (!record.id || record.id.trim().length === 0) {
    errors.push('ID is required');
  }

  if (!record.icon || !VALID_ICONS.includes(record.icon as any)) {
    errors.push(`Icon must be one of: ${VALID_ICONS.join(', ')}. Got: ${record.icon}`);
  }

  if (!record.value || record.value.trim().length === 0) {
    errors.push('Value is required');
  }

  if (!record.label || record.label.trim().length === 0) {
    errors.push('Label is required');
  }

  if (!record.description || record.description.trim().length === 0) {
    errors.push('Description is required');
  }

  if (!record.gradient || record.gradient.trim().length === 0) {
    errors.push('Gradient is required');
  }

  if (errors.length > 0) {
    throw new Error(`Rotating metric ${index + 1} (${record.id}) validation failed:\n  - ${errors.join('\n  - ')}`);
  }
}

/**
 * Parse rotating metrics CSV
 */
export async function parseRotatingMetrics(): Promise<RotatingMetricsConfig> {
  console.log('📊 Parsing rotating metrics data...');

  // Fetch from Sheets or CSV
  const records = await fetchDataWithFallback(
    METRICS_CSV_PATH,
    'RotatingMetrics',
    'GOOGLE_SHEET_TAB_ROTATING_METRICS'
  ) as unknown as RotatingMetricCSVRecord[];

  if (records.length === 0) {
    console.warn('⚠️  No rotating metrics found in CSV');
    return { metrics: [] };
  }

  // Validate and transform records
  const metrics: RotatingMetric[] = records.map((record, index) => {
    // Validate
    validateMetric(record, index);

    return {
      id: record.id.trim(),
      icon: record.icon.trim() as RotatingMetric['icon'],
      value: record.value.trim(),
      label: record.label.trim(),
      description: record.description.trim(),
      gradient: record.gradient.trim(),
      href: record.href?.trim() || undefined
    };
  });

  console.log(`✅ Parsed ${metrics.length} rotating metrics`);
  metrics.forEach(m => {
    console.log(`   ${m.icon} - ${m.label}: ${m.value}`);
  });

  return { metrics };
}
