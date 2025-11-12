# 🚀 Como Aplicar as Migrações V2

## 📋 Pré-requisitos

- Projeto Supabase criado
- Credenciais de acesso ao banco
- Backup dos dados atuais (se houver)

## 🎯 Método 1: Via Supabase Dashboard (Recomendado)

### Passo 1: Acessar SQL Editor

1. Acesse [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Clique em "SQL Editor" no menu lateral

### Passo 2: Executar Migrações em Ordem

Execute cada arquivo na ordem, copiando e colando o conteúdo:

#### 1️⃣ Schema Base
```sql
-- Copie e cole o conteúdo de: 00_initial_schema.sql
-- Clique em "Run" ou pressione Ctrl+Enter
```

#### 2️⃣ Gerenciamento de Conteúdo
```sql
-- Copie e cole o conteúdo de: 01_content_management.sql
-- Clique em "Run"
```

#### 3️⃣ Mídia e Logs
```sql
-- Copie e cole o conteúdo de: 02_media_and_logs.sql
-- Clique em "Run"
```

#### 4️⃣ Storage Buckets
```sql
-- Copie e cole o conteúdo de: 03_storage_buckets.sql
-- Clique em "Run"
```

#### 5️⃣ Dados Iniciais
```sql
-- Copie e cole o conteúdo de: 04_seed_initial_data.sql
-- Clique em "Run"
```

#### 6️⃣ Promover Todos os Usuários a Admin
```sql
-- Copie e cole o conteúdo de: 05_promote_admin.sql
-- Clique em "Run"
-- Isso promove AUTOMATICAMENTE TODOS os usuários existentes a admin
-- Novos usuários também serão admin automaticamente
```

### Passo 3: Verificar Admins Criados

```sql
-- Verificar se o perfil foi criado com role admin
SELECT id, email, role, created_at
FROM profiles
WHERE email = 'seu-email@exemplo.com';

-- Se não aparecer ou role não for 'admin', execute:
SELECT public.promote_user_to_admin('seu-email@exemplo.com');
```

## 🎯 Método 2: Via psql (Terminal)

```bash
# Conectar ao banco
psql "postgresql://postgres:[SUA-SENHA]@[SEU-HOST]:5432/postgres"

# Executar migrações
\i 00_initial_schema.sql
\i 01_content_management.sql
\i 02_media_and_logs.sql
\i 03_storage_buckets.sql
\i 04_seed_initial_data.sql
\i 05_promote_admin.sql
\i 05_promote_admin.sql

# Verificar admin criado
SELECT * FROM profiles WHERE role =
```

## 🎯 Método 3: Via Supabase CLI

```bash
# Instalar Supabase CLI (se não tiver)
npm install -g supabase

# Login
supabase login

# Link ao projeto
supabase link --project-ref [SEU-PROJECT-REF]

# Aplicar migrações
supabase db push

# Ou resetar banco (CUIDADO: apaga tudo)
supabase db reset
```

## ✅ Verificação Pós-Migração

Execute no SQL Editor para verificar:

```sql
-- Verificar tabelas criadas
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Verificar RLS habilitado
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- Verificar storage bucket
SELECT * FROM storage.buckets WHERE id = 'uploads';

-- Verificar dados iniciais
SELECT * FROM homepage_hero_content;
SELECT * FROM homepage_banner_sections;
SELECT * FROM content_sections WHERE id = 'homepage_settings';
```

## 🔧 Configurar .env.local

Após aplicar as migrações, configure seu `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[SEU-PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[SUA-ANON-KEY]
SUPABASE_SERVICE_ROLE_KEY=[SUA-SERVICE-ROLE-KEY]

# Admin (opcional - para autenticação local)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=sua-senha-segura

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=5563992731977
```

## 📝 Próximos Passos

### 1. Criar Categorias

Acesse `/admin/categories` e crie suas categorias:

- Cartões de Visita
- Banners e Fachadas
- Adesivos
- Impressões
- Flyers

### 2. Criar Produtos

Acesse `/admin/products/new` e crie produtos:

- Selecione a categoria
- Preencha nome, descrição, preço
- Faça upload de imagens
- Salve

### 3. Configurar Homepage

Acesse `/admin/content/sections` e:

- Crie seções de produtos
- Arraste produtos para as seções
- Configure layout (featured/grid)
- Defina ordem de exibição

### 4. Personalizar Conteúdo

- `/admin/content/hero` - Editar hero section
- `/admin/content/banners` - Editar banners
- `/admin/content/pricing` - Editar seção de preços

## ⚠️ Troubleshooting

### Erro: "permission denied for schema public"

```sql
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
```

### Erro: "relation already exists"

```sql
-- Dropar tabela específica
DROP TABLE IF EXISTS nome_da_tabela CASCADE;

-- Ou resetar tudo (CUIDADO!)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
```

### Erro: "bucket already exists"

```sql
-- Deletar bucket existente
DELETE FROM storage.buckets WHERE id = 'uploads';
```

### RLS bloqueando operações

```sql
-- Verificar policies
SELECT * FROM pg_policies WHERE tablename = 'nome_da_tabela';

-- Desabilitar RLS temporariamente (apenas para debug)
ALTER TABLE nome_da_tabela DISABLE ROW LEVEL SECURITY;
```

## 🔄 Rollback (Reverter Migrações)

Se algo der errado:

```sql
-- Dropar todas as tabelas
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS media_library CASCADE;
DROP TABLE IF EXISTS homepage_section_items CASCADE;
DROP TABLE IF EXISTS homepage_sections CASCADE;
DROP TABLE IF EXISTS homepage_banner_sections CASCADE;
DROP TABLE IF EXISTS homepage_hero_content CASCADE;
DROP TABLE IF EXISTS content_sections CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS product_categories CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Dropar funções
DROP FUNCTION IF EXISTS handle_updated_at CASCADE;
DROP FUNCTION IF EXISTS handle_new_user CASCADE;

-- Dropar bucket
DELETE FROM storage.buckets WHERE id = 'uploads';
```

## 📞 Suporte

Se precisar de ajuda:

1. Verifique os logs no Supabase Dashboard
2. Consulte a documentação: [https://supabase.com/docs](https://supabase.com/docs)
3. Revise o arquivo `README.md` nesta pasta

## ✨ Pronto!

Após aplicar todas as migrações, seu banco estará pronto para uso com:

- ✅ Schema otimizado sem sincronização
- ✅ Categorias criadas manualmente
- ✅ RLS configurado
- ✅ Storage configurado
- ✅ Dados iniciais inseridos
- ✅ Controle total do admin
