export type PostType = "investor_insight" | "startup_update" | "investment_interest" | "founder_update" | "business_need" | "tech_insight";

export interface Post {
  id: string;
  type: PostType;
  author: {
    id: string;
    name: string;
    avatar: string;
    role: string;
    verified?: boolean;
  };
  timestamp: string;
  content: string;
  image?: string;
  relatedStartup?: { id: string; name: string; category: string };
  likes: number;
  comments: number;
  saves: number;
  liked?: boolean;
  saved?: boolean;
  tags?: string[];
}

export const posts: Post[] = [
  {
    id: "p1",
    type: "investor_insight",
    author: {
      id: "1",
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop",
      role: "Angel Investor",
      verified: true,
    },
    timestamp: "2h ago",
    content: "The best student founders I've backed all had one thing in common: they were building for a problem they personally lived with for years before writing a line of code. Market research is fine. Lived experience is irreplaceable.\n\nIf you're a student founder — lead with what you know. That's your unfair advantage.",
    likes: 142,
    comments: 18,
    saves: 34,
    tags: ["Founder Advice", "Early Stage"],
  },
  {
    id: "p2",
    type: "startup_update",
    author: {
      id: "s1",
      name: "Aisha Okonkwo",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b2d5?w=80&h=80&fit=crop",
      role: "Founder · EduBridge",
    },
    timestamp: "4h ago",
    content: "We just crossed 1,200 active students on EduBridge. What started as a university project 8 months ago is now running in 3 schools in Nairobi.\n\nEvery morning I see teachers using our dashboard to flag struggling students before they fall behind. That's the product I imagined. It's real now.\n\n🎯 Currently: Pre-seed round. Seeking $120K.",
    image: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=700&h=400&fit=crop",
    relatedStartup: { id: "1", name: "EduBridge", category: "EdTech" },
    likes: 89,
    comments: 22,
    saves: 41,
    tags: ["EdTech", "Milestone"],
  },
  {
    id: "p3",
    type: "investment_interest",
    author: {
      id: "2",
      name: "David Osei",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop",
      role: "VC Partner · Volta Ventures",
      verified: true,
    },
    timestamp: "6h ago",
    content: "Just rated FreightFlow 4.8/5 on FounderBridge. What Marcus has built in 90 days — 180 shipments, $34K GMV, 92% on-time delivery — is a stronger early signal than most Series A decks I see.\n\nWest Africa's logistics corridor problem is real and enormous. Watching closely.",
    relatedStartup: { id: "2", name: "FreightFlow", category: "Logistics" },
    likes: 67,
    comments: 9,
    saves: 28,
    tags: ["Logistics", "West Africa", "Investment"],
  },
  {
    id: "p4",
    type: "tech_insight",
    author: {
      id: "3",
      name: "Natalie Russo",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop",
      role: "VC Partner · HealthFront Capital",
      verified: true,
    },
    timestamp: "9h ago",
    content: "Controversial opinion: most 'AI health' startups are building for the wrong user.\n\nThey build patient-facing apps. The real money and the real impact is in the clinical workflow — what happens between the doctor and the EHR system. That's where friction lives. That's where budgets move.\n\nStudent founders: if you're in health, talk to 20 clinicians before you write a spec.",
    likes: 201,
    comments: 45,
    saves: 73,
    tags: ["HealthTech", "Product Strategy"],
  },
  {
    id: "p5",
    type: "founder_update",
    author: {
      id: "s2",
      name: "Jordan Tran",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop",
      role: "Founder · StackCoach",
    },
    timestamp: "12h ago",
    content: "StackCoach hit $47K MRR this month. 620 engineering teams trust our AI code reviewer.\n\nThe thing nobody tells you about B2B SaaS: your best growth channel is your product. Every inline comment StackCoach leaves is a tiny piece of marketing. Engineers share good reviews. They remember the tool that explained the WHY, not just the what.\n\nThanks to everyone who believed in us at the idea stage.",
    relatedStartup: { id: "5", name: "StackCoach", category: "DevTools" },
    likes: 318,
    comments: 56,
    saves: 92,
    tags: ["DevTools", "MRR", "Growth"],
  },
  {
    id: "p6",
    type: "business_need",
    author: {
      id: "b1",
      name: "Amara Wellness",
      avatar: "https://images.unsplash.com/photo-1753351052046-8c6818304a4f?w=80&h=80&fit=crop",
      role: "Business Owner",
    },
    timestamp: "1d ago",
    content: "🔍 Looking for a custom booking + staff management system for our 3-location wellness centre.\n\nWe currently use 4 different tools that don't talk to each other. We need one system that handles: client bookings, therapist schedules, payments, and monthly revenue per location.\n\nIf you build custom SaaS — let's talk.",
    likes: 34,
    comments: 12,
    saves: 19,
    tags: ["SaaS Need", "Wellness", "Custom Software"],
  },
  {
    id: "p7",
    type: "investor_insight",
    author: {
      id: "4",
      name: "James Park",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop",
      role: "Angel Investor",
    },
    timestamp: "1d ago",
    content: "After 14 investments I've noticed: the ideas that sound boring in the pitch are often the ones that actually get built into real companies.\n\nInventory management for indie bookshops. HR tools for 50-person factories. Custom billing for small clinics.\n\nBoring is durable. Durable is valuable.",
    likes: 177,
    comments: 31,
    saves: 55,
    tags: ["Vertical SaaS", "Investment Philosophy"],
  },
  {
    id: "p8",
    type: "startup_update",
    author: {
      id: "s3",
      name: "Lena Müller",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop",
      role: "Founder · CarbonClock",
    },
    timestamp: "2d ago",
    content: "EU enforcement of CSRD started this week. Our pipeline tripled overnight.\n\nCarbonClock was built for exactly this moment — SMEs that have no idea how to comply. €9.4K MRR, 32 paying customers, 0 churn.\n\nIf you know any European SMEs facing ESG reporting pressure — send them our way.",
    relatedStartup: { id: "4", name: "CarbonClock", category: "CleanTech" },
    likes: 124,
    comments: 17,
    saves: 48,
    tags: ["CleanTech", "CSRD", "Milestone"],
  },
];

