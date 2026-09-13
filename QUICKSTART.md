# Quick Start Guide

Get your plumbing business web app running in 5 minutes!

## 🚀 Local Development

```bash
# 1. Navigate to the project
cd plumber-app

# 2. Install dependencies (if not already done)
npm install

# 3. Set up the database
npx prisma migrate dev

# 4. Seed with sample data
npm run seed

# 5. Start the development server
npm run dev
```

**Open** [http://localhost:3000](http://localhost:3000) in your browser!

## 📱 What You'll See

### Dashboard (/)
- Overview statistics
- Recent appointments table
- Professional UI

### API Test Page (/api-test)
- Test all 6 API endpoints
- See live responses
- Perfect for debugging

### Appointment Details (/appointments/[id])
- Click any appointment from the dashboard
- View full details
- See customer information

## 🔌 Connect Your AI Agent

Your app is running at `http://localhost:3000`

For local testing with your Retell AI agent, you'll need to expose your local server:

### Option 1: ngrok (Recommended for Testing)
```bash
# Install ngrok
brew install ngrok  # macOS
# or download from ngrok.com

# Expose your local server
ngrok http 3000

# Use the provided HTTPS URL in your AI agent
# Example: https://abc123.ngrok.io/api
```

### Option 2: Deploy to Production
See `DEPLOYMENT.md` for full deployment instructions.

**Recommended**: Deploy to Railway for production use.

## 🧪 Test the API

### Using the Built-in Tester
1. Go to [http://localhost:3000/api-test](http://localhost:3000/api-test)
2. Click any test button
3. See the response in real-time

### Using cURL

```bash
# Test customer lookup
curl "http://localhost:3000/api/customers/lookup?phone=517-555-0101"

# Test estimate
curl -X POST http://localhost:3000/api/appointments/estimate \
  -H "Content-Type: application/json" \
  -d '{"job_type":"Drain Clog","job_description":"Kitchen sink backing up"}'

# Test create appointment
curl -X POST http://localhost:3000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name":"Test Customer",
    "phone":"517-555-9999",
    "service_address":"123 Test St",
    "job_type":"Test Job",
    "job_description":"Testing the API"
  }'
```

## 📊 Sample Data

The seed script creates:
- **4 customers** with realistic names and contact info
- **7 appointments** with various statuses:
  - Scheduled appointments
  - In-progress jobs
  - Completed work
  - Cancelled appointments

## 🛠 Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# View database in GUI
npx prisma studio

# Re-seed database
npm run seed
```

## 📁 Key Files

- `app/page.tsx` - Dashboard homepage
- `app/api/` - All API endpoints
- `prisma/schema.prisma` - Database schema
- `README.md` - Full documentation
- `DEPLOYMENT.md` - Deployment guide

## 🎯 Next Steps

1. ✅ **Explore the Dashboard** - Click around and see all features
2. ✅ **Test the API** - Use the `/api-test` page
3. ✅ **Review the Code** - Check out the clean, well-organized structure
4. ✅ **Deploy** - Follow `DEPLOYMENT.md` to go live
5. ✅ **Connect AI Agent** - Update Retell AI with your deployment URL

## ❓ Need Help?

- **Full Documentation**: See `README.md`
- **Deployment Help**: See `DEPLOYMENT.md`
- **Environment Setup**: See `ENV_SETUP.md`
- **Project Overview**: See `PROJECT_SUMMARY.md`

## 🎉 You're Ready!

Your plumbing business web app is fully functional and ready to use. The dashboard is live, all 6 API endpoints are working, and you have sample data to explore.

**Happy coding!** 🚀
