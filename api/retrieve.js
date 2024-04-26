// require("dotenv").config();

// const fs = require("fs");
// const path = require("path");
// const jsforce = require('jsforce');
// const sfbulk = require('node-sf-bulk2');

// module.exports = async (req, res) => {
//     const { selectedIds } = req.body;

//     // Read the leads data from the leads.json file
//     const filePath = path.join(__dirname, "..", "data", "leads.json");

//     try {
//         const fileData = await fs.promises.readFile(filePath);
//         const jsonData = JSON.parse(fileData);

//         // If selectedIds exist, filter the leads based on the selected IDs
//         let selectedLeads = [];
//         if (selectedIds) {
//             console.log(selectedIds);
//             const idArray = selectedIds
//                 .split(",")
//                 .map((id) => parseInt(id.trim()));
//             selectedLeads = jsonData.filter((lead) =>
//                 idArray.includes(lead.id)
//             );
//         } else {
//             // If no selectedIds, return an empty array
//             selectedLeads = [];
//         }

//         // if (process.env.username && process.env.password) {
//         //     const conn = new jsforce.Connection({});
//         //     await conn.login(process.env.username, process.env.password);
//         //     const bulkconnect = {
//         //         'accessToken': conn.accessToken,
//         //         'apiVersion': '51.0',
//         //         'instanceUrl': conn.instanceUrl
//         //     };
//         //     try {
//         //         const bulkapi2 = new sfbulk.BulkAPI2(bulkconnect);
//         //         const queryInput = {
//         //             'query': 'Select Id from Account',
//         //             'operation': 'query'
//         //         };
//         //         const response = await bulkapi2.submitBulkQueryJob(queryInput);
//         //         console.log(response);
//         //     } catch (ex) {
//         //         console.log(ex);
//         //     }
//         // } else {
//         //     throw 'set environment variable with your orgs username and password'
//         // }
//         // submitBulkQueryJob();

//         getAccessToken();

//         // Return the selected lead IDs as the response for the POST request
//         return res.json(selectedLeads);
//     } catch (error) {
//         console.error("Error:", error);
//         return res.status(500).json({ error: "Internal server error" });
//     }

//     function getAccessToken() {
//         console.log('Authenticating...');
//         var conn = new jsforce.Connection({
//         oauth2 : {
//             // you can change loginUrl to connect to sandbox or prerelease env.
//             loginUrl : process.env.loginUrl,
//             clientId : process.env.clientId,
//             clientSecret : process.env.clientSecret,
//             redirectUri : process.env.redirectUri
//         }
//         });

//         conn.login(process.env.username, process.env.password, function(err, userInfo) {
//         if (err) { return console.error(err); }
//         // Now you can get the access token and instance URL information.
//         // Save them to establish connection next time.
//         console.log(conn.accessToken);
//         console.log(conn.instanceUrl);
//         // logged in user property
//         console.log("User ID: " + userInfo.id);
//         console.log("Org ID: " + userInfo.organizationId);
//         // ...
//         });
//     }
// };




require("dotenv").config();

const fs = require("fs");
const path = require("path");
const jsforce = require('jsforce');
// const sfbulk = require('node-sf-bulk2');
const request = require('request');


