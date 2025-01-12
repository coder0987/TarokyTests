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
}