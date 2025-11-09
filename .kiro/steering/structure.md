# Project Structure

## Directory Organization

```
loja-grafica/
├── app/                      # Next.js App Router
│   ├── admin/                # Admin dashboard
│   │   ├── categories/       # Category management
│   │   ├── content/          # Content management (hero, banners, sections)
│   │   │   ├── banners/      # Banner section editor
│   │   │   ├── hero/         # Hero section editor
│   │   │   ├── pricing/      # Pricing section editor
│   │   │   └── sections/     # Homepage sections management
│   │   ├── login/            # Admin authentication
│   │   ├── media/            # Media library management
│   │   ├── products/         # Product management
│   │   │   ├── [id]/         # Edit product
│   │   │   ├── new/          # Create product
│   │   │   └── pricing/      # Product pricing
│   │   ├── layout.tsx        # Admin layout with sidebar
│   │   └── page.tsx          # Admin dashboard home
│   ├── api/                  # API Routes
│   │   ├── admin/            # Admin API endpoints
│   │   │   ├── categories/   # Category CRUD + sync
│   │   │   ├── content/      # Content management APIs
│   │   │   │   ├── banner/   # Banner API
│   │   │   │   ├── hero/     # Hero API
│   │   │   │   ├── homepage-sections/ # Homepage sections API
│   │   │   │   └── settings/ # Settings API
│   │   │   ├── media/        # Media library API
│   │   │   ├── products/     # Product CRUD
│   │   │   └── upload/       # File upload API
│   │   ├── auth/             # Authentication API
│   │   ├── carrinho/         # Cart operations (deprecated)
│   │   ├── checkout/         # Checkout operations (deprecated)
│   │   └── products/         # Public products API
│   ├── auth/                 # Authentication pages
│   │   ├── login/            # User login
│   │   └── unauthorized/     # Unauthorized access page
│   ├── produtos/             # Products pages
│   │   ├── [slug]/           # Dynamic product detail
│   │   └── page.tsx          # Product listing
│   ├── layout.tsx            # Root layout (Poppins font, metadata)
│   ├── page.tsx              # Homepage (dual-source sections)
│   ├── loading.tsx           # Global loading state
│   ├── globals.css           # Global styles + Tailwind v4
│   └── icon.svg              # App icon
├── components/
│   ├── admin/                # Admin-specific components
│   │   ├── dashboard/        # Dashboard widgets
│   │   ├── layout/           # Admin layout components
│   │   ├── products/         # Product management forms
│   │   └── ui/               # Admin UI components
│   ├── providers/            # React context providers
│   │   ├── layout-content.tsx # Layout content wrapper
│   │   └── providers.tsx     # Combined providers (theme, etc.)
│   └── ui/                   # Public UI components
│       ├── carousel/         # Carousel components
│       ├── footer/           # Footer components
│       ├── header/           # Header/navbar components
│       ├── hero/             # Hero section components
│       ├── icons/            # Custom icon components
│       ├── pricing/          # Pricing section components
│       ├── categories-section.tsx
│       ├── featured-products-section.tsx
│       ├── image-banner-section.tsx
│       ├── loading-skeleton.tsx
│       ├── product-card.tsx
│       └── products-grid-section.tsx
├── lib/
│   ├── admin/                # Admin utilities
│   │   ├── auth-local.ts     # Local admin auth
│   │   ├── auth.ts           # Admin auth utilities
│   │   ├── dashboard-stats.ts # Dashboard statistics
│   │   └── homepage-sections.ts # Homepage sections admin
│   ├── animations/           # Framer Motion variants
│   │   └── variants.ts       # Animation variants
│   ├── supabase/             # Supabase clients
│   │   ├── client.ts         # Browser client
│   │   ├── server.ts         # Server client (cookies)
│   │   ├── service.ts        # Service role client
│   │   └── env.ts            # Environment config checker
│   ├── auth-local.ts         # Local authentication
│   ├── content.ts            # Content management utilities + constants
│   ├── database.ts           # Database type placeholder
│   ├── homepage-sections.ts  # Homepage sections data fetching
│   ├── homepage-settings.ts  # Homepage configuration (JSON file)
│   ├── types.ts              # TypeScript interfaces
│   ├── utils.ts              # Utility functions (cn, etc.)
│   ├── uploads.ts            # File upload utilities
│   └── mock-data.ts          # Mock data for development
├── data/                     # Static data files
│   └── homepage-settings.json # Homepage configuration
├── docs/                     # Documentation
│   ├── admin-content-expansion-plan.md
│   ├── admin-content-expansion-qa-plan.md
│   ├── admin-content-expansion-specs.md
│   ├── admin-content-expansion-todos.md
│   ├── homepage-mock-data-analysis.md
│   └── supabase-homepage-sections-migration.md
├── docker/                   # Docker setup files
│   ├── auth-tables.sql       # Auth schema
│   ├── init.sql              # Database initialization
│   ├── kong.yml              # Kong API gateway config
│   └── schema-docker.sql     # Docker database schema
├── scripts/                  # Utility scripts
├── supabase/                 # Supabase migrations
├── .kiro/                    # Kiro AI configuration
│   └── steering/             # AI steering rules
└── public/                   # Static assets
```

