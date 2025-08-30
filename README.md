# 🎵 studi-fi

A beautiful lo-fi music player with focus timer for deep work sessions. Perfect for remote workers, students, and creators who want to boost their productivity with ambient music and structured focus sessions.

![studi-fi Application Screenshot](https://i.imgur.com/example.png)

*Screenshot showing the studi-fi application with its glassmorphism music player and focus timer, set against a cozy lo-fi anime study environment.*

## ✨ Features

### 🎯 Focus Timer
- **Preset Timers**: 25, 50, 90-minute focus sessions + Infinity mode
- **Custom Timer**: Set your own focus duration with hours, minutes, seconds
- **Pomodoro Support**: Built-in 25-minute Pomodoro timer
- **Session Tracking**: Count completed focus sessions and daily study time
- **Browser Notifications**: Get notified when sessions complete
- **States**: Idle → Running → Paused → Completed flow
- **Infinity Mode**: Count up timer for unlimited focus sessions

### 🎶 Music Player
- **Dynamic Playlist**: Auto-loads from Supabase or uses default lo-fi tracks
- **Auto-play**: Music starts automatically on page load
- **Full Controls**: Play, pause, previous, next, volume control with hover slider
- **Progress Tracking**: Real-time track progress with time display
- **Album Art**: Visual album covers with fallback to default cover
- **Supabase Integration**: Upload and manage your own music library

### 🔐 Authentication & Admin
- **Session-based**: Login state persists in session storage
- **User Profile**: Display user initials in elegant profile circle
- **Admin Panel**: Upload and manage music library (`/admin`)
- **Music Upload**: Support for MP3, WAV, OGG files with cover images
- **Database Integration**: Supabase backend for music storage

### 📊 Statistics & Analytics
- **Study Sessions**: Track completed focus sessions
- **Daily Progress**: Monitor total study time per day
- **Session History**: View your productivity patterns
- **Data Persistence**: All data stored in Supabase

### 🎨 Design System
- **Glassmorphism**: Beautiful translucent cards with backdrop blur
- **Lo-fi Aesthetic**: Warm color palette inspired by lo-fi culture
- **Responsive**: Mobile-first design that works on all devices
- **Typography**: Custom font pairing (Comfortaa + Inter)
- **Smooth Animations**: Micro-interactions and hover effects
- **Fixed Layout**: Timer and player cards positioned at bottom for optimal UX

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 with custom CSS variables
- **UI Components**: shadcn/ui with Radix UI primitives
- **State Management**: Zustand
- **Audio**: Howler.js
- **Icons**: Lucide React
- **Fonts**: Google Fonts (Comfortaa + Inter)
- **Backend**: Supabase (PostgreSQL + Storage)
- **Authentication**: Supabase Auth
- **Charts**: Recharts for statistics visualization

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── admin/             # Admin panel for music management
│   │   └── page.tsx       # Music upload interface
│   ├── auth/              # Authentication routes
│   │   └── callback/      # Auth callback handling
│   ├── globals.css        # Global styles & design system
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page with timer & player
├── components/
│   ├── ui/                # shadcn/ui components
│   │   ├── button.tsx     # Custom button variants
│   │   ├── card.tsx       # Glassmorphism cards
│   │   ├── dialog.tsx     # Modal dialogs
│   │   ├── input.tsx      # Form inputs
│   │   ├── slider.tsx     # Volume & progress sliders
│   │   └── chart.tsx      # Statistics charts
│   ├── Admin/             # Admin components
│   │   └── MusicUpload.tsx # Music upload form
│   ├── Timer/             # Timer components
│   │   ├── TimerCard.tsx  # Main timer card (672×240px)
│   │   ├── TimerDisplay.tsx # Timer display (MM:SS)
│   │   └── TimerPresets.tsx # Preset time buttons
│   ├── Player/            # Music player components
│   │   ├── PlayerCard.tsx # Main player card (465×160px)
│   │   ├── PlayerControls.tsx # Play/pause/next controls
│   │   └── ProgressBar.tsx # Track progress bar
│   └── Layout/            # Layout components
│       ├── Header.tsx     # Top header with logo/auth
│       └── Background.tsx # Lo-fi background image
├── hooks/
│   ├── useTimer.ts        # Timer logic & session tracking
│   ├── useAudio.ts        # Audio player logic
│   └── useAuth.ts         # Authentication logic
├── stores/                # Zustand state stores
│   ├── timerStore.ts      # Timer state & session management
│   ├── playerStore.ts     # Music player state
│   ├── musicStore.ts      # Music library management
│   ├── authStore.ts       # Authentication state
│   └── statsStore.ts      # Statistics & analytics
├── lib/
│   ├── supabase.ts        # Supabase client configuration
│   ├── auth.ts            # Authentication utilities
│   ├── admin.ts           # Admin helper functions
│   ├── utils.ts           # Utility functions
│   └── constants.ts       # App constants & types
└── assets/
    ├── audio/             # Lo-fi track files
    └── images/            # Album covers & assets
```

## 🎨 Design System

### Color Palette
```css
/* Primary Colors */
--text-primary: #15142F     /* Main text color */
--glass-bg: #EAEAF2        /* Glass card background */
--glass-opacity: 0.3       /* 30% opacity */

/* Accent Colors */
--accent-blue: #4A90E2     /* Player controls */
--accent-green: #27AE60    /* Play button */
--accent-red: #E74C3C      /* Stop/Reset */
--accent-purple: #8A4FFF   /* Timer active & volume */
```

### Typography
```css
/* Fonts */
--font-logo: 'Caveat', cursive    /* studi-fi logo */
--font-ui: 'Inter', sans-serif    /* UI elements */
--font-comfortaa: 'Comfortaa'     /* Primary text */

/* Sizes */
--timer-display: 64px             /* Main timer */
--song-artist: 16px               /* Song/artist */
--time-display: 14px              /* Time displays */
```

### Component Dimensions
```css
/* Card Dimensions */
--timer-card: 672px × 240px       /* Main timer card */
--player-card: 465px × 160px      /* Music player card */

/* Border Radius */
--radius-large: 50px              /* Main cards */
--radius-medium: 25px             /* Album art */
--radius-small: 12px              /* Buttons */

/* Button Sizes */
--btn-primary: 42×42px            /* Main play/pause */
--btn-secondary: 48×48px          /* Timer controls */
--btn-small: 30×30px              /* Navigation */
--btn-icon: 32×32px               /* Volume, settings */
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (for full functionality)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd studi-fi
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

4. **Start development server**
```bash
npm run dev
```

5. **Open in browser**
```
http://localhost:3000
```

### Building for Production

```bash
npm run build
npm start
```

## 🎵 Audio Implementation

The audio player uses Howler.js for cross-browser audio support with Supabase integration for music management.

### Default Playlist
Built-in lo-fi tracks for immediate use:
- `lofi1.mp3` - Lofi Study Session by Chill Collective
- `lofi2.mp3` - Focus Beats by Lo-fi Dreams

### Adding New Tracks via Admin Panel

1. Navigate to `/admin` (admin access required)
2. Fill in song details (name, artist, audio file, cover image)
3. Upload files (MP3, WAV, OGG supported)
4. Tracks automatically appear in the player

### Manual Track Addition
Update the playlist in `src/lib/constants.ts`:

```typescript
export const PLAYLIST = [
  {
    id: 'track1',
    title: 'Your Track Name',
    artist: 'Artist Name',
    duration: 180, // seconds
    src: '/audio/your-track.mp3',
    cover: '/images/covers/your-cover.jpg'
  },
  // ... more tracks
];
```

## 🔐 Authentication & Admin

### User Roles
- **Regular Users**: Access to timer and music player
- **Admin Users**: Additional access to music upload and management

### Admin Access
To grant admin access, add the user's email to the admin list in `src/lib/admin.ts`:

```typescript
const ADMIN_EMAILS = [
  'your-email@example.com',
  // ... more admin emails
];
```

### Music Upload Features
- **File Validation**: Automatic audio and image format checking
- **Progress Tracking**: Real-time upload progress
- **Error Handling**: Comprehensive error messages
- **Success Feedback**: Confirmation of successful uploads

## 📊 Statistics & Analytics

### Session Tracking
- **Automatic Recording**: Sessions are recorded when timer completes or pauses
- **Daily Totals**: Track total study time per day
- **Session Count**: Count of completed focus sessions
- **Data Persistence**: All data stored securely in Supabase

### Analytics Dashboard
- **Study Patterns**: Visual representation of productivity
- **Time Distribution**: Breakdown of focus session durations
- **Progress Tracking**: Monitor improvement over time

## 📱 Responsive Design

The app is built mobile-first with breakpoints:

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: 1024px+

### Key Responsive Features
- Timer cards scale down on mobile (672px → 90vw)
- Player cards adjust for small screens (465px → 90vw)
- Button sizes optimize for touch interaction
- Typography scales appropriately for readability
- Layout stacks vertically on small screens
- Fixed bottom positioning ensures optimal UX on all devices

## 🔧 Customization

### Changing Colors
Update CSS variables in `src/app/globals.css`:

```css
:root {
  --accent-blue: #your-color;
  --accent-green: #your-color;
  --accent-purple: #your-color;
  /* ... */
}
```

### Adding Timer Presets
Update `TIMER_PRESETS` in `src/lib/constants.ts`:

```typescript
export const TIMER_PRESETS = [
  { label: '45 min', value: 45 },
  { label: '30 min', value: 30 },
  { label: '∞', value: -1 }, // Infinity mode
  // ... your presets
];
```

### Custom Fonts
Add new fonts to `src/app/globals.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=YourFont:wght@400;600&display=swap');

:root {
  --font-custom: 'YourFont', sans-serif;
}
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Supports Next.js with build commands
- **Railway**: Full-stack deployment with database
- **Self-hosted**: Docker support available

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use conventional commit messages
- Maintain responsive design principles
- Test on multiple devices and browsers
- Update documentation for new features

## 🐛 Troubleshooting

### Common Issues

**Audio not playing:**
- Check browser autoplay policies
- Verify audio file formats (MP3, WAV, OGG)
- Check console for Howler.js errors

**Timer not working:**
- Ensure browser notifications are enabled
- Check for JavaScript errors in console
- Verify timer store initialization

**Admin access denied:**
- Check admin email list in `src/lib/admin.ts`
- Verify Supabase authentication
- Check browser console for errors

**Build errors:**
- Clear `node_modules` and reinstall
- Check Node.js version compatibility
- Verify environment variables

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Design Inspiration**: Lo-fi music culture and study aesthetic
- **UI Framework**: shadcn/ui for beautiful components
- **Icons**: Lucide React for consistent iconography
- **Audio**: Howler.js for robust audio playback
- **Backend**: Supabase for scalable infrastructure
- **Charts**: Recharts for data visualization

---

Built with ❤️ for deep work and productivity

*"Focus on what matters, one session at a time."*