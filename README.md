# UniHelp

UniHelp is a bilingual university support platform for campus maintenance reporting and lost-and-found item management. The existing React application supports Arabic (RTL) and English (LTR), report tracking, claim review screens, notifications, and an administrative workspace.

## Features

- Maintenance report creation, listing, status updates, and technician assignment.
- Lost and found item creation and public catalog browsing.
- Claim submission and administrative review.
- Supabase-backed notifications and profile connectivity diagnostics.
- Arabic and English interface with direction switching.
- Responsive Vite single-page application.

## Technologies

- React 18 and TypeScript
- Vite
- Supabase JavaScript client (`@supabase/supabase-js`)
- React Router
- Tailwind CSS and Lucide React

## Requirements

- Node.js 18 or newer
- pnpm (the repository includes `pnpm-lock.yaml`)
- A Supabase project configured with the tables and Row Level Security policies expected by `supabase/schema.sql`

## Install and run locally

```sh
pnpm install
pnpm dev
```

Vite prints the local URL after startup (the configured development port is 3000).

## Environment variables

Copy `.env.example` to `.env` in the project root and fill in the values from the existing Supabase project's API settings:

```dotenv
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Do not put a Supabase `service_role` key in a Vite environment variable or commit `.env`. The client app must use the public anon key and rely on the database's RLS policies.

When these values are missing, the app reports that the database is unavailable; it does not switch to demo records or local storage.

## Supabase configuration

The application expects these existing tables and columns as described in [`supabase/schema.sql`](./supabase/schema.sql):

- `profiles`
- `reports`
- `lost_found_items`
- `claim_requests`
- `notifications`

The schema file is documentation of the expected current database shape. Review it against the actual Supabase project before applying any SQL. This project does not automatically run migrations or modify the database schema.

Operations may be rejected by the existing RLS policies. In particular, user-specific claims and notifications require an authenticated Supabase user linked to a profile, and the included schema has no notification update policy. Supabase Storage configuration is also needed before local uploaded image files can be persisted as hosted image URLs.

The existing sign-in, registration, role selector, and profile editor still use the project's client-side `AuthContext` and local storage; they are not Supabase Authentication. Do not deploy the current role-based screens as an authorization boundary. Production use requires connecting those flows to Supabase Auth and provisioning profiles under policies approved for the existing database.

## Production build

```sh
pnpm build
pnpm preview
```

The production output is written to `dist/`.

## Deploy to Vercel

1. Import the existing project repository into Vercel.
2. Set the build command to `pnpm build` and the output directory to `dist`.
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the Vercel project's environment-variable settings for each deployment environment.
4. Deploy only after confirming the Supabase project, RLS policies, and production environment variables.

The repository includes a Vercel rewrite for the React Router single-page routes. No deployment is performed by this project setup.
