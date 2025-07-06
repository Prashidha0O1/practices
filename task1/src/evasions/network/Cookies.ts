export class CookiesEvasion {
  async getCookies(page: any): Promise<any[]> {
    return await page.cookies();
  }
  async setCookie(page: any, cookie: any): Promise<void> {
    await page.setCookie(cookie);
  }
  async deleteCookie(page: any, name: string): Promise<void> {
    const cookies = await page.cookies();
    const cookie = cookies.find((c: any) => c.name === name);
    if (cookie) {
      await page.deleteCookie(cookie);
    }
  }
} 