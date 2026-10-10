/**
 * FounderBridge — Demo User Seed Script
 *
 * Creates 10 demo auth users (6 founders + 4 investors) via the Supabase Admin Auth API,
 * then inserts matching profiles, sub-profiles, and startup ideas.
 *
 * Requirements:
 *   SUPABASE_URL            — e.g. https://oeqtobmnhjejdtccfssi.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY — service role key (NEVER commit or expose to browser)
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node backend/scripts/seed-demo-users.js
 *
 * Idempotent: safe to run multiple times. Existing users/profiles/startups are skipped.
 */

const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("ERROR: Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ── Demo users ──────────────────────────────────────────────────────────────

const DEMO_PASSWORD = "Demo1234!";

const FOUNDERS = [
  {
    email: "aisha@edubridge.demo",
    username: "aisha_okonkwo",
    full_name: "Aisha Okonkwo",
    bio: "Building AI-powered adaptive tutoring for K-12 classrooms in emerging markets. Pre-seed. Nairobi.",
    location: "Nairobi, Kenya",
    website: "https://edubridge.io",
    avatar_url: "https://images.unsplash.com/photo-1494790108755-2616b612b2d5?w=200&h=200&fit=crop",
    followers_count: 412,
    following_count: 87,
    student: {
      university: "University of Nairobi",
      course: "Computer Science",
      graduation_year: "2024",    // TEXT per schema
      interests: ["EdTech", "AI", "Education"],
    },
    startup: {
      title: "EduBridge",
      slug: "edubridge",
      short_pitch: "AI-powered tutoring that adapts to each student's learning pace in real time.",
      description: "EduBridge uses adaptive AI to create personalized learning paths for K-12 students, helping teachers identify gaps before they become failures. Partnered with 3 schools in Nairobi with 1,200 active students.",
      problem: "Traditional classrooms can't scale personalization. Teachers manage 40+ students with no tools to catch individual learning gaps early.",
      solution: "Our AI model tracks micro-assessments in real time, adjusting content difficulty and flagging struggling students for targeted teacher intervention.",
      target_market: "K-12 schools in emerging markets with limited specialist teacher capacity.",
      business_model: "SaaS subscription per school ($299/month). Premium parent portal ($9/month).",
      industry: "EdTech",
      stage: "Pre-Seed",
      funding_required: "120000",  // TEXT per schema
      traction: "3 schools, 1,200 students, 89% retention after 60 days.",
      website_url: "https://edubridge.io",
      demo_url: "https://demo.edubridge.io",
      cover_image_url: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=800&h=450&fit=crop&auto=format",
      visibility: "public",
      avg_rating: 4.7,
      rating_count: 14,
      investor_interest_count: 14,
    },
  },
  {
    email: "marcus@freightflow.demo",
    username: "marcus_reid",
    full_name: "Marcus Reid",
    bio: "Solving last-mile freight matching in West Africa. 180 shipments. $34K GMV in 90 days.",
    location: "Lagos, Nigeria",
    website: "https://freightflow.co",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    followers_count: 298,
    following_count: 54,
    student: {
      university: "Lagos Business School",
      course: "Entrepreneurship",
      graduation_year: "2023",
      interests: ["Logistics", "Supply Chain", "Africa Tech"],
    },
    startup: {
      title: "FreightFlow",
      slug: "freightflow",
      short_pitch: "Real-time freight matching for last-mile logistics in underserved corridors.",
      description: "FreightFlow is a two-sided marketplace connecting SME shippers to verified truck owners in West Africa's secondary logistics corridors.",
      problem: "80% of trucks in West Africa run empty on return trips. SMEs can't access reliable freight at fair rates.",
      solution: "Real-time matching algorithm + verified driver network. Instant quotes, GPS tracking, guaranteed delivery windows.",
      target_market: "SME manufacturers and distributors in Nigeria, Ghana, and Côte d'Ivoire.",
      business_model: "6% transaction fee on each booked shipment.",
      industry: "Logistics",
      stage: "Seed",
      funding_required: "450000",
      traction: "180 shipments in 90 days. $34,000 GMV. 92% on-time delivery.",
      website_url: "https://freightflow.co",
      demo_url: null,
      cover_image_url: "https://images.unsplash.com/photo-1622151834677-70f982c9adef?w=800&h=450&fit=crop&auto=format",
      visibility: "public",
      avg_rating: 4.4,
      rating_count: 22,
      investor_interest_count: 22,
    },
  },
  {
    email: "priya@medvault.demo",
    username: "priya_sundaram",
    full_name: "Priya Sundaram",
    bio: "Zero-knowledge health records. Privacy-first patient data ownership. Based in Berlin.",
    location: "Berlin, Germany",
    website: null,
    avatar_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    followers_count: 187,
    following_count: 43,
    student: {
      university: "TU Berlin",
      course: "Computer Engineering",
      graduation_year: "2024",
      interests: ["Privacy", "HealthTech", "Cryptography"],
    },
    startup: {
      title: "MedVault",
      slug: "medvault",
      short_pitch: "Patient-controlled health records with zero-knowledge encryption.",
      description: "MedVault gives patients true ownership of their health data through zero-knowledge proofs — share specific records with doctors without exposing your full history.",
      problem: "Patient data is siloed across hospitals and clinics. Patients can't access their own records easily, let alone share selectively.",
      solution: "Encrypted personal health vault. ZK-proof sharing layer. QR code access for emergency scenarios.",
      target_market: "Privacy-conscious patients and clinics in the EU and US.",
      business_model: "Freemium consumer app. B2B clinic integration at $99/month.",
      industry: "HealthTech",
      stage: "Idea",
      funding_required: "80000",
      traction: "450 beta users. Pilot with 2 private clinics in Berlin.",
      website_url: null,
      demo_url: "https://medvault.app/demo",
      cover_image_url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=450&fit=crop&auto=format",
      visibility: "investors_only",
      avg_rating: 4.2,
      rating_count: 9,
      investor_interest_count: 9,
    },
  },
  {
    email: "lena@carbonclock.demo",
    username: "lena_muller",
    full_name: "Lena Müller",
    bio: "Automated carbon accounting for European SMEs. €9.4K MRR, 32 customers, 0 churn.",
    location: "Berlin, Germany",
    website: "https://carbonclock.eu",
    avatar_url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop",
    followers_count: 334,
    following_count: 72,
    student: {
      university: "WHU Otto Beisheim School",
      course: "Business Administration",
      graduation_year: "2024",
      interests: ["CleanTech", "ESG", "SaaS"],
    },
    startup: {
      title: "CarbonClock",
      slug: "carbonclock",
      short_pitch: "Automated carbon accounting for SMEs — no consultants, no spreadsheets.",
      description: "CarbonClock integrates with existing accounting software to automatically calculate and report a company's Scope 1, 2, and 3 emissions.",
      problem: "EU CSRD mandates carbon reporting for 50,000+ companies. Most SMEs have no tools to comply.",
      solution: "API integrations with Xero, QuickBooks, Sage. Automated emission calculations. Audit-ready PDF reports.",
      target_market: "European SMEs with 50–500 employees facing mandatory ESG reporting.",
      business_model: "$299/month SaaS. $1,500 onboarding package.",
      industry: "CleanTech",
      stage: "Pre-Seed",
      funding_required: "200000",
      traction: "32 paying SMEs. €9,400 MRR. 0 churn in first 6 months.",
      website_url: "https://carbonclock.eu",
      demo_url: "https://app.carbonclock.eu/demo",
      cover_image_url: "https://images.unsplash.com/photo-1737575291989-0882b03f97b6?w=800&h=450&fit=crop&auto=format",
      visibility: "public",
      avg_rating: 4.6,
      rating_count: 18,
      investor_interest_count: 18,
    },
  },
  {
    email: "jordan@stackcoach.demo",
    username: "jordan_tran",
    full_name: "Jordan Tran",
    bio: "AI code reviewer trained on senior engineer feedback. $47K MRR. 620 engineering teams.",
    location: "San Francisco, CA",
    website: "https://stackcoach.dev",
    avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    followers_count: 567,
    following_count: 112,
    student: {
      university: "UC Berkeley",
      course: "EECS",
      graduation_year: "2023",
      interests: ["DevTools", "AI", "Engineering"],
    },
    startup: {
      title: "StackCoach",
      slug: "stackcoach",
      short_pitch: "AI coding mentor that reviews pull requests like a senior engineer.",
      description: "StackCoach sits in your GitHub workflow and reviews pull requests with the depth of a staff engineer — catching architectural issues, not just style problems.",
      problem: "Junior developers don't get enough senior code review time. PRs merge with structural problems that cause tech debt.",
      solution: "GitHub App analyzing PRs using a fine-tuned model trained on 1M senior-reviewed diffs. Leaves inline comments explaining the why.",
      target_market: "Engineering teams of 5–50 developers at fast-growing startups.",
      business_model: "$19/dev/month. Enterprise contracts from $2k/month.",
      industry: "DevTools",
      stage: "Seed",
      funding_required: "350000",
      traction: "620 active teams. $47k MRR. 4.9/5 rating on GitHub Marketplace.",
      website_url: "https://stackcoach.dev",
      demo_url: "https://stackcoach.dev/demo",
      cover_image_url: "https://images.unsplash.com/photo-1758873272809-7947b9a73fe5?w=800&h=450&fit=crop&auto=format",
      visibility: "public",
      avg_rating: 4.8,
      rating_count: 31,
      investor_interest_count: 31,
    },
  },
  {
    email: "fatima@localshelve.demo",
    username: "fatima_youssef",
    full_name: "Fatima Youssef",
    bio: "Purpose-built inventory and POS system for independent bookshops. 12 shops in beta.",
    location: "London, UK",
    website: null,
    avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
    followers_count: 142,
    following_count: 38,
    student: {
      university: "London School of Economics",
      course: "Information Systems",
      graduation_year: "2025",
      interests: ["RetailTech", "IndieCommerce", "Software"],
    },
    startup: {
      title: "LocalShelve",
      slug: "localshelve",
      short_pitch: "Inventory and order management built for independent bookshops.",
      description: "LocalShelve is POS, inventory, and customer loyalty software designed specifically for the 25,000 independent bookshops in the US and UK.",
      problem: "Generic POS systems ignore ISBN management, used book pricing, and event ticketing — core workflows of indie bookshops.",
      solution: "Purpose-built system: ISBN-aware inventory, buy/sell used books, author event management, and customer wishlist engine.",
      target_market: "Independent bookshops with 1–5 locations.",
      business_model: "$89/month per location.",
      industry: "RetailTech",
      stage: "Idea",
      funding_required: "60000",
      traction: "12 shops in beta. Processing $180k in monthly transactions.",
      website_url: null,
      demo_url: null,
      cover_image_url: "https://images.unsplash.com/photo-1543269865-f576bdee5d1d?w=800&h=450&fit=crop&auto=format",
      visibility: "public",
      avg_rating: 3.9,
      rating_count: 6,
      investor_interest_count: 6,
    },
  },
];

const INVESTORS = [
  {
    email: "sarah@angel.demo",
    username: "sarah_chen",
    full_name: "Sarah Chen",
    bio: "Former CTO at two unicorns. Now backing student founders building infrastructure for the next decade. Developer tools and applied AI.",
    location: "San Francisco, CA",
    website: "https://sarahchen.vc",
    avatar_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    followers_count: 1840,
    following_count: 203,
    investor: {
      investor_type: "Angel Investor",
      investment_interests: ["AI/ML", "DevTools", "SaaS", "FinTech"],
      preferred_stages: ["Idea", "Pre-Seed", "Seed"],
      investment_range_min: "25000",   // TEXT per schema
      investment_range_max: "150000",  // TEXT per schema
      investment_philosophy: "I invest in founders, not decks. Show me lived experience with the problem.",
    },
  },
  {
    email: "david@volta.demo",
    username: "david_osei",
    full_name: "David Osei",
    bio: "Managing Partner at Volta Ventures. Focused on African and diaspora-led startups in logistics, fintech, and climate.",
    location: "Lagos / London",
    website: "https://voltaventures.vc",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    followers_count: 2341,
    following_count: 178,
    investor: {
      investor_type: "VC Partner",
      investment_interests: ["Logistics", "FinTech", "CleanTech", "AgriTech"],
      preferred_stages: ["Pre-Seed", "Seed", "Series A"],
      investment_range_min: "100000",
      investment_range_max: "750000",
      investment_philosophy: "Africa is where the next logistics and climate infrastructure will be built.",
    },
  },
  {
    email: "natalie@healthfront.demo",
    username: "natalie_russo",
    full_name: "Natalie Russo",
    bio: "Partner at HealthFront Capital. Background in genomics. Looking for founders who understand clinical workflows deeply.",
    location: "Boston, MA",
    website: "https://healthfront.vc",
    avatar_url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop",
    followers_count: 987,
    following_count: 134,
    investor: {
      investor_type: "VC Partner",
      investment_interests: ["HealthTech", "BioTech", "Digital Health"],
      preferred_stages: ["Idea", "Pre-Seed", "Seed"],
      investment_range_min: "50000",
      investment_range_max: "500000",
      investment_philosophy: "Clinical workflow is where impact and revenue align. That's where I focus.",
    },
  },
  {
    email: "james@angel.demo",
    username: "james_park",
    full_name: "James Park",
    bio: "Solo angel. Built and sold two B2B SaaS companies. Helping early-stage founders avoid the mistakes I made. Vertical SaaS and niche marketplaces.",
    location: "Austin, TX",
    website: null,
    avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
    followers_count: 743,
    following_count: 89,
    investor: {
      investor_type: "Angel Investor",
      investment_interests: ["SaaS", "Marketplaces", "RetailTech", "B2B"],
      preferred_stages: ["Idea", "Pre-Seed"],
      investment_range_min: "10000",
      investment_range_max: "75000",
      investment_philosophy: "Boring is durable. Durable is valuable. Niche vertical SaaS compounds.",
    },
  },
];

// ── Helpers ─────────────────────────────────────────────────────────────────

async function getOrCreateAuthUser(email) {
  // Check for existing user by listing and filtering (Admin API doesn't have getByEmail)
  const { data: list, error: listErr } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  if (listErr) throw listErr;
  const existing = list.users.find((u) => u.email === email);
  if (existing) {
    console.log(`  auth user exists: ${email} (${existing.id})`);
    return existing.id;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: DEMO_PASSWORD,
    email_confirm: true,
  });
  if (error) throw error;
  console.log(`  created auth user: ${email} (${data.user.id})`);
  return data.user.id;
}

