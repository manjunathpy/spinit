import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pwa-install',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="showInstallPrompt" class="pwa-install-banner">
      <div class="pwa-install-content">
        <div class="pwa-install-text">
          <h3>📱 Install SpinIT</h3>
          <p>Add to home screen for the best experience!</p>
        </div>
        <div class="pwa-install-buttons">
          <button 
            *ngIf="!isIOS" 
            (click)="installPWA()" 
            class="pwa-install-btn primary"
          >
            Install App
          </button>
          <button 
            *ngIf="isIOS" 
            (click)="showIOSInstructions()" 
            class="pwa-install-btn primary"
          >
            Install on iOS
          </button>
          <button 
            (click)="dismissInstallPrompt()" 
            class="pwa-install-btn secondary"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .pwa-install-banner {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(145deg, #343434, #060606);
      color: white;
      padding: 1rem;
      z-index: 1000;
      box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.15);
      animation: slideUp 0.3s ease-out;
    }

    .pwa-install-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 400px;
      margin: 0 auto;
      gap: 1rem;
    }

    .pwa-install-text h3 {
      margin: 0 0 0.25rem 0;
      font-size: 1.1rem;
      font-weight: 600;
    }

    .pwa-install-text p {
      margin: 0;
      font-size: 0.9rem;
      opacity: 0.9;
    }

    .pwa-install-buttons {
      display: flex;
      gap: 0.5rem;
      flex-shrink: 0;
    }

    .pwa-install-btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .pwa-install-btn.primary {
      background: white;
      color: #070707;
    }

    .pwa-install-btn.primary:hover {
      background: #f8f9fa;
      transform: translateY(-1px);
    }

    .pwa-install-btn.secondary {
      background: transparent;
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .pwa-install-btn.secondary:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    @keyframes slideUp {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    @media (max-width: 480px) {
      .pwa-install-content {
        flex-direction: column;
        text-align: center;
        gap: 0.75rem;
      }

      .pwa-install-buttons {
        width: 100%;
        justify-content: center;
      }

      .pwa-install-btn {
        flex: 1;
        max-width: 120px;
      }
    }
  `]
})
export class PwaInstallComponent implements OnInit, OnDestroy {
  showInstallPrompt = false;
  isIOS = false;
  private deferredPrompt: any;
  private installEvent: any;

  ngOnInit() {
    console.log('PWA Install Component initialized');
    this.detectPlatform();
    this.setupInstallListener();
    this.checkInstallStatus();
    this.logPWAStatus();
  }

  ngOnDestroy() {
    // Clean up event listeners
    window.removeEventListener('beforeinstallprompt', this.handleBeforeInstallPrompt);
    window.removeEventListener('appinstalled', this.handleAppInstalled);
  }

  private detectPlatform() {
    // Detect iOS
    this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                 (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    console.log('Platform detected:', this.isIOS ? 'iOS' : 'Android/Desktop');
  }

  private setupInstallListener() {
    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('beforeinstallprompt event fired');
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallPrompt = true;
      console.log('PWA install prompt available');
    });

    // Listen for successful installation
    window.addEventListener('appinstalled', (evt) => {
      console.log('appinstalled event fired');
      this.handleAppInstalled(evt);
    });

    // Additional debugging
    window.addEventListener('load', () => {
      console.log('Window loaded, checking PWA status...');
      this.logPWAStatus();
    });
  }

  private checkInstallStatus() {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator as any).standalone === true;
    
    if (isStandalone) {
      console.log('PWA already installed (standalone mode detected)');
      return;
    }

    // Check if we should show the prompt based on user interaction
    const hasInteracted = localStorage.getItem('pwa-user-interacted');
    const lastPromptTime = localStorage.getItem('pwa-last-prompt');
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    console.log('PWA status check:', {
      hasInteracted,
      lastPromptTime,
      timeSinceLastPrompt: lastPromptTime ? now - parseInt(lastPromptTime) : 'never',
      shouldShowPrompt: !hasInteracted && (!lastPromptTime || (now - parseInt(lastPromptTime)) > oneDay)
    });

    if (!hasInteracted && (!lastPromptTime || (now - parseInt(lastPromptTime)) > oneDay)) {
      // Show prompt after a delay to ensure user has interacted with the app
      setTimeout(() => {
        if (!this.deferredPrompt && !this.isIOS) {
          console.log('Showing manual install prompt (no beforeinstallprompt event)');
          this.showInstallPrompt = true;
        }
      }, 5000); // Show after 5 seconds
    }
  }

  private logPWAStatus() {
    console.log('PWA Status Check:');
    console.log('- User Agent:', navigator.userAgent);
    console.log('- Platform:', navigator.platform);
    console.log('- Standalone:', (window.navigator as any).standalone);
    console.log('- Display Mode:', window.matchMedia('(display-mode: standalone)').matches);
    console.log('- Service Worker:', 'serviceWorker' in navigator);
    console.log('- Before Install Prompt:', 'beforeinstallprompt' in window);
    
    // Check if manifest is loaded
    const manifestLink = document.querySelector('link[rel="manifest"]');
    console.log('- Manifest Link:', manifestLink ? (manifestLink as HTMLLinkElement).href : 'Not found');
    
    // Check if service worker is registered
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        console.log('- Service Worker Registrations:', registrations.length);
        registrations.forEach((registration, index) => {
          console.log(`  SW ${index + 1}:`, registration.scope, registration.active ? 'Active' : 'Inactive');
        });
      });
    }
  }

  async installPWA() {
    console.log('Install PWA called');
    if (!this.deferredPrompt) {
      console.log('No install prompt available');
      // Show manual instructions for Android
      this.showAndroidInstructions();
      return;
    }

    try {
      console.log('Showing install prompt...');
      // Show the install prompt
      this.deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await this.deferredPrompt.userChoice;
      console.log('Install prompt outcome:', outcome);
      
      if (outcome === 'accepted') {
        console.log('PWA installation accepted');
        this.showInstallPrompt = false;
        localStorage.setItem('pwa-user-interacted', 'true');
      } else {
        console.log('PWA installation declined');
        this.dismissInstallPrompt();
      }
      
      // Clear the deferred prompt
      this.deferredPrompt = null;
    } catch (error) {
      console.error('Error during PWA installation:', error);
      this.showAndroidInstructions();
    }
  }

  showIOSInstructions() {
    // Create a modal or alert with iOS installation instructions
    const instructions = `
📱 How to Install SpinIT on iOS:

1. Tap the Share button (📤) in Safari
2. Scroll down and tap "Add to Home Screen"
3. Tap "Add" to confirm
4. The app will now appear on your home screen!

Enjoy playing SpinIT! 🍾
    `;
    
    alert(instructions);
    this.dismissInstallPrompt();
  }

  showAndroidInstructions() {
    const instructions = `
📱 How to Install SpinIT on Android:

1. Tap the menu button (⋮) in Chrome
2. Tap "Add to Home screen" or "Install app"
3. Tap "Add" to confirm
4. The app will now appear on your home screen!

Enjoy playing SpinIT! 🍾
    `;
    
    alert(instructions);
    this.dismissInstallPrompt();
  }

  dismissInstallPrompt() {
    this.showInstallPrompt = false;
    localStorage.setItem('pwa-last-prompt', Date.now().toString());
    console.log('Install prompt dismissed');
  }

  private handleBeforeInstallPrompt = (e: any) => {
    console.log('beforeinstallprompt handler called');
    e.preventDefault();
    this.deferredPrompt = e;
    this.showInstallPrompt = true;
  };

  private handleAppInstalled = (evt: any) => {
    console.log('PWA was installed successfully');
    this.showInstallPrompt = false;
    localStorage.setItem('pwa-user-interacted', 'true');
    
    // Optional: Show a success message
    setTimeout(() => {
      alert('🎉 SpinIT has been installed successfully! You can now access it from your home screen.');
    }, 1000);
  };
} 