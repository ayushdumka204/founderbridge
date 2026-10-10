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
