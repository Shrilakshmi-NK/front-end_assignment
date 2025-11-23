# Implementation Plan

- [x] 1. Set up project structure and dependencies















  - Initialize React project with TypeScript
  - Install TanStack React Table, testing libraries (Jest, React Testing Library, fast-check)
  - Configure ESLint, Prettier, and TypeScript strict mode
  - Set up project folder structure (components, services, hooks, types, tests)
  - _Requirements: 8.1_

- [x] 2. Create type definitions and data models





  - Define TaxRecord interface
  - Define Country interface
  - Define API response types and error types
  - Create type guards for runtime type checking
  - _Requirements: 8.2_

- [x] 3. Implement API service layer




  - Create TaxService with fetchTaxes() and updateTax() methods
  - Create CountryService with fetchCountries() method
  - Implement error handling and response parsing
  - Add request timeout configuration
  - _Requirements: 1.1, 4.1, 5.1_

- [x] 3.1 Write unit tests for API services


  - Test successful API responses
  - Test error handling for network failures
  - Test error handling for HTTP errors
  - Test request payload formatting
  - _Requirements: 1.1, 4.1, 5.1_

- [x] 4. Create custom hooks for data management




  - Implement useTaxData() hook for fetching and managing tax records
  - Implement useCountries() hook for fetching countries
  - Implement useEditModal() hook for modal state management
  - Add loading and error state management to hooks
  - _Requirements: 1.1, 1.2, 4.1, 5.4_

- [x] 4.1 Write property test for data fetching


  - **Property 1: Table displays all fetched records**
  - **Validates: Requirements 1.2**

- [x] 4.2 Write unit tests for custom hooks


  - Test useTaxData hook with mock API responses
  - Test useCountries hook with mock API responses
  - Test useEditModal hook state transitions
  - _Requirements: 1.1, 4.1_

- [x] 5. Build TaxTable component with TanStack React Table





  - Create TaxTable component using TanStack React Table
  - Define column definitions matching design specifications
  - Implement table rendering with proper data binding
  - Add edit icon column with click handlers
  - Style table to match Figma design
  - _Requirements: 1.2, 1.3, 1.4, 2.1_

- [x] 5.1 Write property test for table columns


  - **Property 2: Table contains all required columns**
  - **Validates: Requirements 1.3**

- [x] 5.2 Write property test for edit icons


  - **Property 3: Each table row has an edit icon**
  - **Validates: Requirements 2.1**

- [x] 5.3 Write unit tests for TaxTable component


  - Test table renders with empty data
  - Test table renders with multiple records
  - Test edit icon click triggers callback
  - _Requirements: 1.2, 2.1_

- [x] 6. Implement EditModal component





  - Create modal overlay and content structure
  - Implement modal open/close functionality
  - Add click-outside-to-close behavior
  - Implement focus trapping for accessibility
  - Style modal to match Figma design
  - _Requirements: 2.2, 2.4, 6.1, 6.4_

- [x] 6.1 Write property test for modal opening


  - **Property 4: Edit icon opens modal with correct data**
  - **Validates: Requirements 2.2, 2.3**

- [x] 6.2 Write property test for modal interaction blocking


  - **Property 5: Modal prevents table interaction**
  - **Validates: Requirements 2.4**

- [x] 6.3 Write unit tests for EditModal component


  - Test modal renders when open
  - Test modal doesn't render when closed
  - Test click outside closes modal
  - Test escape key closes modal
  - _Requirements: 2.2, 2.4, 6.4_

- [x] 7. Create form inputs for EditModal





  - Implement name input field with controlled component pattern
  - Implement country dropdown with fetched countries
  - Add real-time input validation
  - Display current values when modal opens
  - _Requirements: 2.3, 3.1, 3.2, 4.2, 4.3_

- [x] 7.1 Write property test for name input updates


  - **Property 6: Name input updates in real-time**
  - **Validates: Requirements 3.2**

- [x] 7.2 Write property test for whitespace validation


  - **Property 7: Whitespace-only names prevent saving**
  - **Validates: Requirements 3.3, 3.4**

- [x] 7.3 Write property test for country dropdown


  - **Property 8: Country dropdown displays all fetched countries**
  - **Validates: Requirements 4.2, 4.3**

