# Evolution Timeline Hero Section - User Guide

## Overview

The **Evolution Timeline Hero Section** is an interactive, photo-led hero that visually represents NS Engineering's growth journey from 2015 to the present. It combines full-screen background imagery with an innovative diagonal timeline interface.

## Design Philosophy

### Tagline
**"Constantly Evolving, Foundation You Can Trust"**

### Key Principles
1. **Photo-First** - Emotional impact through large, dominant imagery
2. **Story-Driven** - Timeline encodes growth and progress
3. **Interactive** - Explore → Preview → Commit user flow
4. **CSV-Powered** - Fully data-driven, future-proof content management
5. **Curved Arrow Design** - Thick curved arch symbolizing upward growth trajectory

---

## Features

### 🖼️ Visual Design
- **Full-screen background photos** that change based on active milestone
- **Purple gradient overlay** for text legibility (brand colors)
- **Thick curved arrow timeline** (bottom-left → top-right) on desktop
  - Quadratic Bezier curve for natural arch shape
  - Tagline flows inside the arrow body along the curve
  - Semi-transparent purple-to-yellow gradient
- **Horizontal timeline** on mobile (unchanged)
- **Smooth transitions** with crossfade and subtle zoom

### 🎯 Interactive Elements
- **Hover preview thumbnails** - Preview photos before clicking (desktop only)
- **Auto-play** - Advances every 4 seconds automatically
- **Pause on interaction** - Stops auto-play when user hovers or clicks
- **Keyboard navigation** - None (intentionally simplified for timeline UX)

### 📱 Responsive Behavior
- **Desktop**: Diagonal timeline with hover previews
- **Mobile**: Horizontal timeline with tap interaction
- **Adaptive heights**: 70vh (mobile) → 90vh (desktop)

### 🎨 Brand Integration
- **Primary Color**: Purple (`#9333ea` / `purple-600/800/900`)
- **Accent Color**: Yellow (`#facc15` / `secondary-400`)
- **Animations**: Smooth, professional (700-800ms crossfades)

---

## Content Management

### CSV Structure

**File**: `content/homepage_hero/milestones.csv`

**Columns**:
- `year` - Four-digit year (e.g., 2015, 2024)
- `title` - Short headline (e.g., "Foundation Established")
- `description` - 2-3 sentence description of the milestone
- `image` - Filename of the background image (must exist in `content/homepage_hero/images/`)
- `featured` - Boolean (`true`/`false`) - Marks which milestone shows first

**Example**:
```csv
year,title,description,image,featured
2015,Foundation Established,"NS Engineering & Geotechnical Services begins operations with a commitment to quality, integrity, and scientific excellence in Nepal's geotechnical sector.",IMG_2968.JPG,true
2024,Continuous Innovation,"Ongoing investment in technology, training, and methodologies. Committed to staying at the forefront of geotechnical engineering.",IMG_2977.JPG,false
```

### Adding/Editing Milestones

1. **Open CSV in Excel**:
   ```
   content/homepage_hero/milestones.csv
   ```

2. **Add/Edit rows**:
   - Each row = one milestone
   - Year must be between 2000 and current year + 10
   - Title and description are required
   - Image must exist in `images/` folder

