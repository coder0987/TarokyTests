/*
    A list of the user's default settings objects
    May come in as a string
 */

const Logger = require('./Logger.js');

UserSettingsTools = {
    convertString: (notation) => {
        if (!notation) {
            return null;
        }
        let settingsObject = {};
        let theSettings = notation.split(';')
        for (let i in theSettings) {
            let [setting,rule] = theSettings[i].split('=');
            if (u(setting) || u(rule)) {
                Logger.debug('Undefined setting or rule')
            } else {
                switch (setting) {
                    case 'difficulty':
                        if (DIFFICULTY_TABLE[rule]) {
                            settingsObject.difficulty = +rule;
                        }
                        break;
                    case 'timeout':
                        rule = +rule;
                        if (!isNaN(rule)) {
                            if (rule <= 0) {
                                rule = 0;//No timeout for negatives
                            } else if (rule <= 20000) {
                                rule = 20000;//20 second min
                            } else if (rule >= 3600000) {
                                rule = 3600000;//One hour max
                            }
                           settingsObject.timeout = rule;
                        }
                        break;
                    case 'lock':
                    case 'locked':
                        settingsObject.lock = rule;
                        break;
                    case 'aceHigh':
                        settingsObject.aceHigh = rule == 'true';
                        break;
                    case 'pn':
                        //Handled later
                        break;
                    default:
                        Logger.warn('Unknown setting: ' + setting + '=' + rule);
                }
            }
        }
        return settingsObject;
    }
}

class UserSettings {
    constructor(args) {
        if (typeof args.settings === 'string') {
            //must turn into object
            this._settings = UserSettingsTools.convertString(args.settings);
        } else {
            //already an object
            this._settings = args.settings;
        }
    }
    get settings() {
        return this._settings[0];
    }
    get settings() {
        return this._settings;
    }
}

module.exports = UserSettings;