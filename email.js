const mailgun = require('./mailgun.js');
const sendgrid = require('./sendgrid');

const MAX_TRIES = 2;

const emailClients = [];
emailClients.push(mailgun);
emailClients.push(sendgrid);

// send email handles the internal routing. Ideally you could push
// email requests into a separate queue for each email client
// and have workers asynchronously do jobs. But that's probably outside
// the scope of this assignment
function sendEmail(emailProperties, start, count) {

    // if we've tried all the clients (or all we're allowed to retry) then we give up    
    if (start !== undefined && count >= MAX_TRIES) {
        return Promise.reject("No clients available");
    }

    // first attempt doesn't have a start or count
    if (start === undefined && !count) {
        // chooses a random client to attempt first
        const thisStart = Math.floor(Math.random() * emailClients.length);
        return emailClients[thisStart].sendEmail(emailProperties)
            // if the first client doesn't work, send it down the rabbit hole
            .catch(err => sendEmail(emailProperties, thisStart, 1));
    } else {
        // not this email's first rodeo...
        const nextClient = (start + count) % emailClients.length
        return emailClients[nextClient].sendEmail(emailProperties)
            .catch(err => sendEmail(emailProperties, start, ++count));
    }
}

module.exports.sendEmail = sendEmail;