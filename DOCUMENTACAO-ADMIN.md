# 📚 DOCUMENTAÇÃO COMPLETA - PAINEL ADMINISTRATIVO
## AquiFaz - Gráfica Digital

---

## 🎯 VISÃO GERAL

O **Painel Administrativo AquiFaz** é um sistema completo de gestão de conteúdo e produtos desenvolvido para dar controle total sobre o catálogo da gráfica, substituindo todos os dados ficcionais por conteúdo real e editável.

### ✨ **Principais Funcionalidades:**
- 🛍️ **Gestão de Produtos** - CRUD completo com upload de imagens
- 🎨 **Gestão de Conteúdo** - Editor de seções do site (hero, banners)
- 📁 **Biblioteca de Mídia** - Upload, otimização e organização de imagens
- 📊 **Dashboard** - Estatísticas e atividades recentes
- 🔐 **Autenticação** - Sistema de roles (admin/editor/viewer)
- 📱 **Responsivo** - Interface otimizada para desktop e mobile

---

## 🚀 INSTALAÇÃO E CONFIGURAÇÃO

### **Pré-requisitos:**
- Node.js 18+ instalado
- Conta no Supabase configurada
- Variáveis de ambiente configuradas

### **1. Dependências Instaladas:**
```bash
# Já executado - dependências principais
npm install @hookform/resolvers react-hook-form zod react-dropzone 
npm install sharp recharts date-fns uuid @types/uuid
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu 
npm install @radix-ui/react-select @radix-ui/react-tabs @radix-ui/react-toast
```

### **2. Configuração do Banco de Dados:**

#### **Opção A - Via Script (Linux/Mac):**
```bash
chmod +x scripts/apply-migrations.sh
./scripts/apply-migrations.sh
```

#### **Opção B - Via Script (Windows):**
```cmd
scripts\apply-migrations.bat
```

#### **Opção C - Manual (Recomendado):**
1. Abra o **Supabase Dashboard**
2. Vá para **SQL Editor**
3. Cole o conteúdo de `supabase/migrations/20241107000001_admin_setup.sql`
4. Execute o script

### **3. Configuração do Storage:**
No painel do Supabase, vá para **Storage** e crie um bucket chamado `media` com as seguintes configurações:
- **Public**: `true`
- **File size limit**: `5MB`
- **Allowed MIME types**: `image/*`

### **4. Primeiro Usuário Admin:**
1. No painel do Supabase → **Authentication** → **Users**
2. Clique em **Add User**
3. Preencha email e senha
4. Após criar, execute no SQL Editor:
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'seu-email@exemplo.com';
```

---

## 🏗️ ARQUITETURA

### **Estrutura de Pastas:**
```
app/
├── admin/                    # Páginas do painel admin
│   ├── layout.tsx           # Layout com sidebar + auth
│   ├── page.tsx             # Dashboard principal
│   ├── products/            # Gestão de produtos
│   ├── content/             # Gestão de conteúdo
│   ├── media/               # Biblioteca de mídia
│   └── settings/            # Configurações
├── api/admin/               # APIs administrativas
│   ├── products/            # CRUD de produtos
│   ├── upload/              # Upload de mídia
│   └── content/             # Gestão de conteúdo
└── auth/                    # Autenticação
    ├── login/               # Página de login
    └── unauthorized/        # Acesso negado

components/admin/
├── layout/                  # Componentes de layout
│   ├── admin-sidebar.tsx    # Sidebar de navegação
│   └── admin-header.tsx     # Header com usuário
├── dashboard/               # Componentes do dashboard
├── products/                # Componentes de produtos
├── content/                 # Editores de conteúdo
├── media/                   # Gestão de mídia
└── ui/                      # Componentes UI básicos

lib/admin/
├── auth.ts                  # Funções de autenticação
├── api.ts                   # Helpers de API
└── validation.ts            # Schemas de validação
```

### **Banco de Dados - Estrutura:**

#### **Tabelas Principais:**
1. **`products`** - Produtos expandidos
2. **`profiles`** - Perfis com roles
3. **`content_sections`** - Conteúdo editável
4. **`media`** - Biblioteca de mídia
5. **`product_categories`** - Categorias
6. **`activity_logs`** - Log de atividades

#### **Novos Campos em `products`:**
```sql
-- Campos administrativos
active BOOLEAN DEFAULT true
featured BOOLEAN DEFAULT false
show_on_home BOOLEAN DEFAULT true
show_on_featured BOOLEAN DEFAULT false

