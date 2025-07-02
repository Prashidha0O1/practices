import { connect } from 'puppeteer-real-browser';
import { Browser, Page } from 'puppeteer';
import fs from 'fs/promises';

interface RealBrowserResponse {
  browser: Browser;
  page: Page;
}

export async function humanizePage(page: Page): Promise<void> {
  // Simulate human-like mouse movements
  await page.mouse.move(Math.random() * 800, Math.random() * 600, { steps: 10 });
  await page.mouse.move(Math.random() * 800, Math.random() * 600, { steps: 10 });

  // Simulate scrolling
  await page.evaluate(() => window.scrollBy(0, Math.random() * 500));
  await page.setViewport({
    width: 1366 + Math.floor(Math.random() * 100),
    height: 768 + Math.floor(Math.random() * 100),
  });
}

export async function saveCookies(page: Page, path: string): Promise<void> {
  const cookies = await page.cookies();
  await fs.writeFile(path, JSON.stringify(cookies, null, 2));
}

export async function loadCookies(page: Page, path: string): Promise<void> {
  try {
    const cookiesString = await fs.readFile(path, 'utf-8');
    const cookies = JSON.parse(cookiesString);
    await page.setCookie(...cookies);
  } catch (error) {
    console.log('No cookies found or error loading cookies:', error);
  }
}

export async function CloudflareBypass(): Promise<void> {
  // Use type assertion to 'unknown' first to resolve type incompatibility
  const { browser, page } = (await connect({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--lang=en-US',
    ],
    customConfig: {},
    turnstile: true, // Enable Turnstile handling
    connectOption: {},

    disableXvfb: false,
    ignoreAllFlags: false,
    // Uncomment and configure proxy if needed
    // proxy: {
    //   host: '<proxy-host>',
    //   port: '<proxy-port>',
    //   username: '<proxy-username>',
    //   password: '<proxy-password>',
    // },
  }) as unknown) as RealBrowserResponse;
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );
  await page.setExtraHTTPHeaders({
    'accept-language': 'en-US,en;q=0.9',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  });
  await loadCookies(page, 'cookies.json');

  try {
    console.log('Navigating to Crocs website...');
    await page.goto('https://www.crocs.com/', {
      waitUntil: 'networkidle2',
      timeout: 60000,
    });
    await humanizePage(page);

    // Check for 429 error
    const response = await page.waitForResponse((res) => res.status() === 429, { timeout: 10000 }).catch(() => null);
    if (response) {
      console.log('HTTP 429 detected, waiting and retrying...');
      await new Promise((resolve) => setTimeout(resolve, 30000)); // Wait 30 seconds
      await page.goto('https://www.crocs.com/', { waitUntil: 'networkidle2', timeout: 60000 });
    }

    // Wait for page to fully load
    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 30000 }).catch(() => {
      console.log('Navigation timeout, proceeding anyway...');
    });


    await saveCookies(page, 'cookies.json');
    const title = await page.title();
    console.log('Page title:', title);
    await page.screenshot({ path: 'crocs_screenshot.png', fullPage: true });
    console.log('Screenshot saved as crocs_screenshot.png');
    const cookies = await page.cookies();
    console.log('Cookies:', JSON.stringify(cookies, null, 2));

    console.log('Successfully accessed Crocs website!');
    console.log('Current URL:', page.url());
  } catch (error) {
    console.error('Error:', error);
    await page.screenshot({ path: 'error_screenshot.png', fullPage: true });
    console.log('Error screenshot saved as error_screenshot.png');
  } finally {
    await browser.close();
  }
}

(async () => {
  const maxRetries = 3;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await CloudflareBypass();
      break;
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);
      if (attempt === maxRetries) {
        console.error('Max retries reached. Exiting.');
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 60000)); 
    }
  }
})();