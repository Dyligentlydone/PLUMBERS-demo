# Supabase Setup Guide

Complete guide to migrate your Plumber Pro app from SQLite to Supabase PostgreSQL.

## 📋 Prerequisites

- Supabase account (free tier works great!)
- Your app currently running with SQLite

## 🚀 Step-by-Step Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new organization (if needed)
4. Click "New Project"
5. Fill in:
   - **Name**: `plumber-pro` (or your choice)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
6. Click "Create new project"
7. Wait 2-3 minutes for setup to complete

### 2. Run SQL Migration

1. In your Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy the entire contents of `supabase-migration.sql`
4. Paste into the SQL editor
5. Click **Run** (or press Cmd/Ctrl + Enter)
6. You should see "Success. No rows returned"

This creates:
- ✅ `customers` table
- ✅ `appointments` table
- ✅ Indexes for performance
- ✅ Auto-update triggers
- ✅ Row Level Security (RLS)
- ✅ Sample data (optional)

### 3. Get Your Database Connection String

1. In Supabase dashboard, click **Project Settings** (gear icon)
2. Click **Database** in the left menu
3. Scroll to **Connection string**
4. Select **URI** tab
5. Copy the connection string (looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
   ```
6. Replace `[YOUR-PASSWORD]` with your actual database password

### 4. Update Your App Configuration

#### Update Environment Variables

Create/update `.env` file in your project root:

```env
# Supabase Database URL
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"

# Direct connection (for migrations)
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres"

NODE_ENV="production"
```

**Important**: Replace `[YOUR-PASSWORD]` with your actual password!

#### Update Prisma Schema

1. Backup your current schema:
   ```bash
   cp prisma/schema.prisma prisma/schema-sqlite-backup.prisma
   ```

2. Replace with Supabase schema:
   ```bash
   cp prisma/schema-supabase.prisma prisma/schema.prisma
   ```

### 5. Generate Prisma Client

```bash
cd plumber-app
npx prisma generate
```

### 6. Test the Connection

```bash
# Test database connection
npx prisma db pull

# Should show your tables without errors
```

### 7. Deploy Your App

Your app is now ready to use Supabase! Deploy to your hosting platform:

#### Railway
```bash
railway up
# Add DATABASE_URL environment variable in Railway dashboard
```

#### Vercel
```bash
vercel
# Add DATABASE_URL in Vercel project settings
```

## 🔒 Security Configuration (Optional but Recommended)

### Enable RLS Policies

The migration already enables Row Level Security. To add authentication:

1. In Supabase dashboard, go to **Authentication**
2. Configure your preferred auth method
3. Update RLS policies in **Database** → **Policies**

Example policy for authenticated users only:

```sql
-- Remove public access
DROP POLICY "Allow all operations on customers" ON customers;
DROP POLICY "Allow all operations on appointments" ON appointments;

-- Add authenticated-only policies
CREATE POLICY "Authenticated users can manage customers" ON customers
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage appointments" ON appointments
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
```

## 📊 Verify Everything Works

### Check Tables
1. Go to **Table Editor** in Supabase
2. You should see:
   - `customers` table with sample data
   - `appointments` table with sample appointments

### Test API Endpoints
1. Start your dev server: `npm run dev`
2. Visit `http://localhost:3000/api-test` (if you kept it)
3. Test each endpoint to ensure they work with Supabase

### Check Dashboard
1. Visit `http://localhost:3000`
2. Verify all data loads correctly
3. Test creating new appointments
4. Check that everything syncs to Supabase

## 🎯 Benefits of Supabase

✅ **Scalable**: Handles thousands of appointments
✅ **Real-time**: Built-in real-time subscriptions
✅ **Backups**: Automatic daily backups
✅ **Free Tier**: 500MB database, 2GB bandwidth
✅ **Dashboard**: Beautiful UI to manage data
✅ **Auth**: Built-in authentication system
✅ **Storage**: File storage for documents/images
✅ **Edge Functions**: Serverless functions

## 🔧 Troubleshooting

### Connection Errors

**Error**: `Can't reach database server`
- Check your DATABASE_URL is correct
- Ensure password has no special characters (or URL encode them)
- Verify your IP isn't blocked (Supabase allows all by default)

**Error**: `SSL connection required`
- Add `?sslmode=require` to your DATABASE_URL

### Migration Errors

**Error**: `relation already exists`
- Tables already created, safe to ignore
- Or drop tables and re-run migration

**Error**: `permission denied`
- Check you're using the postgres user
- Verify connection string is correct

### Prisma Errors

**Error**: `Schema engine error`
- Run `npx prisma generate` again
- Delete `node_modules/.prisma` and regenerate

## 📈 Monitoring

### View Database Stats
1. Supabase Dashboard → **Database**
2. See:
   - Database size
   - Active connections
   - Query performance
   - Table sizes

### Query Logs
1. Go to **Logs** → **Database**
2. See all queries in real-time
3. Identify slow queries

## 🎉 You're Done!

Your Plumber Pro app is now running on Supabase with:
- ✅ PostgreSQL database
- ✅ Automatic backups
- ✅ Scalable infrastructure
- ✅ Real-time capabilities
- ✅ Professional dashboard

## 💡 Next Steps

1. **Add Authentication**: Protect your dashboard with Supabase Auth
2. **Real-time Updates**: Subscribe to appointment changes
3. **File Storage**: Store customer documents/photos
4. **Edge Functions**: Add custom business logic
5. **Backups**: Set up automated backups

## 🆘 Need Help?

- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Prisma Docs**: [prisma.io/docs](https://prisma.io/docs)
- **Community**: [supabase.com/discord](https://supabase.com/discord)

---

**Happy Building! 🚀**
