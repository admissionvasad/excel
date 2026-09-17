# Atlas College ERP

Atlas is a multi-college education ERP workspace based on the requirements in [README.MD](README.MD).

## Current Working Modules

- Five seeded colleges: `COL001` through `COL005`
- College-scoped departments and courses
- Course intake and ACPC code management
- College-scoped student master
- Duplicate enrollment validation
- Persistent local data store at `data/erp-data.json`
- Responsive dashboard and college switcher

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Supabase

1. Create a Supabase project.
2. Copy `.env.example` to `.env`.
3. Set `PUBLIC_SUPABASE_URL` and the server-only `SUPABASE_SERVICE_ROLE_KEY`.
4. Run `supabase/migrations/001_erp_core.sql` in the Supabase SQL editor or with the Supabase CLI.
5. Start the app with `npm run dev`.

The API reports its active storage mode from `/api/bootstrap`: `supabase` when configured, otherwise `local`. Never expose `SUPABASE_SERVICE_ROLE_KEY` in browser code or commit `.env`.

The migration creates tenant-scoped colleges, departments, courses, and students with Row Level Security. `SUPER_ADMIN` can access all colleges; other users are restricted to the `college_id` stored in `public.profiles`.