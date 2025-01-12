/*
    This is the rules engine. It handles player's rules, phases, etc. and gives them to the room
*/
const RulesReader = require('./RulesReader');
const DefaultSteps = require('./DefaultSteps');
const Logger = require('./Logger');

function phaseSanitizer(input) {
    return input.replace(/[^a-zA-Z]/g, '').toLowerCase();
}


class Rules {
    constructor(args = {}) {
        if (typeof args.file === 'string') {
            RulesReader.parseGameConfig(args, args.file);
        }
        const {basic = {

        }, phases = {

        }} = args;

        this._basic = basic;
        this._phases = phases;
    }

    set steps(newSteps) {
        if (!newSteps) {
            return;
        }
    
        this.phases = Object.keys(newSteps);
        Logger.log(this.phasesList);
        Logger.log(newSteps);
    
        for (let i in newSteps) {
            if (typeof i !== 'string' || !i) {continue;}
            const currentStepList = Object.keys(this._phases[i].steps); // ['step', 'step']
            const newStepList = newSteps[i]; // ['step', 'step']
            this._phases[i].order = newStepList;

            for (let i in newStepList) {
                newStepList[i] = phaseSanitizer(newStepList[i]);
            }
    
            if (newStepList.length === currentStepList.length) {
                //Assume the steps are the same. Order was already handled.
            } else if (newStepList.length > currentStepList.length) {
                // Insert new step(s)
                const stepsToAdd = newStepList.filter(step => !currentStepList.includes(step));
                stepsToAdd.forEach(step => {
                    const index = newStepList.indexOf(step);
                    this._phases[i].steps[step] = DefaultSteps.get(step);
                });
            } else {
                // Delete steps that are no longer in the new list
                const stepsToDelete = currentStepList.filter(step => !newStepList.includes(step));
                stepsToDelete.forEach(step => {
                    delete this._phases[i].steps[step];
                });
            }
        }
        //Logger.log(JSON.stringify(this._phases, null, 4));
    }

    set phases(newPhases) {
        //Comes in as ['phase','phase']
        if (!newPhases) {return;}

        for (let i in newPhases) {
            newPhases[i] = phaseSanitizer(newPhases[i]);
        }

        const currentPhases = this.phasesList;

        if (newPhases.length === currentPhases.length) {
            //Might be the same, might have insertion + deletion = rename
            for (let i in newPhases) {
                if (newPhases[i] !== currentPhases[i]) {
                    Logger.log('Rename ' + newPhases[i] + ' to ' + currentPhases[i])
                    const oldPhase = currentPhases[i];
                    const newPhase = newPhases[i];
                    
                    this._phases[newPhase] = this._phases[oldPhase];
                    delete this._phases[oldPhase];
                }
            }
        } else if (newPhases.length > currentPhases.length) {
            //Insert new blank phase
            
            const newPhaseNames = newPhases.filter(phase => !currentPhases.includes(phase));

            newPhaseNames.forEach(phase => {
                this._phases[phase] = {
                    steps: {},
                    order: []
                };
                Logger.log('New phase ' + phase)
            });
        } else {
            //Delete one or more phases
            const phaseToDelete = currentPhases.filter(phase => !newPhases.includes(phase));

            phaseToDelete.forEach(phase => {
                delete this._phases[phase];
            });
        }
    }

    set basic(basic) {
        let {
            deck = this._basic ? this._basic.deck : undefined,
            numDecks = this._basic ? this._basic.numDecks : undefined,
            deckScaling = this._basic ? this._basic.deckScaling : undefined,
            playerMin = this._basic ? this._basic.playerMin : undefined,
            playerMax = this._basic ? this._basic.playerMax : undefined,
            type = this._basic ? this._basic.type : undefined,
            start = this._basic ? this._basic.start : undefined,
        } = basic || {};
    
        this._basic = { deck, numDecks, deckScaling, playerMin, playerMax, type, start };
    }

    get phases() {
        return this._phases;
    }

    get basic() {
        return this._basic;
    }

    get phasesList() {
        //Get a list of phases, not steps or anything
        return Object.keys(this._phases);
    }
    
    get stepsList() {
        let stepKeys = {};
        for (let i in this.phases) {
            if (this.phases[i] && typeof this.phases[i] === 'object') {
                stepKeys[i] = this.phases[i].order;
            } else {
                stepKeys[i] = [];
            }
        }
        return stepKeys;
    }

    setInstructions(phase, instructions) {
        if (typeof phase !== 'string') {
            return false;
        }

        phase = phaseSanitizer(phase);
    
        if (!this.phases[phase]) {
            return false;
        }
    
        // Verify instructions object structure
        if (typeof instructions !== 'object' || instructions === null) {
            return false;
        }
    
        // Check if 'order' exists and is an array
        if (!Array.isArray(instructions.order)) {
            return false;
        }
    
        // Each step in 'order' must be a key in 'steps'
        for (let i = 0; i < instructions.order.length; i++) {
            if (!instructions.steps[instructions.order[i]]) {
                return false;
            }
        }
    
        // Each step in 'steps' must be listed in 'order'
        for (let step in instructions.steps) {
            if (!instructions.order.includes(step)) {
                return false;
            }
        }
    
        // Validate each instruction inside each step
        for (let step of instructions.order) {
            const instructionsForStep = instructions.steps[step];
            if (!Array.isArray(instructionsForStep)) {
                return false;
            }
    
            for (let instruction of instructionsForStep) {
                if (typeof instruction !== 'object' || instruction === null) {
                    return false;
                }
    
                if (!Array.isArray(instruction.targets) || !instruction.action || !instruction.items) {
                    return false;
                }
    
                // Custom is optional, but it should be an object if it exists
                if (instruction.custom && typeof instruction.custom !== 'object') {
                    return false;
                }
            }
        }
    
        // No extra properties should exist in the instructions object
        const allowedProperties = ['order', 'steps'];
        for (let prop in instructions) {
            if (!allowedProperties.includes(prop)) {
                return false;
            }
        }

        this._phases[phase] = instructions;

        return true;
    }

    setStepInstructions(phase, step, instructions) {
        if (typeof phase !== 'string') {
            return false;
        }

        phase = phaseSanitizer(phase);
    
        if (!this.phases[phase]) {
            return false;
        }

        if (typeof step !== 'string') {
            return false;
        }
    
        if (!this.phases[phase].steps[step]) {
            return false;
        }
    
        // Validate each instruction
        if (!Array.isArray(instructions)) {
            return false;
        }

        for (let instruction of instructions) {
            if (typeof instruction !== 'object' || instruction === null) {
                return false;
            }

            if (!Array.isArray(instruction.targets) || !instruction.action || !instruction.items) {
                return false;
            }

            // Custom is optional, but it should be an object if it exists
            if (instruction.custom && typeof instruction.custom !== 'object') {
                return false;
            }
        }
    
        this._phases[phase].steps[step] = instructions;
        
        return true;
    }
    
}


module.exports = Rules;