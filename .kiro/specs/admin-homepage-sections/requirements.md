# Requirements Document - Admin Homepage Sections

## Introduction

Este documento define os requisitos para implementar no Painel Admin todas as sections que compõem a homepage do PrintShop. A análise foi realizada com base no código existente da homepage (`app/page.tsx`) e nos dados mock (`lib/mock-data.ts` e `lib/content.ts`).

O objetivo é garantir que o painel admin permita gerenciar 100% do conteúdo da homepage, seguindo os padrões de arquitetura dual-source já estabelecidos (homepage tables → legacy tables → mock data).

## Glossary

- **System**: Painel Admin do PrintShop
- **Homepage**: Página principal pública do site (`app/page.tsx`)
- **Section**: Seção visual da homepage (Hero, Categories, Products, Banner, Pricing)
- **Dual-Source Pattern**: Arquitetura de fallback (tabela primária → tabela legacy → mock data)
- **Mock Data**: Dados simulados para desenvolvimento sem banco de dados
- **Admin User**: Usuário autenticado com acesso ao painel administrativo
- **Supabase**: Banco de dados PostgreSQL usado pelo sistema
- **Content Management**: Gerenciamento de conteúdo através do painel admin

## ANÁLISE COMPLETA - Sections da Homepage

### ✅ Sections Identificadas no Código (app/page.tsx)

A homepage renderiza as seguintes sections na ordem:

1. **Hero Section** (`<HeroSection />`)
   - Componente: `components/ui/hero/hero-section.tsx`
   - Dados: `getHeroContent()` → `homepage_hero_content` → `content_sections` → `DEFAULT_HERO_CONTENT`
   - Status: ✅ **JÁ IMPLEMENTADO** em `/admin/content/hero`

2. **Categories Section** (`<CategoriesSection />`)
   - Componente: `components/ui/categories-section.tsx`
   - Dados: `getProductCategories()` → `homepage_categories` → `product_categories` → `DEFAULT_PRODUCT_CATEGORIES`
   - Status: ❌ **NÃO IMPLEMENTADO** no painel admin

3. **Featured Products Section** (`<FeaturedProductsSection />`)
   - Componente: `components/ui/featured-products-section.tsx`
   - Dados: `getFeaturedShowcaseProducts()` → `homepage_products` (featured=true) → `products` (featured=true) → mock data
   - Status: ❌ **NÃO IMPLEMENTADO** no painel admin (gerenciamento específico de produtos em destaque)

4. **Products Grid Section - "Mais vendidos"** (`<ProductsGridSection />`)
   - Componente: `components/ui/products-grid-section.tsx`
   - Dados: `getProducts()` → `homepage_products` (show_on_home=true) → `products` (show_on_home=true) → mock data
   - Status: ⚠️ **PARCIALMENTE IMPLEMENTADO** (existe `/admin/products`, mas não gerenciamento específico para homepage)

5. **Products Grid Section - "Impressão"** (`<ProductsGridSection />`)
   - Dados: `getProductsByCategory('print')` → filtro por categoria
   - Status: ⚠️ **PARCIALMENTE IMPLEMENTADO** (gerenciado via produtos)

6. **Products Grid Section - "Adesivos"** (`<ProductsGridSection />`)
   - Dados: `getProductsByCategory('adesivos')` → filtro por categoria
   - Status: ⚠️ **PARCIALMENTE IMPLEMENTADO** (gerenciado via produtos)

7. **Image Banner Section** (`<ImageBannerSection />`)
   - Componente: `components/ui/image-banner-section.tsx`
   - Dados: `getBannerContent()` → `homepage_banner_sections` → `content_sections` → `DEFAULT_BANNER_CONTENT`
   - Status: ✅ **JÁ IMPLEMENTADO** em `/admin/content/banners`

8. **Products Grid Section - "Banners & Fachadas"** (`<ProductsGridSection />`)
   - Dados: `getProductsByCategory('banners')` → filtro por categoria
   - Status: ⚠️ **PARCIALMENTE IMPLEMENTADO** (gerenciado via produtos)

9. **Pricing Section** (`<PricingSection />`)
   - Componente: `components/ui/pricing/pricing-section.tsx`
   - Dados: Hardcoded no componente (array `pricingTiers`)
   - Status: ⚠️ **TELA EXISTE** (`/admin/content/pricing`) mas **SEM FUNCIONALIDADE** (dados hardcoded)

### 📊 Resumo do Status Atual

