export class HardwareFingerprint {
  async injectHardwareEvasion(
    page: any,
    options?: { hardwareConcurrency?: number; deviceMemory?: number }
  ): Promise<void> {
    const { hardwareConcurrency = 8, deviceMemory = 8 } = options || {};
    await page.evaluateOnNewDocument(
      (hardwareConcurrency: number, deviceMemory: number) => {
        Object.defineProperty(navigator, 'hardwareConcurrency', {
          get: () => hardwareConcurrency,
          configurable: true
        });
      Object.defineProperty(navigator, 'deviceMemory', {
        get: () => deviceMemory,
        configurable: true
      });
    }, hardwareConcurrency, deviceMemory);
  }
} 