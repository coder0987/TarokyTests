const DefaultRules = require("./DefaultRules.js");
const _ = require('lodash');

const RulesHandler = {
    useTemplate: (rules, templateName) => {
        if (!DefaultRules.getTemplate(templateName)) {return;}
        const template = DefaultRules.getTemplate(templateName);
        _.merge(rules, _.cloneDeep(template));
    }
}

module.exports = RulesHandler;