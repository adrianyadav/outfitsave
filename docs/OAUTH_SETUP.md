# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for your unpacked application.

## Prerequisites

- A Google Cloud Platform account
- Access to Google Cloud Console

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API (if not already enabled)

## Step 2: Configure OAuth Consent Screen

1. In the Google Cloud Console, go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type (unless you have a Google Workspace organization)
3. Fill in the required information:
   - App name: "unpacked"
   - User support email: Your email address
   - Developer contact information: Your email address
4. Add the following scopes:
   - `openid`
   - `email`
   - `profile`
5. Add test users if you're in testing mode

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application" as the application type
4. Add authorized redirect URIs:
   - For development: `http://localhost:3000/api/auth/callback/google`
   - For production: `https://yourdomain.com/api/auth/callback/google`
5. Click "Create"
6. Note down the Client ID and Client Secret

## Step 4: Configure Environment Variables

Add the following environment variables to your `.env.local` file:

```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

## Step 5: Update Database Schema

The database schema has already been updated to support OAuth accounts. The migration includes:

- `Account` model for storing OAuth provider information
- `Session` model for session management
- Updated `User` model with optional password field

## Step 6: Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to `/login` or `/register`
3. Click the "Sign in with Google" button
4. Complete the Google OAuth flow
5. Verify that you're redirected back to your application and logged in

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI" error**
   - Ensure the redirect URI in Google Cloud Console matches exactly
   - Check for trailing slashes or protocol mismatches

2. **"OAuth consent screen not configured" error**
   - Make sure you've completed the OAuth consent screen setup
   - Add your email as a test user if in testing mode

3. **Database errors**
   - Run `npx prisma migrate dev` to ensure the database schema is up to date
   - Check that the Prisma client is generated: `npx prisma generate`

### Environment Variables

Make sure these environment variables are set:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXTAUTH_SECRET` (for session encryption)
- `NEXTAUTH_URL` (for production)

## Security Considerations

1. **Never commit credentials to version control**
   - Use environment variables for all sensitive information
   - Add `.env.local` to your `.gitignore` file

2. **Use HTTPS in production**
   - Google OAuth requires HTTPS for production redirect URIs
   - Ensure your domain has a valid SSL certificate

3. **Regular credential rotation**
   - Periodically rotate your OAuth client secrets
   - Monitor for any suspicious activity

## Production Deployment

When deploying to production:

1. Update the OAuth consent screen with your production domain
2. Add your production redirect URI to Google Cloud Console
3. Set the `NEXTAUTH_URL` environment variable to your production URL
4. Ensure all environment variables are properly configured in your hosting platform

## Testing OAuth in E2E Tests

For end-to-end testing with OAuth:

1. Create a separate Google OAuth application for testing
2. Use test credentials in your test environment
3. Consider mocking the OAuth flow for faster test execution
4. Use Playwright's authentication state storage for logged-in test scenarios

## Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)
