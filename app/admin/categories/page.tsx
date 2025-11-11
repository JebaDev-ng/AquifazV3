'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { RefreshCcw, Save, Plus, X, Trash, Package } from 'lucide-react'

import { Button } from '@/components/admin/ui/button'
import { Input } from '@/components/admin/ui/input'
import SingleImageUpload from '@/components/admin/ui/single-image-upload'
import CategoryProductsModal from '@/components/admin/categories/category-products-modal'
import { DEFAULT_PRODUCT_CATEGORIES } from '@/lib/content'
import type { ProductCategory } from '@/lib/types'
import type { UploadedImageMeta } from '@/lib/uploads'

type CategoryFormState = {
  id: string
  name: string
  description: string
  icon: string
  image_url: string
  storage_path: string
  sort_order: string
  active: boolean
}

const initialFormState = (): CategoryFormState => ({
  id: '',
  name: '',
  description: '',
  icon: '',
  image_url: '',
  storage_path: '',
  sort_order: '1',
  active: true,
})

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [form, setForm] = useState<CategoryFormState>(initialFormState())
  const [categoryImage, setCategoryImage] = useState<UploadedImageMeta | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [selectedCategoryForProducts, setSelectedCategoryForProducts] = useState<ProductCategory | null>(null)

  const missingBaseCategories = useMemo(
    () =>
      DEFAULT_PRODUCT_CATEGORIES.filter(
        (base) => !categories.some((category) => category.id === base.id)
      ),
    [categories]
  )

  const extraCategories = useMemo(
    () =>
      categories.filter(
        (category) => !DEFAULT_PRODUCT_CATEGORIES.some((base) => base.id === category.id)
      ),
    [categories]
  )

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/categories?with_defaults=true')
      if (response.ok) {
        const payload = await response.json()
        setCategories(payload.categories || [])
      } else {
        throw new Error('Erro ao buscar categorias')
      }
    } catch (error) {
      console.error(error)
      setErrorMessage('Nao foi possivel carregar as categorias.')
    } finally {
      setLoading(false)
    }
  }

  const handleFormChange = (field: keyof CategoryFormState, value: string | boolean) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleCategoryImageChange = (image: UploadedImageMeta | null) => {
    setCategoryImage(image)
    handleFormChange('image_url', image?.url || '')
    handleFormChange('storage_path', image?.storagePath || '')
  }

  const resetForm = () => {
    setForm(initialFormState())
    setEditingId(null)
    setCategoryImage(null)
  }

  const handleEdit = (category: ProductCategory) => {
    setEditingId(category.id)
    setForm({
      id: category.id,
      name: category.name,
      description: category.description || '',
      icon: category.icon || '',
      image_url: category.image_url || '',
      storage_path: category.storage_path || '',
      sort_order: String(category.sort_order ?? 1),
      active: category.active ?? true,
    })

    setCategoryImage(
      category.image_url
        ? { url: category.image_url, storagePath: category.storage_path || '' }
        : null
    )
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setErrorMessage(null)

    try {
      const payload = {
        id: form.id || undefined,
        name: form.name,
        description: form.description || undefined,
        icon: form.icon || undefined,
        image_url: categoryImage?.url || form.image_url || undefined,
        storage_path: categoryImage?.storagePath || form.storage_path || undefined,
        sort_order: Number(form.sort_order) || 0,
        active: form.active,
      }

      const endpoint = editingId
        ? `/api/admin/categories/${editingId}`
        : '/api/admin/categories'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Erro ao salvar categoria')
      }

      const data = await response.json()
      
      resetForm()
      await loadCategories()

      // Feedback de sucesso
      if (editingId) {
        alert(`✓ Categoria "${data.category?.name || form.name}" atualizada com sucesso.`)
      } else {
        alert(`✓ Categoria "${data.category?.name || form.name}" criada com sucesso.`)
      }
    } catch (error) {
      console.error(error)
      setErrorMessage(
        error instanceof Error ? error.message : 'Erro inesperado ao salvar categoria.'
      )
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async (category: ProductCategory) => {
    try {
      const response = await fetch(`/api/admin/categories/${category.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !category.active }),
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar categoria')
      }

      await loadCategories()
    } catch (error) {
      console.error(error)
      alert('Nao foi possivel atualizar a categoria.')
    }
  }

  const handleDelete = async (category: ProductCategory) => {
    if (!confirm(`Remover a categoria "${category.name}"?`)) {
      return
    }

    // Optimistic update: remove imediatamente da lista
    const previousCategories = [...categories]
    setCategories((prev) => prev.filter((cat) => cat.id !== category.id))

    try {
      const response = await fetch(`/api/admin/categories/${category.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Erro ao remover categoria')
      }

      // Recarregar para garantir consistência
      await loadCategories()
    } catch (error) {
      console.error(error)
      // Rollback: restaura lista anterior
      setCategories(previousCategories)
      alert(
        error instanceof Error ? error.message : 'Nao foi possivel remover a categoria.'
      )
    }
  }

  const handleSyncDefaults = async () => {
    setSyncing(true)
    setErrorMessage(null)
    try {
      const response = await fetch('/api/admin/categories/sync', { method: 'POST' })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao sincronizar categorias base')
      }

      // Exibir feedback sobre o que foi feito
      if (data.created && data.created.length > 0) {
        alert(`✓ ${data.created.length} categoria(s) criada(s): ${data.created.join(', ')}`)
      } else {
        alert('✓ Todas as categorias base já existem. Nenhuma alteração necessária.')
      }

      await loadCategories()
    } catch (error) {
      console.error(error)
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Nao foi possivel sincronizar as categorias base.'
      )
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-sm text-[#6E6E73]">Administracao &gt; Conteudo base</p>
          <h1 className="text-3xl font-normal text-[#1D1D1F]">Categorias da homepage</h1>
          <p className="text-[#6E6E73] mt-2 max-w-2xl">
            Sincronize as categorias exibidas no site com o padrao da versao estavel. Esta tela
            controla apenas o ambiente local e dinamico.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={handleSyncDefaults}
            loading={syncing}
            icon={<RefreshCcw className="w-4 h-4" />}
          >
            Sincronizar com base
          </Button>
          <Button onClick={loadCategories} variant="ghost" icon={<RefreshCcw className="w-4 h-4" />}>
            Atualizar
          </Button>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {errorMessage}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-white border border-[#E5E5EA] rounded-xl p-4">
          <p className="text-sm text-[#6E6E73]">Categorias base</p>
          <p className="text-3xl font-normal text-[#1D1D1F]">{DEFAULT_PRODUCT_CATEGORIES.length}</p>
        </div>
        <div className="bg-white border border-[#E5E5EA] rounded-xl p-4">
          <p className="text-sm text-[#6E6E73]">No painel</p>
          <p className="text-3xl font-normal text-[#1D1D1F]">
            {categories.length}
            {loading && <span className="text-sm text-[#6E6E73] ml-1">Carregando...</span>}
          </p>
        </div>
        <div className="bg-white border border-[#E5E5EA] rounded-xl p-4">
          <p className="text-sm text-[#6E6E73]">Pendentes</p>
          <p className="text-3xl font-normal text-[#1D1D1F]">{missingBaseCategories.length}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-[#E5E5EA] rounded-2xl p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6E6E73]">
                {editingId ? 'Editar categoria' : 'Adicionar nova categoria'}
              </p>
              <h2 className="text-xl font-normal text-[#1D1D1F]">
                {editingId ? `Atualizando ${form.name}` : 'Nova categoria'}
              </h2>
            </div>
            {editingId && (
              <Button type="button" variant="ghost" icon={<X className="w-4 h-4" />} onClick={resetForm}>
                Cancelar
              </Button>
            )}
          </div>

          <Input
            label="Nome"
            value={form.name}
            onChange={(event) => handleFormChange('name', event.target.value)}
            required
          />
          <Input
            label="Slug/ID"
            value={form.id}
            onChange={(event) => handleFormChange('id', event.target.value)}
            helper="Use apenas letras minusculas, numeros e hifens."
            required={!editingId}
            readOnly={!!editingId}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Icone (opcional)"
              value={form.icon}
              onChange={(event) => handleFormChange('icon', event.target.value)}
            />
            <Input
              label="Ordem"
              type="number"
              value={form.sort_order}
              onChange={(event) => handleFormChange('sort_order', event.target.value)}
            />
          </div>

          <SingleImageUpload
            label="Imagem da categoria"
            value={categoryImage}
            onChange={handleCategoryImageChange}
            bucket="categories"
            entity="categories"
            entityId={form.id}
            helperText="Após definir o ID da categoria, envie uma imagem quadrada (mín. 600px)."
          />

          <div className="space-y-2">
            <label className="text-sm text-[#1D1D1F]">Descricao</label>
            <textarea
              value={form.description}
              onChange={(event) => handleFormChange('description', event.target.value)}
              className="w-full rounded-xl border border-[#D2D2D7] px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF]"
              rows={3}
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-[#1D1D1F]">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(event) => handleFormChange('active', event.target.checked)}
              className="rounded border-[#D2D2D7] text-[#007AFF] focus:ring-[#007AFF]"
            />
            Categoria ativa
          </label>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              loading={saving}
              icon={editingId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              className="flex-1"
            >
              {editingId ? 'Atualizar categoria' : 'Criar categoria'}
            </Button>
          </div>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-[#E5E5EA] rounded-2xl p-6 space-y-4"
        >
          <h3 className="text-lg font-normal text-[#1D1D1F]">Mapa de referencia</h3>
          <p className="text-sm text-[#6E6E73] mb-4">
            Estas sao as categorias oficiais da homepage base. Use-as como referencia para manter a estrutura.
          </p>
          <ul className="space-y-3">
            {DEFAULT_PRODUCT_CATEGORIES.map((category) => {
              const isMissing = missingBaseCategories.some((item) => item.id === category.id)
              return (
                <li
                  key={category.id}
                  className="flex items-center justify-between rounded-xl border border-[#F2F2F7] px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-[#1D1D1F]">{category.name}</p>
                    <p className="text-xs text-[#6E6E73]">{category.id}</p>
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      isMissing ? 'text-red-600' : 'text-green-600'
                    }`}
                  >
                    {isMissing ? 'Pendente' : 'Sincronizado'}
                  </span>
                </li>
              )
            })}
          </ul>
        </motion.div>
      </div>

      <section className="bg-white border border-[#E5E5EA] rounded-2xl p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h3 className="text-lg font-normal text-[#1D1D1F]">Categorias cadastradas</h3>
            <p className="text-sm text-[#6E6E73]">
              {extraCategories.length > 0
                ? 'Existem categorias fora do padrao base.'
                : 'Todas as categorias seguem o padrao oficial.'}
            </p>
          </div>
          {missingBaseCategories.length > 0 && (
            <span className="text-xs font-medium text-red-600">
              {missingBaseCategories.length} categoria(s) pendente(s)
            </span>
          )}
        </div>

        {loading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="h-14 w-full rounded-xl bg-[#F5F5F5] animate-pulse" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center text-[#6E6E73] py-12 border border-dashed border-[#E5E5EA] rounded-xl">
            Nenhuma categoria cadastrada.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#6E6E73] border-b border-[#F2F2F7]">
                  <th className="py-3">Nome</th>
                  <th className="py-3">Slug</th>
                  <th className="py-3">Ordem</th>
                  <th className="py-3">Status</th>
                  <th className="py-3 text-right">Acoes</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-b border-[#F2F2F7] last:border-0">
                    <td className="py-3 font-medium text-[#1D1D1F]">{category.name}</td>
                    <td className="py-3 text-[#6E6E73]">{category.id}</td>
                    <td className="py-3 text-[#6E6E73]">{category.sort_order ?? '-'}</td>
                    <td className="py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          category.active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {category.active ? 'Ativa' : 'Inativa'}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedCategoryForProducts(category)}
                          icon={<Package className="w-4 h-4" />}
                          title="Gerenciar produtos vinculados"
                        >
                          Produtos
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleToggleActive(category)}
                        >
                          {category.active ? 'Desativar' : 'Ativar'}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(category)}>
                          Editar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(category)}
                          icon={<Trash className="w-4 h-4" />}
                        >
                          Remover
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Modal de produtos vinculados */}
      {selectedCategoryForProducts && (
        <CategoryProductsModal
          category={selectedCategoryForProducts}
          allCategories={categories}
          isOpen={true}
          onClose={() => setSelectedCategoryForProducts(null)}
          onProductsMoved={() => {
            // Recarregar categorias após mover produtos (pode afetar contagens)
            loadCategories()
          }}
        />
      )}
    </div>
  )
}

