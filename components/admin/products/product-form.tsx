'use client'

import { v4 as uuidv4 } from 'uuid'

import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'

import { useForm, Controller } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import * as z from 'zod'

import { motion } from 'framer-motion'

import { Button } from '@/components/admin/ui/button'

import { Input } from '@/components/admin/ui/input'

import ImageUploader from '@/components/admin/products/image-uploader'

import { Product, ProductCategory } from '@/lib/types'

import { DEFAULT_PRODUCT_CATEGORIES } from '@/lib/content'
import type { UploadedImageMeta } from '@/lib/uploads'


const productSchema = z.object({

  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),

  slug: z.string().min(3, 'Slug deve ter pelo menos 3 caracteres'),

  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),

  category: z.string().min(1, 'Selecione uma categoria'),

  price: z.number().min(0.01, 'Preço deve ser maior que zero'),

  original_price: z.number().optional(),

  active: z.boolean(),

  featured: z.boolean(),

  show_on_home: z.boolean(),

  show_on_featured: z.boolean(),

  tags: z.string().optional(),

  meta_description: z.string().optional(),

  min_quantity: z.number().min(1).optional(),

  max_quantity: z.number().optional(),

  unit: z.string().optional(),

})



type ProductFormData = z.infer<typeof productSchema>



interface ProductFormProps {

  productId?: string

  initialData?: Product

}



