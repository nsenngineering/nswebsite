# Claude's Understanding of NS Engineering Website Project

## Project Overview

I'm building a professional website for **NS Engineering & Geotechnical Services (NSEGS)**, a geotechnical and engineering services company based in Nepal. The company specializes in comprehensive testing and investigation services for construction projects.

## Company Profile (From Official Brochure)

### Official Name
**N.S. Engineering & Geotechnical Services Pvt. Ltd. (NSEGS)**

### Tagline
"Constantly Evolving, Foundation You Can Trust"

### Laboratory Name
**N.S.E.G.S Laboratory** - Strategically located in Lalitpur

### Certification
ISO 9001:2015 Certified Company

### Core Identity
Leading provider of geotechnical investigation, in-situ & laboratory testing services in Nepal. Founded with a commitment to quality, integrity, and scientific excellence.

### Complete Service Categories (From Brochure)

**PRIMARY SERVICES:**

1. **Field Investigations** (Rotary, Auger, Percussion Drilling)
   - Rotary Drilling (Capacity up to 700m)
   - Percussion Drilling
   - Auger Drilling
   - In-situ Vane Shear Test
   - Plate Load Test
   - Static Cone Penetration Test
   - Field Density Test
   - Core Cutting

2. **Pile Testing Services**
   - PDA (Pile Driving Analyzer) - High-strain dynamic testing
   - PIT (Pile Integrity Test) - Low-strain integrity testing
   - Static Load Testing - Direct load-settlement measurement
   - Cross-Hole Sonic Logging - Advanced integrity testing
   - Rebar Detection & Scanning

2. **Soil Laboratory Testing**
   - Compaction Tests (Proctor)
   - California Bearing Ratio (CBR)
   - Triaxial Shear Tests
   - Direct Shear Tests
   - Grain Size Analysis
   - Standard Penetration Test (SPT)
   - Field Vane Tests

3. **Rock Laboratory Testing**
   - Unconfined Compressive Strength (UCS)
   - Point Load Tests
   - Core Analysis

4. **Drilling & Field Investigation**
   - Rotary Core Drilling (up to 600m depth)
   - Borehole Logging
   - Permeability Tests
   - Sample Collection

5. **Geophysical Surveys**
   - MASW (Multi-channel Analysis of Surface Waves)
   - ERT (Electrical Resistivity Tomography)
   - Seismic Refraction Surveys

6. **Non-Destructive Testing (NDT)**
   - Concrete Integrity Testing
   - Rebar Detection
   - Structure Assessment

### Key Statistics (From Brochure)
- **Founded**: Company operational for 10+ years
- **Projects**: Extensive portfolio including KTFT Project, Budhi Gandaki HEP, numerous roads, bridges, tunnels, hydropower, and transmission line projects
- **Team Size**: 50+ team members including directors, engineers, geologists, laboratory technicians, field supervisors, and drillers
- **Laboratory**: Fully equipped state-of-the-art materials testing facility in Lalitpur
- **Drilling Capacity**: Up to 700m depth (Rotary Drilling)
- **International Collaboration**: Works with consulting firms from China, Japan, Germany, UK, France, Canada, Italy, Australia, India, Norway, Finland, Austria, Netherlands, USA, Malaysia, New Zealand

### Leadership
**Arun Kumar Pandit** - Managing Director
- MSc. in Geotechnical Engineering
- 19 Years experience in Geotechnical field & Civil Construction

### Core Team (Key Directors)
1. **Dhurba Raj Tirpathi** - Director (Bachelor in Civil Engineering, 28 Years Experience)
2. **Shrawan Kumar Thapa** - Director (MSc. in Transportation Engineering, 30 Years Experience)
3. **Madhav Pokhrel** - Director (MSc. in Disaster Risk Engineering and Management, 15 Years Experience)
4. **Arjun Adhikari** - Director (MSc. in Geotechnical Engineering, 20 Years Experience)
5. **Anand Gupta** - Engineer/Geotechnical (MSc. in Geotechnical Engineering, 18 Years Experience)
6. **Dr. Suman Panthi** - Geologist (PhD in Engineering Geology, 25+ Years Experience)

### Target Industries
- Road Construction
- Bridge Construction
- Hydropower Projects
- Building Construction
- Infrastructure Development

### Operating Areas
- Kathmandu Valley
- Central Nepal
- Eastern Nepal
- Western Nepal

## Website Requirements (From chat.md)

