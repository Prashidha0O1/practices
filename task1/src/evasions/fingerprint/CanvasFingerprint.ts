export class CanvasFingerprint {
  private noiseLevel: number;

  constructor(noiseLevel: number = 0.1) {
    this.noiseLevel = noiseLevel;
  }

  /**
   * Injects canvas fingerprint evasion scripts into the page
   */
  async injectCanvasEvasion(page: any): Promise<void> {
    await page.evaluateOnNewDocument((noiseLevel: number) => {
      // Override HTMLCanvasElement.prototype.toDataURL
      const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
      HTMLCanvasElement.prototype.toDataURL = function(type?: string, quality?: any) {
        const canvas = this;
        const context = canvas.getContext('2d');
        
        if (context) {
          // Add subtle noise to the canvas
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          for (let i = 0; i < data.length; i += 4) {
            // Add very subtle noise to RGB values
            const noise = (Math.random() - 0.5) * noiseLevel * 255;
            data[i] = Math.max(0, Math.min(255, data[i] + noise));     // Red
            data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise)); // Green
            data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise)); // Blue
            // Alpha channel remains unchanged
          }
          
          context.putImageData(imageData, 0, 0);
        }
        
        return originalToDataURL.call(this, type, quality);
      };

      // Override WebGL canvas fingerprinting
      if (typeof WebGLRenderingContext !== 'undefined') {
        const originalGetParameter = WebGLRenderingContext.prototype.getParameter;
        WebGLRenderingContext.prototype.getParameter = function(parameter: number) {
          // Add subtle variations to certain WebGL parameters
          const result = originalGetParameter.call(this, parameter);
          
          // Add noise to specific parameters that are commonly used for fingerprinting
          const noiseParams = [
            33902, // ALIASED_LINE_WIDTH_RANGE
            33901, // ALIASED_POINT_SIZE_RANGE
            3379,  // MAX_TEXTURE_SIZE
            3386   // MAX_VIEWPORT_DIMS
          ];
          
          if (noiseParams.includes(parameter)) {
            if (Array.isArray(result)) {
              return result.map(val => val * (1 + (Math.random() - 0.5) * noiseLevel * 0.05));
            } else {
              return result * (1 + (Math.random() - 0.5) * noiseLevel * 0.05);
            }
          }
          
          return result;
        };
      }

      // Override getImageData to add noise
      if (typeof CanvasRenderingContext2D !== 'undefined') {
        const originalGetImageData = CanvasRenderingContext2D.prototype.getImageData;
        CanvasRenderingContext2D.prototype.getImageData = function(sx: number, sy: number, sw: number, sh: number) {
          const imageData = originalGetImageData.call(this, sx, sy, sw, sh);
          const data = imageData.data;
          
          // Add subtle noise to prevent fingerprinting
          for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * noiseLevel * 255;
            data[i] = Math.max(0, Math.min(255, data[i] + noise));     // Red
            data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise)); // Green
            data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise)); // Blue
          }
          
          return imageData;
        };
      }

      console.log('Canvas fingerprint evasion injected');
    }, this.noiseLevel);
  }

  /**
   * Generates a consistent but randomized canvas fingerprint
   */
  async generateCanvasFingerprint(page: any): Promise<string> {
    return await page.evaluate(() => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return '';
      
      // Create a simple canvas drawing
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Canvas fingerprint test', 2, 2);
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
      ctx.fillText('Canvas fingerprint test', 4, 4);
      
      return canvas.toDataURL();
    });
  }

  /**
   * Sets the noise level for canvas evasion
   */
  setNoiseLevel(level: number): void {
    this.noiseLevel = Math.max(0, Math.min(1, level));
  }

  /**
   * Gets the current noise level
   */
  getNoiseLevel(): number {
    return this.noiseLevel;
  }
} 