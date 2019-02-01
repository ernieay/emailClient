
// stolen from stack Overflow, where all good code is stolen
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validateEmailArray(emails) {
    emails.forEach(toEmail => {
        if (!validateEmail(toEmail)) {
            return false;
        }
    })
    return true;
}

function emailsOkay(emailProperties) {
    if (!validateEmailArray(emailProperties.to)) {
        return false;
    }

    if (emailsOkay.cc && !validateEmailArray(emailProperties.cc)) {
        return false
    }

    if (emailsOkay.bcc && !validateEmailArray(emailProperties.bcc)) {
        return false
    }

    if (!validateEmail(emailProperties.from)) {
        return false;
    }

    return true;
}

function requiredFieldsPresent(input) {
    //required: to, from, subject, message
    if (!input.to || !input.from || !input.subject || !input.message) {
        return false;
    }

    return true;
}

function turnToArray(argument){
    return Array.isArray(argument) ? argument : [argument];
}

module.exports.emailsOkay = emailsOkay;
module.exports.requiredFieldsPresent = requiredFieldsPresent;
module.exports.turnToArray = turnToArray;