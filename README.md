# eXobe E-Commerce Platform API

<p align="center">
  <img src="../public/eXobe Main Logo - Red & Black.png" width="200" alt="eXobe Logo" />
</p>

## Description

The eXobe E-Commerce Platform API is a robust, scalable backend solution built with NestJS and GraphQL. This API powers a comprehensive multi-vendor e-commerce marketplace with advanced features for product management, order processing, vendor operations, and customer engagement.

## Features

### Core Functionality
- **Multi-Vendor Support**: Complete vendor management system with applications, profiles, and account management
- **Product Catalog**: Advanced product management with categories, collections, variants, specifications, and inventory tracking
- **Order Management**: Full order lifecycle management with support for multiple fulfillment methods
- **Customer Portal**: User accounts, wishlists, reviews, and order history
- **Secure Authentication**: JWT-based authentication with role-based access control (RBAC)

### Advanced Features
- **GraphQL API**: Type-safe, efficient data fetching with Apollo Server
- **Analytics**: Comprehensive event tracking and user engagement metrics
- **Email Notifications**: Automated transactional emails with Postmark integration
- **Document Generation**: Dynamic PDF generation for invoices, receipts, and shipping labels
- **File Storage**: Integrated with Supabase for secure file management
- **News & Content Management**: CMS features for blogs, articles, and announcements
- **Contact & Applications**: Customer support and vendor application processing

### Technical Features
- **Database**: PostgreSQL with Prisma ORM for type-safe database access
- **Performance**: Built on Fastify for superior performance
- **Security**: Rate limiting, Helmet integration, and secure password hashing with bcrypt
- **Validation**: Input validation with class-validator and Zod
- **Type Safety**: Full TypeScript implementation with strict typing

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Yarn package manager
- Supabase account (for file storage)
- Postmark account (for email notifications)

## Project Setup

### 1. Install Dependencies

```bash
$ yarn install
```

### 2. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/exobe"
DIRECT_URL="postgresql://user:password@localhost:5432/exobe"

# JWT Authentication
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"

# Supabase Storage
SUPABASE_URL="your-supabase-url"
SUPABASE_KEY="your-supabase-key"
SUPABASE_BUCKET="your-bucket-name"

# Email (Postmark)
POSTMARK_API_KEY="your-postmark-api-key"
POSTMARK_FROM_EMAIL="noreply@yourdomain.com"

# Application
PORT=4000
NODE_ENV="development"
```

### 3. Database Setup

```bash
# Generate Prisma client
$ yarn prisma generate

# Run database migrations
$ yarn prisma migrate deploy

# (Optional) Seed database with initial data
$ yarn prisma db seed
```

## Running the Application

```bash
# Development mode with hot-reload
$ yarn start:dev

# Production mode
$ yarn start:prod

# Debug mode
$ yarn start:debug
```

The GraphQL playground will be available at `http://localhost:4000/graphql`

## Database Management

```bash
# Open Prisma Studio (Database GUI)
$ yarn prisma studio

# Create a new migration
$ yarn prisma migrate dev --name migration_name

# Reset database (⚠️ Warning: This will delete all data)
$ yarn prisma migrate reset
```

## Testing

```bash
# Unit tests
$ yarn test

# E2E tests
$ yarn test:e2e

# Test coverage
$ yarn test:cov

# Watch mode
$ yarn test:watch
```

## API Documentation

The API uses GraphQL. Once the server is running, you can access:

- **GraphQL Playground**: `http://localhost:4000/graphql`
- **GraphQL Schema**: Auto-generated at `src/schema.gql`

## Project Structure

```
api/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── src/
│   ├── analytics/             # Analytics and tracking
│   ├── applications/          # Vendor applications
│   ├── auth/                  # Authentication & authorization
│   ├── catalog/               # Product catalog management
│   ├── contact/               # Contact forms & inquiries
│   ├── email/                 # Email service & templates
│   ├── graphql/               # GraphQL resolvers & DTOs
│   ├── news/                  # News & content management
│   ├── prisma/                # Prisma service
│   ├── storage/               # File storage service
│   ├── users/                 # User management
│   └── main.ts                # Application entry point
└── dist/                      # Compiled output
```

## Key Technologies

- **[NestJS](https://nestjs.com/)** - Progressive Node.js framework
- **[GraphQL](https://graphql.org/)** - Query language for APIs
- **[Apollo Server](https://www.apollographql.com/)** - GraphQL server
- **[Prisma](https://www.prisma.io/)** - Next-generation ORM
- **[PostgreSQL](https://www.postgresql.org/)** - Relational database
- **[Fastify](https://www.fastify.io/)** - High-performance web framework
- **[Supabase](https://supabase.com/)** - File storage and backend services
- **[Postmark](https://postmarkapp.com/)** - Transactional email delivery
- **[JWT](https://jwt.io/)** - Secure authentication tokens

## Deployment

This application is deployed on [Vercel](https://vercel.com/) with the configuration specified in `vercel.json`.

### Deploy to Production

1. Ensure all environment variables are set in your hosting platform
2. Build the application:
   ```bash
   $ yarn build
   ```
3. Start the production server:
   ```bash
   $ yarn start:prod
   ```

## Author

- **Alex Sexwale**

## License

UNLICENSED - Private and proprietary code.
