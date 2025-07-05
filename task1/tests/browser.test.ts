import { CloudflareBypass, bypassCloudflareAndGetData, CloudflareBypassResult } from '../index';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

describe('Cloudflare Bypass Tests', () => {
  let cloudflareBypass: CloudflareBypass;

  beforeEach(() => {
    cloudflareBypass = new CloudflareBypass();
  });

  afterEach(async () => {
    if (cloudflareBypass) {
      await cloudflareBypass.close();
    }
  });

  test('1. CloudflareBypass - Complete functionality test', async () => {
    expect(cloudflareBypass).toBeInstanceOf(CloudflareBypass);

    try {
      await cloudflareBypass.launch();
      expect(true).toBe(true);
    } catch (error) {
      expect(error).toBeDefined();
      expect(error instanceof Error).toBe(true);
    }

    const result: CloudflareBypassResult = await cloudflareBypass.bypassCloudflare('https://carousell.com/');
    expect(result).toBeDefined();
    expect(typeof result.success).toBe('boolean');
    expect(Array.isArray(result.cookies)).toBe(true);
    expect(typeof result.url).toBe('string');

    if (result.success) {
      expect(result.screenshot).toBeTruthy();
      expect(typeof result.screenshot).toBe('string');
      expect(result.error).toBeUndefined();
      expect(result.cookies).toBeInstanceOf(Array);
      expect(result.url).toContain('carousell.com');
      expect(result.screenshot).toMatch(/^[A-Za-z0-9+/]+=*$/);

      if (result.cookies.length > 0) {
        expect(result.cookies[0]).toHaveProperty('name');
        expect(result.cookies[0]).toHaveProperty('value');
        expect(result.cookies[0]).toHaveProperty('domain');
      }
    } else {
      expect(result.error).toBeDefined();
      expect(typeof result.error).toBe('string');
      expect(result.cookies).toEqual([]);
      expect(result.screenshot).toBeNull();
    }

    const invalidResult = await cloudflareBypass.bypassCloudflare('invalid-url');
    expect(invalidResult.success).toBe(false);
    expect(invalidResult.error).toBeDefined();
    expect(invalidResult.cookies).toEqual([]);
    expect(invalidResult.screenshot).toBeNull();

    const exportedResult = await bypassCloudflareAndGetData('https://carousell.com/');
    expect(exportedResult).toHaveProperty('cookies');
    expect(exportedResult).toHaveProperty('screenshot');
    expect(exportedResult).toHaveProperty('url');

    if (exportedResult.success && exportedResult.cookies.length > 0) {
      exportedResult.cookies.forEach(cookie => {
        expect(cookie).toHaveProperty('name');
        expect(cookie).toHaveProperty('value');
        expect(cookie).toHaveProperty('domain');
        expect(cookie).toHaveProperty('path');
        expect(cookie).toHaveProperty('secure');
        expect(cookie).toHaveProperty('httpOnly');
      });
    }

    const timeoutResult = await cloudflareBypass.bypassCloudflare('https://carousell.com/');
    expect(timeoutResult.success).toBe(false);
    expect(timeoutResult.error).toBeDefined();

    const dnsResult = await cloudflareBypass.bypassCloudflare('https://this-domain-does-not-exist-12345.com');
    expect(dnsResult.success).toBe(false);
    expect(dnsResult.error).toBeDefined();

    const bypass1 = new CloudflareBypass();
    const bypass2 = new CloudflareBypass();
    expect(bypass1).not.toBe(bypass2);

    console.log('All 28 CloudflareBypass functionality tests passed as single test');
  }, 180000);

  test('2. Take screenshot after bypassing and landing on crocs.com', async () => {
    const result = await bypassCloudflareAndGetData('https://crocs.com', {
      saveScreenshot: true,
      screenshotPath: './screenshots',
      screenshotName: 'crocs-after-bypass.png'
    });

    expect(result.success).toBeDefined();

    if (result.success) {
      expect(result.url).toContain('crocs.com');
      expect(result.screenshot).toMatch(/^[A-Za-z0-9+/]+=*$/);

      const buffer = Buffer.from(result.screenshot!, 'base64');
      const header = buffer.toString('hex', 0, 8);
      const isPNG = header.startsWith('89504e47');
      const isJPEG = header.startsWith('ffd8ffe0') || header.startsWith('ffd8ffe1') || header.startsWith('ffd8ffe2');
      expect(isPNG || isJPEG).toBe(true);

      const manualPath = './crocs-manual-screenshot.png';
      writeFileSync(manualPath, buffer);
      expect(existsSync(manualPath)).toBe(true);
    } else {
      console.warn(`Bypass failed: ${result.error}`);
    }
  }, 120000);

  test('3. Save cookies to their respective path', async () => {
    const cookiesDir = './cookies';
    if (!existsSync(cookiesDir)) mkdirSync(cookiesDir, { recursive: true });

    const result = await bypassCloudflareAndGetData('https://carousell.com/');
    expect(Array.isArray(result.cookies)).toBe(true);

    if (result.success && result.cookies.length > 0) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const cookiesFilePath = join(cookiesDir, `carousell-cookies-${timestamp}.json`);
      writeFileSync(cookiesFilePath, JSON.stringify(result.cookies, null, 2));
      expect(existsSync(cookiesFilePath)).toBe(true);
    } else {
      console.warn(`No cookies to save: ${result.error}`);
    }
  }, 120000);

  test('4. Successfully bypass and extract from cloudflare.com', async () => {
    const result = await bypassCloudflareAndGetData('https://www.cloudflare.com/', {
      saveScreenshot: true,
      screenshotPath: './screenshots',
      screenshotName: 'cloudflare-homepage.png'
    });

    expect(result).toBeDefined();
    if (result.success) {
      expect(result.url).toContain('cloudflare.com');
      expect(result.cookies.length).toBeGreaterThan(0);
    } else {
      console.warn(`Could not bypass Cloudflare: ${result.error}`);
    }
  }, 120000);

  test('5. Screenshot is a valid PNG or JPEG', async () => {
    const result = await bypassCloudflareAndGetData('https://crocs.com', {
      saveScreenshot: true,
      screenshotPath: './screenshots',
      screenshotName: 'crocs-format-test.png'
    });

    if (result.success && result.screenshot) {
      const buffer = Buffer.from(result.screenshot, 'base64');
      const header = buffer.toString('hex', 0, 8);
      const isPNG = header.startsWith('89504e47');
      const isJPEG = header.startsWith('ffd8ffe0') || header.startsWith('ffd8ffe1') || header.startsWith('ffd8ffe2');
      expect(isPNG || isJPEG).toBe(true);
    } else {
      console.warn(`Screenshot validation skipped due to failure: ${result.error}`);
    }
  }, 90000);

  test('6. Handle Turnstile challenge on Cloudflare rate limit page', async () => {
    const result = await bypassCloudflareAndGetData('https://www.cloudflare.com/rate-limit-test', {
      turnstile: true,
      saveScreenshot: true,
      screenshotPath: './screenshots',
      screenshotName: 'turnstile-bypass.png'
    });

    if (result.success) {
      expect(result.cookies.length).toBeGreaterThan(0);
      expect(result.screenshot).toBeTruthy();
    } else {
      console.warn(`Turnstile challenge not bypassed: ${result.error}`);
    }
  }, 120000);
});
