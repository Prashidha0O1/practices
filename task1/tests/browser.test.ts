import fs from 'fs';
import path from 'path';
import { CloudflareBypass } from '../index';

describe('CloudflareBypass', () => {
  const screenshotPath = path.resolve('crocs_screenshot.png');

  beforeEach(() => {
    if (fs.existsSync(screenshotPath)) {
      fs.unlinkSync(screenshotPath);
    }
  });

  afterAll(() => {
    if (fs.existsSync(screenshotPath)) {
      fs.unlinkSync(screenshotPath);
    }
  });

  it('should launch browser and save screenshot from crocs.com', async () => {
    await CloudflareBypass();

    const exists = fs.existsSync(screenshotPath);
    expect(exists).toBe(true);

    const size = fs.statSync(screenshotPath).size;
    expect(size).toBeGreaterThan(1000); // PNG file is not empty
  }, 60000); // Set test timeout to 60 seconds
});