| Section | Implementado no Admin | Observações |
|---------|----------------------|-------------|
| Hero Section | ✅ Sim | `/admin/content/hero` - Completo |
| Categories Section | ❌ Não | Precisa de tela de gerenciamento |
| **Produtos em Destaque** | ❌ Não | **Sem gerenciamento no admin** |
| **Mais Vendidos** | ❌ Não | **Sem gerenciamento no admin** |
| **Impressão** | ❌ Não | **Sem gerenciamento no admin** |
| **Adesivos** | ❌ Não | **Sem gerenciamento no admin** |
| Image Banner | ✅ Sim | `/admin/content/banners` - Completo |
| **Banners & Fachadas** | ❌ Não | **Sem gerenciamento no admin** |
| Pricing Section | ⚠️ Parcial | Tela existe mas dados hardcoded |

**PROBLEMA IDENTIFICADO:** Quando mock data está ativo, essas seções aparecem na homepage, mas **não existe interface no painel admin para gerenciar quais produtos aparecem em cada seção**.

### 🔍 Campos Identificados por Section

#### 1. Hero Section (✅ Implementado)
```typescript
{
  subtitle: string
  title: string
  description: string
  whatsapp_number: string
  whatsapp_message: string
  promo_image_url: string
  promo_storage_path: string
  promo_title: string
  promo_subtitle: string
}
```

#### 2. Categories Section (❌ Não Implementado)
```typescript
{
  id: string
  name: string
  description: string
  icon: string  // Nome do ícone Lucide
  image_url: string
  active: boolean
  sort_order: number
}
```

**Mock Data (DEFAULT_PRODUCT_CATEGORIES):**
- Cartões de Visita (icon: CreditCard)
- Banners e Fachadas (icon: PanelsTopLeft)
- Adesivos (icon: Sticker)
- Impressões (icon: Printer)
- Flyers e Panfletos (icon: Files)

#### 3. Featured Products Section (❌ Não Implementado)
```typescript
// Usa dados de homepage_products com filtro featured=true
{
  featured: boolean  // Marca produto como destaque
  show_on_featured: boolean  // Exibe na seção de destaques
  sort_order: number  // Ordem de exibição
}
```

#### 4. Products Grid Sections (⚠️ Parcial)
```typescript
// Usa dados de homepage_products com filtros
{
  show_on_home: boolean  // Exibe na homepage
  category_id: string  // Filtro por categoria
  sort_order: number  // Ordem de exibição
  active: boolean
}
```

#### 5. Image Banner Section (✅ Implementado)
```typescript
{
  id: string
  title: string
  description: string
  text: string
  enabled: boolean
  background_color: string
  text_color: string
  link: string
  image_url: string
  storage_path: string
}
```

#### 6. Pricing Section (⚠️ Dados Hardcoded)
```typescript
{
  name: string  // Nome do plano
  quantity: string  // Quantidade de artes/mês
  idealFor: string  // Para quem é ideal
  price: string  // Faixa de preço
  features: string[]  // Lista de recursos
  highlighted: boolean  // Plano em destaque
}
```

**Dados Hardcoded Atuais:**
- Básico: 8 artes/mês, R$ 350 – R$ 500
- Intermediário: 12 artes/mês, R$ 600 – R$ 900 (highlighted)
- Premium: 20 artes/mês, R$ 1.000 – R$ 1.600

## Requirements

### Requirement 1: Categories Management

**User Story:** Como Admin User, quero gerenciar as categorias exibidas na homepage, para que eu possa controlar quais categorias aparecem e sua ordem de exibição.

#### Acceptance Criteria

1. WHEN Admin User acessa `/admin/content/categories`, THE System SHALL exibir lista de todas as categorias com nome, ícone, status ativo/inativo e ordem
2. WHEN Admin User clica em "Adicionar Categoria", THE System SHALL exibir formulário com campos: nome, descrição, ícone (seletor), imagem, status ativo, ordem de exibição
3. WHEN Admin User salva categoria, THE System SHALL validar campos obrigatórios (nome, ícone) e salvar em `homepage_categories`
4. WHEN Admin User faz upload de imagem, THE System SHALL armazenar no Supabase Storage em `/uploads/categories/` e salvar URL e storage_path
5. WHERE banco de dados indisponível, THE System SHALL exibir categorias do mock data com indicador visual de modo mock
6. WHEN Admin User reordena categorias via drag-and-drop, THE System SHALL atualizar campo sort_order de todas as categorias afetadas
7. WHEN Admin User desativa categoria, THE System SHALL ocultar categoria da homepage sem deletar dados

### Requirement 2: Featured Products Curation

