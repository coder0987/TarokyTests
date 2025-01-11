/*
    Built-in games for MachTarok are here. Players can use these as templates or play with them as-is
*/

const Rules = require('./Rules.js');
const fs = require('fs');
const path = require('path');

function getTemplateFiles(dirPath) {
    const files = fs.readdirSync(dirPath);
    
    const txtFiles = files
        .filter(file => file.endsWith('.tarok'))
        .map(file => path.basename(file, '.tarok'));

    return txtFiles;
}

const templates = {}

const DefaultRules = {
    templateList: [],
    getTemplate: (name) => {
        if (templates[name]) {
            return templates[name];
        } else if (DefaultRules.templateList.includes(name)) {
            templates[name] = new Rules({file:'./Templates/' + name + '.tarok'});
            return templates[name];
        } else {
            return null;
        }
    }
}

DefaultRules.templateList = getTemplateFiles('./Templates');

module.exports = DefaultRules;