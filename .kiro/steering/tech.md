# Tech Stack

## Framework & Language
- **Next.js 16** with App Router
- **TypeScript** (strict mode enabled)
- **React 19** with Server Components
- **React Compiler** enabled (babel-plugin-react-compiler)

## Styling
- **TailwindCSS v4** for utility-first styling
- **Framer Motion** for animations
- Dark mode via `class` strategy
- Custom CSS variables for theming

## Backend & Database
- **Supabase** (optional, with fallback):
  - PostgreSQL database
  - Authentication (email-based)
  - Row Level Security (RLS)
  - Storage for product images
- **Local PostgreSQL** via Docker (alternative to Supabase)
- **API Routes** for:
  - Cart and checkout operations
  - Admin operations (products, content, media)
  - Authentication
- **Mock data fallback** when database unavailable

## UI Libraries
- **Radix UI** for accessible components (Dialog, Dropdown, Select, Tabs, Toast)
- **Lucide React** for icons
- **clsx** + **tailwind-merge** for className utilities (via `cn()` helper)
- **class-variance-authority** for component variants
- **React Hook Form** + **Zod** for form validation
- **React Dropzone** for file uploads
- **Recharts** for data visualization
- **date-fns** for date formatting

## Build & Deploy
- **Vercel** (recommended deployment platform)
- **PostCSS** for CSS processing
- **ESLint** for code linting

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
- `NEXT_PUBLIC_WHATSAPP_NUMBER` - WhatsApp contact number

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
- Next.js Image optimization
- React Server Components for data fetching
- Automatic code splitting
