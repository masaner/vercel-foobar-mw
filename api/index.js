require("dotenv").config();
const express = require("express");
const app = express();

app.use(express.json());

const handleGetLeads = require("./leads");
const injectSalesforceWithLeads = require("./leadsInjector");

const PORT = process.env.PORT || 4040;

app.get("/leads", handleGetLeads);
app.post("/leads", injectSalesforceWithLeads);

app.get("/", async (req, res) => {
    res.send("Hello Canonical!");
});

app.listen(PORT, function (err) {
    if (err) console.log(err);
    console.log("Server listening on http://localhost:" + PORT);
});
