# Design Document - Admin Homepage Sections

## Overview

Este documento detalha o design da solução para implementar gerenciamento completo das seções de produtos da homepage no Painel Admin. O foco principal é criar interfaces para curar e organizar produtos que aparecem nas seções:

- **Produtos em Destaque** (Featured Products)
- **Mais Vendidos** (Best Sellers)
- **Impressão** (Print Category)
- **Adesivos** (Stickers Category)
- **Banners & Fachadas** (Banners Category)

A solução seguirá o padrão dual-source já estabelecido no projeto e manterá consistência visual com as telas existentes de Hero e Banners.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Admin Panel UI                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  /admin/content/homepage-products                     │   │
│  │  ┌────────────┬────────────┬────────────┬──────────┐ │   │
│  │  │ Destaques  │ Mais       │ Impressão  │ Adesivos │ │   │
│  │  │            │ Vendidos   │            │          │ │   │
│  │  └────────────┴────────────┴────────────┴──────────┘ │   │
│  │                                                        │   │
│  │  Product Selection + Reordering Interface             │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Layer                                 │
│  /api/admin/content/homepage-products                        │
│  - GET: Fetch products by section                            │
│  - PUT: Update product flags and order                       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                 Data Layer (Dual-Source)                     │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────┐ │
│  │ homepage_products│→ │ products (legacy)│→ │ Mock Data │ │
│  │ (Primary)        │  │ (Fallback)       │  │ (Final)   │ │
│  └──────────────────┘  └──────────────────┘  └───────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Admin User** acessa `/admin/content/homepage-products`
2. **UI** carrega produtos via API `/api/admin/content/homepage-products?section=featured`
3. **API** tenta buscar de `homepage_products` → `products` → mock data
4. **UI** exibe produtos com checkboxes e controles de ordem
5. **Admin User** marca/desmarca produtos e ajusta ordem
6. **UI** envia PUT para API com alterações
7. **API** atualiza flags (`featured`, `show_on_home`, `show_on_featured`) e `sort_order`
8. **Homepage** reflete mudanças na próxima renderização

## Components and Interfaces

### 1. Homepage Products Management Page

**Localização:** `app/admin/content/homepage-products/page.tsx`

**Responsabilidades:**
- Exibir abas para cada seção (Destaques, Mais Vendidos, Impressão, Adesivos, Banners)
- Carregar produtos da seção selecionada
- Permitir busca e filtro de produtos
- Exibir produtos com preview de imagem, nome, preço
- Checkbox para incluir/excluir produto da seção
- Controles de reordenação (↑↓ ou drag-and-drop)
- Botão "Salvar Alterações"
- Loading states e error handling

**Interface TypeScript:**

```typescript
interface HomepageProductsPageProps {}

interface HomepageProductsPageState {
  activeTab: 'featured' | 'bestsellers' | 'print' | 'stickers' | 'banners'
  products: Product[]
  selectedProducts: Set<string> // IDs dos produtos selecionados
  productOrder: string[] // IDs na ordem de exibição
  isLoading: boolean
  isSaving: boolean
  searchTerm: string
}

interface ProductListItemProps {
  product: Product
  isSelected: boolean
  order: number
  onToggle: (productId: string) => void
  onMoveUp: (productId: string) => void
  onMoveDown: (productId: string) => void
}
```

### 2. Product Selection Component

**Localização:** `components/admin/content/product-selection-list.tsx`

**Responsabilidades:**
- Renderizar lista de produtos com checkboxes
- Exibir preview de imagem, nome, categoria, preço
- Mostrar ordem atual (1, 2, 3...)
- Botões de reordenação (↑↓)
- Indicador visual de produtos selecionados
- Empty state quando nenhum produto disponível

**Props:**

```typescript
interface ProductSelectionListProps {
  products: Product[]
  selectedProductIds: Set<string>
  productOrder: string[]
  onToggleProduct: (productId: string) => void
  onReorder: (productId: string, direction: 'up' | 'down') => void
  maxProducts?: number // Limite de produtos por seção
  emptyMessage?: string
}
```

### 3. Section Tabs Component

**Localização:** `components/admin/content/section-tabs.tsx`

**Responsabilidades:**
- Exibir abas para cada seção
- Indicar aba ativa
- Mostrar contador de produtos selecionados por aba
- Navegação entre seções

**Props:**

```typescript
interface SectionTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  sections: Array<{
    id: string
    label: string
    count: number // Produtos selecionados
    maxCount: number // Limite da seção
  }>
}
```

### 4. API Route Handler

