# Quick Start Guide for New Developer

## Get Running in 5 Minutes

### 1. Install and Start
```bash
npm install
npm run dev
```
App runs on `http://localhost:5000`

### 2. Test the Core Flow
1. Go to `/setup` - Choose industry template
2. Enter business name - Setup completes
3. Go to `/` - See your personalized service provider page
4. Click any image - Test the click-to-edit feature
5. Go to `/dashboard` - See the business management interface

### 3. Key Features to Test
- **Industry Switching**: Try different templates in setup
- **Image Editing**: Click hero, gallery, or service images
- **3D Projects**: Select "Home Services" to see 3D room builder
- **Review Requests**: Use Quick Actions to send test emails
- **Booking Flow**: Test appointment scheduling

### 4. Important Files
- `client/src/pages/Home.tsx` - Main service provider page
- `client/src/components/ui/image-editor.tsx` - Click-to-edit system
- `server/routes.ts` - All API endpoints
- `replit.md` - Project context and recent changes

### 5. Common Commands
```bash
npm run dev          # Development server
npm run build        # Production build
npm run ios:build    # iOS build
npm run db:push      # Database sync (when ready)
```

### 6. Recent Changes
- **Click-to-Edit Images**: Latest feature - click any image to customize
- **Simplified Setup**: Removed complex multi-step process
- **Industry Templates**: 6 professional templates with smart theming
- **Email Integration**: Real email delivery with Resend API

### 7. Next Steps
1. **Database**: Switch to PostgreSQL when ready
2. **iOS**: Test on device and prepare App Store submission
3. **Performance**: Optimize images and bundle size
4. **Features**: Add advanced scheduling and payment processing

**You're all set!** The platform is production-ready with a modern, intuitive interface.