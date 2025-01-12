const GAME_TYPES = {
    TURN_BASED: 0,
    TIME_BASED: 1
}

const TARGETS = {
    NONE: 0,
    PREVIOUS: 1,
    NEXT: 2,
    SPLIT: 3,
    CURRENT: 4,
    OFFSET: 5,
    SYSTEM: 6,
    EVERYONE: 7,
    HOST: 8,
}

const ACTIONS = {
    NOOP: 0,
    CHOOSE: 1,
    NEXT: 2,
    EVAL: 3,
    PAY: 4,
    DEAL: 5,
    CUT: 6,
    SHUFFLE: 7,
}

const ITEMS = {
    NONE: 0,
    CUSTOM_LIST: 1,
    STEPS: 2,
    TARGET_HAND: 3,
    PILE: 4,
    POINTS: 5,
    DECK: 6,
}

const SUIT = { 0: 'Spade', 1: 'Club', 2: 'Heart', 3: 'Diamond', 4: 'Trump' };
const SUIT_REVERSE = { Spade: 0, Club: 1, Heart: 2, Diamond: 3, Trump: 4 };
const RED_VALUE = { 0: 'Ace', 1: 'Two', 2: 'Three', 3: 'Four', 4: 'Jack', 5: 'Rider', 6: 'Queen', 7: 'King' };
const RED_VALUE_ACE_HIGH = { 0: 'Two', 1: 'Three', 2: 'Four', 3: 'Ace', 4: 'Jack', 5: 'Rider', 6: 'Queen', 7: 'King' };
const BLACK_VALUE = { 0: 'Seven', 1: 'Eight', 2: 'Nine', 3: 'Ten', 4: 'Jack', 5: 'Rider', 6: 'Queen', 7: 'King' };
const TRUMP_VALUE = { 0: 'I', 1: 'II', 2: 'III', 3: 'IIII', 4: 'V', 5: 'VI', 6: 'VII', 7: 'VIII', 8: 'IX', 9: 'X', 10: 'XI', 11: 'XII', 12: 'XIII', 13: 'XIV', 14: 'XV', 15: 'XVI', 16: 'XVII', 17: 'XVIII', 18: 'XIX', 19: 'XX', 20: 'XXI', 21: 'Skyz' };
const VALUE_REVERSE = {
    Ace: 0, Two: 1, Three: 2, Four: 3, Jack: 4, Rider: 5, Queen: 6, King: 7,
    Seven: 0, Eight: 1, Nine: 2, Ten: 3,
    I: 0, II: 1, III: 2, IIII: 3, V: 4, VI: 5, VII: 6, VIII: 7, IX: 8, X: 9, XI: 10, XII: 11, XIII: 12,
    XIV: 13, XV: 14, XVI: 15, XVII: 16, XVIII: 17, XIX: 18, XX: 19, XXI: 20, Skyz: 21
};
const VALUE_REVERSE_ACE_HIGH = {
    Two: 0, Three: 1, Four: 2, Ace: 3, Jack: 4, Rider: 5, Queen: 6, King: 7,
    Seven: 0, Eight: 1, Nine: 2, Ten: 3,
    I: 0, II: 1, III: 2, IIII: 3, V: 4, VI: 5, VII: 6, VIII: 7, IX: 8, X: 9, XI: 10, XII: 11, XIII: 12,
    XIV: 13, XV: 14, XVI: 15, XVII: 16, XVIII: 17, XIX: 18, XX: 19, XXI: 20, Skyz: 21
};
const STANDARD_VALUE = {
    0: 'Ace', 1: 'Two', 2: 'Three', 3: 'Four', 4: 'Five', 5: 'Six', 6: 'Seven', 7: 'Eight', 8: 'Nine', 9: 'Ten', 10: 'Jack', 11: 'Queen', 12: 'King', 13: 'Ace'
}


module.exports = {
    GAME_TYPES,
    TARGETS,
    ACTIONS,
    ITEMS,
}