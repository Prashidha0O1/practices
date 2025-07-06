export class CaptchaChallenge {
  async detect(page: any): Promise<boolean> {
    // Detect common captchas by DOM
    return await page.evaluate(() => {
      return !!(
        document.querySelector('iframe[src*="recaptcha"]') ||
        document.querySelector('iframe[src*="hcaptcha"]') ||
        document.querySelector('iframe[src*="funcaptcha"]') ||
        document.querySelector('input[name="captcha"]')
      );
    });
  }
} 