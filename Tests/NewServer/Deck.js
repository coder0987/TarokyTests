const { SUIT,
    SUIT_REVERSE,
    RED_VALUE,
    RED_VALUE_ACE_HIGH,
    BLACK_VALUE,
    TRUMP_VALUE,
    VALUE_REVERSE,
    VALUE_REVERSE_ACE_HIGH } = require('./Constants.js')


class Deck {
    constructor(args) {
        this._cards = [];
        if (!args) {
            
            return;
        } else if (args.type == this.DECK_TYPES.standard) {
            this.standard();
        } else if (args.type == this.DECK_TYPES.tarok) {
            this.tarok();
        }
    }

    get cards() {
        return this._cards;
    }

    standard() {
        for (let s = 0; s < 4; s++)
            for (let v = 0; v < 13; v++)
                this.cards.push({ 'value': STANDARD_VALUE[v], 'suit': SUIT[s] });
    }

    tarok() {
        for (let s = 0; s < 4; s++)
            for (let v = 0; v < 8; v++)
                this.cards.push({ 'value': s > 1 ? RED_VALUE[v] : BLACK_VALUE[v], 'suit': SUIT[s] });
        for (let v = 0; v < 22; v++)
            this.cards.push({ 'value': TRUMP_VALUE[v], 'suit': SUIT[4] });
    }


    DECK_TYPES = {
        standard: 0,
        tarok: 1
    }
}


module.exports = Deck;