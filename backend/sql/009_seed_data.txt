-- Migration 009: Seed Data — News Articles only
--
-- This migration seeds ONLY the news_articles table.
-- Demo auth users, profiles, investor_profiles, student_profiles, and startup_ideas
-- are seeded separately by:  backend/scripts/seed-demo-users.js
-- (that script requires SUPABASE_SERVICE_ROLE_KEY and uses the Admin Auth API)
--
-- Safe to run multiple times — ON CONFLICT (slug) DO NOTHING ensures idempotency.
-- created_by is NULL for all seeded articles (no auth user dependency).
-- Run in the Supabase SQL Editor (service role or anon key with permissive insert policy).

-- ============================================================
-- NEWS ARTICLES — Aug 24–31, 2026
-- ============================================================

INSERT INTO news_articles (
  title,
  slug,
  summary,
  content,
  cover_image_url,
  category,
  source_name,
  source_url,
  status,
  published_at,
  created_by
)
VALUES

(
  'OpenAI Releases GPT-5 Turbo With 2M Context Window and Multimodal Reasoning',
  'openai-gpt5-turbo-2m-context',
  'OpenAI''s latest model update dramatically expands context length and adds structured reasoning chains, opening new possibilities for long-form document analysis and agentic workflows.',
  'OpenAI released GPT-5 Turbo on Sunday, bringing its publicly available context window to 2 million tokens -- enough to process roughly 1,500 pages of text in a single prompt. The update also introduces native chain-of-thought visibility, allowing developers to inspect the model''s intermediate reasoning steps without a separate API call.

The release marks a meaningful shift for enterprise customers building agents and document-processing pipelines. Legal, financial, and medical applications stand to benefit most immediately, given the prevalence of long-form unstructured data in those sectors.

For student founders building on the API, OpenAI confirmed that the Education tier pricing -- introduced in May -- remains unchanged, with 10M tokens per month at no cost for verified university affiliates.

Developer reaction was immediate: GitHub saw a spike in repositories tagged gpt-5-turbo within six hours of the announcement, with early benchmarks showing 31% improvement on multi-document reasoning tasks compared to GPT-5.',
  'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=900&h=500&fit=crop&auto=format',
  'AI',
  'The Verge',
  'https://theverge.com',
  'published',
  '2026-08-31 09:00:00+00',
  NULL
),

(
  'Y Combinator W27 Batch: 43% of Founders Are First-Generation University Students',
  'yc-w27-batch-first-gen-founders',
  'YC''s winter 2027 batch data reveals a historic shift in founder demographics, with nearly half of accepted founders coming from non-elite universities or first-generation academic backgrounds.',
  'Y Combinator released demographic data for its W27 batch on Saturday, revealing that 43% of accepted founders identify as first-generation university students -- the highest proportion in the accelerator''s history. The figure has risen from 28% just three years ago.

The shift reflects deliberate policy changes at YC over the past two years, including removing the requirement for previous work experience at tier-1 tech companies and expanding the application window to include projects as young as 90 days old.

Notable companies in the W27 batch include a Nairobi-based adaptive learning platform, a Lagos freight-tech company, and a Karachi-based healthcare data infrastructure startup -- all founded by current or recent university students.

"We kept over-indexing on polish and pedigree," said one YC partner in a post accompanying the data release. "The best ideas often come from people who are still close enough to the problem to feel the pain every day."

Applications for YC S27 open on October 1.',
  'https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=900&h=500&fit=crop&auto=format',
  'Startups',
  'TechCrunch',
  'https://techcrunch.com',
  'published',
  '2026-08-30 10:30:00+00',
  NULL
),

