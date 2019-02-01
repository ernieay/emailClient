const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./logger');
const app = express();
const port = process.env.PORT ? process.env.PORT : 3000;

const email = require('./email.js');
const helper = require('./webServerHelper');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/email', (req, res) => {

    if (!helper.requiredFieldsPresent(req.body)) {
        res.status(400).send("TO, FROM, SUBJECT and MESSAGE are mandatory fields");
        logger.log(req, 'error');
        return;
    }

    // wrapped up all the arguments in an object, except then its
    // not super obvious what's being sent around. That's the downside to a non-typed
    // language I guess
    const emailProperties = {
        from: req.body.from,
        subject: req.body.subject,
        message: req.body.message
    }

    emailProperties.to = helper.turnToArray(req.body.to);

    if (req.body.cc) {
        emailProperties.cc = helper.turnToArray(req.body.cc);
    }

    if (req.body.bcc) {
        emailProperties.bcc = helper.turnToArray(req.body.bcc);
    }

    if (!helper.emailsOkay(emailProperties)) {
        res.status(400).send("One of your emails isn't an email");
        logger.log(req, 'error');
        return;
    }

    email.sendEmail(emailProperties)
        .then(() => {
            res.send(`"${req.body.subject}" email sent!`);
            logger.log(req, 'info');
        })
        .catch(err => {
            logger.log(req, 'error');
            res.status(500).send(err.toString())
        });
});

app.listen(port, () => console.log(`Email app listening on port ${port}!`));
