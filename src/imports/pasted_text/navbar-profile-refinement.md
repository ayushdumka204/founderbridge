# FINAL REFINEMENT — NAVBAR + PROFILE SYSTEM

Make ONLY the following changes to the existing FounderBridge website.

**IMPORTANT: Everything else that is currently designed and working should remain exactly as it is.**

Do NOT redesign:

* Home page
* SaaS page
* Startup Ideas page
* Investors page
* Tech News page
* Contact page
* Existing cards
* Existing hero
* Existing imagery
* Existing colors
* Existing overall layout

Only refine the **navbar and user profile system** as described below.

---

# 1. REMOVE FEED AND MESSAGES FROM MAIN NAVBAR

IMPORTANT:

The current navbar has:

Home
SaaS
Startup Ideas
Investors
Tech News
Feed
Messages
Contact
Submit Idea
Build SaaS

REMOVE:

**Feed**

**Messages**

from the main navbar completely.

They must NOT appear as top-level navigation items.

The main public navbar should remain:

**FounderBridge**

Home
SaaS
Startup Ideas
Investors
Tech News

Right side:

Contact
Submit Idea
Build SaaS
Profile Icon

Do not add any other top-level navigation item.

---

# 2. ADD PROFILE ICON TO NAVBAR

Add a clean professional user/profile icon to the navbar.

Place it on the far right near the existing:

Submit Idea
Build SaaS

buttons.

The profile icon should be:

* Minimal
* Premium
* Clearly clickable
* Consistent with FounderBridge styling
* Approximately 36–40px
* Circular or softly rounded
* Dark/neutral icon
* Subtle border/background

Do NOT make it look like a generic large social-media avatar.

---

# 3. PROFILE ICON HOVER ANIMATION

When hovering over the profile icon:

* Slight background change
* Small elevation
* Subtle scale around 1.02–1.04
* Smooth 150–200ms transition

Make it clearly feel clickable.

---

# 4. PROFILE ICON CLICK

When the user clicks the profile icon, open a polished profile/user panel.

This can be:

* A dropdown panel on desktop
* A slide-over/profile panel on mobile

It should feel like part of the FounderBridge product.

Do NOT redirect to a completely separate unrelated interface immediately.

---

# 5. FIRST-TIME USER PROFILE SETUP

If the user has not created a profile yet, clicking the profile icon should open:

## Create Your FounderBridge Profile

Supporting text:

**Choose how you want to use FounderBridge.**

Show three large role choices:

### STUDENT / FOUNDER

**Share your startup ideas, connect with investors and build your network.**

### INVESTOR

**Discover promising startups, follow founders and explore investment opportunities.**

### BUSINESS OWNER

**Connect with founders, discover solutions and build software around your business.**

Optionally also allow:

### GENERAL USER

**Explore startups, technology, investors and business opportunities.**

The user selects one role.

---

# 6. ROLE SELECTION DESIGN

Make the role selection visually premium.

Use four clean cards.

Each card should have:

* Simple icon
* Role name
* Short description
* Small visual indicator

On hover:

* Slight elevation
* Border/accent transition
* Icon movement
* Background transition

On selection:

* Clear active border
* Subtle brand accent
* Check indicator

Do not use excessive colors.

---

# 7. PROFILE CREATION

After selecting a role, allow the user to create their profile.

Common fields:

* Profile photo
* Full name
* Username
* Bio
* Location
* Website
* LinkedIn
* X/Twitter
* Instagram

Then role-specific information.

---

# 8. STUDENT / FOUNDER PROFILE

If the user selects:

**Student / Founder**

Show fields such as:

* College / University
* Course
* Graduation year
* Skills
* Interests
* Startup name
* Startup category
* Startup stage
* Short startup description

Actions/features available:

**Submit Idea**

**My Ideas**

**Feed**

**Messages**

**Following**

**Saved**

The student's interface should prioritize:

Startup ideas
Investors
Networking
Feedback
Messages