### Design Philosophy
- **Professional & Technical** - Engineering-focused aesthetic
- **Field-Oriented** - Real field operations imagery
- **Clean & Minimal** - Light backgrounds, strong typography
- **Blue/Teal Palette** - Engineering color scheme
- **Interactive** - Animations, modals, sliders to explain services

### Key Features Required

#### 1. Homepage
- Hero section with field operations imagery
- Message: "Nepal's Trusted Partner for Geotechnical, Pile Testing & Material Investigations"
- Interactive service cards (6 categories)
- Statistics: 10+ years, 100+ projects, 15+ equipment
- Featured projects section

#### 2. Services Section
- Interactive expandable cards for each service
- Modals with:
  - Technical diagrams (PDA signals, wave reflections)
  - Process steps
  - Equipment used
  - Typical deliverables
- Tab navigation for 6 service categories

#### 3. Projects Section
- Interactive timeline/gallery
- Filterable by:
  - Service type (pile testing, drilling, lab, geophysical)
  - Industry (roads, bridges, hydropower, buildings)
  - Year (2014 onwards)
- Project cards with: name, client, scope, photos, equipment, outcomes
- Case study modals with downloadable PDFs

#### 4. Equipment Section
- Equipment catalog with:
  - Photos
  - Technical specifications
  - Test capacity
  - Downloadable spec sheets
- Categories: Pile Testing, Drilling, Laboratory, Geophysical, Field Testing
- Carousel for each equipment
- "Request this equipment for a job" button

#### 5. About Us Section
- Company story (10+ years of experience)
- Team grid with photos and roles
- Areas of operation
- Industries served
- Accreditations/affiliations

#### 6. Contact/RFQ Page
- Multi-step form:
  1. Service type selection
  2. Project details (location, timeline)
  3. Contact information
  4. Document upload (BOQ, drawings, specs)
  5. Review and submit
- Google Map with office location
- WhatsApp button
- Email, phone, address

#### 7. Project Map Page
- Interactive Leaflet map centered on Nepal
- Custom markers color-coded by project type
- Click marker → project popup
- Filters by category
- Search/locate projects

#### 8. Knowledge Center (Blog)
- Case studies
- Testing guides
- Industry insights
- Best practices
- SEO focus: "geotechnical testing Nepal", "pile testing", etc.

### Optional Advanced Features (Phase 2/3)
- Equipment scheduling calendar
- Client dashboard/portal (login, file upload, progress tracking, reports, invoices)
- Instant quotation estimator
- Real-time equipment availability
- ERPNext integration for full ERP functionality

## Technical Implementation

### Tech Stack
- **Framework**: Next.js 14+ (App Router) with static export
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Animations**: Framer Motion
- **Maps**: React Leaflet
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **Deployment**: GitHub Pages (static) → Future: Vercel with backend

### Deployment Strategy
- **Phase 1 (Current)**: Static site on GitHub Pages
- **Phase 2**: Add interactive features, more content
- **Phase 3**: Backend integration with ERPNext, client portal

### Design System
**Colors**:
- Primary Blue: #1890ff (main brand color)
- Secondary Teal: #13c2c2 (accent color)
- Neutral grays for backgrounds and text

**Typography**:
- Headlines: Montserrat (bold, technical feel)
- Body: Inter (clean, readable)
- Code/Specs: JetBrains Mono

**Component Patterns**:
- Cards: White, soft shadow, rounded corners
- Buttons: Primary (solid blue), Secondary (outlined), Ghost
- Modals: Backdrop blur, slide-up animation
- Icons: 24px standard size, consistent stroke

### Visual Style Guidelines
- Use real field photos (NO stock photos)
- Show machines, instruments, technicians
- Project sites and lab equipment
- Thin-line technical illustrations for diagrams
- Ample whitespace, minimal clutter

## Current Progress

### Completed ✅
1. Project initialization with Next.js + TypeScript + Tailwind
2. Custom design system (blue/teal palette, fonts)
3. Core UI components (Button, Card, Modal, Input)
4. Animation wrappers (FadeIn, SlideIn, ScaleIn)
5. Layout components (Header with navigation, Footer)
6. Homepage (Hero section + 6 service cards)
7. Services data (20+ services documented)
8. TypeScript interfaces for all data structures
9. GitHub Actions deployment workflow
10. Build tested and passing ✅

### To Do 📋
1. **Immediate**: Read compressed_brochure.pdf to understand actual company details
2. **Week 1 Remaining**: Services page, About page
3. **Week 2**: Projects page, Equipment catalog, Contact form
4. **Week 3**: Project map, Blog, SEO, Performance optimization, Launch

## Key Insights

