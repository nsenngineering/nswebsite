# Website Optimization & SEO Audit - Implementation Roadmap

**Document Version**: 1.0
**Status**: Planning Phase
**Date Created**: 2026-06-19
**Project**: NS Engineering & Geotechnical Services Website
**Current Version**: 1.3.0

---

## Executive Summary

This document outlines a comprehensive 5-phase SEO optimization and audit strategy for the NS Engineering website. It combines your audit documentation with the current project state to provide a detailed implementation plan.

**Current Status**:
- ✅ **Phase 4 (Structured Data)**: 90% Complete
- ⏳ **Phase 1 (Technical SEO)**: 50% Complete
- ⏳ **Phase 2 (Performance)**: 20% Complete
- ⏳ **Phase 3 (Content)**: 10% Complete
- ⏳ **Phase 5 (User Behavior)**: 0% Complete

---

## Project Context

### What's Already Implemented

#### ✅ AI SEO Optimization (v1.2.0)
- **Person Schemas**: 5 leadership team members with credentials and expertise
- **DefinedTerm Schemas**: 8 geotechnical acronyms (PDA, PIT, MASW, SPT, CBR, UCS, NDT, ERT)
- **Service Schemas**: Enhanced with geographic targeting (Nepal) and provider linkage
- **Project Schemas**: Enhanced with GPS coordinates, location hierarchy, and spatial coverage
- **Organization Schema**: With employee relationships and service offerings
- **Knowledge Graph**: Complete connections between Organization ↔ Person ↔ Service ↔ Project

#### ✅ Content Management
- Google Sheets integration (18/18 sheets connected)
- CSV version control (Git tracked)
- Automatic content parsing and validation
- Fallback system for reliability

#### ✅ Technical Foundation
- Next.js 16 with static export
- TypeScript 100% (strict mode)
- Tailwind CSS v4
- Zero type errors
- Comprehensive documentation (20 files)

### What's NOT Yet Implemented

#### ❌ Phase 1: Technical SEO Audit (50%)
- [ ] Google Search Console setup and configuration
- [ ] Robots.txt optimization for crawl budget
- [ ] Sitemap.xml submission to GSC
- [ ] Broken links audit and fixing
- [ ] Redirect chains analysis
- [ ] Meta title/description optimization
- [ ] URL canonicalization verification
- [ ] Schema validation in GSC Rich Results

#### ❌ Phase 2: Performance Optimization (20%)
- [ ] Google PageSpeed Insights analysis
- [ ] Core Web Vitals optimization (LCP, INP, CLS)
- [ ] Image optimization (WebP conversion, lazy loading)
- [ ] JavaScript minification verification
- [ ] CSS optimization
- [ ] Browser caching optimization
- [ ] GTmetrix performance analysis
- [ ] CDN optimization (Cloudflare)

#### ❌ Phase 3: Content Optimization (10%)
- [ ] Keyword research and mapping
- [ ] Competitor analysis
- [ ] Content gap analysis
- [ ] Page metadata optimization
- [ ] FAQ schema optimization
- [ ] URL structure review
- [ ] Internal linking strategy

#### ❌ Phase 5: User Behavior Analysis (0%)
- [ ] Google Analytics 4 (GA4) setup
- [ ] Conversion goals configuration
- [ ] User journey tracking
- [ ] Bounce rate analysis
- [ ] Session duration optimization
- [ ] Exit page analysis
- [ ] Form submission tracking
- [ ] CTA button optimization

#### ❌ Additional Monitoring & Compliance
- [ ] Error tracking (Sentry/similar)
- [ ] Uptime monitoring (UptimeRobot)
- [ ] Real user monitoring (RUM)
- [ ] GDPR/Privacy compliance
- [ ] Cookie consent banner
- [ ] Security headers verification
- [ ] SSL certificate monitoring

---

## Phase-by-Phase Implementation Plan

---

## PHASE 1: Technical SEO Audit

### Objective
Identify technical issues preventing search engixnes from properly crawling and indexing the website.

### Current Status: 50% Complete
- ✅ Robots.txt created
- ✅ Sitemap.xml generated
- ✅ HTTPS/SSL configured (Cloudflare)
- ❌ GSC not set up
- ❌ Crawl analysis not performed
- ❌ Meta tags not optimized

### Tools Required
1. **Google Search Console (GSC)**
2. **Screaming Frog SEO Spider** (Free/Paid)
3. **SSL Labs**
4. **Lighthouse** (Built into Chrome DevTools)

### Detailed Checklist

#### 1.1 Google Search Console Setup
**Priority**: 🔴 Critical
**Effort**: 2-3 hours

**Tasks**:
- [ ] Create/verify property ownership in GSC
- [ ] Submit sitemap.xml (`public/sitemap.xml`)
- [ ] Request initial crawl
- [ ] Monitor indexing status
- [ ] Set preferred domain (www vs non-www)
- [ ] Configure crawl budget settings

**Files Involved**:
- `public/sitemap.xml` - Already exists, verify structure
- `public/robots.txt` - Already exists, verify directives

**Action Items**:
```bash
# Verify sitemap.xml is properly formatted
npm run generate:sitemap

# Check robots.txt
cat public/robots.txt
```

#### 1.2 Robots.txt & Crawl Budget Optimization
**Priority**: 🔴 Critical
**Effort**: 1-2 hours

**Current State** (`public/robots.txt`):
- Already configured for general users
- Need to verify it's not blocking important content

**Checks**:
- [ ] Verify no important pages are blocked
- [ ] Check Disallow patterns
- [ ] Ensure `/out` (static export) is indexed appropriately
- [ ] Set crawl-delay if needed
- [ ] Review Sitemap directives

**Action**:
```bash
# Review current robots.txt
cat public/robots.txt
```

#### 1.3 Broken Links Audit
**Priority**: 🟠 High
**Effort**: 3-4 hours

**Tools**:
- Screaming Frog (scan entire site)
- Chrome DevTools Network tab
- GSC Coverage Report

**Checks**:
- [ ] Find 404 errors (using GSC)
- [ ] Find broken internal links
- [ ] Fix redirect chains (A→B→C should be A→C)
- [ ] Verify all image paths resolve
- [ ] Check all external links are still valid

