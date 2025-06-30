import { SUIT,
    SUIT_REVERSE,
    VALUE,
    RED_VALUE,
    BLACK_VALUE,
    TRUMP_VALUE,
    VALUE_REVERSE,
    VALUE_REVERSE_ACE_HIGH } from './enums';
const SERVER = require('./logger');

import { card, t_suit, t_value } from './types';

//To sort Spades, Hearts, Clubs, Diamonds, Trump and prevent similar colors from touching
const SUIT_SORT_ORDER = {
    Spade: 0, Club: 2, Heart: 1, Diamond: 3, Trump: 4
}

export default class Deck {
    #deck: card[];

    constructor(d?: { deck: card[] } | undefined) {
        if (d) {
            //Create a copy of this deck instead
            this.#deck = structuredClone(d.deck);
            return;
        }
        this.#deck = Deck.createDeck();
    }

    static createDeck(): card[] {
        let theDeck: card[] = [];
        for (let s = 0; s < 4; s++)
            for (let v = 0; v < 8; v++)
                theDeck.push({ 'value': s > 1 ? RED_VALUE[v] : BLACK_VALUE[v], 'suit': SUIT[s] } as card);
        for (let v = 0; v < 22; v++)
            theDeck.push({ 'value': TRUMP_VALUE[v], 'suit': SUIT[4] } as card);
        return theDeck;
    }

