const should = require('chai').should();
const helper = require('../webServerHelper');

describe('Helper', function () {

    it('should fail if missing required fields', function () {
        helper.requiredFieldsPresent({}).should.be.false;
        helper.requiredFieldsPresent({ to: "exists" }).should.be.false;
    });

    it('should succeed if has all required fields', function () {
        helper.requiredFieldsPresent({ to: "exists", from: "exists", subject: "exists", message: "exists" }).should.be.true;
    });

    it('should fail if to emails are invalid', function () {
        helper.emailsOkay({ to: ["badmeail"] }).should.be.false;
    });
    //etc
});