**Process**:
1. Install Screaming Frog
2. Crawl: `https://nsengineering.com.np`
3. Filter for 4xx/5xx status codes
4. Document and fix each broken link
5. Re-verify after fixes

**Expected Findings**:
- Old redirects from URL migration
- Missing project images
- Broken external resource links
- Dead carousel images

#### 1.4 Redirect Chains Analysis
**Priority**: 🟠 High
**Effort**: 2-3 hours

**Current State**:
- URL redirects already managed in `src/data/redirects.ts`
- `scripts/generate-redirects.ts` generates Netlify/Cloudflare rules

**Checks**:
- [ ] Verify no redirect chains (A→B→C)
- [ ] Ensure redirects use 301 (permanent)
- [ ] Check redirect response times (<100ms)
- [ ] Verify redirect rules in `_redirects` file

**Action**:
```bash
# Review current redirects
cat public/_redirects

# Regenerate if needed
npm run generate:redirects
```

#### 1.5 Meta Tags & Title Optimization
**Priority**: 🟠 High
**Effort**: 4-6 hours

**Current State**:
- Page titles and descriptions generated from content
- Need to optimize for keyword relevance

**Checks by Page**:
| Page | Current Title | Optimization Needed |
|------|---------------|-------------------|
| Home | "NS Engineering - Geotechnical Services" | Add primary keyword (e.g., "...in Nepal") |
| Services | "Our Services - NS Engineering" | Add service keywords |
| Projects | "Our Projects" | Add project type (e.g., "Hydropower...") |
| Team | "Our Team" | Add team member expertise |
| About | "About Us" | Add ISO certification |

**Tasks**:
- [ ] Audit meta titles (50-60 chars)
- [ ] Audit meta descriptions (150-160 chars)
- [ ] Ensure keyword inclusion
- [ ] Check for duplicate titles/descriptions
- [ ] Update page frontmatter

**Example Improvements**:
```
❌ "Our Services"
✅ "Geotechnical Testing & Drilling Services - NS Engineering Nepal"

❌ "Our Projects"
✅ "49 Infrastructure Projects - Hydropower, Roads, NDT Services Nepal"
```

#### 1.6 Schema Validation
**Priority**: 🟡 Medium
**Effort**: 2-3 hours

**Current State**:
- ✅ Person schemas implemented
- ✅ DefinedTerm schemas implemented
- ✅ Service schemas implemented
- ✅ Project schemas implemented
- ✅ Organization schema implemented

**Tools**:
- Google Rich Results Test
- Schema.org validator
- GSC Rich Results report

**Checks**:
- [ ] Validate Person schemas (all 5 members)
- [ ] Validate DefinedTerm schemas (8 terms)
- [ ] Validate Service schemas (17 services)
- [ ] Validate Project schemas (49 projects)
- [ ] Verify no schema errors in GSC

**Process**:
1. Go to Google Rich Results Test: https://search.google.com/test/rich-results
2. Test each page URL
3. Review any warnings/errors
4. Document fixes needed

#### 1.7 Canonical Tags Verification
**Priority**: 🟡 Medium
**Effort**: 1-2 hours

**Checks**:
- [ ] Verify canonical tags on all pages
- [ ] Ensure self-referential canonicals
- [ ] Check no canonical chains
- [ ] Review pagination canonicals

**Implementation**:
Next.js handles this automatically via `next/head` and structured metadata.

#### 1.8 SSL Certificate & Security Headers
**Priority**: 🔴 Critical
**Effort**: 1 hour (verification)

**Current State**:
- ✅ HTTPS configured (Cloudflare)
- ⏳ Security headers need verification

**Checks**:
- [ ] Run SSL Labs test: https://www.ssllabs.com/ssltest/
- [ ] Verify A+ rating or better
- [ ] Check security headers (CSP, X-Frame-Options, etc.)
- [ ] Review `_headers` file

**Expected Result**:
- SSL Grade: A+ or A
- Certificate valid for 12+ months

---

### Phase 1 Deliverables

**File Changes Needed**:
1. `src/lib/seo/meta-tags.ts` - Optimize all page titles/descriptions
2. `public/robots.txt` - Fine-tune crawl directives
3. `public/sitemap.xml` - Regenerate and verify
4. `public/_headers` - Review security headers
5. `public/_redirects` - Verify all redirects

**Documentation**:
- Technical SEO Audit Report (save findings in `docs/technical/GSC_AUDIT.md`)
- Broken Links Report
- Redirect Analysis

**Tools to Install**:
```bash
# No new npm packages needed - use web-based tools
```

---

## PHASE 2: Performance Optimization

### Objective
Improve loading speed and Core Web Vitals (LCP, INP, CLS).

### Current Status: 20% Complete
- ✅ Static export optimization (Next.js)
- ✅ Cloudflare CDN enabled
- ❌ Core Web Vitals not measured
- ❌ Image optimization not completed
- ❌ JavaScript bundle not analyzed
- ❌ Caching strategy not optimized

### Tools Required
1. **Google PageSpeed Insights**
2. **GTmetrix**
3. **Lighthouse** (Chrome DevTools)
4. **WebPageTest**
5. **Cloudflare Analytics**

### Critical Metrics

#### 2.1 Core Web Vitals Analysis
**Priority**: 🔴 Critical
**Effort**: 4-6 hours

**Key Metrics**:
| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| LCP (Largest Contentful Paint) | ? | < 2.5s | ⏳ TBD |
| INP (Interaction to Next Paint) | ? | < 200ms | ⏳ TBD |
| CLS (Cumulative Layout Shift) | ? | < 0.1 | ⏳ TBD |
| TTFB (Time to First Byte) | ? | < 600ms | ⏳ TBD |

**Measurement Steps**:
1. Go to PageSpeed Insights: https://pagespeed.web.dev/
2. Test each major page URL
3. Document scores for desktop and mobile
4. Identify slowest resources
5. Create optimization plan

**Pages to Test** (Priority Order):
1. Homepage
2. Projects page
3. Services page
4. Team page
5. About page

**Expected Findings**:
- Large images impacting LCP
- Heavy JavaScript reducing INP
- Layout shifts from lazy-loaded elements
- Unoptimized third-party scripts

