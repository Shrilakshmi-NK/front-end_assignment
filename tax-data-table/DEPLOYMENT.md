# Deployment Guide

This guide provides step-by-step instructions for deploying the Tax Data Table application to various platforms.

## Prerequisites

Before deploying, ensure:
- All tests pass: `npm test`
- Build succeeds: `npm run build`
- No linting errors: `npm run lint`

## GitHub Pages Deployment

### Step 1: Prepare Your Repository

1. Create a new repository on GitHub (if not already done)
2. Initialize git in your project (if not already done):

```bash
cd tax-data-table
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### Step 2: Configure Vite for GitHub Pages

Update `vite.config.ts`:

```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/YOUR_REPO_NAME/', // Replace with your repository name
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './src/test/setup.ts',
  },
})
```

### Step 3: Install gh-pages

```bash
npm install --save-dev gh-pages
```

### Step 4: Add Deploy Script

Add to `package.json` scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "test": "vitest --run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### Step 5: Deploy

```bash
npm run deploy
```

### Step 6: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings"
3. Scroll to "Pages" section
4. Under "Source", select "gh-pages" branch
5. Click "Save"

Your site will be available at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

## Vercel Deployment

### Option 1: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Option 2: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Click "Deploy"

Your site will be available at: `https://your-project.vercel.app`

## Netlify Deployment

### Option 1: Using Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Deploy
netlify deploy --prod
```

### Option 2: Using Netlify Dashboard

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to your Git provider (GitHub)
4. Select your repository
5. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy site"

Your site will be available at: `https://your-site-name.netlify.app`

## Environment Variables

If you need to use different API endpoints for production:

1. Create `.env.production` file:

```env
VITE_API_BASE_URL=https://your-production-api.com
```

2. Update your service files to use:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://685013d7e7c42cfd17974a33.mockapi.io';
```

3. Configure environment variables in your deployment platform:
   - **Vercel**: Project Settings → Environment Variables
   - **Netlify**: Site Settings → Environment Variables
   - **GitHub Pages**: Use GitHub Secrets and GitHub Actions

## Custom Domain

### GitHub Pages

1. Add a `CNAME` file to the `public` folder with your domain
2. Configure DNS:
   - Add A records pointing to GitHub's IPs
   - Or add CNAME record pointing to `YOUR_USERNAME.github.io`
3. Enable HTTPS in repository settings

### Vercel

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS as instructed by Vercel

### Netlify

1. Go to Site Settings → Domain Management
2. Add custom domain
3. Configure DNS as instructed by Netlify

## Continuous Deployment

### GitHub Actions (for GitHub Pages)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: |
        cd tax-data-table
        npm ci
        
    - name: Run tests
      run: |
        cd tax-data-table
        npm test
        
    - name: Build
      run: |
        cd tax-data-table
        npm run build
        
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./tax-data-table/dist
```

## Troubleshooting

### Build Fails

- Check Node.js version: `node --version` (should be 18+)
- Clear node_modules: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npm run build`

### Tests Fail

- Run tests locally: `npm test`
- Check test output for specific failures
- Ensure all dependencies are installed

### 404 Errors on Deployed Site

- For GitHub Pages: Ensure `base` in `vite.config.ts` matches repo name
- For SPAs: Configure redirects (see platform-specific docs)

### Assets Not Loading

- Check `base` path in `vite.config.ts`
- Verify asset paths are relative
- Check browser console for errors

## Performance Optimization

Before deploying to production:

1. **Analyze bundle size**:
```bash
npm run build
```

2. **Enable compression** (most platforms do this automatically)

3. **Configure caching headers** (platform-specific)

4. **Use CDN** for static assets (optional)

## Monitoring

After deployment:

1. **Check site is accessible**
2. **Test all features work**
3. **Verify API calls succeed**
4. **Test on different devices/browsers**
5. **Check accessibility** with tools like Lighthouse

## Rollback

If deployment fails:

- **GitHub Pages**: Revert commit and redeploy
- **Vercel**: Use deployment history to rollback
- **Netlify**: Use deployment history to rollback

## Support

For deployment issues:
- GitHub Pages: [GitHub Pages Documentation](https://docs.github.com/pages)
- Vercel: [Vercel Documentation](https://vercel.com/docs)
- Netlify: [Netlify Documentation](https://docs.netlify.com)
