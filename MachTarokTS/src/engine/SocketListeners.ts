import { Card, ClientGameState, MESSAGE_TYPE, Player, PlayerIndex, PN } from "@/types";
import { gameStore } from "./GameStore";
import { addErrorMessage, addPlayerMessage, addServerMessage } from "./ChatEngine";
import { DIFFICULTY_TABLE } from "@/constants";
import { playerPerspective } from "@/utils";

// Util and debug functions

export function timeSync(serverTime: number) {
  gameStore.game.startTime = serverTime;
  gameStore.notify();
}

export function reload() {
    addErrorMessage("Reloading...");
    window.location.reload();
}

// Game joining

export function youStart(roomName: string, joinCode: string) {
    console.log(`You will start the game in room ${roomName} (${joinCode})`);
    // If the room does not exist, create the room

    if (gameStore.game.gameState === null || gameStore.game.gameState.roomName !== roomName) {
        gameStore.game.gameState = new ClientGameState(roomName);
    }

    // Then, set the inGame flag and room code
    gameStore.game.inGame = true;
    gameStore.game.gameState.roomCode = joinCode;

    gameStore.notify();
}

export function roomConnected(roomName: string) {
    console.log("Joined room:", roomName);
    if (gameStore.game.gameState === null || gameStore.game.gameState.roomName !== roomName) {
        gameStore.game.gameState = new ClientGameState(roomName);
        gameStore.notify();
    }
}

export function roomNotConnected(roomName: string) {
  gameStore.game.connectingToRoom = false;
  gameStore.notify();

  addServerMessage(`Failed to connect to room ${roomName}`);
}

export function audienceConnected(audienceInfo: string) {
  const state = gameStore.game;

  state.gameState = new ClientGameState(audienceInfo);

  state.inGame = true;
  state.connectingToRoom = false;

  gameStore.notify();

  addServerMessage(`Joined audience in room ${audienceInfo}`);
}

export function audienceNotConnected(audienceRoom: string) {
  gameStore.game.connectingToRoom = false;
  gameStore.notify();

  addServerMessage(`Failed to join audience in room ${audienceRoom}`);
}


// Lobby

export function returnRooms(rooms) {
    gameStore.game.availableRooms = rooms;
    gameStore.notify();
}

export function returnToGame() {
    gameStore.game.returnToGameAvailable = true;
    gameStore.notify();
}

export function dailyChallengeScore(score: number) {
    gameStore.game.dailyChallengeScore = score;
    gameStore.notify();
}

export function returnPlayerList(players: Player[]) {
    gameStore.game.connectedPlayers = players;
    gameStore.notify();
}

export function invite(roomName, joinCode, playerName) {
    gameStore.game.invites.push({ roomName, joinCode, playerName });
    gameStore.notify();
}

export function returnPlayerCount(playerCount: number, leaderboard) {
    gameStore.game.numPlayers = playerCount;
    gameStore.game.leaderboard = leaderboard;
    gameStore.notify();
}

// Chat
export function chatMessage(playerName: string, message: string) {
    addPlayerMessage(playerName, message);
}

export function message(message: string) {
    addServerMessage(message);
}

// In Game functions

export function returnPovinnost(povinnost: PlayerIndex) {
    if (!gameStore.game.gameState) {
        console.error("Game state is null, cannot set povinnost");
        return;
    }

    gameStore.game.gameState.povinnost = povinnost;
    gameStore.notify();
}

export function returnHand(hand: Card[], withGray: boolean) {
    if (!gameStore.game.gameState) {
        console.error("Game state is null, cannot set hand");
        return;
    }
    gameStore.game.gameState.myInfo.hand = hand;
    gameStore.game.gameState.myInfo.gray = withGray;
    gameStore.notify();
}

export function returnTable(table) {
    if (!gameStore.game.gameState) {
        console.error("Game state is null, cannot set table");
        return;
    }
    gameStore.game.gameState.currentTable.push(table);
    gameStore.notify();
}