#### 2.2 Image Optimization
**Priority**: 🔴 Critical
**Effort**: 8-10 hours

**Current State**:
- Images in `public/` folders
- Unclear if WebP conversion is used
- Unclear if lazy loading is implemented

**Tasks**:
- [ ] Convert all PNG/JPG to WebP format (with fallbacks)
- [ ] Implement lazy loading on carousel images
- [ ] Add responsive image srcsets
- [ ] Compress images (target: 80-120KB for photos)
- [ ] Remove unused images
- [ ] Optimize hero carousel images specifically

**Implementation**:
```typescript
// Example: Optimized image component
<picture>
  <source srcSet="/image.webp" type="image/webp" />
  <source srcSet="/image.jpg" type="image/jpeg" />
  <img loading="lazy" width="800" height="600" src="/image.jpg" alt="..." />
</picture>
```

**Tools**:
- ImageOptim (macOS) or equivalent for Windows
- TinyPNG/TinyJPG API
- ImageMagick CLI

**Priority Images** (by impact):
1. Hero carousel images (on homepage - affects LCP)
2. Project map preview images
3. Team member photos
4. Service category images
5. Gallery images (lazy load)

#### 2.3 JavaScript & CSS Optimization
**Priority**: 🟠 High
**Effort**: 4-5 hours

**Current State**:
- Next.js handles code splitting automatically
- Framer Motion library used for animations
- React Leaflet for map (large library)

**Checks**:
- [ ] Verify Next.js is producing minified JS
- [ ] Check bundle size with `npm run build`
- [ ] Analyze unused CSS (Tailwind should handle this)
- [ ] Review third-party scripts impact
- [ ] Check for dead code

**Tools**:
```bash
# Install bundle analyzer
npm install --save-dev @next/bundle-analyzer

# Analyze bundle
npm run build  # Check output size
```

**Potential Optimizations**:
- Lazy load Framer Motion animations (only on scroll)
- Lazy load React Leaflet map (only on projects page)
- Remove unused icon libraries from lucide-react
- Tree-shake unused utility functions

#### 2.4 Caching Strategy
**Priority**: 🟡 Medium
**Effort**: 2-3 hours

**Current State**:
- Static export from Next.js
- Cloudflare CDN active
- Caching headers in `public/_headers`

**Verification**:
- [ ] Check cache headers in browser DevTools
- [ ] Verify static assets cached for 1 year
- [ ] Verify HTML cached appropriately (24-48 hours)
- [ ] Check Cloudflare cache hit rate
- [ ] Review `_headers` caching directives

**Recommended `_headers` Config**:
```
# Static assets (1 year)
/assets/*
  Cache-Control: public, max-age=31536000, immutable

# HTML files (24 hours)
/*.html
  Cache-Control: public, max-age=86400

# JSON data (1 hour)
/data/*
  Cache-Control: public, max-age=3600
```

#### 2.5 Third-Party Scripts Audit
**Priority**: 🟡 Medium
**Effort**: 2-3 hours

**Current State**:
- GA4 not implemented
- Turnstile (Cloudflare) form protection implemented
- No other third-party scripts identified

**Checks**:
- [ ] Audit all external scripts
- [ ] Check script load timing
- [ ] Identify render-blocking scripts
- [ ] Set async/defer attributes
- [ ] Consider script loading strategy

**Future Additions**:
- Google Analytics 4 (should be deferred)
- Google Search Console verification
- Heat mapping tool (optional)

#### 2.6 Lighthouse Score Targets
**Priority**: 🟡 Medium
**Effort**: Ongoing

**Target Scores** (out of 100):
- Performance: ≥ 85
- Accessibility: ≥ 95
- Best Practices: ≥ 90
- SEO: ≥ 95

**Process**:
1. Run Lighthouse audit (Chrome DevTools)
2. Document baseline scores
3. Address issues by priority
4. Re-run after each optimization
5. Track progress in checklist

---

### Phase 2 Implementation Order

1. **Immediate** (Week 1):
   - Run PageSpeed Insights on all pages
   - Convert images to WebP
   - Implement lazy loading

2. **Short-term** (Week 2):
   - Optimize hero images
   - Analyze JavaScript bundle
   - Tune Cloudflare caching

3. **Ongoing**:
   - Monitor Core Web Vitals monthly
   - Re-test after content updates
   - Address any regressions

---

### Phase 2 Deliverables

**File Changes Needed**:
1. `src/components/images/OptimizedImage.tsx` - New component for image optimization
2. `public/_headers` - Update caching directives
3. `src/app/layout.tsx` - Add Web Vitals tracking
4. `next.config.ts` - Add image optimization config

**Tools to Install**:
```bash
npm install --save-dev @next/bundle-analyzer
npm install web-vitals  # For Core Web Vitals tracking
```

**Documentation**:
- Performance Audit Report (`docs/technical/PERFORMANCE_AUDIT.md`)
- Image Optimization Guide (`docs/guides/IMAGE_OPTIMIZATION.md`)
- Caching Strategy (`docs/technical/CACHING_STRATEGY.md`)

---

## PHASE 3: Content Optimization

### Objective
Improve ranking potential through keyword research, content optimization, and search intent alignment.

### Current Status: 10% Complete
- ✅ Content structured in CSV
- ✅ 50+ pages with unique content
- ❌ Keyword research not performed
- ❌ Content gap analysis not done
- ❌ Competitor analysis not done
- ❌ Internal linking strategy not implemented

### Tools Required
1. **Google Keyword Planner**
2. **Google Trends**
3. **SEMrush** or **Ahrefs** (optional)
4. **Answer the Public**
5. **Competitor websites**

### Detailed Content Optimization

#### 3.1 Keyword Research
**Priority**: 🔴 Critical
**Effort**: 8-10 hours

**Research Strategy**:
1. **Primary Keywords** (High Value):
   - "Geotechnical testing Nepal"
   - "Pile foundation testing"
   - "Soil investigation services Nepal"
   - "Hydropower consulting Nepal"
   - "NDT testing Nepal"

