import { card, settings, t_seat, t_seat_c } from "./types";

const {PLAYER_TYPE, MESSAGE_TYPE, SENSITIVE_ACTIONS} = require('./enums.js');
const {playerOffset} = require('./utils');
const {cardsToNotation} = require('./notation');

import SERVER from './logger';
import Settings from './Settings';
import Board from './Board';
import Player from './Player/Player';
import HumanPlayer from './Player/HumanPlayer';
import RobotPlayer from "./Player/RobotPlayer";
import Deck from './Deck';
import Client from './RoomClient';
import GamePlay from './GamePlay';
import RoomManager from "./RoomManager";

let iterator = 100000;

export default class Room {
    #settings: Settings;
    #joinCode: string;
    #host: number;
    #hostPN: t_seat;
    #board: Board;
    #playerCount: number;
    #players: Player[];
    #deck: Deck;
    #autoAction: NodeJS.Timeout | undefined;
    #audience: Record<string, Client>;
    #audienceCount: number;
    #roomType: string;
    #stopAtEnd: boolean;
    #botCutChoice: string;
    #botCutLoc: number;
    #gameplay: GamePlay;
    #gameNumber: number;

    constructor() {
        this.#settings = new Settings();
        this.#joinCode = Room.createJoinCode();
        this.#host = -1;
        this.#hostPN = -1;
        this.#board = new Board();
        this.#playerCount = 0;
        this.#deck = new Deck();
        this.#players = [new RobotPlayer({room: this, pn: 0}), new RobotPlayer({room: this, pn: 1}), new RobotPlayer({room: this, pn: 2}), new RobotPlayer({room: this, pn: 3})];
        this.#autoAction = undefined;
        this.#audience = {};
        this.#audienceCount = 0;
        this.#roomType = 'default';

        this.#stopAtEnd = false;
        this.#botCutChoice = 'Cut';
        this.#botCutLoc = 32;

        this.#gameNumber = 0;

        this.#gameplay = new GamePlay(this);
    }

