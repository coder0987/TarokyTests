/*
    This is the rules engine. It handles player's rules, phases, etc. and gives them to the room
*/


class Rules {
    constructor(args = {}) {
        const {basic = {

        }, phases = {

        }} = args;

        this.basic = basic;
        this.phases = phases;
    }

    get phasesList() {
        //Get a list of phases, not steps or anything
        return Object.keys(this.phases);
    }
}


module.exports = Rules;