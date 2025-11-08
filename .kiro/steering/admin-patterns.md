# Admin Panel Patterns

## Core Principle
**All admin panel features must follow the homepage data architecture patterns.**

## Data Architecture Pattern

### Dual-Table System
Every admin feature should implement the dual-table pattern used in the homepage:

1. **Primary Table**: Dedicated homepage/admin table (e.g., `homepage_products`, `homepage_hero_content`)
2. **Legacy Table**: Fallback to existing tables (e.g., `products`, `content_sections`)
3. **Mock Data**: Final fallback for development without database

### Implementation Rules

#### When Creating New Admin Features:
```typescript
// ✅ CORRECT: Dual-source pattern with fallbacks
async function getContent() {
  const supabase = await getSupabaseClient()
  if (!supabase) {
    return DEFAULT_CONTENT // Mock data fallback
  }

  try {
    // Try primary table first
    const { data } = await supabase
      .from('homepage_specific_table')
      .select('*')
      .maybeSingle()

    if (data) {
      return mapToContentType(data)
    }
  } catch (error) {
    console.warn('Primary table unavailable, trying legacy...')
  }

  try {
    // Fallback to legacy table
    const { data } = await supabase
      .from('legacy_table')
      .select('*')
      .maybeSingle()

    if (data) {
      return mapLegacyToContentType(data)
    }
  } catch (error) {
    console.error('Legacy fallback failed:', error)
  }

  return DEFAULT_CONTENT // Final fallback
}
```

```typescript
// ❌ WRONG: No fallback pattern
async function getContent() {
  const { data } = await supabase
    .from('some_table')
    .select('*')
  
  return data // Will break if database unavailable
}
```

## Database Table Naming

### Homepage-Specific Tables
Use `homepage_*` prefix for tables that control homepage display:
- `homepage_products` - Products shown on homepage
- `homepage_categories` - Categories displayed on homepage
- `homepage_hero_content` - Hero section content
- `homepage_banner_sections` - Banner sections
- `homepage_pricing_tiers` - Pricing display

### Content Management Tables
Use descriptive names for admin-managed content:
- `content_sections` - Generic content sections
- `admin_users` - Admin authentication
- `media_library` - Uploaded media files

## API Route Patterns

### Admin API Structure
```typescript
// app/api/admin/[feature]/route.ts

import { hasSupabaseConfig } from '@/lib/supabase/env'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  if (!hasSupabaseConfig()) {
    return Response.json({ 
      error: 'Database not configured',
      useMockData: true 
    }, { status: 503 })
  }

  const supabase = await createClient()
  
  try {
    // Try primary source
    const { data, error } = await supabase
      .from('homepage_table')
      .select('*')
    
    if (error) throw error
    
    return Response.json({ data, source: 'database' })
  } catch (error) {
    // Return mock data on error
    return Response.json({ 
      data: MOCK_DATA,
      source: 'mock',
      error: error.message 
    })
  }
}
```

## Component Patterns

### Admin Forms
All admin forms should:
- Use React Hook Form + Zod validation
- Include image upload with preview
- Show loading states
- Display toast notifications
- Handle errors gracefully

```typescript
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  title: z.string().min(1, 'Título obrigatório'),
  description: z.string().optional(),
  image_url: z.string().url().optional(),
})

export function AdminForm() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { /* ... */ }
  })

  async function onSubmit(data: z.infer<typeof schema>) {
    try {
      const response = await fetch('/api/admin/feature', {
        method: 'POST',
        body: JSON.stringify(data),
      })
      
      if (!response.ok) throw new Error('Erro ao salvar')
      
      // Show success toast
      toast.success('Salvo com sucesso!')
    } catch (error) {
      // Show error toast
      toast.error('Erro ao salvar')
    }
  }

  return <form onSubmit={form.handleSubmit(onSubmit)}>
    {/* Form fields */}
  </form>
}
```

### Data Display Components
- Use loading skeletons during fetch
- Show empty states when no data
- Provide fallback UI for errors
- Display data source indicator (database vs mock)

## Configuration Management

### Homepage Settings Pattern
Follow the `homepage-settings.json` pattern for all configurable features:

```json
{
  "use_mock_data": false,
  "feature_enabled": true,
  "display_options": {
    "show_images": true,
    "items_per_page": 12
  }
}
```

