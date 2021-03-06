-- Drop/Create script to initialise the database tables.
PRAGMA foreign_keys = OFF;

DROP TABLE IF EXISTS user_type;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS production;
DROP TABLE IF EXISTS show;
DROP TABLE IF EXISTS ticket_type;
DROP TABLE IF EXISTS booking;
DROP TABLE IF EXISTS ticket;
DROP TABLE IF EXISTS password_reset;
DROP TABLE IF EXISTS email_verify;

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
    -- To check if the email has been verified
    activated      INTEGER  DEFAULT 0,
    FOREIGN KEY(user_type_id) REFERENCES user_type(id)
);

CREATE TABLE production (
    id            INTEGER  PRIMARY KEY,
    user_id       INTEGER  NOT NULL,
    name          TEXT     NOT NULL,
    venue         TEXT     NOT NULL,
    -- Some of these should probably be NOT NULL
    banner_path   TEXT,
    poster_path   TEXT,
    producer      TEXT,
    director      TEXT,
    blurb         TEXT,
    warnings      TEXT,
    special_note  TEXT,
    FOREIGN KEY(user_id) REFERENCES user(id),
    UNIQUE(user_id, name)
);

CREATE TABLE show (
    id             INTEGER  PRIMARY KEY,
    production_id  INTEGER  NOT NULL,
    date           TEXT     NOT NULL,
    doors_open     TEXT     NOT NULL,
    total_seats    INTEGER  NOT NULL,
    sold           INTEGER  DEFAULT 0,
    FOREIGN KEY(production_id) REFERENCES production(id),
    UNIQUE(production_id, date, doors_open)
);

CREATE TABLE ticket_type (
    id        INTEGER  PRIMARY KEY,
    production_id   INTEGER  NOT NULL,
    category  TEXT     NOT NULL,
    price     INTEGER,
    FOREIGN KEY (production_id) REFERENCES production(id)
);

CREATE TABLE booking (
    id            INTEGER  PRIMARY KEY,
    show_id       INTEGER  NOT NULL,
    user_id       INTEGER  NOT NULL,
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
    -- Have changed this to be TEXT since seat numbers will be like "A4, J5"
    seat_number     TEXT,
    FOREIGN KEY (booking_id) REFERENCES booking(id),
    FOREIGN KEY (ticket_type_id) REFERENCES ticket_type(id)
);

CREATE TABLE password_reset (
    id       INTEGER  PRIMARY KEY,
    user_id  INTEGER  NOT NULL,
    token    TEXT     NOT NULL,
    time     INTEGER  NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE email_verify (
    id       INTEGER  PRIMARY KEY,
    user_id  INTEGER  NOT NULL,
    token    TEXT     NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
);