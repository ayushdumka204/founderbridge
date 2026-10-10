# Backend

## SQL reference

`sql/founderbridge_database.txt` — full annotated schema in a single file. Use as a reference or run it directly in the Supabase SQL editor.

## Migrations

Run files in `supabase/migrations/` in order:

| File | Contents |
|------|----------|
| 001_initial_schema.sql | Extensions + enums |
| 002_profiles.sql | Profiles + sub-profiles + triggers |
| 003_startups.sql | Startup ideas + ratings |
| 004_social.sql | Posts, comments, likes, follows, subscriptions, saved items |
| 005_messages.sql | Conversations, messages, Realtime, get_or_create_conversation RPC |
| 006_saas.sql | SaaS requirements + feedback |
| 007_news.sql | News articles + slug/publish triggers |
| 008_admin_security.sql | RLS policies, admin audit log, helper functions, views, storage |

## Security notes

- Row Level Security is enabled on all tables. Never disable it.
- Admin role can only be granted via service role key or the Supabase dashboard — the `prevent_self_admin` trigger blocks self-promotion.
- The service role key must NEVER be added to the frontend. Use Supabase Edge Functions for privileged operations.
