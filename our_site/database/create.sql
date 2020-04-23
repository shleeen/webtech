-- Drop/Create script to initialise the database tables.
.open database.db
PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS user_type;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS production;
DROP TABLE IF EXISTS show;
DROP TABLE IF EXISTS ticket_type;
DROP TABLE IF EXISTS booking;
DROP TABLE IF EXISTS ticket;

-- Use CAPITALS for SQL keywords and snake_case for table and column names.
-- SQLite reccommends against using the AUTOINCREMENT KEYWORD, it will automatically assign unique id values anyway.
-- The first column in every table should be id INTEGER PRIMARY KEY
-- SQLite doesn't need lengths for its datatypes, so just use TEXT and not VARCHAR(n)
-- There is no BOOLEAN type in SQLite, instead use INTEGER with 0 and 1 values

CREATE TABLE user_type (
    id    INTEGER  PRIMARY KEY,
    type  TEXT     UNIQUE NOT NULL
);

CREATE TABLE user (
    id             INTEGER  PRIMARY KEY,
    user_type_id   INTEGER  NOT NULL,
    username       TEXT     UNIQUE NOT NULL,
    first_name     TEXT     NOT NULL,
    last_name      TEXT     NOT NULL,
    email          TEXT     UNIQUE NOT NULL,
    password_hash  TEXT     NOT NULL,
    password_salt  TEXT     NOT NULL,
    -- I'm assuming the purpose of this is to check we've verified someone's email
    activated      INTEGER  DEFAULT 0,
    FOREIGN KEY(user_type_id) REFERENCES user_type(id)
);

CREATE TABLE production (
    id            INTEGER  PRIMARY KEY,
    user_id       INTEGER  NOT NULL,
    name          TEXT     NOT NULL,
    venue         TEXT     NOT NULL,
    -- Some of these should probably be NOT NULL, but I don't know which
    producer      TEXT,
    director      TEXT,
    blurb         TEXT,
    warnings      TEXT,
    special_note  TEXT,
    FOREIGN KEY(user_id) REFERENCES user(id)
);

CREATE TABLE show (
    id             INTEGER  PRIMARY KEY,
    production_id  INTEGER  NOT NULL,
    date           TEXT     NOT NULL,
    doors_open     TEXT     NOT NULL,
    total_seats    INTEGER  NOT NULL,
    sold           INTEGER  DEFAULT 0,
    FOREIGN KEY(production_id) REFERENCES production(id)
);

CREATE TABLE ticket_type (
    id        INTEGER  PRIMARY KEY,
    -- we also had a foreign key to production here, but surely that is not needed if we have one to show?
    show_id   INTEGER  NOT NULL,
    category  TEXT     NOT NULL,
    price     INTEGER,
    FOREIGN KEY (show_id) REFERENCES show(id)
);

CREATE TABLE booking (
    id            INTEGER  PRIMARY KEY,
    show_id       INTEGER  NOT NULL,
    user_id       INTEGER  NOT NULL,
    -- Not too sure about the specifics of these
    order_total   INTEGER,
    booking_time  TEXT     NOT NULL,
    paid          INTEGER,
    booking_ref   TEXT     UNIQUE NOT NULL,
    collected     INTEGER  NOT NULL,
    FOREIGN KEY (show_id) REFERENCES show(id),
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE ticket (
    id              INTEGER  PRIMARY KEY,
    booking_id      INTEGER  NOT NULL,
    ticket_type_id  INTEGER  NOT NULL,
    seat_number     INTEGER,
    FOREIGN KEY (booking_id) REFERENCES booking(id),
    FOREIGN KEY (ticket_type_id) REFERENCES ticket_type(id)
);