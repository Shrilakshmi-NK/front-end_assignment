# Quick Start Guide - Tax Data Table Application

## 🚀 Get Started in 3 Minutes

### Step 1: Install Dependencies

```bash
cd tax-data-table
npm install
```

### Step 2: Run the Application

```bash
npm run dev
```

Open your browser and go to: **http://localhost:5173**

### Step 3: Test the Application

```bash
npm test
```

---

## 📋 Complete Command Reference

### Development Commands

```bash
# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run linter
npm run lint

# Format code
npm run format
```

### Testing Commands

```bash
# Run all tests once
npm test

# Run tests in watch mode (auto-rerun on changes)
npm run test:watch

# Run tests with interactive UI
npm run test:ui
```

---

## 🌐 Viewing the Application

Once the dev server is running, you'll see:

```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

Click the Local URL or open **http://localhost:5173** in your browser.

---

## 🎯 Using the Application

### View Tax Records
- The table displays all tax records automatically on load
- Columns: ID, Name, Country, Edit Icon

### Edit a Record
1. Click the **✏️ edit icon** on any row
2. Modal opens with current values
3. **Edit the name** (required field)
4. **Select a country** from dropdown
5. Click **Save** to update
6. Click **Cancel** or outside modal to discard

### Keyboard Navigation
- **Tab**: Move between elements
- **Enter**: Activate buttons
- **Escape**: Close modal
- **Arrow Keys**: Navigate dropdown

---

## 🧪 Verify Everything Works

### Run Tests
```bash
npm test
```

Expected output:
```
✓ Test Files  17 passed (17)
✓ Tests  118 passed (118)
```

### Check Build
```bash
npm run build
```

Expected output:
```
✓ built in xxxms
dist/index.html                   x.xx kB
dist/assets/index-xxxxx.css      xx.xx kB
dist/assets/index-xxxxx.js      xxx.xx kB
```

---

## 📦 Deploy to GitHub Pages

### Quick Deploy (5 steps)

1. **Create GitHub repository** (if not done)

2. **Update vite.config.ts** - Change base path:
```typescript
export default defineConfig({
  base: '/your-repo-name/', // Replace with your repo name
  // ... rest stays the same
})
```

3. **Install gh-pages**:
```bash
npm install --save-dev gh-pages
```

4. **Add deploy script** to package.json:
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

5. **Deploy**:
```bash
# First time: push to GitHub
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main

# Deploy to GitHub Pages
npm run deploy
```

6. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: gh-pages branch
   - Save

Your site will be live at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

---

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5173 | xargs kill -9
```

### Dependencies Not Installing
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Tests Failing
```bash
# Check Node version (should be 18+)
node --version

# Reinstall dependencies
npm ci
npm test
```

### Build Errors
```bash
# Check for TypeScript errors
npx tsc --noEmit

# Clear build cache
rm -rf dist
npm run build
```

---

## 📁 Project Structure

```
tax-data-table/
├── src/
│   ├── components/       # UI components
│   ├── hooks/           # Custom hooks
│   ├── services/        # API services
│   ├── types/           # TypeScript types
│   ├── pages/           # Page components
│   └── App.tsx          # Root component
├── public/              # Static assets
├── .kiro/specs/         # Requirements & design docs
├── package.json         # Dependencies & scripts
├── vite.config.ts       # Vite configuration
└── README.md            # Full documentation
```

---

## 📚 Documentation

- **README.md** - Complete documentation
- **DEPLOYMENT.md** - Detailed deployment guide
- **ACCESSIBILITY.md** - Accessibility documentation
- **.kiro/specs/** - Requirements, design, and tasks

---

## 🆘 Need Help?

### Common Issues

**Q: Application won't start**
```bash
# Check if port is available
npm run dev -- --port 3000
```

**Q: API not working**
- Check internet connection
- API endpoint: https://685013d7e7c42cfd17974a33.mockapi.io/taxes

**Q: Tests failing**
```bash
# Run specific test file
npx vitest src/components/TaxTable.test.tsx
```

### Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [TanStack Table](https://tanstack.com/table/latest)
- [Vitest Documentation](https://vitest.dev/)

---

## ✅ Checklist

Before deploying:
- [ ] All tests pass (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] No linting errors (`npm run lint`)
- [ ] Application works locally (`npm run dev`)
- [ ] Tested edit functionality
- [ ] Tested error handling
- [ ] Checked accessibility

---

## 🎉 You're Ready!

Your Tax Data Table application is now:
- ✅ Running locally
- ✅ Fully tested
- ✅ Ready to deploy

For detailed deployment instructions, see **DEPLOYMENT.md**
