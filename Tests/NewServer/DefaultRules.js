/*
    Built-in games for MachTarok are here. Players can use these as templates or play with them as-is
*/

const Rules = require('./Rules.js');
const Deck = require('./Deck.js')
const { GAME_TYPES, TARGETS, ACTIONS, ITEMS } = require('./Constants.js');
const Instruction = require('./Instruction.js');

const DefaultRules = {
    WestfestTaroky: new Rules( {
        basic: {
            deck: Deck.DECK_TYPES.tarok,
            numDecks: 1,
            deckScaling: 0,
            playerMin: 4,
            playerMax: 4,
            type: GAME_TYPES.TURN_BASED,
            start: 'setup:setup'
        },
        phases: {
            setup: {
                steps: {
                    setup: [
                        new Instruction({ targets: [ TARGETS.SYSTEM, TARGETS.EVERYONE ], action: ACTIONS.PAY, items: ITEMS.POINTS, custom: { points: 100 }}),
                        new Instruction({ targets: [ TARGETS.SPLIT ], action: ACTIONS.NEXT, items: ITEMS.STEPS, steps: ['setup:shuffle']})
                    ],
                    shuffle: [
                        new Instruction({ targets: [ TARGETS.HOST ], action: ACTIONS.SHUFFLE, items: ITEMS.DECK }),
                        new Instruction({ targets: [ TARGETS.PREVIOUS ], action: ACTIONS.CHOOSE, items: ITEMS.CUSTOM_LIST, custom: ['Cut', 'Ones', 'Twos', 'Threes', 'Fours', 'Sixes', 'Twelves', 'Twelves Choice', 'Three-Four-Five'] }),
                        new Instruction({ targets: [ TARGETS.SPLIT ], action: ACTIONS.NEXT, items: ITEMS.STEPS, steps: ['setup:cut', 'setup:ones', 'setup:twos', 'setup:threes', 'setup:fours', 'setup:sixes', 'setup:twelves', 'setup:twelves-choice', 'setup:three-four-five'] })
                    ],
                    cut: [
                        new Instruction({ targets: [ TARGETS.CURRENT ], action: ACTIONS.CUT, items: ITEMS.DECK }),
                        new Instruction({ targets: [ TARGETS.SPLIT ], action: ACTIONS.NEXT, items: ITEMS.STEPS, steps: ['sixes'] })
                    ],
                    ones: [
                        new Instruction({ targets: [ TARGETS.HOST ], action: ACTIONS.DEAL, items: [ITEMS.DECK, ITEMS.PILE], custom: {pile: 0, deal: 6}}),
                        new Instruction({ targets: [ TARGETS.HOST, TARGETS.OFFSET ], action: ACTIONS.DEAL, items: [ITEMS.DECK, ITEMS.TARGET_HAND], custom: { offset: 1, target_hand: 1, deal: 1 }}),
                        new Instruction({ targets: [ TARGETS.HOST, TARGETS.OFFSET ], action: ACTIONS.DEAL, items: [ITEMS.DECK, ITEMS.TARGET_HAND], custom: { offset: 2, target_hand: 1, deal: 1 }}),
                        new Instruction({ targets: [ TARGETS.HOST, TARGETS.OFFSET ], action: ACTIONS.DEAL, items: [ITEMS.DECK, ITEMS.TARGET_HAND], custom: { offset: 3, target_hand: 1, deal: 1 }}),
                        new Instruction({ targets: [ TARGETS.HOST, TARGETS.HOST ], action: ACTIONS.DEAL, items: [ITEMS.DECK, ITEMS.TARGET_HAND], custom: { target_hand: 1, deal: 1 }}),
                        new Instruction({ targets: [ TARGETS.SYSTEM ], action: ACTIONS.EVAL, items: [ITEMS.DECK], custom: { eval: 'size:gt:0'}}),
                        new Instruction({ targets: [ TARGETS.SPLIT ], action: ACTIONS.NEXT, items: ITEMS.STEPS, steps: ['setup:ones:1', 'setup:first'] })
                    ],
                    first: [
                        new Instruction({ targets: [ TARGETS.SYSTEM, TARGETS.EVERYONE ], action: ACTIONS.FIND, items: [ITEMS.HANDS], custom: {eval: 'card', properties: ['suit:eq:Trump','rank:eq:II']} }),

                    ]
                }
            }
        }
    } ),
}