export function returnChips(chips: number) {
    if (!gameStore.game.gameState) {
        console.error("Game state is null, cannot set chips");
        return;
    }

    gameStore.game.gameState.gamePlayers[gameStore.game.gameState.myInfo.playerNumber].chips = chips;
    addServerMessage(`You have ${chips} chips`);
    gameStore.notify();
}

export function returnPossiblePartners(possiblePartners: any) {
  if (!gameStore.game.gameState || !gameStore.game.gameState.myInfo) return;

  gameStore.game.gameState.myInfo.partners = possiblePartners;
  gameStore.notify();
}

export function returnSettings(settings: any) {
  if (!gameStore.game.gameState) return;

  gameStore.game.gameState.settings = settings;
  addServerMessage(
    `Playing on difficulty ${DIFFICULTY_TABLE[settings.difficulty]} with timeout ${settings.timeout / 1000}s, ace high ${settings.aceHigh ? "enabled" : "disabled"}`
  );
  gameStore.notify();
}

export function returnPlayersInGame(playersInGame: any[]) {
  if (!gameStore.game.gameState) return;

  gameStore.game.gameState.gamePlayers = playersInGame;
  gameStore.notify();
}

export function returnPN(playerNumber: PN, hostNumber: PN) {
  if (!gameStore.game.gameState || !gameStore.game.gameState.myInfo) return;

  gameStore.game.gameState.myInfo.playerNumber = playerNumber;
  gameStore.game.gameState.hostNumber = hostNumber;

  addServerMessage(`You are player ${playerNumber + 1}`);
  gameStore.notify();
}

export function twelveChoice(handChoices: any[]) {
  if (!gameStore.game.gameState || !gameStore.game.gameState.myInfo) return;

  gameStore.game.gameState.myInfo.handChoices = handChoices;
  addServerMessage("Please choose a hand to keep");

  gameStore.notify();
}

export function returnRoundInfo(theRoundInfo: {
  pn: PN;
  povinnost?: PlayerIndex;
  prever?: PN;
  preverMultiplier?: number;
  valat?: PN;
  contra?: number;
  iote?: PN;
  partnerCard?: string;
  moneyCards?: string[][];
  chips?: number[];
  usernames?: (string | null)[];
}) {
  if (!theRoundInfo || !gameStore.game.gameState) return;

  const state = gameStore.game.gameState;

  // Global round info
  state.povinnost = theRoundInfo.povinnost ?? state.povinnost;
  state.prever = theRoundInfo.prever ?? state.prever;
  state.preverMultiplier = theRoundInfo.preverMultiplier ?? state.preverMultiplier;
  state.valat = theRoundInfo.valat ?? state.valat;
  state.contra = theRoundInfo.contra ?? state.contra;
  state.iote = theRoundInfo.iote ?? state.iote;
  state.partnerCard = theRoundInfo.partnerCard ?? state.partnerCard;
  

  state.currentAction = null; // could be set elsewhere

  // Update per-player info
  for (let i = 0; i < state.gamePlayers.length; i++) {
    const player = state.gamePlayers[i];

    // Set chips if available
    if (theRoundInfo.chips && typeof theRoundInfo.chips[i] === "number") {
      player.chips = theRoundInfo.chips[i];
    }

    // Set usernames if available
    if (theRoundInfo.usernames) {
      player.username = theRoundInfo.usernames[i]!;
    }

    // Set moneyCards if available
    if (theRoundInfo.moneyCards && Array.isArray(theRoundInfo.moneyCards[i])) {
      player.moneycards = theRoundInfo.moneyCards[i];
    }
  }

  gameStore.notify();
}

// ----- GAME MESSAGES -----
type GameMessageHandler = (message: string, extraInfo?: any) => void;

// Helper to get my player number
const myPN = () => gameStore.game.gameState?.myInfo.playerNumber ?? -1;

// Helper for messages directed at the current player
function forMe(extraInfo: any, defaultMessage: string) {
  if (!extraInfo) return defaultMessage;
  return extraInfo.pn === myPN() && extraInfo.youMessage ? extraInfo.youMessage : defaultMessage;
}

