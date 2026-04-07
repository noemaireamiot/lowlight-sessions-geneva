# The Lowlight Sessions — Geneva

Intimate music sessions in private apartments in Geneva.

## Getting started

```bash
nvm use           # Use the correct Node version
npm install       # Install dependencies
npm run dev       # Start dev server at http://localhost:3000
```

## Tech stack

- **Next.js 16.2** (App Router, TypeScript)
- **Tailwind CSS v4**
- **Supabase** (database, to be connected)
- **Netlify** (deployment)

## Environment variables

Copy `.env.dist` to `.env` and fill in the values:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```
