/*
    This new server does NOT serve files. It serves Socket.IO connections
    This server handles game logic. It does not handle rendering.
    This is the backend for MachTarok game engine
*/

const LOG_LEVEL = process.argv[3] || 3;

const Logger = require('./Logger.js');
Logger.logLevel = LOG_LEVEL;

const ConnectionHandler = require('./ConnectionHandler.js');

Logger.log('Socket.IO listening on localhost:3000');