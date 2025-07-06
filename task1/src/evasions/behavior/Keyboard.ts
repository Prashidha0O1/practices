export class KeyboardBehavior {
  async typeLikeHuman(page: any, text: string, selector: string): Promise<void> {
    await page.focus(selector);
    for (const char of text) {
      await page.keyboard.type(char);
      await page.waitForTimeout(Math.random() * 150 + 50);
    }
  }
} 