---

# 9. INVESTOR PROFILE

If the user selects:

**Investor**

Show:

* Investor type
* Investment interests
* Industries
* Preferred startup stage
* Typical investment range
* Location
* Portfolio
* Investment philosophy
* Bio
* Social links

Investor interface should prioritize:

Startup discovery
Investor feed
Messages
Following
Saved startups
Ratings/feedback
Subscriptions

IMPORTANT:

The existing Investors page design should NOT be changed.

Keep the existing Investors page as it currently is.

Only add the ability for an investor to have a personalized profile/account experience.

---

# 10. BUSINESS OWNER PROFILE

If the user selects:

**Business Owner**

Show:

* Business name
* Owner name
* Industry
* Location
* Business size
* Website
* About business
* Current challenges
* Software/SaaS requirements

Business owner interface should prioritize:

SaaS requirements
Founders
Solutions
Business opportunities
Feed
Messages
Following

---

# 11. GENERAL USER PROFILE

If the user selects:

**General User**

Keep the interface simpler.

Allow:

* Profile
* Interests
* Following
* Saved startups
* Saved posts
* Feed
* Messages

The user can explore FounderBridge without investor/student/business-specific functionality.

---

# 12. ROLE-BASED INTERFACE

IMPORTANT:

The selected profile type should determine what the user sees throughout the logged-in experience.

Example:

### Student

Prioritize:

Startup Ideas
Investors
Feedback
My Ideas
Messages
Feed

### Investor

Prioritize:

Startup Ideas
Investments
Founders
Ratings
Messages
Feed

### Business Owner

Prioritize:

SaaS
Business Requirements
Founders
Solutions
Messages
Feed

### General User

Prioritize:

Tech News
Startup Ideas
People
Feed
Saved

Do NOT change the public website based on role.

Role-based personalization applies primarily to the user's logged-in/profile experience.

---

# 13. PROFILE AREA STRUCTURE

Once a user has created a profile, clicking the profile icon should open their personal area.

The profile area should contain:

### Profile

User's profile information.

### Feed

Personalized content.

### Messages

Private conversations.

### Following

People the user follows.

### Subscriptions

People the user subscribes to.

### Saved

Saved startups, posts and profiles.

### Activity

User activity.

### Settings

Profile/preferences.

The exact ordering can depend on the selected role.

---

# 14. FEED MUST STAY INSIDE PROFILE EXPERIENCE

IMPORTANT:

**Feed is NOT a main website navigation item.**

It must NOT appear in the public navbar.

Feed exists inside the authenticated/profile experience.

For example:

Profile Icon
↓
My Profile
↓
Feed

The user can access Feed from their profile/dashboard.

---

# 15. MESSAGES MUST STAY INSIDE PROFILE EXPERIENCE

IMPORTANT:

**Messages is NOT a main website navigation item.**

It must NOT appear in the public navbar.

Messages should only be accessible through:

Profile area
or
Message buttons inside profiles/startups/posts.

For example:

Investor Profile → Message

Startup Profile → Contact Founder

Profile Icon → Messages

---

# 16. PROFILE DASHBOARD

After the user has created a profile, their profile area should feel like a premium personal dashboard.

Top:

Profile photo
Name
Role
Bio

Then role-specific information.

Below:

Quick navigation:

**Profile | Feed | Messages | Following | Saved**

Do not make it look like a traditional admin dashboard.

It should feel like a **professional personal workspace**.

---

# 17. PROFILE DROPDOWN

For desktop, clicking the profile icon can first show a compact dropdown:

Profile name

Role

---

**View Profile**

**Feed**

**Messages**

**Following**

**Saved**

---

**Settings**

**Log out**

Keep it compact and premium.

Use clear separators.

Do not make the dropdown excessively large.

---

# 18. LOGGED-IN NAVBAR

Once the user has created a profile, keep the main navbar unchanged:

FounderBridge

