import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audioContext: AudioContext | null = null;
  private audioBuffer: AudioBuffer | null = null;
  private audioSource: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private isMuted: boolean = false;
  private volume: number = 1.0;
  private isPlaying: boolean = false;
  private isLoaded: boolean = false;

  constructor() {
    this.initializeAudio();
  }

  /**
   * Initializes the audio system using Web Audio API
   * This function sets up the audio context and loads the sound file.
   */
  private initializeAudio(): void {
    try {
      // Create audio context
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      console.log('Audio context initialized successfully');
      
      // Load the sound file
      this.loadSoundFile();
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  }

  /**
   * Loads the spinning sound file
   * This function fetches and decodes the audio file for playback.
   */
  private async loadSoundFile(): Promise<void> {
    if (!this.audioContext) return;

    try {
      // Fetch the audio file
      const response = await fetch('assets/spinning-sound.mp3'); // Update path to your sound file
      const arrayBuffer = await response.arrayBuffer();
      
      // Decode the audio data
      this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.isLoaded = true;
      
      console.log('Spinning sound file loaded successfully');
    } catch (error) {
      console.error('Failed to load spinning sound file:', error);
      // Fallback to generated sound if file loading fails
      this.createFallbackSound();
    }
  }

  /**
   * Creates a fallback spinning sound if file loading fails
   * This function generates a simple spinning sound using oscillators.
   */
  private createFallbackSound(): void {
    if (!this.audioContext) return;

    try {
      // Create a simple spinning sound using oscillators
      const duration = 2.0; // 2 seconds
      const sampleRate = this.audioContext.sampleRate;
      const frameCount = sampleRate * duration;
      
      // Create audio buffer
      this.audioBuffer = this.audioContext.createBuffer(1, frameCount, sampleRate);
      const channelData = this.audioBuffer.getChannelData(0);
      
      // Generate spinning sound
      for (let i = 0; i < frameCount; i++) {
        const time = i / sampleRate;
        const frequency = 200 + Math.sin(time * 10) * 50; // Varying frequency
        const amplitude = Math.exp(-time * 2); // Fade out
        
        channelData[i] = Math.sin(2 * Math.PI * frequency * time) * amplitude * 0.3;
      }
      
      this.isLoaded = true;
      console.log('Fallback spinning sound created');
    } catch (error) {
      console.error('Failed to create fallback sound:', error);
    }
  }

  /**
   * Plays the bottle spinning sound
   * This function plays the loaded sound file with dynamic effects.
   */
  playSpinningSound(): void {
    if (this.isMuted || !this.audioContext || !this.audioBuffer || this.isPlaying) return;

    try {
      // Resume audio context if suspended (required for mobile)
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      // Create audio source
      this.audioSource = this.audioContext.createBufferSource();
      this.gainNode = this.audioContext.createGain();

      // Configure audio source
      this.audioSource.buffer = this.audioBuffer;
      
      // Configure gain
      this.gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);

      // Connect nodes
      this.audioSource.connect(this.gainNode);
      this.gainNode.connect(this.audioContext.destination);

      // Apply dynamic effects
      this.applySpinningEffects();

      // Start the sound
      this.audioSource.start();
      this.isPlaying = true;
      
      console.log('Spinning sound started');
    } catch (error) {
      console.error('Error playing spinning sound:', error);
    }
  }

  /**
   * Stops the bottle spinning sound
   * This function stops the spinning sound immediately without fade-out.
   */
  stopSpinningSound(): void {
    if (!this.audioContext || !this.audioSource || !this.gainNode || !this.isPlaying) return;

    try {
      // Stop immediately without fade-out
      if (this.audioSource) {
        this.audioSource.stop();
        this.audioSource.disconnect();
        this.audioSource = null;
      }
      if (this.gainNode) {
        this.gainNode.disconnect();
        this.gainNode = null;
      }
      this.isPlaying = false;
      console.log('Spinning sound stopped');
      
    } catch (error) {
      console.error('Error stopping spinning sound:', error);
    }
  }

  /**
   * Applies minimal effects to preserve original sound
   * This function keeps the original sound quality with minimal modifications.
   */
  private applySpinningEffects(): void {
    if (!this.audioContext || !this.audioSource || !this.gainNode) return;

    // Set consistent volume without variations
    this.gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
    
    // Keep original playback rate (1.0 = normal speed)
    this.audioSource.playbackRate.setValueAtTime(1.0, this.audioContext.currentTime);
  }

  /**
   * Cleans up spinning effects
   * This function is kept for compatibility but no longer needed.
   */
  private cleanupEffects(): void {
    // No dynamic effects to clean up
  }

  /**
   * Toggles mute state
   * This function allows users to mute/unmute the audio.
   */
  toggleMute(): void {
    this.isMuted = !this.isMuted;
    
    if (this.isMuted) {
      this.stopSpinningSound();
      console.log('Audio muted');
    } else {
      console.log('Audio unmuted');
    }
  }

  /**
   * Sets the volume level
   * This function allows users to adjust the audio volume.
   */
  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    console.log('Volume set to:', this.volume);
  }

  /**
   * Gets the current mute state
   * This function returns whether audio is currently muted.
   */
  isAudioMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Gets the current volume level
   * This function returns the current audio volume.
   */
  getVolume(): number {
    return this.volume;
  }

  /**
   * Gets the loading state
   * This function returns whether the audio file is loaded.
   */
  isAudioLoaded(): boolean {
    return this.isLoaded;
  }

  /**
   * Cleanup method for component destruction
   * This function properly cleans up audio resources.
   */
  cleanup(): void {
    this.cleanupEffects();
    this.stopSpinningSound();
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
} 