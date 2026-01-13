# Environment Variables Setup

Create a `.env` file in the root directory with the following content:

```env
# Database
DATABASE_URL="postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require"

# Auth.js (NextAuth)
AUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## Getting NeonDB Connection String

1. Go to [Neon Console](https://console.neon.tech/)
2. Create a new project or select an existing one
3. Go to the project dashboard
4. Copy the connection string (it should look like the example above)
5. Paste it into your `.env` file

## Getting Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Choose "Web application"
6. Add authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`
7. Copy Client ID and Client Secret to your `.env` file

## Generating AUTH_SECRET

Generate a secure random secret:

```bash
openssl rand -base64 32
```

Or use an online generator: https://generate-secret.vercel.app/32

## For Vercel Deployment

Add all environment variables in Vercel dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add all variables:
   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
4. Make sure to add them for all environments (Production, Preview, Development)
5. Update Google OAuth redirect URI in Google Cloud Console to include your Vercel domain
