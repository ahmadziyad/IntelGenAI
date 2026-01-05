# Vercel Deployment Guide

This guide provides multiple approaches to deploy the Ahmad Ziyad Portfolio to Vercel.

## Quick Fix Options

### Option 1: Deploy Frontend Directory Directly (Recommended)

1. **In Vercel Dashboard:**
   - Create new project
   - Import from GitHub
   - **Set Root Directory to: `packages/frontend`**
   - **Build Command: `npm run build`**
   - **Output Directory: `build`**
   - Deploy

2. **This avoids all monorepo/workspace issues**

### Option 2: Use Frontend-Specific Vercel Config

The project now includes `packages/frontend/vercel.json` for direct frontend deployment.

1. Deploy from the `packages/frontend` directory
2. Vercel will use the local config automatically

### Option 3: Manual CLI Deployment

```bash
# Navigate to frontend directory
cd packages/frontend

# Install dependencies
npm install

# Build the project
npm run build

# Deploy to Vercel
vercel --prod
```

## Troubleshooting Common Issues

### Issue: "Missing script: build:frontend"
**Cause:** Vercel is trying to run workspace commands in wrong context
**Solution:** Use Option 1 above (set root directory to packages/frontend)

### Issue: "Cannot find module @intelligenai/shared"
**Cause:** Old cached dependencies or wrong build context
**Solutions:**
1. Clear Vercel build cache (redeploy)
2. Use fresh deployment with Option 1
3. Check that latest code is pushed to GitHub

### Issue: Workspace/Monorepo Problems
**Cause:** Vercel having trouble with npm workspaces
**Solution:** Deploy frontend as standalone project (Option 1)

## Recommended Deployment Steps

1. **Push latest changes to GitHub**
   ```bash
   git add .
   git commit -m "Fix deployment configuration"
   git push origin main
   ```

2. **Create new Vercel project (or update existing)**
   - Go to [vercel.com](https://vercel.com)
   - Import from GitHub
   - **Important: Set Root Directory to `packages/frontend`**
   - Build Command: `npm run build`
   - Output Directory: `build`

3. **Deploy**
   - Vercel will automatically deploy
   - Should work without workspace issues

## Alternative: Netlify Deployment

If Vercel continues to have issues:

1. **Build locally:**
   ```bash
   cd packages/frontend
   npm install
   npm run build
   ```

2. **Deploy to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `packages/frontend/build` folder
   - Or connect GitHub with build settings:
     - Base directory: `packages/frontend`
     - Build command: `npm run build`
     - Publish directory: `packages/frontend/build`

## Files Created for Deployment

- `vercel.json` (root) - Monorepo configuration
- `packages/frontend/vercel.json` - Frontend-specific config
- `build-vercel.sh` - Custom build script
- `force-deploy.bat` - Windows deployment script

## Success Indicators

✅ **Build completes without errors**
✅ **No "Cannot find module" errors**
✅ **No "Missing script" errors**
✅ **Portfolio loads with all 5 projects**
✅ **Chat functionality works**
✅ **Theme switching works**

## Getting Help

If deployment still fails:
1. Check Vercel build logs for specific errors
2. Try Option 1 (frontend-only deployment)
3. Use manual CLI deployment as fallback
4. Consider Netlify as alternative platform