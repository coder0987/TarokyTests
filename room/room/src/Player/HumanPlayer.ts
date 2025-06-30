import Deck from '../Deck';
import { PLAYER_TYPE } from '../enums';
import Player from './Player';

export default class HumanPlayer extends Player {
    #client;

    // TODO: No longer pass 'old' and fix constructor
    constructor( args: any ) {
        super(args);

        this.type = PLAYER_TYPE.HUMAN;
        this.#client = args.client;
    }

    start() {}
    play() {}
    shuffle() {}
    cut() {}
    deal() {}

    twelves() {
        let tempChoiceArray: Record<string, number> = {};
        for (let i in this.room.board.hands) {
            if (typeof this.room.board.hands[i] !== 'undefined' || this.room.board.hands[i]) {
                tempChoiceArray[i] = +i + 1;
            }
        }
        this.socket.emit('12choice',tempChoiceArray);
    }

    prever() {}
    drawPreverTalon() {}
    drawTalon() {}

    discardAction() {
        Deck.grayUndiscardables(this.hand);
        this.socket.emit('returnHand', Deck.sortCards(this.hand, this.room.settings.aceHigh), true);
    }

    bidaUniChoice() {
        return false;
    }

    moneyCards() {}

    partner() {
        this.info.possiblePartners = Deck.possiblePartners(this.hand);
    }

    valat() {}
    contra() {}

    iote() {
        this.socket.emit('nextAction', this.action);
    }

    lead() {
        Deck.unGrayCards(this.hand);
        this.socket.emit('returnHand', Deck.sortCards(this.hand, this.room.settings.aceHigh), false);
    }

    follow() {
        Deck.grayUnplayables(this.hand, this.room.board.leadCard);
        this.socket.emit('returnHand', Deck.sortCards(this.hand, this.room.settings.aceHigh), true);
    }

    win() {}
    count() {}
    reset() {}

    get client() {
        return this.#client;
    }

    get messenger() {
        return this.#client.socket;
    }

    get socket() {
        return this.#client.socket;
    }

    get socketId() {
        return this.#client.socketId;
    }

    get avatar() {
        return this.#client.avatar;
    }

    get username() {
        return this.#client.username;
    }
}