## Supabase migration/reset workflow

Follow these steps to (re)create the database and seed an initial user without losing control over auth:

1) Install CLI and login
```
brew install supabase
supabase --version
supabase login
```

2) Link to the project
```
supabase link --project-ref [yourProjectRef]
```

3) Reset database schema only (skip seed on reset)
```
supabase db reset --linked --no-seed
```

4) Export env vars for Admin API (service role)
```
export SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
export SUPABASE_URL=your_project_url
```

5) Create or recreate the initial user (idempotent)
```
node scripts/supabaseCreateUser.mjs
```
You can update the target email/password inside `scripts/supabaseCreateUser.mjs`.

6) Update seed to point to the user and run it
- In `supabase/seed.sql`, set the desired `user_id` explicitly or adjust to select by email if preferred.
- Execute the SQL in the Supabase SQL Editor (or `psql`) to load programs, phases, and exercises linked to that user.

Notes:
- Using `--no-seed` prevents automatic seeds on reset; you control when to insert data.
- Keep the service role key out of the frontend; only use it for server-side scripts.
