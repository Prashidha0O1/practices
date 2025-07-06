export class TimingBehavior {
  async randomDelay(min: number = 100, max: number = 1000): Promise<void> {
    const delay = Math.random() * (max - min) + min;
    return new Promise(resolve => setTimeout(resolve, delay));
  }
} 