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
