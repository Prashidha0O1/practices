export class AudioFingerprint {
  private noiseLevel: number;

  constructor(noiseLevel: number = 0.05) {
    this.noiseLevel = noiseLevel;
  }

  async injectAudioEvasion(page: any): Promise<void> {
    await page.evaluateOnNewDocument((noiseLevel: number) => {
      if (typeof AudioBuffer === 'function') {
        const originalGetChannelData = AudioBuffer.prototype.getChannelData;
        AudioBuffer.prototype.getChannelData = function(channel: number) {
          const data = originalGetChannelData.call(this, channel);
          // Add subtle noise to audio buffer
          for (let i = 0; i < data.length; i++) {
            data[i] = data[i] + (Math.random() - 0.5) * noiseLevel;
          }
          return data;
        };
      }
    }, this.noiseLevel);
  }
} 