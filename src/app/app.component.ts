import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { gsap } from 'gsap';
import { AudioService } from './audio.service';

interface PlayerMarker {
  id: number;
  angle: number;
  x: number;
  y: number;
  selected: boolean;
  completed: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('bottle', { static: false }) bottleRef!: ElementRef;
  @ViewChild('gameArea', { static: false }) gameAreaRef!: ElementRef;

  playerCount: number = 2;
  playerMarkers: PlayerMarker[] = [];
  isSpinning: boolean = false;
  selectedPlayer: number | null = null;
  statusMessage: string = ' ';
  statusClass: string = 'default';

  // Enhanced state management
  selectedPlayers: number[] = []; // Players with green background + pulse
  completedPlayers: number[] = []; // Players with gray background
  availablePlayers: number[] = []; // Players available for selection
  allPlayersSelected: boolean = false;
  unselectedCount: number = 0;

  private readonly GAME_AREA_RADIUS = 120; // Distance from center to player markers
  private readonly BOTTLE_BASE_ROTATION = 270; // Base rotation pointing to P1

  constructor(private audioService: AudioService) {}

  ngOnInit(): void {
    this.updatePlayerMarkers();
  }

  ngAfterViewInit(): void {
    // Initialize bottle position
    this.resetBottle();
  }

  /**
   * Updates the player count and recalculates player marker positions
   * This function dynamically calculates the positions of player markers around the bottle
   * based on the specified number of players, ensuring perfect radial symmetry.
   * Also handles edge case of player count changes by resetting game state.
   */
  updatePlayerMarkers(): void {
    this.playerMarkers = [];
    
    // Calculate angle spacing based on player count
    const angleSpacing = 360 / this.playerCount;
    
    // Generate player markers with calculated positions
    // For 2 players: P1 at 0° (left), P2 at 180° (right)
    for (let i = 0; i < this.playerCount; i++) {
      let angle: number;
      
      if (this.playerCount === 2) {
        // Special case for 2 players: P1 at 0° (left), P2 at 180° (right)
        angle = i === 0 ? 0 : 180;
      } else {
        // For other player counts, start from left (0 degrees) and go clockwise
        angle = (i * angleSpacing) % 360;
      }
      
      // Convert custom coordinate system to standard trigonometry
      // Your system: 0°=Left, 90°=Up, 180°=Right, 270°=Down
      // Standard system: 0°=Right, 90°=Up, 180°=Left, 270°=Down
      const standardAngle = (angle + 180) % 360; // Convert your system to standard
      const radians = (standardAngle * Math.PI) / 180;
      
      // Calculate x, y coordinates on the circle using standard trigonometry
      const x = Math.cos(radians) * this.GAME_AREA_RADIUS;
      const y = Math.sin(radians) * this.GAME_AREA_RADIUS;
      
      this.playerMarkers.push({
        id: i + 1,
        angle: angle, // Store the custom angle for reference
        x: x,
        y: y,
        selected: false,
        completed: false
      });
    }
    
    // Reset game state when player count changes (edge case handling)
    this.resetGameState();
  }

  /**
   * Spins the bottle with consistent speed and selects from available players only
   * This function ensures the bottle spins at the same speed every time and
   * only selects from players who haven't been selected yet.
   */
  spinBottle(): void {
    if (this.isSpinning || this.playerCount < 2 || this.allPlayersSelected) return;

    this.isSpinning = true;
    this.statusMessage = 'Selecting...';
    this.statusClass = 'default';
    this.clearSelection();

    // Move previously selected player to completed state
    if (this.selectedPlayer) {
      this.completedPlayers.push(this.selectedPlayer);
      this.selectedPlayers = this.selectedPlayers.filter(id => id !== this.selectedPlayer);
      this.updatePlayerVisualStates();
    }

    // Select from available players only
    const randomIndex = Math.floor(Math.random() * this.availablePlayers.length);
    const selectedPlayerId = this.availablePlayers[randomIndex];
    
    // Calculate the exact angle for the selected player
    const selectedMarker = this.playerMarkers.find(marker => marker.id === selectedPlayerId);
    if (!selectedMarker) return;
    
    const targetAngle = selectedMarker.angle;
    
    // Get the bottle element
    const bottle = this.bottleRef.nativeElement;
    
    // Convert target angle to bottle rotation
    // Your system: 0°=Left, 90°=Up, 180°=Right, 270°=Down
    // Bottle default: 0°=Up, 90°=Right, 180°=Down, 270°=Left
    const bottleRotation = (targetAngle + 270) % 360;
    
    // Consistent spinning: Always start from base position
    gsap.set(bottle, { rotation: this.BOTTLE_BASE_ROTATION });
    
         // Add 6 full rotations (2160 degrees) before pointing to the selected player
     const totalRotation = bottleRotation + 2160;
     
     // Rotate bottle with faster speed to match sound duration
     gsap.to(bottle, {
       rotation: totalRotation,
       duration: 1.5, // Faster duration to match sound
       ease: "power2.out", // Faster easing for more dynamic feel
       onStart: () => {
         // Start spinning sound when animation begins
         this.audioService.playSpinningSound();
       },
       onComplete: () => {
         // Stop spinning sound when animation completes
         this.audioService.stopSpinningSound();
         this.handleDirectSelection(selectedPlayerId);
       }
     });
  }

