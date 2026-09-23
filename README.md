# Personal Website

A portfolio and editorial platform built with Next.js, Supabase, Prisma, and Tailwind. The app includes a public portfolio, article publishing, project showcase, dashboard, and admin tools.

## Features

- Public portfolio homepage and about page
- Article browsing, article detail pages, reactions, and comments
- Project showcase with media galleries and live links
- Auth flows for login, registration, and password reset
- User dashboard and admin management panel
- Supabase-based storage, auth, and session middleware

## Project structure

```text
app/
  (auth)/             Login, registration, password recovery, and OAuth callback
  (public)/           Public portfolio pages, articles, and projects
  (app)/              Dashboard, profile, and admin workspace
  api/                Comment, reaction, upload, TTS, and OG endpoints
components/
  admin/              Admin-specific panels and sidebar
  ...                 Shared UI components
lib/
  actions/            Domain-based server actions
  auth/               Auth helpers
  security/           Validation, sanitization, CSRF, and rate limiting
  supabase/           Supabase clients, storage logic, URL helpers, and middleware
  i18n/               Language context and dictionaries
prisma/
  schema.prisma       Database schema
  migrations/         Prisma migration history
public/
  ...                 Static assets, icons, animations, and generated media
```

Route groups in parentheses are internal organization only. They do not change public URLs; for example, `(auth)/login` still resolves to `/login`, and `(app)/dashboard` still resolves to `/dashboard`.

## Routes and naming

The app uses English public route names for clarity:

- `/dashboard`
- `/about`
- `/articles`
- `/projects`
- `/profile`
- `/login`
- `/register`
- `/forgot-password`

Legacy Indonesian routes redirect to their English equivalents via the Next.js redirect config.

## Setup

Install dependencies and generate the Prisma client:

```bash
npm install
npx prisma generate
```

Apply migrations and run production build:

```bash
npx prisma migrate deploy
npm run build
```

Start the app locally:

```bash
npm run dev
```

## Environment variables

The app expects Supabase credentials and other runtime settings to be configured in your environment. Typical variables include:

```text
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
DATABASE_URL=...
OWNER_EMAIL=...
ADMIN_EMAILS=...
```

Optional rate-limit configuration for a multi-instance deployment:

```text
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

If these are not configured, the app gracefully falls back to an in-memory limiter for local development.
