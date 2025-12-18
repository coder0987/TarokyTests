import { ChatMessage } from "@/types";

export class ChatStore {
  readonly chatMessages : ChatMessage[] = [];
  readonly maxChatMessages = 15;
  readonly ledgerMessages : ChatMessage[] = [];
  readonly maxLedgerMessages = 15;

  private listeners = new Set<() => void>();

  subscribe(fn: () => void) {
    this.listeners.add(fn);
    return () => {this.listeners.delete(fn);};
  }

  notify() {
    this.listeners.forEach(fn => fn());
  }
}

export const chatStore = new ChatStore();
