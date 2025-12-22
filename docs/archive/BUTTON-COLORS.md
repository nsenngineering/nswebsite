# Button Color System for Purple Theme

## Updated Button Variants

### Design Rationale
The button system has been updated to work harmoniously with the purple brand color scheme. The key challenge was ensuring good contrast and visual hierarchy when buttons appear on both purple and white backgrounds.

## Button Variants

### 1. **Primary** (Default)
```tsx
<Button variant="primary">Request a Quote</Button>
```
- **Background**: White (`bg-white`)
- **Text**: Purple (`text-primary-700`)
- **Hover**: Light gray background with shadow
- **Use Case**: Main CTA buttons on purple backgrounds (hero sections, purple CTAs)
- **Visual Impact**: High contrast, stands out prominently on purple

### 2. **Secondary**
```tsx
<Button variant="secondary">Get Started</Button>
```
- **Background**: Yellow (`bg-secondary-400` - #facc15)
- **Text**: Dark gray (`text-gray-900`)
- **Hover**: Brighter yellow with shadow
- **Use Case**: Alternative CTAs, important secondary actions
- **Visual Impact**: Energetic, attention-grabbing accent color from brochure

### 3. **Outline**
```tsx
<Button variant="outline">Learn More</Button>
```
- **Background**: Transparent with white border
- **Text**: White
- **Hover**: Subtle white background overlay
- **Use Case**: Secondary buttons on purple backgrounds
- **Visual Impact**: Subtle, professional, doesn't compete with primary

### 4. **Ghost**
```tsx
<Button variant="ghost">Cancel</Button>
```
- **Background**: Transparent
- **Text**: White
- **Hover**: Subtle white background overlay
- **Use Case**: Tertiary actions, dismissible actions on purple backgrounds
- **Visual Impact**: Minimal, unobtrusive

### 5. **Purple** (NEW)
```tsx
<Button variant="purple">Submit</Button>
```
- **Background**: Purple (`bg-primary-600` - #7c3aed)
- **Text**: White
- **Hover**: Darker purple with shadow
- **Use Case**: Primary buttons on white/light backgrounds (forms, cards, content sections)
- **Visual Impact**: Brand-aligned, professional on light backgrounds

## Usage Guidelines

### On Purple Backgrounds (Hero, CTA sections)
✅ **Recommended:**
- `variant="primary"` - White button (best contrast)
- `variant="secondary"` - Yellow button (energetic accent)
- `variant="outline"` - White outline (subtle)

❌ **Avoid:**
- `variant="purple"` - Poor contrast, blends into background

### On White/Light Backgrounds (Forms, Cards, Content)
✅ **Recommended:**
- `variant="purple"` - Purple button (brand-aligned)
- `variant="secondary"` - Yellow button (accent)

❌ **Avoid:**
- `variant="primary"` - White on white has no contrast

## Component Updates

### Files Modified:
1. **`src/components/ui/Button.tsx`**
   - Added new `purple` variant
   - Updated `primary` to white background for purple hero sections
   - Updated `secondary` to use yellow accent color
   - Updated `outline` for better contrast on purple
   - Updated `ghost` for subtle actions

2. **`src/app/services/page.tsx`**
   - Changed "Request Quote" buttons to use `variant="purple"` (on white cards)

### Files Using Updated Buttons:
- ✅ `src/components/home/HeroSection.tsx` - Primary (white) and Outline
- ✅ `src/app/services/page.tsx` - Secondary (yellow) and Purple variants
- ✅ `src/app/about/page.tsx` - Uses purple CTAs
- ✅ `src/app/contact/page.tsx` - Purple variant for forms
- ✅ `src/app/projects/page.tsx` - Consistent with purple theme

## Visual Hierarchy

**Importance Level:**
1. **Primary Action** → `variant="primary"` (white on purple) or `variant="purple"` (purple on white)
2. **Secondary Action** → `variant="secondary"` (yellow accent)
3. **Tertiary Action** → `variant="outline"` or `variant="ghost"`

## Accessibility

All button combinations meet **WCAG AA standards**:
- ✅ White text on purple-600+ backgrounds (4.5:1+ contrast)
- ✅ Purple-700 text on white background (7:1+ contrast)
- ✅ Gray-900 text on yellow-400 background (8:1+ contrast)
- ✅ White text on purple buttons (4.5:1+ contrast)

## Examples in Context

### Hero Section (Purple Background)
```tsx
<section className="bg-gradient-to-br from-primary-600 to-primary-800">
  <Button variant="primary">Request a Quote</Button>
  {/* White button - excellent contrast */}

  <Button variant="outline">Our Services</Button>
  {/* White outline - subtle alternative */}
</section>
```

### Services CTA (Purple Background)
```tsx
<section className="bg-gradient-to-br from-primary-600 to-primary-800">
  <Button variant="secondary">Request a Quote</Button>
  {/* Yellow button - energetic accent */}

  <Button variant="outline">View Our Projects</Button>
  {/* White outline - secondary action */}
</section>
```

### Contact Form (White Background)
```tsx
<form className="bg-white">
  <Button variant="purple">Submit Request</Button>
  {/* Purple button - brand-aligned on white */}
</form>
```

### Service Cards (White Background)
```tsx
<Card className="bg-white">
  <Button variant="purple">Request Quote</Button>
  {/* Purple button - maintains brand identity */}
</Card>
```

## Color Reference

### Primary Purple Palette
- `primary-600`: #7c3aed (Main brand purple)
- `primary-700`: #6d28d9 (Darker purple for text on white)
- `primary-800`: #5b21b6 (Darkest purple for gradients)

### Secondary Yellow Palette
- `secondary-400`: #facc15 (Bright yellow for buttons)
- `secondary-500`: #eab308 (Darker yellow for hover)

### Neutral Palette
- `white`: #ffffff (Button backgrounds on purple)
- `gray-50`: #f9fafb (Hover state for white buttons)
- `gray-900`: #111827 (Text on yellow buttons)

## Testing Checklist

✅ Hero section buttons visible on purple gradient
✅ CTA section buttons have good contrast
✅ Service cards buttons work on white background
✅ Contact form buttons clearly visible
✅ All hover states provide visual feedback
✅ Focus states meet accessibility standards
✅ Disabled states have reduced opacity
✅ All text legible at various screen sizes

---

**Updated**: 2025-11-27
**Status**: Button color system optimized for purple theme ✅
