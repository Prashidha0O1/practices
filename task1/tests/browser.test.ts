import fs from 'fs';
import path from 'path';

jest.mock('puppeteer-real-browser', () => ({
  connect: jest.fn(),
}));

import { connect } from 'puppeteer-real-browser';
import { Page, Browser } from 'puppeteer';
import { CloudflareBypass } from '../index';

describe('CloudflareBypass', () => {
  const screenshotPath = path.resolve('crocs_screenshot.png');

  let mockPage: Partial<Page>;
  let mockBrowser: Partial<Browser>;

  beforeEach(() => {
    if (fs.existsSync(screenshotPath)) {
      fs.unlinkSync(screenshotPath);
    }

    mockPage = {
      setUserAgent: jest.fn(),
      setExtraHTTPHeaders: jest.fn(),
      goto: jest.fn().mockResolvedValue(undefined),
      waitForResponse: jest.fn().mockResolvedValue(null),
      waitForNavigation: jest.fn().mockResolvedValue(undefined),
      cookies: jest.fn().mockResolvedValue([]),
      title: jest.fn().mockResolvedValue('Mock Crocs Page'),
      screenshot: jest.fn().mockImplementation(({ path }) => {
        fs.writeFileSync(path, 'fake image content');
      }),
      url: jest.fn().mockReturnValue('https://www.crocs.com/'),
      setViewport: jest.fn(),
      mouse: {
        move: jest.fn(),
        click: jest.fn(),
        down: jest.fn(),
        up: jest.fn(),
        wheel: jest.fn(),
        drag: jest.fn(),
        dragEnter: jest.fn(),
        dragOver: jest.fn(),
        dragAndDrop: jest.fn(),
        drop: jest.fn(),
        reset: jest.fn(),
      },
      evaluate: jest.fn(),
      setCookie: jest.fn(),
    };

    mockBrowser = {
      close: jest.fn(),
    };

    (connect as jest.Mock).mockResolvedValue({
      browser: mockBrowser,
      page: mockPage,
    });
  });

  afterAll(() => {
    if (fs.existsSync(screenshotPath)) {
      fs.unlinkSync(screenshotPath);
    }
  });

  it('should create a screenshot file', async () => {
    await CloudflareBypass();
    expect(fs.existsSync(screenshotPath)).toBe(true);
  });
});
