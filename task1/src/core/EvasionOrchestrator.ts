import { EvasionConfig } from '../types';
import { CanvasFingerprint } from '../evasions/fingerprint/CanvasFingerprint';
// import other evasions as you implement them

export class EvasionOrchestrator {
  private config: EvasionConfig;

  constructor(config: EvasionConfig) {
    this.config = config;
  }

  async applyAll(page: any): Promise<void> {
    // Canvas evasion
    if (this.config.enableCanvasEvasion) {
      const canvas = new CanvasFingerprint();
      await canvas.injectCanvasEvasion(page);
    }
    // TODO: Add other evasions (WebGL, Audio, Mouse, etc)
  }
} 