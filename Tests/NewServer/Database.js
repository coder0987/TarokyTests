/*
    Handles connections with the MachTarok database
*/

const mariadb = require('mariadb');
require('dotenv').config();

const pool = mariadb.createPool({
     host: '127.0.0.1',
     port: 3306,
     user:'TarokyAdmin',
     database: 'machtarok',
     password: process.env.PASSWORD,
     connectionLimit: 15
});

class DatabaseHandler {
    static async getUsers() {
        let conn,
            infoFromDatabase;
        try {
            conn = await pool.getConnection();
            infoFromDatabase = await conn.query("SELECT * FROM users");
        } catch (err) {
            throw err;
        } finally {
            if (conn) conn.end();
        }
        return infoFromDatabase;//array of objects [{username, elo, admin, settings}, {username...}...]
    }

    static async getUser(username) {
        username = username.toLowerCase();
        let conn,
            infoFromDatabase;
        try {
            conn = await pool.getConnection();
            infoFromDatabase = await conn.query("SELECT * FROM users WHERE username = ?", username);
        } catch (err) {
            throw err;
        } finally {
            if (conn) conn.end();
        }
        return infoFromDatabase[0];//one object {username,elo,admin,settings}
    }

    static async createUser(username, elo, admin, settings) {
        username = username.toLowerCase();
        let conn;
        try {
            conn = await pool.getConnection();
            let usernameCheck = await conn.query("SELECT id FROM users WHERE username = ?", username);
            if (usernameCheck.length > 0) {
                throw "User already exists";
            }
            await conn.query("INSERT INTO users (username, elo, admin, settings) VALUES (?, ?, ?, ?)", [username, elo, admin, settings]);
        } catch (err) {
            throw err;
        } finally {
            if (conn) conn.end();
        }
    }

    static async createOrRetrieveUser(username) {
        username = username.toLowerCase();
        let conn,
            info;
        try {
            conn = await pool.getConnection();
            let usernameCheck = await conn.query("SELECT * FROM users WHERE username = ?", username);

            if (usernameCheck.length > 0) {
                info = await Database.getUser(username);
            } else {
                await conn.query("INSERT INTO users (username) VALUES (?)", [username]);
                info = {username: username, elo: 300, admin: false, settings: null, avatar: 0, deck: 'mach-deck-thumb', chat: true};
            }
        } catch (err) {
            throw err;
        } finally {
            if (conn) conn.end();
        }
        return info;
    }



    static async updateUser(username, column, data) {
        username = username.toLowerCase();
        let conn;
        if (column == 'settings' || column == 'admin' || column == 'elo' || column == 'avatar' || column == 'deck' || column == 'chat') {
            try {
                conn = await pool.getConnection();
                await conn.query("UPDATE users SET " + column + " = ? WHERE username in (?)", [data, username]);
            } catch (err) {
                throw err;
            } finally {
                if (conn) conn.end();
            }
        }
    }

    static promiseCreateOrRetrieveUser(username) {
        return Promise.resolve(Database.createOrRetrieveUser(username));
    }
    static saveSettings(username,settings) {
        Promise.resolve(Database.updateUser(username,'settings',settings));
    }
    static saveUserPreferences(username,settings,avatar,deck,chat) {
        Promise.resolve(Database.updateUser(username,'settings',settings));
        Promise.resolve(Database.updateUser(username,'avatar',avatar));
        Promise.resolve(Database.updateUser(username,'deck',deck));
        Promise.resolve(Database.updateUser(username,'chat',chat));
    }
}

const Database = {
    loadUser: (args) => {
        DatabaseHandler.promiseCreateOrRetrieveUser(args.name).then((info) => {
            ConnectionHandler.loadData({ info: info, socketId: args.socketId });
        }).catch((err) => {
            Logger.error(err);
        }); 
    }
}

module.exports = Database;