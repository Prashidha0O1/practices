export class TurnstileBypass {
  async tryBypass(page: any, timeout: number = 10000): Promise<boolean> {
    try {
      // Try to find the Turnstile response input
      const elements = await page.$$('[name="cf-turnstile-response"]');
      if (elements.length > 0) {
        for (const element of elements) {
          try {
            const parentElement = await element.evaluateHandle((el: any) => el.parentElement);
            const box = await parentElement.boundingBox();
            if (box) {
              let x = box.x + 30;
              let y = box.y + box.height / 2;
              await page.mouse.move(x, y, { steps: 5 });
              await page.waitForTimeout(Math.random() * 200 + 100);
              await page.mouse.click(x, y);
              await page.waitForTimeout(Math.random() * 500 + 200);
            }
          } catch (err) {}
        }
        return true;
      }

      // Heuristic: scan for divs with Turnstile-like dimensions
      const coordinates = await page.evaluate(() => {
        let coords: any[] = [];
        document.querySelectorAll('div').forEach(item => {
          try {
            let rect = item.getBoundingClientRect();
            let style = window.getComputedStyle(item);
            if (
              style.margin === '0px' &&
              style.padding === '0px' &&
              rect.width > 290 && rect.width <= 310 &&
              !item.querySelector('*')
            ) {
              coords.push({ x: rect.x, y: rect.y, w: rect.width, h: rect.height });
            }
          } catch {}
        });
        return coords;
      });

      for (const item of coordinates) {
        let x = item.x + 30;
        let y = item.y + item.h / 2;
        await page.mouse.move(x, y, { steps: 5 });
        await page.waitForTimeout(Math.random() * 200 + 100);
        await page.mouse.click(x, y);
        await page.waitForTimeout(Math.random() * 500 + 200);
      }

      return coordinates.length > 0;
    } catch (err) {
      return false;
    }
  }
} 