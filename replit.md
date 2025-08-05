# Scheduled - Business Management Platform

## Overview
Scheduled is a comprehensive business management platform designed for service-based entrepreneurs. It provides dynamic, customizable tools for growth and operational efficiency, including appointment management, predictive AI insights, executive dashboards, and extensive industry-specific customization. The platform aims to empower businesses with seamless data migration from existing scheduling platforms and is targeted for iOS App Store deployment with a premium pricing model. Its core vision is to offer a robust, reliable, and user-friendly solution that minimizes adoption barriers and maximizes operational efficiency for service-based businesses.

## User Preferences
- Focus on practical solutions that remove adoption barriers
- Prioritize data migration capabilities over additional features
- Emphasize clear user flows and intuitive navigation
- Target professional operators who need reliable business tools

## System Architecture

### UI/UX Decisions
- React.js with TypeScript for frontend development.
- Tailwind CSS for responsive design, utilizing a clean slate/blue color scheme and professional, gender-neutral aesthetic.
- All UI components are custom (e.g., AlertDialogs instead of native browser prompts).
- Emphasis on clear step-by-step progress indicators and simplified navigation.
- Consistent design language with dynamic industry-specific color theming and premium card styling for AI insights.

### Technical Implementations
- **Frontend:** React.js with TypeScript, Capacitor for cross-platform mobile development, Wouter for client-side routing, TanStack Query for server state, and React Context for industry/theme management.
- **Backend:** Express with Node.js for API routes (Appointments, Services, Staff, AI insights, Data import).
- **Database:** Drizzle ORM for database interactions, utilizing PostgreSQL for permanent data persistence ensuring zero data loss.
- **Data Management:** In-memory storage (MemStorage) is used for development flexibility, with an interface for easy database migration. Aggressive cache invalidation ensures real-time updates.
- **Core Features:**
    - **Multi-Industry Support:** Pre-configured templates for Beauty, Wellness, Home Services, Pet Care, Creative Services, and Custom. Industry switching dynamically regenerates services and updates UI.
    - **Appointment Management:** Comprehensive booking flow with 30-minute time slots, operator approval workflow, and automatic client creation.
    - **Client Management:** Dedicated database with full CRUD operations, search, filtering, and contact information storage.
    - **AI-Powered Insights:** Industry-specific recommendations for scheduling optimization, marketing automation, and predictive insights, displayed with premium design.
    - **Payment System:** Comprehensive multi-payment options (Stripe, PayPal, Zelle, Venmo) integrated with professional tipping interface and hardware recommendations. Estimates convert to invoices with payment links.
    - **Data Import:** Comprehensive system with platform-specific export instructions and CSV field mapping for 12+ scheduling platforms.
    - **Business Tools:** Photo documentation, Google Business setup assistant, review request email system, material cost tracker, professional job estimation & quoting system (contractor-focused).
    - **Error Handling:** Robust error handling, UI feedback instead of browser alerts, and zero TypeScript errors for production builds.

### System Design Choices
- **Modular Architecture:** Pages and components are modular for reusability and maintainability.
- **Mobile-First Design:** Responsive across all devices, optimized for iOS App Store deployment.
- **"No Fluff" Implementation:** All features are fully functional and production-ready, eliminating "coming soon" placeholders.
- **Focus on Core Business Management:** Non-functional or less critical features (e.g., 3D visualization, detailed vehicle/equipment tracking) were removed to streamline the application and enhance user experience.
- **Secure Authentication:** Proper authentication flow ensures users complete setup before accessing the dashboard.

## External Dependencies
- **Capacitor:** For cross-platform mobile development, enabling iOS App Store deployment.
- **Drizzle ORM:** For database interactions with PostgreSQL.
- **Stripe:** For payment processing, including direct referrals for Stripe Terminal hardware.
- **PayPal, Zelle, Venmo:** Integrated as additional payment options.
- **Resend API:** For reliable email delivery, specifically for review request emails and appointment confirmations.
- **Google Business Profile API (implied):** For the Google Business setup assistant and SEO optimization.
- **Third-party scheduling platforms (for data import):** Vagaro, Booksy, GlossGenius, Square Appointments, Fresha, MindBody, Acuity Scheduling, Schedulicity, Jobber, ServiceTitan, Housecall Pro, FieldEdge, Gingr, Pet Sitter Plus, PawLoyalty, Kennel Connection, HoneyBook, Pixieset, Studio Ninja, Calendly, Setmore, SimplyBook.me, Appointy.