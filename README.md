# Dr. Shikha's Homoeo Clinic

Enterprise React 19 + Vite clinic web application upgraded from the existing Netlify static website.

## Setup

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and add Firebase credentials.
3. Run locally: `npm run dev`
4. Build for Netlify: `npm run build`

## Admin

Create an admin user in Firebase Authentication. The `/admin/login` route signs in with email/password and unlocks dashboard modules for homepage, doctor profile, services, blog, gallery, reviews, appointments, SEO, settings, and uploads.

## Deploy

The included `netlify.toml` builds `dist` and redirects all routes to React Router.
