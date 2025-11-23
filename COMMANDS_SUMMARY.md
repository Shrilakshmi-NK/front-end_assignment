# Commands Summary - Tax Data Table

## 🚀 Quick Commands

### Run the Application Locally
```bash
cd tax-data-table
npm install
npm run dev
```
**Open:** http://localhost:5173

### Run Tests
```bash
cd tax-data-table
npm test
```

### Build for Production
```bash
cd tax-data-table
npm run build
```

---

## 📦 All Available Commands

### Development
```bash
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run lint         # Check code quality
npm run format       # Format code with Prettier
```

### Testing
```bash
npm test             # Run all tests once
npm run test:watch   # Run tests in watch mode
npm run test:ui      # Run tests with interactive UI
```

### Deployment
```bash
npm run deploy       # Deploy to GitHub Pages (after setup)
```

---

## 🌐 GitHub Setup (One-Time)

```bash
# 1. Navigate to project root
cd path/to/your/project

# 2. Initialize git
git init
git add .
git commit -m "Initial commit: Tax Data Table Application"

# 3. Create repository on GitHub, then:
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

---

## 🚀 GitHub Pages Deployment (One-Time Setup)

### 1. Update vite.config.ts
Change:
```typescript
export default defineConfig({
  base: '/YOUR_REPO_NAME/',  // Add this line
  plugins: [react()],
  // ... rest stays same
})
```

### 2. Install gh-pages
```bash
cd tax-data-table
npm install --save-dev gh-pages
```

### 3. Add deploy script to package.json
Add to scripts section:
```json
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"
```

### 4. Commit and deploy
```bash
cd ..
git add .
git commit -m "Configure for GitHub Pages"
git push

cd tax-data-table
npm run deploy
```

### 5. Enable GitHub Pages
- Go to repository Settings → Pages
- Source: `gh-pages` branch
- Save

**Your site:** https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/

---

## 🔄 Update and Redeploy

```bash
# 1. Make your changes

# 2. Test locally
cd tax-data-table
npm run dev
npm test

# 3. Commit changes
cd ..
git add .
git commit -m "Your change description"
git push

# 4. Redeploy
cd tax-data-table
npm run deploy
```

---

## 🧪 Testing Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (auto-rerun on changes)
npm run test:watch

# Run tests with UI
npm run test:ui

# Run specific test file
npx vitest src/components/TaxTable.test.tsx

# Run tests with coverage
npx vitest --coverage
```

---

## 🔍 Debugging Commands

```bash
# Check for TypeScript errors
npx tsc --noEmit

# Check for linting errors
npm run lint

# Fix linting errors automatically
npm run lint -- --fix

# Format all files
npm run format

# Check build output
npm run build
ls -la dist/
```

---

## 🛠️ Troubleshooting Commands

### Clear and Reinstall
```bash
rm -rf node_modules package-lock.json
npm install
```

### Kill Process on Port 5173 (Windows)
```bash
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Kill Process on Port 5173 (Mac/Linux)
```bash
lsof -ti:5173 | xargs kill -9
```

### Run on Different Port
```bash
npm run dev -- --port 3000
```

### Clear Build Cache
```bash
rm -rf dist
npm run build
```

---

## 📊 Project Information Commands

```bash
# Check Node version
node --version

# Check npm version
npm --version

# List installed packages
npm list --depth=0

# Check for outdated packages
npm outdated

# View package info
npm info <package-name>
```

---

## 🔐 Git Commands

```bash
# Check status
git status

# View commit history
git log --oneline

# Create new branch
git checkout -b feature-name

# Switch branches
git checkout main

# Pull latest changes
git pull

# View remote URL
git remote -v

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard local changes
git checkout -- .
```

---

## 📦 npm Commands

```bash
# Install specific package
npm install <package-name>

# Install dev dependency
npm install --save-dev <package-name>

# Uninstall package
npm uninstall <package-name>

# Update all packages
npm update

# Audit for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

---

## 🎯 Complete Workflow Example

### First Time Setup
```bash
# 1. Setup project
cd tax-data-table
npm install

# 2. Test locally
npm run dev          # Visit http://localhost:5173
npm test            # Verify all tests pass
npm run build       # Verify build works

# 3. Push to GitHub
cd ..
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main

# 4. Setup deployment
cd tax-data-table
npm install --save-dev gh-pages
# (Update vite.config.ts)
# (Update package.json)
cd ..
git add .
git commit -m "Configure deployment"
git push

# 5. Deploy
cd tax-data-table
npm run deploy
```

### Daily Development
```bash
# 1. Start dev server
cd tax-data-table
npm run dev

# 2. Make changes...

# 3. Test
npm test

# 4. Commit
cd ..
git add .
git commit -m "Description"
git push

# 5. Deploy (if ready)
cd tax-data-table
npm run deploy
```

---

## 📱 Quick Reference

| Task | Command |
|------|---------|
| Start dev server | `npm run dev` |
| Run tests | `npm test` |
| Build | `npm run build` |
| Deploy | `npm run deploy` |
| Lint | `npm run lint` |
| Format | `npm run format` |
| Install deps | `npm install` |
| Git commit | `git add . && git commit -m "msg"` |
| Git push | `git push` |

---

## 🆘 Emergency Commands

### Something's broken, start fresh:
```bash
# 1. Clean everything
rm -rf node_modules package-lock.json dist

# 2. Reinstall
npm install

# 3. Test
npm test

# 4. Build
npm run build
```

### Deployment not working:
```bash
# 1. Check config
cat vite.config.ts | grep base

# 2. Rebuild
npm run build

# 3. Redeploy
npm run deploy

# 4. Check GitHub Pages settings
# Go to: Settings → Pages → Check gh-pages branch selected
```

---

## ✅ Verification Commands

```bash
# Verify everything works:
cd tax-data-table
npm install          # Should complete without errors
npm test            # Should show 118 tests passing
npm run build       # Should create dist/ folder
npm run dev         # Should start on port 5173
```

---

**Save this file for quick reference!** 📌
