import { supabase } from "../lib/supabase/client";

// All admin operations require the user to have role='admin' in profiles.
// The backend enforces this via RLS. The frontend only calls these after
// verifying admin role from the session profile.

export async function getAdminStats() {
  const { data, error } = await supabase.from("admin_stats").select("*").single();
  if (error) throw error;
  return data;
}

export async function getAllUsers(limit = 50, offset = 0) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, username, role, created_at, location, avatar_url")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) throw error;
  return data ?? [];
}

export async function getAllNews(limit = 50, offset = 0) {
  const { data, error } = await supabase
    .from("news_articles")
    .select("id, title, slug, category, status, published_at, created_at, created_by")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) throw error;
  return data ?? [];
}

export async function createNews(article: {
  title: string;
  summary?: string;
  content?: string;
  category: string;
  source_name?: string;
  source_url?: string;
  status: string;
  created_by: string;
}) {
  const { data, error } = await supabase
    .from("news_articles")
    .insert(article)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateNews(id: string, updates: Record<string, unknown>) {
  const { data, error } = await supabase
    .from("news_articles")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteNews(id: string) {
  const { error } = await supabase.from("news_articles").delete().eq("id", id);
  if (error) throw error;
}

export async function publishNews(id: string) {
  return updateNews(id, { status: "published" });
}

export async function unpublishNews(id: string) {
  return updateNews(id, { status: "draft" });
}

export async function archiveNews(id: string) {
  return updateNews(id, { status: "archived" });
}

export async function uploadNewsImage(adminId: string, newsId: string, file: File) {
  const ext = file.name.split(".").pop();
  const path = `${adminId}/${newsId}.${ext}`;
  const { error } = await supabase.storage
    .from("news-images")
    .upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from("news-images").getPublicUrl(path);
  return data.publicUrl;
}

export async function getAllStartups(limit = 50, offset = 0) {
  const { data, error } = await supabase
    .from("startup_ideas")
    .select("id, title, industry, stage, visibility, avg_rating, created_at, profiles!startup_ideas_founder_id_fkey(full_name)")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) throw error;
  return data ?? [];
}

export async function hideStartup(id: string) {
  return supabase.from("startup_ideas").update({ visibility: "private" }).eq("id", id);
}
