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
