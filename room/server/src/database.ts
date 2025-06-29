import mariadb from "mariadb";
import dotenv from "dotenv";
dotenv.config();

import {User} from "./types";

const pool = mariadb.createPool({
  host: "127.0.0.1",
  port: 3306,
  user: "TarokyAdmin",
  database: "machtarok",
  password: process.env.PASSWORD ?? "",
  connectionLimit: 15,
});

class Database {
  static async getUsers(): Promise<User[]> {
    let conn: mariadb.PoolConnection | undefined;
    let infoFromDatabase: User[];
    try {
      conn = await pool.getConnection();
      infoFromDatabase = await conn.query("SELECT * FROM users");
    } catch (err) {
      throw err;
    } finally {
      if (conn) conn.release();
    }
    return infoFromDatabase;
  }

  static async getUser(username: string): Promise<User | undefined> {
    username = username.toLowerCase();
    let conn: mariadb.PoolConnection | undefined;
    let infoFromDatabase: User[];
    try {
      conn = await pool.getConnection();
      infoFromDatabase = await conn.query(
        "SELECT * FROM users WHERE username = ?",
        username
      );
    } catch (err) {
      throw err;
    } finally {
      if (conn) conn.release();
    }
    return infoFromDatabase[0];
  }

  static async createUser(
    username: string,
    elo: number,
    admin: boolean,
    settings: any
  ): Promise<void> {
    username = username.toLowerCase();
    let conn: mariadb.PoolConnection | undefined;
    try {
      conn = await pool.getConnection();
      let usernameCheck = await conn.query(
        "SELECT id FROM users WHERE username = ?",
        username
      );
      if (usernameCheck.length > 0) {
        throw "User already exists";
      }
      await conn.query(
        "INSERT INTO users (username, elo, admin, settings) VALUES (?, ?, ?, ?)",
        [username, elo, admin, settings]
      );
    } catch (err) {
      throw err;
    } finally {
      if (conn) conn.release();
    }
  }

  static async createOrRetrieveUser(username: string): Promise<User> {
    username = username.toLowerCase();
    let conn: mariadb.PoolConnection | undefined;
    let info: User;
    try {
      conn = await pool.getConnection();
      let usernameCheck = await conn.query(
        "SELECT * FROM users WHERE username = ?",
        username
      );
      if (usernameCheck.length > 0) {
        info = (await Database.getUser(username)) as User;
      } else {
        await conn.query("INSERT INTO users (username) VALUES (?)", [username]);
        info = {
          username: username,
          elo: 300,
          admin: false,
          settings: null,
          avatar: 0,
          deck: "mach-deck-thumb",
          chat: true,
        };
      }
    } catch (err) {
      throw err;
    } finally {
      if (conn) conn.release();
    }
    return info;
  }

  static async updateUser(
    username: string,
    column: string,
    data: any
  ): Promise<void> {
    username = username.toLowerCase();
    let conn: mariadb.PoolConnection | undefined;
    const columns = ["settings", "elo", "avatar", "deck", "chat"];
    if (columns.includes(column)) {
      try {
        conn = await pool.getConnection();
        await conn.query(
          `UPDATE users SET ${column} = ? WHERE username in (?)`,
          [data, username]
        );
      } catch (err) {
        throw err;
      } finally {
        if (conn) conn.release();
      }
    }
  }

  static async updateUserAll(
    username: string,
    settings: any,
    avatar: number,
    deck: string,
    chat: boolean
  ): Promise<void> {
    username = username.toLowerCase();
    let conn: mariadb.PoolConnection | undefined;
    try {
      conn = await pool.getConnection();
      await conn.query(
        "UPDATE users SET settings = ?, avatar = ?, deck = ?, chat = ? WHERE username in (?)",
        [settings, avatar, deck, chat, username]
      );
    } catch (err) {
      throw err;
    } finally {
      if (conn) conn.release();
    }
  }

  static promiseCreateOrRetrieveUser(username: string): Promise<User> {
    return Promise.resolve(Database.createOrRetrieveUser(username));
  }
  static saveSettings(username: string, settings: any): void {
    Promise.resolve(Database.updateUser(username, "settings", settings));
  }
  static saveUserPreferences(
    username: string,
    settings: any,
    avatar: number,
    deck: string,
    chat: boolean
  ): void {
    Promise.resolve(
      Database.updateUserAll(username, settings, avatar, deck, chat)
    );
  }
}

export default Database;
