export class CloudflareChallenge {
  async detectAndWait(page: any, timeout: number = 45000): Promise<boolean> {
    // Detect Cloudflare challenge by DOM/text
    const isChallenge = await page.evaluate(() => {
      const bodyText = document.body?.innerText || '';
      return !!(
        document.querySelector('[data-cf-beacon]') ||
        document.querySelector('#cf-wrapper') ||
        document.querySelector('iframe[src*="turnstile"]') ||
        document.title.includes('Just a moment') ||
        bodyText.includes('Checking your browser') ||
        bodyText.includes('DDoS protection') ||
        bodyText.includes('Please wait while we verify')
      );
    });
    if (isChallenge) {
      await page.waitForFunction(() => {
        const bodyText = document.body?.innerText || '';
        return !(
          document.querySelector('[data-cf-beacon]') ||
          document.querySelector('#cf-wrapper') ||
          document.querySelector('iframe[src*="turnstile"]') ||
          document.title.includes('Just a moment') ||
          bodyText.includes('Checking your browser') ||
          bodyText.includes('DDoS protection') ||
          bodyText.includes('Please wait while we verify')
        );
      }, { timeout });
      return true;
    }
    return false;
  }
} 