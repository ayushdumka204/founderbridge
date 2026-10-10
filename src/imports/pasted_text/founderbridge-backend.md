# FOUNDERBRIDGE — FULL BACKEND IMPLEMENTATION

Convert the existing FounderBridge frontend into a real full-stack application.

IMPORTANT:

**DO NOT redesign the existing website.**

Preserve the current:

* UI
* colors
* typography
* navbar
* hero
* cards
* animations
* responsive layouts
* Startup Ideas page
* Investors page
* SaaS page
* Tech News page
* Contact page

The goal is to connect the existing frontend to a real backend and make the existing UI functional.

---

# 1. TECHNOLOGY STACK

Use:

**Frontend**

* Next.js
* JavaScript
* React
* Tailwind CSS

**Backend / BaaS**

* Supabase

Use Supabase for:

* PostgreSQL database
* Authentication
* Storage
* Realtime
* Database APIs

**Hosting**

* Vercel

**Domain**

* GitHub Student Developer Pack `.tech` domain

Do not introduce an unnecessary separate Express/Node backend.

Use Next.js server-side functionality/API routes/server actions where server-side logic is needed.

---

# 2. IMPORTANT ARCHITECTURE RULE

The frontend must NOT remain dependent on hardcoded mock data.

Convert important mock data into database-backed data.

The architecture should be:

User
↓
Next.js UI
↓
Supabase Auth / Server Actions / API
↓
PostgreSQL
↓
Response
↓
Next.js UI

Images/files:

User
↓
Next.js
↓
Supabase Storage
↓
Public/Signed URL
↓
Frontend

---

# 3. ENVIRONMENT VARIABLES

Use environment variables.

Required:

NEXT_PUBLIC_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

SUPABASE_SECRET_KEY

IMPORTANT:

The Supabase secret/service key must NEVER be exposed to the browser.

Keep privileged keys server-side only.

Do not hardcode credentials anywhere in the source code.

---

# 4. AUTHENTICATION

Implement real Supabase Authentication.

Support:

* Email signup
* Email login
* Logout
* Password reset
* Session persistence

Prepare the architecture so OAuth providers can be added later.

After signup, the user must be able to create a FounderBridge profile.

---

# 5. USER + ROLE SYSTEM

Every authenticated user has one primary profile role.

Roles:

```text
student
investor
business_owner
general_user
admin
```

IMPORTANT:

Do NOT trust a role supplied by the frontend for authorization.

Role/permission checks must be enforced server-side/database-side.

Use secure database authorization/RLS policies.

---

# 6. DATABASE STRUCTURE

Create a proper relational PostgreSQL schema.

Main tables:

## profiles

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

---

## student_profiles

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

## investor_profiles

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

## business_profiles

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

# 7. PROFILE CREATION

When a user first clicks the profile icon:

Show:

**Create Your FounderBridge Profile**

Role options:

Student / Founder

Investor

Business Owner

General User

After role selection:

Show the appropriate profile form.

After submission:

Save data to Supabase.

Then immediately display the created profile in the frontend.

Do not require page refresh.

---

# 8. PROFILE EDITING

IMPORTANT:

Users must be able to update their profile directly from the frontend.

Example:

Profile
→ Edit Profile
→ Change Bio
→ Save

The updated information must:

1. Update Supabase
2. Update frontend state
3. Immediately appear in the UI

Allow editing of:

* Name
* Username
* Profile photo
* Bio
* Location
* Website
* Social links
* Role-specific information

---

# 9. PROFILE PHOTO

Use Supabase Storage.

Flow:

User selects image
↓
Upload to Supabase Storage
↓
Save image URL/path in profiles table
↓
Display image throughout application

Support:

* Profile avatar
* Startup images
* News images
* Post images

Validate file type and reasonable file size.

Do not allow arbitrary unsafe file uploads.

---

# 10. STUDENT / FOUNDER FUNCTIONALITY

