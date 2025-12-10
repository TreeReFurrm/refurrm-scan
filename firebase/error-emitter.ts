type Handler = (payload: any) => void;

class SimpleEmitter {
  private listeners = new Map<string, Set<Handler>>();

  on(event: string, handler: Handler) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(handler);
  }

  off(event: string, handler: Handler) {
    this.listeners.get(event)?.delete(handler);
  }

  emit(event: string, payload: any) {
    this.listeners.get(event)?.forEach((handler) => handler(payload));
  }
}

export const errorEmitter = new SimpleEmitter();
