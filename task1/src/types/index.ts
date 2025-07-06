export interface EvasionConfig {
  // Browser Configuration
  headless?: boolean;
  userAgent?: string;
  viewport?: {
    width: number;
    height: number;
    deviceScaleFactor?: number;
  };
  
  // Evasion Settings
  enableCanvasEvasion?: boolean;
  enableWebGLEvasion?: boolean;
  enableAudioEvasion?: boolean;
  enableFontEvasion?: boolean;
  enableHardwareEvasion?: boolean;
  enableMouseEvasion?: boolean;
  enableKeyboardEvasion?: boolean;
  enableScrollEvasion?: boolean;
  enableTimingEvasion?: boolean;
  
  // Network Configuration
  proxy?: {
    host: string;
    port: string;
    username?: string;
    password?: string;
  };
  customHeaders?: Record<string, string>;
  
  // Challenge Solving
  enableCloudflareBypass?: boolean;
  enableAkamaiBypass?: boolean;
  enableImpervaBypass?: boolean;
  enableTurnstileBypass?: boolean;
  
  // Timing Configuration
  minDelay?: number;
  maxDelay?: number;
  pageLoadTimeout?: number;
  challengeTimeout?: number;
  
  // Device Profile
  deviceProfile?: DeviceProfile;
}

export interface DeviceProfile {
  name: string;
  userAgent: string;
  viewport: {
    width: number;
    height: number;
    deviceScaleFactor: number;
  };
  platform: string;
  language: string;
  timezone: string;
  geolocation?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  hardwareConcurrency: number;
  deviceMemory: number;
  maxTouchPoints: number;
  webGLVendor: string;
  webGLRenderer: string;
  canvasNoise: number;
  audioNoise: number;
}

export interface EvasionResult {
  success: boolean;
  url: string;
  cookies: any[];
  screenshot?: string;
  screenshotPath?: string;
  error?: string;
  bypassedChallenges: string[];
  fingerprint: BrowserFingerprint;
  timing: {
    pageLoadTime: number;
    totalTime: number;
    challengeTime?: number;
  };
}

export interface BrowserFingerprint {
  userAgent: string;
  platform: string;
  language: string;
  timezone: string;
  screenResolution: string;
  colorDepth: number;
  pixelRatio: number;
  hardwareConcurrency: number;
  deviceMemory: number;
  maxTouchPoints: number;
  webGLVendor: string;
  webGLRenderer: string;
  canvasHash: string;
  audioHash: string;
  fontList: string[];
  plugins: string[];
  mimeTypes: string[];
}

export interface ChallengeDetection {
  type: 'cloudflare' | 'akamai' | 'imperva' | 'turnstile' | 'captcha' | 'unknown';
  confidence: number;
  selectors: string[];
  textIndicators: string[];
  urlPatterns: string[];
}

export interface MouseMovement {
  x: number;
  y: number;
  timestamp: number;
  type: 'move' | 'click' | 'scroll';
  button?: number;
  deltaX?: number;
  deltaY?: number;
}

export interface KeyboardEvent {
  key: string;
  timestamp: number;
  type: 'keydown' | 'keyup' | 'keypress';
  modifiers: string[];
}

export interface NetworkRequest {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: string;
  timestamp: number;
  response?: {
    status: number;
    headers: Record<string, string>;
    body: string;
  };
} 