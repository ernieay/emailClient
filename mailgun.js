const rp = require('request-promise-native');

const mailgunKey = process.env.MAILGUN;
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
