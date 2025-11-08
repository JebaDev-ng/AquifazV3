'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  Package, 
  Image, 
  FileText, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    exact: true
  },
  {
    name: 'Produtos',
    href: '/admin/products',
    icon: Package,
    children: [
      { name: 'Lista de Produtos', href: '/admin/products' },
      { name: 'Adicionar Produto', href: '/admin/products/new' },
      { name: 'Categorias', href: '/admin/categories' },
    ]
  },
  {
    name: 'Mídia',
    href: '/admin/media',
    icon: Image,
  },
  {
    name: 'Conteúdo',
    href: '/admin/content',
    icon: FileText,
    children: [
      { name: 'Hero Section', href: '/admin/content/hero' },
      { name: 'Banners', href: '/admin/content/banners' },
      { name: 'Preços', href: '/admin/content/pricing' },
    ]
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  {
    name: 'Configurações',
    href: '/admin/settings',
    icon: Settings,
  },
]

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const pathname = usePathname()

  const isActive = (item: typeof navigation[0]) => {
    if (item.exact) {
      return pathname === item.href
    }
    return pathname.startsWith(item.href)
  }

  const hasActiveChild = (item: typeof navigation[0]) => {
    if (!item.children) return false
    return item.children.some(child => pathname.startsWith(child.href))
  }

  return (
    <motion.div
      initial={{ width: collapsed ? '4rem' : '16rem' }}
      animate={{ width: collapsed ? '4rem' : '16rem' }}
      transition={{ duration: 0.3 }}
      className="bg-[#FAFAFA] border-r border-[#E5E5EA] flex flex-col"
    >
      {/* Header */}
      <div className="h-16 border-b border-[#E5E5EA] flex items-center justify-between px-4">
        {!collapsed && (
          <h2 className="font-normal text-[#1D1D1F]">
            Admin Panel
          </h2>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-[#F5F5F5] text-[#6E6E73]"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon
          const active = isActive(item)
          const childActive = hasActiveChild(item)
          const shouldExpand = !collapsed && (active || childActive || expandedItem === item.name)

          return (
            <div key={item.name}>
              <Link
                href={item.href}
                onClick={() => {
                  if (item.children && !collapsed) {
                    setExpandedItem(expandedItem === item.name ? null : item.name)
                  }
                }}
                className={`
                  flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-normal transition-colors
                  ${active || childActive
                    ? 'bg-[#007AFF] text-white'
                    : 'text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F5]'
                  }
                `}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.name}</span>
                    {item.children && (
                      <ChevronRight 
                        className={`w-4 h-4 transition-transform ${
                          shouldExpand ? 'rotate-90' : ''
                        }`} 
                      />
                    )}
                  </>
                )}
              </Link>

              {/* Submenu */}
              {item.children && shouldExpand && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="ml-8 mt-2 space-y-1"
                >
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={`
                        block px-3 py-2 text-sm rounded-lg transition-colors
                        ${pathname === child.href
                          ? 'bg-[#007AFF] text-white'
                          : 'text-[#86868B] hover:text-[#1D1D1F] hover:bg-[#F5F5F5]'
                        }
                      `}
                    >
                      {child.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-[#E5E5EA]">
          <div className="text-xs text-[#86868B]">
            AquiFaz Admin v1.0
          </div>
        </div>
      )}
    </motion.div>
  )
}