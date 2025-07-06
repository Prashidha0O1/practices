export class TimezoneSpoof {
  async spoofTimezone(page: any, timezone: string): Promise<void> {
    await page.emulateTimezone(timezone);
  }
} 