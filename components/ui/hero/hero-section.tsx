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
    <section className="relative bg-white dark:bg-black pt-32 pb-16">
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
              <p className="text-sm font-normal text-[#6E6E73] dark:text-[#98989D] uppercase tracking-wider">
                A sua gráfica em Araguaína
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-[#1D1D1F] dark:text-white leading-tight font-normal">
                Aquifaz trabalha
                <br />
                com diversos serviços
                
              </h1>
            </motion.div>

            <motion.p
              variants={fadeInUp}
              className="text-lg text-[#6E6E73] dark:text-[#98989D] max-w-xl"
            >
              Tanto na área gráfica quanto na digital. Veja o que podemos fazer por você hoje!
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap gap-3">
              <a
                href="#produtos"
                className="inline-flex items-center px-8 py-3.5 bg-[#2d2736] dark:bg-white text-white dark:text-[#1D1D1F] text-sm font-medium rounded-md hover:bg-[#1D1D1F] dark:hover:bg-[#E5E5EA] transition-all duration-200"
              >
                Ver Produtos
              </a>
              <a
                href="https://wa.me/5563992731977?text=Olá!%20Vim%20pelo%20site%20e%20gostaria%20de%20conhecer%20os%20serviços%20da%20AquiFaz."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-3.5 border-2 border-[#6e6e73] dark:border-[#38383A] text-[#2d2736] dark:text-[#98989D] text-sm font-medium rounded-md hover:border-[#1D1D1F] hover:text-[#1D1D1F] dark:hover:border-white dark:hover:text-white transition-all duration-200"
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
              className="block relative overflow-hidden rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <div className="aspect-[4/3] bg-[#F5F5F5] dark:bg-[#1C1C1E] border border-[#D2D2D7] dark:border-[#38383A] flex items-center justify-center p-8">
                <div className="text-center">
                  <p className="text-base font-semibold text-[#6E6E73] dark:text-[#98989D] mb-1">
                    1200 x 900
                  </p>
                  <p className="text-sm text-[#86868B] dark:text-[#636366]">
                    pixels
                  </p>
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
