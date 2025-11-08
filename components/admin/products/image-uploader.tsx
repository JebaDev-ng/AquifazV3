'use client'

import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'

import type { UploadedImageMeta } from '@/lib/uploads'

interface ImageUploaderProps {
  images: UploadedImageMeta[]
  onImagesChange: (images: UploadedImageMeta[]) => void
  entityId: string
  bucket?: 'products' | 'categories' | 'banners' | 'content_sections' | 'media'
  entity?: string
  maxImages?: number
  maxSizeMB?: number
}

export default function ImageUploader({
  images,
  onImagesChange,
  entityId,
  bucket = 'products',
  entity = 'gallery',
  maxImages = 5,
  maxSizeMB = 5,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!entityId) {
        alert('ID do recurso não disponível. Salve o formulário e tente novamente.')
        return
      }

      if (images.length >= maxImages) {
        alert(`Máximo de ${maxImages} imagens permitidas`)
        return
      }

      setIsUploading(true)

      try {
        const uploaded: UploadedImageMeta[] = []

        for (const file of acceptedFiles) {
          if (file.size > maxSizeMB * 1024 * 1024) {
            alert(`Arquivo ${file.name} é muito grande. Máximo ${maxSizeMB}MB`)
            continue
          }

          const formData = new FormData()
          formData.append('file', file)
          formData.append('bucket', bucket)
          formData.append('entity', entity)
          formData.append('entity_id', entityId)
          formData.append('category', bucket)

          const response = await fetch('/api/admin/upload', {
            method: 'POST',
            body: formData,
          })

          if (response.ok) {
            const payload = await response.json()
            uploaded.push({
              url: payload.url,
              storagePath: payload.storagePath,
            })
          } else {
            console.error('Erro ao fazer upload:', await response.text())
          }
        }

        if (uploaded.length > 0) {
          const newImages = [...images, ...uploaded].slice(0, maxImages)
          onImagesChange(newImages)
        }
      } catch (error) {
        console.error('Erro no upload:', error)
        alert('Erro ao fazer upload das imagens')
      } finally {
        setIsUploading(false)
      }
    },
    [images, maxImages, maxSizeMB, bucket, entity, entityId, onImagesChange],
  )

  const isDisabled = isUploading || images.length >= maxImages || !entityId

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif'],
    },
    multiple: true,
    disabled: isDisabled,
  })

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images]
    const [movedImage] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, movedImage)
    onImagesChange(newImages)
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()

    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      moveImage(draggedIndex, dropIndex)
    }

    setDraggedIndex(null)
  }

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />

        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center text-2xl">
            📷
          </div>

          <div>
            <p className="text-lg font-medium text-gray-900 mb-2">
              {isUploading ? 'Fazendo upload...' : 'Adicionar imagens do produto'}
            </p>
            <p className="text-sm text-gray-600">
              {images.length >= maxImages
                ? `Máximo de ${maxImages} imagens atingido`
                : `Arraste e solte ou clique para selecionar (máx. ${maxImages} imagens)`}
            </p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP até {maxSizeMB}MB cada</p>
          </div>

          {isUploading && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
            </div>
          )}
        </div>
      </div>

      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">Imagens do Produto ({images.length}/{maxImages})</h3>
            {images.length > 1 && (
              <p className="text-sm text-gray-600">Arraste para reordenar — a primeira imagem é a principal</p>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <AnimatePresence>
              {images.map((image, index) => (
                <motion.div
                  key={image.storagePath || image.url}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="relative group"
                  draggable
                  onDragStart={(e) => handleDragStart(e as any, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e as any, index)}
                >
                  <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden border-2 border-transparent group-hover:border-blue-200 transition-colors">
                    <img src={image.url} alt={`Produto ${index + 1}`} className="w-full h-full object-cover" />
                  </div>

                  {index === 0 && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Principal
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    ×
                  </button>

                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity rounded-xl cursor-move flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
                      ⇅ Arraste
                    </div>
                  </div>

                  <div className="absolute bottom-2 left-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">💡 Dicas para melhores resultados:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use imagens em alta qualidade (mínimo 800x600px)</li>
              <li>• A primeira imagem será exibida como principal no catálogo</li>
              <li>• Prefira fundos neutros ou brancos</li>
              <li>• Mostre o produto de diferentes ângulos</li>
              <li>• Evite imagens com texto ou marcas d'água</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
