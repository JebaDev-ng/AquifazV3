# 📋 PLANO COMPLETO - PAINEL ADMINISTRATIVO
## AquiFaz - Gráfica Digital

---

## 🔍 ANÁLISE DA APLICAÇÃO ATUAL

### Estrutura Técnica Identificada:
- **Framework**: Next.js 16.0.1 com React 19.2.0
- **Database**: Supabase (já configurado)
- **Styling**: Tailwind CSS v4 com design system customizado
- **Animations**: Framer Motion 12.23.24
- **Authentication**: Supabase Auth (configurado)
- **Estado dos dados**: Usando mocks com fallback para Supabase

### Dados Atuais Identificados:
- **15 produtos** categorizados em:
  - Cartões de Visita (4 produtos)
  - Banners/Fachadas (5 produtos) 
  - Adesivos (4 produtos)
  - Impressão/Print (2 produtos)
- **Schema de produto básico** já implementado
- **Imagens placeholder** (sem imagens reais)
- **WhatsApp integration** funcional

---

## 🎯 OBJETIVOS DO PAINEL ADMIN

### Primário:
1. **Substituir mocks por dados reais**
2. **Gerenciar produtos com imagens reais**
3. **Controlar exibição nas seções da homepage**
4. **Upload e gestão de mídias**

### Secundário:
5. **Sistema de promoções**
6. **Analytics básicos**
7. **Gerenciamento de conteúdo (hero, banners)**
8. **Logs de atividade**

---

## 🗂️ MAPEAMENTO DETALHADO DOS DADOS

### 1. PRODUTOS EXISTENTES

#### Estrutura Atual:
```typescript
interface Product {
  id: string
  name: string
  slug: string
  description: string
  category: string
  price: number
  image_url: string
  created_at: string
}
```

#### Estrutura Expandida Necessária:
```typescript
interface ProductAdmin {
  // Campos existentes
  id: string
  name: string
  slug: string
  description: string
  category: string
  price: number
  image_url: string
  created_at: string
  
  // Novos campos para admin
  active: boolean
  featured: boolean
  show_on_home: boolean
  show_on_featured: boolean
  show_on_category: boolean
  
  // Campos de mídia
  images: string[]
  thumbnail_url?: string
  
  // Campos comerciais
  discount_price?: number
  discount_start?: string
  discount_end?: string
  
  // Campos técnicos
  specifications?: object
  min_quantity: number
  max_quantity?: number
  unit: string
  
  // SEO e organização
  tags: string[]
  meta_description?: string
  sort_order: number
  
  // Auditoria
  updated_at: string
  updated_by?: string
}
```

### 2. CATEGORIAS EXISTENTES

#### Categorias Mapeadas:
```typescript
const CATEGORIES = {
  'cartoes': {
    name: 'Cartões de Visita',
    description: 'Cartões profissionais',
    icon: '💳',
    products: 4
  },
  'banners': {
    name: 'Banners e Fachadas',
    description: 'Sinalização visual',
    icon: '🏪',
    products: 5
  },
  'adesivos': {
    name: 'Adesivos',
    description: 'Adesivos personalizados',
    icon: '🏷️',
    products: 4
  },
  'print': {
    name: 'Impressões',
    description: 'Serviços de impressão',
    icon: '🖨️',
    products: 2
  },
  'flyers': {
    name: 'Flyers',
    description: 'Material publicitário',
    icon: '📄',
    products: 0 // Categoria existe mas sem produtos dedicados
  }
}
```

### 3. CONTEÚDO EDITÁVEL POR SEÇÃO

#### 3.1 Hero Section (`components/ui/hero/hero-section.tsx`)
**Campos Editáveis:**
- Subtitle: "A sua gráfica em Araguaína"
- Title: "Aquifaz trabalha com diversos serviços"
- Description: "Tanto na área gráfica quanto na digital..."
- CTA Button: Link do WhatsApp + Mensagem
- **Imagem Promocional**: Banner lateral (1200x900px)

```typescript
interface HeroContent {
  id: 'hero_main'
  subtitle: string
  title: string
  description: string
  whatsapp_number: string
  whatsapp_message: string
  promo_image_url?: string
  promo_title?: string
  promo_subtitle?: string
  active: boolean
}
```

#### 3.2 Categories Section (`components/ui/categories-section.tsx`)
**Conteúdo:** Gerado automaticamente das categorias de produtos

