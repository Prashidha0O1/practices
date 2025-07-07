"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAgentGenerator = void 0;
class UserAgentGenerator {
    static generateChromeUserAgent(platform = 'desktop') {
        const version = this.getRandomElement(this.CHROME_VERSIONS);
        if (platform === 'mobile') {
            const androidVersions = ['13', '12', '11', '10'];
            const androidVersion = this.getRandomElement(androidVersions);
            const deviceModels = [
                'SM-G991B', 'SM-G998B', 'SM-A546B', 'SM-A736B', 'SM-F946B',
                'Pixel 7', 'Pixel 6', 'Pixel 5', 'OnePlus 9', 'OnePlus 8'
            ];
            const deviceModel = this.getRandomElement(deviceModels);
            return `Mozilla/5.0 (Linux; Android ${androidVersion}; ${deviceModel}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version} Mobile Safari/537.36`;
        }
        const platforms = [
            'Windows NT 10.0; Win64; x64',
            'Windows NT 10.0; WOW64',
            'Macintosh; Intel Mac OS X 10_15_7',
            'Macintosh; Intel Mac OS X 10_14_6',
            'X11; Linux x86_64',
            'X11; Ubuntu; Linux x86_64'
        ];
        const selectedPlatform = this.getRandomElement(platforms);
        return `Mozilla/5.0 (${selectedPlatform}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version} Safari/537.36`;
    }
    static generateFirefoxUserAgent(platform = 'desktop') {
        const version = this.getRandomElement(this.FIREFOX_VERSIONS);
        if (platform === 'mobile') {
            const androidVersions = ['13', '12', '11', '10'];
            const androidVersion = this.getRandomElement(androidVersions);
            const deviceModels = [
                'SM-G991B', 'SM-G998B', 'SM-A546B', 'SM-A736B', 'SM-F946B',
                'Pixel 7', 'Pixel 6', 'Pixel 5', 'OnePlus 9', 'OnePlus 8'
            ];
            const deviceModel = this.getRandomElement(deviceModels);
            return `Mozilla/5.0 (Android ${androidVersion}; Mobile; ${deviceModel}; rv:${version}) Gecko/${version} Firefox/${version}`;
        }
        const platforms = [
            'Windows NT 10.0; Win64; x64',
            'Windows NT 10.0; WOW64',
            'Macintosh; Intel Mac OS X 10.15',
            'Macintosh; Intel Mac OS X 10.14',
            'X11; Linux x86_64; rv:${version}',
            'X11; Ubuntu; Linux x86_64; rv:${version}'
        ];
        const selectedPlatform = this.getRandomElement(platforms);
        return `Mozilla/5.0 (${selectedPlatform}) Gecko/20100101 Firefox/${version}`;
    }
    static generateSafariUserAgent(platform = 'desktop') {
        const version = this.getRandomElement(this.SAFARI_VERSIONS);
        if (platform === 'mobile') {
            const iosVersions = ['17_1', '17_0', '16_6', '16_5', '16_4'];
            const iosVersion = this.getRandomElement(iosVersions);
            const deviceModels = [
                'iPhone; CPU iPhone OS 17_1 like Mac OS X',
                'iPhone; CPU iPhone OS 17_0 like Mac OS X',
                'iPhone; CPU iPhone OS 16_6 like Mac OS X',
                'iPhone; CPU iPhone OS 16_5 like Mac OS X',
                'iPhone; CPU iPhone OS 16_4 like Mac OS X'
            ];
            const deviceModel = this.getRandomElement(deviceModels);
            return `Mozilla/5.0 (${deviceModel}) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/${version} Mobile/15E148 Safari/604.1`;
        }
        const platforms = [
            'Macintosh; Intel Mac OS X 10_15_7',
            'Macintosh; Intel Mac OS X 10_14_6',
            'Macintosh; Intel Mac OS X 10_13_6',
            'Macintosh; Intel Mac OS X 10_12_6'
        ];
        const selectedPlatform = this.getRandomElement(platforms);
        return `Mozilla/5.0 (${selectedPlatform}) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/${version} Safari/605.1.15`;
    }
    static generateEdgeUserAgent() {
        const version = this.getRandomElement(this.EDGE_VERSIONS);
        const chromeVersion = this.getRandomElement(this.CHROME_VERSIONS);
        const platforms = [
            'Windows NT 10.0; Win64; x64',
            'Windows NT 10.0; WOW64',
            'Macintosh; Intel Mac OS X 10_15_7',
            'Macintosh; Intel Mac OS X 10_14_6'
        ];
        const selectedPlatform = this.getRandomElement(platforms);
        return `Mozilla/5.0 (${selectedPlatform}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chromeVersion} Safari/537.36 Edg/${version}`;
    }
    static generateRandomUserAgent() {
        const browsers = ['chrome', 'firefox', 'safari', 'edge'];
        const browser = this.getRandomElement(browsers);
        const platform = Math.random() > 0.7 ? 'mobile' : 'desktop';
        switch (browser) {
            case 'chrome':
                return this.generateChromeUserAgent(platform);
            case 'firefox':
                return this.generateFirefoxUserAgent(platform);
            case 'safari':
                return this.generateSafariUserAgent(platform);
            case 'edge':
                return this.generateEdgeUserAgent();
            default:
                return this.generateChromeUserAgent();
        }
    }
    static getPlatformFromUserAgent(userAgent) {
        if (userAgent.includes('Android'))
            return 'Android';
        if (userAgent.includes('iPhone') || userAgent.includes('iPad'))
            return 'iOS';
        if (userAgent.includes('Windows'))
            return 'Windows';
        if (userAgent.includes('Macintosh'))
            return 'macOS';
        if (userAgent.includes('Linux'))
            return 'Linux';
        return 'Unknown';
    }
    static isMobile(userAgent) {
        return userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone');
    }
    static getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
}
exports.UserAgentGenerator = UserAgentGenerator;
UserAgentGenerator.CHROME_VERSIONS = [
    '120.0.0.0', '119.0.0.0', '118.0.0.0', '117.0.0.0', '116.0.0.0'
];
UserAgentGenerator.FIREFOX_VERSIONS = [
    '121.0', '120.0', '119.0', '118.0', '117.0'
];
UserAgentGenerator.SAFARI_VERSIONS = [
    '17.1', '17.0', '16.6', '16.5', '16.4'
];
UserAgentGenerator.EDGE_VERSIONS = [
    '120.0.0.0', '119.0.0.0', '118.0.0.0', '117.0.0.0', '116.0.0.0'
];
