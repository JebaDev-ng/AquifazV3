# Tech Stack

## Framework & Language
- **Next.js 16.0.1** with App Router
- **TypeScript 5** (strict mode enabled)
- **React 19.2.0** with Server Components
- **React Compiler** enabled (babel-plugin-react-compiler 1.0.0)

## Styling
- **TailwindCSS v4.1.17** for utility-first styling
- **@tailwindcss/postcss v4.1.17** for PostCSS integration
- **Framer Motion 12.23.24** for animations
- Dark mode via `class` strategy with next-themes
- Custom CSS variables for theming
- **Poppins** font family (weights: 300, 400, 500, 600, 700)

## Backend & Database
- **Supabase** (optional, with fallback):
  - PostgreSQL database
  - Authentication (email-based via @supabase/ssr 0.7.0)
  - Row Level Security (RLS)
  - Storage for product images
  - Client: @supabase/supabase-js 2.80.0
- **Local PostgreSQL** via Docker (alternative to Supabase)
  - Direct connection via pg 8.16.3
- **API Routes** for:
  - Cart and checkout operations
  - Admin operations (products, categories, content, media, homepage sections)
  - Authentication
  - File uploads
- **Mock data fallback** when database unavailable
- **Dual-source pattern**: Primary tables → Legacy tables → Mock data

## UI Libraries
- **Radix UI** for accessible components:
  - @radix-ui/react-dialog 1.1.15
  - @radix-ui/react-dropdown-menu 2.1.16
  - @radix-ui/react-select 2.2.6
  - @radix-ui/react-tabs 1.1.13
  - @radix-ui/react-toast 1.2.15
- **Lucide React 0.552.0** for icons
- **clsx 2.1.1** + **tailwind-merge 3.3.1** for className utilities (via `cn()` helper)
- **class-variance-authority 0.7.1** for component variants
- **React Hook Form 7.66.0** + **Zod 4.1.12** for form validation
- **@hookform/resolvers 5.2.2** for Zod integration
- **React Dropzone 14.3.8** for file uploads
- **Recharts 3.3.0** for data visualization
- **date-fns 4.1.0** for date formatting
- **uuid 13.0.0** for unique ID generation
- **Sharp 0.34.5** for image optimization

## Build & Deploy
- **Vercel** (recommended deployment platform)
- **PostCSS** for CSS processing
- **ESLint 9** with eslint-config-next 16.0.1
- Remote image patterns configured for Supabase storage

## Common Commands

```bash
# Development
npm run dev          # Start dev server on localhost:3000

# Production
npm run build        # Build for production
npm start            # Run production build locally

# Code Quality
npm run lint         # Run ESLint
```

## Environment Variables

### Required in `.env.local`:
- `NEXT_PUBLIC_WHATSAPP_NUMBER` - WhatsApp contact number (default: 5563992731977)

### Optional (Supabase):
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (server-only)

### Optional (Local Database):
- `DATABASE_URL` - PostgreSQL connection string
- `POSTGRES_USER` - Database user
- `POSTGRES_PASSWORD` - Database password
- `POSTGRES_DB` - Database name

### Admin:
- `ADMIN_USERNAME` - Admin login username
- `ADMIN_PASSWORD` - Admin login password

## Performance Optimizations
- ISR with 1-hour revalidation (`revalidate = 3600`)
- Next.js Image optimization with Sharp
- React Server Components for data fetching
- Automatic code splitting
- Remote image patterns for Supabase CDN
