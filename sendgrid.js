const rp = require('request-promise-native');

// this is equally as bad (see mailgun.js comments)
const sendgridkey = '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';
const sendgridurl = 'https://api.sendgrid.com/v3/mail/send';

const TO_INDEX = 0;

function createEmailArray(emails) {
    const tempArray = [];
    emails.forEach(email => tempArray.push({ "email": email }))
    return tempArray;
}

function sendEmail(emailProperties) {
    const body = {
        "personalizations": [
            { "to": [] }
        ],
        "from": { "email": emailProperties.from },
        "subject": emailProperties.subject,
        "content": [{ "type": "text/plain", "value": emailProperties.message }]
    };

    body.personalizations[TO_INDEX].to = createEmailArray(emailProperties.to);

    if (emailProperties.cc && emailProperties.cc.length > 0) {
        body.personalizations[TO_INDEX].cc = createEmailArray(emailProperties.cc);
    }

    if (emailProperties.bcc && emailProperties.bcc.length > 0) {
        body.personalizations[TO_INDEX].bcc = createEmailArray(emailProperties.bcc);
    }
    
    const options = {
        method: 'POST',
        uri: sendgridurl,
        body: body,
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sendgridkey}`
        }
    }
    return rp(options)
        .catch(err => Promise.reject(err)); //can handle different error codes here if you like
}

module.exports.sendEmail = sendEmail;