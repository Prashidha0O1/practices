import puppeteer, { Browser, Page, LaunchOptions } from 'puppeteer';
import { EvasionConfig, DeviceProfile } from '../types';

export class BrowserController {
  private browser: Browser | null = null;
  private page: Page | null = null;

  async launch(config: EvasionConfig): Promise<void> {
    const launchOptions: LaunchOptions = {
      headless: config.headless ?? false,
      args: [],
    };
    if (config.proxy) {
      launchOptions.args!.push(`--proxy-server=${config.proxy.host}:${config.proxy.port}`);
    }
    this.browser = await puppeteer.launch(launchOptions);
    this.page = await this.browser.newPage();
    await this.applyConfig(config);
  }

  async applyConfig(config: EvasionConfig): Promise<void> {
    if (!this.page) return;
    const profile: DeviceProfile | undefined = config.deviceProfile;
    if (profile) {
      await this.page.setUserAgent(profile.userAgent);
      await this.page.setViewport(profile.viewport);
    } else if (config.userAgent) {
      await this.page.setUserAgent(config.userAgent);
    }
    if (config.viewport) {
      await this.page.setViewport(config.viewport);
    }
    if (config.customHeaders) {
      await this.page.setExtraHTTPHeaders(config.customHeaders);
    }
  }

  getPage(): Page | null {
    return this.page;
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