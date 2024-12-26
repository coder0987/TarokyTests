const Logger = {
    log: (a) => console.log(a),
    warn: (a) => console.warn(a),
    error: (a) => console.error(a),
    event: (evt, args) => {
        switch (evt) {
            case 'join':
                this.log('Player joined with socket id ' + args.socketId);
                break;
            default:
                this.log('Event ' + evt + ' with args ' + JSON.stringify(args));
        }
    }
}

module.exports = Logger;