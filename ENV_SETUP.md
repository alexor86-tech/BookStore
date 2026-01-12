# Environment Variables Setup

Create a `.env` file in the root directory with the following content:

```env
DATABASE_URL="postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require"
```

## Getting NeonDB Connection String

1. Go to [Neon Console](https://console.neon.tech/)
2. Create a new project or select an existing one
3. Go to the project dashboard
4. Copy the connection string (it should look like the example above)
5. Paste it into your `.env` file

## For Vercel Deployment

Add the `DATABASE_URL` environment variable in Vercel dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add `DATABASE_URL` with your NeonDB connection string
4. Make sure to add it for all environments (Production, Preview, Development)
