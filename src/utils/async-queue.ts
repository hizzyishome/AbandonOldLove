/**
 * src/utils/async-queue.ts
 * 
 * Concurrency controller to prevent GitHub API Abuse Rate Limits.
 * GitHub GraphQL API prohibits too many mutations sent simultaneously.
 */

interface Task<T> {
  fn: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (reason?: any) => void;
}

export class AsyncQueue {
  private concurrencyLimit: number;
  private minDelayMs: number;
  private maxDelayMs: number;
  
  private activeCount: number = 0;
  private queue: Task<any>[] = [];

  constructor(limit = 3, minDelay = 300, maxDelay = 500) {
    this.concurrencyLimit = limit;
    this.minDelayMs = minDelay;
    this.maxDelayMs = maxDelay;
  }

  /**
   * Enqueues a promise-returning function to be executed subject to concurrency limits.
   */
  public enqueue<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject });
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.activeCount >= this.concurrencyLimit || this.queue.length === 0) {
      return;
    }

    this.activeCount++;
    const task = this.queue.shift()!;

    try {
      const result = await task.fn();
      task.resolve(result);
    } catch (error) {
      task.reject(error);
    } finally {
      // Artificial jitter delay after each request completes to pace out bursts further
      const jitter = Math.floor(Math.random() * (this.maxDelayMs - this.minDelayMs + 1)) + this.minDelayMs;
      await new Promise(res => setTimeout(res, jitter));
      
      this.activeCount--;
      this.processQueue();
    }
  }

  public get pending() {
    return this.queue.length;
  }

  public get active() {
    return this.activeCount;
  }
}

// Global default queue instance for batch unstar processes
export const unstarQueue = new AsyncQueue(3, 300, 500);
