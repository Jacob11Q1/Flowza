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

```
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
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Sign in |
| GET | `/api/auth/me` | Get current user |

### Clients
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/clients` | List all clients |
| POST | `/api/clients` | Create client |
| GET | `/api/clients/:id` | Get single client |
| PUT | `/api/clients/:id` | Update client |
| DELETE | `/api/clients/:id` | Delete client |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List projects (filterable by `?status=&client=`) |
| POST | `/api/projects` | Create project |
| GET | `/api/projects/:id` | Get single project |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |

### Invoices
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/invoices` | List invoices (filterable by `?status=&client=&project=`) |
| POST | `/api/invoices` | Create invoice |
| GET | `/api/invoices/:id` | Get single invoice |
| PUT | `/api/invoices/:id` | Update invoice |
| DELETE | `/api/invoices/:id` | Delete invoice |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Stats + recent data + notifications |

---

## Running Locally

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone & install

```bash
# Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Frontend
cd ../frontend
npm install
cp .env.local.example .env.local
```

### 2. Start MongoDB

```bash
# Local MongoDB
mongod --dbpath /usr/local/var/mongodb

# Or use MongoDB Atlas (cloud) — paste connection string in .env
```

### 3. Seed sample data (optional)

```bash
cd backend
npm run seed
# Creates: demo@flowza.app / password123
```

### 4. Start development servers

```bash
# Terminal 1 — Backend (port 5000)
cd backend
npm run dev

# Terminal 2 — Frontend (port 3000)
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deployment

### Backend → Render

1. Push `backend/` to a GitHub repo
2. Create a new **Web Service** on [Render](https://render.com)
3. Build command: `npm install && npm run build`
4. Start command: `npm start`
5. Add environment variables:
   - `MONGODB_URI` (MongoDB Atlas connection string)
   - `JWT_SECRET` (long random string)
   - `CLIENT_URL` (your Vercel frontend URL)
   - `NODE_ENV=production`

### Frontend → Vercel

1. Push `frontend/` to a GitHub repo
2. Import project on [Vercel](https://vercel.com)
3. Add environment variable:
   - `NEXT_PUBLIC_API_URL` (your Render backend URL, e.g. `https://flowza-api.onrender.com`)
4. Deploy — done!

---

## Future Improvements

### Business Features
- [ ] **Recurring invoices** with auto-generation
- [ ] **Time tracking** per project with hourly billing
- [ ] **PDF invoice export** (react-pdf or puppeteer)
- [ ] **Email notifications** (overdue reminders via SendGrid/Resend)
- [ ] **Client portal** — shareable invoice links for clients
- [ ] **Stripe integration** — online payment for invoices
- [ ] **Expense tracking** — log project costs
- [ ] **Contract management** — digital signing (DocuSign API)
- [ ] **Multi-currency** support

### SaaS Features
- [ ] **Subscription billing** (Stripe subscriptions with free/pro tiers)
- [ ] **Team accounts** — invite collaborators
- [ ] **Workspace/organization** model
- [ ] **Audit log** — track all changes
- [ ] **Data export** (CSV / JSON)
- [ ] **API access** for power users

### Technical
- [ ] **Redis caching** for dashboard queries
- [ ] **Rate limiting** per user
- [ ] **Full test suite** (Jest + React Testing Library)
- [ ] **OpenAPI / Swagger** docs
- [ ] **Docker Compose** for local dev
- [ ] **GitHub Actions** CI/CD pipeline
- [ ] **Sentry** error monitoring
- [ ] **PostHog** product analytics

---

## Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| Primary | `#4F46E5` | Actions, active states, links |
| Secondary | `#22C55E` | Success, paid status, positive metrics |
| Background | `#0F172A` | App background |
| Surface | `#F8FAFC` | Text, card content |
