import { createClient } from '@/lib/supabase/server'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { 
  Package, 
  FileText, 
  Upload,
  Settings,
  User
} from 'lucide-react'

const actionIcons = {
  product_created: Package,
  product_updated: Package,
  content_updated: FileText,
  media_uploaded: Upload,
  settings_updated: Settings,
  user_login: User,
}

const actionColors = {
  product_created: 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400',
  product_updated: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400',
  content_updated: 'text-purple-600 bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400',
  media_uploaded: 'text-orange-600 bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400',
  settings_updated: 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400',
  user_login: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400',
}

export async function RecentActivity() {
  // Buscar atividades recentes usando nossa classe local
  const activities = await DashboardStatsService.getRecentActivity(10)
      )
    `)
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Atividade Recente
        </h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
          Ver todas
        </button>
      </div>

      <div className="space-y-4">
        {activities && activities.length > 0 ? (
          activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhuma atividade recente</p>
            <p className="text-xs mt-1">As ações administrativas aparecerão aqui</p>
          </div>
        )}
      </div>
    </div>
  )
}

function ActivityItem({ activity }: { activity: any }) {
  const Icon = actionIcons[activity.action as keyof typeof actionIcons] || Package
  const colorClass = actionColors[activity.action as keyof typeof actionColors] || actionColors.product_created

  const getActionText = () => {
    switch (activity.action) {
      case 'product_created':
        return 'criou o produto'
      case 'product_updated':
        return 'atualizou o produto'
      case 'content_updated':
        return 'atualizou o conteúdo'
      case 'media_uploaded':
        return 'fez upload de mídia'
      case 'settings_updated':
        return 'alterou configurações'
      case 'user_login':
        return 'fez login no sistema'
      default:
        return activity.action
    }
  }

  const getResourceName = () => {
    if (activity.new_values?.name) {
      return activity.new_values.name
    }
    if (activity.resource_id) {
      return `#${activity.resource_id}`
    }
    return 'item'
  }

  return (
    <div className="flex items-start space-x-3">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
        <Icon className="w-4 h-4" />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900 dark:text-white">
          <span className="font-medium">
            {activity.profiles?.full_name || activity.profiles?.email || 'Admin'}
          </span>
          {' '}
          <span className="text-gray-600 dark:text-gray-400">
            {getActionText()}
          </span>
          {' '}
          <span className="font-medium">
            {getResourceName()}
          </span>
        </p>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {formatDistanceToNow(new Date(activity.created_at), {
            addSuffix: true,
            locale: ptBR
          })}
        </p>
      </div>
    </div>
  )
}