-- Mídia
images TEXT[]
thumbnail_url TEXT

-- Comerciais
discount_price DECIMAL(10,2)
discount_start TIMESTAMP
discount_end TIMESTAMP

-- Técnicos
specifications JSONB
min_quantity INTEGER
max_quantity INTEGER
unit TEXT

-- SEO
tags TEXT[]
meta_description TEXT
sort_order INTEGER

-- Auditoria
updated_at TIMESTAMP
updated_by UUID
```

---

## 🎮 COMO USAR

### **1. Acessando o Painel:**
1. Inicie o servidor: `npm run dev`
2. Acesse: `http://localhost:3000/admin`
3. Faça login com credenciais de admin/editor

### **2. Dashboard Principal:**
- **Estatísticas** em tempo real
- **Ações rápidas** para tarefas comuns
- **Atividades recentes** do sistema

### **3. Gestão de Produtos:**

#### **Adicionar Produto:**
1. **Admin** → **Produtos** → **Adicionar Produto**
2. Preencha informações básicas
3. Faça upload de até 5 imagens
4. Configure visibilidade (ativo, destaque, home)
5. Defina promoções (opcional)
6. Adicione tags para busca

#### **Editar Produto:**
1. Clique no produto na lista
2. Modifique campos necessários
3. **Preview em tempo real** das alterações
4. Salve e veja atualização no site

#### **Configurações Avançadas:**
- **Especificações técnicas** (JSON)
- **Quantidade mínima/máxima**
- **Unidade de medida**
- **SEO** (meta description)
- **Ordem de exibição**

### **4. Biblioteca de Mídia:**

#### **Upload de Imagens:**
- **Arraste e solte** ou clique para selecionar
- **Otimização automática** (redimensiona para 2000px)
- **Compressão inteligente** (JPEG 85% qualidade)
- **Metadados** salvos automaticamente

#### **Formatos Suportados:**
- JPEG, PNG, WebP, GIF
- Tamanho máximo: 5MB por arquivo
- GIFs animados preservados

#### **Organização:**
- Categorias automáticas por tipo
- Busca por nome/tipo
- Preview com informações técnicas

### **5. Gestão de Conteúdo:**

#### **Hero Section:**
- **Título e subtítulo** editáveis
- **Descrição** personalizada
- **WhatsApp** (número e mensagem)
- **Banner promocional** (imagem + textos)

#### **Configuração de Banners:**
- Upload de imagem promocional
- Títulos e call-to-actions
- Links personalizados
- Ativação/desativação

---

## 🔐 SISTEMA DE PERMISSÕES

### **Roles Disponíveis:**

#### **👑 Admin (Administrador):**
- ✅ **Todas as permissões**
- ✅ Criar/editar/deletar produtos
- ✅ Gerenciar usuários e roles
- ✅ Configurações do sistema
- ✅ Logs de atividade

#### **✏️ Editor:**
- ✅ Criar/editar produtos
- ✅ Upload de mídia
- ✅ Editar conteúdo
- ❌ Deletar produtos
- ❌ Gerenciar usuários

#### **👁️ Viewer:**
- ✅ Visualizar dados
- ❌ Edições limitadas

### **Proteção de Rotas:**
- **Middleware** protege todas as rotas `/admin/*`
- **APIs** verificam permissões antes de cada operação
- **Redirecionamento** automático para login

---

## 🛠️ APIS DISPONÍVEIS

### **Produtos:**
```typescript
// Listar produtos com filtros e paginação
GET /api/admin/products?page=1&limit=20&category=cartoes&active=true

// Criar produto
POST /api/admin/products
Body: { name, description, category, price, images[], ... }

// Obter produto específico
GET /api/admin/products/[id]

// Atualizar produto
PUT /api/admin/products/[id]
Body: { name?, description?, price?, ... }

// Deletar produto (apenas admin)
DELETE /api/admin/products/[id]
```