## File Naming Conventions
- **Components**: PascalCase for files and exports (e.g., `ProductCard.tsx`)
- **Pages**: lowercase with hyphens (e.g., `page.tsx`, `[slug]/page.tsx`)
- **Utilities**: camelCase (e.g., `utils.ts`, `types.ts`)
- **API Routes**: lowercase (e.g., `route.ts`)

## Code Organization Patterns

### Components
- Place reusable UI components in `components/ui/`
- Admin components in `components/admin/`
- Group related components in subdirectories (e.g., `header/`, `footer/`, `pricing/`)
- Keep components small and focused
- Use Server Components by default, add `'use client'` only when needed
- Admin components are typically Client Components (forms, interactivity)

### Data Fetching
- Use Server Components for data fetching when possible
- Check Supabase availability with `hasSupabaseConfig()` from `lib/supabase/env.ts`
- Supabase client for browser: `lib/supabase/client.ts`
- Supabase server for SSR: `lib/supabase/server.ts`
- API Routes for mutations (POST, PUT, DELETE)
- Graceful fallback to mock data when database unavailable
- Homepage uses dual-source pattern (homepage tables → legacy tables → mock data)

### Styling
- Use Tailwind utility classes
- Use `cn()` helper from `lib/utils.ts` for conditional classes
- Dark mode classes: `dark:` prefix
- Responsive: `sm:`, `md:`, `lg:`, `xl:` prefixes

### Images & Media
- **Always display image resolution requirements** where images are used
- Show resolution as placeholder text (e.g., "1200 x 900 pixels")
- Include subtitle with context (e.g., "Resolução ideal para esta área")
- Add detailed comments with:
  - Ideal resolution
  - Minimum resolution
  - Supported formats (JPG, PNG, WEBP)
  - Maximum file size recommendation
- Use `aspect-ratio` classes to maintain proper proportions
- Example: `aspect-[4/3]` for 1200x900 images

### Types
- Define interfaces in `lib/types.ts`
- Main entities: 
  - `Product`, `ProductCategory` - Product catalog with admin fields
  - `CartItem`, `Order`, `OrderItem` - E-commerce (legacy)
  - `HeroContent`, `BannerContent` - Homepage content
  - `HomepageSettings` - Configuration (use_mock_data, use_new_homepage_sections)
  - `HomepageSection`, `HomepageSectionItem`, `HomepageSectionWithItems` - New sections system
  - `ContentSection` - Generic content sections (legacy fallback)
  - `Media` - Media library items
  - `Profile`, `ActivityLog` - Admin system
  - `DashboardStats`, `UploadProgress` - Admin utilities
- Export types for reuse across the app
- Product fields include: active, featured, show_on_home, images, pricing, specifications, SEO, audit fields

### Animations
- Framer Motion variants in `lib/animations/variants.ts`
- Common animations: fadeIn, slideUp, stagger
- Use `motion` components from `framer-motion`

## Admin System

### Authentication
- Local authentication via `lib/auth-local.ts`
- Environment variables: `ADMIN_USERNAME`, `ADMIN_PASSWORD`
- Protected routes with middleware
- Session-based authentication

### Admin Routes
- `/admin` - Dashboard home with statistics
- `/admin/products` - Product management (CRUD, pricing)
- `/admin/products/new` - Create new product
- `/admin/products/[id]` - Edit product
- `/admin/categories` - Category management with sync
- `/admin/content` - Content sections management
- `/admin/content/hero` - Hero section editor
- `/admin/content/banners` - Banner section editor
- `/admin/content/pricing` - Pricing section editor
- `/admin/content/sections` - Homepage sections management (new)
- `/admin/media` - Media library with upload
- `/admin/login` - Authentication page

### Admin API Routes
- `/api/admin/products` - Product CRUD
- `/api/admin/products/[id]` - Single product operations
- `/api/admin/categories` - Category CRUD
- `/api/admin/categories/[id]` - Single category operations
- `/api/admin/categories/sync` - Sync categories
- `/api/admin/content/hero` - Hero content management
- `/api/admin/content/banner` - Banner content management
- `/api/admin/content/homepage-sections` - Homepage sections CRUD
- `/api/admin/content/settings` - Homepage settings
- `/api/admin/media` - Media library operations
- `/api/admin/media/[id]` - Single media operations
- `/api/admin/upload` - File upload endpoint

