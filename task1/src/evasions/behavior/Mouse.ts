export class MouseBehavior {
  async simulateHumanMouse(page: any, path: {x: number, y: number}[]): Promise<void> {
    for (const point of path) {
      await page.mouse.move(point.x, point.y, { steps: Math.floor(Math.random() * 5) + 2 });
      await page.waitForTimeout(Math.random() * 100 + 50);
    }
  }
} 