    shuffleDeck(shuffleType: number, cutLocation: number) {
        let tempDeck = [...this.#deck];
        cutLocation = cutLocation || tempDeck.length / 2;
        switch (shuffleType) {
            case 1: /*cut*/     this.cutShuffle(cutLocation); break;
            case 2: /*riffle*/  this.riffleShuffle(true); break;
            case 3: /*randomize*/this.#deck = tempDeck.sort(() => Math.random() - 0.5); break;
            default: this.#deck = [...tempDeck];
        }
    }

    cutShuffle(cutPosition: number) {
        if (this.#deck.length >= cutPosition) { return }
        let leftSide = this.#deck.slice(0, cutPosition);
        let rightSide = this.#deck.slice(cutPosition + 1);
        this.#deck = [...rightSide, ...leftSide];
    }

    riffleShuffle(isRandom: boolean) {
        let middle = this.#deck.length / 2;
        let leftSide = this.#deck.slice(0, middle);
        let rightSide = this.#deck.slice(middle);
        let result: card[] = [];
        let leftSideFirst = 1;
        for (var i = 0; i < leftSide.length; i++) {
            if (isRandom) { leftSideFirst = Math.floor(Math.random() * 2); }
            if (leftSideFirst == 1) {
                result.push(leftSide[i] as card);
                result.push(rightSide[i] as card);
            }
            else {
                result.push(rightSide[i] as card);
                result.push(leftSide[i] as card);
            }
        }
        this.#deck = result;
    }

    splice(start: number, end: number) {
        return this.#deck.splice(start, end);
    }

    dealTalon(talon: card[]) {
        for (let i = 0; i < 6; i++)
            talon[i] = this.splice(0, 1)[0] as card;
    }

    dealBy(hands: card[][], num: number) {
        for (let i = 0; this.#deck[0]; i = (i + 1) % 4) {
            for (let c = 0; c < num; c++) {
                hands[i]?.push(this.splice(0, 1)[0] as card);
            }
        }
    }

    deal345(hands: card[][]) {
        for (let t = 3; t < 6; t++) {
            for (let i = 0; i < 4; i++) {
                for (let c = 0; c < t; c++) hands[i]?.push(this.splice(0, 1)[0] as card);
            }
        }
    }

    static dealHand(from: card[], to: card[]) {
        while (from[0]) {to.push(from.splice(0,1)[0] as card);}
    }

    static dealCards(from: card[], to: card[], count: number) {
        for (let i=0; i<count; i++) {to.push(from.splice(0,1)[0] as card);}
    }

    static copyCards(from: card[], to: card[], count: number) {
        to.push(...from.slice(0,count));
    }

    static removeCard(from: card[], card: card) {
        
         
        for (let i in from) {
            if (from[i] === undefined) {
                continue;
            }

            if (from[i].suit === card.suit && from[i].value === card.value) {
                return from.splice(+i, 1)[0];
            }
        }
        return null;
    }

    static points(cards: card[]) {
        let tp = 0;
        for (let i in cards) {
            tp += Deck.pointValue(cards[i] as card);
        }
        return tp;
    }

    static get5(cards: card[]) {
        if (cards.length == 0) {return 0;}
        if (Deck.points(cards) <= 5 || cards.length <= 4) {
            return cards.length;
        }
        if (Deck.points(cards.slice(0,5)) > 5) {
            //First 5 are not all 1s
            if (Deck.pointValue(cards[0] as card) == 5) {
                return 1;//5-pointer
            }
            if (Deck.pointValue(cards[1] as card) == 5) {
                let temp = cards[0] as card;
                cards[0] = cards[1] as card;
                cards[1] = temp;
                return 1;
            }
            if (Deck.points(cards.slice(0,2)) == 5) {
                //Queen and 1, or rider and jack
                return 2;
            }
            if (Deck.pointValue(cards[2] as card) == 5) {
                let temp = cards[0] as card;
                cards[0] = cards[2] as card;
                cards[2] = temp;
                return 1;
            }
            if (Deck.points(cards.slice(0,3)) == 5) {
                return 3;
            }
            if (Deck.pointValue(cards[3] as card) == 5) {
                let temp = cards[0] as card;
                cards[0] = cards[3] as card;
                cards[3] = temp;
                return 1;
            }
            if (Deck.points(cards.slice(0,4)) == 5) {
                return 4;
            }
            switch (Deck.pointValue(cards[0] as card)) {
                case 1:
                    //First few cards don't add up to 5 - next two together must bust
                case 2:
                    //Next two together must bust
                    return 1;//I'm too lazy to code that
                case 3:
                    //May bust with second. Look either for a jack or 2 1s
                    let first = -1;
                    for (let i in cards) {
                        let pv = Deck.pointValue(cards[i] as card)
                        if (pv == 1 && ~first) {
                            let temp = cards[1] as card;
                            cards[1] = cards[first] as card;
                            cards[first] = temp;

                            temp = cards[2] as card;
                            cards[2] = cards[i] as card;
                            cards[i] = temp;
                            return 3;
                        } else if (pv == 1) {
                            first = +i;
                        } else if (pv == 2) {
                            let temp = cards[1] as card;
                            cards[1] = cards[i] as card;
                            cards[i] = temp;
                            return 2;
                        }
                    }
                    return cards.length; // Nothing adds to 5
                case 4:
                    //Def. busts with second card. Look for 1 pointer
                    let idx = -1;
                    for (let i in cards) {
                        if (Deck.pointValue(cards[i] as card) == 1) {
                            idx = +i;
                            break;
                        }
                    }
                    if (idx = -1) {
                        //No more 1-pointers :( just give up
                        return cards.length;
                    }
                    let temp = cards[1] as card;
                    cards[1] = cards[idx] as card;
                    cards[idx] = temp;
                    return 2;
            }
        }
        return 5;//First 5 are all 1s
    }

    static simulateCounting(povCards: card[], oppCards: card[]) {
        let stack: card[] = [];

        //Simulate counting the cards and return one string of all the cards put together
        if (povCards.length < oppCards.length - 5) {
            let num;
            while (num = Deck.get5(povCards)) {
                stack = stack.concat(povCards.splice(0,num));
            }
        }
        if (oppCards.length < povCards.length - 5) {
            let num;
            while (num = Deck.get5(oppCards)) {
                stack = stack.concat(oppCards.splice(0,num));
            }
        }
        return povCards.concat(stack).concat(oppCards);
    }

    static sortCards(toSort: card[], aceHigh: boolean) {
        let valueEnum = aceHigh ? VALUE_REVERSE_ACE_HIGH : VALUE_REVERSE;
        toSort = toSort.sort((a, b) => {
             if (SUIT_SORT_ORDER[a.suit] > SUIT_SORT_ORDER[b.suit]) {
                return 1;
             } else if (SUIT_SORT_ORDER[a.suit] < SUIT_SORT_ORDER[b.suit]) {
                return -1;
             }

             if ((valueEnum[a.value] as number) > (valueEnum[b.value] as number)) {
                return 1;
             } else if ((valueEnum[a.value] as number) < (valueEnum[b.value] as number)) {
                return -1;
             }
             SERVER.debug('Cards are the same: ' + JSON.stringify(a) + ' ' + JSON.stringify(b));
             return 0;//Cards are the same

             //James' sort function (which used to work but for some reason just reverses the order of the cards now?
             /*return (SUIT[a.suit] > SUIT[b.suit]) ? 1 :
            (a.suit === b.suit) ? (
                (Number(SUIT[a.suit] > 1 ? (
                    SUIT[a.suit] > 3 ?
                        TRUMP_VALUE[a.value]
                        : RED_VALUE[a.value])
                    : BLACK_VALUE[a.value]) > Number(SUIT[b.suit] > 1 ? (
                        SUIT[a.suit] > 3 ?
                            TRUMP_VALUE[b.value] :
                        RED_VALUE[b.value]) :
                    BLACK_VALUE[b.value])) ? 1 : -1) : -1;*/
        });
        //console.log(JSON.stringify(toSort));
        return toSort;
    }

    static pointValue(card: card) {
        if (card.suit == SUIT.TRUMP) {
            if (card.value == VALUE.I || card.value == VALUE.XXI || card.value == VALUE.SKYZ) {
                return 5;
            }
            return 1;
        }
        switch (VALUE_REVERSE[card.value]) {
            case 0:
            case 1:
            case 2:
            case 3:
                return 1;
            case 4:
                return 2;
            case 5:
                return 3;
            case 6:
                return 4;
            case 7:
                return 5;
        }
        console.trace('Illegal card. No point value for ' + card);
        return 0;
    }

    static handContainsCard(handToCheck: card[], cardName : t_value) {
        for (let i in handToCheck) {
            if (handToCheck[i]?.value == cardName) {
                return true;
            }
        }
        return false;
    }
    static handHasSuit(handToCheck: card[], suitToCheck: t_suit) {
        for (let i in handToCheck) {
            if (handToCheck[i]?.suit == suitToCheck) {
                return true;
            }
        }
        return false;
    }
    static handContains(handToCheck: card[], valueToCheck: t_value, suitToCheck: t_suit) {
        for (let i in handToCheck) {
            if (handToCheck[i]?.value == valueToCheck && handToCheck[i].suit == suitToCheck) {
                return true;
            }
        }
        return false;
    }
    static handContainsNonGray(handToCheck: card[], valueToCheck: t_value, suitToCheck: t_suit) {
        for (let i in handToCheck) {
            if (handToCheck[i]?.value == valueToCheck && handToCheck[i].suit == suitToCheck && !handToCheck[i]?.grayed) {
                return true;
            }
        }
        return false;
    }
    static moveCard(from: card[], to: card[], suit: t_suit, value: t_value) {
        for (let i in from) {
            if (from[i]?.suit == suit && from[i].value == value) {
                to.push(from.splice(+i, 1)[0] as card);
                return true;
            }
        }
        return false;
    }
    static isCardPlayable(hand: card[], card: card, leadCard: card) {
        if (Deck.handHasSuit(hand, leadCard.suit)) {
            return card.suit == leadCard.suit;
        } else if (leadCard.suit != 'Trump' && Deck.handHasSuit(hand, 'Trump')) {
            return card.suit == 'Trump';
        } else {
            return true;
        }
    }

    static cardId(card: card, aceHigh: boolean) {
        let valueEnum = aceHigh ? VALUE_REVERSE_ACE_HIGH : VALUE_REVERSE;
        return valueEnum[card.value] as number + (SUIT_REVERSE[card.suit] as number) * 8;
    }


    static possiblePartners(hand: card[]) {
        let partners = [];
        //can always partner with XIX
        partners.push({ 'value': 'XIX', 'suit': SUIT[4] });
        //if we hold XIX we can partner with the next lowest trump we don't hold, down to the XV
        if (Deck.handContainsCard(hand, 'XIX')) {
            for (let v = 17; v >= 14; v--) {
                //18 is XIX and 14 is XV
                if (!Deck.handContainsCard(hand, TRUMP_VALUE[v] as t_value)) {
                    partners.push({ 'value': TRUMP_VALUE[v], 'suit': SUIT[4] });
                    break;
                }
            }
        }
        return partners;
    }
    static grayUndiscardables(hand: card[]) {
        let hasNonTrump = false;
        for (let i in hand) {
            if (hand[i]?.suit !== 'Trump') {
                hasNonTrump = true;
                break;
            }
        }
        for (let i in hand) {
            if (!hand[i]) {continue;}
            if ((hasNonTrump && hand[i].suit == 'Trump') || hand[i].value == 'King' || hand[i].value == 'I' || hand[i].value == 'XXI' || hand[i].value == 'Skyz') {
                hand[i].grayed = true;
            } else {
                hand[i].grayed = false;
            }
        }
        //If everything is King and Trump, only gray 5-pointers
        for (let i in hand) {
            if (!hand[i]?.grayed) {
                return false;
            }
        }
        Deck.unGrayCards(hand);
        for (let i in hand) {
            if (!hand[i]) {continue;}
            if (hand[i].value == 'King' || hand[i].value == 'I' || hand[i].value == 'XXI' || hand[i].value == 'Skyz') {
                hand[i].grayed = true;
            } else {
                hand[i].grayed = false;
            }
        }
        return true;
    }
    static grayUnplayables(hand: card[], leadCard: card) {
        if (Deck.handHasSuit(hand, leadCard.suit)) {
            for (let i in hand) {
                if (!hand[i]) {continue;}
                if (hand[i].suit != leadCard.suit) {
                    hand[i].grayed = true;
                } else {
                    hand[i].grayed = false;
                }
            }
        } else if (leadCard.suit != 'Trump' && Deck.handHasSuit(hand, 'Trump')) {
            for (let i in hand) {
                if (!hand[i]) {continue;}
                if (hand[i].suit != 'Trump') {
                    hand[i].grayed = true;
                } else {
                    hand[i].grayed = false;
                }
            }
        } else {
            //Has neither lead suit nor trump. Can play anything
            for (let i in hand) {
                if (!hand[i]) {continue;}
                hand[i].grayed = false;
            }
        }
    }
    static grayTheI(hand: card[]) {
        for (let i in hand) {
            if (!hand[i]) {continue;}
            if (hand[i].suit == 'Trump' && hand[i].value == 'I') {
                hand[i].grayed = true;
            }
        }
        return hand;//should be linked as well
    }
    static grayTheXXI(hand: card[]) {
        for (let i in hand) {
            if (!hand[i]) {continue;}
            if (hand[i].suit == 'Trump' && hand[i].value == 'XXI') {
                hand[i].grayed = true;
            }
        }
        return hand;//should be linked as well
    }
    static unGrayCards(hand: card[]) {
        //Used to un-gray cards before a player leads
        for (let i in hand) {
            if (!hand[i]) {continue;}
            hand[i].grayed = false;
        }
    }
    static getPlayerToDiscard(hands: card[][], povinnost: number) {
        const { playerOffset } = require('./utils'); // Put here to remove dependency cycle :/
        for (let i = 0; i < hands.length; i++) {
            // Starting with povinnost, check all 4 hands to see if any have more than 12 cards
            const p = playerOffset(povinnost, i);

            if (hands[p]?.length as number > 12) {
                return p;
            }
        }

        // If all have 12 or fewer, return -1
        return -1;
    }
    static handContainsTrul(hand: card[]) {
        let hasSkyz = false, hasXXI = false, hasI = false;

        for (const card of hand) {
            if (card.value === VALUE.SKYZ) hasSkyz = true;
            else if (card.value === VALUE.XXI) hasXXI = true;
            else if (card.value === VALUE.I) hasI = true;
        }

        return hasSkyz && hasXXI && hasI;
    }
    static handContainsRosaPane(hand: card[]) {
        let kings = [false, false, false, false];

        for (const card of hand) {
            if (card.value === VALUE.KING) {
                kings[ SUIT_REVERSE[card.suit] as number ] = true;
            }
        }

        return kings[0] && kings[1] && kings[2] && kings[3];
    }
    static num5Count(hand: card[]) {
        let count = 0;
        for (let i in hand) {
            if (!hand[i]) {continue;}
            if (Deck.pointValue(hand[i]) === 5) {
                count++;
            }
        }
        return count;
    }
    static numOfSuit(hand: card[], suit: t_suit) {
        let suitCount = 0;
        for (let i in hand) {
            if (hand[i]?.suit == suit) {
                suitCount++;
            }
        }
        return suitCount;
    }
    static selectCardOfSuit(hand: card[], suit: t_suit) {
        for (let i in hand) {
            if (hand[i]?.suit == suit) {
                return hand[i];
            }
        }
        SERVER.warn('Illegal card selection. No cards of suit ' + suit + ' in hand ' + hand);
        return;
    }
    static handWithoutGray(hand: card[]) {
        let newHand = [...hand];//Not linked
        for (let i=newHand.length-1; i>=0; i--) {
            if (newHand[i]?.grayed) {
                newHand.splice(i,1);
            }
        }
        return newHand;
    }
    static highestPointValue(hand: card[]) {
        let pv = hand[0] as card;
        for (let i in hand) {
            if (!hand[i]) {continue;}
            if (Deck.pointValue(hand[i]) > Deck.pointValue(pv)) {
                pv = hand[i];
            }
        }
        return pv;
    }
    static lowestPointValue(hand: card[]) {
        let pv = hand[0] as card;
        for (let i in hand) {
            if (!hand[i]) {continue;}
            if (Deck.pointValue(hand[i]) < Deck.pointValue(pv)) {
                pv = hand[i];
            }
        }
        return pv;
    }
    static lowestTrump(hand: card[]) {
        //Assuming the inserted hand is all trump
        let lowest = hand[0] as card;
        for (let i in hand) {
            if (!hand[i]) {continue;}
            if (VALUE_REVERSE[lowest.value] as number > (VALUE_REVERSE[hand[i].value] as number)) {
                lowest = hand[i];
            }
        }
        return lowest;
    }
    static highestTrump(hand: card[]) {
        //Assuming the inserted hand is all trump
        let highest = hand[0] as card;
        for (let i in hand) {
            if (!hand[i]) {continue;}
            if ((VALUE_REVERSE[highest.value] as number) < (VALUE_REVERSE[hand[i].value] as number)) {
                highest = hand[i];
            }
        }
        return highest;
    }
    static lowestTrumpThatBeats(hand: card[], card: card) {
        //Assuming the inserted hand is all trump
        let lowest = Deck.highestTrump(hand);
        if ((VALUE_REVERSE[card.value] as number) > (VALUE_REVERSE[lowest.value] as number)) {
            //No cards can win
            return Deck.lowestTrump(hand);
        }
        for (let i in hand) {
            if (!hand[i]) {continue;}
            if ((VALUE_REVERSE[lowest.value] as number) > (VALUE_REVERSE[hand[i].value] as number) &&
                (VALUE_REVERSE[card.value]  as number)  < (VALUE_REVERSE[hand[i].value] as number)) {
                lowest = hand[i];
            }
        }
        return lowest;
    }
    static firstSelectableCard(hand: card[]) {
        for (let i in hand) {
            if (!hand[i]) {continue;}
            if (!hand[i].grayed) {
                return hand[i];
            }
        }
        SERVER.trace('ERROR: No cards were ungrayed. Returning first card in hand.');
        return hand[0];
    }
    static firstSelectableCardExceptPagat(hand: card[]) {
        for (let i in hand) {
            if (!hand[i]) {continue;}
            if (!hand[i].grayed && hand[i].value != 'I') {
                return hand[i];
            }
        }
        return {suit: 'Trump', value: 'I'};
    }
    static trumpChain(hand: card[]) {
        //Returns the number of guaranteed tricks from a hand (trump only)
        let guarantees = 0;
        let misses = 0;
        for (let i = Object.keys(TRUMP_VALUE).length - 1; i>=0; i--) {
            if (Deck.handContainsCard(hand, TRUMP_VALUE[i] as t_value)) {
                if (misses > 0) {
                    misses--;
                } else {
                    guarantees++;
                }
            } else {
                misses++;
            }
        }
        return guarantees;
    }
    static unbrokenTrumpChain(hand: card[]) {
        let guarantees = 0;
        for (let i=21; i>=0; i++) {
            if (Deck.handContainsCard(hand,TRUMP_VALUE[i] as t_value)) {
                guarantees++;
            } else {
                return guarantees;
            }
        }
        return guarantees;
    }
    static basicHandRanking(hand: card[]) {
        /*Returns a point-value estimate of how good a hand is
        Points are given for:
            -Voided suits (2pt each)
            -Trump
            -Trump again, if higher than XV
            -Trump chain, for each guaranteed win trump (Skyz, then XXI, then XX, etc)
            -Kings/5-point cards
        */
        let handRankingPoints = 0;
        handRankingPoints += Deck.trumpChain(hand);
        for (let i in hand) {
            if (!hand[i]) {continue;}
            if (hand[i].suit == 'Trump') {
                handRankingPoints++;
                if (VALUE_REVERSE[hand[i].value] as number >= 14) {
                    handRankingPoints++;
                }
            }
            if (Deck.pointValue(hand[i]) == 5) {
                handRankingPoints++;
            }
        }
        for (let i=0; i<4; i++) {
            if (Deck.numOfSuit(hand,SUIT[i] as t_suit) == 0) {
                handRankingPoints+=2;
            }
        }
        return handRankingPoints;
    }

    static cardsToNotation(cards: card[]) {
        let theNotation = '';
        const SUIT_TO_NOTATION = {'Spade': 'S', 'Club': 'C', 'Heart': 'H', 'Diamond': 'D', 'Trump': 'T'};
        try {
            for (let i in cards) {
                if (!cards[i]) {continue;}
                theNotation += SUIT_TO_NOTATION[cards[i].suit];
                if (cards[i].suit == SUIT[4]) {
                    //Trump
                    let temp = (VALUE_REVERSE[cards[i].value] as number) + 1;
                    let tempstring: string = temp.toString();
                    if (temp < 10) {
                        tempstring = '0' + tempstring;
                    }
                    theNotation += tempstring;
                } else {
                    switch (cards[i].value) {
                        case 'Ace':
                        case 'Seven':
                            theNotation += '1';
                            break;
                        case 'Two':
                        case 'Eight':
                            theNotation += '2';
                            break;
                        case 'Three':
                        case 'Nine':
                            theNotation += '3';
                            break;
                        case 'Four':
                        case 'Ten':
                            theNotation += '4';
                            break;
                        default:
                            theNotation += (cards[i].value as string).substring(0,1);
                    }
                }
            }
        } catch (err) {
            SERVER.error('Cards could not be notated: ' + JSON.stringify(cards) + '\n' + err);
        }
        return theNotation;
    }

    //Getters
    get deck() {
        return this.#deck
    }

    set deck(deck) {
        this.#deck = deck;
    }

}

module.exports = Deck;