async function upsertProfile(userId, role, user) {
  // Check if profile already exists for this user_id
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    console.log(`  profile exists: ${user.username} (${existing.id})`);
    return existing.id;
  }

  const { data, error } = await supabase
    .from("profiles")
    .insert({
      user_id: userId,
      role,
      full_name: user.full_name,
      username: user.username,
      bio: user.bio,
      location: user.location,
      website: user.website,
      avatar_url: user.avatar_url,
      followers_count: user.followers_count,
      following_count: user.following_count,
    })
    .select("id")
    .single();

  if (error) throw error;
  console.log(`  created profile: ${user.username} (${data.id})`);
  return data.id;
}

async function upsertStudentProfile(profileId, student) {
  const { error } = await supabase
    .from("student_profiles")
    .upsert(
      {
        profile_id: profileId,
        university: student.university,
        course: student.course,
        graduation_year: student.graduation_year, // TEXT
        interests: student.interests,
      },
      { onConflict: "profile_id", ignoreDuplicates: true }
    );
  if (error) throw error;
  console.log(`  upserted student_profile for ${profileId}`);
}

async function upsertInvestorProfile(profileId, inv) {
  const { error } = await supabase
    .from("investor_profiles")
    .upsert(
      {
        profile_id: profileId,
        investor_type: inv.investor_type,
        investment_interests: inv.investment_interests,
        preferred_stages: inv.preferred_stages,
        investment_range_min: inv.investment_range_min, // TEXT
        investment_range_max: inv.investment_range_max, // TEXT
        investment_philosophy: inv.investment_philosophy,
      },
      { onConflict: "profile_id", ignoreDuplicates: true }
    );
  if (error) throw error;
  console.log(`  upserted investor_profile for ${profileId}`);
}

