import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
// import { Browser, Page, executablePath } from 'puppeteer';

puppeteer.use(StealthPlugin());
const { connect } = require("puppeteer-real-browser");

async function test() {
  const { browser, page } = await connect({
    headless: false,

    args: [],

    customConfig: {},

    turnstile: true,

    connectOption: {},

    disableXvfb: false,
    ignoreAllFlags: false,
    // proxy:{
    //     host:'<proxy-host>',
    //     port:'<proxy-port>',
    //     username:'<proxy-username>',
    //     password:'<proxy-password>'
    // }
  });
  await page.goto("https://www.crocs.com/?__cf_chl_rt_tk=Vs9pb3yQBet6ExMl6QTfQ4n_7D.lBtficadR44lXGqo-1751356484-1.0.1.1-P_jpt9qQjVpA.Ze7uDqB5jUTjizoUmAJSpaqPenG7Wo");
}

test();















// async function humanizePage(page: Page): Promise<void> {
//   // Simulate human-like mouse movements
//   await page.mouse.move(Math.random() * 800, Math.random() * 600);
//   await page.mouse.move(Math.random() * 800, Math.random() * 600, { steps: 10 });

//   // Simulate scrolling
//   await page.evaluate(() => window.scrollBy(0, Math.random() * 500));

//   // Simulate viewport changes
//   await page.setViewport({
//     width: 1366 + Math.floor(Math.random() * 100),
//     height: 768 + Math.floor(Math.random() * 100),
//   });
// }

// async function bypassCloudflare(): Promise<void> {
//   const browser: Browser = await puppeteer.launch({
//     headless: false, // Use non-headless for better success
//     executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // Update as needed
//     args: [
//       '--no-sandbox',
//       '--disable-setuid-sandbox',
//       '--disable-dev-shm-usage',
//       '--disable-blink-features=AutomationControlled', // Hide automation flags
//       '--window-size=1366,768',
//       '--lang=en-US',
//       '--disable-web-security', // Optional: may help with some checks
//     ],
//   });

//   const page: Page = await browser.newPage();

//   // Set a realistic user agent
//   await page.setUserAgent(
//     'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
//   );

//   // Set extra headers
//   await page.setExtraHTTPHeaders({
//     'accept-language': 'en-US,en;q=0.9',
//     'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
//   });

//   // Spoof navigator properties
//   await page.evaluateOnNewDocument(() => {
//     Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
//     Object.defineProperty(navigator, 'platform', { get: () => 'Win32' });
//     Object.defineProperty(navigator, 'webdriver', { get: () => false });
//     Object.defineProperty(navigator, 'plugins', {
//       get: () => [
//         { name: 'Chrome PDF Plugin' },
//         { name: 'Chrome PDF Viewer' },
//         { name: 'Native Client' },
//       ],
//     });

//     // Spoof WebGL for fingerprinting
//     const getParameter = WebGLRenderingContext.prototype.getParameter;
//     WebGLRenderingContext.prototype.getParameter = function (parameter: number) {
//       if (parameter === 37446) return 'Intel Inc.';
//       if (parameter === 37447) return 'Intel Iris OpenGL Engine';
//       return getParameter.call(this, parameter);
//     };
//   });

//   try {
//     console.log('Navigating to Crocs website...');
//     await page.goto('https://www.crocs.com/', {
//       waitUntil: 'networkidle2', // Wait for network to be idle
//       timeout: 60000,
//     });

//     // Simulate human-like behavior
//     await humanizePage(page);

//     // Wait for Cloudflare checkbox (if present)
//     const cloudflareCheckbox = await page.$('#cf-challenge-form input[type="checkbox"]');
//     if (cloudflareCheckbox) {
//       console.log('Cloudflare checkbox detected, attempting to click...');
//       await cloudflareCheckbox.click();
//       await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for verification
//     }

//     // Wait for page to fully load
//     await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 30000 }).catch(() => {
//       console.log('Navigation timeout, proceeding anyway...');
//     });

//     // Get page title
//     const title = await page.title();
//     console.log('Page title:', title);

//     // Take screenshot
//     await page.screenshot({ path: 'crocs_screenshot1.png', fullPage: true });
//     console.log('Screenshot saved as crocs_screenshot.png');

//     // Extract and print cookies
//     const cookies = await page.cookies();
//     console.log('Cookies:', JSON.stringify(cookies, null, 2));

//     console.log('Successfully accessed Crocs website!');
//     console.log('Current URL:', page.url());
//   } catch (error) {
//     console.error('Error:', error);
//     await page.screenshot({ path: 'error_screenshot.png', fullPage: true });
//     console.log('Error screenshot saved as error_screenshot.png');
//   } finally {
//     await browser.close();
//   }
// }

// (async () => {
//   await bypassCloudflare();
// })();