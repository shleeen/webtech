// so is this the file that runs at startup and and creates all the dbs
"use strict";
const sqlite3 = require("sqlite3").verbose(); //verbose -> produces long stack traces

// let db = new sqlite3.Database("data.db"); 
// returns a database object and opens connection
// by default opens in read-write and create mode
let db = new sqlite3.Database('./database/human.db', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
});


// call the function create to create a database
// -> does this happen everytime? when should this js file be run?
db.serialize(create);

function create() {
    db.run("create table human (name, email)");
    db.run("insert into human values ('paul','paul@paulslife.com')");
    db.run("insert into human values ('esther,'irock@gmail.com')");
}


// this is for sqlite not 3
// ian really likes the async await thing so maybe we should use it?
// async function create() {
//     try {
//         var db = await sqlite.open("./db.sqlite");
//         await db.run("create table animals (id, breed)");
//         await db.run("insert into animals values (42,'dog')");
//         await db.run("insert into animals values (53,'fish')");
//         var as = await db.all("select * from animals");
//         console.log(as);
//     } catch (e) { console.log(e); }
// }

// close the db connection
db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
});