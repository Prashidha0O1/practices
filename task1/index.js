"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_real_browser_1 = require("puppeteer-real-browser");
const fs_1 = require("fs");
const path_1 = require("path");
class CloudflareBypass {
    constructor() {
        this.browser = null;
        this.page = null;
    }
    launch() {
        return __awaiter(this, arguments, void 0, function* (options = {}) {
            var _a, _b;
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
                const { browser, page } = yield (0, puppeteer_real_browser_1.connect)({
                    headless: (_a = options.headless) !== null && _a !== void 0 ? _a : false,
                    args: proxyArg,
                    customConfig: {},
                    turnstile: (_b = options.turnstile) !== null && _b !== void 0 ? _b : true,
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
                    yield this.page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
                }
                console.log('✅ Browser launched using puppeteer-real-browser');
            }
            catch (error) {
                console.error('❌ Failed to launch browser:', error);
                throw error;
            }
        });
    }
    bypassCloudflare(url_1) {
        return __awaiter(this, arguments, void 0, function* (url, options = {}) {
            try {
                if (!this.page || !this.browser) {
                    yield this.launch(options);
                }
                if (!this.page)
                    throw new Error('Failed to create page');
                console.log(`🌐 Navigating to: ${url}`);
                yield this.page.goto(url, {
                    waitUntil: 'networkidle2',
                    timeout: 60000,
                });
                yield this.randomDelay(3000, 5000);
                // Challenge detection without hardcoding selectors
                const isChallenge = yield this.detectCloudflareChallenge();
                if (isChallenge) {
                    console.log('🛡️ Cloudflare challenge detected...waiting for resolution');
                    yield this.page.waitForFunction(() => {
                        var _a;
                        const bodyText = ((_a = document.body) === null || _a === void 0 ? void 0 : _a.innerText) || '';
                        return !(document.querySelector('[data-cf-beacon]') ||
                            document.querySelector('#cf-wrapper') ||
                            document.querySelector('iframe[src*="turnstile"]') ||
                            document.title.includes('Just a moment') ||
                            bodyText.includes('Checking your browser') ||
                            bodyText.includes('DDoS protection') ||
                            bodyText.includes('Please wait while we verify'));
                    }, { timeout: 45000 });
                    console.log('✅ Challenge resolved');
                    yield this.randomDelay(2000, 3000);
                }
                const cookies = yield this.page.cookies();
                console.log(`🍪 Retrieved ${cookies.length} cookies`);
                const screenshot = yield this.page.screenshot({
                    encoding: 'base64',
                    fullPage: true,
                });
                const result = {
                    success: true,
                    cookies,
                    screenshot,
                    url: this.page.url(),
                };
                if (options.saveScreenshot && screenshot) {
                    const domain = new URL(url).hostname.replace('www.', '');
                    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                    const fileName = options.screenshotName || `${domain}-${timestamp}.png`;
                    const filePath = (0, path_1.join)(options.screenshotPath || '.', fileName);
                    try {
                        (0, fs_1.writeFileSync)(filePath, Buffer.from(screenshot, 'base64'));
                        result.screenshotPath = filePath;
                        console.log(`📸 Screenshot saved to: ${filePath}`);
                    }
                    catch (saveError) {
                        console.warn(`⚠️ Failed to save screenshot: ${saveError}`);
                    }
                }
                console.log(`✅ Successfully bypassed: ${result.url}`);
                return result;
            }
            catch (error) {
                console.error(`❌ Bypass failed: ${error}`);
                return {
                    success: false,
                    cookies: [],
                    screenshot: null,
                    url,
                    error: error instanceof Error ? error.message : 'Unknown error',
                };
            }
        });
    }
    detectCloudflareChallenge() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.page)
                return false;
            return yield this.page.evaluate(() => {
                var _a;
                const bodyText = ((_a = document.body) === null || _a === void 0 ? void 0 : _a.innerText) || '';
                return !!(document.querySelector('[data-cf-beacon]') ||
                    document.querySelector('#cf-wrapper') ||
                    document.querySelector('iframe[src*="turnstile"]') ||
                    document.title.includes('Just a moment') ||
                    bodyText.includes('Checking your browser') ||
                    bodyText.includes('DDoS protection') ||
                    bodyText.includes('Please wait while we verify'));
            });
        });
    }
    randomDelay(min, max) {
        return __awaiter(this, void 0, void 0, function* () {
            const delay = Math.random() * (max - min) + min;
            return new Promise(resolve => setTimeout(resolve, delay));
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.page) {
                yield this.page.close();
                this.page = null;
            }
            if (this.browser) {
                yield this.browser.close();
                this.browser = null;
            }
            console.log('🔒 Browser closed');
        });
    }
}
function bypassCloudflareAndGetData(url_1) {
    return __awaiter(this, arguments, void 0, function* (url, options = {}) {
        const bypass = new CloudflareBypass();
        try {
            const result = yield bypass.bypassCloudflare(url, options);
            yield bypass.close();
            return result;
        }
        catch (error) {
            yield bypass.close();
            throw error;
        }
    });
}
exports.default = bypassCloudflareAndGetData;
if (require.main === module) {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield bypassCloudflareAndGetData('https://www.carousell.com', {
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
    }))();
}
