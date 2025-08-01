import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { gsap } from 'gsap';

interface PlayerMarker {
  id: number;
  angle: number;
  x: number;
  y: number;
  selected: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('bottle', { static: false }) bottleRef!: ElementRef;
  @ViewChild('gameArea', { static: false }) gameAreaRef!: ElementRef;

  playerCount: number = 2;
  playerMarkers: PlayerMarker[] = [];
  isSpinning: boolean = false;
  selectedPlayer: number | null = null;
  statusMessage: string = ' ';
  statusClass: string = 'default';

  private readonly GAME_AREA_RADIUS = 120; // Distance from center to player markers
  private readonly BOTTLE_ORIGINAL_ANGLE = -90; // Bottle points up (mouth at top)

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
        selected: false
      });
      
             // Player position calculated
     }
    
    // Reset game state
    this.resetGame();
  }

  /**
   * Points the bottle directly to a random player position
   * This function randomly selects one of the player positions and
   * rotates the bottle to point directly at that player.
   */
  spinBottle(): void {
    if (this.isSpinning || this.playerCount < 2) return;

    this.isSpinning = true;
    this.statusMessage = 'Selecting...';
    this.statusClass = 'default';
    this.clearSelection();

    // Randomly select one of the player positions
    const randomPlayerIndex = Math.floor(Math.random() * this.playerCount);
    const selectedPlayerId = randomPlayerIndex + 1;
    
    // Calculate the exact angle for the selected player
    let targetAngle: number;
    
    if (this.playerCount === 2) {
      // For 2 players: P1 at 0° (left), P2 at 180° (right)
      targetAngle = randomPlayerIndex === 0 ? 0 : 180;
    } else {
      // For other player counts, use standard calculation
      const sectorAngle = 360 / this.playerCount;
      targetAngle = randomPlayerIndex * sectorAngle;
    }
    
         // Get the bottle element
     const bottle = this.bottleRef.nativeElement;
    
        // Convert target angle to bottle rotation
    // Your system: 0°=Left, 90°=Up, 180°=Right, 270°=Down
    // Bottle default: 0°=Up, 90°=Right, 180°=Down, 270°=Left
    const bottleRotation = (targetAngle + 270) % 360;
    
    // Add 2 full rotations (720 degrees) before pointing to the selected player
    const totalRotation = bottleRotation + 720;
    
    // Rotate bottle with 2 full spins - faster spinning with deceleration
    gsap.to(bottle, {
      rotation: totalRotation,
      duration: 2.0, // Faster 2-second duration
      ease: "power3.out", // More pronounced deceleration
      onComplete: () => {
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
    this.playerMarkers.forEach(marker => {
      marker.selected = marker.id === selectedPlayerId;
    });
    
    // Update status message
    this.statusMessage = `P${selectedPlayerId} has been selected!`;
    this.statusClass = 'success';
  }

  /**
   * Resets the game to its initial state
   * This function clears all selections, resets the bottle position, and
   * updates the status message to prompt for new input.
   */
  resetGame(): void {
    this.selectedPlayer = null;
    this.isSpinning = false;
    this.clearSelection();
    this.resetBottle();
    this.statusMessage = ' ';
    this.statusClass = 'default';
  }

  /**
   * Clears the visual selection of all player markers
   * This function removes the selected state from all player markers
   * to prepare for a new game round.
   */
  private clearSelection(): void {
    this.playerMarkers.forEach(marker => {
      marker.selected = false;
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
        rotation: 270, // Point to P1 (0 degrees) - bottle default is up, so 270° points left
        duration: 0.5,
        ease: "power2.out"
      });
    }
  }

  /**
   * Handles input validation for player count
   * This function ensures the player count is within the valid range (2-12)
   * and updates the game state accordingly.
   */
  onPlayerCountChange(): void {
    // Ensure player count is within valid range
    if (this.playerCount < 2) {
      this.playerCount = 2;
    } else if (this.playerCount > 12) {
      this.playerCount = 12;
    }
    
    this.updatePlayerMarkers();
  }


} 