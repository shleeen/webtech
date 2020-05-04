"use strict"
// -- start the server
const app = require('./server');
const dbHelper = require('./database/database');

const server = app.listen(8080, async () => {
  try {
    const db = await dbHelper.openDB();
    // This command just lists all the tables in the database
    const result = await db.all("SELECT name FROM sqlite_master WHERE type ='table' AND name NOT LIKE 'sqlite_%';");
    console.log(result);
    await db.close();
    // initializing the database tables with test data
    await dbHelper.addUserType("normal");
    await dbHelper.addUserType("admin");
    await dbHelper.addUser("firstuser", "John", "Smith", "jsmith@gmail.com", "johnpass");
    await dbHelper.addProductions("firstuser", "Test Production", "Bristol Community Theatre", "Max Whale", "Nicole Li", "This will be the best show you will ever see.", "", "");
    await dbHelper.addShows("Test Production", 	"2020-06-20", "19:30", "550", "0");
    await dbHelper.addShows("Test Production", "2020-06-21", "19:30", "550", "0");
    await dbHelper.addShows("Test Production", "2020-06-22", "19:30", "550", "0");

  } catch (err) {
    console.log(err);
  }
  console.log(`Express is running on port ${server.address().port}`);
});