    jumpStart(pov: t_seat) {
        this.#gameNumber = 1;
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
            if (!this.#players[i]) {continue;}
            this.#players[i].resetForNextRound();
        }
        if (this.#deck.deck.length != 54) {
            SERVER.error("Whoops! The deck has the wrong number of cards.");
            console.log(this.#deck.deck);
            this.#deck = new Deck();
        }
    }

    informPlayers(message: string, messageType: string, extraInfo: any, pn?: t_seat) {
        SERVER.debug('informPlayers() called with message | ' + message + ' | messageType | ' + messageType + ' | extraInfo | ' + JSON.stringify(extraInfo) + ' | pn | ' + pn);
        for (let i in this.#players) {
            if (!this.#players[i] || this.#players[i].type !== PLAYER_TYPE.HUMAN) {
                continue;
            }

            if (pn === undefined || !this.#players[pn]) {
                (this.#players[i] as HumanPlayer).socket.emit('gameMessage',message,messageType,extraInfo);
                continue;
            }
            
            if (pn === +i) {
                //Handled by youMessage
                (this.#players[i] as HumanPlayer).socket.emit('gameMessage','You ' + message,messageType,extraInfo);
                continue;
            }
            if ((this.#players[i] as HumanPlayer).socket && 
                this.#players[pn] !== undefined && 
                this.#players[pn]?.type === PLAYER_TYPE.HUMAN && 
                (this.#players[pn] as HumanPlayer)?.username != 'Guest') {
                (this.#players[i] as HumanPlayer).socket.emit('gameMessage', `${(this.#players[pn] as HumanPlayer)?.username} ${message}`, messageType, extraInfo);
            } else {
                (this.#players[i] as HumanPlayer).socket.emit('gameMessage',`Player ${(pn+1)} ${message}`, messageType, extraInfo);
            }
        }
        for (let i in this.#audience) {
            if (pn === undefined) {
                this.#audience[i]?.socket.emit('gameMessage',message,messageType,extraInfo);
                continue;
            }

            if (pn === -1 || (this.#players[pn] as HumanPlayer).username !== 'Guest') {
                this.#audience[i]?.socket.emit('gameMessage',`Player ${(pn+1)} ${message}`,messageType,extraInfo);
                continue;
            }

            this.#audience[i]?.socket.emit('gameMessage',`${(this.#players[pn] as HumanPlayer)?.username} ${message}`,messageType,extraInfo);
        }
    }

    informPlayer(pn: t_seat, message: string, messageType: string, extraInfo: any) {
        SERVER.debug('informPlayer() called with message | ' + message + ' | messageType | ' + messageType + ' | extraInfo | ' + JSON.stringify(extraInfo) + ' | pn | ' + pn);
        if (this.#players[pn] instanceof HumanPlayer) {
            this.#players[pn].socket.emit('gameMessage', message, messageType, extraInfo);
        }
    }

    sendAllPlayers(messageType: string, message: any) {
        for (let i in this.#players) {
            if (this.#players[i] instanceof HumanPlayer) {
                this.#players[i].socket.emit(messageType, message);
            }
        }
    }

    sendAudience(messageType: string, message: any) {
        for (let i in this.#audience) {
            if (this.#audience[i]?.socket) {
                this.#audience[i]?.socket.emit(messageType, message);
            }
        }
    }

    sendTable() {
        this.informTable();
    }

    notifyStartGame() {
        for (let i in this.#players) {
            if (this.#players[i] instanceof HumanPlayer) {
                this.#players[i].socket.emit('startingGame', this.#host, i, this.#board.gameNumber, this.#settings);
            }
        }
    }

    updateImportantInfo() {
        if (this.#players[0] === undefined ||
            this.#players[1] === undefined ||
            this.#players[2] === undefined ||
            this.#players[3] === undefined
        ) {
            SERVER.errorTrace('Player undefined!');
            return;
        }

        this.#board.importantInfo.chips = {
            '0': this.#players[0].chips,
            '1': this.#players[1].chips,
            '2': this.#players[2].chips,
            '3': this.#players[3].chips
        };
    }

    updateImportantPreverInfo() {
        this.#board.importantInfo.prever = (this.#board.prever+1) as t_seat_c;
    }

    updateImportantPreverMultiplierInfo() {
        this.#board.importantInfo.preverMultiplier = this.#board.preverMultiplier;
    }

    updateImportantMoneyCardsInfo() {
        this.updateImportantInfo();
        this.#board.importantInfo.moneyCards = this.#board.moneyCards;
    }

    updateImportantUsernamesInfo() {
        this.#board.importantInfo.usernames = {0:null, 1:null, 2:null, 3:null};
        for (let i in this.#players) {
            if (this.#players[i] instanceof HumanPlayer && this.#players[i].username && this.#players[i].username != 'Guest') {
                this.#board.importantInfo.usernames[+i] = this.#players[i].username;
            }
        }
    }

    updatePartnerCardInfo() {
        this.#board.importantInfo.partnerCard = this.#board.partnerCard;
    }

    updateImportantValatInfo() {
        this.#board.importantInfo.valat = this.#board.valat + 1 as t_seat_c;
    }

    updateImportantIOTEInfo() {
        this.#board.importantInfo.iote = this.#board.iote + 1 as t_seat_c;
    }

    updateImportantContraInfo() {
        this.#board.importantInfo.contra = Math.pow(2,
                (this.#board.contra[0] !== undefined && this.#board.contra[0] !== -1) ? 
                    this.#board.contra[0] + (
                (this.#board.contra[1]) ? this.#board.contra[1] : 0) : 0);
    }

    updateTrickHistory(pn : t_seat) {
        this.#board.trickHistory.push(
            {
                leadPlayer: this.#board.leadPlayer,
                winner: pn,
                cards: [
                    {suit: this.#board.table[0]?.card.suit || SUIT.TRUMP, value: this.#board.table[0]?.card.value || VALUE.ACE},
                    {suit: this.#board.table[1]?.card.suit || SUIT.TRUMP, value: this.#board.table[1]?.card.value || VALUE.ACE},
                    {suit: this.#board.table[2]?.card.suit || SUIT.TRUMP, value: this.#board.table[2]?.card.value || VALUE.ACE},
                    {suit: this.#board.table[3]?.card.suit || SUIT.TRUMP, value: this.#board.table[3]?.card.value || VALUE.ACE}
                ]
            }
        );
    }

    payMoneyCards(pn: t_seat, owedChips: number) {
        for (let i in this.#players) {
            if (this.#players[i] === undefined) {continue;}
            if (+i === pn) {
                this.#players[i].chips += 3 * owedChips;
            } else {
                this.#players[i].chips -= owedChips;
            }
        }
    }

    payWinnings(team1Players : Player[], team2Players : Player[], chipsOwed : number) {
        for (let i in team1Players) {
            if (team1Players[i] === undefined) {continue;}
            let tempChipsOwed = chipsOwed;
            if (team1Players.length == 1) { tempChipsOwed *= 3; }
            team1Players[i].chips += tempChipsOwed;
        }

        for (let i in team2Players) {
            if (team2Players[i] === undefined) {continue;}
            let tempChipsOwed = chipsOwed;
            if (team2Players.length == 1) { tempChipsOwed *= 3; }
            team2Players[i].chips -= tempChipsOwed;
        }
    }

    updateDealNotation() {
        this.#board.importantInfo.povinnost = (this.#board.povinnost+1) as t_seat_c;
        this.#board.notation = ''   + this.#players[             this.#board.povinnost]?.chips + '/'
                                    + this.#players[playerOffset(this.#board.povinnost,1)]?.chips + '/'
                                    + this.#players[playerOffset(this.#board.povinnost,2)]?.chips + '/'
                                    + this.#players[playerOffset(this.#board.povinnost,3)]?.chips + '/'
                                    + cardsToNotation(this.#players[playerOffset(this.#board.povinnost,0)]?.hand) + '/'
                                    + cardsToNotation(this.#players[playerOffset(this.#board.povinnost,1)]?.hand) + '/'
                                    + cardsToNotation(this.#players[playerOffset(this.#board.povinnost,2)]?.hand) + '/'
                                    + cardsToNotation(this.#players[playerOffset(this.#board.povinnost,3)]?.hand) + '/'
                                    + cardsToNotation(this.#board.talon) + '/';
        
        this.setSettingsNotation();

        SERVER.log(this.#board.notation);
    }

    prepReturnToGame() {
        // TODO: Send to redis for game server to handle
        
        //for (let i in this.#players) {
        //    if (this.#players[i].socket != -1) {
        //        GameManager.INSTANCE.returnToGame[this.#players[i].socket] = {notation: this.#board.notation + this.settingsNotation, povinnost: this.#board.povinnost, pn: i};
        //    }
        //}
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
        SERVER.debug(`Sending settings ${JSON.stringify(this.#settings)} to players`, RoomManager.ROOM_NAME);
        this.sendAllPlayers('returnSettings', this.#settings);
    }

    informActionTaken() {
        this.sendAudience('returnRoundInfo', this.#board.importantInfo);

        for (let i in this.#players) {
            if (this.#players[i] instanceof HumanPlayer) {
                this.#board.importantInfo.pn = (+i+1) as t_seat_c;
                this.#players[i].messenger.emit('returnHand', Deck.sortCards(this.#players[i].hand, this.#settings.aceHigh), false);
                this.#players[i].messenger.emit('returnRoundInfo', this.#board.importantInfo);
                delete this.#board.importantInfo.pn;
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

        if (SENSITIVE_ACTIONS[action.action]) {
            const pn = action.player;
            if (this.#players[pn] instanceof HumanPlayer) {
                this.#players[pn].socket.emit('nextAction', action);
            }
            
            return;
        }

        this.sendAllPlayers('nextAction', action);
        this.sendAudience('nextAction', action);
    }

    informCutChoice(pn: t_seat, cutType: string) {
        SERVER.debug('Cut choice: ' + cutType, RoomManager.ROOM_NAME);
        this.informPlayers('cut by ' + cutType, MESSAGE_TYPE.CUT, { pn: pn }, pn);
    }

    informPovinnost() {
        SERVER.debug('Povinnost is ' + this.#board.povinnost, RoomManager.ROOM_NAME);
        this.informPlayers('is povinnost', MESSAGE_TYPE.POVINNOST, { 'pn': this.#board.povinnost }, this.#board.povinnost);
    }

    informDrawTalon(pn: t_seat, numCards: number) {
        this.informPlayer(pn, '', MESSAGE_TYPE.DRAW, {'cards': this.#board.talon.slice(0,numCards)});
    }

    informPreverTalon(pn: t_seat, step: number) {
        this.informPlayer(pn, '', MESSAGE_TYPE.PREVER_TALON,{'cards': this.#players[pn]?.tempHand,'step':step});
    }

    informPreverKeptFirst() {
        this.informPlayers('kept the first set of cards',MESSAGE_TYPE.PREVER_TALON,{'pn':this.#board.prever,'step':3},this.#board.prever);
    }

    informPreverRejectedFirst() {
        this.informPlayers('rejected the first set of cards',MESSAGE_TYPE.PREVER_TALON,{'cards':this.#board.publicPreverTalon,'pn':this.#board.prever,'step':1},this.#board.prever);
    }

    informPreverKeptSecond() {
        this.informPlayers('kept the second set of cards',MESSAGE_TYPE.PREVER_TALON,{'pn':this.#board.prever,'step':3},this.#board.prever);
    }

    informPreverRejectedSecond() {
        this.informPlayers('rejected the second of cards',MESSAGE_TYPE.PREVER_TALON,{'cards':this.#board.publicPreverTalon.slice(3,6),'pn':this.#board.prever,'step':1},this.#board.prever);
    }

    informFailedDiscard(pn: t_seat, card: card) {
        if (this.#players[pn] instanceof HumanPlayer) {
            this.#players[pn].socket.emit('failedDiscard', card);
        }
        if (card) {
            SERVER.warn('Player ' + pn + ' failed to discard the ' + card.value + ' of ' + card.suit, RoomManager.ROOM_NAME);
        }
        SERVER.warn('Failed to discard. Cards in hand: ' + JSON.stringify(this.#players[pn]?.hand), RoomManager.ROOM_NAME);
    }

    informTrumpDiscarded(pn: t_seat, card: card) {
        this.informPlayers('discarded the ' + card.value, MESSAGE_TYPE.TRUMP_DISCARD, {pn: pn, card: card}, pn);
        
        // I'm not really sure what this code does :)
        if (this.#board.prever != -1) {
            this.#board.trumpDiscarded[0]?.push({suit:card.suit, value:card.value});
        } else {
            this.#board.trumpDiscarded[playerOffset(this.#board.povinnost, pn)]?.push({suit:card.suit, value:card.value});
        }

        // Mark it as played for the bots
        this.#board.cardsPlayed[Deck.cardId(card, this.#settings.aceHigh)] = true;
    }

    informMoneyCards(pn: t_seat, moneyCards: string[]) {
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
        this.informPlayers(theMessage, MESSAGE_TYPE.MONEY_CARDS, {youMessage: yourMoneyCards, pn: pn}, pn);
    }

    informCalledValat(pn: t_seat) {
        this.informPlayers('called valat', MESSAGE_TYPE.VALAT, {pn: pn},pn);
    }

    informIOTECalled(pn: t_seat) {
        this.informPlayers('called the I on the end', MESSAGE_TYPE.IOTE, {pn: pn},pn);
    }

    informCalledContra(pn: t_seat) {
        this.informPlayers('called contra', MESSAGE_TYPE.CONTRA, {pn: pn}, pn);
    }

    informTable() {
        this.sendAllPlayers('returnTable', this.#board.table);
        this.sendAudience('returnTable', this.#board.table);
    }

    informPartnerCard() {
        this.informPlayers('(Povinnost) is playing with the ' + this.#board.partnerCard, MESSAGE_TYPE.PARTNER, 
            {youMessage: 'You are playing with the ' + this.#board.partnerCard, pn: this.#board.nextStep.player}, this.#board.nextStep.player);
    }

    informCardLead(pn: t_seat, card: card) {
        this.informPlayers('lead the ' + card.value + ' of ' + card.suit, MESSAGE_TYPE.LEAD, {pn: pn, card: card}, pn);
    }

    informCardPlayed(pn: t_seat, card: card) {
        this.informPlayers('played the ' + card.value + ' of ' + card.suit, MESSAGE_TYPE.PLAY, {pn: pn, card: card}, pn);
    }

    informWonTrick(trickWinner: t_seat) {
        this.informPlayers( 'won the trick', MESSAGE_TYPE.WINNER, {pn: trickWinner},trickWinner );
    }

    informFinalPoints(team1Players: Player[], team2Players: Player[], chipsOwed: number, pointCountMessageTable: string[]) {
        for (let i in team1Players) {
            let tempChipsOwed = chipsOwed;
            if (team1Players.length == 1) { tempChipsOwed *= 3; }
            if (tempChipsOwed < 0) {
                if (team1Players[i] instanceof HumanPlayer)
                    this.informPlayer(team1Players[i].pn, 'Your team lost ' + (-tempChipsOwed) + ' chips', MESSAGE_TYPE.PAY, pointCountMessageTable);
            } else {
                if (team1Players[i] instanceof HumanPlayer)
                    this.informPlayer(team1Players[i].pn, 'Your team won ' + tempChipsOwed + ' chips', MESSAGE_TYPE.PAY, pointCountMessageTable);
            }
        }

        for (let i in team2Players) {
            let tempChipsOwed = chipsOwed;
            if (team2Players.length == 1) { tempChipsOwed *= 3; }
            if (tempChipsOwed < 0) {
                if (team2Players[i] instanceof HumanPlayer)
                    this.informPlayer(team2Players[i].pn, 'Your team won ' + (-tempChipsOwed) + ' chips', MESSAGE_TYPE.PAY, pointCountMessageTable);
            } else {
                if (team2Players[i] instanceof HumanPlayer)
                    this.informPlayer(team2Players[i].pn, 'Your team lost ' + tempChipsOwed + ' chips', MESSAGE_TYPE.PAY, pointCountMessageTable);
            }
        }
    }

    informGameNotation() {
        this.informPlayers(this.#board.notation + this.settingsNotation, MESSAGE_TYPE.NOTATION, {povinnost: this.#board.povinnost});
    }

    sendChatMessage(username: string, message: string) {
        for (let i in this.#players) {
            if (this.#players[i] instanceof HumanPlayer && this.#players[i].username !== username) {
                this.#players[i].socket.emit('chatMessage', username, message);
            } 
        }
        for (let i in this.#audience) {
            if (this.#audience[i]?.username !== username) {
                this.#audience[i]?.socket.emit('chatMessage', username, message);
            } 
        }
    }

    establishPreverTeams() {
        if (this.#board.povinnost === this.#board.prever) {
            // Povinnost called prever. Everyone is against povinnost
            for (let i=0; i<4; i++) {
                if (this.#players[i] === undefined) {continue;}

                this.#players[i].isTeamPovinnost = false;
                this.#players[i].publicTeam = -1;
            }
            if (this.#players[this.#board.prever] !== undefined) {
                this.#players[this.#board.prever].isTeamPovinnost = true;
                this.#players[this.#board.prever].publicTeam = 1;
            }
        } else {
            // Someone besides povinnost called prever. Everyone is team povinnost
            for (let i=0; i<4; i++) {
                if (this.#players[i] === undefined) {continue;}

                this.#players[i].isTeamPovinnost = true;
                this.#players[i].publicTeam = 1;
            }
            if (this.#players[this.#board.prever] !== undefined) {
                this.#players[this.#board.prever].isTeamPovinnost = false;
                this.#players[this.#board.prever].publicTeam = -1;
            }
        }
    }

    markCardsAsPlayed(listOfCards: card[]) {
        for (let i in listOfCards) {
            if (!listOfCards[i]) continue;
            this.#board.cardsPlayed[Deck.cardId(listOfCards[i], this.#settings.aceHigh)] = true;
        }
    }

    ejectAudience() {
        for (let i in this.#audience) {
            this.#audience[i]?.socket.emit('gameEnded');
        }
    }

    ejectPlayers() {
        for (let i in this.#players) {
            if (this.#players[i] instanceof HumanPlayer) {
                    this.#players[i].client.ejectFromGame();
            } else if (this.#players[i] instanceof RobotPlayer) {
                this.#players[i].clearTimeout();
            }
        }
    }

    removeFromAudience(socketId: number) {
        if (this.#audience[socketId]) {
            //this.#audience[socketId].ejectFromGame(); // TODO
            delete this.#audience[socketId];
            this.audienceCount--;
        }
    }

    removeFromGame(pn : t_seat) {
        if (!(this.#players[pn] instanceof HumanPlayer)) {
            return;
        }

        const wasHost = this.#host == this.#players[pn].socketId;

        this.#players[pn] = new RobotPlayer( this.#players[pn] );
        this.#playerCount--;

        if (wasHost) {
            this.newHost();
        }

        this.informPlayers('left the room',MESSAGE_TYPE.DISCONNECT,{},pn);
        this.informPlayersInGame();
        if (this.#board.nextStep.player === pn) {
            this.gameplay.autoAction();
        }
    }

    fillSlot(client: Client, pn: t_seat) {
        client.pn = pn;

        this.#players[pn] = new HumanPlayer( { old: this.#players[pn], client: client } );
        this.#playerCount++;

        this.informPlayers('joined the game', MESSAGE_TYPE.CONNECT, {}, pn);

        this.informPlayersInGame();

        if (this.#host === -1) {
            this.#host = client.socketId;
            this.#hostPN = pn;
        }
    }

    addToGame(client: Client) {
        const pn = this.findOpenSlot();

        this.fillSlot(client, pn);
    }

    findOpenSlot() {
        for (let i in this.#players) {
            if (!(this.#players[i] instanceof HumanPlayer)) {
                return +i as t_seat;
            }
        }
        return -1;
    }

    newHost() {
        // Find a HUMAN, and designate that player as the host
        for (let i in this.#players) {
            if (this.#players[i] instanceof HumanPlayer) {
                this.#host = this.#players[i].socketId;
                this.#hostPN = +i as t_seat;
                this.#players[i].socket.emit('roomHost');
                break;
            }
        }
    }

    addToAudience( client: Client ) {
        this.#audience[client.socketId] = client;
        this.#audienceCount++;
    }

    setSettingsNotation() {
        this.#settings.setSettingsNotation();
    }

    settingsUpdate(message: string) {
        if (!message) {return;}

        SERVER.debug(message, RoomManager.ROOM_NAME);
        this.informPlayers(message, MESSAGE_TYPE.SETTING, null);
    }

    promptAction() {
        this.#players[this.#board.nextStep.player]?.next();
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

    // Getters
    get gameplay() {
        return this.#gameplay;
    }

    get settings() {
        return this.#settings;
    }

    get name() {
        return RoomManager.ROOM_NAME;
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

    get settingsNotation() {
        return this.#settings.notation;
    }

    get audience() {
        return this.#audience;
    }

    get audienceCount() {
        return this.#audienceCount;
    }

    get winner() {
        //Returns the Player with the most chips. If tie, ignore it
        let highestChipsCount = 0;
        for (let i in this.#players) {
            if ((this.#players[i]?.chips as number) > (this.#players[highestChipsCount]?.chips as number)) {
                highestChipsCount = +i;
            }
        }
        return this.#players[highestChipsCount];
    }

    get winnerNum() {
        //Returns the player number with the most chips. If tie, ignore it
        let highestChipsCount = 0;
        for (let i in this.#players) {
            if ((this.#players[i]?.chips as number) > (this.#players[highestChipsCount]?.chips as number)) {
                highestChipsCount = +i;
            }
        }
        return highestChipsCount;
    }

    get bestHandNum() {
        //Returns the player number with the highest hand ranking. If tie, ignore it
        let highestHand = 0;
        for (let i in this.#players) {
            if ((this.#players[i]?.handRank as number) > (this.#players[highestHand]?.handRank as number)) {
                highestHand = +i;
            }
        }
        return highestHand;
    }

    get playersInGame() {
        let playersInGameArr: {name: string, avatar: number}[] = [];
        for (let i in this.#players) {
            if (this.#players[i] instanceof HumanPlayer) {
                playersInGameArr[i] = {
                    name:  this.#players[i].username,
                    avatar: this.#players[i].avatar
                };
            } else {
                playersInGameArr[i] = {
                    name:  this.#players[i]?.type == PLAYER_TYPE.ROBOT ? 'Robot' : 'AI',
                    avatar: this.#players[i]?.avatar || 0
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
        RoomManager.ROOM_NAME = name;
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

    set audience(audience) {
        this.#audience = audience;
    }

    set audienceCount(audienceCount) {
        this.#audienceCount = audienceCount;
    }
}