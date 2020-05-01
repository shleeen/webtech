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
    await dbHelper.addUser("john", "John", "Smith", "jsmith@gmail.com", "johnpass");
  } catch (err) {
    console.log(err);
  }
  console.log(`Express is running on port ${server.address().port}`);
});