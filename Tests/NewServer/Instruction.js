/*
    A single part of a single step, an instruction is any part of a game
*/

class Instruction {
    constructor(args) {
        this._targets = args.targets;
        this._action = args.action;
        this._items = args.items;
        this._custom = args.custom;
        this._steps = args.steps;
    }
    get targets() {
        return this._targets;
    }
    get action() {
        return this._action;
    }
    get items() {
        return this._items;
    }
    get custom() {
        return this._custom;
    }
    get steps() {
        return this._steps;
    }
}

module.exports = Instruction;