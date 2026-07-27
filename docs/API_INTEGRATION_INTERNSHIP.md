# State Management Fundamentals — Internship Project Guide

**Project**: NS Engineering Website — eLibrary: from mock API to real backend
**Intern**: Ritika Kunwar
**Mentor**: Shobhit Tripathi
**Branch**: `feature/ritika-stage`
**Started**: TBD


---

## How to Use This Document

Same contract as the Cloudflare Migration guide: every goal has a **Completion Goal** (the concrete deliverable), **Checkpoint Concepts** (what the goal is actually teaching), and **Questions to Answer** (write these down before moving on — they're what your mentor checks). Check in with your mentor at the end of each goal.

Some of what's ahead (CORS, sessions) is genuinely new terrain, not a recipe you can follow start to finish like the Cloudflare deployment steps were — those goals say explicitly, inside the Completion Goal, where mentor pairing happens. Where it's the same pattern applied a second time, you're expected to run it alone.

**What this module is actually about.** Every goal below touches an API somewhere, but the API is the vehicle, not the destination. The real subject is **state** — where a piece of data lives, who owns it, when it's allowed to go stale, and what breaks when two places think they own the same thing at once. API integration is just the sharpest, most concrete place to learn that, because the moment data crosses a network boundary, every state mistake stops being theoretical and starts being a visible bug.

**Why this project is real, not an exercise:** the Standard Codes section you'll eventually rebuild against a real backend is the same content the Lab Incharge role — which NS Engineering is actively building — will be responsible for finalizing (ISO/ASTM codes). Newsletters, curated papers, and company documents will be maintained by stakeholders who already work inside ERPNext every day. This isn't a toy migration. The state you're about to learn to manage correctly is the state that will eventually carry that real content.

---

## Checkpoint Summary

| Goal | Deliverable | Mentor Review |
|------|-------------|:---:|
| 0 | Written HTTP/system-mapping Q&A | Required |
| 1 | Duplicated/derived-state audit + fix, written ownership answer | Required |
| 2 | Reproduced CORS error + explanation | Required |
| 3 | Service layer (2 sections) + one mocked test | Required |
| 4 | Route Handlers for all 5 sections, CORS error gone | Required |
| 5 | Server Component conversion + explicit revalidation strategy | Required |
| 6 | Draft Mode preview feature + cookie-vs-token write-up | Required |
| 7 | 4-state, state-machine search box + race-condition write-up | Required |
| 8 | Shared-state case study (props-first, Context only if earned) | Required if attempted (goal itself is optional — cut first if time-constrained) |
| 9 | Standard Codes running against real ERPNext endpoint | Required (design review before, not just after) |

---

## Skills Check

Update honestly after each goal — this is for you, not a performance review.

| Skill | Not started | Learning | Comfortable | Can teach |
|---|---|---|---|---|
| Naming who owns a piece of state | | | | |
| Spotting derived state stored as if it were independent | | | | |
| Reading HTTP requests/responses in DevTools | | | | |
| Explaining CORS to someone else | | | | |
| Building a service/data-access layer | | | | |
| Mocking a service in a test | | | | |
| Understanding Route Handlers / BFF pattern | | | | |
| Reasoning about server-state staleness and choosing a revalidation strategy | | | | |
| Explaining cookie vs. token tradeoffs | | | | |
| Treating async UI as an explicit state machine (4 states) | | | | |
| Spotting a race condition in async code | | | | |
| Judging when shared state earns Context vs. staying local | | | | |
| Swapping a data source without touching UI code or state ownership | | | | |

---

## Weekly Check-In

One question per week, maximum. Think before you write it — consolidate first, don't drip-feed confusion as it happens.

| Week | Currently on | Blocked on | My one question |
|---|---|---|---|
| | | | |

---

## Vocabulary Reference (framework-agnostic — this is the point)

| Concept | What it means | Next.js name | Elsewhere |
|---|---|---|---|
| Single source of truth | Exactly one owner for a piece of state | `useState` in the closest common parent | Same rule in every framework — Angular signals, Vue reactivity, React state |
| Derived state | Computed from existing state, not stored separately | Computed inline on render | Same concept everywhere — computed properties (Vue), memoized selectors (Redux) |
| Data access layer | One place that knows the data source exists | `src/lib/api/*.ts` module | React: custom hook / service module. Angular: `@Injectable()` service. Vue: composable |
| Backend-for-Frontend | Server-side proxy between browser and real backend | Route Handler | Express/Node server in front of a React SPA. NestJS controller for Angular |
| Same-Origin Policy | Browser blocks cross-origin reads unless explicitly allowed | CORS error in dev console | Identical in every framework — it's a browser rule, not a library rule |
| Server state | Data owned elsewhere, can go stale, shared | Fetched in Route Handler / Server Component | React Query, SWR, Angular's `HttpClient` + RxJS |
| Client state | Data the UI owns outright | `useState` | Same concept in every component framework |
| Staleness / revalidation | How old server state is allowed to be before it's wrong | `revalidate` / `revalidatePath` / `revalidateTag` | Cache TTLs, SWR's `mutate()`, React Query's `staleTime` |
| Session mechanism | How a stateless protocol remembers who you are | Draft Mode cookie | `HttpOnly` cookies (any framework), `Authorization: Bearer` tokens (any framework) |
| Four UI states | Loading / error / empty / success, as a state machine | Manual `if` branches or Suspense boundaries | Same four states, every framework, no exceptions |
| Race condition | Later request resolves before an earlier one | Stale closure in `useEffect` | Same root cause in any `async/await` code, any language |
| Shared/global state | State needed by components with no direct parent-child link | React Context | Redux/Zustand (React), Angular services + RxJS, Vuex/Pinia (Vue) |

---

## Notes Space

**Open questions:**

**Decisions made:**

**Blockers:**

---

## The Big Picture

### Where We Are Today

```
Browser (ELibraryClient.tsx)
        │
        │  raw fetch(), directly from the component
        ▼
   json-server ──── db.json
   (fake REST API, no auth, no persistence beyond a file)
```

This is disconnected from the site's real content pipeline:

```
Google Sheets ──▶ build-content.ts ──▶ CSV (git) ──▶ src/data/generated/elibrary.json
                                                              │
                                                              ▼
                                                   baked into the static export at build time
```

Two systems, two different eLibrary implementations, not yet talking to each other. That's fine — json-server was always meant as training wheels, not the real thing. This module is about closing that gap correctly — and about knowing, at every point along the way, exactly which piece of state you're looking at and who's allowed to change it.

### Where We Are Going

```
Browser (ELibraryClient.tsx)
        │
        │  calls your own service layer — src/lib/api/elibrary.ts
        ▼
Next.js Route Handler (src/app/api/elibrary/.../route.ts)
        │
        │  the ONLY thing that knows where the real data lives
        ▼
   ┌────────────────────┬─────────────────────────┐
   │  json-server        │   real Frappe/ERPNext   │
   │  (today, dev only)  │   REST endpoint         │
   │                     │   (Standard Codes first)│
   └────────────────────┴─────────────────────────┘
```

The component never changes when the right side swaps. That's the entire point of this module — if you have to touch `ELibraryClient.tsx` to change where data comes from, the abstraction failed. It failed specifically because some piece of state leaked into a place that shouldn't have known about it.

---

## Local Setup — Before Goal 0

You need two things running at once, in two separate terminals:

1. `npm run json:server` — starts json-server on port 5002, serving `db.json`.
2. `npm run dev` — starts the Next.js dev server (default port 3000).

You also need `.env.local` to set `NEXT_PUBLIC_API_URL=http://localhost:5002`. Without it, `ELibraryClient.tsx` silently falls back to the static generated JSON and never calls json-server at all — if Goal 0's Network tab shows nothing for eLibrary, this is the first thing to check.

---

## Goal 0: Map What Exists — HTTP and the Current Wiring

### Completion Goal

**Part A — walk it together first.** Mentor will open the Network tab with you, click around the eLibrary page, and narrate what's happening for one real request: method, URL, status code, request headers, response headers, response body.

**Part B — alone.** Work through the Questions to Answer below in writing.

### Checkpoint Concepts

- **HTTP is the contract, not the framework.** You cannot design a state layer for a protocol you don't understand — status codes, headers, methods, and caching all sit on top of HTTP, and React, Angular, and Next.js are all just different ways of issuing the same GET/POST/PUT/DELETE requests and reading the same status codes. Learn the contract once, it works everywhere.

### Questions to Answer

### 1. Trace one click on the eLibrary page all the way to a rendered document card. Where is `fetch()` called? What URL does it hit? What port is json-server running on vs. the Next.js dev server?
=> 
#### Step 1: User opens the eLibrary page.
The user navigates to the eLibrary page in the browser. This causes the page and its React components to start loading.
#### Step 2: React component loads.
During this stage, React initializes the component and prepares it to display data.
#### Step 3: fetch() is executed.
A fetch() call (inside useEffect) runs to request data from the API endpoint, for example:

`fetch("http://localhost:5002/newsletters")`
#### Step 4: The browser sends an HTTP request.
The browser creates an HTTP GET request and sends it to the specified URL to retrieve the requested resource.
#### Step 5: Request goes to json-server.
The request reaches the json-server running on your local machine. It acts as a mock backend server that handles API requests.
#### Step 6: json-server reads db.json.
json-server looks inside the db.json file, finds the requested collection (such as newsletters or standard-codes), and prepares the matching data.
#### Step 7: JSON is returned.
json-server sends the requested data back to the browser as a JSON response, along with a status code like 200 OK.
#### Step 8: React receives the JSON.
The fetch() promise resolves, React converts the response into a JavaScript object using response.json(), and the data becomes available to the component.
#### Step 9: React updates the component state.
The component stores the fetched data using a state setter (for example, setNewsletters(data)). Updating the state tells React that new data is available.
#### Step 10: React renders the document cards on the screen.
React automatically re-renders the component using the updated state. It loops through the data (for example, with .map()) and displays a document card for each item in the eLibrary.

=> `Fetch` is called inside the eLibrary React component (or a helper function used by that component), where the code contains"

await fetch(`${JSON_SERVER_URL}/standard-codes`)

=>
#### Example:

`http://localhost:5002/standard-codes`

depending on which section is being loaded.

### 2. What HTTP method does json-server use to *list* documents? What method would it use to *create* one? Why does the method matter, not just the URL?
=> json-server uses the GET HTTP method to list documents.

#### Example:
`GET /newsletters`

This request retrieves all documents from the newsletters collection in db.json.

=> json-server uses the POST HTTP method to create a new document.

#### Example:

`POST /newsletters`

A POST request sends the new document's data to the server, which adds it to the newsletters collection in db.json.

=> The HTTP method matters because it tells the server what action to perform on the resource.

The URL identifies the resource (e.g., /newsletters).

The HTTP method specifies the operation (e.g., GET to read, POST to create).

### 3. Pick any response from json-server in the Network tab. What status code did it return? Name two other status codes you might see from a real API and what each means in plain terms.
=> For a successful json-server request (such as GET /newsletters), the response returns:

`200 OK` – The request was successful, and the server returned the requested data.

#### Two other common status codes you might see from a real API are:

`201 Created` – A new resource was successfully created (usually after a POST request).
`404 Not Found` – The requested resource or endpoint does not exist on the server.

### 4. What's actually inside `db.json`? Is it the same data as `content/elibrary/*.csv`? Should it be?
=> db.json is the database file used by json-server. It stores data in JSON format. When an API request is made, json-server reads data from (or writes data to) this file.

#### Example
```json
{
  "newsletters": [
    {
      "id": "1",
      "title": "Newsletter"
    }
  ],
  "standard-codes": [
    {
      "id": "2",
      "title": "ISO 9001"
    }
  ]
}
```
#### Explanation
`newsletters` → Creates the endpoint GET /newsletters.

`standard-codes` → Creates the endpoint GET /standard-codes.

Each object inside an array represents one record.

`id` uniquely identifies each record.

=> No, it is not necessarily the same data.

`db.json` contains the data served by json-server during development.

`content/elibrary/*.csv` contains the source content used by the project's content pipeline (for example, parsed into JSON during the build).

## CSV vs JSON Example

### CSV

```csv
id,title,fileUrl
1,ISO 9001,https://example.com/iso9001.pdf
```

### JSON

```json
[
  {
    "id": "1",
    "title": "ISO 9001",
    "fileUrl": "https://example.com/iso9001.pdf"
  }
]
```

#### Should it be?

=> Yes, if both are intended to represent the same eLibrary content, they should contain the same data. Keeping them in sync ensures that the application behaves consistently whether it is using the CSV files or json-server as its data source.

### 5. Draw (text or hand-drawn) both diagrams in the Big Picture section from memory, in your own words, before checking them against this doc.
=>
## Request Flow

```text
+----------------------+
|      User clicks     |
+----------+-----------+
           |
           v
+----------------------+
| React Component      |
+----------+-----------+
           |
           | fetch()
           v
+----------------------+
| Browser HTTP Request |
+----------+-----------+
           |
           v
+----------------------+
| json-server          |
| reads db.json        |
+----------+-----------+
           |
           | JSON response
           v
+----------------------+
| React receives data  |
+----------+-----------+
           |
           v
+----------------------+
| State updated        |
+----------+-----------+
           |
           v
+----------------------+
| Document Cards shown |
+----------------------+
```
---

## Goal 1: Local State Fundamentals — Before Anything Crosses a Network

### Completion Goal

Pair with your mentor on this one — the point is to build the instinct for spotting ownership bugs together, before you're expected to catch them alone.

Before touching a single API, audit `ELibraryClient.tsx` and its children for any piece of data that's tracked in more than one place — a value held in `useState` in a parent *and* mirrored into a child's own state, a filter value duplicated instead of passed down, anything where two components could plausibly disagree about the same fact.

1. If you find a real instance: fix it by lifting the state up to the closest common parent and passing it down, then delete the duplicate.
2. If you don't find one (the component tree may already be clean): build a small, throwaway two-component example — a search box and a result count, each keeping its own copy of the search term — trigger the drift on purpose (update one, watch the other lag), then fix it the same way.

### Checkpoint Concepts

Most state bugs are ownership bugs, not logic bugs. The code usually "works" — right up until two places that both think they own the same fact drift apart. Before any network call ever enters the picture, you need to be fluent in the question "who owns this value, and is there exactly one of it?" This is framework-free — Angular signals, Vue's reactivity, React's `useState` all follow the same rule.

- **Single source of truth.** Every piece of state should have exactly one place that owns it. Everywhere else either reads it (via props) or asks the owner to change it (via a callback) — never holds a second copy.
- **Derived vs. stored state.** If a value can be computed from other state you already have, compute it on render — don't store it separately and hope you remember to update both. Storing something derivable is the single most common way state silently drifts.

### Questions to Answer

### 1. Which value was the *source of truth*, and which was a copy that shouldn't have existed?

=> `Source of truth`: The five state arrays (`standardCodeItems, publicationItems, curatedPaperItems, downloadItems, and newsletterItems`) are the source of truth in this component. They contain the current eLibrary items for each section. They are initially populated from the static data object and are replaced with the latest data when it is fetched from the JSON server. All rendering, searching, and item counts are based on these state variables.

=> `Copy that shouldn't have existed`: In the current version of ELibraryClient.tsx, there is no unnecessary duplicate copy of these arrays. Values such as filteredItems and sectionCounts are derived from the source-of-truth state using useMemo and are recalculated whenever the state changes, rather than being stored as separate state. Therefore, this component does not contain duplicated state that could become out of sync.

### 2. Find one place in `ELibraryClient.tsx` where a value is stored in `useState` but could instead be *derived* on every render from something else already in state (e.g., a filtered list computed from a full list + a search term, instead of stored as its own state that must be kept in sync manually). Explain why storing it was the riskier choice.

=> Currently, the component stores five separate loading flags:

```tsx
const [isStandardCodeLoading, setIsStandardCodeLoading] = useState(false);
const [isNewsletterLoading, setIsNewsletterLoading] = useState(false);
const [isPublicationLoading, setIsPublicationLoading] = useState(false);
const [isCuratedPaperLoading, setIsCuratedPaperLoading] = useState(false);
const [isDownloadLoading, setIsDownloadLoading] = useState(false);
```

These values are later combined to determine whether the currently active section is loading:

```tsx
const isActiveSectionLoading =
  (activeSection === 'standard-codes' && isStandardCodeLoading) ||
  (activeSection === 'newsletters' && isNewsletterLoading) ||
  (activeSection === 'publications' && isPublicationLoading) ||
  (activeSection === 'curated-papers' && isCuratedPaperLoading) ||
  (activeSection === 'downloads' && isDownloadLoading);
```

Since the application only fetches data for **one active section at a time**, the component does not need five separate loading flags. Instead, it could store a single state representing **which section is currently loading**:

```tsx
const [loadingSection, setLoadingSection] = useState<ELibrarySection | null>(null);

const isActiveSectionLoading = loadingSection === activeSection;
```

## Why is the current approach riskier?

* The loading information is spread across five separate state variables, making it easier to accidentally leave one of them set to `true`.
* Adding a new eLibrary section requires creating another loading state and updating the logic that checks which section is loading, increasing the chance of mistakes.
* Using a single `loadingSection` state is simpler because it represents the real information directly: **which section is currently loading**. The value `isActiveSectionLoading` can then be derived by comparing `loadingSection` with `activeSection`, ensuring that only one section can be considered loading at a time.

---

## Goal 2: Reproduce a Real CORS Error

### Completion Goal

Right now, `ELibraryClient.tsx` calls json-server directly, at whatever `NEXT_PUBLIC_API_URL` points to. Temporarily change `.env.local` to point that same call at json-server running on a different origin (different port counts as different origin) than what it runs on today — e.g. run a second json-server instance with `--port 5003` and point `NEXT_PUBLIC_API_URL` there instead of 5002. Trigger the request. Open DevTools console. Screenshot/paste the exact error. Pair with your mentor on this one — CORS is genuinely new terrain.

**What to expect:** the page keeps rendering normally. The fetch fails, the console shows the CORS error, and the component quietly falls back to the static JSON — that graceful fallback is by design, not a sign you broke something. The error you're looking for lives only in the console, not on the page.

### Checkpoint Concepts

CORS is a browser security feature, not a bug. The browser enforces the Same-Origin Policy: JavaScript running on one origin cannot read responses from a different origin unless that origin explicitly allows it. This is *the* concrete, physical reason you need something standing between the browser and a raw API — not an abstract architecture preference. It's also the real reason **server state and client state have to be architecturally separated**, not just conceptually separated. You're about to feel the wall before you build the door around it — and the door you build is going to become the one place server state is allowed to enter your app.

- **Same-Origin Policy.** Origin = scheme + host + port. Change any one of the three and you've crossed a security boundary the browser enforces for you, whether you meant to or not.

### Questions to Answer

### 1. Why did the browser block this, when the same URL works fine if you `curl` it or paste it directly into the address bar?
=> The browser blocked the request because it was made by JavaScript (fetch()) from a different origin. Browsers follow a security rule called the Same-Origin Policy, which only allows JavaScript to read data from another origin if the server gives permission through CORS headers.

The same URL works with curl because curl is not a web browser and does not enforce the Same-Origin Policy. It also works when pasted into the browser's address bar because that is a normal page navigation, not a JavaScript request from another website. Since CORS only applies to cross-origin requests made by browser JavaScript, those two methods are not blocked.

### 2. What three things make an "origin" — and which one changed?
=> An origin is made up of three things:

* `Scheme (Protocol)` – for example, http or https

* `Host (Domain/IP Address)` – for example, localhost

* `Port` – for example, 5002 or 5003

 The frontend was running on http://localhost:3000 and the API was accessed at http://localhost:5003. The scheme (http) and host (localhost) stayed the same, but the port changed from 5002 to 5003. Since the port is part of the origin, the browser treated them as different origins and applied the CORS (Same-Origin Policy) security rules.

---

## Goal 3: Extract a Service Layer — One Owner for Server State

### Completion Goal

Look closely at `ELibraryClient.tsx` first: each section (`standardCodes`, `newsletters`, `publications`, `curatedPapers`, `downloads`) already has its own nearly-identical `useEffect` — fetch, loading state, error fallback to static JSON, repeated five times. That repetition is the bad smell this goal fixes.

**Standard Codes section — paired with mentor.** Pull the raw `fetch` call out of the component and into `src/lib/api/elibrary.ts`, as a typed function: `getStandardCodes(): Promise<StandardCode[]>`. The component calls this function. It no longer knows a URL exists.

**Publications section — alone.** Repeat the same extraction without help. Compare your version to the paired one before moving on.

**Also required:** write one test that mocks `src/lib/api/elibrary.ts` and asserts `DocumentGrid` renders correctly given fake data — with no real network call happening. Doesn't matter if it's Jest or Vitest, whichever the repo already uses.

### Checkpoint Concepts

This is Goal 1's "single source of truth" rule applied to server state. A service layer is the one place that knows the data source exists — every component downstream reads server data through a typed function instead of holding its own fetch logic. That buys you one error-handling path instead of five, testability (you just proved this by mocking it), and the ability to swap the real implementation later without touching a single component. This concept has no framework — React calls it a "service" or a custom hook wrapping one, Angular calls it a literal `@Injectable() Service`, Vue calls it a composable. Same idea, different name, in every framework you'll ever touch.

- **Data access layer / separation of concerns.** One place owns the fetch; everything else reads through it.

---

## Goal 4: Build the Route Handler — the Real Boundary

### Completion Goal

Mentor demos building `src/app/api/elibrary/standard-codes/route.ts` — a Next.js Route Handler that runs server-side and proxies to json-server. Your `src/lib/api/elibrary.ts` from Goal 3 now calls `/api/elibrary/standard-codes` (your own app) instead of json-server directly.

Then, alone: do the same for Publications, Newsletters, Curated Papers, Downloads.

**Verify:** re-trigger the Goal 2 cross-origin setup one more time, pointed at your new Route Handler instead of json-server directly. The CORS error is gone, because the browser only ever talks to its own origin now — json-server is only ever contacted server-side.

### Checkpoint Concepts

The Route Handler is a Backend-for-Frontend (BFF). It's the one place a real API key or secret could live safely — the browser never sees past it. It's also the seam where server state physically enters your app for the first time. Every framework has an equivalent: Next.js Route Handlers, a small Express server in front of a React SPA, a NestJS controller for Angular. The name changes; the job — "one trusted place that talks to the real backend, so the browser doesn't have to" — never does.

- **Backend-for-Frontend (BFF) / API proxy.**

---

## Goal 5: Server State Lifecycle — Freshness and Revalidation

### Completion Goal

1. **Paired with mentor.** Convert the eLibrary listing from client-side `fetch` in `useEffect` to a Server Component fetch — data is fetched when the page renders on the server, not after it loads in the browser.
2. **Alone.** Implement one explicit revalidation strategy for this data — either time-based (`revalidate` / `next: { revalidate: N }`) or on-demand (`revalidatePath`/`revalidateTag` triggered by an action). Justify which one fits Standard Codes data (how often does it actually change?) versus something like a live search result (which shouldn't be cached at all).

### Checkpoint Concepts

Server state has a lifecycle that local state doesn't: it can go stale without your code doing anything wrong. The data was correct when you fetched it — the world just moved on. Deciding *when* to refetch is a real design decision, not a default you accept from whatever framework you're using.

- **Staleness and revalidation.** Every piece of server state has an implicit answer to "how old is this allowed to be before it's wrong?" Some data (a Standard Code) is stale-tolerant — minutes or hours old is fine. Some (a live search box) isn't — stale for one keystroke is a visible bug. Naming which kind you're looking at is the actual skill.
- **Why libraries like React Query / SWR exist.** They're not fetching libraries — `fetch` already fetches. They're staleness-and-cache-management libraries: they answer "is this data still good, or do I need to go get it again" so you don't hand-roll that logic per component. You just built the hand-rolled version, which is exactly why the library will make sense the first time you reach for one.

### Questions to Answer

### 1. If the underlying ERPNext data changes after this page was last rendered, when does a user actually see the new value? Trace it through — is it never, until a rebuild? On every request? Somewhere in between?
=>
When a user opens the eLibrary page, the data is fetched on the server by getAllELibrarySections() before the page is rendered, and the resolved data is passed to ELibraryClient as props. In a normal Next.js server deployment, the fetch call is configured with next: { revalidate: 21600 }, so the cached data would remain valid for six hours. After the cache expires, the next request would automatically fetch the latest ERPNext data and update the cache. This means users would see updated data somewhere in between—not on every request and not only after a full rebuild.

However, this project uses output: 'export' and is deployed as a static Cloudflare Pages site. In this deployment there is no running Next.js server, so the revalidate option is not actually executed. Instead, the site is rebuilt and redeployed every six hours through the scheduled GitHub Actions workflow. Therefore, if ERPNext data changes after deployment, users continue to see the old data until the next scheduled rebuild generates a new static site. The configured revalidate option documents the intended caching policy and will become active automatically if the project later moves to a server-capable Next.js deployment

---

## Goal 6: Sessions and Cookies — State That Must Survive Across Requests

### Completion Goal

Using Next.js **Draft Mode**, build a real feature: an unpublished eLibrary item (e.g., a Standard Code not yet public) can be previewed by whoever has the draft-mode cookie, and stays invisible to everyone else. Implement it for one section, pairing with your mentor — sessions are genuinely new terrain. Inspect the cookie Draft Mode sets in DevTools → Application → Cookies.

### Checkpoint Concepts

A cookie is state that outlives a single request — HTTP itself is stateless, so "remembering who you are" between one request and the next has to be bolted on deliberately. That's a different problem from anything in Goals 1–5: not "who owns this value in memory right now," but "how does this value survive the gap between two completely separate requests."

- **Session cookies vs. tokens.** httpOnly cookies: the browser sends them automatically, JavaScript can't read them (safe from XSS stealing them), but that automatic sending is exactly what CSRF exploits. Tokens in localStorage: immune to CSRF (nothing is sent automatically), but readable by any script on the page (vulnerable to XSS). This tradeoff is universal — Angular's `HttpOnly` cookie handling and React's `Authorization: Bearer` header patterns are solving the exact same problem, framework-free.

### Questions to Answer

1. What's actually in the cookie Draft Mode set?
2. What would happen if this were a **token in localStorage** instead of a cookie? Name one attack each approach is vulnerable to (XSS vs. CSRF) and one it isn't.
3. Where does the draft-mode secret live? Could it ever safely be a `NEXT_PUBLIC_*` variable? Why not — read the comment already sitting above `JSON_SERVER_URL` in `ELibraryClient.tsx` before you answer, then tie it back to what you learned about environment secrets in the Cloudflare project.

---

## Goal 7: Async State as a State Machine — Four Required States

### Completion Goal

Keep client-side fetching only where real interactivity needs it (e.g., a live search/filter box over the eLibrary listing) — implement that box with all four states explicitly handled: **loading, error, empty (zero results), and success.** Not just the happy path. Run this one alone.

### Checkpoint Concepts

A component's async state is a state machine whether you name it one or not. Treating "loading," "error," "empty," and "success" as one variable with exactly one value at a time — instead of four independent booleans that can theoretically all be true simultaneously — is what prevents entire categories of "why is the spinner still showing" bugs.

- **Four UI states, always.** Loading / error / empty / success. A component that only handles success is a component that hasn't shipped yet.
- **Race conditions in async UI.** Promises resolve in completion order, not request order. This is not a Next.js quirk — it's true of every `fetch`/`async`/`await` call in every framework. Recognizing it here means you'll recognize it in React, Angular, or plain JS forever after.

### Questions to Answer

1. Name the transitions, not just the states: what event moves you from `loading` → `success`? From `success` → `loading` again (a new search)? Can you go straight from `error` → `success` without passing through `loading`, or should you not be able to?
2. Deliberately break something: fire the search rapidly (type fast, or add an artificial delay) and describe what happens if an earlier, slower request resolves *after* a later, faster one. Did you get a race condition? How would you prevent stale results from overwriting fresh ones?

---

## Goal 8 (Optional): Shared State — When Context Earns Its Keep

*This goal is the first one to cut if the module is running long — it's valuable but not load-bearing the way Goals 0–7 are.*

### Completion Goal

Find (or construct) a case where a piece of state is genuinely needed by two components that aren't in a direct parent-child relationship — for example, a search/filter term that both the search box and a separate "showing N of M results" display both need, with an unrelated component between them.

1. First, solve it the boring way: lift the state to the nearest common ancestor and pass it down through props, even if that means threading it through a component that doesn't itself use it.
2. Count how many levels deep you had to thread it. If it's one or two, stop — that's not a Context problem yet.
3. Only if the threading is genuinely painful (three-plus levels, or multiple unrelated consumers), refactor to React Context instead. Have your mentor review the props-first solution *before* you decide whether to escalate — that review is the actual checkpoint, not a rubber stamp at the end.

### Checkpoint Concepts

Context is not "global state for React" — it's a fix for a specific symptom (painful prop threading), and reaching for it before you feel that symptom usually makes things worse, not better, because it hides who actually depends on what. Every framework has this same escalation ladder, and every framework's community has the same scar tissue from skipping straight to the top of it.

- **Prop drilling vs. shared state, and why order matters.** Try local state → lift state up → only then reach for Context (or Redux/Zustand/etc.). Skipping straight to global state for something two components could've shared via props makes it harder to know what a component actually depends on, not easier.

### Questions to Answer

1. Why did Context solve *this specific* pain, and why did you not reach for it first?

---

## Goal 9: The Bridge — Swap Standard Codes to a Real Backend

### Completion Goal

Point `src/lib/api/elibrary.ts`'s Standard Codes functions at a real Frappe/ERPNext REST endpoint (built in a dev sandbox — mentor will scaffold the DocType side) instead of json-server. Run this one alone, but flag the public-exposure design (read-only, published-only, rate-limited) to your mentor for review before implementing it — that's a mentor-level decision, not yours to solve alone.

**Nothing else should change.** Not the Route Handler's shape, not the component, not the tests (beyond re-pointing the mock), not who owns which piece of state. If you find yourself editing `ELibraryClient.tsx` to make this work, stop — that means an earlier goal's ownership boundary leaked, and it's worth figuring out exactly which one before continuing.

### Checkpoint Concepts

This goal is supposed to feel anticlimactic. That anticlimax is the entire state-ownership model paying off — the swap from a fake backend to a real one should be boring, contained to one file, and invisible everywhere else. If it isn't boring, that's a debugging exercise in itself: some state leaked past a boundary that was supposed to contain it.

---

*This document is your contract for the project. When you complete Goal 9, update the header with the completion date.*
