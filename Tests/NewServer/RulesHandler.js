const ConnectionHandler = require("./ConnectionHandler");
const DefaultRules = require("./DefaultRules");

const RulesHandler = {
    userRequest: (args = {}) => {
        switch (args.type) {
            case 'get':
                ConnectionHandler.sendRules({socketId: args.socketId, rule: RulesHandler.get(args)});
                break;
            case 'set':
                ConnectionHandler.sendRules({socketId: args.socketId, rule: RulesHandler.set(args)});
                break;
            case 'template':
                if (typeof args.data === 'string' && DefaultRules[args.data]) {
                    //Send back the requested rules set
                    ConnectionHandler.sendTemplate({socketId: args.socketId, template: DefaultRules[args.data]});
                } else {
                    ConnectionHandler.sendTemplateList({socketId: args.socketId});
                }
                break;
            default:
                return;
        }
    },
    get: (args) => {
        Logger.log('get rule ' + JSON.stringify(args));
    },
    set: (args) => {
        Logger.log('set rule ' + JSON.stringify(args));
    }
}