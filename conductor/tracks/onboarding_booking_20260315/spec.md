# Track Specification: Core Onboarding & Calendar Booking

## Overview
This track focuses on the foundational experience of the SaaS: allowing a psychologist to securely connect their Google Calendar and providing a public, real-time booking page for patients.

## Functional Requirements
### 1. Authentication & Backend Infrastructure
- **Clerk Integration:** Passwordless authentication for psychologists.
- **Convex Setup:** Real-time backend for storing user settings and integration status.

### 2. Meditative Onboarding (Psychologist Flow)
- **Step-by-Step Connection:** A distraction-free flow to connect Google Calendar using secure, permission-based authorization (OAuth2).
- **Integration Status:** Clear, human-language feedback on connection success or required actions.

### 3. Serene Operational Dashboard
- **Upcoming Appointments:** A clear, high-white-space view of synced events.
- **System Status:** Visual confirmation that integrations are "Live" and "Secure."

### 4. Integrated Calendar Booking (Patient Flow)
- **Real-Time Availability:** A public booking page that displays free slots by syncing directly with the psychologist's Google Calendar.
- **Patient Intake:** A simple form (Name, Email, Phone) to request a slot.
- **Instant Confirmation:** Automatic creation of the event in Google Calendar and an immediate confirmation message for the patient.

## Non-Functional Requirements
- **Performance:** Instantaneous page loads and transitions.
- **Accessibility:** High WCAG compliance for both psychologist and patient interfaces.
- **Security:** Secure authorization flows (Clerk OAuth) and encrypted data handling.
- **Visual Identity:** Adherence to the "Premium Clinical" guidelines (warm whites, sage greens, refined typography).

## Acceptance Criteria
- [ ] Psychologist can sign in via Clerk and see the "Meditative Onboarding" flow.
- [ ] Psychologist can successfully connect Google Calendar and see a "Connected" status.
- [ ] Psychologist's dashboard displays upcoming events synced from Google Calendar.
- [ ] A public booking URL is generated and displays real-time available slots.
- [ ] A patient can book a slot, and the event is correctly created in the psychologist's Google Calendar.
- [ ] Patient receives an immediate on-screen confirmation and a system-sent reminder.

## Out of Scope
- WhatsApp Business integration (to be handled in a subsequent track).
- Multi-therapist clinic management.
- Custom domain mapping for booking pages.