2. **Secondary Keywords** (Medium Value):
   - "SPT boring Nepal"
   - "Concrete testing Nepal"
   - "Borehole drilling"
   - "Laboratory testing"
   - "Site investigation"

3. **Long-tail Keywords** (Specific, Lower Competition):
   - "Pile driving analyzer PDA testing Nepal"
   - "MASW seismic testing Kathmandu"
   - "Atterberg limits test price"
   - "Triaxial shear test lab"

**Tools**:
- Google Keyword Planner (Free)
- Answer the Public (Find question keywords)
- Google Trends (Search volume trends)

**Process**:
1. Use Google Keyword Planner
2. Search for "geotechnical testing"
3. Filter by: Nepal, 1000+ monthly searches
4. Document keywords by topic:
   - Pile Testing (5+ keywords)
   - Soil Testing (5+ keywords)
   - Rock Testing (3+ keywords)
   - Geophysical (3+ keywords)
   - Drilling (3+ keywords)
   - Project Types (5+ keywords)

5. Create keyword mapping spreadsheet:
```csv
Keyword, Search Volume, Difficulty, Target Page, Current Ranking
"geotechnical testing nepal", 1200, 45, /services, Not Ranked
"pile foundation testing", 800, 52, /services, Not Ranked
...
```

**Expected Output**: 40-50 target keywords mapped to pages

#### 3.2 Competitor Analysis
**Priority**: 🟠 High
**Effort**: 5-6 hours

**Competitors to Analyze**:
1. Local competitors in Nepal
2. Regional competitors (India, Bangladesh)
3. International references (standards, best practices)

**Analysis Points**:
- [ ] Identify top 5 competitors in Google for "geotechnical testing Nepal"
- [ ] Analyze their top-ranking pages
- [ ] Review their page titles and descriptions
- [ ] Check their backlink profile
- [ ] Document their content strategy
- [ ] Note any keyword gaps they're missing

**Process**:
1. Google Search: "geotechnical testing Nepal"
2. Document top 10 results
3. For each competitor, analyze:
   - Page structure
   - Keywords targeted
   - Content depth
   - Internal linking
   - Social signals

**Deliverable**: Competitor Analysis Matrix (save to `docs/research/COMPETITOR_ANALYSIS.md`)

#### 3.3 Content Gap Analysis
**Priority**: 🟠 High
**Effort**: 4-5 hours

**Current Content Audit** (by page):
| Page | Topics | Keyword Focus | Gap |
|------|--------|---------------|-----|
| /services | 17 services listed | Generic descriptions | Missing technical details, use cases |
| /projects | 49 projects with map | Project type, location | Missing ROI/results metrics |
| /team | 5 leaders | Names, roles | Missing publications, case studies |
| /about | Company history | Company story | Missing certifications highlights |
| /elibrary | Documents, papers | Generic titles | Missing keyword-rich descriptions |

**Gaps to Address**:
- [ ] Add service use cases ("When to use PDA testing")
- [ ] Add problem-solution framework
- [ ] Add case studies with metrics
- [ ] Add FAQ targeting long-tail keywords
- [ ] Add technical glossary linking
- [ ] Add client testimonials

#### 3.4 Page Metadata Optimization
**Priority**: 🟠 High
**Effort**: 6-8 hours

**Pages to Optimize** (Priority Order):

**1. Services Pages** (17 services):
```
Optimization needed:
❌ Title: "PDA Testing"
✅ Title: "Pile Driving Analyzer (PDA) Testing Services - NS Engineering Nepal"

❌ Description: "PDA testing service"
✅ Description: "Professional pile driving analyzer (PDA) testing for foundation integrity verification, used in hydropower, roads, and building projects across Nepal. High-strain dynamic pile testing."
```

**2. Project Pages** (49 projects):
```
❌ Title: "Fast Track Expressway - Segment 5"
✅ Title: "Fast Track Expressway Segment 5 - Geotechnical Investigation - Nepal"

❌ Description: "A project"
✅ Description: "Fast Track Expressway Segment 5 geotechnical site investigation including boring, SPT, lab testing. Completed 2023-2024. Multi-stage infrastructure project."
```

**3. Homepage**:
```
❌ Title: "NS Engineering"
✅ Title: "NS Engineering - Geotechnical Testing & Drilling Services in Nepal"

❌ Description: "Professional services"
✅ Description: "ISO 9001:2015 certified geotechnical and engineering services in Nepal. Pile testing (PDA, PIT), drilling, lab analysis, geophysical surveys for hydropower, roads, and infrastructure projects."
```

**4. Team Page**:
```
❌ Title: "Our Team"
✅ Title: "Expert Geotechnical Engineers & Directors - NS Engineering Nepal"

❌ Description: "Meet our team"
✅ Description: "Meet our expert team: Directors with 15-30 years experience in geotechnical engineering, pile testing, and infrastructure projects. ISO 9001:2015 certified professionals."
```

#### 3.5 Internal Linking Strategy
**Priority**: 🟡 Medium
**Effort**: 4-5 hours

**Current State**:
- Manual internal links in components
- No systematic linking strategy

**Strategy**:
1. **Contextual Links**: Link from related services/projects
2. **Hierarchical Links**: Category → Specific service/project
3. **Supporting Links**: FAQ/Glossary from service pages
4. **Reciprocal Links**: Services linked from projects that use them

**Implementation Examples**:

```typescript
// In ServiceCard component
"Learn more about {Service} → Projects using {Service}"

// In ProjectCard component
"Technologies used: {Service1}, {Service2}, {Service3}"

// In FAQ
"Related services: {Service1}, {Service2}"
```

**Target**:
- Each service linked from 2-3 relevant projects
- Each project linked from relevant services
- FAQ linked from relevant service/project pages
- Related services linked from each service

#### 3.6 FAQ Schema Optimization
**Priority**: 🟡 Medium
**Effort**: 3-4 hours

**Current FAQ Page**:
- 20 questions across 4 categories
- Need to enhance for keyword targeting

**Optimization**:
- [ ] Ensure each Q&A targets a long-tail keyword
- [ ] Add schema markup for each FAQ item
- [ ] Ensure answers are comprehensive (150+ words)
- [ ] Add related service/project links in answers
- [ ] Track FAQ click-through rates

