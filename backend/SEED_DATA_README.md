# FounderBridge — Seed Data Guide

## Overview

Seed data is split into two parts:

| Part | File | What it seeds | Auth required |
|------|------|---------------|---------------|
| SQL migration | `supabase/migrations/009_seed_data.sql` | 8 news articles (Aug 24–31 2026) | No |
| Node script | `scripts/seed-demo-users.js` | 6 founders + 4 investors, profiles, sub-profiles, 6 startup ideas | Yes — service role key |

---

## Part 1 — SQL Migration (News Articles)

Run this directly in the **Supabase SQL Editor** (Dashboard → SQL Editor → New query).

```sql
-- paste contents of supabase/migrations/009_seed_data.sql
```

Or via the Supabase CLI:
```bash
supabase db push
```

This seeds 8 published news articles with no dependency on auth users (`created_by` is `NULL`).
The insert is fully idempotent: `ON CONFLICT (slug) DO NOTHING`.

---

## Part 2 — Demo Users Script

### Prerequisites

```bash
# Install dependencies (from project root)
pnpm install
# or just ensure @supabase/supabase-js is available in node_modules
```

### Environment variables

```bash
export SUPABASE_URL="https://oeqtobmnhjejdtccfssi.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"
```

> **SECURITY**: The service role key bypasses all RLS policies. Never expose it in the
> browser, never commit it, never store it in `.env` files that are tracked by git.
> Keep it in `.env.local` (which is git-ignored) or pass it directly as shown above.

### Run

```bash
node backend/scripts/seed-demo-users.js
```

The script is idempotent — running it multiple times is safe. Existing users, profiles,
and startup ideas are detected and skipped.

---

## Demo Credentials

All demo accounts use the password: **`Demo1234!`**

### Founders (role: `student`)

| Name | Email | Startup |
|------|-------|---------|
| Aisha Okonkwo | aisha@edubridge.demo | EduBridge (EdTech, Pre-Seed) |
| Marcus Reid | marcus@freightflow.demo | FreightFlow (Logistics, Seed) |
| Priya Sundaram | priya@medvault.demo | MedVault (HealthTech, Idea) |
| Lena Müller | lena@carbonclock.demo | CarbonClock (CleanTech, Pre-Seed) |
| Jordan Tran | jordan@stackcoach.demo | StackCoach (DevTools, Seed) |
| Fatima Youssef | fatima@localshelve.demo | LocalShelve (RetailTech, Idea) |

### Investors (role: `investor`)

| Name | Email | Focus |
|------|-------|-------|
| Sarah Chen | sarah@angel.demo | AI/ML, DevTools, SaaS ($25K–$150K) |
| David Osei | david@volta.demo | Logistics, FinTech, CleanTech ($100K–$750K) |
| Natalie Russo | natalie@healthfront.demo | HealthTech, BioTech ($50K–$500K) |
| James Park | james@angel.demo | SaaS, Marketplaces, RetailTech ($10K–$75K) |

---

## Schema Notes

These types must match the database schema exactly:

| Column | Type | Example |
|--------|------|---------|
| `student_profiles.graduation_year` | `TEXT` | `"2024"` |
| `investor_profiles.investment_range_min` | `TEXT` | `"25000"` |
| `investor_profiles.investment_range_max` | `TEXT` | `"150000"` |
| `startup_ideas.funding_required` | `TEXT` | `"120000"` |
| `startup_ideas.stage` | `startup_stage` enum | `"Pre-Seed"` (capital S) |
| `startup_ideas.visibility` | `startup_visibility` enum | `"public"` / `"private"` / `"investors_only"` |
| `profiles.role` | `user_role` enum | `"student"` / `"investor"` / `"business_owner"` / `"general_user"` / `"admin"` |

---

## Plain-Text SQL Reference

`backend/sql/009_seed_data.txt` is a plain-text copy of the news articles SQL for
reference without the `.sql` extension, useful for pasting into environments that
don't accept `.sql` file uploads.