Students must be able to create and manage startup ideas from the frontend.

Create table:

## startup_ideas

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

Visibility options:

```text
private
public
investors_only
```

---

# 11. STARTUP IDEA CRUD

Student must be able to:

Create idea
Read idea
Edit idea
Delete idea
Publish/unpublish idea

Frontend:

**Submit Idea**

opens a proper form.

After submission:

Save to Supabase.

Then:

**My Ideas**

shows the user's ideas.

---

# 12. IDEA VISIBILITY

Implement:

### Private

Only the owner can see it.

### Public

Anyone can see it.

### Investors Only

Only authenticated users with role:

investor

can see it.

IMPORTANT:

This must be enforced with database RLS/server authorization.

Do not merely hide the card in frontend.

---

# 13. INVESTOR FUNCTIONALITY

Investors must be able to:

* Browse startup ideas
* Search startups
* Filter startups
* View startup details
* Rate ideas
* Leave feedback
* Like posts
* Comment
* Save startups
* Follow founders
* Subscribe to founders
* Message founders

---

# 14. IDEA RATING SYSTEM

Create:

## startup_ratings

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

An investor can submit/update their own rating.

Prevent duplicate ratings from the same investor for the same startup.

Calculate:

Average idea score

and display it on the existing UI.

---

# 15. FEEDBACK

Investors can provide feedback.

Example:

Strong Problem

Interesting Market

Strong Team

Good Business Model

Needs More Validation

Allow optional written feedback.

The startup owner should be able to see feedback on their own startup.

---

# 16. LIKE SYSTEM

Create reusable likes functionality.

Users can like:

* Posts
* Startup ideas
* News where appropriate

Prevent duplicate likes.

Clicking again removes the like.

Update UI immediately using optimistic frontend state where appropriate.

---

# 17. COMMENTS

Create:

## comments

Fields:

* id
* user_id
* content_type
* content_id
* body
* created_at
* updated_at

Allow authenticated users to comment where permitted.

Users should be able to delete/edit their own comments.

---

# 18. SAVE / BOOKMARK

Create:

## saved_items

Fields:

* id
* user_id
* item_type
* item_id
* created_at

Allow users to save:

* Startup ideas
* Investor profiles
* Posts
* News

Show saved items inside the user's profile.

---

# 19. FOLLOW SYSTEM

Create:

## follows

Fields:

* id
* follower_id
* following_id
* created_at

Users can follow:

* Investors
* Students/Founders
* Business Owners

Prevent following themselves.

Prevent duplicate follows.

Button states:

Follow

Following

---

# 20. SUBSCRIBE SYSTEM

Create:

## subscriptions

Fields:

* id
* subscriber_id
* creator_id
* created_at

Subscription is different from following.

Follow:

Show the person's content in feed.

Subscribe:

Receive important updates from that person.

Button states:

Subscribe

Subscribed

---

# 21. PERSONALIZED FEED

Create a feed using database-backed content.

The feed should consider:

* Followed people
* Subscribed people
* Viewed startup categories
* Saved content
* User interests
* Investor interests
* Business interests

For now:

Implement a simple deterministic recommendation system.

Do NOT implement AI recommendations.

Example:

If user follows Investor A:

Investor A's posts should appear in feed.

If user follows SaaS-related profiles:

Show more SaaS-related content.

If user saves FinTech startup:

Prioritize relevant FinTech content.

---

# 22. FEED TABLE

Create:

## posts

Fields:

* id
* author_id
* post_type
* content
* image_url
* startup_id
* business_id
* created_at
* updated_at

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

# 23. POSTS

Authenticated users can create posts according to their role.

Investor:

Investment insights

Founder:

Startup updates

Business owner:

Business requirements

General user:

General ecosystem content

Allow:

* Text
* Optional image
* Related startup

---

# 24. MESSAGING

Create real messaging functionality.

Tables:

## conversations

* id
* created_at
* updated_at

