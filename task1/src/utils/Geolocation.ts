export class GeolocationSpoof {
  async spoofGeolocation(page: any, latitude: number, longitude: number, accuracy: number = 100): Promise<void> {
    await page.setGeolocation({ latitude, longitude, accuracy });
  }
} 