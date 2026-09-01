# Delhi News Live — Digital Broadsheet Newspaper

An authentic, single-scroll broadsheet newspaper web application featuring continuous newspaper layout, video clippings section, breaking news alerts, repositionable story layouts, view tracking, and real-time backend powered by **Supabase**.

## Tech Stack
- **Frontend:** Vanilla HTML5, CSS3 (Broadsheet design system), JavaScript (ES6+ modular controllers)
- **Design System:** Custom newsprint hairline grid system with vintage typography
- **Backend / Database:** Supabase (PostgreSQL with Row-Level Security & Realtime subscriptions)
- **Auth:** Supabase Authentication (Email/Password)
- **Hosting:** Hostinger Single / Static Web Hosting (pure client-side browser + Supabase architecture)

## Deployment (Hostinger Single / Static Hosting)
1. Upload all files from this project directory to your `public_html` directory via FTP / File Manager.
2. The application runs entirely on static files and client-side JavaScript connecting directly to your Supabase project.

## Newsroom Access
- Access the secure editorial desk at: `/#/admin` (e.g. `https://yourdomain.com/#/admin`).
- Unauthenticated visitors will see the login form. Authenticate with your Supabase editor credentials to manage stories, video clippings, breaking news alerts, and site settings.

## Supabase Database Setup
1. In your [Supabase Dashboard](https://supabase.com/dashboard), open the **SQL Editor**.
2. Run the migration script in `supabase_schema.sql`.
3. Under **Authentication -> Users**, create your editor user account to sign into the Newsroom Desk.
