export class AkamaiChallenge {
  async detect(page: any): Promise<boolean> {
    // Detect Akamai bot manager challenge by DOM/text
    return await page.evaluate(() => {
      return !!(
        document.querySelector('iframe[src*="akamai"]') ||
        document.body.innerText.includes('Request unsuccessful. Incapsula incident ID') ||
        document.body.innerText.includes('Akamai Bot Manager')
      );
    });
  }
} 