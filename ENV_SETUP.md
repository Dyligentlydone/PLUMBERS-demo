# Environment Variables Setup

## Local Development

Create a `.env` file in the root directory with:

```env
# Database
DATABASE_URL="file:./dev.db"

# Environment
NODE_ENV="development"
```

## Production Deployment

### Railway (SQLite with Persistent Volume)

Set these environment variables in Railway dashboard:

```env
DATABASE_URL="file:/app/data/prod.db"
NODE_ENV="production"
```

**Important**: Add a persistent volume mounted at `/app/data` to ensure database persists.

### Vercel (PostgreSQL Required)

Set these environment variables in Vercel dashboard:

```env
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
NODE_ENV="production"
```

Get a PostgreSQL database from:
- Vercel Postgres
- Supabase (free tier)
- Neon (free tier)
- Railway (PostgreSQL service)

## Optional Environment Variables

### Authentication (if implementing)

```env
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-secret-key-here"
```

### API Keys (for AI Agent Authentication)

```env
API_KEY="your-secret-api-key"
```

## Security Notes

- **Never commit `.env` files to version control**
- Use platform-specific secret management for production
- Rotate API keys regularly
- Use strong, random values for secrets
