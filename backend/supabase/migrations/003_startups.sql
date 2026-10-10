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
