# Railway Deployment Guide

## 🚂 Deploy to Railway

### Step 1: Push to GitHub First

1. Create repo at https://github.com/new
   - Name: `PLUMBERS-demo`
   - Click "Create repository"

2. Push code:
```bash
cd plumber-app
git push -u origin main
```

### Step 2: Deploy on Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose `Dyligentlydone/PLUMBERS-demo`
5. Click "Deploy Now"

### Step 3: Add Environment Variables

Go to your Railway project → **Variables** tab

Add these **EXACT** variables:

#### Required Variables:

```env
DATABASE_URL
```
**Value**: Your Supabase connection string from Step 4 below

```env
NODE_ENV
```
**Value**: `production`

---

### Step 4: Get Your Supabase Connection String

1. Go to your Supabase project dashboard
2. Click **Settings** (gear icon, bottom left)
3. Click **Database** in the left menu
4. Scroll to **Connection string**
5. Click **URI** tab
6. Copy the connection string (looks like):
   ```
   postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```
7. **Replace** `[YOUR-PASSWORD]` with your actual Supabase password

#### Full DATABASE_URL Format:

```
postgresql://postgres.xxxxx:YOUR_ACTUAL_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

**Important Notes**:
- Replace `YOUR_ACTUAL_PASSWORD` with the password you created when setting up Supabase
- Keep `?pgbouncer=true&connection_limit=1` at the end
- Use the **Transaction** pooler (port 6543), not Session pooler

---

### Step 5: Update Prisma Schema (Important!)

Before deploying, we need to switch to the Supabase schema:

```bash
cd plumber-app

# Backup current schema
cp prisma/schema.prisma prisma/schema-sqlite-backup.prisma

# Use Supabase schema
cp prisma/schema-supabase.prisma prisma/schema.prisma

# Commit and push
git add prisma/schema.prisma
git commit -m "Switch to Supabase PostgreSQL schema"
git push
```

Railway will automatically redeploy with the new schema.

---

### Step 6: Verify Deployment

1. Wait for Railway to finish deploying (2-3 minutes)
2. Railway will give you a URL like: `https://plumbers-demo-production.up.railway.app`
3. Click the URL to open your app
4. You should see your beautiful dashboard!

---

## ✅ Final Checklist

- [ ] GitHub repo created and code pushed
- [ ] Railway project created from GitHub
- [ ] DATABASE_URL added (with your Supabase connection string)
- [ ] NODE_ENV set to `production`
- [ ] Prisma schema switched to Supabase version
- [ ] Deployment successful
- [ ] App loads at Railway URL

---

## 🎯 Your Deployment URL

After deployment, your app will be at:
```
https://[your-project-name].up.railway.app
```

This is the URL you'll use for:
- **Retell AI Base URL**: `https://[your-url].up.railway.app/api`
- **Dashboard Access**: `https://[your-url].up.railway.app`

---

## 🔧 Troubleshooting

### Build Fails

**Error**: `Prisma schema not found`
- Make sure you switched to `schema-supabase.prisma`
- Run the commands in Step 5

**Error**: `Can't reach database`
- Check DATABASE_URL is correct
- Verify password has no special characters (or URL encode them)
- Make sure you're using the Transaction pooler (port 6543)

### App Loads but No Data

**Error**: Empty dashboard
- Check that you ran the SQL migration in Supabase
- Verify DATABASE_URL points to correct Supabase project
- Check Supabase Table Editor to see if tables exist

### Connection Pool Errors

**Error**: `Too many connections`
- Make sure `?pgbouncer=true&connection_limit=1` is in DATABASE_URL
- Use Transaction pooler (port 6543), not Session pooler (port 5432)

---

## 📊 Monitor Your App

### Railway Logs
1. Go to your Railway project
2. Click **Deployments**
3. Click latest deployment
4. View logs in real-time

### Supabase Logs
1. Go to Supabase dashboard
2. Click **Logs** → **Database**
3. See all queries and errors

---

## 🎉 You're Live!

Once deployed, you can:
- ✅ Access dashboard from anywhere
- ✅ Connect Retell AI to your API
- ✅ Manage appointments in real-time
- ✅ Share with your team

---

## 🔐 Optional: Add Custom Domain

1. Railway project → **Settings**
2. Click **Domains**
3. Click "Add Domain"
4. Enter your domain (e.g., `plumber.yourdomain.com`)
5. Add CNAME record to your DNS:
   - Name: `plumber`
   - Value: `[your-project].up.railway.app`

---

**Need help?** Check the logs or reach out!
