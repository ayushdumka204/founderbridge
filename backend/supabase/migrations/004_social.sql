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
