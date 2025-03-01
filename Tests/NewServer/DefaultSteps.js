const fs = require('fs');
const path = require('path');
const RulesReader = require('./RulesReader');
const Logger = require('./Logger');

const readStepsFromFile = (fileName) => {
    let rule = {};
    RulesReader.parseGameConfig(rule, './Steps/' + fileName + '.step');
    return rule.phases.default.steps.default;
}

const readSteps = {}
let availableSteps = {};

const DefaultSteps = {
    get: (name) => {
        name = name.toLowerCase();
        if (availableSteps[name]) {
            if (readSteps[name]) {
                return readSteps[name];
            }
            readSteps[name] = readStepsFromFile(name);
            return readSteps[name];
        }
        return [];
    }
}

{
    const files = fs.readdirSync('./Steps');
    const txtFiles = files
        .filter(file => file.endsWith('.step'))
        .map(file => path.basename(file, '.step'));
    for (let i in txtFiles) {
        availableSteps[txtFiles[i]] = true;
    }
}

module.exports = DefaultSteps;