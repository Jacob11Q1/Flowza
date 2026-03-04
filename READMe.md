# Flowza — Client & Project Management for Freelancers

A production-ready SaaS platform built with **Next.js 14**, **Express.js**, and **MongoDB**.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB with Mongoose |
| Auth | JWT + bcrypt |
| Icons | Lucide React |

---

## Project Structure

flowza/
├── backend/                    # Express API
│   └── src/
│       ├── config/db.ts        # MongoDB connection
│       ├── controllers/        # Business logic
│       ├── middleware/         # Auth + error handling
│       ├── models/             # Mongoose schemas
│       ├── routes/             # API routes
│       ├── index.ts            # Server entry point
│       └── seed.ts             # Sample data seeder
│
└── frontend/                   # Next.js app
    ├── app/
    │   ├── (auth)/             # Login & Register pages
    │   ├── (dashboard)/        # Protected dashboard pages
    │   └── page.tsx            # Landing page
    ├── components/
    │   ├── forms/              # ClientForm, ProjectForm, InvoiceForm
    │   ├── layout/             # Sidebar, Navbar
    │   └── ui/                 # Badge, Button, Input, Modal, etc.
    ├── contexts/               # AuthContext
    ├── lib/                    # API client, utilities
    └── types/                  # TypeScript interfaces

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Sign in |
| GET | /api/auth/me | Get current user |

### Clients
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/clients | List all clients |
| POST | /api/clients | Create client |
| GET | /api/clients/:id | Get single client |
| PUT | /api/clients/:id | Update client |
| DELETE | /api/clients/:id | Delete client |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/projects | List projects (filterable by ?status=&client=) |
| POST | /api/projects | Create project |
| GET | /api/projects/:id | Get single project |
| PUT | /api/projects/:id | Update project |
| DELETE | /api/projects/:id | Delete project |

### Invoices
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/invoices | List invoices (filterable by ?status=&client=&project=) |
| POST | /api/invoices | Create invoice |
| GET | /api/invoices/:id | Get single invoice |
| PUT | /api/invoices/:id | Update invoice |
| DELETE | /api/invoices/:id | Delete invoice |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/dashboard | Stats + recent data + notifications |

---

## Running Locally

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone & install

# Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Frontend
cd ../frontend
npm install
cp .env.local.example .env.local

### 2. Start MongoDB

# Local MongoDB
mongod --dbpath /usr/local/var/mongodb

# Or use MongoDB Atlas (cloud)

### 3. Seed sample data (optional)

cd backend
npm run seed
# demo@flowza.app / password123

### 4. Start development servers

# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev

Open http://localhost:3000

---

## Deployment

### Backend → Render
1. Push backend/ to GitHub
2. Create Web Service on Render
3. Build: npm install && npm run build
4. Start: npm start
5. Add env:
   - MONGODB_URI
   - JWT_SECRET
   - CLIENT_URL
   - NODE_ENV=production

### Frontend → Vercel
1. Push frontend/ to GitHub
2. Import on Vercel
3. Add env:
   - NEXT_PUBLIC_API_URL
4. Deploy

---

## Future Improvements

### Business Features
- Recurring invoices
- Time tracking
- PDF export
- Email notifications
- Client portal
- Stripe payments
- Expense tracking
- Contracts
- Multi-currency

### SaaS Features
- Subscription billing
- Team accounts
- Workspaces
- Audit logs
- Data export
- API access

### Technical
- Redis caching
- Rate limiting
- Testing (Jest)
- Swagger docs
- Docker
- CI/CD
- Sentry
- Analytics

---

## Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| Primary | #4F46E5 | Actions |
| Secondary | #22C55E | Success |
| Background | #0F172A | Background |
| Surface | #F8FAFC | Content |