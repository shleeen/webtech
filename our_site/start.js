"use strict"
// -- start the server
const app = require('./server');

const server = app.listen(8080, () => {
  console.log(`Express is running on port ${server.address().port}`);
});

// -------- DATABASE
