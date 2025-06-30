/*
    Verifier is here to verify that actions taken by players are legal
*/

import Client from "./RoomClient";
import { card, nextStep, t_value } from "./types";
import Deck from "./Deck";
import RoomManager from "./RoomManager";

const room = RoomManager.room;

const { ACTION, SHUFFLE_TYPE, CUT_TYPE } = require('./enums');



const { u } = require('./utils');

export function isNumericalType(arg: number) {
    return !u(arg) && !isNaN(+arg);
}

export function clientAvailableForGame(client: Client) {
    return !u(client) && client && !client.inGame && !client.inAudience;
}

export function clientIsHost(client: Client) {
    return !u(client) && client && client.inGame && room && ~room.host && room.host === client.socketId;
}

export function clientIsPovinnost(client: Client) {
    return !u(client) && client && client.inGame && room && room.board && room.board.povinnost && room.board.povinnost === client.pn;
}

export function roomNextStep(client: Client, action: nextStep) {
    return !u(client) && client && client.inGame && room && room.board && room.board.nextStep && room.board.nextStep.action === action;
}

export function clientIsCurrentPlayer(client: Client) {
    return !u(client) && client && client.inGame && room && room.board && room.board.nextStep && Number(room.board.nextStep.player) === Number(client.pn);
}

export function notNegativeOne(number: number) {
    return !u(number) && !isNaN(+number) && ~(+number);
}

export function isString(string: string) {
    return typeof string === 'string';
}

export function verifyIsAdmin(client: Client) {
    return !u(client) && client && client.username && client.username !== 'Guest' && client.userInfo && client.userInfo.admin;
}

export function verifyCardStructure(card: card) {
    return !u(card) && card && card.suit && card.value && typeof card.suit === 'string' && typeof card.value === 'string';
}

export function verifyCanPlayDailyChallenge(client: Client) {
    const clientIsValid = clientAvailableForGame(client);

    return clientIsValid && client.username !== 'Guest';
}

export function verifyCanMakeRoom(client: Client) {
    return clientAvailableForGame(client);
}

export function verifyCanReturnToGame(client: Client) {
    const clientIsValid = clientAvailableForGame(client);

    return gm.returnToGame[client.socketId] && clientIsValid;
}

export function verifyPlayerCanChangeSettings(client: Client) {
    const clientIsValid = clientIsHost(client);
    const roomIsValid = roomNextStep(client, ACTION.START);

    // Setting and rule verified in room

    return clientIsValid && roomIsValid;
}

export function verifyCanSendInvite(client: Client, socketId: number) {
    const clientIsValid = roomNextStep(client, ACTION.START);
    const socketIsValid = notNegativeOne(socketId) && gm.players[socketId];

    return clientIsValid && socketIsValid;
}

export function verifyCanStartGame(client: Client) {
    const clientIsValid = roomNextStep(client, ACTION.START) && clientIsHost(client);

    return clientIsValid;
}

export function verifyPlayerCanTakeAction(client: Client, action: nextStep) {
    const clientIsValid = roomNextStep(client, action);
    const clientIsPlayer = clientIsCurrentPlayer(client);

    return clientIsValid && clientIsPlayer;
}

export function verifyCanDiscard(client: Client, card: card) {
    return verifyCardStructure(card) && Deck.handContainsNonGray(client.hand, card.value, card.suit);
}

export function verifyPlayerCanPlayCard(client: Client, card: card) {
    return verifyCanDiscard(client, card); // Same logic
}

export function verifyPartnerChoice(client: Client, partner: t_value) {
    const partnerChoices = Deck.possiblePartners(client.hand);

    return isString(partner as string) && partnerChoices.some(p => p.value === partner);
}

export function verifyPlayerCanTakeContraAction(client: Client) {
    const clientIsValid = roomNextStep(client, ACTION.CONTRA)
        || roomNextStep(client, ACTION.PREVER_CONTRA)
        || roomNextStep(client, ACTION.VALAT_CONTRA)
        || roomNextStep(client, ACTION.PREVER_VALAT_CONTRA);
    const clientIsPlayer = clientIsCurrentPlayer(client);

    return clientIsValid && clientIsPlayer;
}

export function verifyCredentials(username: string, token: string) {
    // Not meant to verify that they go together, but that they are the right structure

    const usernameIsValid = !u(username) && typeof username === 'string';
    const tokenIsValid = !u(token) && typeof token === 'string';

    return usernameIsValid && tokenIsValid;
}

/* TODO: Add RoomManager client list
export function verifyCanSendMessageTo(id) {
    return notNegativeOne(id) && gm.players[id];
}
*/


export function verifyCanSendMessage(client: Client) {
    SERVER.debug(client.username);
    SERVER.debug(client.canSendMessage());
    SERVER.debug(client.timeLastMessageSent);
    return !u(client) && client.username && client.username !== 'Guest' && client.canSendMessage();
}

export function verifyCanSaveSettings(client: Client) {
    const isValid = !u(client) && client.username && client.username !== 'Guest'
        && client.inGame && room && room.settingsNotation;

    return isValid;
}

export function sanitizeShuffleType(type: number) {
    if (u(type) || !type || isNaN(Number(type)) || Number(type) == SHUFFLE_TYPE.CUT) {
        return SHUFFLE_TYPE.CUT;
    }

    if (Number(type) == SHUFFLE_TYPE.RIFFLE) {
        return SHUFFLE_TYPE.RIFFLE;
    }

    return SHUFFLE_TYPE.RANDOM;
}

export function sanitizeCutStyle(style: string) {
    if (u(style) || !style || style == CUT_TYPE.CUT) {
        return CUT_TYPE.CUT;
    }

    switch (style) {
        case CUT_TYPE.ONES:             return CUT_TYPE.ONES;
        case CUT_TYPE.TWOS:             return CUT_TYPE.TWOS;
        case CUT_TYPE.THREES:           return CUT_TYPE.THREES;
        case CUT_TYPE.FOURS:            return CUT_TYPE.FOURS;
        case CUT_TYPE.SIXES:            return CUT_TYPE.SIXES;
        case CUT_TYPE.TWELVES:          return CUT_TYPE.TWELVES;
        case CUT_TYPE.TWELVE_STRAIGHT:  return CUT_TYPE.TWELVE_STRAIGHT;
        case CUT_TYPE.THREE_FOUR_FIVE:  return CUT_TYPE.THREE_FOUR_FIVE;
        default: return CUT_TYPE.CUT;
    }
}

export function sanitizeCutLocation(location: number) {
    if (u(location) || isNaN(Number(location))) {
        return 32;
    }

    location = Number(location);

    if (location <= 7) {
        return 7;
    }

    if (location >= 47) {
        return 47;
    }

    return location;
}

export function sanitizeHandChoice(client: Client, choice: number) {
    if (!isNumericalType(choice)) {
        choice = 0;
    } else {
        choice -= 1;
    }

    if (room.board.hands[choice]) {
        return choice;
    }

    for (let i in room.board.hands) {
        if (room.board.hands[i]) {
            return i;
        }
    }

    return -1;
}

export function sanitizeDrawTalonChoice(client: Client, choice: t_value) {
    if (clientIsPovinnost(client)) {
        return true;
    }

    return choice;
}

export function sanitizeBoolean(bool: boolean) {
    return !(!bool);
}

export function sanitizeMessage(message: string) {
    if (typeof message !== 'string') {
        return '';
    }

    return message.replace(/[\u0000-\u001F\u007F-\u009F\u061C\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, "");
}