# Complete Setup and Deployment Guide

## 🎯 Overview

This guide will help you:
1. Set up the project locally
2. Test the application
3. Push to GitHub
4. Deploy to GitHub Pages

---

## Part 1: Local Setup and Testing

### Step 1: Navigate to Project

```bash
cd tax-data-table
```

### Step 2: Install Dependencies

```bash
npm install
```

Wait for installation to complete (may take 1-2 minutes).

### Step 3: Run the Application

```bash
npm run dev
```

You should see:
```
VITE v7.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

**Open your browser** and go to: http://localhost:5173

### Step 4: Test the Application Manually

1. ✅ Table loads with tax records
2. ✅ Click edit icon (✏️) on any row
3. ✅ Modal opens with current values
4. ✅ Change the name field
5. ✅ Select different country
6. ✅ Click Save - modal closes, table updates
7. ✅ Click edit again, then Cancel - changes discarded

### Step 5: Run Automated Tests

Open a **new terminal** (keep dev server running) and run:

```bash
cd tax-data-table
npm test
```

Expected output:
```
✓ Test Files  17 passed (17)
✓ Tests  118 passed (118)
Duration  45s
```

### Step 6: Build for Production

```bash
npm run build
```

Expected output:
```
✓ built in xxxms
dist/index.html
dist/assets/...
```

---

## Part 2: Push to GitHub

### Step 1: Create GitHub Repository

1. Go to https://github.com
2. Click **"New repository"** (green button)
3. Repository name: `tax-data-table` (or your choice)
4. Description: "Tax data management application"
5. **Public** or Private (your choice)
6. **DO NOT** initialize with README
7. Click **"Create repository"**

### Step 2: Initialize Git (if not already done)

```bash
# Navigate to project root (parent of tax-data-table folder)
cd ..

# Initialize git
git init
git add .
git commit -m "Initial commit: Tax Data Table Application"
```

### Step 3: Connect to GitHub

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual values:

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

You may be prompted to login to GitHub.

---

## Part 3: Deploy to GitHub Pages

### Step 1: Update Vite Configuration

Edit `tax-data-table/vite.config.ts`:

**Find this line:**
```typescript
export default defineConfig({
  plugins: [react()],
```

**Change to:**
```typescript
export default defineConfig({
  base: '/YOUR_REPO_NAME/',  // Replace with your actual repo name
  plugins: [react()],
```

**Example:** If your repo is `tax-data-table`, use:
```typescript
base: '/tax-data-table/',
```

### Step 2: Install gh-pages

```bash
cd tax-data-table
npm install --save-dev gh-pages
```

### Step 3: Add Deploy Script

Edit `tax-data-table/package.json`:

**Find the "scripts" section and add:**
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

### Step 4: Commit Changes

```bash
cd ..
git add .
git commit -m "Configure for GitHub Pages deployment"
git push
```

### Step 5: Deploy

```bash
cd tax-data-table
npm run deploy
```

Wait for deployment to complete. You should see:
```
Published
```

### Step 6: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **"Settings"** tab
3. Scroll down to **"Pages"** in left sidebar
4. Under **"Source"**:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
5. Click **"Save"**

### Step 7: Access Your Deployed Site

Your site will be available at:
```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

**Note:** It may take 1-2 minutes for the site to be available after first deployment.

---

## Part 4: Verify Deployment

### Check Your Live Site

1. Open: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`
2. ✅ Table loads with data
3. ✅ Edit functionality works
4. ✅ No console errors (press F12 to check)

### Test on Different Devices

- Desktop browser
- Mobile browser
- Different browsers (Chrome, Firefox, Safari, Edge)

---

## Part 5: Making Updates

### Update Code

1. Make your changes in the code
2. Test locally: `npm run dev`
3. Run tests: `npm test`
4. Commit changes:
```bash
git add .
git commit -m "Description of changes"
git push
```

### Redeploy

```bash
cd tax-data-table
npm run deploy
```

---

## 🔧 Troubleshooting

### Issue: "gh-pages not found"

**Solution:**
```bash
cd tax-data-table
npm install --save-dev gh-pages
```

### Issue: "Permission denied" when pushing to GitHub

**Solution:**
1. Check you're logged into GitHub
2. Use personal access token instead of password
3. Or use SSH keys

### Issue: 404 Error on deployed site

**Solution:**
1. Check `base` in `vite.config.ts` matches repo name exactly
2. Ensure GitHub Pages is enabled with `gh-pages` branch
3. Wait 1-2 minutes after deployment

### Issue: Assets not loading on deployed site

**Solution:**
1. Verify `base` path in `vite.config.ts`
2. Check browser console for errors
3. Ensure all paths are relative

### Issue: API calls failing

**Solution:**
- Check internet connection
- Verify API endpoint is accessible
- Check browser console for CORS errors

---

## 📋 Complete Command Checklist

```bash
# 1. Setup
cd tax-data-table
npm install

# 2. Test locally
npm run dev          # Open http://localhost:5173
npm test            # Run tests
npm run build       # Build for production

# 3. Push to GitHub
cd ..
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main

# 4. Deploy to GitHub Pages
cd tax-data-table
npm install --save-dev gh-pages
# (Update vite.config.ts with base path)
# (Add deploy script to package.json)
cd ..
git add .
git commit -m "Configure for GitHub Pages"
git push
cd tax-data-table
npm run deploy
```

---

## 🎉 Success!

You now have:
- ✅ Working local development environment
- ✅ Code on GitHub
- ✅ Live deployed application
- ✅ Ability to make updates and redeploy

---

## 📚 Additional Resources

- **README.md** - Full documentation
- **DEPLOYMENT.md** - Detailed deployment options
- **QUICK_START.md** - Quick reference guide
- **.kiro/specs/** - Requirements and design documents

---

## 🆘 Need Help?

### GitHub Issues
Create an issue in your repository for tracking problems.

### Documentation
- [GitHub Pages Docs](https://docs.github.com/pages)
- [Vite Docs](https://vitejs.dev/)
- [React Docs](https://react.dev/)

### Common Questions

**Q: Can I use a custom domain?**
A: Yes! Add a CNAME file to the `public` folder and configure DNS.

**Q: How do I update the deployed site?**
A: Make changes, commit, push, then run `npm run deploy` again.

**Q: Can I deploy to other platforms?**
A: Yes! See DEPLOYMENT.md for Vercel and Netlify instructions.

**Q: How do I check deployment status?**
A: Go to repository → Actions tab to see deployment progress.

---

## ✅ Final Checklist

Before considering deployment complete:

- [ ] Local development works (`npm run dev`)
- [ ] All tests pass (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] Code pushed to GitHub
- [ ] `vite.config.ts` updated with correct base path
- [ ] gh-pages installed
- [ ] Deploy script added to package.json
- [ ] Deployed successfully (`npm run deploy`)
- [ ] GitHub Pages enabled in settings
- [ ] Live site accessible and working
- [ ] Tested on multiple browsers/devices
- [ ] No console errors on live site

---

**Congratulations! Your application is now live! 🚀**
