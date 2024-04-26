require("dotenv").config();
const express = require("express");
const app = express();

app.use(express.json());

const handleLeads = require("./leads");
const handleRetrieve = require("./retrieve");
const salesforce = require("./salesforce");
const PORT = process.env.PORT || 4040;

app.get("/salesforce", async (req, res) => {
  try {
      const accessToken = await salesforce.getAccessToken();
      res.json({ accessToken });
  } catch (err) {
      res.status(500).json({ error: "Failed to get Salesforce access token" + err });
  }
});

app.get("/leads", handleLeads);
app.post("/leads", handleRetrieve);

app.get("/", async (req, res) => {
  res.send("Hello Canonical!");
});

app.listen(PORT, function (err) {
  if (err) console.log(err);
  console.log("Server listening on http://localhost:" + PORT);
});
