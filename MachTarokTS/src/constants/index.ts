export const topbarLinks = [
  {
    label: "Play",
    route: "/play",
  },
  {
    label: "Learn",
    route: "/learn",
  },
  {
    label: "Updates",
    route: "/updates",
  },
  {
    label: "Donate",
    route: "/donate",
  },
  {
    label: "Sign In",
    route: "/signin",
  },
];

export const bottombarLinks = [
  {
    label: "Play",
    route: "/play",
    imgUrl: "/assets/icons/play.svg",
  },
  {
    label: "Learn",
    route: "/learn",
    imgUrl: "/assets/icons/learn.svg",
  },
  {
    label: "Updates",
    route: "/updates",
    imgUrl: "/assets/icons/bell.svg",
  },
  {
    label: "Donate",
    route: "/donate",
    imgUrl: "/assets/icons/donate.svg",
  },
  {
    label: "Sign In",
    route: "/signin",
    imgUrl: "/assets/icons/sign-in.svg",
  },
];

export const bitcoinDonationAddress =
  "bc1qjqfv40dswdl0lssp45tmuwa5ts8p03dfx45nxl";
export const ethDonationAddress = "0x5f2CfF4a4850Bd209e721b0C26fcF63F0EB79c6a";
export const paypalDonationLink = "PayPal.Me/MachTarok";
export const cashappDonationLink = "cash.app/$MachTarok";

export const PLAYER_TYPE = {
  HUMAN: 0,
  ROBOT: 1,
  AI: 2,
  H: 0,
  R: 1,
} as const;

export enum Suit {
  Spade = 0,
  Club = 1,
  Heart = 2,
  Diamond = 3,
  Trump = 4,
}

// Card values
export const RED_VALUE = ["Ace", "Two", "Three", "Four", "Jack", "Rider", "Queen", "King"] as const;

export const RED_VALUE_ACE_HIGH = ["Two", "Three", "Four", "Ace", "Jack", "Rider", "Queen", "King"] as const;

export const BLACK_VALUE = ["Seven", "Eight", "Nine", "Ten", "Jack", "Rider", "Queen", "King"] as const;

export const TRUMP_VALUE = [
  "I", "II", "III", "IIII", "V", "VI", "VII", "VIII", "IX", "X",
  "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI", "Skyz"
] as const;

// UI Fonts
export const ERR_FONT = "24px Arial";
export const INFO_FONT = "24px Arial";

// UI cut types
export const CUT_TYPES = ["Cut", "1", "2", "3", "4", "6", "12 Straight", "12", "345"] as const;

// Game messages
export enum MessageType {
  POVINNOST = 0,
  MONEY_CARDS,
  PARTNER,
  VALAT,
  CONTRA,
  IOTE,
  LEAD,
  PLAY,
  WINNER,
  PREVER_TALON,
  PAY,
  CONNECT,
  DISCONNECT,
  SETTING,
  TRUMP_DISCARD,
  NOTATION,
  DRAW,
  CUT,
}

// Game buttons
export enum ButtonType {
  PREVER = 0,
  VALAT,
  CONTRA,
  IOTE,
  BUC,
  PREVER_TALON,
  DRAW_TALON,
}

// Game call types
export const TYPE_TABLE: Record<number, string> = {
  0: "Prever",
  1: "Valat",
  2: "Contra",
  3: "IOTE",
  4: "Bida or Uni",
  5: "Prever Talon",
  6: "Talon",
};

// Difficulty
export enum Difficulty {
  BEGINNER = 0,
  EASY,
  NORMAL,
  HARD,
  RUTHLESS,
  AI,
}

export const DIFFICULTY_TABLE: Record<number, string> = {
  0: "Beginner",
  1: "Easy",
  2: "Normal",
  3: "Hard",
  4: "Ruthless",
  5: "AI",
};

// Game action descriptions
export const ACTION_TABLE: Record<string, string> = {
  start: "Start the Game",
  play: "Start the Next Round",
  shuffle: "Shuffle",
  cut: "Cut the Deck",
  deal: "Deal",
  "12choice": "Choose a hand",
  prever: "Choose to Keep or Pass Prever",
  passPrever: "Chose to Pass Prever",
  callPrever: "Chose to Call Prever",
  drawPreverTalon: "Choose to Keep or Pass the Prever Talon",
  drawTalon: "Draw Cards from the Talon",
  discard: "Discard Down to 12 Cards",
  povinnostBidaUniChoice: "Decide Whether to Call Bida/Uni as Povinnost",
  moneyCards: "Call Money Cards",
  partner: "Choose a Partner Card",
  valat: "Call or Pass Valat",
  preverContra: "Call or Pass Contra",
  preverValatContra: "Call or Pass Contra",
  valatContra: "Call or Pass Contra",
  contra: "Call or Pass Contra",
  iote: "Call or Pass I on the End",
  lead: "Lead the Trick",
  follow: "Play a Card",
  winTrick: "Collect the Cards from the Trick",
  countPoints: "Count Points",
  resetBoard: "Reset the Board",
  retry: "Share the Challenge",
};

