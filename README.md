# LearnSmart

A next-generation AI-powered educational app built with Expo and TypeScript.

## 🎨 Design Philosophy

LearnSmart features a modern, minimalist aesthetic with:
- **Sage Green** (#9CAF88) for focus and action
- **Warm Sand/Beige** (#F5F1E8) for comfortable backgrounds
- **Charcoal Grey** (#2C2C2C) for text and contrast
- Clean lines, generous white space, and 16px rounded corners throughout

## 🚀 Tech Stack

- **Expo** (~52.0.17) - Universal React Native platform
- **React Native** (0.76.5) - Mobile and web development
- **TypeScript** - Type-safe code
- **expo-router** - File-based routing
- **lottie-react-native** - Smooth animations
- **react-native-reanimated** - Performant animations

## 📱 Platform Support

- iOS
- Android
- Web (desktop responsive)

## 🏗️ Project Structure

```
learnsmart/
├── app/                      # expo-router pages
│   ├── _layout.tsx          # Root layout
│   ├── index.tsx            # Welcome Slider (entry point)
│   ├── auth.tsx             # Authentication screen
│   └── home.tsx             # Home dashboard
├── components/               # Reusable components
│   └── WelcomeSlider.tsx    # Onboarding slider
├── constants/                # Theme and configuration
│   └── theme.ts             # Color palette and design tokens
├── assets/                   # Static assets
│   └── animations/          # Lottie animation files
└── app.json                 # Expo configuration
```

## 🎯 Phase 1 Features (Current)

✅ Welcome Slider with 3 onboarding screens
✅ Lottie animations (rocket, robot, trophy)
✅ Responsive design for all platforms
✅ Navigation structure with expo-router
✅ Theme system with consistent color palette
✅ TypeScript throughout
✅ Clean, modular architecture

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Or run on specific platforms
npm run ios       # iOS simulator
npm run android   # Android emulator
npm run web       # Web browser
```

### First Run

1. Install dependencies: `npm install`
2. Start Expo: `npm start`
3. Choose your platform:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web browser

## 📦 Key Dependencies

```json
{
  "expo": "~52.0.17",
  "expo-router": "~4.0.14",
  "react": "18.3.1",
  "react-native": "0.76.5",
  "lottie-react-native": "7.1.0",
  "typescript": "^5.3.3"
}
```

## 🎨 Theme Configuration

The theme is centralized in `constants/theme.ts`:

```typescript
Colors:
  - primary: '#9CAF88'      (Sage Green)
  - background: '#F5F1E8'   (Warm Sand)
  - text: '#2C2C2C'         (Charcoal Grey)

Border Radius:
  - lg: 16px (all cards and buttons)

Spacing:
  - Consistent spacing system (xs to xxl)
```

## 🔄 Navigation Flow

1. **Welcome Slider** (`/`) - 3 onboarding screens
2. **Auth Screen** (`/auth`) - Login/signup (placeholder)
3. **Home Screen** (`/home`) - Dashboard (placeholder)

## 🚧 Coming in Phase 2

- AI Study Buddy chat interface
- Curriculum and course management
- Interactive quizzes and flashcards
- Gamification and progress tracking
- User profiles and achievements

## 📝 Development Notes

### Code Style
- TypeScript strict mode enabled
- Functional components with hooks
- Consistent spacing and formatting
- No unnecessary comments

### Responsive Design
- Flexible layouts (no hardcoded breakpoints)
- Platform-specific adjustments using `Platform.select()`
- Works on mobile portrait/landscape and desktop

### Performance
- Lottie animations optimized for 60fps
- Efficient re-renders with proper React patterns
- Lazy loading ready for future phases

## 🤝 Contributing

This is Phase 1 of the LearnSmart project. The foundation is complete and ready for expansion.

## 📄 License

Private project - All rights reserved
