import { settings, t_seat } from "./types";

const RobotPlayer = require('./Player/RobotPlayer.js');
const Deck = require('./deck.js');
const GamePlay = require('./GamePlay.js');
const GameManager = require('./GameManager.js');
const SERVER = require('./logger.js');
const {PLAYER_TYPE, MESSAGE_TYPE, SENSITIVE_ACTIONS} = require('./enums.js');
const {playerOffset} = require('./utils');
const {cardsToNotation} = require('./notation');
const HumanPlayer = require('./Player/HumanPlayer.js');

import Settings from './Settings';
import Board from './Board';

let iterator = 100000;

export default class Room {
    #gameplay;
    #settings: Settings;
    #joinCode: string;
    #host: number;
    #hostPN: t_seat;
    #board: Board;
    #playerCount: number;
    #players: player[];

    constructor() {
        this.#settings = new Settings();
        this.#joinCode = Room.createJoinCode();
        this.#host = -1;
        this.#hostPN = -1;
        this.#board = new Board();
        this.#playerCount = 0;
        this.#deck = deck;
        this.#players = [new RobotPlayer({room: this}), new RobotPlayer({room: this}), new RobotPlayer({room: this}), new RobotPlayer({room: this})];
        this.#autoAction = 0;
        this.#logLevel = logLevel;//0: none, 1: errors, 2: warn, 3: info, 4: debug logs, 5: trace
        this.#audience = {};
        this.#audienceCount = 0;
        this.#roomType = roomType;

        this.#stopAtEnd = stop;
        this.#botCutChoice = botCutChoice;
        this.#botCutLoc = botCutLoc;

        this.#gameplay = new GamePlay(this);

        if (args.started) {
            this.jumpStart(args.povinnost);
        }
    }

    jumpStart(pov) {
        this.gameNumber = 1;
        this.#board.nextStep.action = 'shuffle';
        this.#board.nextStep.player = pov;//povinnost shuffles
    }

    playToEnd() {
        this.#stopAtEnd = true;
        this.gameplay.autoAction();
    }

    resetForNextRound() {
        this.#board.resetForNextRound();
        for (let i in this.#players) {
            this.#players[i].resetForNextRound();
        }
        if (this.#deck.deck.length != 54) {
            SERVER.error("Whoops! The deck has the wrong number of cards.");
            console.log(this.#deck.deck);
            this.#deck = new Deck();
        }
    }

    informPlayers(message, messageType, extraInfo, pn) {
        SERVER.debug('informPlayers() called with message | ' + message + ' | messageType | ' + messageType + ' | extraInfo | ' + JSON.stringify(extraInfo) + ' | pn | ' + pn);
        for (let i in this.#players) {
            if (this.#players[i].type == PLAYER#TYPE.HUMAN) {
                if (typeof pn != 'undefined' && this.#players[pn]) {
                    if (pn == i) {
                        //Handled by youMessage
                        this.#players[i].messenger.emit('gameMessage','You ' + message,messageType,extraInfo);
                    } else {
                        if (this.#players[i].messenger && this.#players[pn].type === PLAYER#TYPE.HUMAN && this.#players[pn].username != 'Guest') {
                            this.#players[i].messenger.emit('gameMessage', this.#players[pn].username + ' ' + message, messageType, extraInfo);
                        } else {
                            pn = +pn;
                            this.#players[i].messenger.emit('gameMessage','Player ' + (pn+1) + ' ' + message, messageType, extraInfo);
                        }
                    }
                } else {
                    this.#players[i].messenger.emit('gameMessage',message,messageType,extraInfo);
                }
            }
        }
        for (let i in this.#audience) {
            if (typeof pn != 'undefined') {
                if (pn != -1 && this.#players[pn].socket != -1 && players[this.#players[pn].socket].username != 'Guest') {
                    this.#audience[i].messenger.emit('gameMessage', players[this.#players[pn].socket].username + ' ' + message,messageType,extraInfo);
                } else {
                    pn = +pn;
                    this.#audience[i].messenger.emit('gameMessage','Player ' + (pn+1) + ' ' + message,messageType,extraInfo);
                }
            } else {
                this.#audience[i].messenger.emit('gameMessage',message,messageType,extraInfo);
            }
        }
    }

    informPlayer(pn, message, messageType, extraInfo) {
        SERVER.debug('informPlayer() called with message | ' + message + ' | messageType | ' + messageType + ' | extraInfo | ' + JSON.stringify(extraInfo) + ' | pn | ' + pn);
        if (this.#players[pn].type == PLAYER#TYPE.HUMAN) {
            this.#players[pn].messenger.emit('gameMessage', message, messageType, extraInfo);
        }
    }

    sendAllPlayers(messageType, message) {
        for (let i in this.#players) {
            if (this.#players[i].messenger) {
                this.#players[i].messenger.emit(messageType, message);
            }
        }
    }

    sendAudience(messageType, message) {
        for (let i in this.#audience) {
            if (this.#audience[i].messenger) {
                this.#audience[i].messenger.emit(messageType, message);
            }
        }
    }

    sendTable() {
        this.informTable();
    }

    notifyStartGame() {
        for (let i in this.#players) {
            if (this.#players[i].messenger) {
                this.#players[i].messenger.emit('startingGame', this.#host, i, this.#board.gameNumber, this.#settings.object);
            }
        }
    }

    updateImportantInfo() {
        this.#board.importantInfo.chips = {
            '0': this.#players[0].chips,
            '1': this.#players[1].chips,
            '2': this.#players[2].chips,
            '3': this.#players[3].chips
        };
    }

