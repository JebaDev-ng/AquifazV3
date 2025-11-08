-- =====================================================
-- MIGRATION: Storage buckets and media columns
-- Date: 2024-11-08
-- Goal: Create dedicated buckets and persist storage paths
-- =====================================================

BEGIN;

-- Create buckets (private by default)
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('products', 'products', false),
  ('categories', 'categories', false),
  ('banners', 'banners', false),
  ('content_sections', 'content_sections', false)
ON CONFLICT (id) DO NOTHING;

-- Helper expression for role check
CREATE OR REPLACE FUNCTION public.is_admin_or_editor()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
  );
$$ LANGUAGE sql STABLE;

-- Policies for products bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'products_public_read'
  ) THEN
    CREATE POLICY products_public_read
      ON storage.objects FOR SELECT
      USING (bucket_id = 'products');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'products_admin_manage'
  ) THEN
    CREATE POLICY products_admin_manage
      ON storage.objects FOR INSERT
      WITH CHECK (bucket_id = 'products' AND public.is_admin_or_editor());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'products_admin_update'
  ) THEN
    CREATE POLICY products_admin_update
      ON storage.objects FOR UPDATE
      USING (bucket_id = 'products' AND public.is_admin_or_editor())
      WITH CHECK (bucket_id = 'products' AND public.is_admin_or_editor());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'products_admin_delete'
  ) THEN
    CREATE POLICY products_admin_delete
      ON storage.objects FOR DELETE
      USING (bucket_id = 'products' AND public.is_admin_or_editor());
  END IF;
END$$;

-- Reuse helper procedure for other buckets
DO $$
DECLARE
  bucket TEXT;
  prefix TEXT;
BEGIN
  FOREACH bucket IN ARRAY ARRAY['categories', 'banners', 'content_sections']
  LOOP
    prefix := bucket || '_';

    IF NOT EXISTS (
      SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = prefix || 'public_read'
    ) THEN
      EXECUTE format(
        'CREATE POLICY %I ON storage.objects FOR SELECT USING (bucket_id = %L);',
        prefix || 'public_read',
        bucket
      );
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = prefix || 'admin_manage'
    ) THEN
      EXECUTE format(
        'CREATE POLICY %I ON storage.objects FOR INSERT WITH CHECK (bucket_id = %L AND public.is_admin_or_editor());',
        prefix || 'admin_manage',
        bucket
      );
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = prefix || 'admin_update'
    ) THEN
      EXECUTE format(
        'CREATE POLICY %I ON storage.objects FOR UPDATE USING (bucket_id = %L AND public.is_admin_or_editor()) WITH CHECK (bucket_id = %L AND public.is_admin_or_editor());',
        prefix || 'admin_update',
        bucket,
        bucket
      );
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = prefix || 'admin_delete'
    ) THEN
      EXECUTE format(
        'CREATE POLICY %I ON storage.objects FOR DELETE USING (bucket_id = %L AND public.is_admin_or_editor());',
        prefix || 'admin_delete',
        bucket
      );
    END IF;
  END LOOP;
END$$;

-- Add storage_path columns
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'products') THEN
    ALTER TABLE products ADD COLUMN IF NOT EXISTS storage_path TEXT;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'product_categories') THEN
    ALTER TABLE product_categories ADD COLUMN IF NOT EXISTS storage_path TEXT;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'homepage_banner_sections') THEN
    ALTER TABLE homepage_banner_sections ADD COLUMN IF NOT EXISTS storage_path TEXT;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'content_sections') THEN
    ALTER TABLE content_sections ADD COLUMN IF NOT EXISTS storage_path TEXT;
    ALTER TABLE content_sections ADD COLUMN IF NOT EXISTS promo_storage_path TEXT;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'homepage_hero_content') THEN
    ALTER TABLE homepage_hero_content ADD COLUMN IF NOT EXISTS promo_storage_path TEXT;
  END IF;
END$$;

COMMIT;
