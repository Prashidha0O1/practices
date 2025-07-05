import { connect } from 'puppeteer-real-browser';
import { writeFileSync } from 'fs';
import { join } from 'path';

export interface CloudflareBypassResult {
  success: boolean;
  cookies: any[];
  screenshot: string | null;
  url: string;
  error?: string;
  screenshotPath?: string;
}

export interface CloudflareBypassOptions {
  saveScreenshot?: boolean;
  screenshotPath?: string;
  screenshotName?: string;
  headless?: boolean;
  turnstile?: boolean;
  proxy?: {
    host: string;
    port: string;
    username?: string;
    password?: string;
  };
}

class CloudflareBypass {
  private browser: any = null;
  private page: any = null;

  async launch(options: CloudflareBypassOptions = {}): Promise<void> {
    try {
      const proxyConfig = options.proxy ? {
        host: options.proxy.host,
        port: parseInt(options.proxy.port, 10),
        username: options.proxy.username,
        password: options.proxy.password
      } : undefined;

      const proxyArg = options.proxy
          ? [`--proxy-server=${options.proxy.host}:${options.proxy.port}`]
          : [];

          const { browser, page } = await connect({
            headless: options.headless ?? false,
            args: proxyArg,
            customConfig: {},
            turnstile: options.turnstile ?? true,
            connectOption: {},
            disableXvfb: false,
            ignoreAllFlags: false,
            proxy: options.proxy ? {
              host: options.proxy.host,
              port: parseInt(options.proxy.port, 10),
              username: options.proxy.username,
              password: options.proxy.password
            } : undefined
          });

      this.browser = browser;
      this.page = page;

      if (this.page) {
        await this.page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
      }

      console.log('✅ Browser launched using puppeteer-real-browser');
    } catch (error) {
      console.error('❌ Failed to launch browser:', error);
      throw error;
    }
  }

  async bypassCloudflare(url: string, options: CloudflareBypassOptions = {}): Promise<CloudflareBypassResult> {
    try {
      if (!this.page || !this.browser) {
        await this.launch(options);
      }

      if (!this.page) throw new Error('Failed to create page');

      console.log(`🌐 Navigating to: ${url}`);
      await this.page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 60000,
      });

      await this.randomDelay(3000, 5000);

      // Challenge detection without hardcoding selectors
      const isChallenge = await this.detectCloudflareChallenge();

      if (isChallenge) {
        console.log('🛡️ Cloudflare challenge detected...waiting for resolution');

        await this.page.waitForFunction(() => {
          const bodyText = document.body?.innerText || '';
          return !(
            document.querySelector('[data-cf-beacon]') ||
            document.querySelector('#cf-wrapper') ||
            document.querySelector('iframe[src*="turnstile"]') ||
            document.title.includes('Just a moment') ||
            bodyText.includes('Checking your browser') ||
            bodyText.includes('DDoS protection') ||
            bodyText.includes('Please wait while we verify')
          );
        }, { timeout: 45000 });

        console.log('✅ Challenge resolved');
        await this.randomDelay(2000, 3000);
      }

      const cookies = await this.page.cookies();
      console.log(`🍪 Retrieved ${cookies.length} cookies`);

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
          writeFileSync(filePath, Buffer.from(screenshot, 'base64'));
          result.screenshotPath = filePath;
          console.log(`📸 Screenshot saved to: ${filePath}`);
        } catch (saveError) {
          console.warn(`⚠️ Failed to save screenshot: ${saveError}`);
        }
      }

      console.log(`✅ Successfully bypassed: ${result.url}`);
      return result;

    } catch (error) {
      console.error(`❌ Bypass failed: ${error}`);
      return {
        success: false,
        cookies: [],
        screenshot: null,
        url,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async detectCloudflareChallenge(): Promise<boolean> {
    if (!this.page) return false;

    return await this.page.evaluate(() => {
      const bodyText = document.body?.innerText || '';
      return !!(
        document.querySelector('[data-cf-beacon]') ||
        document.querySelector('#cf-wrapper') ||
        document.querySelector('iframe[src*="turnstile"]') ||
        document.title.includes('Just a moment') ||
        bodyText.includes('Checking your browser') ||
        bodyText.includes('DDoS protection') ||
        bodyText.includes('Please wait while we verify')
      );
    });
  }

  private async randomDelay(min: number, max: number): Promise<void> {
    const delay = Math.random() * (max - min) + min;
    return new Promise(resolve => setTimeout(resolve, delay));
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
    console.log('🔒 Browser closed');
  }
}

async function bypassCloudflareAndGetData(
  url: string,
  options: CloudflareBypassOptions = {}
): Promise<CloudflareBypassResult> {
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

if (require.main === module) {
  (async () => {
    const result = await bypassCloudflareAndGetData('https://www.carousell.com', {
      saveScreenshot: true,
      screenshotPath: './screenshots',
      screenshotName: 'carousell-test.png',
      headless: false,
      proxy: {
        host: '45.79.120.140',
        port: '18888'
      }
    });

    console.log('Final Result:', result);
  })();
}
