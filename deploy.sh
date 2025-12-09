#!/bin/bash

# Time Capsule App - Vercel Deployment Script
echo "🚀 Starting Vercel deployment for Time Capsule App..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Build the project
echo "📦 Building the project..."
npm run build:web

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    
    # Deploy to Vercel
    echo "🌐 Deploying to Vercel..."
    vercel --prod --yes
    
    if [ $? -eq 0 ]; then
        echo "🎉 Deployment completed successfully!"
        echo "📋 Don't forget to:"
        echo "   1. Set up environment variables in Vercel dashboard"
        echo "   2. Test your deployment"
        echo "   3. Configure custom domain if needed"
    else
        echo "❌ Deployment failed. Please check the error messages above."
    fi
else
    echo "❌ Build failed. Please fix the errors and try again."
fi