**User Story:** Como Admin User, quero curar produtos em destaque para a homepage, para que eu possa controlar quais produtos aparecem na seção "Featured Products".

#### Acceptance Criteria

1. WHEN Admin User acessa `/admin/content/featured-products`, THE System SHALL exibir lista de produtos marcados como featured com preview de imagem, nome e ordem
2. WHEN Admin User clica em "Adicionar Produto em Destaque", THE System SHALL exibir modal com busca de produtos existentes
3. WHEN Admin User seleciona produto, THE System SHALL marcar produto com `featured=true` e `show_on_featured=true` em `homepage_products`
4. WHEN Admin User reordena produtos via drag-and-drop, THE System SHALL atualizar campo sort_order
5. WHERE banco de dados indisponível, THE System SHALL exibir produtos do mock data filtrados por featured=true
6. WHEN Admin User remove produto dos destaques, THE System SHALL atualizar flags `featured=false` e `show_on_featured=false`
7. THE System SHALL limitar exibição a 6 produtos em destaque conforme código da homepage

### Requirement 3: Homepage Products Curation

**User Story:** Como Admin User, quero gerenciar quais produtos aparecem nas diferentes seções da homepage, para que eu possa controlar o conteúdo exibido por categoria.

#### Acceptance Criteria

1. WHEN Admin User acessa `/admin/content/homepage-products`, THE System SHALL exibir abas para cada categoria (Mais Vendidos, Impressão, Adesivos, Banners)
2. WHEN Admin User seleciona aba, THE System SHALL exibir produtos da categoria com checkbox "Exibir na Homepage" e campo de ordem
3. WHEN Admin User marca checkbox "Exibir na Homepage", THE System SHALL atualizar `show_on_home=true` em `homepage_products`
4. WHEN Admin User ajusta ordem de exibição, THE System SHALL atualizar campo sort_order
5. WHERE banco de dados indisponível, THE System SHALL exibir produtos do mock data filtrados por categoria
6. THE System SHALL respeitar limites de exibição por seção (12 para "Mais Vendidos", 8 para categorias específicas)
7. WHEN Admin User desmarca produto, THE System SHALL atualizar `show_on_home=false` sem deletar produto

### Requirement 4: Pricing Plans Management

**User Story:** Como Admin User, quero gerenciar os planos de preços exibidos na homepage, para que eu possa atualizar valores e recursos sem modificar código.

#### Acceptance Criteria

1. WHEN Admin User acessa `/admin/content/pricing`, THE System SHALL exibir lista de planos existentes com nome, preço e status destacado
2. WHEN Admin User clica em "Adicionar Plano", THE System SHALL exibir formulário com campos: nome, quantidade, ideal para, preço, recursos (lista), destacado (checkbox)
3. WHEN Admin User adiciona recurso, THE System SHALL permitir adicionar múltiplos itens em lista editável
4. WHEN Admin User salva plano, THE System SHALL validar campos obrigatórios e salvar em tabela `homepage_pricing_tiers`
5. WHERE banco de dados indisponível, THE System SHALL exibir planos hardcoded do componente com indicador de modo mock
6. WHEN Admin User marca plano como "Destacado", THE System SHALL desmarcar outros planos destacados (apenas 1 permitido)
7. WHEN Admin User reordena planos, THE System SHALL atualizar ordem de exibição na homepage
8. THE System SHALL gerar automaticamente link WhatsApp com informações do plano selecionado

### Requirement 5: Dual-Source Pattern Implementation

**User Story:** Como System, quero implementar padrão dual-source em todas as novas sections, para que o sistema funcione com ou sem banco de dados.

#### Acceptance Criteria

1. WHEN System busca dados de categories, THE System SHALL tentar `homepage_categories`, depois `product_categories`, depois `DEFAULT_PRODUCT_CATEGORIES`
2. WHEN System busca dados de pricing, THE System SHALL tentar `homepage_pricing_tiers`, depois dados hardcoded do componente
3. WHEN System busca featured products, THE System SHALL tentar `homepage_products` (featured=true), depois `products` (featured=true), depois mock data
4. WHEN banco de dados falha, THE System SHALL registrar warning no console e usar fallback sem quebrar interface
5. THE System SHALL exibir indicador visual no admin quando operando em modo mock data
6. WHEN Admin User tenta salvar em modo mock, THE System SHALL exibir mensagem informando que banco está indisponível
7. THE System SHALL manter consistência de dados entre tabelas primárias e legacy durante transição

### Requirement 6: Image Upload and Resolution Requirements