### What Makes This Project Unique
1. **Technical Audience** - Engineers, project managers, contractors
2. **Trust & Credibility** - Projects and equipment showcase are critical
3. **Educational Value** - Many clients may not understand testing methods
4. **Nepal Context** - Local expertise in challenging terrain/seismic zones
5. **Real Evidence** - Field photos and project data build trust

### Critical Success Factors
1. **Visual Proof** - Show actual equipment and project sites
2. **Technical Accuracy** - Service descriptions must be precise
3. **Easy Navigation** - Engineers need quick access to info
4. **Mobile Friendly** - Site visits often checked on mobile
5. **Fast Loading** - Performance matters in Nepal's internet conditions

### Content Priorities
1. Real project photos from the field
2. Equipment specifications and capabilities
3. Completed project portfolio with client names
4. Team credentials and expertise
5. Contact information prominently displayed

## Company Information (VERIFIED FROM BROCHURE)

### Contact Details
- **Phone**: +977-01-5260121, +977-9851228995
- **Email**: info@nsengineering.com.np
- **Website**: www.nsengineering.com.np
- **Address**: Bishal Niwash, 4th Cross, Jwagal, Lalitpur, Nepal

### Branding
- **Primary Color**: Purple (as seen in brochure)
- **Secondary Colors**: Yellow accents for highlights
- **Logo**: Purple "NS" icon with company name
- **Certification Badge**: ISO 9001:2015

### Major Clients (From Brochure - Page 19)
**International:**
- ELC Electroconsult (multiple projects)
- PowerChina
- SMEC
- Hazama Ando Corporation
- FSDI-XIAN (China Railway Consultancy & Supervision)
- CGCC (China State Construction)
- Poly Changda
- China Railway Group Limited
- China CAMC Engineering Co., Ltd.
- China Civil Engineering Construction Corporation

**National (Nepal):**
- NEA Engineering Company Ltd.
- Vidhyut Utpadan Company Limited
- Tundi Group
- SDLQ
- Hanuman Construction
- Meinhardt
- BNJS Pvt. Ltd.
- Jade Infra
- KSNS (Kumar Shrestha Nirman Sewa)
- Roshan Construction Pvt. Ltd.
- Anco
- Multipath Darshan
- A1 Builders
- Motidan Construction Sewa P. Ltd.

**Government/Institutions:**
- Department of Road Maintenance
- TBEA Co. Ltd.
- Jade Consult
- WEG-RCC JV
- CREGC-COVEC JV
- Molidan Construction Sewa Pvt. Ltd.
- XCGC-Hanuman Baniya JV

### Major Projects (Summary from Brochure)

**PILE TESTING (6 Major Projects Documented):**
1. KTFT Project (Fast Track) - Kumar-Roshan-Sichuwan JV - 50 nos PDA, 17 nos Lateral Load, 16 nos Cross Hole Test
2. SAEC Mugling-Pokhara Highway Phase-I - ANK-ZIEC JV - 7 nos PDA
3. Kanchanpur-Kamala Road - China Railway No.2 Engineering - 42 nos PDA, 370 nos PIT, 49 nos Static Load
4. KTFT Package-07 - Xingrun-Ashish-Tundi JV - 160 nos PIT, 2 nos PDA, 10 nos Lateral Load, 60 nos Cross Hole, 2 nos Pile Pull Out, 2 nos Plate Load, 6 nos Anchorage Vertical Load, 4 nos Rebar Pull Out
5. Mahendra Highway Upgrade - WEG-RCC JV - 156 nos PIT, 6 nos PDA, 5 nos Anchorage Load
6. Double Lane Dual Carriageway Expressway - Xingrun-Ashish-Tundi JV - 183 nos PIT, 2 nos PDA, 15 nos Lateral Load, 93 nos Cross Hole, 3 nos Pile Pull Out, 11 nos Plate Load, 12 nos Anchorage Load, 4 nos Rebar Pull Out

**TUNNEL & ROAD PROJECTS (5 Major Projects):**
1. KTFT Mahadevtar Tunnel - Henan Communication & Planning Design Institute - Drilling up to 320m, Rock sample testing, Magnetolluric Survey (depth up to 800m)
2. 5 Road Tunnels Study (Kulekhani-Bhimphedi, Banepa-Sindhuli Sadak, Pokhara-Baglung, Lamjung-Besisahar, Butwal-Narayanghat) - Department of Road Maintenance - 2D ERT, Geological Study, Seismic hazard analysis
3. KTFT CP10 - CREGC-COVEC JV - Rotary drilling, ERT, SRT, MAM, MT, Geological & Engineering Survey, Detailed Slope Investigation, Hydrological Survey
4. KTFT CP8B - Molidan Construction Sewa - Rotary Drilling, SRT, Geological Survey, Hydrological Study, Seismic Safety analysis
5. KTFT CP9B - XCGC-Hanuman Baniya JV - Rotary drilling, ERT, SRT, MAM, MT, Geological Survey, Slope Investigation

