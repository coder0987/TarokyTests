import {
  SUIT,
  TRUMP_VALUE,
  RED_VALUE,
  RED_VALUE_ACE_HIGH,
  BLACK_VALUE,
  VALUE_REVERSE,
  DIFFICULTY_TABLE,
} from "./enums";
import { SERVER } from "./logger";
import GameManager from "./GameManager";
import { u, findTheI } from "./utils";
import Settings from "./Settings";
import { card, settings, t_difficulty } from "./types";

type Room = {
  name?: string;
  settings: Settings;
  players: { chips: number; hand: card[] }[];
  board: {
    povinnost: number;
    importantInfo: { povinnost: number };
    talon: card[];
    notation?: string;
    hasTheI?: number;
    nextStep?: { player: number; action: string; time: number; info: any };
  };
};

let baseDeck: card[] = GameManager.INSTANCE.baseDeck.deck;

function notationToCards(
  notatedCards: string,
  aceHigh: boolean
): card[] | false {
  try {
    let cards: card[] = [];
    const SUIT_NOTATION: { [key: string]: string } = {
      S: SUIT[0]!,
      C: SUIT[1]!,
      H: SUIT[2]!,
      D: SUIT[3]!,
      T: SUIT[4]!,
    };
    const VALUE_NOTATION: { [key: string]: number } = {
      "1": 0,
      "2": 1,
      "3": 2,
      "4": 3,
      J: 4,
      R: 5,
      Q: 6,
      K: 7,
    };

    while (notatedCards.length >= 2) {
      let suit = SUIT_NOTATION[notatedCards.substring(0, 1)];
      notatedCards = notatedCards.substring(1);
      if (u(suit)) {
        return false;
      }
      if (suit === SUIT[4]) {
        let value = TRUMP_VALUE[+notatedCards.substring(0, 2) - 1];
        notatedCards = notatedCards.substring(2);
        if (u(value)) {
          return false;
        }
        cards.push({ value: value, suit: SUIT[4] } as card);
      } else {
        let valueIdx = VALUE_NOTATION[notatedCards.substring(0, 1)];
        notatedCards = notatedCards.substring(1);
        if (typeof valueIdx !== "number") {
          return false;
        }
        let redValueEnum = aceHigh ? RED_VALUE_ACE_HIGH : RED_VALUE;
        let value =
          suit === SUIT[0] || suit === SUIT[1]
            ? BLACK_VALUE[valueIdx]
            : redValueEnum[valueIdx];
        if (u(value)) {
          return false;
        }
        cards.push({ value: value, suit: suit } as card);
      }
    }
    return cards;
  } catch (err: any) {
    SERVER.debug(err, "notation error");
    return false;
  }
}

function cardsToNotation(cards: card[]): string {
  let theNotation = "";
  const SUIT_TO_NOTATION: { [key: string]: string } = {
    Spade: "S",
    Club: "C",
    Heart: "H",
    Diamond: "D",
    Trump: "T",
  };
  try {
    for (const card of cards) {
      const suitNotation = SUIT_TO_NOTATION[card.suit];
      if (!suitNotation) {
        throw new Error(`Unknown suit: ${card.suit}`);
      }
      theNotation += suitNotation;
      if (card.suit == SUIT[4]) {
        //Trump
        let temp = (VALUE_REVERSE[card.value] as number) + 1;
        let tempstring: string = temp.toString();
        if (temp < 10) {
          tempstring = "0" + tempstring;
        }
        theNotation += tempstring;
      } else {
        switch (card.value) {
          case "Ace":
          case "Seven":
            theNotation += "1";
            break;
          case "Two":
          case "Eight":
            theNotation += "2";
            break;
          case "Three":
          case "Nine":
            theNotation += "3";
            break;
          case "Four":
          case "Ten":
            theNotation += "4";
            break;
          default:
            theNotation += (card.value as string).substring(0, 1);
        }
      }
    }
  } catch (err: any) {
    SERVER.error(
      "Cards could not be notated: " + JSON.stringify(cards) + "\n" + err, "notation error"
    );
    throw new Error("oopsie daisy");
  }
  return theNotation;
}

function notationToSettings(room: Room, notation: string): void {
  room.settings = new Settings();

  let theSettings = notation.split(";");
  for (const settingStr of theSettings) {
    if (!settingStr) continue;
    const [setting, rule] = settingStr.split("=");
    if (u(setting) || u(rule)) {
      SERVER.debug("Undefined setting or rule", room.name ?? "notation error");
    } else {
      switch (setting) {
        case "difficulty":
          room.settings.changeDifficulty(Number(rule));
          break;
        case "timeout":
          room.settings.changeTimeout(Number(rule));
          break;
        case "aceHigh":
          room.settings.changeAceHigh(rule === "true" || rule === "1");
          break;
        case "lock":
        case "locked":
          room.settings.changeLock(rule === "true" || rule === "1");
          break;
        case "botPlayTime":
          room.settings.changeBotPlayTime(Number(rule));
          break;
        case "botThinkTime":
          room.settings.changeBotThinkTime(Number(rule));
          break;
        case "pn":
          //Handled later
          break;
        default:
          SERVER.warn(
            "Unknown setting: " + setting + "=" + rule,
            "notation error"
          );
      }
    }
  }
}

