# Cloudflare Migration — Internship Project Guide

**Project**: NS Engineering Website — GitHub Pages → Cloudflare Pages  
**Intern**:Ritika Kunwar  
**Mentor**: Shobhit Tripathi  
**Branch**: `feature/cloudflareMigration`  
**Started**: 2026-04-29

---

## How to Use This Document

This is your primary reference for the entire project. Every goal has two parts:

- **Completion Goal** — the concrete deliverable. You are done when you can demonstrate this.
- **Learning Goal** — the concept behind it. Understanding the *why* matters more than finishing the task.

Check in with your mentor at the end of each goal before moving to the next. The checkpoint is not a formality — some goals unlock the next one, and a misunderstanding early will cost you days later.

---

## The Big Picture

### Where We Are Today

```
Developer pushes code
        ↓
  GitHub Actions
  ┌─────────────────────────────────────────────┐
  │ Job 1: Sync media (Google Drive → R2)       │
  │ Job 2: Build site (Sheets → CSV → HTML/JS)  │
  │ Job 3: Deploy to GitHub Pages               │
  │ Job 4: Commit CSV snapshots back to Git     │
  └─────────────────────────────────────────────┘
        ↓
  GitHub Pages (one environment, one URL)
        ↓
  DNS: nsengineering.com.np → GitHub Pages
```

A single Cloudflare Email Worker handles the contact form.  
Cloudflare R2 hosts all images and PDFs.  
Cloudflare Turnstile protects the contact form from bots.

### Where We Are Going

```
Developer pushes to main
        ↓
  GitHub Actions
  ┌─────────────────────────────────────────────┐
  │ Job 1: Sync media (Google Drive → R2)       │
  │ Job 2: Build site ONCE → artifact           │
  │ Job 3: Auto-deploy artifact → dev           │
  │ Job 4: Approval → promote artifact → stage  │
  │ Job 5: Approval → promote artifact → prod   │
  │ Job 6: Commit CSV snapshots back to Git     │
  └─────────────────────────────────────────────┘
        ↓
  Three isolated Cloudflare Pages environments:
    dev.nsengineering.com.np   (always live, auto-deployed)
    stage.nsengineering.com.np (promoted after review)
    nsengineering.com.np       (promoted after staging passes)

  Each environment has its own Email Worker and Turnstile keys.
```

---

## Goal 0: Orientation — Read the Codebase Before Touching It

### Completion Goal

Answer the following questions in writing (a short notes file is fine). Walk your mentor through your answers in a 30-minute session.

1. What does `npm run build:cloud` do, step by step? Trace it from the npm script to the final `out/` directory.
=>
step 1 : npm reads the script
npm run build:cloud looks into the package.json file and finds the corresponding script
step 2 : Load cloud environment variables
The command used :
dotenv -e .env.cloud
step 3 : set build mode
Next, this part runs:
cross-env CONTENT_SOURCE_MODE=sheets
This sets an environment variable:
CONTENT_SOURCE_MODE = sheets
This tells the system to fetch content from Google Sheets (cloud source) instead of local files like CSV.
Step 4: Run the build script
The main script is executed:
tsx scripts/build-content.ts
This TypeScript file controls the full build process.
Step 5: Fetch content from cloud
Step 6: Process and transform content
Step 7: Generate static website

2. What is the difference between `CONTENT_SOURCE_MODE=csv` and `CONTENT_SOURCE_MODE=sheets`? When is each used?
3. Why does the GitHub Actions pipeline have four separate jobs instead of one big script?
4. What is rclone and what specific problem does it solve here?
5. What is Cloudflare Turnstile and what happens to the contact form if the Turnstile token is missing or invalid?
6. What is the `CNAME` file in the repo root? Why does it exist and what will happen to it after this migration?
7. List all GitHub Actions secrets the pipeline uses today. For each one, write one sentence on what it does.

**Files to read**:
- `CLAUDE.md` (project overview)
- `.github/workflows/deploy.yml` (the pipeline)
- `package.json` (build scripts)
- `next.config.ts` (static export config)
- `src/lib/emailService.ts` (email worker integration)
- `TURNSTILE_IMPLEMENTATION.md` (spam protection)
- `GITHUB_SECRETS_SETUP.md` (secrets reference)