**Localização:** `app/api/admin/content/homepage-products/route.ts`

**Endpoints:**

```typescript
// GET /api/admin/content/homepage-products?section=featured
export async function GET(request: Request): Promise<Response>

// PUT /api/admin/content/homepage-products
export async function PUT(request: Request): Promise<Response>

interface GetHomepageProductsParams {
  section: 'featured' | 'bestsellers' | 'print' | 'stickers' | 'banners'
}

interface UpdateHomepageProductsBody {
  section: string
  productIds: string[] // IDs na ordem desejada
}

interface HomepageProductsResponse {
  products: Product[]
  source: 'database' | 'mock'
  section: string
  maxProducts: number
}
```

## Data Models

### Database Schema

#### Tabela: `homepage_products`

Esta tabela já existe no projeto. Vamos utilizar os campos existentes:

```sql
CREATE TABLE homepage_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  category_id TEXT NOT NULL,
  price DECIMAL(10,2),
  unit TEXT DEFAULT 'unidade',
  image_url TEXT,
  storage_path TEXT,
  gallery TEXT[], -- Array de URLs de imagens
  
  -- Flags de exibição (CAMPOS CHAVE)
  featured BOOLEAN DEFAULT false,           -- Produto é destaque
  show_on_home BOOLEAN DEFAULT true,        -- Exibe na homepage
  show_on_featured BOOLEAN DEFAULT false,   -- Exibe na seção "Produtos em Destaque"
  
  -- Ordenação
  sort_order INTEGER DEFAULT 0,
  
  -- Status
  active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_homepage_products_featured ON homepage_products(featured, active);
CREATE INDEX idx_homepage_products_category ON homepage_products(category_id, active);
CREATE INDEX idx_homepage_products_sort ON homepage_products(sort_order);
```

### Mapeamento de Seções para Filtros

```typescript
const SECTION_FILTERS = {
  featured: {
    label: 'Produtos em Destaque',
    filter: { featured: true, show_on_featured: true },
    maxProducts: 6,
    description: 'Produtos exibidos na seção de destaques da homepage'
  },
  bestsellers: {
    label: 'Mais Vendidos',
    filter: { show_on_home: true, category_id: null }, // Sem filtro de categoria
    maxProducts: 12,
    description: 'Produtos exibidos na seção "Mais vendidos"'
  },
  print: {
    label: 'Impressão',
    filter: { show_on_home: true, category_id: 'print' },
    maxProducts: 8,
    description: 'Produtos da categoria Impressão exibidos na homepage'
  },
  stickers: {
    label: 'Adesivos',
    filter: { show_on_home: true, category_id: 'adesivos' },
    maxProducts: 8,
    description: 'Produtos da categoria Adesivos exibidos na homepage'
  },
  banners: {
    label: 'Banners & Fachadas',
    filter: { show_on_home: true, category_id: 'banners' },
    maxProducts: 8,
    description: 'Produtos da categoria Banners exibidos na homepage'
  }
}
```

### TypeScript Interfaces

```typescript
// Extensão da interface Product existente
interface Product {
  id: string
  name: string
  slug: string
  description: string
  category: string // category_id
  price: number
  unit?: string
  image_url: string
  storage_path?: string
  images?: string[] // gallery
  
  // Flags de homepage
  featured?: boolean
  show_on_home?: boolean
  show_on_featured?: boolean
  sort_order?: number
  
  active?: boolean
  created_at?: string
  updated_at?: string
}

// Configuração de seção
interface HomepageSection {
  id: string
  label: string
  description: string
  maxProducts: number
  filter: {
    featured?: boolean
    show_on_home?: boolean
    show_on_featured?: boolean
    category_id?: string | null
  }
}

// Estado de curadoria
interface HomepageCurationState {
  section: string
  products: Product[]
  selectedProductIds: string[]
  productOrder: Map<string, number> // productId -> order
}
```

## Error Handling

### Cenários de Erro

1. **Banco de dados indisponível**
   - Exibir banner informativo: "Modo Mock Data ativo - Alterações não serão salvas"
   - Desabilitar botão "Salvar"
   - Exibir produtos do mock data

2. **Limite de produtos excedido**
   - Exibir aviso: "Limite de X produtos atingido para esta seção"
   - Desabilitar checkboxes de produtos não selecionados
   - Permitir desmarcar produtos existentes

3. **Erro ao salvar**
   - Exibir toast de erro: "Erro ao salvar alterações. Tente novamente."
   - Manter estado anterior
   - Permitir retry

