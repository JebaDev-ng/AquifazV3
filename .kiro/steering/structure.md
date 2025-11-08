# Project Structure

## Directory Organization

```
loja-grafica/
├── app/                      # Next.js App Router
│   ├── admin/                # Admin dashboard
│   │   ├── categories/       # Category management
│   │   ├── content/          # Content management (hero, banners, pricing)
│   │   │   ├── banners/      # Banner section editor
│   │   │   ├── hero/         # Hero section editor
│   │   │   └── pricing/      # Pricing section editor
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
│   │   ├── carrinho/         # Cart operations
│   │   └── checkout/         # Checkout operations
│   ├── auth/                 # Authentication pages
│   ├── produtos/             # Products pages
│   │   ├── [slug]/           # Dynamic product detail
│   │   └── page.tsx          # Product listing
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Homepage
│   ├── loading.tsx           # Global loading state
│   └── globals.css           # Global styles + Tailwind v4
├── components/
│   ├── admin/                # Admin-specific components
│   │   ├── dashboard/        # Dashboard widgets
│   │   ├── layout/           # Admin layout components
│   │   ├── products/         # Product management forms
│   │   └── ui/               # Admin UI components
│   ├── providers/            # React context providers
│   │   └── providers.tsx     # Combined providers (theme, etc.)
│   └── ui/                   # Public UI components
│       ├── carousel/         # Carousel components
│       ├── footer/           # Footer components
│       ├── header/           # Header/navbar components
│       ├── hero/             # Hero section components
│       ├── icons/            # Custom icon components
│       ├── pricing/          # Pricing section components
│       └── *.tsx             # Shared UI components
├── lib/
│   ├── admin/                # Admin utilities
│   ├── animations/           # Framer Motion variants
│   ├── supabase/             # Supabase clients
│   │   ├── client.ts         # Browser client
│   │   ├── server.ts         # Server client
│   │   └── env.ts            # Environment config checker
│   ├── auth-local.ts         # Local authentication
│   ├── content.ts            # Content management utilities
│   ├── database.ts           # Database utilities
│   ├── homepage-settings.ts  # Homepage configuration
│   ├── types.ts              # TypeScript interfaces
│   ├── utils.ts              # Utility functions
│   ├── uploads.ts            # File upload utilities
│   └── mock-data.ts          # Mock data for development
├── data/                     # Static data files
│   └── homepage-settings.json # Homepage configuration
├── docker/                   # Docker setup files
│   ├── auth-tables.sql       # Auth schema
│   ├── init.sql              # Database initialization
│   ├── kong.yml              # Kong API gateway config
│   └── schema-docker.sql     # Docker database schema
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
  - `Product`, `ProductCategory` - Product catalog
  - `CartItem`, `Order`, `OrderItem` - E-commerce
  - `HeroContent`, `BannerContent` - Homepage content
  - `HomepageSettings` - Configuration
  - Admin types for forms and API responses
- Export types for reuse across the app

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
- `/admin` - Dashboard home
- `/admin/products` - Product management
- `/admin/categories` - Category management
- `/admin/content` - Content sections (hero, banners, pricing)
- `/admin/media` - Media library
- `/admin/login` - Authentication page

### Admin Components
- **Must follow homepage data architecture patterns** (see admin-patterns.md)
- Reusable form components in `components/admin/ui/`
- Product forms with image upload
- Content editors with live preview
- Data tables with sorting/filtering
- Toast notifications for feedback
- All features must implement dual-source pattern (primary table → legacy → mock data)

### Content Management
- Homepage settings toggle (mock data vs database)
- Hero section: title, description, promo image, WhatsApp config
- Banner sections: customizable background, text, images
- Product curation: featured, homepage display, sort order
- Category management: icons, descriptions, visibility

## Import Aliases
- `@/*` maps to project root
- Example: `import { cn } from '@/lib/utils'`

## Database Schema

### Core Tables
- `products` - Product catalog
- `product_categories` - Product categories
- `orders` - Customer orders
- `order_items` - Order line items
- `carts` - Shopping cart items

### Homepage Management Tables
- `homepage_hero_content` - Hero section content
- `homepage_banner_sections` - Banner sections
- `homepage_categories` - Homepage category display
- `homepage_products` - Products shown on homepage
- `content_sections` - Generic content sections

### Admin Tables
- `admin_users` - Admin authentication
- Media and upload management tables

### Features
- RLS policies enforce user-level access control
- Fallback to mock data when Supabase unavailable
- Schema defined in `docker/schema-docker.sql`


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
