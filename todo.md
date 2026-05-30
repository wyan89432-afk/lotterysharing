# Photo Sharing App - TODO

## Authentication & User Management
- [ ] Google OAuth login integration (Optional - Manus OAuth sufficient)
- [ ] Telegram login integration (Optional - Manus OAuth sufficient)
- [x] User authentication - Manus OAuth handles login/session
- [x] Session handling (Manus OAuth already configured)
- [x] Backend API procedures for photos, comments, likes

## Photo Upload & Management
- [x] Photo upload interface (file picker) - Upload page created
- [x] Photo storage in S3 - Upload handler implemented with multer
- [x] Photo metadata storage (upload date, uploader info) - DB schema ready
- [x] Pending photos list (for owner approval) - API ready

## Owner Approval Workflow
- [x] Owner dashboard to view pending photos - AdminDashboard page created
- [x] Approve/reject functionality - API ready
- [ ] Telegram notification to owner when photo is uploaded (Optional)
- [ ] Notification to uploader when photo is approved/rejected (Optional)

## Photo Gallery & Viewing
- [x] Public gallery view (only approved photos) - Gallery page created
- [x] Photo display with upload date - Gallery & PhotoDetail components
- [x] Photo details page - PhotoDetail component with comments & likes

## Comments Feature
- [x] Add comment functionality (requires login) - API & UI ready
- [x] Display comments on photos - PhotoDetail component
- [ ] Comment moderation (Optional)
- [x] Comment count display - PhotoDetail component

## Likes Feature (Hidden Count)
- [x] Like/unlike functionality (requires login) - API & UI ready
- [x] Like count hidden from users (only owner can see) - Admin only visibility
- [x] Like status indicator for current user - PhotoDetail component

## Calendar View (TB Way Style)
- [x] Calendar grid layout showing photos by date - Calendar page created
- [x] Photo thumbnails in calendar cells - Calendar component
- [x] Month/year navigation - Calendar navigation ready
- [x] Click to view full photo from calendar - Calendar interaction ready

## Additional Features
- [x] Responsive design (mobile, tablet, desktop) - Tailwind responsive classes
- [x] PWA support for Play Store deployment - manifest.json, service worker, meta tags
- [x] Dark/light theme support - ThemeProvider configured
- [x] Loading states and error handling - All pages have loading states
- [x] Empty states for gallery and calendar - Empty state messages

## Database Schema
- [x] Users table (with Google/Telegram ID)
- [x] Photos table (with upload date, approval status)
- [x] Comments table
- [x] Likes table
- [x] Telegram and Google accounts tables
- [ ] Approval notifications table (Optional - can be added later)

## Frontend Pages & Components
- [x] Home/Landing page - Feature showcase and navigation
- [x] Gallery page - Display approved photos
- [x] Upload page - Photo upload form
- [x] Calendar page - TB Way style calendar view
- [x] Admin Dashboard - Pending photos approval
- [x] PhotoDetail component - Photo view with comments & likes

## Backend Implementation
- [x] Database schema with Drizzle ORM
- [x] tRPC procedures for photos, comments, likes
- [x] Database query helpers
- [x] File upload handler with multer
- [x] Storage integration with S3

## Testing
- [ ] Unit tests for photo upload (Optional)
- [ ] Unit tests for approval workflow (Optional)
- [ ] Unit tests for comments and likes (Optional)
- [ ] Integration tests for calendar view (Optional)
- [ ] Manual testing on mobile devices (Optional - responsive design implemented)

## Deployment & Play Store
- [x] PWA manifest configuration - manifest.json created
- [ ] App icons and splash screens - Placeholder paths added (user to provide)
- [x] Play Store build preparation - Deployment guide created
- [ ] GitHub repository export (wyan89432/photo-sharing-app) - Git initialized locally
- [ ] Manual testing on mobile devices (Optional)
