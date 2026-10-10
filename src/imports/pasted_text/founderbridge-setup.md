# FOUNDERBRIDGE — BACKEND + FRONTEND PROJECT STRUCTURE & SUPABASE SETUP

Now convert the existing FounderBridge frontend into a proper backend-connected application using **Next.js + JavaScript + Tailwind CSS + Supabase**.

## VERY IMPORTANT

Do NOT redesign the existing UI.

Keep the current FounderBridge design exactly as it is.

Only make the existing frontend functional by connecting it to Supabase.

The project must be properly organized into separate frontend/backend areas wherever technically appropriate.

---

# 1. PROJECT STRUCTURE

Create a clean production-ready structure.

Use:

```text
FounderBridge/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── hooks/
│   ├── services/
│   ├── utils/
│   ├── public/
│   ├── styles/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── supabase/
│   │   ├── migrations/
│   │   ├── functions/
│   │   └── seed/
│   │
│   ├── sql/
│   │   └── founderbridge_database.txt
│   │
│   └── README.md
│
├── .env.example
├── README.md
└── ...
```

IMPORTANT:

Because this is a Next.js application, do NOT create an unnecessary duplicate Express server.

The `backend/` folder is primarily for:

* Supabase migrations
* SQL schema
* RLS policies
* Database functions
* Supabase Edge Functions where required
* Backend documentation
* Reusable SQL

The frontend remains a separate `frontend/` application.

---

# 2. FRONTEND

Use:

* Next.js
* JavaScript
* React
* Tailwind CSS

All UI components and pages must remain inside:

```text
frontend/
```

Do not mix SQL or Supabase database migration files inside UI component folders.

---

# 3. SUPABASE

Use Supabase for:

* Authentication
* PostgreSQL database
* Storage
* Realtime
* Row Level Security
* Database functions
* Edge Functions where necessary

---

# 4. ENVIRONMENT VARIABLES

Create:

```text
frontend/.env.local
```

and:

```text
.env.example
```

