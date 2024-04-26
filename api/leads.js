const fs = require("fs");
const path = require("path");

module.exports = async (req, res) => {
    const filePath = path.join(__dirname, "..", "data", "leads.json");
    try {
        const fileData = await fs.promises.readFile(filePath);
        const jsonData = JSON.parse(fileData);
        return res.json(jsonData);
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