async function upsertStartupIdea(profileId, s) {
  // Check if slug already exists
  const { data: existing } = await supabase
    .from("startup_ideas")
    .select("id")
    .eq("slug", s.slug)
    .maybeSingle();

  if (existing) {
    console.log(`  startup_idea exists: ${s.slug}`);
    return;
  }

  const { error } = await supabase.from("startup_ideas").insert({
    founder_id: profileId,
    title: s.title,
    slug: s.slug,
    short_pitch: s.short_pitch,
    description: s.description,
    problem: s.problem,
    solution: s.solution,
    target_market: s.target_market,
    business_model: s.business_model,
    industry: s.industry,
    stage: s.stage,                         // startup_stage enum
    funding_required: s.funding_required,   // TEXT
    traction: s.traction,
    website_url: s.website_url,
    demo_url: s.demo_url,
    cover_image_url: s.cover_image_url,
    visibility: s.visibility,               // startup_visibility enum
    avg_rating: s.avg_rating,
    rating_count: s.rating_count,
    investor_interest_count: s.investor_interest_count,
  });

  if (error) throw error;
  console.log(`  created startup_idea: ${s.slug}`);
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n=== FounderBridge Demo Seed ===\n");

  // Founders
  console.log("── Founders ──────────────────────────────");
  for (const founder of FOUNDERS) {
    try {
      const userId = await getOrCreateAuthUser(founder.email);
      const profileId = await upsertProfile(userId, "student", founder);
      await upsertStudentProfile(profileId, founder.student);
      await upsertStartupIdea(profileId, founder.startup);
    } catch (err) {
      console.error(`  ERROR for ${founder.email}:`, err.message);
    }
  }

  // Investors
  console.log("\n── Investors ─────────────────────────────");
  for (const investor of INVESTORS) {
    try {
      const userId = await getOrCreateAuthUser(investor.email);
      const profileId = await upsertProfile(userId, "investor", investor);
      await upsertInvestorProfile(profileId, investor.investor);
    } catch (err) {
      console.error(`  ERROR for ${investor.email}:`, err.message);
    }
  }

  console.log("\n=== Seed complete ===\n");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
