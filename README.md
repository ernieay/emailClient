# emailClient

## Problem and Solution
This email client is designed to give an abstraction to at least 2 email clients so that emails can be sent through one interface, and to provide High-Availabiliy in case one of the clients go down or are unavailable.

We achieve this by creating a webserver that will take POST requests in x-www-form-urlencoded format. Fields that can be supplied multiple values (eg "to", if you need to send the email to more than one person) can be supplied multiple times.

## Running the solution
1. Download the source and run `npm install` to get all the packages
2. set MAILGUN and SENDGRID env variables to keys that work (get them yourself!)
3. `npm run start` to start the webserver, then send POST messages to localhost:3000/email
4. `npm run test` to kick off unit tests.

## The cloud app
Send POST requests to `https://stormy-shelf-84187.herokuapp.com/email` with the body containing x-www-form-urlencoded data with "to", "from", "subject" and "message" fields ("cc" and "bcc" are optional). If successful, should return 200 with a message echoing the subject back.

## Discussion
The code is littered with comments outlining the design choices made. I've (hopefully) compiled them all here for your easy perusal.

### File Breakdown and Architecture
The project is split into the webserver (index.js), the email abstraction, the email clients and the helper files. The email abstraction layer was introduced to demonstrate testability, but also splits out the client-choosing logic away from the webserver, which is responsible chiefly with requests and responses. Each client has its own file, and the email abstraction is designed in such a way that new clients can be easily added.

Additionally, these could be further split up into publisher/subscriber microservices to better handle scaling demand.

Only email.js and the webserverhelper file have unit tests as these were easiest due to them not interfacing directly with any external resources. These have been written nominally and not-exhaustively just to prove I know how to do it. System tests could be written to exercise the whole code.

Ideally, I would have made this project completely serverless; deployed via AWS lambdas with AWS api gateway in front. A serverless architecture would be much more scalable and easier to deploy/maintain. However, after clarifying the spec I was told the task was to create a web server in Node and that deployment was secondary.

### Client choosing algorithm
The client to service the email request is chosen at random. The Mailgun client never works as I don't have a domain that I can register to it (the sandbox it provides you needs a whitelist, and if I could foresee what email you were going to use I probably wouldn't use my clairvoyance for Software Engineering!), which means you will experience failover about 50% of the time. This does mean that in the bad case, users will experience some delay half the time as the server attempts both clients before sending the email. This is better than say using a Primary-Secondary HA solution which might cause users lagging 100% of the time.

### Validation and Errors
Some attempt has been made to handle validation, but some (for example maximum email list size, message validation, etc) has been left out due to time constraints. These can either be handled during the input validation sections, or else the errors from the clients could be bubbled up to the user and handled within the client files (I've left a comment where this would be appropriate). Validation errors are returned as 400.

Server (500) errors are otherwise abstracted from the user - eg if both clients fail for whatever reason, at the moment the user is just told that no clients are available.

Errors are logged to file using a logging framework.

### Credentials
API keys are retrieved via environment variables which are set in the "production" deployment environment.

### ES6
My version of node (I run 10.15.1) at home doesn't support Import and Export statements. I've otherwise tried to adhere to ES6 as much as I can.