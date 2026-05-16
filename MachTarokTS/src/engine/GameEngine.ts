import { TableCard } from '@/types';
import { gameStore } from './GameStore';

export function shiftFirstInvite(): { roomName: string, joinCode: string, playerName: string } {
  return gameStore.game.invites.shift();
}

export function shiftTableQueue() {
  const move: TableCard[] | undefined = gameStore.game.gameState.tableQueue.shift();
  gameStore.game.gameState.currentTable = move;
}

export function clearDiscardedTrump() {
  delete gameStore.game.gameState.trumpDiscard;
}

export function clearPreverTalon() {
  delete gameStore.game.gameState.preverTalon;
  delete gameStore.game.gameState.rejectedPreverTalon;
}