#### 3.3 Featured Products Section (`components/ui/featured-products-section.tsx`)
**Conteúdo:** Produtos marcados como `featured: true`

#### 3.4 Products Grid Section (`components/ui/products-grid-section.tsx`)
**Conteúdo:** Lista principal de produtos com filtros

#### 3.5 Image Banner Section (`components/ui/image-banner-section.tsx`)
**Campos Editáveis:**
```typescript
interface BannerContent {
  id: string
  title: string
  description: string
  image_url: string
  cta_text: string
  cta_link: string
  active: boolean
  position: number
}
```

#### 3.6 Pricing Section (`components/ui/pricing/pricing-section.tsx`)
**Campos Editáveis:**
```typescript
interface PricingPlan {
  id: string
  name: string
  description: string
  price: number
  features: string[]
  whatsapp_message: string
  highlighted: boolean
  active: boolean
}
```

---

## 🏗️ ARQUITETURA DO PAINEL ADMIN

### Estrutura de Pastas Proposta:
```
app/
├── admin/
│   ├── layout.tsx          # Layout com sidebar + auth
│   ├── page.tsx            # Dashboard principal
│   ├── products/
│   │   ├── page.tsx        # Lista de produtos
│   │   ├── new/
│   │   │   └── page.tsx    # Criar produto
│   │   └── [id]/
│   │       ├── page.tsx    # Ver produto
│   │       └── edit/
│   │           └── page.tsx # Editar produto
│   ├── content/
│   │   ├── page.tsx        # Gerenciar conteúdo
│   │   ├── hero/
│   │   ├── banners/
│   │   └── pricing/
│   ├── media/
│   │   └── page.tsx        # Upload/gestão de imagens
│   ├── analytics/
│   │   └── page.tsx        # Analytics básicos
│   └── settings/
│       └── page.tsx        # Configurações gerais

components/
├── admin/
│   ├── layout/
│   │   ├── admin-sidebar.tsx
│   │   ├── admin-header.tsx
│   │   └── admin-breadcrumb.tsx
│   ├── products/
│   │   ├── product-form.tsx
│   │   ├── product-list.tsx
│   │   ├── product-image-upload.tsx
│   │   └── product-preview.tsx
│   ├── content/
│   │   ├── hero-editor.tsx
│   │   ├── banner-editor.tsx
│   │   └── pricing-editor.tsx
│   ├── media/
│   │   ├── media-library.tsx
│   │   ├── image-upload.tsx
│   │   └── image-editor.tsx
│   └── ui/
│       ├── admin-button.tsx
│       ├── admin-input.tsx
│       ├── admin-modal.tsx
│       └── admin-table.tsx

lib/
├── admin/
│   ├── auth.ts             # Verificação de admin
│   ├── api.ts              # Funções de API
│   ├── upload.ts           # Upload de imagens
│   └── validation.ts       # Schemas de validação
```

---

## 🛠️ IMPLEMENTAÇÃO FASE POR FASE

### 🚀 FASE 1: FUNDAÇÃO (Semana 1-2)

#### 1.1 Preparação do Banco de Dados
**Arquivo:** `supabase/migrations/001_admin_setup.sql`
```sql
-- Expandir tabela products
ALTER TABLE products ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;
ALTER TABLE products ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS show_on_home BOOLEAN DEFAULT true;
ALTER TABLE products ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';
ALTER TABLE products ADD COLUMN IF NOT EXISTS discount_price DECIMAL(10,2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE products ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Criar tabela de conteúdo
CREATE TABLE content_sections (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT,
  subtitle TEXT,
  description TEXT,
  image_url TEXT,
  cta_text TEXT,
  cta_link TEXT,
  data JSONB,
  active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de mídia
CREATE TABLE media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  url TEXT NOT NULL,
  size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir conteúdo padrão do hero
INSERT INTO content_sections (id, type, title, subtitle, description, data) VALUES
('hero_main', 'hero', 'Aquifaz trabalha com diversos serviços', 'A sua gráfica em Araguaína', 'Tanto na área gráfica quanto na digital. Veja o que podemos fazer por você hoje!', '{"whatsapp_number": "5563992731977", "whatsapp_message": "Olá! Vim pelo site e gostaria de conhecer os serviços da AquiFaz."}');
```

