const DefaultRules = require("./DefaultRules.js");
const _ = require('lodash');

const RulesHandler = {
    useTemplate: (rules, templateName) => {
        if (!DefaultRules[templateName]) {return;}
        const template = DefaultRules[templateName];
        _.merge(rules, _.cloneDeep(template));
    }
}

module.exports = RulesHandler;