### Admin Components
- **Must follow homepage data architecture patterns** (see admin-patterns.md)
- Reusable form components in `components/admin/ui/`
- Product forms with image upload and validation
- Content editors with live preview
- Data tables with sorting/filtering
- Toast notifications for feedback
- Dashboard widgets for statistics
- All features must implement dual-source pattern (primary table → legacy → mock data)
- Form validation with React Hook Form + Zod
- Image upload with React Dropzone

### Content Management
- Homepage settings toggle (mock data vs database) via `data/homepage-settings.json`
  - `use_mock_data`: boolean - Use mock data instead of database
  - `use_new_homepage_sections`: boolean - Use new sections architecture
- Hero section: title, subtitle, description, promo image, WhatsApp config, CTA
- Banner sections: customizable background, text, images, links
- Homepage sections (new): configurable product sections with layout types
  - Featured layout: 3 large cards with badges
  - Grid layout: 3-column grid with category filtering
  - Drag & drop reordering
  - Product selection with validation
- Product curation: active, featured, show_on_home, sort order
- Category management: icons, descriptions, images, accent colors, visibility
- Media library: upload, organize, delete images with metadata

## Import Aliases
- `@/*` maps to project root
- Example: `import { cn } from '@/lib/utils'`

## Database Schema

### Core Tables
- `products` - Product catalog with extended fields (active, featured, images, pricing, specs, SEO)
- `product_categories` - Product categories with icons, images, colors
- `orders` - Customer orders (legacy)
- `order_items` - Order line items (legacy)
- `carts` - Shopping cart items (legacy)

### Homepage Management Tables (New Architecture)
- `homepage_sections` - Configurable homepage sections
  - Fields: id (slug), title, subtitle, layout_type (featured/grid), bg_color (white/gray)
  - limit, view_all_label, view_all_href, category_id, sort_order, is_active, config (jsonb)
  - Audit: created_at, updated_at, updated_by
- `homepage_section_items` - Products within sections
  - Fields: id, section_id, product_id, sort_order, metadata (jsonb)
  - Constraints: unique(section_id, product_id), unique(section_id, sort_order)
  - Audit: created_at, updated_at, updated_by

### Legacy Homepage Tables (Fallback)
- `homepage_hero_content` - Hero section content
- `homepage_banner_sections` - Banner sections
- `homepage_categories` - Homepage category display
- `homepage_products` - Products shown on homepage (deprecated, migrated to sections)
- `content_sections` - Generic content sections

### Admin Tables
- `admin_users` - Admin authentication
- `media_library` - Uploaded media files
- `profiles` - User profiles with roles (admin/editor/viewer)
- `activity_log` - Audit trail for admin actions

### Features
- RLS policies enforce user-level access control
- Dual-source pattern: Primary tables → Legacy tables → Mock data
- Fallback to mock data when Supabase unavailable
- Schema defined in `docker/schema-docker.sql` and `supabase/migrations/`
- Migration script: `20241108190000_homepage_sections.sql`


# Tailwind CSS v4.1 Guidelines

## Critical Information

This project uses **Tailwind CSS v4.1** (not v3). The syntax and approach are significantly different.

## Installation & Setup

### Next.js 15+ with App Router
```bash
npm install tailwindcss @tailwindcss/vite
```

### Import in CSS (NOT @tailwind directives)
```css
@import "tailwindcss";
```

**NEVER use these v3 directives:**
```css
@tailwind base;      /* ❌ WRONG - v3 syntax */
@tailwind components; /* ❌ WRONG - v3 syntax */
@tailwind utilities;  /* ❌ WRONG - v3 syntax */
```

## Theme Variables (Core Concept)

### Defining Theme Variables
Use `@theme` directive to define design tokens:

```css
@import "tailwindcss";

@theme {
  /* Colors */
  --color-mint-500: oklch(0.72 0.11 178);
  --color-brand-primary: #007AFF;
  
  /* Fonts */
  --font-display: "Satoshi", sans-serif;
  
  /* Spacing */
  --spacing-18: 4.5rem;
  
  /* Breakpoints */
  --breakpoint-3xl: 120rem;
  
  /* Shadows */
  --shadow-brutal: 4px 4px 0 0 black;
}
```

### Theme Variable Namespaces

| Namespace | Creates Utilities | Example |
|-----------|------------------|---------|
| `--color-*` | Color utilities | `bg-mint-500`, `text-brand-primary` |
| `--font-*` | Font family | `font-display` |
| `--text-*` | Font size | `text-xl` |
| `--font-weight-*` | Font weight | `font-bold` |
| `--spacing-*` | Spacing/sizing | `px-4`, `gap-18` |
| `--radius-*` | Border radius | `rounded-sm` |
| `--shadow-*` | Box shadow | `shadow-brutal` |
| `--breakpoint-*` | Responsive variants | `3xl:grid-cols-6` |
| `--ease-*` | Timing functions | `ease-out` |
| `--animate-*` | Animations | `animate-spin` |