**HYDROPOWER PROJECTS (9 Major Projects):**
1. Upper Trishuli HEP - Power Construction Corporation of China - Vertical, Inclined, Horizontal drilling, Rock sample testing
2. Nalgad Hydropower (284m drilling) - SMEC-MWH JV - Drilling, In-situ Direct Shear (4 nos), Plate Jacking (9 nos), Pizeometer installation, Rock sample testing
3. Lower Solu HEP - Aera Consultant - Drilling, Rock sample testing
4. Upper Bheri HEP 325 MW - Integrated Mobility Solutions - ERT, SRT, MASW
5. Mewa Khola HEP 50 MW - Mewa Developers Ltd. - Core drilling, Field test, Lab testing, liquefaction, bearing capacity
6. Bhotekoshi 1 Hydropower - Electropower Company Limited - Vertically upward drilling
7. Upper Arun HEP - NEA Engineering Company - Block Shear Test, Plate jacking, Dialometer
8. Super Trishuli HEP (100 MW) Chumlingtar - CE Construction - Direct Shear Test
9. Upper Tamor A Hydropower - Union Hydropowern Ltd - Geotechnical Investigation

**TRANSMISSION LINE (5 Major Projects):**
1. Amlekhgunj 132/66/11KV Substation - TBEA Co. Ltd. - Detailed Geotechnical Investigation
2. Kohalpur-Surkhet-Upper Karnali 400KV & Kohalpur-New Butwal 400KV - ELC Electroconsult SPA - Detailed Geotechnical Investigation
3. Different substation and transmission lines (SS9 Anarmani, SS4 Tingla, TL3) - ELC Electroconsult SPA - Detailed Geotechnical Investigation
4. TL1, Inaruwa-Arun Hub, SS3, SS1-Arun Hub transmission lines - ELC Electroconsult SPA - Detailed Geotechnical Investigation
5. Karmadev-Phukot 400 kV Double Circuit Karnali Corridor - Jade Consult - Detailed Soil investigation

**NDT PROJECTS (7 Major Projects):**
1. France Embassy, Lazimpath - Miyamoto International Nepal - Re-bar Scanning, Push Shear Test, Schmidt Hammer
2. Sanepa Apartment, Lalitpur - Miyamoto International Nepal - Rebound Hammer, Rebar Scan, Core Cut, UPVT, Equi-potential test
3. Park View Horizon - Park View Horizon - Ultrasonic Pulse Velocity test
4. Gopichandra mahabihar, Lalitpur - Prakritik Sanu Suwal JV - Flat Jack test
5. Skyone Tower, Naxal - Skyline Developers - Rebound Hammer, Rebar Scan, UPVT
6. Lalbakaiya River Bridge (28 nos. of piles) - Road Division, Chandranigahapur - Schmidt Hammer, Ultrasonic Pulse Velocity, Rebar Scanning, MASW
7. DIO (NEPAL) BRITISH GURKHAS - Miyamoto International Nepal - Rebar Scanning, Schmidt Rebound Hammer, Core Cutting, UCS

## Implementation Complete ✅

### Interactive Project Map with File-Based CMS + Photo Gallery System

**Completed Features:**

1. **CSV-Based Content Management System**
   - Excel-editable `projects.csv` file
   - Automated CSV → JSON build pipeline
   - Data validation (coordinates, categories, required fields)
   - Media file validation and copying
   - Clear error messages for easy troubleshooting

2. **Interactive Leaflet Map**
   - 32 projects displayed with GPS coordinates
   - Marker clustering for better visualization
   - Category-colored markers (purple palette)
   - Interactive tooltips and popups
   - **NEW:** Image previews in map popups
   - Click marker → scroll to project card
   - Hover card → highlight marker
   - Mobile-optimized (300px-500px responsive heights)
   - Custom zoom controls and touch support

3. **Enhanced Projects Page**
   - Fixed map section at top (shows all projects)
   - Filterable/searchable project list below
   - **NEW:** Project cards with hero image thumbnails
   - **NEW:** Camera badge showing photo count
   - **NEW:** Click card to open modal with photo carousel
   - Category legend with color codes
   - Dynamic statistics (32 projects, 23 clients, 5 years)
   - Bidirectional highlighting (map ↔ list)
   - Professional loading states

