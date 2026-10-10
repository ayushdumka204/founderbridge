import { supabase } from "../lib/supabase/client";

export async function getProfileByUserId(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*, student_profiles(*), investor_profiles(*), business_profiles(*)")
    .eq("user_id", userId)
    .single();
  if (error) throw error;
  return data;
}

export async function getProfileById(id: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*, student_profiles(*), investor_profiles(*), business_profiles(*)")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function createProfile(profile: {
  user_id: string;
  role: string;
  full_name: string;
  username?: string;
  bio?: string;
  location?: string;
  website?: string;
  linkedin_url?: string;
  twitter_url?: string;
  instagram_url?: string;
}) {
  const { data, error } = await supabase
    .from("profiles")
    .insert(profile)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateProfile(id: string, updates: Record<string, unknown>) {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function upsertStudentProfile(profileId: string, data: Record<string, unknown>) {
  const { data: result, error } = await supabase
    .from("student_profiles")
    .upsert({ profile_id: profileId, ...data }, { onConflict: "profile_id" })
    .select()
    .single();
  if (error) throw error;
  return result;
}

export async function upsertInvestorProfile(profileId: string, data: Record<string, unknown>) {
  const { data: result, error } = await supabase
    .from("investor_profiles")
    .upsert({ profile_id: profileId, ...data }, { onConflict: "profile_id" })
    .select()
    .single();
  if (error) throw error;
  return result;
}

export async function upsertBusinessProfile(profileId: string, data: Record<string, unknown>) {
  const { data: result, error } = await supabase
    .from("business_profiles")
    .upsert({ profile_id: profileId, ...data }, { onConflict: "profile_id" })
    .select()
    .single();
  if (error) throw error;
  return result;
}

export async function uploadAvatar(userId: string, file: File) {
  const ext = file.name.split(".").pop();
  const path = `${userId}/avatar.${ext}`;
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true });
  if (uploadError) throw uploadError;
  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  return data.publicUrl;
}

export async function searchProfiles(query: string, limit = 20) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, username, avatar_url, role, location")
    .ilike("full_name", `%${query}%`)
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function getFollowers(profileId: string) {
  const { data, error } = await supabase
    .from("follows")
    .select("follower_id, profiles!follows_follower_id_fkey(id, full_name, avatar_url, role)")
    .eq("following_id", profileId);
  if (error) throw error;
  return data ?? [];
}

export async function getFollowing(profileId: string) {
  const { data, error } = await supabase
    .from("follows")
    .select("following_id, profiles!follows_following_id_fkey(id, full_name, avatar_url, role)")
    .eq("follower_id", profileId);
  if (error) throw error;
  return data ?? [];
}

export async function followProfile(followerId: string, followingId: string) {
  const { error } = await supabase
    .from("follows")
    .insert({ follower_id: followerId, following_id: followingId });
  if (error) throw error;
}

export async function unfollowProfile(followerId: string, followingId: string) {
  const { error } = await supabase
    .from("follows")
    .delete()
    .eq("follower_id", followerId)
    .eq("following_id", followingId);
  if (error) throw error;
}

export async function subscribeToProfile(subscriberId: string, creatorId: string) {
  const { error } = await supabase
    .from("subscriptions")
    .insert({ subscriber_id: subscriberId, creator_id: creatorId });
  if (error) throw error;
}

export async function unsubscribeFromProfile(subscriberId: string, creatorId: string) {
  const { error } = await supabase
    .from("subscriptions")
    .delete()
    .eq("subscriber_id", subscriberId)
    .eq("creator_id", creatorId);
  if (error) throw error;
}
