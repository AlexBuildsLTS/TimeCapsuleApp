# Vercel Deployment Guide for Time Capsule App

## Prerequisites

- Vercel account (sign up at <https://vercel.com>)
- Vercel CLI installed globally: `npm install -g vercel`
- Firebase project with environment variables

## Environment Variables Setup

Before deploying, you need to set up the following environment variables in your Vercel project:

1. Go to your Vercel dashboard
2. Select your project (or create a new one)
3. Go to Settings > Environment Variables
4. Add the following variables:

```
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id_here
```

## Deployment Steps

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):

   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:

   ```bash
   vercel login
   ```

3. **Deploy from your project directory**:

   ```bash
   vercel
   ```

   Follow the prompts:

   - Set up and deploy? `Y`
   - Which scope? Select your account
   - Link to existing project? `N` (for first deployment)
   - Project name: `time-capsule-app` (or your preferred name)
   - Directory: `./` (current directory)

4. **Set environment variables** (if not set via dashboard):

   ```bash
   vercel env add EXPO_PUBLIC_FIREBASE_API_KEY
   vercel env add EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN
   vercel env add EXPO_PUBLIC_FIREBASE_PROJECT_ID
   vercel env add EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
   vercel env add EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
   vercel env add EXPO_PUBLIC_FIREBASE_APP_ID
   ```

5. **Redeploy with environment variables**:

   ```bash
   vercel --prod
   ```

### Option 2: Deploy via GitHub Integration

1. **Push your code to GitHub** (if not already done)
2. **Connect GitHub to Vercel**:
   - Go to Vercel dashboard
   - Click "New Project"
   - Import your GitHub repository
   - Configure build settings (should auto-detect from vercel.json)
   - Add environment variables in project settings
   - Deploy

## Build Configuration

The project is configured with:

- **Build Command**: `npm run build:web`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Framework**: None (custom Expo setup)

## Post-Deployment Checklist

1. **Test the deployment**:

   - Visit your Vercel URL
   - Test authentication flow
   - Test Firebase connectivity
   - Test all major features

2. **Configure custom domain** (optional):

   - Go to Vercel project settings
   - Add your custom domain
   - Update DNS settings as instructed

3. **Set up monitoring**:
   - Check Vercel Analytics
   - Monitor Firebase usage
   - Set up error tracking if needed

## Troubleshooting

### Common Issues

1. **Build fails with Firebase errors**:

   - Ensure all environment variables are set correctly
   - Check Firebase project configuration

2. **App loads but Firebase doesn't work**:

   - Verify environment variables are prefixed with `EXPO_PUBLIC_`
   - Check Firebase project settings and permissions

3. **Routing issues**:

   - The `vercel.json` includes SPA routing configuration
   - All routes should redirect to `/index.html`

4. **Static assets not loading**:
   - Check asset paths in your code
   - Ensure assets are in the `assets/` directory

### Debug Commands

```bash
# Test build locally
npm run build:web

# Preview build locally
npm run preview

# Check Vercel logs
vercel logs

# Check deployment status
vercel ls
```

## Additional Notes

- The app uses Expo's web build system with Metro bundler
- Firebase services (Auth, Firestore, Storage, Functions) should work seamlessly
- The deployment includes proper caching headers for static assets
- SPA routing is configured for client-side navigation

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Verify Firebase configuration
3. Test the build locally first
4. Check browser console for errors
