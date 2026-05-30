# PhotoShare - Photo Sharing & Calendar App

A modern web application for sharing photos with an approval workflow, beautiful calendar view, and community engagement features.

## Features

### 📸 Photo Management
- **Upload Photos**: Users can upload photos with title and description
- **Owner Approval**: Photos require owner approval before appearing in the gallery
- **Photo Details**: View photos with metadata (upload date, approval date)
- **Responsive Gallery**: Beautiful grid layout that works on all devices

### 📅 Calendar View
- **TB Way Style Calendar**: Browse photos by date in an interactive calendar
- **Photo Thumbnails**: See photo previews directly in calendar cells
- **Month Navigation**: Easy navigation between months
- **Click to View**: Click any date to view photos from that day

### 💬 Community Features
- **Comments**: Authenticated users can comment on photos
- **Likes**: Users can like photos (like counts hidden from regular users)
- **Real-time Updates**: Comments and likes update immediately after action
- **User Engagement**: See community reactions to photos

### 👤 User Management
- **Manus OAuth**: Secure authentication via Manus platform
- **User Profiles**: Track user information and activity
- **Admin Dashboard**: Owner can approve/reject pending photos
- **Role-based Access**: Different permissions for regular users and admin

### 📱 Mobile & PWA
- **Progressive Web App**: Install as a native app on mobile devices
- **Offline Support**: Service worker caches essential data
- **Responsive Design**: Optimized for all screen sizes
- **Camera Integration**: Upload photos directly from device camera

## Tech Stack

### Frontend
- **React 19**: Modern UI framework
- **TypeScript**: Type-safe development
- **Tailwind CSS 4**: Utility-first styling
- **tRPC**: End-to-end type-safe APIs
- **Wouter**: Lightweight routing
- **Lucide React**: Beautiful icons

### Backend
- **Express.js**: Web server framework
- **tRPC**: Type-safe RPC framework
- **Drizzle ORM**: Type-safe database ORM
- **MySQL/TiDB**: Database
- **Multer**: File upload handling

### Infrastructure
- **Manus Platform**: Hosting and deployment
- **S3 Storage**: File storage for photos
- **OAuth 2.0**: Secure authentication

## Project Structure

```
photo-sharing-app/
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── lib/           # Utilities and helpers
│   │   └── App.tsx        # Main app component
│   ├── public/            # Static assets
│   └── index.html         # HTML entry point
├── server/                # Backend server
│   ├── routers.ts         # tRPC procedure definitions
│   ├── db.ts              # Database queries
│   ├── uploadHandler.ts   # File upload handler
│   └── _core/             # Core server utilities
├── drizzle/               # Database schema and migrations
├── shared/                # Shared types and constants
└── package.json           # Project dependencies
```

## Database Schema

### Users Table
- `id`: Unique identifier
- `openId`: OAuth identifier
- `name`: User name
- `email`: User email
- `loginMethod`: Login provider (manus, google, telegram)
- `role`: User role (user, admin)
- `createdAt`: Account creation date
- `updatedAt`: Last update date
- `lastSignedIn`: Last login date

### Photos Table
- `id`: Unique identifier
- `uploaderId`: User who uploaded
- `photoUrl`: S3 storage URL
- `title`: Photo title
- `description`: Photo description
- `uploadedAt`: Upload timestamp
- `approvedAt`: Approval timestamp (null if pending)
- `approvedBy`: Admin who approved
- `status`: Photo status (pending, approved, rejected)

### Comments Table
- `id`: Unique identifier
- `photoId`: Associated photo
- `userId`: Comment author
- `content`: Comment text
- `createdAt`: Comment date

### Likes Table
- `id`: Unique identifier
- `photoId`: Associated photo
- `userId`: User who liked
- `createdAt`: Like date

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm package manager
- MySQL/TiDB database

### Installation

```bash
# Clone the repository
git clone https://github.com/wyan89432/photo-sharing-app.git
cd photo-sharing-app

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Run database migrations
pnpm db:push

# Start development server
pnpm dev
```

### Environment Variables