3. **Add images**:
   - Place photos in: `content/homepage_hero/images/`
   - Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`
   - Recommended size: 1920×1080 or larger
   - Use descriptive filenames (e.g., `2015-foundation.jpg`)

4. **Build content**:
   ```bash
   npm run build:content
   ```

5. **Refresh browser** to see changes

### Timeline Rules

- **Automatic sorting**: Milestones are sorted by year (ascending)
- **Start year**: Automatically calculated from earliest milestone
- **End year**: Always current year (dynamically computed)
- **Timeline spacing**: Evenly distributed based on milestone count
- **Featured milestone**: Shows first on page load (default: earliest year if none marked)

---

## Technical Details

### Components

**Main Component**:
- `src/components/home/EvolutionTimeline.tsx`

**Utility File**:
- `src/components/home/timelineMath.ts` - Bezier curve mathematics and calculations

**Sub-components**:
- `DiagonalTimeline` - Desktop curved arrow timeline with nodes and previews
- `HorizontalTimeline` - Mobile horizontal timeline with tap interaction (unchanged)

**Data Source**:
- `src/data/generated/milestones.json` (auto-generated from CSV)

### Curve Mathematics

**Type**: Quadratic Bezier Curve
**Formula**: `B(t) = (1-t)² × P₀ + 2(1-t)t × P₁ + t² × P₂`

**Default Configuration** (`timelineMath.ts`):
```typescript
{
  start: { x: 10, y: 90 },      // Bottom-left
  control: { x: 50, y: 25 },    // Control point (moderate arch)
  end: { x: 90, y: 18 },        // Top-right
  thickness: 8,                  // Arrow width (8% of viewBox)
  nodeOffset: 6                  // Node distance above top edge
}
```

**Adjusting Curve Shape**:
- Edit `control.y` value in `timelineMath.ts`:
  - Lower Y (e.g., 20) = more aggressive arch
  - Higher Y (e.g., 30) = gentler arch
  - Current default: 25 (moderate, balanced curve)

### Auto-Play Behavior

- **Interval**: 4 seconds per milestone
- **Direction**: Chronological (year ascending)
- **Loop**: Yes (returns to first after last)
- **Pause conditions**:
  - Mouse enters hero section
  - User clicks a milestone
- **Resume condition**:
  - Mouse leaves hero section

### Animations

**Background transitions**:
- Crossfade opacity: 800ms
- Zoom-in scale: 1.05 → 1.0
- Easing: Cubic bezier `[0.4, 0, 0.2, 1]`

**Text transitions**:
- Year: Fade in (100ms delay)
- Title: Slide + fade (200ms delay)
- Description: Slide + fade (300ms delay)

**Curved arrow**:
- SVG rendering with geometricPrecision
- Purple-to-yellow gradient (userSpaceOnUse coordinates)
- Tagline follows curve via SVG textPath
- Text filters for shadow and glow effects

**Hover previews** (desktop):
- Scale: 0.8 → 1.0
- Opacity: 0 → 1
- Duration: 200ms
- Positioned above curved arrow's top edge

---

## Best Practices

### Content Guidelines

1. **Photo Selection**:
   - Use real field operations imagery (NO stock photos)
   - Show equipment, team members, project sites
   - Ensure good lighting and composition
   - Avoid photos with excessive text overlays

2. **Title Writing**:
   - Keep concise (2-6 words)
   - Use action verbs: "Established", "Expanded", "Achieved"
   - Focus on the milestone, not the year

3. **Description Writing**:
   - 2-3 sentences maximum
   - First sentence: What happened
   - Second sentence: Impact/significance
   - Avoid marketing fluff, stay factual

4. **Milestone Selection**:
   - Choose 5-15 key moments (10 is ideal)
   - Balance different types: equipment, certifications, projects, team
   - Ensure chronological narrative makes sense

### Image Requirements

- **Dimensions**: Minimum 1920×1080px, prefer 2560×1440px
- **Aspect Ratio**: 16:9 or wider
- **Format**: JPEG (best for photos), PNG (if transparency needed)
- **File Size**: Optimize to < 500KB per image (use tools like TinyPNG)
- **Naming**: Use descriptive names: `2015-foundation.jpg`, not `IMG_001.jpg`

---

## Edge Cases Handled

✅ **5 milestones** - Timeline still feels balanced
✅ **15+ milestones** - Nodes get tighter, hover previews still usable
✅ **Mixed image sizes** - Consistent overlay and object-fit
✅ **Missing images** - Build script warns, uses fallback
✅ **No featured milestone** - Defaults to first chronological milestone
✅ **Single milestone** - Component still renders (useful during content population)

---

## Troubleshooting

### Problem: Milestone not showing
**Solution**:
1. Check year format (must be 4-digit number)
2. Verify image exists in `content/homepage_hero/images/`
3. Run `npm run build:content` to regenerate
4. Check browser console for errors

### Problem: Images not loading
**Solution**:
1. Verify image files are in correct folder
2. Check file extensions match CSV (case-sensitive)
3. Ensure build script copied images to `public/hero/`
4. Clear browser cache and hard refresh

### Problem: Auto-play not working
**Solution**:
1. Check browser console for JavaScript errors
2. Ensure you're not hovering over hero section
3. Try clicking a different milestone to reset
4. Verify milestones.json has multiple items

### Problem: Timeline looks cramped
**Solution**:
1. Reduce number of milestones (aim for 8-12)
2. Check if year range is too narrow
3. Consider grouping similar years into one milestone

### Problem: Want to adjust curve shape
**Solution**:
1. Edit `src/components/home/timelineMath.ts`
2. Modify `TIMELINE_CONFIG.control.y` value:
   - Default: 25 (moderate arch)
   - More curved: 20-22
   - Less curved: 28-30
3. Refresh browser to see changes

---

## Future Enhancements (Optional)

### Potential Additions
- Video backgrounds for certain milestones
- Sound effects on milestone transitions (subtle)
- Social share buttons for specific milestones
- Download milestone images as wallpapers
- "Jump to year" input field

### Technical Improvements
- Image lazy loading for off-screen milestones
- WebP format with JPEG fallback
- Preload next milestone image for smoother transitions
- Add blur-up placeholder effect (LQIP)

---

## Comparison: Evolution Timeline Versions

| Feature | Initial Version (Straight Line) | Current Version (Curved Arrow) |
|---------|-------------------------------|--------------------------------|
| **Arrow Shape** | Thin diagonal line | Thick curved arch |
| **Tagline Position** | Rotated HTML div overlay | SVG textPath inside arrow |
| **Visual Impact** | Minimal | Strong growth metaphor |
| **Node Positioning** | Linear calculation | Bezier curve with perpendicular offset |
| **Gradient** | Simple diagonal | Flowing along curve path |
| **Customization** | Hardcoded coordinates | Configurable via timelineMath.ts |
| **Technical Approach** | Basic SVG stroke | Filled path with mathematical precision |
| **Browser Support** | All modern browsers | Modern browsers (2021+) |

---

## Summary

The **Evolution Timeline Hero Section** transforms the website's first impression from a simple photo gallery into a compelling narrative of NS Engineering's decade-long journey. By combining stunning visuals with an innovative timeline interface, it immediately communicates:

1. **Longevity** - 10+ years of operations
2. **Growth** - Continuous expansion and improvement
3. **Professionalism** - Modern, interactive design
4. **Trustworthiness** - Real photos, real milestones

All while maintaining the company's brand identity and staying fully data-driven for easy updates.

---

**Last Updated**: December 2024
**Component Version**: 1.0
**Author**: NS Engineering Website Team