**Example FAQ Optimization**:
```
❌ Question: "What is PDA testing?"
✅ Question: "What is Pile Driving Analyzer (PDA) Testing and When Do You Need It?"

Answer should:
1. Define PDA testing clearly
2. Explain benefits and use cases
3. Compare to other methods (PIT)
4. Include project examples
5. Link to "PDA Testing" service page
6. Include schema markup
```

#### 3.7 URL & Navigation Optimization
**Priority**: 🟡 Medium
**Effort**: 2-3 hours

**Current URLs**: Already optimized (keyword-rich, descriptive)

**Verification**:
- [ ] All URLs lowercase
- [ ] Hyphens for multi-word URLs
- [ ] No unnecessary parameters
- [ ] Consistent structure
- [ ] Breadcrumb trails clear

**Example URL Structure**:
```
✅ /services/pile-testing/pda-testing
✅ /projects/hydropower/fast-track-10
✅ /elibrary/publications/geotechnical-foundation-design

❌ /pile_testing_pda
❌ /projects?id=123
```

---

### Phase 3 Implementation Order

1. **Week 1**:
   - Keyword research (40-50 keywords)
   - Competitor analysis

2. **Week 2-3**:
   - Content gap analysis
   - Update service descriptions (+ keywords)
   - Update project descriptions

3. **Week 4**:
   - Optimize page titles/descriptions
   - Enhance FAQ content
   - Implement internal linking

4. **Ongoing**:
   - Track rankings monthly
   - Update content based on rankings
   - Add new FAQ items from user searches

---

### Phase 3 Deliverables

**File Changes Needed**:
1. `content/services/services.csv` - Add keyword-rich descriptions
2. `content/projects/projects.csv` - Enhance project descriptions
3. `content/faq/faq.csv` - Add keyword-targeted Q&A pairs
4. `src/lib/seo/schema-generators.ts` - Add FAQ schema
5. `src/components/*/InternalLinks.tsx` - New component for systematic linking

**Documentation**:
- Keyword Research Report (`docs/research/KEYWORD_RESEARCH.md`)
- Competitor Analysis (`docs/research/COMPETITOR_ANALYSIS.md`)
- Content Gap Analysis (`docs/research/CONTENT_GAPS.md`)
- Internal Linking Guide (`docs/guides/INTERNAL_LINKING.md`)

**Tools to Install**:
```bash
# No new npm packages needed - use web-based tools
```

---

## PHASE 4: Structured Data & Schema

### Objective
Enable rich snippets and optimize for AI assistants.

### Current Status: 90% Complete ✅
- ✅ Person schemas (5 leaders)
- ✅ DefinedTerm schemas (8 terms)
- ✅ Service schemas (17 services)
- ✅ Project schemas (49 projects)
- ✅ Organization schema
- ✅ Knowledge graph implementation
- ⏳ Rich Results testing needed
- ⏳ GA4 goals configuration

### Remaining Tasks

#### 4.1 Rich Results Validation
**Priority**: 🟡 Medium  
**Effort**: 2-3 hours

**Process**:
1. Test each page type in Google Rich Results Test
2. Document any errors/warnings
3. Fix issues if any
4. Verify in GSC Rich Results report

**Pages to Test**:
- [ ] /about (Organization + Person schemas)
- [ ] /team (Person schemas)
- [ ] /services (Service + DefinedTerm schemas)
- [ ] /projects (Project schemas)
- [ ] /faq (FAQ schema)

**Expected Result**: ✅ All schemas valid, zero errors

#### 4.2 Knowledge Graph Enhancement
**Priority**: 🟡 Medium  
**Effort**: 2-3 hours

**Current Implementation**:
- Organization ↔ Person (employees)
- Organization ↔ Service (offers)
- Organization ↔ Project (author)
- Service ↔ DefinedTerm (relatedTo)
- Person ↔ Service (knowsAbout)

**Enhancements**:
- [ ] Add BreadcrumbList schema for navigation
- [ ] Add LocalBusiness schema (physical location)
- [ ] Add ContactPoint schema (phone, email)
- [ ] Add ProfessionalService schema
- [ ] Add AggregateRating if testimonials exist

#### 4.3 AI Assistant Optimization
**Priority**: 🟡 Medium  
**Effort**: 1-2 hours

**Current State**: ✅ Already optimized for AI

**Verification**:
- [ ] Test queries in ChatGPT: "Best geotechnical testing in Nepal"
- [ ] Test queries in Claude: "Who specializes in pile testing Nepal"
- [ ] Test queries in Perplexity: "Geotechnical engineers Nepal"
- [ ] Verify NS Engineering appears in results with credentials

**Example AI Query Results**:
```
User: "Who does pile testing in Nepal?"
Expected: "NS Engineering provides pile testing services with 
directors having 15-30 years experience. They offer PDA, PIT, 
and static load testing."

(Schema data being used: Person.expertise + Service.provider)
```

---

### Phase 4 Deliverables

**File Changes**: None (already implemented)

**Documentation**:
- Rich Results Report (`docs/technical/RICH_RESULTS_REPORT.md`)
- Knowledge Graph Map (`docs/technical/KNOWLEDGE_GRAPH.md`)

---

## PHASE 5: User Behavior Analysis & Monitoring

### Objective
Understand user behavior and optimize conversion funnels through comprehensive analytics.

### Current Status: 0% Complete ❌
- ❌ GA4 not installed
- ❌ Goals not configured
- ❌ Event tracking not implemented
- ❌ User journey not mapped
- ❌ RUM not configured
- ❌ Error tracking not set up

### 5.1 Google Analytics 4 (GA4) Setup
**Priority**: 🔴 Critical  
**Effort**: 4-5 hours

#### 5.1.1 Install GA4 Measurement ID
**Steps**:
1. Create GA4 property in Google Analytics
2. Get Measurement ID (G-XXXXXXXXXX)
3. Add to environment variables

**Implementation**:

```bash
# 1. Update .env.local and .env.cloud
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

```typescript
// 2. Create new file: src/lib/gtag.ts
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && GA_ID) {
    (window as any).gtag?.('config', GA_ID, {
      page_path: url,
    });
  }
};

