# Deployment Guide

This guide will help you deploy your Plumbing Business Web App to production.

## Quick Deploy Options

### Option 1: Railway (Recommended for SQLite)

Railway is perfect for this app because it supports SQLite with persistent volumes.

#### Steps:

1. **Create a Railway account** at [railway.app](https://railway.app)

2. **Install Railway CLI** (optional, but recommended):
   ```bash
   npm install -g @railway/cli
   ```

3. **Deploy via GitHub** (easiest method):
   - Push your code to a GitHub repository
   - Go to [railway.app/new](https://railway.app/new)
   - Click "Deploy from GitHub repo"
   - Select your repository
   - Railway will automatically detect Next.js and deploy

4. **Configure Environment Variables**:
   - In Railway dashboard, go to your project
   - Click "Variables"
   - Add: `DATABASE_URL=file:/app/data/prod.db`
   - Railway will automatically set `NODE_ENV=production`

5. **Add Persistent Volume** (important for SQLite):
   - In Railway dashboard, click "Settings"
   - Scroll to "Volumes"
   - Click "Add Volume"
   - Mount path: `/app/data`
   - This ensures your database persists across deployments

6. **Run Database Migration**:
   - In Railway dashboard, go to "Deployments"
   - Click on your latest deployment
   - Open "Deploy Logs"
   - You may need to run migrations manually via Railway CLI:
     ```bash
     railway run npx prisma migrate deploy
     ```

7. **Get Your URL**:
   - Railway will provide a URL like `https://your-app.up.railway.app`
   - You can also add a custom domain in Settings

#### Railway CLI Deployment:

```bash
# Login to Railway
railway login

# Link to existing project or create new
railway link

# Deploy
railway up

# Run migrations
railway run npx prisma migrate deploy

# Seed database (optional)
railway run npm run seed
```

### Option 2: Vercel (Requires PostgreSQL)

Vercel is great for Next.js but doesn't support SQLite. You'll need to use PostgreSQL.

#### Steps:

1. **Update Database to PostgreSQL**:

   Edit `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. **Set up PostgreSQL Database**:
   - Use [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
   - Or [Supabase](https://supabase.com) (free tier available)
   - Or [Neon](https://neon.tech) (free tier available)

3. **Deploy to Vercel**:
   ```bash
   # Install Vercel CLI
   npm install -g vercel

   # Deploy
   vercel

   # Follow prompts to link project
   ```

4. **Configure Environment Variables**:
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add `DATABASE_URL` with your PostgreSQL connection string
   - Example: `postgresql://user:password@host:5432/database?sslmode=require`

5. **Run Migrations**:
   ```bash
   # Generate new migration for PostgreSQL
   npx prisma migrate dev --name switch_to_postgres

   # Deploy migrations
   vercel env pull .env.local
   npx prisma migrate deploy
   ```

### Option 3: DigitalOcean App Platform

1. **Create DigitalOcean account** at [digitalocean.com](https://digitalocean.com)

2. **Create App**:
   - Go to Apps → Create App
   - Connect your GitHub repository
   - DigitalOcean will auto-detect Next.js

3. **Configure**:
   - Build Command: `npm run build`
   - Run Command: `npm start`
   - Add environment variable: `DATABASE_URL=file:./prod.db`

4. **Add Volume** (for SQLite):
   - In app settings, add a volume
   - Mount at `/app/data`

## Post-Deployment Checklist

After deploying, verify everything works:

### 1. Test the Dashboard
- [ ] Visit your deployment URL
- [ ] Verify the dashboard loads
- [ ] Check that statistics are displayed
- [ ] Click on an appointment to view details

### 2. Test API Endpoints
- [ ] Visit `/api-test` on your deployed URL
- [ ] Test each endpoint:
  - Customer Lookup
  - Get Estimate
  - Create Appointment
  - Appointment Lookup

### 3. Connect Your AI Agent

Update your Retell AI agent configuration with your deployment URL:

**Base URL**: `https://your-deployment-url.com/api`

**Endpoints to configure**:
1. `POST /api/appointments` - Create appointment
2. `POST /api/appointments/estimate` - Get estimate
3. `GET /api/customers/lookup?phone={phone}` - Customer lookup
4. `PATCH /api/appointments/{id}` - Update appointment
5. `POST /api/appointments/{id}/cancel` - Cancel appointment
6. `GET /api/appointments/lookup?appointment_id={id}&phone={phone}` - Appointment lookup

### 4. Seed Production Database (Optional)

If you want sample data in production:

```bash
# Railway
railway run npm run seed

# Vercel (using Vercel CLI)
vercel env pull .env.local
npm run seed
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Database connection string | `file:./prod.db` (SQLite) or `postgresql://...` (PostgreSQL) |
| `NODE_ENV` | Environment mode | `production` |

## Custom Domain Setup

### Railway:
1. Go to project Settings → Domains
2. Click "Add Domain"
3. Enter your domain (e.g., `plumber.yourdomain.com`)
4. Add the provided CNAME record to your DNS

### Vercel:
1. Go to project Settings → Domains
2. Click "Add"
3. Enter your domain
4. Follow DNS configuration instructions

## Monitoring & Maintenance

### View Logs

**Railway**:
```bash
railway logs
```

**Vercel**:
- Dashboard → Deployments → Click deployment → View Function Logs

### Database Backup (SQLite)

**Railway**:
```bash
# Download database file
railway run cat /app/data/prod.db > backup.db
```

### Update Deployment

**Railway**:
- Push to GitHub (if using GitHub integration)
- Or run `railway up`

**Vercel**:
- Push to GitHub (auto-deploys)
- Or run `vercel --prod`

## Troubleshooting

### Database Not Persisting (Railway)
- Ensure you've added a volume mounted at `/app/data`
- Check `DATABASE_URL` points to `/app/data/prod.db`

### API Endpoints Return 404
- Verify build completed successfully
- Check deployment logs for errors
- Ensure all files in `app/api/` directory are committed

### Migrations Fail
- Check database connection string
- Ensure database is accessible
- Run `npx prisma generate` before migrations

### Out of Memory Errors
- Increase memory allocation in platform settings
- Railway: Settings → Resources
- Vercel: Automatically scaled

## Security Recommendations

Before going to production:

1. **Add Authentication** (currently not implemented):
   - Use NextAuth.js for dashboard access
   - Protect API endpoints with API keys for AI agent

2. **Rate Limiting**:
   - Add rate limiting to API endpoints
   - Use middleware or services like Upstash

3. **CORS Configuration**:
   - Configure CORS if AI agent calls from different domain
   - Add to `next.config.js`

4. **Environment Variables**:
   - Never commit `.env` files
   - Use platform-specific secret management

5. **Database Backups**:
   - Set up automated backups
   - For SQLite: Regular volume snapshots
   - For PostgreSQL: Use provider's backup features

## Cost Estimates

### Railway
- **Hobby Plan**: $5/month
- Includes: 512MB RAM, shared CPU, 1GB storage
- Good for: Small business, moderate traffic

### Vercel
- **Hobby Plan**: Free
- **Pro Plan**: $20/month
- Note: Requires external database (PostgreSQL)

### DigitalOcean
- **Basic Plan**: $5/month
- Includes: 512MB RAM, 1 vCPU

## Support

For deployment issues:
- Railway: [docs.railway.app](https://docs.railway.app)
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Next.js: [nextjs.org/docs](https://nextjs.org/docs)

For application issues, check the logs and verify all environment variables are set correctly.
