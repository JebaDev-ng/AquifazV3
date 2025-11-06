'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { fadeInUp, staggerContainer } from '@/lib/animations/variants'

const categories = [
    {
        id: 'cartoes',
        name: 'Cartões de Visita',
        slug: 'cartoes',
        image: '/categories/cartoes.jpg',
        description: 'Impressão profissional',
    },
    {
        id: 'adesivos',
        name: 'Adesivos',
        slug: 'adesivos',
        description: 'Personalizados',
    },
    {
        id: 'banners',
        name: 'Banners',
        slug: 'banners',
        description: 'Alta qualidade',
    },
    {
        id: 'flyers',
        name: 'Flyers e Panfletos',
        slug: 'flyers',
        description: 'Divulgação eficaz',
    },
    {
        id: 'agendas',
        name: 'Agendas',
        slug: 'agendas',
        description: 'Personalizadas',
    },
    {
        id: 'brindes',
        name: 'Brindes',
        slug: 'brindes',
        description: 'Corporativos',
    },
]

export function CategoriesSection() {
    return (
        <section className="py-16 bg-white dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="space-y-8"
                >
                    {/* Header */}
                    <motion.div variants={fadeInUp} className="text-left">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Categorias populares
                        </h2>
                        <p className="text-base text-gray-600 dark:text-gray-400">
                            Explore nossos produtos por categoria
                        </p>
                    </motion.div>

                    {/* Categories Grid */}
                    <motion.div
                        variants={staggerContainer}
                        className="grid grid-cols-7 gap-4"
                    >
                        {categories.map((category) => (
                            <motion.div key={category.id} variants={fadeInUp}>
                                <Link
                                    href={`/produtos?category=${category.slug}`}
                                    className="group block"
                                >
                                    {/* 
                    IMAGEM DA CATEGORIA
                    - RESOLUÇÃO IDEAL: 300x300 pixels (1:1)
                    - FORMATO: JPG, PNG ou WEBP
                    - TAMANHO: Máximo 150KB
                  */}
                                    <div className="relative aspect-square rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 mb-3 shadow-md group-hover:shadow-xl transition-shadow duration-300">
                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                                            <p className="text-xs font-bold text-gray-700 dark:text-gray-300">
                                                300 x 300
                                            </p>
                                            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                                                pixels
                                            </p>
                                        </div>
                                    </div>

                                    {/* Category Info */}
                                    <div className="text-center">
                                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-0.5 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                                            {category.name}
                                        </h3>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            {category.description}
                                        </p>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}

                        {/* Ver Todos */}
                        <motion.div variants={fadeInUp}>
                            <Link
                                href="/produtos"
                                className="group block h-full"
                            >
                                <div className="relative aspect-square rounded-full overflow-hidden bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-600 mb-3 flex items-center justify-center group-hover:border-pink-500 dark:group-hover:border-pink-400 transition-colors duration-300">
                                    <span className="text-3xl text-gray-400 dark:text-gray-500 group-hover:text-pink-500 dark:group-hover:text-pink-400 transition-colors">
                                        +
                                    </span>
                                </div>

                                <div className="text-center">
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-0.5 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                                        Ver todos
                                    </h3>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        Todos os produtos
                                    </p>
                                </div>
                            </Link>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
