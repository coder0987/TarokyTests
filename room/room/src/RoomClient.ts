/**
 * Client represents an ongoing connection
 * Someone, somewhere, is tied to each specific client
 * gm.players is a list of Clients
 */
const RATE_LIMIT = 1; // Players must wait 1 second between messages

const GameManager = require('./GameManager');
const gm = GameManager.INSTANCE;

const { DISCONNECT_TIMEOUT, ACTION, SENSITIVE_ACTIONS, ROOM_TYPE } = require('./enums');
import  Deck from './Deck';
import  SERVER from './logger';
import { Socket } from 'socket.io';
import { 
    verifyPlayerCanChangeSettings, 
    verifyCanSendInvite, 
    verifyCanStartGame, 
    verifyPlayerCanTakeAction, 
    sanitizeShuffleType, 
    sanitizeBoolean, 
    sanitizeCutStyle, 
    sanitizeCutLocation, 
    sanitizeHandChoice, 
    sanitizeDrawTalonChoice, 
    verifyPartnerChoice, 
    verifyCanDiscard, 
    verifyPlayerCanTakeContraAction, 
    verifyPlayerCanPlayCard, 
    verifyCredentials, 
    verifyCanSendMessage, 
    verifyRoomExists, 
    verifyCanSendMessageTo, 
    verifyCanSaveSettings, 
    verifyIsAdmin,
    sanitizeMessage
} from './verifier';
import { card, nextStep, t_value, userInfo } from './types';
import RoomManager from './RoomManager';

const room = RoomManager.room;

const { notationToObject } = require('./notation');
const Auth = require('./Auth');
const Database = require('./database');

export default class Client {
    #timeLastMessageSent: number | undefined;
    #socket: Socket;
    #socketId: number;
    #disconnectTimeout: NodeJS.Timeout | undefined;

    #pid = -1;
    #pn = -1;

    #inAudience = false;
    #inGame = false;

    #tempDisconnect = false;

    #username = 'Guest';
    #token = -1;
    #userInfo: userInfo = { avatar: 0 };

    constructor(args: { id: number, socket: Socket}) {
        this.#socketId = args.id || -1;
        this.#socket = args.socket || null;
        this.updateLastMessageSentTime();
    }

    // Client-server interactions
    disconnect() {
        SERVER.log(`Player ${this.socketId} disconnected`);

        // TODO: actually disconnect :)
    }

    playerDisconnectTimeout() {
        // Runs a few seconds after a player disconnects
        if (this.tempDisconnect || typeof this.#socketId === 'undefined') {
            this.disconnect();
            return;
        }
        SERVER.log(`Player ${this.socketId} didn't disconnect after all`);
    }

    startDisconnectTimeout() {
        this.#disconnectTimeout = setTimeout(() => {this.playerDisconnectTimeout()}, DISCONNECT_TIMEOUT);
    }

