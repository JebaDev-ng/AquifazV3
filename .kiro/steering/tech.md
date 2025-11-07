# Tech Stack

## Framework & Language
- **Next.js 15** with App Router
- **TypeScript** (strict mode enabled)
- **React 19** with Server Components

## Styling
- **TailwindCSS v4** for utility-first styling
- **Framer Motion** for animations
- Dark mode via `class` strategy
- Custom CSS variables for theming

## Backend & Database
- **Supabase** for:
  - PostgreSQL database
  - Authentication (email-based)
  - Row Level Security (RLS)
  - Storage (optional for product images)
- **API Routes** for cart and checkout operations

## UI Libraries
- **Lucide React** for icons
- **clsx** + **tailwind-merge** for className utilities (via `cn()` helper)
- **class-variance-authority** for component variants

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
Required in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (server-only)
- `NEXT_PUBLIC_WHATSAPP_NUMBER` - WhatsApp contact number

## Performance Optimizations
- ISR with 1-hour revalidation (`revalidate = 3600`)
- Next.js Image optimization
- React Server Components for data fetching
- Automatic code splitting
