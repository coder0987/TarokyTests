// src/controllers/AuthController.ts
import { Account } from "@/types";
import { EventEmitter } from "events"; // simple pub/sub for React to listen

export const INITIAL_ACCOUNT: Account = {
  user: "Guest",
  authToken: null,
  preferences: null,
  wins: null,
};

export class AuthController {
  account: Account = INITIAL_ACCOUNT;
  isAuthenticated = false;
  isLoading = true;
  private listeners = new Set<() => void>();

  constructor() {
    this.initFromCookies();
  }

  private getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() ?? null;
    return null;
  }

  private initFromCookies() {
    const username = this.getCookie("username");
    const token = this.getCookie("token");

    if (username && token) {
      this.login(username, token);
    } else {
      this.isAuthenticated = false;
    }

    this.isLoading = false;
    this.notify();
  }

  login(username: string, token: string) {
    this.account = { user: username, authToken: token, preferences: null, wins: null };
    document.cookie = `username=${username};secure`;
    document.cookie = `token=${token};secure`;
    this.isAuthenticated = true;
    this.notify();
  }

  logout() {
    this.account = INITIAL_ACCOUNT;
    this.isAuthenticated = false;
    this.notify();
  }

  // Listen for postMessage from SSO
  attachSSOListener(origin: string) {
    const handler = (event: MessageEvent) => {
      if (event.origin !== origin) return;

      const messageData = event.data as string;

      if (messageData === "signOut") {
        this.logout();
      } else {
        const [username, token, signUp] = messageData.split(":");
        if (signUp === "new") {
          // optional special handling
        }
        this.login(username, token);
      }
    };

    window.addEventListener("message", handler);

    return () => window.removeEventListener("message", handler);
  }

  subscribe(fn: () => void) {
    this.listeners.add(fn);
    return () => {this.listeners.delete(fn);};
  }

  notify() {
    this.listeners.forEach(fn => fn());
  }
}

// singleton instance
export const authController = new AuthController();
