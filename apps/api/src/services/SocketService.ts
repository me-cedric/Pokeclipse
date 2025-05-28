import { EventEmitter, on } from "stream";

// Typesafe event map can be added for stricter typing
export class SocketService {
  private static emitter = new EventEmitter();
  // Map of userId to Set of subscription iterators
  private static userSubscriptions: Map<
    string,
    Set<AsyncIterator<any[], any, any>>
  > = new Map();

  // Listen to an event
  static on<T = any>(event: string, listener: (payload: T) => void) {
    this.emitter.on(event, listener);
  }

  // Remove a listener
  static off<T = any>(event: string, listener: (payload: T) => void) {
    this.emitter.off(event, listener);
  }

  // Emit an event
  static emit<T = any>(event: string, payload: T) {
    this.emitter.emit(event, payload);
  }

  // Send a message to all subscriptions for a user
  static sendToUser<T = any>(userId: string, event: string, payload: T) {
    // This will emit to all subscriptions for this user
    if (this.userSubscriptions.has(userId)) {
      this.userSubscriptions.get(userId)!.forEach(() => {
        this.emitter.emit(`${userId}:${event}`, payload);
      });
    }
  }

  // Async iterator for tRPC subscriptions, now registered by userId
  static async *subscribe<T = any>(
    userId: string,
    opts?: { signal?: AbortSignal }
  ) {
    const iterator = on(this.emitter, userId, opts);
    // Register this iterator for the user
    if (!this.userSubscriptions.has(userId)) {
      this.userSubscriptions.set(userId, new Set());
    }
    this.userSubscriptions.get(userId)!.add(iterator);
    try {
      for await (const [payload] of iterator) {
        yield payload as T;
      }
    } finally {
      // Cleanup when subscription ends
      this.userSubscriptions.get(userId)?.delete(iterator);
      if (this.userSubscriptions.get(userId)?.size === 0) {
        this.userSubscriptions.delete(userId);
      }
    }
  }
}