## conversation_members

* conversation_id
* user_id

## messages

* id
* conversation_id
* sender_id
* body
* created_at
* read_at

Use Supabase Realtime for live message updates.

---

# 25. MESSAGE PERMISSIONS

Users can only access conversations in which they are members.

A user must NOT be able to read another user's private messages by changing IDs in the frontend.

Enforce this through RLS.

---

# 26. MESSAGE ENTRY POINTS

Message buttons should work from:

Investor profile

Startup profile

Founder profile

Business profile

Posts where appropriate

Example:

Investor Profile
→ Message
→ Conversation

Startup Profile
→ Contact Founder
→ Conversation

---

# 27. USER PROFILE AREA

Feed and Messages must NOT be added to the public navbar.

The public navbar remains:

Home
SaaS
Startup Ideas
Investors
Tech News
Contact
Submit Idea
Build SaaS
Profile Icon

Feed and Messages belong inside the authenticated user/profile area.

---

# 28. PROFILE DASHBOARD

Clicking profile icon:

If logged out:

Show login/signup/profile creation flow.

If logged in:

Open profile area.

Profile area contains:

Profile

Feed

Messages

Following

Subscriptions

Saved

Activity

Settings

Role-specific options

---

# 29. SAAS USER PROFILE

Business owners and SaaS users must be able to create profiles.

They should be able to submit:

### Business Problem

"What problem are you trying to solve?"

### Current Process

"How do you currently handle it?"

### Pain Points

"What is not working?"

### Desired Solution

"What would you like the software to do?"

### Budget

Optional.

### Business Context

Optional.

---

# 30. SAAS REQUIREMENTS

Create:

## saas_requirements

Fields:

* id
* user_id
* business_id
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

Status:

```text
draft
submitted
reviewing
in_progress
completed
closed
```

---

# 31. SAAS FEEDBACK

SaaS users should be able to provide feedback.

Create:

## saas_feedback

Fields:

* id
* user_id
* requirement_id
* feedback_type
* message
* rating
* created_at

Feedback types:

Good

Needs Improvement

Feature Request

Bug

General Feedback

Allow the user to update/delete their own feedback.

---

# 32. SAAS USER DASHBOARD

Inside their profile:

Show:

My Requirements

Active Requests

Completed Requests

Feedback

Profile

Messages

Feed

The user should be able to create/edit requirements directly from frontend.

---

# 33. TECH NEWS

Tech News must become database-driven.

Public users can view published news.

News fields:

## news_articles

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

---

# 34. NEWS ADMIN PANEL

Create a separate admin panel.

Route:

```text
/admin
```

IMPORTANT:

This must NOT be publicly accessible.

It must require:

1. Authentication
2. Admin authorization

Do NOT rely only on the URL being hidden.

---

# 35. ADMIN AUTHORIZATION

Create a secure admin role.

Only users explicitly marked as:

```text
admin
```

can access the admin panel.

Normal:

student

investor

business_owner

general_user

must NOT access admin pages.

Enforce authorization server-side and through database policies.

Do NOT allow a normal user to change their own role to admin.

---

# 36. ADMIN PANEL — NEWS

Admin dashboard should have:

### News

**Create Article**

**Edit Article**

**Delete Article**

**Publish**

**Unpublish**

**Archive**

---

# 37. CREATE NEWS

Admin form:

Title

Summary

Article Content

Cover Image

Category

Source Name

Source URL

Publish Date

Status

Draft / Published

Admin should be able to upload the news image.

Image should go to Supabase Storage.

---

# 38. DAILY NEWS WORKFLOW

Admin should be able to login every day and:

1. Open `/admin`
2. Login
3. Click News
4. Create Article
5. Add title
6. Add summary
7. Add content
8. Upload image
9. Add source
10. Publish

The public Tech News page should automatically display the newly published article.

No code changes should be required to publish daily news.

---

# 39. ADMIN DASHBOARD

