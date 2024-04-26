require("dotenv").config();

const express = require("express");
const PORT = process.env.PORT || 4040;

const app = express();
app.use(express.json());

// Import the leads handler function
const handleLeads = require("./leads");

// Define the endpoint for handling leads
app.get("/leads", handleLeads);

// Default route handling
app.post("*", async (req, res) => {
    console.log(req.body);
    res.send("Hello Post!");
});

app.get("*", async (req, res) => {
    res.send("Hello Get!");
});

app.listen(PORT, function (err) {
    if (err) console.log(err);
    console.log("Server listening on http://localhost:" + PORT);
});
