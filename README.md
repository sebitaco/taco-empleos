# Taco Empleos

Platform for hospitality job listings in Mexico.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env.local` and fill in your environment variables:
```bash
cp .env.example .env.local
```

3. Run development server:
```bash
npm run dev
```

## Deployment

This project is configured for Vercel deployment with:
- Preview deployments on PRs
- Production deployment on main branch
- Environment variable groups for different environments

## Tech Stack

- Next.js 14 (App Router)
- React 18
- JavaScript
- Tailwind CSS
- Drizzle ORM
- PostgreSQL (Neon)