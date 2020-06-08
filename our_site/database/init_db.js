const dbHelper = require("./database");
const fs = require("fs");

let winston_map = [];
for (const c of "ABCDEFGHIJKL") {
  let num_seats;
  if (["A", "B"].some(v => c.includes(v))) num_seats = 17;
  if (["C", "D", "E"].some(v => c.includes(v))) num_seats = 18;
  if (["F", "G"].some(v => c.includes(v))) num_seats = 19;
  if (["H", "I"].some(v => c.includes(v))) num_seats = 20;
  if (["J"].some(v => c.includes(v))) num_seats = 15;
  if (["K"].some(v => c.includes(v))) num_seats = 16;
  if (["L"].some(v => c.includes(v))) num_seats = 12;
  for (let i = 1; i <= num_seats; i++) {
    winston_map.push(c + i.toString());
  }
}

async function createDB() {
  const createScript = fs.readFileSync("./database/create.sql").toString();
  const filteredScript = createScript.replace(/\r/gm, "").replace(/^\s*\n/gm, "").replace(/^\s*--.*\n/gm, "").replace(/^\..*\n/gm, "");
  const queries = filteredScript.toString().split(";");
  console.log(queries);
  for (let query of queries) {
    if (query) {
      query += ";";
      try {
        await dbHelper.run(query);
      } catch (err) {
        console.log("Error creating DB: " + err);
      }
    }
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

async function initializeDB() {
  if (process.argv[2] === "check") {
    if (fs.existsSync("./database/database.db")) {
      return;
    }
  }
  await createDB();
  // initializing the database tables with test data
  let errors = "";
  try {
    await dbHelper.addUserType("normal");
  } catch (err) { errors += "  " + err + "\n"; }
  try {
    await dbHelper.addUserType("admin");
  } catch (err) { errors += "  " + err + "\n"; }
  try {
    await dbHelper.addUser("firstuser", "normal", "John", "Smith", "jsmith@gmail.com", "JohnPass444");
  } catch (err) { errors += "  " + err + "\n"; }
  try {
    await dbHelper.addUser("seconduser", "admin", "Jane", "Doe", "jdoe@gmail.com", "JanePass444");
  } catch (err) { errors += "  " + err + "\n"; }
  try {
    await dbHelper.addProductions("firstuser", "Musical Theatre Bristol presents Showcase", "Winston Theatre", 
                  "img/showcase_banner.png", "img/showcase_poster.png", "Max Whale", "Nicole Li", 
                  "After another year of raging reviews and five-star success, MTB's 'Showcase' is back for the 4th time! Featuring an eclectic line-up of all your musical favourites, from the old classics (Sweeney Todd, Company) to contemporary sensations (Six, Heathers) you're in for a show-stopping night of musical theatre.", 
                  "Contains strong language and sex references. | Flashing lights are used during this performance. | Contains references to suicide.", "");
  } catch (err) { errors += "  " + err + "\n"; }
  try {
    await dbHelper.addShows("Musical Theatre Bristol presents Showcase", "2020-08-07", "19:30", "209", "0");
  } catch (err) { errors += "  " + err + "\n"; }
  try {
    await dbHelper.addShows("Musical Theatre Bristol presents Showcase", "2020-08-08", "19:30", "209", "0");
  } catch (err) { errors += "  " + err + "\n"; }
  try {
    await dbHelper.addShows("Musical Theatre Bristol presents Showcase", "2020-08-09", "19:30", "209", "0");
  } catch (err) { errors += "  " + err + "\n"; }
  try {
    await dbHelper.addTicketTypes("Musical Theatre Bristol presents Showcase", "Student", "700");
  } catch (err) { errors += "  " + err + "\n"; }
  try {
    await dbHelper.addTicketTypes("Musical Theatre Bristol presents Showcase", "General", "1000");
  } catch (err) { errors += "  " + err + "\n"; }
  try {
    await dbHelper.bookTickets(1, 1, 1, ["B7"], {1: 1, 2: 0});
  } catch (err) { errors += "  " + err + "\n"; }
  try {
    await dbHelper.addProductions("firstuser", "Legally Blonde", "Winston Theatre", 
                  "img/legally_banner.png", "img/legally_poster.png", "Max Whale", "Nicole Li", 
                  "Music Theatre Bristol is bending and snapping our way to the Winston Theatre this June with the first of our main shows: Legally Blonde! Based on the 2001 film, Legally Blonde tells the story of Elle Woods – a sorority girl who follows love all the way to Harvard Law only to achieve more than anyone thought she was capable of! With only five performances be sure to get your tickets fast to avoid disappointment!", 
                  "It is illegal to use recording equipment during this performance.", "");
  } catch (err) { errors += "  " + err + "\n"; }
  try {
    await dbHelper.addShows("Legally Blonde", 	"2020-08-19", "19:30", "209", "0");
  } catch (err) { errors += "  " + err + "\n"; }
  try {
    await dbHelper.addShows("Legally Blonde", "2020-08-20", "19:30", "209", "0");
  } catch (err) { errors += "  " + err + "\n"; }
  try {
    await dbHelper.addShows("Legally Blonde", "2020-08-21", "19:30", "209", "0");
  } catch (err) { errors += "  " + err + "\n"; }
  try {
    await dbHelper.addShows("Legally Blonde", "2020-08-21", "14:00", "209", "0");
  } catch (err) { errors += "  " + err + "\n"; }
  try {
    await dbHelper.addShows("Legally Blonde", "2020-08-22", "19:30", "209", "0");
  } catch (err) { errors += "  " + err + "\n"; }
  try {
    await dbHelper.addProductions("firstuser", "Silence of the Lambdas", "Winston Theatre", 
                  "img/banner_lambda.png", "img/poster_lambda.png", "Max Whale", "Nicole Li", 
                  "Have you ever wondered what the worlds of Dr. Hannibal Lecter and Lambda calculus have in common? Theres only one way to find out... But be warned, this show is not for the faint hearted.", 
                  "Contains functional programming.", "");
  } catch (err) { errors += "  " + err + "\n"; }
  try {
    await dbHelper.addShows("Silence of the Lambdas", "2020-08-08", "19:30", "209", "209"); // SOLD OUT
  } catch (err) { errors += "  " + err + "\n"; }
  try {
    await dbHelper.addShows("Silence of the Lambdas", "2020-08-09", "19:30", "209", "50"); // some sold
  } catch (err) { errors += "  " + err + "\n"; }
  try {
    await dbHelper.addShows("Silence of the Lambdas", "2020-08-10", "19:30", "209", "0"); // none sold
  } catch (err) { errors += "  " + err + "\n"; }
  try {
    await dbHelper.addTicketTypes("Silence of the Lambdas", "Student", "500");
  } catch (err) { errors += "  " + err + "\n"; }
  try {
    await dbHelper.addTicketTypes("Silence of the Lambdas", "General", "700");
  } catch (err) { errors += "  " + err + "\n"; }
  try {
    let seats = [];
    for (let i = 0; i < 209; i++) {
      seats.push(winston_map[i]);
    }
    await dbHelper.bookTickets(3, 9, 2, seats, {3: 209, 4: 0});
  } catch (err) { errors += "  " + err + "\n"; }
  try {
    let seats = [];
    for (let i = 0; i < 50; i++) {
      let s = getRandomInt(0, 209);
      if (!seats.includes(winston_map[s]))
        seats.push(winston_map[s]);
      else i--;
    }
    await dbHelper.bookTickets(3, 10, 2, seats, {3: 50, 4: 0});
  } catch (err) { errors += "  " + err + "\n"; }
  try {
    await dbHelper.addTicketTypes("Legally Blonde", "Student", "500");
  } catch (err) { errors += "  " + err + "\n"; }
  try {
    await dbHelper.addTicketTypes("Legally Blonde", "General", "700");
  } catch (err) { errors += "  " + err + "\n"; }
  try {
    await dbHelper.bookTickets(2, 4, 1, ["A5", "A6"], {5: 2, 6: 0});
  } catch (err) { errors += "  " + err + "\n"; }
  if (errors !== "") {
    console.error("Error(s) initalising database:\n" + errors);
  }
}

initializeDB();