function notationToObject(notation: string): Settings {
  if (!notation) {
    return new Settings();
  }
  let settingsObject = new Settings();
  let theSettings = notation.split(";");
  for (const settingStr of theSettings) {
    if (!settingStr) continue;
    const [setting, rule] = settingStr.split("=");
    if (u(setting) || u(rule)) {
      SERVER.debug("Undefined setting or rule", "notation error");
    } else {
      switch (setting) {
        case "difficulty":
          settingsObject.changeDifficulty(Number(rule));
          break;
        case "timeout":
          settingsObject.changeTimeout(Number(rule));
          break;
        case "lock":
        case "locked":
          settingsObject.changeLock(rule === "true" || rule === "1");
          break;
        case "aceHigh":
          settingsObject.changeAceHigh(rule === "true" || rule === "1");
          break;
        case "botPlayTime":
          settingsObject.changeBotPlayTime(Number(rule));
          break;
        case "botThinkTime":
          settingsObject.changeBotThinkTime(Number(rule));
          break;
        case "pn":
          //Handled later
          break;
        default:
          SERVER.warn(
            "Unknown setting: " + setting + "=" + rule,
            "notation error"
          );
      }
    }
  }
  return settingsObject;
}

function notate(room: Room, notation: string): Room | false {
  if (notation) {
    SERVER.debug(`Creating room from notation ${notation}`, room.name ?? "notation error");

    try {
      if (typeof notation !== "string") {
        SERVER.debug("Notation: not a string", room.name ?? "notation error");
        return false;
      }
      if (!room) {
        throw new Error("A valid room must be passed in");
      }
      room.board.povinnost = 0;
      room.board.importantInfo.povinnost = room.board.povinnost + 1;
      //Return the room
      let values = notation.split("/");
      if (values.length > 20 || values.length < 10) {
        SERVER.debug(
          "Notation: Illegal number of values",
          room.name ?? "notation error"
        );
        return false;
      }

      //Get the settings
      let theSettings = values[values.length - 1];
      if (theSettings === undefined) {
        throw new Error("Notation is missing settings section.");
      }
      notationToSettings(room, theSettings);

      let thePlayers = room.players;
      for (let i = 0; i < 4; i++) {
        const chipValue = values[i];
        if (
          typeof chipValue !== "string" ||
          isNaN(+chipValue) ||
          typeof thePlayers[i] === "undefined"
        ) {
          SERVER.debug(
            "Notation: chips count is NaN or player is undefined",
            room.name ?? "notation error"
          );
          return false;
        }
        thePlayers[i]!.chips = +chipValue;
      }
      for (let i = 0; i < 4; i++) {
        const handValue = values[i + 4];
        if (
          typeof handValue !== "string" ||
          typeof thePlayers[i] === "undefined"
        ) {
          SERVER.debug("Notation: hand is missing or player is undefined", "");
          return false;
        }
        let theHand = notationToCards(handValue, room.settings.aceHigh);
        if (theHand && theHand.length == 12) {
          thePlayers[i]!.hand = theHand;
        } else {
          SERVER.debug(
            "Notation: hand is illegal",
            room.name ?? "notation error"
          );
          return false;
        }
      }
        let theTalon = notationToCards(values[8]!,room.settings.aceHigh);
        if (theTalon && theTalon.length == 6) {
            room.board.talon = theTalon;
        } else {
            SERVER.debug(
              "Notation: talon is illegal",
              room.name ?? "notation error"
            );
            return false;
        }
      let toCheck = theTalon
        .concat(thePlayers[0]!.hand)
        .concat(thePlayers[1]!.hand)
        .concat(thePlayers[2]!.hand)
        .concat(thePlayers[3]!.hand);
      for (let i in baseDeck) {
        let found = false;
        for (let j in toCheck) {
          if (
            baseDeck[i]!.suit == toCheck[j]!.suit &&
            baseDeck[i]!.value == toCheck[j]!.value
          ) {
            found = true;
            break;
          }
        }
        if (!found) {
          SERVER.debug("Notation: Missing card", room.name ?? "notation error");
          SERVER.debug(
            JSON.stringify(baseDeck[i]),
            room.name ?? "notation error"
          );
          return false;
        }
      }

      //This is the first point at which the game may reasonably be played from
      //So, encode the settings if they exist. Then, if no more is present, return the room
      let valuesWithoutSettings = [...values];
      delete valuesWithoutSettings[valuesWithoutSettings.length - 1];
      room.board.notation = valuesWithoutSettings.join("/");
      room.board.hasTheI = findTheI(room.players);
      if (values.length === 10) {
        room.board.nextStep = {
          player: 0,
          action: "prever",
          time: Date.now(),
          info: null,
        };
        return room;
      }

      //TODO: finish notation decoding. Next is prever. See TarokyNotation.md

      room.board.nextStep = {
        player: 0,
        action: "prever",
        time: Date.now(),
        info: null,
      };
      return room;
    } catch (err: any) {
      SERVER.debug("Error in notate() " + err, room.name ?? "notation error");
      return false;
    }
  }
  SERVER.debug("Notation: No notation provided", room.name ?? "notation error");
  return false;
}

function getPNFromNotation(notation: string): number {
  const values = notation.split("/");
  const theSettings = values[values.length - 1]!.split(";");
  let [setting, pn] = theSettings[theSettings.length - 1]!.split("=");
  if (
    u(setting) ||
    u(pn) ||
    setting != "pn" ||
    isNaN(Number(pn)) ||
    Number(pn) < 0 ||
    Number(pn) > 4
  ) {
    SERVER.debug("Player number not declared", "notation error");
    pn = "0";
  }
  return Number(pn);
}

export {
  notationToCards,
  cardsToNotation,
  notationToSettings,
  notationToObject,
  notate,
  getPNFromNotation,
};