(
  'Supabase Surpasses 1 Million Active Projects as Postgres-as-a-Service Hits Mainstream',
  'supabase-1-million-projects-milestone',
  'The open-source Firebase alternative announced it has crossed one million active projects, cementing Postgres-as-a-service as the dominant backend pattern for indie developers and early-stage startups.',
  'Supabase crossed one million active projects this week, the company announced in a Friday blog post. The milestone comes roughly 14 months after the company hit 500,000 projects, suggesting an accelerating growth rate driven by AI-assisted development workflows and the continued migration of developers away from proprietary NoSQL solutions.

The company said 38% of new projects in 2026 were created by developers who self-identified as "building with AI tools" -- a category that barely registered in 2024 surveys.

CEO Paul Copplestone noted that the average time-to-first-query has dropped from 22 minutes in 2023 to under 4 minutes today, attributing the improvement to better documentation, in-editor Supabase MCP integrations, and improved schema inference.

For the student developer community, Supabase''s free tier -- which offers 500MB database storage and 2GB bandwidth -- continues to be the default backend choice for hackathon projects and early-stage MVPs. The company said it has no plans to reduce free tier limits despite the growth in usage.',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&h=500&fit=crop&auto=format',
  'SaaS',
  'Supabase Blog',
  'https://supabase.com/blog',
  'published',
  '2026-08-29 08:00:00+00',
  NULL
),

(
  'African VC Funding Hits $1.4B in Q2 2026 -- Logistics and Climate Lead for Third Consecutive Quarter',
  'africa-vc-q2-2026-funding-logistics-climate',
  'African startups raised $1.4 billion in the second quarter of 2026, with logistics and climate technology claiming the top two spots for the third quarter running, according to data from Partech Africa.',
  'African technology startups raised $1.4 billion in Q2 2026, according to the latest data from Partech Africa, representing a 22% increase year-over-year and extending a strong run despite a more cautious global VC environment.

Logistics and supply chain companies claimed $390 million of that total across 28 deals, while climate technology -- spanning clean energy, carbon accounting, and sustainable agriculture -- accounted for $340 million. Both sectors have now led African deal flow for three consecutive quarters.

Nigeria, Kenya, South Africa, and Egypt retained their positions as the top four markets by deal count, though Rwanda and Senegal both saw deal counts more than double compared to Q2 2025.

Early-stage investment showed the most growth: pre-seed and seed deals increased by 47% by count, while Series A and later-stage rounds declined slightly -- a pattern analysts attribute to investors sharpening their focus on fundamentals before committing larger checks.

Student-affiliated startups -- those founded by founders within two years of graduation -- accounted for 19% of all seed-stage deals by count, continuing a trend that has drawn attention from accelerators and university programs across the continent.',
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&h=500&fit=crop&auto=format',
  'Funding',
  'Partech Africa',
  'https://partechpartners.com',
  'published',
  '2026-08-28 11:00:00+00',
  NULL
),

(
  'EU CSRD Phase 2 Enforcement Begins: 25,000 SMEs Face First Mandatory Carbon Reports',
  'eu-csrd-phase-2-smes-carbon-reporting',
  'The second wave of Corporate Sustainability Reporting Directive enforcement kicked in this week, drawing 25,000 additional European SMEs into mandatory annual carbon disclosure requirements.',
  'The European Commission''s phased rollout of CSRD enforcement entered its second stage on Thursday, bringing approximately 25,000 small and medium enterprises into the mandatory sustainability reporting framework for the first time.

Phase 2 targets companies with more than 250 employees or over 40M EUR in annual turnover that are not publicly listed -- a cohort that was largely excluded from Phase 1, which focused on large public-interest entities.

Carbon accounting software providers reported a sharp spike in inbound inquiries following formal CSRD notices going out to affected companies this week. Several Scope 1-3 calculation platforms noted pipeline increases of 200-400% in the seven-day period following the announcement.

The compliance deadline for Phase 2 companies is June 2027 -- their first reporting period covering fiscal year 2026. Legal and accounting firms specializing in ESG are already citing capacity constraints.

For startups building climate infrastructure, the enforcement wave represents a clear near-term revenue opportunity: compliance-driven demand rarely requires a long sales cycle, and the penalty regime -- up to 4% of annual EU revenue -- is motivating urgency at the board level.',
  'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=900&h=500&fit=crop&auto=format',
  'Business Technology',
  'Financial Times',
  'https://ft.com',
  'published',
  '2026-08-27 09:30:00+00',
  NULL
),