export default function ProductForm({ productId, initialData }: ProductFormProps) {

  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)

  const uploadReferenceId = useMemo(() => initialData?.id ?? uuidv4(), [initialData?.id])
  const [uploadedImages, setUploadedImages] = useState<UploadedImageMeta[]>(() => {
    if (initialData?.images?.length) {
      return initialData.images.map((url, index) => ({
        url,
        storagePath: index === 0 ? initialData.storage_path || '' : '',
      }))
    }

    if (initialData?.image_url) {
      return [{ url: initialData.image_url, storagePath: initialData.storage_path || '' }]
    }

    return []
  })
  const [previewSlug, setPreviewSlug] = useState('')

  const [categories, setCategories] = useState<ProductCategory[]>(DEFAULT_PRODUCT_CATEGORIES)

  const [categoriesLoading, setCategoriesLoading] = useState(true)

  

  const isEditing = !!productId



  const {

    control,

    register,

    handleSubmit,

    watch,

    setValue,

    formState: { errors }

  } = useForm<ProductFormData>({

    resolver: zodResolver(productSchema),

    defaultValues: {

      name: initialData?.name || '',

      slug: initialData?.slug || '',

      description: initialData?.description || '',

      category: initialData?.category || '',

      price: initialData?.price || 0,

      original_price: initialData?.original_price || undefined,

      active: initialData?.active ?? true,

      featured: initialData?.featured ?? false,

      show_on_home: initialData?.show_on_home ?? false,

      show_on_featured: initialData?.show_on_featured ?? false,

      tags: initialData?.tags?.join(', ') || '',

      meta_description: initialData?.meta_description || '',

      min_quantity: initialData?.min_quantity || 1,

      max_quantity: initialData?.max_quantity || undefined,

      unit: initialData?.unit || 'unidade',

    }

  })



  const watchedName = watch('name')

  const watchedPrice = watch('price')

  const watchedOriginalPrice = watch('original_price')

  const watchedCategory = watch('category')



  // Auto-gerar slug a partir do nome

  useEffect(() => {

    if (watchedName && !isEditing) {

      const slug = watchedName

        .toLowerCase()

        .normalize('NFD')

        .replace(/[\u0300-\u036f]/g, '')

        .replace(/[^a-z0-9\s-]/g, '')

        .replace(/\s+/g, '-')

        .replace(/-+/g, '-')

        .trim()

      

      setValue('slug', slug)

      setPreviewSlug(slug)

    }

  }, [watchedName, setValue, isEditing])



  useEffect(() => {

    const loadCategories = async () => {

      try {

        const response = await fetch('/api/admin/categories?active=true')

        if (response.ok) {

          const payload = await response.json()

          if (payload.categories?.length) {

            setCategories(payload.categories)

            return

          }

        }

      } catch (error) {

        console.error('Erro ao carregar categorias:', error)

      } finally {

        setCategoriesLoading(false)

      }

    }



    loadCategories()

  }, [])



  useEffect(() => {

    if (!watchedCategory && categories.length > 0) {

      setValue('category', categories[0].id)

    }

  }, [categories, watchedCategory, setValue])



  const resolvedProductId = productId ?? uploadReferenceId

  const onSubmit = async (data: ProductFormData) => {
    setIsLoading(true)



    try {

      // Processar tags

      const tags = data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : []



      const primaryImage = uploadedImages[0]

      const productData = {
        ...data,

        id: resolvedProductId,
        images: uploadedImages.map((image) => image.url),
        image_url: primaryImage?.url || '',
        thumbnail_url: primaryImage?.url || '',

        storage_path: primaryImage?.storagePath,
        tags,

        specifications: {},

        sort_order: 0,

      }



      const url = isEditing ? `/api/admin/products/${productId}` : '/api/admin/products'

      const method = isEditing ? 'PUT' : 'POST'



      const response = await fetch(url, {

        method,

        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify(productData)

      })



      if (!response.ok) {

        throw new Error('Erro ao salvar produto')

      }



      router.push('/admin/products')

      router.refresh()

    } catch (error) {

      console.error('Erro ao salvar produto:', error)

      alert('Erro ao salvar produto. Tente novamente.')

    } finally {

      setIsLoading(false)

    }

  }



  return (

    <div className="p-6 max-w-4xl mx-auto">

      {/* Header */}

      <div className="flex items-center gap-4 mb-8">

        <button

          onClick={() => router.back()}

          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"

        >

          ←

        </button>

        <div>

          <h1 className="text-3xl font-bold text-gray-900">

            {isEditing ? 'Editar Produto' : 'Novo Produto'}

          </h1>

          <p className="text-gray-600">

            {isEditing ? 'Atualize as informações do produto' : 'Adicione um novo produto ao catálogo'}

          </p>

        </div>

      </div>



      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

        {/* Informações Básicas */}

        <motion.div

          initial={{ opacity: 0, y: 20 }}

          animate={{ opacity: 1, y: 0 }}

          className="bg-white rounded-xl shadow-sm border p-6"

        >

          <h2 className="text-xl font-semibold mb-6">Informações Básicas</h2>

          

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Nome */}

            <div className="lg:col-span-2">

              <label className="block text-sm font-medium text-gray-700 mb-2">

                Nome do Produto *

              </label>

              <Input

                {...register('name')}

                placeholder="Ex: iPhone 15 Pro Max"

                error={errors.name?.message}

              />

            </div>



            {/* Slug */}

            <div className="lg:col-span-2">

              <label className="block text-sm font-medium text-gray-700 mb-2">

                Slug (URL) *

              </label>

              <div className="relative">

                <Input

                  {...register('slug')}

                  placeholder="iphone-15-pro-max"

                  error={errors.slug?.message}

                />

                <div className="mt-1 text-xs text-gray-500">

                  URL: /produtos/{previewSlug || 'slug-do-produto'}

                </div>

              </div>

            </div>



            {/* Categoria */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">

                Categoria *

              </label>

              <select

                {...register('category')}

                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"

                disabled={categoriesLoading}

              >

                {categoriesLoading && <option>Carregando categorias...</option>}

                {!categoriesLoading && categories.length === 0 && (

                  <option value="">Nenhuma categoria cadastrada</option>

                )}

                {!categoriesLoading &&

                  categories.map((category) => (

                    <option key={category.id} value={category.id}>

                      {category.name}

                    </option>

                  ))}

              </select>

              {errors.category && (

                <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>

              )}

              <p className="text-xs text-gray-500 mt-1">

                Configure as categorias em <strong>Admin &gt; Categorias</strong> para manter o site alinhado à homepage oficial.

              </p>

            </div>



            {/* Unidade */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">

                Unidade

              </label>

              <Input

                {...register('unit')}

                placeholder="unidade, par, kit, etc."

              />

            </div>



            {/* Descrição */}

            <div className="lg:col-span-2">

              <label className="block text-sm font-medium text-gray-700 mb-2">

                Descrição *

              </label>

              <textarea

                {...register('description')}

                rows={4}

                placeholder="Descreva o produto, suas características e benefícios..."

                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors resize-none"

              />

              {errors.description && (

                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>

              )}

            </div>

          </div>

        </motion.div>



        {/* Preços e Estoque */}

        <motion.div

          initial={{ opacity: 0, y: 20 }}

          animate={{ opacity: 1, y: 0 }}

          transition={{ delay: 0.1 }}

          className="bg-white rounded-xl shadow-sm border p-6"

        >

          <h2 className="text-xl font-semibold mb-6">Preços e Estoque</h2>

          

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Preço Original */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">

                Preço Original (R$)

              </label>

              <Controller

                name="original_price"

                control={control}

                render={({ field }) => (

                  <Input

                    type="number"

                    step="0.01"

                    placeholder="0.00"

                    value={field.value || ''}

                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}

                  />

                )}

              />

            </div>



            {/* Preço Atual */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">

                Preço Atual (R$) *

              </label>

              <Controller

                name="price"

                control={control}

                render={({ field }) => (

                  <Input

                    type="number"

                    step="0.01"

                    placeholder="0.00"

                    value={field.value}

                    onChange={(e) => field.onChange(parseFloat(e.target.value))}

                    error={errors.price?.message}

                  />

                )}

              />

            </div>



            {/* Quantidade Mínima */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">

                Qtd. Mínima

              </label>

              <Controller

                name="min_quantity"

                control={control}

                render={({ field }) => (

                  <Input

                    type="number"

                    min="1"

                    placeholder="1"

                    value={field.value || ''}

                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}

                  />

                )}

              />

            </div>



            {/* Quantidade Máxima */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">

                Qtd. Máxima

              </label>

              <Controller

                name="max_quantity"

                control={control}

                render={({ field }) => (

                  <Input

                    type="number"

                    min="1"

                    placeholder="Sem limite"

                    value={field.value || ''}

                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}

                  />

                )}

              />

            </div>

          </div>



          {/* Preview de desconto */}

          {watchedOriginalPrice && watchedPrice && watchedOriginalPrice > watchedPrice && (

            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">

              <div className="flex items-center gap-4">

                <span className="text-green-600 font-medium">Desconto:</span>

                <span className="text-lg">

                  {(((watchedOriginalPrice - watchedPrice) / watchedOriginalPrice) * 100).toFixed(0)}% OFF

                </span>

                <span className="text-sm text-gray-600">

                  Economia de R$ {(watchedOriginalPrice - watchedPrice).toLocaleString('pt-BR')}

                </span>

              </div>

            </div>

          )}

        </motion.div>



        {/* Imagens */}

        <motion.div

          initial={{ opacity: 0, y: 20 }}

          animate={{ opacity: 1, y: 0 }}

          transition={{ delay: 0.2 }}

          className="bg-white rounded-xl shadow-sm border p-6"

        >

          <h2 className="text-xl font-semibold mb-6">Imagens do Produto</h2>

          <ImageUploader

            images={uploadedImages}

            onImagesChange={setUploadedImages}

            entityId={resolvedProductId}

            bucket="products"

            entity="products"


            maxImages={5}

          />

        </motion.div>



        {/* SEO e Configurações */}

        <motion.div

          initial={{ opacity: 0, y: 20 }}

          animate={{ opacity: 1, y: 0 }}

          transition={{ delay: 0.3 }}

          className="bg-white rounded-xl shadow-sm border p-6"

        >

          <h2 className="text-xl font-semibold mb-6">SEO e Configurações</h2>

          

          <div className="space-y-6">

            {/* Meta Description */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">

                Meta Descrição (SEO)

              </label>

              <textarea

                {...register('meta_description')}

                rows={3}

                maxLength={160}

                placeholder="Descrição que aparece nos resultados de busca (máx. 160 caracteres)"

                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors resize-none"

              />

              <div className="mt-1 text-xs text-gray-500">

                {watch('meta_description')?.length || 0}/160 caracteres

              </div>

            </div>



            {/* Tags */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">

                Tags (separadas por vírgula)

              </label>

              <Input

                {...register('tags')}

                placeholder="smartphone, apple, 5g, tecnologia"

              />

              <div className="mt-1 text-xs text-gray-500">

                Use tags para facilitar a busca e organização

              </div>

            </div>



            {/* Configurações de Exibição */}

            <div>

              <h3 className="font-medium text-gray-900 mb-4">Exibição</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <label className="flex items-center gap-3">

                  <input

                    type="checkbox"

                    {...register('active')}

                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"

                  />

                  <span className="text-sm text-gray-700">Produto ativo</span>

                </label>



                <label className="flex items-center gap-3">

                  <input

                    type="checkbox"

                    {...register('featured')}

                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"

                  />

                  <span className="text-sm text-gray-700">Produto em destaque</span>

                </label>



                <label className="flex items-center gap-3">

                  <input

                    type="checkbox"

                    {...register('show_on_home')}

                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"

                  />

                  <span className="text-sm text-gray-700">Exibir na página inicial</span>

                </label>



                <label className="flex items-center gap-3">

                  <input

                    type="checkbox"

                    {...register('show_on_featured')}

                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"

                  />

                  <span className="text-sm text-gray-700">Exibir em produtos em destaque</span>

                </label>

              </div>

            </div>

          </div>

        </motion.div>



        {/* Botões de Ação */}

        <motion.div

          initial={{ opacity: 0, y: 20 }}

          animate={{ opacity: 1, y: 0 }}

          transition={{ delay: 0.4 }}

          className="flex flex-col sm:flex-row gap-4 pt-6"

        >

          <Button

            type="button"

            onClick={() => router.back()}

            className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 py-3 rounded-xl font-medium transition-colors"

          >

            Cancelar

          </Button>

          

          <Button

            type="submit"

            disabled={isLoading}

            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-50"

          >

            {isLoading ? 'Salvando...' : (isEditing ? 'Atualizar Produto' : 'Criar Produto')}

          </Button>

        </motion.div>

      </form>

    </div>

  )

}