### **Upload de Mídia:**
```typescript
// Upload de arquivo
POST /api/admin/upload
FormData: { file, category?, alt_text? }

// Listar mídia
GET /api/admin/upload?page=1&category=products
```

### **Conteúdo:**
```typescript
// Hero section
GET /api/admin/content/hero
PUT /api/admin/content/hero
Body: { title, subtitle, description, whatsapp_number, ... }
```

---

## 📊 MONITORAMENTO E LOGS

### **Activity Logs:**
Todas as ações administrativas são registradas:
- **Criação/edição** de produtos
- **Upload** de mídia
- **Alterações** de conteúdo
- **Login** de usuários

### **Dashboard Analytics:**
- **Total de produtos** (ativo/inativo)
- **Produtos em destaque**
- **Arquivos de mídia**
- **Crescimento** mensal

---

## 🎨 CUSTOMIZAÇÃO

### **Cores e Tema:**
O painel mantém **100%** da identidade visual do site:
```css
/* Cores principais preservadas */
--color-admin-primary: #3B82F6    /* Azul admin */
--color-admin-success: #10B981    /* Verde sucesso */
--color-admin-warning: #F59E0B    /* Amarelo aviso */
--color-admin-error: #EF4444      /* Vermelho erro */
```

### **Componentes Reutilizáveis:**
- **Button** - Botões com estados e variantes
- **Input** - Campos com validação visual
- **Modal** - Modais responsivos
- **Sidebar** - Navegação colapsável

---

## 🔧 TROUBLESHOOTING

### **Problemas Comuns:**

#### **1. Erro de autenticação:**
```
Acesso negado: Permissões necessárias
```
**Solução:** Verificar se o usuário tem role admin/editor na tabela `profiles`

#### **2. Upload falha:**
```
Erro no upload do arquivo
```
**Soluções:**
- Verificar se o bucket `media` existe
- Confirmar permissões do storage
- Verificar tamanho do arquivo (máx 5MB)

#### **3. Migration não aplicada:**
```
Tabela 'profiles' não existe
```
**Solução:** Executar migration manualmente no SQL Editor do Supabase

#### **4. Middleware bloqueia acesso:**
```
Redirecionamento infinito
```
**Solução:** Verificar se `NEXT_PUBLIC_SUPABASE_URL` está configurado

### **Debug Mode:**
Para debugging, adicione logs no console:
```typescript
console.log('User:', user)
console.log('Profile:', profile)
console.log('Permissions:', permissions)
```

---

## 🚀 PRÓXIMOS PASSOS

### **Expansões Futuras:**
1. **Sistema de notificações** push
2. **Relatórios avançados** com gráficos
3. **Backup automático** de dados
4. **API externa** para integrações
5. **Mobile app** para gestão

### **Melhorias Planejadas:**
1. **Editor WYSIWYG** para descrições
2. **Bulk operations** para produtos
3. **Templates** de produtos
4. **Workflow** de aprovação
5. **Multi-idioma** (i18n)

---

## ✅ CHECKLIST FINAL

### **✅ Funcionalidades Implementadas:**
- [x] **Autenticação** completa com roles
- [x] **CRUD de produtos** com validação
- [x] **Upload otimizado** de imagens
- [x] **Dashboard** com estatísticas
- [x] **Gestão de conteúdo** editável
- [x] **Logs de atividade** detalhados
- [x] **Interface responsiva** e intuitiva
- [x] **APIs REST** completas
- [x] **Middleware de segurança**
- [x] **Documentação** completa

### **⚡ Performance:**
- **Imagens otimizadas** automaticamente
- **Lazy loading** nos componentes
- **Paginação** em listas
- **Cache** de 1 hora nos dados
- **Compressão** de arquivos

### **🔒 Segurança:**
- **RLS** (Row Level Security) ativo
- **Validação** client + server
- **Sanitização** de inputs
- **Logs** de auditoria
- **Proteção CSRF**

---

**🎉 O Painel Administrativo AquiFaz está 100% funcional e pronto para uso em produção!**

**Para dúvidas ou suporte, consulte os logs do sistema ou entre em contato com a equipe de desenvolvimento.**