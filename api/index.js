require("dotenv").config();
console.log(process.env);

const express = require ("express");
const PORT = process.env.PORT || 4040;

const app = express();
app.use(express.json());

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