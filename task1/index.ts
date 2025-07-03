import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
// @ts-ignore
import UserAgent from 'user-agents';
import { Browser, Page } from 'puppeteer';
import { writeFileSync } from 'fs';
import { join } from 'path';

declare global {
  interface Window {
    chrome: any;
  }
}

puppeteer.use(StealthPlugin());

export interface CloudflareBypassResult {
  success: boolean;
  cookies: any[];
  screenshot: string | null;
  url: string;
  error?: string;
  screenshotPath?: string; // New: path where screenshot was saved
}

export interface CloudflareBypassOptions {
  saveScreenshot?: boolean;
  screenshotPath?: string;
  screenshotName?: string;
}

export class CloudflareBypass {
  private browser: Browser | null = null;
  private page: Page | null = null;

  async launch(): Promise<void> {
    const userAgent = new UserAgent();

    this.browser = await puppeteer.launch({
      headless: false,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu',
        '--disable-features=VizDisplayCompositor',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-field-trial-config',
        '--disable-back-forward-cache',
        '--disable-ipc-flooding-protection',
        '--disable-hang-monitor',
        '--disable-prompt-on-repost',
        '--disable-sync',
        '--force-color-profile=srgb',
        '--metrics-recording-only',
        '--use-mock-keychain',
        '--disable-extensions',
        '--disable-plugins',
        '--disable-translate',
        '--disable-default-apps',
        '--no-default-browser-check',
        '--disable-web-security',
        '--allow-running-insecure-content',
        '--window-size=1920,1080',
        '--disable-software-rasterizer',
        '--disable-dev-tools',
        '--disable-logging',
        '--disable-log-destination',
        '--silence-debugger-extension-api',
        '--disable-extensions-http-throttling',
        '--disable-client-side-phishing-detection',
        '--disable-component-extensions-with-background-pages',
        '--disable-background-networking',
        '--disable-component-update',
        '--disable-domain-reliability',
        '--disable-features=TranslateUI',
        '--disable-background-mode',
        '--disable-ipc-flooding-protection',
        '--enable-automation',
        '--password-store=basic',
        '--use-mock-keychain'
      ],
      ignoreDefaultArgs: ['--enable-automation'],
      timeout: 60000,
    });

    this.page = await this.browser.newPage();

    await this.page.setUserAgent(userAgent.toString());

    await this.page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    });

    await this.page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
      });

      Object.defineProperty(navigator, 'plugins', {
        get: () => [1, 2, 3, 4, 5],
      });

      Object.defineProperty(navigator, 'languages', {
        get: () => ['en-US', 'en'],
      });

      (window as any).chrome = {
        runtime: {},
      };

      Object.defineProperty(navigator, 'permissions', {
        get: () => ({
          query: () => Promise.resolve({ state: 'granted' }),
        }),
      });
    });

    await this.page.setExtraHTTPHeaders({
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-US,en;q=0.9',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Upgrade-Insecure-Requests': '1',
    });
  }

  async bypassCloudflare(url: string, options: CloudflareBypassOptions = {}): Promise<CloudflareBypassResult> {
    try {
      if (!this.page || !this.browser) {
        await this.launch();
      }

      if (!this.page) {
        throw new Error('Failed to create page');
      }

      await this.page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 60000,
      });

      await this.randomDelay(2000, 4000);

      const isCloudflareChallenge = await this.page.evaluate(() => {
        return !!(
          document.querySelector('[data-cf-beacon]') ||
          document.querySelector('.cf-browser-verification') ||
          document.querySelector('#cf-wrapper') ||
          document.querySelector('.cf-checking-browser') ||
          document.title.includes('Just a moment') ||
          document.body.innerText.includes('Checking your browser') ||
          document.body.innerText.includes('DDoS protection')
        );
      });

      if (isCloudflareChallenge) {
        console.log('Cloudflare challenge detected, waiting...');

        await this.page.mouse.move(100, 100);
        await this.randomDelay(1000, 2000);
        await this.page.mouse.move(200, 200);

        await this.page.waitForFunction(
          () => {
            return !(
              document.querySelector('[data-cf-beacon]') ||
              document.querySelector('.cf-browser-verification') ||
              document.querySelector('#cf-wrapper') ||
              document.querySelector('.cf-checking-browser') ||
              document.title.includes('Just a moment') ||
              document.body.innerText.includes('Checking your browser') ||
              document.body.innerText.includes('DDoS protection')
            );
          },
          { timeout: 30000 }
        );

        await this.randomDelay(2000, 3000);
      }

      const cookies = await this.page.cookies();
      const screenshot = await this.page.screenshot({
        encoding: 'base64',
        fullPage: true,
      }) as string;

      const result: CloudflareBypassResult = {
        success: true,
        cookies,
        screenshot,
        url: this.page.url(),
      };
      if (options.saveScreenshot && screenshot) {
        const domain = new URL(url).hostname.replace('www.', '');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = options.screenshotName || `${domain}-${timestamp}.png`;
        const filePath = join(options.screenshotPath || '.', fileName);

        try {
          const buffer = Buffer.from(screenshot, 'base64');
          writeFileSync(filePath, buffer);
          result.screenshotPath = filePath;
          console.log(`📸 Screenshot saved to: ${filePath}`);
        } catch (saveError) {
          console.warn(`⚠️ Failed to save screenshot: ${saveError}`);
        }
      }

      return result;

    } catch (error) {
      return {
        success: false,
        cookies: [],
        screenshot: null,
        url,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async randomDelay(min: number, max: number): Promise<void> {
    const delay = Math.random() * (max - min) + min;
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  async close(): Promise<void> {
    if (this.page) {
      await this.page.close();
      this.page = null;
    }
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

export async function bypassCloudflareAndGetData(url: string, options: CloudflareBypassOptions = {}): Promise<CloudflareBypassResult> {
  const bypass = new CloudflareBypass();
  try {
    const result = await bypass.bypassCloudflare(url, options);
    await bypass.close();
    return result;
  } catch (error) {
    await bypass.close();
    throw error;
  }
}

export default bypassCloudflareAndGetData;
