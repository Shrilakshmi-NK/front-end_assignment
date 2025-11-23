# Tax Data Table Application

A modern, accessible React application for viewing and editing tax records. Built with React, TypeScript, TanStack React Table, and comprehensive testing including property-based testing.

## Features

- **View Tax Records**: Display tax data in a clean, sortable table format
- **Edit Records**: Click edit icons to modify tax record names and countries
- **Real-time Validation**: Prevent invalid data entry with instant feedback
- **Error Handling**: Graceful error handling with user-friendly messages
- **Loading States**: Clear loading indicators during data operations
- **Accessibility**: WCAG 2.1 Level AA compliant with keyboard navigation and screen reader support
- **Comprehensive Testing**: 118 tests including unit tests and property-based tests

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TanStack React Table** - Headless table library
- **Vitest** - Testing framework
- **React Testing Library** - Component testing
- **fast-check** - Property-based testing
- **Happy DOM** - DOM environment for tests

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

```bash
# Navigate to the project directory
cd tax-data-table

# Install dependencies
npm install
```

### Running the Application

```bash
# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

### Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui
```

## Project Structure

```
tax-data-table/
├── src/
│   ├── components/          # React components
│   │   ├── TaxTable.tsx    # Main table component
│   │   ├── EditModal.tsx   # Edit modal component
│   │   ├── LoadingSpinner.tsx
│   │   └── ErrorMessage.tsx
│   ├── hooks/              # Custom React hooks
│   │   ├── useTaxData.ts   # Tax data management
│   │   ├── useCountries.ts # Countries data
│   │   └── useEditModal.ts # Modal state
│   ├── services/           # API services
│   │   ├── taxService.ts   # Tax API calls
│   │   └── countryService.ts
│   ├── types/              # TypeScript types
│   │   └── index.ts
│   ├── pages/              # Page components
│   │   └── TaxTablePage.tsx
│   ├── test/               # Test setup
│   │   └── setup.ts
│   ├── App.tsx             # Root component
│   └── main.tsx            # Entry point
├── .kiro/                  # Specification documents
│   └── specs/
│       └── tax-data-table/
│           ├── requirements.md
│           ├── design.md
│           └── tasks.md
└── package.json
```

## API Endpoints

The application uses MockAPI for data:

- **Taxes**: `https://685013d7e7c42cfd17974a33.mockapi.io/taxes`
- **Countries**: `https://685013d7e7c42cfd17974a33.mockapi.io/countries`

## Usage Guide

### Viewing Tax Records

1. Open the application in your browser
2. The table displays all tax records with columns for ID, Name, and Country
3. Each row has an edit icon on the right

### Editing a Record

1. Click the edit icon (✏️) on any row
2. The edit modal opens with the current values
3. Modify the name field (required, cannot be empty or whitespace only)
4. Select a different country from the dropdown
5. Click "Save" to update the record
6. Click "Cancel" or click outside the modal to discard changes

### Keyboard Navigation

- **Tab**: Navigate between interactive elements
- **Enter**: Activate buttons
- **Escape**: Close modal
- **Arrow Keys**: Navigate dropdown options

## Testing

The application includes comprehensive testing:

- **Unit Tests**: Test individual components and functions
- **Property-Based Tests**: Verify correctness properties across random inputs
- **Integration Tests**: Test complete user flows

### Test Coverage

- 17 test files
- 118 total tests
- All tests passing
- Coverage includes:
  - Component rendering
  - User interactions
  - API error handling
  - Form validation
  - Accessibility features

## Deployment

### GitHub Pages Deployment

1. **Update `vite.config.ts`** to set the base path:

```typescript
export default defineConfig({
  base: '/your-repo-name/',
  // ... rest of config
})
```

2. **Build the project**:

```bash
npm run build
```

3. **Deploy to GitHub Pages**:

Option A - Using gh-pages package:
```bash
npm install --save-dev gh-pages
```

Add to `package.json` scripts:
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

Then run:
```bash
npm run deploy
```

Option B - Manual deployment:
- Push the `dist` folder to a `gh-pages` branch
- Enable GitHub Pages in repository settings

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify Deployment

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy

## Code Quality

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run format
```

## Accessibility

The application follows WCAG 2.1 Level AA guidelines:

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Focus management in modals
- Color contrast compliance
- Screen reader compatibility

See `ACCESSIBILITY.md` for detailed accessibility documentation.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Run linting: `npm run lint`
6. Submit a pull request

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