4. **Produto não encontrado**
   - Remover produto da lista
   - Exibir aviso: "Alguns produtos não estão mais disponíveis"

5. **Conflito de dados**
   - Recarregar dados do servidor
   - Exibir aviso: "Dados foram atualizados. Por favor, revise suas alterações."

### Error Handling Pattern

```typescript
async function saveHomepageProducts(section: string, productIds: string[]) {
  try {
    const response = await fetch('/api/admin/content/homepage-products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section, productIds })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erro ao salvar')
    }

    const data = await response.json()
    
    // Success toast
    toast.success('Alterações salvas com sucesso!')
    
    return data
  } catch (error) {
    console.error('Erro ao salvar produtos da homepage:', error)
    
    // Error toast
    toast.error(error.message || 'Erro ao salvar alterações')
    
    throw error
  }
}
```

## Testing Strategy

### Unit Tests

**Componentes a testar:**

1. **ProductSelectionList**
   - Renderiza lista de produtos corretamente
   - Checkbox toggle funciona
   - Reordenação funciona (up/down)
   - Respeita limite máximo de produtos
   - Empty state é exibido quando sem produtos

2. **SectionTabs**
   - Renderiza todas as abas
   - Aba ativa é destacada
   - Contador de produtos é exibido
   - Navegação entre abas funciona

3. **API Route Handler**
   - GET retorna produtos filtrados corretamente
   - PUT atualiza flags e ordem corretamente
   - Fallback para mock data funciona
   - Validação de entrada funciona

### Integration Tests

1. **Fluxo completo de curadoria**
   - Carregar página
   - Selecionar aba
   - Marcar produtos
   - Reordenar produtos
   - Salvar alterações
   - Verificar homepage reflete mudanças

2. **Modo Mock Data**
   - Página funciona sem banco de dados
   - Exibe produtos do mock data
   - Desabilita salvamento
   - Exibe indicador de modo mock

3. **Limites de produtos**
   - Não permite exceder limite da seção
   - Exibe aviso ao atingir limite
   - Permite desmarcar produtos

### Manual Testing Checklist

- [ ] Página carrega sem erros
- [ ] Todas as abas funcionam
- [ ] Produtos são exibidos com imagens
- [ ] Checkboxes funcionam
- [ ] Reordenação funciona (↑↓)
- [ ] Busca filtra produtos
- [ ] Salvar atualiza banco de dados
- [ ] Homepage reflete mudanças
- [ ] Funciona sem banco (mock data)
- [ ] Loading states aparecem
- [ ] Error states funcionam
- [ ] Toast notifications aparecem
- [ ] Responsivo em mobile
- [ ] Acessível via teclado

## UI/UX Design

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│ Header                                                       │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Conteúdo                                                 │ │
│ │ Homepage Products                                        │ │
│ │ Gerencie quais produtos aparecem nas seções da homepage │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Section Tabs                                                 │
│ ┌──────────┬──────────┬──────────┬──────────┬──────────┐   │
│ │Destaques │Mais      │Impressão │Adesivos  │Banners   │   │
│ │(3/6)     │Vendidos  │(5/8)     │(2/8)     │(4/8)     │   │
│ │          │(8/12)    │          │          │          │   │
│ └──────────┴──────────┴──────────┴──────────┴──────────┘   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Controls Bar                                                 │
│ ┌─────────────────────────┐  ┌──────────────────────────┐  │
│ │ 🔍 Buscar produtos...   │  │ [Salvar Alterações]      │  │
│ └─────────────────────────┘  └──────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Product List                                                 │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ☑ [1] [↑↓] 📷 Cartões de Visita Premium                │ │
│ │           Cartões | R$ 89,90                            │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ ☐     [↑↓] 📷 Banner 1x2m                               │ │
│ │           Banners | R$ 149,90                           │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ ☑ [2] [↑↓] 📷 Adesivos Personalizados                  │ │
│ │           Adesivos | R$ 59,90                           │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Visual Design Tokens

Seguindo o padrão estabelecido em Hero e Banners:

```css
/* Colors */
--color-primary: #007AFF;
--color-text-primary: #1D1D1F;
--color-text-secondary: #6E6E73;
--color-text-tertiary: #86868B;
--color-border: #D2D2D7;
--color-border-light: #E5E5EA;
--color-bg-white: #FFFFFF;
--color-bg-gray: #F5F5F5;
--color-bg-hover: #FAFAFA;

/* Spacing */
--spacing-xs: 0.5rem;
--spacing-sm: 1rem;
--spacing-md: 1.5rem;
--spacing-lg: 2rem;
--spacing-xl: 3rem;

/* Border Radius */
--radius-sm: 0.5rem;
--radius-md: 0.75rem;
--radius-lg: 1rem;
--radius-xl: 1.5rem;

/* Typography */
--font-size-xs: 0.75rem;
--font-size-sm: 0.875rem;
--font-size-base: 1rem;
--font-size-lg: 1.125rem;
--font-size-xl: 1.25rem;
--font-size-2xl: 1.5rem;
--font-size-3xl: 2rem;
```

