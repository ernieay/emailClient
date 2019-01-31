const rp = require('request-promise-native');
// HUGE NO NO
// normally keys do NOT belong in source code. But i didn't feel like
// creating a delivery pipeline just to hide this text. Don't spam me 
// please.
const mailgunKey = 'c95a22d2cb1ebef70a43bf3806acaa53-c8c889c9-854176e3';
const mailgunDomain = 'sandbox8d0f0616efc740b9aa56ce59b2b470c2.mailgun.org';
const mailgunUrl = `https://api.mailgun.net/v3/${mailgunDomain}/messages`


function sendEmail(emailProperties) {
    const body = {
        from: emailProperties.from,
        to: emailProperties.to,
        cc: emailProperties.cc,
        bcc: emailProperties.bcc,
        subject: emailProperties.subject,
        text: emailProperties.message
    };

    const options = {
        auth: {
            user: `api`,
            password: mailgunKey
        },
        method: 'POST',
        uri: mailgunUrl,
        form: body
    }
    return rp(options)
        .catch(err => Promise.reject(err)); //can handle different error codes here if you like
}

module.exports.sendEmail = sendEmail;
