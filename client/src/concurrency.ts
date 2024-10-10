export class ConcurrencyManager {
  private queue: (() => void)[] = [];
  private runningCount = 0;

  constructor(private maxConcurrent: number) {}

  async runTask<T>(task: () => Promise<T>): Promise<T> {
    if (this.runningCount >= this.maxConcurrent) {
      await new Promise<void>((resolve) => {
        this.queue.push(resolve);
      });
    }
    this.runningCount++;
    try {
      return await task();
    } finally {
      this.runningCount--;
      if (this.queue.length > 0) {
        const next = this.queue.shift();
        next?.();
      }
    }
  }
}
