require("dotenv").config();
require("axios");
const fs = require("fs");
const path = require("path");
const jsforce = require("jsforce");
const sfbulk = require("node-sf-bulk2");

module.exports = async (req, res) => {
    const { selectedIds } = req.body;
    let httpResponse;
    const filePath = path.join(__dirname, "..", "data", "leads.json");
    let selectedLeads = [];
    try {
        const fileData = await fs.promises.readFile(filePath);
        const jsonData = JSON.parse(fileData);

        // If selectedIds exist, filter the leads based on the selected IDs
        if (selectedIds) {
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

    let conn;
    try {
        conn = await getAccessToken()
            .then((conn) => {
                const leadRecords = selectedLeads.map((lead) => ({
                    LastName: lead.lastname,
                    LeadSource: "Foobar",
                    Company: lead.company,
                    Email: lead.email,
                }));

                if (leadRecords.length <= 5) {
                    conn.sobject("Lead").create(
                        leadRecords,
                        function (err, rets) {
                            if (err) {
                                return console.error(err);
                            }
                            for (var i = 0; i < rets.length; i++) {
                                if (rets[i].success) {
                                    console.log(
                                        "Created record id : " + rets[i].id
                                    );
                                }
                            }
                        }
                    );
                } else {
                    // Use another logic for more than 5 records
                    // Add your logic here
                    (async () => {
                        const bulkconnect = {
                            accessToken: conn.accessToken,
                            apiVersion: "59.0",
                            instanceUrl: conn.instanceUrl,
                        };
                        try {
                            // create a new BulkAPI2 class
                            const bulkrequest = new sfbulk.BulkAPI2(
                                bulkconnect
                            );
                            // create a bulk insert job
                            const jobRequest = {
                                object: "Lead",
                                operation: "insert",
                            };
                            const response =
                                await bulkrequest.createDataUploadJob(
                                    jobRequest
                                );
                            console.log(response);
                            if (response.id) {
                                // read csv data from the local file system
                                const csvData = convertToCSV(leadRecords);

                                const status = await bulkrequest.uploadJobData(
                                    response.contentUrl,
                                    csvData
                                );
                                console.log(status);
                                if (status === 201) {
                                    // close the job for processing
                                    const closeRes = await bulkrequest.closeOrAbortJob(
                                        response.id,
                                        "UploadComplete"
                                    );

                                    console.log(closeRes);
                                }
                            }
                        } catch (ex) {
                            console.log("Error:", ex);
                            console.log("Response data:", ex.response.data);
                        }
                    })();
                }
            })
            .catch((err) => {
                console.error("Error during authentication:", err);
            });
    } catch (error) {
        console.error("Error getting access token:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
    return httpResponse;
};

function convertToCSV(dataArray) {
    const headers = Object.keys(dataArray[0]).join(",");
    const rows = dataArray.map((obj) => Object.values(obj).join(","));
    return headers + "\n" + rows.join("\n");
}

async function getAccessToken() {
    const conn = new jsforce.Connection({
        oauth2: {
            loginUrl: process.env.SF_LOGIN_URL,
            clientId: process.env.SF_CLIENT_ID,
            clientSecret: process.env.SF_CLIENT_SECRET,
            redirectUri: process.env.SF_REDIRECT_URI,
        },
    });

    return new Promise((resolve, reject) => {
        conn.login(
            process.env.SF_USERNAME,
            process.env.SF_PASSWORD,
            function (err, userInfo) {
                if (err) {
                    return reject(err);
                }
                resolve(conn);
            }
        );
    });
}
