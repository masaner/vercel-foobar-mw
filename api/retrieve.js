const fs = require("fs");
const path = require("path");

module.exports = async (req, res) => {
    const { selectedIds } = req.body;

    // Read the leads data from the leads.json file
    const filePath = path.join(__dirname, "..", "data", "leads.json");

    try {
        const fileData = await fs.promises.readFile(filePath);
        const jsonData = JSON.parse(fileData);

        // If selectedIds exist, filter the leads based on the selected IDs
        let selectedLeads = [];
        if (selectedIds) {
            console.log(selectedIds);
            const idArray = selectedIds
                .split(",")
                .map((id) => parseInt(id.trim()));
            selectedLeads = jsonData.filter((lead) =>
                idArray.includes(lead.id)
            );
            console.log(idArray);
            console.log(selectedLeads);

        } else {
            // If no selectedIds, return an empty array
            selectedLeads = [];
        }

        // Return the selected lead IDs as the response for the POST request
        return res.json(selectedLeads);
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
