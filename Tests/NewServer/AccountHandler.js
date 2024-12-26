/*
    Works with the SSO to verify account credentials
*/
const ConnectionHandler = require('./ConnectionHandler.js');
const Database = require('./Database.js');
const https = require('https');
const Logger = require('./Logger.js');

const AccountHandlerTools = {
    verifyCredentials: (username, token) => {
        return typeof username === 'string' && typeof token === 'string' && username.length > 1 && token.length > 1;
    },
    validate: (args) => {
        try {
            const options = {
                hostname: 'sso.smach.us',
                path: '/verify',
                method: 'POST',
                protocol: 'https:',
                headers: {
                    'Authorization': args.name + ':' + args.token
                }
            };
            https.request(options, (res) => {
                if (res.statusCode === 200) {
                    AccountHandler.cache[args.name] = token;
                    ConnectionHandler.signInSuccess(args);
                    Database.loadUser({ username: args.name, socketId: args.socketId });
                    Logger.log('User ' + socketId + ' did auto sign-in ' + socket.handshake.auth.username);
                } else {
                    Logger.log(username + ' failed to sign in with status code ' + res.statusCode);
                }
            }).on("error", (err) => {
            }).end();
        } catch (err) {
        }
        
    }
}

const AccountHandler = {
    cache: [],
    signIn: (args) => {
        if (!AccountHandlerTools.verifyCredentials(args.username, args.token)) {
            return;
        }
        args.name = username.toLowerCase();
        if (this.cache[args.name] == token) {
            ConnectionHandler.signInSuccess(args);
            Database.loadUser({ username: args.name, socketId: args.socketId });
        }
        AccountHandlerTools.validate(args);
    }
}

module.exports = AccountHandler;