export const event = (action: string, category: string, label: string, value: string) => {
  if (typeof window !== 'undefined' && GA_ID) {
    (window as any).gtag?.('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};
```

```typescript
// 3. Add to src/app/layout.tsx
import Script from 'next/script';
import { GA_ID } from '@/lib/gtag';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        {GA_ID && (
          <>
            <Script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            />
            <Script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_ID}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}
```

#### 5.1.2 Configure Conversion Goals
**Priority**: 🔴 Critical  
**Effort**: 3-4 hours

**Key Conversions to Track**:

| Conversion | Event | Value | Priority |
|-----------|-------|-------|----------|
| Contact Form Submit | form_submission | Lead | 🔴 Critical |
| Phone Call Click | phone_call | Inquiry | 🔴 Critical |
| Email Click | email_click | Inquiry | 🟠 High |
| Download (eLibrary) | download | Content | 🟠 High |
| Project View | project_view | Engagement | 🟡 Medium |
| Service View | service_view | Engagement | 🟡 Medium |
| Map Interaction | map_interaction | Engagement | 🟡 Medium |
| Team Member View | team_view | Engagement | 🟡 Medium |

**GA4 Configuration**:
1. Create conversion events in GA4 console
2. Set up conversion funnels:
   - **Lead Generation**: Landing → Contact Form → Submit
   - **Project Inquiry**: Homepage → Projects → Project Detail → Contact
   - **Service Inquiry**: Homepage → Services → Service Detail → Contact
   - **Content Download**: Homepage → eLibrary → Download

**Implementation Example**:
```typescript
// In contact form component
const handleFormSubmit = async (data: FormData) => {
  try {
    await submitForm(data);
    
    // Track conversion
    event('form_submission', 'lead_generation', 'contact_form', 'success');
    
    // Show success message
  } catch (error) {
    event('form_submission', 'lead_generation', 'contact_form', 'error');
  }
};
```

#### 5.1.3 Setup Event Tracking
**Priority**: 🟠 High
**Effort**: 4-5 hours

**Events to Track**:

```typescript
// Page views (automatic in Next.js)
pageview(router.pathname);

// User Engagement
event('scroll_depth', 'engagement', '25%|50%|75%|100%', 'true');
event('time_on_page', 'engagement', 'page_name', 'time_seconds');

// Navigation
event('internal_link_click', 'navigation', 'link_name', 'category');
event('external_link_click', 'navigation', 'link_url', 'domain');

// Map Interactions
event('map_marker_click', 'map', 'project_id', 'project_name');
event('map_zoom', 'map', 'zoom_level', 'zoom_level');

// Form Interactions
event('form_start', 'engagement', 'form_name', 'field_count');
event('form_field_error', 'engagement', 'field_name', 'error_type');

// Content Interactions
event('carousel_interaction', 'engagement', 'carousel_name', 'slide_number');
event('accordion_expand', 'engagement', 'accordion_section', 'section_name');
event('tab_click', 'engagement', 'tab_name', 'tab_index');

// Downloads
event('file_download', 'engagement', 'file_type', 'file_name');

// CTA Clicks
event('cta_click', 'conversion', 'cta_text', 'page_name');
event('phone_click', 'conversion', 'phone_button', 'page_name');
event('email_click', 'conversion', 'email_button', 'page_name');
```

**Implementation**:
Create `src/hooks/useAnalytics.ts`:
```typescript
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { pageview } from '@/lib/gtag';

export function useAnalytics() {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      pageview(url);
    };

    // Track initial page view
    pageview(router.pathname);

    // Listen for route changes (Next.js 13+ only)
  }, [router]);
}
```

---

### 5.2 User Behavior Analysis
**Priority**: 🟠 High
**Effort**: 2-3 hours (setup) + ongoing

**Key Metrics to Monitor**:

#### 5.2.1 Bounce Rate
- **Definition**: % of sessions with single page view
- **Target**: < 50%
- **Actions if High**:
  - Improve page loading speed
  - Add engaging content on homepage
  - Optimize headlines and CTAs
  - Improve content relevance

#### 5.2.2 Average Session Duration
- **Definition**: Average time users spend per session
- **Target**: > 2 minutes
- **Actions if Low**:
  - Add more engaging content
  - Improve navigation clarity
  - Add internal links to related pages
  - Reduce page load time

#### 5.2.3 Pages Per Session
- **Definition**: Average number of pages viewed per session
- **Target**: > 3 pages
- **Actions if Low**:
  - Improve internal linking
  - Add related content suggestions
  - Enhance navigation
  - Add cross-sells (services related to projects)

#### 5.2.4 Exit Pages Analysis
- **Definition**: Pages where users leave most
- **Target**: Minimize exits from conversion pages
- **Action**:
  - Identify pages with high exit rate
  - Analyze why users leave
  - Improve content/design of exit pages
  - Add retargeting for important exits

#### 5.2.5 Conversion Rate
- **Definition**: % of sessions that result in conversion
- **Target**: > 2%
- **Actions if Low**:
  - Improve CTA visibility
  - Simplify forms
  - Add trust signals (certifications, testimonials)
  - Improve landing page relevance

---

### 5.3 Setup Error Tracking
**Priority**: 🟠 High
**Effort**: 2-3 hours

**Option 1: Sentry (Recommended)**

```bash
npm install @sentry/nextjs
```

`src/instrumentation.ts`:
```typescript
import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 1,
      environment: process.env.NODE_ENV,
    });
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 1,
      environment: process.env.NODE_ENV,
    });
  }
}
```

**Option 2: Custom Error Logging**

Create `src/lib/error-logger.ts`:
```typescript
export async function logError(error: Error, context: string) {
  try {
    await fetch('/api/logs/error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: error.message,
        stack: error.stack,
        context,
        url: typeof window !== 'undefined' ? window.location.href : '',
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (e) {
    console.error('Failed to log error:', e);
  }
}
```

---

### 5.4 Setup Real User Monitoring (RUM)
**Priority**: 🟡 Medium
**Effort**: 2-3 hours

**Option 1: Cloudflare Web Analytics** (Automatic)
- Already included with Cloudflare Pages
- Provides Core Web Vitals data
- No additional setup needed

**Option 2: Web Vitals Tracking** (Manual)

```bash
npm install web-vitals
```

Create `src/lib/web-vitals.ts`:
```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', metric.name, {
      value: Math.round(metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    });
  }
}

