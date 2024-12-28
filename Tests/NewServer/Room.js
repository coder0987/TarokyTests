/*
    This is the room. It holds the players and the audience
    This is where players will interact with the game
*/

const [ ACTIONS, ITEMS, TARGETS ] = require('./Constants.js');

class Room {
    constructor(args) {
        this._players = [];
        this._audience = [];
        this._rules = args.rules || DefaultRules.WestFestTaroky;
        this._step = '';
        this._choice = 0;
        this._piles = [];
    }
    get players() {
        return this._players;
    }
    get audience() {
        return this._audience;
    }
    get rules() {
        return this._rules;
    }
    get step() {
        return this._step;
    }
    get choice() {
        return this._choice;
    }
    set rules(rules) {
        this._rules = rules;
    }
    set step(step) {
        this._step = step;
    }
    set choice(choice) {
        this._choice = choice;
    }
    begin() {
        if (this.step === '') {
            this.step = rules.basic.start;
        }
        this.next();
    }
    next() {
        let current = this.step.split(':');
        let phase = this.rules[current[0]];
        let step = phase.steps[current[1]];
        if (current.length == 2) {
            current.push('0')
        }
        let instruction = step[+current[2]];
        switch (instruction.action) {
            case ACTIONS.NEXT:
                this.step = instruction.steps[this.choice];
                return this.next();
            case ACTIONS.CHOOSE:
                //Requires player feedback
                break;
            case ACTIONS.EVAL:
                this.choice = this.eval(instruction.targets, instruction.custom);
                return this.next();
            case ACTIONS.PAY:
                this.pay(instruction.targets, instruction.custom);
                break;
            case ACTIONS.SHUFFLE:
                this.shuffle(instruction.items);
                break;
            case ACTIONS.DEAL:
                this.deal(instruction.targets, instruction.items, instruction.custom)
                break;
        }
    }
    eval(targets, custom) {

    }
    shuffle() {}
    cut() {}
    pay() {}
    deal() {}
}