### Using CSS Variables
Theme variables are also available as regular CSS variables:

```html
<div style="background-color: var(--color-mint-500)">
  <!-- Works! -->
</div>
```

## Major Breaking Changes from v3

### 1. Renamed Utilities

| v3 | v4 |
|----|-----|
| `shadow-sm` | `shadow-xs` |
| `shadow` | `shadow-sm` |
| `blur-sm` | `blur-xs` |
| `blur` | `blur-sm` |
| `rounded-sm` | `rounded-xs` |
| `rounded` | `rounded-sm` |
| `outline-none` | `outline-hidden` |
| `ring` | `ring-3` |

### 2. Opacity Modifiers (Not Separate Classes)

**v3 (deprecated):**
```html
<div class="bg-black bg-opacity-50">  <!-- ❌ WRONG -->
```

**v4 (correct):**
```html
<div class="bg-black/50">  <!-- ✅ CORRECT -->
```

### 3. Default Border Color
Now uses `currentColor` instead of gray-200. Always specify color:

```html
<div class="border border-gray-200">  <!-- ✅ Specify color -->
```

### 4. Ring Utility
Default width changed from 3px to 1px:

```html
<!-- v3 -->
<button class="ring ring-blue-500">

<!-- v4 -->
<button class="ring-3 ring-blue-500">
```

### 5. Variant Order (Left to Right)
Variants now apply left-to-right (like CSS):

```html
<!-- v3 -->
<ul class="first:*:pt-0">

<!-- v4 -->
<ul class="*:first:pt-0">
```

### 6. CSS Variables in Arbitrary Values
Use parentheses instead of square brackets:

```html
<!-- v3 -->
<div class="bg-[--brand-color]">  <!-- ❌ WRONG -->

<!-- v4 -->
<div class="bg-(--brand-color)">  <!-- ✅ CORRECT -->
```

### 7. Arbitrary Values with Spaces
Use underscores for spaces:

```html
<!-- v3 -->
<div class="grid-cols-[max-content,auto]">  <!-- ❌ WRONG -->

<!-- v4 -->
<div class="grid-cols-[max-content_auto]">  <!-- ✅ CORRECT -->
```

## Custom Utilities

### Use @utility (not @layer utilities)

**v3 (deprecated):**
```css
@layer utilities {
  .tab-4 {
    tab-size: 4;
  }
}
```

**v4 (correct):**
```css
@utility tab-4 {
  tab-size: 4;
}
```

### Custom Variants

```css
@custom-variant hover (&:hover);
@custom-variant supports-grid (@supports (display: grid));
```

## Container Customization

**v3 had config options, v4 uses @utility:**

```css
@utility container {
  margin-inline: auto;
  padding-inline: 2rem;
  max-width: 80rem;
}
```

## Prefixes

Prefixes now look like variants:

```html
<div class="tw:flex tw:bg-red-500 tw:hover:bg-red-600">
```

Configure in CSS:
```css
@import "tailwindcss" prefix(tw);
```

## CSS Modules / Vue / Svelte

Use `@reference` to import theme without duplicating CSS:

```vue
<style>
@reference "../../app.css";

h1 {
  @apply text-2xl font-bold;
}
</style>
```

## Important Rules

1. **NO Sass/Less/Stylus** - Tailwind v4 is your preprocessor
2. **NO JavaScript config** - Use CSS `@theme` instead
3. **NO `@tailwind` directives** - Use `@import "tailwindcss"`
4. **Always use theme variables** - Not hardcoded values when possible
5. **Opacity with `/` syntax** - Not separate opacity classes
6. **Specify border colors** - No default gray anymore
7. **Use `@utility`** - Not `@layer utilities`

## Browser Support

Requires modern browsers:
- Safari 16.4+
- Chrome 111+
- Firefox 128+

Uses modern CSS features like `@property` and `color-mix()`.

## Common Mistakes to Avoid

❌ Using v3 syntax:
```css
@tailwind base;
@tailwind utilities;
```

❌ Using deprecated opacity classes:
```html
<div class="bg-black bg-opacity-50">
```

❌ Not specifying border colors:
```html
<div class="border">  <!-- Will use currentColor -->
```

❌ Using old ring default:
```html
<button class="ring">  <!-- Now 1px, not 3px -->
```

❌ Using square brackets for CSS variables:
```html
<div class="bg-[--my-color]">
```

## Resources

- Official Docs: https://tailwindcss.com/docs
- Upgrade Guide: https://tailwindcss.com/docs/upgrade-guide
- Theme Reference: https://tailwindcss.com/docs/theme
