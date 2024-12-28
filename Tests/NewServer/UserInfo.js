class UserInfo {
    constructor(args = {}) {
        this._avatar = args.avatar || 0;
        this._elo = args.elo || 300;
        this._admin = args.admin || false;
        this._settings = args.settings ? new UserSettings(args.settings) : [];
        this._chat = args.chat || true;
        this._deck = args.deck || 0;
    }
    get avatar() {
        return this._avatar;
    }
    set avatar(a) {
        this._avatar = a;
    }
}

module.exports = UserInfo;