Home
SaaS
Startup Ideas
Investors
Tech News

Right:

Contact
Submit Idea
Build SaaS
Profile Icon

Do NOT add:

Feed
Messages

to this navbar.

Feed and Messages remain inside the profile/user experience.

---

# 19. PROFILE ICON STATE

Before profile creation:

Show generic user icon.

After profile creation:

Show user's profile photo.

If no photo:

Show initials inside the same profile icon container.

Example:

**AD**

Keep the same dimensions and navbar spacing.

---

# 20. PROFILE ANIMATION

When clicking profile icon:

Use a polished animation:

* Fade
* Slight downward movement for dropdown
* 150–250ms

When closing:

Smooth reverse animation.

Do not use dramatic animations.

---

# 21. NAVBAR VISUAL REFINEMENT

Use the second screenshot as the visual reference for the navbar direction.

Make the navbar:

* Cleaner
* Darker text
* More readable
* More attractive
* More premium

Navigation text should have strong contrast.

Avoid the current slightly washed-out gray appearance.

Use a dark neutral text color.

Active page:

Brand accent color.

---

# 22. NAVIGATION CLICK ANIMATION

When a navigation item is clicked:

Add a subtle active transition.

Example:

Home

→ text smoothly changes to brand accent

→ small underline/indicator appears

→ tiny fade/slide transition

Keep it around 150–200ms.

Do NOT add large animated backgrounds.

---

# 23. NAVBAR HOVER

On hover:

* Slight accent color transition
* Subtle underline
* Very small movement if appropriate

The user should clearly understand that the navigation item is clickable.

---

# 24. NAVBAR SCROLL STATE

Keep the existing navbar sticky behavior.

On scroll:

* Slightly stronger background
* Subtle border
* Very light shadow

Keep it elegant.

Do not add heavy glassmorphism.

---

# 25. TEXT READABILITY PASS

While making these changes, check the existing website for any text that feels:

* Too light
* Too small
* Low contrast
* Difficult to read

Improve only those areas.

Pay special attention to:

* Navbar
* Hero supporting text
* Startup metadata
* Investor metadata
* News metadata
* Small labels
* Buttons

Do not unnecessarily change text sizes everywhere.

---

# 26. HOME HERO — KEEP CURRENT REFINEMENT

The current Home hero should remain as it is.

Keep:

* Existing hero image
* Idea Score card
* Headline
* Statistic
* CTA buttons
* Dark hero background

Keep the existing subtle animations.

Only fix any remaining readability problems.

Do not redesign the hero.

---

# 27. IMPORTANT — EVERYTHING ELSE STAYS THE SAME

Do NOT modify:

* SaaS page
* Startup Ideas page layout
* Investors page layout
* Tech News layout
* Contact page
* Existing cards
* Existing images
* Existing hero composition
* Existing content
* Existing color palette

Only integrate the new profile architecture.

---

# 28. FRONTEND ONLY

Use:

**Next.js + JavaScript + Tailwind CSS**

No backend yet.

Use mock/local frontend data.

Profile creation can work using frontend state/local mock data.

Feed and Messages can use mock data.

The architecture should be prepared for future backend/API integration.

---

# 29. FINAL USER EXPERIENCE

The final public navbar should be:

**FounderBridge | Home | SaaS | Startup Ideas | Investors | Tech News | Contact | Submit Idea | Build SaaS | Profile**

NOT:

**FounderBridge | Home | SaaS | Startup Ideas | Investors | Tech News | Feed | Messages | ...**

Feed and Messages belong to the user's personal/profile experience.

The overall product flow should be:

**Public Website**

↓

**Profile Icon**

↓

**Choose Role**

↓

**Create Profile**

↓

**Personalized User Experience**

↓

**Profile / Feed / Messages / Following / Saved**

The selected role should influence the user's personalized experience while the public FounderBridge website remains unchanged.

Make the final implementation feel **clean, premium, intentional and human-designed**.
