-- Script de inicialização do banco PostgreSQL local
-- Cria usuários e roles necessários para o Supabase local

-- Criar usuário authenticator (usado pelo PostgREST)
CREATE USER authenticator NOINHERIT CREATEROLE LOGIN PASSWORD 'yoursecretpassword';

-- Criar usuário supabase_auth_admin (usado pelo GoTrue)
CREATE USER supabase_auth_admin NOINHERIT CREATEROLE LOGIN PASSWORD 'root';

-- Criar roles
CREATE ROLE anon NOINHERIT NOLOGIN;
CREATE ROLE authenticated NOINHERIT NOLOGIN;
CREATE ROLE service_role NOINHERIT NOLOGIN;

-- Conceder permissões
GRANT anon TO authenticator;
GRANT authenticated TO authenticator;
GRANT service_role TO authenticator;

-- Conceder permissões ao supabase_auth_admin
GRANT ALL PRIVILEGES ON DATABASE aquifaz TO supabase_auth_admin;

-- Instalar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Configurar schema auth
CREATE SCHEMA IF NOT EXISTS auth;
ALTER SCHEMA auth OWNER TO supabase_auth_admin;

-- Conceder permissões no schema auth
GRANT USAGE ON SCHEMA auth TO authenticator;
GRANT ALL ON ALL TABLES IN SCHEMA auth TO authenticator;
GRANT ALL ON ALL SEQUENCES IN SCHEMA auth TO authenticator;

-- Configurar RLS por padrão
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO authenticator;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticator;

-- Função para obter o JWT claim
CREATE OR REPLACE FUNCTION auth.uid() RETURNS UUID AS $$
  SELECT COALESCE(
    NULLIF(current_setting('request.jwt.claim.sub', true), ''),
    (NULLIF(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid;
$$ LANGUAGE sql STABLE;

-- Função para obter o role do JWT
CREATE OR REPLACE FUNCTION auth.role() RETURNS TEXT AS $$
  SELECT COALESCE(
    NULLIF(current_setting('request.jwt.claim.role', true), ''),
    (NULLIF(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text;
$$ LANGUAGE sql STABLE;

-- Função para verificar se usuário está autenticado
CREATE OR REPLACE FUNCTION auth.jwt() RETURNS jsonb AS $$
  SELECT 
    COALESCE(
      NULLIF(current_setting('request.jwt.claim', true), '')::jsonb,
      NULLIF(current_setting('request.jwt.claims', true), '')::jsonb
    );
$$ LANGUAGE sql STABLE;