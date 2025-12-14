/**
 * Timeline Mathematics Utilities
 *
 * Provides Quadratic Bezier curve calculations for the Evolution Timeline
 * curved arrow hero section. Handles curve generation, node positioning,
 * and SVG path generation.
 */

export interface Point {
  x: number;
  y: number;
}

/**
 * Timeline curve configuration
 * All coordinates are in SVG viewBox units (0-100)
 */
export const TIMELINE_CONFIG = {
  start: { x: 10, y: 90 },      // Bottom-left anchor
  control: { x: 50, y: 65 },    // Curve control point (Y=25 for moderate arch)
  end: { x: 90, y: 18 },        // Top-right endpoint (before arrowhead)
  thickness: 7,                  // Arrow width (8% of viewBox height)
  nodeOffset: 5,                 // Distance nodes sit above top edge
  arrowheadLength: -10             // Length of arrowhead extension
} as const;

/**
 * Calculate a point on the Quadratic Bezier curve
 * Formula: B(t) = (1-t)² × P₀ + 2(1-t)t × P₁ + t² × P₂
 *
 * @param t - Parameter from 0 to 1 (0 = start, 1 = end)
 * @returns Point on the curve
 */
export function getPointOnBezier(t: number): Point {
  const { start, control, end } = TIMELINE_CONFIG;

  const oneMinusT = 1 - t;
  const oneMinusTSquared = oneMinusT * oneMinusT;
  const tSquared = t * t;

  const x = oneMinusTSquared * start.x +
            2 * oneMinusT * t * control.x +
            tSquared * end.x;

  const y = oneMinusTSquared * start.y +
            2 * oneMinusT * t * control.y +
            tSquared * end.y;

  return { x, y };
}

/**
 * Calculate the tangent (perpendicular direction) at a point on the curve
 * Used to offset nodes above the curve's top edge
 *
 * @param t - Parameter from 0 to 1
 * @returns Normalized perpendicular vector pointing outward/upward
 */
export function getTangentAtPoint(t: number): Point {
  const { start, control, end } = TIMELINE_CONFIG;

  // Derivative of Bezier curve gives tangent direction
  // B'(t) = 2(1-t)(P₁ - P₀) + 2t(P₂ - P₁)
  const dx = 2 * (1 - t) * (control.x - start.x) +
             2 * t * (end.x - control.x);
  const dy = 2 * (1 - t) * (control.y - start.y) +
             2 * t * (end.y - control.y);

  // Calculate perpendicular (rotate 90° counterclockwise)
  // Perpendicular to (dx, dy) is (-dy, dx)
  const length = Math.sqrt(dx * dx + dy * dy);

  // Normalize and return (pointing upward/outward from curve)
  return {
    x: -(dy / length),
    y: (dx / length)
  };
}

/**
 * Calculate the position of a milestone node on the top edge of the curved arrow
 *
 * @param index - Milestone index (0-based)
 * @param total - Total number of milestones
 * @returns Absolute position for the node
 */
export function getNodePosition(index: number, total: number): Point {
  // Handle edge case of single milestone
  const t = total === 1 ? 0.5 : index / (total - 1);

  // Get point on the curve
  const curvePoint = getPointOnBezier(t);

  // Get perpendicular direction
  const tangent = getTangentAtPoint(t);

  // Offset outward by nodeOffset distance to sit on top edge
  return {
    x: curvePoint.x + tangent.x * TIMELINE_CONFIG.nodeOffset,
    y: curvePoint.y + tangent.y * TIMELINE_CONFIG.nodeOffset
  };
}

/**
 * Generate SVG path string for the thick curved arrow body
 * Creates a closed filled shape with outer curve, inner curve, and arrowhead
 *
 * @returns SVG path data string
 */
export function generateArrowPath(): string {
  const { start, control, end, thickness, arrowheadLength } = TIMELINE_CONFIG;

  // Calculate perpendicular offset for inner curve
  // Use the tangent at end point to determine offset direction
  const endTangent = getTangentAtPoint(1.0);
  const offsetX = endTangent.x * thickness;
  const offsetY = endTangent.y * thickness;

  // Inner curve points (parallel to outer curve, offset by thickness)
  const innerStart = {
    x: start.x - offsetX,
    y: start.y - offsetY
  };
  const innerControl = {
    x: control.x - offsetX,
    y: control.y - offsetY
  };
  const innerEnd = {
    x: end.x - offsetX,
    y: end.y - offsetY
  };

  // Arrowhead tip (extends beyond end point)
  const tipDirection = getTangentAtPoint(0.98); // Use tangent near end for arrow direction
  const tipX = end.x - tipDirection.y * arrowheadLength * 0.7;
  const tipY = end.y + tipDirection.x * arrowheadLength * 0.7;

  // Build path: Outer curve → Arrowhead → Inner curve (reverse) → Close
  return `
    M ${start.x} ${start.y}
    Q ${control.x} ${control.y}, ${end.x} ${end.y}
    L ${tipX} ${tipY}
    L ${innerEnd.x} ${innerEnd.y}
    Q ${innerControl.x} ${innerControl.y}, ${innerStart.x} ${innerStart.y}
    Z
  `.trim().replace(/\s+/g, ' ');
}

/**
 * Generate SVG path string for the text to follow
 * This is the centerline of the arrow (outer curve)
 *
 * @returns SVG path data string for textPath
 */
export function generateTextPath(): string {
  const { start, control, end } = TIMELINE_CONFIG;
  return `M ${start.x} ${start.y} Q ${control.x} ${control.y}, ${end.x} ${end.y}`;
}

/**
 * Calculate the total arc length of the curve (approximate)
 * Useful for advanced spacing calculations
 *
 * @param samples - Number of segments to sample (higher = more accurate)
 * @returns Approximate arc length in viewBox units
 */
export function getArcLength(samples: number = 100): number {
  let length = 0;
  let prevPoint = getPointOnBezier(0);

  for (let i = 1; i <= samples; i++) {
    const t = i / samples;
    const point = getPointOnBezier(t);

    const dx = point.x - prevPoint.x;
    const dy = point.y - prevPoint.y;
    length += Math.sqrt(dx * dx + dy * dy);

    prevPoint = point;
  }

  return length;
}
