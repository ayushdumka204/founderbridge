import { supabase } from "../lib/supabase/client";

export async function getPublicStartups(options: { industry?: string; stage?: string; limit?: number; offset?: number } = {}) {
  let query = supabase
    .from("startup_ideas")
    .select("*, profiles!startup_ideas_founder_id_fkey(full_name, avatar_url, username)")
    .eq("visibility", "public")
    .order("created_at", { ascending: false });

  if (options.industry) query = query.eq("industry", options.industry);
  if (options.stage)    query = query.eq("stage", options.stage);
  if (options.limit)    query = query.limit(options.limit);
  if (options.offset)   query = query.range(options.offset, (options.offset + (options.limit ?? 20)) - 1);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getStartupBySlug(slug: string) {
  const { data, error } = await supabase
    .from("startup_ideas")
    .select("*, profiles!startup_ideas_founder_id_fkey(id, full_name, avatar_url, username, bio, location)")
    .eq("slug", slug)
    .single();
  if (error) throw error;
  return data;
}

export async function getStartupById(id: string) {
  const { data, error } = await supabase
    .from("startup_ideas")
    .select("*, profiles!startup_ideas_founder_id_fkey(id, full_name, avatar_url, username, bio)")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function getMyStartups(founderId: string) {
  const { data, error } = await supabase
    .from("startup_ideas")
    .select("*")
    .eq("founder_id", founderId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createStartup(startup: Record<string, unknown>) {
  const { data, error } = await supabase
    .from("startup_ideas")
    .insert(startup)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateStartup(id: string, updates: Record<string, unknown>) {
  const { data, error } = await supabase
    .from("startup_ideas")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteStartup(id: string) {
  const { error } = await supabase.from("startup_ideas").delete().eq("id", id);
  if (error) throw error;
}

export async function uploadStartupImage(founderId: string, startupId: string, file: File) {
  const ext = file.name.split(".").pop();
  const path = `${founderId}/${startupId}.${ext}`;
  const { error } = await supabase.storage.from("startup-images").upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from("startup-images").getPublicUrl(path);
  return data.publicUrl;
}

export async function rateStartup(startupId: string, investorId: string, rating: number, feedback?: string, tags?: string[]) {
  const { data, error } = await supabase
    .from("startup_ratings")
    .upsert({ startup_id: startupId, investor_id: investorId, rating, feedback, tags }, { onConflict: "startup_id,investor_id" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getStartupRatings(startupId: string) {
  const { data, error } = await supabase
    .from("startup_ratings")
    .select("*, profiles!startup_ratings_investor_id_fkey(full_name, avatar_url, role)")
    .eq("startup_id", startupId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function searchStartups(query: string, limit = 20) {
  const { data, error } = await supabase
    .from("startup_ideas")
    .select("id, title, slug, short_pitch, industry, stage, cover_image_url, avg_rating")
    .eq("visibility", "public")
    .or(`title.ilike.%${query}%,short_pitch.ilike.%${query}%,industry.ilike.%${query}%`)
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}
