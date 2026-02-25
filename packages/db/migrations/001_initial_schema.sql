-- ─────────────────────────────────────────────────────────────────────────────
-- PantryPilot — PostgreSQL Schema
-- Run via: psql $DATABASE_URL -f schema.sql
-- Or apply via Supabase SQL editor
-- ─────────────────────────────────────────────────────────────────────────────

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Enums ─────────────────────────────────────────────────────────────────────

CREATE TYPE retailer_enum AS ENUM ('shoprite', 'walmart');
CREATE TYPE meal_type_enum AS ENUM ('breakfast', 'lunch', 'dinner', 'snack');
CREATE TYPE course_type_enum AS ENUM ('main', 'side', 'dessert');
CREATE TYPE stock_level_enum AS ENUM ('just_a_little', 'about_half', 'almost_full', 'plenty');
CREATE TYPE cart_status_enum AS ENUM ('pending', 'added', 'not_found', 'error');
CREATE TYPE cart_session_status_enum AS ENUM ('queued', 'in_progress', 'completed', 'failed');
CREATE TYPE list_status_enum AS ENUM ('draft', 'sent_to_cart', 'completed');
CREATE TYPE icon_type_enum AS ENUM ('jar', 'bottle', 'bunch', 'box', 'bag');
CREATE TYPE ai_assistant_enum AS ENUM ('chatgpt', 'gemini', 'both');
CREATE TYPE shopping_pref_enum AS ENUM ('cheapest', 'organic', 'generic');

-- ── users ─────────────────────────────────────────────────────────────────────

