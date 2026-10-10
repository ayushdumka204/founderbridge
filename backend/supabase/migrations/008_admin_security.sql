-- Migration 008: RLS Policies, Views, Admin Audit Log

-- Admin Audit Log
CREATE TABLE admin_audit_log (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id   UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action     TEXT NOT NULL,
  table_name TEXT,
  record_id  UUID,
  details    JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Helper functions
CREATE OR REPLACE FUNCTION own_profile_id() RETURNS UUID LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1; $$;

CREATE OR REPLACE FUNCTION own_role() RETURNS TEXT LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT role::TEXT FROM profiles WHERE user_id = auth.uid() LIMIT 1; $$;

-- Enable RLS
ALTER TABLE profiles             ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE startup_ideas        ENABLE ROW LEVEL SECURITY;
ALTER TABLE startup_ratings      ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts                ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments             ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes                ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows              ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions        ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_items          ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations        ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages             ENABLE ROW LEVEL SECURITY;
ALTER TABLE saas_requirements    ENABLE ROW LEVEL SECURITY;
ALTER TABLE saas_feedback        ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_log      ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "public_read_profiles"   ON profiles FOR SELECT USING (TRUE);
CREATE POLICY "insert_own_profile"     ON profiles FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "update_own_profile"     ON profiles FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- sub-profiles
CREATE POLICY "public_read_student_profiles"   ON student_profiles   FOR SELECT USING (TRUE);
CREATE POLICY "manage_own_student_profile"     ON student_profiles   FOR ALL    USING (profile_id = own_profile_id()) WITH CHECK (profile_id = own_profile_id());
CREATE POLICY "public_read_investor_profiles"  ON investor_profiles  FOR SELECT USING (TRUE);
CREATE POLICY "manage_own_investor_profile"    ON investor_profiles  FOR ALL    USING (profile_id = own_profile_id()) WITH CHECK (profile_id = own_profile_id());
CREATE POLICY "public_read_business_profiles"  ON business_profiles  FOR SELECT USING (TRUE);
CREATE POLICY "manage_own_business_profile"    ON business_profiles  FOR ALL    USING (profile_id = own_profile_id()) WITH CHECK (profile_id = own_profile_id());

-- startup_ideas
CREATE POLICY "public_startups"          ON startup_ideas FOR SELECT USING (visibility = 'public');
CREATE POLICY "investors_only_startups"  ON startup_ideas FOR SELECT USING (visibility = 'investors_only' AND own_role() = 'investor');
CREATE POLICY "own_private_startups"     ON startup_ideas FOR SELECT USING (visibility = 'private' AND founder_id = own_profile_id());
CREATE POLICY "admin_see_all_startups"   ON startup_ideas FOR SELECT USING (own_role() = 'admin');
CREATE POLICY "create_startup"           ON startup_ideas FOR INSERT WITH CHECK (founder_id = own_profile_id() AND own_role() IN ('student','investor','general_user'));
CREATE POLICY "update_own_startup"       ON startup_ideas FOR UPDATE USING (founder_id = own_profile_id()) WITH CHECK (founder_id = own_profile_id());
CREATE POLICY "delete_own_startup"       ON startup_ideas FOR DELETE USING (founder_id = own_profile_id());

-- ratings
CREATE POLICY "public_read_ratings"   ON startup_ratings FOR SELECT USING (TRUE);
CREATE POLICY "investor_rate"         ON startup_ratings FOR INSERT WITH CHECK (investor_id = own_profile_id() AND own_role() = 'investor');
CREATE POLICY "investor_update_rating" ON startup_ratings FOR UPDATE USING (investor_id = own_profile_id()) WITH CHECK (investor_id = own_profile_id());

-- posts
CREATE POLICY "public_read_posts"   ON posts FOR SELECT USING (TRUE);
CREATE POLICY "auth_create_post"    ON posts FOR INSERT WITH CHECK (author_id = own_profile_id() AND auth.uid() IS NOT NULL);
CREATE POLICY "update_own_post"     ON posts FOR UPDATE USING (author_id = own_profile_id());
CREATE POLICY "delete_own_post"     ON posts FOR DELETE USING (author_id = own_profile_id());

-- comments / likes / follows / subscriptions
CREATE POLICY "public_read_comments"  ON comments FOR SELECT USING (TRUE);
CREATE POLICY "auth_comment"          ON comments FOR INSERT WITH CHECK (user_id = own_profile_id() AND auth.uid() IS NOT NULL);
CREATE POLICY "update_own_comment"    ON comments FOR UPDATE USING (user_id = own_profile_id());
CREATE POLICY "delete_own_comment"    ON comments FOR DELETE USING (user_id = own_profile_id());

CREATE POLICY "public_read_likes"     ON likes FOR SELECT USING (TRUE);
CREATE POLICY "auth_like"             ON likes FOR INSERT WITH CHECK (user_id = own_profile_id() AND auth.uid() IS NOT NULL);
CREATE POLICY "delete_own_like"       ON likes FOR DELETE USING (user_id = own_profile_id());

CREATE POLICY "public_read_follows"   ON follows FOR SELECT USING (TRUE);
CREATE POLICY "auth_follow"           ON follows FOR INSERT WITH CHECK (follower_id = own_profile_id() AND auth.uid() IS NOT NULL);
CREATE POLICY "delete_own_follow"     ON follows FOR DELETE USING (follower_id = own_profile_id());

CREATE POLICY "public_read_subs"      ON subscriptions FOR SELECT USING (TRUE);
CREATE POLICY "auth_subscribe"        ON subscriptions FOR INSERT WITH CHECK (subscriber_id = own_profile_id() AND auth.uid() IS NOT NULL);
CREATE POLICY "delete_own_sub"        ON subscriptions FOR DELETE USING (subscriber_id = own_profile_id());

-- saved_items
CREATE POLICY "own_saved_items"       ON saved_items FOR SELECT USING (user_id = own_profile_id());
CREATE POLICY "auth_save"             ON saved_items FOR INSERT WITH CHECK (user_id = own_profile_id() AND auth.uid() IS NOT NULL);
CREATE POLICY "delete_own_save"       ON saved_items FOR DELETE USING (user_id = own_profile_id());

-- conversations / messages
CREATE POLICY "member_read_conversations" ON conversations FOR SELECT
  USING (id IN (SELECT conversation_id FROM conversation_members WHERE user_id = own_profile_id()));
CREATE POLICY "member_read_conv_members"  ON conversation_members FOR SELECT
  USING (conversation_id IN (SELECT conversation_id FROM conversation_members WHERE user_id = own_profile_id()));
CREATE POLICY "member_read_messages"      ON messages FOR SELECT
  USING (conversation_id IN (SELECT conversation_id FROM conversation_members WHERE user_id = own_profile_id()));
CREATE POLICY "member_send_message"       ON messages FOR INSERT
  WITH CHECK (sender_id = own_profile_id() AND conversation_id IN (SELECT conversation_id FROM conversation_members WHERE user_id = own_profile_id()));

-- saas
CREATE POLICY "own_saas_requirements"      ON saas_requirements FOR SELECT USING (user_id = own_profile_id());
CREATE POLICY "admin_read_all_saas"        ON saas_requirements FOR SELECT USING (own_role() = 'admin');
CREATE POLICY "create_saas_requirement"    ON saas_requirements FOR INSERT WITH CHECK (user_id = own_profile_id() AND auth.uid() IS NOT NULL);
CREATE POLICY "update_own_saas"            ON saas_requirements FOR UPDATE USING (user_id = own_profile_id());
CREATE POLICY "delete_own_saas"            ON saas_requirements FOR DELETE USING (user_id = own_profile_id());
CREATE POLICY "own_saas_feedback"          ON saas_feedback FOR SELECT USING (user_id = own_profile_id());
CREATE POLICY "create_saas_feedback"       ON saas_feedback FOR INSERT WITH CHECK (user_id = own_profile_id() AND auth.uid() IS NOT NULL);
CREATE POLICY "update_own_saas_feedback"   ON saas_feedback FOR UPDATE USING (user_id = own_profile_id());

-- news
CREATE POLICY "public_read_published_news" ON news_articles FOR SELECT USING (status = 'published');
CREATE POLICY "admin_read_all_news"        ON news_articles FOR SELECT USING (own_role() = 'admin');
CREATE POLICY "admin_create_news"          ON news_articles FOR INSERT WITH CHECK (own_role() = 'admin');
CREATE POLICY "admin_update_news"          ON news_articles FOR UPDATE USING (own_role() = 'admin');
CREATE POLICY "admin_delete_news"          ON news_articles FOR DELETE USING (own_role() = 'admin');

-- admin audit log
CREATE POLICY "admin_read_audit"  ON admin_audit_log FOR SELECT USING (own_role() = 'admin');
CREATE POLICY "admin_write_audit" ON admin_audit_log FOR INSERT WITH CHECK (own_role() = 'admin');

-- Views
CREATE OR REPLACE VIEW public_startups AS
SELECT s.id, s.title, s.slug, s.short_pitch, s.industry, s.stage, s.funding_required,
  s.cover_image_url, s.avg_rating, s.rating_count, s.investor_interest_count, s.visibility, s.created_at,
  p.full_name AS founder_name, p.avatar_url AS founder_avatar, p.username AS founder_username
FROM startup_ideas s JOIN profiles p ON p.id = s.founder_id WHERE s.visibility = 'public';

CREATE OR REPLACE VIEW published_news AS
SELECT n.id, n.title, n.slug, n.summary, n.cover_image_url, n.category, n.source_name, n.source_url, n.published_at,
  p.full_name AS author_name
FROM news_articles n LEFT JOIN profiles p ON p.id = n.created_by WHERE n.status = 'published' ORDER BY n.published_at DESC;

CREATE OR REPLACE VIEW feed_posts AS
SELECT po.id, po.post_type, po.content, po.image_url, po.tags, po.likes_count, po.comments_count,
  po.saves_count, po.created_at, po.startup_id,
  p.id AS author_id, p.full_name AS author_name, p.avatar_url AS author_avatar,
  p.username AS author_username, p.role AS author_role,
  COALESCE(ip.verified, FALSE) AS author_verified
FROM posts po JOIN profiles p ON p.id = po.author_id LEFT JOIN investor_profiles ip ON ip.profile_id = p.id
ORDER BY po.created_at DESC;

CREATE OR REPLACE VIEW admin_stats AS
SELECT
  (SELECT COUNT(*) FROM profiles WHERE role = 'student')        AS total_students,
  (SELECT COUNT(*) FROM profiles WHERE role = 'investor')       AS total_investors,
  (SELECT COUNT(*) FROM profiles WHERE role = 'business_owner') AS total_business_owners,
  (SELECT COUNT(*) FROM profiles)                               AS total_users,
  (SELECT COUNT(*) FROM startup_ideas WHERE visibility = 'public') AS public_startups,
  (SELECT COUNT(*) FROM news_articles WHERE status = 'published')  AS published_news,
  (SELECT COUNT(*) FROM news_articles WHERE status = 'draft')      AS draft_news,
  (SELECT COUNT(*) FROM posts)                                      AS total_posts;
