# Spinning Bottle Game - Angular PWA

An interactive spinning bottle game built with Angular 17, GSAP animations, and PWA capabilities. The bottle spins with realistic physics and precisely points to the selected player.

## 🎯 Key Features

- **Precise Bottle Pointing**: The bottle's mouth (triangle) accurately points to the selected player
- **Dynamic Player Positioning**: Supports 2-12 players with perfect radial symmetry
- **Realistic Physics**: GSAP-powered animations with natural deceleration
- **PWA Ready**: Works offline and can be installed on mobile devices
- **Responsive Design**: Optimized for both desktop and mobile

## 🚀 Quick Start

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm start
   ```

3. **Open Browser**: Navigate to `http://localhost:4200`

## 🎮 How to Play

1. **Set Player Count**: Enter the number of players (2-12) in the input field
2. **Click to Spin**: Click the bottle to start the spinning animation
3. **Watch the Result**: The bottle will spin for 3-5 seconds and stop pointing to a player
4. **Reset**: Click the "Reset" button to start a new game

## 🔧 Technical Implementation

### **Precise Bottle Pointing Solution**

The key challenge was ensuring the bottle's mouth (triangle) points exactly to the selected player. Here's how it's solved:

#### **1. SVG-Based Bottle Design**
```html
<svg class="bottle" width="60" height="120" viewBox="0 0 60 120">
  <!-- Bottle body -->
  <rect x="15" y="10" width="30" height="100" rx="15" fill="url(#bottleGradient)" />
  <!-- Bottle mouth (pointer) - this is the key element -->
  <polygon points="30,5 25,0 35,0" fill="#4a90e2" stroke="#2c5aa0" stroke-width="1" />
</svg>
```

#### **2. Coordinate System Alignment**
- **Player Positions**: Start from top (0°) and go clockwise
- **Bottle Orientation**: Triangle points in the direction of rotation
- **Transform Origin**: Centered for accurate rotation

#### **3. Mathematical Precision**
```typescript
// Calculate player positions
const angle = (i * angleSpacing) % 360; // Start from top (0 degrees)
const x = Math.cos(radians) * this.GAME_AREA_RADIUS;
const y = Math.sin(radians) * this.GAME_AREA_RADIUS;

// Calculate bottle rotation
const totalRotation = rotations * 360 + finalAngle;
```

#### **4. GSAP Animation**
```typescript
gsap.to(bottle, {
  rotation: totalRotation,
  duration: spinDuration,
  ease: "power2.out", // Realistic deceleration
  onComplete: () => {
    this.handleSpinComplete(finalAngle);
  }
});
```

### **Why This Solution Works**

1. **SVG Precision**: SVG provides pixel-perfect control over the bottle's shape and rotation
2. **Unified Coordinate System**: Both players and bottle use the same 0-360° coordinate system
3. **Transform Origin**: Bottle rotates around its center, ensuring accurate pointing
4. **Mathematical Alignment**: Player positions and bottle rotation are mathematically aligned

## 📱 PWA Features

- **Offline Support**: Service worker caches resources
- **Installable**: Can be added to home screen on mobile devices
- **Responsive**: Optimized for all screen sizes
- **Fast Loading**: Optimized bundle size and lazy loading

## 🛠️ Technology Stack

- **Angular 17**: Latest Angular framework with standalone components
- **GSAP 3**: Professional animation library for smooth bottle spinning
- **TypeScript**: Type-safe development
- **CSS3**: Modern styling with gradients and animations
- **PWA**: Progressive Web App capabilities

## 🎨 Design Features

- **Modern UI**: Clean, gradient-based design with rounded corners
- **Visual Feedback**: Player markers highlight when selected
- **Smooth Animations**: GSAP-powered transitions throughout
- **Responsive Layout**: Adapts to different screen sizes

## 🔍 Testing the Precision

To verify the bottle pointing accuracy:

1. Set player count to 3
2. Click spin multiple times
3. Observe that the bottle's triangle (mouth) always points to the highlighted player
4. The selected player marker will be green and pulsing
5. The status message will confirm the selection

## 🚀 Deployment

```bash
# Build for production
npm run build

# The built files will be in dist/spinning-bottle-game/
```

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

**Note**: The bottle pointing precision is achieved through careful mathematical alignment of the coordinate systems and SVG-based bottle design. The triangle at the top of the bottle serves as the precise pointer that indicates the selected player. 