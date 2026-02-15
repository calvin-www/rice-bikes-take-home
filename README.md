# Rice Bikes Repair Dashboard

## Tech Stack Used
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL 17
- **DB Driver**: pg (node-postgres) — raw SQL queries
- **UI**: Tailwind CSS + shadcn/ui
- **Testing**: Vitest

## Prerequisites
- Node.js (v18+)
- npm
- PostgreSQL (v17 recommended, any recent version works)

## Database Setup Instructions

### Option A: Local PostgreSQL (recommended)
1. `createdb rice_bikes`
2. `psql -d rice_bikes -f schema.sql`
3. `psql -d rice_bikes -f seed.sql`
4. Copy `.env.example` to `.env.local` and set your connection string:
   ```
   DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/rice_bikes"
   ```

### Option B: Supabase (hosted)
1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor**
3. Copy and run contents of `schema.sql`
4. Copy and run contents of `seed.sql`
5. Go to **Project Settings** → **Database** → **Connection string** (URI)
6. Copy `.env.example` to `.env.local` and paste the connection string

## How to Run
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## How to Run Tests
```bash
npm test
```

## Example curl command
```bash
curl http://localhost:3000/api/transactions
```

**Example response:**
```json
[
  {
    "transaction_id": 10,
    "transaction_date": "2026-01-28",
    "total_cost": 55.00,
    "customer": {
      "id": 4,
      "first_name": "Sophie",
      "last_name": "Kim",
      "email": "sophie.kim@email.com",
      "phone_number": "7135550104"
    },
    "bike": {
      "id": 5,
      "make": "Santa Cruz",
      "model": "Hightower"
    }
  }
]
```

## Design Decisions
- Used `pg` with raw SQL (no ORM) to demonstrate SQL competency and proper JOINs
- JOIN path: `repair_transactions` → `customers` (via `customer_id`), `repair_transactions` → `bikes` (via `bike_id`)
- API returns transactions sorted by `transaction_date` DESC (most recent first)
- Frontend displays oldest first by default with client-side sorting on all columns
- Client-side pagination with page size 5 for optimal demo with 10 seed records
- API returns nested `customer` and `bike` objects for clean frontend consumption
- SSL is applied conditionally — remote databases only (localhost connections skip SSL)

## Assumptions
- The assignment spec lists a "Service" column in the frontend table, but the provided database schema has no service/description field. I omitted this column rather than fabricate data not present in the schema.
