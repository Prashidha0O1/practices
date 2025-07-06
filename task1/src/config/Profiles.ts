import { DeviceProfile } from '../types';

export const DEVICE_PROFILES: Record<string, DeviceProfile> = {
  'chrome-desktop': {
    name: 'Chrome Desktop',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1
    },
    platform: 'Win32',
    language: 'en-US',
    timezone: 'America/New_York',
    geolocation: {
      latitude: 40.7128,
      longitude: -74.0060,
      accuracy: 100
    },
    hardwareConcurrency: 8,
    deviceMemory: 8,
    maxTouchPoints: 0,
    webGLVendor: 'Google Inc. (Intel)',
    webGLRenderer: 'ANGLE (Intel, Intel(R) UHD Graphics 620 Direct3D11 vs_5_0 ps_5_0, D3D11)',
    canvasNoise: 0.1,
    audioNoise: 0.05
  },
  
  'chrome-mobile': {
    name: 'Chrome Mobile',
    userAgent: 'Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    viewport: {
      width: 390,
      height: 844,
      deviceScaleFactor: 3
    },
    platform: 'Linux armv8l',
    language: 'en-US',
    timezone: 'America/Los_Angeles',
    geolocation: {
      latitude: 34.0522,
      longitude: -118.2437,
      accuracy: 50
    },
    hardwareConcurrency: 8,
    deviceMemory: 4,
    maxTouchPoints: 5,
    webGLVendor: 'ARM',
    webGLRenderer: 'Mali-G78 MC14',
    canvasNoise: 0.15,
    audioNoise: 0.1
  },
  
  'firefox-desktop': {
    name: 'Firefox Desktop',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    viewport: {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1
    },
    platform: 'Win32',
    language: 'en-US',
    timezone: 'Europe/London',
    geolocation: {
      latitude: 51.5074,
      longitude: -0.1278,
      accuracy: 100
    },
    hardwareConcurrency: 12,
    deviceMemory: 16,
    maxTouchPoints: 0,
    webGLVendor: 'Mesa/X.org',
    webGLRenderer: 'Mesa Intel(R) UHD Graphics 620 (CFL GT2)',
    canvasNoise: 0.08,
    audioNoise: 0.03
  },
  
  'safari-desktop': {
    name: 'Safari Desktop',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
    viewport: {
      width: 1440,
      height: 900,
      deviceScaleFactor: 2
    },
    platform: 'MacIntel',
    language: 'en-US',
    timezone: 'America/Chicago',
    geolocation: {
      latitude: 41.8781,
      longitude: -87.6298,
      accuracy: 100
    },
    hardwareConcurrency: 10,
    deviceMemory: 16,
    maxTouchPoints: 0,
    webGLVendor: 'Apple Inc.',
    webGLRenderer: 'Apple M1 Pro',
    canvasNoise: 0.05,
    audioNoise: 0.02
  },
  
  'safari-mobile': {
    name: 'Safari Mobile',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',
    viewport: {
      width: 375,
      height: 812,
      deviceScaleFactor: 3
    },
    platform: 'iPhone',
    language: 'en-US',
    timezone: 'America/Denver',
    geolocation: {
      latitude: 39.7392,
      longitude: -104.9903,
      accuracy: 30
    },
    hardwareConcurrency: 6,
    deviceMemory: 4,
    maxTouchPoints: 5,
    webGLVendor: 'Apple Inc.',
    webGLRenderer: 'Apple A15 Bionic',
    canvasNoise: 0.12,
    audioNoise: 0.08
  }
};

export const COMMON_FONTS = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Times',
  'Courier New',
  'Courier',
  'Verdana',
  'Georgia',
  'Palatino',
  'Garamond',
  'Bookman',
  'Comic Sans MS',
  'Trebuchet MS',
  'Arial Black',
  'Impact',
  'Lucida Sans Unicode',
  'Tahoma',
  'Geneva',
  'Lucida Grande',
  'Segoe UI'
];

export const COMMON_PLUGINS = [
  'PDF Viewer',
  'Chrome PDF Plugin',
  'Chromium PDF Plugin',
  'Microsoft Edge PDF Plugin',
  'WebKit-integrierte PDF',
  'Native Client',
  'Widevine Content Decryption Module',
  'Shockwave Flash',
  'Java Applet Plugin',
  'QuickTime Plugin'
];

export const COMMON_MIME_TYPES = [
  'application/pdf',
  'application/x-google-chrome-pdf',
  'application/x-nacl',
  'application/x-pnacl',
  'application/x-shockwave-flash',
  'application/x-java-applet',
  'video/quicktime',
  'video/mp4',
  'audio/mpeg',
  'audio/wav'
]; 