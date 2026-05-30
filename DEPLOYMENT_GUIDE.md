# PhotoShare - Deployment Guide

## Overview

PhotoShare is a Progressive Web App (PWA) that can be deployed to the web and packaged for mobile app stores. This guide covers all deployment options.

## Prerequisites

- Node.js 18+
- pnpm package manager
- GitHub account (for repository)
- Google Play Developer account (for Play Store)
- Apple Developer account (for App Store)

## 1. Web Deployment (Manus Platform)

The app is already configured for deployment on Manus platform. Simply click the "Publish" button in the Management UI.

**Features:**
- Automatic HTTPS
- Custom domain support
- Built-in analytics
- Database hosting
- File storage (S3)

## 2. PWA Configuration

The app includes PWA support with:

- **Manifest**: `/client/public/manifest.json` - App metadata and icons
- **Service Worker**: `/client/public/sw.js` - Offline support and caching
- **Meta Tags**: PWA-specific meta tags in `index.html`

### Required Assets

Create the following icon files in `/client/public/`:

- `icon-192.png` - 192x192 PNG icon
- `icon-512.png` - 512x512 PNG icon
- `icon-192-maskable.png` - 192x192 PNG icon (maskable)
- `icon-512-maskable.png` - 512x512 PNG icon (maskable)
- `screenshot-1.png` - 540x720 PNG screenshot (narrow)
- `screenshot-2.png` - 1280x720 PNG screenshot (wide)

## 3. Google Play Store Deployment

### Step 1: Build the Web App

```bash
cd /home/ubuntu/photo-sharing-app
pnpm build
```

### Step 2: Package as APK/AAB

Use **Bubblewrap** to convert the PWA to an Android app:

```bash
npm install -g @bubblewrap/cli

# Initialize Bubblewrap project
bubblewrap init --manifest=/path/to/manifest.json

# Generate signed APK
bubblewrap build
```

### Step 3: Upload to Google Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Create a new app
3. Fill in app details:
   - **App name**: PhotoShare
   - **Category**: Photography
   - **Description**: Share your photos, get them approved, and discover amazing moments in a beautiful calendar view
4. Upload the signed APK/AAB
5. Set up pricing and distribution
6. Submit for review

### Step 4: Configure App Signing

- Use Google Play's app signing service
- Keep your keystore safe
- Upload the signed bundle

## 4. Apple App Store Deployment

### Step 1: Build for iOS

Use **PWABuilder** or **Xcode**:

```bash
# Using PWABuilder (recommended)
npm install -g @pwabuilder/cli
pwabuilder build --platform ios
```

### Step 2: Configure Xcode Project

1. Open the generated Xcode project
2. Set up signing certificates
3. Configure app capabilities (if needed)
4. Set deployment target to iOS 14+

### Step 3: Submit to App Store

1. Create an app in [App Store Connect](https://appstoreconnect.apple.com)
2. Configure app information
3. Upload build via Xcode or Transporter
4. Submit for review

## 5. GitHub Repository

Export your code to GitHub:

```bash
# In Manus Management UI:
# Settings → GitHub → Connect and export
```

**Repository**: https://github.com/wyan89432/photo-sharing-app

## 6. Environment Variables

Required environment variables:

```env
# Database
DATABASE_URL=mysql://user:password@host/database

# OAuth
VITE_APP_ID=your_manus_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im

# Storage
BUILT_IN_FORGE_API_URL=https://forge.manus.im
BUILT_IN_FORGE_API_KEY=your_forge_api_key

# Owner
OWNER_OPEN_ID=your_owner_id
OWNER_NAME=Your Name
```

## 7. Features for Mobile

The app is optimized for mobile with:

- **Responsive Design**: Works on all screen sizes
- **Touch-Friendly**: Large buttons and easy navigation
- **Offline Support**: Service worker caches essential data
- **Camera Integration**: Direct file upload from device camera
- **Calendar View**: TB Way style date-based browsing

## 8. Testing Checklist

Before deployment:

- [ ] Test on iOS devices (iPhone, iPad)
- [ ] Test on Android devices (phones, tablets)
- [ ] Test offline functionality
- [ ] Test photo upload with camera
- [ ] Test calendar navigation
- [ ] Test comments and likes
- [ ] Test admin approval workflow
- [ ] Test on slow network (throttle to 3G)
- [ ] Test with various photo sizes
- [ ] Test on different browsers

## 9. Monitoring & Analytics

The app includes built-in analytics:

- View in Manus Dashboard
- Track user engagement
- Monitor performance
- View error logs

## 10. Troubleshooting

### PWA Not Installing

- Ensure manifest.json is valid
- Check service worker registration
- Verify HTTPS is enabled
- Clear browser cache

### Photos Not Uploading

- Check storage configuration
- Verify file size limits (5MB max)
- Check network connectivity
- Review server logs

### Calendar Not Loading

- Verify database connection
- Check API responses
- Review browser console
- Test with sample data

## 11. Support & Resources

- **Manus Docs**: https://docs.manus.im
- **PWA Documentation**: https://web.dev/progressive-web-apps/
- **Google Play Console**: https://play.google.com/console
- **App Store Connect**: https://appstoreconnect.apple.com
- **Bubblewrap**: https://github.com/GoogleChromeLabs/bubblewrap

## 12. Performance Optimization

### For Play Store

- Minimize bundle size
- Optimize images
- Enable compression
- Use code splitting
- Lazy load components

### For App Store

- Optimize for different screen sizes
- Test on various iOS versions
- Minimize app size
- Use native features where possible

## 13. Security Considerations

- [ ] Enable HTTPS only
- [ ] Validate all user inputs
- [ ] Use secure authentication
- [ ] Protect sensitive data
- [ ] Regular security updates
- [ ] Monitor for vulnerabilities

## 14. Maintenance

- Regular dependency updates
- Monitor error logs
- User feedback collection
- Performance monitoring
- Security patches

---

**Last Updated**: May 30, 2026
**Version**: 1.0.0