module.exports = async (req, res) => {
    const { selectedIds } = req.body;
    let httpResponse;
    // ... (rest of the code for reading leads data remains the same)
    const filePath = path.join(__dirname, "..", "data", "leads.json");

    try {
        const fileData = await fs.promises.readFile(filePath);
        const jsonData = JSON.parse(fileData);

        // If selectedIds exist, filter the leads based on the selected IDs
        let selectedLeads = [];
        if (selectedIds) {
            // console.log(selectedIds);
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
        httpResponse = res.json(selectedLeads);
    } catch (error) {
        console.error("Error:", error);
        httpResponse = res.status(500).json({ error: "Internal server error" });
    }

    // getToken();

    // // Get Salesforce access token
    let conn;
    try {
        console.log('Getting Access Token!');
        conn = await getAccessToken()
            .then(conn => {
                console.log('Yes Baby!');
                // Use the connection (conn) object here for further operations
                console.log('Access Token:', conn.accessToken);
                console.log('Instance URL:', conn.instanceUrl);
                // console.log('Performing Bulk Query...');
                // performBulkQuery(conn);
                const endpoint = `${conn.instanceUrl}/services/data/v59.0/query/?q=SELECT Name,(SELECT Name FROM Contacts) FROM Account`;

                const options = {
                  url: endpoint,
                  headers: {
                    'Authorization': `Bearer ${conn.accessToken}`
                  }
                };
                
                request.get(options, function (error, response, body) {
                  if (error) {
                    console.error('Error:', error);
                    return;
                  }
                  console.log('Response:', body);
                });
            })
            .catch(err => {
                console.error('Error during authentication:', err);
            });
    } catch (error) {
        console.error("Error getting access token:", error);
        return res.status(500).json({ error: "Internal server error" });
    }

    // // Use the access token to connect to Salesforce
    // const bulkconnect = {
    //     'accessToken': conn.accessToken,
    //     'apiVersion': '51.0',
    //     'instanceUrl': conn.instanceUrl
    // };

    // try {
    //     const bulkapi2 = new sfbulk.BulkAPI2(bulkconnect);
    //     const queryInput = {
    //         'query': 'Select Id from Account',
    //         'operation': 'query'
    //     };
    //     const response = await bulkapi2.submitBulkQueryJob(queryInput);
    //     console.log(response);
    // } catch (ex) {
    //     console.error(ex);
    // }

    return httpResponse;

    // ... (rest of the code for returning selected leads remains the same)
};

// async function performBulkQuery(conn) {
//     try {
//         const bulkconnect = {
//             accessToken: conn.accessToken,
//             apiVersion: '42.0',
//             instanceUrl: conn.instanceUrl
//         };

//         const bulkapi2 = new sfbulk.BulkAPI2(bulkconnect);
//         const queryInput = {
//             query: 'Select Id from Account',
//             operation: 'query'
//         };

//         const response = await bulkapi2.submitBulkQueryJob(queryInput);
//         console.log(response);
//     } catch (ex) {
//         console.error('Error performing Bulk API query:', ex);
//     }
// }

// async function getAccessToken() {
//     console.log('Authenticating...');
//     const conn = new jsforce.Connection({
//         oauth2 : {
//             // you can change loginUrl to connect to sandbox or prerelease env.
//             loginUrl : process.env.loginUrl,
//             clientId : process.env.clientId,
//             clientSecret : process.env.clientSecret,
//             redirectUri : process.env.redirectUri // This might need adjustment
//         }
//     });

//     return new Promise((resolve, reject) => {
//         conn.login(process.env.username, process.env.password, function(err, userInfo) {
//             if (err) { return reject(err); }
//             console.log(conn.accessToken);
//             console.log(conn.instanceUrl);
//             resolve(conn);
//         });
//     });
// }


async function getAccessToken() {
    console.log('Authenticating Now...!!!');
    const conn = new jsforce.Connection({
        oauth2: {
            // you can change loginUrl to connect to sandbox or prerelease env.
            loginUrl: process.env.loginUrl,
            clientId: process.env.clientId,
            clientSecret: process.env.clientSecret,
            redirectUri: process.env.redirectUri // This might need adjustment
        }
    });

    return new Promise((resolve, reject) => {
        conn.login(process.env.username, process.env.password, function(err, userInfo) {
            console.log(userInfo);
            console.log('Hello World!');
            if (err) { return reject(err); }
            console.log(conn.accessToken);
            console.log(conn.instanceUrl);
            resolve(conn);
        });
    });
}

// async function getToken() {
//     const loginUrl = process.env.loginUrl;
//     const clientId = process.env.clientId;
//     const clientSecret = process.env.clientSecret;
//     const username = process.env.username;
//     const password = process.env.password;
//     const grantType = 'password';

//     try {
//         const response = await axios.post(loginUrl, null, {
//             params: {
//                 grant_type: grantType,
//                 client_id: clientId,
//                 client_secret: clientSecret,
//                 username: username,
//                 password: password
//             }
//         });
//         console.log(response);
//         console.log(response.data);
//         console.log('Access Token:', response.data.access_token);
//         console.log('Instance URL:', response.data.instance_url);
//     } catch (error) {
//         console.error('Error getting access token:', error.response.data);
//     }
// }
