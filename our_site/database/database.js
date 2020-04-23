const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

const database_path = "./database/database.db";

async function openDB() {
  try {
    const db = await sqlite.open({
      filename: database_path,
      mode: sqlite3.OPEN_READWRITE,
      driver: sqlite3.Database
    });
    await db.get("PRAGMA foreign_keys = ON");
    return db;
  } catch (e) { console.log(e); }
}

exports.openDB = openDB;