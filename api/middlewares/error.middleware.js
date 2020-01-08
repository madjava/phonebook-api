const PhonebookError = require('../errors/phonebook.error');

function errorLogger(err, req, res, next) {
    if (err.message) {
        console.log('Logger: ', err.message);
    }
    if (err.stack) {
        console.log(err.stack);
    }
    next();
}

function phonebookError(err, req, res, next) {
    if (err instanceof PhonebookError) {
        res.status(err.statusCode).send(err.message);
    }
    next();
}

function genericErrors(err, req, res, next) {
    res.sendStatus(500);
}

module.exports = function ErrorMiddleWare(app) {
    app.use([
        errorLogger,
        phonebookError,
        genericErrors
    ]);
}