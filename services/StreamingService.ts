export class StreamingService {
  private static abortControllers: Map<string, AbortController> = new Map();

  static createController(chatId: string): AbortController {
    this.stop(chatId); // Stop any existing stream for this chat
    const controller = new AbortController();
    this.abortControllers.set(chatId, controller);
    return controller;
  }

  static stop(chatId: string): void {
    const controller = this.abortControllers.get(chatId);
    if (controller) {
      controller.abort();
      this.abortControllers.delete(chatId);
    }
  }

  static getSignal(chatId: string): AbortSignal | undefined {
    return this.abortControllers.get(chatId)?.signal;
  }

  static isStopped(chatId: string): boolean {
    return !this.abortControllers.has(chatId);
  }
}