#### 1.2 Autenticação Admin
**Arquivo:** `lib/admin/auth.ts`
```typescript
import { createClient } from '@/lib/supabase/server'

export async function isAdmin() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return false
  
  // Verificar se o usuário tem role de admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
    
  return profile?.role === 'admin'
}

export async function requireAdmin() {
  const admin = await isAdmin()
  if (!admin) {
    throw new Error('Acesso negado: Permissões de administrador necessárias')
  }
  return true
}
```

#### 1.3 Layout Base do Admin
**Arquivo:** `app/admin/layout.tsx`
```tsx
import { requireAdmin } from '@/lib/admin/auth'
import { AdminSidebar } from '@/components/admin/layout/admin-sidebar'
import { AdminHeader } from '@/components/admin/layout/admin-header'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAdmin()
  
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
```

### 📦 FASE 2: GESTÃO DE PRODUTOS (Semana 2-3)

#### 2.1 API de Produtos
**Arquivo:** `app/api/admin/products/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/admin/auth'

export async function GET() {
  await requireAdmin()
  
  const supabase = await createClient()
  
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('sort_order', { ascending: true })
    
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json(products)
}

export async function POST(request: NextRequest) {
  await requireAdmin()
  
  const body = await request.json()
  const supabase = await createClient()
  
  // Gerar slug automaticamente
  const slug = body.name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
  
  const { data, error } = await supabase
    .from('products')
    .insert({ ...body, slug })
    .select()
    .single()
    
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json(data)
}
```

#### 2.2 Formulário de Produtos
**Arquivo:** `components/admin/products/product-form.tsx`
```tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ImageUpload } from '@/components/admin/media/image-upload'
import type { Product } from '@/lib/types'

interface ProductFormProps {
  product?: Product
  onSave: (product: Partial<Product>) => Promise<void>
  onCancel: () => void
}

export function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    category: product?.category || 'cartoes',
    price: product?.price || 0,
    active: product?.active ?? true,
    featured: product?.featured || false,
    show_on_home: product?.show_on_home ?? true,
    image_url: product?.image_url || '',
    images: product?.images || [],
    tags: product?.tags || [],
    ...product
  })
  
  const [isLoading, setIsLoading] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      await onSave(formData)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <motion.form 
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Nome do Produto */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nome do Produto *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      {/* Descrição */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descrição *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          rows={3}
          required
        />
      </div>
      
      {/* Categoria e Preço */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoria *
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="cartoes">Cartões de Visita</option>
            <option value="banners">Banners e Fachadas</option>
            <option value="adesivos">Adesivos</option>
            <option value="print">Impressões</option>
            <option value="flyers">Flyers</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preço (R$) *
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>
      
      {/* Upload de Imagens */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Imagens do Produto
        </label>
        <ImageUpload
          images={formData.images}
          onChange={(images) => setFormData(prev => ({ ...prev, images }))}
          maxImages={5}
        />
      </div>
      
      {/* Configurações de Exibição */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Configurações de Exibição</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Produto Ativo</span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Produto em Destaque</span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.show_on_home}
              onChange={(e) => setFormData(prev => ({ ...prev, show_on_home: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Mostrar na Home</span>
          </label>
        </div>
      </div>
      
      {/* Botões */}
      <div className="flex space-x-4 pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Salvando...' : product ? 'Atualizar' : 'Criar'} Produto
        </button>
        
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Cancelar
        </button>
      </div>
    </motion.form>
  )
}
```

### 🎨 FASE 3: GESTÃO DE MÍDIA (Semana 3-4)

