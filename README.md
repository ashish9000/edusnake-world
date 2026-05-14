# 🐍 EduSnake World

> **Educational Snake Game for Kids (Ages 3–10)**  
> Learn Alphabets • Hindi Swar • Hindi Vyanjan • Numbers • Words • Math

---

## 🎮 Game Modes

| Mode | What Kids Learn |
|------|-----------------|
| 🔤 **A-B-C Hunt** | English alphabets A–Z |
| 🕉️ **Hindi Swar** | Hindi vowels अ आ इ ई उ ऊ... |
| ✍️ **Hindi Vyanjan** | Hindi consonants क ख ग घ... |
| 🔢 **Numbers** | Count 1→100 in sequence |
| 🌟 **Word Builder** | Spell words letter by letter |
| ➕ **Math Snake** | Solve addition, subtraction, multiplication |
| 🔷 **Shape Hunt** | Identify geometric shapes |
| 🌈 **Color World** | Recognise colors |

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+ ([download](https://nodejs.org))
- npm 9+ (comes with Node)

### Steps
```bash
# 1. Clone / download this project
git clone https://github.com/YOUR_USERNAME/edusnake-world.git
cd edusnake-world

# 2. Install dependencies
npm install

# 3. Run in browser
npm start
# Opens http://localhost:3000
```

---

## 📦 Build for Production (Web)

```bash
npm run build
```
Output goes to `/build` folder. Deploy to:
- **Vercel**: `vercel --prod`
- **Netlify**: Drag `/build` folder to netlify.com
- **Firebase**: `firebase deploy`
- **GitHub Pages**: use `gh-pages` package

---

## 📱 Publish to App Store (iOS & Android)

### Method 1: Capacitor (Recommended — Free)

```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli
npm install @capacitor/ios @capacitor/android

# Initialize Capacitor
npx cap init "EduSnake World" "com.yourname.edusnake" --web-dir=build

# Build web app first
npm run build

# Add platforms
npx cap add ios
npx cap add android

# Sync
npx cap sync

# Open in Xcode (for iOS)
npx cap open ios

# Open in Android Studio (for Android)
npx cap open android
```

#### iOS (App Store)
1. Open Xcode → select your device/simulator
2. Set Bundle ID: `com.yourname.edusnake`
3. Add your Apple Developer Account in Xcode → Signing & Capabilities
4. Product → Archive → Distribute to App Store Connect
5. Fill metadata on [appstoreconnect.apple.com](https://appstoreconnect.apple.com)

#### Android (Play Store)
1. Open Android Studio
2. Build → Generate Signed Bundle/APK
3. Upload `.aab` to [play.google.com/console](https://play.google.com/console)

### Method 2: React Native Web + Expo (Alternative)
```bash
npm install expo
npx expo start
```

### Method 3: PWA (Instant — no store needed)
The app is already PWA-ready! Deploy to any HTTPS host.  
Users can "Add to Home Screen" on both iOS and Android.

---

## 🗂️ Project Structure

```
edusnake-world/
├── public/
│   ├── index.html          # HTML shell (PWA meta tags)
│   └── manifest.json       # PWA manifest
├── src/
│   ├── App.jsx             # Main router (screen manager)
│   ├── index.js            # React entry point
│   ├── data/
│   │   └── gameData.js     # All alphabets, words, Hindi letters, game modes
│   ├── hooks/
│   │   └── useGameEngine.js # Core snake game engine (Canvas + logic)
│   ├── utils/
│   │   ├── audio.js        # Web Audio API sound effects + TTS
│   │   └── storage.js      # LocalStorage persistence (scores, coins, unlocks)
│   └── components/
│       ├── HomeScreen.jsx  # Main menu with mode cards
│       ├── GameScreen.jsx  # Gameplay UI (canvas + D-pad + HUD)
│       ├── GameOverScreen.jsx  # Results + rewards
│       ├── ShopScreen.jsx  # Snake skin shop
│       └── ProgressScreen.jsx  # Learning dashboard
└── package.json
```

---

## ✨ Features

### Gameplay
- ✅ 8 educational game modes
- ✅ Adaptive difficulty (speeds up on success, slows on failure)
- ✅ Lives system (3 lives per game)
- ✅ Combo multiplier (eat correct items in a row)
- ✅ XP progress bar
- ✅ Wall-wrap (snake goes through walls)

### Learning
- ✅ English A–Z alphabets
- ✅ Hindi Swar (12 vowels)
- ✅ Hindi Vyanjan (34 consonants)  
- ✅ Numbers 1–20 (sequential mode)
- ✅ Word spelling (25 common words with emojis)
- ✅ Math: addition, subtraction, multiplication
- ✅ Text-to-Speech pronunciation (English + Hindi)

### Progression
- ✅ High score tracking (LocalStorage)
- ✅ Coin system (10 pts = 1 coin)
- ✅ 6 unlockable snake skins (Dragon, Rainbow, Robot, Dino, Space)
- ✅ Daily streak tracking
- ✅ Learning progress dashboard
- ✅ Parent-friendly stats

### UX / Mobile
- ✅ Touch D-pad controls
- ✅ Swipe controls on canvas
- ✅ Keyboard controls (arrow keys, WASD)
- ✅ Mobile-first responsive design
- ✅ PWA ready (offline capable)
- ✅ Portrait-optimised layout
- ✅ Confetti + floating messages
- ✅ Canvas shake on wrong answer
- ✅ Sound effects (Web Audio API)

---

## 🎨 Customization

### Add Custom Words
Edit `src/data/gameData.js`:
```js
export const WORDS = [
  { word: 'APPLE', emoji: '🍎', meaning: 'A red fruit' },
  { word: 'YOUR_WORD', emoji: '😊', meaning: 'Your description' },
  // ...
];
```

### Add Custom Snake Skin
```js
export const SNAKE_SKINS = [
  // ...existing skins...
  {
    id: 'myskin', name: 'My Skin', emoji: '🦊',
    headColor: '#ff8800', bodyColor: '#ffaa00',
    locked: true, cost: 100
  },
];
```

### Change Game Speed
In `src/hooks/useGameEngine.js`:
```js
const INITIAL_SPEED = 180; // ms per tick (lower = faster)
const MIN_SPEED     = 75;  // fastest it can get
const SPEED_INCREASE = 8;  // how much it speeds up per 50 pts
```

---

## 📊 Monetization (Future)

| Feature | Status |
|---------|--------|
| Rewarded ads for coins | Add AdMob via Capacitor |
| Premium subscription | Add via RevenueCat |
| Remove ads IAP | Add via Capacitor Purchases |
| Offline mode premium | Already works offline! |
| Parent dashboard premium | Extend ProgressScreen |

### Adding AdMob (Capacitor)
```bash
npm install @capacitor-community/admob
npx cap sync
```

### Adding RevenueCat (subscriptions)
```bash
npm install @revenuecat/purchases-capacitor
```

---

## 🔧 Environment & Requirements

| Requirement | Version |
|-------------|---------|
| Node.js     | 18+     |
| npm         | 9+      |
| React       | 18.2    |
| Xcode (iOS) | 14+     |
| Android Studio | Flamingo+ |
| iOS target  | 14.0+   |
| Android target | API 24+ |

---

## 📝 License

MIT — free to use, modify, and publish.

---

## 🤝 Contributing

PRs welcome! Areas to improve:
- More Hindi content (Matras, compound letters)
- More word lists (animals, vegetables, body parts)
- Phonics mode (hear sound → find letter)
- Multiplayer via WebSocket
- Teacher custom word lists
- Avatar creator
- Story adventure worlds

---

**Made with ❤️ for kids everywhere. Happy learning! 🌟**
