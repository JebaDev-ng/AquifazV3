# Product Overview

PrintShop is a modern e-commerce platform for a print shop (gráfica), inspired by the minimalist design of LS.Graphics.

## Core Purpose
- Online store for print products (business cards, flyers, banners, etc.)
- B2C and B2B sales
- Custom print orders with WhatsApp integration
- Clean, minimalist user experience

## Key Features

### Public Features
- Product catalog with categories (cartões, flyers, banners, adesivos, etc.)
- Shopping cart and checkout system
- User authentication and order management
- Dark/light theme support
- Responsive design (mobile-first)
- WhatsApp integration for customer support
- ISR for optimal performance (1-hour revalidation)

### Admin Features
- Complete admin dashboard at `/admin`
- **All admin features follow homepage data architecture** (dual-source pattern)
- Product management (CRUD operations)
- Category management
- Content management:
  - Hero section editor
  - Banner section editor
  - Pricing section editor
- Media library with upload management
- Homepage product curation
- Mock data toggle for development
- Admin authentication system
- Graceful fallback to mock data in all features

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
1. **Primary**: Homepage-specific tables (`homepage_products`, `homepage_hero_content`, etc.)
2. **Fallback**: Legacy tables (`products`, `content_sections`)
3. **Final Fallback**: Mock data from `lib/mock-data.ts`

This ensures the site works even without database access.

### Homepage Configuration
- Stored in `data/homepage-settings.json`
- Toggle between mock data and database
- Configurable via admin panel
- Allows development without database setup

## Development Modes

### With Database (Supabase or Local)
- Full admin functionality
- Real-time content updates
- Image uploads to storage
- User authentication

### Without Database (Mock Mode)
- Static mock data
- No admin access needed
- Perfect for frontend development
- Fast iteration on UI/UX

## Deployment Considerations
- Vercel recommended for production
- Environment variables required for database
- ISR ensures fast page loads
- Image optimization via Next.js
- Graceful degradation if database unavailable
