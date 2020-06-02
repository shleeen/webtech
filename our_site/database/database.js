const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");
const hash_callback = require("pbkdf2-password")();
const zxcvbn = require("zxcvbn");

let is_db_open = false;
let db;

// Promisify the hash function
const hash = (options) => {
  return new Promise((resolve, reject) => {
    hash_callback(options, (err, pass, salt, hash) => {
      if (err) return reject(err);
      resolve({pass: pass, salt: salt, hash: hash});
    });
  });
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

async function run(query, params) {
  if (!is_db_open) db = await openDB();
  const result = await db.run(query, params);
  return result;
}

async function addUserType(type) {
  if (!is_db_open) db = await openDB();
  if (await db.get("SELECT * FROM user_type WHERE type = ?", [type])) {
    throw "user type '" + type + "' already exists";
  }
  await db.run("insert into user_type (type) values(?)", [type]);
}

async function addUser(username, usertype, first_name, last_name, email, pass) {
  if (!is_db_open) db = await openDB();
  if (await db.get("SELECT * FROM user WHERE username = ?", [username])) {
    throw "Username '" + username + "' already taken";
  }
  if (await db.get("SELECT * FROM user WHERE email = ?", [email])) {
    throw "Email '" + email + "' already taken";
  }
  if (zxcvbn(pass).score < 2) {
    throw "Password is too weak";
  }
  const user = await hash( {password: pass} );
  const user_type = await db.get("SELECT id FROM user_type WHERE type = ?", [usertype]);
  await db.run("insert into user (user_type_id, username, first_name, last_name, email, password_hash, password_salt) values(?, ?, ?, ?, ?, ?, ?)", [user_type.id, username, first_name, last_name, email, user.hash, user.salt]);
}

async function addProductions(creator, name, venue, banner_path, poster_path, producer, director, blurb, warnings, special_note) {
  if (!is_db_open) db = await openDB();
  const user = await db.get("SELECT id FROM user WHERE username = ?", [creator]);
  await db.run("insert into production (user_id, name, venue, banner_path, poster_path, producer, director, blurb, warnings, special_note) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [user.id, name, venue, banner_path, poster_path, producer, director, blurb, warnings, special_note]);
}

async function addShows(prodname, date, doors_open, total_seats, sold) {
  if (!is_db_open) db = await openDB();
  const production = await db.get("SELECT id FROM production WHERE name = ?", [prodname]);
  await db.run("insert into show (production_id, date, doors_open, total_seats, sold) values(?, ?, ?, ?, ?)", [production.id, date, doors_open, total_seats, sold]);
}

async function addTicketTypes(prodname, category, price) {
  if (!is_db_open) db = await openDB();
  const production = await db.get("SELECT id FROM production WHERE name = ?", [prodname]);
  const show = await db.get("SELECT id FROM show WHERE production_id = ?", [production.id]);
  await db.run("insert into ticket_type (show_id, category, price) values(?, ?, ?)", [show.id, category, price]);
}

// eh hm order total needs to match ticket types
async function addBooking(prodname, username, orderTotal, bookingTime, paid, bookinfRef, collected){
  if (!is_db_open) db = await openDB();
  const production = await db.get("SELECT id FROM production WHERE name = ?", [prodname]);
  const show = await db.get("SELECT id FROM show WHERE production_id = ?", [production.id]);
  const user = await db.get("SELECT id FROM user WHERE username = ?", [username]);
  const result = await db.run("insert into booking (show_id, user_id, order_total, booking_time, paid, booking_ref, collected) values(?, ?, ?, ?, ?, ?, ?)", [show.id, user.id, orderTotal, bookingTime, paid, bookinfRef, collected]);
}

async function addTickets(bookingID, ticketTypeID, seatNumbers){
  if (!is_db_open) db = await openDB();
  for (const seatNum of seatNumbers) {
    await db.run("insert into ticket (booking_id, ticket_type_id, seat_number) values(?, ?, ?)", [bookingID, ticketTypeID, seatNum]);
  }
}

async function authenticate(email, pass) {
  if (!is_db_open) db = await openDB();
  const user = await db.get("SELECT id, password_hash, password_salt FROM user WHERE email = ?", [email]);
  if (!user) return false;
  const result = await hash( {password: pass, salt: user.password_salt} );
  if (result.hash === user.password_hash) return user.id;
  else return false;
}


exports.openDB = openDB;
exports.get = get;
exports.all = all;
exports.run = run;
exports.addUserType = addUserType;
exports.addUser = addUser;
exports.addProductions = addProductions;
exports.addShows = addShows;
exports.addTicketTypes = addTicketTypes;
exports.addBooking = addBooking;
exports.addTickets = addTickets;
exports.authenticate = authenticate;