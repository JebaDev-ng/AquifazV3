'use client'

import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/animations/variants'
import { HeroCarousel } from './hero-carousel'

const clientLogos = [
  { name: 'Nike', src: '/logos/nike.svg' },
  { name: 'IBM', src: '/logos/ibm.svg' },
  { name: 'Microsoft', src: '/logos/microsoft.svg' },
  { name: 'Adobe', src: '/logos/adobe.svg' },
]

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-8"
          >
            <motion.div variants={fadeInUp} className="space-y-4">
              <p className="text-sm font-normal text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                A sua gráfica em Araguaína
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-gray-900 dark:text-white leading-tight">
                <span className="font-normal">Aquifaz</span>{' '}
                <span className="font-bold">trabalha</span>
                <br />
                <span className="font-bold text-gray-600 dark:text-gray-400">
                  com diversos serviços
                </span>
              </h1>
            </motion.div>

            <motion.p
              variants={fadeInUp}
              className="text-lg text-gray-600 dark:text-gray-400 max-w-xl"
            >
              Tanto na área gráfica quanto na digital. Veja o que podemos fazer por você hoje!
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
              <a
                href="#produtos"
                className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
              >
                Ver Produtos
              </a>
              <a
                href="https://wa.me/5511999999999"
                target="_blank"
                className="px-8 py-4 border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white font-medium rounded-lg hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-colors"
              >
                Falar no WhatsApp
              </a>
            </motion.div>
          </motion.div>

          {/* Right - Promo Image */}
          {/* 
            ========================================
            ÁREA DE PROMOÇÃO CUSTOMIZÁVEL
            ========================================
            
            Esta seção exibe uma imagem promocional clicável que direciona para o WhatsApp.
            
            COMO CUSTOMIZAR:
            
            1. MENSAGEM DO WHATSAPP:
               - Número atual: (63) 99273-1977
               - Mensagem atual: "Olá! Vi a promoção no site e gostaria de mais informações."
               - Para alterar: edite o parâmetro 'text=' na URL abaixo
               - Use %20 para espaços na mensagem
            
            2. TEXTO DA PROMOÇÃO:
               - Título: Altere "Promoção Especial" no <h3>
               - Subtítulo: Altere "Clique para saber mais" no <p>
            
            3. CORES DO BANNER:
               - Cores atuais: rosa (from-pink-500 to-pink-600)
               - Para mudar: altere as classes do gradiente (ex: from-blue-500 to-blue-600)
            
            4. IMAGEM DE FUNDO:
               - RESOLUÇÃO IDEAL: 1200x900 pixels (proporção 4:3)
               - RESOLUÇÃO MÍNIMA: 800x600 pixels
               - FORMATO: JPG, PNG ou WEBP
               - TAMANHO: Máximo 500KB para melhor performance
               
               Para usar uma imagem real ao invés do gradiente:
               - Adicione a imagem em /public/promo.jpg
               - Substitua o <div> por: <img src="/promo.jpg" alt="Promoção" className="w-full h-full object-cover" />
          */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <a
              href="https://wa.me/5563992731977?text=Olá!%20Vi%20a%20promoção%20no%20site%20e%20gostaria%20de%20mais%20informações."
              target="_blank"
              rel="noopener noreferrer"
              className="block relative overflow-hidden rounded-[10px] shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-pink-500 to-pink-600 dark:from-pink-600 dark:to-pink-700 flex items-center justify-center p-8">
                <div className="text-white text-center">
                  <h3 className="text-3xl font-bold mb-3">1200 x 900 pixels</h3>
                  <p className="text-lg opacity-90">Resolução ideal para esta área</p>
                </div>
              </div>
            </a>
          </motion.div>

          {/* Carousel - Commented for future use */}
          {/* <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <HeroCarousel />
          </motion.div> */}
        </div>
      </div>
    </section>
  )
}
