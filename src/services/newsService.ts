import { supabase } from "../lib/supabase/client";

export async function getPublishedNews(options: { category?: string; limit?: number; offset?: number } = {}) {
  let query = supabase
    .from("news_articles")
    .select("id, title, slug, summary, cover_image_url, category, source_name, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (options.category) query = query.eq("category", options.category);
  if (options.limit)    query = query.limit(options.limit);
  if (options.offset)   query = query.range(options.offset, (options.offset + (options.limit ?? 20)) - 1);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getNewsBySlug(slug: string) {
  const { data, error } = await supabase
    .from("news_articles")
    .select("*, profiles!news_articles_created_by_fkey(full_name)")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  if (error) throw error;
  return data;
}

export async function searchNews(query: string, limit = 10) {
  const { data, error } = await supabase
    .from("news_articles")
    .select("id, title, slug, summary, category, published_at")
    .eq("status", "published")
    .ilike("title", `%${query}%`)
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}
