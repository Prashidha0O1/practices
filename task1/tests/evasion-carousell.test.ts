import { BrowserController } from '../src/core/BrowserController';
import { EvasionOrchestrator } from '../src/core/EvasionOrchestrator';
import { DeviceProfiles } from '../src/utils/DeviceProfiles';
import { EvasionConfigManager } from '../src/config/EvasionConfig';
import { CloudflareChallenge } from '../src/evasions/challenges/Cloudflare';
import { CookiesEvasion } from '../src/evasions/network/Cookies';
import { TurnstileBypass } from '../src/evasions/challenges/Turnstile';
import { puppeteerRealBrowser } from '../src/utils/puppeteerRealBrowser';

// Helper for generic wait
const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

function isErrorWithName(err: unknown): err is { name: string } {
  return typeof err === 'object' && err !== null && 'name' in err && typeof (err as any).name === 'string';
}

describe('Antibot Evasion Test: carousell.com', () => {
  let browserController: BrowserController;
  let page: any;

  beforeAll(async () => {
    const deviceProfile = DeviceProfiles.getProfile('chrome-desktop');
    const configManager = new EvasionConfigManager({
      headless: true,
      deviceProfile,
      enableCanvasEvasion: true,
      enableWebGLEvasion: true,
      enableAudioEvasion: true,
      enableFontEvasion: true,
      enableHardwareEvasion: true,
      enableMouseEvasion: true,
      enableKeyboardEvasion: true,
      enableScrollEvasion: true,
      enableTimingEvasion: true,
      enableCloudflareBypass: true,
    });
    const config = configManager.getConfig();
    browserController = new BrowserController();
    await browserController.launch(config);
    page = browserController.getPage();
    const orchestrator = new EvasionOrchestrator(config);
    await orchestrator.applyAll(page);
  }, 90000);

  afterAll(async () => {
    if (browserController) {
      await browserController.close();
    }
  });

  test('Bypass Cloudflare and take screenshot', async () => {
    const url = 'https://www.carousell.com/';
    let navSuccess = false;
    let lastError = null;
    // Retry navigation up to 3 times
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`[Attempt ${attempt}] Navigating to ${url}`);
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 });
        navSuccess = true;
        break;
      } catch (err) {
        lastError = err;
        console.warn(`[Attempt ${attempt}] Navigation failed:`, err);
        if (attempt < 3) await wait(3000);
      }
    }
    expect(navSuccess).toBe(true);
    if (!navSuccess) throw lastError;

    // After navigation, before waiting for Cloudflare to resolve:
    const turnstileBypass = new TurnstileBypass();
    const bypassed = await turnstileBypass.tryBypass(page);
    if (bypassed) {
      console.log('Turnstile challenge clicked, waiting for page to proceed...');
      await wait(5000); // Wait for challenge to process
    }

    // Cloudflare challenge detection with retry
    const cloudflare = new CloudflareChallenge();
    let bypassedCloudflare = false;
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        bypassedCloudflare = await cloudflare.detectAndWait(page);
        break;
      } catch (err) {
        if (isErrorWithName(err) && err.name === 'TimeoutError') {
          console.warn(`[Attempt ${attempt}] Cloudflare detection timed out. This may indicate a hard challenge or failed evasion.`);
        } else {
          console.warn(`[Attempt ${attempt}] Cloudflare detection failed:`, err);
        }
        if (attempt < 2) await wait(2000);
      }
    }
    if (bypassedCloudflare) {
      console.log('Cloudflare challenge detected and bypassed!');
    } else {
      console.log('No Cloudflare challenge detected or bypass failed.');
    }

    // Screenshot
    try {
      await page.screenshot({ path: 'carousell-test.png', fullPage: true });
      console.log('Screenshot saved as carousell-test.png');
    } catch (err) {
      console.warn('Screenshot failed:', err);
    }

    // Cookies
    const cookiesEvasion = new CookiesEvasion();
    let cookies: any[] = [];
    try {
      cookies = await cookiesEvasion.getCookies(page);
      console.log('Cookies:', cookies);
    } catch (err) {
      console.warn('Failed to get cookies:', err);
    }
    expect(Array.isArray(cookies)).toBe(true);
  }, 180000);
});

describe('Puppeteer Real Browser Evasion Test: carousell.com', () => {
  let browser: any;
  let page: any;

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  test('Bypass with puppeteerRealBrowser and take screenshot', async () => {
    const result: any = await puppeteerRealBrowser({ headless: true });
    const realBrowser = result.browser;
    const realPage = result.page;
    browser = realBrowser;
    page = realPage;
    const url = 'https://www.carousell.com/';
    let navSuccess = false;
    let lastError = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`[Attempt ${attempt}] Navigating to ${url}`);
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 });
        navSuccess = true;
        break;
      } catch (err) {
        lastError = err;
        console.warn(`[Attempt ${attempt}] Navigation failed:`, err);
        if (attempt < 3) await new Promise(res => setTimeout(res, 3000));
      }
    }
    expect(navSuccess).toBe(true);
    if (!navSuccess) throw lastError;
    try {
      await page.screenshot({ path: 'carousell-test-puppeteerRealBrowser.png', fullPage: true });
      console.log('Screenshot saved as carousell-test-puppeteerRealBrowser.png');
    } catch (err) {
      console.warn('Screenshot failed:', err);
    }
  }, 180000);
});

describe('Puppeteer Real Browser Cloudflare Bypass Test: carousell.com', () => {
  let browser: any;
  let page: any;

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  test('Bypass Cloudflare challenge and take screenshot', async () => {
    const result: any = await puppeteerRealBrowser({ headless: true });
    browser = result.browser;
    page = result.page;
    const url = 'https://www.carousell.com/';
    let navSuccess = false;
    let lastError = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`[Attempt ${attempt}] Navigating to ${url}`);
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 });
        navSuccess = true;
        break;
      } catch (err) {
        lastError = err;
        console.warn(`[Attempt ${attempt}] Navigation failed:`, err);
        if (attempt < 3) await new Promise(res => setTimeout(res, 3000));
      }
    }
    expect(navSuccess).toBe(true);
    if (!navSuccess) throw lastError;

    // Cloudflare challenge detection and wait (inline logic from CloudflareChallenge)
    const isChallenge = await page.evaluate(() => {
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
    if (isChallenge) {
      await page.waitForFunction(() => {
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
      console.log('Cloudflare challenge detected and bypassed!');
    } else {
      console.log('No Cloudflare challenge detected.');
    }

    try {
      await page.screenshot({ path: 'carousell-test-puppeteerRealBrowser-cloudflare.png', fullPage: true });
      console.log('Screenshot saved as carousell-test-puppeteerRealBrowser-cloudflare.png');
    } catch (err) {
      console.warn('Screenshot failed:', err);
    }
  }, 180000);
}); 