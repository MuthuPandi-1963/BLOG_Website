# Overview

GlobalNews is a full-stack news aggregation web application that provides users with real-time global news updates. The platform features user authentication via Replit Auth, news browsing by country and category, bookmarking functionality, commenting system, and admin management capabilities. Built with modern web technologies, it combines a React frontend with an Express.js backend and PostgreSQL database.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development builds
- **UI Library**: Radix UI primitives with shadcn/ui components for consistent design
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation for type-safe form handling

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API endpoints with structured error handling
- **Middleware**: Session management, request logging, and error handling middleware
- **Build System**: ESBuild for production bundling with platform-specific optimizations

## Database Layer
- **Database**: PostgreSQL with Neon serverless connection pooling
- **ORM**: Drizzle ORM for type-safe database operations and schema management
- **Schema**: Structured tables for users, articles, bookmarks, comments, and sessions
- **Migrations**: Drizzle Kit for database schema migrations and version control

## Authentication System
- **Provider**: Replit Auth with OpenID Connect (OIDC) integration
- **Session Management**: Express sessions with PostgreSQL session store
- **Authorization**: Role-based access control with admin privileges
- **Security**: HTTP-only cookies, CSRF protection, and secure session handling

## News Integration
- **External API**: NewsAPI.org integration for fetching real-time news articles
- **Data Processing**: Article normalization and deduplication before database storage
- **Caching Strategy**: Database-first approach with API fallback for missing content
- **Country/Category Filtering**: Support for multiple countries and news categories

## Key Features
- **User Management**: Registration, authentication, and profile management
- **Content Browsing**: Country and category-based news filtering with pagination
- **Social Features**: Article bookmarking and commenting system
- **Search Functionality**: Full-text search across articles with country filtering
- **Admin Panel**: User and content management with statistics dashboard
- **Responsive Design**: Mobile-first design with adaptive layouts

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **connect-pg-simple**: PostgreSQL session store for Express sessions

## News Data
- **NewsAPI.org**: Primary news content provider with country and category filtering
- **Article Sources**: Aggregated content from multiple international news sources

## Authentication
- **Replit Auth**: OpenID Connect authentication provider
- **Passport.js**: Authentication middleware with OpenID Connect strategy

## UI Components
- **Radix UI**: Headless UI primitives for accessible component foundation
- **Lucide React**: Icon library for consistent iconography
- **React Hook Form**: Form state management and validation
- **Zod**: Runtime type validation and schema definition

## Development Tools
- **Vite**: Development server and build tool with HMR support
- **TypeScript**: Static type checking and enhanced developer experience
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **Replit Development**: Integration with Replit's development environment and deployment