# Track Implementation Plan: Core Onboarding & Calendar Booking

## Overview
This track implements the foundational psychologist onboarding, Google Calendar integration, and the real-time patient booking page.

---

## Phase 1: Project Scaffolding & Infrastructure [checkpoint: cdf750a]
Build the technical foundation with Next.js, Clerk, and Convex.

- [x] **Task 1: Initialize Project Structure** f0e5c2b
    - Scaffold Next.js application with Tailwind CSS and TypeScript.
    - Set up initial Vanilla CSS modules for core "Premium Clinical" components.
    - Install and configure Framer Motion and Lucide React.
- [x] **Task 2: Setup Convex Backend** 87eeeb3
    - Initialize Convex project and configure schema for users and integration settings.
    - Implement basic data fetching/writing functions.
- [x] **Task 3: Setup Clerk Authentication** f57e3a1
    - Configure Clerk for passwordless (email-link) authentication.
    - Implement the initial "Welcome" screen and psychologist sign-in flow.
- [x] **Task: Conductor - User Manual Verification 'Phase 1: Project Scaffolding & Infrastructure' (Protocol in workflow.md)** cdf750a

---

## Phase 2: Secure Google Calendar Integration [checkpoint: d4e5c85]
Implement the OAuth flow and data synchronization with Google Calendar.

- [x] **Task 4: Google OAuth Flow via Clerk** 886255a
    - Configure Google Cloud Console and Clerk for Google Calendar permissions.
    - Implement the "Meditative Onboarding" connection button with transparent permission messaging.
- [x] **Task 5: Availability Synchronization Logic** 8ecbe92
    - Implement Convex functions to fetch and cache Google Calendar events.
    - Build a background worker/service to keep availability updated in real-time.
- [x] **Task: Conductor - User Manual Verification 'Phase 2: Secure Google Calendar Integration' (Protocol in workflow.md)** d4e5c85

---

## Phase 3: Serene Operational Dashboard
Create the main dashboard UI and integration status monitoring.

- [x] **Task 6: Build the Dashboard Layout** c3cb9e2
    - Implement the "Serene" layout with generous white space and soft depth.
    - Create the "Upcoming Appointments" card with a refined typographic hierarchy.
- [x] **Task 7: Integration Status & Settings** 40355be
    - Build the status monitoring component showing "Connected" status for Google Calendar.
    - Implement "Permission Clarity" cards to explain what is currently being synced.
- [ ] **Task: Conductor - User Manual Verification 'Phase 3: Serene Operational Dashboard' (Protocol in workflow.md)**

---

## Phase 4: Integrated Calendar Booking (Public Flow)
Develop the patient-facing booking page and confirmation logic.

- [ ] **Task 8: Public Booking Page UI**
    - Design and build the distraction-free booking page for patients.
    - Implement the real-time slot selector with "Immediate Value Feedback."
- [ ] **Task 9: Patient Intake & Booking Logic**
    - Create the high-clarity intake form for essential patient data.
    - Implement the Convex mutation to create a new appointment and sync it back to Google Calendar.
- [ ] **Task 10: Confirmation & Closure**
    - Build the "Instant Confirmation" view with a reassuring summary.
    - Implement initial email/system notification logic for new bookings.
- [ ] **Task: Conductor - User Manual Verification 'Phase 4: Integrated Calendar Booking (Public Flow)' (Protocol in workflow.md)**

---

## Phase 5: Final Polish & Verification
Apply visual refinements and ensure end-to-end quality.

- [ ] **Task 11: Refined Motion & Typography Polish**
    - Finalize "Tactile Premium Feel" with soft transitions and impeccable tracking.
    - Audit all text for "Minimalist & Quiet" voice and tone.
- [ ] **Task 12: End-to-End Verification**
    - Perform a full walkthrough from psychologist registration to successful patient booking.
    - Verify responsiveness and accessibility compliance across mobile and desktop.
- [ ] **Task: Conductor - User Manual Verification 'Phase 5: Final Polish & Verification' (Protocol in workflow.md)**
