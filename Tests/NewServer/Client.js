const Rules = require('./Rules.js');
const UserInfo = require('./UserInfo.js');

class Client {
    constructor(args = {}) {
        this._id = args.id;
        this._room - -1;
        this._roomsSeen = {};
        this._status = 1; // 0 = diconnecting, 1 = connected
        this._username = 'Guest';
        this._token = -1;
        this._userInfo = new UserInfo();
        this._timeLastMessageSent = 0;
        this._rules = new Rules();
    }
    get userInfo() {
        return this._userInfo;
    }
    get rules() {
        return this._rules;
    }
    get username() {
        return this._username;
    }
    get token() {
        return this._token;
    }
    set userInfo(info) {
        this._userInfo = new UserInfo(info);
    }
    set username(username) {
        this._username = username;
    }
    set token(token) {
        this._token = token;
    }
    set rules(rules) {
        this._rules = rules;
    }
}

module.exports = Client;