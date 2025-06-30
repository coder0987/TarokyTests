import { settings, t_difficulty } from "./types";

import { DIFFICULTY_TABLE, DIFFICULTY } from "./enums";

export default class Settings {
  lock;
  timeout;
  aceHigh;
  difficulty;
  botPlayTime;
  botThinkTime;

  notation: string;

  constructor(args: settings = {}) {
    this.lock = args.lock ?? true;
    this.timeout = args.timeout ?? 30000;
    this.aceHigh = args.aceHigh ?? false;
    this.difficulty = args.difficulty ?? DIFFICULTY.NORMAL;

    this.botPlayTime = args.botPlayTime ?? 3000;
    this.botThinkTime = args.botThinkTime ?? 1000;

    this.notation = "";

    this.setSettingsNotation();
  }

  setSettingsNotation() {
    this.notation = "";
    this.notation += `lock=${this.lock};`;
    this.notation += `timeout=${this.timeout};`;
    this.notation += `aceHigh=${this.aceHigh};`;
    this.notation += `botPlayTime=${this.botPlayTime};`;
    this.notation += `botThinkTime=${this.botThinkTime};`;
    this.notation += `difficulty=${this.difficulty}`; // Last one doesn't have ';'
  }

  changeDifficulty(difficulty: number) {
    if (!DIFFICULTY_TABLE[difficulty]) {
      return null;
    }

    this.difficulty = +difficulty;
    this.setSettingsNotation();

    // TODO: switch bots to AI if difficulty is set to AI, and vice-versa

    return "Difficulty updated to " + DIFFICULTY_TABLE[difficulty];
  }

  changeTimeout(number: number) {
    number = Math.floor(Number(number));

    if (isNaN(number)) {
      return null;
    }

    if (number <= 0) {
      number = 0;
    } else if (number <= 20000) {
      number = 20000;
    } else if (number >= 3600000) {
      number = 3600000;
    }

    this.timeout = number;

    this.setSettingsNotation();

    return "Timeout updated to " + number / 1000 + "s";
  }

  changeAceHigh(aceHigh: boolean) {
    let message;

    if (aceHigh) {
      this.aceHigh = true;
      message = "Ace is high";
    } else {
      this.aceHigh = false;
      message = "Ace is low";
    }

    this.setSettingsNotation();

    return message;
  }

  changeLock(lock: boolean) {
    let message;

    if (lock) {
      this.lock = true;
      message = "The room is now private";
    } else {
      this.lock = false;
      message = "The room is now public";
    }

    this.setSettingsNotation();

    return message;
  }

  changeBotPlayTime(number: number) {
    number = Math.floor(Number(number));

    if (isNaN(number)) {
      return null;
    }

    if (number <= 0) {
      number = 0;
    } else if (number >= 3600000) {
      number = 3600000;
    }

    this.botPlayTime = number;

    this.setSettingsNotation();

    return "Bot Play Time updated to " + number / 1000 + "s";
  }

  changeBotThinkTime(number: number) {
    number = Math.floor(Number(number));

    if (isNaN(number)) {
      return null;
    }

    if (number <= 0) {
      number = 0;
    } else if (number >= 3600000) {
      number = 3600000;
    }

    this.botThinkTime = number;

    this.setSettingsNotation();

    return "Bot Think Time updated to " + number / 1000 + "s";
  }
}
