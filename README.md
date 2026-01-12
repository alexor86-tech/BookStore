# BookStore

Minimal Next.js (App Router) + Prisma + NeonDB (PostgreSQL) project, ready for Vercel deployment.

## Tech Stack

- **Next.js 14** (App Router, TypeScript)
- **Prisma** (ORM)
- **NeonDB** (PostgreSQL)
- **Vercel** (Deployment)

## Project Structure

```
BookStore/
├── app/
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page with database query
│   └── globals.css      # Global styles
├── lib/
│   └── prisma.ts        # Prisma client singleton
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Seed script
├── .env.example         # Environment variables template
├── package.json         # Dependencies and scripts
└── vercel.json          # Vercel configuration
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your NeonDB connection string:

```env
DATABASE_URL="postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require"
```

**How to get NeonDB connection string:**
1. Go to [Neon Console](https://console.neon.tech/)
2. Create a new project (or use existing)
3. Copy the connection string from the project dashboard
4. Replace `DATABASE_URL` in `.env` file

### 3. Setup Database

Generate Prisma Client:

```bash
npx prisma generate
```

Push schema to database:

```bash
npm run db:push
```

Or create a migration:

```bash
npm run db:migrate
```

### 4. Seed Database (Optional)

Add sample data:

```bash
npm run db:seed
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The project includes a minimal `Note` model:

```prisma
model Note {
  id        String   @id @default(uuid())
  title     String
  createdAt DateTime @default(now())
}
```

## Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure environment variables:
   - Add `DATABASE_URL` with your NeonDB connection string
5. Click "Deploy"

### 3. Run Database Migrations on Vercel

After deployment, you need to run migrations. You can do this via Vercel CLI:

```bash
npm i -g vercel
vercel env pull .env.local
npx prisma migrate deploy
```

Or use Vercel's built-in terminal or add a postinstall script.

### 4. Seed Production Database (Optional)

```bash
vercel env pull .env.local
npm run db:seed
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Create and apply migration
- `npm run db:seed` - Seed database with sample data

## Notes

- The Prisma Client is automatically generated on `npm install` (via `postinstall` script)
- Database connection is handled through environment variables
- The home page (`app/page.tsx`) demonstrates reading data from PostgreSQL
- All database queries use Prisma ORM

## Troubleshooting

**Database connection issues:**
- Verify `DATABASE_URL` is correct in `.env`
- Check that NeonDB project is active
- Ensure SSL mode is set to `require` in connection string

**Build errors on Vercel:**
- Make sure `DATABASE_URL` is set in Vercel environment variables
- Check that `prisma generate` runs during build (configured in `vercel.json`)

**No data showing:**
- Run `npm run db:seed` to add sample data
- Check database connection in NeonDB console