#### 3.1 Upload de Imagens
**Arquivo:** `components/admin/media/image-upload.tsx`
```tsx
'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Upload, X, Eye } from 'lucide-react'

interface ImageUploadProps {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
  maxSize?: number // MB
}

export function ImageUpload({ 
  images, 
  onChange, 
  maxImages = 5,
  maxSize = 5 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  
  const uploadImage = useCallback(async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch('/api/admin/upload', {
      method: 'POST',
      body: formData,
    })
    
    if (!response.ok) {
      throw new Error('Erro no upload')
    }
    
    const data = await response.json()
    return data.url
  }, [])
  
  const handleFileSelect = async (files: FileList) => {
    if (uploading) return
    
    const newFiles = Array.from(files).slice(0, maxImages - images.length)
    
    setUploading(true)
    try {
      const uploadPromises = newFiles.map(async (file) => {
        // Validar tamanho
        if (file.size > maxSize * 1024 * 1024) {
          throw new Error(`Arquivo ${file.name} muito grande (máximo ${maxSize}MB)`)
        }
        
        // Validar tipo
        if (!file.type.startsWith('image/')) {
          throw new Error(`Arquivo ${file.name} não é uma imagem`)
        }
        
        return uploadImage(file)
      })
      
      const newUrls = await Promise.all(uploadPromises)
      onChange([...images, ...newUrls])
    } catch (error) {
      console.error('Erro no upload:', error)
      alert(error instanceof Error ? error.message : 'Erro no upload')
    } finally {
      setUploading(false)
    }
  }
  
  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onChange(newImages)
  }
  
  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {images.length < maxImages && (
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
          onClick={() => document.getElementById('image-upload')?.click()}
        >
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">
            {uploading ? 'Enviando...' : 'Clique para adicionar imagens'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Máximo {maxImages} imagens, até {maxSize}MB cada
          </p>
          <input
            id="image-upload"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
            disabled={uploading}
          />
        </motion.div>
      )}
      
      {/* Images Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <AnimatePresence>
            {images.map((url, index) => (
              <motion.div
                key={url}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group"
              >
                <Image
                  src={url}
                  alt={`Upload ${index + 1}`}
                  fill
                  className="object-cover"
                />
                
                {/* Overlay com controles */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center space-x-2">
                  <button
                    onClick={() => setPreviewImage(url)}
                    className="p-2 bg-blue-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => removeImage(index)}
                    className="p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Badge da imagem principal */}
                {index === 0 && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-blue-600 text-white text-xs rounded">
                    Principal
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      
      {/* Preview Modal */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
            onClick={() => setPreviewImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={previewImage}
                alt="Preview"
                width={800}
                height={600}
                className="object-contain max-w-full max-h-full"
              />
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
```

### 🎯 FASE 4: GESTÃO DE CONTEÚDO (Semana 4-5)

#### 4.1 Editor do Hero Section
**Arquivo:** `components/admin/content/hero-editor.tsx`
```tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ImageUpload } from '@/components/admin/media/image-upload'
import { Eye } from 'lucide-react'

interface HeroContent {
  subtitle: string
  title: string
  description: string
  whatsapp_number: string
  whatsapp_message: string
  promo_image_url?: string
  promo_title?: string
  promo_subtitle?: string
}

export function HeroEditor() {
  const [content, setContent] = useState<HeroContent>({
    subtitle: '',
    title: '',
    description: '',
    whatsapp_number: '',
    whatsapp_message: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  
  useEffect(() => {
    loadContent()
  }, [])
  
  const loadContent = async () => {
    try {
      const response = await fetch('/api/admin/content/hero')
      if (response.ok) {
        const data = await response.json()
        setContent(data)
      }
    } catch (error) {
      console.error('Erro ao carregar conteúdo:', error)
    }
  }
  
  const saveContent = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/content/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      })
      
      if (response.ok) {
        alert('Conteúdo salvo com sucesso!')
      } else {
        throw new Error('Erro ao salvar')
      }
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('Erro ao salvar conteúdo')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Editor - Hero Section</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <Eye className="w-4 h-4 mr-2" />
            {showPreview ? 'Ocultar' : 'Mostrar'} Preview
          </button>
          
          <button
            onClick={saveContent}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Editor */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Textos Principais */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Textos Principais</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtítulo
                </label>
                <input
                  type="text"
                  value={content.subtitle}
                  onChange={(e) => setContent(prev => ({ ...prev, subtitle: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="A sua gráfica em Araguaína"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título Principal
                </label>
                <textarea
                  value={content.title}
                  onChange={(e) => setContent(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="Aquifaz trabalha com diversos serviços"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={content.description}
                  onChange={(e) => setContent(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Tanto na área gráfica quanto na digital..."
                />
              </div>
            </div>
          </div>
          
          {/* WhatsApp */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Configuração WhatsApp</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número do WhatsApp
                </label>
                <input
                  type="text"
                  value={content.whatsapp_number}
                  onChange={(e) => setContent(prev => ({ ...prev, whatsapp_number: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="5563992731977"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensagem Padrão
                </label>
                <textarea
                  value={content.whatsapp_message}
                  onChange={(e) => setContent(prev => ({ ...prev, whatsapp_message: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Olá! Vim pelo site e gostaria de conhecer os serviços da AquiFaz."
                />
              </div>
            </div>
          </div>
          
          {/* Banner Promocional */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Banner Promocional (Opcional)</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagem da Promoção
                </label>
                <ImageUpload
                  images={content.promo_image_url ? [content.promo_image_url] : []}
                  onChange={(images) => setContent(prev => ({ 
                    ...prev, 
                    promo_image_url: images[0] || '' 
                  }))}
                  maxImages={1}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Resolução recomendada: 1200x900px
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título da Promoção
                </label>
                <input
                  type="text"
                  value={content.promo_title || ''}
                  onChange={(e) => setContent(prev => ({ ...prev, promo_title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Promoção Especial"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtítulo da Promoção
                </label>
                <input
                  type="text"
                  value={content.promo_subtitle || ''}
                  onChange={(e) => setContent(prev => ({ ...prev, promo_subtitle: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Clique para saber mais"
                />
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Preview */}
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-50 p-6 rounded-lg border border-gray-200"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
            
            <div className="bg-white rounded-lg p-6 space-y-4">
              <p className="text-sm text-gray-500 uppercase tracking-wider">
                {content.subtitle || 'A sua gráfica em Araguaína'}
              </p>
              
              <h1 className="text-3xl font-semibold text-gray-900 leading-tight">
                {content.title || 'Aquifaz trabalha com diversos serviços'}
              </h1>
              
              <p className="text-gray-600">
                {content.description || 'Tanto na área gráfica quanto na digital. Veja o que podemos fazer por você hoje!'}
              </p>
              
              <div className="flex items-center space-x-2 text-sm text-green-600">
                <span>📱</span>
                <span>{content.whatsapp_number || '(63) 99273-1977'}</span>
              </div>
              
              {content.promo_image_url && (
                <div className="mt-6 p-4 bg-pink-100 rounded-lg">
                  <div className="text-center">
                    <h4 className="font-medium text-pink-800">
                      {content.promo_title || 'Promoção Especial'}
                    </h4>
                    <p className="text-sm text-pink-600">
                      {content.promo_subtitle || 'Clique para saber mais'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
```

