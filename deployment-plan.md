# Deployment Plan: Local Development on Port 8000 + Vercel with GitHub Integration

## Overview
This plan outlines the steps to configure your Next.js application to run locally on port 8000 and deploy to Vercel with automatic GitHub integration.

## Step 1: Configure Local Development on Port 8000

### Update package.json
Modify the `dev` script in package.json to specify port 8000:

```json
"scripts": {
  "dev": "next dev --turbopack -p 8000",
  "dev:8000": "next dev --turbopack -p 8000",
  "build": "next build --turbopack",
  "start": "next start -p 8000",
  "lint": "eslint",
  "test": "jest",
  "test:watch": "jest --watch",
  "prisma:generate": "prisma generate",
  "prisma:studio": "prisma studio"
}
```

### Alternative: Create .env.local file
Create or update `.env.local` with:
```
PORT=8000
```

## Step 2: Environment Variables for Deployment

### Required Environment Variables
Create `.env.example` with the following variables:
```
# Database
DATABASE_URL="your_database_url_here"

# NextAuth
NEXTAUTH_URL="http://localhost:8000"
NEXTAUTH_SECRET="your_nextauth_secret_here"

# Stripe
STRIPE_PUBLIC_KEY="your_stripe_public_key"
STRIPE_SECRET_KEY="your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="your_stripe_webhook_secret"

# Sentry (if using)
SENTRY_DSN="your_sentry_dsn"
```

### Vercel Environment Variables
In Vercel dashboard, set:
- `DATABASE_URL` (production)
- `NEXTAUTH_URL` (production URL)
- `NEXTAUTH_SECRET` (generate with: `openssl rand -base64 32`)
- `STRIPE_PUBLIC_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `SENTRY_DSN`

## Step 3: Vercel Configuration

### Create vercel.json
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

## Step 4: GitHub Integration Setup

### Prerequisites
- Ensure your project is a Git repository
- Push your code to GitHub
- Have a Vercel account

### Steps to Connect GitHub to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Vercel will automatically detect it's a Next.js project
5. Configure environment variables in Vercel dashboard
6. Click "Deploy"

### Automatic Deployments
- Every push to main branch will trigger a production deployment
- Every push to other branches will trigger preview deployments
- Pull requests will automatically get preview URLs

## Step 5: Local Development Commands

### Start Local Development
```bash
# Install dependencies
npm install

# Start development server on port 8000
npm run dev

# Alternative command
npm run dev:8000

# Generate Prisma client
npm run prisma:generate

# Run Prisma Studio (database management)
npm run prisma:studio
```

### Build and Test Locally
```bash
# Build for production
npm run build

# Start production server locally on port 8000
npm run start
```

## Step 6: Deployment Workflow

### Initial Setup
1. Commit and push all changes to GitHub
2. Connect repository to Vercel
3. Configure environment variables in Vercel
4. Deploy to production

### Ongoing Development
1. Make changes locally
2. Test on `http://localhost:8000`
3. Commit and push to GitHub
4. Vercel automatically deploys
5. Preview URL available for pull requests
6. Production updates when merging to main

## Step 7: Verification Checklist

### Local Development
- [ ] Application runs on `http://localhost:8000`
- [ ] All pages load correctly
- [ ] Database connection works
- [ ] Authentication functions properly
- [ ] Stripe integration works (if applicable)

### Vercel Deployment
- [ ] Site deploys successfully
- [ ] Production URL loads correctly
- [ ] Environment variables are properly configured
- [ ] Database connection works in production
- [ ] Authentication works in production
- [ ] Stripe webhooks are configured (if applicable)
- [ ] GitHub integration is working (auto-deploy on push)

## Troubleshooting

### Common Issues
1. **Port already in use**: Kill process on port 8000 or use different port
2. **Environment variables not loading**: Check `.env.local` file and Vercel settings
3. **Build errors**: Check logs in Vercel dashboard
4. **Database connection issues**: Verify DATABASE_URL in both local and production

### Useful Commands
```bash
# Check what's running on port 8000
lsof -i :8000

# Kill process on port 8000 (macOS/Linux)
kill -9 $(lsof -t -i:8000)

# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

After completing this setup:
1. Your app will run locally on `http://localhost:8000`
2. Your app will be deployed to Vercel with a URL like `your-app.vercel.app`
3. Every GitHub push will trigger automatic deployments
4. Preview deployments will be created for pull requests
5. You can configure a custom domain in Vercel settings if needed