### Component Styling

**Product List Item:**

```tsx
<div className="flex items-center gap-4 p-4 bg-white border border-[#E5E5EA] rounded-xl hover:bg-[#FAFAFA] transition-colors">
  {/* Checkbox */}
  <input
    type="checkbox"
    className="h-5 w-5 rounded border-[#D2D2D7] text-[#007AFF] focus:ring-[#007AFF]"
  />
  
  {/* Order Badge */}
  {isSelected && (
    <span className="flex items-center justify-center w-8 h-8 bg-[#007AFF] text-white text-sm font-medium rounded-lg">
      {order}
    </span>
  )}
  
  {/* Reorder Buttons */}
  <div className="flex flex-col gap-1">
    <button className="p-1 text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F5] rounded">
      ↑
    </button>
    <button className="p-1 text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F5] rounded">
      ↓
    </button>
  </div>
  
  {/* Product Image */}
  <img
    src={product.image_url}
    alt={product.name}
    className="w-16 h-16 object-cover rounded-lg"
  />
  
  {/* Product Info */}
  <div className="flex-1">
    <h3 className="text-sm font-medium text-[#1D1D1F]">
      {product.name}
    </h3>
    <p className="text-xs text-[#6E6E73]">
      {categoryName} | R$ {product.price.toFixed(2)}
    </p>
  </div>
</div>
```

**Section Tab:**

```tsx
<button
  className={cn(
    "px-6 py-3 rounded-xl font-medium transition-all",
    isActive
      ? "bg-[#007AFF] text-white shadow-sm"
      : "bg-white text-[#6E6E73] border border-[#E5E5EA] hover:bg-[#F5F5F5]"
  )}
>
  <div className="flex flex-col items-center gap-1">
    <span>{label}</span>
    <span className="text-xs opacity-75">
      {selectedCount}/{maxCount}
    </span>
  </div>
</button>
```

### Responsive Behavior

**Desktop (≥1024px):**
- Tabs horizontais
- Lista de produtos em grid 2 colunas
- Controles de reordenação visíveis

**Tablet (768px - 1023px):**
- Tabs horizontais com scroll
- Lista de produtos em coluna única
- Controles de reordenação visíveis

**Mobile (<768px):**
- Tabs em dropdown/select
- Lista de produtos em coluna única
- Controles de reordenação simplificados (apenas ícones)
- Imagens menores

## Implementation Notes

### Dual-Source Pattern Implementation

```typescript
async function getHomepageProducts(section: string): Promise<Product[]> {
  const supabase = await getSupabaseClient()
  
  if (!supabase) {
    return getMockProductsBySection(section)
  }

  try {
    // Try homepage_products table first
    const filter = SECTION_FILTERS[section].filter
    let query = supabase
      .from('homepage_products')
      .select('*')
      .eq('active', true)
      .order('sort_order', { ascending: true })

    // Apply section-specific filters
    if (filter.featured !== undefined) {
      query = query.eq('featured', filter.featured)
    }
    if (filter.show_on_home !== undefined) {
      query = query.eq('show_on_home', filter.show_on_home)
    }
    if (filter.show_on_featured !== undefined) {
      query = query.eq('show_on_featured', filter.show_on_featured)
    }
    if (filter.category_id) {
      query = query.eq('category_id', filter.category_id)
    }

    const { data, error } = await query

    if (!error && data && data.length > 0) {
      return data.map(mapHomepageProduct)
    }
  } catch (error) {
    console.warn('homepage_products unavailable, trying legacy...', error)
  }

  try {
    // Fallback to products table
    const filter = SECTION_FILTERS[section].filter
    let query = supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('sort_order', { ascending: true })

    // Apply filters
    if (filter.featured !== undefined) {
      query = query.eq('featured', filter.featured)
    }
    if (filter.show_on_home !== undefined) {
      query = query.eq('show_on_home', filter.show_on_home)
    }
    if (filter.category_id) {
      query = query.eq('category', filter.category_id)
    }

    const { data, error } = await query

    if (!error && data) {
      return data
    }
  } catch (error) {
    console.error('Legacy products fallback failed:', error)
  }

  // Final fallback to mock data
  return getMockProductsBySection(section)
}
```

