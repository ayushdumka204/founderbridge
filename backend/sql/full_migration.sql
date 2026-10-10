-- Migration 001: Extensions and Enum Types
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";

CREATE TYPE user_role AS ENUM ('student','investor','business_owner','general_user','admin');
CREATE TYPE startup_visibility AS ENUM ('private','public','investors_only');
CREATE TYPE startup_stage AS ENUM ('Idea','MVP','Pre-Seed','Seed','Series A','Growth');
CREATE TYPE post_type AS ENUM ('investor_insight','startup_update','founder_update','business_requirement','investment_interest','tech_insight','general');
CREATE TYPE saas_status AS ENUM ('draft','submitted','reviewing','in_progress','completed','closed');
CREATE TYPE news_status AS ENUM ('draft','published','archived');
CREATE TYPE content_type AS ENUM ('startup','post','news','investor_profile','founder_profile');
CREATE TYPE feedback_type AS ENUM ('good','needs_improvement','feature_request','bug','general');
-- Migration 002: Profiles Tables

CREATE TABLE profiles (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role          user_role NOT NULL DEFAULT 'general_user',
  full_name     TEXT NOT NULL,
  username      TEXT UNIQUE,
  avatar_url    TEXT,
  bio           TEXT,
  location      TEXT,
  website       TEXT,
  linkedin_url  TEXT,
  twitter_url   TEXT,
  instagram_url TEXT,
  followers_count INTEGER NOT NULL DEFAULT 0,
  following_count INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT username_length CHECK (char_length(username) >= 3),
  CONSTRAINT unique_user_id UNIQUE (user_id)
);

CREATE TABLE student_profiles (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  university      TEXT,
  course          TEXT,
  graduation_year TEXT,
  skills          TEXT[],
  interests       TEXT[],
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_student_profile UNIQUE (profile_id)
);

CREATE TABLE investor_profiles (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id            UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  investor_type         TEXT,
  investment_interests  TEXT[],
  preferred_stages      TEXT[],
  investment_range_min  TEXT,
  investment_range_max  TEXT,
  investment_philosophy TEXT,
  portfolio_description TEXT,
  verified              BOOLEAN NOT NULL DEFAULT FALSE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_investor_profile UNIQUE (profile_id)
);

CREATE TABLE business_profiles (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id           UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  business_name        TEXT,
  industry             TEXT,
  business_size        TEXT,
  business_description TEXT,
  website              TEXT,
  location             TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_business_profile UNIQUE (profile_id)
);

-- updated_at triggers
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

CREATE TRIGGER set_updated_at_profiles  BEFORE UPDATE ON profiles          FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_updated_at_student   BEFORE UPDATE ON student_profiles  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_updated_at_investor  BEFORE UPDATE ON investor_profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_updated_at_business  BEFORE UPDATE ON business_profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Prevent self-assigning admin role
CREATE OR REPLACE FUNCTION prevent_self_admin()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF NEW.role = 'admin' AND OLD.role != 'admin' THEN
    IF current_setting('request.jwt.claims', true)::jsonb ->> 'role' != 'service_role' THEN
      RAISE EXCEPTION 'Cannot self-assign admin role';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER enforce_no_self_admin BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION prevent_self_admin();

-- Indexes
CREATE INDEX idx_profiles_user_id       ON profiles(user_id);
CREATE INDEX idx_profiles_username      ON profiles(username);
CREATE INDEX idx_profiles_role          ON profiles(role);
CREATE INDEX idx_profiles_fullname_trgm ON profiles USING GIN (full_name gin_trgm_ops);
-- Migration 003: Startup Ideas + Ratings