    stopDisconnectTimeout() {
        clearTimeout(this.#disconnectTimeout);
    }

    autoReconnect() {
        // Gather game information and send it to the client
        this.stopDisconnectTimeout();

        const reconnectInfo = {};
        this.gatherUserInfo(reconnectInfo);
        this.gatherAudienceInfo(reconnectInfo);
        this.gatherGameInfo(reconnectInfo);

        //SERVER.debug(JSON.stringify(room));
        SERVER.debug(JSON.stringify(this.nextStep));

        this.#socket.emit('autoReconnect', reconnectInfo);
    }

    gatherUserInfo( obj: any ) {
        if (this.#username === 'Guest') {
            return;
        }
        obj.username = this.#username;
        obj.dailyChallengeScore = gm.challenge.getUserScore(this.#username);
        obj.elo             = this.userInfo?.elo;
        obj.admin           = this.userInfo?.admin;
        obj.defaultSettings = notationToObject(this.userInfo?.settings).object;
        obj.chat            = this.userInfo?.chat;
        obj.avatar          = this.userInfo?.avatar;
        obj.deck            = this.userInfo?.deck;
    }

    gatherAudienceInfo( obj: any ) {
        if (!this.#inAudience) {
            return;
        }

        obj.roundInfo = room.board.importantInfo;
    }

    gatherGameInfo( obj: any ) {
        if (!this.#inGame) {
            return;
        }

        obj.pn = this.#pn;
        obj.host = {
            number: room.hostPN,
            name: room.name,
            joinCode: room.joinCode
        };

        if (this.nextStep.player == this.#pn) {
            // My turn
            obj.withGray = false;

            if (this.nextStep.action === ACTION.DISCARD) {
                Deck.grayUndiscardables(this.player.hand);
                obj.withGray = true;
            } else if (this.nextStep.action === ACTION.FOLLOW) {
                Deck.grayUnplayables(this.player.hand, room.board.leadCard);
                obj.withGray = true;
            }

            // Includes sensitive actions
            obj.nextAction = this.nextStep;
        }
        
        obj.hand = [...Deck.sortCards(this.player.hand, room.settings.aceHigh)];

        // Important info
        obj.roundInfo = structuredClone(room.board.importantInfo);
        obj.roundInfo.pn = +this.#pn + 1;

        obj.settings = room.settings.object;
        if (this.nextStep.action !== ACTION.SHUFFLE) {
            obj.table = room.board.table;
        }
        if (!SENSITIVE_ACTIONS[this.nextStep.action]) {
            obj.nextAction = this.nextStep;
        }

        obj.playersInGame = room.playersInGame;
        obj.povinnost = room.board.povinnost;
    }

    handleReconnect() {
        SERVER.debug(`Player ${this.#socketId} auto-reconnected`);
        this.#socket.emit('message','You have been automatically reconnected');//debug

        this.#tempDisconnect = false;
        this.autoReconnect();
    }

    handleDisconnect() {
        this.stopDisconnectTimeout();
        this.startDisconnectTimeout();

        this.#tempDisconnect = true;

        SERVER.debug(`Player ${this.#socketId} may have disconnected`);
    }

    handleExitRoom() {
        this.stopDisconnectTimeout()
        this.disconnect();
    }

    handleAlive(callback: (alive: boolean) => {}) {
        callback(!this.#tempDisconnect);
    }

    handleCurrentAction() {
        SERVER.debug(`Player ${this.socketId} sent a ping`);
        this.autoReconnect();
    }

    handleChangeSettings(setting: string, rule: any) {
        if (!verifyPlayerCanChangeSettings(this, setting, rule)) {
            SERVER.debug(`Player ${this.#socketId} attempted to edit settings illegally`);
            return;
        }

        let message;
        switch (setting) {
            case 'difficulty':
                message = room.settings.changeDifficulty(rule);
                break;
            case 'timeout':
                message = room.settings.changeTimeout(rule);
                break;
            case 'aceHigh':
                message = room.settings.changeAceHigh(rule);
                break;
            case 'lock':
                message = room.settings.changeLock(rule);
                break;
            case 'botPlayTime':
                message = room.settings.changeBotPlayTime(rule);
                break;
            case 'botThinkTime':
                message = room.settings.changeBotThinkTime(rule);
                break;
            default:
                message = null;
                SERVER.log(`Nonexistent rule: ${setting}`);
        }

        room.settingsUpdate(message);

        room.informSettings();
    }

    handleGetPlayers() {
        this.#socket.emit('returnPlayerList', gm.getPlayerList(this.#socketId));
    }

    handleSendInvite(socketId: number) {
        if (!verifyCanSendInvite(this, socketId)) {
            return;
        }

        SERVER.log(`${this.#socketId} sent an invite to ${socketId}`);
        gm.players[socketId].socket.emit('invite', room.name, room.joinCode, this.#username);
    }

    handleStartGame() {
        if (!verifyCanStartGame(this)) {
            this.#socket.emit('nextAction', this.nextStep);
            return;
        }

        room.gameplay.actionCallback();
    }

    handlePlayerTakeAction(action: nextStep) {
        if (!verifyPlayerCanTakeAction(this, action)) {
            return;
        }

        room.gameplay.actionCallback();
    }

    handlePlayerShuffle(type: string, again: boolean) {
        if (!verifyPlayerCanTakeAction(this, ACTION.SHUFFLE)) {
            SERVER.debug('Shuffle rejected');
            return;
        }

        type = sanitizeShuffleType(type);
        again = sanitizeBoolean(again);

        this.nextStep.info.type = type;
        this.nextStep.info.again = again;

        room.gameplay.actionCallback();
    }

    handlePlayerCut(style: string, location: number) {
        if (!verifyPlayerCanTakeAction(this, ACTION.CUT)) {
            return;
        }

        style = sanitizeCutStyle(style);
        location = sanitizeCutLocation(location);

        this.nextStep.info.style = style;
        this.nextStep.info.location = location;

        room.gameplay.actionCallback();
    }

    handleChooseHand(choice: number) {
        if (!verifyPlayerCanTakeAction(this, ACTION.CHOICE)) {
            return;
        }

        choice = sanitizeHandChoice(this, choice);

        this.nextStep.info.choice = choice;

        room.gameplay.actionCallback();
    }

    handlePrever(choice: boolean) {
        if (!verifyPlayerCanTakeAction(this, ACTION.PREVER)) {
            return;
        }

        this.nextStep.action = choice ? 'callPrever' : 'passPrever';

        room.gameplay.actionCallback();
    }

    handleTalon(choice: boolean) {
        if (!verifyPlayerCanTakeAction(this, ACTION.DRAW_TALON)) {
            return;
        }

        choice = sanitizeDrawTalonChoice(this, choice);

        this.nextStep.action = choice ? 'drawTalon' : 'passTalon';

        room.gameplay.actionCallback();
    }

    handleDiscard(card: card) {
        if (!verifyPlayerCanTakeAction(this, ACTION.DISCARD) || !verifyCanDiscard(this, card)) {
            this.socket.emit('failedDiscard', card);
            return;
        }

        this.nextStep.info.card = { suit: card.suit, value: card.value };

        room.gameplay.actionCallback();
    }

    handleBidaUni(choice: boolean) {
        if (!verifyPlayerCanTakeAction(this, ACTION.POVINNOST_BIDA_UNI_CHOICE)) {
            return;
        }

        this.nextStep.info.choice = choice;

        room.gameplay.actionCallback();
    }

    handleChoosePartner(partner: t_value) {
        if (!verifyPlayerCanTakeAction(this, ACTION.PARTNER) || !verifyPartnerChoice(this, partner)) {
            return;
        }

        SERVER.debug(`${this.#socketId} is playing with ${partner}`, room.name);

        this.nextStep.info.partnerCard = partner;

        room.gameplay.actionCallback();
    }

    handlePreverTalon(choice: boolean) {
        if (!verifyPlayerCanTakeAction(this, ACTION.DRAW_PREVER_TALON)) {
            return;
        }

        this.nextStep.info.accept = choice;

        room.gameplay.actionCallback();
    }

    handleValat(choice: boolean) {
        if (!verifyPlayerCanTakeAction(this, ACTION.VALAT)) {
            return;
        }

        this.nextStep.info.valat = choice;

        room.gameplay.actionCallback();
    }

    handleContra(choice: boolean) {
        if (!verifyPlayerCanTakeContraAction(this)) {
            return;
        }

        this.nextStep.info.contra = choice;

        room.gameplay.actionCallback();
    }

    handleIOTE(choice: boolean) {
        if (!verifyPlayerCanTakeAction(this, ACTION.IOTE)) {
            return;
        }

        this.nextStep.info.iote = choice;

        room.gameplay.actionCallback();
    }

    handlePlayCard(card: card) {
        if (this.nextStep?.action === ACTION.LEAD) {
            this.handleLead(card);
        } else if (this.nextStep?.action === ACTION.FOLLOW) {
            this.handleFollow(card);
        }
    }

    handleLead(card: card) {
        if (!verifyPlayerCanTakeAction(this, ACTION.LEAD) || !verifyPlayerCanPlayCard(this, card)) {
            this.socket.emit('failedLead', card);
            SERVER.debug(`Player ${this.#socketId} failed to lead a card`);
            return;
        }

        this.nextStep.info.card = { suit: card.suit, value: card.value };

        room.gameplay.actionCallback();
    }

    handleFollow(card: card) {
        if (!verifyPlayerCanTakeAction(this, ACTION.FOLLOW) || !verifyPlayerCanPlayCard(this, card)) {
            SERVER.debug(`Player ${this.#socketId} failed to follow with card`);
            this.socket.emit('failedFollow', card);
            return;
        }

        this.nextStep.info.card = { suit: card.suit, value: card.value };

        room.gameplay.actionCallback();
    }

    // User account tools
    handleLogin(username: string, token: string) {
        SERVER.log(`User ${this.#socketId} is attempting to sign in`);

        if (!verifyCredentials(username, token)) {
            SERVER.log('Illegal credentials: username or token is the incorrect type');
            return;
        }
        Auth.attemptSignIn(username, token, this.socket, this.socketId);
    }

    handleLogout() {
        this.#username = 'Guest';
        this.#token = -1;
        this.#userInfo = { avatar: 0 };
        this.#socket.emit('logout');
        SERVER.log(`Player ${this.#socketId} has signed out`);
    }

    handleSaveSettings() {
        if (!verifyCanSaveSettings(this)) {
            SERVER.log(`${this.#socketId} failed to save new default settings`);
            return;
        }

        Database.saveSettings(this.#username, room.settingsNotation);
        this.#userInfo.settings = room.settingsNotation;
        this.#socket.emit('defaultSettings', notationToObject(room.settingsNotation).object);
        SERVER.log('Default settings saved for user ' + this.#username + ': ' + room.settingsNotation);
    }

    // Chat message
    sendChat(message: string) {
        if (!verifyCanSendMessage(this)) {
            return;
        }

        message = sanitizeMessage(message);

        SERVER.log(`Player ${this.#username} sent "${message}" in the chat`);

        room.sendChatMessage(this.#username, message);

        this.updateLastMessageSentTime();
    }

    sync() {
        this.#socket.emit('timeSync', Date.now());
    }

    canSendMessage() {
        return ((Date.now() - (this.#timeLastMessageSent || 0)) > RATE_LIMIT * 1000);
    }

    updateLastMessageSentTime() {
        this.#timeLastMessageSent = Date.now();
    }

    // Getters
    get socket() {
        return this.#socket;
    }

    get socketId() {
        return this.#socketId;
    }

    get timeLastMessageSent() {
        return this.#timeLastMessageSent;
    }

    get pid() {
        return this.#pid;
    }

    get inGame() {
        return this.#inGame;
    }

    get inAudience() {
        return this.#inAudience;
    }

    get pn() {
        return this.#pn;
    }

    get tempDisconnect() {
        return this.#tempDisconnect;
    }

    get username() {
        return this.#username;
    }

    get avatar() {
        return this.#userInfo.avatar;
    }

    get token() {
        return this.#token;
    }

    get userInfo() {
        return this.#userInfo;
    }

    get player() {
        return room?.players[this.#pn];
    }

    get nextStep() {
        return room?.board.nextStep;
    }

    get hand() {
        return this.player?.hand;
    }

    get settings() {
        return notationToObject(this.#userInfo.settings);
    }

    // Setters
    set socket(socket) {
        this.#socket = socket;
    }

    set socketId(socketId) {
        this.#socketId = socketId;
    }

    set timeLastMessageSent(time) {
        this.#timeLastMessageSent = time;
    }

    set pid(pid) {
        this.#pid = pid;
    }

    set pn(pn) {
        this.#pn = pn;
    }

    set tempDisconnect(tempDisconnect) {
        this.#tempDisconnect = tempDisconnect;
    }

    set username(username) {
        this.#username = username;
    }

    set token(token) {
        this.#token = token;
    }

    set userInfo(userInfo) {
        this.#userInfo = userInfo;
    }
}
