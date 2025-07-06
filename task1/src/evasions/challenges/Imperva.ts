export class ImpervaChallenge {
  async detect(page: any): Promise<boolean> {
    // Detect Imperva bot protection by DOM/text
    return await page.evaluate(() => {
      return !!(
        document.body.innerText.includes('Incapsula incident ID') ||
        document.body.innerText.includes('Imperva')
      );
    });
  }
} 