Create a clean admin interface with:

Dashboard

News

Users

Startup Ideas

Reports / Feedback

Settings

Dashboard statistics:

Published News

Draft News

Total Users

Startup Ideas

Investors

Students

Business Owners

Recent Activity

---

# 40. ADMIN USER MANAGEMENT

Admin should be able to view users.

Show:

Name

Email

Role

Joined date

Status

Profile

Admin should NOT be able to casually expose passwords or authentication secrets.

---

# 41. ADMIN STARTUP MANAGEMENT

Admin can:

View startup ideas

Review reported ideas

Hide inappropriate content

Archive startup ideas

View founder information

Do not allow admin to modify user-owned data unnecessarily.

---

# 42. ADMIN SECURITY

Admin routes must be protected.

Implement:

* Auth check
* Admin role check
* Server-side authorization
* Supabase RLS
* Secure server-side secret handling

Never expose the Supabase secret/service key in frontend code.

Never store admin credentials in localStorage.

Never use frontend-only checks as the actual security layer.

---

# 43. ADMIN SEO PROTECTION

The admin panel should not be indexed.

Add:

`noindex`

`nofollow`

for admin pages.

Also exclude:

```text
/admin
```

from robots.txt.

IMPORTANT:

robots.txt/noindex is only an SEO/crawling measure.

Authentication and authorization remain the actual security mechanism.

---

# 44. ADMIN URL

Use:

```text
/admin
```

Do NOT advertise this route anywhere in the public website.

Do not add it to navbar.

Do not add it to footer.

Do not add it to public sitemap.

---

# 45. NEWS IMAGES

Use Supabase Storage for news images.

Admin can:

Upload

Replace

Delete

news images.

Frontend automatically displays the current image.

Use proper image optimization through Next.js where applicable.

---

# 46. REALTIME

Use Supabase Realtime where it adds real value.

Primary use:

Messages

Potentially:

Notifications

Do not unnecessarily make every database table realtime.

---

# 47. NOTIFICATIONS — PREPARE FOR FUTURE

Create architecture that can later support:

* New message
* New follower
* New subscriber
* Startup feedback
* Startup rating
* Comment
* Investment interest
* News updates

For the first implementation, focus on messages and important activity.

---

# 48. SECURITY — RLS

Enable Row Level Security on all exposed tables.

Create explicit policies for:

* SELECT
* INSERT
* UPDATE
* DELETE

Examples:

User can edit own profile.

User can edit own startup ideas.

User can delete own posts.

User can view private messages only if they are conversation members.

Investor can rate startup only if permitted.

Admin can manage news.

Public users can only read published public content.

Do not rely on UI hiding.

---

# 49. DATABASE TESTING

Create RLS tests.

Test:

Anonymous user

Authenticated normal user

Student

Investor

Business owner

Admin

Verify that unauthorized users cannot:

* Read private data
* Modify other users' profiles
* Modify other users' startups
* Read private conversations
* Publish news
* Access admin data

---

# 50. FRONTEND STATE

After database operations:

Do not force unnecessary full-page reloads.

Use:

* React state
* Server refresh where appropriate
* Optimistic UI for likes/follows where safe
* Loading states
* Error states
* Success states

Example:

User clicks:

**Follow**

Button immediately changes:

Following

Then backend confirms.

If backend fails:

Revert state and show error.

---

# 51. FORM UX

Every form must have:

Loading state

Validation

Error message

Success message

Disabled submit while saving

Clear labels

Helpful placeholders

Do not use browser alert() for normal UX.

Use polished inline/toast feedback.

---

# 52. FRONTEND/BACKEND DATA FLOW

Every major user action should follow:

```text
User Action
↓
Validation
↓
Next.js / Supabase
↓
Database
↓
Success/Error
↓
Update UI
```

Examples:

Edit profile:

Frontend form
↓
Supabase update
↓
profiles table
↓
Updated profile shown immediately

Create startup:

