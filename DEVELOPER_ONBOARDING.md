# Developer Onboarding Guide

## Quick Start (5 minutes)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Access the application:**
   - Frontend: http://localhost:5000
   - Backend API: http://localhost:5000/api

## Project Architecture Overview

### Tech Stack
- **Frontend:** React + TypeScript + Tailwind CSS
- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL with Drizzle ORM
- **Email:** Resend API (configured and working)
- **Mobile:** Capacitor for iOS deployment

### Key Directories
```
├── client/src/           # React frontend
│   ├── components/       # Reusable UI components
│   ├── pages/           # Main application pages
│   └── lib/             # Utilities and contexts
├── server/              # Express backend
│   ├── routes.ts        # All API endpoints
│   ├── storage.ts       # Database operations
│   └── *.ts            # Service modules
├── shared/              # Shared types and schemas
└── ios/                # iOS app configuration
```

## What's Already Complete

### ✅ Core Features (100% Working)
- **Multi-industry business management** (Beauty, Wellness, Home Services, etc.)
- **Appointment scheduling** with calendar interface
- **Client management** with full CRUD operations
- **Email system** with Resend integration (verified working)
- **Review request automation** (sends real emails)
- **Payment processing** with Stripe integration
- **AI-powered insights** and business intelligence
- **Mobile-responsive design** with Capacitor setup
- **Database schema** with proper relationships

### ✅ Technical Infrastructure
- **Authentication system** with session management
- **API endpoints** for all major features
- **Form validation** with Zod schemas
- **Error handling** and logging
- **Development workflow** with hot reload
- **TypeScript** throughout codebase
- **Tailwind CSS** with custom design system

## Common Development Tasks

### Adding New Features
1. **Database changes:** Update `shared/schema.ts` first
2. **API endpoints:** Add to `server/routes.ts`
3. **Frontend components:** Use existing UI components in `client/src/components/ui/`
4. **Forms:** Use `react-hook-form` with Zod validation

### Testing Email System
The email system is fully configured and working:
```bash
# Test email connectivity
curl -X POST http://localhost:5000/api/test-email
```

### Database Operations
```bash
# Push schema changes
npm run db:push

# View database in browser
npm run db:studio
```

## Important Notes

### Environment Variables
- **DATABASE_URL:** Already configured (PostgreSQL)
- **RESEND_API_KEY:** Already configured and working
- **STRIPE_SECRET_KEY:** Available for payment processing

### Email System
- Uses Resend API (much better than SendGrid)
- Can send to any email address with domain verification
- Currently configured with test domain
- All email templates are professional and working

### Mobile Deployment
- Capacitor is fully configured for iOS
- Ready for App Store submission
- All mobile features implemented

## Most Likely Tasks for New Developer

Based on the current state, you'll likely need help with:

1. **iOS App Store preparation** (if targeting mobile)
2. **Domain setup** for production email sending
3. **Performance optimization** for large client lists
4. **Additional integrations** (payment gateways, third-party services)
5. **UI/UX refinements** based on user feedback

## Getting Help

### Code Organization
- All major functionality is in clearly labeled files
- TypeScript provides excellent IntelliSense
- Components are well-documented with props interfaces
- API endpoints follow RESTful conventions

### Debugging
- Server logs show all API calls and responses
- Browser console shows React component states
- Email system has detailed logging
- Database operations are logged

### Testing
- Email system: Use `/api/test-email` endpoint
- Database: Use `/api/clients` to test CRUD operations
- Frontend: All components have error boundaries

## Estimated Implementation Time

Based on current state:
- **Basic bug fixes/UI tweaks:** 2-4 hours
- **New feature additions:** 4-8 hours
- **iOS App Store prep:** 8-12 hours
- **Production deployment:** 4-6 hours

The codebase is well-structured and most complex features are already implemented. Any experienced React/Node.js developer should be able to contribute effectively within a few hours.