**User Story:** Como Admin User, quero ver requisitos de resolução ao fazer upload de imagens, para que eu possa fornecer imagens com qualidade adequada.

#### Acceptance Criteria

1. WHEN Admin User visualiza campo de upload de imagem, THE System SHALL exibir placeholder com resolução ideal em pixels
2. THE System SHALL exibir subtítulo com contexto da imagem (ex: "Resolução ideal para ícone de categoria")
3. WHEN Admin User faz upload, THE System SHALL validar formato (JPG, PNG, WEBP) e tamanho máximo (2MB para ícones, 5MB para banners)
4. THE System SHALL exibir comentário com resolução mínima, ideal e formatos suportados
5. WHEN imagem não atende requisitos, THE System SHALL exibir aviso mas permitir upload
6. THE System SHALL usar aspect-ratio CSS para manter proporções corretas na preview
7. WHERE imagem não existe, THE System SHALL exibir placeholder com dimensões recomendadas

### Requirement 7: Admin UI Consistency

**User Story:** Como Admin User, quero interface consistente em todas as telas de gerenciamento de conteúdo, para que eu tenha experiência uniforme.

#### Acceptance Criteria

1. THE System SHALL usar mesmo layout de formulário de Hero Section e Banners para novas telas
2. THE System SHALL exibir toast notifications para sucesso, erro e avisos em todas as operações
3. THE System SHALL exibir loading states durante operações assíncronas
4. THE System SHALL usar React Hook Form + Zod para validação em todos os formulários
5. THE System SHALL manter padrão visual de botões, inputs e cards em todas as telas
6. THE System SHALL exibir breadcrumbs de navegação em todas as sub-páginas de content
7. THE System SHALL ser responsivo e funcional em dispositivos móveis

### Requirement 8: Data Migration and Compatibility

**User Story:** Como System, quero manter compatibilidade com dados existentes, para que a implementação não quebre funcionalidades atuais.

#### Acceptance Criteria

1. THE System SHALL manter Hero Section e Banners funcionando sem alterações
2. THE System SHALL não modificar homepage pública durante implementação
3. THE System SHALL criar novas tabelas sem afetar tabelas legacy existentes
4. WHEN novas tabelas não existem, THE System SHALL usar tabelas legacy como fallback
5. THE System SHALL permitir migração gradual de dados de legacy para novas tabelas
6. THE System SHALL manter mock data atualizado com mesma estrutura das tabelas
7. THE System SHALL documentar schema de novas tabelas em migrations do Supabase

## Restrições Técnicas

❌ **Proibido:**
- Modificar a homepage pública (`app/page.tsx`)
- Alterar Hero Section e Banners já implementados
- Modificar design oficial do site
- Quebrar funcionalidades existentes
- Usar links manuais para imagens (sempre Supabase Storage)

✅ **Obrigatório:**
- Seguir padrão dual-source em todas as features
- Usar Supabase Storage para uploads
- Implementar validação com Zod
- Exibir placeholders com resolução de imagens
- Manter consistência visual com telas existentes
- Testar com e sem banco de dados
- Documentar novas tabelas em migrations

## Priorização

### 🔥 Alta Prioridade (MVP) - FOCO PRINCIPAL

**Gerenciamento de Seções de Produtos da Homepage:**

1. **Featured Products Curation (Requirement 2)** - Seção "Produtos em Destaque"
2. **Homepage Products Curation (Requirement 3)** - Seções:
   - "Mais Vendidos"
   - "Impressão"
   - "Adesivos"
   - "Banners & Fachadas"

**Justificativa:** Estas são as seções que aparecem quando mock data está ativo, mas não têm interface de administração. São essenciais para controle do conteúdo da homepage.

### Média Prioridade
3. Categories Management (Requirement 1) - Gerenciar categorias exibidas
4. Pricing Plans Management (Requirement 4) - Tornar preços editáveis

### Baixa Prioridade (Melhorias)
5. Drag-and-drop reordering
6. Bulk operations
7. Preview mode antes de publicar

## Critérios de Aceitação Global

✅ **A implementação será considerada completa quando:**

1. Análise foi documentada com relatório de sections reais
2. Todas as sections ausentes foram implementadas no painel admin
3. Painel admin reflete 100% da estrutura da homepage
4. Hero Section e Banners permanecem intactos
5. Homepage pública não sofreu modificações
6. Sistema funciona com e sem banco de dados (mock data)
7. Todas as telas seguem padrões de UI estabelecidos
8. Uploads de imagem funcionam corretamente
9. Validações de formulário estão implementadas
10. Testes manuais confirmam funcionamento em todos os modos