(
  'GitHub Copilot Enterprise Adds Real-Time PR Architecture Review -- Trained on 50B Lines of Code',
  'github-copilot-pr-architecture-review',
  'GitHub''s enterprise tier now includes architectural-level pull request analysis, moving beyond style and syntax to flag structural and design-pattern issues before code merges.',
  'GitHub announced an update to Copilot Enterprise on Wednesday that introduces architectural-level pull request analysis -- a capability that goes significantly beyond the line-by-line style feedback the tool has historically provided.

The new feature, called Copilot Architect, analyzes the structural intent of a PR against the existing codebase, flagging changes that introduce circular dependencies, violate established design patterns, or create technical debt at the module level. It was trained on a curated dataset of 50 billion lines of production code with senior engineer reviews attached.

For engineering teams at fast-growing companies, the feature addresses a long-standing problem: senior engineers are the bottleneck for architectural review, and most PRs that introduce structural problems do so in small, innocuous-looking increments.

The feature is available today on Copilot Enterprise at no additional cost. GitHub said it will extend the capability to Copilot Business customers "before end of year."

The move puts direct competitive pressure on developer tools startups in the code review space, several of which have built their core value proposition around exactly this type of deeper analysis.',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=900&h=500&fit=crop&auto=format',
  'Web Development',
  'GitHub Blog',
  'https://github.blog',
  'published',
  '2026-08-26 10:00:00+00',
  NULL
),

(
  'Figma Launches AI Design System Generator -- Builds Token Libraries From Brand Guidelines',
  'figma-ai-design-system-generator',
  'Figma''s new AI feature can read a company''s brand guidelines PDF and generate a complete design token library, component set, and style guide in under five minutes.',
  'Figma announced an AI-powered design system generator on Tuesday that can ingest a company''s brand guidelines document and produce a production-ready token library, component set, and style guide -- in under five minutes.

The feature, called Figma Brand Studio, accepts PDFs, URLs, or image uploads. It extracts colors, typography, spacing principles, and logo usage rules, then generates a structured design system with variables, auto-layout components, and annotated documentation layers.

In internal testing, Figma said the tool reduced the time to first production-ready component library from an average of three weeks to approximately 90 minutes including review and manual refinement.

For student founders and early-stage startups without dedicated designers, the feature removes a significant barrier to building visually consistent products. Previously, setting up a proper design system required either hiring a designer or spending weeks in Figma learning the tooling.

The feature is available on all paid Figma plans starting today. Free plan users get three Brand Studio sessions per month.',
  'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=900&h=500&fit=crop&auto=format',
  'Web Development',
  'Figma Blog',
  'https://figma.com/blog',
  'published',
  '2026-08-25 08:30:00+00',
  NULL
),

(
  'Stripe Introduces Embedded Banking for Startups -- Checking, Cards, and Payroll in One API',
  'stripe-embedded-banking-startups',
  'Stripe''s new Financial Accounts product gives any startup a programmable bank account, Stripe-issued debit cards, and integrated payroll disbursement through a single API without a banking licence.',
  'Stripe announced the public launch of Financial Accounts on Sunday, a product that gives startups a fully programmable bank account -- including FDIC-insured deposits, Stripe-issued physical and virtual debit cards, and API-driven payroll disbursement -- without requiring the company to obtain a banking licence or integrate a separate banking-as-a-service provider.

The product, previously in private beta with 400 companies, is now available to any Stripe user in the US, UK, and EU. International expansion to eight additional markets is planned for Q4 2026.

For early-stage startups, the practical implication is significant: they can open a business account, issue cards to team members, and set up automated payroll runs entirely within the Stripe dashboard they already use for payments -- eliminating the multi-vendor banking stack that typically plagues companies under $5M ARR.

Pricing follows Stripe''s established model: no monthly fees, revenue-share on interchange, and standard wire/ACH fees.

Analysts noted the move further cements Stripe''s ambition to become the full financial operating system for internet companies, competing more directly with Brex, Mercury, and traditional business banking products.',
  'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=900&h=500&fit=crop&auto=format',
  'FinTech',
  'Stripe Blog',
  'https://stripe.com/blog',
  'published',
  '2026-08-24 09:00:00+00',
  NULL
)

ON CONFLICT (slug) DO NOTHING;
