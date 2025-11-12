-- =====================================================
-- MIGRATION V2: Storage Buckets
-- Data: 2024-11-12
-- Descrição: Configuração dos buckets de storage
-- =====================================================

BEGIN;

-- =====================================================
-- STORAGE BUCKETS
-- =====================================================

-- Bucket para uploads gerais
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'uploads',
  'uploads',
  TRUE,
  10485760, -- 10MB
  ARRAY[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml'
  ]
)
ON CONFLICT (id) DO UPDATE
SET public = TRUE,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY[
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml'
    ];

-- =====================================================
-- STORAGE POLICIES
-- =====================================================

-- Remover policies antigas se existirem
DROP POLICY IF EXISTS "Uploads são públicos" ON storage.objects;
DROP POLICY IF EXISTS "Usuários autenticados podem fazer upload" ON storage.objects;
DROP POLICY IF EXISTS "Usuários podem atualizar próprios uploads" ON storage.objects;
DROP POLICY IF EXISTS "Admins podem deletar uploads" ON storage.objects;

-- Policy: Leitura pública
CREATE POLICY "Uploads são públicos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'uploads');

-- Policy: Upload apenas para autenticados
CREATE POLICY "Usuários autenticados podem fazer upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'uploads'
    AND auth.role() = 'authenticated'
  );

-- Policy: Atualizar próprios arquivos
CREATE POLICY "Usuários podem atualizar próprios uploads"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'uploads'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Apenas admins podem deletar
CREATE POLICY "Admins podem deletar uploads"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'uploads'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

COMMIT;
