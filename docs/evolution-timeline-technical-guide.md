# Evolution Timeline Technical Guide

**Complete documentation for the curved arrow hero section's mathematics, positioning, and customization.**

---

## Table of Contents

1. [Overview](#overview)
2. [SVG Coordinate System](#svg-coordinate-system)
3. [Configuration Parameters](#configuration-parameters)
4. [How the Arrow is Drawn](#how-the-arrow-is-drawn)
5. [How the Tagline is Positioned](#how-the-tagline-is-positioned)
6. [How Year Labels Work](#how-year-labels-work)
7. [How Milestone Nodes are Positioned](#how-milestone-nodes-are-positioned)
8. [Common Adjustments](#common-adjustments)
9. [Troubleshooting](#troubleshooting)

---

## Overview

The Evolution Timeline hero section uses **SVG Quadratic Bezier curves** to create a curved arrow that flows diagonally from bottom-left to top-right. The tagline text follows this curve, and milestone nodes are positioned along it.

**Key Components:**
- **Curved Arrow** - Filled shape with outer curve, inner curve, and arrowhead
- **Tagline** - Text that follows the curve using SVG `<textPath>`
- **Milestone Nodes** - Interactive dots positioned along the curve
- **Year Labels** - Start/end year markers
- **Active Milestone Info** - Year, title, description displayed at bottom-center

**Files Involved:**
- `src/components/home/EvolutionTimeline.tsx` - Main component
- `src/components/home/timelineMath.ts` - Mathematical calculations
- `content/homepage_hero/milestones.csv` - Data source

---

## SVG Coordinate System

The arrow is drawn in an **SVG viewBox of `0 0 100 100`** (a 100×100 grid).

```
(0,0) ────────────────────────── (100,0)
  │                                  │
  │                                  │
  │         SVG ViewBox              │
  │         100 × 100                │
  │                                  │
  │                                  │
(0,100) ──────────────────────── (100,100)
```

**Coordinate Reference:**
- `x=0` is left edge, `x=100` is right edge
- `y=0` is top edge, `y=100` is bottom edge
- All measurements are in percentage units (0-100)

**Important:** The SVG uses `preserveAspectRatio="none"` so it **stretches** to fill the full hero section (70-90vh height).

---

## Configuration Parameters

All positioning is controlled by `TIMELINE_CONFIG` in `timelineMath.ts`:

```typescript
export const TIMELINE_CONFIG = {
  start: { x: 10, y: 90 },      // Bottom-left anchor point
  control: { x: 50, y: 25 },    // Bezier curve control point
  end: { x: 90, y: 18 },        // Top-right endpoint (before arrowhead)
  thickness: 8,                  // Arrow width (8% of viewBox height)
  nodeOffset: 6,                 // Distance nodes sit above curve
  arrowheadLength: 8             // Length of arrowhead extension
} as const;
```

### Parameter Details

| Parameter | Default | Controls | Impact |
|-----------|---------|----------|---------|
| `start.x` | `10` | Horizontal start position | Move arrow left/right |
| `start.y` | `90` | Vertical start position | Move arrow up/down |
| `control.x` | `50` | Curve peak horizontal position | Shift curve left/right |
| `control.y` | `25` | Curve peak vertical position | **Arch height** (lower = higher arch) |
| `end.x` | `90` | Horizontal end position | Arrow endpoint left/right |
| `end.y` | `18` | Vertical end position | Arrow endpoint up/down |
| `thickness` | `8` | Arrow body width | Thicker/thinner arrow |
| `nodeOffset` | `6` | Node distance from curve | Nodes closer/further from arrow |
| `arrowheadLength` | `8` | Arrowhead tip length | Pointier/blunter arrow |

---

## How the Arrow is Drawn

### 1. Quadratic Bezier Curve Formula

The curve is calculated using the **Quadratic Bezier formula**:

```
B(t) = (1-t)² × P₀ + 2(1-t)t × P₁ + t² × P₂
```

Where:
- `P₀` = `start` point (10, 90)
- `P₁` = `control` point (50, 25) - **determines curve shape**
- `P₂` = `end` point (90, 18)
- `t` = parameter from 0 to 1 (0=start, 1=end)

**Implementation:** `getPointOnBezier(t)` in `timelineMath.ts:34-50`

### 2. Arrow Path Construction

The arrow is a **closed filled shape** with three sections:

```
      control (50, 25)
           ◆
          /  \
         /    \
    OUTER      \ end (90, 18)
   CURVE        \              ╲
  /              ◆ ─────────────→ ARROWHEAD TIP
 /                              ╱
◆ start (10, 90)
  \              ◆
   \            /
    INNER      /
   CURVE      /  (offset by thickness=8)
          \  /
           ◆
```

**SVG Path String (simplified):**
```svg
M 10 90                           <!-- Move to start -->
Q 50 25, 90 18                    <!-- Outer curve -->
L tipX tipY                       <!-- Line to arrowhead tip -->
L innerEnd.x innerEnd.y           <!-- Back to inner curve end -->
Q innerControl, innerStart        <!-- Inner curve (parallel, offset) -->
Z                                 <!-- Close path -->
```

**Implementation:** `generateArrowPath()` in `timelineMath.ts:110-147`

### 3. Inner Curve (Parallel Offset)

The inner curve is **parallel** to the outer curve, offset by `thickness`:

1. Calculate the **perpendicular direction** at each point using the tangent
2. Offset each point by `thickness` in the perpendicular direction
3. This creates a smooth parallel curve

**Implementation:** `getTangentAtPoint(t)` in `timelineMath.ts:59-78`

---

## How the Tagline is Positioned

The tagline **"Constantly Evolving, Foundation You Can Trust"** follows the curve using SVG's `<textPath>` feature.

### 1. Text Path Generation

A path is created that matches the **outer curve** of the arrow:

```typescript
function generateTextPath(): string {
  return `M 10 90 Q 50 25, 90 18`;  // Same curve as arrow's outer edge
}
```

**Implementation:** `timelineMath.ts:155-158`

### 2. Text Following the Path

In `EvolutionTimeline.tsx`:

```tsx
<defs>
  <!-- Invisible path for text to follow -->
  <path id="textCurvePath" d={generateTextPath()} fill="none" />
</defs>

<text
  fontSize="3.0"
  fontWeight="700"
  fontFamily="Montserrat, sans-serif"
  letterSpacing="0.04em"
  dominantBaseline="middle"
  textAnchor="middle"
>
  <textPath href="#textCurvePath" startOffset="50%">
    <tspan fill="white">Constantly Evolving, </tspan>
    <tspan fill="#facc15">Foundation </tspan>
    <tspan fill="white">You Can Trust</tspan>
  </textPath>
</text>
```

### 3. Key Positioning Properties

| Property | Value | Effect |
|----------|-------|--------|
| `href="#textCurvePath"` | Link to path | Text follows the curve |
| `startOffset="50%"` | 50% | **Text starts at curve's midpoint** (centered) |
| `textAnchor="middle"` | middle | Centers text around start position |
| `dominantBaseline="middle"` | middle | Vertically centers text on the path |
| `fontSize="3.0"` | 3.0 | Size in viewBox units (3% of viewBox) |
| `letterSpacing="0.04em"` | 0.04em | Space between letters |

**Location:** `EvolutionTimeline.tsx:254-274`

### 4. How Text Centering Works

```
      Curve starts here
            ↓
============╪═══════════════════════════════════╪============
            ↑                                   ↑
         0% (start)                         100% (end)
                             ↑
                          50% (middle)
                      startOffset="50%"

    Text is centered here:
    "Constantly Evolving, Foundation You Can Trust"
            └─────────── middle ──────────┘
```

---

## How Year Labels Work

Year labels (start year and end year) are positioned using **absolute positioning** based on the arrow endpoints.

### Desktop Year Labels

Located in `DiagonalTimeline` component:

```tsx
{/* Year labels at endpoints */}
<div className="absolute left-[4%] bottom-[2%] ...">
  {startYear}  <!-- 2015 -->
</div>
<div className="absolute right-[2%] top-[10%] ...">
  {endYear}    <!-- 2024 -->
</div>
```

**Location:** `EvolutionTimeline.tsx:278-283`

### Positioning Breakdown

| Label | Position | Coordinates | Alignment |
|-------|----------|-------------|-----------|
| **Start Year** | Bottom-left | `left: 4%, bottom: 2%` | Near arrow start (10, 90) |
| **End Year** | Top-right | `right: 2%, top: 10%` | Near arrow end (90, 18) |

### Mobile Year Labels (Horizontal Timeline)

On mobile, year labels appear above the horizontal timeline:

```tsx
<div className="absolute left-0 bottom-full mb-2 ...">
  {startYear}
</div>
<div className="absolute right-0 bottom-full mb-2 ...">
  {endYear}
</div>
```

**Location:** `EvolutionTimeline.tsx:397-405`

**Smart Display:** Years are hidden if they match the active milestone year to avoid duplication.

---

## How Milestone Nodes are Positioned

Milestone nodes (interactive dots) are positioned **along the top edge** of the curved arrow.

### 1. Node Position Calculation

```typescript
function getNodePosition(index: number, total: number): Point {
  // Calculate position along curve (0 to 1)
  const t = total === 1 ? 0.5 : index / (total - 1);

  // Get point on the curve
  const curvePoint = getPointOnBezier(t);

  // Get perpendicular direction (pointing outward)
  const tangent = getTangentAtPoint(t);

  // Offset outward by nodeOffset distance
  return {
    x: curvePoint.x + tangent.x * TIMELINE_CONFIG.nodeOffset,
    y: curvePoint.y + tangent.y * TIMELINE_CONFIG.nodeOffset
  };
}
```

**Implementation:** `timelineMath.ts:87-102`

### 2. Distribution Logic

Nodes are **evenly distributed** along the curve based on their index:

```
Total milestones: 10
Index:  0     1     2     3  ...  9
t:    0.0   0.11  0.22  0.33 ... 1.0

Node positions along curve:
◆─────◆─────◆─────◆─────◆─────◆─────◆─────◆─────◆─────◆
start                                                   end
```

### 3. Perpendicular Offset

Nodes sit **above** the curve by `nodeOffset` distance:

```
        Node (offset outward)
          ◆  ↑ nodeOffset = 6
          │  │
─────────────────── (top edge of arrow)
     Arrow body
─────────────────── (bottom edge)
```

### 4. Node Rendering

```tsx
<div
  className="absolute pointer-events-auto"
  style={{
    left: `${x}%`,
    top: `${y}%`,
    transform: 'translate(-50%, -50%)'  // Centers the node on the position
  }}
>
  <motion.button className={isActive ? 'w-6 h-6 bg-yellow' : 'w-4 h-4 bg-white'}>
    {/* Node circle */}
  </motion.button>
</div>
```

**Location:** `EvolutionTimeline.tsx:286-347`

---

## Common Adjustments

### Adjust Tagline Font Size

**File:** `EvolutionTimeline.tsx:256`

```tsx
<text fontSize="3.0" ...>  <!-- Change this value -->
```

- **Larger:** `fontSize="4.0"` (bolder, more prominent)
- **Smaller:** `fontSize="2.5"` (subtler)

### Move Tagline Left/Right Along Curve

**File:** `EvolutionTimeline.tsx:263`

```tsx
<textPath href="#textCurvePath" startOffset="50%">
```

- **Shift Right:** `startOffset="60%"`
- **Shift Left:** `startOffset="40%"`
- **Center:** `startOffset="50%"` (default)

### Change Curve Arch Height

**File:** `timelineMath.ts:20`

```typescript
control: { x: 50, y: 25 },  // Change y value
```

- **Higher Arch:** `y: 20` (curve peaks higher)
- **Lower Arch:** `y: 30` (flatter curve)
- **Extreme Arch:** `y: 10` (dramatic upward curve)

### Make Arrow Thicker/Thinner

**File:** `timelineMath.ts:22`

```typescript
thickness: 8,  // Change this value
```

- **Thicker:** `thickness: 12`
- **Thinner:** `thickness: 5`

### Move Arrow Start Position

**File:** `timelineMath.ts:19`

```typescript
start: { x: 10, y: 90 },
```

- **Further from edge:** `x: 15`
- **Lower down:** `y: 95`

### Move Arrow End Position

**File:** `timelineMath.ts:21`

```typescript
end: { x: 90, y: 18 },
```

- **Further from edge:** `x: 85`
- **Higher up:** `y: 12`

### Adjust Node Distance from Arrow

**File:** `timelineMath.ts:23`

```typescript
nodeOffset: 6,  // Distance nodes sit above curve
```

- **Further from arrow:** `nodeOffset: 10`
- **Closer to arrow:** `nodeOffset: 3`

### Change Active Milestone Text Alignment

**File:** `EvolutionTimeline.tsx:125`

```tsx
<motion.div className="space-y-3 text-center">  <!-- Change alignment -->
```

- **Left-aligned:** `text-left`
- **Right-aligned:** `text-right`
- **Centered:** `text-center` (current)

### Adjust Year Label Positions

**File:** `EvolutionTimeline.tsx:278-283`

```tsx
{/* Start Year */}
<div className="absolute left-[4%] bottom-[2%] ...">

{/* End Year */}
<div className="absolute right-[2%] top-[10%] ...">
```

Change percentages to reposition:
- `left-[8%]` - Move further right
- `bottom-[5%]` - Move further up
- `top-[15%]` - Move further down

---

## Troubleshooting

### Tagline Not Visible

**Possible Causes:**
1. Font size too small - Increase `fontSize` in `EvolutionTimeline.tsx:256`
2. Text outside viewport - Adjust `startOffset` in `EvolutionTimeline.tsx:263`
3. Path not generated - Check `generateTextPath()` is being called

**Check:**
```tsx
<text fontSize="3.0" ...>  <!-- Ensure fontSize >= 2.5 -->
  <textPath href="#textCurvePath" startOffset="50%">
```

### Tagline Overlaps Arrow

**Solution:** The tagline follows the **outer curve** of the arrow, so it should naturally align. If overlapping:

1. Reduce `fontSize` slightly
2. Adjust `letterSpacing` to compress text
3. Modify `control.y` to change curve shape

### Nodes Not on Arrow

**Possible Causes:**
1. `nodeOffset` too large - Reduce in `timelineMath.ts:23`
2. Curve parameters changed - Ensure `generateTextPath()` matches `generateArrowPath()`

**Check:**
```typescript
nodeOffset: 6,  // Try reducing to 4-5
```

### Arrow Too Steep/Flat

**Solution:** Adjust the control point's Y value:

```typescript
control: { x: 50, y: 25 },  // Lower y = steeper, Higher y = flatter
```

### Years Not Aligned with Arrow

**Solution:** Year labels use absolute positioning. Adjust to match arrow endpoints:

```tsx
{/* If arrow start changed to x:15, y:85 */}
<div className="absolute left-[15%] bottom-[15%] ...">

{/* If arrow end changed to x:85, y:12 */}
<div className="absolute right-[15%] top-[12%] ...">
```

### Text Not Centered on Curve

**Solution:** Use `startOffset="50%"` and ensure `textAnchor="middle"`:

```tsx
<text textAnchor="middle" ...>
  <textPath href="#textCurvePath" startOffset="50%">
```

### Mobile Timeline Issues

The mobile version uses a **horizontal timeline** (not the curved arrow). If issues occur:

**Check:** `HorizontalTimeline` component in `EvolutionTimeline.tsx:353-468`

Common fixes:
- Adjust spacing: `className="relative w-full flex justify-between"`
- Change year position: `className="absolute left-0 bottom-full mb-2"`

---

## Advanced: Understanding the Mathematics

### Quadratic Bezier Curve

A Quadratic Bezier curve is defined by **3 control points**:

```
P₀ (start) ─────────→ P₂ (end)
                ╱
               ╱
              ╱
         P₁ (control)
```

**Formula:**
```
B(t) = (1-t)² × P₀ + 2(1-t)t × P₁ + t² × P₂

where t ∈ [0, 1]
```

**Example Calculation (t=0.5, midpoint):**
```
P₀ = (10, 90)
P₁ = (50, 25)
P₂ = (90, 18)

B(0.5) = 0.25×(10,90) + 0.5×(50,25) + 0.25×(90,18)
       = (2.5, 22.5) + (25, 12.5) + (22.5, 4.5)
       = (50, 39.5)
```

### Tangent Vector (Perpendicular Direction)

The **derivative** of the Bezier curve gives the tangent direction:

```
B'(t) = 2(1-t)(P₁ - P₀) + 2t(P₂ - P₁)
```

To get the **perpendicular** (for offsetting nodes):

1. Calculate tangent: `(dx, dy)`
2. Rotate 90° counterclockwise: `(-dy, dx)`
3. Normalize: divide by length

**Implementation:** `getTangentAtPoint(t)` in `timelineMath.ts:59-78`

---

## Quick Reference Cheat Sheet

| What to Change | File | Line | Parameter |
|----------------|------|------|-----------|
| Tagline font size | `EvolutionTimeline.tsx` | 256 | `fontSize="3.0"` |
| Tagline position | `EvolutionTimeline.tsx` | 263 | `startOffset="50%"` |
| Curve arch height | `timelineMath.ts` | 20 | `control.y` |
| Arrow thickness | `timelineMath.ts` | 22 | `thickness` |
| Arrow start | `timelineMath.ts` | 19 | `start.x, start.y` |
| Arrow end | `timelineMath.ts` | 21 | `end.x, end.y` |
| Node distance | `timelineMath.ts` | 23 | `nodeOffset` |
| Start year position | `EvolutionTimeline.tsx` | 278 | `left/bottom` |
| End year position | `EvolutionTimeline.tsx` | 281 | `right/top` |
| Info text alignment | `EvolutionTimeline.tsx` | 125 | `text-center` |

---

## Related Documentation

- **User Guide:** `docs/hero-timeline-guide.md` - How to add/edit milestones
- **Component:** `src/components/home/EvolutionTimeline.tsx`
- **Mathematics:** `src/components/home/timelineMath.ts`
- **Data:** `content/homepage_hero/milestones.csv`

---

**Last Updated:** 2024-12-14
**Version:** 1.0
**Author:** NS Engineering Website Development Team