export const conversations = [
  {
    id: "c1",
    with: {
      id: "1",
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop",
      role: "Angel Investor",
      online: true,
    },
    lastMessage: "I'd love to learn more about the traction you've mentioned.",
    lastTime: "2h ago",
    unread: 2,
    messages: [
      { id: "m1", from: "them", text: "Hi! I saw your startup EduBridge on FounderBridge. Very impressed by the traction.", time: "Yesterday, 3:42 PM" },
      { id: "m2", from: "me", text: "Thank you Sarah! We've been working really hard on the product for the past 8 months.", time: "Yesterday, 4:01 PM" },
      { id: "m3", from: "them", text: "The 89% retention after 60 days is particularly interesting to me. Can you share more context around how you're measuring that?", time: "Yesterday, 4:15 PM" },
      { id: "m4", from: "me", text: "Of course. We track daily active students per school, and retention is measured as students still using the platform at the 60-day mark from their first login.", time: "Yesterday, 4:32 PM" },
      { id: "m5", from: "them", text: "I'd love to learn more about the traction you've mentioned.", time: "2h ago" },
    ],
  },
  {
    id: "c2",
    with: {
      id: "2",
      name: "David Osei",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop",
      role: "VC Partner · Volta Ventures",
      online: false,
    },
    lastMessage: "Let's schedule a call this week.",
    lastTime: "1d ago",
    unread: 0,
    messages: [
      { id: "m1", from: "them", text: "Marcus — FreightFlow is exactly the kind of infrastructure play we've been looking for.", time: "2 days ago, 10:00 AM" },
      { id: "m2", from: "me", text: "Really appreciate that David. Your portfolio in West Africa logistics is something I've been following.", time: "2 days ago, 10:22 AM" },
      { id: "m3", from: "them", text: "Let's schedule a call this week.", time: "1d ago" },
    ],
  },
  {
    id: "c3",
    with: {
      id: "3",
      name: "Natalie Russo",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop",
      role: "VC Partner · HealthFront",
      online: false,
    },
    lastMessage: "The ZK proof approach is genuinely novel for clinical data.",
    lastTime: "3d ago",
    unread: 0,
    messages: [
      { id: "m1", from: "them", text: "The ZK proof approach is genuinely novel for clinical data.", time: "3d ago" },
    ],
  },
];

export const suggestions = [
  { id: "s1", name: "Priya Sundaram", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b2d5?w=80&h=80&fit=crop", role: "Founder · MedVault", mutual: 3 },
  { id: "s2", name: "James Park",     avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop", role: "Angel Investor", mutual: 5 },
  { id: "s3", name: "Fatima Youssef", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop", role: "Founder · LocalShelve", mutual: 2 },
];

export const trendingTopics = [
  { tag: "#EdTech", posts: 234 },
  { tag: "#CSRD2026", posts: 189 },
  { tag: "#StudentFounders", posts: 156 },
  { tag: "#AfricaTech", posts: 143 },
  { tag: "#VerticalSaaS", posts: 121 },
  { tag: "#DevTools", posts: 98 },
];
