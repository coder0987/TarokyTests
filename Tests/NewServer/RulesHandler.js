const DefaultRules = require("./DefaultRules.js");
const RulesReader = require("./RulesReader.js");
const Logger = require('./Logger.js');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const MAX_TEMPLATE_NAME_LENGTH = 20;

function getTemplateFiles(dirPath) {
    const files = fs.readdirSync(dirPath);
    
    const txtFiles = files
        .filter(file => file.endsWith('.json'))
        .map(file => path.basename(file, '.json'));

    return txtFiles;
}

const sanitizeTemplateName = (name) => {
    const sanitized = name.replace(/[^a-zA-Z0-9-_\.]/g, '');

    return sanitized.length > MAX_TEMPLATE_NAME_LENGTH
        ? sanitized.slice(0, MAX_TEMPLATE_NAME_LENGTH)
        : sanitized;
};

const RulesHandler = {
    useTemplate: (rules, templateName) => {
        if (typeof templateName === 'string' && templateName === 'blank') {
            Logger.log('Blank template used');
            Object.keys(rules).forEach(key => {
                delete rules[key];
            });
            rules.basic = {};
            rules._phases = {};
            return;
        }
        if (!DefaultRules.getTemplate(templateName)) {return;}
        Object.keys(rules).forEach(key => {
            delete rules[key];
        });
        const template = DefaultRules.getTemplate(templateName);
        _.merge(rules, _.cloneDeep(template));
    },
    useCustomTemplate: (rules, username, templateName) => {
        if (typeof templateName !== 'string') {return false;}
        if (typeof username !== 'string' || username === 'Guest') {return false;}
        templateName = sanitizeTemplateName(templateName);

        if (templateName.length === 0) {return false;}

        let rule = RulesReader.loadJSON(path.join('./Templates', username.toLowerCase(), templateName + '.json'));
        if (!rule) {return;}
        Object.keys(rules).forEach(key => {
            delete rules[key];
        });
        _.merge(rules, rule);
    },
    saveTemplate: (rules, username, templateName) => {
        Logger.log('Save template attempt: ' + rules + username + templateName);
        if (!rules || !username || typeof templateName !== 'string') {return false;}
        if (typeof username !== 'string' || username === 'Guest') {return false;}

        username = username.toLowerCase();
        const userTemplatesPath = path.join('./Templates', username);

        templateName = sanitizeTemplateName(templateName);

        if (!fs.existsSync(userTemplatesPath)) {
            // Create the directory if it doesn't exist
            fs.mkdirSync(userTemplatesPath, { recursive: true });
        }

        let userTemplates = getTemplateFiles(userTemplatesPath);
        
        if (userTemplates.length >= 5) {
            //Reached limit
            return false;
        }
        try {
            let json = JSON.stringify(rules);
            fs.writeFileSync(path.join(userTemplatesPath, `${templateName}.json`), json);
            return true;
        } catch (error) {
            Logger.log(error);
            return false;
        }
    },
    getUserTemplates: (username) => {
        if (typeof username !== 'string' || username === 'Guest') {return [];}
        username = username.toLowerCase();
        const userTemplatesPath = path.join('./Templates', username);
        if (!fs.existsSync(userTemplatesPath)) {
            return [];
        }
        return getTemplateFiles(userTemplatesPath);
    }
}

module.exports = RulesHandler;