# Plumbing Business Web App

A comprehensive web application for managing a plumbing business with AI agent integration. This app serves as both a command center dashboard for business owners and a backend API for AI voice agents (like Retell AI).

## Features

### 🤖 AI Agent Integration
- **6 REST API endpoints** ready for AI voice agent integration
- Automatic customer recognition
- Appointment booking, rescheduling, and cancellation
- Real-time price estimates
- Appointment status lookup

### 📊 Business Dashboard
- Real-time appointment overview
- Customer management
- Detailed appointment tracking
- Status monitoring (Scheduled, In Progress, Completed, Cancelled)
- Beautiful, responsive UI built with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: SQLite with Prisma ORM
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Validation**: Zod

## Getting Started

### Prerequisites
- Node.js 20+ or 22+
- npm

### Installation

1. Clone the repository and navigate to the project:
```bash
cd plumber-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npx prisma migrate dev
```

4. Seed the database with sample data:
```bash
npm run seed
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Endpoints

All endpoints are located under `/api` and return JSON responses.

### 1. Create Appointment
**POST** `/api/appointments`

Create a new appointment for a customer.

**Request Body:**
```json
{
  "customer_name": "John Doe",
  "phone": "517-555-0100",
  "email": "john@email.com",
  "service_address": "123 Main St, Lansing, MI",
  "job_type": "Drain Clog",
  "job_description": "Kitchen sink backing up",
  "preferred_window": "Tomorrow, 2-4 PM",
  "notes": "Customer mentioned gurgling sounds"
}
```

**Response (200):**
```json
{
  "appointment": { "id": "clx..." },
  "scheduled_arrival_window": "Tomorrow, 2-4 PM",
  "eta_minutes": null
}
```

### 2. Get Price Estimate
**POST** `/api/appointments/estimate`

Get a rough price estimate for a job.

**Request Body:**
```json
{
  "job_type": "Drain Clog",
  "job_description": "Kitchen sink backing up for 2 days"
}
```

**Response (200):**
```json
{
  "estimate_low": 150,
  "estimate_high": 300,
  "range_text": "$150–$300"
}
```

### 3. Customer Lookup
**GET** `/api/customers/lookup?phone={phone}`

Look up a customer and their recent appointment by phone number.

**Response (200):**
```json
{
  "lookup": {
    "is_known": true,
    "customer_name": "John Doe",
    "has_recent_appointment": true,
    "recent_appointment_id": "clx...",
    "recent_appointment_summary": "Drain Clog on Thu 9/18, 2–4 PM",
    "recent_appointment_status": "Scheduled",
    "recent_appointment_modifiable": true,
    "total_appointments": 3
  }
}
```

### 4. Update Appointment
**PATCH** `/api/appointments/{id}`

Reschedule or update an existing appointment.

**Request Body:**
```json
{
  "job_type": "Drain Clog",
  "job_description": "Updated description",
  "service_address": "New address",
  "preferred_window": "Friday, 10 AM–12 PM",
  "notes": "Additional notes"
}
```

**Response (200):**
```json
{
  "scheduled_arrival_window": "Friday, 10 AM–12 PM",
  "eta_minutes": null
}
```

### 5. Cancel Appointment
**POST** `/api/appointments/{id}/cancel`

Cancel an existing appointment.

**Request Body:**
```json
{
  "reason": "Customer no longer needs service"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Appointment cancelled successfully"
}
```

### 6. Appointment Lookup
**GET** `/api/appointments/lookup?appointment_id={id}&phone={phone}`

Look up appointments by ID or phone number.

**Response (200):**
```json
{
  "lookup": {
    "matches": 1,
    "appointments": [
      {
        "id": "clx...",
        "status": "Scheduled",
        "job_type": "Drain Clog",
        "job_description": "Kitchen sink backing up",
        "scheduled_arrival_window": "Thu 9/18, 2–4 PM",
        "service_address": "123 Main St, Lansing, MI"
      }
    ]
  }
}
```

## Deployment

### Deploy to Railway

1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login to Railway:
```bash
railway login
```

3. Initialize project:
```bash
railway init
```

4. Add environment variables:
```bash
railway variables set DATABASE_URL="file:./prod.db"
```

5. Deploy:
```bash
railway up
```

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

**Note**: For production, consider using PostgreSQL instead of SQLite. Update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## Connecting Your AI Agent

Once deployed, update your Retell AI agent (or other voice AI platform) to use your deployment URL:

**Base URL**: `https://your-domain.com/api`

All 6 endpoints are ready to use with the paths documented above.

## Database Schema

### Customer
- `id`: Unique identifier
- `name`: Customer name
- `phone`: Phone number (unique)
- `email`: Email address (optional)
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### Appointment
- `id`: Unique identifier
- `customerId`: Reference to customer
- `customerName`: Customer name (denormalized)
- `phone`: Phone number (denormalized)
- `email`: Email address (optional)
- `serviceAddress`: Service location
- `jobType`: Type of plumbing job
- `jobDescription`: Detailed description
- `preferredWindow`: Customer's preferred time window
- `scheduledArrivalWindow`: Scheduled arrival time
- `status`: Scheduled | InProgress | Completed | Cancelled
- `etaMinutes`: Estimated time of arrival (optional)
- `notes`: Additional notes (optional)
- `cancellationReason`: Reason for cancellation (optional)
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Seed database with sample data
npm run seed

# Reset database
npx prisma migrate reset

# Open Prisma Studio (database GUI)
npx prisma studio
```

## Project Structure

```
plumber-app/
├── app/
│   ├── api/                    # API routes
│   │   ├── appointments/       # Appointment endpoints
│   │   └── customers/          # Customer endpoints
│   ├── appointments/           # Appointment detail pages
│   └── page.tsx                # Dashboard homepage
├── lib/
│   └── prisma.ts               # Prisma client singleton
├── prisma/
│   ├── schema.prisma           # Database schema
│   ├── seed.ts                 # Seed script
│   └── migrations/             # Database migrations
└── public/                     # Static assets
```

## License

MIT

## Support

For questions or issues, please contact your development team.