CREATE TABLE users (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email                TEXT UNIQUE NOT NULL,
  display_name         TEXT NOT NULL DEFAULT '',
  preferred_retailer   retailer_enum NOT NULL DEFAULT 'walmart',
  store_zip            TEXT NOT NULL DEFAULT '',
  preferred_ai         ai_assistant_enum NOT NULL DEFAULT 'both',
  shopping_preference  shopping_pref_enum NOT NULL DEFAULT 'cheapest',
  retailer_auth_token  BYTEA, -- encrypted via pgcrypto
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── ingredients (global catalog) ──────────────────────────────────────────────

CREATE TABLE ingredients (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                  TEXT UNIQUE NOT NULL,
  category              TEXT NOT NULL DEFAULT 'Other',
  default_unit          TEXT NOT NULL DEFAULT 'each',
  standard_package_qty  DECIMAL(10,3) NOT NULL DEFAULT 1,
  standard_package_unit TEXT NOT NULL DEFAULT 'each',
  icon_type             icon_type_enum NOT NULL DEFAULT 'jar',
  shoprite_search_term  TEXT,
  walmart_search_term   TEXT,
  is_staple             BOOLEAN NOT NULL DEFAULT FALSE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── meals ─────────────────────────────────────────────────────────────────────

CREATE TABLE meals (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name             TEXT NOT NULL,
  description      TEXT NOT NULL DEFAULT '',
  yield_servings   INTEGER NOT NULL DEFAULT 4,
  prep_time_mins   INTEGER NOT NULL DEFAULT 30,
  meal_type        meal_type_enum NOT NULL DEFAULT 'dinner',
  image_url        TEXT,
  is_user_created  BOOLEAN NOT NULL DEFAULT FALSE,
  created_by       UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── recipe_ingredients ────────────────────────────────────────────────────────

CREATE TABLE recipe_ingredients (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meal_id        UUID NOT NULL REFERENCES meals(id) ON DELETE CASCADE,
  ingredient_id  UUID NOT NULL REFERENCES ingredients(id) ON DELETE RESTRICT,
  quantity_base  DECIMAL(10,3) NOT NULL,
  unit           TEXT NOT NULL,
  prep_note      TEXT,
  UNIQUE(meal_id, ingredient_id)
);

-- ── pantry_items ──────────────────────────────────────────────────────────────

CREATE TABLE pantry_items (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ingredient_id     UUID NOT NULL REFERENCES ingredients(id) ON DELETE RESTRICT,
  stock_level       stock_level_enum NOT NULL DEFAULT 'about_half',
  quantity_on_hand  DECIMAL(10,3) NOT NULL DEFAULT 0,
  unit              TEXT NOT NULL DEFAULT 'each',
  is_exact          BOOLEAN NOT NULL DEFAULT FALSE,
  is_low_flagged    BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, ingredient_id)
);

-- ── plan_templates ────────────────────────────────────────────────────────────

CREATE TABLE plan_templates (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name           TEXT NOT NULL,
  description    TEXT NOT NULL DEFAULT '',
  created_by     UUID REFERENCES users(id) ON DELETE SET NULL,
  is_curated     BOOLEAN NOT NULL DEFAULT FALSE,
  is_public      BOOLEAN NOT NULL DEFAULT FALSE,
  season_tag     TEXT,
  thumbnail_url  TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── plan_template_meals ───────────────────────────────────────────────────────

CREATE TABLE plan_template_meals (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id      UUID NOT NULL REFERENCES plan_templates(id) ON DELETE CASCADE,
  meal_id      UUID NOT NULL REFERENCES meals(id) ON DELETE CASCADE,
  day_of_week  INTEGER NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
  meal_slot    meal_type_enum NOT NULL DEFAULT 'dinner',
  course_type  course_type_enum NOT NULL DEFAULT 'main'
);

-- ── shopping_lists ────────────────────────────────────────────────────────────

CREATE TABLE shopping_lists (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  meal_plan_id    UUID REFERENCES plan_templates(id) ON DELETE SET NULL,
  n_diners        INTEGER NOT NULL DEFAULT 2,
  status          list_status_enum NOT NULL DEFAULT 'draft',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── shopping_list_items ───────────────────────────────────────────────────────

CREATE TABLE shopping_list_items (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  list_id              UUID NOT NULL REFERENCES shopping_lists(id) ON DELETE CASCADE,
  ingredient_id        UUID NOT NULL REFERENCES ingredients(id) ON DELETE RESTRICT,
  quantity_needed      DECIMAL(10,3) NOT NULL,
  unit                 TEXT NOT NULL,
  is_low_flagged       BOOLEAN NOT NULL DEFAULT FALSE,
  is_manually_added    BOOLEAN NOT NULL DEFAULT FALSE,
  cart_status          cart_status_enum NOT NULL DEFAULT 'pending',
  retailer_product_id  TEXT
);

-- ── cart_sessions ─────────────────────────────────────────────────────────────

CREATE TABLE cart_sessions (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  list_id          UUID NOT NULL REFERENCES shopping_lists(id) ON DELETE CASCADE,
  retailer         retailer_enum NOT NULL,
  status           cart_session_status_enum NOT NULL DEFAULT 'queued',
  items_added      INTEGER NOT NULL DEFAULT 0,
  items_failed     INTEGER NOT NULL DEFAULT 0,
  estimated_total  DECIMAL(10,2),
  checkout_url     TEXT,
  started_at       TIMESTAMPTZ,
  completed_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── user_meal_preferences ─────────────────────────────────────────────────────

CREATE TABLE user_meal_preferences (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  meal_id         UUID NOT NULL REFERENCES meals(id) ON DELETE CASCADE,
  is_favorite     BOOLEAN NOT NULL DEFAULT FALSE,
  usage_count     INTEGER NOT NULL DEFAULT 0,
  most_used_rank  INTEGER,
  last_used_at    TIMESTAMPTZ,
  UNIQUE(user_id, meal_id)
);

-- ── meal_usage_events ─────────────────────────────────────────────────────────

CREATE TABLE meal_usage_events (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  meal_id             UUID NOT NULL REFERENCES meals(id) ON DELETE CASCADE,
  plan_execution_id   UUID REFERENCES shopping_lists(id) ON DELETE SET NULL,
  used_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Indexes ───────────────────────────────────────────────────────────────────

CREATE INDEX idx_pantry_items_user ON pantry_items(user_id);
CREATE INDEX idx_shopping_lists_user ON shopping_lists(user_id);
CREATE INDEX idx_shopping_list_items_list ON shopping_list_items(list_id);
CREATE INDEX idx_cart_sessions_user ON cart_sessions(user_id);
CREATE INDEX idx_user_meal_prefs_user ON user_meal_preferences(user_id);
CREATE INDEX idx_meal_usage_events_user ON meal_usage_events(user_id);
CREATE INDEX idx_recipe_ingredients_meal ON recipe_ingredients(meal_id);
CREATE INDEX idx_plan_template_meals_plan ON plan_template_meals(plan_id);

-- ── Row Level Security ────────────────────────────────────────────────────────

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pantry_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_meal_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_usage_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_templates ENABLE ROW LEVEL SECURITY;

-- Users can only see/edit their own data
CREATE POLICY users_self ON users USING (auth.uid() = id);
CREATE POLICY pantry_own ON pantry_items USING (auth.uid() = user_id);
CREATE POLICY lists_own ON shopping_lists USING (auth.uid() = user_id);
CREATE POLICY list_items_own ON shopping_list_items
  USING (list_id IN (SELECT id FROM shopping_lists WHERE user_id = auth.uid()));
CREATE POLICY cart_sessions_own ON cart_sessions USING (auth.uid() = user_id);
CREATE POLICY meal_prefs_own ON user_meal_preferences USING (auth.uid() = user_id);
CREATE POLICY usage_events_own ON meal_usage_events USING (auth.uid() = user_id);
CREATE POLICY plan_templates_read ON plan_templates
  USING (is_curated = TRUE OR is_public = TRUE OR auth.uid() = created_by);
CREATE POLICY plan_templates_write ON plan_templates
  FOR ALL USING (auth.uid() = created_by);
