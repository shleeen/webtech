const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");
const hash_callback = require("pbkdf2-password")();
const zxcvbn = require("zxcvbn");
const validator = require("validator");

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

// Used for booking reference
function randomString(length, chars) {
  var result = "";
  for (var i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

const database_path = "./database/database.db";

function validateString(string) {
  if (typeof(string) !== "string") throw "invalid";
  if (string === "") throw "empty";
}

async function openDB() {
  try {
    const db = await sqlite.open({
      filename: database_path,
      mode: sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE,
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
  validateString(username);
  validateString(first_name);
  validateString(last_name);
  if (await db.get("SELECT * FROM user WHERE username = ?", [username])) {
    throw "Username '" + username + "' already taken";
  }
  if (!validator.isEmail(email)) {
    throw email + " is not a valid email address";
  }
  if (username.length < 3) throw "Username too short";
  if (await db.get("SELECT * FROM user WHERE email = ?", [email])) {
    throw "Email '" + email + "' already taken";
  }
  if (zxcvbn(pass).score < 2) {
    throw "Password is too weak";
  }
  const user = await hash( {password: pass} );
  const user_type = await db.get("SELECT id FROM user_type WHERE type = ?", [usertype]);
  const result = await db.run("insert into user (user_type_id, username, first_name, last_name, email, password_hash, password_salt) values(?, ?, ?, ?, ?, ?, ?)", [user_type.id, username, first_name, last_name, email, user.hash, user.salt]);
  return result.lastID;
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
  await db.run("insert into ticket_type (production_id, category, price) values(?, ?, ?)", [production.id, category, price]);
}

// eh hm order total needs to match ticket types
async function addBooking(show_id, user_id, orderTotal, bookingTime, paid, bookinfRef, collected) {
  if (!is_db_open) db = await openDB();
  return await db.run("insert into booking (show_id, user_id, order_total, booking_time, paid, booking_ref, collected) values(?, ?, ?, ?, ?, ?, ?)", [show_id, user_id, orderTotal, bookingTime, paid, bookinfRef, collected]);
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

async function getTicketTypes(prod_id) {
  if (!is_db_open) db = await openDB();
  let sql = "SELECT * FROM ticket_type";
  if (prod_id) sql += " WHERE production_id = ?";
  const rows = await db.all(sql, prod_id);
  return rows;
}

async function getSeats(show_id) {
  if (!is_db_open) db = await openDB();
  const sql = "SELECT b.show_id, t.seat_number FROM ticket t INNER JOIN booking b ON b.id = t.booking_id INNER JOIN show s ON b.show_id = s.id WHERE b.show_id = ?";
  const rows = await db.all(sql, show_id);
  return rows;
}

async function bookTickets(prod_id, show_id, user_id, seat_nums, ticket_amounts) {
  if (!is_db_open) db = await openDB();
  let taken_seats = await this.getSeats(show_id);
  taken_seats = taken_seats.map(x => x.seat_number);
  // Check we're not trying to book seats that are already taken
  if (taken_seats.some(v => seat_nums.includes(v))) {
    throw "Seat already taken";
  }
  let total_price = 0;
  let num_tickets = 0;
  const ticket_types = await this.getTicketTypes(prod_id);
  for (const type of ticket_types) {
    total_price += ticket_amounts[type.id] * type.price;
    num_tickets += ticket_amounts[type.id];
  }
  // Check if we have the same amount of tickets and seat numbers
  if (num_tickets !== seat_nums.length)
    throw "Seat numbers and tickets don't match";
  const booking_time = new Date();
  const booking_ref = "REF-" + randomString(8, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  const result = await this.addBooking(show_id, user_id, total_price, booking_time.toISOString(), 1, booking_ref, 0);
  num_tickets = 0;
  for (const type of ticket_types) {
    await this.addTickets(result.lastID, type.id, seat_nums.slice(num_tickets, num_tickets + ticket_amounts[type.id]));
    num_tickets += ticket_amounts[type.id];
  }
  return booking_ref;
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
exports.getTicketTypes = getTicketTypes;
exports.getSeats = getSeats;
exports.bookTickets = bookTickets;