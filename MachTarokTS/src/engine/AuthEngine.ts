// src/controllers/AuthController.ts
import { Account, DEFAULT_SETTINGS } from "@/types";
import { EventEmitter } from "events"; // simple pub/sub for React to listen
import { signInUser } from "./SocketEngine";
import { addServerMessage } from "./ChatEngine";


const DEFAULT_PREFERENCES = {
    deck: "industrie-und-gluck",
    elo: 300,
    admin: false,
    avatar: 0,
    displayChat: true,
    dailyScore: null,
    defaultSettings: DEFAULT_SETTINGS
};

export const INITIAL_ACCOUNT: Account = {
  user: "Guest",
  authToken: null,
  preferences: DEFAULT_PREFERENCES,
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

  // Attempts login via server
  login(username: string, token: string) {
    // Note: Not actually logged in yet, just forwarding to server for verification
    //this.account = { user: username, authToken: token, preferences: DEFAULT_PREFERENCES, wins: null };
    document.cookie = `username=${username};secure`;
    document.cookie = `token=${token};secure`;
    signInUser(username, token);
  }

  loginSuccess(username: string, avatar: number) {
    this.account.user = username;
    if (!this.account.preferences) this.account.preferences = DEFAULT_PREFERENCES;
    this.account.preferences.avatar = avatar;
    this.isAuthenticated = true;
    addServerMessage(`Welcome, ${username}!`);
    this.notify();
  }

  loginFailure() {
    this.isAuthenticated = false;
    document.cookie =
      "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "deck=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    addServerMessage("Login failed :(");
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
