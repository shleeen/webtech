"use strict"
// -------- DATABASE
const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");

create();

async function create() {
  try {
    const db = await sqlite.open({
      filename: './database/human.db',
      driver: sqlite3.Database
    });
    await db.run("create table if not exists human (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT)");
    await db.run("replace into human values (0, 'paul','paul@paulslife.com')");
    await db.run("replace into human values (1, 'esther','irock@gmail.com')");
    await db.close();
  } catch (e) { console.log(e); }
}

// -------- APP
const app = require('./app');

const server = app.listen(3000, () => {
  console.log(`Express is running on port ${server.address().port}`);
});