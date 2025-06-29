import { card, importantInfo, nextStep, t_seat, t_value, table, trick } from "./types";

class Board {
    // Private fields
    #partnerCard: t_value;
    #talon: card[];
    #table: table[];
    #preverTalon: card[];
    #preverTalonStep: number;
    #prever: t_seat;
    #playingPrever: boolean;
    #povinnost: t_seat;
    #buc: boolean;
    #leadPlayer: t_seat;
    #leadCard: card | null;
    #nextStep: nextStep;
    #cutStyle: string;
    #moneyCards: string[][];
    #trickWinCount: number[];
    #valat: t_seat;
    #iote: number;
    #ioteWin: number;
    #hasTheI: t_seat;
    #contra: number[];
    #calledContra: t_seat;
    #rheaContra: t_seat;
    #supraContra: t_seat;
    #firstContraPlayer: t_seat;
    #gameNumber: number;
    #importantInfo: importantInfo;
    #notation: string;
    #trickHistory: trick[];
    #cardsPlayed: boolean[];
    #publicPreverTalon: card[];
    #trumpDiscarded: card[][];

    constructor() {
        this.#partnerCard = "";
        this.#talon = [];
        this.#table = [];
        this.#preverTalon = [];
        this.#preverTalonStep = 0;
        this.#prever = -1;
        this.#playingPrever = false;
        this.#povinnost = -1;
        this.#buc = false;
        this.#leadPlayer = -1;
        this.#leadCard = null;
        this.#nextStep = { player: 0, action: 'start', time: Date.now(), info: {} };
        this.#cutStyle = '';
        this.#moneyCards = [[], [], [], []];
        this.#trickWinCount = [0, 0];
        this.#valat = -1;
        this.#iote = -1;
        this.#ioteWin = 0;
        this.#hasTheI = -1;
        this.#contra = [-1, -1];
        this.#calledContra = -1;
        this.#rheaContra = -1;
        this.#supraContra = -1;
        this.#firstContraPlayer = -1;
        this.#gameNumber = 0;
        this.#importantInfo = {};
        this.#notation = '';
        this.#trickHistory = [];
        this.#cardsPlayed = new Array(54).fill(false);
        this.#publicPreverTalon = [];
        this.#trumpDiscarded = [[], [], [], []];
    }

    resetForNextRound() {
        this.#partnerCard = "";
        this.#talon = [];
        this.#table = [];
        this.#preverTalon = [];
        this.#preverTalonStep = 0;
        this.#prever = -1;
        this.#playingPrever = false;
        this.#povinnost = (this.#povinnost + 1) % 4 as t_seat;
        this.#buc = false;
        this.#leadPlayer = -1;
        this.#leadCard = null;
        this.#valat = -1;
        this.#iote = -1;
        this.#ioteWin = 0;
        this.#hasTheI = -1;
        this.#cutStyle = '';
        this.#moneyCards = [[], [], [], []];
        this.#trickWinCount = [0, 0];
        this.#contra = [-1, -1];
        this.#calledContra = -1;
        this.#rheaContra = -1;
        this.#supraContra = -1;
        this.#firstContraPlayer = -1;
        this.#importantInfo = {};
        this.#notation = '';
        this.#trickHistory = [];
        this.#cardsPlayed = new Array(54).fill(false);
        this.#publicPreverTalon = [];
        this.#trumpDiscarded = [[], [], [], []];
    }

    // Setters
    set partnerCard(val) { this.#partnerCard = val; }
    set talon(val) { this.#talon = val; }
    set table(val) { this.#table = val; }
    set preverTalon(val) { this.#preverTalon = val; }
    set preverTalonStep(val) { this.#preverTalonStep = val; }
    set prever(val) { this.#prever = val; }
    set playingPrever(val) { this.#playingPrever = val; }
    set povinnost(val) { this.#povinnost = val; }
    set buc(val) { this.#buc = val; }
    set leadPlayer(val) { this.#leadPlayer = val; }
    set leadCard(val) { this.#leadCard = val; }
    set nextStep(val) { this.#nextStep = val; }
    set cutStyle(val) { this.#cutStyle = val; }
    set moneyCards(val) { this.#moneyCards = val; }
    set valat(val) { this.#valat = val; }
    set iote(val) { this.#iote = val; }
    set ioteWin(val) { this.#ioteWin = val; }
    set hasTheI(val) { this.#hasTheI = val; }
    set contra(val) { this.#contra = val; }
    set calledContra(val) { this.#calledContra = val; }
    set rheaContra(val) { this.#rheaContra = val; }
    set supraContra(val) { this.#supraContra = val; }
    set firstContraPlayer(val) { this.#firstContraPlayer = val; }
    set gameNumber(val) { this.#gameNumber = val; }
    set importantInfo(val) { this.#importantInfo = val; }
    set trickWinCount(val) { this.#trickWinCount = val; }
    set trickHistory(val) { this.#trickHistory = val; }
    set cardsPlayed(val) { this.#cardsPlayed = val; }
    set publicPreverTalon(val) { this.#publicPreverTalon = val; }
    set trumpDiscarded(val) { this.#trumpDiscarded = val; }

    // Getters
    get partnerCard() { return this.#partnerCard; }
    get talon() { return this.#talon; }
    get table() { return this.#table; }
    get preverTalon() { return this.#preverTalon; }
    get preverTalonStep() { return this.#preverTalonStep; }
    get prever() { return this.#prever; }
    get playingPrever() { return this.#playingPrever; }
    get povinnost() { return this.#povinnost; }
    get buc() { return this.#buc; }
    get leadPlayer() { return this.#leadPlayer; }
    get leadCard() { return this.#leadCard; }
    get nextStep() { return this.#nextStep; }
    get cutStyle() { return this.#cutStyle; }
    get moneyCards() { return this.#moneyCards; }
    get valat() { return this.#valat; }
    get iote() { return this.#iote; }
    get contra() { return this.#contra; }
    get calledContra() { return this.#calledContra; }
    get rheaContra() { return this.#rheaContra; }
    get supraContra() { return this.#supraContra; }
    get firstContraPlayer() { return this.#firstContraPlayer; }
    get gameNumber() { return this.#gameNumber; }
    get importantInfo() { return this.#importantInfo; }
    get trickWinCount() { return this.#trickWinCount; }
    get ioteWin() { return this.#ioteWin; }
    get hasTheI() { return this.#hasTheI; }
    get trickHistory() { return this.#trickHistory; }
    get cardsPlayed() { return this.#cardsPlayed; }
    get publicPreverTalon() { return this.#publicPreverTalon; }
    get trumpDiscarded() { return this.#trumpDiscarded; }
}

module.exports = Board;
