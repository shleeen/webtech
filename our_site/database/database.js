const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
const hash_callback = require('pbkdf2-password')();

let is_db_open = false;
let db;

// Promisify the hash function
const hash = (options) => {
  return new Promise((resolve, reject) => {
    hash_callback(options, (err, pass, salt, hash) => {
      if (err) return reject(err);
      resolve({pass: pass, salt: salt, hash: hash});
    })
  })
};

const database_path = "./database/database.db";

async function openDB() {
  try {
    const db = await sqlite.open({
      filename: database_path,
      mode: sqlite3.OPEN_READWRITE,
      driver: sqlite3.Database
    });
    await db.get("PRAGMA foreign_keys = ON");
    is_db_open = true;
    return db;
  } catch (e) { console.log(e); }
}

async function get(query, params) {
  if (!is_db_open) db = await openDB();
  const result = await db.get(query, params);
  return result;
}

async function all(query, params) {
  if (!is_db_open) db = await openDB();
  const result = await db.all(query, params);
  return result;
}

async function addUserType(type) {
  if (!is_db_open) db = await openDB();
  if (await db.get("SELECT * FROM user_type WHERE type = ?", [type])) {
    throw "user type '" + type + "' already exists";
  }
  await db.run("insert into user_type (type) values(?)", [type]);
}

async function addUser(username, first_name, last_name, email, pass) {
  if (!is_db_open) db = await openDB();
  if (await db.get("SELECT * FROM user WHERE username = ?", [username])) {
    throw "username '" + username + "' already taken";
  }
  if (await db.get("SELECT * FROM user WHERE email = ?", [email])) {
    throw "email '" + email + "' already taken";
  }
  const user = await hash( {password: pass} );
  const user_type = await db.get("SELECT id FROM user_type WHERE type = ?", ["normal"]);
  await db.run("insert into user (user_type_id, username, first_name, last_name, email, password_hash, password_salt) values(?, ?, ?, ?, ?, ?, ?)", [user_type.id, username, first_name, last_name, email, user.hash, user.salt]);
}

async function addProductions(creator, name, venue, banner_path, poster_path, producer, director, blurb, warnings, special_note) {
  if (!is_db_open) db = await openDB();
  const user = await db.get("SELECT id FROM user WHERE username = ?", [creator]);
  await db.run("insert into production (user_id, name, venue, banner_path, poster_path, producer, director, blurb, warnings, special_note) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [user.id, name, venue, banner_path, poster_path, producer, director, blurb, warnings, special_note]);
}

async function addShows(prodname, date, doors_open, total_seats) {
  if (!is_db_open) db = await openDB();
  const production = await db.get("SELECT id FROM production WHERE name = ?", [prodname]);
  await db.run("insert into show (production_id, date, doors_open, total_seats, sold) values(?, ?, ?, ?, ?)", [production.id, date, doors_open, total_seats, "0"]);
}

async function authenticate(email, pass) {
  if (!is_db_open) db = await openDB();
  const user = await db.get("SELECT password_hash, password_salt FROM user WHERE email = ?", [email]);
  if (!user) return false;
  const result = await hash( {password: pass, salt: user.password_salt} );
  if (result.hash === user.password_hash) return true;
  else return false;
}


exports.openDB = openDB;
exports.get = get;
exports.all = all;
exports.addUserType = addUserType;
exports.addUser = addUser;
exports.addProductions = addProductions;
exports.addShows = addShows;
exports.authenticate = authenticate;