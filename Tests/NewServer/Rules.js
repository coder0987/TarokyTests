/*
    This is the rules engine. It handles player's rules, phases, etc. and gives them to the room
*/
const RulesReader = require('./RulesReader')

class Rules {
    constructor(args = {}) {
        if (typeof args.file === 'string') {
            //Read rules from a file
            RulesReader.parseGameConfig(this, args.file);
        } else {
            const {basic = {

            }, phases = {

            }} = args;

            this.basic = basic;
            this.phases = phases;
        }
    }

    get phasesList() {
        //Get a list of phases, not steps or anything
        return Object.keys(this.phases);
    }
    
    get stepsList() {
        let stepKeys = {};
        for (let i in this.phases) {
            if (this.phases[i] && typeof this.phases[i] === 'object') {
                stepKeys[i] = Object.keys(this.phases[i].steps);
            } else {
                stepKeys[i] = [];
            }
        }
        return stepKeys;
    }    
}


module.exports = Rules;