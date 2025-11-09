# Product Overview

Aquifaz is a modern e-commerce platform for a print shop (gráfica), inspired by the minimalist design of LS.Graphics.

## Core Purpose
- Online store for print products (business cards, flyers, banners, etc.)
- B2C and B2B sales
- Custom print orders with WhatsApp integration
- Clean, minimalist user experience

## Key Features

### Public Features
- Product catalog with categories (cartões, flyers, banners, adesivos, etc.)
- Dynamic homepage sections with configurable layouts
- Shopping cart and checkout system (legacy)
- User authentication and order management (legacy)
- Dark/light theme support with next-themes
- Responsive design (mobile-first)
- WhatsApp integration for customer support
- ISR for optimal performance (1-hour revalidation)
- Image placeholders (600×800) for products without images

### Admin Features
- Complete admin dashboard at `/admin` with statistics
- **All admin features follow homepage data architecture** (dual-source pattern)
- Product management (CRUD operations):
  - Required fields: name, price, unit
  - Optional: images, specifications, SEO, pricing tiers
  - Active/featured/show_on_home flags
- Category management:
  - Icons, images, accent colors
  - Sync functionality
  - Visibility control
- Content management:
  - Hero section editor (title, subtitle, WhatsApp, promo image)
  - Banner section editor (background, text, images, links)
  - Pricing section editor
  - **Homepage sections editor (NEW)**:
    - Create/edit/reorder sections
    - Featured or grid layouts
    - Product selection with drag & drop
    - Live preview
    - Limit control (1-6 products per section)
- Media library:
  - Upload with drag & drop
  - Organize by category
  - Delete with storage cleanup
  - Metadata (alt text, dimensions)
- Homepage settings toggle:
  - Mock data vs database
  - New sections architecture flag
- Admin authentication system (local)
- Graceful fallback to mock data in all features
- Form validation with React Hook Form + Zod
- Toast notifications for user feedback

### Technical Features
- Graceful fallback to mock data when database unavailable
- Dual database support (Supabase or local PostgreSQL)
- Image upload with storage management
- Form validation with React Hook Form + Zod
- Accessible UI with Radix UI components

## Design Philosophy
- Minimalist aesthetic inspired by LS.Graphics
- Clean typography (Poppins font family)
- Generous whitespace
- Smooth animations and transitions (Framer Motion)
- Focus on product imagery
- Professional yet approachable
- Dark/light theme support
- Mobile-first responsive design

## Data Architecture

### Dual-Source Pattern
The application uses a sophisticated fallback system:
1. **Primary**: Homepage-specific tables (`homepage_sections`, `homepage_section_items`, `homepage_hero_content`, etc.)
2. **Fallback**: Legacy tables (`homepage_products`, `products`, `content_sections`)
3. **Final Fallback**: Mock data from `lib/mock-data.ts`

This ensures the site works even without database access.

### New Homepage Sections Architecture
- **`homepage_sections`**: Configurable sections with layout types (featured/grid)
- **`homepage_section_items`**: Products within sections with sort order
- Replaces the old `homepage_products` table
- Migration script available: `20241108190000_homepage_sections.sql`
- Supports:
  - Drag & drop reordering
  - Multiple layout types
  - Category filtering
  - Custom CTAs
  - Background colors
  - Product limits

### Homepage Configuration
- Stored in `data/homepage-settings.json`
- Settings:
  - `use_mock_data`: Toggle between mock data and database
  - `use_new_homepage_sections`: Enable new sections architecture
- Configurable via admin panel at `/api/admin/content/settings`
- Allows development without database setup
- Read via `lib/homepage-settings.ts`

## Development Modes

### With Database (Supabase or Local)
- Full admin functionality
- Real-time content updates
- Image uploads to storage
- User authentication
- Homepage sections management
- Activity logging

### Without Database (Mock Mode)
- Static mock data from `lib/mock-data.ts`
- No admin access needed
- Perfect for frontend development
- Fast iteration on UI/UX
- Homepage renders with default sections
- All components work with placeholders

### Hybrid Mode
- Database available but using mock data (via settings)
- Useful for testing fallback behavior
- Admin can toggle via settings API

## Deployment Considerations
- Vercel recommended for production
- Environment variables required for database
- ISR ensures fast page loads
- Image optimization via Next.js
- Graceful degradation if database unavailable
