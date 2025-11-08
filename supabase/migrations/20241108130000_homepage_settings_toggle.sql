-- =====================================================
-- MIGRATION: Homepage Settings Toggle
-- Date: 2024-11-08
-- Goal: Allow storing mock-data toggle inside content_sections
-- =====================================================

BEGIN;

-- Expand the enum constraint for content_sections.type
ALTER TABLE content_sections
  DROP CONSTRAINT IF EXISTS content_sections_type_check;

ALTER TABLE content_sections
  ADD CONSTRAINT content_sections_type_check
  CHECK (type IN ('hero', 'banner', 'pricing', 'footer', 'settings'));

-- Seed the homepage settings row so the admin toggle works immediately
INSERT INTO content_sections (
  id,
  type,
  title,
  subtitle,
  description,
  data,
  active,
  sort_order
)
VALUES (
  'homepage_settings',
  'settings',
  'Homepage Settings',
  NULL,
  'Configurações gerais da homepage (mock data toggle)',
  '{"use_mock_data": false}'::jsonb,
  true,
  999
)
ON CONFLICT (id) DO UPDATE
SET
  type = EXCLUDED.type,
  description = EXCLUDED.description,
  data = content_sections.data || EXCLUDED.data,
  updated_at = TIMEZONE('utc', NOW());

COMMIT;