Use:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
```

IMPORTANT:

`SUPABASE_SECRET_KEY` must NEVER be exposed to the browser.

Only use it in trusted server-side code where absolutely necessary.

Never commit `.env.local`.

---

# 5. SUPABASE CLIENT SETUP

Create reusable Supabase clients.

Example structure:

```text
frontend/lib/supabase/
├── client.js
├── server.js
└── admin.js
```

Use:

### client.js

For browser-side Supabase operations.

### server.js

For server-side authenticated operations.

### admin.js

For privileged server-only operations.

IMPORTANT:

Never import `admin.js` into client components.

---

# 6. DATABASE SQL FILE

Create:

```text
backend/sql/founderbridge_database.txt
```

This file is extremely important.

Put the COMPLETE reusable SQL setup inside this `.txt` file.

It should contain:

* Extensions if required
* Enum types
* Tables
* Foreign keys
* Indexes
* Constraints
* RLS enable statements
* RLS policies
* Functions
* Triggers
* Useful views
* Seed data where appropriate

The file must be reusable.

Someone should be able to copy the SQL from this file into a new Supabase SQL Editor and recreate the FounderBridge database structure.

Do NOT put pseudocode inside this file.

Use actual executable PostgreSQL SQL.

---

# 7. KEEP SQL MIGRATIONS TOO

In addition to the reusable `.txt` file, create proper Supabase migration files:

```text
backend/supabase/migrations/
```

Example:

```text
001_initial_schema.sql
002_profiles.sql
003_startups.sql
004_social.sql
005_messages.sql
006_saas.sql
007_news.sql
008_admin_security.sql
```

The `.txt` file should contain the consolidated final SQL.

The migration files should contain the organized incremental version.

Keep both synchronized.

---

# 8. PROFILES TABLE

Create:

```text
profiles
```

Fields:

* id
* user_id
* role
* full_name
* username
* avatar_url
* bio
* location
* website
* linkedin_url
* twitter_url
* instagram_url
* created_at
* updated_at

Roles:

```text
student
investor
business_owner
general_user
admin
```

Use proper constraints.

---

# 9. STUDENT PROFILE

Create:

```text
student_profiles
```

Fields:

* id
* profile_id
* university
* course
* graduation_year
* skills
* interests
* created_at
* updated_at

---

# 10. INVESTOR PROFILE

Create:

```text
investor_profiles
```

Fields:

* id
* profile_id
* investor_type
* investment_interests
* preferred_stages
* investment_range_min
* investment_range_max
* investment_philosophy
* portfolio_description
* created_at
* updated_at

---

# 11. BUSINESS OWNER PROFILE

Create:

```text
business_profiles
```

Fields:

* id
* profile_id
* business_name
* industry
* business_size
* business_description
* website
* location
* created_at
* updated_at

---

# 12. AUTHENTICATION

Implement Supabase Auth.

Support:

* Signup
* Login
* Logout
* Password reset
* Session persistence

After signup:

User
→ Choose role
→ Create profile
→ Save profile
→ Enter personalized profile area

---

# 13. PROFILE CRUD

Users must be able to manage their profile completely from the frontend.

Support:

Create

Read

Update

Delete where appropriate

Users should be able to update:

* Name
* Username
* Profile picture
* Bio
* Location
* Website
* Social links
* Role-specific information

After saving:

Supabase updates.

Then UI updates immediately.

Do not require a manual browser refresh.

---

# 14. STARTUP IDEAS

Create:

```text
startup_ideas
```

Fields:

* id
* founder_id
* title
* slug
* short_pitch
* description
* problem
* solution
* target_market
* business_model
* industry
* stage
* funding_required
* traction
* competition
* website_url
* pitch_deck_url
* demo_url
* cover_image_url
* visibility
* created_at
* updated_at

Visibility:

```text
private
public
investors_only
```

---

# 15. STUDENT STARTUP CRUD

Student can:

* Create startup
* Edit startup
* Delete startup
* Publish startup
* Unpublish startup
* Change visibility
* Upload startup image
* Add pitch deck
* Add demo URL

Create:

```text
My Ideas
```

inside their profile.

---

# 16. VISIBILITY SECURITY

Implement actual database-level security.

### Private

Only founder can access.

### Public

Public users can access.

### Investors Only

Only authenticated investor accounts can access.

Do NOT simply hide content in React.

Enforce visibility through:

* RLS
* Server-side checks

---

# 17. INVESTOR ACTIONS

Investors can:

* View startup ideas
* Search
* Filter
* Like
* Save
* Rate
* Give feedback
* Comment
* Follow founders
* Subscribe to founders
* Message founders

---

# 18. RATINGS

Create:

```text
startup_ratings
```

Fields:

* id
* startup_id
* investor_id
* rating
* feedback
* created_at
* updated_at

Rating:

1–5

One investor should have only one rating per startup.

Allow updating their existing rating.

Calculate average score.

---

# 19. FEEDBACK

Allow investors to provide:

* Written feedback
* Rating
* Quick feedback categories

Examples:

Strong Problem

Interesting Market

Strong Team

Good Business Model

Needs More Validation

Founder should be able to see feedback on their own startup.

---

# 20. SOCIAL SYSTEM

Create:

```text
follows
subscriptions
likes
comments
saved_items
```

Support:

Follow

Unfollow

Subscribe

Unsubscribe

Like

Unlike

Comment

Edit own comment

Delete own comment

Save

Remove save

---

# 21. FEED

IMPORTANT:

Feed must NOT be added to the public navbar.

Feed exists inside the authenticated user's profile area.

Create:

```text
posts
```

Support posts from:

* Students
* Investors
* Business owners
* General users

Post types:

```text
investor_insight
startup_update
founder_update
business_requirement
investment_interest
tech_insight
general
```

---

# 22. PERSONALIZED FEED

Use database data.

Prioritize:

* Followed people
* Subscribed people
* User interests
* Startup categories
* Saved content
* Previously interacted content

Do NOT implement AI recommendations.

Use simple deterministic rules for now.

---

# 23. MESSAGES

IMPORTANT:

Messages must NOT be added to the public navbar.

Messages exist inside the user's profile area.

Create:

```text
conversations
conversation_members
messages
```

Use Supabase Realtime.

Users can message:

* Investors
* Founders
* Students
* Business owners

Only conversation members can read messages.

---

# 24. SAAS REQUIREMENTS

Business owners can create SaaS requirements.

Create:

```text
saas_requirements
```

Fields:

* id
* user_id
* title
* problem
* current_process
* pain_points
* desired_solution
* budget
* priority
* status
* created_at
* updated_at

Statuses:

```text
draft
submitted
reviewing
in_progress
completed
closed
```

User can:

* Create
* Edit
* Delete
* View
* Update

their own requirements.

---

# 25. SAAS FEEDBACK

Create:

```text
saas_feedback
```

Allow:

Good

Needs Improvement

Feature Request

Bug

General Feedback

Include:

* Rating
* Message
* User
* Requirement
* Created date

---

# 26. NEWS SYSTEM

Create:

```text
news_articles
```

Fields:

* id
* title
* slug
* summary
* content
* cover_image_url
* category
* source_name
* source_url
* published_at
* status
* created_at
* updated_at
* created_by

Status:

```text
draft
published
archived
```

Public Tech News page should only display:

```text
status = published
```

---

# 27. ADMIN PANEL

Create:

```text
frontend/app/admin/
```

Admin route:

```text
/admin
```

Do NOT add this route to public navigation.

Do NOT advertise it anywhere.

---

# 28. ADMIN SECURITY

Admin panel must require:

Authentication

AND

Admin role.

A normal user must NOT access it.

Do not rely on frontend route hiding.

Use:

* Supabase Auth
* Server-side authorization
* RLS

Do NOT allow users to change their own role from:

student/investor/business_owner

to:

admin

from the frontend.

Admin assignment must be controlled securely.

---

# 29. ADMIN NEWS MANAGEMENT

Admin can:

Create news

Edit news

Delete news

Save draft

Publish

Unpublish

Archive

Upload image

Replace image

Delete image

---

# 30. DAILY NEWS WORKFLOW

Admin:

Login

↓

/admin

↓

News

↓

Create Article

↓

Title

Summary

Content

Image

Category

Source

↓

Publish

↓

Public Tech News automatically updates.

No code modification should be required for daily news.

---

# 31. ADMIN DASHBOARD

Show:

Total Users

Students

Investors

Business Owners

Published News

Draft News

Startup Ideas

Recent Activity

---

# 32. STORAGE

Create Supabase Storage buckets for:

```text
avatars
startup-images
news-images
post-images
documents
```

Apply appropriate storage policies.

Users can upload/update their own profile image.

Founders can upload their own startup images.

Admins can manage news images.

Do not allow unauthorized users to overwrite other users' files.

---

# 33. SEARCH

Implement database-backed search for:

* Investors
* Founders
* Business owners
* Startup ideas
* News
* Posts

Do not download the complete database into the browser.

Use appropriate database queries/indexes.

---

# 34. SECURITY

Enable RLS on all relevant tables.

Every table must have explicit policies.

Examples:

User can update own profile.

User can create own startup.

User can update own startup.

User cannot update another user's startup.

User can access own private startup.

Investor can access investor-only startup.

Conversation members can read their messages.

Admin can manage news.

Normal users cannot manage news.

---

# 35. API / SERVICE LAYER

Do not put large Supabase queries directly inside UI components.

Create reusable services.

Example:

```text
frontend/services/
├── authService.js
├── profileService.js
├── startupService.js
├── investorService.js
├── feedService.js
├── messageService.js
├── saasService.js
├── newsService.js
└── adminService.js
```

Components should call services rather than containing large database logic.

---

# 36. REUSABLE COMPONENTS

Use reusable components:

```text
components/
├── profile/
├── startup/
├── investor/
├── feed/
├── messages/
├── saas/
├── news/
├── admin/
└── common/
```

Do not duplicate similar UI.

---

# 37. ERROR + LOADING STATES

Every Supabase operation needs:

Loading state

Error state

Success state

Empty state

Use polished UI.

Do not use browser `alert()` for normal application feedback.

---

# 38. ADMIN SEO

Admin pages must contain:

```text
noindex
nofollow
```

Do not include `/admin` in public sitemap.

Add appropriate robots configuration.

IMPORTANT:

SEO protection is NOT security.

Authentication + authorization + RLS are the actual security mechanisms.

---

# 39. DATABASE BACKUP / REUSABILITY

The file:

```text
backend/sql/founderbridge_database.txt
```

must contain the complete database setup.

Organize it with clear sections:

```text
1. Extensions
2. Types / Enums
3. Profiles
4. Student Profiles
5. Investor Profiles
6. Business Profiles
7. Startup Ideas
8. Ratings
9. Posts
10. Comments
11. Likes
12. Follows
13. Subscriptions
14. Saved Items
15. Conversations
16. Messages
17. SaaS Requirements
18. SaaS Feedback
19. News
20. Admin
21. Indexes
22. Functions
23. Triggers
24. RLS
25. Storage Policies
26. Seed Data
```

The SQL should be executable and reusable.

---

# 40. README

Create:

```text
README.md
```

Explain simply:

### Installation

```text
npm install
npm run dev
```

### Supabase Setup

Explain:

1. Create Supabase project
2. Add environment variables
3. Run SQL
4. Configure Storage
5. Configure Auth
6. Run Next.js

### Database

Explain where the reusable SQL file is:

```text
backend/sql/founderbridge_database.txt
```

### Deployment

Explain how to deploy frontend to Vercel.

---

# 41. FRONTEND/BACKEND SEPARATION

The final project must clearly separate:

```text
frontend/
```

for UI/application code.

and:

```text
backend/
```

for Supabase database/backend configuration.

Do not put database SQL inside frontend components.

Do not put UI components inside backend.

---

# 42. IMPORTANT — KEEP EXISTING DESIGN

Do not redesign the existing FounderBridge website.

All current:

* Navbar
* Hero
* Cards
* Colors
* Animations
* Pages
* Typography
* Images
* Layouts

should remain.

Only connect them to the real backend.

---

# 43. FINAL FUNCTIONAL FLOW

The finished application must support:

Signup
→ Select Student / Investor / Business Owner / General User
→ Create Profile
→ Edit Profile
→ Save to Supabase
→ Profile updates immediately

Student:

Create Startup
→ Save
→ Publish
→ Investor views
→ Investor rates
→ Investor gives feedback
→ Student sees feedback

Investor:

Browse Startups
→ Like
→ Save
→ Follow Founder
→ Subscribe
→ Message Founder
→ Rate Startup
→ Comment

Business Owner:

Create Profile
→ Describe Business Problem
→ Create SaaS Requirement
→ Update Requirement
→ Give Feedback
→ Message relevant users

All users:

Follow
→ Feed updates

Subscribe
→ Future updates

Messages
→ Realtime conversation

Admin:

Login
→ /admin
→ Create News
→ Upload Image
→ Save Draft
→ Publish
→ News appears on Tech News page

---

# 44. FINAL REQUIREMENT

Build the backend integration completely.

Do not create fake buttons that do nothing.

Every important action must connect to Supabase.

Use realistic mock/seed data only where initial demonstration data is useful.

The application should be ready for real backend usage while remaining easy to extend later.

MOST IMPORTANT:

**Do not break the existing FounderBridge UI.**

The backend should power the existing design rather than replacing it.