### 📊 FASE 5: DASHBOARD E ANALYTICS (Semana 5-6)

#### 5.1 Dashboard Principal
**Arquivo:** `app/admin/page.tsx`
```tsx
import { requireAdmin } from '@/lib/admin/auth'
import { DashboardStats } from '@/components/admin/dashboard/dashboard-stats'
import { RecentActivity } from '@/components/admin/dashboard/recent-activity'
import { QuickActions } from '@/components/admin/dashboard/quick-actions'

export default async function AdminDashboard() {
  await requireAdmin()
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Painel Administrativo
        </h1>
        <p className="text-gray-600">
          Bem-vindo de volta! Aqui está um resumo do seu catálogo.
        </p>
      </div>
      
      {/* Stats */}
      <DashboardStats />
      
      {/* Grid de 2 colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <QuickActions />
        <RecentActivity />
      </div>
    </div>
  )
}
```

---

## 🎯 FUNCIONALIDADES DETALHADAS

### 1. GESTÃO DE PRODUTOS
- ✅ **CRUD completo** (Criar, Ler, Atualizar, Deletar)
- ✅ **Upload múltiplo** de imagens com preview
- ✅ **Sistema de tags** para melhor organização
- ✅ **Controle de exibição** (ativo, destaque, home)
- ✅ **Sistema de promoções** com data de início/fim
- ✅ **Preview em tempo real** do produto no frontend
- ✅ **Bulk operations** (ações em massa)

### 2. GESTÃO DE CONTEÚDO
- ✅ **Editor do Hero Section** (títulos, imagens promocionais)
- ✅ **Gestão de banners** com posicionamento
- ✅ **Editor de preços** dos planos de serviço
- ✅ **Configuração do WhatsApp** (número e mensagens)
- ✅ **SEO básico** (meta descriptions)

### 3. GESTÃO DE MÍDIA
- ✅ **Upload com drag & drop**
- ✅ **Redimensionamento automático**
- ✅ **Otimização de imagens** (WebP, compressão)
- ✅ **Biblioteca de mídia** organizada
- ✅ **Backup automático** para Supabase Storage

### 4. DASHBOARD E RELATÓRIOS
- ✅ **Estatísticas básicas** (produtos, categorias, cliques)
- ✅ **Gráficos de performance**
- ✅ **Log de atividades** recentes
- ✅ **Ações rápidas** (criar produto, upload)
- ✅ **Backup do banco de dados**

---

## 🔧 TECNOLOGIAS E DEPENDÊNCIAS