### Update Logic

```typescript
async function updateHomepageProducts(
  section: string,
  productIds: string[]
): Promise<void> {
  const supabase = await getSupabaseClient()
  
  if (!supabase) {
    throw new Error('Database not available')
  }

  const filter = SECTION_FILTERS[section].filter

  // First, unmark all products in this section
  const unmarkUpdates: any = {}
  if (filter.featured !== undefined) {
    unmarkUpdates.featured = false
  }
  if (filter.show_on_featured !== undefined) {
    unmarkUpdates.show_on_featured = false
  }
  if (filter.show_on_home !== undefined && filter.category_id) {
    // Only unmark for specific category
    await supabase
      .from('homepage_products')
      .update({ show_on_home: false })
      .eq('category_id', filter.category_id)
  }

  // Then, mark selected products with correct order
  for (let i = 0; i < productIds.length; i++) {
    const productId = productIds[i]
    const updates: any = {
      sort_order: i,
      ...filter // Apply section-specific flags
    }

    await supabase
      .from('homepage_products')
      .update(updates)
      .eq('id', productId)
  }
}
```

### Performance Considerations

1. **Lazy Loading**: Carregar produtos sob demanda ao trocar de aba
2. **Debounce**: Aplicar debounce na busca (300ms)
3. **Optimistic Updates**: Atualizar UI imediatamente, reverter em caso de erro
4. **Caching**: Cachear produtos carregados por 5 minutos
5. **Pagination**: Se mais de 50 produtos, implementar paginação

### Accessibility

- Todos os controles acessíveis via teclado
- Labels descritivos para screen readers
- ARIA attributes apropriados
- Focus indicators visíveis
- Contraste de cores adequado (WCAG AA)
- Mensagens de erro anunciadas para screen readers

## Migration Path

### Phase 1: Core Implementation
1. Criar página `/admin/content/homepage-products`
2. Implementar API route
3. Criar componentes básicos (tabs, product list)
4. Implementar dual-source pattern

### Phase 2: Enhanced Features
5. Adicionar busca e filtros
6. Implementar reordenação
7. Adicionar validações e limites
8. Implementar toast notifications

### Phase 3: Polish
9. Adicionar loading states
10. Implementar error handling completo
11. Adicionar testes
12. Otimizar performance

### Phase 4: Categories & Pricing (Lower Priority)
13. Implementar gerenciamento de categorias
14. Implementar gerenciamento de pricing

## Dependencies

### Existing Dependencies (Already in Project)
- React 19
- Next.js 16
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Lucide React icons
- Supabase client

### New Dependencies (None Required)
Todas as funcionalidades podem ser implementadas com as dependências existentes.

## Security Considerations

1. **Authentication**: Verificar autenticação admin em todas as rotas
2. **Authorization**: Apenas admins podem modificar produtos da homepage
3. **Input Validation**: Validar todos os inputs no servidor
4. **SQL Injection**: Usar prepared statements do Supabase
5. **XSS**: Sanitizar inputs de texto
6. **CSRF**: Usar tokens CSRF em formulários

## Monitoring and Logging

```typescript
// Log important actions
console.log('[Homepage Products] Section loaded:', section)
console.log('[Homepage Products] Products updated:', productIds.length)
console.warn('[Homepage Products] Fallback to mock data')
console.error('[Homepage Products] Update failed:', error)

// Track metrics
// - Time to load products
// - Success rate of updates
// - Fallback usage frequency
```

## Future Enhancements

1. **Drag-and-Drop Reordering**: Implementar com react-beautiful-dnd
2. **Bulk Operations**: Selecionar múltiplos produtos de uma vez
3. **Preview Mode**: Visualizar homepage antes de publicar
4. **Scheduling**: Agendar mudanças para data/hora específica
5. **A/B Testing**: Testar diferentes combinações de produtos
6. **Analytics**: Mostrar métricas de performance de cada produto
7. **Recommendations**: Sugerir produtos baseado em vendas
8. **History**: Histórico de mudanças com rollback

## Conclusion

Este design fornece uma solução completa e escalável para gerenciar as seções de produtos da homepage. A implementação seguirá os padrões estabelecidos no projeto, manterá compatibilidade com o código existente, e funcionará tanto com banco de dados quanto em modo mock data.

A interface será intuitiva, consistente com as telas existentes, e permitirá controle total sobre quais produtos aparecem em cada seção da homepage.
