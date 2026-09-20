## Project Structure

```text
app/
	(authentication)/  Login, register, forgot password, OAuth callback
	(content)/         Public portfolio, articles, projects, legal pages
	(workspace)/       Dashboard, profile, and admin workspace
	api/               Route Handlers for comments, reactions, upload, TTS, OG
components/          Shared UI components; admin UI lives in components/admin
lib/
	actions/           Server Actions grouped by domain
	auth/              Authenticated-user helpers
	security/          Input validation, sanitization, CSRF, rate limiting
	supabase/           Supabase clients, middleware, storage, URL helpers
	i18n/              Language context and dictionaries
prisma/              Database schema and migrations
public/              Static images and animations
```

Route group names in parentheses are internal organization only. They do not change public URLs: `(authentication)/login` is still `/login`, and `(workspace)/dashboard` is still `/dashboard`.

Naming convention: public route folders use the existing Indonesian URLs (`artikel`, `proyek`), while code files describe their role explicitly (`artikel-detail-client.tsx`, `proyek-list-client.tsx`).

## Deployment

Generate Prisma Client and apply committed migrations before starting the app:

```bash
npx prisma generate
npx prisma migrate deploy
npm run build
```

For rate limiting shared across multiple production instances, configure these optional environment variables:

```text
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

Without them, the app falls back to an in-memory limiter, which is suitable for local development but not consistent across server instances.
