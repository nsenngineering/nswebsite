# SEO Fundamentals & AI Search Optimization — Internship Project Guide

**Project**: NS Engineering Website — technical SEO, classic search ranking, and AI/generative-search visibility
**Intern**: Ritika Kunwar
**Mentor**: Shobhit Tripathi
**Branch**: TBD (fork from `develop` — e.g. `feature/ritika-goal6-seo`)
**Started**: TBD

**Currency note**: this module was fact-checked against 2026's actual SEO landscape twice — once for headline currency, once (2026-07-26) with deep, sourced research into every specific tool/portal this doc sends you to, not just the general trends. A few things changed recently enough that older SEO advice will actively mislead you: Google retired FAQ rich results on 2026-05-07 (and pulled Rich Results Test support for it in June 2026), Google core updates now land roughly every 3 months instead of twice a year, and Google made manipulating AI Overviews/AI Mode (buying or faking citations) an explicit spam violation on 2026-05-15. Wherever this doc cites a specific stat or policy, treat it as true as of when this was written — re-verify anything load-bearing before you rely on it, especially in Goals 2, 5, and 6. That re-verification habit is itself part of what this module is teaching — see the **Portal Reference** section for which claims below trace to an official source vs. an industry estimate.

---

## How to Use This Document

Same contract as the Cloudflare Migration and State Management guides: every goal has a **Completion Goal** (the concrete deliverable), **Checkpoint Concepts** (what the goal is actually teaching), and **Questions to Answer** (write these down before moving on — they're what your mentor checks). Check in with your mentor at the end of each goal.

Where a goal says "paired," SEO or the underlying code touches something either genuinely new to you or production-sensitive (analytics, live schema, public-facing meta tags) — your mentor works through it with you first. Where it says "alone," it's the same pattern applied a second or third time and you're expected to run it without help.

**What this module is actually about.** Every goal below produces some artifact — a meta tag, a keyword list, a schema fix — but the API is the vehicle, not the destination, same as last time. The real subject here is **how machines decide what's true and relevant enough to surface** — whether that machine is Google's crawler, Google's ranking algorithm, or an LLM answering "who does pile testing in Nepal?" Those machines don't read a page the way a person does. They read *signals*: structured data, canonical URLs, load speed, citation patterns, and how clearly a page answers a specific question. Learn to think in signals, not in "does it look nice," and the specific tool (Google, Bing, ChatGPT, Perplexity, whatever comes next) stops mattering.

**Why this project is real, not an exercise.** NS Engineering's SEO work isn't hypothetical — it's a live, prioritized initiative. There's already a working technical foundation (structured data for 5 entity types, a generated sitemap, per-page metadata) sitting at `docs/SEO_OPTIMIZATION_ROADMAP.md`, written 2026-06-19. Three of its five phases are still near zero: no keyword research has ever been done, there is no analytics installed at all (not even GA4), and nobody has ever actually queried an AI assistant to check whether it can find NS Engineering. Your goals below map directly onto those real, currently-empty gaps — the deliverables you produce aren't practice files, they're the actual first pass at closing them.

---

## Checkpoint Summary

| Goal | Deliverable | Mentor Review |
|------|-------------|:---:|
| 0 | Written Q&A on the existing SEO code + roadmap | Required |
| 1 | Technical SEO audit of 5 real pages, logged findings | Required |
| 2 | Structured data validated (schema.org Validator + Rich Results Test) + fixes if any | Required |
| 3 | Real keyword research doc, 15+ keywords mapped to real pages | Paired kickoff, then alone |
| 4 | Core Web Vitals measured on 5 real pages, written diagnosis | Required |
| 5 | Google Business Profile audit + setup proposal (`docs/local/GBP_SETUP.md`) | Paired (public-facing, production-sensitive) |
| 6 | AI-answer query log (5 surfaces incl. Google AI Overviews/AI Mode) + citability audit + gap analysis | Paired kickoff, then alone |
| 7 | GA4 installed + 3 key events defined | Paired (production-sensitive) |
| 8 | Updated `SEO_OPTIMIZATION_ROADMAP.md` + presented findings | Required |

---

## Skills Check

Update honestly after each goal — this is for you, not a performance review.

| Skill | Not started | Learning | Comfortable | Can teach |
|---|---|---|---|---|
| Explaining what makes a page crawlable vs. indexable |  |  |  |  |
| Reading and writing `robots.txt` / `sitemap.xml` directives |  |  |  |  |
| Auditing meta title/description for length + intent |  |  |  |  |
| Reading and validating JSON-LD structured data |  |  |  |  |
| Explaining why schema.org data matters beyond rich snippets |  |  |  |  |
| Doing real keyword research (volume, intent, difficulty) |  |  |  |  |
| Mapping keywords to specific pages without keyword-stuffing |  |  |  |  |
| Reading Core Web Vitals and tying them to ranking impact |  |  |  |  |
| Explaining E-E-A-T and how it's actually assessed |  |  |  |  |
| Explaining how AI answer engines retrieve and cite sources |  |  |  |  |
| Setting up and maintaining a Google Business Profile |  |  |  |  |
| Setting up GA4 events without over-instrumenting |  |  |  |  |
| Knowing which portal to check for which question (not guessing) |  |  |  |  |
| Turning an audit into a prioritized, honest action plan |  |  |  |  |

---

## Weekly Check-In

One question per week, maximum. Think before you write it — consolidate first, don't drip-feed confusion as it happens.

| Week | Currently on | Blocked on | My one question |
|---|---|---|---|
| | | | |

---

## Vocabulary Reference (framework-agnostic — this is the point)

SEO concepts don't belong to Next.js, or even to Google. Every search or retrieval system — Google, Bing, a future AI search product, even your own site's internal search — solves the same handful of problems. Learn the concept; the tool that implements it will keep changing under you.

| Concept | What it means | Where you'll see it here | Elsewhere |
|---|---|---|---|
| Crawlability | Can a bot even reach and read this page | `robots.txt`, internal links, `sitemap.xml` | Identical concept for Bingbot, GPTBot, any crawler |
| Indexability | Crawled ≠ indexed — the engine can choose not to store it | `<meta name="robots">`, canonical tags | Same distinction in every search engine's own docs |
| Canonical URL | The one "official" URL when several could show the same content | `link[rel=canonical]` via `metadata-helpers.ts` | Universal — prevents duplicate-content penalties anywhere |
| Structured data / JSON-LD | Machine-readable facts about a page, separate from the prose | `src/components/seo/*.tsx` schema components | schema.org vocabulary is engine-agnostic by design |
| Knowledge graph | Entities (people, orgs, services) linked to each other, not just keywords | Organization ↔ Person ↔ Service ↔ Project links in schema data | Google's Knowledge Graph, Bing's Satori, any entity-based retrieval |
| Core Web Vitals | Three measured UX signals Google uses as a ranking factor | LCP, INP, CLS — measured via PageSpeed Insights / Lighthouse | The specific three metrics are Google's; "speed and stability affect ranking" is universal |
| E-E-A-T | Experience, Expertise, Authoritativeness, Trust — how search assesses content quality | Team/credential pages, `Person` schema, certifications | The acronym is Google's; the underlying trust signal is what every retrieval system, including LLMs, is approximating |
| Search intent | What the searcher actually wants (informational vs. transactional vs. navigational) | Keyword mapping in Goal 3 | Universal — mismatched intent is the #1 reason a ranked page still doesn't convert |
| Backlink / citation | Another site linking to (or an AI citing) yours as a source | Not yet built for this site — a real gap | Classic SEO calls it a backlink; AI answer engines call it a citation — same trust mechanism |
| Retrieval-augmented answer | An AI assistant pulling live/indexed content to ground its answer instead of guessing from training data | What you'll test directly in Goal 6 | ChatGPT search, Perplexity, Google AI Overviews/AI Mode, Claude with search — different products, same mechanism |
| GEO (Generative Engine Optimization) | Optimizing content to be *cited* inside an AI-generated answer, not just ranked as a link | Goal 6's whole focus | Measured by citation frequency/AI mention share, not clicks — a genuinely different success metric from classic SEO |
| llms.txt | A proposed, robots.txt-like file telling AI crawlers what a site considers its citable content | Doesn't exist on this site — evaluate, don't assume you should build it | Still not an official standard as of 2026; independent measurement found major AI crawlers (GPTBot, ClaudeBot, PerplexityBot) fetch it in well under 1% of their visits. Worth understanding, low priority to implement until adoption changes |
| AI Overviews vs. AI Mode | Google's own two AI-answer surfaces: AI Overviews is the summary box inside normal search results; AI Mode is a full Gemini-powered conversational search experience | You'll query both directly in Goal 6 | Both are Google surfaces, not third-party tools — Google has confirmed AI Mode uses structured data to verify claims and assess source credibility, which is why Goal 2's schema work feeds directly into Goal 6 |
| Ranking-factor "weight" claims | Specific percentages ("backlinks are 13% of the algorithm") that circulate in SEO blog posts | Referenced with caution throughout this doc | Google has never published exact ranking-factor weights — these numbers are industry estimates, not Google statements. Treat them as directional, not precise, and say so when you cite one |
| NAP consistency | Name, Address, Phone — the same three facts, written identically everywhere they appear (website footer, GBP, directories) | Goal 5's GBP setup — must match the site footer exactly | Universal local-SEO concept; inconsistent NAP across sources is a well-established trust/ranking penalty for any local business, in any country |
| Field data vs. lab data | Field = real visitor measurements (CrUX); lab = one simulated test run (Lighthouse) | Goal 4 — CrUX likely has no per-page data for this site, so Lighthouse becomes the primary usable signal | The same distinction exists in performance engineering generally — synthetic benchmarks vs. production telemetry |
| Key event | GA4's current term for what used to be called a "conversion" | Goal 7's 3 key events (form submit, phone click, quote CTA) | Same underlying concept as "conversion" or "goal" in any analytics tool — Google just renamed the label |
| Per-bot crawler directives | `robots.txt` rules addressed to a specific crawler's own user-agent string (e.g. `User-agent: OAI-SearchBot`) rather than the wildcard `User-agent: *` | Goal 0 Q6, Goal 6 | Each AI company runs multiple, differently-named bots for different purposes (training vs. live citation vs. user-triggered fetch) — treating them as one thing is a common, consequential mistake |
| IndexNow | An open protocol for instantly telling a search engine "this URL changed" instead of waiting for its next crawl | Not implemented on this site — worth a low-effort evaluation | Supported by Bing, Yandex, Naver, Seznam, and Yep. **Not supported by Google**, which has confirmed no plans to adopt it — don't conflate "I pinged IndexNow" with "Google will index this faster" |

---

## Notes Space

**Open questions:**

**Decisions made:**

**Blockers:**

---

## The Big Picture

### Where We Are Today

*(Verified live against the repo and its docs — not copied from memory. Some of this is a month-old audit; re-verify anything you rely on.)*

```
Technical foundation (real, shipped, verified in code):
  src/lib/seo/metadata-helpers.ts   → per-page title/description/canonical/OG/Twitter
  src/lib/seo/schema-generators.ts  → JSON-LD generators
  src/components/seo/*.tsx          → Organization, Person, Service (x17), Project (x49),
                                       FAQPage, LocalBusiness schema components
  public/sitemap.xml                → 124 URLs, generated by scripts/generate-sitemap.ts
  public/robots.txt                 → allows all crawlers, points to sitemap, has crawl-delay
  docs/SEO_OPTIMIZATION_ROADMAP.md  → the master plan, 5 phases, dated 2026-06-19

What's claimed but not code-verified:
  Google Search Console + Bing Webmaster Tools — reported verified by your mentor directly,
  but src/app/layout.tsx's `verification` metadata block is still a commented-out
  placeholder ("Add when available"). Either verification happened by a non-meta-tag
  method (DNS TXT, HTML file upload — both fine), or the code was never wired up to
  match. Goal 0 asks you to find out which.

What's genuinely near-zero (confirmed by absence, not by the roadmap's own %):
  - Zero keyword research has ever been done — no file in docs/research/ addresses it
  - Zero competitor analysis exists
  - Zero analytics: no GA4, no gtag, no web-vitals package — package.json has none of it
  - Nobody has tested whether an AI assistant can actually find or cite NS Engineering
  - No confirmed Google Business Profile — nobody has checked whether one exists at all,
    which means NS Engineering may currently be architecturally absent from the Google
    Maps "local pack" for searches like "geotechnical testing Nepal." Goal 5 checks this
    first, before assuming either way.
  - Bing Webmaster Tools status is genuinely unknown, not just unverified in code — Bing
    offers a one-click "import from Google Search Console" verification path that leaves
    zero trace in the codebase (no meta tag, no DNS record), so "we didn't find evidence
    of it" doesn't mean "it wasn't done." Only logging into bing.com/webmasters directly
    settles it.
```

The honest summary: the *machine-readable plumbing* (schema, sitemap, meta tags) is in solid shape. Everything that requires a human to go look at the real world — what people actually search for, who's beating NS Engineering in results, whether ChatGPT has heard of NS Engineering at all — has not been touched yet. That's exactly the gap this module closes.

### Where We Are Going

Two goals, both explicitly named priorities, and they're more related than they look:

1. **Better classical Google ranking** — showing up higher for real searches like "geotechnical testing Nepal" or "pile foundation testing," which needs real keyword research, content aligned to search intent, and measured performance — none of which exist yet.
2. **Better AI search / "AI SEO" visibility** — being the source ChatGPT, Perplexity, Claude, *and Google's own AI Overviews and AI Mode* actually cite when someone asks "who does pile testing in Nepal." This is a newer discipline (often called GEO — Generative Engine Optimization) but it leans on the *same* technical foundation: a site an AI's retrieval system can't crawl, can't parse into clear entities, or can't find cited anywhere else, is invisible to it for the same underlying reasons it'd be invisible to Google. The structured data already built here (Person, Service, Organization schemas) isn't just for Google's rich snippets — it's exactly the kind of clean, entity-shaped data retrieval systems prefer over prose, and Google has confirmed AI Mode specifically uses schema to verify claims and assess credibility. You're not starting two unrelated projects; you're building on the same foundation from two directions. One sobering reason not to assume success in one guarantees the other: independent research in 2026 found the overlap between top-10 Google organic results and the sources AI answer engines actually cite has fallen from roughly 70% to under 20%. Ranking well is no longer good evidence you're being cited — Goal 6 has to be tested directly, not inferred.

Both directions are also moving targets now, not one-time projects. Google shipped roughly one core algorithm update every 3 months through 2026 (versus the historical twice-a-year cadence), and its Helpful Content System has been folded permanently into core updates rather than shipping as its own separate update. An audit done once and never revisited will drift out of date faster than it used to.

There's a third, more concrete lever sitting between these two that's easy to miss: **Google Business Profile.** It's not a third project — it's a ranking input for classical local search (multiple 2026 studies put GBP signals at roughly a third of local-pack ranking weight) *and* Google has confirmed its AI Overviews and AI Mode ground local-intent answers directly in Maps/GBP data. A complete, accurate, active GBP listing is one of the few things in this whole module that plausibly moves classical Google ranking and Google's own AI answers at the same time, through the same mechanism — which is exactly why it gets its own goal (Goal 5) instead of being folded into either the technical audit or the AI-visibility testing.

---

## Portal Reference — What Each Tool Is, and Why

Read this section once, straight through, before Goal 0. Then treat it as reference material — come back to the relevant portal when a goal sends you to it. Every goal from here on assumes you've read this once.

**A note on sourcing, because it matters more in SEO than in most fields.** No search engine or AI company publishes its full ranking/citation algorithm. Some facts below come straight from a platform's own documentation (stated plainly). Others are the SEO industry's best reverse-engineered estimate — flagged explicitly as "industry-estimated" or "not officially confirmed." Confusing the two is the single most common way SEO advice goes stale or wrong. When you write anything in your own deliverables, keep that distinction visible instead of flattening everything into "the algorithm does X."

### Cluster A — Search Engine Consoles

**Google Search Console (GSC)** — [search.google.com/search-console](https://search.google.com/search-console)
*What it is:* Google's free window into how it sees your site — indexing status, real search performance (queries, clicks, impressions, position), and technical health. It is not visitor analytics (that's GA4); it's Google's own diagnostic report card for your site.
*Why SEO:* Almost every classical-SEO decision traces back to it. You can't know if a page is actually indexed (vs. crawled-but-excluded) without the Page Indexing report, and you can't know if keyword work is paying off without the Performance report.
*Why AI SEO:* Historically zero — but Google shipped a dedicated **Generative AI performance report** in June 2026 (Performance → a "Generative AI" tab), showing impressions in AI Overviews/AI Mode/Discover, broken out by page/country/device. It's in **phased rollout**, not guaranteed on every property, and currently shows impressions only — no clicks. Check whether this property has access to it; don't assume either way.
*Setup:* Two property types with different verification. **Domain property** (covers all subdomains/protocols) — DNS TXT record only, no alternative. **URL-prefix property** — five methods: HTML file upload, HTML meta tag, existing GA4 property, existing GTM container, or DNS. For a Next.js static export, the meta-tag method is `metadata.verification` in `layout.tsx` — if that field is empty or commented out, **no tag ships in the built HTML at all**, full stop, regardless of what anyone remembers doing.
*Key reports:* Page Indexing, Performance, URL Inspection (live single-URL test), Core Web Vitals (pulls from CrUX — see Cluster D), Sitemaps, Manual Actions (human-reviewed penalties), Security Issues, Links.
*Pitfall:* Verifying via HTML file upload, then migrating hosts (e.g., to Cloudflare Pages) without re-uploading that file — verification silently breaks on Google's next re-check.
*Gap-check:* View production page source and search for `google-site-verification` in `<head>`. Separately run `dig TXT <domain>` and look for a `google-site-verification=` record. The two checks are independent — either one alone proves verification; neither proves the *other* method wasn't also used.

**Bing Webmaster Tools** — [bing.com/webmasters](https://www.bing.com/webmasters)
*What it is:* Microsoft's equivalent of GSC. Matters beyond Bing.com itself because Bing's index also powers Yahoo Search, part of DuckDuckGo, and — critically — **Microsoft Copilot**.
*Why SEO:* Bing indexing failures are invisible to GSC entirely — checking only Google tells you nothing about Bing. Its Backlinks tool is also useful as a general, engine-agnostic link-profile check.
*Why AI SEO:* Bing punches above its market-share weight here. Copilot's grounded answers draw from the Bing index, and OpenAI has historically used Bing's search API for parts of ChatGPT's web-browsing grounding — so for Bing specifically, classical indexing health and AI-assistant visibility are close to the *same* problem, unlike GSC where they're mostly separate.
*Setup:* XML file upload, HTML meta tag, DNS CNAME, or — the one worth knowing about — **one-click import from an existing verified GSC property**. That import path verifies matching sites automatically and leaves **zero trace in the codebase** (no meta tag, no Bing-specific DNS record). This directly matters here: a code search finding nothing does not mean Bing verification wasn't done.
*Key reports:* Site Explorer (crawl/index view, six months of clicks/impressions), Backlinks, SEO Reports (on-page diagnostics), Search Performance, Sitemaps, and an **IndexNow report**.
*IndexNow — real but Google doesn't participate:* An open, free protocol for instantly pushing changed URLs instead of waiting for a crawl. Actively supported by **Bing, Yandex, Naver, Seznam, and Yep**. **Google does not support it and has confirmed no plans to** — worth implementing to speed up Bing/Copilot discovery, but it will do nothing for Google, and treating it as a Google-speedup trick is a real, common mistake.
*Gap-check:* View source for `msvalidate.01` in `<head>`; log into bing.com/webmasters directly and check Settings for the verification method actually on record — this is the only fully authoritative source, since the GSC-import path leaves nothing else to search for.

### Cluster B — Analytics & Local Presence

**Google Analytics 4 (GA4)**
*What it is:* Google's free visitor-analytics platform. Event-based (page_view, scroll, click, form_submit are all "events"), and you designate which events count as meaningful business outcomes — GA4's current term for these is **"key events"** (renamed from "conversions").
*Why SEO:* GA4 doesn't feed Google's ranking algorithm — its value is diagnostic: which organic-search landing pages get traffic but don't convert, which pages have weak engagement, and, right now, whether any of this module's work is producing business outcomes at all. Currently zero visibility exists.
*Why AI SEO:* A real, current (2025–2026) development: GA4's default channel grouping now buckets traffic from AI assistants (ChatGPT, Gemini, Claude, Perplexity) separately — sometimes labeled "AI Assistants" or "Organic AI" — instead of miscategorizing it as Referral or Direct. This is one of the few concrete ways to measure whether Goal 6's GEO work is actually producing traffic, not just citations. See Goal 6 Question 5.
*Setup:* Create a property + Web data stream → get a Measurement ID (`G-XXXXXXXXXX`). For a static-export Next.js site, install client-side only (no server-side tagging option without a backend) — the standard route is `@next/third-parties/google`'s `<GoogleAnalytics>` component in the root layout, or via GTM (below). **Consent Mode v2** (four signals: `ad_storage`, `analytics_storage`, `ad_user_data`, `ad_personalization`) is mandatory for EEA/UK visitors since March 2024 — even for a domestic-looking B2B site, worth confirming there's no EU traffic before skipping it.
*Key data:* Traffic Acquisition (which channels bring visitors), Engagement rate, and Key Events cross-tabbed against Landing Page and Channel.
*Pitfall:* Ad blockers (used by a meaningful share of any audience) block gtag.js network calls outright — client-side GA4 always undercounts to some degree; verify real firing via Realtime/DebugView rather than trusting the dashboard blindly on day one.

**Google Tag Manager (GTM)**
*What it is:* A free container that sits between the site and every tracking script (GA4, future ad pixels, call-tracking), so new tags/triggers get added from a web dashboard instead of a code deploy.
*Why it matters:* Not a ranking signal itself — it's plumbing. Its value is operational: it's what lets someone add a new tracking event later *without* filing a dev ticket, which matters specifically for a small team where an intern is doing ongoing SEO work.
*When to use it vs. raw gtag.js:* For one tag (GA4 alone), raw gtag.js is simpler. GTM earns its keep once there's more than one tag, or once someone non-technical needs to add events. Most current guidance defaults to GTM even for small sites for exactly that maintainability reason — worth deciding deliberately in Goal 7, not defaulting to whichever is more familiar.
*Pitfall:* The single most common real-world failure is validating a tag in GTM's Preview mode and then forgetting to click Publish — Preview success proves nothing about the live container.

**Google Business Profile (GBP, formerly Google My Business)**
*What it is:* The free listing that produces the map card / knowledge panel you see for local searches — hours, address, phone, reviews, services. It's what determines whether NS Engineering shows up in Google's "local pack" (the 3-result map block) for searches like "geotechnical testing Nepal."
*Why SEO:* Directly and heavily — unlike the analytics tools above, GBP is an actual **ranking input**, not just a diagnostic. Multiple 2026 local-ranking studies put GBP signals (category correctness, completeness, activity) at roughly a third of total local-pack ranking weight, with the primary category cited repeatedly as the single most controllable, highest-impact field. Since no GBP presence has been confirmed at all, this is plausibly the highest-leverage, lowest-effort gap in this entire document.
*Why AI SEO:* The strongest AI-visibility connection of any portal in this list, not a stretch — Google's AI Overviews and AI Mode ground local-intent answers directly in Maps/GBP data, and profile inactivity (30+ days with no activity) is repeatedly linked to visibility drops. GBP data also feeds the directories and data aggregators third-party assistants (ChatGPT, Perplexity) often pull from, so a clean profile has knock-on benefits even off Google.
*Setup:* Search Google Maps and Search exhaustively for an existing listing **before** creating one — a duplicate is much harder to fix than getting it right once. Google has been phasing out postcard verification in favor of an in-app **video walkthrough** as the default for new listings; email/phone verification are typically reserved for businesses with an existing strong footprint elsewhere. Get the primary category right first — it matters more than any other single field.
*Pitfall:* New listings are disproportionately at suspension risk from keyword-stuffed business names, address/category mismatches, and rapid-fire edits right after creation (Google's systems can read a burst of profile changes as listing-hijack behavior) — slow and careful beats fast here.
*This is Goal 5, paired, because creating a public business identity is a real-world action, not a code change.*

### Cluster C — Structured Data Validators

**Google Rich Results Test** — [search.google.com/test/rich-results](https://search.google.com/test/rich-results)
*What it is:* Google's tool for two separate questions: can Google's parser read your structured data at all, and does it currently qualify for a visible rich result (star rating, breadcrumb, job card, etc.)?
*Why AI SEO:* Google has said Gemini-powered AI Mode uses structured data to verify claims and assess source credibility — independent of whether that data produces any visible SERP feature. That decouples "does this validate" from "does this earn a rich snippet," which is the whole reason Goal 2 asks you to check both angles separately.
*2026 state — FAQ specifically:* Google added a deprecation notice to FAQPage docs on **2025-05-08**; the FAQ rich result itself stopped appearing **2026-05-07**; GSC's FAQ rich-result report, the FAQ search-appearance filter, and **Rich Results Test's own support for checking FAQPage were removed in June 2026**; FAQ data leaves the Search Console API in **August 2026**. Only the *feature* was deprecated — `FAQPage` remains a fully valid schema.org type, and Google's own docs say unused/unrewarded structured data doesn't hurt Search. Running a page with FAQ schema through this tool today will no longer show FAQ-specific rich-result eligibility.
*Other current rich-result types (per Google's live gallery):* Article, Breadcrumb, Carousel, Course list, Dataset, Event, Job posting, Local business, Organization, Product, Profile page, Q&A (a *different* type from FAQPage — easy to confuse), Review snippet, Software app, Video, and others. HowTo was deprecated separately, back in 2023 — don't attribute it to the same 2026 change.

**Schema Markup Validator** — [validator.schema.org](https://validator.schema.org)
*What it is:* The tool run jointly by the schema.org steering group, checking markup purely against the vocabulary spec — not against any one search engine's reward rules. It replaced Google's old, fully-retired Structured Data Testing Tool.
*Why it's the more important tool for GEO specifically:* It's engine-agnostic and reward-agnostic — it checks all ~823 current types regardless of whether Google currently displays anything for them. AI answer engines pulling structured data generally aren't filtering by "does Google reward this type today" — they're parsing whatever's spec-valid. A `FAQPage` block that validates clean here is structurally sound and citable to an LLM even though Rich Results Test no longer treats it as SERP-eligible.
*Current version:* schema.org **v30.0**, published **2026-03-19** — 823 types, 1,529 properties. (Not 958 types — that number is wrong if you see it elsewhere; verify against schema.org/docs/releases.html.)
*The practical sequencing to teach:* validator.schema.org answers "is this correct JSON-LD"; Rich Results Test answers "does Google currently do anything visible with it"; actual SERP display is a third layer depending on competition and page quality even when both prior checks pass. All three commonly get conflated as "schema is broken" when only one layer actually failed. **Goal 2 now requires both tools, in that order** — spec-correctness first, Google-reward-eligibility second.

### Cluster D — Performance Measurement

**GSC's Core Web Vitals report**
*What it is:* Real-user field data (sourced from CrUX, below) for your verified property, grouped into URL clusters, reported Good/Needs-improvement/Poor per Mobile and Desktop.
*Why it's the authoritative view:* This — not a Lighthouse lab score — is what Google's ranking systems actually reference, because it reflects real visitors on real networks, not one simulated run.
*Confirmed 2026 thresholds (verified directly against live GSC and web.dev docs, not blog paraphrase):* LCP ≤2.5s / INP ≤200ms / CLS ≤0.1 = Good; higher tiers at LCP ≤4s, INP ≤500ms, CLS ≤0.25 = Needs Improvement; anything above that = Poor. **Be skeptical of blog claims that these thresholds tightened in 2026 (e.g. "LCP now needs to be under 2.0s") — no such change is corroborated by Google's own documentation.** That specific gap between a confident-sounding blog post and what the primary source actually says is worth noticing as a pattern, not just accepting once.
*The pitfall most relevant to this specific site:* When a URL doesn't have enough real-user samples, GSC (and PSI, below) silently falls back to **origin-level aggregate data**, or shows nothing at all if even that's insufficient. For a 124-URL B2B site with modest per-page traffic, expect most individual service/project pages to have **no CrUX coverage at all** — which is exactly why Lighthouse lab data, normally the secondary signal, becomes the primary usable per-page signal for Goal 4 on this site specifically.

**PageSpeed Insights (PSI) / Lighthouse**
*What it is:* PSI (pagespeed.web.dev) runs field data (CrUX, if available) alongside a live lab test (Lighthouse) for any URL. Lighthouse itself is the underlying open-source engine — also in Chrome DevTools, the CLI, and CI.
*Why it matters:* Its Diagnostics/Opportunities sections name the actual bottleneck (unoptimized hero image, render-blocking script) instead of just a number — that's what turns a failing score into a fixable ticket.
*Field vs. lab, and which to trust when:* Field data is ground truth for real visitors; lab data is one reproducible synthetic run under fixed conditions. A 10–15 point gap between the two is normal and expected per Google's own documentation — not a bug in either tool. Use field data to decide *whether* there's a problem; use lab diagnostics to figure out *what* to fix.
*Score variance is real — plan for it:* Repeated Lighthouse runs on an unchanged page legitimately produce different scores (local CPU contention is the single biggest driver of local-run variance, plus third-party script latency — Total Blocking Time alone is roughly 30% of the performance score). **Run each page 3–5 times and use the median**, never a single run, especially for a borderline score.
*Pitfall:* Always test the live production Cloudflare Pages URL — never localhost or a preview deploy. Lab data on localhost is meaningless (no real network latency, no CDN edge caching), and field data won't exist for a non-production URL at all.

**Chrome UX Report (CrUX)**
*What it is:* The real-user dataset underneath both reports above — anonymized Chrome telemetry from real visitors across the public web, not a recruited panel or synthetic test. It's what makes "field data" possible at all.
*The constraint worth internalizing before Goal 4:* Google doesn't publish an exact number, but independent measurement converges on a floor in the low-thousands to ~10,000+ monthly pageviews before a specific URL reliably gets its own CrUX entry. **This is the single most likely real finding for this site's audit** — most individual pages almost certainly fall under that floor, so expect no per-page field data outside maybe the homepage, with everything else falling back to origin-level or nothing. Say this plainly in the audit rather than treating "no data" as "no problem."

### Cluster E — AI Search Surfaces

Every AI company here runs **multiple, differently-named crawlers** for different purposes — training vs. building a live citation index vs. a real-time fetch triggered by an actual user prompt. Treating "block the wildcard bot" or "allow the wildcard bot" as one decision is the most common, most consequential robots.txt mistake in this space (see Goal 0 Q6).

**ChatGPT** — OpenAI runs **three** bots: `GPTBot` (training crawl), `OAI-SearchBot` (builds the index behind ChatGPT's search/citation feature), `ChatGPT-User` (live fetch when a prompt or clicked citation needs a page in real time). All three respect standard `robots.txt` Disallow rules. **Blocking GPTBot alone does not remove you from ChatGPT's citations** — that requires blocking `OAI-SearchBot` specifically, and doing so likely makes you invisible there. *Testing:* free account is enough; industry-standard methodology runs 30+ natural-language prompts (not branded — "best geotechnical firm in Nepal," not "NS Engineering reviews") repeatedly for statistical stability, with memory/personalization off.

**Perplexity** — Two bots: `PerplexityBot` (indexing) and `Perplexity-User` (live fetch). Both honor robots.txt; if `PerplexityBot` can't crawl you, you cannot be cited — described as a binary gate, separate from ranking quality. The most consistently reported distinctive signal is **freshness** — one industry study found content updated within 2 hours earned meaningfully more citations than month-stale content (directional, not Perplexity-confirmed). Perplexity is also described as consensus-based, favoring claims corroborated across multiple sources over one authoritative lone page — a different dynamic than Google's single-best-page ranking.

**Claude** — Three bots: `ClaudeBot` (training), `Claude-User` (live fetch), `Claude-SearchBot` (indexing for citation). All robots.txt-compliant. Claude's web search is reported (third-party analysis, not Anthropic-confirmed) to be Brave-Search-backed. A genuinely distinctive, multi-sourced finding: **sentence/passage-level structure matters more for Claude than for other AI surfaces** — a single well-structured, self-contained, factual paragraph can get cited even from an otherwise middling page, while a strong page with weak internal structure may get read but never cited. Argues for scannable, standalone factual statements, not just page-level SEO.

**Google AI Overviews** — No separate crawler: it's Gemini grounded in the *same* Googlebot-fed index as regular Search. This matters directly for robots.txt: **`Google-Extended` only controls whether Google may use crawled content to train/improve Gemini/Vertex AI models — it does not gate inclusion in AI Overviews citations**, which are served off the standard index. Blocking Googlebot itself is the only lever that removes a site from both organic *and* AI Overviews. Google upgraded AI Overviews globally to **Gemini 3 on 2026-01-27**, reportedly replacing roughly 42% of previously-cited domains — a real discontinuity meaning pre-2026 citation data doesn't necessarily generalize. Google confirmed on **2026-05-15** that manipulating AI Overviews (buying/faking citations, prompt injection) is a formal spam-policy violation, enforced through the same demotion mechanisms as regular ranking spam.

**Google AI Mode** — A dedicated conversational/agentic search tab, not just a box in results. Reached **1 billion monthly active users by May 2026**, live in 200+ countries. Crawling/citation mechanics are believed to mirror AI Overviews (same index, same `Google-Extended` semantics) — but Google hasn't published a distinct AI Mode crawler identity, so treat that as a working assumption, not confirmed. Since April 2026, some markets have early agentic capabilities (e.g., booking) — a sign this surface is moving from answers toward transactions, worth testing with task-style prompts, not just informational ones.

### Cluster F — The Hosting Layer

**Cloudflare** (the site's actual host, via Cloudflare Pages)
*Caching & a real, easy-to-miss issue:* Cloudflare Pages generates a `*.pages.dev` preview domain alongside the custom domain — **that preview domain can get indexed as duplicate content** unless `_headers` sets `X-Robots-Tag: noindex` on it. Worth checking directly; it's a one-line fix if missing.
*AI-crawler controls:* Cloudflare's **AI Crawl Control** ships a Managed robots.txt and a `Content-Signal` directive (`search=yes, ai-train=no, ai-input=yes` style) letting a site separately permit indexing, live-answer quoting, and training use. **Google has explicitly stated this directive has no effect on Google's own systems** — treat it as a cooperative, honor-system signal with no confirmed adoption commitment from any major AI company as of mid-2026, not an enforcement mechanism.
*A real, live risk worth flagging now:* starting **2026-09-15**, Cloudflare defaults new domains (and non-opted-out free-tier accounts) to **blocking Training and Agent crawler categories on any page carrying ads**, while Search stays allowed by default. The older "Block AI Bots" one-click toggle has historically lumped search-serving crawlers (`OAI-SearchBot`, `PerplexityBot`, `Claude-SearchBot`) in with pure training crawlers — using it carelessly could silently remove the site from ChatGPT/Perplexity/Claude citations while leaving Google completely unaffected. Check the AI Crawl Control dashboard per-bot, not the blanket toggle, if this site ever runs ads.
*Cloudflare Web Analytics vs. GA4:* Cookieless and fingerprint-free — no consent-banner obligation, and it sees raw crawler/bot hits at the edge that GA4's JS-tag approach often misses entirely (many bot fetches never execute JavaScript). But it's intentionally shallow: no custom events, no funnels, no campaign-level attribution. A reasonable lightweight supplement, not a GA4 replacement — see Goal 7 Q3.

---

## Local Setup — Before Goal 0

No new dependencies for Goals 0–6 — everything is web-based tooling:

- Chrome DevTools → Lighthouse tab (SEO + Performance categories)
- [Google Search Console](https://search.google.com/search-console) — ask your mentor for access, don't create a second property
- [Bing Webmaster Tools](https://www.bing.com/webmasters) — ask whether this already exists (see Goal 0) before creating anything
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Markup Validator](https://validator.schema.org)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- A Google account for [Google Business Profile](https://business.google.com/) — Goal 5, paired, do not create a listing without mentor sign-off (see that goal)
- Accounts (free tier is fine) on ChatGPT, Perplexity, and access to Claude — for Goal 6. Google AI Overviews/AI Mode need no separate account, just a Google Search query that triggers one — but note AI Mode may need to be enabled/available in your region
- Read access to `docs/SEO_OPTIMIZATION_ROADMAP.md` in full before Goal 0 — it's long, read it once anyway

Goals 5 (Google Business Profile) and 7 (GA4) are the two paired, production-sensitive goals — one because it creates a real public business listing, the other because it touches `package.json` and real visitor data.

---

## Goal 0: Orientation — Read the Existing SEO Implementation Before Touching It

### Completion Goal

Read, in this order: `docs/SEO_OPTIMIZATION_ROADMAP.md` (full), then `src/lib/seo/metadata-helpers.ts`, `src/lib/seo/schema-generators.ts`, `public/robots.txt`, `public/sitemap.xml`, and the five files under `src/components/seo/`. Answer the Questions below in writing before starting Goal 1.

### Checkpoint Concepts

- **Audit before you build.** SEO work done on top of a wrong assumption about current state is wasted work — the roadmap already documents what's done and what isn't; your job in later goals is to verify and extend it, not rediscover it from scratch.
- **Docs drift from code.** The roadmap is a snapshot from one date. Code is the current truth. Wherever they disagree, the code wins, and that disagreement itself is worth writing down.

### Questions to Answer

### 1. `generatePageMetadata()` in `metadata-helpers.ts` takes a `keywords` array as an optional parameter. Find one page in `src/app/` that actually passes keywords, and one that doesn't. Why would a page skip it?
=> 
The generatePageMetadata() function accepts keywords as an optional parameter (keywords?: string[]). One page that passes the keywords array is the About page (src/app/about/page.tsx), which uses generateAboutMetadata(). Inside generateAboutMetadata(), a list of SEO keywords such as "about NS Engineering" and "geotechnical company Nepal" is passed to generatePageMetadata(). A page that does not directly pass keywords is the Home page (src/app/page.tsx). The Home page does not export its own metadata or call generatePageMetadata(). Instead, it inherits the default metadata, including the global keywords, from src/app/layout.tsx. A page may skip passing its own keywords because the parameter is optional, because it can inherit metadata from the root layout, or because modern search engines rely much more on page content, titles, descriptions, and structured data than on the meta keywords tag. This makes page-specific keywords unnecessary in some cases.

### 2. List the 5 schema types implemented in `src/components/seo/`. For each, name one specific fact it exposes that Google (or an AI assistant) couldn't otherwise reliably extract just from reading the page's visible text.
=>

| Schema Type | Purpose | One Specific Fact It Exposes |
|-------------|---------|------------------------------|
| **Organization Schema** | Provides structured information about NS Engineering as a company. | It explicitly identifies the company's official social media profiles (`sameAs`), allowing Google and AI assistants to recognize the official accounts instead of guessing from the visible page content. |
| **LocalBusiness Schema** | Provides information about the company's physical business location. | It exposes the exact geographic coordinates (latitude and longitude) of the office, which cannot be reliably extracted from the visible address alone. |
| **BreadcrumbList Schema** | Defines the navigation hierarchy of the website. | It explicitly describes the relationship between pages (e.g., **Home → Services → Projects**), helping search engines understand the site's structure rather than inferring it from navigation links. |
| **FAQPage Schema** | Marks frequently asked questions and their answers in a structured format. | It explicitly identifies each question and its accepted answer, allowing Google to recognize FAQ content without having to infer the relationship from headings and paragraphs. |
| **Person Schema** | Provides structured information about featured team members. | It exposes professional details such as the engineer's official role, experience, and LinkedIn profile, which search engines cannot reliably determine from visible text alone. |

### 3. Open `public/robots.txt`. What does `Crawl-delay: 1` actually do, and is it a good idea for a site this size? (Consider: does a 1-second-per-request delay meaningfully protect server load, or does it just slow down how fast Google indexes new pages?)
=>
The `robots.txt` file contains the following directive:

```txt
Crawl-delay: 1
```

### What does `Crawl-delay: 1` do?

`Crawl-delay: 1` tells web crawlers that respect this directive to wait **1 second between consecutive requests** when crawling the website. Its purpose is to reduce the load on the web server by preventing bots from sending many requests in a very short time.

For example:

```text
Request 1
↓ (wait 1 second)
Request 2
↓ (wait 1 second)
Request 3
```

### Does Google follow `Crawl-delay`?

No. **Googlebot ignores the `Crawl-delay` directive**. Google manages its crawl rate automatically based on the website's performance and server response. Therefore, adding `Crawl-delay: 1` does **not** slow down or control Google's crawling.

For this site, **`Crawl-delay: 1` can be unnecessary. It does not improve Google's crawling behavior or significantly protect the server, but it may slow down compliant crawlers from indexing newly added or updated pages.

### 4. The roadmap claims "Phase 4 (Structured Data): 90% Complete." Based on what you read in `schema-generators.ts` and the components, what's the missing 10%? Is the roadmap's estimate still accurate, or did it change since 2026-06-19?
=>

After reviewing `schema-generators.ts` and the pages under `src/app/`, the website already implements a comprehensive set of structured data, including:

- **Organization** schema
- **LocalBusiness** schema
- **BreadcrumbList** schema
- **Service** and **ServiceList (ItemList)** schemas
- **ProjectList (ItemList)** schema
- **FAQPage** schema
- **Person** schema
- **DefinedTerm** schema

These schemas are dynamically generated from the project's JSON/Google Sheets data and are injected into the relevant pages using the `JsonLd` component. This means that structured data automatically stays up to date as the site's content changes.

### What is the likely missing 10%?

Based on the current implementation, the remaining work is not the core structured data itself but additional enhancements, such as:

- Adding more specialized schema types (for example, `Article`, `WebPage`, `CollectionPage`, or `SearchAction`) where appropriate.
- Further validating and testing the structured data using Google's Rich Results Test and Schema Markup Validator.
- Monitoring Search Console for structured data warnings or enhancement reports.
- Expanding schema coverage if new content types are added in the future.

### Is the roadmap's estimate still accurate?

The roadmap's estimate of **90% complete** no longer appears to be accurate.

Compared with the roadmap dated **2026-06-19**, the current implementation is significantly more complete. The project includes multiple structured data types, dynamic JSON-LD generation, and page-specific schema integration across major pages such as About, Services, Projects, FAQ, Team, and others.

Because I couldn't find an identifiable missing feature, I believe the roadmap's "90% complete" estimate is likely a snapshot from 2026-06-19 that has since become stale. Based on the current codebase, the structured data implementation appears functionally complete for the site's existing content. Future work would be maintenance or expansion for new content types rather than completing an unfinished implementation.

### 5. `layout.tsx` has a `verification` metadata field that's commented out. Ask your mentor how GSC verification was actually done for this site (DNS, HTML file, or meta tag), and separately whether Bing verification was ever done at all — note that Bing offers a one-click "import from GSC" path that leaves zero trace in the codebase, so a code search finding nothing doesn't settle the Bing question; only logging into bing.com/webmasters directly does. Write down both answers. If GSC verification was meta-tag based and never got un-commented, that's a real bug to flag, not a documentation gap.
=>
### Google Search Console (GSC) Verification

The website is verified using **DNS verification**. A Google Search Console verification TXT record was added to the domain's DNS configuration, so no verification meta tag or HTML verification file is required in the codebase.

Therefore, the commented-out `verification` metadata field in `layout.tsx` is **not a bug**. Since verification is handled through DNS, the metadata field is simply unused.

### Bing Webmaster Verification

**Bing Webmaster Tools has not been configured or verified** for this website.

Although no Bing verification meta tag or HTML verification file exists in the codebase, that alone would not have been sufficient to determine its status because Bing also supports importing a site directly from Google Search Console. The verification status was confirmed separately.

### 6. `robots.txt` currently only has a wildcard `User-agent: *` rule. Each major AI company runs *multiple, differently-named* bots for different purposes, not one — look up the real list: OpenAI runs `GPTBot` (training), `OAI-SearchBot` (builds the index behind ChatGPT's citations), and `ChatGPT-User` (live fetch on a user's request); Perplexity runs `PerplexityBot` (indexing) and `Perplexity-User` (live fetch); Anthropic runs `ClaudeBot` (training), `Claude-SearchBot` (indexing), and `Claude-User` (live fetch); Google's `Google-Extended` controls only whether crawled content can be used to *train* Gemini/Vertex models — it does **not** gate whether the site can be cited in AI Overviews or AI Mode, which draw from the same index Googlebot itself feeds. Given that, does a wildcard `Allow: /` reliably cover all of these, or can a crawler choose to ignore a wildcard rule if it never sees a rule addressed to its specific name? Form an opinion on whether this site should add explicit per-bot lines, and why — and specifically, whether blocking `Google-Extended` (if that were ever considered, e.g. to opt out of AI training) would have any effect on AI Overviews/AI Mode visibility, or whether that's a common misconception worth writing down so nobody on the team makes it later.
=>
The current `robots.txt` only contains a wildcard rule:

```txt
User-agent: *
Allow: /
```

This rule allows all crawlers that follow the Robots Exclusion Protocol to crawl the website. also, most major AI crawlers (such as GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, and Perplexity-User) will match this wildcard rule if they do not have a more specific rule.
However, each major AI company now operates **multiple crawlers with different purposes**, including:

| Company | Crawlers | Purpose |
|---------|----------|---------|
| OpenAI | `GPTBot`, `OAI-SearchBot`, `ChatGPT-User` | Model training, search indexing, and live user-requested fetching |
| Anthropic | `ClaudeBot`, `Claude-SearchBot`, `Claude-User` | Model training, search indexing, and live user-requested fetching |
| Perplexity | `PerplexityBot`, `Perplexity-User` | Search indexing and live user-requested fetching |
| Google | `Googlebot`, `Google-Extended` | Search indexing and AI training control |

### Does the wildcard rule cover all AI bots?

**yes**. A compliant crawler that does not find a rule addressed to its own user-agent will fall back to the wildcard (`User-agent: *`) group. Therefore, the current configuration already allows these crawlers to access the site.

However, relying only on a wildcard rule is not the clearest long-term approach. As AI crawlers continue to evolve, adding **explicit per-bot rules** makes the site's crawling policy easier to understand, audit, and maintain. It also allows the team to control individual crawlers independently in the future.

### Should this site add explicit AI bot rules?

**Yes.**

Even though the wildcard rule currently permits all crawlers, explicitly listing important AI crawlers is a better practice because it:

- Clearly documents which AI crawlers the site intends to allow.
- Makes future policy changes easier without affecting unrelated bots.
- Separates training crawlers from search and live-retrieval crawlers.
- Improves maintainability as additional AI crawlers are introduced.

### About `Google-Extended`

`Google-Extended` is **not** the crawler responsible for Google Search indexing. Instead, it is a control token that determines whether Google may use already-crawled content for training Gemini and Vertex AI models. Blocking `Google-Extended` **does not** stop Googlebot from crawling the site or prevent pages from appearing in Google Search. It also **does not prevent the site from being cited in AI Overviews or AI Mode**, because those features use Google's normal search index built by **Googlebot**, not the `Google-Extended` training permission. :contentReference[oaicite:3]{index=3}

### Common misconception

A common misconception is that blocking `Google-Extended` will remove a website from **AI Overviews** or **AI Mode**. Blocking `Google-Extended` only opts the site's content out of Google's AI model training. Search visibility, AI Overviews, and AI Mode continue to depend on **Googlebot** crawling and indexing the website. :contentReference[oaicite:4]{index=4}

### 7. Log into Google Search Console (ask your mentor for access) and check whether this property has the **Generative AI performance report** (Performance → a "Generative AI" tab, shipped June 2026, phased rollout — not guaranteed on every property). If it's there, note what it shows (impressions only, no clicks, as of when this was written). If it's not there, write that down too — it's a real, checkable fact about this specific property, not a guess.
=>
**Google Search Console – Generative AI Performance Report**

**Property**: nsengineering.com.np

**Status**: Not available

**Observation**:

I logged into the Google Search Console property and checked the Performance report. The property currently does not have the Generative AI Performance report or tab. Only the standard Web Search performance metrics (Clicks, Impressions, CTR, and Average Position) are available. Therefore, there are no Generative AI impression metrics available for this property at this time.

---

## Goal 1: Technical SEO Audit — Crawlability, Indexability, Metadata

### Completion Goal

Pick 5 real pages: homepage, `/services`, `/projects`, `/team`, and one individual service or project detail page. For each, work through the checklist below using Lighthouse's SEO category and manual inspection (View Source, not DevTools' rendered DOM — you want to see what a crawler that doesn't execute JS would see). Log every finding — pass or fail — in a new file, `docs/technical/SEO_AUDIT_2026-07.md`, one section per page.

**Checklist per page:**
- Title present, realistically 50–60 characters, contains a real target term (not just the company name)
- Meta description present, 120–160 characters, not duplicated across pages
- Exactly one `<h1>`, and it isn't empty or generic ("Welcome")
- Canonical tag present, self-referential, points to the production domain (not `localhost` or a staging URL)
- No accidental `noindex` on a page that should rank
- All images have `alt` text (empty `alt=""` is fine for decorative images, missing `alt` is not)
- Lighthouse SEO score — record the actual number, don't round up

### Checkpoint Concepts

- **Crawlability is necessary, not sufficient.** A page can be perfectly crawlable and still rank nowhere because of weak content — but if it's *not* crawlable, nothing else in this module matters. This goal is the floor everything else stands on.
- **View Source vs. rendered DOM.** Many crawlers (and older bots) don't execute JavaScript the way your browser does. What's in the raw HTML response is a stricter, more honest test of what's actually indexable than what DevTools shows you after React hydrates.
- **Duplicate metadata is a real, common failure mode.** Two pages with the same title/description send Google a "these might be the same page" signal — worth explicitly checking across all 5 pages, not just within one.

### Questions to Answer

### 1. Which of your 5 pages had the weakest title/description, and what would you change it to? (The roadmap has real before/after examples for Services, Projects, and Homepage — compare your independent answer to theirs before reading them, then note where you agree or disagree.)
=>
Before reviewing the roadmap examples, I independently identified the Services page as having the weakest metadata because the title is relatively generic and the description focuses more on the company than the specific search intent. My proposed improvement was to make both the title and description more service-oriented by including keywords such as "Geotechnical Investigation", "Soil Testing", and "Foundation Engineering Nepal".

After comparing my findings with the roadmap examples, I found that they reached essentially the same conclusion. The roadmap also rewrites the Services and Projects metadata to be more keyword focused and descriptive rather than simply branding the company. I therefore agree with the roadmap's direction. My independent review identified the same pages as needing improvement, although my wording differs slightly from the roadmap's examples.

### 2. Did you find any duplicate titles or descriptions across the 5 pages? If not here, would you expect to find any across the full 124-URL sitemap, and why?
=>
I did not find any duplicate titles or meta descriptions among the five pages that I audited. Each page had its own unique metadata that matched its content.

However, I would still expect duplicate metadata to be possible across the complete 124-page sitemap. Large websites often contain many similar pages, especially service pages, project pages, or pages created from templates. If metadata is reused without being customized for each page, duplicate titles or descriptions can occur.

### 3. Pick one Lighthouse SEO finding that surprised you — something you wouldn't have caught by eye. What did it catch, and why does that particular thing matter to a crawler even though it's invisible to a human?
=>
One finding that stood out was that the Services page and the Projects page both received a Lighthouse SEO score of 92, while the other audited pages received a perfect score of 100.

Although both pages looked completely normal to a visitor, Lighthouse identified that there were still technical SEO improvements that could be made. This showed me that search engines evaluate much more than just the visible content on a page.

Many SEO signals—such as metadata, canonical tags, robots directives, image alt attributes, and other HTML elements—are largely invisible to users but are essential for search engine crawlers. These technical elements help crawlers understand what a page is about, determine whether it should be indexed, and display it correctly in search results. Even when a page appears visually correct, small technical issues can reduce its SEO score and affect how efficiently search engines process the page.
---

## Goal 2: Structured Data — Validate What's Already Built (and What Changed Under It)

### Completion Goal

Take the 5 pages from Goal 1 (or the ones that actually carry schema — check which do first) and run each through **two** validators, in this order, because they check different things (see the Portal Reference's Cluster C if you skipped it): first the [Schema Markup Validator](https://validator.schema.org) (is this correct JSON-LD against the schema.org spec, full stop, regardless of what any search engine currently does with it), then the [Rich Results Test](https://search.google.com/test/rich-results) (does Google currently reward this specific type with a visible search feature). Document, for each schema type present (`Organization`, `Person`, `Service`, `Project`, `FAQPage`, `LocalBusiness` — verify which page(s) carry which), whether it validates clean in each tool, and the exact text of any warning or error. Fix anything genuinely broken (with mentor review before merging any fix). If everything validates clean, say so explicitly in your write-up — "nothing was broken" is a real, useful finding, not a non-result.

**Then, separately, do the thing that matters more than validation:** find out what each schema type is actually *for* right now, in 2026, because that has shifted under this codebase since it was written. Specifically — Google added a deprecation notice to its FAQPage documentation on 2025-05-08, the FAQ rich result (the dropdown-in-search-results display) itself stopped appearing on 2026-05-07, and Rich Results Test's own support for checking FAQPage — along with Search Console's FAQ rich-result report and search-appearance filter — was removed in June 2026 (the FAQ data leaves the Search Console API entirely in August 2026). That means the `FAQPageSchema.tsx` component in this codebase, and the roadmap's "3.6 FAQ Schema Optimization" section, were written for a benefit that no longer exists in the form they describe. Confirm this independently (don't just take this doc's word for it — that's the whole point of Goal 0's "docs drift from code" lesson, now applied to *this* doc too; check Google's own Search Central documentation for the dates, not an SEO blog's summary of them), then decide: does FAQ schema still earn its place in the codebase for a different reason?

### Checkpoint Concepts

- **Structured data is a promise, not a suggestion.** If a `Person` schema claims a `jobTitle` or `worksFor` relationship that isn't actually true or isn't reflected on the visible page, that's a real integrity problem, not just a technical one — Google (and increasingly, LLMs) can and do penalize mismatched structured data.
- **The knowledge graph is the point, not the individual schemas.** `Organization ↔ Person ↔ Service ↔ Project` being linked (via `worksFor`, `provider`, `knowsAbout`, etc.) is what turns five separate facts into one connected entity a search engine — or an AI — can reason about. Check the *links* between schemas, not just each one in isolation.
- **Rich-result value and AI-retrieval value are two different reasons to keep the same schema, and they can diverge.** FAQ schema losing its search-results dropdown doesn't necessarily mean it's worthless — Google has said AI Mode uses structured data to verify claims and assess source credibility, and a clean `Question`/`Answer` pair is still a clean, citable fact for an LLM even with no visual snippet attached. The skill here is not "is this schema type still supported" (binary, and it'll keep changing) but "what specific thing does this schema earn me *today*, for *which* consumer" — and being willing to answer "nothing, anymore" if that's the honest finding.
- **Google Search Console quietly stops reporting on deprecated types.** GSC's FAQ rich-result report and search-appearance filter were removed in June 2026, on the same schedule as Rich Results Test's FAQ support (see above). If you see zero impressions or no errors for FAQ rich results in GSC, that's not necessarily a bug in the code — check whether Google simply stopped measuring it before you go looking for what you broke.
- **Schema.org itself keeps growing even as Google prunes what it rewards.** Schema.org shipped version 30.0 on 2026-03-19 — 823 types, 1,529 properties (not 958 — that number circulates incorrectly in some places; the current release page at schema.org/docs/releases.html is the source of truth). More types existing doesn't mean more of them are worth adding — but it's worth a quick check whether a more specific type than what's used today exists for this business (the roadmap itself already flags `ProfessionalService` as a candidate never implemented).
- **Spec-valid and Google-rewarded are two different bars, checked by two different tools.** validator.schema.org tells you the markup is correct; Rich Results Test tells you whether Google currently does anything visible with it; actual SERP display is a third layer depending on competition and page quality, even when both prior checks pass clean. Conflating all three into one "is schema broken?" question is the single most common mistake in this goal — keep them separate in your write-up.

### Questions to Answer

### 1. Did any schema fail either validator? If yes — which tool caught it, what was wrong, and did you fix it or flag it? (Note if a page passed one validator but not the other — that's a real, informative finding about which layer actually broke.) If nothing failed either tool — pick one schema type *other than FAQPage* and explain, concretely, what result Google's Rich Results feature would actually show a searcher because this schema exists (a knowledge panel, an image carousel, a breadcrumb trail — be specific, not "better SEO").
=>
No schema failed either the Schema Markup Validator or Google's Rich Results Test. All five audited pages validated successfully, and no errors or warnings were reported. Therefore, no schema fixes were required.

One schema type that contributes to Google's rich search features is the `Organization` schema. This schema helps Google identify the business behind the website and can contribute to an organization's knowledge panel when sufficient supporting information is available. The knowledge panel may display details such as the company name, logo, website, contact information, and social media profiles. Although the `Organization` schema alone does not guarantee a knowledge panel, it provides structured information that helps Google understand and verify the business entity.

### 2. Find one place where two schemas are supposed to be linked (e.g., a `Person`'s `worksFor` pointing at the `Organization`, or a `Service`'s `provider`). Confirm in the code that the link is real, not just two schemas that happen to mention the same company name as plain text.
=>
One clear relationship in the code exists between the `Person` schema and the `Organization` schema. The `Person` schema uses the `worksFor` property to reference the `Organization` schema through its unique `@id` (`https://www.nsengineering.com.np/#organization`) rather than simply repeating the company name as plain text. :contentReference[oaicite:1]{index=1}

```ts
worksFor: {
  '@id': `${SITE_URL}/#organization`,
}
```

The `Organization` schema itself is defined with the same `@id`:

```ts
'@id': `${SITE_URL}/#organization`,
```

This confirms that the two schemas are directly linked in the code. Search engines and AI systems can therefore understand that each team member works for N.S. Engineering & Geotechnical Services Pvt. Ltd., creating a connected knowledge graph instead of treating the `Person` and `Organization` as unrelated entities.

### 3. Independently verify the FAQ rich-results retirement claim above (search Google's own Search Central documentation/blog, don't just trust an SEO blog's summary of it). What's your actual source? Does what you found match what this doc says, or is it more nuanced?
=>
I verified the FAQ rich-result changes using Google's official Search Central documentation for FAQ structured data. The documentation states that FAQ rich results stopped appearing in Google Search on **May 7, 2026**. It also explains that support for FAQPage in the Rich Results Test, the FAQ search appearance report in Google Search Console, and the FAQ rich-result report were removed in **June 2026**.

My findings match the roadmap. However, the documentation also makes an important distinction: Google removed the **FAQ rich result feature**, not the **FAQPage Schema.org vocabulary** itself. The structured data remains valid, but it no longer produces the expandable FAQ rich result in Google Search.

### 4. Given what you found in Question 3: should `FAQPageSchema.tsx` stay, change, or go? Write your reasoning, not just your conclusion — this is a real recommendation you're making about live code, not a hypothetical.
=>
I recommend **keeping** the `FAQPageSchema.tsx` component but updating its purpose and the accompanying documentation.

Previously, the main benefit of FAQPage schema was to generate expandable FAQ rich results in Google Search. Since Google has retired this feature, the component should no longer be maintained with the expectation of improving search-result appearance.

However, the FAQPage structured data itself remains valid according to Schema.org, and Google's documentation does not recommend removing it. Keeping the schema still provides structured question-and-answer information that can help search engines and AI systems better understand the page content. Therefore, the component should remain in the codebase, but the project documentation should be updated to explain that its primary value is now improved content understanding and structured data consistency rather than generating FAQ rich results.

---

## Goal 3: Keyword Research & Content Alignment — the Real Phase 3 Gap

### Completion Goal

**Kickoff — paired with mentor.** Walk through Google Keyword Planner (or an equivalent free tool) together for one real term, e.g. "geotechnical testing Nepal" — mentor demonstrates reading search volume, competition/difficulty, and related terms.

**Alone from there.** Produce `docs/research/KEYWORD_RESEARCH.md`: at least 15 real keywords (mix of primary, secondary, and long-tail — the roadmap's categories are a reasonable template, but don't copy its example keywords verbatim, do your own research), each mapped to a specific existing page on the site, with your judgment on whether that page's current title/description/content actually serves that keyword's search intent or would need real changes. Include at least one keyword where you conclude the site has **no matching page at all** — that's a content gap, not a metadata fix.

### Checkpoint Concepts

- **Keyword research isn't stuffing keywords into text — it's discovering what people actually ask for, in their own words, and checking whether you answer it.** A page can be technically perfect (Goals 1–2) and still never rank, because it answers a question nobody's asking, or fails to answer the one people are.
- **Search intent has categories, and mismatching them wastes the ranking you do earn.** Someone searching "what is PDA testing" wants an explanation (informational intent); someone searching "PDA testing Nepal price" wants a quote (transactional intent). Ranking #1 for the wrong intent still doesn't convert.
- **This is explicitly the part that requires human judgment** — the QA knowledge base's SEO testing doc calls out keyword relevance as "out of scope for automated QA" for exactly this reason. Nobody and nothing does this for you; that's why it's still at 10% a month later.
- **Be skeptical of precise numbers from SEO blogs.** You'll see claims like "backlinks are 13% of the ranking algorithm" all over SEO content. Google has never published exact ranking-factor weights — treat these as industry estimates dressed up as facts, useful for *direction* (e.g., "content quality and E-E-A-T signals are getting relatively more emphasis, classic backlink counting relatively less") but not as numbers you should ever repeat as if Google said them.
- **This work has a shelf life now.** With core updates landing roughly every 3 months in 2026 instead of twice a year, a keyword map or content gap analysis needs a real "as of" date on it and an expectation that it gets revisited — not because you did it wrong, but because the ground under it moves faster than it used to.

### Questions to Answer

### 1. Of your 15+ keywords, how many currently have a real page that could rank for them today (even if imperfectly optimized), and how many represent content that doesn't exist yet?
=>
Out of the **15 researched keywords**:

- **6 keywords** are marked as **Good Fit**, meaning the website already has a page that closely matches the keyword and its search intent. These pages are already well aligned and do not require major SEO changes.
- **6 keywords** are marked as **Needs Rework**, meaning the website has a relevant page, but the page should be improved. The page title, H1 heading, meta description, or page content does not use the same wording that people search for on Google. These pages need SEO optimization instead of new content.
- **3 keywords** are marked as **Content Gap**, meaning the website does not currently have a page that targets these topics. The missing keywords are:
  - foundation investigation
  - concrete testing labs near me
  - concrete laboratory

The keyword audit shows that the website already covers most of the researched keywords, but several existing pages need SEO improvements. Three keywords have no matching page, creating clear content gaps. The most important missing topic is **concrete testing**, which should be added as a new service page or section.

### 2. Pick one keyword and honestly assess its intent. Does the page you mapped it to actually serve that intent, or does it serve a *different* intent that happens to use similar words?
=>

**Keyword:** **"geotechnical lab near me"**

**Mapped Page:** **Homepage**

The homepage only partially matches the user's search intent.

When someone searches for **"geotechnical lab near me"**, they are usually looking for:

- A nearby laboratory
- Business location
- Contact number
- Office hours
- Google Maps directions

The **homepage** mainly provides:

- Company introduction
- Services offered
- General business information

The **homepage** partially matches the keyword because it introduces the company's geotechnical services. However, users searching for "geotechnical lab near me" want to find the laboratory's location and contact details. Therefore, the existing Contact page should be optimized to better meet this search intent.

### 3. Compare your independent keyword list to the roadmap's example categories (Pile Testing, Soil Testing, Rock Testing, Geophysical, Drilling, Project Types). Did you find anything real people would search for that doesn't fit neatly into those categories?
=>
Most of the researched keywords fit into the roadmap's service categories, such as:

- Pile Testing
- Soil Testing
- Rock Testing
- Geophysical Investigation
- Drilling
- Project Types

However, two groups of keywords do **not** fit into these categories.

### 1. Local ("Near Me") Searches

Examples:

- geotechnical lab near me
- concrete testing labs near me
- soil testing lab in Kathmandu

These keywords focus on **finding a nearby business**, not on learning about a specific engineering service.

People searching these keywords usually want:

- Nearby location
- Contact information
- Google Maps
- Office hours
- Directions

These searches are based on **location**, so they do not belong to a single service category.

### 2. Publication / Resource Searches

Examples:

- civil engineering journal
- civil engineering publications

These users are **not looking for engineering services**.

Instead, they want educational resources such as:

- Technical papers
- Journals
- Publications
- Standards
- Reference documents

These keywords naturally belong to the **eLibrary** section of the website instead of the Services pages.

## Goal 4: Core Web Vitals — Measuring the Performance Ranking Signal

### Completion Goal

Run [PageSpeed Insights](https://pagespeed.web.dev/) against the same 5 pages from Goal 1, both mobile and desktop. Record real LCP, INP, CLS, and TTFB numbers — the roadmap's own metrics table still has every value marked "?" — you're the one filling it in for real. Identify the single largest contributor to LCP on the homepage specifically (almost always an image or a render-blocking resource — check the "diagnostics" section, don't guess).

### Checkpoint Concepts

- **Core Web Vitals are a *measured* ranking factor, not a vague "make it fast" suggestion.** Google has published the exact three metrics and their thresholds (LCP ≤2.5s, INP ≤200ms, CLS ≤0.1, each measured at the 75th percentile of real visitors over a rolling window) since INP replaced FID in 2024 — this is one of the few places "good SEO" and "good engineering" are provably the same task. It's also a genuinely common failure: independent 2026 measurement found roughly 43% of sites still fail the INP threshold, making it the single most commonly failed vital — don't be surprised if this site does too. Be skeptical of any claim that these thresholds themselves tightened in 2026 (e.g. "LCP now needs to be under 2.0s") — that circulates in SEO blogs but isn't corroborated by Google's own live documentation as of this research; the confirmed thresholds above are what's actually published.
- **Expect little or no real-user (CrUX) data for most of these 5 pages, and say so explicitly.** CrUX needs on the order of low-thousands to ~10,000+ monthly pageviews before a specific URL reliably gets its own entry. A 124-URL B2B site almost certainly doesn't hit that per-page — so GSC's Core Web Vitals report and PSI's field-data panel will likely fall back to origin-level aggregate, or show nothing at all, for most of your 5 pages beyond maybe the homepage. That makes **Lighthouse lab data your primary usable per-page signal here**, not the fallback it would be on a higher-traffic site — a real, non-generic constraint of this specific project, not a caveat to skip past.
- **Lighthouse scores vary run-to-run, even with nothing changed.** Local CPU contention and third-party script latency are the biggest drivers (Total Blocking Time alone is roughly 30% of the performance score). Run each page 3–5 times and record the median — a single run, especially a borderline one, isn't a reliable number to put in a report.
- **Mobile and desktop scores can diverge significantly**, and Google's ranking is mobile-first — a page that's fast on your dev laptop can still fail the metric that actually counts.
- **CLS bugs are almost always about missing dimensions or late-injected content** — an image without explicit `width`/`height`, a font swap, a cookie banner sliding in after load. It's a specific, findable class of bug, not a mysterious one.
- **Always test the live production URL**, never `localhost` or a preview deploy — lab data on localhost has no real network latency or CDN edge caching to measure, and field data won't exist for a non-production URL at all.

### Questions to Answer

### 1. What are the actual LCP/INP/CLS numbers for the homepage, mobile and desktop (median of at least 3 runs)? Do they meet the "good" thresholds?
=>
## 1. Actual LCP/INP/CLS Numbers for the Homepage

The homepage was tested on both **mobile and desktop**. The Lighthouse scores were:

| Device | Performance | Accessibility | Best Practices | SEO |
|---|---:|---:|---:|---:|
| **Mobile** | 55 | 96 | 100 | 100 |
| **Desktop** | 61 | 96 | 100 | 100 |

The local Core Web Vitals measurements for the **homepage** were:

| Metric | Measured Value | "Good" Threshold | Status |
|---|---:|---:|---|
| **LCP** | 0.82 s | ≤ 2.5 s | Good |
| **CLS** | 0.01 | ≤ 0.1 | Good |
| **INP** | 360 ms | ≤ 200 ms | Needs Improvement |

### Conclusion

The homepage has a **good LCP of 0.82 seconds** and an **excellent CLS of 0.01**, both of which meet Google's "Good" Core Web Vitals thresholds. However, the **INP of 360 ms** is above the 200 ms threshold, placing it in the **"Needs Improvement"** range.

### 2. What is the single largest contributor to LCP on the homepage, specifically? What would you change about it?
=>
The homepage's largest LCP contributor is the hero text element span.text-white.drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]. Since its LCP is already 0.82 s, I wouldn't replace or heavily modify it. I would optimize how the hero content is delivered—keeping the text server-rendered, avoiding render-blocking fonts or JavaScript, and removing any animation/delay—so it remains available immediately.

### 3. Did you find any CLS contributor on any of the 5 pages? If yes, what caused it (missing image dimensions, injected content, font loading)? If no, look again at the hero/carousel area specifically before concluding there's nothing.
=>
The CLS (Cumulative Layout Shift) values were checked for the required pages using Google PageSpeed Insights. The **Home** and **Team** pages recorded a CLS score of **0.00**, indicating no measurable layout shifts. The **Services** and **Projects** pages recorded a CLS score of **0.03** each. Although a minor layout shift was detected on these two pages, the value is well below Google's **0.10 "Good" threshold**.

The hero, image, carousel, and major content areas were also inspected to identify potential causes such as missing image dimensions, dynamically injected content, or font loading. No significant visual movement was observed during manual inspection.

| Page | CLS Score | Result |
|---|---:|---|
| Home | 0.00 | Good – no measurable layout shift |
| Team | 0.00 | Good – no measurable layout shift |
| Services | 0.03 | Good – minor layout shift detected |
| Projects | 0.03 | Good – minor layout shift detected |

**Conclusion:** No significant CLS contributor was identified across the tested pages. The Services and Projects pages showed a small CLS value of 0.03, but both remain within the **Good** performance range. The hero and carousel areas were specifically checked and did not show noticeable layout instability.

### 4. For each of your 5 pages, did GSC/PSI show real per-URL CrUX field data, origin-level fallback data, or no field data at all? Was your prediction (most pages will lack per-URL data) correct?
=>
The five selected pages were tested using Google PageSpeed Insights to determine whether real-user performance data from the Chrome User Experience Report (CrUX) was available. PageSpeed Insights provides field data from real Chrome users when sufficient data is available for a URL. If URL-level data is unavailable, PageSpeed Insights attempts to provide origin-level data for the website. If there is also insufficient origin-level data, PageSpeed Insights displays **“No Data.”**

| Page | CrUX Field Data | Data Level |
|---|---|---|
| Home | No Data | No field data available |
| Team | No Data | No field data available |
| Services | No Data | No field data available |
| Projects | No Data | No field data available |
| Contact | No Data | No field data available |

The results show that **none of the five tested pages had available CrUX field data**. This means that PageSpeed Insights did not have sufficient real-user data to provide either URL-level or origin-level field data for the tested pages. This does not indicate that the pages had poor performance; rather, it means that sufficient real-user data was not available in the CrUX dataset.

Therefore, the initial prediction that **most of the tested pages would lack per-URL CrUX data was correct**. In this case, the result was even stronger than predicted because **all five pages lacked available CrUX field data**. Consequently, the performance analysis for these pages relied on the **Lighthouse lab data** provided by PageSpeed Insights rather than real-user CrUX field data. PageSpeed Insights distinguishes lab data, which is collected in a controlled testing environment, from field data, which represents actual user experiences.
---

## Goal 5: Google Business Profile — The Single Highest-Leverage Gap on This List

### Completion Goal

**Paired with mentor throughout, and this one doesn't ship without your mentor's explicit sign-off too** — this goal ends with a real, public business listing under NS Engineering's name, which is a genuine real-world action, not a code change, and it needs a second set of eyes beyond just this doc before anything goes live.

1. **Search first, exhaustively, before anything else.** Check Google Maps and Google Search for any existing NS Engineering listing — including old addresses, an old name, or one created years ago by a past employee or a directory-listing vendor without the current team's knowledge. Finding and fixing a duplicate later is a meaningfully harder problem than getting this right once now, which is why this step is mandatory and comes first, not last.
2. **If nothing exists, draft before you create.** Write a full proposal in `docs/local/GBP_SETUP.md`: your recommended primary category (with reasoning against at least one plausible alternative you considered and rejected), secondary categories, a business description, a Services list mirroring what NS Engineering actually does, hours, and NAP (Name/Address/Phone) copied exactly from the site footer — not retyped, copied, so it's character-for-character identical. This is a proposal document for mentor review, not a live action yet.
3. **Only after sign-off, create or claim the listing together with your mentor.** Expect Google to ask for video verification (an in-app, real-time walkthrough of the office/signage) rather than the older postcard method. Fill in every field in one sitting rather than editing repeatedly over the following days or weeks — a burst of rapid post-creation edits to name, address, or category is a documented trigger for suspension review on new listings.
4. **Set up a real maintenance plan, not a one-time setup.** Decide, in writing, who checks the public Q&A section (anyone can post a question or an answer there, including competitors) and reviews on some regular cadence, and what the minimum posting frequency should be to keep the profile from reading as inactive — both because inactivity is linked to visibility drops in classical local ranking, and because Google's AI Overviews/AI Mode ground local-intent answers in this same data, so a stale profile risks feeding a stale or wrong AI answer too.

### Checkpoint Concepts

- **GBP is a ranking input, not a diagnostic tool — the first genuinely different kind of portal in this module.** Everything in Goals 1–4 tells you *how you're doing*; GBP data directly *is* part of how Google decides local-pack placement. Multiple 2026 local-ranking studies put GBP signals (category correctness, profile completeness, activity) at roughly a third of total local-pack ranking weight — treat that as an industry estimate, same caution as any other unpublished ranking-weight number, but directionally it means this one listing plausibly outweighs most individual fixes elsewhere in this document.
- **Category correctness is the single highest-leverage field.** It's repeatedly cited across independent sources as the most controllable, highest-impact decision in the whole setup — more consequential than the business description, more consequential than most photos or posts. Take real time on this, and write your reasoning down, not just your final pick.
- **This is also a genuine, concrete AI-visibility lever — not a stretch to include in an "AI SEO" module.** Google has confirmed its AI Overviews and AI Mode ground local-intent answers directly in Maps/GBP data. A complete, accurate, active profile is one of the only things in this entire document that plausibly moves classical Google ranking and Google's own AI answers through the exact same mechanism at the same time. It also has knock-on value beyond Google: GBP data feeds the directories and aggregators that third-party assistants like ChatGPT and Perplexity often pull from when answering local queries, so a clean profile helps even surfaces that never read GBP directly.
- **Duplicate listings are a real, asymmetric risk.** Creating a second listing when one already exists somewhere (even under an old name or address) creates a conflict that's genuinely harder to untangle than the extra day it takes to search thoroughly first. This is not boilerplate due diligence — it's the most consequential single step in this goal.
- **New listings carry real suspension risk, and it's mostly self-inflicted.** Keyword-stuffed business names, address/category mismatches, and rapid-fire edits right after creation are the most commonly cited triggers. Slow, careful, and complete-in-one-sitting beats fast here — this is one goal where moving quickly is actively the wrong instinct.

### Questions to Answer

### 1. Did you find any existing NS Engineering listing, even an old or inaccurate one? If yes, what specifically needs correcting rather than being replaced with something new?
=>
**Yes.**

An existing Google Business Profile for **N.S. Engineering & Geo-technical Services Pvt. Ltd.** was found.

Therefore, a new listing should not be created.

The existing listing requires correction/verification rather than replacement.

The main issues identified are:

* Business-name spelling difference: `Geo-technical` vs. `Geotechnical`
* NAP/address consistency
* HTTP website URL instead of HTTPS
* Business-description wording
* Missing/insufficient visual assets such as logo and cover photo
* No Google reviews

A separate duplicate-search check should still be documented before making any changes.

---

### 2. What primary category are you proposing, and what's your reasoning against at least one plausible alternative you considered and rejected?
=>
### Proposed primary category:

> **Engineering consultant**

### Reasoning

The company provides a broad range of engineering, geotechnical investigation, drilling, testing, pile testing, geophysical, bridge/pavement, and non-destructive testing services.

A broad engineering category therefore represents the organization better than choosing a category focused on only one service.

### Alternative considered

A narrower geotechnical-focused category was considered because geotechnical engineering is a major area of the company's work.

However, it could represent only one part of the company's broader service offering.

---
### 3. Write out NS Engineering's real services the way you'd enter them in the GBP Services list. Do they match, in substance, what the `Service` schema components already claim on the site? A real mismatch between the two is a credibility inconsistency worth flagging to your mentor, not something to quietly paper over.
=>
### The services currently represented in GBP are:

1. Drilling
2. Field Investigation
3. Physical and Chemical Material Testing
4. Rock Mechanical Testing
5. Pile Testing
6. Geophysical Surveys
7. Bridge and Pavement
8. Non-Destructive Testing

### These broadly correspond to the official website's service structure:

1. Drilling & Field Investigation
2. Material Testing (Physical & Chemical)
3. Rock Mechanical Testing
4. Pile Testing
5. Geophysical Surveys
6. Bridge & Pavement
7. Non-Destructive Testing

### Conclusion

**Yes, the GBP services match the website in substance.**

The main difference is that GBP separates Drilling and Field Investigation while the website groups them together.

No major service-schema mismatch has been identified.

### 4. What's your proposed minimum posting/review cadence for keeping the profile active and the Q&A section monitored, and why that frequency specifically?
=>
### Proposed minimum maintenance cadence

* **Q&A:** Monitor weekly
* **Reviews:** Monitor weekly
* **Review responses:** Respond within 3–5 business days
* **Google Posts:** Approximately 2 per month
* **Profile information:** Review monthly
* **Performance:** Review monthly
* **Photos:** Update when genuine, useful business/project photos become available

### Reasoning

The proposed cadence is designed to be realistic and sustainable.

The purpose is to maintain accurate and useful information. Reviews and Q&A should be monitored regularly because they can directly affect how potential customers perceive the business, while Posts and photos should only be added when there is genuine company information worth publishing.

---

## Goal 6: AI Search Visibility (GEO) — Testing Whether Retrieval Engines Can Find NS Engineering

### Completion Goal

**Kickoff — paired with mentor.** This is genuinely new territory (the roadmap itself only sketches it in one short "4.3 AI Assistant Optimization" section) — mentor runs the first query round with you so you see what a *useful* answer looks like versus a vague or hallucinated one.

**Then alone.** Query **five** surfaces, not four — Google AI Overviews and AI Mode are Google's own, separate AI-answer products (AI Mode is a full conversational search tab, not just the summary box) and each belongs in this test as much as any third-party tool: ChatGPT, Perplexity, Claude (web search/browsing enabled where available — a plain, non-browsing chat isn't testing retrieval, it's testing training data), Google Search itself for queries that trigger an AI Overview, and Google's AI Mode tab specifically (enable it via labs.google.com if it's not yet automatic in your region). Ask at least 4 real prospective-client questions, mixing category-level phrasing with branded ones — category-level queries are the more informative test, since a branded query ("NS Engineering reviews") tells you much less about real discoverability than a category query does:
- "Who does pile testing in Nepal?"
- "What is PDA testing and who provides it in Kathmandu?"
- "Best geotechnical engineering firm in Nepal"
- "Who does soil investigation for hydropower projects in Nepal?"

Run each query more than once per surface where practical — these are probabilistic systems, and a single response isn't a reliable read, though a handful of runs is a reasonable compromise for an internship-scale test (full statistical rigor would mean 30+ runs per query, more than this goal needs). Turn off memory/personalization where the surface allows it, so prior conversations don't bias what comes up. For each query, on each of the 5 surfaces, record: did NS Engineering come up at all, unprompted? If yes, was the information accurate (does it match what's actually in the site's schema data), or is it outdated/wrong/hallucinated? If no, note what *did* come up instead. Write all of this into `docs/research/AI_SEARCH_VISIBILITY.md`, with a closing section proposing 3 concrete, specific fixes based on what you observed.

**Also required — a content check, not just a query log.** 2026 research on what actually gets cited inside AI-generated answers found measurable lifts from specific, checkable content properties: pages with direct quotes were cited ~28% more often, pages with statistics ~26% more often, and pages that themselves cite sources ~25% more often (treat these as directional industry findings, not guaranteed percentages — same caution as the ranking-weight note in Goal 3). Pick 2 of the site's service or project pages and audit them against this: do they contain concrete numbers, verifiable specifics, or cited sources — or mostly unquantified marketing language ("professional," "reliable," "trusted")? Note what you'd add.

### Checkpoint Concepts

- **AI answer engines are retrieval systems wearing a conversational interface — not a separate kind of "AI SEO magic."** When one of these tools has web access, it's still doing something recognizably like crawling and ranking: it has to find the page, parse it, decide it's trustworthy, and extract a fact from it. Every technical SEO fundamental from Goals 0–2 (crawlability, clean structured data, clear factual statements) is *also* what makes a page usable by an LLM's retrieval step — it's the same foundation, read by a different kind of consumer.
- **Each surface runs multiple, differently-named crawlers, and conflating them is the most common mistake here.** OpenAI runs `GPTBot` (training only), `OAI-SearchBot` (the one that actually builds the index behind ChatGPT's citations), and `ChatGPT-User` (live, user-triggered fetch). Perplexity runs `PerplexityBot` (indexing) and `Perplexity-User` (live fetch). Anthropic runs `ClaudeBot` (training), `Claude-SearchBot` (indexing), and `Claude-User` (live fetch). Google's `Google-Extended` controls *only* whether crawled content trains Gemini/Vertex — it does not gate AI Overviews or AI Mode citation, which are served off the same index Googlebot itself feeds; blocking Googlebot is the only lever affecting both. If this site's `robots.txt` ever changes to manage AI crawler access, the specific bot name matters — see Goal 0 Q6.
- **Ranking well in Google is no longer strong evidence of AI citation.** 2026 research (a May 2026 industry analysis) measured the overlap between top-10 Google organic results and the sources AI answer engines actually cite dropping from roughly 70% to under 20%, with a separate estimate putting it in the 17–38% range depending on methodology — treat the exact number as directional, but the direction itself (a real, large collapse) is corroborated by more than one source. That's the concrete reason this goal exists as its own test instead of being assumed from Goals 1–4 going well — a page can win at classic SEO and still be invisible to GEO. Worth knowing too: Google upgraded AI Overviews to Gemini 3 on 2026-01-27, which reportedly replaced roughly 42% of previously-cited domains — a real discontinuity, meaning any pre-2026 AI-citation data you find while researching this isn't a safe baseline to compare against.
- **Structured data is arguably more valuable to an AI than to a human reader.** A JSON-LD `Person` schema saying `"jobTitle": "Director", "worksFor": "NS Engineering", "knowsAbout": ["Pile Driving Analyzer Testing"]` is close to the exact shape an LLM's retrieval step wants — clean entities and relationships, not prose it has to parse and hope it interpreted correctly. Google has said this directly for AI Mode: it uses structured data to verify claims and assess source credibility, which is exactly why Goal 2's schema audit and this goal are the same investigation from two angles. Goal 5's GBP work connects here too — Google's AI Overviews/AI Mode ground local-intent answers in Maps/GBP data specifically, so a query like "who does pile testing in Nepal" may draw on that listing as much as on the site's own schema.
- **Each surface has its own, distinct citation behavior — don't treat "AI search" as one thing.** Perplexity is reported to weight freshness heavily (recently-updated content earning meaningfully more citations, directional industry finding, not Perplexity-confirmed) and favors claims corroborated across multiple sources over one lone authoritative page. Claude is reported to weight sentence/passage-level structure unusually heavily — a single well-structured, self-contained factual paragraph can get cited even from an otherwise middling page. Google's AI Mode reached roughly 1 billion monthly active users by May 2026 and is increasingly agentic (early task-completion features in some markets since April 2026), which argues for testing it with task-style prompts, not just informational ones, going forward.
- **A wrong or outdated AI answer is a real, measurable problem — not a shrug-worthy "well, AI hallucinates."** If ChatGPT names a competitor instead of NS Engineering, or gets a service wrong, that's a citation NS Engineering lost, in a channel that's only going to matter more, not less.
- **There is now an explicit ethical line here, not just a technical one.** Google confirmed on 2026-05-15 that manipulating AI Overviews/AI Mode — buying or faking citations to game what the AI surfaces — is a formal spam policy violation, enforced through the same demotion mechanisms as regular ranking spam. The 3 fixes you propose need to be about genuinely earning citation-worthy content (accuracy, specificity, real structured data), not about gaming the answer engine. That's not just an ethics footnote; it's a policy violation Google will act on.
- **`llms.txt` is real but currently low-leverage — say so with evidence, not a hunch.** It's a proposed, non-standardized file telling AI crawlers what a site considers citable. An independent June 2026 measurement (Ahrefs) found **97% of llms.txt files received zero AI-bot requests** in May 2026, despite roughly 10% of a 300k-domain sample having adopted the file — and Google has explicitly said the file isn't required for AI search inclusion. Understand what problem it's trying to solve, but don't recommend building it as one of your 3 fixes unless you can point to evidence adoption has changed since this was written.
- **This goal's success is measurable later, not just observable now — that's what Goal 7's GA4 work is for.** GA4's default channel grouping now buckets AI-assistant referral traffic (ChatGPT, Gemini, Claude, Perplexity) separately instead of miscategorizing it as Direct or Referral. Once analytics exists, "did our GEO fixes work" becomes a traffic question you can actually answer, not just a citation-count guess.

### Questions to Answer

1. Across your 4+ queries and 5 surfaces (ChatGPT, Perplexity, Claude, Google AI Overviews, Google AI Mode), did NS Engineering ever get mentioned unprompted? Where, and how accurately?
2. Pick one query where NS Engineering did *not* come up. What organization or source did come up instead? What does that source have (a directory listing, a review site, a competitor's site) that NS Engineering's site currently doesn't?
3. From your content check: did the 2 pages you audited already contain citable specifics (numbers, named standards, cited sources), or mostly unquantified claims? What's one real sentence you'd rewrite, and what would you add to it?
4. Of the 5 schema types validated in Goal 2, which one do you think is most directly useful to an AI trying to answer "who does X in Nepal" — and is that schema actually present on the pages most likely to be the right answer to that question?
5. Propose your 3 concrete fixes. At least one should be something achievable with existing tools/content this week (not "wait for AI companies to change how they work," and not "add llms.txt" unless you can justify it against what Question in the Checkpoint Concepts above just told you about its actual usage).

---

## Goal 7: Analytics — GA4 Setup and Conversion Tracking

### Completion Goal

**Paired with mentor throughout — this is the one goal that touches production code and real visitor data, and it needs a privacy-aware review before it ships.**

1. Create (or get access to) a GA4 property for the site, and get a Measurement ID.
2. **Decide, and write down your reasoning, before building anything:** install via raw gtag.js (e.g. Next.js's `@next/third-parties/google` package, simplest for one tool) or via Google Tag Manager (a small container snippet, then GA4 configured as a tag inside it — more setup now, but it means future tracking events can be added from a dashboard instead of a code deploy, which matters for a project an intern maintains ongoing). Either is defensible; see the Portal Reference's Cluster B for the tradeoff. Wire the measurement ID through an environment variable, never hardcoded.
3. Decide NS Engineering's Consent Mode posture. Consent Mode v2 is legally required for EEA/UK visitors — check with your mentor whether this site realistically gets EU traffic; if genuinely no, document that decision rather than skipping it silently, since it's the kind of thing that's easy to get wrong quietly.
4. Define exactly 3 **key events** to start (GA4's current term for what used to be called "conversions" — not the roadmap's full list of 10+): contact form submission, a `tel:` phone-number click (not automatic — needs a manual event or a GTM click trigger), and one more you argue for. Over-instrumenting on day one produces noise nobody reads; start small and prove the pipeline works.
5. Verify events are actually firing — using GA4's Realtime report or DebugView, not just trusting that the code looks right — before calling this done. Ad blockers block a meaningful share of gtag.js traffic outright, so some undercounting is expected and not itself a bug; what you're checking is that the pipeline works at all.
6. Document the setup, the 3 events, and *why those three*, in `docs/technical/ANALYTICS_SETUP.md`.

### Checkpoint Concepts

- **You cannot optimize what you don't measure — but measuring everything is the same as measuring nothing.** Three well-chosen key events you'll actually look at beat fifteen events nobody reviews. This is a judgment call, not a technical one.
- **Analytics is also a privacy decision, not just an engineering one.** GA4 by default collects real visitor data — this is exactly why this goal is paired, and exactly why the roadmap lists a cookie-consent banner and privacy-policy page as prerequisites for Phase 5, not afterthoughts.
- **GTM vs. raw gtag.js is a real decision, not a coin flip.** GTM adds a layer of indirection but decouples tracking changes from code deploys — worth deciding deliberately rather than defaulting to whichever you've heard of.
- **This closes the loop on Goal 6, not just this goal.** GA4's default channel grouping now separates AI-assistant referral traffic (ChatGPT, Gemini, Claude, Perplexity) from ordinary Direct/Referral traffic — once this ships, "did our GEO fixes actually produce visits" becomes a real, checkable number instead of a citation-count guess.
- **This is the goal that finally answers whether any of Goals 0–6 worked.** Everything before this was "does the site *look* correct to search engines and AI." GA4 is the first place you'll see whether real humans (and, per the point above, AI-assistant referrals) are actually finding the site and doing something once they arrive.

### Questions to Answer

1. Why 3 events and not the full list the roadmap sketches? What would you look at first, a week after this ships, to know it's working?
2. What's the actual difference between GA4's automatic page-view tracking and a manually fired `event()` call — when do you need the second one at all?
3. Is Cloudflare's built-in Web Analytics (already available with zero code changes, cookieless, and able to see raw crawler/bot hits at the edge that GA4's JS-tag approach often misses) redundant with GA4, or measuring something different? Given that Cloudflare Analytics has no custom events, funnels, or campaign attribution, is there a case for keeping both rather than picking one?
4. Which installation method did you choose — raw gtag.js or GTM — and why, specifically for this project rather than in the abstract?

---

## Goal 8: The Bridge — Turn the Audit Into a Real, Prioritized Plan

### Completion Goal

Go back to `docs/SEO_OPTIMIZATION_ROADMAP.md` and update it for real, based on everything you found in Goals 0–7 — not by re-reading it uncritically, but by correcting its phase percentages and checklists against what you actually verified. Specifically make sure section 3.6 (FAQ Schema Optimization) reflects what you found in Goal 2 — it was written before FAQ rich results were retired, and it's the clearest example in this whole doc of a plan going stale under real-world change. Add a section on Google Business Profile — the roadmap as written barely touches local/GBP at all, and Goal 5 likely produced the single highest-leverage finding in this whole project; make sure it's reflected as a real, prioritized item, not a footnote. Add a short new section: your top 5 highest-impact, most-honest next actions, ranked, each with a one-line reason it's ranked where it is, and a note on when this audit should be re-run given core updates now land roughly every 3 months. Present this — roadmap update plus your 5-item plan — to your mentor as a real conversation, the same way you'd report findings to a client.

### Checkpoint Concepts

This goal is supposed to feel like the payoff, not a new lesson — same as Goal 9 in the State Management module. If your update to the roadmap is honest, some of its 90%/50%/20%/10%/0% numbers will move, some might not, and you should be equally comfortable reporting "this was already fine" as "this was wrong." The actual skill this module was building the whole time wasn't any single tool (Lighthouse, the schema validators, PageSpeed Insights, ChatGPT, Google Business Profile) — it was **learning to read what a machine, human or AI, actually needs from a page or a profile to trust and surface it**, and being willing to say clearly what's true, what's aspirational, and what's still just a checklist with nothing behind it. You should also, by this point, be able to tell the difference between a fact one of these portals stated directly and an industry estimate reported about it — that distinction, more than any specific 2026 stat in this document, is the one that'll still be useful once every number here is out of date.

---

*This document is your contract for the project. When you complete Goal 8, update the header with the completion date.*
