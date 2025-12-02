# PayPal Login Page Demo

## Overview

This is a demonstration project that replicates the PayPal login page interface. The application is built as a full-stack TypeScript application with a React frontend and Express backend, designed to showcase pixel-perfect UI replication of PayPal's authentication flow. This is a demo application - no actual authentication or payment processing occurs.

The project implements a two-step login flow (email entry followed by password entry) with responsive design matching PayPal's current visual standards.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript, using functional components and hooks.

**Routing**: Wouter for client-side routing (lightweight alternative to React Router).

**UI Component Library**: shadcn/ui components built on Radix UI primitives, providing accessible, unstyled components that are customized with Tailwind CSS.

**State Management**: 
- React hooks (useState, useEffect) for local component state
- TanStack Query (React Query) for server state management and data fetching
- Form state managed locally within the login page component

**Styling Approach**: 
- Tailwind CSS as the primary styling solution
- Custom CSS variables defined in `index.css` for PayPal brand colors
- Design system variables including elevation shadows, border styles, and color tokens
- Component variants using class-variance-authority (cva) for systematic component styling

**Design System**: Custom PayPal-themed design following the specifications in `design_guidelines.md`:
- Primary blue (#0070ba) for brand elements
- Neutral gray backgrounds (#f5f7fa)
- Precise typography and spacing matching PayPal's interface
- Shadow system for elevation and depth

**Build Tool**: Vite for fast development and optimized production builds with Hot Module Replacement (HMR).

### Backend Architecture

**Framework**: Express.js server with TypeScript.

**Server Structure**:
- `server/index.ts`: Main server entry point with middleware setup and request logging
- `server/routes.ts`: Route registration (currently minimal, ready for API endpoints)
- `server/storage.ts`: Storage abstraction layer with in-memory implementation
- `server/static.ts`: Static file serving for production builds
- `server/vite.ts`: Development server integration with Vite middleware

**Storage Pattern**: Abstract storage interface (`IStorage`) with in-memory implementation (`MemStorage`). This pattern allows easy swapping to database-backed storage without changing route handlers.

**Request Handling**:
- JSON body parsing with raw body preservation for webhook verification
- URL-encoded form data support
- Request logging middleware tracking method, path, status, duration, and response data

**Development vs Production**:
- Development: Vite middleware integrated directly into Express for HMR
- Production: Static file serving from pre-built `dist/public` directory

### Database Design

**ORM**: Drizzle ORM configured for PostgreSQL (via `@neondatabase/serverless`).

**Schema**: Simple user table defined in `shared/schema.ts`:
- `id`: UUID primary key (auto-generated)
- `username`: Unique text field
- `password`: Text field (in production would be hashed)

**Validation**: Zod schemas derived from Drizzle schema using `drizzle-zod` for type-safe validation.

**Current Implementation**: In-memory storage for demo purposes. Database configuration is present but not actively used, allowing easy migration to persistent storage.

### Build System

**Development Build**:
- TypeScript compilation via tsx (no emit, type checking only)
- Vite dev server with HMR
- Replit-specific plugins for error overlays and development tooling

**Production Build** (`script/build.ts`):
- Client: Vite builds React app to `dist/public`
- Server: esbuild bundles server code to `dist/index.cjs`
- Selective bundling: Common dependencies (Drizzle, Express, Neon, etc.) are bundled to reduce file system calls and improve cold start performance
- External packages excluded from bundle for faster builds

**Path Aliases**:
- `@/*`: Client source files (`client/src`)
- `@shared/*`: Shared code between client and server
- `@assets/*`: Static assets directory

### Type Safety

**Shared Types**: Database schemas and validation schemas live in `shared/schema.ts`, ensuring type consistency between frontend and backend.

**Strict TypeScript**: Enabled with strict mode, ESNext module resolution, and bundler module resolution strategy.

**API Types**: API responses and requests use inferred types from Zod schemas for end-to-end type safety.

## External Dependencies

### UI & Styling

- **Radix UI**: Headless component primitives (@radix-ui/react-*) for accessible UI components
- **Tailwind CSS**: Utility-first CSS framework with PostCSS processing
- **class-variance-authority**: Type-safe component variant management
- **clsx & tailwind-merge**: Conditional className utilities

### State & Data Fetching

- **TanStack Query**: Server state management with automatic caching, refetching, and synchronization
- **React Hook Form**: Form state management with @hookform/resolvers for validation
- **Zod**: Schema validation library used throughout the application

### Database & ORM

- **Drizzle ORM**: TypeScript ORM with PostgreSQL dialect
- **@neondatabase/serverless**: Serverless PostgreSQL driver for Neon database
- **drizzle-zod**: Automatic Zod schema generation from Drizzle schemas

### Backend Services

- **Express**: Web application framework
- **connect-pg-simple**: PostgreSQL session store (configured but not actively used)

### Development Tools

- **Vite**: Frontend build tool and dev server
- **esbuild**: Fast JavaScript bundler for server code
- **tsx**: TypeScript execution for development
- **@replit/vite-plugin-***: Replit-specific development tooling (error overlay, cartographer, dev banner)

### Utilities

- **date-fns**: Date manipulation library
- **lucide-react**: Icon library
- **wouter**: Lightweight routing library
- **embla-carousel-react**: Carousel component (included in shadcn/ui components)
- **cmdk**: Command menu component
- **nanoid**: Unique ID generation