### Learning Goal

**Read before you write.** The most expensive engineering mistakes come from building on top of a system you did not fully understand. In a professional setting, you will rarely be handed a greenfield project — you will inherit someone else's work. The ability to read an unfamiliar codebase and build an accurate mental model of it is one of the most valued skills a junior engineer can develop.

> Key concept: **System mapping.** Before designing a new system, you must be able to draw the old one accurately. If your diagram is wrong, your migration plan will be wrong.

---

## Goal 1: Understand Why We Are Leaving GitHub Pages

### Completion Goal

Write a short document (half a page) that answers: *why is GitHub Pages insufficient for a multi-environment deployment model?* Cover these specific points:

- What is the maximum number of deployment environments GitHub Pages supports per repository?
- What kind of approval mechanism does GitHub Pages offer before a deployment goes live?
- What control do you have over HTTP caching headers on GitHub Pages?
- What does it mean that GitHub Pages is "vendor-coupled" to GitHub Actions in this context?

This is not a Google-copy exercise. Explore the GitHub Pages documentation, try to find the limits, and form your own opinion.

### Learning Goal

**Evaluate tools against requirements, not reputation.** GitHub Pages is an excellent tool. It is the wrong tool for this job. Good engineers do not pick tools because they are familiar or popular — they pick tools because the tool's capabilities match the problem's requirements.

> Key concept: **Fitness for purpose.** Every hosting platform makes trade-offs. GitHub Pages optimises for simplicity. Cloudflare Pages optimises for edge performance, environment isolation, and Workers integration. Understanding what a platform is optimised *for* tells you what it is optimised *against*.

---

## Goal 2: Understand Cloudflare Pages

### Completion Goal

You should be able to explain the following without looking anything up:

1. What is a Cloudflare Pages **project**? What is a Cloudflare Pages **deployment**?
2. What is the difference between a **preview deployment** and a **production deployment** in Cloudflare Pages?
3. What does `wrangler pages deploy <directory> --project-name <name>` do? How is this different from connecting Cloudflare Pages directly to a GitHub repository?
4. What is `wrangler.toml` and what does the `[env.production]` block inside it do?
5. What is a Cloudflare Worker and how does it differ from the static site itself?

Create a simple hand-drawn or text-based diagram showing: a Cloudflare Pages project, its three environments (dev/stage/prod), and a Worker sitting alongside each environment.

**Resources**:
- Cloudflare Pages documentation: https://developers.cloudflare.com/pages/
- Wrangler CLI documentation: https://developers.cloudflare.com/workers/wrangler/
- Cloudflare Workers documentation: https://developers.cloudflare.com/workers/

### Learning Goal

**Understand the platform before you configure it.** Wrangler, Cloudflare's CLI tool, is an example of **Infrastructure as Code (IaC)** — your infrastructure configuration lives in a file (`wrangler.toml`) that is checked into Git, reviewed like code, and applied by CI. This is the modern industry standard. The alternative (clicking through a dashboard) is not reproducible, not reviewable, and not recoverable if something goes wrong.

> Key concept: **Infrastructure as Code.** If your infrastructure cannot be version-controlled and peer-reviewed, it is not production-grade. The dashboard is for exploration. The config file is the source of truth.

---

## Goal 3: Design the Branch and Environment Strategy

### Completion Goal

Produce a written proposal (1 page maximum) for the branch-to-environment mapping. Your proposal must address:

1. Which Git branch triggers which environment?
2. Is the site rebuilt for each environment, or is one build artifact promoted across environments?
3. What is the promotion mechanism — automatic, manual approval, or time-based?
4. What happens when a hotfix needs to go directly to production?

Present two options, state your recommendation, and explain the trade-off.

**Do not implement anything yet.** Present this to your mentor first. This is a design review, not a ticket.

**Hint — think about this**: this website is a static export. There is no database. There is no server. The `out/` directory produced by `npm run build:cloud` is a folder of HTML, CSS, and JavaScript files. Does it make sense to run the build three times (once per environment) if the output would be identical? What are the implications of running it only once?

