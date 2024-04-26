require("dotenv").config();

const fs = require("fs");
const path = require("path");
const jsforce = require('jsforce');
const sfbulk = require('node-sf-bulk2');

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
        } else {
            // If no selectedIds, return an empty array
            selectedLeads = [];
        }

        // if (process.env.username && process.env.password) {
        //     const conn = new jsforce.Connection({});
        //     await conn.login(process.env.username, process.env.password);
        //     const bulkconnect = {
        //         'accessToken': conn.accessToken,
        //         'apiVersion': '51.0',
        //         'instanceUrl': conn.instanceUrl
        //     };
        //     try {
        //         const bulkapi2 = new sfbulk.BulkAPI2(bulkconnect);
        //         const queryInput = {
        //             'query': 'Select Id from Account',
        //             'operation': 'query'
        //         };
        //         const response = await bulkapi2.submitBulkQueryJob(queryInput);
        //         console.log(response);
        //     } catch (ex) {
        //         console.log(ex);
        //     }
        // } else {
        //     throw 'set environment variable with your orgs username and password'
        // }
        // submitBulkQueryJob();

        getAccessToken();

        // Return the selected lead IDs as the response for the POST request
        return res.json(selectedLeads);
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }

    function getAccessToken() {
        console.log('Authenticating...');
        var conn = new jsforce.Connection({
        oauth2 : {
            // you can change loginUrl to connect to sandbox or prerelease env.
            loginUrl : process.env.loginUrl,
            clientId : process.env.clientId,
            clientSecret : process.env.clientSecret,
            redirectUri : process.env.redirectUri
        }
        });

        conn.login(process.env.username, process.env.password, function(err, userInfo) {
        if (err) { return console.error(err); }
        // Now you can get the access token and instance URL information.
        // Save them to establish connection next time.
        console.log(conn.accessToken);
        console.log(conn.instanceUrl);
        // logged in user property
        console.log("User ID: " + userInfo.id);
        console.log("Org ID: " + userInfo.organizationId);
        // ...
        });
    }
};
