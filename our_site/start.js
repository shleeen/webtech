const app = require("./server");
const fs = require("fs");
const http = require("http");
const https = require("https");

// Load certificate for https
const key = fs.readFileSync("certs/selfsigned.key");
const cert = fs.readFileSync("certs/selfsigned.crt");

// Start server on http and https
const httpServer = http.createServer(app).listen(8080, async () => {
  console.log(`Express is running with HTTP on port ${httpServer.address().port}`);
});
const httpsServer = https.createServer({ key: key, cert: cert }, app).listen(8443, async () => {
  console.log(`Express is running with HTTPS on port ${httpsServer.address().port}`);
});