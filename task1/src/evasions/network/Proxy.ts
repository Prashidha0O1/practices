export class ProxyEvasion {
  async authenticate(page: any, proxy?: { username?: string; password?: string }): Promise<void> {
    if (proxy && proxy.username && proxy.password) {
      await page.authenticate({ username: proxy.username, password: proxy.password });
    }
  }
} 