### Reading Configuration
```typescript
// lib/feature-settings.ts
import fs from 'fs'
import path from 'path'

export function readLocalFeatureSettings() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'feature-settings.json')
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(fileContent)
  } catch {
    return DEFAULT_SETTINGS
  }
}
```

## Image Upload Pattern

### Storage Structure
```
/uploads/
  /hero/          - Hero section images
  /banners/       - Banner images
  /products/      - Product images
  /categories/    - Category icons
  /media/         - General media library
```

### Upload Implementation
```typescript
// All uploads should:
// 1. Validate file type and size
// 2. Generate unique filename
// 3. Store in appropriate folder
// 4. Save both public URL and storage path
// 5. Handle upload errors gracefully

const uploadResult = {
  image_url: 'https://...', // Public URL
  storage_path: 'uploads/hero/image.jpg', // Storage path
}
```

## Content Section IDs

### Use Constants for Section IDs
```typescript
// lib/content.ts
export const HERO_SECTION_ID = 'homepage-hero'
export const BANNER_SECTION_ID = 'homepage-banner'
export const PRICING_SECTION_ID = 'homepage-pricing'
export const CATEGORIES_SECTION_ID = 'homepage-categories'
```

### Benefits
- Consistent references across codebase
- Easy to update if IDs change
- Type-safe with TypeScript
- Self-documenting code

## Error Handling

### Graceful Degradation
Every admin feature must handle these scenarios:
1. **No database connection**: Fall back to mock data
2. **Table doesn't exist**: Try legacy table, then mock data
3. **Network error**: Show error message, keep UI functional
4. **Invalid data**: Validate and show helpful error messages

### Error Messages
```typescript
// ✅ CORRECT: Helpful error messages
console.warn('Hero content unavailable, trying fallback...')
console.error('Failed to load products:', error.message)

// ❌ WRONG: Generic or missing errors
console.log('error')
throw error // Without context
```

## Testing Checklist

Before deploying any admin feature, verify:
- [ ] Works with Supabase database
- [ ] Works with local PostgreSQL
- [ ] Works without database (mock data)
- [ ] Handles missing tables gracefully
- [ ] Shows appropriate loading states
- [ ] Displays helpful error messages
- [ ] Image uploads work correctly
- [ ] Form validation works
- [ ] Toast notifications appear
- [ ] Mobile responsive
- [ ] Accessible (keyboard navigation, screen readers)

## Migration Pattern

### When Adding New Admin Features
1. Create homepage-specific table with all needed fields
2. Add default/mock data in `lib/mock-data.ts`
3. Create API routes with fallback pattern
4. Build admin UI components
5. Test all three modes (Supabase, local, mock)
6. Document in steering rules if needed

### Example Migration
```sql
-- 1. Create new table
CREATE TABLE homepage_testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  storage_path TEXT,
  active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add to existing content_sections as fallback
-- (Already exists, just use it)
```

## Best Practices Summary

1. **Always implement dual-source pattern** (primary → legacy → mock)
2. **Check database availability** before queries
3. **Use constants** for section IDs and config keys
4. **Validate all inputs** with Zod schemas
5. **Handle errors gracefully** with fallbacks
6. **Show loading states** during async operations
7. **Provide feedback** via toast notifications
8. **Test without database** to ensure mock data works
9. **Document new patterns** in steering rules
10. **Keep admin UI consistent** with existing patterns

## Common Mistakes to Avoid

❌ **Direct database queries without fallback**
```typescript
const { data } = await supabase.from('table').select('*')
return data // Will break without database
```

❌ **Hardcoded section IDs**
```typescript
.eq('id', 'homepage-hero') // Use constant instead
```

❌ **No error handling**
```typescript
const response = await fetch('/api/admin/feature')
const data = await response.json() // No error check
```

❌ **Missing loading states**
```typescript
return <div>{data.map(...)}</div> // No loading UI
```

❌ **No mock data fallback**
```typescript
if (!supabase) {
  throw new Error('Database required') // Should return mock data
}
```

## Resources

- Homepage implementation: `app/page.tsx`
- Data fetching patterns: `lib/content.ts`
- Mock data: `lib/mock-data.ts`
- Admin components: `components/admin/`
- API routes: `app/api/admin/`
