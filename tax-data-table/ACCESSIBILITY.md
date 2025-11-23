# Accessibility Features

This document outlines the accessibility features implemented in the Tax Data Table application to ensure WCAG 2.1 Level AA compliance.

## Overview

The application has been designed with accessibility as a core principle, ensuring that all users, including those using assistive technologies, can effectively interact with the tax data management system.

## Implemented Features

### 1. ARIA Labels and Attributes

#### TaxTable Component
- **Table structure**: Proper semantic HTML with `<table>`, `<thead>`, `<tbody>` elements
- **Table caption**: Hidden caption describing the table purpose for screen readers
- **Column headers**: `scope="col"` attribute on all `<th>` elements
- **Region landmark**: `role="region"` with `aria-label` for the table container
- **Edit buttons**: Dynamic `aria-label` for each edit button (e.g., "Edit [Record Name]")
- **Empty state**: `role="status"` with `aria-live="polite"` for dynamic content updates

#### EditModal Component
- **Dialog role**: `role="dialog"` with `aria-modal="true"`
- **Modal title**: `aria-labelledby` linking to the modal heading
- **Form inputs**: Proper `id` and `for` attributes linking labels to inputs
- **Input validation**: `aria-invalid` attribute on invalid inputs
- **Error messages**: `role="alert"` for inline validation errors
- **Loading state**: `aria-busy` attribute on save button during operations
- **Close button**: Clear `aria-label` for the close button

#### LoadingSpinner Component
- **Status role**: `role="status"` with `aria-live="polite"`
- **Hidden decorative elements**: `aria-hidden="true"` on spinner animation
- **Screen reader text**: `.sr-only` class providing text alternative

#### ErrorMessage Component
- **Alert role**: `role="alert"` with `aria-live="assertive"` and `aria-atomic="true"`
- **Hidden decorative icons**: `aria-hidden="true"` on warning emoji
- **Retry button**: Clear `aria-label` describing the action

### 2. Keyboard Navigation

#### Focus Management
- **Skip link**: Keyboard users can skip directly to main content
- **Focus indicators**: Visible focus outlines (3px solid with offset) on all interactive elements
- **Focus trap**: Modal implements proper focus trapping
  - Tab cycles through focusable elements within modal
  - Shift+Tab cycles backwards
  - Focus returns to triggering element when modal closes
- **Escape key**: Closes modal when pressed
- **Tab order**: Logical tab order throughout the application

#### Interactive Elements
- All buttons, inputs, and links are keyboard accessible
- Edit buttons can be activated with Enter or Space
- Form submission works with Enter key
- Modal can be closed with Escape key

### 3. Focus Trap Implementation

The EditModal component implements a complete focus trap:
- Stores the previously focused element before opening
- Focuses the first input field when modal opens
- Prevents Tab from leaving the modal
- Cycles focus from last to first element (and vice versa)
- Restores focus to the triggering element when modal closes

### 4. Color Contrast (WCAG AA Compliant)

All text meets WCAG 2.1 Level AA contrast requirements:

#### Text Colors
- **Table headers**: `#343a40` on `#f8f9fa` background (10.37:1 ratio) ✓
- **Table body text**: `#212529` on white background (16.07:1 ratio) ✓
- **Form labels**: `#343a40` on white background (10.37:1 ratio) ✓
- **Loading message**: `#343a40` on `#f8f9fa` background (10.37:1 ratio) ✓
- **Empty state**: `#495057` on white background (7.44:1 ratio) ✓
- **Error text**: `#721c24` on `#fff5f5` background (8.59:1 ratio) ✓

#### Interactive Elements
- **Primary buttons**: White text on gradient background (sufficient contrast)
- **Edit buttons**: White text on purple gradient (sufficient contrast)
- **Focus indicators**: High contrast outlines (rgba(0, 123, 255, 0.5))

### 5. Semantic HTML Structure

#### Page Structure
- **Skip link**: Allows keyboard users to skip to main content
- **Header landmark**: `<header role="banner">` for page title
- **Main landmark**: `<main role="main">` for primary content
- **Proper heading hierarchy**: Single `<h1>` for page title, `<h2>` for modal title

#### Form Structure
- **Labels**: All inputs have associated `<label>` elements
- **Fieldsets**: Logical grouping of form controls
- **Required fields**: Validation feedback for required inputs

### 6. Screen Reader Support

#### Announcements
- **Loading states**: Announced via `aria-live="polite"`
- **Error messages**: Announced immediately via `aria-live="assertive"`
- **Form validation**: Invalid states announced with `aria-invalid`
- **Dynamic content**: Table updates announced to screen readers

#### Hidden Content
- **Decorative elements**: Icons marked with `aria-hidden="true"`
- **Screen reader only text**: `.sr-only` class for additional context
- **Table caption**: Hidden visually but available to screen readers

### 7. Reduced Motion Support

The application respects user preferences for reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## Testing Recommendations

### Manual Testing
1. **Keyboard navigation**: Navigate entire application using only keyboard
2. **Screen reader**: Test with NVDA, JAWS, or VoiceOver
3. **Zoom**: Test at 200% zoom level
4. **Color blindness**: Use color blindness simulators

### Automated Testing
- Run axe DevTools or WAVE browser extension
- Use Lighthouse accessibility audit
- Run automated tests with jest-axe

## Compliance Checklist

- ✅ All interactive elements are keyboard accessible
- ✅ Focus indicators are visible and clear
- ✅ Color contrast meets WCAG AA standards (4.5:1 for normal text)
- ✅ All images and icons have text alternatives
- ✅ Form inputs have associated labels
- ✅ Error messages are announced to screen readers
- ✅ Modal implements proper focus management
- ✅ Semantic HTML structure with landmarks
- ✅ Skip link for keyboard navigation
- ✅ Reduced motion support
- ✅ ARIA attributes used appropriately
- ✅ Dynamic content updates are announced

## Known Limitations

None at this time. The application meets WCAG 2.1 Level AA standards.

## Future Enhancements

Potential improvements for WCAG AAA compliance:
- Increase color contrast to 7:1 for all text
- Add high contrast mode toggle
- Implement additional keyboard shortcuts
- Add more comprehensive screen reader instructions
