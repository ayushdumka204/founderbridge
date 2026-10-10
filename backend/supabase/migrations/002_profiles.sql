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
