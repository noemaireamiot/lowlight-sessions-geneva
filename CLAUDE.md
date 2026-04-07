# The Lowlight Sessions - Geneva

## Project overview

Website for booking intimate music sessions in Geneva. Musicians perform in a private apartment — small, intimate events ("lowlight sessions").

**URL:** https://thelowlightsessions.netlify.app/
**Hosting:** Netlify (connected via GitHub)

## Tech stack

- **Framework:** Next.js 16.2 (App Router, TypeScript)
- **Styling:** Tailwind CSS v4
- **Database:** Supabase (new project — to be configured)
- **Package manager:** npm
- **Deployment:** Netlify

## Architecture

### Public site (single page)
- Landing page presenting "The Lowlight Sessions" concept
- Lists upcoming events fetched from Supabase
- Each event displays: name, short description, date, time, and a ticketing link (external redirect)
- No ticketing logic — just a link to an external ticketing platform

### Admin section
- Separate route(s) for content management
- CRUD for events (create, edit, delete)
- Auth/access method TBD

### Event data model
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| name | string | Event name |
| description | string | Short description |
| date | date | Event date |
| time | time | Event time |
| ticketing_url | string | External ticketing link |
| created_at | timestamp | Auto-generated |

### Internationalization (i18n)
5 languages supported:
- French (fr) — default
- English (en)
- Italian (it)
- German (de)
- Spanish (es)

## Commands

```bash
npm run dev    # Start dev server
npm run build  # Production build
npm run start  # Start production server
npm run lint   # Run ESLint
```

## Environment variables

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Guidelines

- Do NOT reference or take inspiration from the old codebase (Vite/React). It has been fully deleted.
- Keep the design modern, minimal, and elegant — fitting the intimate/lowlight atmosphere.
- Use App Router conventions (layout.tsx, page.tsx, loading.tsx, etc.)
- Server Components by default, Client Components only when needed.
