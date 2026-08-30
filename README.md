# Delhi News Live — Digital Broadsheet Newspaper

An authentic, single-scroll broadsheet newspaper web application featuring continuous newspaper layout, video clippings section, and real-time backend powered by **Supabase**.

## Tech Stack
- **Frontend:** Vanilla HTML5, CSS3 (Broadsheet design system), JavaScript (ES6+ modular controllers)
- **Design System:** Custom newsprint hairline grid system with vintage typography
- **Backend / Database:** Supabase (PostgreSQL with Row-Level Security & Realtime subscriptions)
- **Auth:** Supabase Authentication

## Deployment on Vercel
1. Import this repository into [Vercel](https://vercel.com).
2. Framework Preset: **Other** (Static site).
3. Root Directory: `./`
4. Click **Deploy**.

## Supabase Database Setup
1. In your [Supabase Dashboard](https://supabase.com/dashboard), open the **SQL Editor**.
2. Run the script provided in `supabase_schema.sql`.
3. Under **Authentication -> Users**, create your editor user account to access the Newsroom Desk (`#/auth`).
