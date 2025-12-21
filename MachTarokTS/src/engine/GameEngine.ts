import { gameStore } from './GameStore';

export function shiftFirstInvite(): { roomName: string, joinCode: string, playerName: string } {
  return gameStore.game.invites.shift();
}