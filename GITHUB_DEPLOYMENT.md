# GitHub Actions Deployment Setup

This guide explains how to set up automatic deployment to Vercel using GitHub Actions.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **Vercel Project**: Create a new project in Vercel connected to your GitHub repo

## Setup Steps

### 1. Get Vercel Token

1. Go to [Vercel Account Settings](https://vercel.com/account/tokens)
2. Create a new token with a descriptive name (e.g., "GitHub Actions")
3. Copy the token (you'll need it for GitHub secrets)

### 2. Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add the following secrets:

- **`VERCEL_TOKEN`**: The token you created in step 1
- **`ORG_ID`**: Your Vercel organization ID (optional, only if using teams)
- **`PROJECT_ID`**: Your Vercel project ID (optional, for specific project targeting)

### 3. Workflow Files

Two workflow files are included:

#### `ci.yml` - Continuous Integration
- Runs on every push and pull request
- Builds and tests the project
- Uploads build artifacts
- **Always safe to run**

#### `deploy.yml` - Deployment
- Runs only on pushes to main/master branch
- Builds and deploys to Vercel
- **Requires Vercel secrets to be configured**

## Manual Deployment Alternative

If you prefer manual deployment or the GitHub Actions setup is complex, you can:

1. **Use Vercel CLI locally**:
   ```bash
   npm install -g vercel
   npm run build:frontend
   vercel --prod
   ```

2. **Use Vercel Git Integration**:
   - Connect your GitHub repo directly in Vercel dashboard
   - Vercel will automatically deploy on every push
   - No GitHub Actions needed

3. **Use the deployment scripts**:
   ```bash
   # Windows
   deploy-now.bat
   
   # Linux/Mac
   ./deploy-now.sh
   ```

## Troubleshooting

### Common Issues

1. **"repository not found" error**: 
   - Check that you're using the correct action names
   - Ensure secrets are properly configured

2. **Build failures**:
   - Check that Node.js version matches (18.19.0)
   - Ensure all dependencies install correctly
   - Verify build command works locally

3. **Deployment failures**:
   - Verify VERCEL_TOKEN is valid and has correct permissions
   - Check Vercel project settings
   - Ensure vercel.json configuration is correct

### Getting Help

1. Check GitHub Actions logs for detailed error messages
2. Verify Vercel dashboard for deployment status
3. Test deployment locally first using `vercel --prod`

## Recommended Approach

For the simplest setup:

1. **Disable GitHub Actions deployment** (comment out deploy.yml)
2. **Use Vercel Git Integration** instead
3. **Keep CI workflow** for build verification

This approach is more reliable and requires less configuration.