### Dependências Necessárias (a adicionar):
```json
{
  "dependencies": {
    "@supabase/storage-js": "^2.5.5",
    "@hookform/resolvers": "^3.3.4",
    "react-hook-form": "^7.48.2",
    "zod": "^3.22.4",
    "sharp": "^0.33.1",
    "react-dropzone": "^14.2.3",
    "recharts": "^2.10.3",
    "date-fns": "^2.30.0"
  }
}
```

### Estrutura de Storage (Supabase):
```
storage/
├── products/
│   ├── thumbnails/
│   └── gallery/
├── content/
│   ├── hero/
│   ├── banners/
│   └── promo/
└── temp/
```

---

## 📈 CRONOGRAMA DE IMPLEMENTAÇÃO

### **Semana 1-2: Fundação** 
- [x] Análise completa da aplicação
- [ ] Setup do banco de dados expandido
- [ ] Autenticação e middleware admin
- [ ] Layout base do painel

### **Semana 2-3: Produtos**
- [ ] CRUD de produtos completo
- [ ] Upload de imagens
- [ ] Sistema de categorias
- [ ] Preview em tempo real

### **Semana 3-4: Mídia**
- [ ] Sistema de upload avançado
- [ ] Biblioteca de mídia
- [ ] Otimização de imagens
- [ ] Integration com Supabase Storage

### **Semana 4-5: Conteúdo**
- [ ] Editor de conteúdo hero
- [ ] Gestão de banners
- [ ] Configurações gerais
- [ ] Preview das alterações

### **Semana 5-6: Dashboard**
- [ ] Analytics básicos
- [ ] Dashboard principal
- [ ] Logs de atividade
- [ ] Exportação de dados

### **Semana 6+: Refinamentos**
- [ ] Testes finais
- [ ] Otimizações de performance
- [ ] Documentação
- [ ] Treinamento do usuário

---

## 🎨 PRESERVAÇÃO DA IDENTIDADE VISUAL

### Cores do Sistema (preservadas):
```css
/* Cores principais já definidas */
--color-bg-primary: #FFFFFF
--color-text-primary: #1D1D1F
--color-text-secondary: #6E6E73
--color-accent-blue: #007AFF

/* Admin adiciona: */
--color-admin-primary: #3B82F6    /* Azul admin */
--color-admin-success: #10B981    /* Verde sucesso */
--color-admin-warning: #F59E0B    /* Amarelo aviso */
--color-admin-error: #EF4444      /* Vermelho erro */
```

### Componentes Reutilizáveis:
- **Typography**: Mantém hierarquia existente
- **Spacing**: Usa sistema já definido 
- **Animations**: Framer Motion com variants existentes
- **Icons**: Lucide React (já usado)
- **Buttons**: Extensões dos botões atuais

---

## 🔒 SEGURANÇA E PERMISSÕES

### Níveis de Acesso:
```typescript
enum UserRole {
  ADMIN = 'admin',       // Acesso total
  EDITOR = 'editor',     // Apenas edição de produtos/conteúdo
  VIEWER = 'viewer'      // Apenas visualização
}
```

### Middleware de Proteção:
- **Route Protection**: Todas as rotas `/admin/*`
- **API Protection**: Endpoints `/api/admin/*`
- **File Upload**: Validação de tipos e tamanhos
- **CSRF Protection**: Tokens para formulários

### Backup e Recovery:
- **Backup automático**: Diário via Supabase
- **Version control**: Histórico de alterações
- **Recovery point**: Rollback para estados anteriores

---

## ✅ PRÓXIMOS PASSOS IMEDIATOS

### Para iniciar a implementação:

1. **Confirmar aprovação** do plano detalhado
2. **Preparar ambiente** de desenvolvimento
3. **Configurar Supabase** com novos schemas
4. **Criar branch** específico para o admin
5. **Implementar autenticação** admin

### Decisões Pendentes:
- [ ] **Usuário admin inicial**: Como criar o primeiro admin?
- [ ] **Domínio do admin**: `/admin` ou subdomínio?
- [ ] **Modo de upload**: Local + Supabase ou só Supabase?
- [ ] **Analytics**: Integração com Google Analytics?

---

**Este plano detalha completamente a implementação do painel administrativo mantendo 100% da identidade visual existente e expandindo as funcionalidades sem quebrar o que já está funcionando.**

**Próximo passo: Aprovação para iniciar a Fase 1 - Fundação** 🚀