export function registerWebVitals() {
  getCLS(sendToAnalytics);
  getFID(sendToAnalytics);
  getFCP(sendToAnalytics);
  getLCP(sendToAnalytics);
  getTTFB(sendToAnalytics);
}
```

Call in `src/app/layout.tsx`:
```typescript
import { registerWebVitals } from '@/lib/web-vitals';

if (typeof window !== 'undefined') {
  registerWebVitals();
}
```

---

### 5.5 GDPR & Privacy Compliance
**Priority**: 🔴 Critical
**Effort**: 3-4 hours

#### 5.5.1 Cookie Consent Banner
**Implementation**:

Create `src/components/CookieConsent.tsx`:
```typescript
'use client';
import { useState, useEffect } from 'react';

export function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const hasConsent = localStorage.getItem('cookieConsent');
    if (!hasConsent) {
      setShowConsent(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    // Enable GA4
    (window as any).gtag?.('consent', 'update', {
      'analytics_storage': 'granted'
    });
    setShowConsent(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <p className="text-sm">
          We use cookies to analyze website traffic and improve your experience.
          {' '}<a href="/privacy" className="underline">Learn more</a>
        </p>
        <div className="flex gap-4 ml-4">
          <button
            onClick={handleReject}
            className="px-4 py-2 text-sm border border-white rounded"
          >
            Reject
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm bg-blue-600 rounded font-medium"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
```

#### 5.5.2 Privacy Policy Update
- [ ] Create/update Privacy Policy page
- [ ] Document GA4 data collection
- [ ] Explain cookie usage
- [ ] Include data retention policy
- [ ] Add contact for data requests

Save to: `src/app/privacy/page.tsx`

#### 5.5.3 Google Analytics Compliance
- [ ] Enable anonymizeIp in GA4
- [ ] Set data retention policy (14 months)
- [ ] Disable Google Ads remarketing (if in Nepal)
- [ ] Review data sharing settings

---

### 5.6 Monthly Monitoring Dashboard
**Priority**: 🟡 Medium  
**Effort**: 1-2 hours setup

**Metrics to Track Monthly**:

Create `docs/ANALYTICS_DASHBOARD.md`:

```markdown
# Monthly Analytics Report

## Date: June 2026

### Traffic Metrics
- Sessions: ?
- Users: ?
- Pageviews: ?
- Bounce Rate: ?%
- Avg. Session Duration: ? min
- Pages per Session: ?

### Conversion Metrics
- Contact Form Submissions: ?
- Phone Calls: ?
- Email Inquiries: ?
- Downloads: ?
- Conversion Rate: ?%

### Top Performing Pages
1. ?
2. ?
3. ?

### Exit Pages
1. ?
2. ?
3. ?

### Core Web Vitals
- LCP: ? s
- INP: ? ms
- CLS: ?

### Action Items
- ?
- ?
- ?
```

---

### Phase 5 Implementation Timeline

**Week 1**: GA4 Setup
- [ ] Create GA4 property
- [ ] Install measurement script
- [ ] Test basic tracking

**Week 2**: Event Tracking
- [ ] Implement form submission events
- [ ] Implement CTA click events
- [ ] Implement page interaction events

**Week 3**: Compliance
- [ ] Add cookie consent banner
- [ ] Update privacy policy
- [ ] Configure GA4 compliance settings

**Week 4**: Monitoring
- [ ] Create analytics dashboard
- [ ] Train team on GA4
- [ ] Setup monthly reporting

**Ongoing**:
- [ ] Monitor metrics weekly
- [ ] Adjust based on data
- [ ] Create monthly reports

---

### Phase 5 Deliverables

**File Changes Needed**:
1. `src/lib/gtag.ts` - GA4 utility functions
2. `src/lib/error-logger.ts` - Error tracking
3. `src/lib/web-vitals.ts` - Web Vitals tracking
4. `src/hooks/useAnalytics.ts` - Analytics hook
5. `src/components/CookieConsent.tsx` - Cookie banner
6. `src/app/layout.tsx` - Add GA4 script
7. `src/app/privacy/page.tsx` - Privacy policy
8. `.env.local` - Add GA4 ID
9. `.env.cloud` - Add GA4 ID

**Tools to Install**:
```bash
npm install web-vitals
npm install @sentry/nextjs  # Optional, for error tracking
```

**Documentation**:
- Analytics Setup Guide (`docs/guides/ANALYTICS_SETUP.md`)
- Privacy Policy (`docs/PRIVACY_POLICY.md`)
- Monthly Dashboard Template (`docs/ANALYTICS_DASHBOARD.md`)

---

## ADDITIONAL: Security & Compliance

### Checklist

**SSL/Security**:
- [ ] SSL certificate valid and auto-renewed
- [ ] Security headers configured (_headers file)
- [ ] CSP (Content Security Policy) implemented
- [ ] X-Frame-Options set to SAMEORIGIN
- [ ] X-Content-Type-Options set to nosniff

**Compliance**:
- [ ] robots.txt configured
- [ ] sitemap.xml submitted to GSC
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] GDPR compliance (if applicable)
- [ ] Cookie consent implemented

**Performance**:
- [ ] Core Web Vitals optimized
- [ ] Lighthouse scores ≥ 85
- [ ] Bundle size analyzed
- [ ] Images optimized
- [ ] Caching configured

**SEO**:
- [ ] Google Search Console connected
- [ ] Bing Webmaster Tools connected
- [ ] Canonical tags verified
- [ ] Schema markup tested
- [ ] Keyword rankings tracked

---

## Repository Changes Summary

### New Files to Create

```
src/
├── lib/
│   ├── gtag.ts                    # GA4 utilities
│   ├── error-logger.ts            # Error tracking
│   ├── web-vitals.ts              # Core Web Vitals
│   └── seo/
│       └── meta-tags.ts           # Meta tag management
├── hooks/
│   └── useAnalytics.ts            # Analytics hook
└── components/
    ├── images/
    │   └── OptimizedImage.tsx     # Image optimization component
    └── CookieConsent.tsx          # Cookie banner

docs/
├── technical/
│   ├── GSC_AUDIT.md               # GSC audit findings
│   ├── PERFORMANCE_AUDIT.md       # Performance audit
│   ├── CACHING_STRATEGY.md        # Caching strategy
│   ├── RICH_RESULTS_REPORT.md     # Schema validation
│   └── KNOWLEDGE_GRAPH.md         # Knowledge graph map
├── guides/
│   ├── IMAGE_OPTIMIZATION.md      # Image optimization guide
│   ├── INTERNAL_LINKING.md        # Linking strategy
│   └── ANALYTICS_SETUP.md         # Analytics guide
├── research/
│   ├── KEYWORD_RESEARCH.md        # Keyword findings
│   ├── COMPETITOR_ANALYSIS.md     # Competitor analysis
│   └── CONTENT_GAPS.md            # Content gaps
└── PRIVACY_POLICY.md              # Privacy policy
```

### Files to Modify

1. **package.json**
   - Add `web-vitals` dependency
   - Optional: Add `@sentry/nextjs` for error tracking

2. **src/app/layout.tsx**
   - Add GA4 script
   - Add cookie consent component
   - Add analytics hook

3. **src/app/privacy/page.tsx**
   - Create privacy policy page

4. **public/_headers**
   - Review security headers
   - Optimize caching directives

5. **src/lib/seo/schema-generators.ts**
   - Add FAQ schema generator
   - Verify all existing schemas

6. **content/services/services.csv**
   - Add keyword-rich descriptions
   - Add use cases

7. **content/projects/projects.csv**
   - Enhance project descriptions
   - Add metrics/results

8. **content/faq/faq.csv**
   - Add keyword-targeted questions
   - Enhance answers

---

## Implementation Priority & Timeline

### Phase 1: Technical SEO (2-3 weeks)
**Start**: Week 1
**Effort**: 15-20 hours
**ROI**: High (foundation for all other phases)

### Phase 2: Performance (2-3 weeks)
**Start**: Week 3
**Effort**: 20-25 hours
**ROI**: High (affects ranking and UX)

### Phase 3: Content (3-4 weeks)
**Start**: Week 5
**Effort**: 25-30 hours
**ROI**: High (long-term organic traffic)

### Phase 4: Structured Data (1 week)
**Start**: Week 9
**Effort**: 5-8 hours
**ROI**: Medium (already 90% done)

### Phase 5: Analytics (2-3 weeks)
**Start**: Week 10
**Effort**: 15-20 hours
**ROI**: High (data-driven decisions)

**Total Timeline**: 10-14 weeks
**Total Effort**: 80-105 hours

---

## Success Metrics & Targets

### Phase 1: Technical SEO
- [ ] GSC shows 0 coverage errors
- [ ] All pages indexed
- [ ] No crawl errors
- [ ] Robots.txt configured
- [ ] Sitemap submitted

### Phase 2: Performance
- [ ] LCP < 2.5 seconds
- [ ] INP < 200ms
- [ ] CLS < 0.1
- [ ] Lighthouse Performance ≥ 85
- [ ] PageSpeed Insights ≥ 80

### Phase 3: Content
- [ ] 40+ target keywords identified
- [ ] 15+ keywords in top 10
- [ ] 5+ keywords in position 1-3
- [ ] 20% increase in organic traffic
- [ ] Content gap addressed

### Phase 4: Structured Data
- [ ] All schemas valid (0 errors)
- [ ] Rich results showing for services/projects
- [ ] AI assistants cite NS Engineering
- [ ] Knowledge graph complete

### Phase 5: Analytics
- [ ] GA4 properly tracking
- [ ] 10+ conversion events tracked
- [ ] Monthly dashboards created
- [ ] 2%+ conversion rate
- [ ] Bounce rate < 50%

---

## Monthly Review Checklist

### Every Month
- [ ] Monitor GA4 metrics
- [ ] Check GSC for new errors
- [ ] Analyze top performing pages
- [ ] Review bounce rate by page
- [ ] Check Core Web Vitals
- [ ] Verify all schemas still valid
- [ ] Monitor page rankings
- [ ] Review analytics trends
- [ ] Update documentation
- [ ] Plan optimizations for next month

### Every Quarter
- [ ] Comprehensive SEO audit
- [ ] Competitor analysis update
- [ ] Content gap re-analysis
- [ ] Performance review
- [ ] Analytics trend analysis
- [ ] Team training/updates

---

## Team Responsibilities

### Developer
- Implement all technical changes
- Set up analytics and error tracking
- Optimize images and performance
- Configure caching and headers
- Maintain documentation

### SEO/Marketing Manager
- Conduct keyword research
- Competitor analysis
- Content optimization
- Analytics monitoring
- Reporting

### Content Manager
- Update service descriptions
- Enhance project descriptions
- Add FAQ items
- Manage internal linking
- Review content quality

### Project Manager
- Track implementation progress
- Coordinate across teams
- Manage timelines
- Report to leadership

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| GA4 breaks website | High | Test thoroughly in staging |
| Performance regression | High | Measure before/after changes |
| Content spam penalties | High | Follow Google guidelines |
| Schema errors | Medium | Validate with tools before deploying |
| Privacy violations | High | Ensure GDPR compliance before launch |

---

## Questions & Notes

**For Review**:
1. Should we prioritize organic search (Phase 1-3) or analytics (Phase 5)?
2. Do we have budget for SEO tools (Semrush, Ahrefs)?
3. Who will manage ongoing optimization?
4. Should we set up CRM integration for leads?
5. Any specific keywords already tracking?

**To Discuss**:
- Timeline for each phase
- Team availability
- Budget constraints
- Specific business goals
- Competitor priorities

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-06-19 | Initial roadmap created |

---

## Related Documentation

- [CLAUDE.md](../CLAUDE.md) - Project context
- [PROJECT_PROGRESS.md](../PROJECT_PROGRESS.md) - Feature status
- [DEPLOYMENT.md](../DEPLOYMENT.md) - Deployment guide
- [README.md](../README.md) - Project overview

