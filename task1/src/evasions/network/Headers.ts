export class HeadersEvasion {
  async setRealisticHeaders(page: any, headers: Record<string, string>): Promise<void> {
    await page.setExtraHTTPHeaders(headers);
  }
} 