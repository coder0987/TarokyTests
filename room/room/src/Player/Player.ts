const { ACTION } = require("../enums");
const SERVER = require("../logger");
import { PLAYER_TYPE } from '../enums';
import RoomManager from '../RoomManager';
import { t_seat } from '../types';

export default abstract class Player {
    #type = PLAYER_TYPE.ROBOT;
    #pn : t_seat = -1;
    #chips = 100;
    #discard = [];
    #hand = [];
    #tempHand = [];
    #isTeamPovinnost = false;
    #publicTeam = 0;
    //#savePoints = [];
    #consecutiveAutos = 0;
    #avatar = 0;
    #handRank = 0;

    // Meant only to be called by super()
    constructor(args?: Player) {
        this.#pn = args?.pn ?? -1;
        this.#chips = args?.chips ?? 100;
        this.#discard = args?.discard ?? [];
        this.#hand = args?.hand ?? [];
        this.#tempHand = args?.tempHand ?? [];
        this.#isTeamPovinnost = args?.isTeamPovinnost ?? false;
        this.#publicTeam = args?.publicTeam ?? 0;
        //this.#savePoints = args?.savePoints ?? [];
        this.#consecutiveAutos = args?.consecutiveAutos ?? 0;
        this.#avatar = args?.avatar ?? 0;
        this.#handRank = args?.handRank ?? 0;
    }

    next() {
        // Figure out what the next action is and do it
        const nextAction = RoomManager.room.board.nextStep;

        SERVER.functionCall('next', {name:'action', value:nextAction.action}, {name:'Room Number',value: RoomManager.room.name});
        
        let fakeMoneyCards = false;

        switch (nextAction.action) {
            case ACTION.START:
                this.start();
                break;
            case ACTION.PLAY:
                this.play();
                break;
            case ACTION.SHUFFLE:
                this.shuffle();
                break;
            case ACTION.CUT:
                this.cut();
                break;
            case ACTION.DEAL:
                this.deal();
                break;
            case ACTION.CHOICE:
                this.twelves();
                break;
            case ACTION.PREVER:
                this.prever();
                break;
            case ACTION.DRAW_PREVER_TALON:
                this.drawPreverTalon();
                break;
            case ACTION.DRAW_TALON:
                this.drawTalon();
                break;
            case ACTION.DISCARD:
                this.discardAction();
                break;
            case ACTION.POVINNOST_BIDA_UNI_CHOICE:
                fakeMoneyCards = this.bidaUniChoice();
                break;
            case ACTION.MONEY_CARDS:
                this.moneyCards();
                break;
            case ACTION.PARTNER:
                this.partner();
                break;
            case ACTION.VALAT:
                this.valat();
                break;
            case ACTION.IOTE:
                this.iote();
                break;
            case ACTION.CONTRA:
            case ACTION.PREVER_CONTRA:
            case ACTION.PREVER_VALAT_CONTRA:
            case ACTION.VALAT_CONTRA:
                this.contra();
                break;
            case ACTION.LEAD:
                this.lead();
                break;
            case ACTION.FOLLOW:
                this.follow();
                break;
            case ACTION.WIN_TRICK:
                this.win();
                break;
            case ACTION.COUNT_POINTS:
                this.count();
                break;
            case ACTION.RESET:
                this.reset();
                break;
            case ACTION.RETRY:
                break;
            default:
                SERVER.warn('Unknown robot action: ' + nextAction.action, this.room.name);
        }

        RoomManager.room.informNextAction();

        if (fakeMoneyCards) {
            nextAction.action = ACTION.POVINNOST_BIDA_UNI_CHOICE;
        }
    }

    abstract start(): void;
    abstract play(): void;
    abstract shuffle(): void;
    abstract cut(): void;
    abstract deal(): void;
    abstract twelves(): void;
    abstract prever(): void;
    abstract drawPreverTalon(): void;
    abstract drawTalon(): void;
    abstract discardAction(): void;
    abstract bidaUniChoice(): boolean;
    abstract moneyCards(): void;
    abstract partner(): void;
    abstract valat(): void;
    abstract iote(): void;
    abstract contra(): void;
    abstract lead(): void;
    abstract follow(): void;
    abstract win(): void;
    abstract count(): void;
    abstract reset(): void;

    resetForNextRound() {
        this.hand = [];
        this.discard = [];
        this.tempHand = [];
        this.isTeamPovinnost = false;
        this.publicTeam = 0;
        this.handRank = 0;
    }

    // Setters
    set type(type) {
        this.#type = type;
    }

    set pn(pn) {
        this.#pn = pn;
    }

    set chips(chips) {
        this.#chips = chips;
    }

    set discard(discard) {
        this.#discard = discard;
    }

    set hand(hand) {
        this.#hand = hand;
    }

    set tempHand(tempHand) {
        this.#tempHand = tempHand;
    }

    set isTeamPovinnost(isTeamPovinnost) {
        this.#isTeamPovinnost = isTeamPovinnost;
    }

    set publicTeam(publicTeam) {
        this.#publicTeam = publicTeam;
    }

    set avatar(avatar) {
        this.#avatar = avatar;
    }

    set handRank(handRank) {
        this.#handRank = handRank;
    }

    set room(room) {
        RoomManager.room = room;
    }

    set consecutiveAutos(consecutiveAutos) {
        this.#consecutiveAutos = consecutiveAutos;
    }

    // Getters
    get type() {
        return this.#type;
    }

    get pn() {
        return this.#pn;
    }

    get chips() {
        return this.#chips;
    }

    get discard() {
        return this.#discard;
    }

    get hand() {
        return this.#hand;
    }

    get tempHand() {
        return this.#tempHand;
    }

    get isTeamPovinnost() {
        return this.#isTeamPovinnost;
    }

    get publicTeam() {
        return this.#publicTeam;
    }

    get avatar() {
        return this.#avatar;
    }

    get handRank() {
        return this.#handRank;
    }

    get room() {
        return RoomManager.room;
    }
    
    get action() {
        return RoomManager.room.board.nextStep;
    }

    get info() {
        return RoomManager.room.board.nextStep.info;
    }

    get consecutiveAutos() {
        return this.#consecutiveAutos;
    }
}
