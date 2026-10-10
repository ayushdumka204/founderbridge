import { supabase } from "../lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

export async function getConversations(profileId: string) {
  const { data, error } = await supabase
    .from("conversation_members")
    .select(`
      conversation_id,
      last_read_at,
      conversations(id, updated_at),
      profiles!conversation_members_user_id_fkey(id, full_name, avatar_url, role)
    `)
    .eq("user_id", profileId)
    .order("conversations(updated_at)", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getOrCreateConversation(userA: string, userB: string): Promise<string> {
  const { data, error } = await supabase.rpc("get_or_create_conversation", {
    user_a: userA,
    user_b: userB,
  });
  if (error) throw error;
  return data as string;
}

export async function getMessages(conversationId: string, limit = 50) {
  const { data, error } = await supabase
    .from("messages")
    .select("*, profiles!messages_sender_id_fkey(full_name, avatar_url, username)")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function sendMessage(conversationId: string, senderId: string, body: string) {
  const { data, error } = await supabase
    .from("messages")
    .insert({ conversation_id: conversationId, sender_id: senderId, body })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function markMessagesRead(conversationId: string, profileId: string) {
  await supabase
    .from("conversation_members")
    .update({ last_read_at: new Date().toISOString() })
    .eq("conversation_id", conversationId)
    .eq("user_id", profileId);
}

export function subscribeToMessages(
  conversationId: string,
  onMessage: (msg: Record<string, unknown>) => void
): RealtimeChannel {
  return supabase
    .channel(`messages:${conversationId}`)
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${conversationId}` },
      (payload) => onMessage(payload.new as Record<string, unknown>)
    )
    .subscribe();
}

export function unsubscribeChannel(channel: RealtimeChannel) {
  supabase.removeChannel(channel);
}

export async function getUnreadCount(profileId: string): Promise<number> {
  const convs = await getConversations(profileId);
  let total = 0;
  for (const c of convs) {
    const lastRead = (c as Record<string, unknown>).last_read_at as string | null;
    const convData = (c as Record<string, unknown>).conversations as Record<string, unknown> | null;
    const updatedAt = convData?.updated_at as string | null;
    if (updatedAt && (!lastRead || new Date(updatedAt) > new Date(lastRead))) total++;
  }
  return total;
}
