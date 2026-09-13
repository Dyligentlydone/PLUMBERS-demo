# Supabase Quick Start - 5 Minutes

## 🚀 Fast Track Setup

### 1. Create Project (2 min)
```
1. Go to supabase.com → New Project
2. Name: plumber-pro
3. Password: [create strong password]
4. Region: [closest to you]
5. Create
```

### 2. Run SQL (1 min)
```
1. SQL Editor → New Query
2. Copy/paste supabase-migration.sql
3. Run
```

### 3. Get Connection String (1 min)
```
1. Settings → Database
2. Copy Connection String (URI)
3. Replace [YOUR-PASSWORD] with your password
```

### 4. Update .env (1 min)
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxx.supabase.co:5432/postgres?pgbouncer=true"
```

### 5. Update Prisma
```bash
cp prisma/schema-supabase.prisma prisma/schema.prisma
npx prisma generate
```

## ✅ Done!

Test: `npm run dev` → Check dashboard

---

**Full guide**: See SUPABASE_SETUP.md for details
