# BookStore

Minimal Next.js (App Router) + Prisma + NeonDB (PostgreSQL) project, ready for Vercel deployment.

## Tech Stack

- **Next.js 14** (App Router, TypeScript)
- **Auth.js (NextAuth.js)** - Authentication with Google OAuth
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

Create a `.env` file in the root directory and add required variables. See `ENV_SETUP.md` for detailed instructions.

**Required variables:**
- `DATABASE_URL` - NeonDB connection string
- `AUTH_SECRET` - Secret key for Auth.js (generate with `openssl rand -base64 32`)
- `GOOGLE_CLIENT_ID` - Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth Client Secret

See `ENV_SETUP.md` for detailed setup instructions.

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

## Authentication

The project uses Auth.js (NextAuth.js) with Google OAuth for authentication.

- **Login page**: `/login`
- **Protected routes**: `/dashboard`, `/my-prompts`
- **User data**: Automatically created on first login
- **Session**: Server-side sessions stored in database

See `AUTH.md` for detailed authentication documentation.

## Database Schema

The project includes models for:
- `User` - User accounts (created automatically on OAuth login)
- `Book` - Books/prompts (linked to users via `ownerId`)
- `Note` - Notes (linked to users)
- `Category`, `Tag`, `Vote` - Supporting models

See `prisma/schema.prisma` for full schema definition.

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
4. Configure environment variables (see `ENV_SETUP.md`):
   - `DATABASE_URL` - NeonDB connection string
   - `AUTH_SECRET` - Secret key for Auth.js
   - `GOOGLE_CLIENT_ID` - Google OAuth Client ID
   - `GOOGLE_CLIENT_SECRET` - Google OAuth Client Secret
   - Update Google OAuth redirect URI to include your Vercel domain
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
