const should = require('chai').should();
const sinon = require('sinon');
const email = require('../email.js');
const sendGrid = require('../sendgrid.js');
const mailgun = require('../mailgun.js');

describe('Email', function () {

    it('should reject if too many tries', function (done) {
        email.sendEmail({}, 1, 1000)
            .then(() => {
                should.fail();
                done();
            })
            .catch(err => {
                err.should.equal(err, "No clients available");
                done();
            })
    });

    it('should send email again if first one failed', function (done) {
        const stub1 = sinon.stub(sendGrid, "sendEmail");
        stub1.returns(Promise.resolve("Success"));

        const stub2 = sinon.stub(mailgun, "sendEmail");
        stub2.returns(Promise.resolve("Success"));

        email.sendEmail({}, 0, 1)
            .then((success) => {
                success.should.equal("Success");
                done();
            })
            .catch(err => {
                should.fail();
                done();
            })
    });


});