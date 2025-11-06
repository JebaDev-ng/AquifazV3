'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PricingTier {
  name: string
  quantity: string
  idealFor: string
  price: string
  features: string[]
  highlighted?: boolean
}

const pricingTiers: PricingTier[] = [
  {
    name: 'Básico',
    quantity: '8 artes/mês',
    idealFor: 'Pequenos negócios',
    price: 'R$ 350 – R$ 500',
    features: [
      'Posts para redes sociais',
      'Formatos básicos',
      'Revisões incluídas',
      'Suporte por WhatsApp'
    ]
  },
  {
    name: 'Intermediário',
    quantity: '12 artes/mês',
    idealFor: 'Constância nas redes',
    price: 'R$ 600 – R$ 900',
    features: [
      'Posts + Stories',
      'Calendário editorial',
      'Revisões ilimitadas',
      'Suporte prioritário',
      'Formatos variados'
    ],
    highlighted: true
  },
  {
    name: 'Premium',
    quantity: '20 artes/mês',
    idealFor: 'Negócios ativos com vendas',
    price: 'R$ 1.000 – R$ 1.600',
    features: [
      'Conteúdo completo',
      'Estratégia visual',
      'Revisões ilimitadas',
      'Suporte dedicado',
      'Todos os formatos',
      'Relatório mensal'
    ]
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
}

export function PricingSection() {
  return (
    <section className="py-12 md:py-16 bg-white dark:bg-neutral-950">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 text-neutral-900 dark:text-white">
            Planos e Preços
          </h2>
          <p className="text-base text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Escolha o plano ideal para manter sua presença digital sempre atualizada
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 max-w-5xl mx-auto"
        >
          {pricingTiers.map((tier) => (
            <motion.div
              key={tier.name}
              variants={cardVariants}
              className={cn(
                'relative rounded-xl p-6 border-2 transition-all duration-300',
                tier.highlighted
                  ? 'border-neutral-900 dark:border-white bg-neutral-50 dark:bg-neutral-900 shadow-xl md:scale-105'
                  : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:border-neutral-300 dark:hover:border-neutral-700'
              )}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-3 py-0.5 rounded-full text-xs font-medium">
                  Mais Popular
                </div>
              )}

              {/* Plan Name */}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-1">
                  {tier.name}
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  {tier.idealFor}
                </p>
              </div>

              {/* Quantity */}
              <div className="mb-4">
                <div className="text-base font-semibold text-neutral-700 dark:text-neutral-300">
                  {tier.quantity}
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {tier.price}
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-500 mt-0.5">
                  por mês
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-2 mb-6">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-neutral-700 dark:text-neutral-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                className={cn(
                  'w-full py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-300',
                  tier.highlighted
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700'
                )}
              >
                Escolher Plano
              </button>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-xs text-neutral-500 dark:text-neutral-500 mt-8"
        >
          Todos os planos incluem suporte via WhatsApp e revisões. Entre em contato para planos personalizados.
        </motion.p>
      </div>
    </section>
  )
}