    updateImportantPreverInfo() {
        this.#board.importantInfo.prever = (this.#board.prever+1);
    }

    updateImportantPreverMultiplierInfo() {
        this.#board.importantInfo.preverMultiplier = this.#board.preverMultiplier;
    }

    updateImportantMoneyCardsInfo() {
        this.#board.importantInfo.chips = {
            '0': this.#players[0].chips,
            '1': this.#players[1].chips,
            '2': this.#players[2].chips,
            '3': this.#players[3].chips
        }
        this.#board.importantInfo.moneyCards = this.#board.moneyCards;
    }

    updateImportantUsernamesInfo() {
        this.#board.importantInfo.usernames = {'0':null, '1':null, '2':null, '3':null};
        for (let i in this.#players) {
            if (this.#players[i].username && this.#players[i].username != 'Guest') {
                this.#board.importantInfo.usernames[i] = this.#players[i].username;
            }
        }
    }

    updatePartnerCardInfo() {
        this.#board.importantInfo.partnerCard = this.#board.partnerCard;
    }

    updateImportantValatInfo() {
        this.#board.importantInfo.valat = this.#board.valat + 1;
    }

    updateImportantIOTEInfo() {
        this.#board.importantInfo.iote = this.#board.iote + 1;
    }

    updateImportantContraInfo() {
        this.#board.importantInfo.contra = Math.pow(2,
                ~this.#board.contra[0] ? this.#board.contra[0] +
                (~this.#board.contra[1] ? this.#board.contra[1] : 0) : 0);
    }

    updateTrickHistory(pn) {
        this.#board.trickHistory.push(
            {
                leadPlayer: this.#board.leadPlayer,
                winner: pn,
                cards: [
                    {suit: this.#board.table[0].suit, value: this.#board.table[0].value},
                    {suit: this.#board.table[1].suit, value: this.#board.table[1].value},
                    {suit: this.#board.table[2].suit, value: this.#board.table[2].value},
                    {suit: this.#board.table[3].suit, value: this.#board.table[3].value}
                ]
            }
        );
    }

    payMoneyCards(pn, owedChips) {
        for (let i in this.#players) {
            if (i == pn) {
                this.#players[i].chips += 3 * owedChips;
            } else {
                this.#players[i].chips -= owedChips;
            }
        }
    }

    payWinnings(team1Players, team2Players, chipsOwed) {
        for (let i in team1Players) {
            let tempChipsOwed = chipsOwed;
            if (team1Players.length == 1) { tempChipsOwed *= 3; }
            team1Players[i].chips += tempChipsOwed;
        }

        for (let i in team2Players) {
            let tempChipsOwed = chipsOwed;
            if (team2Players.length == 1) { tempChipsOwed *= 3; }
            team2Players[i].chips -= tempChipsOwed;
        }
    }

    updateDealNotation() {
        this.#board.importantInfo.povinnost = (this.#board.povinnost+1);
        this.#board.notation = ''   + this.#players[             this.#board.povinnost].chips + '/'
                                    + this.#players[playerOffset(this.#board.povinnost,1)].chips + '/'
                                    + this.#players[playerOffset(this.#board.povinnost,2)].chips + '/'
                                    + this.#players[playerOffset(this.#board.povinnost,3)].chips + '/'
                                    + cardsToNotation(this.#players[playerOffset(this.#board.povinnost,0)].hand) + '/'
                                    + cardsToNotation(this.#players[playerOffset(this.#board.povinnost,1)].hand) + '/'
                                    + cardsToNotation(this.#players[playerOffset(this.#board.povinnost,2)].hand) + '/'
                                    + cardsToNotation(this.#players[playerOffset(this.#board.povinnost,3)].hand) + '/'
                                    + cardsToNotation(this.#board.talon) + '/';
        
        this.setSettingsNotation(this);

        SERVER.log(this.#board.notation);
    }

    prepReturnToGame() {
        for (let i in this.#players) {
            if (this.#players[i].socket != -1) {
                GameManager.INSTANCE.returnToGame[this.#players[i].socket] = {notation: this.#board.notation + this.settingsNotation, povinnost: this.#board.povinnost, pn: i};
            }
        }
    }

    resetAutoAction() {
        if (this.#autoAction) {
            clearTimeout(this.#autoAction);
        }
        if (this.#settings.timeout > 0) {
            this.#autoAction = setTimeout(() => this.gameplay.autoAction(), this.#settings.timeout);
        }
    }

    informPlayersInGame() {
        this.sendAllPlayers('returnPlayersInGame', this.playersInGame);
    }

    informSettings() {
        SERVER.debug(`Sending settings ${JSON.stringify(this.#settings.object)} to players`, this.#name);
        this.sendAllPlayers('returnSettings', this.#settings.object);
    }

    informActionTaken() {
        this.sendAudience('returnRoundInfo', this.#board.importantInfo);

        for (let i in this.#players) {
            if (this.#players[i].messenger) {
                this.#board.importantInfo.pn = (+i+1);
                this.#players[i].messenger.emit('returnHand', Deck.sortCards(this.#players[i].hand, this.#settings.aceHigh), false);
                this.#players[i].messenger.emit('returnRoundInfo', this.#board.importantInfo);
                this.#board.importantInfo.pn = null;
            }
        }
    }

    informNextAction() {
        if (!this.#board.nextStep.info) {
            this.#board.nextStep.info = {};
        }

        const action = { ... this.#board.nextStep };
        action.info = {}; // shallow copy, doesn't affect original

        if (this.#board.nextStep.info.possiblePartners) {
            // Preserve possible partners
            action.info.possiblePartners = this.#board.nextStep.info.possiblePartners;
        }

        if (SENSITIVE#ACTIONS[action.action]) {
            const pn = action.player;
            if (this.#players[pn].messenger) {
                this.#players[pn].messenger.emit('nextAction', action);
            }
            
            return;
        }

        this.sendAllPlayers('nextAction', action);
        this.sendAudience('nextAction', action);
    }

    informCutChoice(pn, cutType) {
        SERVER.debug('Cut choice: ' + cutType, this.#name, this.#name);
        this.informPlayers('cut by ' + cutType, MESSAGE#TYPE.CUT, { pn: pn }, pn);
    }

    informPovinnost() {
        SERVER.debug('Povinnost is ' + this.#board.povinnost, this.#name, this.#name);
        this.informPlayers('is povinnost', MESSAGE#TYPE.POVINNOST, { 'pn': this.#board.povinnost }, this.#board.povinnost);
    }

    informDrawTalon(pn, numCards) {
        this.informPlayer(pn, '', MESSAGE#TYPE.DRAW, {'cards': this.#board.talon.slice(0,numCards)});
    }

    informPreverTalon(pn, step) {
        this.informPlayer(pn, '', MESSAGE#TYPE.PREVER#TALON,{'cards': this.#players[pn].tempHand,'step':step});
    }

    informPreverKeptFirst() {
        this.informPlayers('kept the first set of cards',MESSAGE#TYPE.PREVER#TALON,{'pn':this.#board.prever,'step':3},this.#board.prever);
    }

    informPreverRejectedFirst() {
        this.informPlayers('rejected the first set of cards',MESSAGE#TYPE.PREVER#TALON,{'cards':this.#board.publicPreverTalon,'pn':this.#board.prever,'step':1},this.#board.prever);
    }

    informPreverKeptSecond() {
        this.informPlayers('kept the second set of cards',MESSAGE#TYPE.PREVER#TALON,{'pn':this.#board.prever,'step':3},this.#board.prever);
    }

    informPreverRejectedSecond() {
        this.informPlayers('rejected the second of cards',MESSAGE#TYPE.PREVER#TALON,{'cards':this.#board.publicPreverTalon.slice(3,6),'pn':this.#board.prever,'step':1},this.#board.prever);
    }

    informFailedDiscard(pn, card) {
        if (this.#players[pn].messenger) {
            this.#players[pn].messenger.emit('failedDiscard', card);
        }
        if (card) {
            SERVER.warn('Player ' + pn + ' failed to discard the ' + card.value + ' of ' + card.suit, this.#name);
        }
        SERVER.warn('Failed to discard. Cards in hand: ' + JSON.stringify(this.#players[pn].hand), this.#name);
    }

    informTrumpDiscarded(pn, card) {
        this.informPlayers('discarded the ' + card.value, MESSAGE#TYPE.TRUMP#DISCARD, {pn: pn, card: card}, pn);
        
        // I'm not really sure what this code does :)
        if (this.#board.prever != -1) {
            this.#board.trumpDiscarded[0].push({suit:card.suit, value:card.value});
        } else {
            this.#board.trumpDiscarded[playerOffset(this.#board.povinnost, pn)].push({suit:card.suit, value:card.value});
        }

        // Mark it as played for the bots
        this.#board.cardsPlayed[Deck.cardId(card, this.#settings.aceHigh)] = true;
    }

    informMoneyCards(pn, moneyCards) {
        let theMessage = 'is calling ';
        let yourMoneyCards = 'You are calling ';
        let numCalled = 0;
        for (let i in moneyCards) {
            numCalled++;
            theMessage += ((numCalled>1 ? ', ' : '') + moneyCards[i]);
            yourMoneyCards += ((numCalled>1 ? ', ' : '') + moneyCards[i]);
        }
        if (numCalled == 0) {
            theMessage += 'nothing';
            yourMoneyCards += 'nothing';
        }
        this.informPlayers(theMessage, MESSAGE#TYPE.MONEY#CARDS, {youMessage: yourMoneyCards, pn: pn}, pn);
    }

    informCalledValat(pn) {
        this.informPlayers('called valat', MESSAGE#TYPE.VALAT, {pn: pn},pn);
    }

    informIOTECalled(pn) {
        this.informPlayers('called the I on the end', MESSAGE#TYPE.IOTE, {pn: pn},pn);
    }

    informCalledContra(pn) {
        this.informPlayers('called contra', MESSAGE#TYPE.CONTRA, {pn: pn}, pn);
    }

    informTable() {
        this.sendAllPlayers('returnTable', this.#board.table);
        this.sendAudience('returnTable', this.#board.table);
    }

    informPartnerCard() {
        this.informPlayers('(Povinnost) is playing with the ' + this.#board.partnerCard, MESSAGE#TYPE.PARTNER, 
            {youMessage: 'You are playing with the ' + this.#board.partnerCard, pn: this.#board.nextStep.player}, this.#board.nextStep.player);
    }

    informCardLead(pn, card) {
        this.informPlayers('lead the ' + card.value + ' of ' + card.suit, MESSAGE#TYPE.LEAD, {pn: pn, card: card}, pn);
    }

    informCardPlayed(pn, card) {
        this.informPlayers('played the ' + card.value + ' of ' + card.suit, MESSAGE#TYPE.PLAY, {pn: pn, card: card}, pn);
    }

    informWonTrick(trickWinner) {
        this.informPlayers( 'won the trick', MESSAGE#TYPE.WINNER, {pn: trickWinner},trickWinner );
    }

    informFinalPoints(team1Players, team2Players, chipsOwed, pointCountMessageTable) {
        for (let i in team1Players) {
            let tempChipsOwed = chipsOwed;
            if (team1Players.length == 1) { tempChipsOwed *= 3; }
            if (tempChipsOwed < 0) {
                this.informPlayer(team1Players[i].pn, 'Your team lost ' + (-tempChipsOwed) + ' chips', MESSAGE#TYPE.PAY, pointCountMessageTable);
            } else {
                this.informPlayer(team1Players[i].pn, 'Your team won ' + tempChipsOwed + ' chips', MESSAGE#TYPE.PAY, pointCountMessageTable);
            }
        }

        for (let i in team2Players) {
            let tempChipsOwed = chipsOwed;
            if (team2Players.length == 1) { tempChipsOwed *= 3; }
            if (tempChipsOwed < 0) {
                this.informPlayer(team2Players[i].pn, 'Your team won ' + (-tempChipsOwed) + ' chips', MESSAGE#TYPE.PAY, pointCountMessageTable);
            } else {
                this.informPlayer(team2Players[i].pn, 'Your team lost ' + tempChipsOwed + ' chips', MESSAGE#TYPE.PAY, pointCountMessageTable);
            }
        }
    }

    informGameNotation() {
        this.informPlayers(this.#board.notation + this.settingsNotation, MESSAGE#TYPE.NOTATION, {povinnost: this.#board.povinnost});
    }

    sendChatMessage(username, message) {
        for (let i in this.#players) {
            if (this.#players[i].messenger && this.#players[i].username !== username) {
                this.#players[i].messenger.emit('chatMessage', username, message);
            } 
        }
        for (let i in this.#audience) {
            if (this.#audience[i].messenger && this.#audience[i].username !== username) {
                this.#audience[i].messenger.emit('chatMessage', username, message);
            } 
        }
    }

    establishPreverTeams() {
        if (this.#board.povinnost === this.#board.prever) {
            // Povinnost called prever. Everyone is against povinnost
            for (let i=0; i<4; i++) {
                this.#players[i].isTeamPovinnost = false;
                this.#players[i].publicTeam = -1;
            }
            this.#players[this.#board.prever].isTeamPovinnost = true;
            this.#players[this.#board.prever].publicTeam = 1;
        } else {
            // Someone besides povinnost called prever. Everyone is team povinnost
            for (let i=0; i<4; i++) {
                this.#players[i].isTeamPovinnost = true;
                this.#players[i].publicTeam = 1;
            }
            this.#players[this.#board.prever].isTeamPovinnost = false;
            this.#players[this.#board.prever].publicTeam = -1;
        }
    }

    markCardsAsPlayed(listOfCards) {
        for (let i in listOfCards) {
            this.#board.cardsPlayed[Deck.cardId(listOfCards[i], this.#settings.aceHigh)] = true;
        }
    }

    ejectAudience() {
        for (let i in this.#audience) {
            this.#audience[i].messenger.emit('gameEnded');
        }
    }

    ejectPlayers() {
        for (let i in this.#players) {
            if (this.#players[i].client) {
                this.#players[i].client.ejectFromGame();
            } else if (this.#players[i].timeout) {
                this.#players[i].clearTimeout();
            }
        }
    }

    removeFromAudience(socketId) {
        if (this.#audience[socketId]) {
            this.#audience.ejectFromGame();
            delete this.#audience[socketId];
            this.audienceCount--;
        }
    }

    removeFromGame(pn) {
        if (this.#players[pn].type !== PLAYER#TYPE.HUMAN) {
            return;
        }

        const wasHost = this.#host == this.#players[pn].socketId;

        this.#players[pn] = new RobotPlayer( { room: this, old: this.#players[pn] } );
        this.#playerCount--;

        if (wasHost) {
            this.newHost();
        }

        this.informPlayers('left the room',MESSAGE#TYPE.DISCONNECT,{},pn);
        this.informPlayersInGame();
        if (this.#board.nextStep.player === pn) {
            this.gameplay.autoAction();
        }
    }

    fillSlot(client, pn) {
        client.pn = pn;

        this.#players[pn] = new HumanPlayer( { old: this.#players[pn], client: client } );
        this.#playerCount++;

        this.informPlayers('joined the game', MESSAGE#TYPE.CONNECT, {}, pn);

        if (this.debug) {
            client.socket.emit('debugRoomJoin');
        }

        this.informPlayersInGame();

        if (this.#host === -1) {
            this.#host = client.socketId;
            this.#hostPN = pn;
        }
    }

    addToGame(client) {
        const pn = this.findOpenSlot();

        this.fillSlot(client, pn);
    }

    findOpenSlot() {
        for (let i in this.#players) {
            if (this.#players[i].type !== PLAYER#TYPE.HUMAN) {
                return i;
            }
        }
        return -1;
    }

    newHost() {
        // Find a HUMAN, and designate that player as the host
        for (let i in this.#players) {
            if (this.#players[i].type === PLAYER#TYPE.HUMAN) {
                this.#host = this.#players[i].socketId;
                this.#hostPN = i;
                this.#players[i].socket.emit('roomHost');
                break;
            }
        }
    }

    addToAudience( client ) {
        this.#audience[client.socketId] = client;
        this.#audienceCount++;
    }

    setSettingsNotation() {
        this.#settings.setSettingsNotation();
    }

    settingsUpdate(message) {
        if (!message) {return;}

        SERVER.debug(message, this.#name);
        this.informPlayers(message, MESSAGE#TYPE.SETTING);
    }

    promptAction() {
        this.#players[this.#board.nextStep.player].next();
    }

    static createJoinCode() {
        iterator += Math.floor(Math.random() * 100000)+1;
        let newCode = '';
        let tempIterator = iterator;
        while (tempIterator > 0) {
            newCode += String.fromCharCode(tempIterator % 26 + 65);
            tempIterator /= 26;
            tempIterator = Math.floor(tempIterator);
        }
        return newCode;
    }

    static settingsToNotation(settings) {
        let settingNotation = '';
        for (let i in settings) {
            settingNotation += i + '=' + settings[i] + ';';
        }
        return settingNotation.substring(0,settingNotation.length - 1);
    }

    // Getters
    get gameplay() {
        return this.#gameplay;
    }

    get settings() {
        return this.#settings;
    }

    get name() {
        return this.#name;
    }

    get joinCode() {
        return this.#joinCode;
    }

    get host() {
        return this.#host;
    }

    get hostPN () {
        return this.#hostPN;
    }

    get board() {
        return this.#board;
    }

    get playerCount() {
        return this.#playerCount;
    }

    get deck() {
        return this.#deck;
    }

    get players() {
        return this.#players;
    }

    get autoAction() {
        return this.#autoAction;
    }

    get debug() {
        return this.#debug;
    }

    get settingsNotation() {
        return this.#settings.settingsNotation;
    }

    get logLevel() {
        return this.#logLevel;
    }

    get audience() {
        return this.#audience;
    }

    get audienceCount() {
        return this.#audienceCount;
    }

    get trainingRoom() {
        return this.#trainingRoom;
    }

    get trainingGoal() {
        return this.#trainingGoal;
    }

    get winner() {
        //Returns the player with the most chips. If tie, ignore it
        let highestChipsCount = 0;
        for (let i in this.#players) {
            if (this.#players[i].chips > this.#players[highestChipsCount].chips) {
                highestChipsCount = i;
            }
        }
        return this.#players[highestChipsCount];
    }

    get winnerNum() {
        //Returns the player with the most chips. If tie, ignore it
        let highestChipsCount = 0;
        for (let i in this.#players) {
            if (this.#players[i].chips > this.#players[highestChipsCount].chips) {
                highestChipsCount = i;
            }
        }
        return highestChipsCount;
    }

    get bestHandNum() {
        //Returns the player with the highest hand ranking. If tie, ignore it
        let highestHand = 0;
        for (let i in this.#players) {
            if (this.#players[i].handRank > this.#players[highestHand].handRank) {
                highestHand = i;
            }
        }
        return highestHand;
    }

    get playersInGame() {
        let playersInGameArr = [];
        for (let i in this.#players) {
            if (this.#players[i].type == PLAYER#TYPE.HUMAN) {
                playersInGameArr[i] = {
                    'name':  this.#players[i].username,
                    'avatar': this.#players[i].avatar
                };
            } else {
                playersInGameArr[i] = {
                    'name':  this.#players[i].type == PLAYER#TYPE.ROBOT ? 'Robot' : 'AI',
                    'avatar': this.#players[i].avatar
                };
            }
        }
        return playersInGameArr;
    }

    get type() {
        return this.#roomType;
    }

    get stop() {
        return this.#stopAtEnd;
    }

    get botCutChoice() {
        return this.#botCutChoice;
    }
    get botCutLoc() {
        return this.#botCutLoc;
    }

    get cutter() {
        return (this.board.povinnost + 2) % 4;// Opposite of povinnost cuts
    }

    // Setters
    set settings(settings) {
        this.#settings = settings;
    }

    set name(name) {
        this.#name = name;
    }

    set host(host) {
        this.#host = host;
    }

    set board(board) {
        this.#board = board;
    }

    set playerCount(playerCount) {
        this.#playerCount = playerCount;
    }

    set deck(deck) {
        this.#deck = deck;
    }

    set players(players) {
        this.#players = players;
    }

    set autoAction(autoAction) {
        this.#autoAction = autoAction;
    }

    set debug(debug) {
        this.#debug = debug;
    }

    set settingsNotation(sn) {
        this.#settingsNotation = sn;
    }

    set logLevel(ll) {
        this.#logLevel = ll;
    }

    set audience(audience) {
        this.#audience = audience;
    }

    set audienceCount(audienceCount) {
        this.#audienceCount = audienceCount;
    }

    set trainingRoom(trainingRoom) {
        this.#trainingRoom = trainingRoom;
    }

    set trainingGoal(trainingGoal) {
        this.#trainingGoal = trainingGoal;
    }
}