CREATE TABLE startup_ideas (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  founder_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  slug             TEXT UNIQUE NOT NULL DEFAULT '',
  short_pitch      TEXT NOT NULL,
  description      TEXT,
  problem          TEXT,
  solution         TEXT,
  target_market    TEXT,
  business_model   TEXT,
  industry         TEXT NOT NULL,
  stage            startup_stage NOT NULL DEFAULT 'Idea',
  funding_required TEXT,
  traction         TEXT,
  competition      TEXT,
  website_url      TEXT,
  pitch_deck_url   TEXT,
  demo_url         TEXT,
  cover_image_url  TEXT,
  visibility       startup_visibility NOT NULL DEFAULT 'public',
  avg_rating       NUMERIC(3,2) NOT NULL DEFAULT 0,
  rating_count     INTEGER NOT NULL DEFAULT 0,
  investor_interest_count INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION generate_startup_slug()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  base_slug TEXT; final_slug TEXT; counter INTEGER := 0;
BEGIN
  base_slug  := lower(regexp_replace(trim(NEW.title), '[^a-zA-Z0-9\s]', '', 'g'));
  base_slug  := regexp_replace(base_slug, '\s+', '-', 'g');
  final_slug := base_slug;
  WHILE EXISTS (SELECT 1 FROM startup_ideas WHERE slug = final_slug AND id != COALESCE(NEW.id, uuid_generate_v4())) LOOP
    counter := counter + 1; final_slug := base_slug || '-' || counter;
  END LOOP;
  NEW.slug := final_slug;
  RETURN NEW;
END;
$$;

CREATE TRIGGER auto_slug_startup
  BEFORE INSERT ON startup_ideas FOR EACH ROW
  WHEN (NEW.slug IS NULL OR NEW.slug = '') EXECUTE FUNCTION generate_startup_slug();

CREATE TRIGGER set_updated_at_startups BEFORE UPDATE ON startup_ideas FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Ratings
CREATE TABLE startup_ratings (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  startup_id  UUID NOT NULL REFERENCES startup_ideas(id) ON DELETE CASCADE,
  investor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating      INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  feedback    TEXT,
  tags        TEXT[],
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT one_rating_per_investor UNIQUE (startup_id, investor_id)
);

CREATE OR REPLACE FUNCTION update_startup_avg_rating()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE startup_ideas
  SET
    avg_rating   = COALESCE((SELECT AVG(rating) FROM startup_ratings WHERE startup_id = COALESCE(NEW.startup_id, OLD.startup_id)), 0),
    rating_count = (SELECT COUNT(*) FROM startup_ratings WHERE startup_id = COALESCE(NEW.startup_id, OLD.startup_id))
  WHERE id = COALESCE(NEW.startup_id, OLD.startup_id);
  RETURN NULL;
END;
$$;

CREATE TRIGGER recalc_avg_rating AFTER INSERT OR UPDATE OR DELETE ON startup_ratings FOR EACH ROW EXECUTE FUNCTION update_startup_avg_rating();
CREATE TRIGGER set_updated_at_ratings BEFORE UPDATE ON startup_ratings FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Indexes
CREATE INDEX idx_startups_founder_id ON startup_ideas(founder_id);
CREATE INDEX idx_startups_industry   ON startup_ideas(industry);
CREATE INDEX idx_startups_stage      ON startup_ideas(stage);
CREATE INDEX idx_startups_visibility ON startup_ideas(visibility);
CREATE INDEX idx_startups_created_at ON startup_ideas(created_at DESC);
CREATE INDEX idx_startups_title_trgm ON startup_ideas USING GIN (title gin_trgm_ops);
CREATE INDEX idx_startups_pitch_trgm ON startup_ideas USING GIN (short_pitch gin_trgm_ops);
-- Migration 004: Posts, Comments, Likes, Follows, Subscriptions, Saved Items

-- Posts
CREATE TABLE posts (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  post_type      post_type NOT NULL DEFAULT 'general',
  content        TEXT NOT NULL,
  image_url      TEXT,
  startup_id     UUID REFERENCES startup_ideas(id) ON DELETE SET NULL,
  business_id    UUID REFERENCES business_profiles(id) ON DELETE SET NULL,
  tags           TEXT[],
  likes_count    INTEGER NOT NULL DEFAULT 0,
  comments_count INTEGER NOT NULL DEFAULT 0,
  saves_count    INTEGER NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_posts_author_id  ON posts(author_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_type       ON posts(post_type);
CREATE TRIGGER set_updated_at_posts BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Comments
CREATE TABLE comments (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content_type content_type NOT NULL,
  content_id   UUID NOT NULL,
  body         TEXT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_comments_content ON comments(content_type, content_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE TRIGGER set_updated_at_comments BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE FUNCTION update_comments_count() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.content_type = 'post' THEN UPDATE posts SET comments_count = comments_count + 1 WHERE id = NEW.content_id;
  ELSIF TG_OP = 'DELETE' AND OLD.content_type = 'post' THEN UPDATE posts SET comments_count = GREATEST(comments_count - 1, 0) WHERE id = OLD.content_id; END IF;
  RETURN NULL;
END; $$;
CREATE TRIGGER sync_comment_count AFTER INSERT OR DELETE ON comments FOR EACH ROW EXECUTE FUNCTION update_comments_count();

-- Likes
CREATE TABLE likes (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content_type content_type NOT NULL,
  content_id   UUID NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT one_like_per_user UNIQUE (user_id, content_type, content_id)
);

CREATE INDEX idx_likes_content ON likes(content_type, content_id);
CREATE INDEX idx_likes_user_id ON likes(user_id);

CREATE OR REPLACE FUNCTION update_likes_count() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.content_type = 'post' THEN UPDATE posts SET likes_count = likes_count + 1 WHERE id = NEW.content_id;
  ELSIF TG_OP = 'DELETE' AND OLD.content_type = 'post' THEN UPDATE posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = OLD.content_id; END IF;
  RETURN NULL;
END; $$;
CREATE TRIGGER sync_likes_count AFTER INSERT OR DELETE ON likes FOR EACH ROW EXECUTE FUNCTION update_likes_count();

-- Follows
CREATE TABLE follows (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT no_self_follow CHECK (follower_id != following_id),
  CONSTRAINT unique_follow UNIQUE (follower_id, following_id)
);

CREATE INDEX idx_follows_follower  ON follows(follower_id);
CREATE INDEX idx_follows_following ON follows(following_id);

CREATE OR REPLACE FUNCTION update_follow_counts() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE profiles SET following_count = following_count + 1 WHERE id = NEW.follower_id;
    UPDATE profiles SET followers_count = followers_count + 1 WHERE id = NEW.following_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE profiles SET following_count = GREATEST(following_count - 1, 0) WHERE id = OLD.follower_id;
    UPDATE profiles SET followers_count = GREATEST(followers_count - 1, 0) WHERE id = OLD.following_id;
  END IF;
  RETURN NULL;
END; $$;
CREATE TRIGGER sync_follow_counts AFTER INSERT OR DELETE ON follows FOR EACH ROW EXECUTE FUNCTION update_follow_counts();

-- Subscriptions
CREATE TABLE subscriptions (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscriber_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  creator_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT no_self_subscribe CHECK (subscriber_id != creator_id),
  CONSTRAINT unique_subscription UNIQUE (subscriber_id, creator_id)
);

CREATE INDEX idx_subs_subscriber ON subscriptions(subscriber_id);
CREATE INDEX idx_subs_creator    ON subscriptions(creator_id);

-- Saved Items
CREATE TABLE saved_items (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  item_type  content_type NOT NULL,
  item_id    UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_saved UNIQUE (user_id, item_type, item_id)
);

CREATE INDEX idx_saved_user_id ON saved_items(user_id);
CREATE INDEX idx_saved_item    ON saved_items(item_type, item_id);

CREATE OR REPLACE FUNCTION update_saves_count() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.item_type = 'post' THEN UPDATE posts SET saves_count = saves_count + 1 WHERE id = NEW.item_id;
  ELSIF TG_OP = 'DELETE' AND OLD.item_type = 'post' THEN UPDATE posts SET saves_count = GREATEST(saves_count - 1, 0) WHERE id = OLD.item_id; END IF;
  RETURN NULL;
END; $$;
CREATE TRIGGER sync_saves_count AFTER INSERT OR DELETE ON saved_items FOR EACH ROW EXECUTE FUNCTION update_saves_count();
-- Migration 005: Conversations & Messages (Realtime-enabled)

CREATE TABLE conversations (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE conversation_members (
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_read_at    TIMESTAMPTZ,
  PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE messages (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  body            TEXT NOT NULL,
  read_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_conv_id ON messages(conversation_id, created_at);
CREATE INDEX idx_messages_sender  ON messages(sender_id);

CREATE OR REPLACE FUNCTION touch_conversation() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN UPDATE conversations SET updated_at = NOW() WHERE id = NEW.conversation_id; RETURN NULL; END; $$;
CREATE TRIGGER on_new_message AFTER INSERT ON messages FOR EACH ROW EXECUTE FUNCTION touch_conversation();
CREATE TRIGGER set_updated_at_conversations BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Enable Realtime on messages table
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;

-- Helper function: get or create 1-to-1 conversation
CREATE OR REPLACE FUNCTION get_or_create_conversation(user_a UUID, user_b UUID)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE conv_id UUID;
BEGIN
  SELECT cm1.conversation_id INTO conv_id
  FROM conversation_members cm1
  JOIN conversation_members cm2 ON cm1.conversation_id = cm2.conversation_id
  WHERE cm1.user_id = user_a AND cm2.user_id = user_b LIMIT 1;

  IF conv_id IS NULL THEN
    INSERT INTO conversations DEFAULT VALUES RETURNING id INTO conv_id;
    INSERT INTO conversation_members (conversation_id, user_id) VALUES (conv_id, user_a), (conv_id, user_b);
  END IF;
  RETURN conv_id;
END; $$;
-- Migration 006: SaaS Requirements & Feedback

CREATE TABLE saas_requirements (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  problem          TEXT,
  current_process  TEXT,
  pain_points      TEXT,
  desired_solution TEXT,
  budget           TEXT,
  priority         TEXT DEFAULT 'medium',
  status           saas_status NOT NULL DEFAULT 'draft',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_updated_at_saas_req BEFORE UPDATE ON saas_requirements FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE saas_feedback (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  requirement_id UUID NOT NULL REFERENCES saas_requirements(id) ON DELETE CASCADE,
  feedback_type  feedback_type NOT NULL DEFAULT 'general',
  message        TEXT,
  rating         INTEGER CHECK (rating BETWEEN 1 AND 5),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Migration 007: News Articles

CREATE TABLE news_articles (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL DEFAULT '',
  summary         TEXT,
  content         TEXT,
  cover_image_url TEXT,
  category        TEXT NOT NULL DEFAULT 'General',
  source_name     TEXT,
  source_url      TEXT,
  published_at    TIMESTAMPTZ,
  status          news_status NOT NULL DEFAULT 'draft',
  created_by      UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION generate_news_slug() RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE base_slug TEXT; final_slug TEXT; counter INTEGER := 0;
BEGIN
  base_slug  := lower(regexp_replace(trim(NEW.title), '[^a-zA-Z0-9\s]', '', 'g'));
  base_slug  := regexp_replace(base_slug, '\s+', '-', 'g');
  final_slug := base_slug;
  WHILE EXISTS (SELECT 1 FROM news_articles WHERE slug = final_slug AND id != COALESCE(NEW.id, uuid_generate_v4())) LOOP
    counter := counter + 1; final_slug := base_slug || '-' || counter;
  END LOOP;
  NEW.slug := final_slug;
  IF NEW.status = 'published' AND NEW.published_at IS NULL THEN NEW.published_at := NOW(); END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER auto_slug_news BEFORE INSERT ON news_articles FOR EACH ROW
  WHEN (NEW.slug IS NULL OR NEW.slug = '') EXECUTE FUNCTION generate_news_slug();

CREATE OR REPLACE FUNCTION set_published_at() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.status = 'published' AND OLD.status != 'published' AND NEW.published_at IS NULL THEN NEW.published_at := NOW(); END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_publish_news BEFORE UPDATE ON news_articles FOR EACH ROW EXECUTE FUNCTION set_published_at();
CREATE TRIGGER set_updated_at_news BEFORE UPDATE ON news_articles FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_news_status       ON news_articles(status);
CREATE INDEX idx_news_published_at ON news_articles(published_at DESC);
CREATE INDEX idx_news_category     ON news_articles(category);
CREATE INDEX idx_news_title_trgm   ON news_articles USING GIN (title gin_trgm_ops);
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
