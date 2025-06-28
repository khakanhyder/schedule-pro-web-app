# Scheduled - Business Management Platform

## Project Overview
A comprehensive business management platform designed to empower service-based entrepreneurs with dynamic, customizable tools for growth and operational efficiency. The platform features appointment management, predictive AI insights, executive dashboards, and extensive industry-specific customization.

**Key Technologies:**
- React.js with TypeScript
- Capacitor for cross-platform mobile development
- Drizzle ORM for database interactions
- Tailwind CSS for responsive design
- Advanced business intelligence and AI scheduling automation
- Comprehensive data import system for 12+ scheduling platforms

## Target Market
- Service-based businesses (Beauty, Wellness, Home Services, etc.)
- iOS App Store deployment targeting premium pricing ($299-499/month)
- Focus on seamless data migration to remove adoption barriers

## Recent Changes (December 29, 2024)

### Quality Audit & UX Improvements
Conducted comprehensive quality audit to identify and fix critical user flow problems:

**Navigation & Authentication Issues Fixed:**
- ✅ Removed "Setup" from main navigation (should be one-time onboarding only)
- ✅ Added proper authentication flow to dashboard - users must complete setup first
- ✅ Fixed hash navigation for smooth scrolling on homepage (Services, Reviews sections)
- ✅ Added setup completion tracking with localStorage flags

**Booking Experience Enhanced:**
- ✅ Added clear step-by-step progress indicators (Choose Service → Choose Staff → Pick Date/Time → Confirm)
- ✅ Improved mobile responsiveness with simplified progress dots
- ✅ Added descriptive text to guide users through booking process

**Homepage Improvements:**
- ✅ Replaced confusing "iOS App Preview" button with useful "Book Now" and "Business Portal" CTAs
- ✅ Fixed floating action buttons for better user engagement

**Dashboard Access Control:**
- ✅ Dashboard now checks for setup completion before allowing access
- ✅ Shows clear setup requirements if not completed
- ✅ Guides users back to setup process when needed

**Contractor-Friendly Terminology:**
- ✅ Simplified setup to remove confusing template customization steps
- ✅ Kept industry selection (Beauty, Wellness, Home Services, etc.) for initial personalization
- ✅ Renamed "StylistDashboard" to generic "Dashboard" for broader appeal
- ✅ Updated terminology throughout to use "staff/team" instead of beauty-specific terms

## Data Import System
Comprehensive migration system supporting 12+ scheduling platforms:
- Vagaro, Booksy, Square Appointments, Acuity Scheduling
- MindBody, Schedulicity, Fresha, Timely, Salon Iris, Rosy
- GlossGenius direct API integration
- CSV import with smart field mapping and preview

**Step-by-step export instructions provided for each platform to remove migration barriers.**

## Project Architecture

### Frontend (React + TypeScript)
- **Pages:** Home, Booking, Dashboard, Setup, Admin
- **Components:** Modular dashboard components, booking flow, industry-specific features
- **State Management:** TanStack Query for server state, Context for industry/theme
- **Routing:** Wouter for client-side routing

### Backend (Express + Node.js)
- **API Routes:** Appointments, Services, Staff, AI insights, Data import
- **Storage:** In-memory storage with interface for easy database migration
- **AI Services:** Scheduling optimization, marketing automation, predictive insights

### Key Features
1. **Multi-Industry Support:** Beauty, Wellness, Home Services, Custom businesses
2. **AI-Powered Insights:** Smart scheduling, marketing automation, client analytics
3. **Business Intelligence:** Executive dashboard, growth tools, automation workflows
4. **Data Migration:** Seamless import from existing scheduling platforms
5. **Mobile-First Design:** Responsive across all devices

## User Preferences
- Focus on practical solutions that remove adoption barriers
- Prioritize data migration capabilities over additional features
- Emphasize clear user flows and intuitive navigation
- Target professional operators who need reliable business tools

## Development Guidelines
- Follow fullstack JavaScript best practices
- Use in-memory storage (MemStorage) unless database explicitly requested
- Prioritize mobile responsiveness and accessibility
- Implement proper error handling and loading states
- Document all architectural changes in this file

## Deployment
- Target: iOS App Store via Capacitor
- Pricing: Premium ($299-499/month)
- Focus: Enterprise-level features with seamless migration