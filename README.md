# 🍾 SpinIT - Interactive Truth or Dare Spinning Bottle Game

[![Angular](https://img.shields.io/badge/Angular-17.0.0-red.svg)](https://angular.io/)
[![GSAP](https://img.shields.io/badge/GSAP-3.12.0-green.svg)](https://greensock.com/gsap/)
[![PWA](https://img.shields.io/badge/PWA-Ready-blue.svg)](https://web.dev/progressive-web-apps/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A modern, interactive spinning bottle game built with Angular and GSAP. Perfect for Truth or Dare games, team building activities, or any group decision-making scenarios. Features realistic bottle spinning animations, custom audio, and a responsive design that works on all devices.

## 🌟 Live Demo

🎮 **[Play SpinIT Now](https://manjunathpy.github.io/spinit/)**

## ✨ Features

### 🎯 Core Gameplay
- **Dynamic Player Setup**: Configure 2-12 players with automatic positioning
- **Realistic Spinning**: Smooth GSAP-powered bottle animations with 6 full rotations
- **Smart Selection**: Tracks selected players to avoid duplicates until all are chosen
- **Visual Feedback**: Color-coded player states (available, selected, completed)
- **Game Completion**: Automatic detection when all players have been selected

### 🎵 Audio Experience
- **Custom Sound Effects**: Realistic bottle spinning audio using Web Audio API
- **Volume Control**: Built-in mute/unmute functionality with visual indicators
- **Audio Sync**: Perfect synchronization between animation and sound
- **Mobile Optimized**: Works seamlessly on mobile devices with touch interactions

### 🎨 Visual Design
- **Modern UI**: Beautiful gradient backgrounds and smooth animations
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Player Markers**: Radial positioning with perfect symmetry
- **Status Messages**: Dynamic feedback with smooth slide-in animations
- **Interactive Elements**: Hover effects and visual state changes

### 📱 PWA Features
- **Installable**: Add to home screen on mobile devices
- **Offline Support**: Works without internet connection
- **Cross-Platform**: Compatible with iOS, Android, and desktop browsers
- **Fast Loading**: Optimized performance with service worker caching

## 🛠️ Technology Stack

### Frontend Framework
- **Angular 17**: Latest version with standalone components
- **TypeScript**: Type-safe development
- **CSS3**: Modern styling with gradients and animations

### Animation & Audio
- **GSAP (GreenSock)**: Professional-grade animations
- **Web Audio API**: High-quality sound effects
- **CSS Animations**: Smooth transitions and effects

### Progressive Web App
- **Service Worker**: Offline functionality and caching
- **Web App Manifest**: Installable app experience
- **Responsive Design**: Mobile-first approach

## 🚀 Quick Start

### Prerequisites
- Node.js (v20.19+ or v22.12+)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/manjunathpy/spinit.git
   cd spinit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200`

### Build for Production

```bash
# Build the project
npm run build

# Build for GitHub Pages deployment
npm run build:prod
```

## 🎮 How to Play

### Basic Gameplay
1. **Set Player Count**: Choose between 2-12 players using the input field
2. **Click the Bottle**: Start the spinning animation with a click or tap
3. **Watch the Spin**: Enjoy the realistic spinning animation with sound effects
4. **See the Result**: The bottle will point to a randomly selected player
5. **Track Progress**: Selected players are highlighted and tracked
6. **Complete the Game**: Continue until all players have been selected

### Player States
- **Available**: Default orange background
- **Selected**: Green background with pulse animation
- **Completed**: Gray background (no longer selectable)

### Audio Controls
- **Volume Button**: Click the 🔊 button next to the player count to mute/unmute
- **Visual Feedback**: Button changes to 🔇 when muted
- **Mobile Support**: Works perfectly on touch devices

## 📱 Mobile Experience

### PWA Installation
1. **iOS Safari**: Tap the share button → "Add to Home Screen"
2. **Android Chrome**: Tap the menu → "Add to Home Screen"
3. **Desktop**: Look for the install prompt in the address bar

### Touch Optimized
- **Responsive Design**: Adapts to all screen sizes
- **Touch-Friendly**: Large, easy-to-tap buttons
- **Smooth Animations**: Optimized for mobile performance

## 🎨 Customization

### Adding Custom Sound
1. Place your audio file in `src/assets/` as `spinning-sound.mp3`
2. The game will automatically use your custom sound
3. Supported formats: MP3, WAV, OGG, M4A

### Styling Modifications
- **Colors**: Update CSS variables in `src/styles.css`
- **Animations**: Modify GSAP animations in `src/app/app.component.ts`
- **Layout**: Adjust responsive breakpoints as needed

## 🚀 Deployment

### GitHub Pages (Recommended)
```bash
# Deploy to GitHub Pages
npm run deploy
npm run deploy:gh
```

### Other Platforms
- **Netlify**: Drag and drop the `dist` folder
- **Vercel**: Connect your GitHub repository
- **Firebase**: Use Firebase Hosting
- **AWS S3**: Upload to S3 bucket with CloudFront

## 📊 Project Structure

```
spinit/
├── src/
│   ├── app/
│   │   ├── app.component.ts      # Main game logic
│   │   ├── app.component.html    # Game interface
│   │   ├── app.component.css     # Component styles
│   │   └── audio.service.ts      # Audio management
│   ├── assets/
│   │   ├── bottle.png            # Bottle image
│   │   ├── spinning-sound.mp3    # Custom audio file
│   │   └── icons/                # PWA icons
│   ├── styles.css                # Global styles
│   └── main.ts                   # Application entry point
├── package.json                  # Dependencies and scripts
├── angular.json                  # Angular configuration
└── README.md                     # This file
```

## 🔧 Development

### Available Scripts
- `npm start`: Start development server
- `npm run build`: Build for production
- `npm run build:prod`: Build for GitHub Pages
- `npm run deploy`: Deploy to GitHub Pages
- `npm test`: Run unit tests

### Key Components
- **AppComponent**: Main game controller with spinning logic
- **AudioService**: Handles sound effects and volume control
- **GSAP Animations**: Smooth bottle spinning and transitions
- **PWA Configuration**: Service worker and manifest setup

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **GSAP**: For amazing animation capabilities
- **Angular Team**: For the excellent framework
- **Web Audio API**: For high-quality sound implementation
- **PWA Community**: For progressive web app standards

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/manjunathpy/spinit/issues)
- **Demo**: [Live Game](https://manjunathpy.github.io/spinit/)
- **Repository**: [GitHub Repo](https://github.com/manjunathpy/spinit)

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/manjunathpy">Manjunath</a></p>
  <p>Enjoy playing SpinIT! 🍾</p>
</div> 