const dbHelper = require('./database');

async function initializeDB() {
    // initializing the database tables with test data
    let errors = "";
    try {
        await dbHelper.addUserType("normal");
    } catch (err) { errors += "  " + err + '\n'; }
    try {
        await dbHelper.addUserType("admin");
    } catch (err) { errors += "  " + err + '\n'; }
    try {
        await dbHelper.addUser("firstuser", "John", "Smith", "jsmith@gmail.com", "johnpass");
    } catch (err) { errors += "  " + err + '\n'; }
    try {
        await dbHelper.addProductions("firstuser", "Test Production", "Bristol Community Theatre", "Max Whale", "Nicole Li", "This will be the best show you will ever see.", "", "");
    } catch (err) { errors += "  " + err + '\n'; }
    try {
        await dbHelper.addShows("Test Production", 	"2020-06-20", "19:30", "550", "0");
    } catch (err) { errors += "  " + err + '\n'; }
    try {
        await dbHelper.addShows("Test Production", "2020-06-21", "19:30", "550", "0");
    } catch (err) { errors += "  " + err + '\n'; }
    try {
        await dbHelper.addShows("Test Production", "2020-06-22", "19:30", "550", "0");
    } catch (err) { errors += "  " + err + '\n'; }
    if (errors != "") {
        console.error("Error(s) initalising database:\n" + errors);
    }
}

initializeDB();