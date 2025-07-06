export class FontsFingerprint {
  async injectFontsEvasion(page: any): Promise<void> {
    await page.evaluateOnNewDocument(() => {
      // Spoof available fonts
      const fakeFonts = [
        'Arial', 'Verdana', 'Times New Roman', 'Courier New', 'Georgia',
        'Comic Sans MS', 'Trebuchet MS', 'Arial Black', 'Impact', 'Tahoma'
      ];
      // Override document.fonts.check
      if (document.fonts && document.fonts.check) {
        const originalCheck = document.fonts.check;
        document.fonts.check = function(font: string, text?: string) {
          // Always return true for fake fonts
          for (const f of fakeFonts) {
            if (font.includes(f)) return true;
          }
          return originalCheck.call(this, font, text);
        };
      }
      // Override CanvasRenderingContext2D.prototype.measureText
      if (typeof CanvasRenderingContext2D !== 'undefined') {
        const originalMeasureText = CanvasRenderingContext2D.prototype.measureText;
        CanvasRenderingContext2D.prototype.measureText = function(text: string) {
          const metrics = originalMeasureText.call(this, text);
          // Add subtle noise to width
          const variation = 1 + (Math.random() - 0.5) * 0.01;
          const modifiedMetrics = Object.create(TextMetrics.prototype);
          Object.assign(modifiedMetrics, metrics);
          Object.defineProperty(modifiedMetrics, 'width', {
            value: metrics.width * variation,
            writable: false,
            configurable: true
          });
          return modifiedMetrics;
        };
      }
    });
  }
} 