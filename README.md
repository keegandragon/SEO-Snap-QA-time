# SEO Snap - AI-Powered Product Description Generator

Transform your product photos into compelling, SEO-optimized descriptions with the power of AI.

## Features
- AI-powered product description generation
- SEO optimization with tags and metadata
- Multiple subscription plans (Free, Starter, Pro)
- Image upload and processing
- Email sharing functionality
- CSV export (Pro feature)

## Tech Stack
- React + TypeScript
- Vite
- Tailwind CSS
- Supabase (Database, Auth, Storage, Edge Functions)
- Stripe (Payments)
- Google Gemini AI (Description generation)

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see .env.example)
4. Run development server: `npm run dev`

## Environment Variables
Create a `.env` file with:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Deployment
This project is configured for deployment on Netlify with Supabase backend.