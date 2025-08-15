# 🎵 studi-fi

A beautiful lo-fi music player with focus timer for deep work sessions. Perfect for remote workers, students, and creators who want to boost their productivity with ambient music and structured focus sessions.

## ✨ Features

### 🎯 Focus Timer
- **Preset Timers**: 60, 40, 25, and 20-minute focus sessions
- **Custom Timer**: Set your own focus duration
- **Pomodoro Support**: Built-in 25-minute Pomodoro timer
- **Session Tracking**: Count completed focus sessions
- **Browser Notifications**: Get notified when sessions complete
- **States**: Idle → Running → Paused → Completed flow

### 🎶 Music Player
- **Lo-fi Playlist**: Curated ambient tracks for deep work
- **Auto-play**: Music starts automatically on page load
- **Full Controls**: Play, pause, previous, next, volume control
- **Progress Tracking**: Real-time track progress with seek functionality
- **Album Art**: Visual album covers for each track

### 🔐 Authentication
- **Session-based**: Login state persists in session storage
- **User Profile**: Display user initials in elegant profile circle
- **Quick Login**: Demo login functionality for testing

### 🎨 Design System
- **Glassmorphism**: Beautiful translucent cards with backdrop blur
- **Lo-fi Aesthetic**: Warm color palette inspired by lo-fi culture
- **Responsive**: Mobile-first design that works on all devices
- **Typography**: Custom font pairing (Caveat + Inter)
- **Smooth Animations**: Micro-interactions and hover effects

## 🚀 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom CSS variables
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Audio**: Howler.js
- **Icons**: Lucide React
- **Fonts**: Google Fonts (Caveat + Inter)

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── globals.css        # Global styles & design system
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── Timer/             # Timer components
│   │   ├── TimerCard.tsx  # Main timer card
│   │   ├── TimerDisplay.tsx # Timer display (MM:SS)
│   │   └── TimerPresets.tsx # Preset time buttons
│   ├── Player/            # Music player components
│   │   ├── PlayerCard.tsx # Main player card
│   │   ├── PlayerControls.tsx # Play/pause/next controls
│   │   └── ProgressBar.tsx # Track progress bar
│   └── Layout/            # Layout components
│       ├── Header.tsx     # Top header with logo/auth
│       └── Background.tsx # Lo-fi background
├── hooks/
│   ├── useTimer.ts        # Timer logic & notifications
│   ├── useAudio.ts        # Audio player logic
│   └── useAuth.ts         # Authentication logic
├── stores/                # Zustand state stores
│   ├── timerStore.ts      # Timer state management
│   ├── playerStore.ts     # Music player state
│   └── authStore.ts       # Authentication state
├── lib/
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
--accent-purple: #8E44AD   /* Timer active */
```

### Typography
```css
/* Fonts */
--font-logo: 'Caveat', cursive    /* studi-fi logo */
--font-ui: 'Inter', sans-serif    /* UI elements */

/* Sizes */
--timer-display: 64px             /* Main timer */
--song-artist: 16px               /* Song/artist */
--time-display: 14px              /* Time displays */
```

### Components
```css
/* Card Dimensions */
--timer-card: 672px × 240px       /* Main timer card */
--player-card: 465px × 160px      /* Music player card */

/* Border Radius */
--radius-large: 50px              /* Main cards */
--radius-medium: 25px             /* Album art */
--radius-small: 12px              /* Buttons */
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

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

3. **Start development server**
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:3000
```

### Building for Production

```bash
npm run build
npm start
```

## 🎵 Audio Implementation

The audio player uses Howler.js for cross-browser audio support with fallback to mock playback for demo purposes.

### Adding New Tracks

1. Add audio files to `public/audio/`
2. Add cover images to `public/images/covers/`
3. Update the playlist in `src/lib/constants.ts`:

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

## 📱 Responsive Design

The app is built mobile-first with breakpoints:

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: 1024px+

Key responsive features:
- Timer cards scale down on mobile
- Button sizes adjust for touch
- Typography scales appropriately
- Layout stacks vertically on small screens

## 🔧 Customization

### Changing Colors
Update CSS variables in `src/app/globals.css`:

```css
:root {
  --accent-blue: #your-color;
  --accent-green: #your-color;
  /* ... */
}
```

### Adding Timer Presets
Update `TIMER_PRESETS` in `src/lib/constants.ts`:

```typescript
export const TIMER_PRESETS = [
  { label: '45 min', value: 45 },
  { label: '30 min', value: 30 },
  // ... your presets
];
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Design Inspiration**: Lo-fi music culture and study aesthetic
- **UI Framework**: shadcn/ui for beautiful components
- **Icons**: Lucide React for consistent iconography
- **Audio**: Howler.js for robust audio playback

---

Built with ❤️ for deep work and productivity