// Handlers
function handlePovinnost(_: string, info?: any) {
  if (!info) return;
  const state = gameStore.game.gameState!;
  state.povinnost = info.pn;
  addServerMessage(info.pn === myPN() ? "You are povinnost" : _);
}

function handleDraw(_: string, info?: any) {
  if (info?.cards) gameStore.game.gameState!.myInfo.drawnCards = info.cards;
}

function handlePartner(_: string, info?: any) {
  addServerMessage(forMe(info, _));
}

function handleTrumpDiscard(_: string, info?: any) {
  if (info?.card) gameStore.game.gameState!.returnTableQueue.push([info.card]);
  addServerMessage(forMe(info, _));
}

function handleSimpleMessage(_: string, info?: any) {
  addServerMessage(forMe(info, _));
}

function handleWinner(_: string, info?: any) {
  addServerMessage(forMe(info, _));
  gameStore.game.gameState!.currentTable = [];
}

function handlePreverTalon(_: string, info?: any) {
  if (!info) return;
  const queue = gameStore.game.gameState!.returnTableQueue;
  switch (info.step) {
    case 0:
      addServerMessage("Would you like to keep these cards?");
      queue.push(info.cards);
      break;
    case 1:
    case 2:
      if (_ === "") {
        addServerMessage("Would you like to keep these cards?");
        queue.push(info.cards);
      } else if (info.pn === myPN() && info.youMessage) {
        addServerMessage(info.youMessage);
        if (info.step === 2) queue.push([]);
      } else {
        addServerMessage(_);
        queue.push(info.cards);
      }
      break;
    case 3:
      addServerMessage(forMe(info, _));
      break;
  }
}

function handlePay(_: string, info?: any) {
  if (info) {
    addServerMessage("------------------------");
    for (const p of info) addServerMessage(`${p.name}: ${p.value}`);
    addServerMessage("------------------------");
  }
  addServerMessage(_);
}

function handleNotation(_: string, info?: any) {
  addServerMessage(
    `Game save code: ${_};pn=${playerPerspective(myPN(), info?.povinnost)}`
  );
}

function handleDefault(message: string) {
  addServerMessage(`Game message of unknown type`);
  addServerMessage(message);
}

// Handler map
const handlers: Record<MESSAGE_TYPE, GameMessageHandler> = {
  [MESSAGE_TYPE.POVINNOST]: handlePovinnost,
  [MESSAGE_TYPE.DRAW]: handleDraw,
  [MESSAGE_TYPE.PARTNER]: handlePartner,
  [MESSAGE_TYPE.TRUMP_DISCARD]: handleTrumpDiscard,
  [MESSAGE_TYPE.MONEY_CARDS]: handleSimpleMessage,
  [MESSAGE_TYPE.VALAT]: handleSimpleMessage,
  [MESSAGE_TYPE.IOTE]: handleSimpleMessage,
  [MESSAGE_TYPE.CONTRA]: handleSimpleMessage,
  [MESSAGE_TYPE.CUT]: handleSimpleMessage,
  [MESSAGE_TYPE.LEAD]: () => {},
  [MESSAGE_TYPE.PLAY]: () => {},
  [MESSAGE_TYPE.WINNER]: handleWinner,
  [MESSAGE_TYPE.PREVER_TALON]: handlePreverTalon,
  [MESSAGE_TYPE.PAY]: handlePay,
  [MESSAGE_TYPE.CONNECT]: handleSimpleMessage,
  [MESSAGE_TYPE.DISCONNECT]: handleSimpleMessage,
  [MESSAGE_TYPE.SETTING]: handleSimpleMessage,
  [MESSAGE_TYPE.NOTATION]: handleNotation
};

export function handleGameMessage(message: string, type: MESSAGE_TYPE, extraInfo?: any) {
  const handler = handlers[type] ?? handleDefault;
  handler(message, extraInfo);
  gameStore.notify();
}

// ----- END GAME MESSAGES -----

