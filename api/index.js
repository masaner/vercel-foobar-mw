require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 4040;

app.use(express.json());

// Your /leads route handler function
const handleLeads = require("./leads");
const handleRetrieve = require("./retrieve");

// Configure the /leads endpoint to handle both GET and POST requests
app.get("/leads", handleLeads);
app.post("/leads", handleRetrieve);

app.get("/", async (req, res) => {
  res.send("Hello Canonical!");
});
// Start the server
app.listen(PORT, function (err) {
  if (err) console.log(err);
  console.log("Server listening on http://localhost:" + PORT);
});
