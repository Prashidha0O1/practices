import { CloudflareBypass, BrowserResult, humanizePage, saveCookies, loadCookies } from '../index';
import { existsSync, unlinkSync } from 'fs';
import fs from 'fs/promises';
import { resolve } from 'path';
import { Page } from 'puppeteer';

// Mock puppeteer-real-browser to avoid launching real browsers during tests
jest.mock('puppeteer-real-browser', () => ({
  connect: jest.fn(),
}));

describe('CloudflareBypass', () => {
  const testUrl = 'https://www.crocs.com/';
  const screenshotPath = 'crocs_screenshot.png';
  const errorScreenshotPath = 'error_screenshot.png';
  const cookiesPath = 'cookies.json';

  const mockPage = {
    setUserAgent: jest.fn(),
    setExtraHTTPHeaders: jest.fn(),
    goto: jest.fn().mockResolvedValue(null),
    waitForResponse: jest.fn().mockResolvedValue(null),
    waitForNavigation: jest.fn().mockResolvedValue(null),
    screenshot: jest.fn().mockResolvedValue(null),
    cookies: jest.fn().mockResolvedValue([{ name: 'test', value: 'value' }]),
    title: jest.fn().mockResolvedValue('Example Domain'),
    url: jest.fn().mockResolvedValue(testUrl),
    setViewport: jest.fn(),
    mouse: { move: jest.fn() },
    evaluate: jest.fn(),
    setCookie: jest.fn(),
  } as unknown as Page;

  const mockBrowser = {
    close: jest.fn().mockResolvedValue(null),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    [screenshotPath, errorScreenshotPath, cookiesPath].forEach(file => {
      if (existsSync(file)) unlinkSync(file);
    });
    const connectMock = require('puppeteer-real-browser').connect;
    connectMock.mockResolvedValue({ browser: mockBrowser, page: mockPage });
    mockPage.waitForResponse = jest.fn().mockResolvedValue(null);
  });

  afterEach(() => {
    // Clean up files
    [screenshotPath, errorScreenshotPath, cookiesPath].forEach(file => {
      if (existsSync(file)) unlinkSync(file);
    });
  });

  test('should navigate to URL, save PNG screenshot, and save cookies', async () => {
    const result: BrowserResult = await CloudflareBypass(testUrl);
    expect(mockPage.screenshot).toHaveBeenCalledWith({ path: screenshotPath, fullPage: true });
    expect(result.screenshotPath).toBe(screenshotPath);

    expect(existsSync(cookiesPath)).toBe(true);
    const cookiesData = JSON.parse(await fs.readFile(cookiesPath, 'utf-8'));
    expect(cookiesData).toEqual([{ name: 'test', value: 'value' }]);
    expect(result.cookies).toEqual([{ name: 'test', value: 'value' }]);

    expect(result.title).toBe('Example Domain');
    expect(result.url).toBe(testUrl);

    expect(mockPage.setUserAgent).toHaveBeenCalled();
    expect(mockPage.setExtraHTTPHeaders).toHaveBeenCalled();
    expect(mockPage.setViewport).toHaveBeenCalled();
    expect(mockPage.mouse.move).toHaveBeenCalled();
    expect(mockPage.evaluate).toHaveBeenCalled();
  });

  test('should load cookies if they exist', async () => {
    await fs.writeFile(cookiesPath, JSON.stringify([{ name: 'test', value: 'value' }], null, 2));
    await loadCookies(mockPage, cookiesPath);
    expect(mockPage.setCookie).toHaveBeenCalledWith({ name: 'test', value: 'value' });
  });

  test('should handle navigation errors and save error screenshot', async () => {
    (mockPage.goto as jest.Mock).mockRejectedValueOnce(new Error('Navigation failed'));
    await expect(CloudflareBypass(testUrl)).rejects.toThrow('Navigation failed');
    expect(mockPage.screenshot).toHaveBeenCalledWith({ path: errorScreenshotPath, fullPage: true });
  });

  test('should handle HTTP 429 error and retry', async () => {
    jest.useFakeTimers();
    mockPage.waitForResponse = jest.fn().mockResolvedValueOnce({ status: () => 429 });
    (mockPage.goto as jest.Mock).mockResolvedValueOnce(null).mockResolvedValueOnce(null); 
    const promise = CloudflareBypass(testUrl);

    jest.runAllTimers();
    const result = await promise;
    expect((mockPage.goto as jest.Mock).mock.calls.length).toBe(2); 
    expect(result.screenshotPath).toBe(screenshotPath);
    jest.useRealTimers();
  });

  test('should close browser properly', async () => {
    await CloudflareBypass(testUrl);
    expect(mockBrowser.close).toHaveBeenCalled();
  });
});