  /**
   * Handles the direct selection of a player
   * This function updates the game state when the bottle points directly to a player.
   */
  private handleDirectSelection(selectedPlayerId: number): void {
    this.isSpinning = false;
    
    // Update game state
    this.selectedPlayer = selectedPlayerId;
    this.selectedPlayers.push(selectedPlayerId);
    this.availablePlayers = this.availablePlayers.filter(id => id !== selectedPlayerId);
    this.unselectedCount = this.availablePlayers.length;
    
    // Update visual states
    this.updatePlayerVisualStates();
    
    // Check if all players have been selected
    if (this.availablePlayers.length === 0) {
      this.allPlayersSelected = true;
      this.statusMessage = "Everyone's been chosen!";
      this.statusClass = 'success';
    } else {
      // Update status message with remaining count 
      this.statusMessage = `P${selectedPlayerId} Truth or Dare? ${this.unselectedCount} Remaining`;
      this.statusClass = 'success';
    }
  }

  /**
   * Updates the visual states of all player markers
   * This function applies the correct CSS classes based on player states:
   * - Available: White background
   * - Selected: Green background + pulse animation
   * - Completed: Gray background
   */
  private updatePlayerVisualStates(): void {
    this.playerMarkers.forEach(marker => {
      marker.selected = this.selectedPlayers.includes(marker.id);
      marker.completed = this.completedPlayers.includes(marker.id);
    });
  }

  /**
   * Resets the game to its initial state
   * This function clears all selections, resets the bottle position, and
   * updates the status message to prompt for new input.
   */
  resetGame(): void {
    this.resetGameState();
    this.resetBottle();
  }

  /**
   * Resets the complete game state including all tracking arrays
   * This function is called when resetting the game or changing player count.
   */
  private resetGameState(): void {
    this.selectedPlayer = null;
    this.isSpinning = false;
    this.selectedPlayers = [];
    this.completedPlayers = [];
    this.availablePlayers = Array.from({ length: this.playerCount }, (_, i) => i + 1);
    this.allPlayersSelected = false;
    this.unselectedCount = this.playerCount;
    this.clearSelection();
    this.statusMessage = ' ';
    this.statusClass = 'default';
  }

  /**
   * Clears the visual selection of all player markers
   * This function removes the selected and completed states from all player markers
   * to prepare for a new game round.
   */
  private clearSelection(): void {
    this.playerMarkers.forEach(marker => {
      marker.selected = false;
      marker.completed = false;
    });
  }

  /**
   * Resets the bottle to its original position pointing to P1 (0 degrees)
   * This function animates the bottle back to pointing to P1 using GSAP for smooth transition.
   */
  private resetBottle(): void {
    if (this.bottleRef) {
      const bottle = this.bottleRef.nativeElement;
      gsap.to(bottle, {
        rotation: this.BOTTLE_BASE_ROTATION,
        duration: 0.5,
        ease: "power2.out"
      });
    }
  }

  /**
   * Determines the appropriate button text based on current game state
   * This function returns "Start" for new games and "Reset" for active games.
   */
  getButtonText(): string {
    // Game is complete - ready for new game
    if (this.allPlayersSelected) {
      return "Start";
    }
    
    // Game is in progress (has selected or completed players)
    if (this.selectedPlayers.length > 0 || this.completedPlayers.length > 0) {
      return "Reset";
    }
    
    // No game started yet
    return "Start";
  }

  /**
   * Handles input validation for player count
   * This function ensures the player count is within the valid range (2-12)
   * and updates the game state accordingly. Automatically resets game state
   * when player count changes (edge case handling).
   */
     onPlayerCountChange(): void {
     // Ensure player count is within valid range
     if (this.playerCount < 2) {
       this.playerCount = 2;
     } else if (this.playerCount > 12) {
       this.playerCount = 12;
     }
     
     // Reset game state when player count changes
     this.updatePlayerMarkers();
   }

   /**
    * Cleanup method called when component is destroyed
    * This function ensures proper cleanup of audio resources.
    */
   ngOnDestroy(): void {
     this.audioService.cleanup();
   }

   /**
    * Expose audio service for template access
    * This allows the template to access audio controls.
    */
   get audioServiceInstance(): AudioService {
     return this.audioService;
   }
} 