Submit Idea
↓
Supabase insert
↓
startup_ideas
↓
My Ideas updated

Follow investor:

Follow
↓
follows insert
↓
Button becomes Following
↓
Investor appears in feed

Message:

Send
↓
messages insert
↓
Realtime update
↓
Receiver sees message

News:

Admin publishes
↓
news_articles status = published
↓
Public Tech News automatically displays it

---

# 53. ERROR HANDLING

Handle:

* Network failure
* Authentication expiry
* Unauthorized action
* Validation error
* File upload failure
* Database failure
* Missing records

Show human-readable messages.

Do not expose raw database errors to users.

---

# 54. LOADING STATES

Use skeleton loaders for:

* Startup cards
* Investor profiles
* News cards
* Feed
* Messages
* Profile data

Do not show blank white areas while data loads.

---

# 55. EMPTY STATES

Create polished empty states.

Examples:

No startup ideas:

**No ideas here yet.**

CTA:

**Submit Your Idea**

No messages:

**Your conversations will appear here.**

No saved items:

**Save ideas, investors and posts to find them later.**

No requirements:

**Tell us what your business needs.**

---

# 56. KEEP PUBLIC WEBSITE FAST

Public pages should only query necessary data.

Do not load the entire database.

Use pagination / limits.

For:

Startup Ideas

Investors

News

Posts

Messages

use appropriate pagination or infinite loading.

---

# 57. SEARCH

Search should query database-backed data.

Support:

Startup ideas

Investors

Founders

Business owners

News

Posts

Use appropriate indexes for commonly searched fields.

Do not download all records to the browser and filter locally.

---

# 58. SLUGS

Use unique slugs for public:

Startup Ideas

News Articles

Profiles where appropriate.

Example:

```text
/startup-ideas/edubridge

/tech-news/ai-startups-india

/investors/john-doe
```

---

# 59. PUBLIC VS PRIVATE DATA

Clearly separate:

Public:

Published news

Public startup ideas

Public profiles

Public posts

Private:

Private startup ideas

Investor-only startup ideas

Private messages

Personal account data

Admin data

Business private requirements where applicable

Use database authorization accordingly.

---

# 60. FINAL IMPLEMENTATION REQUIREMENT

Do NOT stop after creating the database schema.

Connect the actual existing UI to the database.

I want a working flow:

Signup
→ Create Profile
→ Edit Profile
→ Submit Startup
→ View Startup
→ Investor rates startup
→ Investor comments
→ Student sees feedback
→ Follow investor
→ Investor appears in feed
→ Message investor/founder
→ Business owner creates SaaS requirement
→ User updates requirement
→ User submits feedback
→ Admin logs in
→ Admin creates Tech News
→ Admin uploads image
→ Admin publishes
→ News appears on public Tech News page

Everything must work through the frontend.

---

# 61. DO NOT BREAK EXISTING DESIGN

This is critical.

The existing FounderBridge UI has already been designed.

Do NOT replace it with generic dashboard templates.

Keep the current visual language.

Build functionality underneath the existing interface.

For authenticated profile/dashboard screens, reuse:

* Existing typography
* Existing buttons
* Existing cards
* Existing spacing
* Existing colors
* Existing animations
* Existing icons

The backend should make the current product functional, not visually replace it.

---

# 62. FINAL STACK

Final architecture:

```text
GitHub Student Pack
        │
        └── Free .TECH domain
                  │
                  ▼
               Vercel
                  │
                  ▼
          Next.js + JavaScript
                  │
          ┌───────┴────────┐
          │                │
      Tailwind          Supabase
                           │
              ┌────────────┼─────────────┐
              │            │             │
           Auth        PostgreSQL     Storage
              │            │             │
              │            │          Images
              │            │
              │         RLS
              │            │
              └─────── Realtime
                           │
                        Messages
```

The result should be a **real full-stack FounderBridge application**, while keeping the existing frontend design intact.
