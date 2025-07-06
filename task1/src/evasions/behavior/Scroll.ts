export class ScrollBehavior {
  async simulateHumanScroll(page: any, scrolls: number = 5): Promise<void> {
    for (let i = 0; i < scrolls; i++) {
      await page.evaluate(() => {
        window.scrollBy({
          top: Math.random() * 300 + 100,
          left: 0,
          behavior: 'smooth'
        });
      });
      await page.waitForTimeout(Math.random() * 800 + 400);
    }
  }
} 