// salesforce.js
const jsforce = require('jsforce');

const conn = new jsforce.Connection({
    oauth2: {
        loginUrl: process.env.SF_LOGIN_URL, // Assuming you have SF_LOGIN_URL in your .env file
        clientId: process.env.SF_CLIENT_ID,
        clientSecret: process.env.SF_CLIENT_SECRET,
        redirectUri: process.env.SF_REDIRECT_URI
    }
});

function getAccessToken() {
    return new Promise((resolve, reject) => {
        conn.login(process.env.SF_USERNAME, process.env.SF_PASSWORD, function(err, userInfo) {
            if (err) { return reject(err); }
            console.log(conn);
            resolve(conn.accessToken);
        });
    });
}

module.exports = { getAccessToken };