4. **Project Photo Gallery System (Phase 6)**
   - **Image Carousel Component:**
     - Embla Carousel with thumbnail navigation
     - Previous/Next arrow buttons
     - Image counter display ("3 / 12")
     - Keyboard navigation (arrow keys)
     - Touch/swipe support on mobile
     - Loading skeletons and error handling

   - **Project Modal:**
     - Full-screen modal with photo carousel
     - Two-column layout (desktop): 60% carousel / 40% details
     - Single-column layout (mobile): stacked
     - Complete project metadata
     - Scrollable scope of work list
     - PDF downloads section

   - **Homepage Featured Projects:**
     - Horizontal scroll carousel
     - Large hero images (400px height)
     - Category badge and photo count overlay
     - Click to open modal
     - Shows projects with `featured: true`

   - **Image Integration:**
     - Hero images on project cards
     - Image previews in map popups
     - Graceful fallbacks with SVG placeholders
     - Lazy loading for performance

5. **Comprehensive Documentation**
   - [Content Management Guide](./docs/content-management.md) - For editing CSV
   - [Adding Projects Guide](./docs/adding-projects.md) - Step-by-step instructions
   - [GPS Coordinates Guide](./docs/gps-coordinates.md) - Finding coordinates
   - [Project Progress](./PROJECT_PROGRESS.md) - Full status tracking

**Technical Stack:**
- Next.js 16 (App Router) with static export
- TypeScript (100% typed)
- Tailwind CSS v4
- Framer Motion (animations)
- Leaflet + React-Leaflet + clustering
- **NEW:** Embla Carousel (image carousel)
- CSV-based content management

**Build Commands:**
```bash
npm run build:content  # Parse CSV, validate, copy media
npm run dev            # Start development server
npm run build          # Production build
```

**File Structure:**
```
content/projects/projects.csv           # Master data (edit in Excel)
scripts/build-content.ts                 # Build orchestrator
src/data/generated/projects.json        # Auto-generated
src/components/map/ProjectMap.tsx       # Interactive map
src/components/ui/ImageCarousel.tsx     # Photo carousel component
src/components/projects/ProjectCard.tsx # Enhanced project cards
src/components/projects/ProjectModal.tsx # Modal with carousel
src/components/home/FeaturedProjects.tsx # Homepage featured section
src/app/projects/page.tsx                # Projects page with map & modal
src/app/page.tsx                         # Homepage with featured projects
docs/                                    # User documentation
```

**Current Status:**
- ✅ All core features implemented (Phases 1-6 complete)
- ✅ Project photo gallery system complete
- ✅ Image carousel with modal functionality working
- ✅ Featured projects section on homepage
- ✅ 32 projects with random GPS (ready for real coordinates)
- ✅ Photo infrastructure ready for image upload
- ✅ Documentation complete
- ✅ Mobile optimized and tested
- ⏳ Awaiting real project images and GPS coordinates
- ⏳ Ready for content population

**How Photo System Works:**
1. Add images to `content/projects/{project-id}/images/` folder
2. Update CSV with image filenames: `"hero.jpg;site-1.jpg;site-2.jpg"`
3. Mark featured projects: Set `featured` column to `true`
4. Run `npm run build:content` to process images
5. Images appear on cards, in carousel, on homepage

**Next Steps:**
1. Gather real GPS coordinates for 32 projects
2. Collect 2-5 photos per project
3. Organize photos into project folders
4. Update CSV with real coordinates and image filenames
5. Mark 4-6 projects as featured
6. Test with real content
7. Deploy to production

---

## Build System Architecture

For detailed technical documentation on how the image build pipeline works, see:
**[Build Pipeline Documentation](/.claude/plans/spicy-whistling-dove.md)**

The build system uses a **5-stage automated pipeline** (Source → Parse → Validate → Copy → Runtime) that:
- Auto-detects images from filesystem (no manual configuration needed)
- Validates all media files before building
- Copies assets to public folder for serving
- Generates TypeScript-compatible JSON for components
- Provides graceful fallbacks for missing images

This architecture is **extensible** and can be replicated for other content types (team members, equipment, services) following the same pattern.

---

**Last Updated**: 2025-12-09
**Status**: Phase 1-6 Complete - Map & Photo Gallery System Ready
**Next Step**: Populate with Real GPS Coordinates & Project Images
