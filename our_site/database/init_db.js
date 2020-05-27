const dbHelper = require("./database");

async function initializeDB() {
  // initializing the database tables with test data
  let errors = "";
  try {
    await dbHelper.addUserType("normal");
  } catch (err) { errors += "  " + err + "\n"; }
  try {
    await dbHelper.addUserType("admin");
  } catch (err) { errors += "  " + err + "\n"; }
  try {
    await dbHelper.addUser("firstuser", "normal", "John", "Smith", "jsmith@gmail.com", "johnpass");
  } catch (err) { errors += "  " + err + "\n"; }
  try {
    await dbHelper.addUser("seconduser", "admin", "Jane", "Doe", "jdoe@gmail.com", "janepass");
  } catch (err) { errors += "  " + err + "\n"; }
  try {
    await dbHelper.addProductions("firstuser", "Musical Theatre Bristol presents Showcase", "Winston Theatre", 
                  "img/showcase_banner.png", "img/showcase_poster.png", "Max Whale", "Nicole Li", 
                  "After another year of raging reviews and five-star success, MTB's 'Showcase' is back for the 4th time! Featuring an eclectic line-up of all your musical favourites, from the old classics (Sweeney Todd, Company) to contemporary sensations (Six, Heathers) you're in for a show-stopping night of musical theatre.", 
                  "Contains strong language and sex references. | Flashing lights are used during this performance. | Contains references to suicide.", "");
  } catch (err) { errors += "  " + err + "\n"; }
  try {
    await dbHelper.addShows("Musical Theatre Bristol presents Showcase", "Winston Theatre", 	"2020-06-07", "19:30", "201", "0");
  } catch (err) { errors += "  " + err + "\n"; }
  try {
    await dbHelper.addShows("Musical Theatre Bristol presents Showcase", "Winston Theatre", "2020-06-08", "19:30", "201", "0");
  } catch (err) { errors += "  " + err + "\n"; }
  try {
    await dbHelper.addShows("Musical Theatre Bristol presents Showcase", "Winston Theatre", "2020-06-09", "19:30", "201", "0");
  } catch (err) { errors += "  " + err + "\n"; }
  try {
    await dbHelper.addProductions("firstuser", "Legally Blonde", "Winston Theatre", 
                  "img/legally_banner.png", "img/legally_poster.png", "Max Whale", "Nicole Li", 
                  "Music Theatre Bristol is bending and snapping our way to the Winston Theatre this June with the first of our main shows: Legally Blonde! Based on the 2001 film, Legally Blonde tells the story of Elle Woods – a sorority girl who follows love all the way to Harvard Law only to achieve more than anyone thought she was capable of! With only five performances be sure to get your tickets fast to avoid disappointment!", 
                  "It is illegal to use recording equipment during this performance.", "");
  } catch (err) { errors += "  " + err + "\n"; }
  try {
    await dbHelper.addShows("Legally Blonde", "Winston Theatre", 	"2020-06-19", "19:30", "201", "0");
  } catch (err) { errors += "  " + err + "\n"; }
  try {
    await dbHelper.addShows("Legally Blonde", "Winston Theatre", "2020-06-20", "19:30", "201", "0");
  } catch (err) { errors += "  " + err + "\n"; }
  try {
    await dbHelper.addShows("Legally Blonde", "Winston Theatre", "2020-06-21", "19:30", "201", "0");
  } catch (err) { errors += "  " + err + "\n"; }
  try {
    await dbHelper.addShows("Legally Blonde", "Winston Theatre", "2020-06-21", "14:00", "201", "0");
  } catch (err) { errors += "  " + err + "\n"; }
  try {
    await dbHelper.addShows("Legally Blonde", "Winston Theatre", "2020-06-22", "19:30", "201", "0");
  } catch (err) { errors += "  " + err + "\n"; }
  if (errors !== "") {
    console.error("Error(s) initalising database:\n" + errors);
  }
}

initializeDB();