export class WebGLFingerprint {
  private noiseLevel: number;

  constructor(noiseLevel: number = 0.1) {
    this.noiseLevel = noiseLevel;
  }

  async injectWebGLEvasion(page: any): Promise<void> {
    await page.evaluateOnNewDocument((noiseLevel: number) => {
      if (typeof WebGLRenderingContext !== 'undefined') {
        const originalGetParameter = WebGLRenderingContext.prototype.getParameter;
        WebGLRenderingContext.prototype.getParameter = function(parameter: number) {
          // Spoof vendor and renderer
          if (parameter === 37445) return 'NVIDIA Corporation'; // UNMASKED_VENDOR_WEBGL
          if (parameter === 37446) return 'NVIDIA GeForce RTX 3080/PCIe/SSE2'; // UNMASKED_RENDERER_WEBGL
          // Add noise to numeric parameters
          const result = originalGetParameter.call(this, parameter);
          if (typeof result === 'number') {
            return result * (1 + (Math.random() - 0.5) * noiseLevel * 0.05);
          }
          return result;
        };
      }
      // Spoof WebGL debug info
      if (typeof WebGL2RenderingContext !== 'undefined') {
        const originalGetParameter = WebGL2RenderingContext.prototype.getParameter;
        WebGL2RenderingContext.prototype.getParameter = function(parameter: number) {
          if (parameter === 37445) return 'NVIDIA Corporation';
          if (parameter === 37446) return 'NVIDIA GeForce RTX 3080/PCIe/SSE2';
          const result = originalGetParameter.call(this, parameter);
          if (typeof result === 'number') {
            return result * (1 + (Math.random() - 0.5) * noiseLevel * 0.05);
          }
          return result;
        };
      }
      // Spoof shader precision
      if (typeof WebGLRenderingContext !== 'undefined') {
        const originalGetShaderPrecisionFormat = WebGLRenderingContext.prototype.getShaderPrecisionFormat;
        WebGLRenderingContext.prototype.getShaderPrecisionFormat = function() {
          return { rangeMin: 127, rangeMax: 127, precision: 23 };
        };
      }
    }, this.noiseLevel);
  }
} 