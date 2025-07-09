# Testing Checklist for New Developer

## Core Functionality Tests

### Setup Flow
- [ ] Visit `/setup` and select each industry template
- [ ] Complete business name entry
- [ ] Verify setup completion redirects to dashboard
- [ ] Test "Back to Templates" functionality

### Industry Templates
- [ ] **Beauty**: Verify salon theme, services, and imagery
- [ ] **Wellness**: Check spa theme and wellness services
- [ ] **Home Services**: Confirm contractor theme and 3D projects tab
- [ ] **Pet Care**: Test pet care theme and terminology
- [ ] **Creative**: Verify creative services and portfolio theme
- [ ] **Custom**: Test generic business template

### Image Customization System
- [ ] Click hero image - modal opens correctly
- [ ] Upload new image - saves and displays immediately
- [ ] "Keep Current Image" - maintains original template image
- [ ] Click gallery images - individual editing works
- [ ] Click service images - per-service customization works
- [ ] Cancel button - closes without saving
- [ ] Test file validation (size limits, image types)

### Service Provider Page
- [ ] Hero section displays correctly with industry content
- [ ] Gallery shows 3 industry-appropriate images
- [ ] Services section shows industry-specific offerings
- [ ] Reviews section displays properly
- [ ] Booking button navigates to booking flow
- [ ] All industry terminology is correct

### Dashboard Features
- [ ] Dashboard loads with industry-specific content
- [ ] Quick Actions work (especially review requests)
- [ ] Calendar displays appointments correctly
- [ ] Clients tab shows client management
- [ ] 3D Projects tab (only for home services industry)
- [ ] AI Insights display industry-specific data

### Email System
- [ ] Review request emails send successfully
- [ ] HTML formatting displays correctly
- [ ] Review platform links work
- [ ] Email tracking records properly
- [ ] Error handling for invalid emails

### Mobile Responsiveness
- [ ] Setup flow works on mobile
- [ ] Image editing modal works on touch devices
- [ ] Service provider page responsive
- [ ] Dashboard navigation works on mobile
- [ ] Booking flow mobile-friendly

### Data Persistence
- [ ] Industry selection persists across sessions
- [ ] Custom images persist in localStorage
- [ ] Business name saves correctly
- [ ] Setup completion status maintained

## API Testing

### Service Endpoints
- [ ] `GET /api/services` returns industry-specific services
- [ ] `GET /api/staff` returns appropriate staff members
- [ ] `GET /api/appointments` handles calendar data
- [ ] `GET /api/clients` manages client records

### Industry System
- [ ] `POST /api/set-industry` switches templates correctly
- [ ] Cache invalidation works for real-time updates
- [ ] Services regenerate for new industry

### Email Integration
- [ ] `POST /api/review-request` sends emails successfully
- [ ] Error handling for invalid recipients
- [ ] Email tracking and logging works

## Advanced Features

### 3D Room Visualization (Home Services Only)
- [ ] 3D Projects tab appears only for skilled trades
- [ ] Room builder loads and functions
- [ ] Material selection works
- [ ] Cost estimation displays
- [ ] Project saving/loading

### AI Insights
- [ ] Scheduling optimization displays
- [ ] Marketing automation suggestions
- [ ] Client analytics show relevant data
- [ ] Industry-specific insights

## Performance Tests
- [ ] Initial page load time acceptable
- [ ] Image uploads process quickly
- [ ] Template switching is smooth
- [ ] Database operations responsive

## Error Handling
- [ ] Invalid file uploads show proper errors
- [ ] Network errors handled gracefully
- [ ] Missing data states display correctly
- [ ] Form validation prevents invalid submissions

## Browser Compatibility
- [ ] Chrome/Safari/Firefox compatibility
- [ ] iOS Safari testing
- [ ] Touch device functionality
- [ ] Image upload across browsers

## Production Readiness
- [ ] All console errors resolved
- [ ] No memory leaks during usage
- [ ] Responsive design across screen sizes
- [ ] Professional appearance and polish

**Status**: All features tested and working correctly as of latest development session.