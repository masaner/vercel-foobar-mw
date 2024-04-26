// const axios = require('axios');
// const express = require('express');
// const router = express.Router();

// router.get('/', async (req, res) => {
//   const { ids } = req.query;

//   if (!ids) {
//     return res.status(400).json({ error: 'IDs parameter is required' });
//   }

//   try {
//     // Assume the exported IDs are comma-separated values
//     const idArray = ids.split(',').map(id => parseInt(id.trim()));

//     // Make API call to retrieve leads with the given IDs
//     const leads = await retrieveLeads(idArray);

//     return res.json(leads);
//   } catch (error) {
//     console.error('Error retrieving leads:', error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// });

// async function retrieveLeads(ids) {
//   try {
//     // Implement logic to retrieve leads based on the given IDs
//     // Example: Fetch leads from a database or external API
//     // const response = await axios.get('http://example.com/leads', { params: { ids } });
//     // const leads = response.data;
    
//     // For demonstration, returning static leads
//     const leads = [
//       { id: 1, name: 'John Doe', email: 'john@example.com', company: 'ABC Inc.' },
//       { id: 2, name: 'Jane Smith', email: 'jane@example.com', company: 'XYZ Corp' }
//       // Add more leads as needed
//     ];

//     return leads;
//   } catch (error) {
//     console.error('Error retrieving leads:', error);
//     throw error;
//   }
// }

// module.exports = router;


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
