import { connect } from 'puppeteer-real-browser';
import { Browser, Page } from 'puppeteer';
import fs from 'fs/promises';

// Interface to type the response from connect
interface RealBrowserResponse {
  browser: Browser;
  page: Page;
}

export interface BrowserResult {
  screenshotPath: string;
  cookies: any[];
  title: string;
  url: string;
}

export async function humanizePage(page: Page): Promise<void> {
  await page.mouse.move(Math.random() * 800, Math.random() * 600, { steps: 10 });
  await page.mouse.move(Math.random() * 800, Math.random() * 600, { steps: 10 });

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

export async function CloudflareBypass(url: string): Promise<BrowserResult> {
  const screenshotPath = 'crocs_screenshot.png';
  const errorScreenshotPath = 'error_screenshot.png';
  const cookiesPath = 'cookies.json';
  const { browser, page } = (await connect({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--lang=en-US',
    ],
    customConfig: {},
    turnstile: true,
    connectOption: {},
    disableXvfb: false,
    ignoreAllFlags: false,
  }) as unknown) as RealBrowserResponse;
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );
  await page.setExtraHTTPHeaders({
    'accept-language': 'en-US,en;q=0.9',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  });
  await loadCookies(page, cookiesPath);

  try {
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 60000,
    });
    await humanizePage(page);

    // Check for 429 error
    const response = await page.waitForResponse((res) => res.status() === 429, { timeout: 10000 }).catch(() => null);
    if (response) {
      await new Promise((resolve) => setTimeout(resolve, 30000));
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    }

    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 30000 }).catch(() => {});
    await saveCookies(page, cookiesPath);
    const title = await page.title();
    await page.screenshot({ path: screenshotPath, fullPage: true });
    const cookies = await page.cookies();
    const result: BrowserResult = {
      screenshotPath,
      cookies,
      title,
      url: await page.url(),
    };
    await browser.close();
    return result;
  } catch (error) {
    await page.screenshot({ path: errorScreenshotPath, fullPage: true });
    await browser.close();
    throw error;
  }
}