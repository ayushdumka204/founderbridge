import { supabase } from "../lib/supabase/client";

export async function getFeedPosts(profileId: string | null, limit = 20, offset = 0) {
  // If authenticated, prioritize followed people's posts
  if (profileId) {
    const { data: followedIds } = await supabase
      .from("follows")
      .select("following_id")
      .eq("follower_id", profileId);

    const ids = followedIds?.map((f) => f.following_id) ?? [];

    // Posts from followed people first, then general posts
    const { data, error } = await supabase
      .from("feed_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    // Sort: followed authors first
    if (ids.length > 0) {
      return (data ?? []).sort((a, b) => {
        const aFollowed = ids.includes(a.author_id) ? 0 : 1;
        const bFollowed = ids.includes(b.author_id) ? 0 : 1;
        return aFollowed - bFollowed;
      });
    }
    return data ?? [];
  }

  const { data, error } = await supabase
    .from("feed_posts")
    .select("*")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) throw error;
  return data ?? [];
}

export async function createPost(post: {
  author_id: string;
  post_type: string;
  content: string;
  image_url?: string;
  startup_id?: string;
  tags?: string[];
}) {
  const { data, error } = await supabase
    .from("posts")
    .insert(post)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deletePost(id: string) {
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw error;
}

export async function likeContent(userId: string, contentType: string, contentId: string) {
  const { error } = await supabase
    .from("likes")
    .insert({ user_id: userId, content_type: contentType, content_id: contentId });
  if (error) throw error;
}

export async function unlikeContent(userId: string, contentType: string, contentId: string) {
  const { error } = await supabase
    .from("likes")
    .delete()
    .eq("user_id", userId)
    .eq("content_type", contentType)
    .eq("content_id", contentId);
  if (error) throw error;
}

export async function checkLiked(userId: string, contentType: string, contentId: string) {
  const { data } = await supabase
    .from("likes")
    .select("id")
    .eq("user_id", userId)
    .eq("content_type", contentType)
    .eq("content_id", contentId)
    .single();
  return !!data;
}

export async function saveItem(userId: string, itemType: string, itemId: string) {
  const { error } = await supabase
    .from("saved_items")
    .insert({ user_id: userId, item_type: itemType, item_id: itemId });
  if (error) throw error;
}

export async function unsaveItem(userId: string, itemType: string, itemId: string) {
  const { error } = await supabase
    .from("saved_items")
    .delete()
    .eq("user_id", userId)
    .eq("item_type", itemType)
    .eq("item_id", itemId);
  if (error) throw error;
}

export async function getSavedItems(userId: string) {
  const { data, error } = await supabase
    .from("saved_items")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getComments(contentType: string, contentId: string) {
  const { data, error } = await supabase
    .from("comments")
    .select("*, profiles!comments_user_id_fkey(full_name, avatar_url, username)")
    .eq("content_type", contentType)
    .eq("content_id", contentId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function addComment(userId: string, contentType: string, contentId: string, body: string) {
  const { data, error } = await supabase
    .from("comments")
    .insert({ user_id: userId, content_type: contentType, content_id: contentId, body })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteComment(id: string) {
  const { error } = await supabase.from("comments").delete().eq("id", id);
  if (error) throw error;
}

export async function uploadPostImage(userId: string, file: File) {
  const ext = file.name.split(".").pop();
  const path = `${userId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from("post-images").upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from("post-images").getPublicUrl(path);
  return data.publicUrl;
}
