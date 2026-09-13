# 🚀 Deploy NOW - Quick Steps

## 1. Push to GitHub (1 min)

```bash
# Create repo at: https://github.com/new
# Name: PLUMBERS-demo

cd plumber-app
git push -u origin main
```

## 2. Switch to Supabase Schema (30 sec)

```bash
cp prisma/schema-supabase.prisma prisma/schema.prisma
git add prisma/schema.prisma
git commit -m "Switch to Supabase schema"
git push
```

## 3. Deploy on Railway (2 min)

1. Go to railway.app
2. New Project → Deploy from GitHub
3. Select `PLUMBERS-demo`
4. Click Deploy

## 4. Add Environment Variables

In Railway → Variables:

### DATABASE_URL
```
postgresql://postgres.xxxxx:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

Get from: Supabase → Settings → Database → Connection String (URI)

### NODE_ENV
```
production
```

## 5. Done! ✅

Your app will be live at:
```
https://[project-name].up.railway.app
```

---

**For Retell AI**: Use `https://[your-url].up.railway.app/api`

**Full guide**: See RAILWAY_DEPLOYMENT.md
