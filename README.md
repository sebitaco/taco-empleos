# Taco Empleos - Waitlist v1.3

A modern job board platform for the hospitality industry in Mexico. This is the waitlist/landing page version that collects signups from both job seekers and employers.

## Features

- 🎯 **Dual-audience waitlist** - Separate flows for candidates and employers
- 🔒 **Zero-auth** - No signup required to browse, minimal friction
- 🛡️ **Security-first** - Rate limiting, CAPTCHA, security headers
- 📱 **Mobile-optimized** - Responsive design across all devices
- 🚀 **Performance** - Fast loading with optimized images and assets
- 📊 **Analytics** - Privacy-friendly tracking with Plausible
- 🎨 **Modern UI** - Built with Tailwind CSS and Radix UI components

## Tech Stack

- **Framework**: Next.js 14 (App Router) with JavaScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Not required (waitlist only)
- **Spam Protection**: Cloudflare Turnstile
- **Rate Limiting**: Upstash Redis
- **Analytics**: Plausible (privacy-friendly)
- **Deployment**: Vercel

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.local.example .env.local
   ```

3. **Set up Supabase database**:
   - Create a new Supabase project
   - Run the SQL from `supabase/schema.sql` in the SQL editor
   - Update your `.env.local` with the project credentials

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## Deployment

This project is configured for Vercel deployment with:
- Preview deployments on PRs
- Production deployment on main branch
- Environment variable groups for different environments

## Security Features

- **Rate Limiting**: 3 requests per 15 minutes, 10 per day per IP
- **CAPTCHA**: Cloudflare Turnstile bot protection
- **CSP Headers**: Content Security Policy prevents XSS
- **Input Validation**: Server-side validation for all form inputs
- **SQL Injection Protection**: Parameterized queries via Supabase