// Reverse card value lookups
export const VALUE_REVERSE: Record<string, number> = {
  Ace: 0, Two: 1, Three: 2, Four: 3, Jack: 4, Rider: 5, Queen: 6, King: 7,
  Seven: 0, Eight: 1, Nine: 2, Ten: 3,
  I: 0, II: 1, III: 2, IIII: 3, V: 4, VI: 5, VII: 6, VIII: 7,
  IX: 8, X: 9, XI: 10, XII: 11, XIII: 12, XIV: 13, XV: 14,
  XVI: 15, XVII: 16, XVIII: 17, XIX: 18, XX: 19, XXI: 20, Skyz: 21,
};

export const VALUE_REVERSE_ACE_HIGH: Record<string, number> = {
  Two: 0, Three: 1, Four: 2, Ace: 3, Jack: 4, Rider: 5, Queen: 6, King: 7,
  Seven: 0, Eight: 1, Nine: 2, Ten: 3,
  I: 0, II: 1, III: 2, IIII: 3, V: 4, VI: 5, VII: 6, VIII: 7,
  IX: 8, X: 9, XI: 10, XII: 11, XIII: 12, XIV: 13, XV: 14,
  XVI: 15, XVII: 16, XVIII: 17, XIX: 18, XX: 19, XXI: 20, Skyz: 21,
};

// Suit sorting order
export const SUIT_SORT_ORDER: Record<string, number> = {
  Spade: 0,
  Heart: 1,
  Club: 2,
  Diamond: 3,
  Trump: 4,
};

export const SUIT: Record<string, string> = {
  SPADES: "Spades",
  DIAMONDS: "Diamonds",
  HEARTS: "Hearts",
  CLUBS: "Clubs"
};

export const VALUE: Record<string, string> = {
  ACE: "Ace",
  TWO: "Two",
  THREE: "Three",
  FOUR: "Four",
  SEVEN: "Seven",
  EIGHT: "Eight",
  NINE: "Nine",
  TEN: "Ten",
  JACK: "Jack",
  WALKER: "Jack",
  RIDER: "Rider",
  QUEEN: "Queen",
  KING: "King",
  I: "I",
  II: "II",
  III: "III",
  IV: "IIII",
  IIII: "IIII",
  V: "V",
  VI: "VI",
  VII: "VII",
  VIII: "VIII",
  IX: "IX",
  X: "X",
  XI: "XI",
  XII: "XII",
  XIII: "XIII",
  XIV: "XIV",
  XV: "XV",
  XVI: "XVI",
  XVII: "XVII",
  XVIII: "XVIII",
  XIX: "XIX",
  XX: "XX",
  XXI: "XXI",
  SKYZ: "Skyz",
}

/* // These are for the any-card-game backend, which is not happening any time soon :(
export const GAME_TYPES = {
  TURN_BASED: 0,
  TIME_BASED: 1
}

export const TARGETS = {
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

export const ACTIONS = {
  NOOP: 0,
  CHOOSE: 1,
  NEXT: 2,
  EVAL: 3,
  PAY: 4,
  DEAL: 5,
  CUT: 6,
  SHUFFLE: 7,
}

export const ITEMS = {
  NONE: 0,
  CUSTOM_LIST: 1,
  STEPS: 2,
  TARGET_HAND: 3,
  PILE: 4,
  POINTS: 5,
  DECK: 6,
}

export const GAME_TYPES_REVERSE = {
  0: 'Turn Based',
  1: 'Time Based'
}

export const TARGETS_REVERSE = {
  0: 'None',
  1: 'Previous',
  2: 'Next',
  3: 'Split',
  4: 'Current',
  5: 'Offset',
  6: 'System',
  7: 'Everyone',
  8: 'Host'
}

export const ACTIONS_REVERSE = {
  0: 'Noop',
  1: 'Choose',
  2: 'Next',
  3: 'Eval',
  4: 'Pay',
  5: 'Deal',
  6: 'Cut',
  7: 'Shuffle'
}

export const ITEMS_REVERSE = {
  0: 'None',
  1: 'Custom List',
  2: 'Steps',
  3: 'Target Hand',
  4: 'Pile',
  5: 'Points',
  6: 'Deck'
}*/