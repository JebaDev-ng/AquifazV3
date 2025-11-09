# Constants and Utilities

## Content Constants

### Section IDs
Always use constants from `lib/content.ts` for section IDs:

```typescript
export const HERO_SECTION_ID = 'hero_main'
export const BANNER_SECTION_ID = 'home_banner'
export const HOMEPAGE_SETTINGS_ID = 'homepage_settings'
```

### Default Content
Default content objects are defined in `lib/content.ts`:

- `DEFAULT_HERO_CONTENT`: Hero section defaults
- `DEFAULT_BANNER_CONTENT`: Banner section defaults
- `DEFAULT_HOMEPAGE_SETTINGS`: Homepage configuration defaults
- `DEFAULT_PRODUCT_CATEGORIES`: Default category list
- `DEFAULT_CATEGORY_IMAGE`: Placeholder for category images

### WhatsApp Configuration
```typescript
// Default WhatsApp number
const DEFAULT_WHATSAPP = '5563992731977'

// Build WhatsApp link
import { buildWhatsAppLink } from '@/lib/content'
const link = buildWhatsAppLink(number, message)
```

## Utility Functions

### Styling Utilities (`lib/utils.ts`)
```typescript
import { cn } from '@/lib/utils'

// Merge Tailwind classes with conflict resolution
<div className={cn('bg-red-500', isActive && 'bg-blue-500')} />
```

### Slug Generation (`lib/content.ts`)
```typescript
import { slugifyId } from '@/lib/content'

// Convert text to URL-safe slug
const slug = slugifyId('Cartões de Visita') // 'cartoes-de-visita'
```

## Environment Utilities

### Supabase Configuration Check (`lib/supabase/env.ts`)
```typescript
import { hasSupabaseConfig } from '@/lib/supabase/env'

// Check if Supabase is configured
if (!hasSupabaseConfig()) {
  // Fall back to mock data
  return MOCK_DATA
}
```

### Supabase Clients
```typescript
// Browser client (Client Components)
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()

// Server client (Server Components, API Routes)
import { createClient } from '@/lib/supabase/server'
const supabase = await createClient()

// Service role client (Admin operations)
import { createServiceClient } from '@/lib/supabase/service'
const supabase = createServiceClient()
```

## Homepage Settings

### Reading Settings
```typescript
import { readLocalHomepageSettings } from '@/lib/homepage-settings'

const settings = await readLocalHomepageSettings()
// Returns: { use_mock_data: boolean, use_new_homepage_sections: boolean }
```

### Writing Settings
```typescript
import { writeLocalHomepageSettings } from '@/lib/homepage-settings'

await writeLocalHomepageSettings({
  use_mock_data: false,
  use_new_homepage_sections: true,
})
```

## Animation Variants

### Framer Motion Variants (`lib/animations/variants.ts`)
```typescript
import { fadeIn, slideUp, stagger } from '@/lib/animations/variants'

<motion.div variants={fadeIn} initial="hidden" animate="visible">
  Content
</motion.div>
```

Common variants:
- `fadeIn`: Fade in with opacity
- `slideUp`: Slide up from bottom
- `stagger`: Stagger children animations
- `scaleIn`: Scale in from center

## Upload Utilities

### File Upload (`lib/uploads.ts`)
```typescript
import { uploadFile, deleteFile } from '@/lib/uploads'

// Upload file to Supabase Storage
const result = await uploadFile(file, 'products')
// Returns: { url: string, path: string }

// Delete file from storage
await deleteFile(storagePath)
```

### Storage Paths
Standard storage structure:
- `/uploads/hero/` - Hero section images
- `/uploads/banners/` - Banner images
- `/uploads/products/` - Product images
- `/uploads/categories/` - Category icons
- `/uploads/media/` - General media library

## Admin Utilities

### Dashboard Statistics (`lib/admin/dashboard-stats.ts`)
```typescript
import { getDashboardStats } from '@/lib/admin/dashboard-stats'

const stats = await getDashboardStats()
// Returns: DashboardStats with product counts, media counts, etc.
```

### Admin Authentication (`lib/admin/auth.ts`)
```typescript
import { verifyAdminAuth } from '@/lib/admin/auth'

const isAdmin = await verifyAdminAuth(request)
if (!isAdmin) {
  return Response.json({ error: 'Unauthorized' }, { status: 401 })
}
```

## Type Guards

### Product Validation
```typescript
// Check if product has required fields for display
function isValidProduct(product: Product): boolean {
  return !!(product.name && product.price && product.unit)
}
```

### Image URL Validation
```typescript
// Check if image URL is valid
function hasValidImage(url?: string | null): boolean {
  return !!(url && url.trim().length > 0)
}
```

## Best Practices

1. **Always use constants** for section IDs and configuration keys
2. **Check Supabase availability** before database operations
3. **Use type-safe utilities** from lib files
4. **Validate data** before rendering or saving
5. **Handle errors gracefully** with fallbacks
6. **Use cn()** for conditional Tailwind classes
7. **Slugify user input** for IDs and URLs
8. **Check environment** before using Supabase features
9. **Use proper storage paths** for uploads
10. **Verify admin auth** in protected routes

## Common Patterns

### Dual-Source Data Fetching
```typescript
async function getData() {
  // Check if database is available
  if (!hasSupabaseConfig()) {
    return MOCK_DATA
  }

  const supabase = await createClient()
  
  try {
    // Try primary table
    const { data } = await supabase
      .from('primary_table')
      .select('*')
    
    if (data) return data
  } catch (error) {
    console.warn('Primary table failed, trying fallback...')
  }

  try {
    // Try legacy table
    const { data } = await supabase
      .from('legacy_table')
      .select('*')
    
    if (data) return data
  } catch (error) {
    console.error('Fallback failed:', error)
  }

  // Final fallback
  return MOCK_DATA
}
```

### Form Validation Pattern
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  price: z.number().positive('Preço deve ser positivo'),
  unit: z.string().min(1, 'Unidade obrigatória'),
})

const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: { name: '', price: 0, unit: 'unidade' }
})
```

### Image Upload Pattern
```typescript
async function handleUpload(file: File) {
  try {
    const result = await uploadFile(file, 'products')
    
    // Save both URL and storage path
    await saveProduct({
      image_url: result.url,
      storage_path: result.path,
    })
    
    toast.success('Imagem enviada com sucesso!')
  } catch (error) {
    toast.error('Erro ao enviar imagem')
    console.error(error)
  }
}
```
