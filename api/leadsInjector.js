require("dotenv").config();

const fs = require("fs").promises;
const path = require("path");
const jsforce = require("jsforce");
const sfbulk = require("node-sf-bulk2");

module.exports = async (req, res) => {
    const { selectedIds, salesRepName, inputJobId } = req.body;
    let httpResponse;
    const filePath = path.join(__dirname, "..", "data", "leads.json");
    let selectedLeads = [];
    try {
        const fileData = await fs.readFile(filePath);
        const jsonData = JSON.parse(fileData);

        if (selectedIds) {
            const idArray = selectedIds
                .split(",")
                .map((id) => parseInt(id.trim()));
            selectedLeads = jsonData.filter((lead) =>
                idArray.includes(lead.id)
            );
        }
        const conn = await getAccessToken();

        let refJobId;
        if (inputJobId === null) {
            refJobId = generateRandomString(18);
        } else {
            refJobId = inputJobId;
        }

        let leadRecords = selectedLeads.map((lead) => ({
            LastName: lead.lastname,
            LeadSource: "Foobar",
            Company: lead.company,
            Email: lead.email,
            Sales_Rep_Name__c: salesRepName,
            Linked_Job_Id__c: refJobId,
        }));

        let jobId;
        if (leadRecords.length <= MAX_RECORDS_FOR_CREATE) {
            leadRecords = leadRecords.map((record) => ({
                ...record,
                batch_Import__c: false,
            }));
            let insertedRecordIds = [];
            try {
                const result = await new Promise((resolve, reject) => {
                    conn.sobject("Lead").create(
                        leadRecords,
                        function (err, rets) {
                            console.log(err);
                            console.log(rets);
                            if (err) {
                                reject(err);
                                return console.error(err);
                            }

                            for (var i = 0; i < rets.length; i++) {
                                if (rets[i].success) {
                                    console.log(
                                        "Created record id : " + rets[i].id
                                    );
                                    insertedRecordIds.push(rets[i].id);
                                    selectedLeads[i].sf_id = rets[i].id;
                                    selectedLeads[i].created = true;
                                    selectedLeads[i].referenceId = refJobId;
                                } else {
                                    console.error(
                                        "Failed to create record:",
                                        rets[i]
                                    );
                                    selectedLeads[i].sf_id = null;
                                    selectedLeads[i].created = false;
                                    selectedLeads[i].error =
                                        rets[i].errors[0].statusCode;
                                    selectedLeads[i].error_message =
                                        rets[i].errors[0].message;
                                }
                            }
                            resolve(insertedRecordIds);
                        }
                    );
                });

                httpResponse = res.json(selectedLeads);
            } catch (error) {
                console.error("Error:", error);
            }
        } else {
            leadRecords = leadRecords.map((record) => ({
                ...record,
                batch_Import__c: true,
            }));
            const bulkconnect = {
                accessToken: conn.accessToken,
                apiVersion: "59.0",
                instanceUrl: conn.instanceUrl,
            };
            const bulkrequest = new sfbulk.BulkAPI2(bulkconnect);
            const jobRequest = {
                object: "Lead",
                operation: "insert",
            };
            const response = await bulkrequest.createDataUploadJob(jobRequest);
            if (response.id) {
                jobId = response.id;
                const csvData = convertToCSV(leadRecords);

                const status = await bulkrequest.uploadJobData(
                    response.contentUrl,
                    csvData
                );
                if (status === 201) {
                    console.log("UploadComplete!");
                    await bulkrequest.closeOrAbortJob(jobId, "UploadComplete");
                }
                const responseJson = {
                    jobId: jobId,
                    referenceId: refJobId,
                    selectedLeads: selectedLeads,
                };
                httpResponse = res.json(responseJson);
            }
        }
    } catch (error) {
        console.error("Error:", error);
        httpResponse = res.status(500).json({ error: "Internal server error" });
    }

    return httpResponse;
};

const MAX_RECORDS_FOR_CREATE = 2;

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

function generateRandomString(length) {
    const timestamp = Date.now().toString(36);
    const randomPart = [...Array(length - timestamp.length)]
        .map(() => Math.random().toString(36)[2])
        .join("");
    return timestamp + randomPart;
}