```env
# Database
DATABASE_URL=mysql://user:password@host/database

# OAuth
VITE_APP_ID=your_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im

# Storage
BUILT_IN_FORGE_API_URL=https://forge.manus.im
BUILT_IN_FORGE_API_KEY=your_api_key

# Owner
OWNER_OPEN_ID=your_owner_id
OWNER_NAME=Your Name
```

## API Documentation

### Photo Procedures

#### `photos.listApproved`
Get all approved photos
```typescript
trpc.photos.listApproved.useQuery()
```

#### `photos.listPending`
Get pending photos (admin only)
```typescript
trpc.photos.listPending.useQuery()
```

#### `photos.getById`
Get photo details
```typescript
trpc.photos.getById.useQuery(photoId)
```

#### `photos.upload`
Upload a new photo
```typescript
trpc.photos.upload.useMutation({
  photoUrl: string,
  title?: string,
  description?: string
})
```

#### `photos.approve`
Approve a photo (admin only)
```typescript
trpc.photos.approve.useMutation(photoId)
```

#### `photos.reject`
Reject a photo (admin only)
```typescript
trpc.photos.reject.useMutation(photoId)
```

### Comments Procedures

#### `comments.list`
Get comments for a photo
```typescript
trpc.comments.list.useQuery(photoId)
```

#### `comments.add`
Add a comment
```typescript
trpc.comments.add.useMutation({
  photoId: number,
  content: string
})
```

### Likes Procedures

#### `likes.toggle`
Like/unlike a photo
```typescript
trpc.likes.toggle.useMutation(photoId)
```

#### `likes.getUserStatus`
Check if user liked a photo
```typescript
trpc.likes.getUserStatus.useQuery(photoId)
```

#### `likes.getCount`
Get like count (admin only)
```typescript
trpc.likes.getCount.useQuery(photoId)
```

## File Upload

Photos are uploaded to S3 storage via the `/api/storage/upload` endpoint.

### Upload Endpoint
```
POST /api/storage/upload
Content-Type: multipart/form-data

Parameters:
- file: Image file (max 5MB)

Response:
{
  "key": "photos/1234567890_photo.jpg",
  "url": "/manus-storage/photos/1234567890_photo.jpg"
}
```

## Pages

### Home (`/`)
Landing page with feature overview and "How It Works" section

### Gallery (`/gallery`)
Display all approved photos in a responsive grid

### Upload (`/upload`)
Form for users to upload photos with metadata

### Calendar (`/calendar`)
TB Way style calendar view with photo thumbnails by date

### Admin Dashboard (`/admin`)
Owner dashboard to review and approve/reject pending photos

## Styling

The app uses Tailwind CSS 4 with custom design tokens:

- **Color Scheme**: Blue primary (#2563eb), light background
- **Typography**: Inter font family
- **Spacing**: Consistent 4px base unit
- **Responsive**: Mobile-first design approach

## Performance

- **Code Splitting**: Lazy-loaded page components
- **Image Optimization**: Responsive image handling
- **Caching**: Service worker caches static assets
- **API Optimization**: Efficient query patterns with tRPC

## Security

- **Authentication**: Secure OAuth via Manus
- **Authorization**: Role-based access control
- **File Validation**: Image file type and size validation
- **Input Sanitization**: XSS protection via React
- **HTTPS Only**: Encrypted data transmission

## Testing

Run tests with:
```bash
pnpm test
```

## Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

### Quick Deploy
```bash
# Build for production
pnpm build

# Deploy to Manus (via UI)
# Click "Publish" in Management UI
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

MIT License - See LICENSE file for details

## Support

For issues and questions:
- GitHub Issues: https://github.com/wyan89432/photo-sharing-app/issues
- Manus Support: https://help.manus.im

## Roadmap

- [ ] Google & Telegram login integration
- [ ] Photo editing features
- [ ] Advanced filtering and search
- [ ] User profiles and follow system
- [ ] Photo collections/albums
- [ ] Real-time notifications
- [ ] Dark mode theme
- [ ] Multi-language support

---

**Version**: 1.0.0  
**Last Updated**: May 30, 2026  
**Maintainer**: wyan89432
