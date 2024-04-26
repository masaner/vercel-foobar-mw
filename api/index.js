// require("dotenv").config();

// const express = require("express");
// const PORT = process.env.PORT || 4040;

// const app = express();
// app.use(express.json());

// // Import the leads handler function
// const handleLeads = require("./leads");

// // Define the endpoint for handling leads
// app.get("/leads", handleLeads);

// // // Default route handling
// // app.post("*", async (req, res) => {
// //     console.log(req.body);
// //     res.send("Hello Post!");
// // });

// // app.get("*", async (req, res) => {
// //     res.send("Hello Get!");
// // });

// app.listen(PORT, function (err) {
//     if (err) console.log(err);
//     console.log("Server listening on http://localhost:" + PORT);
// });

// require("dotenv").config();

// const express = require("express");
// const PORT = process.env.PORT || 4040;

// const app = express();
// app.use(express.json());

// // Import the leads handler function
// const handleLeads = require("./leads");

// // Import the retrieveLeadsRouter middleware
// const retrieveLeadsRouter = require("./retrieve");

// // Define the endpoint for handling leads
// app.get("/leads", handleLeads);

// // Define the endpoint for retrieving leads using the new router
// app.use("/retrieve", retrieveLeadsRouter);

// // Default route handling
// app.post("*", async (req, res) => {
//   console.log(req.body);
//   res.send("Hello Post!");
// });

// app.get("*", async (req, res) => {
//   res.send("Hello Get!");
// });

// app.listen(PORT, function (err) {
//   if (err) console.log(err);
//   console.log("Server listening on http://localhost:" + PORT);
// });
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

// Start the server
app.listen(PORT, function (err) {
  if (err) console.log(err);
  console.log("Server listening on http://localhost:" + PORT);
});