- [x] 7.4 Write property test for country selection


  - **Property 9: Country selection updates the value**
  - **Validates: Requirements 4.4**

- [x] 7.5 Write unit tests for form inputs


  - Test name input value changes
  - Test country dropdown populates with data
  - Test validation prevents empty name submission
  - _Requirements: 3.1, 3.2, 3.3, 4.2_

- [x] 8. Implement save and cancel functionality




  - Create save button with validation check
  - Implement PUT request with all existing fields preserved
  - Create cancel button to close modal without saving
  - Handle successful save (close modal, refresh table)
  - Handle save errors (display error, keep modal open)
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 6.2, 6.3_

- [x] 8.1 Write property test for data preservation


  - **Property 10: PUT request preserves all existing fields**
  - **Validates: Requirements 5.2**

- [x] 8.2 Write property test for successful save


  - **Property 11: Successful save closes modal and refreshes data**
  - **Validates: Requirements 5.3, 5.4**

- [x] 8.3 Write property test for cancel behavior


  - **Property 12: Modal close without save discards changes**
  - **Validates: Requirements 6.2, 6.3, 6.4**

- [x] 8.4 Write unit tests for save/cancel operations


  - Test save button disabled when name is invalid
  - Test successful save closes modal
  - Test failed save keeps modal open
  - Test cancel discards changes
  - _Requirements: 5.1, 5.3, 5.5, 6.2_

- [x] 9. Add loading states and indicators





  - Create LoadingSpinner component
  - Display loading indicator while fetching taxes
  - Display loading indicator while fetching countries
  - Display loading indicator during save operation
  - Disable form inputs during save operation
  - _Requirements: 7.3_

- [x] 9.1 Write property test for loading indicators


  - **Property 13: Loading states display indicators**
  - **Validates: Requirements 7.3**

- [x] 9.2 Write unit tests for loading states


  - Test loading spinner appears during data fetch
  - Test loading spinner appears during save
  - Test form disabled during save
  - _Requirements: 7.3_

- [x] 10. Implement error handling and display






  - Create ErrorMessage component
  - Display error when tax fetch fails
  - Display error when countries fetch fails (and disable dropdown)
  - Display error when save fails
  - Add retry functionality for failed operations
  - _Requirements: 1.5, 4.5, 5.5, 7.5, 8.3_

- [x] 10.1 Write property test for error messages









  - **Property 14: API errors display error messages**
  - **Validates: Requirements 1.5, 4.5, 5.5, 7.5, 8.3**

- [x] 10.2 Write unit tests for error handling



  - Test error message displays on fetch failure
  - Test error message displays on save failure
  - Test country dropdown disabled when countries fetch fails
  - Test retry functionality
  - _Requirements: 1.5, 4.5, 5.5_
-

- [x] 11. Integrate all components in main App




  - Create TaxTablePage component
  - Wire up all components with proper state management
  - Connect API services to components via hooks
  - Implement complete user flow (view → edit → save)
  - _Requirements: 1.1, 1.2, 2.2, 5.4_

- [x] 11.1 Write integration tests for complete flow


  - Test complete edit flow (open modal → edit → save → table updates)
  - Test complete cancel flow (open modal → edit → cancel → changes discarded)
  - Test error recovery flow
  - _Requirements: 1.1, 1.2, 2.2, 5.4, 6.2_

- [x] 12. Polish UI/UX and match Figma design




  - Fine-tune spacing, colors, and typography to match Figma
  - Add hover states and visual feedback for interactive elements
  - Implement smooth transitions and animations
  - Add focus styles for keyboard navigation
  - Test responsive behavior if required
  - _Requirements: 7.1, 7.2, 7.4_

- [x] 13. Implement accessibility features





  - Add ARIA labels to all interactive elements
  - Ensure keyboard navigation works throughout
  - Test with screen reader
  - Ensure proper focus management in modal
  - Verify color contrast meets WCAG standards
  - _Requirements: 7.1, 7.2_

- [x] 14. Final checkpoint - Ensure all tests pass






  - Ensure all tests pass, ask the user if questions arise.
