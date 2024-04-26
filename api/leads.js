// // const fs = require('fs');
// // const path = require('path');

// // module.exports = (req, res) => {
// //   const { data } = req.query;

// //   if (!data) {
// //     return res.status(400).json({ error: 'Data parameter is required' });
// //   }

// //   // Construct the file path based on the data parameterr
// //   const filePath = path.join(__dirname, '..', 'data', `${data}.json`);

// //   // Check if the file exists
// //   fs.access(filePath, fs.constants.F_OK, (err) => {
// //     if (err) {
// //       return res.status(404).json({ error: `File for leads '${data}' not found` });
// //     }

// //     // Read the JSON data from the file
// //     fs.readFile(filePath, (err, data) => {
// //       if (err) {
// //         return res.status(500).json({ error: 'Internal server error' });
// //       }

// //       try {
// //         const leads = JSON.parse(data);
// //         return res.json(leads);
// //       } catch (error) {
// //         return res.status(500).json({ error: 'Failed to parse JSON data' });
// //       }
// //     });
// //   });
// // };

// const fs = require('fs');
// const path = require('path');

// module.exports = async (req, res) => {
//   const { data, retrieve } = req.query;

//   if (!data) {
//     return res.status(400).json({ error: 'Data parameter is required' });
//   }

//   // Construct the file path based on the data parameter within the .data directory
//   const filePath = path.join(__dirname, '..', 'data', `${data}.json`);

//   fs.access(filePath, fs.constants.F_OK, (err) => {
//     if (err) {
//       return res.status(404).json({ error: `File for data '${data}' not found` });
//     }

//     fs.readFile(filePath, (err, fileData) => {
//       if (err) {
//         return res.status(500).json({ error: 'Internal server error' });
//       }

//       try {
//         const jsonData = JSON.parse(fileData);
//         if (retrieve === 'true') {
//           // If retrieve is true, send the leads to Salesforce
//           sendLeadsToSalesforce(jsonData);
//           return res.json({ message: 'Sending to SF' });
//         } else {
//           // If retrieve is false or undefined, return the JSON body
//           return res.json(jsonData);
//         }
//       } catch (error) {
//         return res.status(500).json({ error: 'Failed to parse JSON data' });
//       }
//     });
//   });
// };

// function sendLeadsToSalesforce(leadData) {
//     console.log('Sending.....');
//   // Implement logic to authenticate with Salesforce using OAuth
//   // and send the leads to Salesforce using the Salesforce API
//   // You can use libraries like jsforce or simple-oauth2 for OAuth authentication
//   // and the Salesforce REST API for sending leads
//   // Example:
// //   const jsforce = require('jsforce');
// //   const conn = new jsforce.Connection({/* Salesforce connection options */});
// //   conn.login(username, password, (err, userInfo) => {
// //     if (err) { return console.error(err); }
// //     conn.sobject('Lead').create(leadData, (err, ret) => {
// //       if (err || !ret.success) { return console.error(err || ret); }
// //       console.log('Leads sent to Salesforce');
// //     });
// //   });
// }







const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  // Read the leads data from the leads.json file
  const filePath = path.join(__dirname, '..', 'data', 'leads.json');
  try {
    const fileData = await fs.promises.readFile(filePath);
    const jsonData = JSON.parse(fileData);
    return res.json(jsonData);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