### Learning Goal

**Design before you build.** A common mistake among junior engineers is to start writing code before the design is agreed upon. Changing code is cheap. Changing a deployment architecture mid-migration affects DNS, secrets, pipelines, and potentially live traffic. Alignment on design before implementation prevents expensive rework.

> Key concept: **Artifact promotion vs. rebuild per environment.** The industry-standard approach for static sites and compiled applications is "build once, deploy many." You produce one immutable artifact and promote it through environments. This guarantees that what you tested in staging is *exactly* what runs in production — not a rebuild that could differ due to a changed dependency or a flaky API call. This principle is called **immutable artifacts**.

---

## Goal 4: Set Up GitHub Environments

### Completion Goal

In the GitHub repository settings, create three Environments:

| Environment | Protection Rules |
|-------------|-----------------|
| `dev` | None — auto-deploys on every push |
| `staging` | Required reviewer: your mentor |
| `production` | Required reviewer: your mentor + 10-minute minimum wait after staging |

For each environment, add the following secrets (values to be provided by your mentor):

- `CLOUDFLARE_API_TOKEN` (scoped to that Pages project only)
- `CLOUDFLARE_ACCOUNT_ID`
- `NEXT_PUBLIC_EMAIL_WORKER_URL` (each environment's worker URL)
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (each environment's Turnstile app key)

Verify: go to Settings → Environments in the GitHub UI and confirm all three exist with the correct protection rules and secrets.

### Learning Goal

**Secrets belong to environments, not repositories.** Today, this repo has one flat pool of secrets shared by every job. In a multi-environment world, that is a security problem: a bug in a dev workflow could theoretically read a production secret. GitHub Environments scope secrets so that a `dev` deployment job *cannot* access `production` secrets — they are simply not available in that job's context.

> Key concept: **Principle of Least Privilege.** Every process, job, and person should have access to only the secrets and permissions they need for their specific task, and nothing more. This is a foundational security principle. In CI/CD, it means: production credentials should only be available in the production deployment job, behind a human approval gate.

> Key concept: **Approval gates.** A deployment pipeline without approval gates is a liability. Requiring a human to review before promoting to production is not bureaucracy — it is the last line of defence against deploying a broken or unreviewed change to real users. The gate also creates an audit trail: you can always see who approved what and when.

---

## Goal 5: Set Up Cloudflare Pages Projects

### Completion Goal

Create three Cloudflare Pages projects in the Cloudflare dashboard:

| Project Name | Custom Domain |
|---|---|
| `nsengineering-dev` | `dev.nsengineering.com.np` |
| `nsengineering-stage` | `stage.nsengineering.com.np` |
| `nsengineering-prod` | `nsengineering.com.np` |

Important: configure each project for **Direct Upload** (not the GitHub integration). Cloudflare Pages offers a GitHub integration that runs its own CI — we do not want this. GitHub Actions will control all deployments. Cloudflare Pages is just the hosting target.

For each project, note the `*.pages.dev` preview URL that Cloudflare assigns. You will use these to verify deployments before DNS is pointed.

### Learning Goal

**Separate your CI/CD system from your hosting platform.** Cloudflare Pages offers its own GitHub integration that can trigger builds automatically. We are deliberately not using it. Here is why: if your CI lives inside your hosting platform, you are locked in. The day you want to switch from Cloudflare Pages to AWS CloudFront or Vercel, you have to rebuild your entire pipeline. When CI lives in GitHub Actions and the hosting platform is just a deployment target, switching hosts is a one-line change in your workflow file.

> Key concept: **Separation of concerns.** CI/CD (what to build, when to build it, where to deploy it) is a different concern from hosting (serving files to users). Keeping them separate makes each independently replaceable.

---

## Goal 6: Migrate the GitHub Actions Workflow

### Completion Goal

Rewrite `.github/workflows/deploy.yml` to implement the new pipeline. The new workflow must:

1. **Keep Job 1 (sync-assets) identical** — it is not changing.
2. **Keep Job 4 (commit-csv) identical** — it is not changing.
3. **Modify Job 2 (build)** — instead of uploading a GitHub Pages artifact, upload the `out/` directory as a standard GitHub Actions artifact using `actions/upload-artifact@v4`.
4. **Replace Job 3 (deploy)** with three new jobs:
   - `deploy-dev` — downloads the artifact, runs `wrangler pages deploy out/ --project-name nsengineering-dev`, uses the `dev` GitHub Environment, runs automatically.
   - `deploy-staging` — same artifact, deploys to `nsengineering-stage`, uses the `staging` GitHub Environment (triggers the approval gate you set up in Goal 4).
   - `deploy-prod` — same artifact, deploys to `nsengineering-prod`, uses the `production` GitHub Environment, requires `deploy-staging` to have succeeded.

5. **Remove all GitHub Pages permissions** (`pages: write`, `id-token: write` from the permissions block).

Test the workflow by pushing to the branch. The `dev` environment should deploy automatically. Do not approve staging or production yet — just confirm the dev deployment works and the approval gates appear in the GitHub Actions UI.

**Key tool**: `cloudflare/wrangler-action@v3` — a GitHub Action that wraps the Wrangler CLI.

### Learning Goal

**Pipelines are directed acyclic graphs (DAGs), not scripts.** A script runs steps in sequence. A pipeline declares *dependencies* between jobs. The `needs:` keyword in GitHub Actions is how you express "this job cannot start until these other jobs finish." This lets independent jobs (like `deploy-dev` and `commit-csv`) run in parallel, while dependent jobs (`deploy-prod` needs `deploy-staging`) run in sequence.

> Key concept: **Pipeline as code.** Your deployment process is now version-controlled, reviewable, and auditable. Anyone on the team can read `deploy.yml` and understand exactly how code gets from a developer's laptop to production. This is not documentation — this is the process itself, written as code.

> Key concept: **Idempotent deployments.** Deploying the same artifact twice should produce the same result. Running `wrangler pages deploy` on the same `out/` directory ten times in a row should be safe and predictable. Design your pipelines assuming they will be re-run.

---

## Goal 7: Set Up Per-Environment Cloudflare Email Workers

### Completion Goal

The email worker currently lives as a single deployment. Split it into three environments using `wrangler.toml`:

```
[name]
ns-email-worker

[env.dev]
name = "ns-email-worker-dev"

[env.staging]
name = "ns-email-worker-staging"

[env.production]
name = "ns-email-worker-prod"
```

For each worker environment:
- Register a separate Cloudflare Turnstile application (one per domain: `dev.nsengineering.com.np`, `stage.nsengineering.com.np`, `nsengineering.com.np`) so Turnstile tokens are validated against the correct domain.
- Set the worker's `TURNSTILE_SECRET_KEY` secret using `wrangler secret put --env <env>`.
- Configure the dev worker to route emails to a test inbox (not the real company inbox) so form submissions during development do not reach the client.

Update the `NEXT_PUBLIC_EMAIL_WORKER_URL` secret in each GitHub Environment to point to the correct worker.

This goal can be worked on in parallel with Goal 6.

### Learning Goal

**Non-production environments must not touch production systems.** If the dev environment's contact form sends real emails to `info@nsengineering.com.np`, every test submission lands in the client's inbox. This is unprofessional and can erode trust. Non-prod environments should have their own email targets, their own Turnstile keys, and ideally their own API quotas so testing cannot exhaust production limits.

> Key concept: **Environment parity.** Dev, staging, and production should be as similar as possible in *architecture* — same Worker code, same pipeline — but intentionally different in *data and credentials*. The goal is to catch bugs in dev and staging before they reach real users, without dev activity affecting real users or real data.

> Key concept: **Microservice isolation.** Each environment's Worker is a separate, independently deployable unit. A crash or misconfiguration in `ns-email-worker-dev` has zero impact on `ns-email-worker-prod`. This is why you separate them even though the code is identical.

---

## Goal 8: DNS Cutover

### Completion Goal

This is the highest-risk step. Follow this sequence exactly:

1. **Before touching DNS**: Verify the production Cloudflare Pages project (`nsengineering-prod`) is fully working using its `*.pages.dev` URL. Test the contact form end-to-end.
2. **Reduce TTL**: Lower the DNS TTL for `nsengineering.com.np` to 60 seconds at least 24 hours before the cutover. This means DNS changes propagate globally within 1 minute instead of up to 24 hours.
3. **Cutover**: In Cloudflare DNS, remove the CNAME pointing to GitHub Pages. Add the custom domain for `nsengineering-prod` inside the Cloudflare Pages dashboard (it auto-creates the DNS record).
4. **Verify**: Run `curl -I https://nsengineering.com.np` and confirm the response headers show Cloudflare Pages. Test all major pages and the contact form.
5. **Do not decommission GitHub Pages immediately.** Leave it running for 48 hours as a fallback. If something is wrong, the rollback is to repoint DNS back to the old CNAME.
6. After 48 hours of stable production: disable GitHub Pages in the repository settings.

### Learning Goal

**DNS changes are slow and global.** When you update a DNS record, the change does not instantly reach every user. DNS records are cached by ISPs, routers, and browsers according to the TTL (Time To Live) value. If your TTL is 24 hours, some users will still hit the old GitHub Pages server for up to 24 hours after your change. This is why you reduce TTL in advance — you are pre-warming the system for a fast propagation.

> Key concept: **Zero-downtime migration.** The sequence above ensures that at no point is `nsengineering.com.np` unreachable. The new target is verified before DNS is changed. The old target stays running as a fallback. This is called a **blue-green migration at the DNS layer**.

> Key concept: **Rollback planning.** Every production change should have a rollback plan written before the change is made, not after something goes wrong. For this migration, the rollback is: repoint DNS to GitHub Pages. How long would that take? What is the maximum time users would see an error? Write this down before you touch anything.

---

## Goal 9: Cleanup

### Completion Goal

Once production has been stable on Cloudflare Pages for 48 hours:

- Delete the `CNAME` file from the repository root.
- Remove the `pages: write` and `id-token: write` permissions from `deploy.yml` if not already done in Goal 6.
- Disable GitHub Pages in the repository settings (Settings → Pages → Source → None).
- Remove the `upload-pages-artifact` and `deploy-pages` action references if any remain.
- Open a Pull Request from `feature/cloudflareMigration` into `main` with a clean description of what changed and why.

### Learning Goal

**Dead configuration is a liability.** The `CNAME` file pointed to a hosting platform that no longer hosts this site. Leaving it there is a trap for the next engineer who reads it. Outdated configuration misleads, confuses, and eventually causes incidents. Cleaning up after a migration is not optional housekeeping — it is part of the migration.

> Key concept: **Definition of done.** A feature or migration is not complete when it works in production. It is complete when the old system is decommissioned, the dead code is removed, and the documentation reflects the new reality. "It works but I left the old stuff in just in case" is not done.

---

## Goal 10: Document the New Architecture

### Completion Goal

Update the following files to reflect the new world:

1. **`CLAUDE.md`** — update the deployment section and the quick commands reference.
2. **`DEPLOYMENT.md`** — rewrite the deployment steps to describe the new pipeline (push to main → approve dev → approve staging → approve prod). Add a Rollback section specific to Cloudflare Pages (how to roll back to a previous deployment using `wrangler pages deployment list` and `wrangler pages deployment rollback`).
3. **Create `docs/technical/ENVIRONMENT_STRATEGY.md`** — a short document describing the three environments, their domains, their purpose, and the promotion flow. Include the architecture diagram.

The architecture diagram should look something like this (ASCII is fine):

```
 main branch push
       │
       ▼
 ┌─────────────────────────────────────────┐
 │  GitHub Actions                         │
 │  ┌──────────┐  ┌──────────────────────┐ │
 │  │sync-     │  │ build (once)         │ │
 │  │assets    │  │ → artifact: out/     │ │
 │  └──────────┘  └──────────┬───────────┘ │
 │                           │             │
 │          ┌────────────────┼──────────┐  │
 │          ▼                ▼          ▼  │
 │  ┌────────────┐  ┌──────────────┐  ┌─────────────┐  │
 │  │deploy-dev  │  │deploy-staging│  │deploy-prod  │  │
 │  │(auto)      │  │(approval ✓)  │  │(approval ✓) │  │
 │  └─────┬──────┘  └──────┬───────┘  └──────┬──────┘  │
 └────────┼───────────────┼──────────────────┼──────────┘
          ▼               ▼                  ▼
    dev.nsengineering  stage.nsengineering  nsengineering.com.np
    + dev Worker       + stage Worker       + prod Worker
```

### Learning Goal

**Documentation is part of the deliverable, not an afterthought.** A system that works but is not documented depends on the person who built it. That person will leave eventually. Good documentation means the next engineer — or your future self — can understand, operate, and extend the system without asking you.

> Key concept: **Runbooks.** A runbook is a step-by-step guide for operating a system: how to deploy, how to roll back, what to do when something breaks. Runbooks should be written by the person who built the system while the knowledge is fresh. They should be tested: have someone else follow the runbook and note where it was unclear.

> Key concept: **Docs as code.** Documentation checked into Git is versioned, reviewable in pull requests, and lives alongside the system it describes. A Google Doc or Confluence page is not version-controlled and will drift out of sync with the code. Keep documentation in the repo.

---

## Checkpoint Summary

| Goal | Deliverable | Blocks Next? | Mentor Review |
|------|-------------|:------------:|:-------------:|
| 0 | Written Q&A + verbal walkthrough | Yes | Required |
| 1 | Written analysis of GitHub Pages limits | No | Recommended |
| 2 | Concept explanations + architecture diagram | Yes | Required |
| 3 | Written design proposal (2 options) | Yes | Required |
| 4 | GitHub Environments configured | Yes | Required |
| 5 | 3 Cloudflare Pages projects created | Yes | Required |
| 6 | Rewritten deploy.yml, dev auto-deploying | Yes | Required |
| 7 | 3 Workers deployed (parallel with Goal 6) | Yes | Required |
| 8 | DNS cutover complete, prod stable 48h | Yes | Required |
| 9 | CNAME deleted, GitHub Pages disabled, PR open | Yes | Required |
| 10 | CLAUDE.md, DEPLOYMENT.md, ENVIRONMENT_STRATEGY.md updated | No | Required |

---

## Vocabulary Reference

Terms you will encounter throughout this project. Look these up when you first see them.

| Term | Short Definition |
|------|-----------------|
| Static export | A website compiled to plain HTML/CSS/JS files with no server required at runtime |
| Artifact | A build output (e.g., the `out/` folder) stored so it can be deployed without rebuilding |
| Artifact promotion | Deploying the same artifact to multiple environments in sequence, instead of rebuilding |
| Immutable artifact | An artifact that is never modified after it is built — only replaced by a new build |
| GitHub Environment | A named deployment target in GitHub that can have its own secrets and protection rules |
| Approval gate | A pause in the pipeline that requires a human to explicitly approve before proceeding |
| Wrangler | Cloudflare's CLI tool for deploying Workers and Pages |
| wrangler.toml | Infrastructure as Code config file for Cloudflare resources |
| TTL (DNS) | Time To Live — how long DNS records are cached before being re-fetched |
| Blue-green migration | Running old and new systems in parallel, then switching traffic atomically |
| Rollback | Reverting a deployment to a previous known-good state |
| Principle of Least Privilege | Giving every process and person only the permissions they need, and nothing more |
| Runbook | Step-by-step operational guide for a system |
| DAG | Directed Acyclic Graph — the structure of a CI/CD pipeline (jobs with dependencies, no cycles) |
| Idempotent | An operation that produces the same result no matter how many times it is run |

---

## Notes Space

Use this section to jot down questions, blockers, and decisions as you go. Bring these to your mentor sessions.

**Open questions:**

**Decisions made:**

**Blockers:**

---

*This document is your contract for the project. When you complete Goal 10, update the header to reflect the completion date and your name.*
